import React, {useState} from "react";

import "../screens/findRestaurants/restaurants/restaurant.css";
import Restaurant from "../screens/findRestaurants/restaurants/restaurant/Restauant";
import useUserLikedRestaurants from "src/hooks/useUserLikedRestaurants";
import {useAuth} from "src/auth/AuthProvider";
import {Restaurant as TypedRestaurant} from "src/types/Resturants";
import * as _ from 'lodash';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IconButton from "@mui/material/IconButton";

interface AllRestaurantsProps {
    restaurants: TypedRestaurant[];
}

export const PaginatedRestaurants: React.FC<AllRestaurantsProps> = (props): JSX.Element => {

    const {restaurants} = props;
    const {loggedInUser} = useAuth();

    const getMaxRestaurantsNumber = () => {
        return Math.round(window.innerWidth / 270) - 2;
    }

    const getMaxPageNumber = () => {
        return Math.round(restaurants.length / getMaxRestaurantsNumber());
    }

    const [pageNumber, setPageNumber] = useState(1)
    const [restaurantNumber, setRestaurantNumber] = useState(getMaxRestaurantsNumber());
    const [maxPageNumber, setMaxPageNumber] = useState(getMaxPageNumber())

    const currentPageNumber = (pageNumber * restaurantNumber) - restaurantNumber
    let paginatedRestaurants = _.clone(restaurants).splice(currentPageNumber, restaurantNumber);

    function getNewRestaurantPage(restaurants: TypedRestaurant[], currentPageNumber: number, restaurantNumber: number) {
        return _.clone(restaurants).splice(currentPageNumber, restaurantNumber);

    }

    React.useEffect(() => {

        setRestaurantNumber(getMaxRestaurantsNumber);
        setMaxPageNumber(getMaxPageNumber);

        function handleResize() {
            setPageNumber(1);
            setRestaurantNumber(getMaxRestaurantsNumber());
            setMaxPageNumber(getMaxPageNumber())
        }

        window.addEventListener('resize', handleResize)
    })

    const handlePrev = () => {
        if (pageNumber === 1) return
        setPageNumber(pageNumber - 1)
        paginatedRestaurants = getNewRestaurantPage(restaurants, currentPageNumber, restaurantNumber);
    }

    const handleNext = () => {
        if(pageNumber !== maxPageNumber) {
            setPageNumber(pageNumber + 1)
            paginatedRestaurants = getNewRestaurantPage(restaurants, currentPageNumber, restaurantNumber);
        }
    }

    const userLikedRestaurantsQuery = useUserLikedRestaurants(loggedInUser?.email);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <h2 style={{
                margin: "1%",
                alignSelf: "center"
            }}>Most Liked Restaurants</h2>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    paddingBottom: "1%"
                }}
            >
                <IconButton onClick={handlePrev} disabled={pageNumber === 1} 
                    style={{height: 'min-content',
                            alignSelf: 'center'}}>
                    <ArrowBackIosIcon fontSize={"large"}/>
                </IconButton>
                {paginatedRestaurants?.map((restaurant, i) => (
                    <div id="card" key={i} style={{margin: "1%"}}>
                        <Restaurant restaurant={restaurant} chosedTags={[]}
                                    likedRestaurants={userLikedRestaurantsQuery && userLikedRestaurantsQuery.data}/>
                    </div>
                ))}
                <IconButton onClick={handleNext} disabled={pageNumber === maxPageNumber} 
                        style={{height: 'min-content',
                        alignSelf: 'center'}}>
                    <ArrowForwardIosIcon fontSize={"large"}/>
                </IconButton>
            </div>
        </div>
    );
};
