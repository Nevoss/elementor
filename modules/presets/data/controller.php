<?php
namespace Elementor\Modules\Presets\Data;

use Elementor\Plugin;
use Elementor\Modules\Presets\Documents\Preset;
use \Elementor\Data\Base\Controller as Base_Controller;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Controller extends Base_Controller {
	/**
	 * @return string
	 */
	public function get_name() {
		return 'presets';
	}

	public function register_internal_endpoints() {
		// Register as internal to remove the default endpoint generated by the base controller.
		$this->register_endpoint( Endpoints\Index::class );
	}

	public function register_endpoints() {
		//
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return array[]|\WP_Error|\WP_REST_Response
	 */
	public function create_items( $request ) {
		$preset = Plugin::$instance->documents->create(
			Preset::TYPE,
			[
				'post_title' => $request->get_param( 'name' ),
			],
			[
				Preset::ELEMENT_TYPE_META_KEY => $request->get_param( 'element_type' ),
				Preset::WIDGET_TYPE_META_KEY => $request->get_param( 'widget_type' ),
				Preset::SETTINGS_META_KEY => $request->get_param( 'settings' ),
				Preset::DEFAULT_META_KEY => $request->get_param( 'is_default' ),
			]
		);

		return [
			'data' => [
				'id' => $preset->get_id(),
			],
		];
	}

	public function get_item( $request ) {
		return [
			'data' => [
				'id' => $request->get_param( 'id' ),
				'settings' => [],
			],
		];
	}

	public function get_items( $request ) {
		return [];
	}
}
