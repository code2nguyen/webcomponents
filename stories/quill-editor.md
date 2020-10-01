```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/dashboard-layout.js';

export default {
  title: 'QuillEditor',
  component: 'quill-editor',
  options: { selectedPanel: 'storybookjs/knobs/panel' },
};
```

# QuillEditor

A text editor using quilljs library.

## Features:

- Tooltip
- Syntax highlight

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
  <cff-quill-editor
    style="display:flex; width: 100%; height: 100%; min-height: 300px"
    placeholder="let's start writing..."
  ></cff-quill-editor>
`;
```

## API

<sb-props of="quill-editor"></sb-props>

## Content type

### Html

```js preview-story
export const HtmlContent = () => {
  const htmlContent = ` <h2>Minas Tirith</h2>
      <p><br /></p>
      <p>
        Pippin looked out from the shelter of Gandalf"s cloak. He wondered if he
        was awake or still sleeping, still in the swift-moving dream in which he
        had been wrapped so long since the great ride began. The dark world was
        rushing by and the wind sang loudly in his ears. He could see nothing
        but the wheeling stars, and away to his right vast shadows against the
        sky where the mountains of the South marched past. Sleepily he tried to
        reckon the times and stages of their journey, but his memory was drowsy
        and uncertain.
      </p>
      <p><br /></p>
      <p>
        There had been the first ride at terrible speed without a halt, and then
        in the dawn he had seen a pale gleam of gold, and they had come to the
        silent town and the great empty house on the hill. And hardly had they
        reached its shelter when the winged shadow had passed over once again,
        and men wilted with fear. But Gandalf had spoken soft words to him, and
        he had slept in a corner, tired but uneasy, dimly aware of comings and
        goings and of men talking and Gandalf giving orders. And then again
        riding, riding in the night. This was the second, no, the third night
        since he had looked in the Stone. And with that hideous memory he woke
        fully, and shivered, and the noise of the wind became filled with
        menacing voices.
      </p>
      <p><br /></p>`;
  return html`
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
    <cff-quill-editor
      style="display:flex; width: 100%; height: 100%; min-height: 300px"
      placeholder="let's start writing..."
      format="html"
      .content=${htmlContent}
    >
    </cff-quill-editor>
  `;
};
```

### Json

```js preview-story
export const JsonContent = () => {
  const jsonContent =
    '{"ops":[{"insert":"Minas Tirith"},{"attributes":{"header":2},"insert":"\\n"},{"insert":"\\nPippin looked out from the shelter of Gandalf cloak. He wondered if he was awake or still sleeping, still in the swift-moving dream in which he had been wrapped so long since the great ride began. "},{"attributes":{"bold":true},"insert":"The dark world was rushing by and the wind"},{"insert":" sang loudly in his ears. He could see nothing but the wheeling stars, and away to his right vast shadows against the sky where the mountains of the South marched past. Sleepily he tried to reckon the times and stages of their journey, "},{"attributes":{"color":"#ffff00"},"insert":"but his memory was drowsy and uncertain"}]}';

  return html`
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
    <cff-quill-editor
      style="display:flex; width: 100%; height: 100%; min-height: 300px"
      placeholder="let's start writing..."
      format="json"
      .content=${jsonContent}
    >
    </cff-quill-editor>
  `;
};
```
