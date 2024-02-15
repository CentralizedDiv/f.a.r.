const createScene = ($elementBefore, sceneNumber, insertInside = false) => {
  return createAndInsertEditable(
    $elementBefore,
    {
      classes: ["scene"],
      dataset: {
        sceneNumber,
      },
    },
    insertInside
  );
};
