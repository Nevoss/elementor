import { render } from '@testing-library/react';
import TopBar from '../top-bar';

describe( '@elementor/top-bar TopBar component', () => {
	it( 'should render elementor logo', () => {
		// Arrange & Act.
		const { queryByAltText } = render( <TopBar /> );

		// Assert.
		expect( queryByAltText( 'Elementor Logo' ) ).toBeTruthy();
	} );
} );
