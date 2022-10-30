/**
 * Type definition of layer.
 *
 * @typedef {Object} Layer
 * @property {string}                    id
 * @property {number}                    priority
 * @property {(model: Object) => Object} reslove
 */

export default new class ElementsDefaultValues {
	/**
	 * @type {Layer[]}
	 */
	#layers = [];

	/**
	 * @param {Layer[]} layers
	 */
	constructor( layers = [] ) {
		layers.forEach( ( layer ) => this.registerLayer( layer ) );
	}

	/**
	 * @param {Layer} layer
	 */
	registerLayer( layer ) {
		this.#layers.push( layer );
	}

	/**
	 * @param {Object} model
	 * @param          value
	 * @return {Object}
	 */
	get( model ) {
		const values = this.#layers
			.sort( ( a, b ) => b.priority - a.priority )
			.map( ( layer ) => layer.reslove( model ) );

		return deepMerge( ...values );
	}
};

function isObject( item ) {
	return ( item && 'object' === typeof item && ! Array.isArray( item ) );
}

// https://stackoverflow.com/a/34749873/1331425
function deepMerge( target, ...sources ) {
	if ( ! sources.length ) {
		return target;
	}

	const source = sources.shift();

	if ( isObject( target ) && isObject( source ) ) {
		for ( const key in source ) {
			if ( isObject( source[ key ] ) ) {
				if ( ! target[ key ] ) {
					Object.assign( target, { [ key ]: {} } );
				}

				deepMerge( target[ key ], source[ key ] );
			} else {
				Object.assign( target, { [ key ]: source[ key ] } );
			}
		}
	}

	return deepMerge( target, ...sources );
}
