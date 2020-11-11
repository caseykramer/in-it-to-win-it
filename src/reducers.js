
import {SHEET_LOADING,CELLS_LOADING,NAMES_LOADED,WINNER_FOUND,CANDIDATE_UPDATED,ERROR,STATS_LOADED} from './constants'

const defaultState = { 
    isLoading: false, 
    names: [], 
    hasWinner: false, 
    winner: undefined, 
    candidateName: undefined, 
    error: undefined,
    stats: [],
    hasStats: false };
const reducer = (state = defaultState,action) => {
    switch(action.type) {
        case SHEET_LOADING:
        case CELLS_LOADING:
            return {...state, error:undefined, isLoading: true, names: [], hasWinner:false, winner: undefined };
        case NAMES_LOADED:
            return {...state, error:undefined, isLoading: false, names: action.names, hasWinner: false, candidateName: action.candidate};
        case CANDIDATE_UPDATED:
            return {...state, error:undefined, candidateName: action.candidate };
        case WINNER_FOUND:
            return {...state, error:undefined, hasWinner:true, winner: action.winner };
        case STATS_LOADED:
            return {...state, error:undefined, hasStats:true, stats: action.stats};
        case ERROR:
            return {...state, error: action.error }
        default: return state;
    }
}

export default reducer;