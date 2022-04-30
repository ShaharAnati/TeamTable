import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { LocationState, useAuth } from '../../../auth/AuthProvider';
import './Login.css'
import React from 'react';
import { ConflictError } from 'src/errors/ConflictError';

const Register = (): JSX.Element => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isUsernameInvalid, setIsUsernameInvalid] = useState<boolean>(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState<boolean>(false);
    const [doesUserAlreadyExist, setDoesUserAlreadyExist] = useState<boolean>(false);

    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (auth.loggedInUser) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    const validate = (): void => {
        if (!!username) {
            setIsUsernameInvalid(false);
        } else {
            setIsUsernameInvalid(true);
        }

        if (!!password) {
            setIsPasswordInvalid(false);
        } else {
            setIsPasswordInvalid(true);
        }
        handleSubmit();
    };

    function usernameChange(event: any) {
        setIsUsernameInvalid(false);
        setDoesUserAlreadyExist(false);
        setUsername(event.target.value);
    }

    function passwordChange(event: any) {
        setIsPasswordInvalid(false);
        setPassword(event.target.value);
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Grid>
                <Paper elevation={10} className={'paper-style'} style={{ padding: '10px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <Grid textAlign={'center'}>
                            <h2>Register</h2>
                        </Grid>
                        <TextField label='Username'
                            name="username"
                            placeholder='Enter username'
                            variant="standard"
                            value={username}
                            onChange={usernameChange}
                            error={isUsernameInvalid || doesUserAlreadyExist}
                            helperText={(isUsernameInvalid && "required field") || (doesUserAlreadyExist && "This username already exists")}
                            fullWidth required />
                        <TextField label='Password'
                            name="password"
                            placeholder='Enter password'
                            variant="standard"
                            type='password'
                            value={password}
                            onChange={passwordChange}
                            error={isPasswordInvalid}
                            helperText={isPasswordInvalid && "required field"}
                            fullWidth required />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type='submit' color='primary' variant="contained" className={'button-style'} style={{ width: '50%' }} onClick={validate}>Sign up</Button>
                    </div>
                </Paper>
            </Grid>
        </div>
    )
}

export default Register;
