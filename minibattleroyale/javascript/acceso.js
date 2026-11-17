

 // COMPROBAR SESIÓN DEL JUGADOR

const usuarioActivo = localStorage.getItem("usuarioActivo");

const usuarios = JSON.parse(
    localStorage.getItem("usuarios")
) || [];

// BUSCAR AL JUGADOR

const jugador = usuarios.find(
    usuario => String(usuario.id) === String(usuarioActivo)
);

// SI NO EXISTE UNA SESIÓN, VOLVER AL LOGIN

if (!jugador) {

    localStorage.removeItem("usuarioActivo");

   window.location.href = "../html/cuenta.html";

} else {

    // GUARDAR LOS DATOS DEL JUGADOR ACTUAL

    localStorage.setItem(
        "nombreJugador",
        jugador.nombre
    );

    console.log("Jugador conectado:", jugador.nombre);

    // CARGAR EL JUEGO

    import("./principal.js").catch(error => {
        console.error("Error al cargar el juego:", error);
        alert("No se pudo cargar el juego. Revisa la consola.");
    });

}
