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
import React from "react";
import restaurants from "./restaurants.json";
import "./restaurant.css";

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
  onFavoriteClick?: Function;
  name: string;
  description: string;
  tags: string[];
  chosedTags: string[];
  imgUrl: string;
};

const Restaurant = (props: Props): JSX.Element => {
  const { name, description, imgUrl, tags, chosedTags } = props;

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
      </CardContent>
    </Card>
  );
};

export const AllRestaurants = (props): JSX.Element => {
  const { chosedTags, day } = props;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}
    >
      {restaurants
        .filter(
          (rest) =>
            chosedTags.length === 0 ||
            _.intersection(chosedTags, rest.tags).length > 0
        ).filter(rest => (
          rest.openingTimes[day] != null
        ))
        .map((restaurant, i) => (
          <div key={i} style={{ margin: "16px" }}>
            <Restaurant
              name={restaurant.name}
              description={restaurant.description}
              imgUrl={restaurant.imgeUrl}
              tags={restaurant.tags}
              chosedTags={chosedTags}
            />
          </div>
        ))}
    </div>
  );

  return null;
};
