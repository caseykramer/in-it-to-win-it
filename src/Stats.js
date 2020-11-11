import React from 'react'
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import theme from './modules/theme'

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },  
  }));
  
const StyledTableCell = withStyles((theme) => ({
head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white
}
}))(TableCell)

function Stats(props) {
    const classes = useStyles(theme)
    const open = !props.hasStats
    return props.stats? 
            (<TableContainer component={Paper}>
                <Table size="small">
                    <TableHead className="head">
                        <TableRow>
                            <StyledTableCell align="center"><strong>Year</strong></StyledTableCell>
                            <StyledTableCell align="center"><strong>Monthly Donation</strong></StyledTableCell>
                            <StyledTableCell align="center"><strong>% of Donations</strong></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.stats.map(year => (
                            <TableRow key={year.name}>
                                <TableCell align="center"><strong>{year.name}</strong></TableCell>
                                <TableCell align="center">{year.donation}</TableCell>
                                <TableCell align="center">{year.percentage}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>) : 
            (<Backdrop className={classes.backdrop} open={open}><CircularProgress color="inherit"></CircularProgress></Backdrop>)
            
}

const mapStateToProps = state => ({
    stats: state.stats,
    hasStats: state.hasStats    
});

export default connect(mapStateToProps)(Stats);