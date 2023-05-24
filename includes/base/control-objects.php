<?php

namespace Elementor;

use Elementor\Core\Base\Base_Object;
use Elementor\Core\DynamicTags\Manager;
use Elementor\Core\Schemes\Manager as Schemes_Manager;
use Elementor\Core\Breakpoints\Manager as Breakpoints_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Control_Objects {
	public static $instance = null;
	protected $default;
	protected $types;

	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function get_control_objects( array $controls ) {
		$types = [];
		foreach ( $controls as $control ) {
			$control_type = $control['type'];
			if ( ! isset( $this->types[ $control_type ] ) ) {
				$types[] = $control_type;
				$this->types[ $control_type ] = $control_type;
			}
		}
		foreach ( $types as $type ) {
			$default_control = Plugin::$instance->controls_manager->get_control( $type );
			if ( ! $default_control instanceof Base_Data_Control ) {
				continue;
			}
			$this->default[ $type ] = $default_control;
		}

		return $this->default;
	}
}
