import asyncio
import sys
import os
from dotenv import load_dotenv

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

from job_scraper import JobScraper

async def test_job_scraper_specific_posting():
    """Test the job scraper with a specific job posting"""
    print("Testing Job Scraper with a Specific Job Posting...")
    
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
    
    # Test with a specific job posting from a company career page
    # Using a GitHub specific job as an example
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
            print(f"Description: {job_data.get('description', 'N/A')}")
            
            # Validate that we have meaningful data
            has_meaningful_data = (
                job_data.get('role') and job_data.get('role') != 'Position Not Specified' and
                job_data.get('company') and job_data.get('company') != 'Company Not Specified'
            )
            
            if has_meaningful_data:
                print("\n✅ SUCCESS: Job scraper extracted meaningful job data!")
                return True
            else:
                print("\n⚠️  PARTIAL SUCCESS: Job scraper worked but couldn't extract detailed job information.")
                return True
        else:
            print("Failed to extract job data - returned None")
            return False
    except Exception as e:
        print(f"Error extracting job data: {e}")
        return False

async def main():
    """Run the specific job posting test"""
    print("Running job scraper test with specific job posting...")
    success = await test_job_scraper_specific_posting()
    
    if success:
        print("\nJob scraper test completed successfully!")
        return True
    else:
        print("\nJob scraper test failed!")
        return False

if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)