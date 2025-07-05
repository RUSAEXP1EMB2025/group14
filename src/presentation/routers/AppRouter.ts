import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { DebugController } from '../controllers/DebugController.ts';
import { DeviceControlController } from '../controllers/DeviceControlController.ts';
import { LineWebhookController } from '../controllers/LineWebhookController.ts';

export type RouteHandler = (request: Request) => Promise<Response>;

export interface RouteConfig {
  readonly method: string;
  readonly path: string;
  readonly handler: RouteHandler;
  readonly requiresAuth?: boolean;
  readonly rateLimit?: number;
}

export class AppRouter {
  private routes: Map<string, RouteConfig> = new Map();

  constructor(
    private readonly lineWebhookController: LineWebhookController,
    private readonly deviceControlController: DeviceControlController,
    private readonly debugController: DebugController,
    private readonly logger: ILogger
  ) {
    this.initializeRoutes();
  }

  /**
   * ルートを初期化
   */
  private initializeRoutes(): void {
    // LINE Webhook関連
    this.addRoute({
      method: 'POST',
      path: '/webhook',
      handler: request => this.lineWebhookController.handleWebhook(request)
    });

    this.addRoute({
      method: 'OPTIONS',
      path: '/webhook',
      handler: () => this.lineWebhookController.handleOptions()
    });

    this.addRoute({
      method: 'GET',
      path: '/webhook/info',
      handler: () => this.lineWebhookController.handleWebhookInfo()
    });

    // ヘルスチェック
    this.addRoute({
      method: 'GET',
      path: '/health',
      handler: () => this.lineWebhookController.handleHealthCheck()
    });

    // デバイス制御API
    this.addRoute({
      method: 'POST',
      path: '/api/v1/devices/lights/control',
      handler: request => this.deviceControlController.controlLight(request)
    });

    this.addRoute({
      method: 'POST',
      path: '/api/v1/devices/aircons/control',
      handler: request => this.deviceControlController.controlAircon(request)
    });

    // 自動化API
    this.addRoute({
      method: 'POST',
      path: '/api/v1/automation/execute',
      handler: request => this.deviceControlController.executeAutomation(request)
    });

    this.addRoute({
      method: 'GET',
      path: '/api/v1/automation/status',
      handler: () => this.deviceControlController.getAutomationStatus()
    });

    // API ドキュメント
    this.addRoute({
      method: 'GET',
      path: '/api/v1/docs',
      handler: () => this.deviceControlController.getApiDocumentation()
    });

    // Swagger UI
    this.addRoute({
      method: 'GET',
      path: '/api/v1/swagger-ui',
      handler: () => this.deviceControlController.getSwaggerUI()
    });

    // 開発用エンドポイント
    if (process.env.NODE_ENV === 'development') {
      this.addRoute({
        method: 'GET',
        path: '/dev/routes',
        handler: () => this.handleRouteList()
      });

      // デバッグエンドポイント
      this.addRoute({
        method: 'GET',
        path: '/debug/devices',
        handler: () => this.debugController.listDevices()
      });

      this.addRoute({
        method: 'GET',
        path: '/debug/devices/raw',
        handler: () => this.debugController.getRawDevices()
      });

      this.addRoute({
        method: 'GET',
        path: '/debug/appliances/details',
        handler: () => this.debugController.getApplianceDetails()
      });

      // デバッグ用スケジュール作成エンドポイント
      this.addRoute({
        method: 'POST',
        path: '/debug/sunset-schedule',
        handler: () => this.debugController.createDebugSunsetSchedule()
      });
    }

    this.logger.info(`Initialized ${this.routes.size} routes`);
  }

  /**
   * ルートを追加
   */
  private addRoute(config: RouteConfig): void {
    const key = `${config.method}:${config.path}`;
    this.routes.set(key, config);
  }

