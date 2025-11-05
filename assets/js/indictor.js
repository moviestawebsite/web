document.addEventListener("DOMContentLoaded", async () => {
  const liveBadge = document.getElementById("liveBadge");

  try {
    const response = await fetch("../data/json/live-status.json?_=" + Date.now());
    const data = await response.json();

    if (data.isLive) {
      liveBadge.style.display = "block";
    } else {
      liveBadge.style.display = "none";
    }

  } catch (error) {
    console.error("Error loading live status:", error);
  }
});