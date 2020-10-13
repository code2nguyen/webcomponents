```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/index.js';

export default {
  title: 'tab-menu',
  component: 'tab-menu',
};
```

# TabMenu

A naivagtion tab menu

### Installation

```bash
yarn add @cff/webcomponents
```

```js
import '@cff/webcomponents/components/tab-menu/tab-menu.component.js';
```

## Features:

## API

<sb-props of="tab-menu"></sb-props>

```js preview-story
export const Demo = () => {
  const items = ['Notes', 'Archive', 'Starred'];
  return html`
    <div
      style="width: 500px;
    height: 300px;
    background: #303226;
    display: flex;
    align-items: center;
    justify-content: center;"
    >
      <cff-tab-menu .items=${items} selectedItem="Archive"></cff-tab-menu>
    </div>
  `;
};
```
