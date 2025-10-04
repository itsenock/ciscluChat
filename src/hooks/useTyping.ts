import { useEffect, useState } from "react";

export const useTyping = () => {
  const [typingUser, setTypingUser] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUser(Math.random() < 0.3 ? "Amina" : null);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return typingUser;
};
