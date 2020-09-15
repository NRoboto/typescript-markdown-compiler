import React from "react";

export const useSemiPersistentState = <T>(
  key: string,
  defaultState: T,
  minUpdateDelay: number = 0
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState<T>(
    JSON.parse(localStorage.getItem(key) ?? JSON.stringify(defaultState))
  );

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState];
};
