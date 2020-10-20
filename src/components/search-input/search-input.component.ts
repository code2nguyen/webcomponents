import {
  css,
  customElement,
  html,
  LitElement,
  property,
  query,
} from 'lit-element';

import { styleMap } from 'lit-html/directives/style-map.js';
import { ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import '@material/mwc-circular-progress-four-color';

@customElement('cff-search-input')
export class SearchInput extends LitElement {
  static styles = css`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      color: rgba(var(--search-input-text-color, 255, 255, 255), 0.3);
      background-color: var(--search-input-bg-color, #494c52);
      border-radius: 8px;
      max-height: 48px;
      position: relative;
      border: 1 solid var(--search-input-text-border-color, transparent);
    }

    :host(.active) {
      background-color: var(--search-input-bg--active-color, #595c63);
    }

    :host(.active) .icon {
      color: rgb(var(--search-input-text-color, 255, 255, 255));
    }

    :host(.active) .text-input {
      color: rgb(var(--search-input-text-color, 255, 255, 255));
    }

    :host(.active) .text-input::placeholder {
      color: rgba(var(--search-input-text-color, 255, 255, 255), 0.5);
    }

    .text-input {
      padding: 16px 32px 16px 44px;
      flex: 1;
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      box-sizing: border-box;
      color: rgba(var(--search-input-text-color, 255, 255, 255), 0.5);
      font-size: var(--search-input-text-font-size, 16px);
      z-index: 1;
    }

    .icon {
      display: flex;
      position: absolute;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 100%;
      color: rgba(var(--search-input-text-color, 255, 255, 255), 0.3);
    }

    .icon svg {
      width: 18px;
      height: 18px;
    }
    .clear-icon {
      right: 0;
      z-index: 2;
      cursor: pointer;
      transition: opacity 0.3s ease-out;
    }

    .search-icon {
      left: 0;
      z-index: 0;
    }

    .loading {
      position: absolute;
      right: 8px;
      --mdc-circular-progress-bar-color-1: #ff726b;
      --mdc-circular-progress-bar-color-2: #ff726b;
      --mdc-circular-progress-bar-color-3: #ff726b;
      --mdc-circular-progress-bar-color-4: #ff726b;
    }

    .clear-icon:hover {
      color: rgb(var(--search-input-text-color, 255, 255, 255));
    }
  `;

  @property({ type: String }) placeholder = 'Search...';

  #value = '';
  @property({ type: String })
  public get value() {
    return this.#value;
  }
  public set value(value) {
    const oldValue = this.#value;
    this.#value = value;
    if (!value) {
      this.#showHideIcon.opacity = '0';
    }
    this.requestUpdate('value', oldValue);
  }
  @property({ type: Boolean }) loading = false;

  @query('.clear-icon') clearIcon!: HTMLElement;
  @query('.text-input') textInput!: HTMLInputElement;

  #showHideIcon = { opacity: '0' };
  #term$ = new ReplaySubject<string>(1);
  #termSubscription: Subscription = Subscription.EMPTY;

  connectedCallback() {
    super.connectedCallback();
    this.#termSubscription = this.#term$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(query => {
        this._dispatchChangeEvent(query);
      });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#termSubscription.unsubscribe();
  }

  _setDesctive(event: Event) {
    this.classList.remove('active');
  }

  _setActive(event: Event) {
    this.classList.add('active');
    this.textInput.focus();
  }

  _handleKeyup(event: any) {
    this.#showHideIcon.opacity = '1';
    this.value = event.target.value;
    this.#term$.next(this.value);
    if (!this.value) {
      this.#showHideIcon.opacity = '0';
    }
  }

  _clearTextInput() {
    if (!this.value) return;
    this.value = '';
    this.textInput.value = '';
    this.#term$.next(this.value);
    this.#showHideIcon.opacity = '0';
  }

  _dispatchChangeEvent(query: string) {
    const changeEvent = new CustomEvent('change', {
      detail: query,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(changeEvent);
  }

  render() {
    return html`
      <div class="icon search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <input placeholder=${this.placeholder} class="text-input"
      .value=${this.value}
      @focus=${this._setActive}
      @blur=${this._setDesctive}
      @keyup=${this._handleKeyup}></input>
      ${
        this.loading
          ? html`<mwc-circular-progress-four-color
              class="loading"
              density="-6"
              indeterminate
            ></mwc-circular-progress-four-color>`
          : html`
              <div
                class="icon clear-icon"
                style=${styleMap(this.#showHideIcon)}
                @click=${this._clearTextInput}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-x"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
            `
      }

    `;
  }
}
