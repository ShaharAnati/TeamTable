import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { AllRestaurants } from "../restaurants/allRestaurants";
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const tags = ["meat", "vegan", "good"];

type TagCetegory = "common" | "cuisine" | "kashrut";

type Tag = {
  id: string;
  category: TagCetegory;
  label: string;
};

export const FindRestaurants = (props): JSX.Element => {
  const [chosedTags, setChosedTags] = useState([]);
  const [value, setValue] = React.useState<Date | null>(
    new Date('2018-01-01T00:00:00.000Z'),
  );
  const [day, setDay] = React.useState('');

  const handleTagsChange = (event, value) => {
    setChosedTags(value);
  };

  const handleDayChange = (event: SelectChangeEvent) => {
    setDay(event.target.value as string);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <div style={
          {
            height: ' 100px',
            border: 'black',
            borderWidth: '1px',
            borderStyle: 'dashed'
          }} >Group Details</div>
        <div>
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="start"
                control={<Switch color="primary" />}
                label="Kosher"
                labelPlacement="start"
              />
              <FormControlLabel
                value="start"
                control={<Switch color="primary" />}
                label="Vegan"
                labelPlacement="start"
              />
              <FormControlLabel
                value="start"
                control={<Switch color="primary" />}
                label="Vegetarian"
                labelPlacement="start"
              />
            </FormGroup>
          </FormControl>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={tags}
            getOptionLabel={(option) => option}
            onChange={handleTagsChange}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Filters" />
            )}
          />
        </div>
        <LocalizationProvider dateAdapter={AdapterDateFns} style={{
          display: 'flex',
          flexDirection: 'row'
        }} >
          <TimePicker
            value={value}
            onChange={setValue}
            renderInput={(params) => <TextField {...params} />}
          /> -
          <TimePicker
            value={value}
            onChange={setValue}
            renderInput={(params) => <TextField {...params} />}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Day</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={day}
              label="Day"
              onChange={handleDayChange}
            >
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <MenuItem value={day}>{day}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </LocalizationProvider >
      </Grid>
      <Grid item xs={10}>
        <AllRestaurants chosedTags={chosedTags} day={day} />
      </Grid>
    </Grid>
  );
};
