// PAGE DETECTION HELPERS
export function isSearchResultsPage() {
    return window.location.pathname.includes("/search");
  }
  export function isExplorePage() {
    return window.location.pathname.includes("/explore");
  }
  export function isForYouPage() {
    return window.location.pathname === "/";
  }