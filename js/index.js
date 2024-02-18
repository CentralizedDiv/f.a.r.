import { initListeners } from "./listeners/index.js";
import { initObserver } from "./observers.js";

(() => {
  initObserver();
  initListeners();
})();
