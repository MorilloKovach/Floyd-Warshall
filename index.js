const nFilas = document.getElementById("nFil");
const cargarNodos = document.getElementById("cargarNuevo");

const INF = 10000000000000;
const cargarAristas = document.getElementById("agregarAristas");
const grillas = document.getElementById("grilla");

let N, k, i, j, existe;
const matriz = [];

const crearGrilla = (n) => {
    grillas.innerHTML = "";
    let tabla = document.createElement("table");
    tabla.setAttribute("id", "tabla");
    tabla.setAttribute("border", "1");
    tabla.setAttribute("cellpadding", "5");
    let cabecera = document.createElement("th");
    cabecera.innerHTML = "";
    tabla.appendChild(cabecera);
    for (let i = 0; i < n; i++) {
        let cabecera = document.createElement("th");
        cabecera.innerHTML = `Nodo ${i + 1}`;
        tabla.appendChild(cabecera);
    }
    for (let i = 0; i < n; i++) {
        let fila = document.createElement("tr");
        matriz[i] = [];
        let cabecera = document.createElement("th");
        cabecera.innerHTML = `Nodo ${i + 1}`;
        fila.appendChild(cabecera);
        for (let j = 0; j < n; j++) {
            let celda = document.createElement("td");
            celda.setAttribute("id", `celda-${i + 1}-${j + 1}`);
            celda.innerHTML = "INF";
            fila.appendChild(celda);
            matriz[i][j] = INF;
            if (i === j) {
                celda.innerHTML = 0; // La diagonal debe ser 0
                matriz[i][j] = 0;
            }
        }
        tabla.appendChild(fila);
    }
    grillas.appendChild(tabla);
}

const pase = document.getElementById("pase");

const funcionar = () => {
    console.log("Funcionando...");
    const cargarArista = document.getElementById("cargarArista");
    cargarArista.addEventListener("click", () => {
        const origen = document.getElementById("origen");
        const destino = document.getElementById("destino");
        const costo = document.getElementById("costo");
        const bidir = document.querySelector('input[name="bidir"]:checked');
        if (isNaN(origen.value) || isNaN(destino.value) || isNaN(costo.value) || !origen.value || !destino.value || !costo.value) {
            alert("Digite un numero!");
            return;
        }

        i = Number(origen.value);
        j = Number(destino.value);
        k = Number(costo.value);
        if (i > N || j > N || i < 0 || j < 0) {
            alert("El nodo no existe!");
            return;
        }
        console.log(`Cargando arista: ${i} -> ${j} con costo ${k}`);
        let celda = document.getElementById(`celda-${i}-${j}`);
        celda.innerHTML = Math.min(k, (Number(celda.innerHTML) ? Number(celda.innerHTML) : INF));
        matriz[i - 1][j - 1] = Math.min(k, (Number(celda.innerHTML) ? Number(celda.innerHTML) : INF));
        if (bidir && bidir.value === "Si") {
            celda = document.getElementById(`celda-${j}-${i}`);
            matriz[j - 1][i - 1] = Math.min(k, (Number(celda.innerHTML) ? Number(celda.innerHTML) : INF));
            celda.innerHTML = Math.min(k, (Number(celda.innerHTML) ? Number(celda.innerHTML) : INF));
        }
    });
    let algoritmo = document.getElementById("floyd-warshall");
    algoritmo.innerHTML = "<button id='floyd'>Floyd-Warshall</button>";
    algoritmo = document.getElementById("floyd");
    algoritmo.addEventListener("click", async () => {
        if (!existe) {
            alert("Cargue los nodos primero!");
            return;
        }
        console.log("Ejecutando Floyd-Warshall...");
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        for (let k = 0; k < N; k++) {
            for (let i = 0; i < N; i++) {
                for (let j = 0; j < N; j++) {
                    pase.innerHTML = `Pase: ${k + 1}, Nodo origen: ${i + 1}, Nodo destino: ${j + 1}`;
                    document.getElementById(`celda-${i + 1}-${j + 1}`).style.backgroundColor = "yellow";
                    document.getElementById(`celda-${i + 1}-${k + 1}`).style.backgroundColor = "red";
                    document.getElementById(`celda-${k + 1}-${j + 1}`).style.backgroundColor = "#88E788";
                    if (matriz[i][j] > matriz[i][k] + matriz[k][j]) {
                        matriz[i][j] = matriz[i][k] + matriz[k][j];

                        let celda = document.getElementById(`celda-${i + 1}-${j + 1}`);
                        console.log(`Actualizando celda (${i + 1}, ${j + 1}) a ${matriz[i][j]}`);
                        celda.innerHTML = matriz[i][j];
                    }
                    await delay(250);
                    document.getElementById(`celda-${i + 1}-${j + 1}`).style.backgroundColor = ""; 
                    document.getElementById(`celda-${i + 1}-${k + 1}`).style.backgroundColor = "";
                    document.getElementById(`celda-${k + 1}-${j + 1}`).style.backgroundColor = "";
                }
            }
        }
    });
}


cargarNodos.addEventListener("click", () => {
    if (isNaN(nFilas.value) || !nFilas.value) {
        cargarAristas.innerHTML = "";
        grillas.innerHTML = "";
        alert("Digite un numero!");
    }
    else {
        N = Number(nFilas.value);
        i = 0, j = 0, k = 0;
        cargarAristas.innerHTML = `<h2>Cuidado de cargar las aristas cuando ya estas trabajando sobre el algoritmo. Se va a reiniciar!</h2>
        <div id="aristas">
            <p>Insertar nodo origen: </p>
            <input type="number" id="origen">
            <p>Insertar nodo destino: </p>
            <input type="number" id="destino">
            <p>Insertar costo origen-destino </p>
            <input type="number" id="costo">
            <p>¿Es bidireccional?</p>
            <label>Si</label><input type="radio" value="Si" name="bidir">
            <label>No</label><input type="radio" value="No" name="bidir">
            <button id="cargarArista">Cargar Arista</button>
        </div>
        `;
        existe = true;
        crearGrilla(N);
        funcionar();
    }
})