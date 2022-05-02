import Grid from "@mui/material/Grid";
import React from "react";
import { AllRestaurants } from "../restaurants/allRestaurants";

export const FindRestaurants = (props): JSX.Element => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
          <div>
              Group Details
          </div>
          <div>
              Filters
          </div>
      </Grid>
      <Grid item xs={10}>
        <AllRestaurants />
      </Grid>
    </Grid>
  );
};
