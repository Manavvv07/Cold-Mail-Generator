import asyncio
import sys
import os
from dotenv import load_dotenv

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

from job_scraper import JobScraper

async def test_job_scraper_comprehensive():
    """Comprehensive test of the job scraper with multiple URLs"""
    print("Testing Job Scraper with Multiple URLs...")
    
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
    
    # Test URLs - a mix of job-related pages
    test_urls = [
        {
            "name": "GitHub Careers Page",
            "url": "https://github.com/about/careers",
            "expected": True
        },
        {
            "name": "Google Careers Page",
            "url": "https://www.google.com/about/careers/",
            "expected": True
        },
        {
            "name": "Microsoft Careers Page",
            "url": "https://careers.microsoft.com/us/en",
            "expected": True
        }
    ]
    
    results = []
    
    for test_case in test_urls:
        name = test_case["name"]
        url = test_case["url"]
        expected = test_case["expected"]
        
        print(f"\n--- Testing {name} ---")
        print(f"URL: {url}")
        
        try:
            job_data = await job_scraper.extract_job_data(url)
            if job_data:
                print("Successfully extracted job data:")
                print(f"Role: {job_data.get('role', 'N/A')}")
                print(f"Company: {job_data.get('company', 'N/A')}")
                print(f"Location: {job_data.get('location', 'N/A')}")
                print(f"Experience: {job_data.get('experience', 'N/A')}")
                print(f"Skills: {job_data.get('skills', 'N/A')}")
                print(f"Description: {job_data.get('description', 'N/A')[:100]}...")
                results.append({"name": name, "success": True, "error": None})
            else:
                error_msg = "Failed to extract job data - returned None"
                print(error_msg)
                results.append({"name": name, "success": False, "error": error_msg})
        except Exception as e:
            error_msg = f"Error extracting job data: {e}"
            print(error_msg)
            results.append({"name": name, "success": False, "error": error_msg})
    
    # Print summary
    print("\n--- Test Summary ---")
    successful_tests = 0
    for result in results:
        status = "PASS" if result["success"] else "FAIL"
        print(f"{status}: {result['name']}")
        if not result["success"]:
            print(f"  Error: {result['error']}")
        if result["success"]:
            successful_tests += 1
    
    print(f"\nPassed: {successful_tests}/{len(results)} tests")
    
    return successful_tests > 0

async def main():
    """Run the comprehensive job scraper test"""
    print("Running comprehensive job scraper test...")
    success = await test_job_scraper_comprehensive()
    
    if success:
        print("\nComprehensive job scraper test completed with partial success!")
        return True
    else:
        print("\nAll job scraper tests failed!")
        return False

if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)