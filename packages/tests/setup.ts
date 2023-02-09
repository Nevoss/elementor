import { flushInjections } from '@elementor/locations';
import { flushListeners, setIsReady } from '@elementor/v1-adapters';
import { deleteStore } from '@elementor/store';

// Add JSDOM matchers.
import '@testing-library/jest-dom';

// Add JSDOM matchers.
import '@testing-library/jest-dom';

import '@wordpress/jest-console';

beforeEach( () => {
	/* eslint-disable no-console */
	// The mocks already created at `@wordpress/jest-console`
	// here it just ensure that nothing will be prompt to the console.
	jest.mocked( console.error ).mockImplementation( () => null );
	jest.mocked( console.warn ).mockImplementation( () => null );
	jest.mocked( console.info ).mockImplementation( () => null );
	/* eslint-enable no-console */

	flushInjections();
	flushListeners();
	deleteStore();

	setIsReady( true );
} );
