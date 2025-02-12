console.log("🚀 Waiting for blockingOverlay.js to load...");

(function waitForBlockingOverlay() {
  if (window.blockingOverlay && typeof window.blockingOverlay.createBlockingOverlay === "function") {
    console.log("✅ blockingOverlay.js is now available!");
    window.blockingOverlay.createBlockingOverlay();
  } else {
    console.warn("⏳ blockingOverlay.js not ready yet, retrying...");
    setTimeout(waitForBlockingOverlay, 50);  // Retry every 50ms
  }
})();

console.log("✅ All modules loaded. Running content.js...");

window.addEventListener("load", () => {
  console.log("🚀 Running page load functions...");

  const moduleNames = ["blockingOverlay", "autoplayControl", "searchBarListeners"];

  moduleNames.forEach((moduleName) => {
    if (window[moduleName]) {
      Object.entries(window[moduleName]).forEach(([fnName, fn]) => {
        // ✅ Prevent calling createBlockingOverlay() directly
        if (typeof fn === "function" && fnName !== "init" && fnName !== "createBlockingOverlay") { 
          try {
            console.log(`▶️ Calling ${moduleName}.${fnName}()`);
            fn();
          } catch (error) {
            console.error(`❌ Error calling function ${fnName} in module ${moduleName}:`, error);
          }
        }
      });
    } else {
      console.warn(`⚠️ Module ${moduleName} not found on window.`);
    }
  });
});
