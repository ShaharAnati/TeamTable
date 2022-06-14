import React, {useEffect, useState} from "react";
import {Button, Collapse, Grid, Paper, TextField, Typography} from "@mui/material";
import axios from "axios";
import * as _ from 'lodash';
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

const UserProfile = (): JSX.Element => {
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [editSuccessAlertOpen, setEditSuccessAlertOpen] = useState(false);
    const [editFailedAlertOpen, setEditFailedAlertOpen] = useState(false);
    const [user, setUser] = useState({email: '',
        password: '',
        phoneNumber: '',
        fullName: '',
        isAdmin: false,
        likedRestaurants: []
    });
    const [phoneNumberErrorText, setPhoneNumberErrorText] = useState<string>('')
    const [fullnameErrorText, setFullnameErrorText] = useState<string>('');

    const [areAllFieldsValid, setAreAllFieldsValid] = useState<boolean>(false);
    const REQUIRED_FIELDS = [username, fullName, phoneNumber];
    const userRef = React.useRef(user);

    const setCurUser = x => {
        userRef.current = x; // keep updated
        setUser(x);
    };

    useEffect(() => {
        axios.get(`users/${sessionStorage.getItem("user_email")}`).then(res => {
            let fetchedUser = _.clone(res.data);
            setCurUser(fetchedUser);
            setUsername(_.clone(userRef.current.email));
            setPhoneNumber(_.clone(userRef.current.phoneNumber));
            setFullName(_.clone(userRef.current.fullName));
        })
    }, [])

    useEffect(() => {
        setAreAllFieldsValid(
            REQUIRED_FIELDS.every(field => field && field.length > 0) &&
            !!!fullnameErrorText &&
            !!!phoneNumberErrorText &&
            (userRef.current.phoneNumber !== phoneNumber || userRef.current.fullName !== fullName)
        )
    }, [
        username,
        fullName,
        phoneNumber,
        fullnameErrorText,
        phoneNumberErrorText,
        userRef.current
    ])

    const validateFullName = (fullname: string): void => {
        const regex = /^[a-zA-Z]+\s{1}[a-zA-Z]+$/;
        if (!fullname) {
            setFullnameErrorText('Field is required')
        } else {
            setFullnameErrorText(regex.test(fullname) ? '' : 'Full name should contain only first and last names')
        }

    }

    const validatePhoneNumber = (phoneNumber: string): void => {
        const regex = /^[0]\d{2}\d{7}$/;

        if (!phoneNumber) {
            setPhoneNumberErrorText('Field is required');
        } else {
            setPhoneNumberErrorText(regex.test(phoneNumber) ? '' : 'Please enter a valid 10 digit phone number')
        }
    }

    const handleSubmit = async () => {
        try {
            userRef.current.phoneNumber = phoneNumber;
            userRef.current.fullName = fullName;

            let editedUser = userRef.current;

            await axios.patch(`users/${username}`, {editedUser});
            setEditSuccessAlertOpen(true);
        } catch (err) {
            console.log(err);
            setEditFailedAlertOpen(true)
        }

    };

    return (<div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <Grid>
            <Paper elevation={0} classes={{ root: 'paper-style' }} >
                <Grid textAlign={'center'}>
                    <Typography variant='h5' color='primary' sx={{fontWeight: 600, margin: '24px 0'}}>
                        My Profile
                    </Typography>
                </Grid>
                <div style={{ marginBottom: '10px', maxWidth:'500px' }}>
                    <TextField label='Username'
                               name="username"
                               variant="outlined"
                               value={username}
                               helperText={' '}
                               disabled={true}
                               fullWidth
                               required
                    />
                    <TextField label='Full Name'
                               name="fullname"
                               placeholder='Enter full name'
                               variant="outlined"
                               value={fullName}
                               onChange={(e) => setFullName(e.target.value)}
                               onBlur={() => validateFullName(fullName)}
                               error={!!fullnameErrorText}
                               helperText={fullnameErrorText || ' '}
                               fullWidth required
                    />
                    <TextField label='Phone Number'
                               name="phone"
                               placeholder='Enter phone number'
                               variant="outlined"
                               value={phoneNumber}
                               onChange={(e) => setPhoneNumber(e.target.value)}
                               onBlur={() => validatePhoneNumber(phoneNumber)}
                               error={!!phoneNumberErrorText }
                               helperText={phoneNumberErrorText || ' '}
                               fullWidth
                    />
                </ div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type='submit'
                        color='primary'
                        variant="contained"
                        className={'button-style'}
                        disabled={!areAllFieldsValid}
                        onClick={() => handleSubmit()}
                        fullWidth
                    >
                        Save details
                    </Button>
                </div>
                <Collapse in={editSuccessAlertOpen}>
                    <Alert
                        severity={"success"}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setEditSuccessAlertOpen(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        Your profile was edited successfully!
                    </Alert>
                </Collapse>
                <Collapse in={editFailedAlertOpen}>
                    <Alert
                        severity={"error"}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setEditFailedAlertOpen(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        Something went wrong with your profile editing...
                    </Alert>
                </Collapse>
            </Paper>
        </Grid>
    </div>
    )
}

export default  UserProfile;