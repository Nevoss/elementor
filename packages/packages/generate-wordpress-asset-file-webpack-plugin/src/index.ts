// Inspired by "Dependency Extraction Webpack Plugin" by @wordpress team.
// Link: https://github.com/WordPress/gutenberg/tree/trunk/packages/dependency-extraction-webpack-plugin
import { sources, Compilation, Compiler, Chunk } from 'webpack';

type HandlesMap = {
	exact: Record<string, string>;
	startsWith: Record<string, string>;
}

type Options = {
	handlePrefix: string;
	handlesMap?: Partial<HandlesMap>
	apps?: string[];
	extensions?: string[];
	i18n?: {
		domain: string;
		replaceRequestedFile?: boolean;
	}
}

type NormalizedOptions = {
	handlePrefix: string;
	handlesMap: HandlesMap;
	apps: string[];
	extensions: string[];
	i18n: {
		domain: string | null;
		replaceRequestedFile: boolean;
	}
}

type Module = {
	userRequest?: string;
	modules?: Module[];
}

const baseHandlesMap: HandlesMap = {
	exact: {
		react: 'react',
		'react-dom': 'react-dom',
	},
	startsWith: {
		'@elementor/': 'elementor-packages-',
		'@wordpress/': 'wp-',
	},
};

export class GenerateWordPressAssetFileWebpackPlugin {
	options: NormalizedOptions;

	constructor( options: Options ) {
		this.options = this.normalizeOptions( options );
	}

	apply( compiler: Compiler ) {
		compiler.hooks.thisCompilation.tap( this.constructor.name, ( compilation ) => {
			let handlesAssetsMap: Record<string, string>;

			compilation.hooks.processAssets.tap( { name: this.constructor.name }, () => {
				handlesAssetsMap = [ ...compilation.entrypoints ].reduce<Record<string, string>>( ( map, [ entryName, entrypoint ] ) => {
					const chunk = entrypoint.chunks.find( ( { name } ) => name === entryName );

					if ( ! chunk ) {
						return map;
					}

					const chunkJSFile = this.getFileFromChunk( chunk );

					if ( ! chunkJSFile ) {
						return map;
					}

					const deps = this.getDepsFromChunk( compilation, chunk );

					const assetFilename = this.generateAssetsFileName(
						compilation.getPath( '[file]', { filename: chunkJSFile } )
					);

					const handle = this.generateHandleName( entryName );

					const content = this.createAssetsFileContent( {
						deps,
						entryName,
						i18n: this.options.i18n,
					} );

					// Add source and file into compilation for webpack to output.
					compilation.assets[ assetFilename ] = new sources.RawSource( content );

					chunk.files.add( assetFilename );

					map[ handle ] = assetFilename;

					return map;
				}, {} );
			} );

			compiler.hooks.emit.tap( { name: this.constructor.name }, () => {
				const loaderFileContent = this.getLoaderFileContent( handlesAssetsMap );

				compilation.emitAsset(
					'loader.php',
					new sources.RawSource( loaderFileContent )
				);
			} );
		} );
	}

	getDepsFromChunk( compilation: Compilation, chunk: Chunk ) {
		const depsSet = new Set<string>();

		compilation.chunkGraph.getChunkModules( chunk ).forEach( ( module ) => {
			// There are some issues with types in webpack, so we need to cast it.
			const theModule = module as Module;

			[ ...( theModule.modules || [] ), theModule ].forEach( ( subModule ) => {
				if ( ! subModule.userRequest || ! this.isExternalDep( subModule.userRequest ) ) {
					return;
				}

				depsSet.add( subModule.userRequest );
			} );
		} );

		return depsSet;
	}

	createAssetsFileContent( {
		deps,
		i18n,
		entryName,
	}: {
		deps: Set<string>;
		i18n: NormalizedOptions[ 'i18n' ];
		entryName: string;
	} ) {
		const handleName = this.generateHandleName( entryName );
		const type = this.getEntryType( entryName );

		const depsAsString = [ ...deps ]
			.map( ( dep ) => this.getHandleFromDep( dep ) )
			.filter( ( dep ) => dep !== handleName )
			.sort()
			.map( ( dep ) => `'${ dep }',` )
			.join( '\n\t\t' );

		const i18nContent = i18n.domain ? `[
		'domain' => '${ i18n.domain }',
		'replace_requested_file' => ${ ( i18n.replaceRequestedFile ?? false ).toString() },
	]` : '[]';

		const content =
			`<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * This file is generated by Webpack, do not edit it directly.
 */

return [
	'handle' => '${ handleName }',
	'src' => plugins_url( '/', __FILE__ ) . '${ entryName }{{MIN_SUFFIX}}.js',
	'i18n' => ${ i18nContent },
	'type' => '${ type }',
	'deps' => [
		${ depsAsString }
	],
];
`;

		return content;
	}

	getLoaderFileContent( entriesData: Record<string, string> ) {
		const entriesContent = Object.entries( entriesData ).map( ( [ handle, assetFileName ] ) => {
			return `
	$data['${ handle }'] = require __DIR__ . '/${ assetFileName }';`;
		} );

		return `<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * This file is generated by Webpack, do not edit it directly.
 */

add_filter( 'elementor/editor-v2/packages/config', function( $data ) {
${ entriesContent.join( '\n' ) }

	return $data;
} );
`;
	}

	getEntryType( entryName: string ) {
		if ( this.options.extensions.includes( entryName ) ) {
			return 'extension';
		}

		if ( this.options.apps.includes( entryName ) ) {
			return 'app';
		}

		return 'util';
	}

	getFileFromChunk( chunk: Chunk ) {
		return [ ...chunk.files ].find( ( f ) => /\.js$/i.test( f ) );
	}

	isExternalDep( request: string ) {
		const { startsWith, exact } = this.options.handlesMap;

		return request && (
			Object.keys( exact ).includes( request ) ||
			Object.keys( startsWith ).some( ( dep ) => request.startsWith( dep ) )
		);
	}

	getHandleFromDep( dep: string ) {
		const { startsWith, exact } = this.options.handlesMap;

		if ( Object.keys( exact ).includes( dep ) ) {
			return exact[ dep ];
		}

		for ( const [ key, value ] of Object.entries( startsWith ) ) {
			if ( dep.startsWith( key ) ) {
				return dep.replace( key, value );
			}
		}

		return dep;
	}

	generateHandleName( name: string ) {
		if ( this.options.handlePrefix ) {
			return `${ this.options.handlePrefix }${ name }`;
		}

		return name;
	}

	generateAssetsFileName( filename: string ) {
		return filename.replace( /(\.min)?\.js$/i, '.asset.php' );
	}

	normalizeOptions( options: Options ): NormalizedOptions {
		return {
			...options,
			handlesMap: {
				exact: {
					...baseHandlesMap.exact,
					...( options?.handlesMap?.exact || {} ),
				},
				startsWith: {
					...baseHandlesMap.startsWith,
					...( options?.handlesMap?.startsWith || {} ),
				},
			},
			apps: options?.apps || [],
			extensions: options?.extensions || [],
			i18n: {
				domain: options?.i18n?.domain || null,
				replaceRequestedFile: options?.i18n?.replaceRequestedFile || false,
			},
		};
	}
}
