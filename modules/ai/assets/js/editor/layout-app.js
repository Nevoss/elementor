import { ThemeProvider, DirectionProvider, DialogTitle, Stack, IconButton, Typography } from '@elementor/ui';
import { AIIcon, XIcon } from '@elementor/icons';
import PromptDialog from './components/prompt-dialog';
import UpgradeChip from './components/upgrade-chip';
import FormLayout from './pages/form-layout';
import StyledChip from './components/ui/styled-chip';

const LayoutApp = ( { isRTL, colorScheme, onClose } ) => {
	return (
		<DirectionProvider rtl={ isRTL }>
			<ThemeProvider colorScheme={ colorScheme }>
				<PromptDialog onClose={ onClose }>
					<DialogTitle sx={ { fontWeight: 'normal' } }>
						<AIIcon fontSize="small" sx={ { mr: 3 } } />

						<Typography component="span" variant="subtitle1" sx={ { fontWeight: 'bold' } }>
							{ __( 'AI LAYOUT GENERATOR', 'elementor' ) }
						</Typography>

						<StyledChip label={ __( 'Beta', 'elementor' ) } color="default" sx={ { ml: 3 } } />

						<Stack direction="row" spacing={ 3 } alignItems="center" sx={ { ml: 'auto' } }>
							<UpgradeChip hasSubscription={ false } usagePercentage={ 0 } />

							<IconButton
								size="small"
								aria-label="close"
								onClick={ onClose }
								sx={ { '&.MuiButtonBase-root': { mr: -4 } } }
							>
								<XIcon />
							</IconButton>
						</Stack>
					</DialogTitle>

					<PromptDialog.Content dividers>
						<FormLayout onClose={ onClose } />
					</PromptDialog.Content>
				</PromptDialog>
			</ThemeProvider>
		</DirectionProvider>
	);
};

LayoutApp.propTypes = {
	colorScheme: PropTypes.oneOf( [ 'auto', 'light', 'dark' ] ),
	isRTL: PropTypes.bool,
	onClose: PropTypes.func,
};

export default LayoutApp;
