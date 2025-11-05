document.addEventListener("DOMContentLoaded", async () => {
  const liveBadge = document.getElementById("liveBadge");

  async function checkLiveStatus() {
    try {
      // نمنع الكاش عشان يجيب أحدث نسخة من الملف كل مرة
      const response = await fetch("data/json/live-status.json?_=" + Date.now());
      const data = await response.json();

      // الوصول إلى الكائن داخل "live"
      const liveData = data.live;

      // إظهار أو إخفاء الشارة حسب القيمة فى JSON
      if (liveData && liveData.isLive === true) {
        liveBadge.style.display = "block";
      } else {
        liveBadge.style.display = "none";
      }

    } catch (error) {
      console.error("Error loading live status:", error);
    }
  }

  // التحقق أول مرة عند فتح الصفحة
  await checkLiveStatus();

  // التحديث التلقائي كل 5 ثواني
  setInterval(checkLiveStatus, 5000);
});
