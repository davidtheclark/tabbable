import {
  isTabbable,
  isFocusable,
  tabbable,
  focusable,
} from '../../src/index.js';
import {
  setupTestWindow,
  removeAllChildNodes,
  setupFixture,
  getFixtures,
  getIdsFromElementsArray,
} from './e2e.helpers';

describe('web-components', () => {
  let window, document, fixtures;
  before(() => {
    setupTestWindow((testWindow) => {
      window = testWindow;
      document = testWindow.document;
    });
    getFixtures((f) => (fixtures = f));
  });

  afterEach(() => {
    removeAllChildNodes(document.body);
  });

  describe('isFocusable/isTabbable', () => {
    it('should separate shadow/light radio button groups', () => {
      const { container } = setupFixture(fixtures.shadowDomRadio, { window });
      const shadowRoot = container.querySelector('#webComp').shadowRoot;
      const shadowRadio1 = shadowRoot.querySelector('#shadow-radio1');
      const shadowRadio2 = shadowRoot.querySelector('#shadow-radio2');
      const lightRadio1 = container.querySelector('#light-radio1');
      const radio2Slotted = container.querySelector('#light-radio2-slotted');
      const lightRadio3 = container.querySelector('#light-radio3');

      // always focusable
      expect(isFocusable(shadowRadio1), 'checked in shadow').to.eql(true);
      expect(isFocusable(shadowRadio2), 'not checked in shadow').to.eql(true);
      expect(isFocusable(lightRadio1), 'checked in light').to.eql(true);
      expect(isFocusable(radio2Slotted), 'not checked slotted').to.eql(true);
      expect(isFocusable(lightRadio3), 'not checked in light').to.eql(true);
      // only the first checked is tabbable
      expect(isTabbable(shadowRadio1), 'checked in shadow').to.eql(true);
      expect(isTabbable(shadowRadio2), 'not checked in shadow').to.eql(false);
      expect(isTabbable(lightRadio1), 'checked in light').to.eql(true);
      expect(isTabbable(radio2Slotted), 'not checked slotted').to.eql(false);
      expect(isTabbable(lightRadio3), 'not checked in light').to.eql(false);
    });
    it('should not match elements in shadow root with a "display=none" ancestor', () => {
      const { container } = setupFixture(fixtures.shadowDomDisplay, {
        window,
        caseId: 'light-display-none',
      });
      const shadowRoot = container.querySelector('test-shadow').shadowRoot;
      const shadowInput = shadowRoot.querySelector('#shadow-input');
      const lightInputSlotted = container.querySelector('#light-input-slotted');

      // focusable
      expect(isFocusable(shadowInput), 'non display shadow').to.eql(false);
      expect(isFocusable(lightInputSlotted), 'non display slotted').to.eql(
        false
      );
      // tabbable
      expect(isTabbable(shadowInput), 'non display shadow').to.eql(false);
      expect(isTabbable(lightInputSlotted), 'non display slotted').to.eql(
        false
      );
    });
    it('should not match elements in a non display slot', () => {
      const { container } = setupFixture(fixtures.shadowDomDisplay, {
        window,
        caseId: 'slot-display-none',
      });
      const lightInputSlotted = container.querySelector('#light-input-slotted');

      expect(isFocusable(lightInputSlotted)).to.eql(false);
      expect(isTabbable(lightInputSlotted)).to.eql(false);
    });
    it('should not match elements in a closed shadow root with inner display="none" (fallback to zero-area-size)', () => {
      const { container } = setupFixture(fixtures.shadowDomDisplay, {
        window,
        caseId: 'slot-display-none-closed-shadow',
      });
      const webComp = container.querySelector('test-shadow');
      const lightDisplayNoneSlotted = container.querySelector(
        '#light-input-slotted'
      );

      // focusable
      expect(
        isFocusable(lightDisplayNoneSlotted),
        'unable to test unknown shadow nested non display'
      ).to.eql(true);
      expect(
        isFocusable(lightDisplayNoneSlotted, {
          getShadowRoot: (node) => node === webComp,
        }),
        'fallback to zero size check for unreached shadow root'
      ).to.eql(false);
      // tabbable
      expect(
        isTabbable(lightDisplayNoneSlotted),
        'unable to test unknown shadow nested non display'
      ).to.eql(true);
      expect(
        isTabbable(lightDisplayNoneSlotted, {
          getShadowRoot: (node) => node === webComp,
        }),
        'fallback to zero size for unreached shadow root'
      ).to.eql(false);
    });
    it('should not match slot elements', () => {
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'slots-tab-index',
      });
      const shadowRoot = container.querySelector('test-shadow').shadowRoot;
      const slotWithTabIndex = shadowRoot.querySelector(
        'slot[name="slot-first"]'
      );

      expect(isFocusable(slotWithTabIndex), 'slot not focusable').to.eql(false);
      expect(isTabbable(slotWithTabIndex), 'slot not tabbable').to.eql(false);
    });
  });
  describe('query', () => {
    it('should find elements inside shadow dom', () => {
      const expected = ['light-before', 'shadow-input', 'light-after'];
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'shadow-input',
      });

      const result = tabbable(container, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should find tabbable host', () => {
      const expected = [
        'light-before',
        'tabbable-host',
        'shadow-input',
        'light-after',
      ];
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'tabbable-host',
      });

      const result = tabbable(container, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should find elements inside shadow dom when directly querying the element with shadow root', () => {
      const expected = ['shadow-input'];
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'shadow-input',
      });
      const shadowElement = container.querySelector('test-shadow');

      const result = tabbable(shadowElement, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should find elements inside shadow dom when directly querying the element with shadow root (include container)', () => {
      const expected = ['shadow-host', 'shadow-input'];
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'shadow-input',
      });
      const shadowElement = container.querySelector('test-shadow');
      shadowElement.setAttribute('id', 'shadow-host');
      shadowElement.setAttribute('tabindex', 0);

      const result = tabbable(shadowElement, {
        getShadowRoot() {},
        includeContainer: true,
      });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should sort slots inside shadow dom', () => {
      const expected = [
        'light-before',
        'light-slotter-before',
        'shadow-input',
        'light-slotter-after',
        'light-slotter-default',
        'default-slot-input',
        'light-after',
      ];
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'light-shadow-with-slots',
      });

      const result = tabbable(container, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should sort shadow and light elements separately', () => {
      const expected = [
        'light-first',
        'light-middle',
        'light-last',
        'shadow-first',
        'shadow-middle',
        'shadow-last',
      ];
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'light-shadow-tab-index',
      });

      const result = tabbable(container, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should sort slots content by slots tabindex', () => {
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'slots-tab-index',
      });

      const tabbableList = tabbable(container, { getShadowRoot() {} });
      const focusableList = focusable(container, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(tabbableList), 'tabbable').to.eql([
        'light-1',
        'shadow-1',
        'shadow-2',
        'light-2',
        'shadow-3',
        'light-3',
      ]);
      expect(getIdsFromElementsArray(focusableList), 'focusable').to.eql([
        'shadow-3',
        'light-3',
        'light-2',
        'light-1',
        'shadow-2',
        'shadow-1',
      ]);
    });

    it('should insert slots nested content according to slot positions', () => {
      const expected = [
        'light-1',
        'light-2',
        'light-3',
        'shadow-between',
        'light-4',
        'light-5',
        'light-6',
      ];
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'slots-nested-tab-index',
      });

      const result = tabbable(container, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should query nested shadow doms for slots', () => {
      const expected = [
        'shadow-outter-before',
        'shadow-inner',
        'light-slotted-input',
        'shadow-outter-after',
      ];

      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'slotted-through-multiple-shadows',
      });

      const result = tabbable(container, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should find elements inside slot', () => {
      const expected = ['light-slotter-before'];
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'light-shadow-with-slots',
      });
      const shadowElement = container.querySelector('test-shadow');
      const slot = shadowElement.shadowRoot.querySelector(
        'slot[name="before"]'
      );

      const result = tabbable(slot, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should not find slot with tabindex', () => {
      const expected = ['light-slotter-before'];
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'light-shadow-with-slots',
      });
      const shadowElement = container.querySelector('test-shadow');
      const slot = shadowElement.shadowRoot.querySelector(
        'slot[name="before"]'
      );
      slot.id = 'slot-id';
      slot.tabIndex = '1';

      const result = tabbable(slot, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should filter un-tabbable elements', () => {
      const expected = [
        'shadow-summary',
        'shadow-details-without-summary',
        'shadow-radio-checked',
      ];
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'filter-conditions',
      });

      const result = tabbable(container, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should filter un-focusable elements', () => {
      const expected = [
        'shadow-summary',
        'shadow-details-without-summary',
        'shadow-radio-unchecked',
        'shadow-radio-checked',
        'shadow-negative-tabindex',
      ];
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'filter-conditions',
      });

      const result = focusable(container, { getShadowRoot() {} });

      expect(getIdsFromElementsArray(result)).to.eql(expected);
    });

    it('should accept shadow root in order to query closed shadows', () => {
      const { container } = setupFixture(fixtures.shadowDomQuery, {
        window,
        caseId: 'closed-shadow-input',
      });

      const providedShadowRoot = tabbable(container, {
        getShadowRoot(node) {
          return node.closedShadowRoot;
        },
      });
      const noKnowlageOfShadowRoot = tabbable(container, {
        webComponents(_node) {
          return false;
        },
      });
      const unknownShadowRoot = tabbable(container, {
        getShadowRoot(_node) {
          return true;
        },
      });

      expect(
        getIdsFromElementsArray(providedShadowRoot),
        'provided shadow root'
      ).to.eql([
        'light-before',
        'shadow-input',
        'light-slotted',
        'light-after',
      ]);
      expect(
        getIdsFromElementsArray(noKnowlageOfShadowRoot),
        'no knowlage of shadow root'
      ).to.eql(['light-slotted', 'light-before', 'light-after']);
      expect(
        getIdsFromElementsArray(unknownShadowRoot),
        'unknown of shadow root'
      ).to.eql(['light-before', 'light-slotted', 'light-after']);
    });
  });
});
