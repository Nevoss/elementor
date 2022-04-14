const SCRUB_REGULAR = 'UPDATE-VALUE';
const SCRUB_ENHANCED = 'UPDATE-VALUE-ENHANCED';
const SKIP_SCRUB = 'SKIP-UPDATE-VALUE';

export default class Scrubbing extends Marionette.Behavior {
	checkIntentTimeout = null;

	skipperCount = 0;

	constructor( ...args ) {
		super( ...args );

		const userOptions = this.getOption( 'scrubSettings' ) || {};

		this.scrubSettings = {
			intentTime: 600,
			skipperSteps: 10,
			enhancedNumber: 10,
			scrubbingClass: 'e-scrubbing',
			scrubbingElementClass: 'e-scrubbing-element',
			scrubbingOverClass: 'e-scrubbing-over',
			...userOptions,
		};
	}

	ui() {
		return {
			input: 'input',
			label: 'label',
		};
	}

	events() {
		return {
			'mousedown @ui.input': 'onMouseDownInput',
			'mousedown @ui.label': 'onMouseDownLabel',
			'mouseenter  @ui.label': 'onMouseEnterLabel',
		};
	}

	scrub( input, movementEvent ) {
		// Determine the updating rhythm.
		const movementType = this.getMovementType( movementEvent );

		if ( SKIP_SCRUB === movementType ) {
			return;
		}

		// Actually change the input by scrubbing.
		switch ( movementType ) {
			case SCRUB_REGULAR:
				input.value = +input.value + movementEvent.movementX;
				break;

			case SCRUB_ENHANCED:
				input.value = +input.value + ( movementEvent.movementX * this.scrubSettings.enhancedNumber );
				break;

			default:
				break;
		}

		// Fire an input event so other behaviors/validators can handle the new input
		input.dispatchEvent( new Event( 'input', { bubbles: true } ) );
	}

	getMovementType( movementEvent ) {
		if ( movementEvent.altKey ) {
			this.skipperCount++;

			// When ALT key is pressed, skipping x times before updating input value.
			if ( this.skipperCount <= this.scrubSettings.skipperSteps ) {
				return SKIP_SCRUB;
			}

			this.skipperCount = 0;

			return SCRUB_REGULAR;
		}

		return ( movementEvent.ctrlKey ) ? SCRUB_ENHANCED : SCRUB_REGULAR;
	}

	onMouseDownInput( e ) {
		const input = e.target;

		if ( input.disabled ) {
			return;
		}

		const trackMovement = ( movementEvent ) => {
				this.scrub( input, movementEvent );
		};

		// For input, scrubbing effect works only after X time the mouse is down.
		this.checkIntentTimeout = setTimeout( () => {
			clearTimeout( this.checkIntentTimeout );
			document.addEventListener( 'mousemove', trackMovement );

			document.body.classList.add( this.scrubSettings.scrubbingClass );
			input.classList.add( this.scrubSettings.scrubbingElementClass );
		}, this.scrubSettings.intentTime );

		document.addEventListener( 'mouseup', () => {
				document.removeEventListener( 'mousemove', trackMovement );
				clearTimeout( this.checkIntentTimeout );

				document.body.classList.remove( this.scrubSettings.scrubbingClass );
				input.classList.remove( this.scrubSettings.scrubbingElementClass );
			},
			{ once: true }
		);
	}

	onMouseDownLabel( e ) {
		const label = e.target;
		const input = e.target.control;

		if ( input.disabled ) {
			return;
		}

		document.body.classList.add( this.scrubSettings.scrubbingClass );
		label.classList.add( this.scrubSettings.scrubbingElementClass );
		input.classList.add( this.scrubSettings.scrubbingElementClass );

		const trackMovement = ( movementEvent ) => {
			this.scrub( input, movementEvent );
		};

		document.addEventListener( 'mousemove', trackMovement );

		document.addEventListener( 'mouseup', () => {
				document.removeEventListener( 'mousemove', trackMovement );
				document.body.classList.remove( this.scrubSettings.scrubbingClass );
				label.classList.remove( this.scrubSettings.scrubbingElementClass );
				input.classList.remove( this.scrubSettings.scrubbingElementClass );
			},
			{ once: true }
		);
	}

	onMouseEnterLabel( e ) {
		if ( e.target.control.disabled ) {
			return;
		}

		e.target.classList.add( this.scrubSettings.scrubbingOverClass );
	}
}
