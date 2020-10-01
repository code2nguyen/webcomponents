import { css, html, LitElement } from 'lit-element';
import { getElementDataAction } from '../../shared/utils';
import { DashboardItem } from '../dashboard-item/dashboard-item.component';
import { QuillEditor } from '../quill-editor/quill-editor.component';

export class QuillEditorToolbar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      align-self: stretch;
    }
    .dashboard-item-toolbar-icon {
      color: var(--dashboard-theme-item-icon-color);
      padding: 0px 8px;
      cursor: pointer;
      transition: opacity 0.3s ease-out 0s;
      opacity: 0.5;
      align-self: stretch;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .dashboard-item-toolbar-icon:hover {
      opacity: 1;
    }
    .dashboard-item-toolbar-separator {
      width: 8px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
  }

  getQuillEditor(): QuillEditor | undefined {
    const quilEditorEl = this.parentElement?.querySelector('cff-quill-editor');
    return quilEditorEl ? (quilEditorEl as QuillEditor) : undefined;
  }

  handleToolbarAction(event: MouseEvent) {
    const quillEditor = this.getQuillEditor();

    if (quillEditor && quillEditor.editor) {
      const quill = quillEditor.editor;
      const action = getElementDataAction(event.currentTarget as HTMLElement);
      const range = quill.getSelection() ?? undefined;
      const formats = quill.getFormat(range);
      switch (action) {
        case 'code-block': {
          const value = formats['code-block'];
          if (value) {
            quill.format('code-block', false, 'user');
          } else {
            quill.format('code-block', true, 'user');
          }
          break;
        }
        case 'check': {
          if (!range) {
            quill.format('list', 'unchecked', 'user');
          } else {
            if (formats.list === 'checked' || formats.list === 'unchecked') {
              quill.format('list', false, 'user');
            } else {
              quill.format('list', 'unchecked', 'user');
            }
          }
          break;
        }
        case 'bullet':
        case 'ordered': {
          quill.format('list', action, 'user');
          break;
        }
      }
    }
  }

  changeBackgroundColorIndex() {
    const dashboardItem = this.parentElement as DashboardItem;
    if (dashboardItem) {
      dashboardItem.changeBackgroundColorIndex();
    }
  }

  render() {
    return html`
      <!-- color -->
      <div class="dashboard-item-toolbar-icon" @click=${this.changeBackgroundColorIndex}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 12 12"
          width="12"
          height="12"
        >
          <defs>
            <style>
              .cls-1 {
                fill: #d9e021;
              }
              .cls-2 {
                fill: #39b54a;
              }
              .cls-3 {
                fill: #22b573;
              }
              .cls-4 {
                fill: #f7931e;
              }
              .cls-5 {
                fill: red;
              }
            </style>
          </defs>
          <g id="Calque_2" data-name="Calque 2">
            <g id="Calque_1-2" data-name="Calque 1">
              <g id="Calque_2-2" data-name="Calque 2">
                <g id="Calque_1-2-2" data-name="Calque 1-2">
                  <path
                    class="cls-1"
                    d="M5.66,5.66h0A5.65,5.65,0,0,1,0,0H0A5.65,5.65,0,0,1,5.66,5.66Z"
                  />
                  <path
                    class="cls-2"
                    d="M12,0h0A5.65,5.65,0,0,1,6.34,5.66h0A5.65,5.65,0,0,1,12,0Z"
                  />
                  <path
                    class="cls-3"
                    d="M6.34,6.34h0A5.65,5.65,0,0,1,12,12h0A5.65,5.65,0,0,1,6.34,6.34Z"
                  />
                  <path
                    class="cls-4"
                    d="M0,12H0A5.65,5.65,0,0,1,5.66,6.34h0A5.65,5.65,0,0,1,0,12Z"
                  />
                  <path
                    class="cls-5"
                    d="M6,5.66H6A.34.34,0,0,1,6.34,6h0A.34.34,0,0,1,6,6.34H6A.34.34,0,0,1,5.66,6h0A.34.34,0,0,1,6,5.66Z"
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div class="dashboard-item-toolbar-separator"></div>

      <!-- code -->
      <div class="dashboard-item-toolbar-icon" data-action="code-block" @click=${this.handleToolbarAction}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="margin-top: 2px"
        >
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </div>

      <!-- check list -->
      <div class="dashboard-item-toolbar-icon" data-action="check" @click=${this.handleToolbarAction}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 13.67 13"
          style="fill:currentColor"
          width="14"
          height="12"
        >
          <defs>
            <style>
              .cls-1 {
                fill: none;
                stroke: currentColor;
                stroke-linecap: round;
                stroke-linejoin: round;
              }
            </style>
          </defs>
          <g id="Calque_2" data-name="Calque 2">
            <g id="Calque_1-2" data-name="Calque 1">
              <polyline class="cls-1" points="4.5 5.83 6.5 7.83 13.17 1.17" />
              <path
                class="cls-1"
                d="M12.5,6.5v4.67a1.34,1.34,0,0,1-1.33,1.33H1.83A1.34,1.34,0,0,1,.5,11.17V1.83A1.34,1.34,0,0,1,1.83.5H9.17"
              />
            </g>
          </g>
        </svg>
      </div>

      <!-- unorder list -->
      <div class="dashboard-item-toolbar-icon" data-action="bullet" @click=${this.handleToolbarAction}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 14.8 12"
          style="fill:currentColor"
          width="14"
          height="12"
        >
          <g id="Calque_2" data-name="Calque 2">
            <g id="Calque_1-2" data-name="Calque 1">
              <path
                d="M1.2,4.8A1.2,1.2,0,1,0,2.4,6,1.2,1.2,0,0,0,1.2,4.8ZM1.2,0A1.2,1.2,0,1,0,2.4,1.2,1.2,1.2,0,0,0,1.2,0Zm0,9.6a1.2,1.2,0,1,0,1.2,1.2A1.2,1.2,0,0,0,1.2,9.6Zm3.2,2H14A.8.8,0,1,0,14,10H4.4a.8.8,0,0,0,0,1.6Zm0-4.8H14a.8.8,0,1,0,0-1.6H4.4a.8.8,0,0,0,0,1.6ZM3.6,1.2a.8.8,0,0,0,.8.8H14A.8.8,0,1,0,14,.4H4.4A.8.8,0,0,0,3.6,1.2Z"
              />
            </g>
          </g>
        </svg>
      </div>

      <!-- order list  -->
      <div class="dashboard-item-toolbar-icon" data-action="ordered" @click=${this.handleToolbarAction}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 14.07 12"
          style="fill:currentColor"
          width="14"
          height="12"
        >
          <g id="Calque_2" data-name="Calque 2">
            <g id="Layer_1" data-name="Layer 1">
              <path
                d="M1,7V7l.4-.44a7.05,7.05,0,0,0,.54-.64.91.91,0,0,0-.13-1.16A1.12,1.12,0,0,0,1,4.49a1,1,0,0,0-.74.29A.89.89,0,0,0,0,5.47H.69a.6.6,0,0,1,.08-.33A.28.28,0,0,1,1,5a.33.33,0,0,1,.26.1.41.41,0,0,1,.08.28.57.57,0,0,1-.08.28A2.4,2.4,0,0,1,1,6.05l-1,1v.43H2.09V7Z"
              />
              <polygon
                points="1.43 2.46 1.43 0 0.04 0.21 0.04 0.7 0.7 0.7 0.7 2.46 0.04 2.46 0.04 3 2.09 3 2.09 2.46 1.43 2.46"
              />
              <path
                d="M2,10.7a.76.76,0,0,0-.37-.26A.89.89,0,0,0,2,10.17.64.64,0,0,0,2.1,9.8a.76.76,0,0,0-.29-.63A1.25,1.25,0,0,0,1,9a1.1,1.1,0,0,0-.7.22.67.67,0,0,0-.28.59v0H.72a.21.21,0,0,1,.1-.21.42.42,0,0,1,.24-.09.33.33,0,0,1,.26.1.32.32,0,0,1,.09.23.39.39,0,0,1-.1.29.42.42,0,0,1-.29.1H.7v.49H1a.49.49,0,0,1,.32.1.41.41,0,0,1,.12.32.36.36,0,0,1-.11.26.39.39,0,0,1-.29.1.37.37,0,0,1-.27-.11.27.27,0,0,1-.11-.25H0v0a.71.71,0,0,0,.3.64A1.31,1.31,0,0,0,1,12a1.33,1.33,0,0,0,.8-.23.76.76,0,0,0,.31-.64A.69.69,0,0,0,2,10.7Z"
              />
              <path
                d="M4.23,9.56h9.71a.13.13,0,0,1,.13.14V11a.25.25,0,0,1-.13.18H4.23c-.08-.05-.14-.11-.14-.18V9.7A.14.14,0,0,1,4.23,9.56Z"
              />
              <rect x="4.09" y="5.24" width="9.98" height="1.65" rx="0.14" />
              <rect x="4.09" y="0.6" width="9.98" height="1.65" rx="0.14" />
            </g>
          </g>
        </svg>
      </div>
    `;
  }
}
