import {
  css,
  customElement,
  html,
  LitElement,
  property,
  query,
} from 'lit-element';
import { MonacoEditor } from '../monaco-editor/monaco-editor.component';
import { Menu } from '@material/mwc-menu';

@customElement('cff-monaco-editor-toolbar')
export class MonacoEditorToolbar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      align-self: stretch;
    }
    .dashboard-item-toolbar {
      color: rgba(var(--dashboard-theme-item-icon-color, 255, 255, 255), 0.5);
      padding: 0px 8px;
      cursor: pointer;
      transition: color 0.3s ease-out 0s;
      align-self: stretch;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.8rem;
      position: relative;
    }

    .dashboard-item-toolbar:hover {
      color: rgb(var(--dashboard-theme-item-icon-color, 255, 255, 255));
    }
    .dashboard-item-toolbar-separator {
      width: 8px;
    }
    .first-capitalize {
      text-transform: capitalize;
    }
  `;

  @property({ type: String }) language = 'markdown';

  @query('#language-menu') languageMenu!: Menu;
  @query('#language-text') languageText!: HTMLElement;

  #languages: string[] = [
    'cpp',
    'css',
    'dockerfile',
    'html',
    'java',
    'javascript',
    'json',
    'markdown',
    'scss',
    'shell',
    'sql',
    'typescript',
    'yaml',
  ];

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.parentElement?.removeEventListener('hideToolbar', this.onHideToolbar);
    super.disconnectedCallback();
  }

  async firstUpdated() {
    // Give the browser a chance to paint
    await new Promise(r => setTimeout(r, 0));
    this.languageMenu.anchor = this.languageText;
    this.parentElement?.addEventListener('hideToolbar', this.onHideToolbar);
  }

  onHideToolbar = () => {
    this.languageMenu.open = false;
  };

  getMonacoEditor(): MonacoEditor | undefined {
    const monacoEditorEl = this.parentElement?.querySelector(
      'cff-monaco-editor'
    );
    return monacoEditorEl ? (monacoEditorEl as MonacoEditor) : undefined;
  }

  formatDocument() {
    const monacoEditor = this.getMonacoEditor();
    if (monacoEditor) {
      monacoEditor.monacoFormatDocument();
    }
  }

  openSelectLanguageMenu() {
    this.languageMenu.open = true;
  }

  changeLanguage(event: any) {
    const newLanguage = this.#languages[event.detail.index];
    if (newLanguage !== this.language) {
      this.language = newLanguage;
      const monacoEditor = this.getMonacoEditor();
      if (monacoEditor) {
        monacoEditor.setLanguage(this.language);
      }
    }
  }

  render() {
    return html`
      <!-- color -->
      <div class="dashboard-item-toolbar">

      <span id="language-text" class="first-capitalize"  @click=${
        this.openSelectLanguageMenu
      }>${this.language}</span>
        <mwc-menu activatable @selected=${
          this.changeLanguage
        } class="menu" id="language-menu" fixed menuCorner="START" corner="BOTTOM_START" y="-30" x="0">
          ${this.#languages.map(
            lang =>
              html`<mwc-list-item
                value=${lang}
                class="first-capitalize"
                ?selected=${this.language === lang}
                ?activated=${this.language === lang}
                >${lang}</mwc-list-item
              >`
          )}
        </mwc-menu>
      </div>

      <div class="dashboard-item-toolbar-separator"></div>
      <!-- code -->
      <div class="dashboard-item-toolbar" data-action="code-block" @click=${
        this.formatDocument
      }">
        Format
      </div>
    `;
  }
}
