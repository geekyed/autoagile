import { graphqlProd, signIn } from "./auth.ts";
import {
  getCurrentUserDevices,
  getDeviceStatusSimple,
  runAEVCommand,
  sendGraphQLQuery,
} from "./graphQl.ts";

export default class AndersenA2 {
  username: string;
  password: string;
  token?: string;
  deviceId?: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  public init = async (): Promise<void> => {
    this.token = await signIn({
      Username: this.username,
      Password: this.password,
    });

    const devicesResponse = await sendGraphQLQuery(
      graphqlProd,
      this.token,
      getCurrentUserDevices,
    );
    this.deviceId = devicesResponse.getCurrentUserDevices[0].id;
  };

  public lock = async (): Promise<void> => {
    if (!this.token || !this.deviceId) {
      Promise.reject(new Error("Failed to initialise"));
    }

    await sendGraphQLQuery(graphqlProd, this.token!, runAEVCommand, {
      deviceId: this.deviceId,
      functionName: "userLock",
    });
  };

  public unlock = async (): Promise<void> => {
    if (!this.token || !this.deviceId) {
      Promise.reject(new Error("Failed to initialise"));
    }

    await sendGraphQLQuery(graphqlProd, this.token!, runAEVCommand, {
      deviceId: this.deviceId,
      functionName: "userUnlock",
    });
  };

  public getSimpleStatus = async (): Promise<SimpleStatus> => {
    if (!this.token || !this.deviceId) {
      Promise.reject(new Error("Failed to initialise"));
    }

    const response = await sendGraphQLQuery(
      graphqlProd,
      this.token!,
      getDeviceStatusSimple,
      { id: this.deviceId },
    );
    return response.getDevice.deviceStatus as SimpleStatus;
  };
}
