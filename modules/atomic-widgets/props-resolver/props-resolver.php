<?php

namespace Elementor\Modules\AtomicWidgets\PropsResolver;

use Elementor\Modules\AtomicWidgets\PropTypes\Base\Array_Prop_Type;
use Elementor\Modules\AtomicWidgets\PropTypes\Base\Object_Prop_Type;
use Elementor\Modules\AtomicWidgets\PropTypes\Contracts\Prop_Type;
use Elementor\Modules\AtomicWidgets\PropTypes\Union_Prop_Type;
use Exception;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Props_Resolver {
	/**
	 * Each transformer can return a value that is also a transformable value,
	 * which means that it can be transformed again by another transformer.
	 * This constant defines the maximum depth of transformations to avoid infinite loops.
	 */
	const TRANSFORM_DEPTH_LIMIT = 3;

	const CONTEXT_SETTINGS = 'settings';
	const CONTEXT_STYLES = 'styles';

	/**
	 * @var array<string, Props_Resolver>
	 */
	private static array $instances = [];

	private Transformers_Registry $transformers;

	private function __construct( Transformers_Registry $transformers ) {
		$this->transformers = $transformers;
	}

	public static function for_styles(): self {
		return self::instance( self::CONTEXT_STYLES );
	}

	public static function for_settings(): self {
		return self::instance( self::CONTEXT_SETTINGS );
	}

	private static function instance( string $context ): self {
		if ( ! isset( self::$instances[ $context ] ) ) {
			$registry = new Transformers_Registry();

			do_action( "elementor/atomic-widgets/$context/transformers/register", $registry );

			self::$instances[ $context ] = new self( $registry );
		}

		return self::$instances[ $context ];
	}

	public static function reset(): void {
		self::$instances = [];
	}

	public function resolve( array $schema, array $props ): array {
		$resolved = [];

		foreach ( $schema as $key => $prop_type ) {
			if ( ! ( $prop_type instanceof Prop_Type ) ) {
				continue;
			}

			$value = array_key_exists( $key, $props ) && null !== $props[ $key ]
				? $props[ $key ]
				: $prop_type->get_default();

			$resolved[ $key ] = $this->transform( $value, $prop_type );
		}

		return $this->assign_values( $resolved );
	}

	private function transform( $value, $key, Prop_Type $prop_type, int $depth = 0 ) {
		if ( ! $value || ! $this->is_transformable( $value ) ) {
			return $value;
		}

		if ( $depth >= self::TRANSFORM_DEPTH_LIMIT ) {
			return null;
		}

		if ( isset( $value['disabled'] ) && true === $value['disabled'] ) {
			return null;
		}

		if ( $prop_type instanceof Union_Prop_Type ) {
			$prop_type = $prop_type->get_prop_type( $value['$$type'] );

			if ( ! $prop_type ) {
				return null;
			}
		}

		if ( $prop_type instanceof Object_Prop_Type ) {
			if ( ! is_array( $value['value'] ) ) {
				return null;
			}

			$value['value'] = $this->resolve(
				$prop_type->get_shape(),
				$value['value']
			);
		}

		if ( $prop_type instanceof Array_Prop_Type ) {
			if ( ! is_array( $value['value'] ) ) {
				return null;
			}

			$value['value'] = array_map(
				fn( $item ) => $this->transform( $item, $prop_type->get_item_type() ),
				$value['value']
			);
		// Transform nested transformable values recursively.
		if ( is_array( $value['value'] ) ) {
			$value['value'] = $this->assign_values( $value['value'] );
		}

		$transformer = $this->transformers->get( $value['$$type'] );

		if ( ! ( $transformer instanceof Transformer_Base ) ) {
			return null;
		}

		try {
			$transformed_value = $transformer->transform( $value['value'], $key );

			return $this->transform( $transformed_value, $key, $prop_type, $depth + 1 );
		} catch ( Exception $e ) {
			return null;
		}
	}

	private function is_transformable( $value ): bool {
		return (
			! empty( $value['$$type'] ) &&
			array_key_exists( 'value', $value )
		);
	}

	private function assign_values( $values ) {
		$assigned = [];

		foreach ( $values as $key => $value ) {
			$transformed_value = $this->transform( $value, $key );

			if ( Multi_Props::is( $transformed_value ) ) {
				$assigned = array_merge( $assigned, Multi_Props::get_value( $transformed_value ) );

				continue;
			}

			$assigned[ $key ] = $transformed_value;
		}

		return $assigned;
	}
}
