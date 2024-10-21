<?php

namespace Elementor\Modules\AtomicWidgets\PropTypes\Concerns;

use Elementor\Modules\AtomicWidgets\PropTypes\Contracts\Transformable_Prop_Type;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * @mixin Transformable_Prop_Type
 */
trait Has_Default {
	protected $default = null;

	/**
	 * @param $value
	 *
	 * @return $this
	 */
	public function default( $value ) {
		$this->default = static::generate( $value );

		return $this;
	}

	public function get_default() {
		return $this->default;
	}
}
