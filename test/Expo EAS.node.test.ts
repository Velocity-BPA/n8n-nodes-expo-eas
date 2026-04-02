/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ExpoEAS } from '../nodes/Expo EAS/Expo EAS.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('ExpoEAS Node', () => {
  let node: ExpoEAS;

  beforeAll(() => {
    node = new ExpoEAS();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Expo EAS');
      expect(node.description.name).toBe('expoeas');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Build Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.expo.dev'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should create a build successfully', async () => {
    const mockResponse = { id: 'build-123', status: 'pending', platform: 'ios' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createBuild')
      .mockReturnValueOnce('project-123')
      .mockReturnValueOnce('ios')
      .mockReturnValueOnce('production')
      .mockReturnValueOnce('abc123');

    const result = await executeBuildOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.expo.dev/v2/projects/project-123/builds',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        platform: 'ios',
        buildProfile: 'production',
        gitCommitHash: 'abc123',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle create build error', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createBuild')
      .mockReturnValueOnce('project-123')
      .mockReturnValueOnce('ios')
      .mockReturnValueOnce('production')
      .mockReturnValueOnce('');

    const result = await executeBuildOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should list builds successfully', async () => {
    const mockResponse = { builds: [{ id: 'build-1' }, { id: 'build-2' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listBuilds')
      .mockReturnValueOnce('project-123')
      .mockReturnValueOnce('all')
      .mockReturnValueOnce('finished')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(0);

    const result = await executeBuildOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.expo.dev/v2/projects/project-123/builds?limit=10&offset=0&status=finished',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get build details successfully', async () => {
    const mockResponse = { id: 'build-123', status: 'finished' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBuild')
      .mockReturnValueOnce('build-123');

    const result = await executeBuildOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.expo.dev/v2/builds/build-123',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should cancel build successfully', async () => {
    const mockResponse = { id: 'build-123', status: 'canceled' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelBuild')
      .mockReturnValueOnce('build-123');

    const result = await executeBuildOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.expo.dev/v2/builds/build-123/cancel',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should retry build successfully', async () => {
    const mockResponse = { id: 'build-123', status: 'pending' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('retryBuild')
      .mockReturnValueOnce('build-123');

    const result = await executeBuildOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.expo.dev/v2/builds/build-123/retry',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });
});

describe('Update Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.expo.dev'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			}
		};
	});

	describe('publishUpdate', () => {
		it('should publish an OTA update successfully', async () => {
			const mockResponse = {
				id: 'update-123',
				runtimeVersion: '1.0.0',
				platform: 'all',
				message: 'Bug fixes and improvements'
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'publishUpdate';
					case 'projectId': return 'project-123';
					case 'runtimeVersion': return '1.0.0';
					case 'platform': return 'all';
					case 'message': return 'Bug fixes and improvements';
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeUpdateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 }
				}
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.expo.dev/v2/projects/project-123/updates',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json'
				},
				body: {
					runtimeVersion: '1.0.0',
					platform: 'all',
					message: 'Bug fixes and improvements'
				},
				json: true
			});
		});

		it('should handle publish update errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'publishUpdate';
					default: return 'test-value';
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeUpdateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 }
				}
			]);
		});
	});

	describe('listUpdates', () => {
		it('should list updates successfully', async () => {
			const mockResponse = {
				updates: [
					{ id: 'update-1', message: 'First update' },
					{ id: 'update-2', message: 'Second update' }
				],
				total: 2
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'listUpdates';
					case 'projectId': return 'project-123';
					case 'platform': return 'ios';
					case 'limit': return 10;
					case 'offset': return 0;
					default: return '';
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeUpdateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 }
				}
			]);
		});
	});

	describe('getUpdate', () => {
		it('should get update details successfully', async () => {
			const mockResponse = {
				id: 'update-123',
				message: 'Bug fixes',
				runtimeVersion: '1.0.0'
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'getUpdate';
					case 'updateId': return 'update-123';
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeUpdateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 }
				}
			]);
		});
	});

	describe('deleteUpdate', () => {
		it('should delete update successfully', async () => {
			const mockResponse = { success: true };

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'deleteUpdate';
					case 'updateId': return 'update-123';
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeUpdateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 }
				}
			]);
		});
	});

	describe('republishUpdate', () => {
		it('should republish update successfully', async () => {
			const mockResponse = {
				id: 'update-124',
				originalUpdateId: 'update-123'
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'republishUpdate';
					case 'projectId': return 'project-123';
					case 'updateId': return 'update-123';
					case 'platform': return 'android';
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeUpdateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 }
				}
			]);
		});
	});
});

