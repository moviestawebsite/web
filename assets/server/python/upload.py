import dropbox
from tqdm import tqdm
import os
import time

# 🔹 بيانات كل حساب
ACCOUNTS = {
    "1": {
        "APP_KEY": "g3nhgvef6wd8k0c",
        "APP_SECRET": "8k5c1lvtgs2duwq",
        "ACCESS_TOKEN": "sl.u.AGGj4txttn-NvKMy3JSFoJyPc_MEBzHm-7GKJq421Cq4p09jeKBXr4cqZVNnOYkB_W07iBhcTC0_hUONkxoo5qqt5HYVbeUce-1bFCBH7oNtkE6rmrmUxR2IysxbY_r-YfE18mBI-b2hn5UNClBHBOP9RLACHYwdz0SjNa5lXNL2MrcyHr_U-Bg0DeenGfHLfQ03AnWc8h6MiH18ZBcOuVuDS7sCSfAFj6XK2Z7W_A_DGVx_Dabydy1Ct6iC-yFUGKwMiFZh5lVm3xbLdjc_kocIOH4WKwDB-YkIccgCMlae-jtl4qni9A6J-X93pj2knSVe7_OqZVIX-SLK-QezSc7T1ciIBNSEU5TXuuT8ljghMOebMm9tfEjV57WcPgkg-elZnA0MweipQtF1h1fO2BZ2AUdBIf5cmZLx_KnlrwYRKnh6ObAX4WU3q-j2gLBQ_ZppAPyv-Ltyx1iy8DA_rEDNkmVmnm_qpE32UABjJp7WdckicbsFLICjurv7jxDvGQCZIId3eETaDclmBtNBxj9A0oVBZ3Vdu3kV41agT5-G_yvzidNqfXyNBecdxSDo-yRMIPFFa-3UlPCJL2Qkoe4eZ2rZSWZnUvu1IfADDLAIslGX0z6NWP4-_47O8hihi_TbJu2ZspapWth6ju3rJmPAS5LuIhmDiHCmMpXddaukv_SymUWW-CDQV_IkQyJ6zeT5-djsSIbvdyR4prpY3kfv0KiKnlAYXLyFFWdtUvLM-osTBNmDJXCbkMxXjGPbHFLLwcv9Q6D3sfgOaKW2pI23xLS6vpewClZ_EAoPNNdffUCkSvNEUVkYtKSYYFvniF43yODUeXp2GMT0pG-Lutef4BoSn3YFwshr_NobHentibevCQ1igHiRlClQvtyYDgpNZVqonw0y4QF8B7EBhBf7tPO73M3LuHuxXn1SXf3jRRC3-vLaZjFCWmpfP0jRhK4GISReFwuOTXzePnerbq-u-eKidKkeK9EIgowpCFW9GF7HRWB32WfnClFSgR7_ptF0GTZrvxLGOaI5SYGO0ftVY704H4rWtG35w-n6az4FftW3YQXYfsKD1lKrJfcT-09LpXKd4-rYJfAGPMzlgn76O8I60aUkirPIUzyuD96BIliCXfLrNKhue5fPIVMDDh2YKWLgiFUO5CnhrPi5L8Dm9BM3CClqmPpS7XGVYMLnFEeMqHcQNs5TQZtuxozfy4GffeKEF_p5SMTl6Qcg_hteAlu9wU4aQ1-9_ZtjniCc75Km86XEtWw3GIzoxFAyteVjsk-pkXx-SM6BOBLMiSC986wT0KUu30-RkUZg7m5cPgVbKCJNWqO6LkiWKLxDu26LCSzMKYri5_HDN8YAdEocvfmVxyeTTt-58kIPTJP7dqI1Sfvtm69zkGonWzfVQhrsClEEg3PPPlhfTuPKGQE0",
        "REFRESH_TOKEN": "jLrjVMqBNo8AAAAAAAAAAdXaeZ93ckYXbYsvTGABNScwRPQTOvvADHwxNQJZKlOy",
        "ACCOUNT_ID": "dbid:AAChICy5a0rKrLREnJ7gNbgcn6zwOVLhDkA"
    },
    "2": {
        "APP_KEY": "5e9ki6qb8i8nrzk",
        "APP_SECRET": "30aqxxned2z4grs",
        "ACCESS_TOKEN": "sl.u.AGECvEY80V4aBdWQPhkdhN4qV5AfS9w3A1s6NIA0xmyojgksk10TxQVZLdlkij37gUYZIOKfAhoGemVy8NrVjoFDoZFSihcCtyGlG1oCp_G5fUrbZBHLZfy4i3xB-t_OD41ViClgW1knQkpGVVneR9oQMVfw7yNT1Pab0mX0A3hamBwPeZIq8WJ2GT2VpaG6b1P5IGCi7eeNnT3ySs78bvQ3h8dBHpaPmBN-SAf1IDItrmcUkdk8d23c9zjZMrShMK9Wq5mY_aotAg6gzFINDy8WZS7No3haaJBbfFrFig30p4WbHeJy1CDXBZusADOi9R_qv-ovyvsCKSNObmtiUQ4omAkPjrI68lEGaLdLk6zSK2fLeoWGke0wFuORAJxyq4ngVYNTZhnM0vn63SnMvX6BGZ6zCI2Rx6dTP52bqXRayMrjQDrtKANBB3OIp-xDD_0vW0Ec6cyue5LoyZd5TDWWpEs-5f7nDTELh1TuKz1dkRytSvdrqLUCxsATeJR6p_c0_BSW_irjRjmIEOpCxChIW-sJRVmH2pLv0YrjnDovYGVcjC5t5-g_seRNPXkjIP96dJpgDs6msIkwHjXALkU1JqJrKhuBrmwy_VGzEUpvqITtjxZLzinlSX0_nuSUrirykphqSO4chUO4DXthhlRn8ziTlvxMlcACt--aJnXCPCA67fuC1zQTIrwZFnDvk9cHjVzINSGFASLZMSt7zpf79j3ncW9oSVnGhrTW1HbccsRpYKRjZzyu0wOKGOI5JiFRZ1x0mP7tWGBNb7WluEmWfSA366gjJDlp8OfzEhGb8_-v7mRXRSl01iY7LKW01hHTvcQyRzn1ab3r4uCUFVTWS1OPz4mOH-1UIu12QuVAkOhgbWGjzxAuXwuFExp5uGu9Dp3m9s1iza9s2W-QXN_aNfl6oLOW6ZE_cpYXHp3LhJqIbMkn1u2Mm4zn76VKrb7fs8gDu6NyIuva51synXnzcivLF448rYctB7J15Nf1jzm1zejP-Se5qmMS9fQb-sZH8nWeB6ixDaBxXpMnJrkljtXfdpKRCvZffcz0nMgcfyjFizWe2pYXAIqHJ6ZlwQr0JDhUpTD9FF_QPyUrXWilqMvnNsAlQLh5vgu-2QWIrfmiL77uynQMC-FAE720b7QLrOMYjmaRexWVXL6-nQjvs880iowlHNVDkVwIx_-61xtDc5qP3ZVOnbjqUGEdc2u6U0S_Az-kkt6eotpraB3jobc2Q3W39LV5EG6hf6xF0IPnlAqn92BkQAmQbZu9tld46ADO-k9XMPIsEK7AsOrRE8npM4AVYsee_NZIIr0nICJJDkC97gEu_jsBsFdHuUF798lZv_4GAdJPO6pUnTGpkS6xVc_QREtpq1XeKNkBdsXJfO5oLFNEs6zYMR4GDPI8jBoh08f3A5_V7zGQDWLf",
        "REFRESH_TOKEN": "ZTYQx9HK4rQAAAAAAAAAAbDlPSecu4wuVLUUJ0D-eu7xIh9MAlcenP0Q2Hq-j6si",
        "ACCOUNT_ID": "dbid:AADQ_a-Lyg2nfm4215zKdM7sxuMzF_NDTMw"
    },
    "3": {
        "APP_KEY": "APP_KEY_3",
        "APP_SECRET": "APP_SECRET_3",
        "ACCESS_TOKEN": "ACCESS_TOKEN_3",
        "REFRESH_TOKEN": "REFRESH_TOKEN_3"
    }
}

