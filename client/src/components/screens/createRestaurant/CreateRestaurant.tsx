import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import _ from "lodash";
import { useQuery } from "react-query";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  dayMapping,
  RESTAURANT_TAGS,
  Restaurant,
} from "../../../types/Resturants";
import axios from "axios";

import "./add-res.css";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const CreateRestaurant = (): JSX.Element => {
  const INITIAL_VALUES = {
    name: "",
    description: "",
    tags: [],
    phoneNumber: "",
    email: "",
  };

  const formik = useFormik({
    initialValues: {
      ...INITIAL_VALUES,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(2, "Too Short!")
        .max(25, "Too Long!")
        .required("Required"),
      tags: Yup.array()
        .min(2, "At least two tags")
        .max(15, "Too Long!")
        .required("Required"),
      email: Yup.string().email("Invalid email"),
      phoneNumber: Yup.string().matches(/\d{10}/, "must be 10 digits"),
    }),
    onSubmit: (values) => {
      const res: Restaurant = {
        name: formik.values.name,
        description: formik.values.description,
        tags: formik.values.tags,
        contactInfo: {
          phoneNumber: formik.values.phoneNumber,
          email: formik.values.email,
        },
        isVerified: false
      };

      axios.post("http://localhost:3000/restaurants", res).catch((err) => {
        if (axios.isAxiosError(err)) {
          console.log("failed to create restaurant", err.message);

          if ((err.toJSON() as any).status === 400) throw err;
        } else {
          console.log("failed to create restaurant");
        }
      });

      alert(JSON.stringify(res, null, 2));
      formik.resetForm();
      formik.setFieldValue("tags", []);
    },
  });

  return (
    <div className={"form-class"}>
      <h1>Add Restaurant</h1>
      <Grid item xs={2}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            sx={{ marginBottom: "10px" }}
            classes={{ root: "form-input" }}
            id="name"
            name="name"
            label="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            sx={{ marginBottom: "10px" }}
            classes={{ root: "form-input" }}
            id="description"
            name="description"
            label="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.description)}
            helperText={formik.touched.name && formik.errors.description}
          />

          <Autocomplete
            classes={{ root: "form-input" }}
            multiple
            id="tags"
            value={formik.values.tags}
            options={RESTAURANT_TAGS}
            getOptionLabel={(option) => option}
            defaultValue={formik.values.tags}
            onChange={(e, value) => formik.setFieldValue("tags", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="tags"
                placeholder="tags"
                error={formik.touched.tags && Boolean(formik.errors.tags)}
                helperText={formik.touched.tags && formik.errors.tags}
              />
            )}
          />

          <TextField
            sx={{ marginBottom: "10px" }}
            className={"form-input"}
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            sx={{ marginBottom: "10px" }}
            className={"form-input"}
            id="phoneNumber"
            name="phoneNumber"
            label="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />

          <Button color="primary" variant="contained" type="submit">
            ADD
          </Button>
        </form>
      </Grid>
    </div>
  );
};
