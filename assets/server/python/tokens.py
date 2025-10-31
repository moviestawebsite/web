import dropbox
import json
import os

print("=== 🔁 Dropbox Refresh Token Generator ===\n")

num_accounts = int(input("كم عدد الحسابات التي تريد إضافتها؟ "))

tokens_data = {}

for i in range(1, num_accounts + 1):
    print(f"\n=== الحساب رقم {i} ===")
    APP_KEY = input("App key: ").strip()
    APP_SECRET = input("App secret: ").strip()

    auth_flow = dropbox.DropboxOAuth2FlowNoRedirect(
        APP_KEY,
        APP_SECRET,
        token_access_type="offline"
    )

    authorize_url = auth_flow.start()
    print("\n1️⃣ افتح هذا الرابط في المتصفح وسجّل الدخول:")
    print(authorize_url)
    print("2️⃣ اضغط 'Allow' ثم انسخ الكود الذي سيظهر لك.\n")

    auth_code = input("أدخل الكود هنا: ").strip()
    oauth_result = auth_flow.finish(auth_code)

    tokens_data[f"Account_{i}"] = {
        "APP_KEY": APP_KEY,
        "APP_SECRET": APP_SECRET,
        "ACCESS_TOKEN": oauth_result.access_token,
        "REFRESH_TOKEN": oauth_result.refresh_token,
        "ACCOUNT_ID": oauth_result.account_id
    }

    print("\n✅ تم إنشاء التوكنات بنجاح للحساب رقم", i)
    print("Access Token:", oauth_result.access_token)
    print("Refresh Token:", oauth_result.refresh_token)
    print("Account ID:", oauth_result.account_id)

# 🔸 تحديد مسار حفظ الملف داخل مجلد Movie\data\base
save_path = r"D:\Documents\My Programming Projects\Html\Movie\data\base"

# تأكد أن المجلد موجود
os.makedirs(save_path, exist_ok=True)

# 🔸 المسار النهائي للملف
file_path = os.path.join(save_path, "tokens.json")

# 🔸 حفظ البيانات
with open(file_path, "w", encoding="utf-8") as f:
    json.dump(tokens_data, f, indent=4, ensure_ascii=False)

print(f"\n🎉 تم حفظ كل التوكنات في الملف: {file_path} ✅")
