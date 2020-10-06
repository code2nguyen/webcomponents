```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/index.js';

export default {
  title: 'DashboardLayout',
  component: 'dashboard-layout',
};
```

# DashboardLayout

A component for layout widgets with a responsive grid.

## Features:

- Responsive layout
- Edit mode

## How to use

### Installation

```bash
yarn add @cff/webcomponents
```

```js
import '@cff/webcomponents/components/dashboard-layout/dashboard-layout.component.js';
```

```js preview-story
export const Demo = () => html`
  <link
    rel="stylesheet"
    href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/atom-one-dark.min.css"
  />
  <style>
    ::-webkit-scrollbar {
      height: 8px;
      overflow: auto;
      width: 8px;
    }
    ::-webkit-scrollbar-corner {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background-color: rgba(245, 245, 245, 0.2);
      border-radius: 20px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: rgba(245, 245, 245, 0.4);
    }
  </style>
  <style>
    body {
      background-color: #303236;
      height: 100vh;
      overflow: auto;
      padding: 0;
      margin: 0;
      width: 100%;
    }
  </style>
  <cff-dashboard-layout editable="true" scrollableParentSelector="viewport">
    <cff-dashboard-item currentBgColor=${Math.floor(Math.random() * 13)}>
      <cff-quill-editor></cff-quill-editor>
      <cff-quill-editor-toolbar slot="toolbar"></cff-quill-editor-toolbar>
    </cff-dashboard-item>
    <cff-dashboard-item currentBgColor=${Math.floor(Math.random() * 13)}>
      <cff-quill-editor></cff-quill-editor>
      <cff-quill-editor-toolbar slot="toolbar"></cff-quill-editor-toolbar>
    </cff-dashboard-item>
    <cff-dashboard-item currentBgColor=${Math.floor(Math.random() * 13)}>
      <cff-quill-editor></cff-quill-editor>
      <cff-quill-editor-toolbar slot="toolbar"></cff-quill-editor-toolbar>
    </cff-dashboard-item>
    <cff-dashboard-item currentBgColor=${Math.floor(Math.random() * 13)}>
      <cff-quill-editor></cff-quill-editor>
      <cff-quill-editor-toolbar slot="toolbar"></cff-quill-editor-toolbar>
    </cff-dashboard-item>
    <cff-dashboard-item currentBgColor=${Math.floor(Math.random() * 13)}>
      <cff-quill-editor></cff-quill-editor>
      <cff-quill-editor-toolbar slot="toolbar"></cff-quill-editor-toolbar>
    </cff-dashboard-item>
    <cff-dashboard-item currentBgColor=${Math.floor(Math.random() * 13)}>
      <cff-quill-editor></cff-quill-editor>
      <cff-quill-editor-toolbar slot="toolbar"></cff-quill-editor-toolbar>
    </cff-dashboard-item>
  </cff-dashboard-layout>
`;
```

## API

<sb-props of="dashboard-layout"></sb-props>

# DashboardItem

A placeholder of widget used by dashboard-layout

## API

<sb-props of="dashboard-item"></sb-props>
