import React from 'react';
import { SvgIcon } from '@elementor/ui';

const DeleteIcon = React.forwardRef( ( props, ref ) => {
	return (
		<SvgIcon viewBox="0 0 24 24" { ...props } ref={ ref }>
			<path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.8125C7.45027 2.8125 7.40258 2.83225 7.36742 2.86742C7.33225 2.90258 7.3125 2.95027 7.3125 3V4.6875H10.6875V3C10.6875 2.95027 10.6677 2.90258 10.6326 2.86742C10.5974 2.83225 10.5497 2.8125 10.5 2.8125H7.5ZM11.8125 4.6875V3C11.8125 2.6519 11.6742 2.31806 11.4281 2.07192C11.1819 1.82578 10.8481 1.6875 10.5 1.6875H7.5C7.1519 1.6875 6.81806 1.82578 6.57192 2.07192C6.32578 2.31806 6.1875 2.6519 6.1875 3V4.6875H3.75658C3.75262 4.68746 3.74865 4.68746 3.74468 4.6875H3C2.68934 4.6875 2.4375 4.93934 2.4375 5.25C2.4375 5.56066 2.68934 5.8125 3 5.8125H3.23243L3.93765 14.2752C3.94423 14.8131 4.16075 15.3276 4.54159 15.7084C4.92839 16.0952 5.45299 16.3125 6 16.3125H12C12.547 16.3125 13.0716 16.0952 13.4584 15.7084C13.8392 15.3276 14.0558 14.8131 14.0623 14.2752L14.7676 5.8125H15C15.3107 5.8125 15.5625 5.56066 15.5625 5.25C15.5625 4.93934 15.3107 4.6875 15 4.6875H14.2553C14.2513 4.68746 14.2474 4.68746 14.2434 4.6875H11.8125ZM4.36132 5.8125L5.06056 14.2033C5.06185 14.2188 5.0625 14.2344 5.0625 14.25C5.0625 14.4986 5.16127 14.7371 5.33709 14.9129C5.5129 15.0887 5.75136 15.1875 6 15.1875H12C12.2486 15.1875 12.4871 15.0887 12.6629 14.9129C12.8387 14.7371 12.9375 14.4986 12.9375 14.25C12.9375 14.2344 12.9381 14.2188 12.9394 14.2033L13.6387 5.8125H4.36132ZM7.5 7.6875C7.81066 7.6875 8.0625 7.93934 8.0625 8.25V12.75C8.0625 13.0607 7.81066 13.3125 7.5 13.3125C7.18934 13.3125 6.9375 13.0607 6.9375 12.75V8.25C6.9375 7.93934 7.18934 7.6875 7.5 7.6875ZM10.5 7.6875C10.8107 7.6875 11.0625 7.93934 11.0625 8.25V12.75C11.0625 13.0607 10.8107 13.3125 10.5 13.3125C10.1893 13.3125 9.9375 13.0607 9.9375 12.75V8.25C9.9375 7.93934 10.1893 7.6875 10.5 7.6875Z" fill="white" />
		</SvgIcon>
	);
} );

export default DeleteIcon();
