window.API_BASE_URL = "http://135.236.212.218:3000";
window.WS_URL = "ws://135.236.212.218:3000";
console.log("API endpoints hardcoded:", {
  API_BASE_URL: window.API_BASE_URL,
  WS_URL: window.WS_URL
});

// Override fetch to catch any API calls
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === "string" && url.includes("/generate-workout")) {
    url = window.API_BASE_URL + "/generate-workout";
    console.log("Redirecting to:", url);
  }
  return originalFetch(url, options);
};