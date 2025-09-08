import asyncio
from langchain_community.document_loaders import PlaywrightURLLoader

async def test_playwright_loader():
    """
    Test the Playwright URL loader with a live job posting
    """
    print("Testing Playwright URL Loader with Live Job Posting...")
    
    # Using a real public job posting URL
    # Let's use a sample job URL from a public job board
    test_url = "https://www.indeed.com/viewjob?jk=5e94ac335d70f4fd&tk=1hule5u2r31fq000&from=serp&vjs=3"
    
    print(f"Testing with URL: {test_url}")
    
    try:
        # Using PlaywrightURLLoader to render JavaScript-heavy pages
        # It also removes common irrelevant sections like headers, footers, and navs.
        loader = PlaywrightURLLoader(
            urls=[test_url], 
            remove_selectors=["header", "footer", "nav", "script", "style"]
        )
        
        # Run the synchronous loader in a separate thread to avoid blocking asyncio
        page_data = await asyncio.to_thread(loader.load)
        
        if not page_data:
            print("Failed to load webpage content with Playwright")
            return False
            
        # The page content is the first (and only) document's content
        page_content = page_data[0].page_content
        print(f"Successfully loaded page content. Length: {len(page_content)} characters")
        
        # Print first 500 characters of the content
        print("First 500 characters of page content:")
        print(page_content[:500])
        
        return True
        
    except Exception as e:
        print(f"Error loading webpage: {e}")
        return False

async def main():
    """
    Run the Playwright loader test
    """
    print("Running Playwright loader test...")
    success = await test_playwright_loader()
    
    if success:
        print("\nPlaywright loader test completed successfully!")
        return True
    else:
        print("\nPlaywright loader test failed!")
        return False

if __name__ == "__main__":
    result = asyncio.run(main())
    exit(0 if result else 1)