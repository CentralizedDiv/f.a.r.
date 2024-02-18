export const initObserver = () => {
  const setPageNumberLines = () => {
    const $pageContainer = document.getElementById("page-container");
    const $page = document.getElementById("page");
    const nrOfPages = Math.ceil($page.clientHeight / 864);
    $pageContainer.style.minHeight = `calc(864px * ${nrOfPages} + var(--oneInch) * 2)`;

    Array.from(document.getElementsByClassName("page-number-line")).forEach(
      ($el) => $el.remove()
    );

    for (let i = 0; i < nrOfPages - 1; i++) {
      const pageNumber = i + 1;
      const marginMultiplier = pageNumber * 2 - 1;

      const $pageNumberLine = document.createElement("div");
      $pageNumberLine.classList.add("page-number-line");
      $pageNumberLine.innerText = `Página ${i + 2}`;
      $pageNumberLine.style.top = `calc((var(--oneInch) * 11 * ${pageNumber}) - (var(--oneInch) * ${marginMultiplier}))`;
      $pageContainer.append($pageNumberLine);
    }
  };

  const resizeObserver = new ResizeObserver(() => {
    setPageNumberLines();
  });

  setPageNumberLines();
  resizeObserver.observe(document.getElementById("page"));
};
