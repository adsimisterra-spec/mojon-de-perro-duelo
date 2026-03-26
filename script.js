const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const WIDTH = 900; const HEIGHT = 650;
const GROUND_Y = 550; 
const madrinas = [150, 200, 250, 300, 350, 400, 450, 500];

let estadoJuego = "reposo"; 
let pelota = { x: 450, y: 530, vx: 0, vy: 0, radio: 10, activa: false };
let ninos = [];
let indiceMalo = -1;
let maloTienePelota = false;
let keys = {};

// Configurar controles
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// Crear 8 jugadores
for (let i = 0; i < 8; i++) {
    ninos.push({
        id: i, x: 120 + i * 95, y: GROUND_Y, yBase: GROUND_Y,
        tipo: (i === 0) ? "P1" : (i === 1) ? "P2" : "IA",
        esMalo: false, llegoMeta: false, quemado: false, fallos: 0, activo: true,
        tiempoRefugio: 0, refugiado: false, madrinaY: GROUND_Y - madrinas[i]
    });
}

function lanzarPelota() {
    if (estadoJuego !== "reposo") return;
    indiceMalo = Math.floor(Math.random() * 8);
    ninos.forEach((n, i) => n.esMalo = (i === indiceMalo));
    estadoJuego = "carrera";
    pelota.activa = true;
    pelota.vy = -5; // La pelota vuela al inicio
}

function bucle() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Dibujar Suelo y Postes
    ctx.fillStyle = "#444";
    ctx.fillRect(0, GROUND_Y, WIDTH, 100);
    madrinas.forEach((m, i) => {
        let px = 120 + i * 95;
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath(); ctx.moveTo(px, GROUND_Y); ctx.lineTo(px, GROUND_Y - m); ctx.stroke();
        ctx.fillStyle = "white"; ctx.fillText(m, px - 10, GROUND_Y - m - 10);
    });

    if (estadoJuego === "carrera") {
        actualizarLogica();
    }
    
    dibujarTodo();
    requestAnimationFrame(bucle);
}

function actualizarLogica() {
    let malo = ninos[indiceMalo];

    // 1. Movimiento de Niños e IA
    ninos.forEach(n => {
        if (!n.activo || n.esMalo || n.quemado) return;
        if (n.refugiado) {
            n.tiempoRefugio--;
            if (n.tiempoRefugio <= 0) n.refugiado = false;
        } else {
            if (!n.llegoMeta) {
                n.y -= 3;
                if (n.y <= n.madrinaY) { n.llegoMeta = true; n.refugiado = true; n.tiempoRefugio = 180; }
            } else if (n.y < n.yBase) { n.y += 2; }
        }
    });

    // 2. Lógica del Malo y la Pelota
    if (!maloTienePelota && !pelota.activa) {
        let dx = pelota.x - malo.x; let dy = pelota.y - malo.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 5) { malo.x += (dx/dist)*5; malo.y += (dy/dist)*5; }
        else { maloTienePelota = true; }
    }

    if (pelota.activa) {
        pelota.x += pelota.vx; pelota.y += pelota.vy;
        // Rebotar en bordes
        if (pelota.x < 0 || pelota.x > WIDTH) pelota.vx *= -1;
        if (pelota.y < 0) pelota.vy *= -1;
        if (pelota.y > HEIGHT) pelota.activa = false; // Se cayó, el malo debe ir por ella

        // Colisión con niños
        ninos.forEach(n => {
            if (n.esMalo || !n.activo || n.refugiado || n.quemado) return;
            let dist = Math.sqrt((n.x - pelota.x)**2 + (n.y - pelota.y)**2);
            if (dist < 25) { n.quemado = true; n.fallos++; pelota.activa = false; }
        });
    }

    // 3. Lanzamiento del Malo (IA simple)
    if (maloTienePelota && malo.tipo === "IA") {
        let objetivo = ninos.find(n => !n.esMalo && n.activo && !n.refugiado && !n.quemado);
        if (objetivo) {
            pelota.x = malo.x; pelota.y = malo.y;
            let dx = objetivo.x - malo.x; let dy = objetivo.y - malo.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            pelota.vx = (dx/dist)*10; pelota.vy = (dy/dist)*10;
            pelota.activa = true; maloTienePelota = false;
        }
    }
}

function dibujarTodo() {
    ninos.forEach(n => {
        if (!n.activo) return;
        ctx.fillStyle = n.esMalo ? "black" : n.refugiado ? "#2ecc71" : n.quemado ? "#e74c3c" : "white";
        ctx.beginPath(); ctx.arc(n.x, n.y, 20, 0, Math.PI*2); ctx.fill();
        if (n.refugiado) { ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke(); }
        ctx.fillStyle = "white"; ctx.fillText(n.tipo + (n.esMalo?"(M)":""), n.x-15, n.y+35);
    });
    if (pelota.activa) {
        ctx.fillStyle = "orange"; ctx.beginPath(); ctx.arc(pelota.x, pelota.y, 10, 0, Math.PI*2); ctx.fill();
    }
}

// Vincular botón HTML
document.querySelector("button")?.addEventListener("click", lanzarPelota);

bucle();
