
export function crearMapa() {

    const obstaculos = [];

    for (let i = 0; i < 28; i++) {

        const x = 40 + Math.random() * 820;
        const y = 40 + Math.random() * 480;

        const radio = 15 + Math.random() * 12;

        if (Math.hypot(x - 450, y - 280) < 90) {
            continue;
        }

        obstaculos.push({

            x: x,
            y: y,

            radio: radio,

            tipo: Math.random() < 0.7
                ? "arbol"
                : "piedra"
        });
    }

    return obstaculos;
}

export function dibujarMapa(ctx, obstaculos) {

    ctx.fillStyle = "#56884c";

    ctx.fillRect(0, 0, 900, 560);

    // Dibujar árboles y piedras

    obstaculos.forEach(o => {

        if (o.tipo === "arbol") {

            ctx.fillStyle = "#65452d";

            ctx.beginPath();

            ctx.arc(
                o.x + 3,
                o.y + 5,
                o.radio * 0.5,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle = "#1f5b32";

            ctx.beginPath();

            ctx.arc(
                o.x,
                o.y,
                o.radio,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle = "#367b3d";

            ctx.beginPath();

            ctx.arc(
                o.x - 5,
                o.y - 5,
                o.radio * 0.6,
                0,
                Math.PI * 2
            );

            ctx.fill();

        } else {

            ctx.fillStyle = "#888888";

            ctx.beginPath();

            ctx.arc(
                o.x,
                o.y,
                o.radio * 0.8,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    });
}

export function posicionLibre(obstaculos) {

    let x, y;
    let intentos = 0;

    do {

        x = 30 + Math.random() * 840;
        y = 30 + Math.random() * 500;

        intentos++;

    } while (

        obstaculos.some(o =>
            Math.hypot(x - o.x, y - o.y) < o.radio + 35
        ) && intentos < 100
    );

    return { x, y };
}
