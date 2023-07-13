import React from 'react';

export default function UploadFilePane({ selectedFiles, setSelectedFiles }) {
	return (
		<div>
			<details open={!Boolean(selectedFiles)}>
				<summary>
					<strong>Upload Documents</strong>
				</summary>
				<sub style={{ display: 'block', marginBottom: '1em' }}>
					Each document must be an image or PDF and the total size must be less than 6MB at this time. You can upload
					physical documents with your phone by taking one or more photos.
				</sub>
				<input
					type='file'
					accept='image/jpeg,image/png,application/pdf'
					multiple
					onChange={(e) => setSelectedFiles(Object.values(e.target.files))}
				/>
			</details>
		</div>
	);
}
