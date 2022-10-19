import store from 'elementor/modules/kit-elements-defaults/assets/js/editor/store';
import { FetchMock } from './fetch-mock';

const wpApiSettings = {
	root: 'http://example.com/wp-json/',
	nonce: '123456',
};

describe( 'modules/kit-elements-defaults/assets/js/editor/store.js', () => {
	let originalFetch, fetchMock;

	beforeEach( () => {
		originalFetch = window.fetch;

		window.wpApiSettings = wpApiSettings;

		fetchMock = new FetchMock( wpApiSettings.root + 'elementor/v1' );

		window.fetch = fetchMock.getMock();
	} );

	afterEach( () => {
		window.fetch = originalFetch;

		delete window.wpApiSettings;
	} );

	it( 'Should return empty object for non-existing type', () => {
		// Act & Assert.
		expect( store.get( 'non-existing-element' ) ).toStrictEqual( {} );
	} );

	it( 'Should load items to cache', async () => {
		// Arrange.
		fetchMock.get( '/kit-elements-defaults' )
			.reply( 200, {
				section: {
					color: 'red',
					background_color: '#F00',
				},
				button: {
					type: 'info',
				},
			} );

		// Act.
		await store.load();

		// Assert.
		const section = store.get( 'section' );
		const button = store.get( 'button' );

		expect( section ).toStrictEqual( {
			color: 'red',
			background_color: '#F00',
		} );

		expect( button ).toStrictEqual( {
			type: 'info',
		} );
	} );

	it( 'Should upsert and refresh cache', async () => {
		// Arrange.
		store.items = {
			section: {
				old_control: 'old_value',
			},
		};

		fetchMock.put( '/kit-elements-defaults/section' )
			.reply( 201, null );

		fetchMock.get( '/kit-elements-defaults' )
			.reply( 200, {
				section: {
					new_control: 'new_value',
				},
			} );

		// Act.
		await store.upsert( 'section', {
			new_control: 'new_value',
		} );

		// Assert.
		const section = store.get( 'section' );

		expect( section ).toStrictEqual( {
			new_control: 'new_value',
		} );
	} );

	it( 'Should delete and refresh cache', async () => {
		// Arrange.
		store.items = {
			section: {
				old_control: 'old_value',
			},
		};

		fetchMock.delete( '/kit-elements-defaults/section' )
			.reply( 204, '' );

		fetchMock.get( '/kit-elements-defaults' )
			.reply( 200, {} );

		// Act.
		await store.delete( 'section' );

		// Assert.
		const section = store.get( 'section' );

		expect( section ).toStrictEqual( {} );
	} );

	it( 'Should send proper auth headers', async () => {
		// Arrange.
		let headers = {};

		window.fetch = jest.fn( ( _, { headers: reqHeaders } ) => {
			headers = reqHeaders;

			return Promise.resolve( {
				ok: true,
				status: 200,
				text: () => Promise.resolve( '{}' ),
			} );
		} );

		// Act.
		await store.load();

		// Assert.
		expect( headers ).toStrictEqual( {
			'Content-Type': 'application/json',
			'X-WP-Nonce': '123456',
		} );
	} );

	it( 'Should throw for invalid response', async () => {
		// Arrange.
		fetchMock.get( '/kit-elements-defaults' ).reply( 500, null );

		// Act & Assert.
		await expect( store.load() ).rejects.toStrictEqual( {
			ok: false,
			status: 500,
			text: expect.any( Function ),
		} );
	} );
} );
