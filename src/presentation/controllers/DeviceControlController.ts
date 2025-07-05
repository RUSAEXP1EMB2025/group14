import { ControlDeviceUseCase, DeviceAutomationService } from '../../application/index.ts';
import type { DeviceControlRequest } from '../../application/index.ts';
import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';

export interface DeviceControlApiRequest {
  readonly deviceId?: string;
  readonly isOn?: boolean;
  readonly action?: 'on' | 'off' | 'toggle';
  readonly brightness?: number;
  readonly temperature?: number;
  readonly mode?: string;
  readonly settings?: Record<string, unknown>;
}

export interface DeviceStatusResponse {
  readonly deviceId: string;
  readonly type: string;
  readonly status: {
    isOnline: boolean;
    lastUpdated: string;
  };
  readonly state: Record<string, unknown>;
}

export class DeviceControlController {
  constructor(
    private readonly controlDeviceUseCase: ControlDeviceUseCase,
    private readonly deviceAutomationService: DeviceAutomationService,
    private readonly logger: ILogger
  ) {}

  async controlLight(request: Request): Promise<Response> {
    try {
      const body = await this.parseJsonBody<DeviceControlApiRequest>(request);
      if (!body.success) {
        return new Response(body.error, { status: 400 });
      }

      let deviceId = body.data.deviceId;
      if (!deviceId) {
        // TODO: デバイス自動取得の実装
        deviceId = 'b8d63046-2973-411e-a355-3a1c289c004b';
      }

      let action: 'on' | 'off' | 'toggle' = 'toggle';
      if (body.data.action) {
        action = body.data.action;
      } else if (body.data.isOn !== undefined) {
        action = body.data.isOn ? 'on' : 'off';
      }

      const settings: Record<string, unknown> = body.data.settings || {};
      if (body.data.brightness !== undefined) {
        settings.brightness = body.data.brightness;
      }

      const controlRequest: DeviceControlRequest = {
        deviceId,
        action,
        settings
      };

      const result = await this.controlDeviceUseCase.controlLight(controlRequest);

      if (!result.isSuccess()) {
        this.logger.error('Light control failed:', result.error);
        return new Response(
          JSON.stringify({
            error: 'Light control failed',
            details: result.error?.message
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      const response = result.data!;

      return new Response(
        JSON.stringify({
          success: true,
          message: response.message,
          applianceId: response.applianceId
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      this.logger.error('Light control endpoint error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  async controlAircon(_request: Request): Promise<Response> {
    // エアコン制御は現在サポートされていません
    return new Response(
      JSON.stringify({
        error: 'Aircon control is not currently supported',
        message: 'この機能は現在無効になっています'
      }),
      {
        status: 501,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  async executeAutomation(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const action = url.searchParams.get('action');

      if (!action) {
        return new Response('Missing action parameter', { status: 400 });
      }

      let result: Result<string>;

      switch (action) {
        case 'sunset': {
          result = await this.deviceAutomationService.setupSunsetAutomation();
          break;
        }
        case 'temperature': {
          const interval = Number.parseInt(url.searchParams.get('interval') || '30', 10);
          result = await this.deviceAutomationService.setupTemperatureMonitoring(interval);
          break;
        }
        case 'execute': {
          const scheduledResult = await this.deviceAutomationService.executeScheduledTasks();
          if (!scheduledResult.isSuccess()) {
            return new Response(
              JSON.stringify({
                error: 'Failed to execute scheduled tasks',
                details: scheduledResult.error?.message
              }),
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              results: scheduledResult.data
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
        case 'emergency-stop': {
          const stopResult = await this.deviceAutomationService.emergencyStop();
          if (!stopResult.isSuccess()) {
            return new Response(
              JSON.stringify({
                error: 'Emergency stop failed',
                details: stopResult.error?.message
              }),
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: 'Emergency stop executed',
              results: stopResult.data
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
        default:
          return new Response(`Unknown action: ${action}`, { status: 400 });
      }

      if (!result.isSuccess()) {
        return new Response(
          JSON.stringify({
            error: `Failed to ${action}`,
            details: result.error?.message
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `${action} automation setup completed`,
          scheduleId: result.data
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      this.logger.error('Automation endpoint error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  async getAutomationStatus(): Promise<Response> {
    try {
      const result = await this.deviceAutomationService.getAutomationStatus();

      if (!result.isSuccess()) {
        return new Response(
          JSON.stringify({
            error: 'Failed to get automation status',
            details: result.error?.message
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          status: result.data
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      this.logger.error('Automation status endpoint error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  /**
   * Swagger/OpenAPI 3.0形式のAPIドキュメンテーションエンドポイント
   */
  async getApiDocumentation(): Promise<Response> {
    try {
      const swaggerDoc = {
        openapi: '3.0.0',
        info: {
          title: 'Smart Home Device Control API',
          description:
            '🏠 スマートホーム デバイス制御API - Nature Remoデバイスを簡単に制御できるRESTful API',
          version: '1.0.0',
          contact: {
            name: 'API Support',
            email: 'support@example.com'
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          }
        },
        servers: [
          {
            url: '/api/v1',
            description: 'Production server'
          }
        ],
        tags: [
          {
            name: 'devices',
            description: 'デバイス制御操作'
          },
          {
            name: 'automation',
            description: '自動化機能'
          }
        ],
        paths: {
          '/devices/lights/control': {
            post: {
              tags: ['devices'],
              summary: 'ライト制御',
              description: 'スマートライトの電源ON/OFF、明度調整を行います',
              operationId: 'controlLight',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        deviceId: {
                          type: 'string',
                          description: 'デバイスID（省略時は自動検出）',
                          example: 'b8d63046-2973-411e-a355-3a1c289c004b'
                        },
                        isOn: {
                          type: 'boolean',
                          description: 'ライトの電源状態',
                          example: true
                        },
                        action: {
                          type: 'string',
                          enum: ['on', 'off', 'toggle'],
                          description: '制御アクション（isOnと併用可能）',
                          example: 'on'
                        },
                        brightness: {
                          type: 'integer',
                          minimum: 0,
                          maximum: 100,
                          description: '明度レベル（0-100%）',
                          example: 50
                        },
                        settings: {
                          type: 'object',
                          properties: {
                            color: {
                              type: 'string',
                              description: '色設定',
                              example: '#FF0000'
                            },
                            temperature: {
                              type: 'number',
                              description: '色温度設定',
                              example: 3000
                            }
                          }
                        }
                      }
                    },
                    examples: {
                      turnOn: {
                        summary: '電源ON',
                        value: {
                          isOn: true
                        }
                      },
                      setBrightness: {
                        summary: '明度設定',
                        value: {
                          isOn: true,
                          brightness: 30
                        }
                      }
                    }
                  }
                }
              },
              responses: {
                '200': {
                  description: '制御成功',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: {
                            type: 'boolean',
                            example: true
                          },
                          message: {
                            type: 'string',
                            example: 'ライトを制御しました'
                          },
                          device: {
                            type: 'object',
                            properties: {
                              id: {
                                type: 'string',
                                example: 'b8d63046-2973-411e-a355-3a1c289c004b'
                              },
                              previousState: {
                                type: 'object'
                              },
                              newState: {
                                type: 'object'
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                '400': {
                  description: 'リクエストエラー',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Error'
                      }
                    }
                  }
                },
                '429': {
                  description: 'レート制限エラー',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          error: {
                            type: 'string',
                            example:
                              '⏱️ リクエストが多すぎます。1分ほど待ってから再度お試しください。'
                          }
                        }
                      }
                    }
                  }
                },
                '500': {
                  description: 'サーバーエラー',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Error'
                      }
                    }
                  }
                }
              }
            }
          },
          '/devices/aircons/control': {
            post: {
              tags: ['devices'],
              summary: 'エアコン制御',
              description: 'エアコンの電源ON/OFF、温度・モード設定を行います',
              operationId: 'controlAircon',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        deviceId: {
                          type: 'string',
                          description: 'デバイスID（省略時は自動検出）',
                          example: 'e4f1d17e-6c78-46ea-8061-ecff9ce7ded2'
                        },
                        isOn: {
                          type: 'boolean',
                          description: 'エアコンの電源状態',
                          example: true
                        },
                        action: {
                          type: 'string',
                          enum: ['on', 'off', 'toggle'],
                          description: '制御アクション',
                          example: 'on'
                        },
                        temperature: {
                          type: 'integer',
                          minimum: 16,
                          maximum: 30,
                          description: '設定温度（16-30℃）',
                          example: 24
                        },
                        mode: {
                          type: 'string',
                          enum: ['cool', 'heat', 'dry', 'fan', 'auto'],
                          description: '運転モード',
                          example: 'cool'
                        }
                      }
                    },
                    examples: {
                      cooling: {
                        summary: '冷房設定',
                        value: {
                          isOn: true,
                          temperature: 24,
                          mode: 'cool'
                        }
                      },
                      heating: {
                        summary: '暖房設定',
                        value: {
                          isOn: true,
                          temperature: 26,
                          mode: 'heat'
                        }
                      }
                    }
                  }
                }
              },
              responses: {
                '200': {
                  description: '制御成功',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: {
                            type: 'boolean',
                            example: true
                          },
                          message: {
                            type: 'string',
                            example: 'エアコンを制御しました'
                          },
                          device: {
                            type: 'object',
                            properties: {
                              id: {
                                type: 'string'
                              },
                              previousState: {
                                type: 'object'
                              },
                              newState: {
                                type: 'object'
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                '400': {
                  description: 'リクエストエラー',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Error'
                      }
                    }
                  }
                },
                '429': {
                  description: 'レート制限エラー',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          error: {
                            type: 'string',
                            example:
                              '⏱️ リクエストが多すぎます。1分ほど待ってから再度お試しください。'
                          }
                        }
                      }
                    }
                  }
                },
                '500': {
                  description: 'サーバーエラー',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Error'
                      }
                    }
                  }
                }
              }
            }
          },
          '/automation/execute': {
            post: {
              tags: ['automation'],
              summary: '自動化実行',
              description: '自動化アクションを実行します',
              operationId: 'executeAutomation',
              parameters: [
                {
                  name: 'action',
                  in: 'query',
                  required: true,
                  schema: {
                    type: 'string',
                    enum: ['sunset', 'temperature', 'execute', 'emergency-stop']
                  },
                  description: '実行するアクション',
                  example: 'sunset'
                },
                {
                  name: 'interval',
                  in: 'query',
                  schema: {
                    type: 'integer',
                    minimum: 1
                  },
                  description: '温度監視の間隔（分）',
                  example: 30
                }
              ],
              responses: {
                '200': {
                  description: '実行成功',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: {
                            type: 'boolean'
                          },
                          message: {
                            type: 'string'
                          },
                          scheduleId: {
                            type: 'string'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '/automation/status': {
            get: {
              tags: ['automation'],
              summary: '自動化状態取得',
              description: '現在の自動化ステータスを取得します',
              operationId: 'getAutomationStatus',
              responses: {
                '200': {
                  description: '取得成功',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: {
                            type: 'boolean'
                          },
                          status: {
                            type: 'object'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            Error: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  description: 'エラーメッセージ'
                },
                details: {
                  type: 'string',
                  description: 'エラー詳細'
                }
              },
              required: ['error']
            }
          }
        }
      };

      return new Response(JSON.stringify(swaggerDoc, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      this.logger.error('API documentation error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  /**
   * Swagger UI を表示するエンドポイント
   */
  async getSwaggerUI(): Promise<Response> {
    try {
      const swaggerUIHTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Device Control API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/api/v1/docs',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                docExpansion: "list",
                defaultModelsExpandDepth: 1,
                defaultModelExpandDepth: 1,
                tryItOutEnabled: true,
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                requestInterceptor: function(request) {
                    // CORS対応やヘッダー設定
                    request.headers['Accept'] = 'application/json';
                    request.headers['Content-Type'] = 'application/json';
                    return request;
                }
            });
        };
    </script>
</body>
</html>`;

      return new Response(swaggerUIHTML, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      this.logger.error('Swagger UI error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  private async parseJsonBody<T>(
    request: Request
  ): Promise<{ success: true; data: T } | { success: false; error: string }> {
    try {
      const text = await request.text();
      if (!text.trim()) {
        return { success: false, error: 'Empty request body' };
      }

      const data = JSON.parse(text) as T;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `Invalid JSON: ${error}` };
    }
  }
}
