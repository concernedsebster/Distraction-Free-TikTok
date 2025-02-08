// SEARCH BAR LISTENERS 
// When the search bar is focused, raise the search dropdown above the overlay.
window.searchBarListeners = {
  adjustSearchDropdownZIndex: function () {
    const searchDropdown = document.querySelector(".css-1x87i4d-DivDrawerContainer.e1lvfea00.drawer-enter-done");
    if (searchDropdown) {
      searchDropdown.style.zIndex = "100000";  // ensure it sits above the overlay
      searchDropdown.style.position = "relative";
      console.log("🔎 Elevated search dropdown above overlay.");
    }
  },

  setupSearchBarListeners: function () {
    const searchBar = document.querySelector("input[type='text']");
    if (searchBar) {
      searchBar.addEventListener("focus", () => {
        console.log("🔎 Search bar focused.");
        window.searchBarListeners.adjustSearchDropdownZIndex(); // ✅ Corrected reference
      });
      searchBar.addEventListener("blur", () => {
        console.log("🔎 Search bar unfocused.");
        const searchDropdown = document.querySelector(".css-1x87i4d-DivDrawerContainer.e1lvfea00.drawer-enter-done");
        if (searchDropdown) {
          searchDropdown.style.zIndex = "";
          searchDropdown.style.position = "";
        }
      });
    }
  }
};
