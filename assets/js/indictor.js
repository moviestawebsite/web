// live-status.js
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const isLive = data.isLive;

    localStorage.setItem("liveStatus", isLive ? "true" : "false");
  } catch (error) {
    console.error("Error fetching live status:", error);
  }
});
