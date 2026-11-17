
export class Enemigo {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.radio = 13;
        this.vida = 60;

        this.velocidad = 75;

        this.vivo = true;

        this.tiempoDisparo = Math.random() + 0.5;

        this.color = "#e34d4d";
    }

    actualizar(jugador, tiempo, disparar, obstaculos) {

        if (!this.vivo) return;

        const dx = jugador.x - this.x;
        const dy = jugador.y - this.y;

        const distancia = Math.hypot(dx, dy);

        if (distancia > 100) {

            const nuevoX = this.x + dx / distancia *
                this.velocidad * tiempo;

            const nuevoY = this.y + dy / distancia *
                this.velocidad * tiempo;

            if (!obstaculos.some(o =>
                Math.hypot(nuevoX - o.x, this.y - o.y) <
                this.radio + o.radio * 0.8
            )) {
                this.x = nuevoX;
            }

            if (!obstaculos.some(o =>
                Math.hypot(this.x - o.x, nuevoY - o.y) <
                this.radio + o.radio * 0.8
            )) {
                this.y = nuevoY;
            }
        }

        this.tiempoDisparo -= tiempo;

        if (distancia < 350 && this.tiempoDisparo <= 0) {

            disparar(this, jugador, "enemigo");

            this.tiempoDisparo = 1.2;
        }
    }

    dibujar(ctx) {

        if (!this.vivo) return;

        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "red";
        ctx.fillRect(this.x - 15, this.y - 23, 30, 5);

        ctx.fillStyle = "lime";

        ctx.fillRect(
            this.x - 15,
            this.y - 23,
            30 * Math.max(0, this.vida / 60),
            5
        );
    }

    recibirDanio(cantidad) {

        this.vida -= cantidad;

        if (this.vida <= 0) {

            this.vida = 0;
            this.vivo = false;
        }
    }
}
