declare const window: any;

export class Range {
  constructor(public index: number, public length = 0) {}
}

export function createQuillEditorTheme() {
  const BubbleTheme = window.Quill.import('themes/bubble');
  const Tooltip = window.Quill.import('ui/tooltip');

  const LinkTooltip = class CustomLinkTooltip extends Tooltip {
    constructor(quill: any, boundsContainer: any) {
      super(quill, boundsContainer);

      this.button = this.root.querySelector('.external-link');

      const goToExternalLink = () => {
        if (this.url) {
          window.open(this.url, '_black');
        }
        this.hide();
      };

      quill.emitter.listenDOM('click', this.button, goToExternalLink);
    }

    position(reference: any) {
      const shift = super.position(reference);
      const arrow = this.root.querySelector('.ql-tooltip-arrow');
      arrow.style.marginLeft = '';
      if (shift === 0) return shift;
      arrow.style.marginLeft = -1 * shift - arrow.offsetWidth / 2 + 'px';
    }
  };

  LinkTooltip.TEMPLATE = [
    '<span class="ql-tooltip-arrow"></span>',
    '<div class="ql-toolbar">',
    '<span class="ql-formats">',
    '<button type="button" class="external-link">',
    `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path class="ql-stroke" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline class="ql-stroke" points="15 3 21 3 21 9"></polyline><line class="ql-stroke" x1="10" y1="14" x2="21" y2="3"></line></svg>`,
    '<span class="ql-link-tooltip">Open Link</span>',
    '</button>',
    '</span>',
    '</div>',
  ].join('');

  const ThemeClass = class QuillEditorTheme extends BubbleTheme {
    constructor(quill: any, options: any) {
      super(quill, options);
      const listenerForLink = (e: any): any => {
        if (!document.body.contains(quill.root)) {
          return document.body.removeEventListener('click', listenerForLink);
        }
        if (
          this.linkTooltip != null &&
          !this.linkTooltip.root.contains(e.target) &&
          !this.quill.hasFocus()
        ) {
          this.linkTooltip.hide();
        }
      };
      quill.emitter.listenDOM('click', document.body, listenerForLink);
    }
    extendToolbar(toolbar: any) {
      this.linkTooltip = new LinkTooltip(this.quill, this.options.bounds);
      this.linkTooltip.root.appendChild(toolbar.container);

      this.quill.on(
        'editor-change',
        (type: string, range: any, oldRange: any, source: string) => {
          if (type !== 'selection-change') return;
          const formats = range ? this.quill.getFormat(range) : {};
          if (
            range != null &&
            range.length > 0 &&
            source === 'user' &&
            (formats['code-block'] || formats['link'])
          ) {
            // if click on code-block, just disable toolbar.
            range.length = 0;
            return;
          }
          // display link tooltip when lick on the link
          if (range && source == 'user' && range.length === 0) {
            const [link, offset] = this.quill.scroll.descendant(
              window.Quill.import('formats/link'),
              range.index
            );
            if (link != null && this.linkTooltip) {
              this.linkTooltip.show();
              // Lock our width so we will expand beyond our offsetParent boundaries
              this.linkTooltip.root.style.left = '0px';
              this.linkTooltip.url = link.domNode.href;
              this.linkTooltip.root.style.width = '';
              this.linkTooltip.root.style.width =
                this.linkTooltip.root.offsetWidth + 'px';
              const linkRange = new Range(range.index - offset, link.length());
              const bounds = this.quill.getBounds(linkRange);
              this.linkTooltip.position(bounds);
              range.length = 0;
            } else {
              this.linkTooltip.hide();
            }
          }
        }
      );
      super.extendToolbar(toolbar);
    }
  };
  ThemeClass.DEFAULTS = Object.assign(true, {}, ThemeClass.DEFAULTS, {
    modules: {
      toolbar: {
        handlers: {},
      },
    },
  });

  return ThemeClass;
}

// extendToolbar(toolbar: any) {
// this.tooltip = new LoopTooltip(this.quill, this.options.bounds);
// this.tooltip.root.appendChild(toolbar.container);
// // you could override Quill's icons here with yours if you want
// this.buildButtons(
//   [].slice.call(toolbar.container.querySelectorAll('button')),
//   icons
// );
// this.buildPickers(
//   [].slice.call(toolbar.container.querySelectorAll('select')),
//   icons
// );
// }

// class NewThemeTooltip extends BubbleTooltip {}

// NewThemeTooltip.TEMPLATE = [
//   '<a class="ql-close"></a>',
//   '<div class="ql-tooltip-editor">',
//   '<input type="text" data-formula="e=mc^2" data-link="https://yoururl.com" data-video="Embed URL">',
//   '</div>',
//   '<span class="ql-tooltip-arrow"></span>',
// ].join('');

// export { NewThemeTooltip, NewTheme as default };
