export const validBlocks = [
  "action",
  "scene",
  "character",
  "dialogue",
  "parenthetical",
  "transition",
];

export const validShortcuts = ["KeyS", "KeyA", "KeyC", "KeyD", "KeyT", "KeyP"];

export const isBlockValid = ($block) => {
  return validBlocks.some((className) =>
    $block?.classList?.contains(className)
  );
};

export const getFocusedElement = () => {
  const $anchorNode = window.getSelection()?.anchorNode;
  let $firstValidParent = $anchorNode;
  do {
    if (
      $firstValidParent?.classList &&
      validBlocks.includes($firstValidParent?.classList[0])
    ) {
      return $firstValidParent;
    } else {
      $firstValidParent = $firstValidParent?.parentElement;
    }
  } while ($firstValidParent && $firstValidParent.id !== "page");
  return null;
};
