import {
  html,
  LitElement,
  css,
  query,
  property,
  customElement,
} from 'lit-element';
import { autoFormat } from './auto-format.plugin';
import { createQuillEditorTheme } from './quill-editor.theme';
import { styles } from './quill.css';
declare const window: any;

function setupQuill() {
  window.Quill.register(
    'themes/quillEditorTheme',
    createQuillEditorTheme(),
    true
  );

  (document as any).adoptedStyleSheets = [
    ...(document as any).adoptedStyleSheets,
    ...styles.map(style => style.styleSheet),
  ];
  window.Quill.register('modules/autoHyperLink', autoFormat());

  if (window.hljs) {
    window.hljs.configure({
      languages: [
        'javascript',
        'css',
        'json',
        'bash',
        'cpp',
        'dockerfile',
        'html',
        'java',
        'markdown',
        'sql',
        'typescript',
        'yaml',
        'scss',
      ],
    });
  }
}
@customElement('cff-quill-editor')
export class QuillEditor extends LitElement {
  editor?: any;
  #Quill!: any;

  @property({ type: String }) placeholder = '';

  @property({ type: String }) format = 'html';

  @property({ type: Boolean }) readonly = false;

  #content: any;
  @property({ type: Object, attribute: false })
  public get content(): any {
    return this._getQuillContent();
  }
  public set content(value: any) {
    this.#content = value;
    this._initQuillContent();
  }

  @query('#quillContainer') quillContainer!: HTMLElement;

  connectedCallback() {
    this.classList.add('quill-editor');
    super.connectedCallback();
  }

  async firstUpdated() {
    if (!window.Quill) {
      if (!window.QuillLoading) {
        window.QuillLoading = import('quill');
        const Quill = await window.QuillLoading;
        window.Quill = window.Quill || Quill.default;
        setupQuill();
      } else {
        await window.QuillLoading;
      }
    }
    this.#Quill = window.Quill;
    this.initQuillEditor();
    this._initQuillContent();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div id="quillContainer" style="flex: 1" spellcheck="false"></div>
    `;
  }

  private _getQuillContent(): any {
    if (!this.editor) return null;

    let html: string | null = this.querySelector('.ql-editor')!.innerHTML;
    if (html === '<p><br></p>' || html === '<div><br></div>') {
      html = null;
    }
    let quillContent: any = html;
    if (this.format === 'object') {
      quillContent = this.editor.getContents();
    } else if (this.format === 'json') {
      try {
        quillContent = JSON.stringify(this.editor.getContents());
      } catch (e) {
        quillContent = this.editor.getText();
      }
    }
    return quillContent;
  }

  private _initQuillContent() {
    if (!this.editor || !this.#content) return;
    let quillContent: any;
    if (this.format === 'html') {
      quillContent = this.editor.clipboard.convert(this.#content);
    } else if (this.format === 'json') {
      try {
        quillContent = JSON.parse(this.#content);
      } catch (e) {
        quillContent = [{ insert: this.#content }];
      }
    } else if (this.format === 'object') {
      quillContent = this.#content;
    }
    this.editor.setContents(quillContent, 'silent');
  }

  private initQuillEditor() {
    this.adoptStyles;
    const toolbarOptions = [
      [{ header: 1 }, { header: 2 }], // custom button values
      ['bold', 'italic', 'strike'], // toggled buttons
      [{ color: [] }], // dropdown with defaults from theme
      ['clean'], // remove formatting button
    ];
    this.editor = new this.#Quill(this.quillContainer, {
      theme: 'quillEditorTheme',
      bounds: this,
      modules: {
        syntax: true, // Include syntax module
        toolbar: toolbarOptions,
        autoHyperLink: true,
      },
      readOnly: this.readonly,
      placeholder: this.placeholder,
    });

    this.editor.on('editor-change', this.editorChangeHandler);

    if (!this.readonly && this.#focus) {
      this.editor.focus();
    }
  }

  #focus = false;
  focus() {
    if (!this.readonly && this.editor) {
      this.editor.focus();
    }
    this.#focus = true;
  }

  editorChangeHandler = (
    event: 'text-change' | 'selection-change',
    current: any | Range | null,
    old: any | Range | null,
    source: string
  ): void => {
    // only emit changes emitted by user interactions
    if (event === 'text-change' && source === 'user') {
      this._dispatchContentChangeEvent();
    }
  };

  private _dispatchContentChangeEvent() {
    const event = new CustomEvent('content-change', {
      detail: {
        content: this.content,
        editor: this.editor,
      },
    });
    this.dispatchEvent(event);
  }
}
