document.addEventListener("DOMContentLoaded", () => {
  const liveBadge = document.getElementById("liveBadge");
  if (!liveBadge) return; // لو مفيش badge موجود في الصفحة

  // جلب الحالة من localStorage
  const isLive = localStorage.getItem("isLiveNow") === "true";

  // التحكم في العرض
  liveBadge.style.display = isLive ? "inline-block" : "none";
});
