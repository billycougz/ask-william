import React, { useState } from 'react';
import styled from 'styled-components';
import LoadingCursor from './LoadingCursor';

export default function ConversationPane({ exchanges, isLoading }) {
	return (
		<div>
			{exchanges.map(({ question, answer }, index) => (
				<div
					style={{
						padding: '1em',
						margin: '1em 0',
						borderRadius: '5px',
						background: index % 2 ? '#f2f2f2' : '#e6e6e6',
					}}
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
