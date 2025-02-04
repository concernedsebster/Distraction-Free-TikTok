// SEARCH BAR LISTENERS 
// When the search bar is focused, raise the search dropdown above the overlay.
export function adjustSearchDropdownZIndex() {
    const searchDropdown = document.querySelector(".css-1x87i4d-DivDrawerContainer.e1lvfea00.drawer-enter-done");
    if (searchDropdown) {
      searchDropdown.style.zIndex = "100000";  // ensure it sits above the overlay
      searchDropdown.style.position = "relative";
      console.log("🔎 Elevated search dropdown above overlay.");
    }
  }
  export function setupSearchBarListeners() {
    const searchBar = document.querySelector("input[type='text']");
    if (searchBar) {
      searchBar.addEventListener("focus", () => {
        console.log("🔎 Search bar focused.");
        adjustSearchDropdownZIndex();
      });
      // Optionally, reset the dropdown styling on blur if needed.
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