export abstract class BaseService {
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  getServiceName(): string {
    return this.serviceName;
  }

  abstract initialize?(): Promise<void>;

  abstract cleanup?(): Promise<void>;
}
