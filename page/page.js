const createPage = (pageNumber) => {
  const $pagesContainer = document.getElementById("pages-container");
  const numberOfPages = document.getElementsByClassName("page").length;

  const $pageContainer = document.createElement("div");
  $pageContainer.classList.add("page-container");

  const $page = document.createElement("div");
  $page.classList.add("page");
  $page.dataset.pageNumber = pageNumber;

  const $pageNumber = document.createElement("div");
  $pageNumber.classList.add("page-number");
  $pageNumber.innerText = numberOfPages + 1;

  $pagesContainer.append($pageContainer);
  $pageContainer.append($page);
  $page.append($pageNumber);

  return $page;
};
