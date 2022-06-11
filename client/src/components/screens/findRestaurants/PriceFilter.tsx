import * as React from "react";
import * as Ramda from "ramda";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import { Filters } from "../../../types/Group";

type Props = {
  onFiltersChange: (filters: Filters) => void;
  filters: Filters;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const pricePoints = [1, 2, 3, 4];

const priceText = {
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$",
};

export default function PricePointsFilter({ onFiltersChange, filters }: Props) {
//   const [selectedPriceRange, setSelectedPriceRange] = React.useState<number[]>(
//     []
//   );

  const handleChange = (
    event: SelectChangeEvent<number[]>
  ): void => {
    const {
      target: { value },
    } = event;

    // setSelectedPriceRange(
    //   // On autofill we get a stringified value.
    //   typeof value === "string" ? value.split(",").map(Number) : value
    // );

    onFiltersChange({
      ...filters,
      priceRange: typeof value === "string" ? value.split(",").map(Number) : value,
    });
  };

  const renderValue = (value: number[]): string => {
    // value.
    if (value.length === 1) {
      return priceText[value[0]];
    }

    const sortedRange: number[] = Ramda.sort((a, b) => a - b, value);
    const fullRange: number[] = Ramda.range(
      sortedRange[0],
      sortedRange[sortedRange.length - 1] + 1
    );

    if (sortedRange.length === fullRange.length)
      return `${priceText[sortedRange[0]]}-${
        priceText[sortedRange[sortedRange.length - 1]]
      }`;
    else return sortedRange.map((val) => priceText[val]).join(",");
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Price Range</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={filters.priceRange || []}
          onChange={handleChange}
          input={<OutlinedInput label="Price Range" />}
          renderValue={(selected) => renderValue(selected)}
          MenuProps={MenuProps}
        >
          {pricePoints.map((price) => (
            <MenuItem key={price} value={price}>
              <Checkbox checked={filters.priceRange ? filters.priceRange.indexOf(price) > -1 : false} />
              <ListItemText primary={priceText[price]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
