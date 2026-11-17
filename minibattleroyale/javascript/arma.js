
export function disparar(origen, objetivo, propietario, balas, danio = 30) {

    const angulo = Math.atan2(
        objetivo.y - origen.y,
        objetivo.x - origen.x
    );

    const velocidad = propietario === "jugador" ? 470 : 300;

    balas.push({

        x: origen.x,
        y: origen.y,

        vx: Math.cos(angulo) * velocidad,
        vy: Math.sin(angulo) * velocidad,

        propietario: propietario,

        danio: danio,

        vida: 1.5
    });
}

export function actualizarBalas(
    balas,
    tiempo,
    jugador,
    enemigos,
    obstaculos,
    sumarBaja
) {

    for (const bala of balas) {

        bala.x += bala.vx * tiempo;
        bala.y += bala.vy * tiempo;

        bala.vida -= tiempo;

        if (
            bala.x < 0 || bala.x > 900 ||
            bala.y < 0 || bala.y > 560
        ) {
            bala.vida = 0;
            continue;
        }

        const choco = obstaculos.some(o =>
            Math.hypot(bala.x - o.x, bala.y - o.y)
            < o.radio * 0.8
        );

        if (choco) {
            bala.vida = 0;
            continue;
        }

        if (bala.propietario === "jugador") {

            for (const enemigo of enemigos) {

                if (!enemigo.vivo) continue;

                const distancia = Math.hypot(
                    bala.x - enemigo.x,
                    bala.y - enemigo.y
                );

                if (distancia < enemigo.radio + 4) {

                    enemigo.recibirDanio(bala.danio);

                    if (!enemigo.vivo) {
                        sumarBaja();
                    }

                    bala.vida = 0;
                    break;
                }
            }

        } else {

            const distancia = Math.hypot(
                bala.x - jugador.x,
                bala.y - jugador.y
            );

            if (distancia < jugador.radio + 4) {

                jugador.recibirDanio(bala.danio);

                bala.vida = 0;
            }
        }
    }

    return balas.filter(bala => bala.vida > 0);
}

export function dibujarBalas(ctx, balas) {

    balas.forEach(bala => {

        ctx.fillStyle =
            bala.propietario === "jugador" ? "yellow" : "orange";

        ctx.beginPath();

        ctx.arc(
            bala.x,
            bala.y,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}
