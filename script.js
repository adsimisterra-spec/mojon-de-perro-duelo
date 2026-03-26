const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const WIDTH = 900; const HEIGHT = 650;
const GROUND_Y = 550; 
const madrinas = [150, 200, 250, 300, 350, 400, 450, 500];

let estadoJuego = "reposo"; 
let pelota = { x: 450, y: 540, vx: 0, vy: 0, radio: 10, activa: false };
let ninos = [];

// Inicializar 8 niños
for (let i = 0; i < 8; i++) {
    ninos.push({
        id: i, x: 120 + i * 95, y: GROUND_Y, yBase: GROUND_Y,
        tipo: (i===0)?"P1":(i===1)?"P2":"IA",
        madrinaY: GROUND_Y - madrinas[i],
        refugiado: false, tiempoRefugio: 0, llegoMeta: false
    });
}

function bucle() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Dibujar Suelo y Madrinas
    ctx.fillStyle = "#444";
    ctx.fillRect(0, GROUND_Y, WIDTH, 100);
    
    madrinas.forEach((m, i) => {
        let posX = 120 + i * 95;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(posX, GROUND_Y);
        ctx.lineTo(posX, GROUND_Y - m);
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.fillText(m, posX - 10, GROUND_Y - m - 10);
    });

    // Dibujar Niños
    ninos.forEach(n => {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 20, 0, Math.PI*2);
        ctx.fill();
    });

    requestAnimationFrame(bucle);
}
bucle();
