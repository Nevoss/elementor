<?php

namespace Elementor\Modules\AtomicWidgets\PropTypes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

abstract class Object_Prop_Type {
	abstract protected function get_props(): array;
}
