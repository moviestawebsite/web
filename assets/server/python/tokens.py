import dropbox
import json
import os

print("=== Dropbox Refresh Token Generator ===\n")

file_path = r"D:\Documents\My Programming Projects\Html\Movie\data\base\tokens.json"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        tokens_data = json.load(f)
else:
    tokens_data = {}

num_accounts = int(input("How many accounts do you want to add? "))

start_index = len(tokens_data) + 1

for i in range(start_index, start_index + num_accounts):
    print(f"\n=== Account {i} ===")
    APP_KEY = input("App key: ").strip()
    APP_SECRET = input("App secret: ").strip()

    auth_flow = dropbox.DropboxOAuth2FlowNoRedirect(
        APP_KEY, APP_SECRET, token_access_type="offline"
    )

    authorize_url = auth_flow.start()
    print("\n1️⃣ Open this link in your browser and log in:")
    print(authorize_url)
    print("2️⃣ Click 'Allow' and copy the code shown.\n")

    auth_code = input("Enter the code here: ").strip()
    oauth_result = auth_flow.finish(auth_code)

    tokens_data[f"Account_{i}"] = {
        "APP_KEY": APP_KEY,
        "APP_SECRET": APP_SECRET,
        "ACCESS_TOKEN": oauth_result.access_token,
        "REFRESH_TOKEN": oauth_result.refresh_token,
        "ACCOUNT_ID": oauth_result.account_id,
    }

    print(f"\n✅ Tokens created successfully for Account {i}")
    print("Access Token:", oauth_result.access_token)
    print("Refresh Token:", oauth_result.refresh_token)
    print("Account ID:", oauth_result.account_id)

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(tokens_data, f, indent=4, ensure_ascii=False)

print(f"\n🎉 All tokens saved successfully in: {file_path}")
