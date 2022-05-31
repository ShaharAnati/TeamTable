import _ from "lodash";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import RestaurantComponent from "../findRestaurants/restaurants/restaurant/Restauant";
import Button from "@mui/material/Button";
import { Restaurant } from "src/types/Resturants";
import {
  Container,
  Paper,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Drawer,
  Box,
  Card,
  Dialog,
  Grid,
} from "@mui/material";
import RestaurantListItem from "./RestaurantListItem";
import { CreateRestaurant } from "../createRestaurant/CreateRestaurant";

export const VerifyRestaurants = (props): JSX.Element => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [status, setStatus] = useState<"verified" | "unverified" | "all">(
    "unverified"
  );

  const {
    isLoading,
    error,
    refetch,
    data: restaurantsToVerify,
  } = useQuery(["repoData", status], () => {
    return axios
      .get(`http://localhost:3000/restaurants?status=${status}`)
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
      });
  });

  const approveRestaurant = async (restaurantId: string) => {
    try {
      await axios
        .patch(`http://localhost:3000/restaurants/${restaurantId}/approve`)
        .then((res) => {
          refetch();
        });
    } catch (error) {
      console.log("error apprving restaurant, ", error);
    }
  };

  const declineRestaurant = (restaurantId: string) => {
    try {
      axios
        .delete(`http://localhost:3000/restaurants/${restaurantId}/decline`)
        .then((res) => {
          refetch();
        });
    } catch (error) {
      console.log("error declining restaurant, ", error);
    }
  };

  return (
    <Box sx={{ padding: "32px 48px" }}>
      <Box
        sx={{ display: "flex", marginBottom: "32px" }}
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Box>
          <Typography variant="h4">Manage Restaurants</Typography>
          <Typography variant="subtitle1">
            Approve, Decline or Edit your restaurants
          </Typography>
        </Box>
        <ToggleButtonGroup
          size="small"
          value={status}
          onChange={(e, newStatus) => setStatus(newStatus)}
          exclusive
        >
          <ToggleButton value="unverified">Unverified</ToggleButton>
          <ToggleButton value="verified">Verified</ToggleButton>
          <ToggleButton value="all">All</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid
        container
        columnSpacing={6}
        rowSpacing={12}
        justifyContent="center"
        alignItems="stretch"
      >
        {restaurantsToVerify?.map((restaurant: Restaurant) => (
          <Grid item key={restaurant.name}>
            <RestaurantListItem
              restaurant={restaurant}
              onApprove={approveRestaurant}
              onDecline={declineRestaurant}
              onEdit={() => {}}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VerifyRestaurants;
