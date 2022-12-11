import { Locations } from '../lib/locations';
import { Slot } from '../components/slot';
import { render } from '@testing-library/react';

describe( 'Test', () => {
	it( 'Should work', () => {
		const { container } = render( <Slot name="test" /> );

		expect( container ).toBeTruthy();
	} );
} );
