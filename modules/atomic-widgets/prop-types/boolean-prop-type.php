<?php

namespace Elementor\Modules\AtomicWidgets\PropTypes;

use Elementor\Modules\AtomicWidgets\PropTypes\Base\Primitive_Prop_Type;
use Elementor\Modules\AtomicWidgets\PropTypes\Traits\Primitive_Shortcut;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Boolean_Prop_Type extends Primitive_Prop_Type {
	use Primitive_Shortcut;

	public static function get_key(): string {
		return 'boolean';
	}

	protected function validate_value( $value ): bool {
		return ! is_bool( $value );
	}
}
