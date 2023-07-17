import { Box } from '@elementor/ui';
import Loader from '../../components/loader';

const FormLayout = () => {
	const isLoading = true;

	if ( isLoading ) {
		return <Loader />;
	}

	return (
		<>
			<Box sx={ { mb: 3 } }>
				AI Layout
			</Box>
		</>
	);
};

export default FormLayout;
