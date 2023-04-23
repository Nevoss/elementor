import * as React from 'react';
import { SvgIcon, SvgIconProps } from '@elementor/ui';

const AIIcon = React.forwardRef( ( props: SvgIconProps, ref ) => {
	return (
		<SvgIcon viewBox="0 0 24 24" { ...props } ref={ ref }>
			<path fillRule="evenodd" clipRule="evenodd" d="M18.25 3.25C18.6642 3.25 19 3.58579 19 4C19 4.33152 19.1317 4.64946 19.3661 4.88388C19.6005 5.1183 19.9185 5.25 20.25 5.25C20.6642 5.25 21 5.58579 21 6C21 6.41421 20.6642 6.75 20.25 6.75C19.9185 6.75 19.6005 6.8817 19.3661 7.11612C19.1317 7.35054 19 7.66848 19 8C19 8.41421 18.6642 8.75 18.25 8.75C17.8358 8.75 17.5 8.41421 17.5 8C17.5 7.66848 17.3683 7.35054 17.1339 7.11612C16.8995 6.8817 16.5815 6.75 16.25 6.75C15.8358 6.75 15.5 6.41421 15.5 6C15.5 5.58579 15.8358 5.25 16.25 5.25C16.5815 5.25 16.8995 5.1183 17.1339 4.88388C17.3683 4.64946 17.5 4.33152 17.5 4C17.5 3.58579 17.8358 3.25 18.25 3.25ZM18.25 5.88746C18.2318 5.90673 18.2133 5.92576 18.1945 5.94454C18.1758 5.96333 18.1567 5.98182 18.1375 6C18.1567 6.01819 18.1758 6.03667 18.1945 6.05546C18.2133 6.07424 18.2318 6.09327 18.25 6.11254C18.2682 6.09327 18.2867 6.07424 18.3055 6.05546C18.3242 6.03667 18.3433 6.01819 18.3625 6C18.3433 5.98182 18.3242 5.96333 18.3055 5.94454C18.2867 5.92576 18.2682 5.90673 18.25 5.88746ZM9.25 5.25C9.66421 5.25 10 5.58579 10 6C10 7.39239 10.5531 8.72774 11.5377 9.71231C12.5223 10.6969 13.8576 11.25 15.25 11.25C15.6642 11.25 16 11.5858 16 12C16 12.4142 15.6642 12.75 15.25 12.75C13.8576 12.75 12.5223 13.3031 11.5377 14.2877C10.5531 15.2723 10 16.6076 10 18C10 18.4142 9.66421 18.75 9.25 18.75C8.83579 18.75 8.5 18.4142 8.5 18C8.5 16.6076 7.94688 15.2723 6.96231 14.2877C5.97774 13.3031 4.64239 12.75 3.25 12.75C2.83579 12.75 2.5 12.4142 2.5 12C2.5 11.5858 2.83579 11.25 3.25 11.25C4.64239 11.25 5.97774 10.6969 6.96231 9.71231C7.94688 8.72774 8.5 7.39239 8.5 6C8.5 5.58579 8.83579 5.25 9.25 5.25ZM9.25 9.09234C8.93321 9.70704 8.52103 10.2749 8.02297 10.773C7.52491 11.271 6.95704 11.6832 6.34234 12C6.95704 12.3168 7.52491 12.729 8.02297 13.227C8.52103 13.7251 8.93321 14.293 9.25 14.9077C9.56679 14.293 9.97897 13.7251 10.477 13.227C10.9751 12.729 11.543 12.3168 12.1577 12C11.543 11.6832 10.9751 11.271 10.477 10.773C9.97897 10.2749 9.56679 9.70704 9.25 9.09234ZM18.25 15.25C18.6642 15.25 19 15.5858 19 16C19 16.3315 19.1317 16.6495 19.3661 16.8839C19.6005 17.1183 19.9185 17.25 20.25 17.25C20.6642 17.25 21 17.5858 21 18C21 18.4142 20.6642 18.75 20.25 18.75C19.9185 18.75 19.6005 18.8817 19.3661 19.1161C19.1317 19.3505 19 19.6685 19 20C19 20.4142 18.6642 20.75 18.25 20.75C17.8358 20.75 17.5 20.4142 17.5 20C17.5 19.6685 17.3683 19.3505 17.1339 19.1161C16.8995 18.8817 16.5815 18.75 16.25 18.75C15.8358 18.75 15.5 18.4142 15.5 18C15.5 17.5858 15.8358 17.25 16.25 17.25C16.5815 17.25 16.8995 17.1183 17.1339 16.8839C17.3683 16.6495 17.5 16.3315 17.5 16C17.5 15.5858 17.8358 15.25 18.25 15.25ZM18.25 17.8875C18.2318 17.9067 18.2133 17.9258 18.1945 17.9445C18.1758 17.9633 18.1567 17.9818 18.1375 18C18.1567 18.0182 18.1758 18.0367 18.1945 18.0555C18.2133 18.0742 18.2318 18.0933 18.25 18.1125C18.2682 18.0933 18.2867 18.0742 18.3055 18.0555C18.3242 18.0367 18.3433 18.0182 18.3625 18C18.3433 17.9818 18.3242 17.9633 18.3055 17.9445C18.2867 17.9258 18.2682 17.9067 18.25 17.8875Z" />
		</SvgIcon>
	);
} );

export default AIIcon;
