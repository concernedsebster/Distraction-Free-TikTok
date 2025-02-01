console.log("✅ content.js is running on TikTok!");

// 🎯 Function to hide elements without breaking layout
function hideElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = "none";
        console.log(`🚫 Hiding element: ${selector}`);
    } else {
        console.log(`❌ Element not found: ${selector}`);
    }
}

// 🎯 Function to block For You Page while keeping navigation buttons
function blockForYouPage() {
    const forYouPage = document.querySelector(".css-3xtvlt-DivColumnListContainer.ettyzn40");

    if (forYouPage) {
        console.log("✅ For You Page found, blocking content...");
        forYouPage.style.display = "none";

        let existingMessage = document.getElementById("focusMessageFYP");
        if (existingMessage) existingMessage.remove();

        let message = document.createElement("div");
        message.id = "focusMessageFYP";
        message.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: calc(100vw - 240px); /* Adjust so sidebar is visible */
            position: fixed;
            top: 0;
            left: 240px;
            font-size: 24px;
            font-weight: bold;
            color: #fff;
            background-color: black;
            text-align: center;
            z-index: 9999;
        `;
        message.innerText = "🔵 Stay Focused – The For You Page is blocked by Distraction-Free TikTok.";
        document.body.appendChild(message);
    } else {
        console.log("❌ For You Page container not found.");
    }
}

// 🎯 Function to block Explore Page while keeping navigation buttons
function blockExplorePage() {
    const explorePage = document.querySelector(".css-1yczxwx-DivBodyContainer.e1rlp0w0") ||
                        document.querySelector("[id='main-content-explore_page']");

    if (explorePage) {
        console.log("✅ Explore Page found, blocking content...");
        explorePage.style.display = "none";

        let existingMessage = document.getElementById("focusMessageExplore");
        if (existingMessage) existingMessage.remove();

        let message = document.createElement("div");
        message.id = "focusMessageExplore";
        message.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: calc(100vw - 240px);
            position: fixed;
            top: 0;
            left: 240px;
            font-size: 24px;
            font-weight: bold;
            color: #fff;
            background-color: black;
            text-align: center;
            z-index: 9999;
        `;
        message.innerText = "🔵 Stay Focused – The Explore Page is blocked by Distraction-Free TikTok.";
        document.body.appendChild(message);

        // 🌟 EXTRA FIX: Ensure we remove any background videos
        stopExploreAutoplay();
    } else {
        console.log("❌ Explore Page container not found.");
    }
}

// 🚫 Improved Autoplay Blocker (Allows User Clicks)
function disableAutoplay() {
    console.log("🚫 Disabling autoplay...");

    const videos = document.querySelectorAll("video");

    videos.forEach(video => {
        video.pause();
        video.autoplay = false;
        video.removeAttribute("autoplay");

        // Prevent autoplay, but allow user-initiated play
        video.addEventListener("play", function (event) {
            if (!event.isTrusted) { // Ensures only user-initiated actions are allowed
                console.log("⛔ Autoplay attempt blocked!");
                event.target.pause();
            }
        });

        console.log("✅ Autoplay disabled on a video");
    });

    // Explicitly stop background autoplay videos
    stopExploreAutoplay();
}

// 🚫 Function to block background autoplay on the Explore Page
function stopExploreAutoplay() {
    console.log("🚫 Stopping background autoplay videos on Explore Page...");

    const exploreVideos = document.querySelectorAll(".css-xyz-BackgroundVideoContainer video, .css-explore-featured video");
    exploreVideos.forEach(video => {
        video.pause();
        video.autoplay = false;
        video.removeAttribute("autoplay");

        console.log("✅ Background autoplay video disabled.");
    });
}

// 🔄 MutationObserver to Catch Any New Autoplaying Videos
const videoObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.tagName === "VIDEO") {
                console.log("🔍 New video detected! Disabling autoplay...");
                disableAutoplay();
            }
        });
    });
});
videoObserver.observe(document.body, { childList: true, subtree: true });

// 🚀 Run immediately on page load
window.addEventListener("load", disableAutoplay);

// 🚫 Function to block right-side comments when clicking a video
function blockRightSideComments() {
    const rightSideComments = document.querySelector(".css-123-UiRightSideComments");
    if (rightSideComments) {
        rightSideComments.style.display = "none";
        console.log("🚫 Right-side comments hidden.");
    } else {
        console.log("❌ Right-side comments not found.");
    }
}

// 🎯 Function to ensure the left sidebar remains visible
function ensureLeftSidebar() {
    const sidebar = document.querySelector(".css-1ssz0ba-DivSideNavContainer"); // Adjust selector if needed
    if (sidebar) {
        sidebar.style.display = "block"; // Ensure it remains visible
        console.log("✅ Left sidebar remains visible.");
    } else {
        console.log("❌ Left sidebar not found, check selector.");
    }
}

// 🎯 Observe dynamically added videos & page reloads
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.tagName === "VIDEO") {
                console.log("🔍 New video detected! Disabling autoplay...");
                disableAutoplay();
            } else if (node.classList?.contains("css-3xtvlt-DivColumnListContainer")) {
                console.log("🔄 For You Page reloaded, replacing again...");
                blockForYouPage();
            } else if (node.classList?.contains("css-1yczxwx-DivBodyContainer")) {
                console.log("🔄 Explore Page reloaded, replacing again...");
                blockExplorePage();
            } else if (node.classList?.contains("css-123-UiRightSideComments")) {
                console.log("🔄 Right-side comments reloaded, hiding again...");
                blockRightSideComments();
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });

// 🚀 Run immediately on page load
window.addEventListener("load", () => {
    blockForYouPage();
    blockExplorePage();
    ensureLeftSidebar();
    hideElement(".css-x4xlc7-DivCommentContainer"); // Hide Bottom Comments
    blockRightSideComments(); // Hide Right-Side Comments
    hideElement(".css-xyz-DivRelatedVideos"); // Hide Related Videos
    disableAutoplay();
});

// 🔄 Stop autoplay when switching back to TikTok tab
document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
        console.log("🔄 Tab became active. Checking autoplay...");
        disableAutoplay();
    }
});