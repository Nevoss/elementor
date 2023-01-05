import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { createI18n, I18n, I18nContextProvider } from '@elementor/react-i18n';

type RenderExtraOptions = {
	i18n?: I18n
}

const customRender = (
	ui: ReactElement,
	{ i18n, ...options }: Omit<RenderOptions, 'wrapper'> & RenderExtraOptions = {},
) => {
	const i18nInstance = i18n || createI18n();

	return render( ui, {
		wrapper: ( { children }: { children: ReactElement } ) => (
			<I18nContextProvider i18n={ i18nInstance }>
				{ children }
			</I18nContextProvider>
		),
		...options,
	} );
};

export * from '@testing-library/react';
export { customRender as render };
