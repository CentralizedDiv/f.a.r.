import { recalculateSceneNumberAndPreventEraseOnBackspacePress } from "./backspace-keydown.js";
import { createBlocksOnEnterPress } from "./enter-keydown.js";
import { createBlocksOnHeaderButtonsClick } from "./new-blocks-click.js";
import { focusPageOnPageContainerClick } from "./page-container-click.js";
import { processAndDownloadPDFOnClick } from "./download-pdf-click.js";
import { createBlocksOnShortcutsPress } from "./shortcuts-keydown.js";

export const initListeners = () => {
  focusPageOnPageContainerClick();
  createBlocksOnHeaderButtonsClick();
  createBlocksOnShortcutsPress();
  createBlocksOnEnterPress();
  recalculateSceneNumberAndPreventEraseOnBackspacePress();

  processAndDownloadPDFOnClick();
};
