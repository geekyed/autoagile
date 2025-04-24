interface UserProfile {
  id: string;
  name: string;
  email: string;
  octopusAccountId: string;
  octopusAPIKey: string;
  octopusTariff: string | null;
  andersenUsername: string | null;
  andersenPassword: string | null;
}
