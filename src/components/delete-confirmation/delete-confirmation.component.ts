import {
  css,
  customElement,
  html,
  LitElement,
  property,
  query,
} from 'lit-element';

// Inspired by : https://codepen.io/estrepitos/pen/JAtKr

@customElement('cff-delete-confirmation')
export class DeleteConfirmation extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 300;
      font-size: 12px;
      font-family: 'RedHatText';
    }
    .delete-btn {
      transition: color 0.3s ease-out 0s;
      cursor: pointer;
      color: rgba(
        var(--delete-confirmation-button-icon-color, 255, 255, 255),
        0.5
      );
    }
    .delete-btn:hover {
      color: rgb(var(--delete-confirmation-button-icon-color, 255, 255, 255));
    }

    .confirmation-panel {
      position: absolute;
      top: -95px;
      background: rgb(28, 36, 43);
      border-radius: 5px;
      cursor: default;
      color: rgb(var(--delete-confirmation-button-icon-color, 255, 255, 255));
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 16px 0px;
      animation: openConfirmationPanel 0.3s
        cubic-bezier(0.6, -0.28, 0.735, 0.045);
    }

    @keyframes openConfirmationPanel {
      0% {
        top: -80px;
        opacity: 0;
        cursor: pointer;
      }

      100% {
        top: -95px;
        opacity: 1;
        cursor: default;
      }
    }

    @keyframes closeConfirmationPanel {
      0% {
        top: -95px;
        opacity: 1;
      }

      100% {
        top: -80px;
        opacity: 0;
        cursor: pointer;
      }
    }

    .confirmation-panel:after {
      content: '';
      display: block;
      width: 0px;
      left: 0px;
      border-top: 5px solid #1c242b;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      position: absolute;
      bottom: -5px;
      left: 50%;
      margin-left: -5px;
    }

    .confirmation-panel .message {
      white-space: nowrap;
      margin: 0px 24px 16px 24px;
    }

    .confirmation-panel .action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;
      margin: 0 44px;
      cursor: pointer;
    }

    .confirmation-panel .action-button {
      padding: 4px;
      cursor: pointer;
      border-radius: 4px;
      width: 50px;
      text-align: center;
      user-select: none;
      position: relative;
    }

    .confirmation-panel .action-button .hover {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border-radius: 4px;
      background-color: rgb(255, 255, 255);
      transition: opacity 0.3s ease-out;
    }

    .confirmation-panel .action-button:hover .hover {
      opacity: 0.2;
    }

    .confirmation-panel .action-button.cancel {
      background-color: rgb(255, 255, 255, 0.1);
    }

    .confirmation-panel .action-button.ok {
      background-color: #3498db;
    }
  `;

  @property({ type: String }) message = 'Are you sure you want to delete?';
  @query('.delete-btn') deleteButton!: HTMLDivElement;
  @query('.confirmation-panel') confirmationPanel?: HTMLTemplateElement;

  #showConfirmationPanel = false;
  public get showConfirmationPanel() {
    return this.#showConfirmationPanel;
  }
  public set showConfirmationPanel(value) {
    this.#showConfirmationPanel = value;
    this.requestUpdate();
  }

  open(event: Event) {
    this.registerBodyClick();
    this.showConfirmationPanel = true;
  }

  onCancelClick() {
    this.close();
  }

  onOkClick() {
    this.dispatchEvent(new CustomEvent('confirm'));
    this.close();
  }

  onCloseAnimationEnd = (event: AnimationEvent) => {
    this.confirmationPanel?.removeEventListener(
      'animationend',
      this.onCloseAnimationEnd
    );
    this.showConfirmationPanel = false;
  };

  close() {
    if (this.confirmationPanel) {
      this.confirmationPanel.style.animation =
        'closeConfirmationPanel 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards';
      this.confirmationPanel.addEventListener(
        'animationend',
        this.onCloseAnimationEnd
      );
      this.deregisterBodyClick();
    }
  }

  onBodyClick = (evt: MouseEvent) => {
    const path = evt.composedPath();
    if (path.indexOf(this) === -1) {
      this.close();
    }
  };

  private registerBodyClick() {
    // capture otherwise listener closes menu after quick menu opens
    document.body.addEventListener('click', this.onBodyClick, {
      passive: true,
      capture: true,
    });
  }

  private deregisterBodyClick() {
    document.body.removeEventListener('click', this.onBodyClick);
  }

  render() {
    return html`
      <div class="delete-btn" @click=${this.open}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-trash-2"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          ></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>
      ${this.showConfirmationPanel
        ? html`
            <div class="confirmation-panel">
              <div class="message">${this.message}</div>
              <div class="action">
                <div class="action-button cancel" @click=${this.onCancelClick}>
                  <span class="hover"></span>
                  Cancel
                </div>
                <div class="action-button ok" @click=${this.onOkClick}>
                  <span class="hover"></span>
                  Yes
                </div>
              </div>
            </div>
          `
        : ``}
    `;
  }
}
