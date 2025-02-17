window.blockingOverlay = window.blockingOverlay || {};

(function() {
  console.log("✅ blockingOverlay.js is running!");

  function createBlockingOverlay() {
    console.log("🛠️ Creating Shadow DOM Blocking Overlay");

    let overlayId = "focusMessageOverlay";
    let existing = document.getElementById(overlayId);
    if (existing) {
      existing.style.display = "flex";
      return;
    }

    // Create an invisible host element
    const shadowHost = document.createElement("div");
    shadowHost.id = overlayId;
    document.body.appendChild(shadowHost);

    // Attach Shadow DOM
    const shadow = shadowHost.attachShadow({ mode: "closed" });

    // Create the overlay inside the Shadow DOM
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
      position: fixed;
      top: 0;
      left: 0;
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      text-align: center;
      z-index: 99999;
    `;
    overlay.innerText = "🔵 Stay Focused – This page is blocked by Distraction-Free TikTok.";

    // Append to Shadow DOM
    shadow.appendChild(overlay);
    console.log(`✅ Shadow DOM Blocking Overlay created.`);
  }

  window.blockingOverlay.create = createBlockingOverlay;
})();