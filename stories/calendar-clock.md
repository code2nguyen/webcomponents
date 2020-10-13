```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/index.js';

export default {
  title: 'calendar-clock',
  component: 'calendar-clock',
};
```

# CalendarClock

Display Calendar and Hours in form of card.

### Installation

```bash
yarn add @cff/webcomponents
```

```js
import '@cff/webcomponents/components/calendar-clock/calendar-clock.component.js';
```

## Features:

- Nice animation
- Auto format datetime base on browser format.

## API

<sb-props of="calendar-clock"></sb-props>

```js preview-story
export const Demo = () =>
  html` <cff-calendar-clock style="height: 400px"></cff-calendar-clock> `;
```

```js preview-story
export const message = () =>
  html`
    <cff-calendar-clock
      style="height: 400px"
      todayMessage="Hello, Have a good day!"
    ></cff-calendar-clock>
  `;
```
