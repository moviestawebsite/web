import dropbox
import json
import os

print("=== 🔁 Dropbox Refresh Token Generator ===\n")

# 🔹 تحديد مكان ملف التوكنات
file_path = r"D:\Documents\My Programming Projects\Html\Movie\data\base\tokens.json"

# 🔹 تحميل البيانات القديمة لو الملف موجود
if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        tokens_data = json.load(f)
else:
    tokens_data = {}

# 🔹 إدخال الحسابات الجديدة
num_accounts = int(input("كم عدد الحسابات التي تريد إضافتها؟ "))

start_index = len(tokens_data) + 1  # يبدأ بعد آخر حساب محفوظ

for i in range(start_index, start_index + num_accounts):
    print(f"\n=== الحساب رقم {i} ===")
    APP_KEY = input("App key: ").strip()
    APP_SECRET = input("App secret: ").strip()

    auth_flow = dropbox.DropboxOAuth2FlowNoRedirect(
        APP_KEY, APP_SECRET, token_access_type="offline"
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
        "ACCOUNT_ID": oauth_result.account_id,
    }

    print("\n✅ تم إنشاء التوكنات بنجاح للحساب رقم", i)
    print("Access Token:", oauth_result.access_token)
    print("Refresh Token:", oauth_result.refresh_token)
    print("Account ID:", oauth_result.account_id)

# 🔹 حفظ البيانات الجديدة مدموجة مع القديمة
with open(file_path, "w", encoding="utf-8") as f:
    json.dump(tokens_data, f, indent=4, ensure_ascii=False)

print(f"\n🎉 تم تحديث الملف بنجاح وحفظ كل الحسابات في: {file_path} ✅")
