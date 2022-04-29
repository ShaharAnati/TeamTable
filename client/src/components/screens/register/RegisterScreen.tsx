import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Grid, IconButton, InputAdornment, makeStyles, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { LocationState, useAuth } from '../../../auth/AuthProvider';
import './Login.css'
import React from 'react';
import { ConflictError } from 'src/errors/ConflictError';
import validator from 'validator';
import InfoIcon from '@mui/icons-material/Info';

const Register = (): JSX.Element => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [backgroundColor, setBackgroundColor] = useState<string>('');

    const [name, setName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [isUsernameInvalid, setIsUsernameInvalid] = useState<boolean>(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState<boolean>(false);
    const [isPhoneNumberInvalid, setIsPhoneNumberInvalid] = useState<boolean>(false);
    const [isNameInvalid, setIsNameInvalid] = useState<boolean>(false);
    const [doesUserAlreadyExist, setDoesUserAlreadyExist] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState('')
    
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (auth.user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    const validate = (): void => {
        usernameChanged(username)
        passwordChanged(password)
        nameChanged(name)
        phoneNumberChanged(phoneNumber)
        
        if (!isUsernameInvalid && !isNameInvalid && !isPasswordInvalid && !isPhoneNumberInvalid) {
            handleSubmit();
        }
    };

    function checkIfPhoneNumberValid(input_str: string) {
        var regex = /^[0]\d{2}\d{7}$/;

        return regex.test(input_str)
    }

    function checkIfFullNameValid(input_str: string) {
        var regex = /^[a-zA-Z]+\s{1}[a-zA-Z]+$/;

        return regex.test(input_str) 
    }

    function checkIfusernameValid(input_str: string) {
        var regex = /^\S+$/;

        return regex.test(input_str) 
    }

    function usernameChanged(username) {
        checkIfusernameValid(username) ? setIsUsernameInvalid(false) : setIsUsernameInvalid(true);
        setDoesUserAlreadyExist(false);
    }

    function phoneNumberChanged(phoneNumber) {
        checkIfPhoneNumberValid(phoneNumber) ? setIsPhoneNumberInvalid(false) : setIsPhoneNumberInvalid(true);
    }

    function checkIfpasswordValid(input_str: string) {
        if (input_str == "") { 
            return false
        } else if (validator.isStrongPassword(input_str, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setBackgroundColor("#0F9D58");
            return true
        } else {
            setBackgroundColor("#DB4437");
            return false
        }
    }

    function passwordChanged(password) {
        checkIfpasswordValid(password) ? setIsPasswordInvalid(false) : setIsPasswordInvalid(true);
    }
    
    function nameChanged(name) {
        checkIfFullNameValid(name) ? setIsNameInvalid(false): setIsNameInvalid(true);
    }

    const handleSubmit = async () => {
        if (!isUsernameInvalid && !isPasswordInvalid) {
            // proceed to submit
            try {
                await auth.register(username, password);

                const state = location.state as LocationState;
                const from = state?.from?.pathname || "/";

                navigate(from, { replace: true })
            } catch (err) {
                if (err instanceof ConflictError) {
                    setDoesUserAlreadyExist(true);
                }
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <Grid>
                <Paper elevation={10} className={'paper-style'} style={{ padding: '10px' }}>
                    <div style={{ marginBottom: '10px', maxWidth:'500px' }}>
                        <Grid textAlign={'center'}>
                            <h2>Register</h2>
                        </Grid>
                        <TextField label='Username'
                            name="username"
                            placeholder='Enter username'
                            variant="standard"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={isUsernameInvalid || doesUserAlreadyExist }
                            helperText={(isUsernameInvalid && "Username should be one word") || (doesUserAlreadyExist && "This username already exists")}
                            style={{height:'80px' }}
                            fullWidth required />
                        <TextField label='Full Name'
                            name="fullname"
                            placeholder='Enter full name'
                            variant="standard"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={isNameInvalid}
                            helperText={(isNameInvalid && "Full name should contains first & last name with letters")}
                            style={{height:'80px' }}
                            fullWidth required />
                        <TextField label='Phone Number'
                            name="phone"
                            placeholder='Enter phone number'
                            variant="standard"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            error={isPhoneNumberInvalid }
                            helperText={(isPhoneNumberInvalid && "Phone number should contains 10 digits")}
                            style={{height:'80px' }}
                            fullWidth />
                        <TextField label='Password'
                            name="password"
                            placeholder='Enter password'
                            variant="standard"
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={isPasswordInvalid}
                            helperText={isPasswordInvalid && "The password is invalid! Please read the requierments"}
                            fullWidth required 
                            style={{height:'80px' }}
                            InputProps={{
                                startAdornment: (
                                    
                                  <InputAdornment position="start">
                                    <Tooltip 
                                    aria-multiline={true} 
                                    title={
                                        <>
                                        <Typography color="inherit">A strong password must contains:</Typography>
                                        <Typography color="inherit">* At least 8 charcters </Typography>
                                        <Typography color="inherit">* a minimum of 1 lower case letter [a-z]</Typography>
                                        <Typography color="inherit">* a minimum of 1 upper case letter [A-Z]</Typography>
                                        <Typography color="inherit">* a minimum of 1 numeric character [0-9] </Typography>
                                        <Typography color="inherit">* a minimum of 1 special character </Typography>
                                        </>
                                    }>
                                        <InfoIcon />
                                    </Tooltip>
                                  </InputAdornment>
                                ),
                              }}/>
                    </ div>


                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <Button type='submit' color='primary' variant="contained" className={'button-style'} style={{ width: '50%' }} onClick={validate}>Sign up</Button>
                    </div>
                </Paper>
            </Grid>
        </div>
    )
}

export default Register