import { gql, request, RequestDocument } from "graphql-request";

export const sendGraphQLQuery = async (
  graphqlProd: string,
  token: string,
  query: RequestDocument,
  variables?: object,
): Promise<AndersenResponse> => {
  try {
    const response = await request<AndersenResponse>(
      graphqlProd,
      query,
      variables,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    console.log("GraphQL response:", response);
    return response;
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    console.log(message);
    return Promise.reject(message);
  }
};

export const getCurrentUserDevices = gql`query getCurrentUserDevices {
  getCurrentUserDevices {
    id
    name
    deviceInfo {
      id
      friendlyName
    }
    deviceStatus {
      id
      cfgCTConfig
      sysFwVersion
    }
  }
}`;

export const getDevice = gql`query getDevice($id: ID!) {
  getDevice(id: $id) {
    id
    name
    last_ip_address
    deviceStatus {
      id
      evseState
      sysFwVersion
      sysSchEnabled
      sysUserLock
      sysScheduleLock
      sysSch0
      sysSch1
      sysSch2
      sysSch3
      sysSch4
      cfgCTConfig
      scheduleSlotsArray {
        startHour
        startMinute
        endHour
        endMinute
        enabled
        dayMap {
          monday
          tuesday
          wednesday
          thursday
          friday
          saturday
          sunday
        }
      }
    }
    deviceInfo {
      id
      currency
      enableThreePhaseMultiplier
      friendlyName
      locationLongitude
      locationLatitude
      schedule0Name
      schedule1Name
      schedule2Name
      schedule3Name
      schedule4Name
      address
      addressPlace
      addressDistrict
      addressPostcode
      addressCountry
      solarOverrideStart
      notifyRcmErrorEnabled
      notifyWeeklyReportEnabled
      notifyDeviceOfflineEnabled
      purpose
      solarChargeAlways
      timeZoneRegion
      userLock
    }
  }
}`;

// const getDeviceChargeRates = gql`query getDeviceChargeRates($id: ID!) {
//   getDevice(id: $id) {
//     id
//     deviceChargeRates {
//       id
//       price
//       timeStartLocal
//       timeStopLocal
//       startDateTime
//       stopDateTime
//     }
//   }
// }`

// const getDeviceLora = gql`query getDeviceLora($id: ID!) {
//   getDevice(id: $id) {
//     id
//     deviceInfo {
//       loraDevices
//     }
//   }
// }`

// const getDeviceSolar = gql`query getDeviceSolar($id: ID!) {
//   getDevice(id: $id) {
//     id
//     deviceInfo {
//       id
//       solarOverrideStart
//     }
//   }
// }`

// const getCalculatedPowerLogsBinned = gql`query getCalculatedPowerLogsBinned(
//   $id: ID!
//   $dateFrom: Date
//   $dateTo: Date
//   $binnedMinutes: Int
//   $limit: Int
//   $offset: Int
//   $groupBy: LogsGroupedBy
// ) {
//   getDevice(id: $id) {
//     id
//     deviceCalculatedPowerLogsBinned(
//       dateFrom: $dateFrom
//       dateTo: $dateTo
//       binnedMinutes: $binnedMinutes
//       groupBy: $groupBy
//       limit: $limit
//       offset: $offset
//     )
//   }
// }`

// const searchAddress = gql`query searchAddress($addressFragment: String!, $countryCode: String) {
//   searchAddress(
//     addressFragment: $addressFragment
//     countryCode: $countryCode
//   ) {
//     summaryline
//     subbuildingname
//     buildingname
//     number
//     premise
//     street
//     posttown
//     county
//     postcode
//   }
// }`

// const getDeviceCalculatedChargeLogs = gql`query getDeviceCalculatedChargeLogs(
//   $id: ID!
//   $limit: Int
//   $offset: Int
//   $minEnergy: Float
//   $dateFrom: Date
// ) {
//   getDevice(id: $id) {
//     id
//     deviceCalculatedChargeLogs(
//       limit: $limit
//       offset: $offset
//       minEnergy: $minEnergy
//       dateFrom: $dateFrom
//     ) {
//       chargeCostTotal
//       chargeEnergyTotal
//       deviceId
//       duration
//       gridCostTotal
//       gridEnergyTotal
//       particleFwVersion
//       solarEnergyTotal
//       solarCostTotal
//       startDateTimeLocal
//       surplusUsedCostTotal
//       surplusUsedEnergyTotal
//       uuid
//     }
//   }
// }`

// const updateChargeRate = gql`mutation updateChargeRate(
//   $id: ID!
//   $startDateTime: Date
//   $stopDateTime: Date
//   $dayMon: Boolean
//   $dayTue: Boolean
//   $dayWed: Boolean
//   $dayThu: Boolean
//   $dayFri: Boolean
//   $daySat: Boolean
//   $daySun: Boolean
//   $timeStartLocal: String
//   $timeStopLocal: String
//   $price: Float!
// ) {
//   updateChargeRate(
//     id: $id
//     startDateTime: $startDateTime
//     stopDateTime: $stopDateTime
//     dayMon: $dayMon
//     dayTue: $dayTue
//     dayWed: $dayWed
//     dayThu: $dayThu
//     dayFri: $dayFri
//     daySat: $daySat
//     daySun: $daySun
//     timeStartLocal: $timeStartLocal
//     timeStopLocal: $timeStopLocal
//     price: $price
//   )
// }`

// const setScheduleNames = gql`mutation setScheduleNames(
//   $deviceId: ID!
//   $schedule0Name: String
//   $schedule1Name: String
//   $schedule2Name: String
//   $schedule3Name: String
//   $schedule4Name: String
// ) {
//   upsertDeviceInfo(
//     deviceId: $deviceId
//     schedule0Name: $schedule0Name
//     schedule1Name: $schedule1Name
//     schedule2Name: $schedule2Name
//     schedule3Name: $schedule3Name
//     schedule4Name: $schedule4Name
//   ) {
//     schedule0Name
//     schedule1Name
//     schedule2Name
//     schedule3Name
//     schedule4Name
//   }
// }`

// const createChargeRate = gql`mutation createChargeRate(
//   $deviceId: ID!
//   $startDateTime: Date
//   $stopDateTime: Date
//   $dayMon: Boolean
//   $dayTue: Boolean
//   $dayWed: Boolean
//   $dayThu: Boolean
//   $dayFri: Boolean
//   $daySat: Boolean
//   $daySun: Boolean
//   $timeStartLocal: String
//   $timeStopLocal: String
//   $price: Float!
// ) {
//   createChargeRate(
//     deviceId: $deviceId
//     startDateTime: $startDateTime
//     stopDateTime: $stopDateTime
//     dayMon: $dayMon
//     dayTue: $dayTue
//     dayWed: $dayWed
//     dayThu: $dayThu
//     dayFri: $dayFri
//     daySat: $daySat
//     daySun: $daySun
//     timeStartLocal: $timeStartLocal
//     timeStopLocal: $timeStopLocal
//     price: $price
//   ) {
//     id
//   }
// }`

// const unclaimDevice = gql`mutation unclaimDevice($deviceId: ID!) {
//     unclaimDevice(deviceId: $deviceId)
// }`

export const runAEVCommand = gql`mutation runAEVCommand(
  $deviceId: ID!
  $functionName: String!
  $params: String
) {
  runAEVCommand(
    deviceId: $deviceId
    functionName: $functionName
    params: $params
  ) {
    return_value
  }
}`;

// const upsertAccount = gql`mutation upsertAccount($firstName: String, $lastName: String) {
//   upsertAccount(firstName: $firstName, lastName: $lastName)
// }`

// const setSchedules = gql`mutation setSchedules($deviceId: ID!, $scheduleSlots: ScheduleSlotsInput!) {
//   setSchedules(deviceId: $deviceId, scheduleSlots: $scheduleSlots) {
//     id
//     name
//     last_app
//     connected
//     return_value
//   }
// }`

// const deleteChargeRate = gql`mutation deleteChargeRate($id: ID!) {
//   deleteChargeRate(id: $id)
// }`

// const upsertDeviceFriendlyName = gql`mutation upsertDeviceFriendlyName($deviceId: ID!, $friendlyName: String) {
//   upsertDeviceInfo(deviceId: $deviceId, friendlyName: $friendlyName) {
//     friendlyName
//   }
// }`

// const getSolar = gql`query getSolar(
//   $deviceId: ID!
// ) {
//   getSolar(
//     deviceId: $deviceId
//   ) {
//     deviceId
//     override
//     chargeAlways
//     maxGridChargePercent
//     return_value
//   }
// }`

// const setSolar = gql`mutation setSolar(
//   $deviceId: ID!
//   $override: Boolean
//   $chargeAlways: Boolean
//   $maxGridChargePercent: Int
// ) {
//   setSolar(
//     deviceId: $deviceId
//     override: $override
//     chargeAlways: $chargeAlways
//     maxGridChargePercent: $maxGridChargePercent
//   ) {
//     return_value
//   }
// }`

// const registerMobileDevice = gql`mutation registerMobileDevice($token: String!) {
//   registerMobileDevice(token: $token)
// }`

// const unregisterMobileDevice = gql`mutation unregisterMobileDevice($token: String!) {
//   unregisterMobileDevice(token: $token)
// }`

// const setAllSchedulesDisabled = gql`mutation setAllSchedulesDisabled($deviceId: ID!) {
//   setAllSchedulesDisabled(deviceId: $deviceId) {
//     id
//     name
//     last_app
//     connected
//     return_value
//   }
// }`

// const claimDeviceByName = gql`mutation claimDeviceByName($deviceName: String!) {
//   claimDeviceByName(deviceName: $deviceName) {
//     id
//     name
//   }
// }`

export const getDeviceStatusSimple = gql`query getDeviceStatusSimple($id: ID!) {
  getDevice(id: $id) {
    deviceStatus {
      id
      online
      evseState
      sysSchEnabled
      sysUserLock
      sysScheduleLock
    }
  }
}`;

export const getDeviceStatus = gql`query getDeviceStatus($id: ID!) {
  getDevice(id: $id) {
    deviceStatus {
      id
      konnectSerial
      online
      lastEvent
      lastEventAge
      evseState
      evseResponseTime
      evseChargeAmpCurrentLimit
      sysSchEnabled
      sysUserLock
      sysScheduleLock
      sysRssi
      sysSSID
      sysLan
      sysTemperature
      sysFreeMemory
      sysRuntime
      sysFwVersion
      sysHwVersion
      evseFwVersion
      evseHwVersion
      sysBootup
      sysOs
      sysProductId
      sysProductName
      sysOtaUpdate
      sysRcmUserCleared
      sysButton
      sysFaultCode
      sysVoltageA
      sysVoltageB
      sysVoltageC
      sysAmpA
      sysAmpB
      sysAmpC
      sysPowerA
      sysPowerB
      sysPowerC
      sysPhase
      sysSolarCT
      sysGridCT
      sysAdaptiveFuse
      sysTime
      sysSch0
      sysSch1
      sysSch2
      sysSch3
      sysSch4
      sysFaultCode
      cfgPENEarthConnected
      cfgDebugEnable
      cfgChargeAmpMax
      cfgChargeAmpMin
      cfgDSTActive
      sysChargingEnabled
      sysSchEnabled
      sysSchSet
      sysUserLock
      sysScheduleLock
      sysSolarPower
      sysGridPower
      sysChargePower
      sysSolarEnergyDelta
      sysGridEnergyDelta
      cfgChargeAmpMin
      cfgChargeAmpMax

      solarMaxGridChargePercent
      solarChargeAlways
      solarOverride
      cfgAFEnable
      cfgAFAmpMax
      cfgCTConfig
      chargeStatus {
        start
        chargeEnergyTotal
        solarEnergyTotal
        gridEnergyTotal
        chargePower
        chargePowerMax
        solarPower
        gridPower
        duration
      }
      scheduleSlotsArray {
        startHour
        startMinute
        endHour
        endMinute
        enabled
        dayMap {
          monday
          tuesday
          wednesday
          thursday
          friday
          saturday
          sunday
        }
      }
      sysSchDSORandom      
    }
  }
}`;

// const deviceStatusUpdated = gql`subscription deviceStatusUpdated($id: ID!) {
//   deviceStatusUpdated(id: $id) {
//     id
//     sysFwVersion
//     evseState
//     online
//     sysRssi
//     sysSSID
//     lastEvent
//     lastEventAge
//     cfgLora0 {
//       cfg
//       epow
//       on
//       rssi
//       eui
//     }
//     cfgLora1 {
//       cfg
//       epow
//       on
//       rssi
//       eui
//     }
//     cfgLora2 {
//       cfg
//       epow
//       on
//       rssi
//       eui
//     }
//     cfgLora3 {
//       cfg
//       epow
//       on
//       rssi
//       eui
//     }
//     sysTime
//     sysSch0
//     sysSch1
//     sysSch2
//     sysSch3
//     sysSch4
//     sysFaultCode
//     sysChargingEnabled
//     cfgPENEarthConnected
//     cfgChargeAmpMax
//     cfgChargeAmpMin
//     cfgDSTActive
//     sysSchEnabled
//     sysUserLock
//     sysScheduleLock
//     sysSolarPower
//     sysGridPower
//     solarMaxGridChargePercent
//     solarChargeAlways
//     solarOverride
//     cfgCTConfig
//     chargeStatus {
//       start
//       chargeEnergyTotal
//       chargePower
//       duration
//     }
//     scheduleSlotsArray {
//       startHour
//       startMinute
//       endHour
//       endMinute
//       enabled
//       dayMap {
//         monday
//         tuesday
//         wednesday
//         thursday
//         friday
//         saturday
//         sunday
//       }
//     }
//     sysSchDSORandom
//   }
// }`
