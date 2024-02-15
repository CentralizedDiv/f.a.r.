const createTransition = ($elementBefore) => {
  return createAndInsertEditable($elementBefore, {
    classes: ["transition"],
  });
};
