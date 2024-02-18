import { htmlRenderer } from "../renderers/html-renderer.js";
import { getFocusedElement } from "../utils.js";

const hideDropdown = ($el) => {
  $el?.classList.toggle("hidden");
  setTimeout(() => {
    $el?.classList.toggle("hidden");
  });
};

export const createBlocksOnHeaderButtonsClick = () => {
  document.getElementById("new-blocks").addEventListener("click", (ev) => {
    hideDropdown(ev.target?.parentElement);
    htmlRenderer(
      ev.target?.id?.split("new-")?.[1] ?? "action",
      getFocusedElement(),
      true
    );
  });
};
