
import {NAMES_LOADING,NAMES_LOADED,WINNER_FOUND,CANDIDATE_UPDATED,ERROR,CLEAR_ERROR,STATS_LOADING,STATS_LOADED} from './constants'

export const defaultState = { 
    isLoading: false, 
    names: [], 
    hasWinner: false, 
    winner: undefined, 
    candidateName: undefined, 
    hasError: false,
    error: undefined,
    stats: [],
    hasStats: false };
    
const reducer = (state = defaultState,action) => {
    switch(action.type) {
        case NAMES_LOADING:
            return {...state, error:undefined, isLoading: true, names: [], hasWinner:false, winner: undefined };
        case NAMES_LOADED:
            return {...state, error:undefined, isLoading: false, names: action.names, hasWinner: false, candidateName: action.candidate};
        case CANDIDATE_UPDATED:
            return {...state, error:undefined, candidateName: action.candidate };
        case WINNER_FOUND:
            return {...state, error:undefined, hasWinner:true, winner: action.winner };
        case STATS_LOADING:
            return {...state,error:undefined,hasStats:false,stats:[]}
        case STATS_LOADED:
            return {...state, error:undefined, hasStats:true, stats: action.stats};
        case ERROR:
            return {...state, error: action.error, hasError: true }
        case CLEAR_ERROR:
            return {...state, hasError: false, error: undefined }
        default: return state;
    }
}

export default reducer;