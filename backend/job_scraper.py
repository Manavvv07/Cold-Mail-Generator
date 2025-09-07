import os
import asyncio
from typing import Dict, Optional

# Updated imports: Using PlaywrightURLLoader instead of WebBaseLoader
from langchain_community.document_loaders import PlaywrightURLLoader
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

class JobScraper:
    def __init__(self):
        """
        Initializes the JobScraper with a Groq LLM and an enhanced prompt template.
        """
        # Set a standard user agent to avoid being blocked
        os.environ["USER_AGENT"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        
        # Initialize Groq LLM for fast and accurate extraction
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.1-8b-instant"  # Updated to a currently supported model
        )
        
        # ENHANCEMENT: Switched to a "few-shot" prompt with examples
        # This helps the AI better understand the desired output format for varied inputs.
        self.extract_prompt = PromptTemplate.from_template(
            """
            ### SCRAPED DATA FROM WEBSITE:
            {page_data}
            
            The scraped text is from a job posting. Your job is to extract the information and return it in JSON format.
            
            ### EXAMPLE 1:
            **Input:** "Senior Frontend Engineer at Google in Mountain View. Skills: React, TypeScript. 5 years experience required."
            **Output:** {{"role": "Senior Frontend Engineer", "company": "Google", "location": "Mountain View", "skills": ["React", "TypeScript"], "experience": "5 years"}}

            ### EXAMPLE 2:
            **Input:** "Acme Corp is hiring a Junior Dev. Must know JavaScript. This is a remote role."
            **Output:** {{"role": "Junior Dev", "company": "Acme Corp", "location": "Remote", "skills": ["JavaScript"], "experience": ""}}

            Based on the SCRAPED DATA FROM WEBSITE provided above, extract the job posting information into the following keys:
            - 'role': The job title/position
            - 'company': The company name
            - 'description': A brief description of the role (2-3 sentences)
            - 'skills': An array of required skills and technologies
            - 'experience': Required experience level (e.g., '5+ years', 'Entry Level')
            - 'location': Job location (e.g., 'San Francisco, CA', 'Remote')
            
            Important: Only return valid JSON without any preamble or additional text.
            If any field is not found, use an empty string or empty array as appropriate.
            
            ### VALID JSON (NO PREAMBLE):
            """
        )
        
        # Initialize JSON parser for the LLM output
        self.json_parser = JsonOutputParser()
        
        # Create the extraction chain by piping the components together
        self.extraction_chain = self.extract_prompt | self.llm

    def test_connection(self) -> str:
        """
        Tests the connection to the Groq LLM service.
        """
        try:
            test_response = self.llm.invoke("Hello")
            return "online" if test_response else "offline"
        except Exception as e:
            print(f"Scraper test failed: {e}")
            return "offline"

    async def extract_job_data(self, url: str) -> Optional[Dict]:
        """
        Extracts job data from a given URL using a headless browser for dynamic content.
        """
        try:
            # ENHANCEMENT: Using PlaywrightURLLoader to render JavaScript-heavy pages
            # It also removes common irrelevant sections like headers, footers, and navs.
            loader = PlaywrightURLLoader(
                urls=[url], 
                remove_selectors=["header", "footer", "nav", "script", "style"]
            )
            
            # Run the synchronous loader in a separate thread to avoid blocking asyncio
            page_data = await asyncio.to_thread(loader.load)
            
            if not page_data:
                raise Exception("Unable to load webpage content with Playwright")
            
            # The page content is the first (and only) document's content
            page_content = page_data[0].page_content
            
            # Basic validation to ensure we have enough content to process
            if not page_content or len(page_content.strip()) < 100:
                raise Exception("Insufficient content found on the webpage after cleaning.")
            
            # Invoke the LLM extraction chain
            response = await asyncio.to_thread(
                self.extraction_chain.invoke,
                {"page_data": page_content}
            )
            
            # Parse the JSON response from the LLM
            job_data = self.json_parser.parse(response.content)
            
            # Clean and validate the extracted data
            cleaned_data = self._clean_job_data(job_data)
            
            return cleaned_data
            
        except Exception as e:
            print(f"Error in extract_job_data for URL {url}: {str(e)}")
            # Re-raise the exception to be handled by the API endpoint
            raise Exception(f"Failed to extract job data: {str(e)}")

    def _clean_job_data(self, raw_data: Dict) -> Dict:
        """
        Cleans and validates the JSON data returned by the LLM.
        """
        cleaned = {
            "role": str(raw_data.get("role", "")).strip(),
            "company": str(raw_data.get("company", "")).strip(),
            "description": str(raw_data.get("description", "")).strip(),
            "skills": [],
            "experience": str(raw_data.get("experience", "")).strip(),
            "location": str(raw_data.get("location", "")).strip()
        }
        
        # Handle skills which might be a list or a string
        skills_raw = raw_data.get("skills", [])
        if isinstance(skills_raw, list):
            cleaned["skills"] = [str(skill).strip() for skill in skills_raw if str(skill).strip()]
        elif isinstance(skills_raw, str):
            # Split string skills by common delimiters
            skills_list = str(skills_raw).replace(",", "|").replace(";", "|").replace("•", "|").split("|")
            cleaned["skills"] = [skill.strip() for skill in skills_list if skill.strip()]
        
        # Ensure minimum required fields have fallback values
        if not cleaned["role"]:
            cleaned["role"] = "Position Not Specified"
        if not cleaned["company"]:
            cleaned["company"] = "Company Not Specified"
        if not cleaned["description"]:
            cleaned["description"] = "Job description not available"
        if not cleaned["skills"]:
            cleaned["skills"] = ["Skills not specified"]
            
        return cleaned