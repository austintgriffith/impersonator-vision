import { useEffect, useState } from "react";

export function useDebouncer(impersonateAddress: string) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Make API request with the current value
      setIsTyping(false);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [impersonateAddress]);

  return { isTyping, setIsTyping };
}
