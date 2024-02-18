const customRenderers = {
  scene: ($scene) => {
    $scene.dataset.sceneNumber = state.currentScript.currentSceneNumber;
  },
  parenthetical: ($parenthetical) => {
    $parenthetical.innerText = `(${$parenthetical.innerText})`;

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

const blockRenderer = (blockType, $currentBlock, replace = false) => {
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

  if (blockType === "scene") {
    customRenderers.scene($block);
  } else if (blockType === "parenthetical") {
    customRenderers.parenthetical($block);
  }
  $block.focus?.();

  const range = document.createRange();
  range.selectNodeContents($block);
  range.collapse(false);

  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};
