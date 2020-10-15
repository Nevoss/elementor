<?php
namespace Elementor\Core\Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Document_Elements {
	/**
	 * The post meta key that holds the array of elements.
	 */
	const META_KEY = '_elementor_data';

	/**
	 * @var array
	 */
	protected $data = [];

	/**
	 * Document_Elements constructor.
	 *
	 * @param array $data
	 */
	public function __construct( array $data ) {
		$this->data = $data;
	}

	/**
	 * Create Document_Elements instance from post id.
	 *
	 * @param $post_id
	 *
	 * @return static
	 */
	public static function get_from_post_id( $post_id ) {
		$meta = get_post_meta( $post_id, static::META_KEY, true );

		if ( is_string( $meta ) && ! empty( $meta ) ) {
			$meta = json_decode( $meta, true );
		}

		if ( empty( $meta ) ) {
			$meta = [];
		}

		return new static( $meta );
	}

	/**
	 * Map recursive data.
	 *
	 * Accept any type of Elementor data and a callback function. The callback
	 * function runs recursively for each element and his child elements.
	 *
	 * @param array    $elements Any type of elementor data.
	 * @param callable $callback A function to iterate data by.
	 * @param array    $args     extra arguments that should be passed the to the callback.
	 *
	 * @return array Iterated data.
	 */
	public function map_recursive( $elements, $callback, $args = [] ) {
		return array_map( function ( $element ) use ($callback, $args) {
			if ( ! empty( $element['elements'] ) ) {
				$element['elements'] = $this->map_recursive( $element['elements'], $callback, $args );
			}

			return call_user_func($callback, $element);
		}, $elements );
	}
}
