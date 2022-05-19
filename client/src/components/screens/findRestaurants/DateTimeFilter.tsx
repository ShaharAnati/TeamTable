import {Filters} from "../../../types/Filters";
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

type Props = { onFiltersChange: Function, filters: Filters };

function DateTimeFilter({onFiltersChange, filters}: Props): JSX.Element {
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

    return (<LocalizationProvider
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
            renderInput={(params) => <TextField {...params} />}
        />
        <FormControl style={{width: "10vw"}}>
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
    </LocalizationProvider>)
}

export default DateTimeFilter;