import _ from "lodash";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useQuery} from "react-query";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "./restaurant.css";
import Restaurant from "./restaurant/Restauant";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const AllRestaurants = (props): JSX.Element => {
  const { filters } = props;

  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const sessionStorageUser = sessionStorage.getItem('user_token');

  const {
    isLoading,
    error,
    data: restaurants,
  } = useQuery("repoData", () =>
    axios
      .get("http://localhost:3000/restaurants", {headers: {
        'x-access-token': sessionStorageUser,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }})
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (axios.isAxiosError(error)) {
          console.log("failed to fetch restaurants", error.message);

          if ((error.toJSON() as any).status === 400) throw error;
        } else {
          console.log("failed to fetch restaurants");
        }
      })
  );

  useEffect(() => {
    const filterByTags = (restaurant) =>
      !filters.tags ||
      filters.tags?.length === 0 ||
      _.intersection(filters.tags, restaurant.tags).length > 0;

    const filterByDay = (restaurant) =>
      !filters.day || restaurant.openingTimes[filters.day] != null;

    const filterByHour = (restaurant) => {
      const { day, hour } = filters;
      const wasNotChosen = !day || !hour;
      if (wasNotChosen) return true;

      if (!restaurant.openingTimes[day]) return false;

      const openingHour = restaurant.openingTimes[day][0];
      const closingHour = restaurant.openingTimes[day][1];

      return (
        dayjs(`01-01-2000 ${hour}`).isSameOrAfter(
          `01-01-2000 ${openingHour}`
        ) &&
        dayjs(`01-01-2000 ${hour}`).isSameOrBefore(`01-01-2000 ${closingHour}`)
      );
    };

    setFilteredRestaurants(
      restaurants
        ? restaurants
            .filter(filterByTags)
            .filter(filterByDay)
            .filter(filterByHour)
        : []
    );
  }, [restaurants, filters]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-end",
      }}
    >
      {filteredRestaurants?.map((restaurant, i) => (
        <div key={i} style={{ margin: "16px" }}>
          <Restaurant restaurant={restaurant} chosedTags={filters.tags} />
        </div>
      ))}
    </div>
  );

  return null;
};
