window.addEventListener("load", () => {
  console.log("🚀 Running page load functions...");

  if (!window.blockingOverlay) {
    console.warn("⚠️ blockingOverlay module is missing at load time. Some functions may not work.");
  } else if (!window.blockingOverlay.isExplorePage) {
    console.warn("⚠️ isExplorePage() is missing in blockingOverlay.");
  }

  const moduleNames = [
    "blockingOverlay",
    "autoplayControl",
    "searchBarListeners"
  ];

  moduleNames.forEach((moduleName) => {
    if (window[moduleName]) {
      Object.entries(window[moduleName]).forEach(([fnName, fn]) => {
        if (typeof fn === "function" && fnName !== "init") { // ✅ Skip calling init() here
          try {
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