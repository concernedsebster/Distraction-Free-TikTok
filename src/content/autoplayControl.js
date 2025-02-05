// OVERRIDE VIDEO AUTOPLAY SETTING 
// Prevent any script from later setting the autoplay attribute.
const originalSetAttribute = HTMLMediaElement.prototype.setAttribute;
HTMLMediaElement.prototype.setAttribute = function(name, value) {
  if (name.toLowerCase() === "autoplay") {
    console.log("⛔ Blocked setting autoplay on", this);
    return;
  }
  return originalSetAttribute.call(this, name, value);
};
/* 
AUTOPLAY BLOCKING
   Updated: Now, on the Explore page, every attempt to play a video is logged and blocked,
   even after page refresh, with a continuous check for any playing videos.
*/

// Disable autoplay for a single video element.
window.disableAutoplayOnVideo = function(video) {
  if (!video) return;
  // Immediately pause and remove autoplay attributes.
  video.pause();
  video.autoplay = false;
  video.removeAttribute("autoplay");
  video.muted = true;
  video.playbackRate = 0;
  // Add an event listener if not already added.
  if (!video.hasAttribute("data-autoplay-blocked")) {
    video.addEventListener("play", function (event) {
      if (isExplorePage()) {
        console.log("⛔ Blocking autoplay attempt on Explore page video:", video);
        video.pause();
      } else if (!event.isTrusted) {
        console.log("⛔ Autoplay attempt blocked on video:", video);
        video.pause();
      }
    });
    video.setAttribute("data-autoplay-blocked", "true");
  }
}

// Disable autoplay on all current video elements.
window.disableAutoplay = function () {
  const videos = document.querySelectorAll("video");
  videos.forEach(video => disableAutoplayOnVideo(video));
}

// On the Explore page, continuously check every 500ms for any playing video and pause it.
if (isExplorePage()) {
  setInterval(() => {
    document.querySelectorAll("video").forEach(video => {
      if (!video.paused) {
        console.log("⛔ Detected playing video on Explore page, pausing:", video);
        video.pause();
      }
    });
  }, 500);
}

// Observe for newly added video elements and disable autoplay on them.
const videoObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === "VIDEO") {
          console.log("🔍 New video element detected.");
          disableAutoplayOnVideo(node);
        } else {
          const vids = node.querySelectorAll ? node.querySelectorAll("video") : [];
          vids.forEach(video => {
            console.log("🔍 New video (inside added node) detected.");
            disableAutoplayOnVideo(video);
          });
        }
      }
    });
  });
});
videoObserver.observe(document.body, { childList: true, subtree: true });

// Reapply autoplay blocking when the tab becomes active.
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    console.log("🔄 Tab became active, re-disabling autoplay...");
    disableAutoplay();
  }
});