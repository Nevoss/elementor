import { queryByText } from '@testing-library/react';
import init from '../init';
import { addToTop } from '../locations';

describe( '@elementor/editor init', () => {
	it( 'should be rendered', () => {
		// Arrange.
		addToTop( {
			component: () => <div>test</div>,
		} );

		const element = document.createElement( 'div' );

		// Act.
		init( element );

		// Assert.
		expect( queryByText( element, 'test' ) ).toBeTruthy();
	} );
} );
