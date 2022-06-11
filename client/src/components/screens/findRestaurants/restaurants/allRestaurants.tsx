import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import "./restaurant.css";
import Restaurant from "./restaurant/Restauant";
import {Filters} from "src/types/Group";
import useUserLikedRestaurants from "src/hooks/useUserLikedRestaurants";
import {useAuth} from "src/auth/AuthProvider";
import { Restaurant as TypedRestaurant} from "src/types/Resturants";
import { isPointInPolygon } from "src/helpers/filter-point-in-ploygon";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface AllRestaurantsProps {
  filters: Filters;
  restaurants: TypedRestaurant[];
  filteredRestaurants?: TypedRestaurant[];
  onFilteredRestaurantsChange?: (restaurants: TypedRestaurant[]) => void;
  selectedRestaurant?: TypedRestaurant;
  onRestaurantClick?: (restaurant: TypedRestaurant) => void;
}

export const AllRestaurants: React.FC<AllRestaurantsProps> = (props): JSX.Element => {
  const {
    filters,
    restaurants,
    filteredRestaurants,
    onFilteredRestaurantsChange,
    selectedRestaurant,
    onRestaurantClick,
  } = props;

  const { loggedInUser } = useAuth();
  const userLikedRestaurantsQuery = useUserLikedRestaurants(loggedInUser?.email);


  useEffect(() => {
    const filterByPrice = (restaurant: TypedRestaurant) =>
    !filters.priceRange || filters.priceRange.length === 0 || filters.priceRange.indexOf(restaurant.pricePoint) > -1;

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

    const filterBySelectedArea = (restaurant) => {
      if (!filters?.selectedArea) return true;
      if (!restaurant.location) return false;

      const isInArea = isPointInPolygon(restaurant.location, filters.selectedArea);

      if (restaurant === selectedRestaurant && !isInArea) {
        onRestaurantClick(null);
      }
      return isInArea
    }

    if (onFilteredRestaurantsChange) {
      onFilteredRestaurantsChange(
        restaurants
          ? restaurants
              .filter(filterBySelectedArea)
              .filter(filterByDay)
              .filter(filterByHour)
              .filter(filterByPrice)
          : []
      );
    }

  }, [restaurants, filters]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}
    >
      {(filteredRestaurants || restaurants).map((restaurant, i) => (
        <div
          key={i}
          className={`restaurant-card-wrapper ${
            restaurant === selectedRestaurant ? "selected" : ""
          }`}
          style={{ margin: "auto", padding: "0 16px 50px 16px" }}
          onClick={() => onRestaurantClick && onRestaurantClick(restaurant)}
        >
          <Restaurant
            restaurant={restaurant}
            chosedTags={filters.tags}
            likedRestaurants={userLikedRestaurantsQuery && userLikedRestaurantsQuery.data}
          />
        </div>
      ))}
    </div>
  );
};
