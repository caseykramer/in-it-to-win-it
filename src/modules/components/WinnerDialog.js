import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from './Button'
import { connect } from 'react-redux'
import Typeography from './Typeography'
import {loadNames} from '../../actions'
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize'

import './WinnerDialog.css'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function WinnerDialog(props) {
    const [countDown,setCountdown] = React.useState(5)
    const [winnerText,setWinnerText] = React.useState(`${countDown}`)
    const [disableClose,setDisableClose] = React.useState(true)
    const [boom,setBoom] = React.useState(false)
    const [startFetti,setFetti] = React.useState(false)
    const [open,setOpen] = React.useState(props.hasWinner)
    const { width, height } = useWindowSize()
    const handleClose = () => {
        props.reset()
        setCountdown(5)
        setBoom(false)
        setWinnerText(`${countDown}`)
        setOpen(false)
        disableClose(true)
    }
    
    React.useEffect(() => {
        setOpen(props.hasWinner)
        let timer = null
        if(countDown > 0) {          
            setWinnerText(countDown)   
            if(countDown === 1) {
                setFetti(true)         
                setBoom(true)
            }
        } else {
            setWinnerText(`${props.winner}!`);
            setDisableClose(false);            
        }
        if(props.hasWinner) {
            timer = setInterval(function() {   
                if(countDown > 0) {
                    setCountdown(countDown - 1)
                }
            },900)
        }
        return () => { if(props.hasWinner && timer) clearTimeout(timer) };
    })
    return (
        <React.Fragment>
            <span className="topmost">
                <Confetti run={startFetti} recycle={boom} width={width} height={height} className="topmost" />            
            </span>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            maxWidth="md"
            fullWidth
            onClose={handleClose}
            disableBackdropClick
            disableEscapeKeyDown
        >
            <DialogTitle>{"And the winner is..."}</DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    <Typeography variant="h3" align="center"><strong>{winnerText}</strong></Typeography>
                </DialogContentText>                
            </DialogContent>
            <DialogActions>
                <Button disabled={disableClose} onClick={handleClose} color="primary">Who's next?</Button>
            </DialogActions>
        </Dialog>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    hasWinner: state.hasWinner,
    winner: state.winner
});

const mapDispatchToProps = (dispatch) => ({
    reset: () => dispatch(loadNames())
})
    
export default connect(mapStateToProps,mapDispatchToProps)(WinnerDialog);
  