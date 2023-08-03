export interface Exchange {
	question: string;
	answer: string;
	createdAt: number;
}

export interface Conversation {
	name: string;
	s3Filenames: string[];
	exchanges: Exchange[];
	createdAt: number;
	lastUpdated: number;
	archived?: boolean;
}

export interface FileUploadMap {
	[localFilename: string]: {
		uploadUrl: string;
		s3Filename: string;
	}
}