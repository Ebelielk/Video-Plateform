const video = document.getElementById("video");

const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const timeDisplay = document.getElementById("time");

const videos = [
  {
    id: 1,
    title: "Nature Clip",
    src: "assets/video.mp4",
    thumbnail: "assets/thumb1.jpeg"
  },
  {
    id: 2,
    title: "City Lights",
    src: "assets/video2.mp4",
    thumbnail: "assets/thumb2.jpeg"
  },
  {
    id: 3,
    title: "Ocean Waves",
    src: "assets/video3.mp4",
    thumbnail: "assets/thumb3.jpeg"
  }
];

let isPlaying = false;
let isMuted = false;

const videoList = document.getElementById("videoList");

function renderVideos() {
  videoList.innerHTML = "";

  videos.forEach(videoData => {
    const item = document.createElement("div");

    item.className =
      "group flex gap-3 p-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition";

    item.innerHTML = `
      <div class="relative w-24 h-14 overflow-hidden rounded-md">
        <img 
          src="${videoData.thumbnail}" 
          class="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
      </div>

      <div class="flex flex-col justify-center">
        <p class="font-medium text-sm">${videoData.title}</p>
        <p class="text-xs opacity-60">Click to play</p>
      </div>
    `;

    item.addEventListener("click", () => loadVideo(videoData));

    videoList.appendChild(item);
  });
}

function loadVideo(videoData) {
  video.src = videoData.src;
  video.load();

  video.play();
  isPlaying = true;
  playBtn.textContent = "⏸";

  // UX feedback console (option debug)
  console.log("Now playing:", videoData.title);
}

let activeId = null;

function renderVideos() {
  videoList.innerHTML = "";

  videos.forEach(videoData => {
    const item = document.createElement("div");

    const isActive = activeId === videoData.id;

    item.className =
      `group flex gap-3 p-2 rounded-lg border cursor-pointer transition
       ${isActive ? "bg-white/20 border-white/30" : "bg-white/5 border-white/10 hover:bg-white/10"}`;

    item.innerHTML = `
      <div class="relative w-24 h-14 overflow-hidden rounded-md">
        <img src="${videoData.thumbnail}" 
             class="w-full h-full object-cover group-hover:scale-110 transition duration-300"/>
      </div>

      <div class="flex flex-col justify-center">
        <p class="font-medium text-sm">${videoData.title}</p>
        <p class="text-xs opacity-60">Click to play</p>
      </div>
    `;

    item.addEventListener("click", () => {
      activeId = videoData.id;
      loadVideo(videoData);
      renderVideos();
    });

    videoList.appendChild(item);
  });
}

// ▶ PLAY / PAUSE
function togglePlay() {
  if (isPlaying) {
    video.pause();
    playBtn.textContent = "▶";
  } else {
    video.play();
    playBtn.textContent = "⏸";
  }
  isPlaying = !isPlaying;
}

// 🔊 MUTE
function toggleMute() {
  isMuted = !isMuted;
  video.muted = isMuted;
  muteBtn.textContent = isMuted ? "🔇" : "🔊";
}

// 🔊 VOLUME
volume.addEventListener("input", () => {
  video.volume = volume.value;

  if (video.volume === 0) {
    isMuted = true;
    muteBtn.textContent = "🔇";
  } else {
    isMuted = false;
    muteBtn.textContent = "🔊";
  }
});

// ⛶ FULLSCREEN
function toggleFullscreen() {
  const container = video.parentElement;

  if (!document.fullscreenElement) {
    container.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ⏱ FORMAT TIME
function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// 📊 PROGRESS UPDATE
video.addEventListener("timeupdate", () => {
  progress.value = (video.currentTime / video.duration) * 100;

  timeDisplay.textContent =
    `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
});

// 🎯 SEEK
progress.addEventListener("input", () => {
  video.currentTime = (progress.value / 100) * video.duration;
});

// Pause video when leaving tab
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    video.pause();
    isPlaying = false;
    playBtn.textContent = "▶";
  }
});

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

let isOpen = false;

function toggleMenu() {
  isOpen = !isOpen;

  if (isOpen) {
    sidebar.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
  } else {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  }
}

// events
menuBtn.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);

// EVENTS
playBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);

muteBtn.addEventListener("click", toggleMute);
fullscreenBtn.addEventListener("click", toggleFullscreen);

renderVideos();
loadVideo(videos[0]);