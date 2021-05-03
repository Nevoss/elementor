<?php
namespace Elementor\Core\App\Modules\KitLibrary\Data\Kits;

use Elementor\Data\Base\Controller as Controller_Base;
use Elementor\Core\App\Modules\KitLibrary\Data\Repository;
use Elementor\Core\App\Modules\KitLibrary\Data\Exceptions\Wp_Error_Exception;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Controller extends Controller_Base {
	/**
	 * @var Repository
	 */
	private $repository;

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return \WP_Error|array
	 */
	public function get_items( $request ) {
		try {
			$data = $this->repository->get_all(
				get_current_user_id(),
				$request->get_param( 'force' )
			);
		} catch ( Wp_Error_Exception $exception ) {
			return new \WP_Error( $exception->getCode(), $exception->getMessage(), [ 'status' => $exception->getCode() ] );
		} catch ( \Exception $exception ) {
			return new \WP_Error( 'server_error', __( 'Something went wrong.', 'elementor' ), [ 'status' => 500 ] );
		}

		return [
			'data' => $data->all(),
		];
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return \WP_Error|array
	 */
	public function get_item( $request ) {
		try {
			$data = $this->repository->find(
				$request->get_param( 'id' ),
				get_current_user_id()
			);
		} catch ( Wp_Error_Exception $exception ) {
			return new \WP_Error( $exception->getCode(), $exception->getMessage(), [ 'status' => $exception->getCode() ] );
		} catch ( \Exception $exception ) {
			return new \WP_Error( 'server_error', __( 'Something went wrong.', 'elementor' ), [ 'status' => 500 ] );
		}

		return [
			'data' => $data,
		];
	}

	/**
	 * @return string
	 */
	public function get_name() {
		return 'kits';
	}

	/**
	 * Must implement.
	 */
	public function register_endpoints() {
		$this->register_endpoint( Endpoints\Download_Link::class );
		$this->register_endpoint( Endpoints\Favorites::class );
	}

	/**
	 * @return Repository
	 */
	public function get_repository() {
		return $this->repository;
	}

	/**
	 * Register internal endpoint.
	 */
	protected function register_internal_endpoints() {
		// Register as internal to remove the default endpoint generated by the base controller.
		$this->register_endpoint( Endpoints\Index::class );
	}

	/**
	 * Kits_Controller constructor.
	 */
	public function __construct() {
		parent::__construct();

		add_action('rest_api_init', function () {
			$this->repository = new Repository();
		} );
	}
}
