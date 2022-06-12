import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/auth/AuthProvider";
import Participants from "src/components/Participants/Participants";
import useUserGroups from "src/hooks/useUserGroups";

type Props = {};

function GroupsList({}: Props) {
  const { loggedInUser } = useAuth();
  const query = useUserGroups(loggedInUser.email);
  const navigate = useNavigate();

  if (query.isLoading) {
    return null;
  }

  return (
    <Container sx={{ padding: "32px 0" }}>
      <Box sx={{ height: 70 }}>
        <Typography variant="h4">Your Recent Groups</Typography>
        <Divider />
      </Box>
      <Grid container spacing={3}>
        {query.data.map((group: any) => {
          const isActive = group.members.some((member) => member.active);

          return (
            <Grid item xs={4} key={group.id}>
              <Paper
                variant="outlined"
                sx={{
                  height: "100%",
                  boxSizing: "border-box",
                  padding: "16px 20px",
                  borderRadius: "18px",
                  cursor: "pointer",
                  "&:hover": {
                    border: 1,
                    borderColor: "primary.main",
                  },
                }}
                onClick={() => navigate(`/group-page/${group.id}`)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        width: "fit-content",
                        background: isActive ? "#49c25e" : "#c24949",
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "10px",
                        padding: "2px 4px",
                      }}
                    >
                      {isActive ? "ACTIVE" : "STALE"}
                    </Box>
                    <Typography variant="h6"> {group.name}</Typography>
                  </Box>
                  <Participants
                    members={group.members.filter(
                      (member) => member.username !== loggedInUser.email
                    )}
                    max={3}
                  />
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default GroupsList;
