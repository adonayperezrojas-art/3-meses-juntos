document.addEventListener("DOMContentLoaded", () => {
    // Referencias al DOM
    const btnAbrir = document.getElementById("btn-abrir");
    const sobre = document.getElementById("sobre");
    const pantallaSobre = document.getElementById("pantalla-sobre");
    const pantallaCarta = document.getElementById("pantalla-carta");
    const mensajeTexto = document.getElementById("mensaje-texto");
    const fotoCarta = document.getElementById("foto-carta");
    const contenidoLayout = document.getElementById("contenido-layout");
    
    // Controles de navegación
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const indicadorPagina = document.getElementById("indicador-pagina");

    const canvas = document.getElementById("canvas-flores");
    const ctx = canvas.getContext("2d");

    // --------------------------------------------------------------------------
    // DATOS DE LAS PÁGINAS
    // --------------------------------------------------------------------------
    const paginas = [
        {
            texto: `Un pequeño detalle para recordar lo especial que eres para mí. 

Gracias por cada sonrisa, por cada momento compartido y por estar siempre ahí. Espero que este detalle te saque una sonrisa hoy y siempre. 💛🌻`,
            imagen: "foto.jpg"
        },
        {
            texto: `Este 10 de septiembre es un día muy especial para los dos. Amo cada día que paso contigo, ya son 3 meses juntos y me me haces inmensamente feliz.

A tu lado todo se siente más bonito y cada instante se vuelve un recuerdo inolvidable. ¡Gracias por estos 3 meses tan hermosos! ✨🩵`,
            imagen: "imagen.jpeg"
        }
    ];

    let paginaActual = 0;
    let animacionIniciada = false;
    let timerTipeo = null;

    // --------------------------------------------------------------------------
    // 1. ANIMACIÓN DE APERTURA DEL SOBRE
    // --------------------------------------------------------------------------
    btnAbrir.addEventListener("click", () => {
        if (animacionIniciada) return;
        animacionIniciada = true;

        sobre.classList.add("abierto");

        setTimeout(() => {
            pantallaSobre.classList.remove("activa");
            pantallaSobre.classList.add("oculta");

            setTimeout(() => {
                pantallaCarta.classList.remove("oculta");
                pantallaCarta.classList.add("activa");
                cargarPagina(0);
            }, 400);

        }, 1100);
    });

    // --------------------------------------------------------------------------
    // 2. CAMBIO DE PÁGINAS Y CARGA AUTOCORRECTIVA DE IMÁGENES
    // --------------------------------------------------------------------------
    function cargarPagina(index) {
        paginaActual = index;
        
        btnPrev.disabled = paginaActual === 0;
        btnNext.disabled = paginaActual === paginas.length - 1;
        indicadorPagina.textContent = `${paginaActual + 1} / ${paginas.length}`;

        contenidoLayout.classList.add("cambiando");

        setTimeout(() => {
            // Manejador para probar extensiones alternativas si la imagen falla
            fotoCarta.onerror = function() {
                if (this.src.endsWith(".JPG")) {
                    this.src = this.src.replace(".JPG", ".jpg");
                } else if (this.src.endsWith(".jpg")) {
                    this.src = this.src.replace(".jpg", ".png");
                } else if (this.src.endsWith(".png")) {
                    this.src = this.src.replace(".png", ".jpeg");
                } else {
                    this.onerror = null; // Detiene el bucle si ninguna existe
                }
            };

            fotoCarta.src = paginas[paginaActual].imagen;
            escribirTextoUltraRapido(paginas[paginaActual].texto, mensajeTexto, 8);

            contenidoLayout.classList.remove("cambiando");
        }, 200);
    }

    btnPrev.addEventListener("click", () => {
        if (paginaActual > 0) {
            cargarPagina(paginaActual - 1);
        }
    });

    btnNext.addEventListener("click", () => {
        if (paginaActual < paginas.length - 1) {
            cargarPagina(paginaActual + 1);
        }
    });

    // --------------------------------------------------------------------------
    // 3. EFECTO MÁQUINA DE ESCRIBIR OPTIMIZADO
    // --------------------------------------------------------------------------
    function escribirTextoUltraRapido(texto, elemento, velocidadMs = 8) {
        if (timerTipeo) clearInterval(timerTipeo);
        
        elemento.textContent = "";
        let i = 0;
        const total = texto.length;

        timerTipeo = setInterval(() => {
            if (i < total) {
                const char = texto.charAt(i);
                if (char === "\n") {
                    elemento.appendChild(document.createElement("br"));
                } else {
                    elemento.appendChild(document.createTextNode(char));
                }
                i++;
            } else {
                clearInterval(timerTipeo);
                timerTipeo = null;
            }
        }, velocidadMs);
    }

    // --------------------------------------------------------------------------
    // 4. CANVAS ANIMADO DE PÉTALOS Y FLORES
    // --------------------------------------------------------------------------
    function ajustarCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    ajustarCanvas();
    window.addEventListener("resize", ajustarCanvas);

    const simbolos = ["🌻", "🩵", "✨", "🟡"];
    const particulas = [];
    const numeroParticulas = 25;

    class Particula {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.size = Math.random() * 16 + 14;
            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            this.simbolo = simbolos[Math.floor(Math.random() * simbolos.length)];
            this.opacity = Math.random() * 0.5 + 0.5;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) + this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.simbolo, 0, 0);
            ctx.restore();
        }
    }

    for (let i = 0; i < numeroParticulas; i++) {
        particulas.push(new Particula());
    }

    function animarFondo() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particulas.forEach((p) => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animarFondo);
    }

    animarFondo();
});