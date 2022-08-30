const { test, expect } = require( '@playwright/test' );
const WpAdminPage = require( '../pages/wp-admin-page.js' );
const EditorPage = require( '../pages/editor-page.js' );
const widgetsCache = require( '../assets/widgets-cache' );
const controlsTestConfig = require( '../assets/controls-test-config' );

const {
	Heading,
	WidgetBase,
} = require( '../utils/widgets' );

const {
	Choose,
	Select,
	Textarea,
} = require( '../utils/controls' );

const { Registrar } = require( '../utils/registrar' );

const widgetsRegistrar = new Registrar()
	.register( Heading )
	.register( WidgetBase );

const controlsRegistrar = new Registrar()
	.register( Choose )
	.register( Select )
	.register( Textarea );

/**
 * @param  widgetType
 * @param  editor
 * @return {WidgetBase}
 */
function createWidgetInstance( widgetType, editor ) {
	const WidgetClass = widgetsRegistrar.get( widgetType );

	return new WidgetClass(
		editor,
		controlsRegistrar,
		{
			widgetType,
			controls: widgetsCache[ widgetType ].controls,
			controlsTestConfig: controlsTestConfig[ widgetType ] || {},
		},
	);
}

for ( const widgetType of Object.keys( widgetsCache ) ) {
	/** @type WidgetBase */
	let widget;

	test.describe( widgetType, () => {
		test.beforeAll( async ( { browser } ) => {
			const context = await browser.newContext();
			const page = await context.newPage();

			const wpAdminPage = new WpAdminPage( page );
			const pageId = await wpAdminPage.createElementorPage();

			const editorPage = new EditorPage( wpAdminPage.page );
			await editorPage.ensureLoaded();
			await editorPage.ensureNavigatorClosed();

			widget = createWidgetInstance( widgetType, editorPage );
			widget.create();

			await page.waitForTimeout( 500 );
		} );

		test.afterAll( () => {

		} );
	} );
}

test( 'All widgets sanity test @regression', async ( { page }, testInfo ) => {
	// Arrange.
	for ( const widgetType of Object.keys( widgetsCache ) ) {
		// Act.
		await widget.create();

		await page.waitForTimeout( 500 );

		const element = await widget.getElement();

		// Assert - Match snapshot for default appearance.
		expect( await element.screenshot( {
			type: 'jpeg',
			quality: 70,
		} ) ).toMatchSnapshot( [ widgetType, 'default.jpeg' ] );

		await widget.test( async ( controlId, currentControlValue ) => {
			// Skip default values.
			if ( [ '', 'default' ].includes( currentControlValue ) ) {
				return;
			}

			// Assert - Match snapshot for specific control.
			expect( await element.screenshot( {
				type: 'jpeg',
				quality: 70,
			} ) ).toMatchSnapshot( [ widgetType, controlId, `${ currentControlValue }.jpeg` ] );
		} );
	}
} );
