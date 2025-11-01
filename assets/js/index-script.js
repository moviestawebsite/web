// ======================= الثوابت الأساسية =======================
const sidebar = document.querySelector(".sidebar");
const sidebartog = document.querySelectorAll(".sidebar-toggle");
const darkmodebtn = document.querySelector(".theme-tog");
const ico = darkmodebtn.querySelector(".theme-ico");
const search = document.querySelector(".search");
const body = document.querySelector("body");
const searchInput = document.querySelector(".search input");
const clearBtn = document.querySelector(".clear-search");

// ======================= تبديل الثيم =======================
const updateico = () => {
  const isDark = body.classList.contains("dark-theme");
  ico.textContent = sidebar.classList.contains("closed")
    ? (isDark ? "light_mode" : "dark_mode")
    : "dark_mode";
};

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  search.classList.remove("has-text");
  searchInput.focus();
  loadMovies();
});

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() !== "") {
    search.classList.add("has-text");
  } else {
    search.classList.remove("has-text");
  }
});

const savedtheme = localStorage.getItem("theme");
const sysdark = window.matchMedia("(prefers-color-scheme:dark)").matches;
const usedark = savedtheme === "dark" || (!savedtheme && sysdark);

body.classList.toggle("dark-theme", usedark);
updateico();

sidebartog.forEach((btn) => {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    updateico();
  });
});

search.addEventListener("click", () => {
  if (sidebar.classList.contains("closed")) {
    sidebar.classList.remove("closed");
    search.querySelector("input").focus();
  }
});

darkmodebtn.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateico();
});

if (window.innerWidth > 768) sidebar.classList.add("closed");

// ======================= تحميل الأقسام =======================
async function loadMovies() {
  try {
    const response = await fetch("data/json/movies-database.json");
    const data = await response.json();
    const mainContainer = document.getElementById("mainContainer");
    mainContainer.innerHTML = "";

    // ✅ السلايدر الأساسي
    // ✅ تحميل السلايدر من ملف JSON
const sliderData = data.slider || [];
if (sliderData.length > 0) {
  const sliderItemsHTML = sliderData
    .map((slide) => {
      const imgURL = fixDropboxLink(slide.img);
      return `
        <div class="item">
          <a href="${slide.link}">
            <img src="${imgURL}" alt="">
          </a>
        </div>
      `;
    })
    .join("");

  const dotsHTML = sliderData
    .map((_, i) => `<li${i === 0 ? ' class="active"' : ""}></li>`)
    .join("");

  const sliderHTML = `
    <div class="slider">
      <div class="list">
        ${sliderItemsHTML}
      </div>
      <div class="buttons">
        <button id="prev"><i class="fa-solid fa-angle-left"></i></button>
        <button id="next"><i class="fa-solid fa-angle-right"></i></button>
      </div>
      <ul class="dots">${dotsHTML}</ul>
    </div>
  `;
  mainContainer.insertAdjacentHTML("beforeend", sliderHTML);
  initSlider();
}


    // ✅ تحميل كل قسم أفلام
    data.sections.forEach((section, index) => {
      const area = document.createElement("div");
      area.classList.add("area");

      area.innerHTML = `
        <h2 class="s1">
          <span class="title-text tit">
            <i class="${section.ico}"></i> ${section.title} <i class="fa-solid fa-angle-right able"></i>
          </span>
          <div class="nav-btns">
            <button class="nav-btn" onclick="scrollMovies(${index}, -1)">
              <i class="fa-solid fa-angle-left"></i>
            </button>
            <button class="nav-btn" onclick="scrollMovies(${index}, 1)">
              <i class="fa-solid fa-angle-right"></i>
            </button>
          </div>
        </h2>

        <div class="movie-row" id="movieRow-${index}">
          ${section.movies.map(renderMovieCard).join("")}
        </div>
      `;

      mainContainer.appendChild(area);
    });

    observeScrollRows();
    enableScrollInteractions(); // ✅ تفعيل الماوس + اللمس
  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

// ======================= دعم السحب باللمس + الماوس =======================
function enableScrollInteractions() {
  const rows = document.querySelectorAll(".movie-row");

  rows.forEach((row) => {
    // ===== اللمس =====
    let startX = 0, scrollLeft = 0, isDown = false;
    row.addEventListener("touchstart", (e) => {
      isDown = true;
      startX = e.touches[0].pageX - row.offsetLeft;
      scrollLeft = row.scrollLeft;
    });
    row.addEventListener("touchend", () => (isDown = false));
    row.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - row.offsetLeft;
      const walk = (x - startX) * 1.5;
      row.scrollLeft = scrollLeft - walk;
    });

    // ===== عجلة الماوس =====
    row.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          row.scrollLeft += e.deltaY * 1.2;
        }
      },
      { passive: false }
    );
  });
}

