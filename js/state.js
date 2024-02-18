let state = Object.freeze({
  currentScript: {
    get currentSceneNumber() {
      return document.getElementsByClassName("scene").length;
    },
  },
});

export { state };
