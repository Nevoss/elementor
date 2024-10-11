<?php

namespace Elementor\Modules\AtomicWidgets\PropTypes;

use Elementor\Modules\AtomicWidgets\PropTypes\Base\Array_Prop_Type;
use Elementor\Modules\AtomicWidgets\PropTypes\Base\Prop_Type;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Classes_Prop_Type extends Array_Prop_Type {
	public static function get_key(): string {
		return 'classes';
	}

	public function init_prop(): Prop_Type {
		return String_Prop_Type::make()->regex( '/^[a-z][a-z-_0-9]*$/i' );
	}
}
