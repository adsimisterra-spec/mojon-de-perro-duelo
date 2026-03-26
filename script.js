// --- CONFIGURACIÓN DEL JUEGO ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const WIDTH = 900; const HEIGHT = 650;
const GROUND_Y = 550; 
const madrinas = [150, 200, 250, 300, 350, 400, 450, 500];

let estadoJuego = "reposo"; 
let pelota = { x: 450, y: 540, vx: 0, vy: 0, radio: 10, activa: false };
let maloTienePelota = false;
let indiceMalo = -1;
let niños = [];

// Crear 8 niños
for (let i = 0; i < 8; i++) {
    niños.push({
        id: i, x: 120 + i * 95, y: GROUND_Y, yBase: GROUND_Y,
        tipo: (i===0)?"P1":(i===1)?"P2":"IA",
        color: "#fff", llegoMeta: false, quemado: false, fallos: 0, activo: true,
        tiempoRefugio: 0, refugiado: false, madrinaY: GROUND_Y - madrinas[i]
    });
}

// --- LÓGICA DE ACTUALIZACIÓN ---
function bucle() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    dibujarEscena();

    if (estadoJuego === "carrera") {
        actualizarNiños();
        actualizarMaloYPelota();
    }
    
    dibujarNiños();
    requestAnimationFrame(bucle);
}

function actualizarNiños() {
    niños.forEach(n => {
        if (!n.activo || n.esMalo || n.quemado) return;

        // Gestión de Refugio
        if (n.refugiado) {
            n.tiempoRefugio--;
            if (n.tiempoRefugio <= 0) n.refugiado = false;
        }

        // Movimiento IA
        if (n.tipo === "IA") {
            if (!n.llegoMeta) {
                n.y -= 5;
                if (n.y <= n.madrinaY) { n.llegoMeta = true; n.refugiado = true; n.tiempoRefugio = 180; }
            } else if (!n.refugiado && n.y < n.yBase) {
                n.y += 4;
            }
        }
        // Nota: P1 y P2 se mueven con teclado (implementar según keys)
    });
}

function actualizarMaloYPelota() {
    let malo = niños[indiceMalo];
    if (!malo) return;

    if (!maloTienePelota && !pelota.activa) {
        // El malo corre hacia la pelota
        let dx = pelota.x - malo.x; let dy = pelota.y - malo.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 5) { malo.x += (dx/dist)*7; malo.y += (dy/dist)*7; }
        else { maloTienePelota = true; }
    }

    if (pelota.activa) {
        pelota.x += pelota.vx; pelota.y += pelota.vy;
        verificarImpacto();
        if (pelota.x < 0 || pelota.x > WIDTH || pelota.y < 0 || pelota.y > HEIGHT) pelota.activa = false;
    }
}

function verificarImpacto() {
    niños.forEach(n => {
        if (n.esMalo || !n.activo || n.refugiado || n.quemado) return;
        let dist = Math.sqrt((n.x-pelota.x)**2 + (n.y-pelota.y)**2);
        if (dist < 25) { n.quemado = true; n.fallos++; pelota.activa = false; }
    });
}

function dibujarEscena() {
    ctx.fillStyle = "#444"; ctx.fillRect(0, GROUND_Y, WIDTH, 100);
    madrinas.forEach((m, i) => {
        ctx.fillStyle = "white"; ctx.fillText(m, 110 + i * 95, GROUND_Y - m - 10);
    });
}

function dibujarNiños() {
    niños.forEach(n => {
        if (!n.activo) return;
        ctx.fillStyle = n.esMalo ? "black" : n.refugiado ? "green" : n.quemado ? "red" : "white";
        ctx.beginPath(); ctx.arc(n.x, n.y, 20, 0, Math.PI*2); ctx.fill();
        // Dibujar X de fallos
        ctx.fillStyle = "red"; ctx.fillText("X".repeat(n.fallos), n.x - 10, n.y - 30);
    });
}

bucle();
