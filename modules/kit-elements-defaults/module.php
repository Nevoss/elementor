<?php
namespace Elementor\Modules\KitElementsDefaults;

use Elementor\Plugin;
use Elementor\Modules\KitElementsDefaults\Data\Controller;
use Elementor\Core\Experiments\Manager as Experiments_Manager;
use Elementor\Core\Base\Module as BaseModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Module extends BaseModule {
	public function get_name() {
		return 'kit-elements-defaults';
	}

	public static function get_experimental_data() {
		return [
			'name' => 'kit-elements-defaults',
			'title' => __( 'Save as Default', 'elementor' ),
			'description' => __(
				'Maintain consistency across your site by saving the changes to a widget as the default setting for future use. These settings will automatically apply to the widget every time you place it. Note: This feature does’t affect existing widgets.',
				'elementor'
			) . ' <a href="https://go.elementor.com/wp-dash-save-as-default" target="_blank">' . __( 'Learn More', 'elementor' ) . '</a>',
			'release_status' => Experiments_Manager::RELEASE_STATUS_ALPHA,
		];
	}

	private function enqueue_scripts() {
		wp_enqueue_script(
			'elementor-kit-elements-defaults-editor',
			$this->get_js_assets_url( 'kit-elements-defaults-editor' ),
			[],
			ELEMENTOR_VERSION,
			true
		);
	}

	public function __construct() {
		parent::__construct();

		add_action( 'elementor/editor/before_enqueue_scripts', function () {
			$this->enqueue_scripts();
		} );

		Plugin::$instance->data_manager_v2->register_controller( new Controller() );
	}
}
