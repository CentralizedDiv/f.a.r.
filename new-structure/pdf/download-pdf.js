(() => {
  document.getElementById("download-pdf").addEventListener("click", () => {
    const doc = new window.jspdf.jsPDF({
      orientation: "p",
      unit: "pt",
      format: "letter",
    });
    doc.setFont("Courier", "normal", "normal");
    doc.setFontSize(12);

    pdfRenderers.titlePage(doc);

    let currentPage = 2;
    let nrOfLinesWrittenOnCurrentPage = 0;

    const writeBlockLines = (blockLines, blockType, metadata = {}) => {
      const nrOfBlockLinesOnCurrentPage = Math.min(
        blockLines.length,
        maxLinesOnPage - nrOfLinesWrittenOnCurrentPage
      );

      const currentY = oneInchInPt + 12 * nrOfLinesWrittenOnCurrentPage;
      pdfRenderer(doc, blockType, {
        ...metadata,
        currentY,
        blockLines: blockLines.slice(0, nrOfBlockLinesOnCurrentPage),
      });
      nrOfLinesWrittenOnCurrentPage += nrOfBlockLinesOnCurrentPage;

      if (nrOfBlockLinesOnCurrentPage < blockLines.length) {
        doc.addPage("letter", "p");
        doc.setPage(++currentPage);
        pdfRenderers.pageNumber(doc);
        nrOfLinesWrittenOnCurrentPage = 0;

        writeBlockLines(
          blockLines.slice(nrOfBlockLinesOnCurrentPage),
          blockType,
          metadata
        );
      }
    };

    const blocks = Array.from(document.getElementById("page")?.children ?? []);
    blocks.forEach((block) => {
      const blockType = block.classList?.[0] ?? "action";

      const blockLines = doc.splitTextToSize(
        block.innerText.trim(),
        blockType === "dialogue"
          ? oneInchInPt * 3.5 - 1
          : pageWidthWithoutMargins
      );

      const shouldAddNewLine =
        (blockType === "action" ||
          blockType === "scene" ||
          blockType === "character" ||
          blockType === "transition") &&
        block.previousElementSibling?.innerText.trim().length > 0;

      // Add new line if next is not empty
      if (shouldAddNewLine) {
        writeBlockLines([""], "action");
      }

      writeBlockLines(blockLines, blockType, {
        sceneNumber: block.dataset?.sceneNumber,
      });
    });

    doc.save("letter2.pdf");
  });
})();
