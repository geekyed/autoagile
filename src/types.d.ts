interface UserProfile {
  id: string;
  name: string;
  email: string;
  octopusAccountId: string;
  octopusAPIKey: string;
  octopusTariff: string | null;
}

interface Price {
  tariff: string;
  price: number;
  start: Date;
  end: Date;
}

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

interface PriceChanges {
  updates: Price[] | undefined;
  inserts: Price[] | undefined;
  deletes: Partial<Price>[] | undefined;
}
