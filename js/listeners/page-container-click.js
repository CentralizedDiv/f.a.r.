export const focusPageOnPageContainerClick = () => {
  const $container = document.getElementById("page-container");
  $container.addEventListener("click", (ev) => {
    if (ev.target === $container) {
      const $page = document.getElementById("page");

      $page.focus?.();
      const range = document.createRange();
      range.selectNodeContents($page);
      range.collapse(false);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });
};
