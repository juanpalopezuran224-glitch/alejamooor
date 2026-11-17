
export class Jugador {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.radio = 14;
        this.velocidad = 200;

        this.vida = 100;

        this.municion = 12;
        this.reserva = 60;

        this.maximoBalas = 12;

        this.recargando = false;
        this.tiempoRecarga = 0;
    }

    mover(teclas, tiempo, obstaculos) {

        let dx = 0;
        let dy = 0;

        if (teclas["w"] || teclas["arrowup"]) dy--;
        if (teclas["s"] || teclas["arrowdown"]) dy++;
        if (teclas["a"] || teclas["arrowleft"]) dx--;
        if (teclas["d"] || teclas["arrowright"]) dx++;

        const longitud = Math.hypot(dx, dy) || 1;

        const nuevoX = this.x + dx / longitud * this.velocidad * tiempo;
        const nuevoY = this.y + dy / longitud * this.velocidad * tiempo;

        if (!obstaculos.some(o =>
            Math.hypot(nuevoX - o.x, this.y - o.y) <
            this.radio + o.radio * 0.8
        )) {
            this.x = Math.max(this.radio, Math.min(886, nuevoX));
        }

        if (!obstaculos.some(o =>
            Math.hypot(this.x - o.x, nuevoY - o.y) <
            this.radio + o.radio * 0.8
        )) {
            this.y = Math.max(this.radio, Math.min(546, nuevoY));
        }
    }

    dibujar(ctx, raton) {

        const angulo = Math.atan2(
            raton.y - this.y,
            raton.x - this.x
        );

        ctx.strokeStyle = "#222";
        ctx.lineWidth = 7;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        ctx.lineTo(
            this.x + Math.cos(angulo) * 25,
            this.y + Math.sin(angulo) * 25
        );

        ctx.stroke();

        ctx.fillStyle = "#176bd1";

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    recibirDanio(cantidad) {

        this.vida -= cantidad;

        this.vida = Math.max(0, this.vida);
    }

    recargar() {

        if (
            !this.recargando &&
            this.municion < this.maximoBalas &&
            this.reserva > 0
        ) {

            this.recargando = true;
            this.tiempoRecarga = 1.2;
        }
    }

    actualizarRecarga(tiempo) {

        if (!this.recargando) return;

        this.tiempoRecarga -= tiempo;

        if (this.tiempoRecarga <= 0) {

            const cantidad = Math.min(
                this.maximoBalas - this.municion,
                this.reserva
            );

            this.municion += cantidad;
            this.reserva -= cantidad;

            this.recargando = false;
        }
    }
}
