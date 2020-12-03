import './App.css';
import React from 'react'
import {pickWinner,loadNames,clearError} from './actions'
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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

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
  const [hasError,setHasError] = React.useState(props.hasError)
  const handleError = () => {
    setHasError(false)
    props.clearError()
  }
  React.useEffect(() => {
    if ((!props.namesLoading) && (props.names === undefined || props.names.length === 0)) {
      console.log("Loading names")
      props.loadNames()
    }
  })
  return (
    <div className={classes.root}>
      <Snackbar open={hasError} onClose={handleError}>
        <MuiAlert onClose={handleError} severity="error">
          Oh no, there was an error! Please try again later.
        </MuiAlert>
      </Snackbar>
      <Paper elevation="5" className={classes.paper}>
          <Grid container spacing={2}          
            alignItems="center">
              <Grid item xs="12">
                <img src="/logo.png" alt="In It to Win It" />
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
  hasWinner: state.hasWinner,
  winner: state.winner,
  hasError: state.hasError
});

const mapDispatchToProps = (dispatch) => ({
  loadNames: () => dispatch(loadNames()),
  onClick: (names) => dispatch(pickWinner(names)),
  clearError: () => dispatch(clearError()),
})

export default connect(mapStateToProps,mapDispatchToProps)(App);
