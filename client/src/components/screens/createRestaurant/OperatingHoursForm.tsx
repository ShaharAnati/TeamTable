import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import React, { useState } from "react";
import { dayMapping } from "src/types/Resturants";

type Props = {
  dayLabel: string;
  value: any;
  onChange: any;
};

const isClosed = (value) => !value || !value.length || !value[0] || !value[1];

function OperatingHoursForm({ dayLabel, value = "", onChange }: Props) {
  const [open, setOpen] = useState(!isClosed(value));

  const handleOpeningChange = (openingValue) => {
    onChange([openingValue, value[1]]);
  };

  const handleClosingChange = (closingValue) => {
    onChange([value[0], closingValue]);
  };

  const handleSwithClose = () => {
    setOpen((open) => {
      if (open) {
        onChange([null, null]);
      }
      return !open;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "4px",
      }}
    >
      <span style={{ width: 140 }}> {dayLabel}</span>

      <Box sx={{ width: 130 }}>
        <FormControlLabel
          control={
            <Switch
              checked={open}
              onChange={handleSwithClose}
              size="small"
              sx={{
                "& .MuiSwitch-track": { bgcolor: "gray" },
              }}
            />
          }
          label={open ? "Open" : "Closed"}
          sx={{ "& .MuiFormControlLabel-label": { paddingLeft: 1 } }}
        />
      </Box>
      {open && (
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Typography variant="overline" textAlign="center" sx={{ width: 70 }}>
            FROM
          </Typography>
          <TimePicker
            ampm={false}
            value={value[0]}
            onChange={handleOpeningChange}
            renderInput={(params) => (
              <TextField size="small" sx={{ width: 130 }} {...params} />
            )}
          />
          <Typography variant="overline" textAlign="center" sx={{ width: 50 }}>
            TO
          </Typography>
          <TimePicker
            ampm={false}
            value={value[1]}
            onChange={handleClosingChange}
            renderInput={(params) => (
              <TextField sx={{ width: 130 }} size="small" {...params} />
            )}
            minTime={value[0]}
          />
        </LocalizationProvider>
      )}
    </div>
  );
}

export default OperatingHoursForm;
