import React, { Suspense } from 'react';
import useFills from '../hooks/use-fills';

type SlotProps = {
	location: string;
}

// TODO: <ErrorBoundary />
export default function Slot( { location }: SlotProps ) {
	const fills = useFills( location );

	return (
		<>
			{ fills.map( ( { component: Component }, index ) => (
				<Suspense fallback={ null } key={ index }>
					<Component />
				</Suspense>
			) ) }
		</>
	);
}
