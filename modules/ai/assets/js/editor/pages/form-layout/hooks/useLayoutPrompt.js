import { getCompletionText } from '../../../api';
import usePrompt from '../../../hooks/use-prompt';

// TODO: replace the getCompletionText function.
const getLayoutResult = async ( prompt ) => getCompletionText( prompt );

const useLayoutPrompt = ( initialValue ) => {
	const promptData = usePrompt( getLayoutResult, initialValue );

	return promptData;
};

export default useLayoutPrompt;
