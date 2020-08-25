import { notificationCenterActionTypes } from './reducer';

export const notifyErrorDialog = ( notification ) => {
	const
		id = elementorCommon.helpers.getUniqueId(),
		notifyErrorDialogDefaults = {
			title: null,
			content: null,
			onClose: null,
			dismissButtonText: __( 'Back', 'elementor' ),
			dismissButtonOnClick: null,
			dismissButtonUrl: null,
			dismissButtonTarget: null,
			approveButtonText: __( 'Learn More', 'elementor' ),
			approveButtonOnClick: null,
			approveButtonUrl: null,
			approveButtonColor: 'link',
			approveButtonTarget: '_blank',
		};

	return {
		type: notificationCenterActionTypes.NOTIFY,
		value: {
			id,
			type: 'error',
			ui: 'dialog',
			props: {
				...notifyErrorDialogDefaults,
				...notification,
			},
		},
	};
};

export const dismiss = ( id ) => {
	return {
		type: notificationCenterActionTypes.DISMISS,
		value: id,
	};
};
