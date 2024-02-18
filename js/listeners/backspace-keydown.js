import { getFocusedElement, isBlockValid } from "../utils.js";

export const recalculateSceneNumberAndPreventEraseOnBackspacePress = () => {
  document.addEventListener("keydown", (ev) => {
    const $focusedBlock = getFocusedElement();
    const $currentBlock = isBlockValid($focusedBlock) ? $focusedBlock : null;

    if (ev.key === "Backspace") {
      const $page = document.getElementById("page");
      const content = $page.innerText.trim();
      if ($page.children.length === 1 && content.length === 0) {
        ev.preventDefault();
      } else {
        if (
          $currentBlock?.classList.contains("scene") &&
          $currentBlock?.innerText.trim() === ""
        ) {
          setTimeout(() => {
            Array.from(document.getElementsByClassName("scene")).forEach(
              (scene, index) => {
                scene.dataset.sceneNumber = index + 1;
              }
            );
          });
        }
      }
    }
  });
};
