import asyncio
import sys
import os

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from email_service import EmailService
from job_scraper import JobScraper

async def test_email_service():
    """Test the email service"""
    print("Testing Email Service...")
    try:
        email_service = EmailService()
        status = email_service.test_connection()
        print(f"Email Service Status: {status}")
        return status == "online"
    except Exception as e:
        print(f"Email Service Error: {e}")
        return False

async def test_job_scraper():
    """Test the job scraper"""
    print("Testing Job Scraper...")
    try:
        job_scraper = JobScraper()
        status = job_scraper.test_connection()
        print(f"Job Scraper Status: {status}")
        return status == "online"
    except Exception as e:
        print(f"Job Scraper Error: {e}")
        return False

async def main():
    """Run all tests"""
    print("Running component tests...")
    
    email_ok = await test_email_service()
    scraper_ok = await test_job_scraper()
    
    if email_ok and scraper_ok:
        print("\nAll components are working correctly!")
        return True
    else:
        print("\nSome components failed!")
        return False

if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)