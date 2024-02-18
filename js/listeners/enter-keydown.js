import { htmlRenderer } from "../renderers/html-renderer.js";
import { getFocusedElement, isBlockValid } from "../utils.js";

export const createBlocksOnEnterPress = () => {
  document.addEventListener("keydown", (ev) => {
    const $focusedBlock = getFocusedElement();
    const $currentBlock = isBlockValid($focusedBlock) ? $focusedBlock : null;

    if (ev.key === "Enter" && $currentBlock) {
      ev.preventDefault();

      const $focusedNode = window.getSelection().anchorNode;
      const anchorOffset = window.getSelection().anchorOffset;
      const trimmedOffset = $focusedNode.textContent
        .slice(0, anchorOffset)
        .trim().length;

      // If is not at the end, we should split this block
      if (trimmedOffset !== $currentBlock.innerText.length) {
        const splittedBlockContent =
          $currentBlock.innerText.slice(trimmedOffset);
        $currentBlock.innerText = $currentBlock.innerText.slice(
          0,
          trimmedOffset
        );

        htmlRenderer("action", $currentBlock).innerText = splittedBlockContent;
      }

      const blockType = $currentBlock.classList?.[0];

      if (blockType === "character" || blockType === "parenthetical") {
        htmlRenderer("dialogue", $currentBlock);
      } else {
        htmlRenderer("action", $currentBlock);
      }
    }
  });
};
