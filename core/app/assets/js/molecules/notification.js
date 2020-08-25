import Dialog from 'elementor-app/ui/dialog/dialog';

export default function Notification( props ) {
	let NotificationComponent;

	if ( 'dialog' === props.ui ) {
		NotificationComponent = Dialog;
	} else {
		NotificationComponent = Dialog;
	}

	return (
		<NotificationComponent { ...props.componentProps } />
	);
}

Notification.propTypes = {
	ui: PropTypes.string,
	componentProps: PropTypes.object,
};
