import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Button, Grid, Paper, TextField, Typography} from "@mui/material";
import {LocationState, useAuth} from '../../../auth/AuthProvider';

interface LoginScreenProps {
    postLoginFunc?: () => void
}

const Login: React.FC<LoginScreenProps> = (props): JSX.Element => {
    const { postLoginFunc } = props;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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
                await auth.signin(username, password);

                const { state } = location as { state: LocationState }
                const navigationDest = state?.from?.pathname || "/";

                postLoginFunc && postLoginFunc();
                navigate(navigationDest, { replace: true })

            } catch (err) {
                // Failed login. show something to the user
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <Grid>
                <Paper elevation={0} classes={{root: 'paper-style'}}>
                    <div style={{ marginBottom: '10px' }}>
                        <Grid textAlign={'center'}>
                            <Typography variant='h5' color='primary' sx={{fontWeight: 600, margin: '24px 0'}}>
                                Hi, Welcome Back
                            </Typography>
                            <Typography variant="subtitle1" sx={{color: '#9e9e9e', margin: '24px 0'}}>
                                Enter your credentials to continue
                            </Typography>
                        </Grid>
                        <TextField label='Username / Email Address'
                            name="username"
                            variant="outlined"
                            value={username}
                            onChange={usernameChange}
                            error={isUsernameInvalid}
                            helperText={isUsernameInvalid ? "required field" : ' '}
                            fullWidth required />
                        <TextField label='Password'
                            name="password"
                            variant="outlined"
                            type='password'
                            value={password}
                            onChange={passwordChange}
                            error={isPasswordInvalid}
                            helperText={isPasswordInvalid ? "required field" : ' '}
                            fullWidth required />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type='submit' color='primary' variant="contained" className={'button-style'} onClick={validate} fullWidth>Sign in</Button>
                    </div>

                    <Typography
                        variant="subtitle2"
                        sx={{
                            width: "fit-content",
                            color: "#414141",
                            fontWeight: 600,
                            margin: "auto",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/register-screen", { state: { from: location }, replace: true })}
                        >
                        Don't have an account?
                    </Typography>
                </Paper>
            </Grid>
        </div>
    )
}

export default Login;
