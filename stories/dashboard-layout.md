```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/dashboard-layout.js';

export default {
  title: 'DashboardLayout',
  component: 'dashboard-layout',
  options: { selectedPanel: 'storybookjs/knobs/panel' },
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
yarn add @cff/dashboard-layout
```

```js
import '@cff/dashboard-layout/dashboard-layout.js';
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
    html {
      --dashboard-theme-color: #303236;

      --dashboard-layout-placeholder-bg-color: rgba(255, 255, 255, 0.1);

      --dashboard-theme-item-border-color: rgba(255, 255, 255, 0.3);
      --dashboard-theme-item-icon-color: rgba(255, 255, 255);
      --dashboard-theme-item-text-color: rgba(255, 255, 255);

      --dashboard-theme-item-bg-color-0: #303236;
      --dashboard-theme-item-bg-color-1: #5f6368;
      --dashboard-theme-item-bg-color-2: #5c2b29;
      --dashboard-theme-item-bg-color-3: #614a19;
      --dashboard-theme-item-bg-color-4: #635d19;
      --dashboard-theme-item-bg-color-5: #345920;
      --dashboard-theme-item-bg-color-6: #16504b;
      --dashboard-theme-item-bg-color-7: #2d555e;
      --dashboard-theme-item-bg-color-8: #1e3a5f;
      --dashboard-theme-item-bg-color-9: #42275e;
      --dashboard-theme-item-bg-color-10: #5b2245;
      --dashboard-theme-item-bg-color-11: #442f19;
      --dashboard-theme-item-bg-color-12: #3c3f43;

      --dashboard-theme-item-bg-color-code: #282c34;
    }
    body {
      background-color: var(--dashboard-theme-color);
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
