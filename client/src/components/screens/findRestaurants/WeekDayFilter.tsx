import React, {useState} from "react";
import Popover from "@mui/material/Popover";
import { Button } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import './WeekDayFilterStyle.css' 
import {dayMapping} from "../../../types/Resturants";

export interface WeekDayFilterProps {
    initialDay?: string;
    initialTime?: string;
    onValueChange: (day: string, time: string) => void;
}

const WeekDayFilter: React.FC<WeekDayFilterProps> = (props): JSX.Element => {
    const {initialDay, initialTime, onValueChange} = props;

    const [day, setDay] = useState<string>(initialDay);
    const [time, setTime] = useState<string>(initialTime);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const onClearPicker = (): void => {
        setDay(null);
        setTime(null);
    }

    const onClosePicker = (): void => {
        onValueChange(day, time);
        setAnchorEl(null);
    }

    const onWeekDayFilterButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onChooseDay = (day: string) => {
        setDay(day);
        !time && setTime('12:00');
    }

    const onChooseTime = (hour: number) => {
        setTime(`${hour}:00`);
    }

    const openStyles = {
        borderColor: "#59d8c9",
        borderWidth: '0.15rem'
    };

    return (
        <div>
            <Button 
                color="inherit"
                variant="outlined"
                endIcon={<AccessTimeIcon />}
                onClick={onWeekDayFilterButtonClick}
                sx={ {
                    height: '40px',
                    textTransform: 'none',
                    color: 'rgba(0, 0, 0, 0.6)',
                    '&:hover': {
                        borderWidth: '0.15rem',
                        backgroundColor: 'transparent'
                    },
                    ...(!!anchorEl && openStyles) 
                }}
            >
                {initialDay ? `${initialDay}, ${initialTime}` : 'Hours'}
            </Button>
            <Popover
                open={!!anchorEl}
                id = {!!anchorEl ? 'dayFilter' : undefined}
                onClose={onClosePicker}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
            >
                <div className="popoverContent">
                    <div className="popoverBody">
                        <div className="dayPickerContent">
                            {
                                Object.keys(dayMapping).map(dayIndex => {
                                    return (
                                        <Button 
                                            key={dayIndex}
                                            variant="outlined"
                                            size="small"
                                            className={`dayButton ${day === dayMapping[dayIndex] && 'activeDayButton'}`}
                                            onClick={() => onChooseDay(dayMapping[dayIndex])}
                                        >
                                            {dayMapping[dayIndex]}
                                        </Button>
                                    )
                                })
                            }
                        </div>
                        <div className="timePickerContent">
                            <div className="hoursButtons">
                                {
                                    [...Array(12).keys()].map(hour => {
                                        return (
                                            <Button
                                                key={hour}
                                                variant="outlined"
                                                size="small"
                                                className={`singleHourButton ${time === `${hour}:00` && 'activeHourButton'}`}
                                                onClick={() => onChooseTime(hour)}
                                            >
                                                {`${hour}:00`}
                                            </Button>
                                        )
                                    })
                                }
                            </div>
                            <div className="hoursButtons">
                                {
                                    [...Array(12).keys()].map(hour => {
                                        return (
                                            <Button
                                                key={hour}
                                                variant="outlined"
                                                size="small"
                                                className={`singleHourButton ${time === `${hour+12}:00` && 'activeHourButton'}`}
                                                onClick={() => onChooseTime(hour+12)}
                                            >
                                                {`${hour+12}:00`}
                                            </Button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="popoverBottom">
                        <Button style={{'color': 'darkblue'}} onClick={onClearPicker}>clear</Button>
                    </div>
                </div>
            </Popover>
        </div>
    )
}

export default WeekDayFilter;