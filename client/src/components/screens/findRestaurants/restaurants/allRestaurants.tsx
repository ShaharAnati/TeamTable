import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import "./restaurant.css";
import Restaurant from "./restaurant/Restauant";
import {Filters} from "src/types/Group";
import useUserLikedRestaurants from "src/hooks/useUserLikedRestaurants";
import {useAuth} from "src/auth/AuthProvider";
import { dayMapping, Restaurant as TypedRestaurant} from "src/types/Resturants";
import { isPointInPolygon } from "src/helpers/filter-point-in-ploygon";
import { Pagination } from "@mui/material";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface AllRestaurantsProps {
  filters: Filters;
  restaurants: TypedRestaurant[];
  filteredRestaurants?: TypedRestaurant[];
  onFilteredRestaurantsChange?: (restaurants: TypedRestaurant[]) => void;
  selectedRestaurant?: TypedRestaurant;
  onRestaurantClick?: (restaurant: TypedRestaurant) => void;
  pagination?: boolean;
}

export const AllRestaurants: React.FC<AllRestaurantsProps> = (props): JSX.Element => {
  const {
    filters,
    restaurants,
    filteredRestaurants,
    onFilteredRestaurantsChange,
    selectedRestaurant,
    onRestaurantClick,
    pagination = false,
  } = props;

  const { loggedInUser } = useAuth();
  const userLikedRestaurantsQuery = useUserLikedRestaurants(loggedInUser?.email);

  const [paginationPage, setPaginationPage] = useState(1);
  const paginationSize = 15;

  useEffect(() => {
    const dayIndex = Object.keys(dayMapping).findIndex(day => dayMapping[day] == filters.day);
    const filterByPrice = (restaurant: TypedRestaurant) =>
    !filters.priceRange || filters.priceRange.length === 0 || filters.priceRange.indexOf(restaurant.pricePoint) > -1;

    const filterByDay = (restaurant) =>
      !filters.day || restaurant.openingTimes[dayIndex] != null;

    const filterByHour = (restaurant) => {
      const { day, hour } = filters;
      const wasNotChosen = !day || !hour;
      if (wasNotChosen) return true;

      if (!restaurant.openingTimes[dayIndex]) return false;

      const openingHour = restaurant.openingTimes[dayIndex][0];
      const closingHour = restaurant.openingTimes[dayIndex][1];

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

      if (selectedRestaurant && restaurant?.id === selectedRestaurant?.id && !isInArea) {
        onRestaurantClick(null);
      }
      return isInArea
    }

    if (onFilteredRestaurantsChange) {
      setPaginationPage(1);
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

  const handlePaginationChange = (e, page) => {
    setPaginationPage(page);
  };

  const getRestaurants = () => {
    if (pagination) {
      const start = paginationSize * (paginationPage - 1);
      const end = start + paginationSize;
      return (filteredRestaurants || restaurants).slice(start, end);
    }

    return filteredRestaurants || restaurants;
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "100%",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          overflow: "auto",
          height: "100%",
        }}
      >
        {getRestaurants().map((restaurant, i) => (
          <div
            key={restaurant.id}
            className={`restaurant-card-wrapper ${restaurant === selectedRestaurant ? "selected" : ""
              }`}
            style={{ margin: "0 auto", padding: "0 16px 50px 16px" }}
            onClick={() => onRestaurantClick && onRestaurantClick(restaurant)}
          >
            <Restaurant
              restaurant={restaurant}
              chosedTags={filters.tags}
              likedRestaurants={
                userLikedRestaurantsQuery && userLikedRestaurantsQuery.data
              }
            />
          </div>
        ))}
      </div>
      {pagination && (
        <>
          <div className="scroll-gradient" />
          <div style={{ paddingBottom: "16px" }}>
            <Pagination
              count={Math.ceil(
                (filteredRestaurants || restaurants).length / paginationSize
              )}
              page={paginationPage}
              onChange={handlePaginationChange}
            />
          </div>
        </>
      )}
    </div>
  );
};
