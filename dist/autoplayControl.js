// AUTOPLAY CONTROL MODULE  
window.autoplayControl = {
  // Prevent any script from later setting the autoplay attribute.
  overrideAutoplaySetting: function() {
    const originalSetAttribute = HTMLMediaElement.prototype.setAttribute;
    HTMLMediaElement.prototype.setAttribute = function(name, value) {
      if (name.toLowerCase() === "autoplay") {
        console.log("⛔ Blocked setting autoplay on", this);
        return;
      }
      return originalSetAttribute.call(this, name, value);
    };
  },

  // Disable autoplay for a single video element.
  disableAutoplayOnVideo: function(video) {
    if (!video) return;
    video.pause();
    video.autoplay = false;
    video.removeAttribute("autoplay");
    video.muted = true;
    video.playbackRate = 0;
    if (!video.hasAttribute("data-autoplay-blocked")) {
      video.addEventListener("play", function(event) {
        if (typeof window.blockingOverlay !== "undefined" &&
          typeof window.blockingOverlay.isExplorePage === "function" &&
          window.blockingOverlay.isExplorePage())   {  
          console.log("⛔ Blocking autoplay attempt on Explore page video:", video);
          video.pause();
        } else if (!event.isTrusted) {
          console.log("⛔ Autoplay attempt blocked on video:", video);
          video.pause();
        }
      });
      video.setAttribute("data-autoplay-blocked", "true");
    }
  },

  // Disable autoplay on all current video elements.
  disableAutoplay: function() {
    const videos = document.querySelectorAll("video");
    videos.forEach(video => window.autoplayControl.disableAutoplayOnVideo(video));
  },

  // Observe for newly added video elements and disable autoplay on them.
  observeNewVideos: function() {
    const videoObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === "VIDEO") {
              console.log("🔍 New video element detected.");
              window.autoplayControl.disableAutoplayOnVideo(node);
            } else {
              const vids = node.querySelectorAll ? node.querySelectorAll("video") : [];
              vids.forEach(video => {
                console.log("🔍 New video (inside added node) detected.");
                window.autoplayControl.disableAutoplayOnVideo(video);
              });
            }
          }
        });
      });
    });
    videoObserver.observe(document.body, { childList: true, subtree: true });
  },

  // Continuously check for autoplaying videos on the Explore page.
  preventExploreAutoplay: function() {
    if (window.blockingOverlay && window.blockingOverlay.isExplorePage && window.blockingOverlay.isExplorePage()) {  // ✅ Ensure function exists
      setInterval(() => {
        document.querySelectorAll("video").forEach(video => {
          if (!video.paused) {
            console.log("⛔ Detected playing video on Explore page, pausing:", video);
            video.pause();
          }
        });
      }, 500);
    }
  },

  // Reapply autoplay blocking when the tab becomes active.
  reapplyOnTabActive: function() {
    document.addEventListener("visibilitychange", function() {
      if (!document.hidden) {
        console.log("🔄 Tab became active, re-disabling autoplay...");
        window.autoplayControl.disableAutoplay();
      }
    });
  },

  // Initialize all autoplay-related blocking features.
  init: function() {
    console.log("🚀 Initializing Autoplay Control...");
    window.autoplayControl.overrideAutoplaySetting();
    window.autoplayControl.disableAutoplay();
    window.autoplayControl.observeNewVideos();
    window.autoplayControl.preventExploreAutoplay();
    window.autoplayControl.reapplyOnTabActive();
  }
};

const waitForBlockingOverlay = setInterval(() => {
  if (window.blockingOverlay && typeof window.blockingOverlay.isExplorePage === "function") {
    console.log("✅ blockingOverlay detected, proceeding with autoplay control...");
    clearInterval(waitForBlockingOverlay);
    window.autoplayControl.init(); // ✅ Run autoplay control once dependencies are available
  }
}, 100);
