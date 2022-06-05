import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

function fetchUserRecentGroup(username) {
  return axios.get("/groups/recent", { params: { username } }).then((res) => res.data);
}

function useUserRecentGroup(username, onSuccess) {
  return useQuery("userRecentGroups", () => fetchUserRecentGroup(username), {
    enabled: !!username,
    staleTime: Infinity,
    onSuccess
  });
}

export default useUserRecentGroup;
