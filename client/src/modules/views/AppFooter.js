import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Typography from '../components/Typeography';
import Grid from '@material-ui/core/Grid';

function Copyright() {
  return (
    <React.Fragment>
      {'© '}
      <Link color="inherit" href="https://www.sullyschool.co.uk/">
        Sully Primary School PTA
      </Link>&nbsp;
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.dark,
  },
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    display: 'flex',
  }
}));

export default function AppFooter() {
  const classes = useStyles();

  return (
      <div className="footer">
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={5}
            direction="row"
            justify="center"
            alignItems="center"
            >
                <Grid item>
                    <Copyright />
                </Grid>
        </Grid>
      </Container>
    </Typography>
    </div>
  );
}
