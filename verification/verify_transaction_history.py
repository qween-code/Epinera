# verification/verify_transaction_history.py

from playwright.sync_api import sync_playwright

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            # Navigate to the history page
            page.goto("http://localhost:3000/history")
            page.wait_for_selector("text=Transaction History")

            # Capture a screenshot
            page.screenshot(path="verification/transaction-history-page.png")

            print("Successfully verified the Transaction History page.")

        except Exception as e:
            print(f"An error occurred: {e}")

        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()
