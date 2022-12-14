<?php
namespace Elementor\Modules\KitElementsDefaults\Utils;

use Elementor\Core\Breakpoints\Manager as Breakpoints_Manager;
use Elementor\Element_Base;
use Elementor\Elements_Manager;
use Elementor\Core\Base\Document;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Settings_Sanitizer {

	const SPECIAL_SETTINGS = [
		'__dynamic__',
		'__globals__',
	];

	/**
	 * @var Elements_Manager
	 */
	private $elements_manager;

	/**
	 * @var array
	 */
	private $widget_types;

	/**
	 * @var Element_Base | null
	 */
	private $pending_element = null;

	/**
	 * @var array | null
	 */
	private $pending_settings = null;

	/**
	 * @param Elements_Manager $elements_manager
	 * @param array $widget_types
	 */
	public function __construct( Elements_Manager $elements_manager, array $widget_types = [] ) {
		$this->elements_manager = $elements_manager;
		$this->widget_types = $widget_types;
	}

	/**
	 * @param $type
	 *
	 * @return $this
	 */
	public function for( $type ) {
		$this->pending_element = $this->create_element( $type );

		return $this;
	}

	/**
	 * @param $settings
	 *
	 * @return $this
	 */
	public function using( $settings ) {
		$this->pending_settings = $settings;

		return $this;
	}

	/**
	 * @return $this
	 */
	public function reset() {
		$this->pending_element = null;
		$this->pending_settings = null;

		return $this;
	}

	/**
	 * @return bool
	 */
	public function is_prepared() {
		return $this->pending_element && is_array( $this->pending_settings );
	}

	/**
	 * @return $this
	 */
	public function remove_invalid_settings() {
		if ( ! $this->is_prepared() ) {
			return $this;
		}

		$controls = $this->pending_element->get_controls();

		if ( ! $controls ) {
			return $this;
		}

		$available_settings = $this->get_avaliable_settings( $controls );

		foreach ( $this->pending_settings as $key => $value ) {
			if ( in_array( $key, static::SPECIAL_SETTINGS, true ) ) {
				// When the key is special settings like __dynamic__ or __globals__ it should run over the values.
				foreach ( $this->pending_settings[ $key ] as $special_setting_key => $special_setting_value ) {
					if ( ! in_array( $special_setting_key, $available_settings, true ) ) {
						unset( $this->pending_settings[ $key ][ $special_setting_key ] );
					}
				}
			} elseif ( ! in_array( $key, $available_settings, true ) ) {
				// For regular settings, it should remove if not in the available settings.
				unset( $this->pending_settings[ $key ] );
			}
		}

		return $this;
	}

	public function kses_deep() {
		if ( ! $this->is_prepared() ) {
			return $this;
		}

		$this->pending_settings = wp_kses_post_deep( $this->pending_settings );

		return $this;
	}

	/**
	 * @param Document $document
	 *
	 * @return $this
	 */
	public function prepare_for_export( Document $document ) {
		return $this->run_import_export_sanitize_process( $document, 'on_export' );
	}

	/**
	 * @param Document $document
	 *
	 * @return $this
	 */
	public function prepare_for_import( Document $document ) {
		return $this->run_import_export_sanitize_process( $document, 'on_import' );
	}

	/**
	 * @return array
	 */
	public function get() {
		if ( ! $this->is_prepared() ) {
			return [];
		}

		$settings = $this->pending_settings;

		$this->reset();

		return $settings;
	}

	/**
	 * @param string $type
	 * @param array $settings
	 *
	 * @return Element_Base|null
	 */
	private function create_element( $type ) {
		$is_widget = in_array( $type, $this->widget_types, true );
		$is_inner_section = 'inner-section' === $type;

		if ( $is_inner_section ) {
			return $this->elements_manager->create_element_instance( [
				'elType' => 'section',
				'isInner' => true,
				'id' => '0',
			] );
		}

		if ( $is_widget ) {
			return $this->elements_manager->create_element_instance( [
				'elType' => 'widget',
				'widgetType' => $type,
				'id' => '0',
			] );
		}

		return $this->elements_manager->create_element_instance( [
			'elType' => $type,
			'id' => '0',
		] );
	}

	/**
	 * @param Document $document
	 * @param          $process_type
	 *
	 * @return $this
	 */
	private function run_import_export_sanitize_process( Document $document, $process_type ) {
		if ( ! $this->is_prepared() ) {
			return $this;
		}

		$result = $document->process_element_import_export(
			$this->pending_element,
			$process_type,
			[ 'settings' => $this->pending_settings ]
		);

		if ( empty( $result['settings'] ) ) {
			return $this;
		}

		$this->pending_settings = $result['settings'];

		return $this;
	}

	/**
	 * Get all the available settings of a specific element, including responsive settings.
	 *
	 * @param array $controls
	 *
	 * @return array
	 */
	private function get_avaliable_settings( array $controls ) {
		$control_keys = array_keys( $controls );

		$optional_responsive_keys = [
			Breakpoints_Manager::BREAKPOINT_KEY_MOBILE,
			Breakpoints_Manager::BREAKPOINT_KEY_MOBILE_EXTRA,
			Breakpoints_Manager::BREAKPOINT_KEY_TABLET,
			Breakpoints_Manager::BREAKPOINT_KEY_TABLET_EXTRA,
			Breakpoints_Manager::BREAKPOINT_KEY_LAPTOP,
			Breakpoints_Manager::BREAKPOINT_KEY_WIDESCREEN,
		];

		$settings = [];

		foreach ( $control_keys as $control_key ) {
			// Add the responsive settings.
			foreach ( $optional_responsive_keys as $responsive_key ) {
				$settings[] = "{$control_key}_{$responsive_key}";
			}
			// Add the setting itself (not responsive).
			$settings[] = $control_key;
		}

		return $settings;
	}
}
