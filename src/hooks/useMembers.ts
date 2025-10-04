import { useEffect, useState } from "react";
import { Member } from "../types/Member";
import { fetchMembers } from "../utils/api";

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetchMembers().then(setMembers);
  }, []);

  return members;
};
