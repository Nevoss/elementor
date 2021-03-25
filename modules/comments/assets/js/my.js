const { useEffect, useState, useRef } = React;

let isActive = false;

function Comment( props ) {
	const [ input, setInput ] = useState( '' );
	const [ children, setChildren ] = useState( [] );
	const [ closed, setClosed ] = useState( false );
	const myRef = useRef();

	useEffect( () => {
		setChildren( props.comments.filter( ( current ) => current.parent === props.id ) );
	}, [] );

	useEffect( () => {
		if ( window.cmt_mntn ) {
			jQuery( myRef.current ).cmt_mntn_mentions( window.cmt_mntn.mentions.users );
		}
	}, [] );

	const submit = ( e ) => {
		e.preventDefault();

		fetch( elementorCommon.config.urls.rest + 'wp/v2/comments', {
			method: 'POST',
			body: JSON.stringify( {
				parent: props.id,
				content: input,
				element_id: props.element_id,
				post: elementorCommon.config.post_id,
			} ),
			headers: { 'X-WP-Nonce': wpApiSettings.nonce, 'Content-Type': 'application/json' },
		} ).then( ( response ) => response.json() )
			.then( ( data ) => setChildren( ( prev ) => [ ...prev, data ] ) );
	};

	const date = new Date( props.date );

	const close = ( e ) => {
		e.preventDefault();

		setClosed( true );
	};

	if ( closed ) {
		return '';
	}

	return (
		<div className="comment-modal" id={`comment-modal-${ props.id }`}>
			<div className="comment-modal-modal">
				<div className="comment-wrapper">
					<div className="comment-header">
						<div className="comment-header-left" style={{ display: 'flex', alignItems: 'center' }}>
							<img src={props.author_avatar_urls[ 48 ]} style={{ height: '30px', 	borderRadius: '300px' }}/>
							<div className="comment-header-name-date">
								<span className="comment-author">{props.author_name}</span>
								<div className="comment-date">{ date.toLocaleString() }</div>
							</div>
						</div>
						<div className="comment-header-right">
							<i className="eicon-check"/>
							<i className="eicon-ellipsis-v"/>
						</div>
					</div>
					<div dangerouslySetInnerHTML={{ __html: props.content.rendered }} />
				</div>
				{ children.map( ( item ) => {
					return (
						<div key={item.id} className="comment-wrapper">
							<div className="comment-header">
								<div className="comment-header-left" style={{ display: 'flex', alignItems: 'center' }}>
									<img src={item.author_avatar_urls[ 48 ]} style={{ height: '30px', 	borderRadius: '300px' }}/>
									<div className="comment-header-name-date">
										<span className="comment-author">{item.author_name}</span>
										<div className="comment-date">{ date.toLocaleString() }</div>
									</div>
								</div>
								<div className="comment-header-right">
									<i className="eicon-check"/>
									<i className="eicon-ellipsis-v"/>
								</div>
							</div>
							<div dangerouslySetInnerHTML={{ __html: item.content.rendered }} />
						</div>
					);
				} ) }
				<div className="comment-inputs-container">
					<input className="comment-text-input" placeholder="Write a comment..." value={input} onChange={( e ) => setInput( e.target.value )} ref={myRef} placeholder="Add a comment. Use @ to mention"/>
					<div id="comment-box-right">
						<button className="comment-modal-cancel" onClick={( e ) => close( e )}>Cancel</button>
						<button className="comment-modal-submit" onClick={( e ) => submit( e )}>Comment</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function NewComment( props ) {
	const [ input, setInput ] = useState( '' );
	const [ closed, setClosed ] = useState( false );
	const [ data, setData ] = useState( null );
	const [ toggle, setToggle ] = useState( false );
	const myRef = useRef();

	useEffect( () => {
		if ( window.cmt_mntn ) {
			jQuery( myRef.current ).cmt_mntn_mentions( window.cmt_mntn.mentions.users );
		}
	}, [] );

	const submit = ( e ) => {
		e.preventDefault();

		fetch( elementorCommon.config.urls.rest + 'wp/v2/comments', {
			method: 'POST',
			body: JSON.stringify( {
				content: input,
				element_id: props.elementId,
				post: elementorCommon.config.post_id,
			} ),
			headers: { 'X-WP-Nonce': wpApiSettings.nonce, 'Content-Type': 'application/json' },
		} ).then( ( response ) => response.json() )
			.then( ( data ) => setData( data ) );
	};

	const close = ( e ) => {
		e.preventDefault();

		setClosed( true );
	};

	if ( closed ) {
		return '';
	}

	return (
		! data ? ( <div className="comment-modal">
			<div>
				<input placeholder="Add a comment. Use @ to mention" className="comment-modal-input" style={{ width: '100%' }} value={input} onChange={( e ) => setInput( e.target.value )} ref={myRef}/>
				<div id="comment-box-left">
					<span id="comment-open" onClick={() => setToggle( ( prev ) => ! prev )}>
						{ ! toggle && <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10.5 5.375H9.75V3.875C9.75 1.805 8.07 0.125 6 0.125C3.93 0.125 2.25 1.805 2.25 3.875H3.75C3.75 2.63 4.755 1.625 6 1.625C7.245 1.625 8.25 2.63 8.25 3.875V5.375H1.5C0.675 5.375 0 6.05 0 6.875V14.375C0 15.2 0.675 15.875 1.5 15.875H10.5C11.325 15.875 12 15.2 12 14.375V6.875C12 6.05 11.325 5.375 10.5 5.375ZM1.5 14.375V6.875H10.5V14.375H1.5ZM7.5 10.625C7.5 11.45 6.825 12.125 6 12.125C5.175 12.125 4.5 11.45 4.5 10.625C4.5 9.8 5.175 9.125 6 9.125C6.825 9.125 7.5 9.8 7.5 10.625Z" fill="black" fillOpacity="0.54"/></svg> }
						{ toggle && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><path fill="#000" fillOpacity=".54" fillRule="evenodd" d="M12.75 6.375h.75c.825 0 1.5.675 1.5 1.5v7.5c0 .825-.675 1.5-1.5 1.5h-9c-.825 0-1.5-.675-1.5-1.5v-7.5c0-.825.675-1.5 1.5-1.5h.75v-1.5c0-2.07 1.68-3.75 3.75-3.75 2.07 0 3.75 1.68 3.75 3.75v1.5zM9 2.625a2.247 2.247 0 00-2.25 2.25v1.5h4.5v-1.5A2.247 2.247 0 009 2.625zm-4.5 12.75v-7.5h9v7.5h-9zm6-3.75c0 .825-.675 1.5-1.5 1.5s-1.5-.675-1.5-1.5.675-1.5 1.5-1.5 1.5.675 1.5 1.5z" clipRule="evenodd"/></svg> }
						{ ! toggle ? 'Public' : 'Private' }
					</span>
				</div>
				<div id="comment-box-right">
					<button className="comment-modal-cancel" onClick={( e ) => close( e )}>Cancel</button>
					<button className="comment-modal-submit" onClick={( e ) => submit( e )}>Submit</button>
				</div>
			</div>
		</div> ) : <Comment { ...data } comments={[]} />
	);
}

jQuery( () => {
	const element = document.createElement( 'div' ),
		bodyElement = document.querySelector( 'body' );

	element.setAttribute( 'id', 'e-comments' );

	document.body.appendChild( element );

	elementorCommon.elements.$window.on( 'elementor/frontend/modal/init', () => {
		document.querySelector( '#e-comments__add-comment' ).addEventListener( 'click', () => {
			isActive = ! isActive;

			bodyElement.classList.add( 'e-comments-pin-cursor' );
		} );
	} );

	fetch( elementorCommon.config.urls.rest + 'wp/v2/comments?post=' + elementorCommon.config.post_id )
		.then( ( response ) => response.json() )
		.then( ( data ) => {
			data.forEach( ( comment ) => {
				const iconWrapper = document.createElement( 'div' );
				const icon = document.createElement( 'div' );

				icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="38" fill="none"><g filter="url(#filter0_f)"><ellipse cx="14" cy="33" fill="#000" fill-opacity=".12" rx="6" ry="3"/></g><mask id="a" width="25" height="33" x="1" y="1.375" fill="#000" maskUnits="userSpaceOnUse"><path fill="#fff" d="M1 1.375h25v33H1z"/><path fill-rule="evenodd" d="M19.905 23.825c2.787-2.161 4.595-5.645 4.595-9.575 0-6.558-5.037-11.875-11.25-11.875S2 7.692 2 14.25c0 3.93 1.808 7.414 4.595 9.575 2.124 1.69 5.12 4.358 5.794 8.658.067.43.426.763.861.763s.794-.333.861-.763c.673-4.3 3.67-6.968 5.794-8.658z" clip-rule="evenodd"/></mask><path fill="#4AB7F4" fill-rule="evenodd" d="M19.905 23.825c2.787-2.161 4.595-5.645 4.595-9.575 0-6.558-5.037-11.875-11.25-11.875S2 7.692 2 14.25c0 3.93 1.808 7.414 4.595 9.575 2.124 1.69 5.12 4.358 5.794 8.658.067.43.426.763.861.763s.794-.333.861-.763c.673-4.3 3.67-6.968 5.794-8.658z" clip-rule="evenodd"/><path fill="url(#paint0_linear)" d="M19.905 23.825l-.613-.79-.009.007.622.783zm-13.31 0l.622-.783-.01-.007-.612.79zm5.794 8.658l-.988.155.988-.155zm1.722 0l.988.155-.988-.155zm6.407-7.868c3.03-2.35 4.982-6.126 4.982-10.365h-2c0 3.62-1.665 6.813-4.207 8.785l1.225 1.58zM25.5 14.25c0-7.059-5.434-12.875-12.25-12.875v2c5.61 0 10.25 4.817 10.25 10.875h2zM13.25 1.375C6.434 1.375 1 7.191 1 14.25h2C3 8.192 7.64 3.375 13.25 3.375v-2zM1 14.25c0 4.24 1.952 8.015 4.982 10.365l1.226-1.58C4.665 21.062 3 17.87 3 14.25H1zm12.377 18.078c-.737-4.703-4.013-7.578-6.16-9.286l-1.245 1.566c2.102 1.671 4.819 4.133 5.429 8.03l1.976-.31zm-.127-.082c.046 0 .081.02.1.036a.08.08 0 01.027.046l-1.976.31c.137.873.88 1.608 1.849 1.608v-2zm-.127.082a.08.08 0 01.027-.046.154.154 0 01.1-.036v2c.97 0 1.712-.735 1.85-1.608l-1.977-.31zm6.16-9.286c-2.147 1.708-5.423 4.583-6.16 9.286l1.976.31c.61-3.897 3.327-6.359 5.429-8.03l-1.245-1.566z" mask="url(#a)"/><defs><linearGradient id="paint0_linear" x1="13.25" x2="13.25" y1="2.375" y2="33.246" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient><filter id="filter0_f" width="16" height="10" x="6" y="28" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1"/></filter></defs></svg>';

				iconWrapper.classList.add( 'comment-icon-wrapper' );
				icon.classList.add( 'comment-icon' );

				iconWrapper.appendChild( icon );

				const innerElement = document.querySelector( `.elementor-element-${ comment.element_id }` );

				if ( ! innerElement ) {
					return;
				}

				let isOpen = false;

				icon.addEventListener( 'click', ( e ) => {
					if ( ! isOpen ) {
						const modal = document.createElement( 'div' );
						iconWrapper.appendChild( modal );

						ReactDOM.render(
							<Comment { ...comment } comments={data} />,
							modal
						);
					} else {
						document.querySelector( `#comment-modal-${ comment.id }` ).remove();
					}

					isOpen = ! isOpen;
				} );

				innerElement.appendChild( iconWrapper );
			} );
		} );

	document.addEventListener( 'click', ( e ) => {
		if ( ! isActive ) {
			return;
		}

		const myElement = e.srcElement.closest( '.elementor-widget' );

		if ( ! myElement ) {
			return;
		}

		const iconWrapper = document.createElement( 'div' );
		const icon = document.createElement( 'div' );
		const modal = document.createElement( 'div' );
		iconWrapper.appendChild( modal );

		iconWrapper.classList.add( 'comment-icon-wrapper' );
		icon.classList.add( 'comment-icon' );

		icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="38" fill="none"><g filter="url(#filter0_f)"><ellipse cx="14" cy="33" fill="#000" fill-opacity=".12" rx="6" ry="3"/></g><mask id="a" width="25" height="33" x="1" y="1.375" fill="#000" maskUnits="userSpaceOnUse"><path fill="#fff" d="M1 1.375h25v33H1z"/><path fill-rule="evenodd" d="M19.905 23.825c2.787-2.161 4.595-5.645 4.595-9.575 0-6.558-5.037-11.875-11.25-11.875S2 7.692 2 14.25c0 3.93 1.808 7.414 4.595 9.575 2.124 1.69 5.12 4.358 5.794 8.658.067.43.426.763.861.763s.794-.333.861-.763c.673-4.3 3.67-6.968 5.794-8.658z" clip-rule="evenodd"/></mask><path fill="#4AB7F4" fill-rule="evenodd" d="M19.905 23.825c2.787-2.161 4.595-5.645 4.595-9.575 0-6.558-5.037-11.875-11.25-11.875S2 7.692 2 14.25c0 3.93 1.808 7.414 4.595 9.575 2.124 1.69 5.12 4.358 5.794 8.658.067.43.426.763.861.763s.794-.333.861-.763c.673-4.3 3.67-6.968 5.794-8.658z" clip-rule="evenodd"/><path fill="url(#paint0_linear)" d="M19.905 23.825l-.613-.79-.009.007.622.783zm-13.31 0l.622-.783-.01-.007-.612.79zm5.794 8.658l-.988.155.988-.155zm1.722 0l.988.155-.988-.155zm6.407-7.868c3.03-2.35 4.982-6.126 4.982-10.365h-2c0 3.62-1.665 6.813-4.207 8.785l1.225 1.58zM25.5 14.25c0-7.059-5.434-12.875-12.25-12.875v2c5.61 0 10.25 4.817 10.25 10.875h2zM13.25 1.375C6.434 1.375 1 7.191 1 14.25h2C3 8.192 7.64 3.375 13.25 3.375v-2zM1 14.25c0 4.24 1.952 8.015 4.982 10.365l1.226-1.58C4.665 21.062 3 17.87 3 14.25H1zm12.377 18.078c-.737-4.703-4.013-7.578-6.16-9.286l-1.245 1.566c2.102 1.671 4.819 4.133 5.429 8.03l1.976-.31zm-.127-.082c.046 0 .081.02.1.036a.08.08 0 01.027.046l-1.976.31c.137.873.88 1.608 1.849 1.608v-2zm-.127.082a.08.08 0 01.027-.046.154.154 0 01.1-.036v2c.97 0 1.712-.735 1.85-1.608l-1.977-.31zm6.16-9.286c-2.147 1.708-5.423 4.583-6.16 9.286l1.976.31c.61-3.897 3.327-6.359 5.429-8.03l-1.245-1.566z" mask="url(#a)"/><defs><linearGradient id="paint0_linear" x1="13.25" x2="13.25" y1="2.375" y2="33.246" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient><filter id="filter0_f" width="16" height="10" x="6" y="28" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1"/></filter></defs></svg>';

		iconWrapper.appendChild( icon );

		myElement.appendChild( iconWrapper );

		ReactDOM.render(
			<NewComment elementId={myElement.getAttribute( 'data-id' )} />,
			modal
		);

		bodyElement.classList.remove( 'e-comments-pin-cursor' );

		isActive = false;
	} );
} );