  /**
   * リクエストをルーティング
   */
  async route(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const method = request.method;
      const pathname = url.pathname;

      // 完全一致を試行
      const exactKey = `${method}:${pathname}`;
      const exactRoute = this.routes.get(exactKey);

      if (exactRoute) {
        this.logger.info(`Route matched: ${method} ${pathname}`);
        return await this.executeRoute(exactRoute, request);
      }

      // パターンマッチを試行（簡易版）
      for (const [, route] of this.routes) {
        if (this.matchRoute(method, pathname, route)) {
          this.logger.info(`Route pattern matched: ${method} ${pathname} -> ${route.path}`);
          return await this.executeRoute(route, request);
        }
      }

      // 404
      this.logger.warn(`No route found for: ${method} ${pathname}`);
      return this.addCorsHeaders(this.createNotFoundResponse(pathname));
    } catch (error) {
      this.logger.error('Routing error:', error);
      const errorResponse = new Response('Internal Server Error', { status: 500 });
      return this.addCorsHeaders(errorResponse);
    }
  }

  /**
   * ルートを実行
   */
  private async executeRoute(route: RouteConfig, request: Request): Promise<Response> {
    try {
      // レート制限チェック（簡易版）
      if (route.rateLimit) {
        // 実際の実装では Redis やメモリベースの制限を使用
        this.logger.debug(`Rate limit check: ${route.rateLimit} requests/minute`);
      }

      // 認証チェック
      if (route.requiresAuth) {
        const authResult = await this.checkAuthentication(request);
        if (!authResult.success) {
          return new Response('Unauthorized', { status: 401 });
        }
      }

      // ハンドラーを実行
      const startTime = Date.now();
      const response = await route.handler(request);
      const duration = Date.now() - startTime;

      this.logger.info(
        `Route executed in ${duration}ms: ${request.method} ${new URL(request.url).pathname}`
      );

      // CORSヘッダーを追加
      return this.addCorsHeaders(response);
    } catch (error) {
      this.logger.error('Route execution error:', error);
      const errorResponse = new Response('Internal Server Error', { status: 500 });
      return this.addCorsHeaders(errorResponse);
    }
  }

  /**
   * ルートパターンマッチング（簡易版）
   */
  private matchRoute(method: string, pathname: string, route: RouteConfig): boolean {
    if (route.method !== method) {
      return false;
    }

    // 完全一致
    if (route.path === pathname) {
      return true;
    }

    // パラメータ付きパス（例: /api/v1/devices/:id）
    if (route.path.includes(':')) {
      const routeSegments = route.path.split('/');
      const pathSegments = pathname.split('/');

      if (routeSegments.length !== pathSegments.length) {
        return false;
      }

      return routeSegments.every((routeSegment, index) => {
        if (routeSegment.startsWith(':')) {
          return true; // パラメータセグメント
        }
        return routeSegment === pathSegments[index];
      });
    }

    return false;
  }

  /**
   * 認証チェック（簡易版）
   */
  private async checkAuthentication(
    request: Request
  ): Promise<{ success: boolean; user?: string }> {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return { success: false };
    }

    // 実際の実装では JWT トークンの検証など
    if (authHeader.startsWith('Bearer ')) {
      return { success: true, user: 'authenticated_user' };
    }

    return { success: false };
  }

  /**
   * 404 レスポンスを作成
   */
  private createNotFoundResponse(pathname: string): Response {
    const errorResponse = {
      error: 'Not Found',
      message: `The requested resource '${pathname}' was not found`,
      availableRoutes: this.getAvailableRoutes(),
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * 利用可能なルート一覧を取得
   */
  private getAvailableRoutes(): Array<{ method: string; path: string }> {
    return Array.from(this.routes.values()).map(route => ({
      method: route.method,
      path: route.path
    }));
  }

  /**
   * ルート一覧エンドポイント（開発用）
   */
  private async handleRouteList(): Promise<Response> {
    const routes = Array.from(this.routes.values()).map(route => ({
      method: route.method,
      path: route.path,
      requiresAuth: route.requiresAuth || false,
      rateLimit: route.rateLimit
    }));

    const response = {
      totalRoutes: routes.length,
      routes,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * CORS ヘッダーを追加
   */
  private addCorsHeaders(response: Response): Response {
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-line-signature');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
}
