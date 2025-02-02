console.log("✅ content.js is running on TikTok!");

// 🎯 Function to check if the user is on a specific page
function isSearchResultsPage() {
    return window.location.pathname.includes("/search");
}

function isExplorePage() {
    return window.location.pathname.includes("/explore");
}

function isForYouPage() {
    return window.location.pathname === "/";
}

// 🚫 **Disable Autoplay for ALL Videos**
function disableAutoplay() {
    console.log("🚫 Disabling autoplay...");

    const videos = document.querySelectorAll("video");

    videos.forEach(video => {
        video.pause();
        video.autoplay = false;
        video.removeAttribute("autoplay");
        video.muted = true;
        video.playbackRate = 0;

        video.addEventListener("play", function (event) {
            if (!event.isTrusted) {
                console.log("⛔ Autoplay attempt blocked!");
                event.target.pause();
                event.target.muted = true;
                event.target.playbackRate = 0;
            }
        });

        console.log("✅ Autoplay disabled on a video");
    });
}

// 🚫 **Fix For You Page Autoplay When Switching Back**
document.addEventListener("visibilitychange", function () {
    if (!document.hidden && isForYouPage()) {
        console.log("🔄 Tab became active. Re-blocking autoplay...");
        disableAutoplay();
    }
});

// 🚫 **Stop Explore Page Autoplay**
function stopExploreAutoplay() {
    console.log("🚫 Stopping Explore Page autoplay...");

    if (!isExplorePage()) {
        return;
    }

    const exploreVideos = document.querySelectorAll("video");

    exploreVideos.forEach(video => {
        video.pause();
        video.autoplay = false;
        video.removeAttribute("autoplay");
        video.muted = true;
        video.playbackRate = 0;
        console.log("⛔ Explore page video autoplay blocked.");
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === "VIDEO") {
                    console.log("🔍 New Explore video detected! Blocking autoplay...");
                    node.pause();
                    node.autoplay = false;
                    node.removeAttribute("autoplay");
                    node.muted = true;
                    node.playbackRate = 0;
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// 🎯 **Create Double-Layer Blocking Background (Fix Navigation UI)**
function createBlockingOverlay(pageName) {
    let existingFullBackground = document.getElementById("fullBlackBackground");
    let existingOverlay = document.getElementById("blockingOverlay");

    // ✅ Layer 1: Full-Page Black Background (Covers All Videos, Lower Z-Index)
    if (!existingFullBackground) {
        let fullBackground = document.createElement("div");
        fullBackground.id = "fullBlackBackground";
        fullBackground.style.cssText = `
            position: fixed;
            top: 0;
            overlay.style.left = "300px";  // Increased from 280px to ensure full clearance
            overlay.style.width = "calc(100vw - 300px)";  // Prevents overlap with sidebar
            height: 100vh;
            background-color: black;
            z-index: 9997; /* Lower than UI elements */
        `;
        document.body.appendChild(fullBackground);
    }

    // ✅ Layer 2: Message Overlay (Allows UI Elements to Stay Visible)
    if (!existingOverlay) {
        let overlay = document.createElement("div");
        overlay.id = "blockingOverlay";
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 280px; /* Adjusted for navigation buttons */
            width: calc(100vw - 280px);
            height: 100vh;
            background-color: black;
            z-index: 9998; /* Below UI elements but above background */
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 22px;
            font-weight: bold;
            color: #fff;
            text-align: center;
            padding: 20px;
            line-height: 1.5;
        `;
        overlay.innerText = `🔵 Stay Focused – The ${pageName} is blocked by Distraction-Free TikTok.`;
        document.body.appendChild(overlay);
    }
}

// 🎯 **Block For You Page**
function replaceForYouPage() {
    if (isSearchResultsPage()) {
        console.log("🔎 Search results detected, skipping For You Page block.");
        return;
    }

    console.log("✅ Blocking For You Page...");
    createBlockingOverlay("For You Page");
}

// 🎯 **Block Explore Page**
function blockExplorePage() {
    if (isSearchResultsPage()) {
        console.log("🔎 Search results detected, skipping Explore Page block.");
        return;
    }

    console.log("✅ Blocking Explore Page...");
    createBlockingOverlay("Explore Page");
}

// 🎯 **Adjust Background for Search Bar**
function adjustForSearchBar() {
    const searchBar = document.querySelector("input[type='text']");
    const overlay = document.getElementById("blockingOverlay");

    if (!searchBar || !overlay) {
        console.log("❌ Search bar or blocking overlay not found.");
        return;
    }

    searchBar.addEventListener("focus", () => {
        console.log("🔎 Search bar focused, adjusting layout...");
        overlay.style.left = "360px"; // Further adjusted for search dropdown
        overlay.style.width = "calc(100vw - 360px)";
    });

    searchBar.addEventListener("blur", () => {
        console.log("🔎 Search bar unfocused, resetting layout...");
        overlay.style.left = "280px"; // Restore original width
        overlay.style.width = "calc(100vw - 280px)";
    });
}

// 🎯 **Monitor dynamically loaded videos & page reloads**
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.tagName === "VIDEO") {
                console.log("🔍 New video detected! Disabling autoplay...");
                disableAutoplay();
            } else if (isExplorePage()) {
                console.log("🔄 Explore Page reloaded, stopping autoplay...");
                stopExploreAutoplay();
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });

// 🎯 **Run on Page Load**
window.addEventListener("load", () => {
    replaceForYouPage();
    blockExplorePage();
    disableAutoplay();
    stopExploreAutoplay();
    adjustForSearchBar();
});