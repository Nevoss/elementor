<?php
namespace Elementor\Modules\KitsElementsDefaults;

use Elementor\Core\Utils\Collection;
use Elementor\Core\Kits\Documents\Kit;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Data_Provider {
	const META_KEY = '_elementor_elements_defaults_values';

	/**
	 * @var Collection
	 */
	private $data;

	/**
	 * @var Kit
	 */
	private $kit;

	/**
	 * @param Kit $kit
	 *
	 * @return static
	 */
	public static function create( Kit $kit ) {
		return new static( $kit );
	}

	/**
	 * @param Kit $kit - The kit to get the data from.
	 */
	public function __construct( Kit $kit ) {
		$this->kit = $kit;
	}

	/**
	 * @return $this
	 */
	public function refresh() {
		$this->data = new Collection(
			$this->kit->get_json_meta( static::META_KEY )
		);

		return $this;
	}

	/**
	 * @return Collection
	 */
	public function all() {
		if ( ! $this->data ) {
			$this->refresh();
		}

		return $this->data;
	}

	/**
	 * @param $type
	 *
	 * @return array
	 */
	public function get( $type ) {
		return $this->all()->get( $type, [] );
	}

	/**
	 * @param       $type
	 * @param array $settings
	 *
	 * @return array
	 */
	public function store( $type, array $settings ) {
		$data = $this->all();

		$data[ $type ] = $settings;

		return $this->save( $data )->get( $type );
	}

	/**
	 * @param $type
	 *
	 * @return array
	 */
	public function delete( $type ) {
		$data = $this->all();

		unset( $data[ $type ] );

		return $this->save( $data )->get( $type );
	}

	/**
	 * @param Collection $data
	 *
	 * @return $this
	 */
	private function save( Collection $data ) {
		$this->kit->update_meta(
			static::META_KEY,
			wp_json_encode( $data->all() )
		);

		$this->refresh();

		return $this;
	}
}
