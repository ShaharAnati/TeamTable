import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

function fetchUserLikedRestaurants(email) {
    return axios.get(`/users/${email}/all-liked-restaurants`)
        .then((res) => res.data);
}

function useUserLikedRestaurants(email) {
    return useQuery("useUserLikedRestaurants", () => fetchUserLikedRestaurants(email), {
        enabled: !!email,
    });
}

export default useUserLikedRestaurants;
