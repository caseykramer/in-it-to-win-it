import {NAMES_LOADED, NAMES_LOADING,WINNER_FOUND, CANDIDATE_UPDATED, ERROR,CLEAR_ERROR, STATS_LOADING,STATS_LOADED} from './constants'
import axios from 'axios'
const url = "http://localhost:8080/"

let chosen = [];

export const namesLoading = () => ({
    type: NAMES_LOADING
});

export const statsLoading = () => ({
    type: STATS_LOADING
});

export const namesLoaded = (names) => ({
    type: NAMES_LOADED,
    names: names,
    candidate: `${selectName(names)}?`
});

export const statsLoaded = (stats) => ({
    type: STATS_LOADED,
    stats: stats
})

export const error = (message) => ({
    type: ERROR,
    message: message
});

export const clearError = () => ({
    type:CLEAR_ERROR
})

export const pickWinner = (names) => (dispatch) => {
    stopShowingCandidates()
    const winner = selectName(names)
    chosen.push(winner)
    dispatch({
        type: WINNER_FOUND,
        winner: winner
    })
};

function selectName(names) {
    console.log(chosen)
    const filtered = names.filter(n => chosen.indexOf(n) < 0);
    if(filtered && filtered.length > 0) {
        return filtered[Math.floor(Math.random() * filtered.length)]
    } else {
        console.error('No names')
        return "Who knows"
    }
}

export const candidateUpdated = name => ({
    type: CANDIDATE_UPDATED,
    candidate: `${name}?`
})

let candidateTimer = null

export const showCandidates = (names) => (dispatch) => {
    clearInterval(candidateTimer)
    candidateTimer = setInterval(() => dispatch(candidateUpdated(selectName(names))),4000);    
}

export const stopShowingCandidates = () => {
    clearInterval(candidateTimer)
}

export function loadStats() {
    return function(dispatch) {
        dispatch(statsLoading);
        axios.get(url + 'api/stats').then(result => {
            console.log(result);
            dispatch(statsLoaded(result.data));               
        })
    }
}

export function loadNames() {
    return function(dispatch) {
        console.log("ABOUT TO DISPATCH namesLoading")
        dispatch(namesLoading())
        axios.get(url + 'api/names').then(result => {
            console.log("Got Names",result);
            const names = result.data.filter(n => chosen.indexOf(n) < 0);
            dispatch(namesLoaded(names));
            dispatch(showCandidates(names));            
        });    
    }
}