// ======================= الثوابت الأساسية =======================
const sidebar = document.querySelector(".sidebar");
const sidebartog = document.querySelectorAll(".sidebar-toggle");
const darkmodebtn = document.querySelector(".theme-tog");
const ico = darkmodebtn.querySelector(".theme-ico");
const search = document.querySelector(".search");
const body = document.querySelector("body");
const searchInput = document.querySelector(".search input");
const clearBtn = document.querySelector(".clear-search");
const mainContainer = document.getElementById("mainContainer");

// ======================= إعداد الأيقونة =======================
const updateico = () => {
  const isDark = body.classList.contains("dark-theme");
  ico.textContent = sidebar.classList.contains("closed")
    ? (isDark ? "light_mode" : "dark_mode")
    : "dark_mode";
};

// ======================= الوضع الداكن =======================
const savedtheme = localStorage.getItem("theme");
const sysdark = window.matchMedia("(prefers-color-scheme:dark)").matches;
const usedark = savedtheme === "dark" || (!savedtheme && sysdark);
body.classList.toggle("dark-theme", usedark);
updateico();

darkmodebtn.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateico();
});

// ======================= التبديل بين الفتح والإغلاق =======================
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

if (window.innerWidth > 768) sidebar.classList.add("closed");

// ======================= كود تحميل النتائج =======================
function renderMovieCard(movie) {
  const ext = movie.poster.split(".").pop().toLowerCase();
  const mediaHTML =
    ext === "mp4" || ext === "webm"
      ? `<video class="movie-media" autoplay loop muted playsinline><source src="${movie.poster}" type="video/${ext}"></video>`
      : `<img class="movie-media" src="${movie.poster}" alt="${movie.title}">`;

  return `
    <div class="movie-card">
      ${mediaHTML}
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p style='color:${movie.color};'>${movie.price}</p>
      </div>
    </div>
  `;
}

let originalContent = mainContainer.innerHTML;

searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.toLowerCase().trim();

  if (!query) {
    mainContainer.innerHTML = originalContent;
    clearBtn.style.display = "none";
    return;
  }

  clearBtn.style.display = "block";

  try {
    const response = await fetch("../data/json/movies-database.json");
    const data = await response.json();

    mainContainer.innerHTML = `
      <div class="search-header">
        <h2 class="search-title">Search results for: <span>"${query}"</span></h2>
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
      <div class="area search-area">
        <h2><span class="title-text"><i class="fa-solid fa-search"></i> Results</span></h2>
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

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  clearBtn.style.display = "none";
  mainContainer.innerHTML = originalContent;
});

// ======================= كود تحميل الفيديوهات =======================
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("mainContainer");
  const liveBadge = document.getElementById("liveBadge");


  try {
    const response = await fetch("../data/json/videos-database.json");
    const data = await response.json();

    window.mediaData = data.media;

    // إنشاء المحتوى الأساسي للصفحة
    container.innerHTML = `
      <div id="liveContainer" class="live-frame"></div>
      <div class="media-grid">
        ${data.media.map(renderMediaCard).join("")}
      </div>
    `;

    const liveContainer = document.getElementById("liveContainer");

    // مثال: اختر الفيديو من JSON أو ضع رابط مباشر
    const videoItem = {
      url: "https://www.dropbox.com/scl/fi/zyz1cp6x6nc8bhqra5uy7/Anyone-but-you.mp4?rlkey=ydiuh3lv649yibf3ocfplneqr&st=z5wmewiu&dl=0", // رابط الفيديو
      isLive: true // false → يظهر No-live
    };

    if (videoItem.isLive) showLive(videoItem.url);
    else showNoLive();

    // 🟥 دالة عرض No-live
    function showNoLive() {
      liveContainer.innerHTML = `
        <div class="no-live">
          <div class="txt-nt-live">
            <i class="fa-solid fa-video-slash"></i>
            <p>There is no live right now</p>
          </div>
        </div>
      `;
    }

    // 🔴 دالة عرض Live بالنقطة الحمراء
    function showLive(url) {
      liveContainer.innerHTML = `
      <div class="video-wrapper" style="position:relative;">
        <div class="video_player">
          <video preload="metadata" class="main-video" src="${url}" autoplay muted loop></video>
        </div>
      </div>
      `;
    }
    const video_player = liveContainer.querySelector(".video_player");
    if (video_player) initializeAllVideoPlayersFor(video_player);


    if (videoItem.isLive) {
      liveBadge.style.display = "inline-block"; // تظهر
      showLive(videoItem.url);
    } else {
      liveBadge.style.display = "none"; // تختفي
      showNoLive();
    }

    fixDropboxLinks();

    // التعامل مع كروت الفيديو
    container.addEventListener("click", (e) => {
      const card = e.target.closest(".media-card");
      if (!card) return;

      const id = card.dataset.id;
      const item = window.mediaData.find((m) => m.id === id);

      if (item) openPopup(item);
    });
  } catch (error) {
    console.error("Error loading media:", error);
    container.innerHTML = `<p>There is an error loading items</p>`;
  }
});

// إنشاء كل كارت فيديو
function renderMediaCard(item) {
  return `
    <div class="media-card" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="media-thumb" />
    </div>
  `;
}

// ======================= كود الـ Popup =======================
function openPopup(item) {
  const loader1 = document.getElementById("popupLoader");
  loader1.style.display = "flex";

  const oldPopup = document.querySelector(".popup-overlay");
  if (oldPopup) oldPopup.remove();

  const overlay = document.createElement("div");
  overlay.classList.add("popup-overlay");

  overlay.innerHTML = `
    <span class="close-popup" onclick="this.closest('.popup-overlay').remove()">
      <i class="fa-solid fa-xmark"></i>
    </span>

    <div class="popup-box">
      <div class="popup-header">
        <div class="left">
          <img src="../images/logo.png" alt="logo">
          <span class="header-img-text">Moviesta</span>
        </div>
        <div class="right-buttons">
          <button class="icon-btn download" title="Add to favorites"><i class="fa-solid fa-heart-circle-plus"></i></button>
          <button class="icon-btn edit" title="Edit"><i class="fa-solid fa-sliders"></i></button>
          <button class="icon-btn ai" title="AI Assistant"><i class="fa-solid fa-wand-magic-sparkles"></i></button>
          <button class="icon-btn refine" title="Refine"><i class="fa-solid fa-pen"></i></button>
          <div class="divider"></div>
          <button class="open" onclick="window.open('${item.page}', '_blank')">
            <i class="fa-solid fa-up-right-from-square"></i> Open the page
          </button>
        </div>
      </div>

      <div class="popup-scroll">
        <div class="popup-content">
          <h1 style="margin-top: 50px;"><i class="fa-solid fa-film"></i> ${item.title}</h1>
          <section>
            <div class="container-control">
              <div class="video_player">
                <video preload="metadata" class="main-video">
                  <source src="${item.video_url_720}" size="720" type="video/mp4">
                </video>
              </div>
            </div>
          </section>
        
        <div class="movie-details-split">
          <div class="left-details">
            <h2>Details:</h2><br>
            <ul>
              <li><i class="fa-solid fa-film"></i> <strong>Movie Name:</strong> ${item.title}</li>
              <li><i class="fa-regular fa-calendar"></i> <strong>Release Date:</strong> ${item.date}</li>
              <li><i class="fa-solid fa-clapperboard"></i> <strong>Genre:</strong> ${item.cem}</li>
              <li><i class="fa-solid fa-user"></i> <strong>Director:</strong> ${item.useres}</li>
              <li><i class="fa-solid fa-star"></i> <strong>IMDb Rating:</strong> ${item.rating}/10</li>
              <li><i class="fa-solid fa-clock"></i> <strong>Duration:</strong> ${item.time}</li>
            </ul>
          </div>

          <div class="divider1"></div>

          <div class="right-details">
            <br><br>
            <button><i class="fa-solid fa-heart"></i> Add to favorites</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  setTimeout(() => {
    loader1.style.display = "none";
    initializeAllVideoPlayers();
  }, 3500);
  fixDropboxLinks()
}

