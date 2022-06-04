import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

function fetchUserGroups(username) {
  return axios.get("/groups", { params: { username } }).then((res) => res.data);
}

function useUserGroups(username) {
  return useQuery("userGroups", () => fetchUserGroups(username), {
    enabled: !!username,
  });
}

export default useUserGroups;
