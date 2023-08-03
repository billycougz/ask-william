import React, { useEffect, useRef } from 'react';
import LoadingCursor from './LoadingCursor';

export default function ConversationPane({ activeConversation, isLoading }) {
	const lastExchangeRef = useRef(null);

	useEffect(() => {
		if (lastExchangeRef.current) {
			lastExchangeRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [activeConversation]);

	return (
		<div style={{ marginBottom: '65px' }}>
			{activeConversation.exchanges.map(({ question, answer }, index) => (
				<div
					key={question + index}
					style={{
						padding: '1em',
						marginTop: index ? '1em' : 0,
						marginBottom: '1em',
						borderRadius: '5px',
						background: index % 2 ? '#f2f2f2' : '#e6e6e6',
					}}
					ref={index === activeConversation.exchanges.length - 1 ? lastExchangeRef : null}
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
		</div>
	);
}
