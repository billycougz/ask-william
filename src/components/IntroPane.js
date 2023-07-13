import React from 'react';

const useCaseList = [
	'Medical documents and prescriptions',
	'Financial prospectuses and reports',
	'Technical manuals and user guides',
	'Terms and conditions',
	'Insurance policies',
	'Legal contracts',
	'Etc.',
];

export default function IntroPane({ selectedFiles }) {
	return (
		<div style={{ marginBottom: '1em' }}>
			<h1 style={{ textAlign: 'center' }}>Ask William</h1>

			<details open={!Boolean(selectedFiles)}>
				<summary>
					<strong>Ask William</strong> is an AI that can summarize and answer questions about verbose documents.
				</summary>
				<ul>
					{useCaseList.map((useCase) => (
						<li key={useCase}>{useCase}</li>
					))}
				</ul>
				<sub>
					<strong>Disclaimer:</strong> The information provided on this platform is for general informational purposes
					only, and William shall not be held liable for any actions, decisions, or outcomes resulting from its use.
				</sub>
			</details>
		</div>
	);
}
