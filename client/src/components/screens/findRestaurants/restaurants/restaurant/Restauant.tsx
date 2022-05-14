import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Typography,
  } from "@mui/material";
  import Chip from "@mui/material/Chip";
  import _ from "lodash";
  import FavoriteIcon from "@mui/icons-material/Favorite";
  import React, { useEffect, useState } from "react";
  import dayjs from "dayjs";
  import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
  import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
  import "../restaurant.css";
  import {
    dayMapping,
    Restaurant,
  } from "../../../../../types/Resturants";
  
  dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);
  
  const styles = {
    header: {
      display: "flex",
      justifyContent: "space-between",
    },
    title: {
      fontSize: "28px",
    },
  };
  
  type Props = {
    restaurant: Restaurant;
    onFavoriteClick?: Function;
    chosedTags: string[];
  };
  
  const OpeningHours = ({ openingTimes }): JSX.Element => {
    return (
      <div>
        {Object.keys(dayMapping).map((day) => (
          <div className="openingHours-day-row" key={day}>
            <div className="openingHours-day-label">{dayMapping[day]}</div>
            <div className="openingHours-day-times">
              {openingTimes[day] && openingTimes[day].length !== 0 && (openingTimes[day][0] != null && openingTimes[day][1] != null)
                ? `${openingTimes[day][0]} - ${openingTimes[day][1]}`
                : "סגור"}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export const RestaurantComponent = (props: Props): JSX.Element => {
    const { restaurant, chosedTags = [] } = props;
    const { name, description, tags, imgUrl, openingTimes } = restaurant;
  
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={imgUrl}
          alt="green iguana"
        />
        <CardContent>
          <div style={styles.header}>
            <div style={styles.title}>{name}</div>
            <IconButton>
              <FavoriteIcon />
            </IconButton>
          </div>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
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
          <OpeningHours openingTimes={openingTimes} />
        </CardContent>
      </Card>
    );
  };

  export default RestaurantComponent;