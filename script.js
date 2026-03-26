// --- NUEVA FUNCIÓN DE DIBUJO ESTÉTICO ---
function dibujarTodo() {
    // 1. DIBUJAR EL OCTÁGONO (como líneas de campo)
    ctx.strokeStyle = "rgba(255,255,255,0.1)"; // Líneas suaves
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Creamos una forma octogonal que conecte los postes
    let vertices = [];
    for(let i=0; i<8; i++) {
        vertices.push({x: 120 + i * 95, y: GROUND_Y - madrinas[i]});
    }
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for(let i=1; i<8; i++) { ctx.lineTo(vertices[i].x, vertices[i].y); }
    ctx.closePath();
    ctx.stroke();

    // 2. DIBUJAR LOS POSTES (MADRINAS)
    madrinas.forEach((m, i) => {
        let px = 120 + i * 95;
        // Línea del poste
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath(); ctx.moveTo(px, GROUND_Y); ctx.lineTo(px, GROUND_Y - m); ctx.stroke();
        // Círculo del poste y Número
        ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(px, GROUND_Y - m, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 14px Arial"; ctx.fillText(m, px - 12, GROUND_Y - m - 15);
    });

    // 3. DIBUJAR LA PELOTA
    if (pelota.activa) {
        ctx.fillStyle = "orange"; ctx.beginPath(); ctx.arc(pelota.x, pelota.y, 10, 0, Math.PI*2); ctx.fill();
    }

    // 4. DIBUJAR A LOS "NIÑOS" (con forma de monigote)
    ninos.forEach(n => {
        if (!n.activo) return;
        
        // Color según estado (Malo=negro, Refugio=Verde, Quemado=Rojo, Normal=Blanco)
        ctx.fillStyle = n.esMalo ? "black" : n.refugiado ? "#2ecc71" : n.quemado ? "#e74c3c" : "white";
        
        // Dibujar Monigote (Cuerpo simple)
        let radioCabeza = 12;
        // Cabeza
        ctx.beginPath(); ctx.arc(n.x, n.y - radioCabeza, radioCabeza, 0, Math.PI*2); ctx.fill();
        
        // Dibujar Halo de Refugio
        if (n.refugiado) {
            ctx.strokeStyle = "rgba(46, 204, 113, 0.5)"; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(n.x, n.y - radioCabeza, radioCabeza + 5, 0, Math.PI*2); ctx.stroke();
        }

        // Cuerpo (Líneas)
        ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y); // Cuello
        ctx.lineTo(n.x, n.y + 20); // Tronco
        ctx.lineTo(n.x - 10, n.y + 35); // Pierna L
        ctx.moveTo(n.x, n.y + 20);
        ctx.lineTo(n.x + 10, n.y + 35); // Pierna R
        ctx.moveTo(n.x - 12, n.y + 10);
        ctx.lineTo(n.x + 12, n.y + 10); // Brazos
        ctx.stroke();

        // Nombre debajo
        ctx.fillStyle = "white"; ctx.font = "12px Arial";
        ctx.fillText(n.tipo + (n.esMalo?"(M)":""), n.x-15, n.y+55);
        
        // Dibujar X de fallos
        if (n.fallos > 0) {
            ctx.fillStyle = "red"; ctx.font = "bold 16px Arial";
            ctx.fillText("X".repeat(n.fallos), n.x - 10, n.y - 45);
        }
    });
}
