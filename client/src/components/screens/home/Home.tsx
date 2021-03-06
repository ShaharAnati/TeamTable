import React from "react";
import {Link} from "react-router-dom";
// @ts-ignore
import TeamTableTheme from '../../../../assets/images/TeamTableTheme.jpg';
import {Box, Button, Container, Paper, Typography} from "@mui/material";
import {ArrowForward} from "@mui/icons-material";

const Home: React.FC = (props): JSX.Element => {

    return (
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg">
                <Paper sx={{backgroundImage: `url(${TeamTableTheme})`, height: 450}}>
                    <Box sx={{display: "flex",
                        flexDirection: "column",
                        justifyContent: "end",
                        width: "fit-content",
                        marginBottom: 15,
                        marginLeft: 10,
                        height: "-webkit-fill-available"}}>
                    <Typography sx={{backgroundColor: "white", marginBottom: 1, paddingX: 3}}>
                        Let us find you the perfect restaurant
                    </Typography>
                    <Button 
                        variant="contained"
                        endIcon={<ArrowForward />}
                        component={Link}
                        to="/create-group-screen"
                        sx={{backgroundColor: '#3ED3D6'}}
                    >
                        Find us a table
                    </Button>
                    <Button 
                        variant="contained"
                        to="/create-restaurant"
                        component={Link}
                        size="small"
                        sx={{backgroundColor: '#0a6c6e'}}
                    >
                        Add Restaurant
                    </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Home;
