export type DeviceType = 'light' | 'aircon' | 'sensor' | 'unknown';

export interface DeviceId {
  readonly value: string;
}

export interface DeviceName {
  readonly value: string;
}

export interface DeviceStatus {
  readonly isOnline: boolean;
  readonly lastUpdated: Date;
}

export class Device {
  constructor(
    public readonly id: DeviceId,
    public readonly name: DeviceName,
    public readonly type: DeviceType,
    public readonly status: DeviceStatus,
    public readonly capabilities: ReadonlyArray<string> = []
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id.value.trim()) {
      throw new Error('Device ID cannot be empty');
    }
    if (!this.name.value.trim()) {
      throw new Error('Device name cannot be empty');
    }
  }

  isOnline(): boolean {
    return this.status.isOnline;
  }

  hasCapability(capability: string): boolean {
    return this.capabilities.includes(capability);
  }

  updateStatus(newStatus: Partial<DeviceStatus>): Device {
    return new Device(
      this.id,
      this.name,
      this.type,
      {
        ...this.status,
        ...newStatus,
        lastUpdated: new Date()
      },
      this.capabilities
    );
  }

  toString(): string {
    return `Device(${this.id.value}, ${this.name.value}, ${this.type})`;
  }

  equals(other: Device): boolean {
    return this.id.value === other.id.value;
  }
}
