/**
 * Elementor App
 */
import router from '@elementor/router';
import { Router, LocationProvider, createHistory } from '@reach/router';
import { createHashSource } from 'reach-router-hash-history';
import { NotificationCenterProvider } from 'elementor-app/store/notification-center';
import NotFound from 'elementor-app/pages/not-found';
import Index from 'elementor-app/pages/index';
import NotificationCenter from 'elementor-app/organismes/notification-center';
import './app.scss';

export default function App() {
	// Use hash route because it's actually rendered on a WP Admin page.
	// Make it public for external uses.
	router.appHistory = createHistory( createHashSource() );

	return (
		<NotificationCenterProvider>
			<LocationProvider history={ router.appHistory }>
					<Router>
						{ router.getRoutes() }
						<Index path="/" />
						<NotFound default />
					</Router>
					<NotificationCenter />
			</LocationProvider>
		</NotificationCenterProvider>
	);
}
