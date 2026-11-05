






const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const buttonText = document.getElementById("buttonText");
const buttonIcon = document.getElementById("buttonIcon");
const sparklesContainer = document.getElementById("sparkles");

const startTime = 45; // 0:45
const endTime = 88;   // 1:28

let sparkleInterval = null;
let hasStarted = false;

// Create falling sparkles
function createSparkle() {
  const sparkle = document.createElement("span");

  sparkle.classList.add("sparkle");
  sparkle.textContent = Math.random() > 0.5 ? "✦" : "✧";

  sparkle.style.left = Math.random() * 100 + "vw";
  sparkle.style.animationDuration = (2 + Math.random() * 3) + "s";
  sparkle.style.fontSize = (10 + Math.random() * 20) + "px";

  sparklesContainer.appendChild(sparkle);

  // Remove sparkle after animation
  sparkle.addEventListener("animationend", () => {
    sparkle.remove();
  });
}

// Start falling sparkles
function startSparkles() {
  if (sparkleInterval !== null) return;

  createSparkle();

  sparkleInterval = setInterval(createSparkle, 150);
}

// Stop creating sparkles
function stopSparkles() {
  clearInterval(sparkleInterval);
  sparkleInterval = null;
}

// Update the button appearance
function updateButton(isPlaying) {
  buttonText.textContent = isPlaying ? "Pause Music" : "Play Music";
  buttonIcon.textContent = isPlaying ? "❚❚" : "▶";
}

// Play or pause music
musicButton.addEventListener("click", async () => {
  if (music.paused) {
    // Start from 0:45 on the first play or after the clip ends
    if (!hasStarted || music.currentTime >= endTime) {
      music.currentTime = startTime;
      hasStarted = true;
    }

    try {
      await music.play();
      startSparkles();
      updateButton(true);
    } catch (error) {
      console.error("Unable to play audio:", error);
    }
  } else {
    music.pause();
    stopSparkles();
    updateButton(false);
  }
});

// Stop automatically at 1:28
music.addEventListener("timeupdate", () => {
  if (music.currentTime >= endTime) {
    music.pause();
    music.currentTime = endTime;

    stopSparkles();
    updateButton(false);
  }
});

// Keep button and sparkles in sync if audio pauses or ends
music.addEventListener("pause", () => {
  stopSparkles();
  updateButton(false);
});

music.addEventListener("ended", () => {
  stopSparkles();
  updateButton(false);
  hasStarted = false;
});
