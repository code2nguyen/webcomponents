```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/index.js';

export default {
  title: 'delete-confirmation',
  component: 'delete-confirmation',
};
```

# DeleteConfirmation

Delete button with confirmation panel

### Installation

```bash
yarn add @cff/webcomponents
```

```js
import '@cff/webcomponents/components/delete-confirmation/delete-confirmation.component.js';
```

## Features:

- Delete button with confirmation panel

## API

<sb-props of="delete-confirmation"></sb-props>

```js preview-story
export const Demo = () =>
  html`
    <div
      style="width: 500px;
    height: 300px;
    background: #303226;
    display: flex;
    align-items: center;
    justify-content: center;"
    >
      <cff-delete-confirmation></cff-delete-confirmation>
      <div></div>
    </div>
  `;
```
