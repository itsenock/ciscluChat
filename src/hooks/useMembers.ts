import { useEffect, useState } from "react";
import { Member } from "../types/Member";

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("https://chat-room-1e3o.onrender.com/api/members")
      .then((res) => res.json())
      .then(setMembers);
  }, []);

  return members;
};
