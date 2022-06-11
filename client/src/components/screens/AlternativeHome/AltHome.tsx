import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { ArrowForward } from "@mui/icons-material";
import { Button} from "@mui/material";

import { Restaurant } from "../../../../../server/models/Restaurant";
import { AllRestaurants } from "../findRestaurants/restaurants/allRestaurants";

import "./AltHome.css";

type Props = {};

function AltHome({}: Props) {
  const navigate = useNavigate();

  const [restaurantsToShow, setRestaurantsToShow] = useState<Restaurant[]>([])

  useEffect(() => {
    axios(`/restaurants`).then(rests => {
      setRestaurantsToShow(rests.data);
    })
  }, [])

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
        <AllRestaurants filters={{}} restaurants={restaurantsToShow} />
      </div>
    </div>
  );
}

export default AltHome;
