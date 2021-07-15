import { focusable } from '../../src/index.js';
import {
  setupTestWindow,
  getFixtures,
  setupFixture,
  removeAllChildNodes,
  getIdsFromElementsArray,
} from './e2e.helpers';

describe('isFocusable', () => {
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
    it('correctly identifies focusable elements in the "basic" example', () => {
      const expectedFocusableIds = [
        'contenteditable-true',
        'contenteditable-nesting',
        'input',
        'input-readonly',
        'select',
        'select-readonly',
        'href-anchor',
        'tabindex-hrefless-anchor',
        'textarea',
        'textarea-readonly',
        'button',
        'tabindex-div',
        'negative-select',
        'hiddenParentVisible-button',
        'audio-control',
        'video-control',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures.basic;
      document.body.append(container);

      const focusableElements = focusable(container);

      expect(getIdsFromElementsArray(focusableElements)).to.eql(
        expectedFocusableIds
      );
    });

    it('correctly identifies focusable elements in the "nested" example', () => {
      const expectedFocusableIds = [
        'tabindex-div-0',
        'tabindex-div-2',
        'input',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures.nested;
      document.body.append(container);

      const focusableElements = focusable(container);

      expect(getIdsFromElementsArray(focusableElements)).to.eql(
        expectedFocusableIds
      );
    });

    it('correctly identifies focusable elements in the "jqueryui" example', () => {
      const expectedFocusableIds = [
        'formTabindex',
        'visibleAncestor-inputTypeNone',
        'visibleAncestor-inputTypeText',
        'visibleAncestor-inputTypeCheckbox',
        'visibleAncestor-inputTypeRadio',
        'visibleAncestor-inputTypeButton',
        'visibleAncestor-button',
        'visibleAncestor-select',
        'visibleAncestor-textarea',
        'visibleAncestor-anchorWithHref',
        'visibleAncestor-spanWithTabindex',
        'visibleAncestor-divWithNegativeTabindex',
        'positionFixedButton',
        'inputTabindex0',
        'inputTabindex10',
        'inputTabindex-1',
        'inputTabindex-50',
        'spanTabindex0',
        'spanTabindex10',
        'spanTabindex-1',
        'spanTabindex-50',
        'dimensionlessParent',
        'dimensionlessParent-dimensionless',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures.jqueryui;
      document.body.append(container);

      const focusableElements = focusable(container);

      expect(getIdsFromElementsArray(focusableElements)).to.eql(
        expectedFocusableIds
      );
    });

    it('correctly identifies focusable elements in the "non-linear" example', () => {
      const expectedFocusableIds = [
        'input',
        'select',
        'href-anchor',
        'textarea',
        'button',
        'tabindex-div-0',
        'input-1',
        'select-3',
        'href-anchor-1',
        'tabindex-hrefless-anchor-4',
        'textarea-12',
        'button-2',
        'tabindex-div-3',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures['non-linear'];
      document.body.append(container);

      const focusableElements = focusable(container);

      expect(getIdsFromElementsArray(focusableElements)).to.eql(
        expectedFocusableIds
      );
    });

    it('correctly identifies focusable elements in the "changing content" example', () => {
      const expectedFocusableIds = [
        'visible-button-1',
        'visible-button-2',
        'visible-button-3',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures['changing-content'];
      document.body.append(container);

      const focusableElements = focusable(container);

      expect(getIdsFromElementsArray(focusableElements)).to.eql(
        expectedFocusableIds
      );

      container.querySelector('#initially-hidden').style.display = 'block';

      const expectedFocusableIdsAfterSectionIsUnhidden = [
        'visible-button-1',
        'visible-button-2',
        'visible-button-3',
        'initially-hidden-button-1',
        'initially-hidden-button-2',
      ];

      const focusableElementsAfterSectionIsUnhidden = focusable(container);

      expect(
        getIdsFromElementsArray(focusableElementsAfterSectionIsUnhidden)
      ).to.eql(expectedFocusableIdsAfterSectionIsUnhidden);
    });

    it('correctly identifies focusable elements in the "svg" example', () => {
      const expectedFocusableIds = ['svg-btn', 'svg-1', 'svg-2'];

      const container = document.createElement('div');
      container.innerHTML = fixtures.svg;
      document.body.append(container);

      const focusableElements = focusable(container);

      expect(getIdsFromElementsArray(focusableElements)).to.eql(
        expectedFocusableIds
      );
    });

    it('correctly identifies focusable elements in the "radio" example', () => {
      const expectedFocusableIds = [
        'formA-radioA',
        'formA-radioB',
        'formB-radioA',
        'formB-radioB',
        'noform-radioA',
        'noform-radioB',
        'noform-groupB-radioA',
        'noform-groupB-radioB',
        'noform-groupC-radioA',
        'noform-groupC-radioB',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures.radio;
      document.body.append(container);

      const focusableElements = focusable(container);

      expect(getIdsFromElementsArray(focusableElements)).to.eql(
        expectedFocusableIds
      );
    });

    it('correctly identifies focusable elements in the "details" example', () => {
      const expectedFocusableIds = [
        'details-a-summary',
        'details-b-summary',
        'visible-input',
        'details-c',
      ];

      const container = document.createElement('div');
      container.innerHTML = fixtures.details;
      document.body.append(container);

      const focusableElements = focusable(container);

      expect(getIdsFromElementsArray(focusableElements)).to.eql(
        expectedFocusableIds
      );
    });

    it('correctly identifies focusable elements in the "shadow-dom" example', () => {
      const expectedFocusableIds = ['input'];

      const { container } = setupFixture(fixtures['shadow-dom'], { window });
      const host = container.querySelector('test-shadow');

      const focusableElements = focusable(
        host.shadowRoot.querySelector('#container')
      );

      expect(getIdsFromElementsArray(focusableElements)).to.eql(
        expectedFocusableIds
      );
    });

    describe('options argument', () => {
      it('includes the container element when the `includeContainer` property is true', () => {
        const expectedFocusableIds = [
          'container-div',
          'tabindex-div-0',
          'tabindex-div-2',
          'input',
        ];

        const container = document.createElement('div');
        container.id = 'container-div';
        container.setAttribute('tabindex', '0');
        container.innerHTML = fixtures.nested;
        document.body.append(container);

        const focusableElements = focusable(container, {
          includeContainer: true,
        });

        expect(getIdsFromElementsArray(focusableElements)).to.eql(
          expectedFocusableIds
        );
      });

      it('does not include the container element when the `includeContainer` property is false', () => {
        const expectedFocusableIds = [
          'tabindex-div-0',
          'tabindex-div-2',
          'input',
        ];

        const container = document.createElement('div');
        container.id = 'container-div';
        container.setAttribute('tabindex', '0');
        container.innerHTML = fixtures.nested;
        document.body.append(container);

        const focusableElements = focusable(container, {
          includeContainer: false,
        });

        expect(getIdsFromElementsArray(focusableElements)).to.eql(
          expectedFocusableIds
        );
      });

      describe('displayed check', () => {
        it('return browser visible elements by default ("full" option)', () => {
          const expectedFocusableIds = [
            'displayed-top',
            'displayed-nested',
            'displayed-zero-size',
          ];
          const container = document.createElement('div');
          container.innerHTML = fixtures.displayed;
          document.body.append(container);

          const focusableElementsDefault = focusable(container);
          const focusableElementsFull = focusable(container, {
            displayCheck: 'full',
          });

          expect(getIdsFromElementsArray(focusableElementsDefault)).to.eql(
            expectedFocusableIds
          );
          expect(getIdsFromElementsArray(focusableElementsFull)).to.eql(
            getIdsFromElementsArray(focusableElementsDefault)
          );
        });
        it('return only elements with size ("non-zero-area" option)', () => {
          const expectedFocusableIds = ['displayed-top', 'displayed-nested'];
          const container = document.createElement('div');
          container.innerHTML = fixtures.displayed;
          document.body.append(container);

          const focusableElementsWithSize = focusable(container, {
            displayCheck: 'non-zero-area',
          });

          expect(getIdsFromElementsArray(focusableElementsWithSize)).to.eql(
            expectedFocusableIds
          );
        });
        it('return elements without checking display ("none" option)', () => {
          const expectedFocusableIds = [
            'displayed-top',
            'displayed-nested',
            'displayed-none-top',
            'nested-under-displayed-none',
            'displayed-zero-size',
          ];
          const container = document.createElement('div');
          container.innerHTML = fixtures.displayed;
          document.body.append(container);

          const focusableElementsWithSize = focusable(container, {
            displayCheck: 'none',
          });

          expect(getIdsFromElementsArray(focusableElementsWithSize)).to.eql(
            expectedFocusableIds
          );
        });
      });
    });
  });
});
