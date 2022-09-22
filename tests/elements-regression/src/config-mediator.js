module.exports = class ConfigMediator {
	/**
	 * @type {Object}
	 */
	#elementsConfig;

	/**
	 * @type {Object}
	 */
	#userConfig;

	/**
	 * @param {Object} args
	 * @param {Object} args.elementsConfig
	 * @param {Object} args.userConfig
	 */
	constructor( { elementsConfig, userConfig } ) {
		this.#elementsConfig = elementsConfig;
		this.#userConfig = this.#createUserConfig( userConfig );
	}

	/**
	 * @param {Object} args
	 * @param {Object} args.elementsConfig
	 * @param {Object} args.userConfig
	 */
	static create( { elementsConfig, userConfig } ) {
		return new ConfigMediator( { elementsConfig, userConfig } );
	}

	/**
	 * Get all the widgets that should be tested.
	 *
	 * @return {{widgetType: string, widgetConfig: Object}[]}
	 */
	getWidgetForTests() {
		return Object.entries( this.#elementsConfig ).filter(
			( [ widgetType ] ) =>
				this.#isIncluded( this.#userConfig.elements, widgetType ) &&
				! this.#isExcluded( this.#userConfig.elements, widgetType ),
		).map( ( [ widgetType, widgetConfig ] ) => {
			return { widgetType, widgetConfig };
		} );
	}

	/**
	 * Get all the controls for specific widget type that should be tested.
	 *
	 * @param  widgetType
	 * @return {{controlConfig: Object, sectionConfig: Object, controlId: string, widgetType: string}[]}
	 */
	getControlsForTests( widgetType ) {
		const currentConfig = this.#merge(
			this.#userConfig.controls[ '*' ],
			this.#userConfig.controls[ widgetType ],
		);

		return Object.entries( this.#elementsConfig[ widgetType ].controls || {} )
			.filter( ( [ controlId ] ) => {
				return this.#isIncluded( currentConfig, controlId ) &&
					! this.#isExcluded( currentConfig, controlId );
			} )
			.map( ( [ controlId, controlConfig ] ) => {
				return {
					widgetType,
					controlId,
					controlConfig,
					sectionConfig: this.#elementsConfig[ widgetType ].controls[ controlConfig.section ],
				};
			} );
	}

	getControlDependecies( widgetType, controlId ) {
		const currentConfig = this.#merge(
			this.#userConfig.controls[ '*' ],
			this.#userConfig.controls[ widgetType ],
		);

		const deps = {
			...( currentConfig.dependencies?.[ '*' ] || {} ),
			...( currentConfig.dependencies?.[ controlId ] || {} ),
		};

		return Object.entries( deps || {} )
			.map( ( [ depControlId, value ] ) => {
				const controlConfig = this.#elementsConfig[ widgetType ].controls[ depControlId ];
				const sectionConfig = this.#elementsConfig[ widgetType ].controls[ controlConfig.section ];

				return {
					widgetType,
					controlId: depControlId,
					controlConfig,
					sectionConfig,
					value,
				};
			} );
	}

	#isIncluded( config, type ) {
		if ( ! config.hasOwnProperty( 'include' ) ) {
			return true;
		}

		return config.include.some( ( term ) => this.#compare( term, type ) );
	}

	#isExcluded( config, type ) {
		if ( ! config.hasOwnProperty( 'exclude' ) ) {
			return false;
		}

		return config.exclude.some( ( term ) => this.#compare( term, type ) );
	}

	#merge( source, target ) {
		const result = {};

		[ 'include', 'exclude', 'dependencies' ].forEach( ( key ) => {
			[ source, target ].forEach( ( config ) => {
				if ( ! config || ! config.hasOwnProperty( key ) ) {
					return;
				}

				result[ key ] = Array.isArray( config[ key ] )
					? [ ...( result?.[ key ] || [] ), ...config[ key ] ]
					: { ...( result?.[ key ] || {} ), ...config[ key ] };
			} );
		} );

		return result;
	}

	#compare( term, type ) {
		if ( term instanceof RegExp ) {
			return term.test( type );
		}

		return term === type;
	}

	#createUserConfig( config ) {
		return {
			elements: {
				...( config.elements || {} ),
			},
			controls: {
				'*': {},
				...( config.controls || {} ),
			},
		};
	}
};
