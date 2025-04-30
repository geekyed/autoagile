import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from "npm:amazon-cognito-identity-js";
export const graphqlProd = "https://graphql.andersen-ev.com";

const getUsername = async (email: string): Promise<string> => {
  const usernameResponse = await fetch(
    graphqlProd + "/get-pending-user",
    {
      method: "POST",
      body: JSON.stringify({ "email": email }),
      headers: { "Content-Type": "application/json" },
    },
  );
  return ((await usernameResponse.json()) as { username: string }).username;
};

const asyncAuthenticateUser = async (
  cognitoUser: CognitoUser,
  cognitoAuthenticationDetails: AuthenticationDetails,
): Promise<CognitoUserSession> => {
  return new Promise(function (resolve, reject) {
    cognitoUser.authenticateUser(cognitoAuthenticationDetails, {
      onSuccess: resolve,
      onFailure: reject,
      newPasswordRequired: resolve,
    });
  });
};

export const signIn = async (
  authData: { Username: string; Password: string },
): Promise<string> => {
  const username = await getUsername(authData.Username);
  const cognitoUserPool = new CognitoUserPool({
    UserPoolId: "eu-west-1_t5HV3bFjl",
    ClientId: "23s0olnnniu5472ons0d9uoqt9",
  });
  const cognitoAuthenticationDetails = new AuthenticationDetails(authData);
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: cognitoUserPool,
  });

  const result = await asyncAuthenticateUser(
    cognitoUser,
    cognitoAuthenticationDetails,
  );

  if (result.isValid()) return result.getIdToken().getJwtToken();
  return Promise.reject(new Error("invalid token"));
};
