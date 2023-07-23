import React, { useEffect, useRef } from 'react';
import LoadingCursor from './LoadingCursor';

export default function ConversationPane({ exchanges, isLoading }) {
	const myRef = useRef(null);

	useEffect(() => {
		myRef.current.scrollIntoView({ behavior: 'smooth' });
	}, [exchanges]);

	return (
		<>
			{exchanges.map(({ question, answer }, index) => (
				<div
					key={question + index}
					style={{
						padding: '1em',
						marginTop: index ? '1em' : 0,
						marginBottom: index === exchanges.length - 1 ? '65px' : '1em',
						borderRadius: '5px',
						background: index % 2 ? '#f2f2f2' : '#e6e6e6',
					}}
					ref={index === exchanges.length - 1 ? myRef : null}
				>
					<div>
						<h2 style={{ marginTop: '0' }}>You</h2>
						{question || 'You requested a general summary.'}
					</div>
					<div>
						<h2>William</h2>
						{answer}
					</div>
				</div>
			))}
			{isLoading && <LoadingCursor />}
		</>
	);
}
