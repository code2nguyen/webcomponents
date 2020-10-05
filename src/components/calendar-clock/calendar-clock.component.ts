import { css, html, LitElement, customElement, query } from 'lit-element';

@customElement('cff-calendar-clock')
export class CalendarClock extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      left: 0;
      margin: 0;
      padding: 0;
      top: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      font-family: 'Source Sans Pro', sans-serif;
      background-color: var(--calender-clock-bg, #303236);
    }

    :host(.close) .welcome-text {
      animation: textClose 0.2s forwards;
    }
    :host(.close) .bloc-1 {
      animation: moveLeftCenter 0.2s forwards;
    }

    :host(.close) .bloc-2 {
      animation: textClose 1s forwards;
    }

    :host(.close) .bloc-3 {
      animation: moveRightCenter 0.2s forwards;
    }

    :host(.close) .bloc-text {
      animation: textClose 0.2s forwards;
    }

    .welcome-text {
      color: var(--calender-clock-welcome-text, #ffffff);
      font-size: 48px;
      margin-bottom: 64px;
      animation: text 1s forwards;
    }
    .calendar-clock-container {
      position: relative;
      width: 100%;
      height: 200px;
      /* margin: auto; */
    }
    .bloc {
      width: 120px;
      height: 120px;
      margin: auto;
      color: #fff;
      background-color: red;
      border-radius: 10px;
      position: absolute;
      top: 0;
      left: calc(50% - 60px);
      transition: transform 2s 1s;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 40px;
    }

    .bloc-1 {
      background-color: #3498db;
      animation: moveLeft 0.5s forwards;
      /* transform: rotate(5deg) translateX(-100px) scale(1); */
    }
    .bloc-2 {
      background-color: #ff726b;
      z-index: 1;
      /* animation: center 0.2s forwards; */
    }
    .bloc-3 {
      background-color: #efc94c;
      animation: moveRight 0.5s forwards;
    }
    .bloc-time,
    .bloc-text {
      animation: text 0.5s ease-out;
    }
    .bloc-text {
      position: absolute;
      bottom: -26px;
      font-size: 16px;
    }
    .bloc-1 .bloc-text {
      color: #3498db;
    }

    .bloc-2 .bloc-text {
      color: #ff726b;
    }

    .bloc-3 .bloc-text {
      color: #efc94c;
    }
    @keyframes text {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes textClose {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    @keyframes center {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0.9);
      }
    }

    @keyframes moveLeft {
      0% {
        transform: rotate(0deg);
      }
      /* 50% {
        transform: rotate(8deg) translateX(-100px) scale(1);
      } */
      100% {
        transform: rotate(5deg) translateX(-100px) scale(1);
      }
    }

    @keyframes moveLeftCenter {
      0% {
        transform: rotate(5deg) translateX(-100px) scale(1);
      }
      /* 50% {
        transform: rotate(8deg) translateX(-100px) scale(1);
      } */
      100% {
        opacity: 0;
        transform: rotate(0deg) translateX(0px) scale(1);
      }
    }

    @keyframes moveRight {
      0% {
        transform: rotate(0deg);
      }
      /* 50% {
        transform: rotate(-8deg) translateX(100px) scale(1);
      } */
      100% {
        transform: rotate(-5deg) translateX(100px) scale(1);
      }
    }

    @keyframes moveRightCenter {
      0% {
        transform: rotate(-5deg) translateX(100px) scale(1);
      }
      /* 50% {
        transform: rotate(-8deg) translateX(100px) scale(1);
      } */
      100% {
        opacity: 0;
        transform: rotate(0deg) translateX(0px) scale(1);
      }
    }
  `;

  @query('.bloc-2') bloc2!: HTMLDivElement;

  #timeLeft = '';
  #timeCenter = '';
  #timeRight = '';
  #dateLeft = '';
  #dateCenter = '';
  #dateRight = '';
  #isClose = false;

  getLocalDate() {
    return new Date()
      .toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      .split(/\/|\s|:|,|-|\./);
    // .map(item => item.trim());
  }

  getLocalTime() {
    return new Date()
      .toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })
      .split(/\/|\s|:|,|-|\./);
    // .map(item => item.trim());
  }

  firstUpdated() {
    this.start();
    this.addEventListener('click', this.handleClick);
  }

  start() {
    this._updateDateTime();
    setInterval(() => {
      this._updateDateTime();
    }, 1000);
  }

  onCloseEnded = () => {
    this.bloc2.removeEventListener('animationend', this.onCloseEnded);
    const closedEvent = new CustomEvent('closed', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(closedEvent);
  };

  handleClick = () => {
    this.#isClose = !this.#isClose;
    if (this.#isClose) {
      this.bloc2.addEventListener('animationend', this.onCloseEnded);
    }
    this.classList.toggle('close');
  };

  private _updateDateTime() {
    const date = this.getLocalDate();
    const time = this.getLocalTime();
    this.#dateLeft = date[0];
    this.#dateCenter = date[1];
    this.#dateRight = date[2];
    this.#timeLeft = time[0];
    this.#timeCenter = time[1];
    this.#timeRight = time[2];
    this.requestUpdate();
  }

  render() {
    return html`
      <!-- <div class="welcome-text">Hello, have a good day !</div> -->
      <div class="calendar-clock-container">
        <div class="bloc bloc-1">
          <span class="bloc-time">${this.#timeLeft}</span>
          <span class="bloc-text">${this.#dateLeft}</span>
        </div>
        <div class="bloc bloc-2">
          <span class="bloc-time">${this.#timeCenter}</span>
          <span class="bloc-text">${this.#dateCenter}</span>
        </div>
        <div class="bloc bloc-3">
          <span class="bloc-time">${this.#timeRight}</span>
          <span class="bloc-text">${this.#dateRight}</span>
        </div>
      </div>
    `;
  }
}
