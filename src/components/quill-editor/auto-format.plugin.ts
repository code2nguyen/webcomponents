declare const window: any;

export function autoFormat() {
  const Module = window.Quill.import('core/module');

  const Delta = window.Quill.import('delta');
  // const { Attributor, Scope } = Quill.import('parchment');

  const REGEXP_GLOBAL = /https?:\/\/[^\s]+/g;
  const REGEXP_WITH_PRECEDING_WS = /(?:\s|^)(https?:\/\/[^\s]+)/;

  return class AutoFormat extends Module {
    constructor(public quill: any, options: any) {
      super(quill, options);
      this.registerTypeListener();
      this.registerPasteListener();
    }

    registerPasteListener() {
      this.quill.clipboard.addMatcher(
        Node.ELEMENT_NODE,
        (node: any, delta: any) => {
          const ops: any = [];
          delta.ops.forEach((op: any) => {
            if (op.insert && typeof op.insert === 'string') {
              const changeDelta = this.transform(op.insert);
              ops.push(changeDelta);
            }
          });
          delta.ops = ops;
          return delta;
        }
      );
    }

    registerTypeListener() {
      this.quill.on(
        'text-change',
        (delta: any, oldDelta: any, source: string) => {
          const ops = delta.ops;
          if (source !== 'user' || !ops || ops.length < 1) {
            return;
          }
          // Check last insert
          let lastOpIndex = ops.length - 1;
          let lastOp = ops[lastOpIndex];

          while (!lastOp.insert && lastOpIndex > 0) {
            lastOpIndex--;
            lastOp = ops[lastOpIndex];
          }

          if (!lastOp.insert || typeof lastOp.insert !== 'string') {
            return;
          }
          const isEnter = lastOp.insert === '\n';
          const sel = this.quill.getSelection();
          if (!sel) {
            return;
          }
          const endSelIndex =
            this.quill.getLength() - sel.index - (isEnter ? 1 : 0);
          // Get leaf
          const checkIndex = sel.index;
          const [line] = this.quill.getLine(checkIndex);

          const text = line.domNode.textContent;
          const leafIndex = line.offset(line.scroll);
          const leafSelIndex = checkIndex - leafIndex;

          if (lastOp.insert.match(/[\s]/)) {
            const matches = text.match(REGEXP_GLOBAL);
            if (matches && matches.length > 0) {
              let transformDelta = new Delta().retain(leafIndex);
              let currentSearchingIndex = 0;
              for (const link of matches) {
                const indexOfLink = text.indexOf(link, currentSearchingIndex);
                const nextCharIndex = indexOfLink + link.length;
                const currentFormat = this.quill.getFormat(
                  leafIndex + nextCharIndex + 1,
                  1
                );
                let linkDelta = new Delta();
                linkDelta = linkDelta
                  .retain(indexOfLink - currentSearchingIndex)
                  .retain(link.length, { link });
                if (currentFormat.link && text[nextCharIndex] === ' ') {
                  let nextSpaceIndex = text.indexOf(' ', nextCharIndex + 1);
                  if (nextSpaceIndex === -1) {
                    nextSpaceIndex = text.length;
                  }
                  linkDelta.retain(nextSpaceIndex - nextCharIndex, {
                    link: null,
                  });
                }
                transformDelta = transformDelta.concat(linkDelta);
                currentSearchingIndex =
                  currentSearchingIndex + indexOfLink + link.length;
              }
              this.quill.updateContents(transformDelta, 'api');
            }
          }
        }
      );
    }

    transform(text: string, clearAttribute = true): any {
      const matches = text.match(REGEXP_GLOBAL);
      let op: any = null;
      if (matches && matches.length > 0) {
        op = { insert: matches[0], attributes: { link: matches[0] } };
      } else if (clearAttribute) {
        op = { insert: text };
      }
      return op;
    }
  };
}
