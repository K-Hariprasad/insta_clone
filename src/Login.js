import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {auth} from  './FirebaseConfig';
import {Link} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import Spinner from './Spinner';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

function Login({isUser}) {
  let history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [loading, setLoading] = useState(false);

  const handleSignin = (e) => {
    e.preventDefault();
    setLoading(true)
    auth.signInWithEmailAndPassword(email,password).then(authUser => {
      isUser(authUser.displayName)
      setLoading(false)
      history.push("/");
    }).catch(error=>{
      alert(error.message)
      setLoading(false)})
  }
    return (
      <div className="login_main">
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} onSubmit={handleSignin} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email" 
                label="Email Address"
                name="email"
                autoFocus
                onChange = {(e)=>setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange = {(e)=>setPassword(e.target.value)}
              />

              {loading?<Spinner/>:<Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>}
              <Grid container>
                <Grid item>
                  <Link to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </div>
    );
}

export default Login

