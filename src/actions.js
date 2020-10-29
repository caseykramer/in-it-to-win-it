import {NAMES_LOADED, SHEET_LOADING, CELLS_LOADING,WINNER_FOUND, CANDIDATE_UPDATED} from './constants'
import {GoogleSpreadsheet} from 'google-spreadsheet'

let chosen = [];

export const sheetLoading = () => ({
    type: SHEET_LOADING
});

export const namesLoaded = (names) => ({
    type: NAMES_LOADED,
    names: names,
    candidate: `${selectName(names)}?`
});

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

export function loadNames() {
    return function(dispatch) {
        dispatch(sheetLoading());
        const sully_sheet = '1Az9DE46vFan1UDU8VPu4yCMeZVZr8muDdxqqy91qs_Y';
        const test_sheet = '1cBwmbZfWQbSVnU54KNYsMVLqJlix4QjP_nLOH9KapMI';
        const doc = new GoogleSpreadsheet(sully_sheet);
        const email = process.env.REACT_APP_GOOGLE_EMAIL
        const key = process.env.REACT_APP_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
        doc.useServiceAccountAuth(
        {
          client_email: email,
          private_key: key
        });
        dispatch({
            type: SHEET_LOADING,
            payload: doc.loadInfo()
        }).then(() => {
            console.log(doc.title);
            const firstSheet = doc.sheetsByIndex[0];
            const startingRow = 4;
            console.log("rows:" + firstSheet.rowCount)
            dispatch({
                type: CELLS_LOADING,
                payload: firstSheet.loadCells(`A1:A${firstSheet.rowCount}`)
            }).then(() => {
                console.log(firstSheet.cellStats);
                console.log(firstSheet.getCell(startingRow,0).value);
                const names = Array.from({length: (firstSheet.rowCount - startingRow)},(_,i) => {
                    const rowId = startingRow + i; 
                    const name = firstSheet.getCell(rowId,0).value;
                    if(name && name !== "") { return name.trim(); } else {return null; }
                }).filter(x => x != null && chosen.indexOf(x) < 0);
                console.log(names);
                dispatch(namesLoaded(names));
                dispatch(showCandidates(names));
            });
        });
    }
}