console.log("✅ popup.js has loaded!"); // This should always log

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded and popup.js is running!");

    document.getElementById("toggleComments").addEventListener("click", function () {
        console.log("🔘 Toggle button clicked!");
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "toggleComments" });
            console.log("📤 Message sent to content.js!");
        });
    });
});