// PAGE BLOCKING FUNCTIONS
// Block the For You Page (unless on search results) and the Explore Page.
export function blockForYouPage() {
  if (isSearchResultsPage()) {
    console.log("🔎 Search results detected, skipping For You Page block.");
    return;
  }
  console.log("✅ Blocking For You Page...");
  createBlockingOverlay("For You Page");
}

export function blockExplorePage() {
  if (isSearchResultsPage()) {
    console.log("🔎 Search results detected, skipping For You Page block.");
    return;
  }
  console.log("✅ Blocking Explore Page...");
  createBlockingOverlay("Explore Page");
}