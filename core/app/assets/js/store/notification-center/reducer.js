export const notificationCenterActionTypes = {
	NOTIFY: 'notify',
	DISMISS: 'dismiss',
};

export const notificationCenterBaseState = {
	history: [],
	active: [],
};

export const notificationCenterReducer = ( state, action ) => {
	switch ( actions.type ) {
		case notificationCenterActionTypes.NOTIFY: {
			return {
				...state,
				active: [ action.value, ...state.active ],
			};
		}
		case notificationCenterActionTypes.DISMISS: {
			return {
				history: [
					state.active.find( ( notification ) => notification.id !== action.value ),
					...state.history,
				],
				active: state.active.filter( ( notification ) => notification.id !== action.value ),
			};
		}
		default: {
			throw new Error( `Unhandled action type: ${ action.type }` );
		}
	}
};
