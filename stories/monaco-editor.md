```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/index.js';

export default {
  title: 'monaco-editor',
  component: 'monaco-editor',
};
```

# QuillEditor

A code editor using monaco editor library.

### Installation

```bash
yarn add @cff/webcomponents
```

```js
import '@cff/webcomponents/components/monaco-editor/monaco-editor.component.js';
```

```js preview-story
const markdonwContent = `#Hello World \n This is a markdown editor`;

export const Markdown = () => {
  return html`
    <cff-monaco-editor
      libPath="assets/monaco-editor/min/vs"
      .value=${markdonwContent}
    >
    </cff-monaco-editor>
  `;
};
```

```js preview-story
const javascriptContent = `const hello="Say hi!"`;

export const Javascript = () => {
  return html`
    <cff-monaco-editor
      libPath="assets/monaco-editor/min/vs"
      language="javascript"
      .value=${javascriptContent}
    >
    </cff-monaco-editor>
  `;
};
```

```js preview-story
const typescriptContent = `function hello() {\n\talert('Hello world!');\n}`;
export const Typescript = () => {
  return html`
    <cff-monaco-editor
      libPath="assets/monaco-editor/min/vs"
      language="typescript"
      .value=${typescriptContent}
    >
    </cff-monaco-editor>
  `;
};
```

## API

<sb-props of="monaco-editor"></sb-props>
