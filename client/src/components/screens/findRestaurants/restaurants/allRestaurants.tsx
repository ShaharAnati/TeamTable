import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import "./restaurant.css";
import Restaurant from "./restaurant/Restauant";
import {Filters} from "src/types/Group";
import useUserLikedRestaurants from "src/hooks/useUserLikedRestaurants";
import {useAuth} from "src/auth/AuthProvider";
import {Restaurant as TypedRestaurant} from "../../../../../../server/models/Restaurant";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface AllRestaurantsProps {
  filters: Filters;
  restaurants: TypedRestaurant[];
}

export const AllRestaurants: React.FC<AllRestaurantsProps> = (props): JSX.Element => {
  const { filters, restaurants } = props;

  const { loggedInUser } = useAuth();
  const userLikedRestaurantsQuery = loggedInUser.email ? useUserLikedRestaurants(loggedInUser.email) : null;

  const [filteredRestaurants, setFilteredRestaurants] = useState([]);



  useEffect(() => {
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
        justifyContent: "flex-start",
      }}
    >
      {filteredRestaurants?.map((restaurant, i) => (
        <div key={i} style={{ margin: "auto", padding: "0 16px 50px 16px" }}>
          <Restaurant restaurant={restaurant} chosedTags={filters.tags} likedRestaurants={userLikedRestaurantsQuery ? userLikedRestaurantsQuery.data : []}/>
        </div>
      ))}
    </div>
  );
};
