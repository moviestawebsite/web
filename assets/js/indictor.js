document.addEventListener("DOMContentLoaded", () => {
    const liveBadge = document.getElementById("liveBadge");

    if (!liveBadge) return;

    // تحقق من وجود المتغير
    if (typeof window.isLive !== "undefined") {
        liveBadge.style.display = window.isLive ? "inline-block" : "none";
    }

    // لو المتغير ممكن يتغير بعد التحميل، تقدر تراقبه مثلاً بهذا الشكل:
    // setInterval(() => {
    //     liveBadge.style.display = window.isLive ? "inline-block" : "none";
    // }, 500); // يتابع كل نصف ثانية
});
