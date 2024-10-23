// Helper functions that can be used without React
export const toggleClass = (el, className) => {
  let elem = document.querySelector(el);
  if (elem) {
    elem.classList.toggle(className);
  }
};

export const removeClass = (el, className) => {
  let elem = document.querySelector(el);
  if (elem) {
    elem.classList.remove(className);
  }
};

// Base URL for your API
export const api_base_url = "http://localhost:3000";
