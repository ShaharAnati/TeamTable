import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import _ from "lodash";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import MoneyIcon from "@mui/icons-material/AttachMoney";

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
import OperatingHoursForm from "./OperatingHoursForm";
import axios from "axios";

import "./add-res.css";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { ResMap } from "src/components/Map/Map";
import {
  Box,
  Card,
  CardActions,
  CardHeader,
  Container,
  Paper,
  Stack,
} from "@mui/material";
import {
  ImageUpload,
  deleteUnusedImages,
} from "src/components/ImageUpload/ImageUpload";
import { borderColor } from "@mui/system";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const allInputs = { imgUrl: "" };

type Props = {
  restaurant?: Restaurant;
  isEditMode?: boolean;
  onEditCallback?: Function;
};

const PriceRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#8dc149",
  },
  "& .MuiRating-iconHover": {
    color: "#8dc149",
  },
});

export const CreateRestaurant = ({
  restaurant,
  isEditMode,
  onEditCallback,
}: Props): JSX.Element => {
  const [imageAsUrl, setImageAsUrl] = useState({
    imgUrl: restaurant?.imgUrl || "",
  });
  const [tagOptions, setTagOptions] = React.useState<string[]>([]);
  const [datesError, setDatesError] = useState<string>("");
  const [previousUrls, setPreviousUrls] = React.useState([]);

  React.useEffect(() => {
    axios.get("/tags").then((tagsResponse) => {
      setTagOptions(tagsResponse.data);
    });
  }, []);

  const navigate = useNavigate();

  const INITIAL_VALUES = {
    name: restaurant?.name || "",
    description: restaurant?.description || "",
    tags: restaurant?.tags || [],
    pricePoint: restaurant?.pricePoint || 2,
    phoneNumber: restaurant?.contactInfo?.phoneNumber || "",
    email: restaurant?.contactInfo?.email || "",
    openingTimes: restaurant?.openingTimes || {
      "1": [null, null],
      "2": [null, null],
      "3": [null, null],
      "4": [null, null],
      "5": [null, null],
      "6": [null, null],
      "7": [null, null],
    },
    address: restaurant?.address || "",
    location: restaurant?.location || null,
    url: restaurant?.url || "",
    imgUrl: restaurant?.imgUrl || null,
    isVerified: restaurant?.isVerified || false
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
        time ? dayjs(time).format("HH:mm") : time
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
        pricePoint: formik.values.pricePoint,
        url: formik.values.url,
        isVerified: INITIAL_VALUES.isVerified,
        openingTimes: formatOpeningTimes(formik.values.openingTimes),
        address: formik.values.address,
        imgUrl: imageAsUrl.imgUrl,
        location: formik.values.location,
      };

      if (isEditMode) {
        await axios.patch(`/restaurants/${restaurant.id}`, res).catch((err) => {
          if (axios.isAxiosError(err)) {
            console.log("failed to update restaurant", err.message);

            if ((err.toJSON() as any).status === 400) throw err;
          } else {
            console.log("failed to update restaurant");
          }
        });

        onEditCallback && onEditCallback();
      } else {
        await axios.post("/restaurants", res).catch((err) => {
          if (axios.isAxiosError(err)) {
            console.log("failed to create restaurant", err.message);

            if ((err.toJSON() as any).status === 400) throw err;
          } else {
            console.log("failed to create restaurant");
          }
        });
        console.log(JSON.stringify(res, null, 2));

        navigate("/");
      }
      formik.resetForm();
      formik.setFieldValue("tags", []);
    },
  });

  return (
    <div>
      <Card
        variant="outlined"
        sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
      >
        <CardHeader
          title="Name & Contact Info"
          titleTypographyProps={{ variant: "h6" }}
          sx={{
            backgroundColor: "white",
            borderBottom: "1px solid",
            borderColor: "#d2d2d2",
          }}
        />

        <Grid container spacing={6} sx={{ padding: "24px 32px" }}>
          <Grid
            item
            xs={4}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <TextField
              className="form-input"
              id="name"
              name="name"
              label="Name"
              fullWidth
              size="small"
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              className="form-input"
              id="description"
              name="description"
              label="Description"
              fullWidth
              size="small"
              variant="outlined"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.description)}
              helperText={formik.touched.name && formik.errors.description}
            />
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <TextField
              className="form-input"
              id="email"
              name="email"
              label="Email"
              size="small"
              fullWidth
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              className="form-input"
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              size="small"
              fullWidth
              variant="outlined"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
            />

            <TextField
              className="form-input"
              id="url"
              name="url"
              label="Website"
              size="small"
              fullWidth
              variant="outlined"
              value={formik.values.url}
              onChange={formik.handleChange}
              error={formik.touched.url && Boolean(formik.errors.url)}
              helperText={formik.touched.url && formik.errors.url}
            />
          </Grid>

          <Grid item xs={4}>
            <ImageUpload
              setImageAsUrl={setImageAsUrl}
              imageAsUrl={imageAsUrl}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{ padding: "24px 32px" }}>
          <Grid item xs={8}>
            <Autocomplete
              multiple
              id="restaurant-tags"
              value={formik.values.tags}
              options={tagOptions}
              getOptionLabel={(option) => option}
              defaultValue={formik.values.tags}
              onChange={(event, value) => formik.setFieldValue("tags", value)}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="form-input"
                  variant="outlined"
                  label="Tags"
                  placeholder="Choose your tags"
                  error={formik.touched.tags && Boolean(formik.errors.tags)}
                  helperText={formik.touched.tags && formik.errors.tags}
                />
              )}
            />
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <PriceRating
              getLabelText={(value: number) =>
                `${value} Heart${value !== 1 ? "s" : ""}`
              }
              id="pricePoint"
              name="pricePoint"
              onChange={formik.handleChange}
              value={formik.values.pricePoint}
              defaultValue={2}
              max={4}
              icon={<MoneyIcon fontSize="inherit" />}
              emptyIcon={<MoneyIcon fontSize="inherit" />}
            />
          </Grid>
        </Grid>

        <CardHeader
          title="Location"
          titleTypographyProps={{ variant: "h6" }}
          sx={{
            backgroundColor: "white",
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "#d2d2d2",
          }}
        />
        <ResMap
          setAddress={(value) => formik.setFieldValue("address", value)}
          setLocation={(value) => formik.setFieldValue("location", value)}
          address={formik.values.address}
          location={formik.values.location}
        />

        <CardHeader
          title="Operating Hours"
          titleTypographyProps={{ variant: "h6" }}
          sx={{
            backgroundColor: "white",
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "#d2d2d2",
          }}
        />
        <Box sx={{ padding: "24px 60px" }}>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <Box
              key={day}
              sx={{ display: "flex", padding: "4px 0", height: 50 }}
            >
              <OperatingHoursForm
                dayLabel={dayMapping[day]}
                value={formik.values.openingTimes[day]}
                onChange={(value) => {
                  formik.setFieldValue(`openingTimes[${day}]`, value);
                  validateTimes(formik.values, day);
                }}
              />
            </Box>
          ))}
        </Box>

        <CardActions
          sx={{
            backgroundColor: "#eaeaea",
            padding: "16px 32px",
            justifyContent: "flex-end",
          }}
        >
          <Button
            color="info"
            variant="contained"
            sx={{ borderRadius: 20, width: "100px" }}
            // disabled={datesError != ""}
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};
