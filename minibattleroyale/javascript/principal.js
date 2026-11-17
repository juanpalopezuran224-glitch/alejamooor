
import { Jugador } from "./jugador.js";

import { Enemigo } from "./enemigo.js";

import {
    disparar,
    actualizarBalas,
    dibujarBalas
} from "./arma.js";

import {
    crearMapa,
    dibujarMapa,
    posicionLibre
} from "./mapa.js";

// Elementos de la pantalla

const canvas = document.getElementById("juego");
const ctx = canvas.getContext("2d");

const pantalla = document.getElementById("pantalla");
const botonJugar = document.getElementById("botonJugar");

const vidaHTML = document.getElementById("vida");
const municionHTML = document.getElementById("municion");
const enemigosHTML = document.getElementById("enemigos");
const bajasHTML = document.getElementById("bajas");

// Variables del juego

let jugador;
let enemigos = [];
let balas = [];
let obstaculos = [];

let teclas = {};

let raton = {
    x: 450,
    y: 280
};

let disparando = false;

let bajas = 0;
let jugando = false;

let ultimoTiempo = 0;
let tiempoDisparo = 0;

// Armas disponibles

let armaActual = "pistola";

const armas = {

    pistola: {
        danio: 30,
        velocidadDisparo: 0.30
    },

    rifle: {
        danio: 15,
        velocidadDisparo: 0.12
    }
};

// Iniciar partida

function iniciarJuego() {

    jugador = new Jugador(450, 280);

    obstaculos = crearMapa();

    enemigos = [];
    balas = [];

    bajas = 0;

    armaActual = "pistola";

    tiempoDisparo = 0;

    // Crear diez enemigos

    for (let i = 0; i < 10; i++) {

        const posicion = posicionLibre(obstaculos);

        enemigos.push(
            new Enemigo(posicion.x, posicion.y)
        );
    }

    jugando = true;

    pantalla.classList.add("oculto");

    actualizarInterfaz();
}

// Actualizar información

function actualizarInterfaz() {

    vidaHTML.textContent =
        "❤️ Vida: " + Math.ceil(jugador.vida);

    municionHTML.textContent =
        "🔫 " + armaActual.toUpperCase() +
        " | Balas: " + jugador.municion +
        " / " + jugador.reserva;

    enemigosHTML.textContent =
        "👥 Enemigos: " +
        enemigos.filter(e => e.vivo).length;

    bajasHTML.textContent =
        "☠️ Bajas: " + bajas;
}

// Actualizar el juego

function actualizar(tiempo) {

    if (!jugando) return;

    jugador.mover(
        teclas,
        tiempo,
        obstaculos
    );

    jugador.actualizarRecarga(tiempo);

    tiempoDisparo -= tiempo;

    // Disparar

    if (
        disparando &&
        tiempoDisparo <= 0 &&
        !jugador.recargando
    ) {

        if (jugador.municion > 0) {

            disparar(
                jugador,
                raton,
                "jugador",
                balas,
                armas[armaActual].danio
            );

            jugador.municion--;

            tiempoDisparo = armas[armaActual].velocidadDisparo;

        } else {

            jugador.recargar();
        }
    }

    // Actualizar enemigos

    enemigos.forEach(enemigo => {

        enemigo.actualizar(
            jugador,
            tiempo,

            (origen, objetivo, propietario) => {

                disparar(
                    origen,
                    objetivo,
                    propietario,
                    balas,
                    10
                );
            },

            obstaculos
        );

        // Evitar que salgan del mapa

        enemigo.x = Math.max(15, Math.min(885, enemigo.x));
        enemigo.y = Math.max(15, Math.min(545, enemigo.y));
    });

    // Actualizar balas

    balas = actualizarBalas(
        balas,
        tiempo,
        jugador,
        enemigos,
        obstaculos,
        () => bajas++
    );

    actualizarInterfaz();

    // Comprobar derrota

    if (jugador.vida <= 0) {

        terminarJuego(false);
    }

    // Comprobar victoria

    if (enemigos.every(e => !e.vivo)) {

        terminarJuego(true);
    }
}

// Dibujar todos los elementos

function dibujar() {

    dibujarMapa(ctx, obstaculos);

    dibujarBalas(ctx, balas);

    enemigos.forEach(enemigo => {

        enemigo.dibujar(ctx);
    });

    jugador.dibujar(ctx, raton);
}

// Terminar partida

function terminarJuego(victoria) {

    jugando = false;

    pantalla.classList.remove("oculto");

    document.getElementById("titulo").textContent =
        victoria ? "¡VICTORIA!" : "HAS SIDO ELIMINADO";

    document.getElementById("mensaje").textContent =
        victoria
        ? "¡Eres el último superviviente! Bajas: " + bajas
        : "Te han eliminado. Bajas: " + bajas;

    botonJugar.textContent = "JUGAR OTRA VEZ";
}

// Ciclo principal

function bucle(tiempo) {

    const delta = Math.min(
        (tiempo - ultimoTiempo) / 1000 || 0,
        0.033
    );

    ultimoTiempo = tiempo;

    if (jugando) {

        actualizar(delta);

        dibujar();
    }

    requestAnimationFrame(bucle);
}

// Controles del teclado

window.addEventListener("keydown", e => {

    const tecla = e.key.toLowerCase();

    teclas[tecla] = true;

    if (tecla === "r" && jugador && jugando) {

        jugador.recargar();
    }

    // Seleccionar armas

    if (tecla === "1") {
        armaActual = "pistola";
    }

    if (tecla === "2") {
        armaActual = "rifle";
    }

    if ([
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright"
    ].includes(tecla)) {

        e.preventDefault();
    }
});

window.addEventListener("keyup", e => {

    teclas[e.key.toLowerCase()] = false;
});

// Control del mouse

canvas.addEventListener("mousemove", e => {

    const rect = canvas.getBoundingClientRect();

    raton.x =
        (e.clientX - rect.left) * 900 / rect.width;

    raton.y =
        (e.clientY - rect.top) * 560 / rect.height;
});

canvas.addEventListener("mousedown", () => {

    disparando = true;
});

window.addEventListener("mouseup", () => {

    disparando = false;
});

// Botón para jugar

botonJugar.addEventListener("click", iniciarJuego);

// Preparar pantalla inicial

iniciarJuego();

jugando = false;

pantalla.classList.remove("oculto");

botonJugar.textContent = "JUGAR";

requestAnimationFrame(bucle);
