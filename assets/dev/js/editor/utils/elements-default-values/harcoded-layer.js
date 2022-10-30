export default {
	id: 'harcode',
	priority: 10,
	resolve: ( model ) => {
		if ( ! model.widgetType ) {
			return {};
		}

		const widgetType = model.widgetType;
	},
};
