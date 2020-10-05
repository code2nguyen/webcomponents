import { css } from 'lit-element';

declare const window: any;

export class Range {
  constructor(public index: number, public length = 0) {}
}

export function createQuillEditorTheme() {
  const BubbleTheme = window.Quill.import('themes/bubble');
  const Tooltip = window.Quill.import('ui/tooltip');
  const icons = window.Quill.import('ui/icons');
  // Override some icons
  icons.bold = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><defs><style>.cls-1{fill:none;}.cls-2{fill:currentColor;}</style></defs><g id="Calque_2" data-name="Calque 2"><g id="Calque_1-2" data-name="Calque 1"><path class="cls-1" d="M0,0H18V18H0Z"/><path class="cls-2" d="M12.55,8.81a3.32,3.32,0,0,0,1.5-2.54,3.59,3.59,0,0,0-3.64-3.65H5.63a.91.91,0,0,0-.91.91V14.47a.91.91,0,0,0,.91.91h5.26a3.61,3.61,0,0,0,3.62-3.44A3.38,3.38,0,0,0,12.55,8.81ZM7.45,4.9h2.73a1.37,1.37,0,1,1,0,2.73H7.45Zm3.19,8.2H7.45V10.37h3.19a1.37,1.37,0,0,1,0,2.73Z"/></g></g></svg>`;
  icons.italic = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><defs><style>.cls-1{fill:none;}.cls-2{fill:currentColor;}</style></defs><g id="Calque_2" data-name="Calque 2"><g id="Calque_1-2" data-name="Calque 1"><path class="cls-1" d="M0,0H18V18H0Z"/><path class="cls-2" d="M6.82,4A1.37,1.37,0,0,0,8.18,5.36h.65L5.72,12.64H4.54a1.37,1.37,0,0,0,0,2.74H9.1a1.37,1.37,0,0,0,0-2.74H8.45l3.11-7.28h1.18a1.37,1.37,0,0,0,0-2.74H8.18A1.36,1.36,0,0,0,6.82,4Z"/></g></g></svg>`;
  icons.strike = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><defs><style>.cls-1{fill:none;}.cls-2{fill:currentColor;}</style></defs><g id="Calque_2" data-name="Calque 2"><g id="Calque_1-2" data-name="Calque 1"><path class="cls-1" d="M0,0H18V18H0Z"/><path class="cls-2" d="M8.9,15.76a1.7,1.7,0,0,0,1.7-1.7V13.2H7.2v.86A1.71,1.71,0,0,0,8.9,15.76ZM3,4.28A1.27,1.27,0,0,0,4.23,5.55h3V8.1h3.4V5.55h3a1.28,1.28,0,1,0,0-2.55H4.23A1.28,1.28,0,0,0,3,4.28ZM2.1,11.5H15.71a.85.85,0,1,0,0-1.7H2.1a.85.85,0,1,0,0,1.7Z"/></g></g></svg>`;
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
