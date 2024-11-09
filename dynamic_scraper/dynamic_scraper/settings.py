# Enable the Playwright middleware
DOWNLOADER_MIDDLEWARES = {
    "scrapy_playwright.downloadermiddlewares.PlaywrightMiddleware": 543,
}

# Enable Playwright for Scrapy
PLAYWRIGHT_BROWSER_TYPE = "chromium"  # You can also use 'firefox' or 'webkit'

# Set up the Playwright download handler
DOWNLOAD_HANDLERS = {
    "http": "scrapy_playwright.handler.PlaywrightDownloadHandler",
    "https": "scrapy_playwright.handler.PlaywrightDownloadHandler",
}

# Playwright settings (optional)
PLAYWRIGHT_LAUNCH_OPTIONS = {
    "headless": True,  # You can set this to False for debugging to see the browser window
    "slowMo": 50,  # Slow down the browser for debugging
}
