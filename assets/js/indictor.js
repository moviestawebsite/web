document.addEventListener("DOMContentLoaded", async () => {
  const liveBadge = document.getElementById("liveBadge");

  async function checkLiveStatus() {
    try {
      // نمنع الكاش عشان يجيب أحدث نسخة من الملف كل مرة
      const response = await fetch("data/json/live-status.json?_=" + Date.now());
      const data = await response.json();

      // إظهار أو إخفاء الشارة حسب القيمة فى JSON
      if (data.isLive) {
        liveBadge.style.display = "block";
      } else {
        liveBadge.style.display = "none";
      }
    } catch (error) {
      console.error("Error loading live status:", error);
    }
  }

  // نعمل التحقق أول مرة عند فتح الصفحة
  await checkLiveStatus();

  // ونحدثها تلقائياً كل 5 ثوانى (تقدر تغير المدة لو عايز)
  setInterval(checkLiveStatus, 5000);
});
