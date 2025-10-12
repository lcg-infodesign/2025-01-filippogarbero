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
  if (arr.length === 0) return 0; // evita la divisione per lo 0
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
}




// funzione deviazione standard 
function calcStD(arr) {
  if (arr.length === 0) return 0; // evita la divisione per lo 0
  let average = calcAvg(arr);
  let sommaQuad = 0;
  for (let i = 0; i < arr.length; i++) {
    sommaQuad += (arr[i] - average) ** 2;
  }
  let variation = sommaQuad / arr.length;
  return Math.sqrt(variation)
}




// funzione moda 
function calcMode(arr) {
  if (arr.length === 0) return null; 
  let counts = {};
  let maxCount = 0;
  let mode = [];
 
  // conta le occorrenze di ogni valore
for (let i = 0; i < arr.length; i++) {
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


if(mode.length === 1) return mode[0];
return mode;

}



// funzione mediana
function calcMedian(arr) {
  if (arr.length === 0) return 0; // evita la divisione per lo 0
  let sorted = arr.slice().sort((a,b) => a - b);
  let middle = Math.floor(sorted.length / 2);

  if(sorted.length % 2 === 0) {
    return(sorted[middle - 1] + sorted[middle]) / 2;
  }
  else {
    return sorted[middle];
  }
}




// ===================== DRAW AVERAGE COL0 =====================
function drawAverageCol0() {
  let gWidth = 700;
  let gHeight = 200;

  let g = createGraphics(gWidth, gHeight);
  g.background(10, 10, 10); // sfondo scuro stile terminale

  let topMargin = 20, bottomMargin = 100, leftMargin = 40, rightMargin = 40;
  let chartWidth = gWidth - leftMargin - rightMargin;
  let chartHeight = gHeight - topMargin - bottomMargin;
  let barWidth = chartWidth / col0Values.length;
  let maxVal = Math.max(...col0Values);
  let zeroY = gHeight - bottomMargin;

  for (let i = 0; i < col0Values.length; i++) {
    let val = col0Values[i];
    let h = map(val, 0, maxVal, 0, chartHeight);
    let yPos = zeroY - h;

    // Gradient fill in stile digitale
    let c = lerpColor(color(0, 71, 171), color(57, 255, 20), val / maxVal);
    g.fill(c);
    g.noStroke();
    g.rect(leftMargin + i * barWidth, yPos, barWidth * 0.8, h, 1);
  }

  // Linea media neon
  let avgY = zeroY - map(average0, 0, maxVal, 0, chartHeight);
  g.stroke(255, 165, 0); // arancione brillante
  g.strokeWeight(3);
  g.line(leftMargin, avgY, gWidth - rightMargin, avgY);

  // Testo descrittivo stile terminale
  g.noStroke();
  g.fill(57, 255, 20); // verde neon
  g.textAlign(CENTER, CENTER);
  g.textSize(15);
  g.textStyle(ITALIC);
  g.text("Media: " + nf(average0, 1, 2), gWidth / 2, gHeight - 15);

  let cnvImg = createImg(g.canvas.toDataURL(), "Media colonna 0");
  cnvImg.parent("avgChart");
  cnvImg.style("display", "block");
  cnvImg.style("margin-left", "auto");
  cnvImg.style("margin-right", "auto");
  cnvImg.style("max-width", "100%");
  cnvImg.style("height", gHeight + "px");
}


// ===================== DRAW MODE COL2 =====================
function drawModeCol2() {
  let gWidth = 700, gHeight = 200;
  let g = createGraphics(gWidth, gHeight);
  g.background(10, 10, 10); // sfondo scuro

  let padding = 20;
  let counts = {};
  for (let val of col2Values) counts[val] = (counts[val] || 0) + 1;

  let uniqueValues = Object.keys(counts);
  let maxCount = Math.max(...Object.values(counts));
  let minValue = Math.min(...uniqueValues.map(Number));
  let maxValue = Math.max(...uniqueValues.map(Number));
  let bubbles = [];

  randomSeed(12345); // leader fisso → bolle sempre nello stesso posto

  for (let val of uniqueValues) {
    let freq = counts[val];
    let radius = map(freq, 0, maxCount, 10, 40);
    let attempts = 0, x, y, overlap;
    do {
      x = random(padding + radius, gWidth - padding - radius);
      y = random(padding + radius, gHeight - padding - radius - 20);
      overlap = false;
      for (let b of bubbles) 
        if (dist(x, y, b.x, b.y) < radius + b.radius + 15) overlap = true;
      attempts++;
      if (attempts > 500) break;
    } while (overlap);
    bubbles.push({ x, y, radius, val });
  }

  for (let b of bubbles) {
    let colNorm = map(Number(b.val), minValue, maxValue, 0, 1);
    let c = lerpColor(color(0, 71, 171), color(57, 255, 20), colNorm);
    g.fill(c);
    g.noStroke();
    g.ellipse(b.x, b.y, b.radius * 2, b.radius * 2);

    // Valore sulla bolla in stile terminale
    g.fill(57, 255, 20); // verde neon
    g.textAlign(CENTER, CENTER);
    g.textSize(12);
    g.text(b.val, b.x, b.y + b.radius + 10);
  }

  // Testo della moda in stile neon
  g.noStroke();
  g.fill(0, 255, 255); // ciano digitale
  g.textAlign(CENTER, CENTER);
  g.textSize(15);
  g.textStyle(ITALIC);
  g.text("Moda: " + mode2, gWidth / 2, gHeight - 10);

  let cnvImg = createImg(g.canvas.toDataURL(), "Moda colonna 2");
  cnvImg.parent("modeChart");
  cnvImg.style("display", "block");
  cnvImg.style("margin-left", "auto");
  cnvImg.style("margin-right", "auto");
  cnvImg.style("max-width", "100%");
  cnvImg.style("height", gHeight + "px");
}





function setup() {
  createCanvas(400, 400);
   
  // Scorri tutte le righe del dataset
  for (let r = 0; r < table.getRowCount(); r++) {
    // Ottengo i valori delle colonne (indice parte da 0)
    let col1 = table.getNum(r, 1); // colonna 1
    let col3 = table.getNum(r, 3); // colonna 3

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
  col0Values = filteredRows.map(row => Number(row.column0));
  col1Values = filteredRows.map(row => Number(row.column1));
  col2Values = filteredRows.map(row => Number(row.column2));
  col3Values = filteredRows.map(row => Number(row.column3));
  col4Values = filteredRows.map(row => Number(row.column4));


  // f01. calcolo media colonna 0
  average0 = calcAvg(col0Values);
  console.log("average col0:", average0);
  
  //richiamo il grafico della media colonna 0
  drawAverageCol0();


  // f02. calcolo media e deviazione standard colonna 1
  average1 = calcAvg(col1Values);
  std1 = calcStD(col1Values)
  console.log("average col1:", average1);
  console.log("std col1:", std1);


  // f03. calcolo moda colonna 2
  mode2 = calcMode(col2Values);
  console.log("mode col2:", mode2);


  //richiamo il grafico della moda colonna 2
  drawModeCol2();


  // f04. calcolo mediana colonna 3
  median3 = calcMedian(col3Values);
  console.log("median col3:", median3);


  // f05. calcolo media e deviazione standard colonna 4
  average4 = calcAvg(col4Values);
  std4 = calcStD(col4Values);
  console.log("average col4:", average4);
  console.log("std col4:", std4);

} // FINE SETUP


