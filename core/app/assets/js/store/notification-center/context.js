import { notificationCenterReducer, notificationCenterBaseState } from './reducer';

const NotificationCenterStateContext = React.createContext();
const NotificationCenterDispatchContext = React.createContext();

function NotificationCenterProvider( props ) {
	const [ state, dispatch ] = React.useReducer(
		notificationCenterReducer,
		notificationCenterBaseState
	);

	return (
		<NotificationCenterStateContext.Provider value={ state }>
			<NotificationCenterDispatchContext.Provider value={ dispatch }>
				{ props.children }
			</NotificationCenterDispatchContext.Provider>
		</NotificationCenterStateContext.Provider>
	);
}

NotificationCenterProvider.propTypes = {
	children: PropTypes.any,
};

function useNotificationCenterState() {
	const context = React.useContext( NotificationCenterStateContext );

	if ( context === undefined ) {
		throw new Error( '!!' );
	}

	return context;
}

function useNotificationCenterDispatch() {
	const context = React.useContext( NotificationCenterDispatchContext );

	if ( context === undefined ) {
		throw new Error( '!!' );
	}

	return context;
}

export { NotificationCenterProvider, useNotificationCenterState, useNotificationCenterDispatch };
