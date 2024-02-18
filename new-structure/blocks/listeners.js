const hideDropdown = ($el) => {
  $el?.classList.toggle("hidden");
  setTimeout(() => {
    $el?.classList.toggle("hidden");
  });
};

const isBlockValid = ($block) => {
  const validBlocks = [
    "action",
    "scene",
    "character",
    "dialogue",
    "parenthetical",
    "transition",
  ];
  return validBlocks.some((className) =>
    $block?.classList?.contains(className)
  );
};

const getFocusedElement = () => {
  const $anchorNode = window.getSelection()?.anchorNode;
  return $anchorNode?.nodeType === 3 ? $anchorNode?.parentElement : $anchorNode;
};

(() => {
  document.getElementById("new-blocks").addEventListener("click", (ev) => {
    hideDropdown(ev.target?.parentElement);
    blockRenderer(
      ev.target?.id?.split("new-")?.[1] ?? "action",
      getFocusedElement(),
      true
    );
  });

  const validCtrlKeys = ["KeyS", "KeyA", "KeyC", "KeyD", "KeyT", "KeyP"];
  document.addEventListener("keydown", (ev) => {
    const $focusedBlock = getFocusedElement();
    const $currentBlock = isBlockValid($focusedBlock) ? $focusedBlock : null;

    if (ev.ctrlKey && validCtrlKeys.includes(ev.code)) {
      switch (ev.code) {
        case "KeyS":
          blockRenderer("scene", $currentBlock, true);
          break;
        case "KeyA":
          blockRenderer("action", $currentBlock, true);
          break;
        case "KeyC":
          blockRenderer("character", $currentBlock, true);
          break;
        case "KeyD":
          blockRenderer("dialogue", $currentBlock, true);
          break;
        case "KeyT":
          blockRenderer("transition", $currentBlock, true);
          break;
        case "KeyP":
          blockRenderer("parenthetical", $currentBlock, true);
          break;
      }
    }

    if (ev.key === "Enter" && $currentBlock) {
      ev.preventDefault();
      const blockType = $currentBlock.classList?.[0];

      if (blockType === "character" || blockType === "parenthetical") {
        blockRenderer("dialogue", $currentBlock);
      } else {
        blockRenderer("action", $currentBlock);
      }
    }

    if (ev.key === "Backspace") {
      const $page = document.getElementById("page");
      const content = $page.innerText.trim();
      if ($page.children.length === 1 && content.length === 0) {
        ev.preventDefault();
      } else {
        if (
          $currentBlock.classList.contains("scene") &&
          $currentBlock.innerText.trim() === ""
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
})();
