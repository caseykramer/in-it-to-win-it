import {SHEET_LOADING,CELLS_LOADING,NAMES_LOADED,WINNER_FOUND,CANDIDATE_UPDATED} from './constants'

const defaultState = { isLoading: false, names: [], hasWinner: false, winner: undefined, candidateName: undefined };
const reducer = (state = defaultState,action) => {
    switch(action.type) {
        case SHEET_LOADING:
        case CELLS_LOADING:
            return {...state, isLoading: true, names: [], hasWinner:false };
        case NAMES_LOADED:
            return {...state, isLoading: false, names: action.names, hasWinner: false, candidateName: action.candidate};
        case CANDIDATE_UPDATED:
            return {...state, candidateName: action.candidate };
        case WINNER_FOUND:
            return {...state, hasWinner:true, winner: action.winner };
        default: return state;
    }
}

export default reducer;