describe('Submission Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.expo.dev'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should create a submission successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createSubmission')
      .mockReturnValueOnce('test-project-id')
      .mockReturnValueOnce('ios')
      .mockReturnValueOnce('test-build-id')
      .mockReturnValueOnce('{"testKey": "testValue"}');

    const mockResponse = { id: 'submission-123', status: 'pending' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubmissionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.expo.dev/v2/projects/test-project-id/submissions',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      body: {
        platform: 'ios',
        buildId: 'test-build-id',
        submissionConfig: { testKey: 'testValue' }
      },
      json: true
    });
  });

  it('should list submissions successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listSubmissions')
      .mockReturnValueOnce('test-project-id')
      .mockReturnValueOnce('ios')
      .mockReturnValueOnce('pending')
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0);

    const mockResponse = { submissions: [{ id: 'submission-123' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubmissionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should get a submission successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSubmission')
      .mockReturnValueOnce('submission-123');

    const mockResponse = { id: 'submission-123', status: 'finished' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubmissionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSubmission')
      .mockReturnValueOnce('invalid-id');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Submission not found'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeSubmissionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'Submission not found' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should cancel a submission successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelSubmission')
      .mockReturnValueOnce('submission-123');

    const mockResponse = { id: 'submission-123', status: 'cancelled' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubmissionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should retry a submission successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('retrySubmission')
      .mockReturnValueOnce('submission-123');

    const mockResponse = { id: 'submission-123', status: 'pending' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubmissionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });
});

describe('Project Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.expo.dev' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('listProjects', () => {
    it('should list projects successfully', async () => {
      const mockResponse = { data: [{ id: '1', name: 'Test Project' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listProjects')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.expo.dev/v2/projects',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        qs: { limit: 50, offset: 0 },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle listProjects error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('listProjects');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getProject', () => {
    it('should get project successfully', async () => {
      const mockResponse = { id: '123', name: 'Test Project' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProject')
        .mockReturnValueOnce('123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.expo.dev/v2/projects/123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('createProject', () => {
    it('should create project successfully', async () => {
      const mockResponse = { id: '123', name: 'New Project', slug: 'new-project' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createProject')
        .mockReturnValueOnce('New Project')
        .mockReturnValueOnce('new-project')
        .mockReturnValueOnce('private');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.expo.dev/v2/projects',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'New Project',
          slug: 'new-project',
          privacy: 'private',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      const mockResponse = { id: '123', name: 'Updated Project' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateProject')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('Updated Project')
        .mockReturnValueOnce('Updated description')
        .mockReturnValueOnce('public');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'https://api.expo.dev/v2/projects/123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'Updated Project',
          description: 'Updated description',
          privacy: 'public',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      const mockResponse = { success: true };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteProject')
        .mockReturnValueOnce('123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.expo.dev/v2/projects/123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Webhook Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.expo.dev',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('createWebhook', () => {
		it('should create webhook successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWebhook')
				.mockReturnValueOnce('project123')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce('secret123')
				.mockReturnValueOnce('build');

			const mockResponse = { id: 'webhook123', url: 'https://example.com/webhook' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.expo.dev/v2/projects/project123/webhooks',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					url: 'https://example.com/webhook',
					event: 'build',
					secret: 'secret123',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle create webhook error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWebhook')
				.mockReturnValueOnce('project123')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce('secret123')
				.mockReturnValueOnce('build');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('listWebhooks', () => {
		it('should list webhooks successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listWebhooks')
				.mockReturnValueOnce('project123');

			const mockResponse = { data: [{ id: 'webhook1' }, { id: 'webhook2' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.expo.dev/v2/projects/project123/webhooks',
				headers: {
					'Authorization': 'Bearer test-token',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getWebhook', () => {
		it('should get webhook successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWebhook')
				.mockReturnValueOnce('webhook123');

			const mockResponse = { id: 'webhook123', url: 'https://example.com/webhook' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.expo.dev/v2/webhooks/webhook123',
				headers: {
					'Authorization': 'Bearer test-token',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateWebhook', () => {
		it('should update webhook successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateWebhook')
				.mockReturnValueOnce('webhook123')
				.mockReturnValueOnce('https://example.com/new-webhook')
				.mockReturnValueOnce('newsecret123')
				.mockReturnValueOnce('submit');

			const mockResponse = { id: 'webhook123', url: 'https://example.com/new-webhook' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PATCH',
				url: 'https://api.expo.dev/v2/webhooks/webhook123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					url: 'https://example.com/new-webhook',
					secret: 'newsecret123',
					event: 'submit',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteWebhook', () => {
		it('should delete webhook successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteWebhook')
				.mockReturnValueOnce('webhook123');

			const mockResponse = { success: true };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.expo.dev/v2/webhooks/webhook123',
				headers: {
					'Authorization': 'Bearer test-token',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});
});
