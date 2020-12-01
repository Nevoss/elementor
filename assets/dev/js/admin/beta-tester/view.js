export default class BetaTesterView extends Marionette.ItemView {
	constructor() {
		super();
		this.id = 'elementor-beta-tester-dialog-content';
		this.template = '#tmpl-elementor-beta-tester';
	}

	ui() {
		return {
			betaForm: '#elementor-beta-tester-form',
			betaEmail: '#elementor-beta-tester-form__email',
			betaButton: '#elementor-beta-tester-form__submit',
			betaInputWrapper: '#elementor-beta-tester-form__input-wrapper',
			betaFormMessage: '#elementor-beta-tester-form__form-message',
		};
	}

	events() {
		return {
			'submit @ui.betaForm': 'onBetaFormSubmit',
		};
	}

	onBetaFormSubmit( event ) {
		event.preventDefault();

		const email = this.ui.betaEmail.val();

		this.ui.betaButton.addClass( 'elementor-button-state' );

		elementorCommon.ajax.addRequest( 'beta_tester_signup', {
			data: {
				betaTesterEmail: email,
			},
			success: () => {
				this.ui.betaInputWrapper.addClass( 'hidden' );
				this.ui.betaFormMessage.removeClass( 'hidden' );

				setTimeout( () => {
					elementorBetaTester.layout.hideModal();
				}, 2000 );
			},
			finally: () => {
				elementorBetaTester.layout.hideModal();
			},
		} );
	}

	onRender() {}
}
