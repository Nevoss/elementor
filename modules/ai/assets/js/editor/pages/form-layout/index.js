import { useState, useRef, useEffect } from 'react';
import { Box, Stack, CircularProgress, Typography, Backdrop } from '@elementor/ui';
import PromptSearch from '../../components/prompt-search';
import GenerateSubmit from '../form-media/components/generate-submit';
import EnhanceButton from '../form-media/components/enhance-button';
import PromptErrorMessage from '../../components/prompt-error-message';
import useLayoutPrompt from './hooks/useLayoutPrompt';
import usePromptEnhancer from '../form-media/hooks/use-image-prompt-enhancer';
import * as htmlToImage from 'html-to-image';

const FormLayout = ( { onClose, onResolve, onGenerated } ) => {
	// TODO: replace the function that will call the API to generate the layout inside the useLayoutPrompt hook.
	const { data, isLoading: isGenerating, error, send, sendUsageData } = useLayoutPrompt();

	const [ suggestedImages, setSuggestedImages ] = useState( [] );

	const [ prompt, setPrompt ] = useState( '' );

	const { isEnhancing, enhance } = usePromptEnhancer();

	const [ showBackdrop, setShowBackdrop ] = useState( false );

	const lastRun = useRef( () => {} );

	const isLoading = isGenerating || isEnhancing;

	const handleSubmit = ( event ) => {
		event.preventDefault();

		setShowBackdrop( true );

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

	const capture = () => {
		console.log( 'capturing..' );
		const node = elementor.getContainer( 'c3cf724' ).view.$el[ 0 ];

		htmlToImage.toSvg( node )
			.then( ( dataUrl ) => {
				console.log( 'dataUrl', dataUrl );
				const img = document.createElement( 'img' );

				img.id = 'my-test';
				img.src = dataUrl;

				document.body.appendChild( img );
			} );
	};

	useEffect( () => {
		if ( data?.result ) {
			console.log( `data.result`, data.result );
			onGenerated( data.result ).then( ( url ) => {
				setSuggestedImages( [ url ] );
				setShowBackdrop( false );
			} );
		}
	}, [ data ] );

	return (
		<>
			{ error && <PromptErrorMessage error={ error } onRetry={ lastRun.current } sx={ { mb: 6 } } /> }

			{ showBackdrop && <Backdrop open={ showBackdrop } sx={ { zIndex: -1, backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(35px)' } } /> }

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
						onClick={ capture }
					/>

					<GenerateSubmit
						fullWidth={ false }
						disabled={ isLoading || '' === prompt }
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

			{
				suggestedImages.length > 0 && (
					<Box sx={ { mt: 6 } }>
						<Typography variant="h6" sx={ { mb: 1 } }>{ __( 'Suggested Images:', 'elementor' ) }</Typography>

						<Stack direction="row" alignItems="center" gap={ 3 }>
							{ suggestedImages.map( ( url ) => (
								<img
									key={ url }
									src={ url }
									alt=""
									width={ 400 }
									height={ 150 }
								/>
							) ) }
						</Stack>
					</Box>
				)
			}
		</>
	);
};

FormLayout.propTypes = {
	onClose: PropTypes.func.isRequired,
	onResolve: PropTypes.func.isRequired,
	onGenerated: PropTypes.func.isRequired,
};

export default FormLayout;
