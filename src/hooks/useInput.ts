import { useRef, useState, useEffect } from "react";

type UseInputReturn = [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  React.RefObject<HTMLInputElement | null>,
];

export const useInput = (initialValue: string): UseInputReturn => {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return [value, onChange, ref];
};

export default useInput;
