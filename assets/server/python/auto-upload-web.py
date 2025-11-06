from ftplib import FTP
import os
import time

# إعداد بيانات السيرفر
ftp_host = "ftpupload.net"
ftp_user = "if0_40344183"
ftp_pass = "a1dAcxG2QLM0LD"

# المسار المحلي والمجلد في السيرفر
local_folder = r"D:\Documents\My Programming Projects\Html\Movie"
remote_folder = "htdocs"

def upload_folder(local_path, remote_path, ftp):
    """رفع الملفات والمجلدات (عدا .git والملفات المخفية)"""
    for item in os.listdir(local_path):
        if item.startswith("."):  # تجاهل .git أو أي ملفات خفية
            continue

        local_item = os.path.join(local_path, item)
        remote_item = f"{remote_path}/{item}"

        if os.path.isdir(local_item):
            try:
                ftp.mkd(remote_item)
            except Exception:
                pass  # المجلد ممكن يكون موجود بالفعل
            upload_folder(local_item, remote_item, ftp)
        else:
            try:
                with open(local_item, "rb") as f:
                    ftp.storbinary(f"STOR " + remote_item, f)
                    print(f"✅ Uploaded: {remote_item}")
            except Exception as e:
                print(f"❌ Failed to upload {remote_item}: {e}")

def start_upload():
    """بدء الاتصال والرفع"""
    print("🚀 Starting auto-upload process...")
    ftp = FTP(ftp_host)
    ftp.login(ftp_user, ftp_pass)
    ftp.cwd(remote_folder)

    upload_folder(local_folder, remote_folder, ftp)

    ftp.quit()
    print("🎉 All files uploaded successfully (excluding .git and hidden files)!")

# تشغيل تلقائي عند الفتح
if __name__ == "__main__":
    start_upload()