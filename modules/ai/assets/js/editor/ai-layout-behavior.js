import LayoutApp from 'elementor/modules/ai/assets/js/editor/layout-app';
import * as htmlToImage from 'html-to-image';

window.htmlToImage = htmlToImage;

export default class AiLayoutBehavior extends Marionette.Behavior {
	ui() {
		return {
			aiButton: '.e-layout-ai-button',
			wrapper: '.elementor-add-section-inner',
		};
	}

	events() {
		return {
			'click @ui.aiButton': 'onAiButtonClick',
		};
	}

	onAiButtonClick( event ) {
		event.stopPropagation();

		const colorScheme = elementor?.getPreferences?.( 'ui_theme' ) || 'auto';
		const isRTL = elementorCommon.config.isRTL;

		const rootElement = document.createElement( 'div' );
		document.body.append( rootElement );

		window.elementorAiCurrentContext = {};

		const previewContainer = elementor.getPreviewContainer();

		const container = $e.run( 'document/elements/create', {
			container: previewContainer,
			model: {
				elType: 'container',
				settings: {},
			},
			options: { edit: true },
		} );

		ReactDOM.render(
			<LayoutApp
				isRTL={ isRTL }
				colorScheme={ colorScheme }
				onGenerated={ async ( result ) => {
					const targetContainer = elementor.getContainer( container.id );
					const at = previewContainer.children.findIndex( ( child ) => child === targetContainer );

					$e.run( 'document/elements/delete', { container: targetContainer } );

					const response = await new Promise( ( resolve, reject ) => elementorCommon.ajax.addRequest(
						'import_from_json',
						{
							data: { elements: JSON.stringify( result.elements ) },
							success: resolve,
							error: reject,
						},
					) );

					const containerData = await $e.run( 'document/elements/create', {
						container: previewContainer,
						model: {
							id: targetContainer.id,
							elType: 'container',
							settings: {
								content_width: 'full',
							},
							elements: clearResponse( response ),
						},
						options: { edit: true, at },
					} );

					const containerElement = containerData.view.$el[ 0 ];

					// ContainerElement.setAttribute( 'style', 'display: none;' );

					// TODO: find a solution to wait for the container to be rendered.
					await new Promise( ( res ) => {
						setTimeout( () => {
							res();
						}, 2000 );
					} );

					const imageUrl = await htmlToImage.toSvg( containerElement );

					$e.run( 'document/elements/delete', { container: targetContainer } );

					return imageUrl;
				} }
				onResolve={ async ( result ) => {
					const targetContainer = elementor.getContainer( container.id );
					const at = previewContainer.children.findIndex( ( child ) => child === targetContainer );

					$e.run( 'document/elements/delete', { container: targetContainer } );

					const response = await new Promise( ( resolve, reject ) => elementorCommon.ajax.addRequest(
						'import_from_json',
						{
							data: { elements: JSON.stringify( result.elements ) },
							success: resolve,
							error: reject,
						},
					) );

					await $e.run( 'document/elements/create', {
						container: previewContainer,
						model: {
							id: targetContainer.id,
							elType: 'container',
							settings: {
								content_width: 'full',
							},
							elements: clearResponse( response ),
						},
						options: { edit: true, at },
					} );
				} }
				onClose={ () => {
					const targetContainer = elementor.getContainer( container.id );

					if ( ! targetContainer?.children?.length ) {
						$e.run( 'document/elements/delete', { container: targetContainer } );
					}

					ReactDOM.unmountComponentAtNode( rootElement );
					rootElement.remove();
				} }
			/>,
			rootElement,
		);
	}

	onRender() {
		const $button = jQuery( '<button>', {
			class: 'e-layout-ai-button elementor-add-section-area-button',
			css: {
				position: 'absolute',
				insetBlockStart: '10px',
				insetInlineStart: '10px',
				backgroundColor: 'var(--e-a-btn-bg-primary)',
				color: 'var(--e-a-btn-color)',
				zIndex: 1,
			},
		} );

		$button.html( '<i class="eicon-ai"></i>' );

		this.ui.wrapper.append( $button );
	}
}

function clearResponse( elements ) {
	return [ ...elements ]
		.map( ( element ) => {
			const elementsTypes = [ 'widget', 'container', 'section', 'column' ];
			const widgetTypes = Object.keys( elementor.widgetsCache );

			const isValidElement = elementsTypes.includes( element.elType ) && (
				element.elType !== 'widget' ||
				widgetTypes.includes( element.widgetType )
			);

			if ( ! isValidElement ) {
				console.error( 'Invalid element', element );
			}

			return element;
		} )
		.map( ( element ) => {
			element.id = elementorCommon.helpers.getUniqueId();

			delete element.isInner;

			if ( element.elements ) {
				element.elements = clearResponse( [ ...element.elements ] );
			}

			return element;
		} );
}
