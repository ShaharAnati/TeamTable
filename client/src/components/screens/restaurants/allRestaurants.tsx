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
import FavoriteIcon from "@mui/icons-material/Favorite";
import React from "react";
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
  imgUrl: string;
};

const Restaurant = (props: Props): JSX.Element => {
  const { name, description, imgUrl, onFavoriteClick } = props;

  const handleFavoriteClick = () => {
    if (onFavoriteClick) {
      onFavoriteClick();
    }
  };

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
          <IconButton onClick={handleFavoriteClick}>
            <FavoriteIcon />
          </IconButton>
        </div>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const AllRestaurants = (props): JSX.Element => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}
    >
      {Array.from(Array(30)).map((a, i) => (
        <div key={i} style={{ margin: "16px" }}>
          <Restaurant
            name={"ddsds"}
            description={"sdfdsfsd"}
            imgUrl={
              "https://media.istockphoto.com/photos/table-top-view-of-spicy-food-picture-id1316145932?b=1&k=20&m=1316145932&s=170667a&w=0&h=feyrNSTglzksHoEDSsnrG47UoY_XX4PtayUPpSMunQI="
            }
          />
        </div>
      ))}
    </div>
  );

  return null;
};
