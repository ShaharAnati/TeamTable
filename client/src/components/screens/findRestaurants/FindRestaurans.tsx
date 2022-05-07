import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { AllRestaurants } from "../restaurants/allRestaurants";

const tags = ["meat", "vegan", "good"];

type TagCetegory = "common" | "cuisine" | "kashrut";

type Tag = {
  id: string;
  category: TagCetegory;
  label: string;  
};

export const FindRestaurants = (props): JSX.Element => {
  const [chosedTags, setChosedTags] = useState([]);

  const handleTagsChange = (event, value) => {
    setChosedTags(value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <div>Group Details</div>
        <div>
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
      </Grid>
      <Grid item xs={10}>
        <AllRestaurants chosedTags={chosedTags} />
      </Grid>
    </Grid>
  );
};
