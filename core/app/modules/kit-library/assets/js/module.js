import router from '@elementor/router';
import KitsComponent from './data/component';
import TaxonomiesComponent from './data/taxonomies-component';

export default class KitLibrary {
	constructor() {
		$e.components.register( new KitsComponent() );
		$e.components.register( new TaxonomiesComponent() );

		router.addRoute( {
			path: '/kit-library/*',
			component: React.lazy( () => import( /** webpackChunkName: kit-library */ './app' ) ),
		} );
	}
}
