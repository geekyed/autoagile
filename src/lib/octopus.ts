import { eq } from 'drizzle-orm'
import { db } from './db'
import { pricesTable } from './db/schema'

  
  interface MeterPoint {
    tariff_code: string
    valid_from: string
    valid_to: string | null
  }

  interface ElectricityMeterPoint {
    mpan: string
    agreements: MeterPoint[]
  }

  interface Property {
    electricity_meter_points: ElectricityMeterPoint[]
  }

  interface AccountData {
    properties: Property[]
  }

  interface StandardUnitRate {
    value_exc_vat: number
    value_inc_vat: number
    valid_from: string // ISO 8601 date-time string
    valid_to: string // ISO 8601 date-time string
    payment_method: string | null
  }

  interface StandardUnitRateResponse {
    count: number
    next: string | null
    previous: string | null
    results: StandardUnitRate[]
  }

  interface Price {
    tariff: string
    price: number
    created: Date
    start: Date
    end: Date
  }

const isOver23HoursAgo = (prices: Price[]): boolean => {
  if (prices.length === 0) return true
  return new Date().getTime() - prices[0].created.getTime() > 23 * 60 * 60 * 1000
}

export const getPrices = async (tariffCode: string): Promise<Price[]> => {
  let prices = []
  prices = (await db.query.pricesTable.findMany({
    where: eq(pricesTable.tariff, tariffCode)
  })).map((dbPrice): Price => ({
    tariff: dbPrice.tariff,
    price: parseFloat(dbPrice.price),
    created: dbPrice.created,
    start: dbPrice.start,
    end: dbPrice.end,
  }))

  if (isOver23HoursAgo(prices)) {
    prices = await getNewPrices(tariffCode)
    if (prices.length > 0) {
      await db.insert(pricesTable).values(prices.map((price) => ({
        tariff: price.tariff,
        price: price.price.toString(),
        created: price.created,
        start: price.start,
        end: price.end,
      })))
    }
  }
  return prices
}

const getNewPrices = async (tariffCode: string) : Promise<Price[]> => {
  try {
    const productCode = tariffCode.split('-').slice(2, 6).join('-')
    console.info(`tariff code: ${tariffCode}`)
    console.info(`product code: ${productCode}`)
    const url = `https://api.octopus.energy/v1/products/${productCode}/electricity-tariffs/${tariffCode}/standard-unit-rates/`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const rates = await response.json()
    console.log(`results JSON: ${JSON.stringify(rates)}`)
    if (rates.results.length < 1) return []

      return rates.results.map((rate: StandardUnitRate): Price => ({
      start: new Date(rate.valid_from),
      end: new Date(rate.valid_to),
      price: rate.value_inc_vat,
      created: new Date(),
      tariff: tariffCode,
    }))

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching account data:', error.message)
    } else {
      console.error('Error fetching account data:', error)
    }
    return Promise.reject(new Error('error fetching rates'))
  }
}

export const getTariffCode = async (accountId: string, apiKey: string): Promise<string> => {
  const account = await fetchAccountData(accountId, apiKey)

  if (!account) throw new Error('no account found')
  const electricityMeterPoints: MeterPoint[] = account.properties.flatMap(
    (property) => property.electricity_meter_points.flatMap((meterPoint) => meterPoint.agreements),
  )

  const currentTariff = electricityMeterPoints.find((meterPoint) => {
    const now = new Date()
    const validFrom = new Date(meterPoint.valid_from)
    const validTo = meterPoint.valid_to ? new Date(meterPoint.valid_to) : null

    return validFrom <= now && (!validTo || now < validTo) && meterPoint.tariff_code.includes('E-1R-AGILE')
  })

  if (currentTariff) return currentTariff.tariff_code
  throw new Error('failed to get tariff code')
}

const fetchAccountData = async (accountId: string, apiKey: string): Promise<AccountData | null> => {
  const url = `https://api.octopus.energy/v1/accounts/${accountId}/`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${btoa(`${apiKey}:`)}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching account data:', error.message)
    } else {
      console.error('Error fetching account data:', error)
    }
    return null
  }
}


