window.API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:3000" 
  : "http://" + window.location.hostname + ":3000";

window.WS_URL = window.location.hostname === "localhost"
  ? "ws://localhost:3000"
  : "ws://" + window.location.hostname + ":3000";

console.log("API endpoints overridden:", {
  API_BASE_URL: window.API_BASE_URL,
  WS_URL: window.WS_URL
});
