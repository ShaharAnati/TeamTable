import {Card, CardContent, CardMedia, IconButton, Tooltip, Typography,} from "@mui/material";
import Chip from "@mui/material/Chip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import React from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "../restaurant.css";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);
  
  const styles = {
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    title: {
      fontSize: "1.3vw",
      fontWeight: "bold"
    },
  };
  
  type Props = {
    restaurant: any;
    onFavoriteClick?: Function;
    chosedTags: string[];
  };
  
  const OpeningHours = ({ openingTimes }): JSX.Element => {
    const dayMapping = {
      "1": "Sunday",
      "2": "Monday",
      "3": "Tuesday",
      "4": "Wednesday",
      "5": "Thursday",
      "6": "Friday",
      "7": "Saturday",
    };

    return (
      <div>
        {Object.keys(dayMapping).map((day) => (
          <div className="openingHours-day-row" key={day}>
            <div className="openingHours-day-label">{dayMapping[day]}</div>
            <div className="openingHours-day-times">
              {openingTimes[day] && openingTimes[day].length !== 0
                ? `${openingTimes[day][0]} - ${openingTimes[day][1]}`
                : "closed"}
            </div>
          </div>
        ))}
      </div>
    );
  };
  // TODO: opening hours
  export const Restaurant = (props: Props): JSX.Element => {
    const { restaurant, chosedTags = [] } = props;
    const { name, description, tags, imgUrl, openingTimes } = restaurant;

    return (
      <Card sx={{ width: "17vw", height: "45vh" }}>
        <CardMedia
          component="img"
          height="140"
          image={imgUrl}
          alt="green iguana"
        />
        <CardContent style={{padding: "3%"}}>
          <div style={styles.header}>
            <div style={styles.title}>{name}</div>
            <IconButton style={{
              padding: 0,
              height: "inherit"
            }}>
              <FavoriteIcon/>
            </IconButton>
          </div>
          <div>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          </div>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              {...(chosedTags.includes(tag)
                ? { variant: "filled", color: "success" }
                : {})}
            />
          ))}
          <div style={{textAlign: "right"}}>
            <Tooltip title={<div><OpeningHours openingTimes={openingTimes}/></div>}>
              <IconButton style={{
                padding: 0,
                height: "inherit"
              }}>
                <AccessTimeIcon/>
              </IconButton>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    );
  };