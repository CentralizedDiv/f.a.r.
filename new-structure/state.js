let state = Object.freeze({
  currentScript: {
    name: "O TÍTULO",
    get currentSceneNumber() {
      return document.getElementsByClassName("scene").length;
    },
  },
});
