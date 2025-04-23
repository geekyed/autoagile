interface MeterPoint {
  tariff_code: string;
  valid_from: string;
  valid_to: string | null;
}

interface ElectricityMeterPoint {
  mpan: string;
  agreements: MeterPoint[];
}

interface Property {
  electricity_meter_points: ElectricityMeterPoint[];
}

interface AccountData {
  properties: Property[];
}

interface StandardUnitRate {
  value_exc_vat: number;
  value_inc_vat: number;
  valid_from: string; // ISO 8601 date-time string
  valid_to: string; // ISO 8601 date-time string
  payment_method: string | null;
}

interface Price {
  tariff: string;
  price: number;
  start: Date;
  end: Date;
}
