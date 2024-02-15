const createParenthetical = ($elementBefore) => {
  const $parenthetical = createAndInsertEditable($elementBefore, {
    classes: ["parenthetical"],
  });
  $parenthetical.innerText = "()";

  // Run after the current call stack because we're changing innerText above
  setTimeout(() => {
    const range = document.createRange();
    range.setStart($parenthetical.firstChild, 1);
    range.collapse(true);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });

  return $parenthetical;
};
