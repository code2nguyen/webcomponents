import {
  customElement,
  html,
  LitElement,
  property,
  css,
  query,
} from 'lit-element';
import '@c2n/slate-lit/slate-lit.component';
import '@c2n/slate-lit/rich-text-editor.component';
import '@c2n/slate-lit/toolbar.component';
import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined';
import { NEW_ITEM_ID, Vocabulary } from './vocabulary';
export declare const window: any;

@customElement('cff-vocabulary-item')
export class VocabularyItem extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .item {
      display: flex;
      flex-direction: column;
    }

    .word {
      color: var(--vocabulary-word-color, #dfe3eb);
      background: transparent;
      border: none;
      resize: none;
      outline: none;
      padding-left: 8px;
      font-family: var(--vocabulary-word-font, 'RedHatDisplay');
      font-size: var(--vocabulary-word-font-size, 15px);
      font-weight: 300;
      padding: 0;
      flex-basis: 22px;
      padding: 8px 0px 8px 16px;
    }

    .meaning {
      font-family: var(--vocabulary-meaning-font, 'RedHatText');
      font-size: var(--vocabulary-meaning-font-size, 13px);
      font-weight: 400;
      flex: 1;
    }
    .open {
      background-color: #2a2b2e;
    }
    .open > .meaning {
      display: flex;
    }

    .close {
      cursor: pointer;
      /* height: 22px; */
    }
    .close > * {
      cursor: pointer;
    }
    .close > .meaning {
      display: none;
    }

    .close > .seperator {
      display: none;
    }
    .arrow_down {
      width: 18px;
      height: 18px;
      fill: var(--vocabulary-word-color, #dfe3eb);
      position: absolute;
      right: 8px;
      top: 10px;
      opacity: 0;
      transition: opacity 0.1s ease-out;
    }
    .close:hover .arrow_down {
      opacity: 1;
    }
    .seperator {
      width: 100%;
      height: 0px;
      border: 0px;
      margin: 0px;
      border-bottom: 1px solid rgba(182, 189, 204, 0.2);
    }
  `;

  private _item!: Vocabulary;

  @property({ type: Object })
  public get item(): Vocabulary {
    return this._item;
  }
  public set item(value: Vocabulary) {
    const oldValue = this._item;
    if (oldValue && oldValue.id === value.id) return;
    this._item = value;
    this.requestUpdate('item', oldValue);
  }

  @query('.meaning') meaningTextInput?: HTMLElement;

  private _open = false;
  @property({ type: Boolean })
  public get open() {
    return this._open;
  }
  public set open(value) {
    if (value === this._open) return;
    const oldValue = this._open;
    this._open = value;
    this.openClasses.open = value;
    this.openClasses.close = !value;
    this.requestUpdate('open', oldValue);
  }

  openClasses = { open: false, close: true };
  render() {
    return html`
      <div class="item ${classMap(this.openClasses)}" @click=${this.onClick}>
        <input type="text" placeholder='Vocabulary'
        value=${ifDefined(this.item.word ? this.item.word : undefined)}
        class="word"
        spellcheck="false"
        @keyup=${this.onWordChange}
        ?disabled=${!this.open && this.item.id !== NEW_ITEM_ID}
        ></input>
        <hr class="seperator"/>
        <rich-text-editor
                placeholder="Meaning"
                class="meaning"
                .value=${this.item.meaning}
                @valueChange=${this.onMeaningChange}
              ></rich-text-editor>
        ${
          !this.open && this.item.id !== NEW_ITEM_ID
            ? html`<svg viewBox="0 0 24 24" class="arrow_down">
                <path
                  d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                />
              </svg>`
            : ''
        }
      </div>
    `;
  }

  updated() {
    // if()
  }

  onClick() {
    if (!this.open) {
      this.dispatchEvent(new CustomEvent('openClick', { detail: this.item }));
    }
  }

  onWordChange(event: KeyboardEvent) {
    this.item.word = (event.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('itemChange', { detail: this.item }));
  }

  onMeaningChange(event: CustomEvent) {
    this.item.meaning = event.detail;
    this.dispatchEvent(new CustomEvent('itemChange', { detail: this.item }));
  }

  // onWordFocus() {
  //   if (this.item.id !== NEW_ITEM_ID) {
  //     this.dispatchEvent(new CustomEvent('openClick', { detail: this.item }));
  //   }
  // }
}
