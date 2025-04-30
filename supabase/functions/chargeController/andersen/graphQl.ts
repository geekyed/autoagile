import { request, RequestDocument } from "npm:graphql-request";

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
