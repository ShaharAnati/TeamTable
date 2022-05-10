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
import restaurants from "./restaurants.json";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "./restaurant.css";

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
  restaurant: any;
  onFavoriteClick?: Function;
  chosedTags: string[];
};

const OpeningHours = ({ openingTimes }): JSX.Element => {
  const dayMapping = {
    "1": "א",
    "2": "ב",
    "3": "ג",
    "4": "ד",
    "5": "ה",
    "6": "ו",
    "7": "ש",
  };

  return (
    <div>
      {Object.keys(dayMapping).map((day) => (
        <div className="openingHours-day-row" key={day}>
          <div className="openingHours-day-label">{dayMapping[day]}</div>
          <div className="openingHours-day-times">
            {openingTimes[day]
              ? `${openingTimes[day][0]} - ${openingTimes[day][1]}`
              : "סגור"}
          </div>
        </div>
      ))}
    </div>
  );
};

const Restaurant = (props: Props): JSX.Element => {
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

export const AllRestaurants = (props): JSX.Element => {
  const { chosedTags, day, filters } = props;

  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);

  useEffect(() => {
    const filterByTags = (restaurant) =>
      !filters.tags ||
      filters.tags?.length === 0 ||
      _.intersection(filters.tags, restaurant.tags).length > 0;

    const filterByDay = (restaurant) =>
      !filters.day || restaurant.openingTimes[filters.day] != null;

    const filterByHour = (restaurant) => {
      const { day, hour } = filters;
      const wasNotChosen = !day || !hour;
      if (wasNotChosen) return true;

      if (!restaurant.openingTimes[day]) return false;

      const openingHour = restaurant.openingTimes[day][0];
      const closingHour = restaurant.openingTimes[day][1];

      return (
        dayjs(`01-01-2000 ${hour}`).isSameOrAfter(
          `01-01-2000 ${openingHour}`
        ) &&
        dayjs(`01-01-2000 ${hour}`).isSameOrBefore(`01-01-2000 ${closingHour}`)
      );
    };

    setFilteredRestaurants(
      restaurants.filter(filterByTags).filter(filterByDay).filter(filterByHour)
    );
  }, [filters]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}
    >
      {filteredRestaurants.map((restaurant, i) => (
        <div key={i} style={{ margin: "16px" }}>
          <Restaurant restaurant={restaurant} chosedTags={filters.tags} />
        </div>
      ))}
    </div>
  );

  return null;
};
