import { htmlRenderer } from "../renderers/html-renderer.js";
import { getFocusedElement, isBlockValid, validShortcuts } from "../utils.js";

export const createBlocksOnShortcutsPress = () => {
  document.addEventListener("keydown", (ev) => {
    const $focusedBlock = getFocusedElement();
    const $currentBlock = isBlockValid($focusedBlock) ? $focusedBlock : null;

    if (ev.ctrlKey && validShortcuts.includes(ev.code)) {
      switch (ev.code) {
        case "KeyS":
          htmlRenderer("scene", $currentBlock, true);
          break;
        case "KeyA":
          htmlRenderer("action", $currentBlock, true);
          break;
        case "KeyC":
          htmlRenderer("character", $currentBlock, true);
          break;
        case "KeyD":
          htmlRenderer("dialogue", $currentBlock, true);
          break;
        case "KeyT":
          htmlRenderer("transition", $currentBlock, true);
          break;
        case "KeyP":
          htmlRenderer("parenthetical", $currentBlock, true);
          break;
      }
    }
  });
};