// ======================= تحويل روابط Dropbox =======================
function fixDropboxLink(url) {
  if (!url) return url;
  if (url.includes("dropbox.com")) {
    url = url
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace("?dl=0", "")
      .replace("?dl=1", "");
  }
  return url;
}

// ======================= إنشاء كارت فيلم =======================
function renderMovieCard(movie) {
  const posterURL = fixDropboxLink(movie.poster);
  const ext = posterURL.split(".").pop().toLowerCase();
  const mediaHTML =
    ext === "mp4" || ext === "webm"
      ? `<video class="movie-media" autoplay loop muted playsinline>
          <source src="${posterURL}" type="video/${ext}">
        </video>`
      : `<img class="movie-media" src="${posterURL}" alt="${movie.title}">`;

  return `
    <div class="movie-card">
      ${mediaHTML}
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p style="color:${movie.color};">${movie.price}</p>
      </div>
    </div>
  `;
}

// ======================= Slider =======================
function initSlider() {
  let slider = document.querySelector(".slider .list");
  let items = document.querySelectorAll(".slider .list .item");
  let next = document.getElementById("next");
  let prev = document.getElementById("prev");
  let dots = document.querySelectorAll(".slider .dots li");
  let lengthItems = items.length - 1;
  let active = 0;

  next.onclick = () => {
    active = active + 1 <= lengthItems ? active + 1 : 0;
    reloadSlider();
  };
  prev.onclick = () => {
    active = active - 1 >= 0 ? active - 1 : lengthItems;
    reloadSlider();
  };

  let refreshInterval = setInterval(() => next.click(), 3000);

  function reloadSlider() {
    slider.style.left = -items[active].offsetLeft + "px";
    document.querySelector(".slider .dots li.active").classList.remove("active");
    dots[active].classList.add("active");
    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => next.click(), 3000);
  }

  dots.forEach((li, key) =>
    li.addEventListener("click", () => {
      active = key;
      reloadSlider();
    })
  );
  window.onresize = reloadSlider;
}

// ======================= التمرير بالأزرار =======================
function scrollMovies(index, dir) {
  const row = document.getElementById(`movieRow-${index}`);
  if (row) {
    row.scrollBy({ left: dir * 400, behavior: "smooth" });
    updateNavBtns(row);
  }
}

function updateNavBtns(row) {
  const area = row.closest(".area");
  const btns = area.querySelector(".nav-btns");
  const arrow = area.querySelector(".able");

  const maxScroll = row.scrollWidth - row.clientWidth;
  const hasOverflow = maxScroll > 5;

  btns.style.display = hasOverflow ? "flex" : "none";
  if (arrow) arrow.style.display = hasOverflow ? "inline-block" : "none";
}

function observeScrollRows() {
  const rows = document.querySelectorAll(".movie-row");
  rows.forEach((row) => {
    updateNavBtns(row);
    row.addEventListener("scroll", () => updateNavBtns(row));
  });
}

// ======================= البحث =======================
searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.toLowerCase().trim();
  const mainContainer = document.getElementById("mainContainer");

  if (!query) {
    loadMovies();
    return;
  }

  try {
    const response = await fetch("data/json/movies-database.json");
    const data = await response.json();

    mainContainer.innerHTML = `
      <div class="search-header">
        <h2 class="search-title">
          Search results for : <span>"${query}"</span>
        </h2>
      </div>
    `;

    const seenTitles = new Set();
    const results = [];

    data.sections.forEach((section) => {
      section.movies.forEach((movie) => {
        const title = movie.title.toLowerCase();
        if (title.includes(query) && !seenTitles.has(title)) {
          seenTitles.add(title);
          results.push(movie);
        }
      });
    });

    if (results.length === 0) {
      mainContainer.innerHTML += `<p class="no-results">No matching results found.</p>`;
      return;
    }

    const resultsHTML = `
      <div class="area">
        <h2>
          <span class="title-text">
            <i class="fa-solid fa-search"></i> Results
          </span>
        </h2>
        <div class="movie-row-search" id="movieRow-search">
          ${results.map(renderMovieCard).join("")}
        </div>
      </div>
    `;

    mainContainer.innerHTML += resultsHTML;
  } catch (error) {
    console.error("Error loading search results:", error);
  }
});

loadMovies();
