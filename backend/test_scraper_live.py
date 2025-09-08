import asyncio
import sys
import os
from dotenv import load_dotenv

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

from job_scraper import JobScraper

async def test_live_scraping():
    """Test the job scraper with a live job posting"""
    print("Testing Job Scraper with Live Job Posting...")
    
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
    
    # Using a real public job posting URL
    # Let's use a sample LinkedIn job URL (we'll need to find a real one)
    # For now, let's use a real public job posting URL
    live_url = "https://www.linkedin.com/jobs/view/software-engineer-at-microsoft-3727352794/"
    
    print(f"Testing with URL: {live_url}")
    
    try:
        job_data = await job_scraper.extract_job_data(live_url)
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
        # Try with a different URL
        print("Trying with a different URL...")
        alternative_url = "https://www.indeed.com/viewjob?jk=5e94ac335d70f4fd&tk=1hule5u2r31fq000&from=serp&vjs=3"
        print(f"Testing with alternative URL: {alternative_url}")
        try:
            job_data = await job_scraper.extract_job_data(alternative_url)
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
        except Exception as e2:
            print(f"Error extracting job data with alternative URL: {e2}")
            return False

async def main():
    """Run the live scraping test"""
    print("Running live job scraping test...")
    success = await test_live_scraping()
    
    if success:
        print("\nLive scraping test completed successfully!")
        return True
    else:
        print("\nLive scraping test failed!")
        return False

if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)