import React, { useRef, useState } from "react";
import { Container } from "@mui/material";
import { CreateRestaurant } from "./CreateRestaurant";

export const CreateRestaurantWrapper = (): JSX.Element => {
  return (
    <div className={"form-class"}>
      <div>
        <Container>
          <h1>Add Restaurant</h1>
          <CreateRestaurant />
        </Container>
      </div>
    </div>
  );
};
