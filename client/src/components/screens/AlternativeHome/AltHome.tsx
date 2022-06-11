import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
// @ts-ignore
import BackgroundImg from "../../../../assets/images/background.jpg";
import {Restaurant} from "../../../../../server/models/Restaurant";
import {Button} from "@mui/material";
import {ArrowForward} from "@mui/icons-material";

import "./AltHome.css";
import {PaginatedRestaurants} from "../../PaginatedRestaurants/PaginatedRestaurants";

type Props = {};

function AltHome({}: Props) {
  const navigate = useNavigate();

  const [restaurantsToShow, setRestaurantsToShow] = useState<Restaurant[]>([]);

  useEffect(() => {
    fetchFavoriteRestaurants();
  }, [])

  function fetchFavoriteRestaurants() {
    return axios.get("/restaurants/top/favorite-restaurants")
        .then((res) => setRestaurantsToShow(res.data));
  }

  const homePageHeaderContent: JSX.Element = (
      <>
        <div className="image-text">Where are we eating today?</div>
        <Button
            variant="contained"
            endIcon={<ArrowForward />}
            component={Link}
            to="/create-group-screen"
            sx={{ backgroundColor: "#00000080", color: "white" }}
        >
          Find us a table
        </Button>

        <div className="add-restaurant-text">
          <span className="own-restaurant">Didn't find a restaurant?</span>
          <span
              className="add-now-button"
              onClick={() => navigate("/create-restaurant", { replace: true })}
          >
          Add it <u>here</u> now!
        </span>
        </div>
      </>
  )

  return (
    <div>
      <div
        className="background-img"
      >
        {homePageHeaderContent}
      </div>

      <div className="all-restaurant-area">
        <PaginatedRestaurants restaurants={restaurantsToShow}></PaginatedRestaurants>
      </div>
    </div>
  );
}

export default AltHome;
