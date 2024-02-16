let state = {
  pages: [],
  sceneNumber: 1,
  pageNumber: 1,
  currentBlock: null,
};

const recalculateScenesNumber = () => {
  const scenes = document.getElementsByClassName("scene");
  Array.from(scenes).forEach((scene, idx) => {
    scene.dataset.sceneNumber = idx + 1;
  });
  state.sceneNumber = scenes.length + 1;
};

const recalculatePageNumber = () => {
  const pages = document.getElementsByClassName("page");
  state.pages = [];
  Array.from(pages).forEach((page, idx) => {
    state.pages.push(page);
    page.dataset.pageNumber = idx + 1;
  });
  state.pageNumber = pages.length + 1;
};

const addListener = ($editable, onEnter = "ACTION") => {};

const createActionAndAddListener = ($currentElement, insertInside = false) => {
  const $action = createAction($currentElement, insertInside);
  addListener($action);

  return $action;
};

const createSceneAndAddListener = ($currentElement, insertInside = false) => {
  const $scene = createScene($currentElement, state.sceneNumber, insertInside);
  addListener($scene);

  recalculateScenesNumber();
};

const createCharacterAndAddListener = ($currentElement) => {
  const $character = createCharacter($currentElement);
  addListener($character, "DIALOGUE");
};

const createDialogueAndAddListener = ($currentElement) => {
  const $dialogue = createDialogue($currentElement);
  addListener($dialogue);
};

const createTransitionAndAddListener = ($currentElement) => {
  const $transition = createTransition($currentElement);
  addListener($transition);
};

const createParentheticalAndAddListener = ($currentElement) => {
  const $parenthetical = createParenthetical($currentElement);
  addListener($parenthetical);
};

const validBlocks = [
  "action",
  "character",
  "dialogue",
  "parenthetical",
  "scene",
  "transition",
];
const setCurrentBlock = () => {
  const anchorNode = window.getSelection().anchorNode;
  const $currentElement =
    anchorNode?.nodeType === 3 ? anchorNode.parentElement : anchorNode;
  if (
    $currentElement &&
    validBlocks.some((className) =>
      $currentElement.classList.contains(className)
    )
  ) {
    const currentBlock = $currentElement.classList[0];
    if (state.currentBlock && state.currentBlock !== currentBlock) {
      document
        .getElementById(`action-${state.currentBlock}`)
        ?.classList.remove("active");
    }
    state.currentBlock = currentBlock;
    document
      .getElementById(`action-${state.currentBlock}`)
      ?.classList.add("active");
  } else {
    document
      .getElementById(`action-${state.currentBlock}`)
      ?.classList.remove("active");
    state.currentBlock = null;
  }
};

const save = () => {
  if (state.currentScriptName) {
    setTimeout(() => {
      const savedScripts = JSON.parse(localStorage.getItem("scripts") ?? "{}");
      localStorage.setItem(
        "scripts",
        JSON.stringify({
          ...savedScripts,
          [state.currentScriptName]:
            document.getElementById("pages-container")?.innerHTML,
        })
      );
    });
  }
};

const fillScriptSelector = () => {
  setTimeout(() => {
    const savedScripts = JSON.parse(localStorage.getItem("scripts") ?? "{}");
    const select = document.getElementById("scripts");
    if (select) {
      select.innerHTML = "";

      Object.keys(savedScripts).forEach((scriptName) => {
        const option = document.createElement("option");
        option.value = scriptName;
        option.innerText = scriptName;
        select.append(option);
      });

      const option = document.createElement("option");
      option.value = "__NEW__";
      option.innerText = "Novo roteiro";
      select.append(option);
      select.value = state.currentScriptName;
    }
  });
};

const loadScript = (html) => {
  const $container = document.getElementById("pages-container");
  $container.innerHTML = html;

  const pages = Array.from(document.getElementsByClassName("page"));
  state.pageNumber = pages.length + 1;
  pages.forEach((page) => {
    state.pages.push(page);
    observer.observe(page, { childList: true });
  });

  state.sceneNumber = document.getElementsByClassName("scene").length + 1;

  Array.from(
    document.querySelectorAll(
      validBlocks.map((className) => `.${className}`).join(",")
    )
  ).forEach((block) => resizeObserver.observe(block));
};