// ======================= كود تهيئة مشغل الفيديوهات في الصفحة أو الـ Popup =======================
function initializeAllVideoPlayers() {
  const video_players = document.querySelectorAll(".video_player");

  video_players.forEach(video_player => {
    if (video_player.dataset.initiated) return; // منع التكرار
    video_player.dataset.initiated = true;

    const video_player_html = `
      ${video_player.innerHTML}
      <div class="progressAreaTime">00:00:00</div>
      <div class="controls active">
        <div class="progress-area">
          <canvas class="bufferedBar"></canvas>
          <div class="progress-bar"><span></span></div>
        </div>
        <div class="controls-list">
          <div class="controls-left">
            <span class="icon"><i class="material-icons fast-rewind">replay_10</i></span>
            <span class="icon"><i class="material-icons play_pause">play_arrow</i></span>
            <span class="icon"><i class="material-icons fast-forward">forward_10</i></span>
            <span class="icon"><i class="material-icons volume">volume_up</i><input type="range" min="0" max="100" class="volume_range" /></span>
            <div class="timer"><span class="current">0:00</span> / <span class="duration">0:00</span></div>
          </div>
          <div class="controls-right">
            <span class="icon"><i class="material-icons auto-play"></i></span>
            <span class="icon"><i class="material-icons captionsBtn">closed_caption</i></span>
            <span class="icon"><i class="material-icons settingsBtn">settings</i></span>
            <span class="icon"><i class="material-icons picture_in_picutre">picture_in_picture_alt</i></span>
            <span class="icon"><i class="material-icons fullscreen">fullscreen</i></span>
          </div>
        </div>
      </div>
      <div class="settings">
        <div data-label="settingHome">
          <ul>
            <li data-label="speed"><span>Speed</span><span class="material-symbols-outlined icon">arrow_forward_ios</span></li>
            <li data-label="quality"><span>Quality</span><span class="material-symbols-outlined icon">arrow_forward_ios</span></li>
          </ul>
        </div>
        <div class="playback" data-label="speed" hidden>
          <span><i class="material-symbols-outlined icon back_arrow" data-label="settingHome">arrow_back</i><span>Playback Speed</span></span>
          <ul>
            <li data-speed="0.25">0.25</li>
            <li data-speed="0.5">0.5</li>
            <li data-speed="0.75">0.75</li>
            <li data-speed="1" class="active">Normal</li>
            <li data-speed="1.25">1.25</li>
            <li data-speed="1.5">1.5</li>
            <li data-speed="1.75">1.75</li>
            <li data-speed="2">2</li>
          </ul>
        </div>
        <div data-label="quality" hidden>
          <span><i class="material-symbols-outlined icon back_arrow" data-label="settingHome">arrow_back</i><span>Playback Quality</span></span>
          <ul><li data-quality="auto" class="active">auto</li></ul>
        </div>
      </div>
      <div class="captions">
        <div class="caption"><span>Select Subtitle</span><ul></ul></div>
      </div>
    `;
    video_player.innerHTML = video_player_html;
    const mainVideo = video_player.querySelector(".main-video"),
      progressAreaTime = video_player.querySelector(".progressAreaTime"),
      controls = video_player.querySelector(".controls"),
      progressArea = video_player.querySelector(".progress-area"),
      bufferedBar = video_player.querySelector(".bufferedBar"),
      progress_Bar = video_player.querySelector(".progress-bar"),
      fast_rewind = video_player.querySelector(".fast-rewind"),
      play_pause = video_player.querySelector(".play_pause"),
      fast_forward = video_player.querySelector(".fast-forward"),
      volume = video_player.querySelector(".volume"),
      volume_range = video_player.querySelector(".volume_range"),
      current = video_player.querySelector(".current"),
      totalDuration = video_player.querySelector(".duration"),
      auto_play = video_player.querySelector(".auto-play"),
      settingsBtn = video_player.querySelector(".settingsBtn"),
      captionsBtn = video_player.querySelector(".captionsBtn"),
      picture_in_picutre = video_player.querySelector(".picture_in_picutre"),
      fullscreen = video_player.querySelector(".fullscreen"),
      settings = video_player.querySelector(".settings"),
      settingHome = video_player.querySelectorAll(".settings [data-label='settingHome'] > ul > li"),
      captions = video_player.querySelector(".captions"),
      caption_labels = video_player.querySelector(".captions ul"),
      playback = video_player.querySelectorAll(".playback li"),
      tracks = video_player.querySelectorAll("track"),
      loader = video_player.querySelector(".loader");

    // let thumbnail = video_player.querySelector(".thumbnail");

    if (tracks.length != 0) {
      caption_labels.insertAdjacentHTML(
        "afterbegin",
        `<li data-track="OFF" class="active">OFF</li>`
      );
      for (let i = 0; i < tracks.length; i++) {
        let trackLi = `<li data-track="${tracks[i].label}">${tracks[i].label}</li>`;
        caption_labels.insertAdjacentHTML("beforeend", trackLi);
      }
    }
    const caption = captions.querySelectorAll("ul li");

    // Play video function
    function playVideo() {
      play_pause.innerHTML = "pause";
      play_pause.title = "pause";
      video_player.classList.add("paused");
      mainVideo.play();
    }

    // Pause video function
    function pauseVideo() {
      play_pause.innerHTML = "play_arrow";
      play_pause.title = "play";
      video_player.classList.remove("paused");
      mainVideo.pause();
    }

    play_pause.addEventListener("click", () => {
      const isVideoPaused = video_player.classList.contains("paused");
      isVideoPaused ? pauseVideo() : playVideo();
    });

    mainVideo.addEventListener("play", () => {
      playVideo();
    });

    mainVideo.addEventListener("pause", () => {
      pauseVideo();
    });

    // fast_rewind video function
    fast_rewind.addEventListener("click", () => {
      mainVideo.currentTime -= 10;
    });

    // fast_forward video function
    fast_forward.addEventListener("click", () => {
      mainVideo.currentTime += 10;
    });

    // Load video duration
    mainVideo.addEventListener("loadeddata", (e) => {
      let videoDuration = e.target.duration;
      let hours = Math.floor(videoDuration / 3600);
      let minutes = Math.floor((videoDuration % 3600) / 60);
      let seconds = Math.floor(videoDuration % 60);

      // إضافة صفر للباقي لو أقل من 10
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      if (hours > 0) {
        totalDuration.innerHTML = `${hours}:${minutes}:${seconds}`;
      } else {
        totalDuration.innerHTML = `${minutes}:${seconds}`;
      }
    });

    // Current video duration
    mainVideo.addEventListener("timeupdate", (e) => {
      let currentVideoTime = e.target.currentTime;
      let hours = Math.floor(currentVideoTime / 3600);
      let minutes = Math.floor((currentVideoTime % 3600) / 60);
      let seconds = Math.floor(currentVideoTime % 60);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      if (hours > 0) {
        current.innerHTML = `${hours}:${minutes}:${seconds}`;
      } else {
        current.innerHTML = `${minutes}:${seconds}`;
      }

      // تحديث progress bar
      let videoDuration = e.target.duration;
      let progressWidth = (currentVideoTime / videoDuration) * 100 + 0.5;
      progress_Bar.style.width = `${progressWidth}%`;
    });


    // Current video duration
    mainVideo.addEventListener("timeupdate", (e) => {
      let currentVideoTime = e.target.currentTime;
      let currentMin = Math.floor(currentVideoTime / 60);
      let currentSec = Math.floor(currentVideoTime % 60);
      // if seconds are less then 10 then add 0 at the begning
      currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
      current.innerHTML = `${currentMin} : ${currentSec}`;

      let videoDuration = e.target.duration;
      // progressBar width change
      let progressWidth = (currentVideoTime / videoDuration) * 100 + 0.5;
      progress_Bar.style.width = `${progressWidth}%`;
    });

    // let's update playing video current time on according to the progress bar width

    progressArea.addEventListener("pointerdown", (e) => {
      progressArea.setPointerCapture(e.pointerId);
      setTimelinePosition(e);
      progressArea.addEventListener("pointermove", setTimelinePosition);
      progressArea.addEventListener("pointerup", () => {
        progressArea.removeEventListener("pointermove", setTimelinePosition);
      })
    });


    function setTimelinePosition(e) {
      let videoDuration = mainVideo.duration;
      let progressWidthval = progressArea.clientWidth + 2;
      let ClickOffsetX = e.offsetX;
      mainVideo.currentTime = (ClickOffsetX / progressWidthval) * videoDuration;

      let progressWidth = (mainVideo.currentTime / videoDuration) * 100 + 0.5;
      progress_Bar.style.width = `${progressWidth}%`;

      let currentVideoTime = mainVideo.currentTime;
      let currentMin = Math.floor(currentVideoTime / 60);
      let currentSec = Math.floor(currentVideoTime % 60);
      // if seconds are less then 10 then add 0 at the begning
      currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
      current.innerHTML = `${currentMin} : ${currentSec}`;

    }

    function drawProgress(canvas, buffered, duration) {
      let context = canvas.getContext('2d', { antialias: false });
      context.fillStyle = "#ffffffe6";

      let height = canvas.height;
      let width = canvas.width;
      if (!height || !width) throw "Canva's width or height or not set.";
      context.clearRect(0, 0, width, height);
      for (let i = 0; i < buffered.length; i++) {
        let leadingEdge = buffered.start(i) / duration * width;
        let trailingEdge = buffered.end(i) / duration * width;
        context.fillRect(leadingEdge, 0, trailingEdge - leadingEdge, height)
      }
    }

    mainVideo.addEventListener('progress', () => {
      drawProgress(bufferedBar, mainVideo.buffered, mainVideo.duration);
    })

    mainVideo.addEventListener('waiting', () => {
      loader.style.display = "block";
    })

    mainVideo.addEventListener('canplay', () => {
      loader.style.display = "none";
    })


    // change volume
    let lastVolume = 1; // تخزين آخر صوت قبل الكتم (1 = 100%)

    // ضبط الصوت في البداية
    volume_range.value = lastVolume * 100;
    mainVideo.volume = lastVolume;
    volume.innerHTML = "volume_up";

    // تغيير الصوت عن طريق الـ slider
    function changeVolume() {
      mainVideo.volume = volume_range.value / 100;
      lastVolume = mainVideo.volume; // تحديث آخر قيمة صوت
      if (volume_range.value == 0) {
        volume.innerHTML = "volume_off";
      } else if (volume_range.value < 40) {
        volume.innerHTML = "volume_down";
      } else {
        volume.innerHTML = "volume_up";
      }
    }

    // كتم/إلغاء كتم الصوت
    function muteVolume() {
      if (volume_range.value == 0) {
        // إلغاء الكتم: ارجع لآخر صوت قبل الكتم
        volume_range.value = lastVolume * 100;
        mainVideo.volume = lastVolume;
        volume.innerHTML = lastVolume < 0.4 ? "volume_down" : "volume_up";
      } else {
        // كتم الصوت
        volume_range.value = 0;
        mainVideo.volume = 0;
        volume.innerHTML = "volume_off";
      }
    }

    volume_range.addEventListener("change", () => {
      changeVolume();
    });

    volume.addEventListener("click", () => {
      muteVolume();
    });

    // Update progress area time and display block on mouse move
    progressArea.addEventListener("mousemove", (e) => {
      let progressWidthval = progressArea.clientWidth + 2;
      let x = e.offsetX;
      let videoDuration = mainVideo.duration;
      let progressTime = Math.floor((x / progressWidthval) * videoDuration);
      let currentMin = Math.floor(progressTime / 60);
      let currentSec = Math.floor(progressTime % 60);
      progressAreaTime.style.setProperty("--x", `${x}px`);
      progressAreaTime.style.display = "block";
      if (x >= progressWidthval - 80) {
        x = progressWidthval - 80;
      } else if (x <= 75) {
        x = 75;
      } else {
        x = e.offsetX;
      }

      currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
      progressAreaTime.innerHTML = `${currentMin} : ${currentSec}`;

    });

    progressArea.addEventListener("mouseleave", () => {
      progressAreaTime.style.display = "none";
    });

    // Auto play
    auto_play.addEventListener("click", () => {
      auto_play.classList.toggle("active");
      if (auto_play.classList.contains("active")) {
        auto_play.title = "Autoplay is on";
      } else {
        auto_play.title = "Autoplay is off";
      }
    });

    mainVideo.addEventListener("ended", () => {
      if (auto_play.classList.contains("active")) {
        playVideo();
      } else {
        play_pause.innerHTML = "replay";
        play_pause.title = "Replay";
      }
    });

    // Picture in picture

    picture_in_picutre.addEventListener("click", () => {
      mainVideo.requestPictureInPicture();
    });

    // Full screen function

    fullscreen.addEventListener("click", () => {
      if (!video_player.classList.contains("openFullScreen")) {
        video_player.classList.add("openFullScreen");
        fullscreen.innerHTML = "fullscreen_exit";
        video_player.requestFullscreen();
      } else {
        video_player.classList.remove("openFullScreen");
        fullscreen.innerHTML = "fullscreen";
        document.exitFullscreen();
      }
    });

    // Open settings
    settingsBtn.addEventListener("click", () => {
      settings.classList.toggle("active");
      settingsBtn.classList.toggle("active");
      if (
        captionsBtn.classList.contains("active") ||
        captions.classList.contains("active")
      ) {
        captions.classList.remove("active");
        captionsBtn.classList.remove("active");
      }
    });
    // Open caption
    captionsBtn.addEventListener("click", () => {
      captions.classList.toggle("active");
      captionsBtn.classList.toggle("active");
      if (
        settingsBtn.classList.contains("active") ||
        settings.classList.contains("active")
      ) {
        settings.classList.remove("active");
        settingsBtn.classList.remove("active");
      }
    });

    // Playback Rate

    playback.forEach((event) => {
      event.addEventListener("click", () => {
        removeActiveClasses(playback);
        event.classList.add("active");
        let speed = event.getAttribute("data-speed");
        mainVideo.playbackRate = speed;
      });
    });

    caption.forEach((event) => {
      event.addEventListener("click", () => {
        removeActiveClasses(caption);
        event.classList.add("active");
        changeCaption(event);
        caption_text.innerHTML = "";
      });
    });

    let track = mainVideo.textTracks;

    function changeCaption(lable) {
      let trackLable = lable.getAttribute("data-track");
      for (let i = 0; i < track.length; i++) {
        track[i].mode = "disabled";
        if (track[i].label == trackLable) {
          track[i].mode = "showing";
        }
      }
    }

    const settingDivs = video_player.querySelectorAll('.settings > div');
    const settingBack = video_player.querySelectorAll('.settings > div .back_arrow');
    const quality_ul = video_player.querySelector(".settings > [data-label='quality'] ul");
    const qualities = video_player.querySelectorAll("source[size]");

    qualities.forEach(event => {
      let quality_html = `<li data-quality="${event.getAttribute('size')}">${event.getAttribute('size')}p</li>`;
      quality_ul.insertAdjacentHTML('afterbegin', quality_html);
    })

    const quality_li = video_player.querySelectorAll(".settings > [data-label='quality'] ul > li");
    quality_li.forEach((event) => {
      event.addEventListener('click', (e) => {
        let quality = event.getAttribute('data-quality');
        removeActiveClasses(quality_li);
        event.classList.add('active');
        qualities.forEach(event => {
          if (event.getAttribute('size') == quality) {
            let video_current_duration = mainVideo.currentTime;
            let video_source = event.getAttribute('src');
            mainVideo.src = video_source;
            mainVideo.currentTime = video_current_duration;
            playVideo();
          }
        })
      })
    })

    settingBack.forEach((event) => {
      event.addEventListener('click', (e) => {
        let setting_label = e.target.getAttribute('data-label');
        for (let i = 0; i < settingDivs.length; i++) {
          if (settingDivs[i].getAttribute('data-label') == setting_label) {
            settingDivs[i].removeAttribute('hidden');
          } else {
            settingDivs[i].setAttribute('hidden', "");
          }
        }
      })
    })

    settingHome.forEach((event) => {
      event.addEventListener('click', (e) => {
        let setting_label = e.target.getAttribute('data-label');
        for (let i = 0; i < settingDivs.length; i++) {
          if (settingDivs[i].getAttribute('data-label') == setting_label) {
            settingDivs[i].removeAttribute('hidden');
          } else {
            settingDivs[i].setAttribute('hidden', "");
          }
        }
      })
    })


    function removeActiveClasses(e) {
      e.forEach((event) => {
        event.classList.remove("active");
      });
    }

    let caption_text = video_player.querySelector(".caption_text");
    for (let i = 0; i < track.length; i++) {
      track[i].addEventListener("cuechange", () => {
        if (track[i].mode === "showing") {
          if (track[i].activeCues[0]) {
            let span = `<span><mark>${track[i].activeCues[0].text}</mark></span>`;
            caption_text.innerHTML = span;
          } else {
            caption_text.innerHTML = "";
          }
        }
      });
    }

    // Mouse move controls
    let timer;
    const hideControls = () => {
      if (mainVideo.paused) return;
      timer = setTimeout(() => {
        if (settingsBtn.classList.contains("active") || captionsBtn.classList.contains("active")) {
          controls.classList.add("active");
        } else {
          controls.classList.remove("active");
          if (tracks.length != 0) {
            caption_text.classList.add("active");
          }
        }
      }, 3000);
    }
    hideControls();

    video_player.addEventListener("mousemove", () => {
      controls.classList.add("active");
      if (tracks.length != 0) {
        caption_text.classList.remove("active");
      }
      clearTimeout(timer);
      hideControls();
    });
    if (tracks.length == 0) {
      caption_labels.remove();
      captions.remove();
      captionsBtn.parentNode.remove();
    }
  });
}

function fixDropboxLinks() {
  document.querySelectorAll("img, video, source").forEach((el) => {
    const src = el.getAttribute("src");
    if (src && src.includes("dropbox.com")) {
      el.src = src.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
    }
  });
}