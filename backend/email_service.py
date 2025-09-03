import os
import asyncio
from typing import Dict, Optional
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        # Initialize Groq LLM
        self.llm = ChatGroq(
            temperature=0.3,  # Slightly more creative for email generation
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama3-70b-8192"
        )
        
        # Email generation prompt template
        self.email_prompt = PromptTemplate.from_template(
            """
            You are an expert cold email writer. Generate a professional, personalized cold email for a job application.
            
            ### JOB INFORMATION:
            Role: {role}
            Company: {company}
            Description: {description}
            Required Skills: {skills}
            Experience Level: {experience}
            Location: {location}
            
            ### APPLICANT INFORMATION:
            Name: {name}
            Email: {email}
            Skills & Experience: {applicant_skills}
            Portfolio: {portfolio}
            
            ### INSTRUCTIONS:
            1. Create a compelling subject line that mentions the specific role and company
            2. Write a professional cold email that:
               - Opens with a personalized greeting
               - Briefly mentions the specific role you're applying for
               - Highlights 2-3 most relevant skills/experiences that match the job requirements
               - Shows genuine interest in the company/role
               - Includes a clear call-to-action
               - Ends professionally
            3. Keep the email concise (200-300 words)
            4. Make it feel personal, not templated
            5. Match the tone to the company culture (if discernible from job posting)
            
            Return the result in JSON format with keys 'subject' and 'content'.
            Only return valid JSON without any preamble.
            
            ### VALID JSON (NO PREAMBLE):
            """
        )
        
        # Initialize JSON parser
        self.json_parser = JsonOutputParser()
        
        # Create email generation chain
        self.generation_chain = self.email_prompt | self.llm

    def test_connection(self) -> str:
        """Test if the email service is working"""
        try:
            # Test with a simple prompt
            test_response = self.llm.invoke("Test")
            return "online" if test_response else "offline"
        except Exception as e:
            print(f"Email service test failed: {e}")
            return "offline"

    async def generate_email(self, job_data: Dict, personal_info: Dict) -> Optional[Dict]:
        """Generate a personalized cold email"""
        try:
            # Prepare the prompt data
            prompt_data = {
                "role": job_data.get("role", ""),
                "company": job_data.get("company", ""),
                "description": job_data.get("description", ""),
                "skills": ", ".join(job_data.get("skills", [])),
                "experience": job_data.get("experience", ""),
                "location": job_data.get("location", ""),
                "name": personal_info.get("name", ""),
                "email": personal_info.get("email", ""),
                "applicant_skills": personal_info.get("skills", ""),
                "portfolio": personal_info.get("portfolio", "")
            }
            
            # Generate email using LLM
            response = await asyncio.to_thread(
                self.generation_chain.invoke,
                prompt_data
            )
            
            # Parse JSON response
            email_result = self.json_parser.parse(response.content)
            
            # Validate and enhance the result
            enhanced_result = self._enhance_email_result(email_result, job_data, personal_info)
            
            return enhanced_result
            
        except Exception as e:
            print(f"Error in generate_email: {str(e)}")
            raise Exception(f"Failed to generate email: {str(e)}")

    def _enhance_email_result(self, email_result: Dict, job_data: Dict, personal_info: Dict) -> Dict:
        """Enhance and validate email result"""
        # Ensure required fields exist
        subject = email_result.get("subject", "").strip()
        content = email_result.get("content", "").strip()
        
        # Generate fallback subject if missing
        if not subject:
            role = job_data.get("role", "Position")
            company = job_data.get("company", "Your Company")
            name = personal_info.get("name", "Candidate")
            subject = f"Application for {role} - {name}"
        
        # Generate fallback content if missing
        if not content:
            content = self._generate_fallback_email(job_data, personal_info)
        
        # Calculate a simple confidence score based on content quality
        confidence_score = self._calculate_confidence_score(subject, content, job_data, personal_info)
        
        return {
            "subject": subject,
            "content": content,
            "confidence_score": confidence_score
        }

    def _generate_fallback_email(self, job_data: Dict, personal_info: Dict) -> str:
        """Generate a fallback email if LLM fails"""
        role = job_data.get("role", "the position")
        company = job_data.get("company", "your company")
        name = personal_info.get("name", "")
        skills = personal_info.get("skills", "my relevant experience")
        
        return f"""Dear Hiring Manager,

I am writing to express my interest in the {role} position at {company}. 

{skills}

I am excited about the opportunity to contribute to your team and would welcome the chance to discuss how my background aligns with your needs.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
{name}"""

    def _calculate_confidence_score(self, subject: str, content: str, job_data: Dict, personal_info: Dict) -> float:
        """Calculate a confidence score for the generated email"""
        score = 0.0
        
        # Check if subject mentions company and role
        company = job_data.get("company", "").lower()
        role = job_data.get("role", "").lower()
        
        if company and company in subject.lower():
            score += 0.2
        if role and role in subject.lower():
            score += 0.2
            
        # Check content quality
        if len(content) > 100:
            score += 0.2
        if len(content) > 200:
            score += 0.1
            
        # Check if personal info is mentioned
        name = personal_info.get("name", "").lower()
        if name and name.lower() in content.lower():
            score += 0.2
            
        # Check if job skills are referenced
        job_skills = [skill.lower() for skill in job_data.get("skills", [])]
        content_lower = content.lower()
        skill_matches = sum(1 for skill in job_skills if skill in content_lower)
        if skill_matches > 0:
            score += min(0.1 * skill_matches, 0.3)
            
        return min(score, 1.0)
