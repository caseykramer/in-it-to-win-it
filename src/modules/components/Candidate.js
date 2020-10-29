import { connect } from 'react-redux'
import {CSSTransition, SwitchTransition } from "react-transition-group";
import Typeography from './Typeography'
import './Candidate.css'

function Candidate(props) {
    const space = '\u00a0'
    return(
        <div>
            <Typeography variant="h2">
                <span>{space}</span>
                <SwitchTransition>
                    <CSSTransition 
                        key={props.candidate} 
                        addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
                        classNames="fade">
                        <span><strong>{props.candidate}</strong></span>
                    </CSSTransition>                            
                    </SwitchTransition>
                <span>{space}</span>
            </Typeography>
        </div>
    )
}

const mapStateToProps = state => ({
    candidate: state.candidateName
});
    
export default connect(mapStateToProps)(Candidate);
  