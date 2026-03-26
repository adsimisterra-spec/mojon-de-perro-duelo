const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const WIDTH = 900; const HEIGHT = 650;
const GROUND_Y = 550; 
const madrinas = [150, 200, 250, 300, 350, 400, 450, 500];

let estadoJuego = "reposo"; 
let pelota = { x: 450, y: 540, vx: 0, vy: 0, radio: 10, activa: false };
let maloTienePelota = false;
let indiceMalo = -1;
let ninos = []; // "ninos" sin eñe para evitar errores de código

// Crear 8 jugadores
for (let i = 0; i < 8; i++) {
    ninos.push({
        id: i, x: 120 + i * 95, y: GROUND_Y, yBase: GROUND_Y,
        tipo: (i===0)?"P1":(i===1)?"P2":"IA",
        esMalo: false, llegoMeta: false, quemado: false, fallos: 0, activo: true,
        tiempoRefugio: 0, refugiado: false, madrinaY: GROUND_Y - madrinas[i]
    });
}

function bucle() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Dibujar Suelo
    ctx.fillStyle = "#444";
    ctx.fillRect(0, GROUND_Y, WIDTH, 100);

    // Lógica de carrera
    if (estadoJuego === "carrera") {
        actualizarJuego();
    }
    
    dibujarTodo();
    requestAnimationFrame(bucle);
}

function actualizarJuego() {
    // Aquí irá la lógica de movimiento y el Malo buscando la pelota
    // Por ahora, asegúrate de que los nombres de archivos estén bien.
}

function dibujarTodo() {
    ninos.forEach(n => {
        ctx.fillStyle = n.refugiado ? "#2ecc71" : n.quemado ? "#e74c3c" : "white";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 20, 0, Math.PI*2);
        ctx.fill();
    });
}

bucle();
