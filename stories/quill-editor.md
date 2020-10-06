```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/index.js';

export default {
  title: 'QuillEditor',
  component: 'quill-editor',
};
```

# QuillEditor

A text editor using quilljs library.

### Installation

```bash
yarn add @cff/webcomponents
```

```js
import '@cff/webcomponents/components/quill-editor/quill-editor.component.js';
```

## Features:

- Toolbar
- Syntax highlight

### Syntax highlight

QuillJs use [highlightjs](https://highlightjs.org/) library to parse and tokenize code blocks. The easiest way to inject highlighjs is using CDN.

Example

```js
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/atom-one-dark.min.css" />
<!-- Include the highlight.js library -->
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/highlight.min.js"></script>
```

### Typography

The default font is [Red Hat Text](https://github.com/RedHatOfficial/RedHatFont). To get started, you first include Red Hat Text font into your web application.

Example:

```html
<style>
  @font-face {
    font-family: 'RedHatDisplay';
    src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.eot');
    /* IE9 Compat Modes */
    src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.eot?#iefix')
        format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.woff')
        format('woff');
    /* Modern Browsers */
    font-style: normal;
    font-weight: 300;
    text-rendering: optimizeLegibility;
  }

  @font-face {
    font-family: 'RedHatDisplay';
    src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.eot');
    /* IE9 Compat Modes */
    src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.eot?#iefix')
        format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.woff')
        format('woff');
    /* Modern Browsers */
    font-style: normal;
    font-weight: 400;
    text-rendering: optimizeLegibility;
  }

  @font-face {
    font-family: 'RedHatDisplay';
    src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.eot');
    /* IE9 Compat Modes */
    src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.eot?#iefix')
        format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.woff')
        format('woff');
    /* Modern Browsers */
    font-style: normal;
    font-weight: 700;
    text-rendering: optimizeLegibility;
  }

  @font-face {
    font-family: 'RedHatText';
    src: url('./assets/fonts/RedHatText/RedHatText-Regular.eot');
    /* IE9 Compat Modes */
    src: url('./assets/fonts/RedHatText/RedHatText-Regular.eot?#iefix') format('embedded-opentype'),
      url('./assets/fonts/RedHatText/RedHatText-Regular.woff') format('woff');
    /* Modern Browsers */
    font-style: normal;
    font-weight: 400;
    text-rendering: optimizeLegibility;
  }

  @font-face {
    font-family: 'RedHatText';
    src: url('./assets/fonts/RedHatText/RedHatText-Medium.eot');
    /* IE9 Compat Modes */
    src: url('./assets/fonts/RedHatText/RedHatText-Medium.eot?#iefix') format('embedded-opentype'),
      url('./assets/fonts/RedHatText/RedHatText-Medium.woff') format('woff');
    /* Modern Browsers */
    font-style: normal;
    font-weight: 700;
    text-rendering: optimizeLegibility;
  }
</style>
```

```js preview-story
export const Demo = () => html`
  <link
    rel="stylesheet"
    href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/atom-one-dark.min.css"
  />
  <style>
    @font-face {
      font-family: 'RedHatDisplay';
      src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.eot');
      /* IE9 Compat Modes */
      src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.eot?#iefix')
          format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.woff')
          format('woff');
      /* Modern Browsers */
      font-style: normal;
      font-weight: 300;
      text-rendering: optimizeLegibility;
    }

    @font-face {
      font-family: 'RedHatDisplay';
      src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.eot');
      /* IE9 Compat Modes */
      src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.eot?#iefix')
          format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.woff')
          format('woff');
      /* Modern Browsers */
      font-style: normal;
      font-weight: 400;
      text-rendering: optimizeLegibility;
    }

    @font-face {
      font-family: 'RedHatDisplay';
      src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.eot');
      /* IE9 Compat Modes */
      src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.eot?#iefix')
          format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.woff')
          format('woff');
      /* Modern Browsers */
      font-style: normal;
      font-weight: 700;
      text-rendering: optimizeLegibility;
    }

    @font-face {
      font-family: 'RedHatText';
      src: url('./assets/fonts/RedHatText/RedHatText-Regular.eot');
      /* IE9 Compat Modes */
      src: url('./assets/fonts/RedHatText/RedHatText-Regular.eot?#iefix') format('embedded-opentype'),
        url('./assets/fonts/RedHatText/RedHatText-Regular.woff') format('woff');
      /* Modern Browsers */
      font-style: normal;
      font-weight: 400;
      text-rendering: optimizeLegibility;
    }

    @font-face {
      font-family: 'RedHatText';
      src: url('./assets/fonts/RedHatText/RedHatText-Medium.eot');
      /* IE9 Compat Modes */
      src: url('./assets/fonts/RedHatText/RedHatText-Medium.eot?#iefix') format('embedded-opentype'),
        url('./assets/fonts/RedHatText/RedHatText-Medium.woff') format('woff');
      /* Modern Browsers */
      font-style: normal;
      font-weight: 700;
      text-rendering: optimizeLegibility;
    }
  </style>
  <cff-quill-editor
    style="min-height: 300px; background-color: #303236;"
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
      @font-face {
        font-family: 'RedHatDisplay';
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.eot');
        /* IE9 Compat Modes */
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.eot?#iefix')
            format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.woff')
            format('woff');
        /* Modern Browsers */
        font-style: normal;
        font-weight: 300;
        text-rendering: optimizeLegibility;
      }

      @font-face {
        font-family: 'RedHatDisplay';
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.eot');
        /* IE9 Compat Modes */
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.eot?#iefix')
            format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.woff')
            format('woff');
        /* Modern Browsers */
        font-style: normal;
        font-weight: 400;
        text-rendering: optimizeLegibility;
      }

      @font-face {
        font-family: 'RedHatDisplay';
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.eot');
        /* IE9 Compat Modes */
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.eot?#iefix')
            format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.woff')
            format('woff');
        /* Modern Browsers */
        font-style: normal;
        font-weight: 700;
        text-rendering: optimizeLegibility;
      }

      @font-face {
        font-family: 'RedHatText';
        src: url('./assets/fonts/RedHatText/RedHatText-Regular.eot');
        /* IE9 Compat Modes */
        src: url('./assets/fonts/RedHatText/RedHatText-Regular.eot?#iefix')
            format('embedded-opentype'), url('./assets/fonts/RedHatText/RedHatText-Regular.woff')
            format('woff');
        /* Modern Browsers */
        font-style: normal;
        font-weight: 400;
        text-rendering: optimizeLegibility;
      }

      @font-face {
        font-family: 'RedHatText';
        src: url('./assets/fonts/RedHatText/RedHatText-Medium.eot');
        /* IE9 Compat Modes */
        src: url('./assets/fonts/RedHatText/RedHatText-Medium.eot?#iefix')
            format('embedded-opentype'), url('./assets/fonts/RedHatText/RedHatText-Medium.woff')
            format('woff');
        /* Modern Browsers */
        font-style: normal;
        font-weight: 700;
        text-rendering: optimizeLegibility;
      }
    </style>
    <cff-quill-editor
      style="background-color: #303236;"
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
      @font-face {
        font-family: 'RedHatDisplay';
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.eot');
        /* IE9 Compat Modes */
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.eot?#iefix')
            format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Regular.woff')
            format('woff');
        /* Modern Browsers */
        font-style: normal;
        font-weight: 300;
        text-rendering: optimizeLegibility;
      }

      @font-face {
        font-family: 'RedHatDisplay';
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.eot');
        /* IE9 Compat Modes */
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.eot?#iefix')
            format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Medium.woff')
            format('woff');
        /* Modern Browsers */
        font-style: normal;
        font-weight: 400;
        text-rendering: optimizeLegibility;
      }

      @font-face {
        font-family: 'RedHatDisplay';
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.eot');
        /* IE9 Compat Modes */
        src: url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.eot?#iefix')
            format('embedded-opentype'), url('./assets/fonts/RedHatDisplay/RedHatDisplay-Bold.woff')
            format('woff');
        /* Modern Browsers */
        font-style: normal;
        font-weight: 700;
        text-rendering: optimizeLegibility;
      }

      @font-face {
        font-family: 'RedHatText';
        src: url('./assets/fonts/RedHatText/RedHatText-Regular.eot');
        /* IE9 Compat Modes */
        src: url('./assets/fonts/RedHatText/RedHatText-Regular.eot?#iefix')
            format('embedded-opentype'), url('./assets/fonts/RedHatText/RedHatText-Regular.woff')
            format('woff');
        /* Modern Browsers */
        font-style: normal;
        font-weight: 400;
        text-rendering: optimizeLegibility;
      }

      @font-face {
        font-family: 'RedHatText';
        src: url('./assets/fonts/RedHatText/RedHatText-Medium.eot');
        /* IE9 Compat Modes */
        src: url('./assets/fonts/RedHatText/RedHatText-Medium.eot?#iefix')
            format('embedded-opentype'), url('./assets/fonts/RedHatText/RedHatText-Medium.woff')
            format('woff');
        /* Modern Browsers */
        font-style: normal;
        font-weight: 700;
        text-rendering: optimizeLegibility;
      }
    </style>
    <cff-quill-editor
      style="background-color: #303236; min-height: 300px"
      placeholder="let's start writing..."
      format="json"
      .content=${jsonContent}
    >
    </cff-quill-editor>
  `;
};
```
