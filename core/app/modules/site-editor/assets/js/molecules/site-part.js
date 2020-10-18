import { Card, Heading } from '@elementor/ui';
// import CardHeader from 'elementor-app/ui/card/card-header';
// import CardBody from 'elementor-app/ui/card/card-body';
// import CardImage from 'elementor-app/ui/card/card-image';
// import Heading from 'elementor-app/ui/atoms/heading';

import './site-part.scss';

export default function SitePart( props ) {
	return (
		<Card className="e-site-part">
			<Card.Header>
				<Heading tag="h1" variant="text-sm" className="eps-card__headline">{ props.title }</Heading>
				{ props.actionButton }
			</Card.Header>
			<Card.Body>
				<Card.Image alt={ props.title } src={ props.thumbnail }>
					{ props.children }
				</Card.Image>
			</Card.Body>
		</Card>
	);
}

SitePart.propTypes = {
	thumbnail: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	children: PropTypes.object,
	showIndicator: PropTypes.bool,
	actionButton: PropTypes.object,
};
