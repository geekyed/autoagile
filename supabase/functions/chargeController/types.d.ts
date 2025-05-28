interface UserProfile {
  id: string;
  name: string;
  email: string;
  group: Group;
}

interface Group {
  id: string;
  name: string;
  ownerId: string;
  octopusTariff: string | null;
}

interface AndersenConfig {
  groupId: string;
  andersenUsername: string;
  andersenPassword: string;
  batterySize: number;
  chargeRate: number;
}

interface Price {
  tariff: string;
  price: number;
  start: Date;
  end: Date;
}

interface AndersenChargeTimespan {
  id: string;
  groupId: string;
  startTime: Date;
  endTime: Date;
  averagePrice: number;
}

interface PriceChanges {
  updates: Price[] | undefined;
  inserts: Price[] | undefined;
  deletes: Partial<Price>[] | undefined;
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
