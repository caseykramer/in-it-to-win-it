import './App.css';
import React from 'react'
import {pickWinner} from './actions'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles';
import Typeography from './modules/components/Typeography'
import Backdrop from '@material-ui/core/Backdrop'
import Candidate from './modules/components/Candidate'
import Button from './modules/components/Button'
import WinnerDialog from './modules/components/WinnerDialog'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 1000
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },

}));

function App(props) {
  const classes = useStyles();
  const open = props.namesLoading   
  return (
    <div className={classes.root}>
      <Paper elevation="5" className={classes.paper}>
          <Grid container spacing={2}          
            alignItems="center">
              <Grid item xs="12">
                <img src="/logo.png" alt="In It to Win It" width="400" />
              </Grid>
              <Grid item xs="12">
                <Typeography variant="h1">In It to Win It!</Typeography>
              </Grid>
              <Grid item xs="12">
                <hr />
              </Grid>
            <Grid item xs="12">
            <Backdrop className={classes.backdrop} open={open}><CircularProgress color="inherit"></CircularProgress></Backdrop>
            <Typeography variant="h5">Who is going to win</Typeography>
            </Grid>
            <Grid item xs="12">
              <Candidate />
            </Grid>
            <Grid item xs="12">
              <Button variant="contained" color="primary" size="large" disabled={props.hasWinner} onClick={() => props.onClick(props.names)}>Lets pick a winner!</Button>
            </Grid>
            <Grid item xs="12">
              <WinnerDialog hasWinner={props.hasWinner} />
            </Grid>
          </Grid>
      </Paper>
    </div>
  );
}

const mapStateToProps = state => ({
  namesLoading: state.isLoading,
  names: state.names,
  hasWinner: state.hasWinner || state.names.length === 0,
  winner: state.winner
});

const mapDispatchToProps = (dispatch) => ({
  onClick: (names) => dispatch(pickWinner(names))
})

export default connect(mapStateToProps,mapDispatchToProps)(App);
