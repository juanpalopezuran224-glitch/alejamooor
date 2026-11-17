
const formularioLogin = document.getElementById("formularioLogin");
const formularioRegistro = document.getElementById("formularioRegistro");

const mostrarLogin = document.getElementById("mostrarLogin");
const mostrarRegistro = document.getElementById("mostrarRegistro");

const mensaje = document.getElementById("mensaje");

// OBTENER CUENTAS GUARDADAS
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// CAMBIAR ENTRE LOGIN Y REGISTRO

mostrarLogin.addEventListener("click", () => {
    formularioLogin.classList.remove("oculto");
    formularioRegistro.classList.add("oculto");

    mostrarLogin.classList.add("activo");
    mostrarRegistro.classList.remove("activo");

    mensaje.textContent = "";
});

mostrarRegistro.addEventListener("click", () => {
    formularioRegistro.classList.remove("oculto");
    formularioLogin.classList.add("oculto");

    mostrarRegistro.classList.add("activo");
    mostrarLogin.classList.remove("activo");

    mensaje.textContent = "";
});

// REGISTRAR JUGADOR

formularioRegistro.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombreRegistro").value.trim();
    const correo = document.getElementById("correoRegistro").value.trim().toLowerCase();
    const clave = document.getElementById("claveRegistro").value;
    const confirmar = document.getElementById("confirmarClave").value;

    if (nombre.length < 3) {
        mensaje.textContent = "El nombre debe tener mínimo 3 caracteres.";
        return;
    }

    if (clave.length < 8) {
        mensaje.textContent = "La contraseña debe tener mínimo 8 caracteres.";
        return;
    }

    if (clave !== confirmar) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        return;
    }

    const usuarios = obtenerUsuarios();

    // COMPROBAR SI EL CORREO YA EXISTE

    const existe = usuarios.some(usuario => usuario.correo === correo);

    if (existe) {
        mensaje.textContent = "Este correo ya está registrado.";
        return;
    }

    // CREAR NUEVO JUGADOR

    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        correo: correo,
        clave: clave,
        nivel: 1,
        monedas: 0,
        victorias: 0,
        partidas: 0
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mensaje.textContent = "¡Cuenta creada correctamente!";

    formularioRegistro.reset();

    // CAMBIAR A INICIO DE SESIÓN

    setTimeout(() => {
        mostrarLogin.click();
        document.getElementById("correoLogin").value = correo;
    }, 1000);
});

// INICIAR SESIÓN

formularioLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const correo = document.getElementById("correoLogin").value.trim().toLowerCase();
    const clave = document.getElementById("claveLogin").value;

    const usuarios = obtenerUsuarios();

    const usuarioEncontrado = usuarios.find(usuario =>
        usuario.correo === correo && usuario.clave === clave
    );

    if (!usuarioEncontrado) {
        mensaje.textContent = "Correo o contraseña incorrectos.";
        return;
    }

    // GUARDAR SESIÓN ACTIVA

    localStorage.setItem("usuarioActivo", usuarioEncontrado.id);

    mensaje.textContent = "¡Bienvenido " + usuarioEncontrado.nombre + "!";

    setTimeout(() => {
        window.location.href = "../html/inicio.html";
    }, 700);
});
