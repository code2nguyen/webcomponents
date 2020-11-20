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
import { ExtraVocabulary } from './vocabulary';
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
      transition: background-color 225ms cubic-bezier(0.13, 0.53, 0.81, 0.4)
        100ms;
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
      padding: 8px 64px 8px 16px;
    }

    .meaning {
      font-family: var(--vocabulary-meaning-font, 'RedHatText');
      font-size: var(--vocabulary-meaning-font-size, 13px);
      font-weight: 400;
      flex: 1;
      min-height: 90px;
    }
    .open {
      background-color: rgba(42, 43, 46, 0.8);
    }
    .open > .meaning {
      display: flex;
      opacity: 1;
      /* animation: displayMeaning 225ms ease-out; */
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
      opacity: 0;
    }

    @keyframes displayMeaning {
      0% {
        height: 0;
      }
      100% {
        height: auto;
      }
    }

    .close > .seperator {
      display: none;
    }

    .action-bar {
      display: flex;
      fill: var(--vocabulary-word-color, #dfe3eb);
      position: absolute;
      right: 8px;
      top: 10px;
      opacity: 0;
      transition: opacity 225ms ease-out;
    }

    .arrow_down,
    .remove {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    .arrow_down {
      transition: transform 225ms ease-in-out;
    }
    .remove {
      padding-right: 8px;
    }
    .close:hover .action-bar {
      opacity: 1;
    }
    .open:hover .action-bar {
      opacity: 1;
    }

    .open-header .arrow_down {
      transform: rotateX(180deg);
    }

    .seperator {
      width: 100%;
      height: 0px;
      border: 0px;
      margin: 0px;
      border-bottom: 1px solid rgba(182, 189, 204, 0.2);
    }
    .new-item {
      animation: newItem 350ms ease-in-out forwards;
    }

    @keyframes newItem {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        opacity: 1;
      }
    }
  `;

  private _item!: ExtraVocabulary;

  @property({ type: Object })
  public get item(): ExtraVocabulary {
    return this._item;
  }
  public set item(value: ExtraVocabulary) {
    const oldValue = this._item;
    if (oldValue && oldValue.id === value.id && oldValue.isNew === value.isNew)
      return;
    this._item = { ...value };
    this.openClasses['new-item'] = !!value.isNew;
    this.requestUpdate('item', oldValue);
  }

  @property({ type: Boolean }) readOnly = false;

  @query('.meaning') meaningTextInput?: HTMLElement;
  @query('.arrow_down') arrowButton?: HTMLElement;

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
    this.openClasses['open-header'] = value;
    this.openClasses.close = !value;
    this.requestUpdate('open', oldValue);
  }

  openClasses = {
    open: false,
    close: true,
    'open-header': false,
    'new-item': false,
  };

  render() {
    return html`
      <div class="item ${classMap(this.openClasses)}" @click=${this.onClick}>
        <input type="text" placeholder='Vocabulary'
        value=${ifDefined(this.item.word ? this.item.word : undefined)}
        class="word"
        spellcheck="false"
        @keyup=${this.onWordChange}
        ?disabled=${!this.open && !this.item.isNew}
        ></input>
        <hr class="seperator"/>
        <rich-text-editor
                placeholder="Meaning"
                class="meaning"
                spellcheck="false"
                .readOnly=${this.readOnly}
                .value=${this.item.meaning}
                @valueChange=${this.onMeaningChange}
              ></rich-text-editor>
        ${
          !this.item.isNew
            ? html`<div class="action-bar">
                <svg
                  @click=${this.removeItem}
                  viewBox="0 0 16 16"
                  class="remove"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
                <svg
                  @click=${this.toggleOpen}
                  viewBox="0 0 24 24"
                  class="arrow_down"
                >
                  <path
                    d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                  />
                </svg>
              </div>`
            : ''
        }
      </div>
    `;
  }

  removeItem(event: Event) {
    event.stopPropagation();
    this.addEventListener('transitionend', this.onRemoveTransitionEnd);
    this.classList.add('remove');
  }

  toggleOpen(event: Event) {
    event.stopPropagation();
    this.openClasses['open-header'] = !this.open;
    this.requestUpdate();
    this.arrowButton?.addEventListener(
      'transitionend',
      this.onArrowTransitionEnd
    );
  }

  onClick() {
    if (!this.open) {
      this.openClasses['open-header'] = true;
      this.requestUpdate();
      if (this.arrowButton) {
        this.arrowButton?.addEventListener(
          'transitionend',
          this.onArrowTransitionEnd
        );
      } else {
        this.dispatchEvent(new CustomEvent('openClick', { detail: this.item }));
      }
    }
  }

  onArrowTransitionEnd = (event: Event) => {
    this.arrowButton?.removeEventListener(
      'transitionend',
      this.onArrowTransitionEnd
    );
    this.dispatchEvent(
      new CustomEvent('openClick', {
        detail: this.openClasses['open-header'] ? this.item : null,
      })
    );
  };

  onRemoveTransitionEnd = (event: Event) => {
    this.removeEventListener('transitionend', this.onRemoveTransitionEnd);
    this.dispatchEvent(new CustomEvent('moveItem', { detail: this.item }));
  };

  onWordChange(event: KeyboardEvent) {
    this.item.word = (event.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('itemChange', { detail: this.item }));
  }

  onMeaningChange(event: CustomEvent) {
    this.item.meaning = event.detail;
    this.dispatchEvent(new CustomEvent('itemChange', { detail: this.item }));
  }
}
