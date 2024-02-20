const buscaminasJuego = {
    totalMinas: "",
    minasEncontradas: "",
    numFilas: "",
    numColumnas: "",
    campoMinas: []
}

function renderizarTablero() {
    let tablero = document.querySelector("#tablero");

    document.querySelector("html").style.setProperty("--num-filas", buscaminasJuego.numFilas);
    document.querySelector("html").style.setProperty("--num-columnas", buscaminasJuego.numColumnas);

    while (tablero.firstChild) {
        tablero.firstChild.removeEventListener("contextmenu", marcarCasilla);
        tablero.firstChild.removeEventListener("click", destaparCasilla);
        tablero.removeChild(tablero.firstChild);
    }

    for (let f = 0; f < buscaminasJuego.numFilas; f++) {
        for (let c = 0; c < buscaminasJuego.numColumnas; c++) {
            let nuevaCelda = document.createElement("div");
            nuevaCelda.setAttribute("id", "f" + f + "_c" + c);
            nuevaCelda.dataset.fila = f;
            nuevaCelda.dataset.columna = c;
            nuevaCelda.addEventListener("contextmenu", marcarCasilla);
            nuevaCelda.addEventListener("click", destaparCasilla);

            tablero.appendChild(nuevaCelda);
        }
    }
}

function generarCampoMinasVacio() {
    buscaminasJuego.campoMinas = new Array(buscaminasJuego.numFilas);
    for (let fila = 0; fila < buscaminasJuego.numFilas; fila++) {
        buscaminasJuego.campoMinas[fila] = new Array(buscaminasJuego.numColumnas);
    }
}

function esparcirMinas() {
    let minasEsparcidas = 0;

    while (minasEsparcidas < buscaminasJuego.totalMinas) {
        let fila = Math.floor(Math.random() * buscaminasJuego.numFilas);
        let columna = Math.floor(Math.random() * buscaminasJuego.numColumnas);

        if (buscaminasJuego.campoMinas[fila][columna] != "B") {
            buscaminasJuego.campoMinas[fila][columna] = "B";
            minasEsparcidas++;
        }
    }
}

function contarMinasAlrededorCelda(fila, columna) {
    let numMinasAlrededor = 0;

    for (let zFila = fila - 1; zFila <= fila + 1; zFila++) {
        for (let zColumna = columna - 1; zColumna <= columna + 1; zColumna++) {
            if (zFila > -1 && zFila < buscaminasJuego.numFilas && zColumna > -1 && zColumna < buscaminasJuego.numColumnas) {
                if (buscaminasJuego.campoMinas[zFila][zColumna] == "B") {
                    numMinasAlrededor++;
                }
            }
        }
    }

    buscaminasJuego.campoMinas[fila][columna] = numMinasAlrededor;
}

function contarMinas() {
    for (let fila = 0; fila < buscaminasJuego.numFilas; fila++) {
        for (let columna = 0; columna < buscaminasJuego.numColumnas; columna++) {
            if (buscaminasJuego.campoMinas[fila][columna] != "B") {
                contarMinasAlrededorCelda(fila, columna);
            }
        }
    }
}

function marcarCasilla(evento) {
    if (evento.type === "contextmenu") {
        let casilla = evento.currentTarget;
        evento.stopPropagation();
        evento.preventDefault();
        let fila = parseInt(casilla.dataset.fila, 10);
        let columna = parseInt(casilla.dataset.columna, 10);

        if (fila >= 0 && columna >= 0 && fila < buscaminasJuego.numFilas && columna < buscaminasJuego.numColumnas) {
            if (casilla.classList.contains("iconoBandera")) {
                casilla.classList.remove("iconoBandera");
                casilla.classList.add("iconoDuda");
                buscaminasJuego.minasEncontradas--;
            } else if (casilla.classList.contains("iconoDuda")) {
                casilla.classList.remove("iconoDuda");
            } else if (casilla.classList.length == 0) {
                casilla.classList.add("iconoBandera");
                buscaminasJuego.minasEncontradas++;
                if (buscaminasJuego.minasEncontradas == buscaminasJuego.totalMinas) {
                    resolverJuego(true);
                }
            }

            actualizarMinasRestantes();
        }
    }
}

function destaparCasilla(evento) {
    if (evento.type === "click") {
        let casilla = evento.currentTarget;
        let fila = parseInt(casilla.dataset.fila, 10);
        let columna = parseInt(casilla.dataset.columna, 10);

        destaparCelda(fila, columna);
    }
}

function destaparCelda(fila, columna) {
    if (fila > -1 && fila < buscaminasJuego.numFilas && columna > -1 && columna < buscaminasJuego.numColumnas) {
        let casilla = document.querySelector("#f" + fila + "_c" + columna);

        if (!casilla.classList.contains("destapado")) {
            if (!casilla.classList.contains("iconoBandera")) {
                casilla.classList.add("destapado");
                casilla.innerHTML = buscaminasJuego.campoMinas[fila][columna];
                casilla.classList.add("c" + buscaminasJuego.campoMinas[fila][columna])

                if (buscaminasJuego.campoMinas[fila][columna] !== "B") {
                    if (buscaminasJuego.campoMinas[fila][columna] == 0) {
                        destaparCelda(fila - 1, columna - 1);
                        destaparCelda(fila - 1, columna);
                        destaparCelda(fila - 1, columna + 1);
                        destaparCelda(fila, columna - 1);
                        destaparCelda(fila, columna + 1);
                        destaparCelda(fila + 1, columna - 1);
                        destaparCelda(fila + 1, columna);
                        destaparCelda(fila + 1, columna + 1);

                        casilla.innerHTML = "";
                    }
                } else if (buscaminasJuego.campoMinas[fila][columna] == "B") {
                    casilla.innerHTML = "";
                    casilla.classList.add("iconoBomba");
                    casilla.classList.add("sinmarcar");
                    resolverJuego(false);
                }
            }
        }
    }
}

function resolverJuego(esCorrecto) {
    let celdas = tablero.children;
    for (let i = 0; i < celdas.length; i++) {
        celdas[i].removeEventListener("click", destaparCasilla);
        celdas[i].removeEventListener("contextmenu", marcarCasilla);

        let fila = parseInt(celdas[i].dataset.fila, 10);
        let columna = parseInt(celdas[i].dataset.columna, 10);

        if (celdas[i].classList.contains("iconoBandera")) {
            if (buscaminasJuego.campoMinas[fila][columna] == "B") {
                celdas[i].classList.add("destapado");
                celdas[i].classList.remove("iconoBandera");
                celdas[i].classList.add("iconoBomba");
            } else {
                celdas[i].classList.add("destapado");
                celdas[i].classList.add("banderaErronea");
                esCorrecto = false;
            }
        } else if (!celdas[i].classList.contains("destapado")) {
            if (buscaminasJuego.campoMinas[fila][columna] == "B") {
                celdas[i].classList.add("destapado");
                celdas[i].classList.add("iconoBomba");
            }
        }
    }

    if (esCorrecto) {
        alert("¡Felicidades!");
    }
}

function actualizarMinasRestantes() {
    document.querySelector("#numMinasRestantes").innerHTML =
        (buscaminasJuego.totalMinas - buscaminasJuego.minasEncontradas);
}

function comenzarJuego() {
    buscaminasJuego.numFilas = 8;
    buscaminasJuego.numColumnas = 8;
    buscaminasJuego.totalMinas = 5;
    renderizarTablero();
    generarCampoMinasVacio();
    esparcirMinas();
    contarMinas();
    actualizarMinasRestantes();
}

window.onload = comenzarJuego;