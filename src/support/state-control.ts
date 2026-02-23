import { BackendApiClient } from "../api/backend-api.client";
import { ENV } from "../config/env";

export const resetStateIfEnabled = async (apiClient: BackendApiClient): Promise<void> => {
  if (!ENV.allowTestControlApi) return;
  await apiClient.resetAllProductStocks(ENV.stockResetValue);
};
