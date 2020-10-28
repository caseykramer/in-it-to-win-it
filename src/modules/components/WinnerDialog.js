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
import Confetti from 'react-dom-confetti';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function WinnerDialog(props) {
    const [countDown,setCountdown] = React.useState(5)
    const [winnerText,setWinnerText] = React.useState(`${countDown}`)
    const [disableClose,setDisableClose] = React.useState(true)
    const [boom,setBoom] = React.useState(false)
    const [open,setOpen] = React.useState(props.hasWinner)
    const handleClose = () => {
        props.reset()
        setOpen(false)
    }
    const fettiConfig = {
            angle: 90,
            spread: 360,
            startVelocity: 40,
            elementCount: 70,
            dragFriction: 0.12,
            duration: "5340",
            stagger: 3,
            width: "10px",
            height: "10px",
            perspective: "390px",
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };
    
    React.useEffect(() => {
        setOpen(props.hasWinner)
        let timer = null
        if(countDown > 0) {          
            setWinnerText(countDown)            
        } else {
            setWinnerText(props.winner);
            setDisableClose(false);
            setBoom(true)
        }
        if(props.hasWinner) {
            timer = setInterval(function() {   
                if(countDown > 0) {
                    setCountdown(countDown - 1)
                }
            },1000)
        }
        return () => { if(props.hasWinner && timer) clearTimeout(timer) };
    })
    return (
        <React.Fragment>
            <span className="Absolute-Center">
                <Confetti active={boom} config={fettiConfig} />
            </span>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            maxWidth="sm"
            fullWidth
            onClose={handleClose}
        >
            <DialogTitle>{"And the winner is..."}</DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    <Typeography variant="h5" align="center"><strong>{winnerText}</strong></Typeography>
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
  