import asyncio
from langchain_community.document_loaders import PlaywrightURLLoader

async def test_playwright_loader():
    print("Testing Playwright URL Loader with a simple webpage...")
    
    # Using a simple public webpage
    test_url = "https://httpbin.org/html"
    
    print(f"Testing with URL: {test_url}")
    
    try:
        # Using PlaywrightURLLoader to render JavaScript-heavy pages
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