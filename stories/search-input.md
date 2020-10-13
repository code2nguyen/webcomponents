```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/index.js';

export default {
  title: 'search-input',
  component: 'search-input',
};
```

# SearchInput

A simple search input text.

### Installation

```bash
yarn add @cff/webcomponents
```

```js
import '@cff/webcomponents/components/search-input/search-input.component.js';
```

## Features:

- Input text with search/clear icon
- Clear text button
- Change event

```js preview-story
export const Demo = () =>
  html` <cff-search-input style="width: 450px;"> </cff-search-input> `;
```

```js preview-story
export const Loading = () =>
  html`
    <cff-search-input style="width: 450px;" loading="true"> </cff-search-input>
  `;
```

## API

<sb-props of="search-input"></sb-props>
