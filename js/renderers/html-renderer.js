import { state } from "../state.js";

const htmlRenderers = {
  scene: ($scene) => {
    $scene.dataset.sceneNumber = state.currentScript.currentSceneNumber;
  },
  parenthetical: ($parenthetical) => {
    $parenthetical.innerText = `(${$parenthetical.innerText.trim()})`;

    // Run after the current call stack because we're changing innerText above
    setTimeout(() => {
      const range = document.createRange();
      range.setStart($parenthetical.firstChild, 1);
      range.collapse(true);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
  },
};

export const htmlRenderer = (blockType, $currentBlock, replace = false) => {
  let $block;

  if (replace && $currentBlock) {
    $currentBlock.classList.remove($currentBlock.classList[0]);
    $block = $currentBlock;
  } else {
    $block = document.createElement("div");
    $block.innerHTML = "<br>";
    $block.tabIndex = 0;

    if ($currentBlock) {
      $currentBlock.parentNode.insertBefore($block, $currentBlock.nextSibling);
    } else {
      const $page = document.getElementById("page");
      $page.append($block);
    }
  }

  $block.classList.add(blockType);

  $block.focus?.();
  const range = document.createRange();
  range.selectNodeContents($block.firstChild ?? $block);
  range.collapse(false);

  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  if (blockType === "scene") {
    htmlRenderers.scene($block);
  } else if (blockType === "parenthetical") {
    htmlRenderers.parenthetical($block);
  }

  return $block;
};
