import { oneAtomThem } from './monaco-theme';
export const defaultMonacoEditorOptions = {
  minimap: {
    enabled: false,
  },
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  contextmenu: false,
  codeLens: false,
  scrollbar: {
    useShadows: false,
    alwaysConsumeMouseWheel: false,
  },
  codeActionsOnSaveTimeout: 750,
  wordWrap: 'bounded',
  wordWrapColumn: 120,
  fontSize: 14,
  lineDecorationsWidth: 5,
  // lineNumbers: 'off',
  scrollBeyondLastLine: false,
  language: 'markdown',
  theme: 'Atom-One-Dark',
  tabSize: 2,
};
export function initMonacoScript(
  libPath: string,
  value: string,
  language: string,
  theme: string,
  focus: boolean,
  uuid: string,
  options: any = defaultMonacoEditorOptions
) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <style type="text/css">
      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      #container {
        width: 100%;
        height: 100%
      }
    </style>
  </head>
  <body>
    <div id="container"></div>

    <script src="${libPath}/loader.js"></script>
    <script>
      let oldValue;
      let editor;
      const uuid = '${uuid}';
      require.config({ paths: { vs: '${libPath}' } });
      require(['vs/editor/editor.main'], () => {
        monaco.editor.defineTheme('Atom-One-Dark', ${toString(oneAtomThem)});

        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: true,
        });

        editor = monaco.editor.create(document.getElementById('container'), ${toString(
          {
            ...defaultMonacoEditorOptions,
            ...options,
            ...{ language, theme, value },
          }
        )});

        const model = editor.getModel();

        model.onDidChangeContent(() => {
          const value = model.getValue();
          onEditorModelChangeValue(value);
        });

        if (${toString(focus)}) editor.focus();

        window.onresize = function () {
					editor.layout();
        };
        window.addEventListener('message', handleMessage, false);
        ready();
      });

      function handleMessage(message) {
        const data = message.data;
        switch (data.event) {
          case 'valueChanged':
            changeModelValue(data.payload);
            break;
          case 'languageChanged':
            changeModelLanguage(data.payload);
            break;
          case 'format':
            formatDocument();
            break;
          case 'themeChanged':
            break;
          case 'focus':
            editor.focus()
            break;
          default:
            break;
        }
      }

      function sendMessage(event, payload) {
        var msg = {
          event: event,
          payload: payload,
          uuid: uuid
        }
        window.parent.postMessage(msg, window.parent.location.href);
      }

      function onEditorModelChangeValue(newValue) {
        if (newValue !== oldValue) {
          oldValue = newValue;
          sendMessage('valueChanged',  newValue);
        }
      }

      function ready() {
        sendMessage('ready',  null)
      }

      function changeModelLanguage(value) {
        monaco.editor.setModelLanguage(
          editor.getModel(),
          value
        );

        formatDocument();
      }

      function changeModelValue(newValue) {
        if (newValue !== oldValue) {
          oldValue = newValue;
          editor.getModel().setValue(newValue);
        }
      }

      function formatDocument() {
        editor.getAction('editor.action.formatDocument').run();
      }

      </script>
  </body>
</html>
`;
}

function toString(value: any): string {
  return `JSON.parse('${JSON.stringify(value)}')`;
}
