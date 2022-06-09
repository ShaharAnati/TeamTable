import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Paper,
  Typography,
  Chip,
  Grid,
  Divider,
  Button,
  CardActions,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Public as PublicIcon,
} from "@mui/icons-material";
import { Restaurant, PLACEHOLDER_IMAGE_URL } from "src/types/Resturants";

type Props = {
  restaurant: Restaurant;
  onApprove?: Function;
  onDecline?: Function;
  onEdit?: Function;
};

const dayMapping = {
  "1": "Sun",
  "2": "Mon",
  "3": "Tue",
  "4": "Wed",
  "5": "Thu",
  "6": "Fri",
  "7": "Sat",
};

function RestaurantListItem({
  restaurant,
  onApprove,
  onDecline,
  onEdit,
}: Props) {
  return (
    <Card
      elevation={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: 540,
        height: "100%",
        width: 450,
        borderRadius: 8,
      }}
    >
      <CardMedia
        component="img"
        sx={{ height: 200, width: "100%" }}
        image={restaurant.imgUrl ? restaurant.imgUrl : PLACEHOLDER_IMAGE_URL}
      />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <CardContent
          sx={{ flex: "1 0 auto", position: "relative", paddingTop: 0 }}
        >
          <Box
            sx={{
              position: "absolute",
              background: "white",
              width: "100%",
              height: 32,
              top: -32,
              borderRadius: "32px 32px 0 0",
              left: 0,
            }}
          >
            <Typography
              variant="h5"
              sx={{ paddingLeft: 4, paddingRight: 4, paddingTop: 2 }}
            >
              {restaurant.name}
            </Typography>

            <Box sx={{ position: "absolute", top: -10, right: 44 }}>
              <Chip
                label={restaurant.isVerified ? "Verified" : "Unverified"}
                color={restaurant.isVerified ? "success" : "error"}
                size="small"
                sx={{ border: "1px solid white" }}
              ></Chip>
            </Box>
          </Box>

          <Box sx={{ minHeight: 72, paddingLeft: 2, paddingTop: 3 }}>
            <Typography variant="subtitle2">
              {restaurant.description}
            </Typography>
          </Box>

          <Grid container sx={{ minHeight: 180, padding: "0 16px" }}>
            <Grid item xs={6}>
              <Box>
                <Box sx={{ display: "flex", paddingBottom: 2 }}>
                  <BusinessIcon fontSize="small" />
                  <Typography variant="body2" sx={{ paddingLeft: 1 }}>
                    YL Perets 6, Tel Aviv
                  </Typography>
                </Box>
                {restaurant.contactInfo?.phoneNumber && (
                  <Box sx={{ display: "flex", paddingBottom: 2 }}>
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body2" sx={{ paddingLeft: 1 }}>
                      {restaurant.contactInfo.phoneNumber}
                    </Typography>
                  </Box>
                )}
                {restaurant.contactInfo?.email && (
                  <Box sx={{ display: "flex", paddingBottom: 2 }}>
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2" sx={{ paddingLeft: 1 }}>
                      {restaurant.contactInfo.email}
                    </Typography>
                  </Box>
                )}
                {restaurant.url && (
                  <Box sx={{ display: "flex", paddingBottom: 2 }}>
                    <PublicIcon fontSize="small" />
                    <Typography variant="body2" sx={{ paddingLeft: 1 }}>
                      {restaurant.url}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={6}>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const openingTimes = restaurant.openingTimes;
                return (
                  <Box
                    key={day}
                    sx={{ display: "flex" }}
                    justifyContent="flex-end"
                  >
                    <Typography
                      variant="body2"
                      sx={{ width: 54, textAlign: "start" }}
                    >
                      {dayMapping[day]}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ width: 90, textAlign: "end", whiteSpace: "nowrap" }}
                    >
                      {openingTimes[day] &&
                      openingTimes[day].length !== 0 &&
                      openingTimes[day][0] != null &&
                      openingTimes[day][1] != null
                        ? `${openingTimes[day][0]} - ${openingTimes[day][1]}`
                        : "closed"}
                    </Typography>
                  </Box>
                );
              })}
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", padding: "0 16px" }}>
            {restaurant.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                size="small"
                sx={{ marginRight: 1 }}
              />
            ))}
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <Box sx={{ display: "flex", width: "100%", padding: 1 }}>
            <Button
              variant="text"
              size="small"
              color="info"
              disableElevation
              sx={{ marginRight: "auto", borderRadius: 4 }}
              onClick={() => onEdit && onEdit(restaurant.id)}
            >
              Edit
            </Button>
            {!restaurant.isVerified && (
              <Button
                variant="outlined"
                size="small"
                color="info"
                disableElevation
                sx={{ borderRadius: 4 }}
                onClick={() => onDecline && onDecline(restaurant.id)}
              >
                Decline
              </Button>
            )}
            {!restaurant.isVerified && (
              <Button
                variant="contained"
                size="small"
                disableElevation
                sx={{ marginLeft: "12px", borderRadius: 4 }}
                color="success"
                onClick={() => onApprove && onApprove(restaurant.id)}
              >
                Approve
              </Button>
            )}
            {restaurant.isVerified && (
              <Button
                variant="outlined"
                size="small"
                disableElevation
                sx={{ marginLeft: "12px", borderRadius: 4 }}
                color="error"
                onClick={() => onDecline && onDecline(restaurant.id)}
              >
                Unverify
              </Button>
            )}
          </Box>
        </CardActions>
      </Box>
    </Card>
  );
}

export default RestaurantListItem;
