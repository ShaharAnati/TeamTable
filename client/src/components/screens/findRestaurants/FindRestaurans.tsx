import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { AllRestaurants } from "./restaurants/allRestaurants";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TagFilters from "./TagFilters";
import "./FindRestaurans.css";
import { Filters } from "src/types/Filters";

const tags = [
  "meat",
  "vegan",
  "good",
  "dsfsd",
  "gdfsf",
  "dfhfgfdgdf",
  "sdfgsdg",
  "fsdfdsfs",
  "dsfdsf",
];

type TagCetegory = "common" | "cuisine" | "kashrut";

export const FindRestaurants = (props): JSX.Element => {
  // const [filters, setFilters] = useState<Filters>({});

  const { filters, onFiltersChange } = props;

  const handleTagsChange = (value) => {
    onFiltersChange({
      ...filters,
      tags: value,
    });
  };

  const handleDayChange = (event: SelectChangeEvent, value) => {
    onFiltersChange({
      ...filters,
      day: event.target.value,
    });
  };

  const handleHourChange = (value) => {
    onFiltersChange({
      ...filters,
      hour: dayjs(value).format("HH:mm"),
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <div>
          <TagFilters
            tags={tags}
            selectedTags={filters.tags}
            onChange={handleTagsChange}
          />
        </div>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <TimePicker
            label="Hour"
            value={filters.hour ? dayjs(`01-01-2000 ${filters.hour}`) : null}
            onChange={handleHourChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Day</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filters.day || ""}
              label="Day"
              onChange={handleDayChange}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </LocalizationProvider>
      </Grid>
      <Grid item xs={10}>
        <AllRestaurants filters={filters} />
      </Grid>
    </Grid>
  );
};
