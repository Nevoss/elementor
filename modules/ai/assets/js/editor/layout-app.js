import { ThemeProvider, DirectionProvider } from '@elementor/ui';

const LayoutApp = ( { isRTL, colorScheme, onClose } ) => {
	return (
		<DirectionProvider rtl={ isRTL }>
			<ThemeProvider colorScheme={ colorScheme }>
				Hi, I am AI!
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
