const { ...testCases } = require('./fixtures');
const { appendHTMLWithShadowRoots } = require('./shadow-root-utils');
global.tabbable = require('../dist/index.js');

let root;
let content;
for (const key in testCases) {
  if (!Object.hasOwnProperty.call(testCases, key)) {
    continue;
  }
  root = document.createElement('div');
  content = '<h2>' + key + '</h2>';
  content += testCases[key];
  root.id = key;
  appendHTMLWithShadowRoots(root, content);
  document.body.appendChild(root);
}

// listen to nested shadow dom focus
function onFocusIn({ target }) {
  // collect nested focused elements
  const focusContext = [target];
  while (target && (target.shadowRoot || target.closedShadowRoot)) {
    const shadowRoot = target.shadowRoot || target.closedShadowRoot;
    target = shadowRoot.activeElement;
    if (target) {
      focusContext.push(target);
    }
  }
  // listen to inner shadow dom blur
  // in order to log movement within shadow dom
  if (focusContext.length > 1) {
    const onBlur = (event) => {
      event.target.removeEventListener('blur', onBlur);
      setTimeout(() => {
        if (event.relatedTarget !== document.activeElement) {
          onFocusIn({ target: document.activeElement });
        }
      }, 10);
    };
    focusContext[focusContext.length - 1].addEventListener('blur', onBlur);
  }
  // eslint-disable-next-line no-console
  console.log(...focusContext);
}
document.body.addEventListener('focusin', onFocusIn);

// Add a clear focus style
const styleTag = document.createElement('style');
styleTag.innerHTML = ':focus { outline: 5px solid #b603f6; }';
document.body.appendChild(styleTag);