# 🟢 اختيار الحساب
print("Select Dropbox account:")
for key in ACCOUNTS:
    print(f"{key} - Account {key}")

choice = input("Account number: ").strip()
account = ACCOUNTS.get(choice)

if not account:
    print("Invalid choice.")
    exit()

# 🪄 إعداد Dropbox client
dbx = dropbox.Dropbox(
    oauth2_access_token=account["ACCESS_TOKEN"],
    oauth2_refresh_token=account["REFRESH_TOKEN"],
    app_key=account["APP_KEY"],
    app_secret=account["APP_SECRET"]
)

# 🔹 مجلد الصور المحلي
local_folder = r"D:\Pictures\Websites"
dropbox_folder = "/" + os.path.basename(local_folder)

# 🧱 دالة رفع ملف واحد
def upload_file(local_path, dropbox_path):
    file_size = os.path.getsize(local_path)
    chunk_size = 4 * 1024 * 1024  # 4MB chunks

    with open(local_path, "rb") as f, tqdm(
        total=file_size,
        unit='B',
        unit_scale=True,
        unit_divisor=1024,
        desc=f"Uploading {os.path.basename(local_path)}",
        ascii=True,
        ncols=80
    ) as pbar:

        if file_size <= chunk_size:
            dbx.files_upload(f.read(), dropbox_path, mode=dropbox.files.WriteMode.overwrite)
            pbar.update(file_size)
        else:
            session_start = dbx.files_upload_session_start(f.read(chunk_size))
            cursor = dropbox.files.UploadSessionCursor(session_id=session_start.session_id, offset=f.tell())
            commit = dropbox.files.CommitInfo(path=dropbox_path, mode=dropbox.files.WriteMode.overwrite)

            while f.tell() < file_size:
                if (file_size - f.tell()) <= chunk_size:
                    dbx.files_upload_session_finish(f.read(chunk_size), cursor, commit)
                else:
                    dbx.files_upload_session_append_v2(f.read(chunk_size), cursor)
                    cursor.offset = f.tell()
                pbar.update(min(chunk_size, file_size - pbar.n))
                time.sleep(0.05)

# 🔄 رفع كل الملفات داخل المجلد
print(f"\n🔍 Uploading all files from {local_folder}...\n")

for root, dirs, files in os.walk(local_folder):
    for filename in files:
        local_path = os.path.join(root, filename)
        relative_path = os.path.relpath(local_path, local_folder)
        dropbox_path = os.path.join(dropbox_folder, relative_path).replace("\\", "/")
        upload_file(local_path, dropbox_path)

print("\n✅ All files uploaded successfully!")
