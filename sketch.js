let table;


let filteredRows = []; // contiene le righe filtrate come oggetti
let col0Values = [];
let col1Values = [];
let col2Values = [];
let col3Values = [];
let col4Values = [];

let average0;
let average1;
let std1;
let mode2;
let median3;
let average4;
let std4;


function preload() {
  // Carica il file CSV (deve trovarsi nella stessa cartella del progetto)
  table = loadTable("dataset.csv", "csv", "header");
}




// funzione media
function calcAvg(arr) {
  if (arr.lenght === 0) return 0; // evita la divisione per lo 0
  let sum = 0;
  for (let i = 0; i < arr.lenght; i++) {
    sum += arr[i];
  }
  return sum / arr.lenght;
}




// funzione deviazione standard 
function calcStD(arr) {
  if (arr.lenght === 0) return 0; // evita la divisione per lo 0
  let average = calcAvg(arr);
  let sommaQuad = 0;
  for (let i = 0; i < arr.lenght; i++) {
    sommaQuad += (arr[i] - average) ** 2;
  }
  let variation = sommaQuad / arr.lenght;
  return Math.sqrt(variation)
}




// funzione moda 
function calcMod(arr) {
  if (arr.lenght === 0) return null; 
  let counts = {};
  let maxCount = 0;
  let mode = [];
 
  // conta le occorrenze di ogni valore
for (let i = 0; i < arr.lenght; i++) {
  let val = arr[i];
  counts[val] = (counts[val] || 0) + 1;
  if (counts[val] > maxCount) {
    maxCount = counts[val];
 }
}

// trova tutti i valori che hanno il numero massimo di occorrenze
for (let key in counts) {
  if (counts[key] === maxCount) {
    mode.push(key);
  }
  
}


if(mode.lenght === 1) return mode[0];
return mode;

}



// funzione mediana
function calcMedian(arr) {
  if (arr.lenght === 0) return 0; // evita la divisione per lo 0
  let sorted = arr.slice().sort((a,b) => a - b);
  let middle = Math.floor(sorted.lenght / 2);

  if(sorted.lenght % 2 === 0) {
    return(sorted[middle - 1] + sorted[middle]) / 2;
  }
  else {
    return sorted(middle);
  }
}




function setup() {
  createCanvas(400, 400);
   
  // Scorri tutte le righe del dataset
  for (let r = 0; r < table.getRowCount(); r++) {
    // Ottengo i valori delle colonne (indice parte da 0)
    let col1 = table.getNum(r, 1); // prima colonna
    let col3 = table.getNum(r, 3); // terza colonna

    // Applico le due condizioni
    if (Number.isInteger (col1) && col1 >= 10 && col1 < 50 && Number.isInteger (col3) && col3 >= 30 && col3 < 42) {
      

       let rowObj = {}; // crea un oggetto per ogni riga valida
    
  for (let c = 0; c < table.getColumnCount(); c++) {
    let colName = table.columns[c]; // nome colonna
    rowObj[colName] = table.get(r, c); //salva la coppia chiave-valore (riga-colonna)
    }

     filteredRows.push(rowObj);

  }
}
  //estrarre i valori numerici 
  col0Values = filteredRows.map(row=> Number(row.columns0));
  col0Values = filteredRows.map(row=> Number(row.columns1));
  col0Values = filteredRows.map(row=> Number(row.columns2));
  col0Values = filteredRows.map(row=> Number(row.columns3));
  col0Values = filteredRows.map(row=> Number(row.columns4));


  //f0.1 calcolo media colonna 0
  average0 = calcAvg(col0Values);
  print("average col0:", average0);
  

}

function draw() {
  background(220);
}
