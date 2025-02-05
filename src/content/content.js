console.log("✅ content.js is running on TikTok!");
console.log("Module URL:", import.meta.url); // Should log a chrome-extension:// URL

window.addEventListener("load", () => {
  console.log("🚀 Running page load functions...");

  // List all module names (matching how functions are attached to `window`)
  const moduleNames = [
    "blockingOverlay",
    "autoplayControl",
    "searchBarListeners"
  ];

  // Loop through each module name and call all functions within it
  moduleNames.forEach((moduleName) => {
    if (window[moduleName]) {
      Object.values(window[moduleName]).forEach((fn) => {
        if (typeof fn === "function") {
          try {
            fn(); // Call each function dynamically
          } catch (error) {
            console.error(`❌ Error calling function in module ${moduleName}:`, error);
          }
        }
      });
    } else {
      console.warn(`⚠️ Module ${moduleName} not found on window.`);
    }
  });
});