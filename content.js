console.log("✅ content.js is running on TikTok!");

// ─── 1. OVERRIDE VIDEO AUTOPLAY SETTING ─────────────────────────────
// Prevent any script from later setting the autoplay attribute.
const originalSetAttribute = HTMLMediaElement.prototype.setAttribute;
HTMLMediaElement.prototype.setAttribute = function(name, value) {
  if (name.toLowerCase() === "autoplay") {
    console.log("⛔ Blocked setting autoplay on", this);
    return;
  }
  return originalSetAttribute.call(this, name, value);
};

// ─── 2. PAGE DETECTION HELPERS ─────────────────────────────────────────
function isSearchResultsPage() {
  return window.location.pathname.includes("/search");
}
function isExplorePage() {
  return window.location.pathname.includes("/explore");
}
function isForYouPage() {
  return window.location.pathname === "/";
}

// ─── 3. BLOCKING OVERLAY MANAGEMENT ─────────────────────────────────────
// This function creates (or re-displays) the blocking overlay for the specified page.
// The overlay only covers the main content (from 390px from the left onward), so your
// left navigation remains visible.
function createBlockingOverlay(pageType) {
  let overlayId =
    pageType === "For You Page" ? "focusMessageFYP" :
    pageType === "Explore Page" ? "focusMessageExplore" :
    "focusMessageOverlay";
    
  let existing = document.getElementById(overlayId);
  if (existing) {
    // If the overlay exists (or was re-inserted), ensure it’s visible.
    existing.style.display = "flex";
    return;
  }
  
  const overlay = document.createElement("div");
  overlay.id = overlayId;
  overlay.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: calc(100vw - 390px);  /* leave left 390px for navigation */
    position: fixed;
    top: 0;
    left: 390px;
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    text-align: center;
    z-index: 99999;
  `;
  overlay.innerText = `🔵 Stay Focused – The ${pageType} is blocked by Distraction-Free TikTok.`;
  document.body.appendChild(overlay);
  console.log(`✅ Blocking overlay for "${pageType}" created.`);

  // In case TikTok or another script removes the overlay, observe and re-add it.
  const overlayObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node === overlay) {
          console.warn(`⚠️ Overlay ${overlayId} was removed – re-adding it.`);
          createBlockingOverlay(pageType);
        }
      });
    });
  });
  overlayObserver.observe(document.body, { childList: true });
}

/* 
4. AUTOPLAY BLOCKING
   Updated: Now, on the Explore page, every attempt to play a video is logged and blocked,
   even after page refresh, with a continuous check for any playing videos.
*/

// Disable autoplay for a single video element.
function disableAutoplayOnVideo(video) {
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
  function disableAutoplay() {
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

// ─── 5. SEARCH BAR LISTENERS ─────────────────────────────────────────────
// When the search bar is focused, raise the search dropdown above the overlay.
function adjustSearchDropdownZIndex() {
  const searchDropdown = document.querySelector(".css-1x87i4d-DivDrawerContainer.e1lvfea00.drawer-enter-done");
  if (searchDropdown) {
    searchDropdown.style.zIndex = "100000";  // ensure it sits above the overlay
    searchDropdown.style.position = "relative";
    console.log("🔎 Elevated search dropdown above overlay.");
  }
}
function setupSearchBarListeners() {
  const searchBar = document.querySelector("input[type='text']");
  if (searchBar) {
    searchBar.addEventListener("focus", () => {
      console.log("🔎 Search bar focused.");
      adjustSearchDropdownZIndex();
    });
    // Optionally, reset the dropdown styling on blur if needed.
    searchBar.addEventListener("blur", () => {
      console.log("🔎 Search bar unfocused.");
      const searchDropdown = document.querySelector(".css-1x87i4d-DivDrawerContainer.e1lvfea00.drawer-enter-done");
      if (searchDropdown) {
        searchDropdown.style.zIndex = "";
        searchDropdown.style.position = "";
      }
    });
  }
}

// ─── 6. PAGE BLOCKING FUNCTIONS ─────────────────────────────────────────
// Block the For You Page (unless on search results) and the Explore Page.
function blockForYouPage() {
  if (isSearchResultsPage()) {
    console.log("🔎 Search results detected, skipping For You Page block.");
    return;
  }
  console.log("✅ Blocking For You Page...");
  createBlockingOverlay("For You Page");
}
function blockExplorePage() {
  if (isSearchResultsPage()) {
    console.log("🔎 Search results detected, skipping Explore Page block.");
    return;
  }
  console.log("✅ Blocking Explore Page...");
  createBlockingOverlay("Explore Page");
}

// ─── 7. INITIALIZATION ON PAGE LOAD ─────────────────────────────────────
window.addEventListener("load", () => {
  console.log("🚀 Running page load functions...");
  blockForYouPage();
  blockExplorePage();
  disableAutoplay();
  setupSearchBarListeners();
});