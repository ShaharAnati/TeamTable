import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Address,
} from "../../../types/Resturants";
import axios from "axios";

import "./add-res.css";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  ImageUpload,
  deleteUnusedImages,
} from "src/components/ImageUpload/ImageUpload";
import { Map } from "src/components/Map/Map";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const allInputs = { imgUrl: "" };

export const CreateRestaurant = (): JSX.Element => {
  const [address, setAddress] = useState<Address>(null);
  const [location, setLocation] = useState<any>(null);
  const [imageAsUrl, setImageAsUrl] = React.useState(allInputs);
  const [datesError, setDatesError] = useState<string>("");
  const [previousUrls, setPreviousUrls] = React.useState([]);

  const navigate = useNavigate();

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

  const validateTimes = (values, day: number): void => {
    if (
      Date.parse(values.openingTimes[day][0]) >=
      Date.parse(values.openingTimes[day][1])
    ) {
      setDatesError("opening time must be before closing " + day);
    } else {
      setDatesError("");
    }
  };

  const formatOpeningTimes = (openingTimes) => {
    const newOpeningTimes = {};

    [1, 2, 3, 4, 5, 6, 7].forEach((day) => {
      newOpeningTimes[day] = openingTimes[day].map((time) =>
        dayjs(time).format("HH:mm")
      );
    });

    return newOpeningTimes;
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
    onSubmit: async (values) => {
      const res: Restaurant = {
        name: formik.values.name,
        description: formik.values.description,
        tags: formik.values.tags,
        contactInfo: {
          phoneNumber: formik.values.phoneNumber,
          email: formik.values.email,
        },
        isVerified: false,
        openingTimes: formatOpeningTimes(formik.values.openingTimes),
        address: {
          country: address.country,
          city: address.city || address.town,
          street: address.street || address.road,
          house_number: address.house_number,
        },
        imgUrl: imageAsUrl.imgUrl,
        location: location,
      };

      await axios.post("/restaurants", res).catch((err) => {
        if (axios.isAxiosError(err)) {
          console.log("failed to create restaurant", err.message);

          if ((err.toJSON() as any).status === 400) throw err;
        } else {
          console.log("failed to create restaurant");
        }
      });

      console.log(JSON.stringify(res, null, 2));
      formik.resetForm();
      formik.setFieldValue("tags", []);

      navigate("/");
    },
  });

  return (
    <div className={"form-class"}>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        Add Restaurant
      </h1>

      <div>
        <div style={{ margin: "auto", width: 1000, marginTop: 50 }}>
          <h4> Restaurant Details: </h4>
          <Grid container spacing={4}>
            <Grid item xs={8}>
              <TextField
                sx={{ marginBottom: "10px" }}
                classes={{ root: "form-input" }}
                id="name"
                name="name"
                label="Name"
                fullWidth
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
                label="Description"
                fullWidth
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.name && Boolean(formik.errors.description)
                }
                helperText={formik.touched.name && formik.errors.description}
              />
            </Grid>
            <Grid item xs={4}>
              <ImageUpload
                setImageAsUrl={setImageAsUrl}
                imageAsUrl={imageAsUrl}
              />
            </Grid>

            <Grid item xs={6}>
              <h4> Opening Times: </h4>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ width: 120 }}> {dayMapping[day]}</span>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <TimePicker
                      value={formik.values.openingTimes[day][0]}
                      onChange={(value) => {
                        // validateDates(formik.values, formik.errors);
                        formik.setFieldValue(`openingTimes[${day}][0]`, value);
                        validateTimes(formik.values, day);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    {" - "}
                    <TimePicker
                      value={formik.values.openingTimes[day][1]}
                      onChange={(value) => {
                        formik.setFieldValue(`openingTimes[${day}][1]`, value);
                        validateTimes(formik.values, day);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              ))}
            </Grid>

            <Grid item xs={6}>
              <h4> Tags: </h4>
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
                    placeholder="Choose your tags"
                    error={formik.touched.tags && Boolean(formik.errors.tags)}
                    helperText={formik.touched.tags && formik.errors.tags}
                  />
                )}
              />

              <h4> Contact Info: </h4>
              <TextField
                sx={{ marginBottom: "10px" }}
                className={"form-input"}
                id="email"
                name="email"
                label="Email"
                fullWidth
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
                label="Phone Number"
                fullWidth
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
              />
            </Grid>
          </Grid>
          <Map
            setAddress={setAddress}
            setMarker={setLocation}
            marker={location}
          />
          <Button
            color="primary"
            variant="contained"
            // disabled={datesError != ""}
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            ADD
          </Button>
        </div>
      </div>
    </div>
  );
};
