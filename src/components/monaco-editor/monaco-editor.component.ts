import {
  css,
  customElement,
  html,
  LitElement,
  property,
  query,
} from 'lit-element';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { delay, mergeMap, tap } from 'rxjs/operators';
import { monacoScript } from './init-monaco-script';

@customElement('cff-monaco-editor')
export class MonacoEditor extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex: 1;
      width: 100%;
      height: 100%;
    }

    #code-editor-iframe {
      width: 100%;
      height: 100%;
    }
  `;

  @query('#code-editor-iframe') iframe!: HTMLIFrameElement;

  @property({ type: String }) libPath = 'node_modules/monaco-editor/min/vs';
  @property({ type: Object }) monacoEditorOption: any = {};
  @property({ type: Boolean }) readonly = false;

  #language = 'markdown';
  @property({ type: String })
  public get language() {
    return this.#language;
  }
  public set language(value) {
    if (value !== this.#language) {
      this.#language = value;
      this.monacoLanguageChanged(value);
    }
  }

  setLanguage(value: string) {
    if (value !== this.#language) {
      this.language = value;
      this.dispatchEvent(
        new CustomEvent('language-changed', {
          bubbles: true,
          cancelable: true,
          detail: value,
        })
      );
    }
  }

  @property({ type: String }) theme = 'Atom-One-Dark';

  #value: any;
  @property({ type: Object })
  public get value(): any {
    return this.#value;
  }
  public set value(value: any) {
    this.#value = value;
    this.monacoValueChanged(value);
  }

  monacoScript = '';

  #focus = false;
  focus() {
    this.#focus = true;
    this.setMonacoFocus();
  }

  uuid = this.generateUUID();
  #ready = false;

  #ready$ = new Subject<void>();
  #queueMessage = new ReplaySubject<any>(10);
  #queueMessageSubscription = Subscription.EMPTY;

  generateUUID() {
    return 'ss-s-s-s-sss'.replace(/s/g, this.uuidPart);
  }

  uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  connectedCallback() {
    this.monacoScript = monacoScript;
    window.addEventListener('message', this.handleMessage, false);
    super.connectedCallback();

    this.#queueMessageSubscription = this.#ready$
      .pipe(
        delay(100),
        tap(() => {
          this.bubbleIframeMouseMove(this.iframe);
        }),
        mergeMap(() => this.#queueMessage)
      )
      .subscribe(data => this.postMessage(data.event, data.payload));
  }

  disconnectedCallback() {
    window.removeEventListener('message', this.handleMessage);
    this.#queueMessageSubscription.unsubscribe();
    super.disconnectedCallback();
  }

  render() {
    return html`<iframe
      id="code-editor-iframe"
      data-uuid=${this.uuid}
      data-lib-path=${this.libPath}
      frameborder="0"
      srcdoc=${this.monacoScript}
    ></iframe>`;
  }

  handleMessage = (message: MessageEvent) => {
    const data = message.data;
    if (typeof data === 'string' || data.uuid !== this.uuid) return;

    switch (data.event) {
      case 'valueChanged':
        this.dispatchValueChangeEvent(data.payload);
        break;
      case 'ready':
        this.#ready = true;
        this.#ready$.next();
        break;
    }
  };

  private dispatchValueChangeEvent(payload: any) {
    const evt = new CustomEvent('value-changed', {
      bubbles: true,
      cancelable: true,
      detail: payload,
    });
    this.dispatchEvent(evt);
  }

  setMonacoFocus() {
    this.postMessage('focus', true);
  }

  monacoValueChanged(value: any) {
    this.postMessage('valueChanged', value);
  }

  monacoLanguageChanged(value: string) {
    this.postMessage('languageChanged', value);
  }

  monacoFormatDocument() {
    this.postMessage('format', null);
  }

  postMessage(event: string, payload: any) {
    if (!this.#ready || !this?.iframe.contentWindow) {
      this.#queueMessage.next({ event, payload });
      return;
    }
    this.iframe.contentWindow.postMessage(
      { event, payload },
      window.location.href
    );
  }

  bubbleIframeMouseMove(iframe: HTMLIFrameElement): void {
    if (!iframe.contentWindow) return;
    // Save any previous onmousemove handler
    const existingOnMouseMove = iframe.contentWindow.onmousemove
      ? iframe.contentWindow.onmousemove.bind(iframe)
      : null;
    // Attach a new onmousemove listener
    iframe.contentWindow.onmousemove = e => {
      // Fire any existing onmousemove listener
      if (existingOnMouseMove) {
        existingOnMouseMove(e);
      }

      // Create a new event for the this window
      const evt = document.createEvent('MouseEvents');

      // We'll need this to offset the mouse move appropriately
      const boundingClientRect = iframe.getBoundingClientRect();

      // Initialize the event, copying exiting event values
      // for the most part
      evt.initMouseEvent(
        'mousemove',
        true, // bubbles
        false, // not cancelable
        window,
        e.detail,
        e.screenX,
        e.screenY,
        e.clientX + boundingClientRect.left,
        e.clientY + boundingClientRect.top,
        e.ctrlKey,
        e.altKey,
        e.shiftKey,
        e.metaKey,
        e.button,
        null // no related element
      );

      // Dispatch the mousemove event on the iframe element
      iframe.dispatchEvent(evt);
    };
  }
}
