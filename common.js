const createAndInsertEditable = (
  $currentElement,
  { classes = [], dataset = {} },
  insertInside = false
) => {
  const $editable = document.createElement("div");

  classes.forEach((_class) => {
    $editable.classList.add(_class);
  });
  Object.entries(dataset).forEach(([key, value]) => {
    $editable.dataset[key] = value;
  });
  $editable.contentEditable = true;
  $editable.tabIndex = 0;

  if (insertInside) {
    $currentElement.append($editable);
  } else {
    $currentElement.parentNode.insertBefore(
      $editable,
      $currentElement.nextSibling
    );
  }
  focusAndSetCaret($editable);

  return $editable;
};

const focusAndSetCaret = ($element) => {
  $element?.focus();

  const range = document.createRange();
  range.selectNodeContents($element);
  range.collapse(false);

  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};
