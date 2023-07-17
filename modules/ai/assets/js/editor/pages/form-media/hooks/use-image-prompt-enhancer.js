import { getImagePromptEnhanced } from '../../../api';
import usePrompt from '../../../hooks/use-prompt';

const usePromptEnhancer = () => {
	const { data: enhancedData, isLoading: isEnhancing, send: enhance } = usePrompt( getImagePromptEnhanced );

	return {
		enhance,
		isEnhancing,
		enhancedPrompt: enhancedData?.result,
	};
};

export default usePromptEnhancer;
