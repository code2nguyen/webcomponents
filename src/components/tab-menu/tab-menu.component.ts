import {
  css,
  customElement,
  html,
  LitElement,
  property,
  query,
} from 'lit-element';

import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';

@customElement('cff-tab-menu')
export class TabMenu extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: flex;
      align-items: center;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      color: rgba(var(--tab-menu-text-color, 255, 255, 255), 0.5);
    }

    .menu-item {
      padding: 0px 8px;
      line-height: 32px;
      font-family: inherit;
      font-weight: inherit;
      position: relative;
      user-select: none;
      text-align: center;
      cursor: pointer;
    }

    .menu-item-seperator {
      min-width: 8px;
      max-width: 32px;
      flex: 1;
    }

    .slider.active {
      visibility: visible;
      background-color: rgb(var(--active-border-color, 255, 114, 107));
    }

    .slider {
      position: absolute;
      visibility: hidden;
      bottom: 0;
      height: 3px;
      transition: 300ms cubic-bezier(0.35, 0, 0.25, 1);
    }

    .menu-item:not(.active):hover {
      color: rgba(var(--tab-menu-text-color, 255, 255, 255), 0.7);
    }

    .menu-item.active {
      color: rgba(var(--tab-menu-text-color, 255, 255, 255), 1);
    }
  `;

  @property({ type: Array }) items = new Array<string>();
  #selectedItem = '';

  @property({ type: String })
  public get selectedItem() {
    return this.#selectedItem;
  }
  public set selectedItem(value: string) {
    if (this.#selectedItem == value) return;
    const oldValue = this.#selectedItem;
    this.activeItem[oldValue] = {};
    this.activeItem[value] = { active: true };
    const newSelectedIndex = this.items.indexOf(value);
    this.updateSliderPosition(newSelectedIndex);
    this.#selectedItem = value;
    this.requestUpdate('selectedItem', oldValue);
  }

  activeItem: { [item: string]: any } = {};
  sliderStyle: {
    [key: string]: any;
  } = {};

  updateSliderPosition(newIndex: number): void {
    const newSelectedItem = this.shadowRoot!.querySelectorAll(
      '.menu-item'
    ).item(newIndex) as HTMLElement;
    if (newSelectedItem) {
      this.activeItem.active = { active: true };
      this.sliderStyle.left = `${newSelectedItem.offsetLeft}px`;
      this.sliderStyle.width = `${newSelectedItem.clientWidth}px`;
      this.requestUpdate();
    }
  }

  firstUpdated() {
    setTimeout(() => {
      this.updateSliderPosition(this.items.indexOf(this.#selectedItem));
    }, 100);
  }

  onItemClick(item: string) {
    return (event: Event) => {
      this.selectedItem = item;
      this.dispatchEvent(new CustomEvent('tab-change', { detail: item }));
    };
  }

  render() {
    return html`
      ${this.items.map(item => {
        return html`
          <div
            class="menu-item ${classMap(this.activeItem[item])}"
            @click=${this.onItemClick(item)}
          >
            ${item}
          </div>
          <div class="menu-item-seperator"></div>
        `;
      })}
      <div
        class="slider ${classMap(this.activeItem.active)}s"
        style=${styleMap(this.sliderStyle)}
      ></div>
    `;
  }
}
