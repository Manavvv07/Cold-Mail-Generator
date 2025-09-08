import asyncio
import sys
import os
from dotenv import load_dotenv

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

from job_scraper import JobScraper

async def test_job_scraper_with_github():
    """Test the job scraper with GitHub careers page"""
    print("Testing Job Scraper with GitHub Careers Page...")
    
    # Initialize the job scraper
    try:
        job_scraper = JobScraper()
        print("Job Scraper initialized successfully")
    except Exception as e:
        print(f"Failed to initialize Job Scraper: {e}")
        return False
    
    # Test connection
    try:
        status = job_scraper.test_connection()
        print(f"Job Scraper Connection Status: {status}")
        if status != "online":
            print("Job Scraper is not online. Cannot proceed with live test.")
            return False
    except Exception as e:
        print(f"Error testing connection: {e}")
        return False
    
    # Test with GitHub careers page
    test_url = "https://github.com/about/careers"
    
    print(f"Testing with URL: {test_url}")
    
    try:
        job_data = await job_scraper.extract_job_data(test_url)
        if job_data:
            print("Successfully extracted job data:")
            print(f"Role: {job_data.get('role', 'N/A')}")
            print(f"Company: {job_data.get('company', 'N/A')}")
            print(f"Location: {job_data.get('location', 'N/A')}")
            print(f"Experience: {job_data.get('experience', 'N/A')}")
            print(f"Skills: {job_data.get('skills', 'N/A')}")
            print(f"Description: {job_data.get('description', 'N/A')}")
            return True
        else:
            print("Failed to extract job data - returned None")
            return False
    except Exception as e:
        print(f"Error extracting job data: {e}")
        return False

async def main():
    """Run the job scraper test"""
    print("Running job scraper test with GitHub careers page...")
    success = await test_job_scraper_with_github()
    
    if success:
        print("\nJob scraper test completed successfully!")
        return True
    else:
        print("\nJob scraper test failed!")
        return False

if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)