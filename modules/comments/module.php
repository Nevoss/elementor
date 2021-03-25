<?php
namespace Elementor\Modules\Comments;

use Elementor\Plugin;
use Elementor\Core\Utils\Collection;
use Elementor\Core\Base\App as BaseApp;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends BaseApp {
	public function get_name() {
		return 'comments';
	}

	protected function get_data() {
		$comments = new Collection( get_comments( [
			'parent' => 0,
			'post'   => get_queried_object_id(),
		] ) );

		$comments = $comments
			->map( function ( $comment ) {
				return $this->transform_data( $comment );
			} )
			->filter( function ( $comment ) {
				return $comment['element_id'];
			} );

		return [
			'comments' => $comments->all(),
			'post_id' => get_queried_object_id(),
		];
	}

	private function transform_data( $comment ) {
		$children = get_comments( [
			'parent' => $comment->comment_ID,
		] );

		if ( ! $children ) {
			$children = [];
		}

		return [
			'id'          => (int) $comment->comment_ID,
			'post'        => (int) $comment->comment_post_ID,
			'parent'      => (int) $comment->comment_parent,
			'user'        => (int) $comment->user_id,
			'author_name' => $comment->comment_author,
			'author_thumbnail' => get_avatar_url($comment->comment_author_email ),
			'date'        => mysql_to_rfc3339( $comment->comment_date ),
			'content'     => [
					'raw' => wp_strip_all_tags( $comment->comment_content ),
			],
			'link'        => get_comment_link( $comment ),
			'element_id'  => get_comment_meta( $comment->comment_ID, '_elementor_element_id', true ),
			'children' => array_map( function ( $child ) {
				return $this->transform_data( $child );
			}, $children ),
			'children_count' => count( $children ),
		];
	}

	public function add_template() {
		Plugin::$instance->common->add_template( __DIR__ . '/template.php' );
	}

	public function __construct() {
		add_action( 'wp_enqueue_scripts', function () {
			wp_enqueue_script(
				'elementor-comments',
				$this->get_js_assets_url( 'elementor-comments' ),
				[
					'jquery',
					'react',
					'react-dom',
				],
				ELEMENTOR_VERSION,
				true
			);

			wp_enqueue_style(
				'elementor-comments',
				ELEMENTOR_URL . 'modules/comments/assets/scss/style.css',
				[],
				ELEMENTOR_VERSION
			);
		} );

		add_action( 'wp_head', function() {
			?>
			<div id="elementor-comments-navigator"></div>
			<?php
		} );

		add_filter( 'elementor/common/config', function ( $config ) {
			return $config + $this->get_data();
		} );

		if ( function_exists( 'register_rest_field' ) ) {
			register_rest_field(
				'comment',
				'element_id',
				[
					'get_callback' => function ( $object ) {
						return get_comment_meta( $object['id'], '_elementor_element_id', true );
					},
					'update_callback' => function( $request_value, $object ) {
						update_comment_meta( $object->comment_ID, '_elementor_element_id', $request_value );
					},
				]
			);

			register_rest_field(
				'comment',
				'resolved',
				[
					'get_callback' => function ( $object ) {
						return (bool) get_comment_meta( $object['id'], '_elementor_resolved', true );
					},
					'update_callback' => function( $request_value, $object ) {
						update_comment_meta( $object->comment_ID, '_elementor_resolved', (bool) $request_value );
					},
				]
			);

			register_rest_field(
				'comment',
				'stripped_content',
				[
					'get_callback' => function ( $object ) {
						return wp_strip_all_tags( $object->comment_content );
					},
				]
			);
		}


			add_action('rest_after_insert_comment', function ( $object ) {
				if ( ! get_comment_meta( $object->comment_ID, '_elementor_element_id', true ) ) {
					return;
				}

				$content = $object->comment_content;
				$matches = [];
				preg_match_all( '/\@[^\s]+/', $content, $matches );

				$mentioned_users = ( new Collection( $matches[0] ) )
					->unique();

				foreach ( $mentioned_users as $mentioned_user ) {
					$username = trim( $mentioned_user, '@' );

					$user = get_user_by( 'login', $username );

					if ( ! $user ) {
						continue;
					}

					wp_mail(
						$user->user_email, // user email
						"{$object->comment_author} mentioned you in an Elementor website.", // title
						'To view the comment and the page visit the following address ' . get_comment_link( $object->comment_ID )
					);
				}
			});

		add_action( 'admin_bar_menu', function ( $wp_admin_bar ) {
			$wp_admin_bar->add_node( [
				'id'     => 'elementor_comments',
				'title'  => __( 'Comments', 'elementor' ),
				'parent' => 'top-secondary',
				'href'   => '#',
			] );
		} );

		$this->add_template();
	}
}
