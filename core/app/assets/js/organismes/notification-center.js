import { useNotificationCenterState } from '../store/notification-center';
import Notification from '../molecules/notification';

export default function NotificationCenter() {
	const { active } = useNotificationCenterState();

	return active.map( ( notification ) => {
		return <Notification
			key={ notification.id }
			ui={ notification.ui }
			componentProps={ notification.props }
		/>;
	} );
}
