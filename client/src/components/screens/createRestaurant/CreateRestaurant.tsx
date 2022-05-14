import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import _ from "lodash";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";

import {
  dayMapping,
  RESTAURANT_TAGS,
  Restaurant,
} from "../../../types/Resturants";
import axios from "axios";

import "./add-res.css";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const CreateRestaurant = (): JSX.Element => {
  const INITIAL_VALUES = {
    name: "",
    description: "",
    tags: [],
    phoneNumber: "",
    email: "",
    openingTimes: {
      "1": [null, null],
      "2": [null, null],
      "3": [null, null],
      "4": [null, null],
      "5": [null, null],
      "6": [null, null],
      "7": [null, null],
    },
  };

  const validateDates = (values, errors) => {
    errors["openingTimes"] = {};

    [1, 2, 3, 4, 5, 6, 7].forEach((day) => {
      if (
        (!values.openingTimes[day][0] && values.openingTimes[day][1]) ||
        (values.openingTimes[day][0] && !values.openingTimes[day][1])
      ) {
        errors["openingTimes"][day] =
          "must include both opening and closing times";
      } else if (
        Date.parse(values.openingTimes[day][0]) >=
        Date.parse(values.openingTimes[day][1])
      ) {
        errors["openingTimes"] = "opening time must be before closing";
      }
    });

    //...

    return;
  };

  const formatOpeningTimes =(openingTimes) => {
    const newOpeningTimes = {};

    [1, 2, 3, 4, 5, 6, 7].forEach((day) => {
      newOpeningTimes[day] = openingTimes[day].map(time =>  dayjs(time).format("HH:mm"));
    });

    return newOpeningTimes;
  }

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
        isVerified: false,
        openingTimes: formatOpeningTimes(formik.values.openingTimes)
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

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={12}>
          <Grid item xs={2}>
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
              multiple
              id="restaurant-tags"
              value={formik.values.tags}
              options={RESTAURANT_TAGS}
              getOptionLabel={(option) => option}
              defaultValue={formik.values.tags}
              onChange={(event, value) => formik.setFieldValue("tags", value)}
              renderInput={(params) => (
                <TextField
                  sx={{ marginBottom: "10px" }}
                  {...params}
                  variant="standard"
                  label="tags"
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
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
            />
          </Grid>
          <Grid item xs={10}>
            <h4> open times: </h4>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div style={{ marginBottom: "4px" }}>
                <span> {dayMapping[day]}</span>
                <div>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <TimePicker
                      clearable
                      value={formik.values.openingTimes[day][0]}
                      onChange={(value) => {
                        // validateDates(formik.values, formik.errors);
                        formik.setFieldValue(`openingTimes[${day}][0]`, value);
                      }}
                      renderInput={(params) => (
                        <TextField
                        
                          {...params}
                        />
                      )}
                    />
                    {" - "}
                    <TimePicker
                      clearable
                      value={formik.values.openingTimes[day][1]}
                      onChange={(value) => {
                        formik.setFieldValue(`openingTimes[${day}][1]`, value);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            ))}
          </Grid>
        </Grid>
        <Button color="primary" variant="contained" type="submit">
          ADD
        </Button>
      </form>
    </div>
  );
};
