function waitForModules(callback) {
  const requiredModules = ["blockingOverlay", "autoplayControl", "searchBarListeners"];
  const checkInterval = setInterval(() => {
    const missingModules = requiredModules.filter(module => !window[module]);
    
    if (missingModules.length === 0) {
      clearInterval(checkInterval);
      console.log("✅ All modules loaded. Running content.js...");
      callback(); // Run main logic
    } else {
      console.warn(`⏳ Waiting for modules: ${missingModules.join(", ")}`);
    }
  }, 100);
}

// Wait until all modules are available before running content.js
waitForModules(() => {
  console.log("🚀 Running page load functions...");
  const moduleNames = ["blockingOverlay", "autoplayControl", "searchBarListeners"];

  moduleNames.forEach((moduleName) => {
    if (window[moduleName]) {
      console.log(`✅ Found module: ${moduleName}`);
      Object.entries(window[moduleName]).forEach(([fnName, fn]) => {
        if (typeof fn === "function" && fnName !== "init") {
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
