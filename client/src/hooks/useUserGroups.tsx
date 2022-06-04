import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

function fetchUserGroups(username) {
  return axios.get("groups/recent", { params: { username } }).then((res) => res.data);
}

function useUserGroups(username, onSuccess) {
  return useQuery("userGroups", () => fetchUserGroups(username), {
    enabled: !!username,
    staleTime: Infinity,
    onSuccess
  });
}

export default useUserGroups;
