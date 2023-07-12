import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframe animation for the blinking cursor
const blinkAnimation = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

// Styled component for the blinking cursor
const Cursor = styled.span`
	display: inline-block;
	width: 0.8em;
	height: 1em;
	background-color: #333;
	animation: ${blinkAnimation} 1s infinite;
`;

// React component for the loading indicator
const LoadingIndicator = () => {
	return (
		<div>
			<Cursor />
		</div>
	);
};

export default LoadingIndicator;
