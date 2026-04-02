import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ExpoEASApi implements ICredentialType {
	name = 'expoEASApi';
	displayName = 'Expo EAS API';
	documentationUrl = 'https://docs.expo.dev/eas/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Expo Access Token - generate from Expo CLI or dashboard',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.expo.dev',
			description: 'The base URL for the Expo API',
		},
	];
}