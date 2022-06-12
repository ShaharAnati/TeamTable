import React, {useEffect} from "react";
import {TextField} from "@mui/material";
import axios from "axios";
import {User} from "../../../types/User";

const UserProfile = (): JSX.Element => {
    let user: User;

    useEffect(() => {
        axios.get(`users/${sessionStorage.getItem("user_email")}`).then(res => {
            user = res.data;
            console.log(user);
        })
    })

    return (<div>
        <TextField id="username" label="username/email" variant="outlined" disabled={true}/>
        <TextField id="fullName" label="full name" variant="outlined" disabled={true}/>
        <TextField id="phoneNumber" label="phone number" variant="outlined" disabled={true}/>
    </div>)
}

export default  UserProfile;