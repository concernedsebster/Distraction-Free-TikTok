chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("🔍 Tab Update Event Fired!");
    console.log("Tab Object:", tab); // ✅ This will confirm if `tab` exists
    console.log("Change Info:", changeInfo); // ✅ Check what `changeInfo` contains
  
    if (changeInfo.status === "complete" && tab && tab.url && tab.url.includes("tiktok.com")) {
      console.log("✅ Injecting content.js into TikTok...");
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["dist/content.js"]
      });
    } else {
      console.warn("⚠️ Skipping script injection - Tab URL missing or invalid");
    }
  });