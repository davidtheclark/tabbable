import { tabbable } from '../../src/index.js';
import {
  setupTestWindow,
  getFixtures,
  setupFixture,
  removeAllChildNodes,
  getIdsFromElementsArray,
} from './e2e.helpers';

describe('tabbable', () => {
  let document, fixtures;
  before(() => {
    setupTestWindow((testWindow) => {
      document = testWindow.document;
    });
    getFixtures((f) => (fixtures = f));
  });

  afterEach(() => {
    removeAllChildNodes(document.body);
  });

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
      document.body.append(container);

      const tabbableElements = tabbable(container);

      expect(getIdsFromElementsArray(tabbableElements)).to.eql(
        expectedTabbableIds
      );
    });

    it('correctly identifies tabbable elements in the "nested" example', () => {
      const expectedTabbableIds = ['tabindex-div-2', 'tabindex-div-0', 'input'];

      const container = document.createElement('div');
      container.innerHTML = fixtures.nested;
      document.body.append(container);

      const tabbableElements = tabbable(container);

      expect(getIdsFromElementsArray(tabbableElements)).to.eql(
        expectedTabbableIds
      );
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
      document.body.append(container);

      const tabbableElements = tabbable(container);

      expect(getIdsFromElementsArray(tabbableElements)).to.eql(
        expectedTabbableIds
      );
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
      document.body.append(container);

      const tabbableElements = tabbable(container);

      expect(getIdsFromElementsArray(tabbableElements)).to.eql(
        expectedTabbableIds
      );
    });

    it('correctly identifies tabbable elements in the "changing content" example', () => {
      const expectedTabbableIds = [
        'visible-button-1',
        'visible-button-2',
        'visible-button-3',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures['changing-content'];
      document.body.append(container);

      const tabbableElements = tabbable(container);

      expect(getIdsFromElementsArray(tabbableElements)).to.eql(
        expectedTabbableIds
      );

      container.querySelector('#initially-hidden').style.display = 'block';

      const expectedTabbableIdsAfterSectionIsUnhidden = [
        'visible-button-1',
        'visible-button-2',
        'visible-button-3',
        'initially-hidden-button-1',
        'initially-hidden-button-2',
      ];

      const tabbableElementsAfterSectionIsUnhidden = tabbable(container);

      expect(
        getIdsFromElementsArray(tabbableElementsAfterSectionIsUnhidden)
      ).to.eql(expectedTabbableIdsAfterSectionIsUnhidden);
    });

    it('correctly identifies tabbable elements in the "svg" example', () => {
      const expectedTabbableIds = ['svg-btn', 'svg-1'];

      const container = document.createElement('div');
      container.innerHTML = fixtures.svg;
      document.body.append(container);

      const tabbableElements = tabbable(container);

      expect(getIdsFromElementsArray(tabbableElements)).to.eql(
        expectedTabbableIds
      );
    });

    it('correctly identifies tabbable elements in the "radio" example', () => {
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
      document.body.append(container);

      const tabbableElements = tabbable(container);

      expect(getIdsFromElementsArray(tabbableElements)).to.eql(
        expectedTabbableIds
      );
    });

    it('correctly identifies tabbable elements in the "radio" example without the `CSS.escape` functionality', () => {
      const actualEscape = CSS.escape;
      CSS.escape = undefined;
      cy.spy(console, 'error');

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
      document.body.append(container);

      const tabbableElements = tabbable(container);

      try {
        expect(getIdsFromElementsArray(tabbableElements)).to.eql(
          expectedTabbableIds
        );
        // eslint-disable-next-line no-console
        expect(console.error).to.have.callCount(2);
      } finally {
        if (actualEscape) {
          CSS.escape = actualEscape;
        }
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
      document.body.append(container);

      const tabbableElements = tabbable(container);

      expect(getIdsFromElementsArray(tabbableElements)).to.eql(
        expectedTabbableIds
      );
    });

    it('correctly identifies tabbable elements in the "shadow-dom" example', () => {
      const expectedTabbableIds = ['input'];

      const { container } = setupFixture(fixtures['shadow-dom'], { window });
      const host = container.querySelector('test-shadow');

      const tabbableElements = tabbable(
        host.shadowRoot.querySelector('#container')
      );

      expect(getIdsFromElementsArray(tabbableElements)).to.eql(
        expectedTabbableIds
      );
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
        document.body.append(container);

        const tabbableElements = tabbable(container, {
          includeContainer: true,
        });

        expect(getIdsFromElementsArray(tabbableElements)).to.eql(
          expectedTabbableIds
        );
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
        document.body.append(container);

        const tabbableElements = tabbable(container, {
          includeContainer: false,
        });

        expect(getIdsFromElementsArray(tabbableElements)).to.eql(
          expectedTabbableIds
        );
      });

      describe('displayed check', () => {
        it('return browser visible elements by default ("full" option)', () => {
          const expectedTabbableIds = [
            'displayed-top',
            'displayed-nested',
            'displayed-zero-size',
          ];
          const container = document.createElement('div');
          container.innerHTML = fixtures.displayed;
          document.body.append(container);

          const tabbableElementsDefault = tabbable(container);
          const tabbableElementsFull = tabbable(container, {
            displayCheck: 'full',
          });

          expect(getIdsFromElementsArray(tabbableElementsDefault)).to.eql(
            expectedTabbableIds
          );
          expect(getIdsFromElementsArray(tabbableElementsFull)).to.eql(
            getIdsFromElementsArray(tabbableElementsDefault)
          );
        });
        it('return only elements with size ("non-zero-area" option)', () => {
          const expectedTabbableIds = ['displayed-top', 'displayed-nested'];
          const container = document.createElement('div');
          container.innerHTML = fixtures.displayed;
          document.body.append(container);

          const tabbableElementsWithSize = tabbable(container, {
            displayCheck: 'non-zero-area',
          });

          expect(getIdsFromElementsArray(tabbableElementsWithSize)).to.eql(
            expectedTabbableIds
          );
        });
        it('return elements without checking display ("none" option)', () => {
          const expectedTabbableIds = [
            'displayed-top',
            'displayed-nested',
            'displayed-none-top',
            'nested-under-displayed-none',
            'displayed-zero-size',
          ];
          const container = document.createElement('div');
          container.innerHTML = fixtures.displayed;
          document.body.append(container);

          const tabbableElementsWithSize = tabbable(container, {
            displayCheck: 'none',
          });

          expect(getIdsFromElementsArray(tabbableElementsWithSize)).to.eql(
            expectedTabbableIds
          );
        });
      });
    });
  });
});
