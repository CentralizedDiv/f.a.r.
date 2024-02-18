let state = {
  pages: [],
  sceneNumber: 1,
  pageNumber: 1,
  currentBlock: null,
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
