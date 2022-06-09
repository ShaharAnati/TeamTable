import {Filters} from "../../../types/Group";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import {dayMapping} from "../../../types/Resturants";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import {FormHelperText} from "@mui/material";

type Props = { onFiltersChange: Function, filters: Filters };

function DateTimeFilter({ onFiltersChange, filters }: Props): JSX.Element {

    const handleClear = () => {
        onFiltersChange({
            ...filters,
            day: null,
            hour: null
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

    return (<div><LocalizationProvider
        dateAdapter={AdapterDayjs}
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end"
        }}>
        <TimePicker
            label="Hour"
            value={filters.hour ? dayjs(`01-01-2000 ${filters.hour}`) : null}
            onChange={handleHourChange}
            renderInput={(params) => <TextField {...params}
                                                error={!filters.hour && !!filters.day}
                                                helperText={!filters.hour && !!filters.day ?
                                                    "pick opening time" : null}/>}
        />
        <FormControl style={{ width: "10vw" }}>
            <InputLabel id="demo-simple-select-label">Day</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filters.day || ""}
                label="Day"
                onChange={handleDayChange}
                error={!!filters.hour && !filters.day}
            >
                {Object.keys(dayMapping).map((day) => (
                    <MenuItem key={day} value={day}>
                        {dayMapping[day]}
                    </MenuItem>
                ))}
            </Select>
            {(!!filters.hour && !filters.day) ?
                (<FormHelperText style={{color: "#d32f2f"}}>pick a day</FormHelperText>) : null
            }
        </FormControl>
    </LocalizationProvider>
    <IconButton aria-label="delete" onClick={handleClear}>
        <ClearIcon />
    </IconButton></div>)
}

export default DateTimeFilter;