import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useParams } from "react-router";
import { Filters } from "src/types/Group";
import GroupMembersList from "../../GroupMembersList/GroupMembersList";
import TagFilters from "../findRestaurants/TagFilters";
import DateTimeFilter from "../findRestaurants/DateTimeFilter";
import PricePointsFilter from "../findRestaurants/PriceFilter";
import { AllRestaurants } from "../findRestaurants/restaurants/allRestaurants";
import "./GroupView.css";
import { ExtendedGroupData, Group } from "../../../../../server/models/Group";
import { Restaurant } from "src/types/Resturants";
import JoinGroupDialog from "../../JoinGroupDialog/JoinGroupDialog";
import { useNavigate } from "react-router-dom";
import GroupMenu from "../../GroupMenu/GroupMenu";
import CollapsableMap from "src/components/Map/CollapsableMap";
import axios from "axios";

const io = require("socket.io-client");
let socket;

const GroupView: React.FC = (): JSX.Element => {
  const { id } = useParams();
  const [group, setGroup] = useState<Group>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const navigate = useNavigate();
  const curUser = sessionStorage.getItem("user_email");

  const handleApprove = () => {
    const curUser = sessionStorage.getItem("user_email");
    socket.emit("addNewUser", { user: curUser, groupId: id });
    setIsDialogOpen(false);
  };

  const handleCancellation = () => {
    setIsDialogOpen(false);
    navigate("/", { replace: true });
  };

  const handleLeaveGroup = () => {
    socket.emit("leaveGroup", { user: curUser, groupId: id });
    navigate("/");
  };

  function initWebsocket() {
    socket = io();
    socket.emit("joinGroup", { user: curUser, groupId: id });
    socket.on("newUser", (data) => {
      if (sessionStorage.getItem("user_email") === data) {
        setIsDialogOpen(true);
      }
    });
    socket.on("groupDataChanged", (data: ExtendedGroupData) => {
      console.log("received groupDataChanged");
      const { restaurants, ...groupData } = data;
      setGroup(groupData);
      if (restaurants) {
        setRestaurants(restaurants);
      }
    });

    return socket;
  }

  const handleFiltersChange = (newFilters: Filters) => {
    const updatedGroup = { ...group, filters: newFilters } as Group;
    setGroup(updatedGroup);
    socket.emit("filtersUpdate", updatedGroup);
  };

  const handleFilteredRestaurantsChnage = (newFilteredRestaurants) => {
    setFilteredRestaurants(newFilteredRestaurants);
  };

  useEffect(() => {
    const socket = initWebsocket();
    return () => socket.disconnect();
  }, []);

  if (!socket || !group)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%", width: "100%" }}
      >
        <CircularProgress size={60} />
      </Box>
    );

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {group && (
        <JoinGroupDialog
          isOpen={isDialogOpen}
          onApprove={handleApprove}
          onCancellation={handleCancellation}
          group={group}
        ></JoinGroupDialog>
      )}
      <Box sx={{display:'flex', flexDirection: 'column', width: '100%'}}>
        <Box sx={{ display: 'flex', alignItems: 'center', height: 88, borderBottom: '1px solid #c1c1c13d', padding: '24px', paddingRight: '120px',backgroundColor: '#f8f8f8' }}>
            <Box sx={{marginRight: 'auto'}}>
                <Typography variant="h5" >{group.name}</Typography>
                <Typography variant="body1" >{group.creator}'s group</Typography>
            </Box>
          <DateTimeFilter
            filters={group.filters}
            onFiltersChange={handleFiltersChange}
          />
          <PricePointsFilter
            filters={group.filters}
            onFiltersChange={handleFiltersChange}
          />
        </Box>

        <Box sx={{ display: "flex", overflow: "auto", width: "100%", height:'100%' }}>
          <Box sx={{ width: 300, borderRight: '1px solid #c1c1c13d', padding: '8px', backgroundColor: '#f8f8f8'}}>
            <div style={{ display: "flex" }}>
              <GroupMenu onLeaveGroup={handleLeaveGroup}></GroupMenu>
              <Button
                variant="outlined"
                size="medium"
                color="inherit"
                endIcon={<ContentCopyIcon />}
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
                className="CopyToClipboardButton"
              >
                {window.location.href}
                <span className="ContentCopyIcon">
                  <ContentCopyIcon style={{ backgroundColor: "white" }} />
                </span>
              </Button>
            </div>
            <Typography
              color="inherit"
              variant='h5'
            >
              Participants
            </Typography>
            <GroupMembersList group={group}></GroupMembersList>
            <div>
              {group && (
                <TagFilters
                  filters={group?.filters}
                  selectedTags={group.filters.tags}
                  onFiltersChange={handleFiltersChange}
                />
              )}
            </div>
          </Box>
                  <Box sx={{ overflow: 'auto', width: '100%'}}>

                  <AllRestaurants
                    restaurants={restaurants}
                    filters={group?.filters}
                    selectedRestaurant={selectedRestaurant}
                    filteredRestaurants={filteredRestaurants}
                    onFilteredRestaurantsChange={
                      handleFilteredRestaurantsChnage
                    }
                    onRestaurantClick={(restaurant) =>
                      setSelectedRestaurant(restaurant)
                    }
                    pagination={true}
                  />
                  </Box>
        </Box>
      </Box>
      <CollapsableMap
        filters={group?.filters}
        onFiltersChange={handleFiltersChange}
        selectedRestaurant={selectedRestaurant}
        restaurants={filteredRestaurants}
      />
    </Box>
  );
};

export default GroupView;
