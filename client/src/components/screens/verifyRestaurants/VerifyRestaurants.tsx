import _ from "lodash";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import RestaurantComonent from "../findRestaurants/restaurants/restaurant/Restauant";
import Button from "@mui/material/Button";
import { Restaurant } from "src/types/Resturants";


export const VerifyRestaurants = (props): JSX.Element => {

    const {
        isLoading,
        error,
        refetch,
        data: restaurants,
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


    const approveRestaurant = (restaurantId: string) => {


        refetch();
    }


    const declineRestaurant = (restaurantId: string) => {


        refetch();
    }

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-end",
            }}
        >
            {restaurants.map((restaurant, i) => (
                <div key={i} style={{ margin: "16px" }}>
                    <RestaurantComonent restaurant={restaurant} chosedTags={[]} />
                    <div>
                        <Button > Approve </Button>
                        <Button>  Decline </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default VerifyRestaurants;