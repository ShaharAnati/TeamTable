import _ from "lodash";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import RestaurantComponent from "../findRestaurants/restaurants/restaurant/Restauant";
import Button from "@mui/material/Button";
import { Restaurant } from "src/types/Resturants";

export const VerifyRestaurants = (props): JSX.Element => {
  const {
    isLoading,
    error,
    refetch,
    data: restaurantsToVerify,
  } = useQuery("repoData", () =>
    axios
      .get("http://localhost:3000/restaurants?unverified=true")
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

  const approveRestaurant = async (restaurantId: string) => {
      try {
      await axios
        .patch(`http://localhost:3000/restaurants/${restaurantId}/approve`)
        .then((res) => {
            refetch();
        })
      } catch (error) {
        console.log("error apprving restaurant, ", error)
      }
  };

  const declineRestaurant = (restaurantId: string) => {
    try {
        axios
        .delete(`http://localhost:3000/restaurants/${restaurantId}/decline`)
        .then((res) => {
            refetch();
        })
      } catch (error) {
        console.log("error declining restaurant, ", error)
      }
  };

  return (
    <div>
      <div> Restaurants to Verify ({restaurantsToVerify?.length})</div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
      
        {restaurantsToVerify?.map((restaurant:Restaurant, i) => (
          <div key={i} style={{ margin: "16px" }}>
            <RestaurantComponent restaurant={restaurant} chosedTags={[]} />
            <div>
              <Button onClick={async () => {await approveRestaurant(restaurant.id);} }> Approve </Button>
              <Button  onClick={async () => {await declineRestaurant(restaurant.id);} }> Decline </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerifyRestaurants;
