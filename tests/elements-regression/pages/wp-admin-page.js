const BasePage = require( './base-page.js' );
const EditorPage = require( './editor-page.js' );

/**
 * This post is used for any tests that need a post, with empty elements.
 *
 * @type {number}
 */
const CLEAN_POST_ID = 1;

module.exports = class WpAdminPage extends BasePage {
	/**
	 * @return {Promise<number>}
	 */
	async createElementorPage() {
		await this.page.goto( '/wp-admin' );

		const button = await this.page.locator( 'text="Create New Page"' );
		await button.click();

		await this.page.waitForSelector( '#elementor-panel-header-title' );

		return await this.page.evaluate( () => window.ElementorConfig.document.id );
	}
};
