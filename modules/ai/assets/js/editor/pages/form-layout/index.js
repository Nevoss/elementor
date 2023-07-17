import { useState, useRef, useEffect } from 'react';
import { Box, Stack, CircularProgress } from '@elementor/ui';
import PromptSearch from '../../components/prompt-search';
import GenerateSubmit from '../form-media/components/generate-submit';
import EnhanceButton from '../form-media/components/enhance-button';
import PromptErrorMessage from '../../components/prompt-error-message';
import useLayoutPrompt from './hooks/useLayoutPrompt';
import usePromptEnhancer from '../form-media/hooks/use-image-prompt-enhancer';

const FormLayout = ( { onClose, onResolve } ) => {
	// TODO: replace the function that will call the API to generate the layout inside the useLayoutPrompt hook.
	const { data, isLoading: isGenerating, error, send, sendUsageData } = useLayoutPrompt();

	const [ prompt, setPrompt ] = useState( '' );

	const { isEnhancing, enhance } = usePromptEnhancer();

	const lastRun = useRef( () => {} );

	const isLoading = isGenerating || isEnhancing;

	const handleSubmit = ( event ) => {
		event.preventDefault();

		lastRun.current = () => send( prompt );

		lastRun.current();
	};

	const handleEnhance = () => {
		enhance( prompt ).then( ( { result } ) => setPrompt( result ) );
	};

	const applyPrompt = () => {
		sendUsageData();

		console.log( 'Inserting the generated layout to the editor..' );

		onClose();
	};

	useEffect( () => {
		if ( data?.result ) {
			onResolve( data.result );
		}
	}, [ data ] );

	return (
		<>
			{ error && <PromptErrorMessage error={ error } onRetry={ lastRun.current } sx={ { mb: 6 } } /> }

			<Box component="form" onSubmit={ handleSubmit }>
				<Stack direction="row" alignItems="flex-start" gap={ 3 }>
					<PromptSearch
						name="prompt"
						value={ prompt }
						disabled={ isLoading }
						InputProps={ { autoComplete: 'off' } }
						onChange={ ( event ) => setPrompt( event.target.value ) }
						sx={ {
							'& .MuiOutlinedInput-notchedOutline': { borderRadius: '4px' },
							'& .MuiInputBase-root.MuiOutlinedInput-root, & .MuiInputBase-root.MuiOutlinedInput-root:focus': {
								px: 4,
								py: 0,
							},
						} }
						placeholder={ __( 'Describe the desired layout you want to generate...', 'elementor' ) }
						multiline
						maxRows={ 3 }
					/>

					<EnhanceButton
						size="medium"
						disabled={ isLoading || '' === prompt }
						isLoading={ isEnhancing }
						onClick={ handleEnhance }
					/>

					<GenerateSubmit
						fullWidth={ false }
						disabled={ isLoading }
						sx={ {
							minWidth: '100px',
							borderRadius: '4px',
						} }
					>
						{
							isLoading && ! isEnhancing
								? <CircularProgress color="secondary" size={ 16 } />
								: __( 'Generate', 'elementor' ) }
					</GenerateSubmit>
				</Stack>
			</Box>
		</>
	);
};

FormLayout.propTypes = {
	onClose: PropTypes.func.isRequired,
	onResolve: PropTypes.func.isRequired,
};

export default FormLayout;
