import dropbox
import json

print("=== 🔁 Dropbox Refresh Token Generator ===\n")

num_accounts = int(input("كم عدد الحسابات التي تريد إضافتها؟ "))

tokens_data = {}

for i in range(1, num_accounts + 1):
    print(f"\n=== الحساب رقم {i} ===")
    APP_KEY = input("App key: ").strip()
    APP_SECRET = input("App secret: ").strip()

    # بدء عملية المصادقة
    auth_flow = dropbox.DropboxOAuth2FlowNoRedirect(
        APP_KEY,
        APP_SECRET,
        token_access_type="offline"  # مهم جدًا للحصول على refresh token
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

# حفظها في ملف JSON
with open("tokens.json", "w", encoding="utf-8") as f:
    json.dump(tokens_data, f, indent=4)

print("\n🎉 تم حفظ كل التوكنات في ملف tokens.json بنجاح ✅")