const validCtrlKeys = ["KeyC", "KeyA", "KeyP", "KeyD", "KeyT", "KeyI"];
const observer = new MutationObserver((mutationList) => {
  mutationList?.[0]?.addedNodes.forEach((node) => resizeObserver.observe(node));
});
const resizeObserver = new ResizeObserver((entries) => {
  const target = entries?.[0]?.target;
  const page = target?.parentElement;
  if (page) {
    const $currentPage = page;
    const currentPageNumber = Number($currentPage.dataset.pageNumber);

    const isLastPage = currentPageNumber === state.pages.length;
    const shouldGoToNewPage =
      $currentPage.scrollHeight - $currentPage.clientHeight > 16;

    if (shouldGoToNewPage) {
      let $nextPageBlock;
      const lastChar = target.innerText.slice(-1);

      if (isLastPage) {
        const $newPage = createPage(state.pageNumber);
        state.pageNumber++;

        state.pages.push($newPage);

        observer.observe($newPage, { childList: true });
      }
      const $nextPage = state.pages[currentPageNumber];
      const validBlocks = [
        "action",
        "character",
        "dialogue",
        "parenthetical",
        "scene",
        "transition",
      ];
      $nextPageBlock = Array.from(state.pages[currentPageNumber].children).find(
        (block) =>
          validBlocks.some((className) => block.classList.contains(className))
      );

      if (!$nextPageBlock) {
        $nextPageBlock = createActionAndAddListener($nextPage, true);
      }

      $nextPageBlock.innerText = lastChar + $nextPageBlock.innerText;
      $nextPageBlock.focus?.();

      // Run after the current call stack because we're changing innerText above
      setTimeout(() => {
        const range = document.createRange();
        range.setStart($nextPageBlock.firstChild, 1);
        range.collapse(true);

        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        target.innerText = target.innerText.substr(
          0,
          target.innerText.length - 1
        );
      });
    }
  }
});
(function () {
  const savedScripts = localStorage.getItem("scripts");
  if (!savedScripts) {
    const scriptName = prompt("Nome do roteiro");
    state.pages.push(createPage(state.pageNumber));
    state.pageNumber++;

    createSceneAndAddListener(state.pages[0], true);
    observer.observe(state.pages[0], { childList: true });
    state.currentScriptName = scriptName;
    const title = document.getElementById("title-content");
    if (title) {
      title.innerText = scriptName;
    }
    save();

    fillScriptSelector();
  } else {
    fillScriptSelector();
    state.currentScriptName = Object.keys(JSON.parse(savedScripts))[0];
    loadScript(Object.values(JSON.parse(savedScripts))[0]);
  }

  document.addEventListener("keydown", (ev) => {
    let $currentElement = ev.target;
    let $editable = ev.target;

    if (ev.ctrlKey && validCtrlKeys.includes(ev.code)) {
      const scenes = document.getElementsByClassName("scene");
      const isFirstScene = scenes?.[0] === ev.target;
      const isEmpty = ev.target.innerText.trim().length === 0;

      if (isEmpty && !isFirstScene) {
        $currentElement = ev.target.previousSibling;
        ev.target.remove();
      }

      switch (ev.code) {
        case "KeyC":
          createSceneAndAddListener($currentElement);
          break;
        case "KeyA":
          createActionAndAddListener($currentElement);
          break;
        case "KeyP":
          createCharacterAndAddListener($currentElement);
          break;
        case "KeyD":
          createDialogueAndAddListener($currentElement);
          break;
        case "KeyT":
          createTransitionAndAddListener($currentElement);
          break;
        case "KeyI":
          createParentheticalAndAddListener($currentElement);
          break;
      }
    }

    const isEmpty = ev.target.innerText.trim().length === 0;
    if (ev.key === "Enter") {
      ev.preventDefault();

      // If is not at the end, we should split this block
      if (window.getSelection().anchorOffset !== $editable.innerText.length) {
        const splittedBlockContent = $editable.innerText.slice(
          window.getSelection().anchorOffset
        );
        $editable.innerText = $editable.innerText.slice(
          0,
          window.getSelection().anchorOffset
        );

        createActionAndAddListener($editable).innerText = splittedBlockContent;
      }

      if (!isEmpty) {
        if ($editable.classList.contains("character")) {
          createDialogueAndAddListener($editable);
        } else {
          createActionAndAddListener($editable);
        }
      }
    }

    const scenes = document.getElementsByClassName("scene");
    const isFirstScene = scenes?.[0] === ev.target;

    if (ev.key === "Backspace" && isEmpty && !isFirstScene) {
      ev.preventDefault();
      let previousSibling = $editable.previousSibling;
      if (
        !validBlocks.some((className) =>
          previousSibling.classList.contains(className)
        )
      ) {
        const previousPage =
          Number($editable.parentElement.dataset.pageNumber) - 2;
        previousSibling = state.pages[previousPage].lastChild;
      }

      focusAndSetCaret(previousSibling);

      const isScene = $editable.classList.contains("scene");
      const $pageContainer = $editable.parentElement.parentElement;
      $editable.remove();

      if (
        $pageContainer.querySelectorAll(
          validBlocks.map((className) => `.${className}`).join(",")
        ).length === 0
      ) {
        $pageContainer.remove();
        recalculatePageNumber();
      }

      if (isScene) {
        recalculateScenesNumber();
      }
    }

    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
      const currCaretPosition = window.getSelection().anchorOffset;

      setTimeout(() => {
        const nextCaretPosition = window.getSelection().anchorOffset;

        if (
          nextCaretPosition === ev.target.innerText.length ||
          nextCaretPosition === 0
        ) {
          let caretDestination;
          if (ev.key === "ArrowDown") {
            if ($editable.nextSibling && !$editable.nextSibling?.firstChild) {
              $editable.nextSibling.innerText = " ";
            }
            caretDestination = $editable.nextSibling?.firstChild;
          } else {
            if (
              $editable.previousSibling &&
              !$editable.previousSibling?.lastChild
            ) {
              $editable.previousSibling.innerText = " ";
            }
            caretDestination = $editable.previousSibling?.lastChild;
          }
          if (
            caretDestination &&
            validBlocks.some((className) =>
              caretDestination.parentElement.classList.contains(className)
            )
          ) {
            const range = document.createRange();
            range.setStart(
              caretDestination,
              Math.min(currCaretPosition, caretDestination.length)
            );
            range.collapse(true);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      });
    }

    setTimeout(() => {
      setCurrentBlock();
      save();
    });
  });

  document.getElementById("save")?.addEventListener("click", () => {
    save();
  });

  document.getElementById("download-pdf")?.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "in", "letter");

    const pages = Array.from(
      document.getElementById("pages-container").children
    );

    Promise.all(
      pages.map((page, i) =>
        html2canvas(page).then((canvas) => {
          if (i > 0) {
            pdf.addPage("letter", "p");
          }
          pdf.setPage(i + 1);

          const canvasImg = canvas.toDataURL("image/jpeg");
          pdf.addImage(canvasImg, "jpeg", 0, 0, 8.5, 11);
        })
      )
    ).then(() => {
      const scriptName = document.getElementById("title-content")?.innerText;
      pdf.save(`${scriptName ?? "script"}.pdf`);
    });
  });

  document.getElementById("actions")?.addEventListener("click", (ev) => {
    let $currentElement = window.getSelection().anchorNode.parentElement;
    if (
      !validBlocks.some((className) =>
        $currentElement.classList.contains(className)
      )
    ) {
      const blocks = document.querySelectorAll(
        validBlocks.map((className) => `.${className}`).join(",")
      );
      $currentElement = blocks[blocks.length - 1];
    }
    switch (ev.target.id) {
      case "action-action":
        createActionAndAddListener($currentElement);
        break;
      case "action-scene":
        createSceneAndAddListener($currentElement);
        break;
      case "action-character":
        createCharacterAndAddListener($currentElement);
        break;
      case "action-dialogue":
        createDialogueAndAddListener($currentElement);
        break;
      case "action-parenthetical":
        createParentheticalAndAddListener($currentElement);
        break;
      case "action-transition":
        createTransitionAndAddListener($currentElement);
        break;
      default:
        break;
    }
  });

  document.addEventListener("click", () => {
    setCurrentBlock();
  });

  document.getElementById("scripts").addEventListener("change", (ev) => {
    const scripts = JSON.parse(localStorage.getItem("scripts") ?? "{}");
    const scriptName = ev.target?.value;
    if (scriptName === "__NEW__") {
      Array.from(document.getElementsByClassName("page-container")).forEach(
        (page) => page.remove()
      );
      setTimeout(() => {
        const scriptName = prompt("Nome do roteiro");
        state = {
          ...state,
          pages: [],
          pageNumber: 1,
          sceneNumber: 1,
        };
        state.pages.push(createPage(state.pageNumber));
        state.pageNumber++;

        createSceneAndAddListener(state.pages[0], true);
        observer.observe(state.pages[0], { childList: true });
        state.currentScriptName = scriptName;
        const title = document.getElementById("title-content");
        if (title) {
          title.innerText = scriptName;
        }
        save();
        fillScriptSelector();
      });
    } else {
      const script = scripts?.[scriptName];
      if (script) {
        state.currentScriptName = scriptName;
        loadScript(script);
      }
    }
  });
})();
