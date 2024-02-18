const defaultOptions = { lineHeightFactor: 1 };

export const oneInchInPt = 12 * 6;
export const pageWidth = oneInchInPt * 8.5;
export const pageHeight = oneInchInPt * 11;
export const marginLeft = oneInchInPt * 1.5;
export const maxLinesOnPage = 54;
export const pageWidthWithoutMargins =
  pageWidth - (marginLeft + oneInchInPt) - 1;

export const pdfRenderers = {
  scene: (doc, blockLine, currentY, sceneNumber) => {
    doc.setFont("Courier", "normal", "bold");

    // Scene number indicator
    doc.text(sceneNumber, marginLeft - 12 * 2.5, currentY, defaultOptions);
    doc.text(sceneNumber, pageWidth - oneInchInPt, currentY, defaultOptions);

    doc.text(blockLine, marginLeft, currentY, defaultOptions);
  },
  character: (doc, blockLine, currentY) => {
    doc.text(blockLine, marginLeft + oneInchInPt * 2, currentY, defaultOptions);
  },
  parenthetical: (doc, blockLine, currentY) => {
    doc.text(
      blockLine,
      marginLeft + oneInchInPt * 1.5,
      currentY,
      defaultOptions
    );
  },
  dialogue: (doc, blockLine, currentY) => {
    doc.text(blockLine, marginLeft + oneInchInPt, currentY, defaultOptions);
  },
  transition: (doc, blockLine, currentY) => {
    const transitionWidth =
      doc.getStringUnitWidth(blockLine) * doc.getFontSize();

    doc.text(
      blockLine,
      pageWidth - oneInchInPt - transitionWidth,
      currentY,
      defaultOptions
    );
  },
  default: (doc, blockLines, currentY) => {
    doc.text(blockLines, marginLeft, currentY, defaultOptions);
  },
  titlePage: (doc) => {
    const getContent = (id) =>
      document.getElementById(id)?.innerText.replace(/\n/g, "") ?? "";
    const contactEmail =
      document.getElementById("contact-email")?.innerText ?? "";
    const contactPhone =
      document.getElementById("contact-phone")?.innerText ?? "";

    const gap = 24;
    const lineHeight = 12;
    const x = pageWidth / 2;
    const options = { ...defaultOptions, align: "center" };
    let y = oneInchInPt * 3.5;

    doc.text(getContent("title"), x, y, options);
    y += lineHeight + gap;

    doc.text("Escrito por", x, y, options);
    y += lineHeight + gap;

    doc.text(getContent("author"), x, y, options);

    doc.text(
      getContent("contact-email"),
      oneInchInPt,
      pageHeight - oneInchInPt - lineHeight,
      defaultOptions
    );
    doc.text(
      getContent("contact-phone"),
      oneInchInPt,
      pageHeight - oneInchInPt,
      defaultOptions
    );

    doc.addPage("letter", "p");
    doc.setPage(2);
  },
  pageNumber: (doc) => {
    const page = doc.getCurrentPageInfo().pageNumber - 1;

    doc.text(`pag. ${page}`, pageWidth - oneInchInPt / 2 + 6, oneInchInPt / 2, {
      ...defaultOptions,
      align: "right",
    });
  },
};

export const pdfRenderer = (doc, blockType, metadata) => {
  switch (blockType) {
    case "scene":
      pdfRenderers.scene(
        doc,
        metadata.blockLines[0],
        metadata.currentY,
        metadata.sceneNumber
      );
      break;
    case "character":
      pdfRenderers.character(doc, metadata.blockLines[0], metadata.currentY);
      break;
    case "parenthetical":
      pdfRenderers.parenthetical(
        doc,
        metadata.blockLines[0],
        metadata.currentY
      );
      break;
    case "dialogue":
      pdfRenderers.dialogue(doc, metadata.blockLines, metadata.currentY);
      break;
    case "transition":
      pdfRenderers.transition(doc, metadata.blockLines[0], metadata.currentY);
      break;
    case "action":
    default:
      pdfRenderers.default(doc, metadata.blockLines, metadata.currentY);
  }

  // Reset font
  doc.setFont("Courier", "normal", "normal");
};
