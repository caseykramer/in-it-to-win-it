const GoogleSpreadsheet = require('google-spreadsheet');
const cache = require('memory-cache')
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080

async function loadDoc() {
  if(cache.get("sheet") !== null){
    console.log("Found sheet in cache")
    return cache.get("sheet")
  }
  const sully_sheet = '1Az9DE46vFan1UDU8VPu4yCMeZVZr8muDdxqqy91qs_Y';
  const doc = new GoogleSpreadsheet.GoogleSpreadsheet(sully_sheet);
  const email = process.env.GOOGLE_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
  doc.useServiceAccountAuth(
  {
    client_email: email,
    private_key: key
  });
  await doc.loadInfo()
  console.log(doc.title);
  cache.put("sheet",doc,600000)
  return doc
}


async function loadNames() {
  if(cache.get("names") !== null) {
    console.log("Found names in cache")
    return cache.get("names")
  }
  const doc = await loadDoc()
  const firstSheet = doc.sheetsByIndex[1];
  const startingRow = 4;
  console.log("rows:" + firstSheet.rowCount)
  await firstSheet.loadCells(`A1:A${firstSheet.rowCount}`)
  console.log(firstSheet.cellStats);
  console.log(firstSheet.getCell(startingRow,0).value);
  const names = Array.from({length: (firstSheet.rowCount - startingRow)},(_,i) => {
      const rowId = startingRow + i; 
      const name = firstSheet.getCell(rowId,0).value;
      if(name && name !== "") { return name.trim(); } else {return null; }
  }).filter(x => x != null);
  console.log(names);
  if(names.length > 0) {
    cache.put("names",names,600000)
  }
  return names    
}

async function loadStats() {
  if(cache.get("stats") !== null) {
    console.log("Found stats in cache")
    return cache.get("stats")
  }
  const doc = await loadDoc()
  const statsSheet = doc.sheetsByIndex[1];
  const startingRow = 5;
  await statsSheet.loadCells(`C6:E16`)
  const stats = Array.from({length: 11},(_,i) => {
      const rowId = startingRow + i;
      if(statsSheet.getCell(rowId,2).value === "") {
          return null
      } else {
          return {
              name: statsSheet.getCell(rowId,2).value,
              donation: `£${statsSheet.getCell(rowId,3).value}.00`,
              percentage: `${Math.ceil(statsSheet.getCell(rowId,4).value * 100)}%`
          }
      }
  }).filter(x => x !== null && x.name !== null && x.name !== "");
  console.log(stats);
  if(stats.length > 0) {
    cache.put("stats",stats,600000)
  }
  return stats
}

async function loadWinners() {
  if(cache.get("winners") !== null) {
    console.log("Found winners in cache");
    return cache.get("winners");
  }

  const doc = await loadDoc();
  const winnersSheet = doc.sheetsByIndex[2];
  const startingRow = 2;
  await winnersSheet.loadCells("B3:E44")
  let rowId = startingRow
  let lastDate = ""
  const winners = Array.from({length:14},(_,i) => {
    if(winnersSheet.getCell(rowId,1) !== "") {
      lastDate = winnersSheet.getCell(rowId,1).formattedValue
    }
    const first = {parent: winnersSheet.getCell(rowId,2).value,child: winnersSheet.getCell(rowId,3).value,year: winnersSheet.getCell(rowId,4).value};
    rowId = rowId + 1;
    const second = {parent: winnersSheet.getCell(rowId,2).value,child: winnersSheet.getCell(rowId,3).value,year: winnersSheet.getCell(rowId,4).value};
    rowId = rowId + 1;
    const third = {parent: winnersSheet.getCell(rowId,2).value,child: winnersSheet.getCell(rowId,3).value,year: winnersSheet.getCell(rowId,4).value};
    rowId = rowId + 1;
    return {
      date: lastDate,
      first: first,
      second: second,
      third: third
    }
  })
  console.log("Winners:",winners)
  if (winners.length > 0) {
    cache.put("winners",winners,60000);
  }

  return winners;
}

app.use(function (req, res, next) {
  let origin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", req.headers.host.indexOf("localhost") > -1 ? "http://localhost:3000" : origin);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.static(path.join(__dirname, '/client/build')));
if(process.env.NODE_ENV === 'production') {  
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname = '/client/build/index.html'));  
  });
}

app.get('/api/names',async (req,res) => {
  try {
    const names = await loadNames();
    res.send(names);
  } 
  catch(err) {
    console.log("Error fetching names:",err)
    res.sendStatus(400)
  }
})
app.get('/api/stats',async (req,res) => {
  try {
    console.log("Fetching stats")
    const stats = await loadStats();
    res.send(stats);
  } catch (err) {
    console.log("Error fetching stats:",err)
    res.sendStatus(400)
  }
})
app.get('/api/winners',async (req,res) => {
  try {
    console.log("Fetching winners")
    const winners = await loadWinners();
    res.send(winners)
  } catch (err) {
    console.log("Error fetching winners:",err);
    res.sendStatus(400)
  }  
})

app.get('*', (req, res) => {  
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


app.listen(port,console.log("Server listening on port",port));