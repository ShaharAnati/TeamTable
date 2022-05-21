import React from "react";
import { Link } from "react-router-dom";

// @ts-ignore
import BackgroundImg from "../../../../assets/images/background.jpg";
import { AllRestaurants } from "../findRestaurants/restaurants/allRestaurants";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

import "./AltHome.css";

type Props = {};

function AltHome({}: Props) {
  return (
    <div>
      <div
        className="background-img"
        style={{ backgroundImage: `url(${BackgroundImg})` }}
      >
        <div className="image-text">Where do we eat today?</div>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          component={Link}
          to="/create-group-screen"
          sx={{ backgroundColor: "#00000080" }}
        >
          Find us a table
        </Button>

        <div className="add-restaurant-text">
          <span className="own-restaurant">Didn't find a restaurant?</span>
          <span className="add-now-button">
            Add it <u>here</u> now!
          </span>
        </div>
      </div>

      <div className="all-restaurant-area">
        <AllRestaurants filters={{}} />
      </div>
    </div>
  );
}

export default AltHome;
