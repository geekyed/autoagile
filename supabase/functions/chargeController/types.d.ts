interface AndersenChargeTimespan {
  userId: string;
  startTime: Date;
  endTime: Date;
  averagePrice: number;
}

interface AndersenChargeConfig {
  id: string;
  userId: string;
  andersenUsername: string;
  andersenPassword: string;
  batterySize: number;
  chargeRate: number;
}

// -----------Andersen-----------

interface AndersenDevice {
  id: string;
}

interface AndersenResponse {
  getCurrentUserDevices: AndersenDevice[];
  getDevice: {
    deviceStatus: SimpleStatus;
  };
}

interface SimpleStatus {
  id: string;
  online: boolean;
  evseState: number;
  sysSchEnabled: boolean;
  sysUserLock: boolean;
  sysScheduleLock: string;
}
