// live-status.js
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("../data/json/videos-database.json");
    const data = await response.json();

    // افترض إن فيه مفتاح اسمه isLive فى JSON
    const isLive = data.isLive;

    localStorage.setItem("liveStatus", isLive ? "true" : "false");
  } catch (error) {
    console.error("Error fetching live status:", error);
  }
});
