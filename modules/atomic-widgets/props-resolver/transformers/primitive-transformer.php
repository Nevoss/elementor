<?php

namespace Elementor\Modules\AtomicWidgets\PropsResolver\Transformers;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Primitive_Transformer implements Transformer {
	public function transform( $value ) {
		return $value;
	}
}
