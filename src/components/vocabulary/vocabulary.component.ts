import {
  css,
  customElement,
  html,
  internalProperty,
  LitElement,
  property,
} from 'lit-element';
import { generateUUID } from '../../shared/utils';
import { ExtraVocabulary } from './vocabulary';
import { repeat } from 'lit-html/directives/repeat.js';

@customElement('cff-vocabulary')
export class VocabularyComponent extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      height: 100%;
      background: transparent;
      font-family: var(--vocabulary-font, 'RedHatText');
      font-size: var(--vocabulary-font-size, 15px);
      font-weight: 300;
      overflow: auto;
    }
    .seperator {
      width: 100%;
      height: 0px;
      border: 0px;
      margin: 0px;
      border-bottom: 1px solid rgba(182, 189, 204, 0.2);
    }
  `;

  private get emptyItem(): ExtraVocabulary {
    return {
      id: generateUUID(),
      word: '',
      meaning: [],
      isNew: true,
    };
  }

  // private _value: ExtraVocabulary[] = [
  //   {
  //     id: '1',
  //     word: 'Bonjour',
  //     meaning: [
  //       {
  //         type: 'paragraph',
  //         children: [
  //           {
  //             text:
  //               "Since it's rich text, you can do things like turn a selection of text ",
  //           },
  //           { text: 'bold', bold: true },
  //           {
  //             text:
  //               ', or add a semantically rendered block quote in the middle of the page, like this:',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: '2',
  //     word: 'Have a good day',
  //     meaning: [
  //       {
  //         type: 'paragraph',
  //         children: [
  //           {
  //             text:
  //               "Since it's rich text, you can do things like turn a selection of text ",
  //           },
  //           { text: 'bold', bold: true },
  //           {
  //             text:
  //               ', or add a semantically rendered block quote in the middle of the page, like this:',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: '3',
  //     word: 'Bonjour',
  //     meaning: [
  //       {
  //         type: 'paragraph',
  //         children: [
  //           {
  //             text:
  //               "Since it's rich text, you can do things like turn a selection of text ",
  //           },
  //           { text: 'bold', bold: true },
  //           {
  //             text:
  //               ', or add a semantically rendered block quote in the middle of the page, like this:',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   { ...this.emptyItem },
  // ];

  private _value: ExtraVocabulary[] = [this.emptyItem];
  @property({ type: Array })
  public get value() {
    return this._value;
  }
  public set value(value) {
    const oldValue = this._value;
    if (!value || value.length === 0) {
      this._value = [this.emptyItem];
    } else {
      this._value = [...value];
    }
    this.requestUpdate('value', oldValue);
  }

  @property({ type: Boolean }) readOnly = false;

  @internalProperty() openItemId = '';

  render() {
    return html`
      ${repeat(
        this.value,
        item => item.id,
        item =>
          html`<cff-vocabulary-item
              .item=${item}
              .readOnly=${this.readOnly}
              @openClick=${this.onOpenClick}
              @itemChange=${this.onItemChange}
              @moveItem=${this.onRemoveItem}
              ?open=${item.id === this.openItemId}
            ></cff-vocabulary-item>
            <hr class="seperator" />`
      )}
    `;
  }

  onOpenClick(event: CustomEvent) {
    if (event.detail) {
      this.openItemId = event.detail.id;
    } else {
      this.openItemId = '';
    }
  }

  onRemoveItem(event: CustomEvent) {
    const item: ExtraVocabulary = event.detail;
    const valueIndex = this.value.findIndex(i => i.id === item.id);
    this.value = [
      ...this.value.slice(0, valueIndex),
      ...this.value.slice(valueIndex + 1),
    ];
    this.requestUpdate();
    this.dispatchValueChange();
  }

  onItemChange(event: CustomEvent) {
    const item: ExtraVocabulary = { ...event.detail };

    if (item.isNew && item.word) {
      const newItem = this.emptyItem;
      item.isNew = false;
      this.openItemId = item.id;
      this.value.push({ ...newItem });
    }
    if (this.openItemId !== item.id) {
      this.openItemId = item.id;
    }
    const valueIndex = this.value.findIndex(i => i.id === item.id);
    this.value = [
      ...this.value.slice(0, valueIndex),
      item,
      ...this.value.slice(valueIndex + 1),
    ];
    this.requestUpdate();
    this.dispatchValueChange();
  }

  private dispatchValueChange() {
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: this.value.slice(0, this.value.length - 1),
      })
    );
  }
}
