import { Render } from '@dropins/tools/lib.js';
import { loadCSS, buildBlock } from '../../scripts/aem.js';

export default async function createModal(contentNodes) {
  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const dialog = document.createElement('dialog');
  dialog.setAttribute('tabindex', 1);
  dialog.setAttribute('role', 'dialog');

  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(...contentNodes);
  

  
  dialog.append(dialogContent);

  // Close button
  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.setAttribute('data-dismiss', 'modal');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close"></span>';
  closeButton.addEventListener('click', () => dialog.close());
  dialog.append(closeButton);

  const closeModal = () => {
    dialog.close();
    dialog.querySelectorAll('[data-dropin-container]').forEach(Render.unmount);
  };

  // Close modal on outside click
  dialog.addEventListener('click', (event) => {
    if (event.pointerType !== 'mouse') return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      closeModal();
    }
  });

  const block = buildBlock('modal', '');
  document.querySelector('main').append(block);

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    block.remove();
  });

  block.append(dialog);

  return {
    block,
    removeModal: () => closeModal(),
    showModal: () => {
      dialog.showModal();
      setTimeout(() => {
        dialogContent.scrollTop = 0;
      }, 0);

      const observer = new MutationObserver(() => {
        const firstInput = dialogContent.querySelector('input');
        if (firstInput) {
          firstInput.focus();
          observer.disconnect();
        }
      });

      observer.observe(dialogContent, { childList: true, subtree: true });
      document.body.classList.add('modal-open');
    },
  };
}
