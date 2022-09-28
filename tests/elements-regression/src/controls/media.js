const { ControlBase } = require( './control-base' );

class Media extends ControlBase {
	getSelector() {
		return `.elementor-control-${ this.config.name }.elementor-control-type-media`;
	}

	async getValue() {
		await this.openMediaLibrary();

		const selectedMediaId = await this.getSelectedMediaId();

		const value = selectedMediaId
			? Object.entries( process.env )
				.find( ( [ key, id ] ) =>
					key.startsWith( 'ELEMENTS_REGRESSION_MEDIA_IDS_' ) &&
					id === selectedMediaId,
				)
				?.[ 0 ]
				?.replace( 'ELEMENTS_REGRESSION_MEDIA_IDS_', '' )
			: null;

		await this.closeMediaLibrary();

		return value;
	}

	async setValue( newValue ) {
		const id = process.env?.[ `ELEMENTS_REGRESSION_MEDIA_IDS_${ newValue }` ];

		if ( ! id ) {
			throw new Error( `Media file with name '${ newValue }' was not found.` );
		}

		await this.openMediaLibrary();

		const selectedMediaId = await this.getSelectedMediaId();

		if ( selectedMediaId === id ) {
			await this.closeMediaLibrary();
		}

		await this.page.locator( `.media-modal:visible li[role="checkbox"][data-id="${ id }"]` ).click();
		await this.page.locator( `.media-modal:visible button.media-button:has-text("Select")` ).click();
	}

	async getTestValues() {
		return [ 'elementor.png' ];
	}

	async openMediaLibrary() {
		await this.elementLocator.locator( '.elementor-control-media-area' ).click();
		await this.page.locator( '.media-modal:visible h1:has-text("Insert Media")' ).waitFor();
	}

	async closeMediaLibrary() {
		await this.page.locator( '.media-modal:visible button:has-text("Close dialog")' ).click();
	}

	async getSelectedMediaId() {
		const element = await this.page.$( '.media-modal:visible li[role="checkbox"].selected' );

		return await element?.getAttribute( 'data-id' );
	}
}

module.exports = {
	Media,
};
