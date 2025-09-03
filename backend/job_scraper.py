import os
import asyncio
from typing import Dict, Optional
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

class JobScraper:
    def __init__(self):
        # Set user agent for web scraping
        os.environ["USER_AGENT"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        
        # Initialize Groq LLM
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama3-70b-8192"
        )
        
        # Initialize prompt template for job extraction
        self.extract_prompt = PromptTemplate.from_template(
            """
            ### SCRAPED DATA FROM WEBSITE:
            {page_data}
            
            The scraped text is from the careers page of a website.
            Your job is to extract the job posting information and return it in JSON format containing the following keys:
            - 'role': The job title/position
            - 'company': The company name
            - 'description': A brief description of the role (2-3 sentences)
            - 'skills': An array of required skills and technologies
            - 'experience': Required experience level (if mentioned)
            - 'location': Job location (if mentioned)
            
            Important: Only return valid JSON without any preamble or additional text.
            If any field is not found, use an empty string or empty array as appropriate.
            
            ### VALID JSON (NO PREAMBLE):
            """
        )
        
        # Initialize JSON parser
        self.json_parser = JsonOutputParser()
        
        # Create extraction chain
        self.extraction_chain = self.extract_prompt | self.llm

    def test_connection(self) -> str:
        """Test if the scraper service is working"""
        try:
            # Test with a simple prompt
            test_response = self.llm.invoke("Hello")
            return "online" if test_response else "offline"
        except Exception as e:
            print(f"Scraper test failed: {e}")
            return "offline"

    async def extract_job_data(self, url: str) -> Optional[Dict]:
        """Extract job data from a given URL"""
        try:
            # Load the webpage
            loader = WebBaseLoader(url)
            page_data = loader.load()
            
            if not page_data:
                raise Exception("Unable to load webpage content")
            
            page_content = page_data[0].page_content
            
            if not page_content or len(page_content.strip()) < 100:
                raise Exception("Insufficient content found on the webpage")
            
            # Extract job information using LLM
            response = await asyncio.to_thread(
                self.extraction_chain.invoke,
                {"page_data": page_content}
            )
            
            # Parse JSON response
            job_data = self.json_parser.parse(response.content)
            
            # Validate and clean the extracted data
            cleaned_data = self._clean_job_data(job_data)
            
            return cleaned_data
            
        except Exception as e:
            print(f"Error in extract_job_data: {str(e)}")
            raise Exception(f"Failed to extract job data: {str(e)}")

    def _clean_job_data(self, raw_data: Dict) -> Dict:
        """Clean and validate extracted job data"""
        cleaned = {
            "role": str(raw_data.get("role", "")).strip(),
            "company": str(raw_data.get("company", "")).strip(),
            "description": str(raw_data.get("description", "")).strip(),
            "skills": [],
            "experience": str(raw_data.get("experience", "")).strip(),
            "location": str(raw_data.get("location", "")).strip()
        }
        
        # Handle skills array
        skills_raw = raw_data.get("skills", [])
        if isinstance(skills_raw, list):
            cleaned["skills"] = [str(skill).strip() for skill in skills_raw if str(skill).strip()]
        elif isinstance(skills_raw, str):
            # Split string skills by common delimiters
            skills_list = str(skills_raw).replace(",", "|").replace(";", "|").replace("•", "|").split("|")
            cleaned["skills"] = [skill.strip() for skill in skills_list if skill.strip()]
        
        # Ensure minimum required fields
        if not cleaned["role"]:
            cleaned["role"] = "Position Not Specified"
        if not cleaned["company"]:
            cleaned["company"] = "Company Not Specified"
        if not cleaned["description"]:
            cleaned["description"] = "Job description not available"
        if not cleaned["skills"]:
            cleaned["skills"] = ["Skills not specified"]
            
        return cleaned
