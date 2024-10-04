import { useCallback, useState } from "react";

export const useForceUpdate = () => {
  // Used to trigger manual updates
  const [, updateState] = useState<Record<string, string>>();
  const forceUpdate = useCallback(() => updateState({}), []);
  return forceUpdate;
};
