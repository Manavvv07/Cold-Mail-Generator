import asyncio
import sys
import os
from dotenv import load_dotenv

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

from job_scraper import JobScraper

async def test_job_scraper_simple():
    """Simple test of the job scraper"""
    print("Testing Job Scraper Functionality...")
    
    # Initialize the job scraper
    try:
        job_scraper = JobScraper()
        print("[PASS] Job Scraper initialized successfully")
    except Exception as e:
        print(f"[FAIL] Failed to initialize Job Scraper: {e}")
        return False
    
    # Test connection
    try:
        status = job_scraper.test_connection()
        print(f"[INFO] Job Scraper Connection Status: {status}")
        if status != "online":
            print("[WARN] Job Scraper is not online. Cannot proceed with live test.")
            return False
    except Exception as e:
        print(f"[FAIL] Error testing connection: {e}")
        return False
    
    # Test with GitHub careers page
    test_url = "https://github.com/about/careers"
    
    print(f"Testing with URL: {test_url}")
    
    try:
        job_data = await job_scraper.extract_job_data(test_url)
        if job_data:
            print("\n--- EXTRACTED JOB DATA ---")
            print(f"Role: {job_data.get('role', 'N/A')}")
            print(f"Company: {job_data.get('company', 'N/A')}")
            print(f"Location: {job_data.get('location', 'N/A')}")
            print(f"Experience: {job_data.get('experience', 'N/A')}")
            print(f"Skills: {job_data.get('skills', 'N/A')}")
            # Print description without special characters
            desc = job_data.get('description', 'N/A')
            print(f"Description: {desc}")
            
            print("\n[PASS] SUCCESS: Job scraper is working correctly!")
            return True
        else:
            print("[FAIL] Failed to extract job data - returned None")
            return False
    except Exception as e:
        print(f"[FAIL] Error extracting job data: {e}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_job_scraper_simple())
    sys.exit(0 if result else 1)