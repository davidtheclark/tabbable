const { tabbable } = require('../src/index.js');
const fixtures = require('./fixtures/index.js');

function getTabbableIds(tabbableResult) {
  return tabbableResult.map((el) => el.getAttribute('id'));
}

describe('tabbable', () => {
  describe('example fixtures', () => {
    it('correctly identifies tabbable elements in the "basic" example', () => {
      const expectedTabbableIds = [
        'tabindex-hrefless-anchor',
        'contenteditable-true',
        'contenteditable-nesting',
        'input',
        'input-readonly',
        'select',
        'select-readonly',
        'href-anchor',
        'textarea',
        'textarea-readonly',
        'button',
        'tabindex-div',
        'hiddenParentVisible-button',
        'audio-control',
        'video-control',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures.basic;

      // JSDOM does not support the `contenteditable` attribute, so we need to fake it
      // https://github.com/jsdom/jsdom/issues/1670
      const editableDiv = container.querySelector('#contenteditable-true');
      const editableNestedDiv = container.querySelector(
        '#contenteditable-nesting'
      );

      editableDiv.contentEditable = 'true';
      editableNestedDiv.contentEditable = 'true';

      const tabbableElements = tabbable(container);

      expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);
    });

    it('correctly identifies tabbable elements in the "nested" example', () => {
      const expectedTabbableIds = ['tabindex-div-2', 'tabindex-div-0', 'input'];

      const container = document.createElement('div');
      container.innerHTML = fixtures.nested;

      const tabbableElements = tabbable(container);

      expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);
    });

    it('correctly identifies tabbable elements in the "jqueryui" example', () => {
      const expectedTabbableIds = [
        // 1
        'formTabindex',
        'visibleAncestor-spanWithTabindex',
        // 10
        'inputTabindex10',
        'spanTabindex10',
        // 0
        'visibleAncestor-inputTypeNone',
        'visibleAncestor-inputTypeText',
        'visibleAncestor-inputTypeCheckbox',
        'visibleAncestor-inputTypeRadio',
        'visibleAncestor-inputTypeButton',
        'visibleAncestor-button',
        'visibleAncestor-select',
        'visibleAncestor-textarea',
        'visibleAncestor-anchorWithHref',
        'positionFixedButton',
        'inputTabindex0',
        'spanTabindex0',
        'dimensionlessParent',
        'dimensionlessParent-dimensionless',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures.jqueryui;

      const tabbableElements = tabbable(container);

      expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);
    });

    it('correctly identifies tabbable elements in the "non-linear" example', () => {
      const expectedTabbableIds = [
        // 1
        'input-1',
        'href-anchor-1',
        // 2
        'button-2',
        // 3
        'select-3',
        'tabindex-div-3',
        // 4
        'tabindex-hrefless-anchor-4',
        //12
        'textarea-12',
        // 0
        'input',
        'select',
        'href-anchor',
        'textarea',
        'button',
        'tabindex-div-0',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures['non-linear'];

      const tabbableElements = tabbable(container);

      expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);
    });

    it('correctly identifies tabbable elements in the "changing content" example', () => {
      const expectedTabbableIds = [
        'visible-button-1',
        'visible-button-2',
        'visible-button-3',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures['changing-content'];

      const tabbableElements = tabbable(container);

      expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);

      container.querySelector('#initially-hidden').style.display = 'block';

      const expectedTabbableIdsAfterSectionIsUnhidden = [
        'visible-button-1',
        'visible-button-2',
        'visible-button-3',
        'initially-hidden-button-1',
        'initially-hidden-button-2',
      ];

      const tabbableElementsAfterSectionIsUnhidden = tabbable(container);

      expect(getTabbableIds(tabbableElementsAfterSectionIsUnhidden)).toEqual(
        expectedTabbableIdsAfterSectionIsUnhidden
      );
    });

    it('correctly identifies tabbable elements in the "svg" example', () => {
      const expectedTabbableIds = ['svg-btn', 'svg-1'];

      const container = document.createElement('div');
      container.innerHTML = fixtures.svg;

      const tabbableElements = tabbable(container);

      expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);
    });

    // TODO: The results we get here do not match the results we get in the legacy Karma test
    it.skip('correctly identifies tabbable elements in the "radio" example', () => {
      const expectedTabbableIds = [
        'formA-radioA',
        'formB-radioA',
        'formB-radioB',
        'noform-radioA',
        'noform-groupB-radioA',
        'noform-groupB-radioB',
        'noform-groupC-radioA',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures.radio;

      const tabbableElements = tabbable(container);

      expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);
    });

    // TODO: The results we get here do not match the results we get in the legacy Karma test
    it.skip('correctly identifies tabbable elements in the "radio" example without the `CSS.escape` functionality', () => {
      const actualEscape = CSS.escape;
      CSS.escape = undefined;
      jest.spyOn(console, 'error');

      const expectedTabbableIds = [
        'formA-radioA',
        'formB-radioA',
        'formB-radioB',
        'noform-radioA',
        'noform-groupB-radioA',
        'noform-groupB-radioB',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures.radio;

      const tabbableElements = tabbable(container);

      try {
        expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);
        // eslint-disable-next-line no-console
        expect(console.error).toHaveBeenCalledTimes(2);
      } finally {
        if (actualEscape) {
          CSS.escape = actualEscape;
        }
        // eslint-disable-next-line no-console
        console.error.mockRestore();
      }
    });

    it('correctly identifies tabbable elements in the "details" example', () => {
      const expectedTabbableIds = [
        'details-a-summary',
        'details-b-summary',
        'visible-input',
        'details-c',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures.details;

      const tabbableElements = tabbable(container);

      expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);
    });

    it('correctly identifies tabbable elements in the "shadow-dom" example', () => {
      const expectedTabbableIds = ['input'];

      const container = document.createElement('div');
      container.innerHTML = fixtures['shadow-dom'];

      const host = container.querySelector('#shadow-host');
      const template = container.querySelector('#shadow-root-template');

      const shadow = host.attachShadow({ mode: 'open' });
      shadow.appendChild(template.content.cloneNode(true));

      const tabbableElements = tabbable(shadow.querySelector('#container'));

      expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);
    });

    describe('options argument', () => {
      it('includes the container element when the `includeContainer` property is true', () => {
        const expectedTabbableIds = [
          'tabindex-div-2',
          'container-div',
          'tabindex-div-0',
          'input',
        ];

        const container = document.createElement('div');
        container.id = 'container-div';
        container.setAttribute('tabindex', '0');
        container.innerHTML = fixtures.nested;

        const tabbableElements = tabbable(container, {
          includeContainer: true,
        });

        expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);
      });

      it('does not include the container element when the `includeContainer` property is false', () => {
        const expectedTabbableIds = [
          'tabindex-div-2',
          'tabindex-div-0',
          'input',
        ];

        const container = document.createElement('div');
        container.id = 'container-div';
        container.setAttribute('tabindex', '0');
        container.innerHTML = fixtures.nested;

        const tabbableElements = tabbable(container, {
          includeContainer: false,
        });

        expect(getTabbableIds(tabbableElements)).toEqual(expectedTabbableIds);
      });
    });
  });
});
