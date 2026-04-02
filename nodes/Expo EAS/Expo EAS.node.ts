/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-expoeas/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class ExpoEAS implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Expo EAS',
    name: 'expoeas',
    icon: 'file:expoeas.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Expo EAS API',
    defaults: {
      name: 'Expo EAS',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'expoeasApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Build',
            value: 'build',
          },
          {
            name: 'Update',
            value: 'update',
          },
          {
            name: 'Submission',
            value: 'submission',
          },
          {
            name: 'Project',
            value: 'project',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          }
        ],
        default: 'build',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['build'] } },
  options: [
    { name: 'Create Build', value: 'createBuild', description: 'Create a new build', action: 'Create a build' },
    { name: 'List Builds', value: 'listBuilds', description: 'Get all builds for a project', action: 'List builds' },
    { name: 'Get Build', value: 'getBuild', description: 'Get details of a specific build', action: 'Get a build' },
    { name: 'Cancel Build', value: 'cancelBuild', description: 'Cancel a running build', action: 'Cancel a build' },
    { name: 'Retry Build', value: 'retryBuild', description: 'Retry a failed build', action: 'Retry a build' }
  ],
  default: 'createBuild',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['update'] } },
	options: [
		{
			name: 'Publish Update',
			value: 'publishUpdate',
			description: 'Publish a new OTA update',
			action: 'Publish a new OTA update'
		},
		{
			name: 'List Updates',
			value: 'listUpdates',
			description: 'Get all updates for a project',
			action: 'List all updates for a project'
		},
		{
			name: 'Get Update',
			value: 'getUpdate',
			description: 'Get details of a specific update',
			action: 'Get details of a specific update'
		},
		{
			name: 'Delete Update',
			value: 'deleteUpdate',
			description: 'Delete an OTA update',
			action: 'Delete an OTA update'
		},
		{
			name: 'Republish Update',
			value: 'republishUpdate',
			description: 'Republish an existing update',
			action: 'Republish an existing update'
		}
	],
	default: 'publishUpdate',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['submission'] } },
  options: [
    { name: 'Create Submission', value: 'createSubmission', description: 'Create a new app store submission', action: 'Create submission' },
    { name: 'List Submissions', value: 'listSubmissions', description: 'Get all submissions for a project', action: 'List submissions' },
    { name: 'Get Submission', value: 'getSubmission', description: 'Get details of a specific submission', action: 'Get submission' },
    { name: 'Cancel Submission', value: 'cancelSubmission', description: 'Cancel a pending submission', action: 'Cancel submission' },
    { name: 'Retry Submission', value: 'retrySubmission', description: 'Retry a failed submission', action: 'Retry submission' },
  ],
  default: 'createSubmission',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['project'] } },
  options: [
    { name: 'Create Project', value: 'createProject', description: 'Create a new project', action: 'Create a project' },
    { name: 'Delete Project', value: 'deleteProject', description: 'Delete a project', action: 'Delete a project' },
    { name: 'Get Project', value: 'getProject', description: 'Get details of a specific project', action: 'Get a project' },
    { name: 'List Projects', value: 'listProjects', description: 'Get all projects for the authenticated user', action: 'List all projects' },
    { name: 'Update Project', value: 'updateProject', description: 'Update project settings', action: 'Update a project' },
  ],
  default: 'listProjects',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
		},
	},
	options: [
		{
			name: 'Create Webhook',
			value: 'createWebhook',
			description: 'Create a new webhook',
			action: 'Create webhook',
		},
		{
			name: 'List Webhooks',
			value: 'listWebhooks',
			description: 'Get all webhooks for a project',
			action: 'List webhooks',
		},
		{
			name: 'Get Webhook',
			value: 'getWebhook',
			description: 'Get details of a specific webhook',
			action: 'Get webhook',
		},
		{
			name: 'Update Webhook',
			value: 'updateWebhook',
			description: 'Update webhook configuration',
			action: 'Update webhook',
		},
		{
			name: 'Delete Webhook',
			value: 'deleteWebhook',
			description: 'Delete a webhook',
			action: 'Delete webhook',
		},
	],
	default: 'createWebhook',
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['build'], operation: ['createBuild', 'listBuilds'] } },
  default: '',
  description: 'The ID of the project',
},
{
  displayName: 'Platform',
  name: 'platform',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['build'], operation: ['createBuild'] } },
  options: [
    { name: 'Android', value: 'android' },
    { name: 'iOS', value: 'ios' },
    { name: 'All', value: 'all' }
  ],
  default: 'all',
  description: 'The platform to build for',
},
{
  displayName: 'Build Profile',
  name: 'buildProfile',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['build'], operation: ['createBuild'] } },
  default: 'production',
  description: 'The build profile to use',
},
{
  displayName: 'Git Commit Hash',
  name: 'gitCommitHash',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['build'], operation: ['createBuild'] } },
  default: '',
  description: 'The git commit hash to build from',
},
{
  displayName: 'Platform',
  name: 'platform',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['build'], operation: ['listBuilds'] } },
  options: [
    { name: 'Android', value: 'android' },
    { name: 'iOS', value: 'ios' },
    { name: 'All', value: 'all' }
  ],
  default: 'all',
  description: 'Filter builds by platform',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['build'], operation: ['listBuilds'] } },
  options: [
    { name: 'Pending', value: 'pending' },
    { name: 'In Progress', value: 'in-progress' },
    { name: 'Finished', value: 'finished' },
    { name: 'Canceled', value: 'canceled' },
    { name: 'Failed', value: 'failed' }
  ],
  default: '',
  description: 'Filter builds by status',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['build'], operation: ['listBuilds'] } },
  default: 20,
  description: 'Maximum number of builds to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['build'], operation: ['listBuilds'] } },
  default: 0,
  description: 'Number of builds to skip',
},
{
  displayName: 'Build ID',
  name: 'buildId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['build'], operation: ['getBuild', 'cancelBuild', 'retryBuild'] } },
  default: '',
  description: 'The ID of the build',
},
{
	displayName: 'Project ID',
	name: 'projectId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['update'],
			operation: ['publishUpdate', 'listUpdates', 'republishUpdate']
		}
	},
	default: '',
	description: 'The ID of the project'
},
{
	displayName: 'Runtime Version',
	name: 'runtimeVersion',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['update'],
			operation: ['publishUpdate']
		}
	},
	default: '',
	description: 'The runtime version for the update'
},
{
	displayName: 'Platform',
	name: 'platform',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['update'],
			operation: ['publishUpdate', 'republishUpdate']
		}
	},
	options: [
		{
			name: 'iOS',
			value: 'ios'
		},
		{
			name: 'Android',
			value: 'android'
		},
		{
			name: 'All',
			value: 'all'
		}
	],
	default: 'all',
	description: 'The platform for the update'
},
{
	displayName: 'Message',
	name: 'message',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['update'],
			operation: ['publishUpdate']
		}
	},
	default: '',
	description: 'Description message for the update'
},
{
	displayName: 'Platform',
	name: 'platform',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['update'],
			operation: ['listUpdates']
		}
	},
	options: [
		{
			name: 'iOS',
			value: 'ios'
		},
		{
			name: 'Android',
			value: 'android'
		},
		{
			name: 'All',
			value: 'all'
		}
	],
	default: 'all',
	description: 'Filter updates by platform'
},
{
	displayName: 'Branch Name',
	name: 'branchName',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['update'],
			operation: ['listUpdates']
		}
	},
	default: '',
	description: 'Filter updates by branch name'
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['update'],
			operation: ['listUpdates']
		}
	},
	default: 20,
	description: 'Maximum number of updates to return'
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['update'],
			operation: ['listUpdates']
		}
	},
	default: 0,
	description: 'Number of updates to skip'
},
{
	displayName: 'Update ID',
	name: 'updateId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['update'],
			operation: ['getUpdate', 'deleteUpdate', 'republishUpdate']
		}
	},
	default: '',
	description: 'The ID of the update'
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['submission'], operation: ['createSubmission', 'listSubmissions'] } },
  default: '',
  description: 'The ID of the Expo project',
},
{
  displayName: 'Platform',
  name: 'platform',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['submission'], operation: ['createSubmission'] } },
  options: [
    { name: 'iOS', value: 'ios' },
    { name: 'Android', value: 'android' },
  ],
  default: 'ios',
  description: 'The platform to submit to',
},
{
  displayName: 'Build ID',
  name: 'buildId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['submission'], operation: ['createSubmission'] } },
  default: '',
  description: 'The ID of the build to submit',
},
{
  displayName: 'Submission Config',
  name: 'submissionConfig',
  type: 'json',
  required: false,
  displayOptions: { show: { resource: ['submission'], operation: ['createSubmission'] } },
  default: '{}',
  description: 'Configuration object for the submission',
},
{
  displayName: 'Platform',
  name: 'platform',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['submission'], operation: ['listSubmissions'] } },
  options: [
    { name: 'iOS', value: 'ios' },
    { name: 'Android', value: 'android' },
    { name: 'All', value: '' },
  ],
  default: '',
  description: 'Filter submissions by platform',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['submission'], operation: ['listSubmissions'] } },
  options: [
    { name: 'Pending', value: 'pending' },
    { name: 'In Progress', value: 'in-progress' },
    { name: 'Finished', value: 'finished' },
    { name: 'Errored', value: 'errored' },
    { name: 'All', value: '' },
  ],
  default: '',
  description: 'Filter submissions by status',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['submission'], operation: ['listSubmissions'] } },
  default: 50,
  description: 'Maximum number of submissions to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['submission'], operation: ['listSubmissions'] } },
  default: 0,
  description: 'Number of submissions to skip',
},
{
  displayName: 'Submission ID',
  name: 'submissionId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['submission'], operation: ['getSubmission', 'cancelSubmission', 'retrySubmission'] } },
  default: '',
  description: 'The ID of the submission',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 50,
  description: 'Maximum number of projects to return',
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['listProjects'],
    },
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of projects to skip',
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['listProjects'],
    },
  },
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the project',
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['getProject', 'updateProject', 'deleteProject'],
    },
  },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  default: '',
  description: 'The name of the project',
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['createProject', 'updateProject'],
    },
  },
},
{
  displayName: 'Slug',
  name: 'slug',
  type: 'string',
  required: true,
  default: '',
  description: 'The slug identifier for the project',
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['createProject'],
    },
  },
},
{
  displayName: 'Privacy',
  name: 'privacy',
  type: 'options',
  options: [
    { name: 'Public', value: 'public' },
    { name: 'Private', value: 'private' },
  ],
  default: 'private',
  description: 'The privacy setting of the project',
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['createProject', 'updateProject'],
    },
  },
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  default: '',
  description: 'The description of the project',
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['updateProject'],
    },
  },
},
{
	displayName: 'Project ID',
	name: 'projectId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook', 'listWebhooks'],
		},
	},
	default: '',
	description: 'The ID of the project',
},
{
	displayName: 'Webhook ID',
	name: 'webhookId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['getWebhook', 'updateWebhook', 'deleteWebhook'],
		},
	},
	default: '',
	description: 'The ID of the webhook',
},
{
	displayName: 'URL',
	name: 'url',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook'],
		},
	},
	default: '',
	description: 'The URL to send webhook notifications to',
},
{
	displayName: 'URL',
	name: 'url',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['updateWebhook'],
		},
	},
	default: '',
	description: 'The URL to send webhook notifications to',
},
{
	displayName: 'Secret',
	name: 'secret',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook', 'updateWebhook'],
		},
	},
	default: '',
	description: 'Secret key for webhook signature verification',
},
{
	displayName: 'Event',
	name: 'event',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook'],
		},
	},
	options: [
		{
			name: 'Build',
			value: 'build',
		},
		{
			name: 'Submit',
			value: 'submit',
		},
		{
			name: 'Update',
			value: 'update',
		},
	],
	default: 'build',
	description: 'The type of event to subscribe to',
},
{
	displayName: 'Event',
	name: 'event',
	type: 'options',
	required: false,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['updateWebhook'],
		},
	},
	options: [
		{
			name: 'Build',
			value: 'build',
		},
		{
			name: 'Submit',
			value: 'submit',
		},
		{
			name: 'Update',
			value: 'update',
		},
	],
	default: 'build',
	description: 'The type of event to subscribe to',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'build':
        return [await executeBuildOperations.call(this, items)];
      case 'update':
        return [await executeUpdateOperations.call(this, items)];
      case 'submission':
        return [await executeSubmissionOperations.call(this, items)];
      case 'project':
        return [await executeProjectOperations.call(this, items)];
      case 'webhook':
        return [await executeWebhookOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeBuildOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('expoeasApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createBuild': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const platform = this.getNodeParameter('platform', i) as string;
          const buildProfile = this.getNodeParameter('buildProfile', i) as string;
          const gitCommitHash = this.getNodeParameter('gitCommitHash', i) as string;

          const body: any = {
            platform,
            buildProfile,
          };

          if (gitCommitHash) {
            body.gitCommitHash = gitCommitHash;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/projects/${projectId}/builds`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listBuilds': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const platform = this.getNodeParameter('platform', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          let queryParams = `?limit=${limit}&offset=${offset}`;
          if (platform && platform !== 'all') {
            queryParams += `&platform=${platform}`;
          }
          if (status) {
            queryParams += `&status=${status}`;
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/projects/${projectId}/builds${queryParams}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBuild': {
          const buildId = this.getNodeParameter('buildId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/builds/${buildId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelBuild': {
          const buildId = this.getNodeParameter('buildId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/builds/${buildId}/cancel`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'retryBuild': {
          const buildId = this.getNodeParameter('buildId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/builds/${buildId}/retry`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeUpdateOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('expoeasApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'publishUpdate': {
					const projectId = this.getNodeParameter('projectId', i) as string;
					const runtimeVersion = this.getNodeParameter('runtimeVersion', i) as string;
					const platform = this.getNodeParameter('platform', i) as string;
					const message = this.getNodeParameter('message', i) as string;

					const body: any = {
						runtimeVersion,
						platform,
						message
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/v2/projects/${projectId}/updates`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						body,
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'listUpdates': {
					const projectId = this.getNodeParameter('projectId', i) as string;
					const platform = this.getNodeParameter('platform', i) as string;
					const branchName = this.getNodeParameter('branchName', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const queryParams = new URLSearchParams();
					if (platform && platform !== 'all') {
						queryParams.append('platform', platform);
					}
					if (branchName) {
						queryParams.append('branchName', branchName);
					}
					if (limit) {
						queryParams.append('limit', limit.toString());
					}
					if (offset) {
						queryParams.append('offset', offset.toString());
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/projects/${projectId}/updates${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`
						},
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUpdate': {
					const updateId = this.getNodeParameter('updateId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/updates/${updateId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`
						},
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteUpdate': {
					const updateId = this.getNodeParameter('updateId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/v2/updates/${updateId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`
						},
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'republishUpdate': {
					const projectId = this.getNodeParameter('projectId', i) as string;
					const updateId = this.getNodeParameter('updateId', i) as string;
					const platform = this.getNodeParameter('platform', i) as string;

					const body: any = {
						updateId,
						platform
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/v2/projects/${projectId}/updates/republish`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						body,
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i }
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i }
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeSubmissionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('expoeasApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createSubmission': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const platform = this.getNodeParameter('platform', i) as string;
          const buildId = this.getNodeParameter('buildId', i) as string;
          const submissionConfig = this.getNodeParameter('submissionConfig', i) as string;

          const body: any = {
            platform,
            buildId,
          };

          if (submissionConfig) {
            try {
              body.submissionConfig = JSON.parse(submissionConfig);
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), 'Invalid JSON in submission config');
            }
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/projects/${projectId}/submissions`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listSubmissions': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const platform = this.getNodeParameter('platform', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: string[] = [];
          if (platform) queryParams.push(`platform=${encodeURIComponent(platform)}`);
          if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
          if (limit) queryParams.push(`limit=${limit}`);
          if (offset) queryParams.push(`offset=${offset}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/projects/${projectId}/submissions${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSubmission': {
          const submissionId = this.getNodeParameter('submissionId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/submissions/${submissionId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelSubmission': {
          const submissionId = this.getNodeParameter('submissionId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/submissions/${submissionId}/cancel`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'retrySubmission': {
          const submissionId = this.getNodeParameter('submissionId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/submissions/${submissionId}/retry`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeProjectOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('expoeasApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseOptions: any = {
        headers: {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json',
        },
        json: true,
      };

      switch (operation) {
        case 'listProjects': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/v2/projects`,
            qs: {
              limit,
              offset,
            },
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getProject': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/v2/projects/${projectId}`,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createProject': {
          const name = this.getNodeParameter('name', i) as string;
          const slug = this.getNodeParameter('slug', i) as string;
          const privacy = this.getNodeParameter('privacy', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/v2/projects`,
            body: {
              name,
              slug,
              privacy,
            },
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'updateProject': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const privacy = this.getNodeParameter('privacy', i) as string;
          
          const updateData: any = { name, privacy };
          if (description) {
            updateData.description = description;
          }
          
          const options: any = {
            ...baseOptions,
            method: 'PATCH',
            url: `${credentials.baseUrl}/v2/projects/${projectId}`,
            body: updateData,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'deleteProject': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'DELETE',
            url: `${credentials.baseUrl}/v2/projects/${projectId}`,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeWebhookOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('expoeasApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createWebhook': {
					const projectId = this.getNodeParameter('projectId', i) as string;
					const url = this.getNodeParameter('url', i) as string;
					const secret = this.getNodeParameter('secret', i) as string;
					const event = this.getNodeParameter('event', i) as string;

					const body: any = {
						url,
						event,
					};

					if (secret) {
						body.secret = secret;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/v2/projects/${projectId}/webhooks`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'listWebhooks': {
					const projectId = this.getNodeParameter('projectId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/projects/${projectId}/webhooks`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;
					const url = this.getNodeParameter('url', i) as string;
					const secret = this.getNodeParameter('secret', i) as string;
					const event = this.getNodeParameter('event', i) as string;

					const body: any = {};

					if (url) {
						body.url = url;
					}

					if (secret) {
						body.secret = secret;
					}

					if (event) {
						body.event = event;
					}

					const options: any = {
						method: 'PATCH',
						url: `${credentials.baseUrl}/v2/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/v2/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
