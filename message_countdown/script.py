from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Change this to the contact or group name (must match WhatsApp exactly)
contact_name = "Test"

# Calculate days left until July 7th
today = datetime.now()
target_date = datetime(today.year, 7, 7)
if target_date < today:
    target_date = datetime(today.year + 1, 7, 7)
days_left = (target_date - today).days

# Message
message = f"There are {days_left} days left until July 7th 🎉"

# Path to your ChromeDriver
chromedriver_path = "/home/bengo/Downloads/chrome-linux64"

# Start browser
options = webdriver.ChromeOptions()
options.add_argument("--user-data-dir=./User_Data")  # So you don’t need to scan QR every time
from selenium.webdriver.chrome.service import Service

service = Service(executable_path=chromedriver_path)
driver = webdriver.Chrome(service=service, options=options)


# Open WhatsApp Web
driver.get("https://web.whatsapp.com")
print("Scan the QR code if needed...")

# Wait for page to load
input("Press ENTER after WhatsApp Web is ready and you see your chats: ")

# Find the contact
search_box = driver.find_element(By.XPATH, "//div[@contenteditable='true'][@data-tab='3']")
search_box.click()
search_box.send_keys(contact_name)
time.sleep(2)
search_box.send_keys(Keys.ENTER)

# Type and send the message
msg_box = driver.find_element(By.XPATH, "//div[@contenteditable='true'][@data-tab='10']")
msg_box.send_keys(message)
msg_box.send_keys(Keys.ENTER)

print("Message sent!")

# Optional: keep browser open
# time.sleep(10)
# driver.quit()
