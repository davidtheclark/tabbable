function supportsDeclarativeShadowDOM() {
  // eslint-disable-next-line no-prototype-builtins
  return HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot');
}

function hydrateShadowDomPolyfill(template) {
  const mode = template.getAttribute('shadowroot');
  const delegatesFocus = !!template.getAttribute('shadowrootdelegatesfocus');
  const host = template.parentNode;
  const shadowRoot = host.attachShadow({ mode, delegatesFocus });
  // expose closed shadow root for tests
  if (mode === 'closed') {
    host.closedShadowRoot = shadowRoot;
  }
  shadowRoot.appendChild(template.content);
  template.remove();
}

function scanAndHydrateShadowDom(container) {
  container
    .querySelectorAll('template[shadowroot]')
    .forEach(hydrateShadowDomPolyfill);
}

function defineCustomTestElement(win) {
  // register custom element to expose closed shadow for tests
  if (!win.customElements.get('test-shadow')) {
    win.customElements.define(
      'test-shadow',
      class TestShadow extends win.HTMLElement {
        constructor() {
          super();
          if (supportsDeclarativeShadowDOM()) {
            // expose closed shadow root for tests
            const { shadowRoot } = this.attachInternals();
            if (shadowRoot.mode === 'closed') {
              this.closedShadowRoot = shadowRoot;
            }
          } else {
            // polyfill nested shadow hydration
            const shadowRoot = this.shadowRoot || this.closedShadowRoot;
            if (shadowRoot) {
              scanAndHydrateShadowDom(shadowRoot);
            }
          }
        }
      }
    );
  }
}

exports.appendHTMLWithShadowRoots = function (
  container,
  content,
  { win, caseId } = {}
) {
  win = win || window;
  defineCustomTestElement(win);
  // create dom fragments with shadow dom (if supported)
  const fragment = new win.DOMParser().parseFromString(content, 'text/html', {
    includeShadowRoots: true,
  });
  // append content
  if (caseId) {
    container.appendChild(fragment.querySelector('#' + caseId));
  } else {
    const nodes = fragment.children[0].children[1].children;
    while (nodes.length) {
      container.appendChild(nodes[0]);
    }
  }
  // polyfill shadow hydration if not supported
  if (supportsDeclarativeShadowDOM() === false) {
    scanAndHydrateShadowDom(container);
  }
};
