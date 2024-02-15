const createAction = ($elementBefore, insetInside = false) => {
  return createAndInsertEditable(
    $elementBefore,
    {
      classes: ["action"],
    },
    insetInside
  );
};
