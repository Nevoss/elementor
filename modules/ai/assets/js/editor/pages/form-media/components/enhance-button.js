import { CircularProgress, Tooltip, Box, IconButton, withDirection } from '@elementor/ui';
import WandIcon from '../../../icons/wand-icon';

const StyledWandIcon = withDirection( WandIcon );

const EnhanceButton = ( { isLoading, ...props } ) => {
	return (
		<Tooltip title={ __( 'Enhance prompt', 'elementor' ) }>
			<Box component="span" sx={ { cursor: 'pointer' } }>
				<IconButton
					size="small"
					color="secondary"
					{ ...props }
					disabled={ isLoading || props.disabled }
				>
					{ isLoading ? <CircularProgress color="secondary" size={ 20 } sx={ { mr: 2 } } /> : <StyledWandIcon /> }
				</IconButton>
			</Box>
		</Tooltip>
	);
};

EnhanceButton.propTypes = {
	disabled: PropTypes.bool,
	isLoading: PropTypes.bool,
};

export default EnhanceButton;
