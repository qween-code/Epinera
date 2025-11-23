
from playwright.sync_api import Page, expect, sync_playwright

def verify_homepage(page: Page):
    # 1. Navigate to homepage
    page.goto("http://localhost:3000")

    # 2. Wait for key elements
    # Check for the Navbar Logo
    expect(page.get_by_text("EPINERA")).to_be_visible(timeout=10000)

    # Check for the Hero Text
    expect(page.get_by_text("Geleceğin Pazar Yeri")).to_be_visible()

    # Check for the Live Ticker (Wait for animation/element presence)
    expect(page.get_by_text("Canlı Satışlar")).to_be_visible()

    # 3. Screenshot
    page.screenshot(path="/home/jules/verification/homepage.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_homepage(page)
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()
