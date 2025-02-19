(function () {
  console.log("🚀 Waiting for blockingOverlay.js to load...");

  if (!window.contentScriptHasRun) {
    window.contentScriptHasRun = true; // Prevent multiple executions

    function waitForBlockingOverlay() {
      return new Promise((resolve, reject) => {
        let retries = 0;
        const maxRetries = 50; // Prevent infinite loop
        const interval = setInterval(() => {
          retries++;
          if (window.blockingOverlay && typeof window.blockingOverlay.blockPage === "function") {
            clearInterval(interval);
            resolve();
          } else if (retries >= maxRetries) {
            clearInterval(interval);
            reject(new Error("❌ Timed out waiting for blockingOverlay"));
          }
        }, 100); // Check every 100ms
      });
    }

    waitForBlockingOverlay()
      .then(() => {
        console.log("✅ blockingOverlay is ready! Running page load functions...");
        console.log("🔍 window.blockingOverlay:", window.blockingOverlay);
        
        if (typeof window.blockingOverlay.blockPage === "function") {
          window.blockingOverlay.blockPage();
        } else {
          console.error("❌ Error: window.blockingOverlay.blockPage is not a function.");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });

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
  } else {
    console.log("⚠️ Content script has already run, skipping execution.");
  }
})();