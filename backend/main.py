import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl, field_validator
from typing import List, Optional
import re
import asyncio
from dotenv import load_dotenv

# Import our existing modules
from email_service import EmailService
from job_scraper import JobScraper

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Cold Mail Generator API",
    description="AI-powered cold email generator that extracts job data and creates personalized emails",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
email_service = EmailService()
job_scraper = JobScraper()

# Pydantic models for request/response validation
class JobUrlRequest(BaseModel):
    url: HttpUrl

class PersonalInfo(BaseModel):
    name: str
    email: str
    skills: str
    portfolio: Optional[HttpUrl] = None
    phone: Optional[str] = None
    linkedin: Optional[HttpUrl] = None
    github: Optional[HttpUrl] = None
    experience: Optional[str] = None
    location: Optional[str] = None

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email format')
        return v

    @field_validator('skills')
    @classmethod
    def validate_skills(cls, v):
        if len(v.strip()) < 10:
            raise ValueError('Skills description must be at least 10 characters long')
        return v.strip()

class JobData(BaseModel):
    role: str
    company: str
    description: str
    skills: List[str]
    experience: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    remote: Optional[bool] = None
    jobType: Optional[str] = None

class EmailGenerationRequest(BaseModel):
    jobData: JobData
    personalInfo: PersonalInfo

class EmailResponse(BaseModel):
    subject: str
    content: str
    confidence_score: Optional[float] = None
    suggestions: Optional[List[str]] = None
    personalization_level: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    message: str
    services: dict

# API Routes
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Cold Mail Generator API is running"}

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint to verify all services are working"""
    try:
        # Test email service
        email_service_status = email_service.test_connection()
        
        # Test job scraper
        scraper_status = job_scraper.test_connection()
        
        return HealthResponse(
            status="healthy",
            message="All services are operational",
            services={
                "email_service": email_service_status,
                "job_scraper": scraper_status,
                "api": "online"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service health check failed: {str(e)}")

@app.post("/api/extract-job", response_model=JobData, tags=["Job Processing"])
async def extract_job_data(request: JobUrlRequest):
    """Extract job information from a job posting URL"""
    try:
        # Extract job data using our scraper
        job_data = await job_scraper.extract_job_data(str(request.url))
        
        if not job_data:
            raise HTTPException(status_code=400, detail="Unable to extract job data from the provided URL")
        
        return JobData(**job_data)
    
    except Exception as e:
        print(f"Error extracting job data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to extract job data: {str(e)}")

@app.post("/api/generate-email", response_model=EmailResponse, tags=["Email Generation"])
async def generate_cold_email(request: EmailGenerationRequest):
    """Generate a personalized cold email based on job data and personal information"""
    try:
        # Generate email using our email service
        email_result = await email_service.generate_email(
            job_data=request.jobData.model_dump(),
            personal_info=request.personalInfo.model_dump()
        )
        
        if not email_result:
            raise HTTPException(status_code=500, detail="Failed to generate email")
        
        return EmailResponse(**email_result)
    
    except Exception as e:
        print(f"Error generating email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate email: {str(e)}")

@app.get("/api/supported-sites", tags=["Information"])
async def get_supported_sites():
    """Get list of supported job sites"""
    return {
        "supported_sites": [
            "LinkedIn",
            "Indeed", 
            "Glassdoor",
            "AngelList",
            "Company Career Pages",
            "Stack Overflow Jobs",
            "Remote.co",
            "We Work Remotely"
        ]
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "An unexpected error occurred",
            "status_code": 500
        }
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )