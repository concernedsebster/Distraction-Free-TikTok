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