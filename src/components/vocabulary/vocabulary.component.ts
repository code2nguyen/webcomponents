import {
  css,
  customElement,
  html,
  internalProperty,
  LitElement,
  property,
} from 'lit-element';
import { generateUUID } from '../../shared/utils';
import { NEW_ITEM_ID, Vocabulary } from './vocabulary';

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

  private emptyItem: Vocabulary = {
    id: NEW_ITEM_ID,
    word: '',
    meaning: [],
  };

  private _value: Vocabulary[] = [
    {
      id: '1',
      word: 'Bonjour',
      meaning: [
        {
          type: 'paragraph',
          children: [
            {
              text:
                "Since it's rich text, you can do things like turn a selection of text ",
            },
            { text: 'bold', bold: true },
            {
              text:
                ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      word: 'Have a good day',
      meaning: [
        {
          type: 'paragraph',
          children: [
            {
              text:
                "Since it's rich text, you can do things like turn a selection of text ",
            },
            { text: 'bold', bold: true },
            {
              text:
                ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
          ],
        },
      ],
    },
    {
      id: '3',
      word: 'Bonjour',
      meaning: [
        {
          type: 'paragraph',
          children: [
            {
              text:
                "Since it's rich text, you can do things like turn a selection of text ",
            },
            { text: 'bold', bold: true },
            {
              text:
                ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
          ],
        },
      ],
    },
    { ...this.emptyItem },
  ];

  @property({ type: Array })
  public get value() {
    return this._value;
  }
  public set value(value) {
    const oldValue = this._value;
    if (!value || value.length === 0) {
      this._value = [{ ...this.emptyItem }];
    } else {
      this._value = value;
    }
    this.requestUpdate('value', oldValue);
  }

  @internalProperty() openItemId = NEW_ITEM_ID;

  render() {
    return html`
      ${this.value.map(
        item =>
          html`<cff-vocabulary-item
              .item=${item}
              @openClick=${this.onOpenClick}
              @itemChange=${this.onItemChange}
              ?open=${item.id === this.openItemId}
            ></cff-vocabulary-item>
            <hr class="seperator" />`
      )}
    `;
  }

  onOpenClick(event: CustomEvent) {
    this.openItemId = event.detail.id;
  }

  onItemChange(event: CustomEvent) {
    const item: Vocabulary = event.detail;

    if (item.id === NEW_ITEM_ID) {
      item.id = generateUUID();
      this.openItemId = item.id;
      this.value.push({ ...this.emptyItem });
      this.requestUpdate();
    }
    this.dispatchEvent(
      new CustomEvent('valueChange', {
        detail: this.value.slice(0, this.value.length - 1),
      })
    );
  }
}
