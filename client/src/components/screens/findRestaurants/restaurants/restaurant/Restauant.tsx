import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteIcon from "@mui/icons-material/Favorite";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import { useAuth } from 'src/auth/AuthProvider';
import { dayMapping, Restaurant } from "../../../../../types/Resturants";
import "../restaurant.css";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "1.3vw",
    fontWeight: "bold",
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
            {openingTimes[day] &&
              openingTimes[day].length !== 0 &&
              openingTimes[day][0] != null &&
              openingTimes[day][1] != null
              ? `${openingTimes[day][0]} - ${openingTimes[day][1]}`
              : "closed"}
          </div>
        </div>
      ))}
    </div>
  );
};

// TODO: opening hours
export const RestaurantComponent = (props: Props): JSX.Element => {
  const { restaurant, chosedTags = [] } = props;
  const { id, name, description, tags, imgUrl, openingTimes } = restaurant;

  const { loggedInUser, likedRestaurants, removeRestaurantFromLiked, addRestaurantToLiked } = useAuth();

  const [isLiked, setIsLiked] = useState<boolean>(false)

  useEffect(() => {
    if (loggedInUser) {
      setIsLiked(!!likedRestaurants.find(currId => currId == id))
    }

  }, [likedRestaurants])

  const handleLikeClicked = async (): Promise<void> => {
    try {
      const res: AxiosResponse<any> = await axios.patch("/users/like-restaurant", {
        email: sessionStorage.getItem("user_email"),
        restaurantId: id
      });

      addRestaurantToLiked(id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("failed to like restaurant", error.message);

        if ((error.toJSON() as any).status === 400) throw error;
      } else {
        console.log("failed to like restaurant");
      }
    }
  }

  const handleUnLikeClicked = async (): Promise<void> => {
    try {
      const res: AxiosResponse<any> = await axios.patch("/users/unlike-restaurant", {
        email: sessionStorage.getItem("user_email"),
        restaurantId: id
      });

      removeRestaurantFromLiked(id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("failed to like restaurant", error.message);

        if ((error.toJSON() as any).status === 400) throw error;
      } else {
        console.log("failed to like restaurant");
      }
    }
  }

  return (
    <Card sx={{ width: "270px", height: "250px", margin: "auto" }}>
      <CardMedia
        component="img"
        height="140"
        image={imgUrl}
        alt="green iguana"
      />
      <CardContent style={{ padding: "1% 3%" }}>
        <div style={styles.header}>
          <div style={styles.title}>{name}</div>
          {loggedInUser && <IconButton
            style={{
              padding: 0,
              height: "inherit",
              color: isLiked ? "red" : "gray"
            }}
            onClick={isLiked ? handleUnLikeClicked : handleLikeClicked}
          >
            <FavoriteIcon />
          </IconButton>}
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
        <div style={{ textAlign: "right" }}>
          <Tooltip
            title={
              <div>
                <OpeningHours openingTimes={openingTimes} />
              </div>
            }
          >
            <IconButton
              style={{
                padding: 0,
                height: "inherit"
              }}
            >
              <AccessTimeIcon />
            </IconButton>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantComponent;
