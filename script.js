// =========================================================================
// SISTEMA INTEGRAL - ACADEMIA DE CIBER-HÉROES (JUEGOS MOUSE Y TECLADO)
// =========================================================================

// Variables de Control de Estado Global
let puntosTotales = 0;
let loopActivo = null;

// Elementos del DOM
const pMenu = document.getElementById('pantalla-menu');
const pMouse = document.getElementById('pantalla-mouse');
const pTeclado = document.getElementById('pantalla-teclado');

const txtPuntosGlobales = document.getElementById('puntos-globales');
const txtScoreMouse = document.getElementById('score-mouse');
const txtScoreTeclado = document.getElementById('score-teclado');

// =========================================================================
// MOTOR DEL JUEGO 1: ROMPER GLOBOS (CONTROL DE RATÓN)
// =========================================================================
const canvasM = document.getElementById('canvas-mouse');
const ctxM = canvasM.getContext('2d');
let globosJuego = [];
let scoreM = 0;

class GloboObjetivo {
  constructor() {
    this.radio = Math.random() * 15 + 25;
    this.x = Math.random() * (canvasM.width - this.radio * 2) + this.radio;
    this.y = canvasM.height + this.radio + Math.random() * 50;
    this.velocidad = Math.random() * 1.5 + 1.5;
    this.faseBalanceo = Math.random() * 100;
    const colores = ['#ff4081', '#00e676', '#00b0ff', '#ffea00', '#d500f9', '#ff9100'];
    this.color = colores[Math.floor(Math.random() * colores.length)];
  }
  dibujar() {
    ctxM.save();
    ctxM.translate(this.x, this.y);
    
    // Hilo del globo
    ctxM.beginPath();
    ctxM.moveTo(0, this.radio);
    ctxM.quadraticCurveTo(Math.sin(this.faseBalanceo)*5, this.radio + 15, 0, this.radio + 30);
    ctxM.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctxM.lineWidth = 2;
    ctxM.stroke();

    // Cuerpo esférico escalado
    ctxM.beginPath();
    ctxM.scale(1, 1.2);
    ctxM.arc(0, 0, this.radio, 0, Math.PI * 2);
    ctxM.fillStyle = this.color;
    ctxM.fill();
    ctxM.restore();
  }
  actualizar() {
    this.y -= this.velocidad;
    this.faseBalanceo += 0.03;
    this.x += Math.sin(this.faseBalanceo) * 0.6;
  }
}

function bucleJuegoMouse() {
  ctxM.fillStyle = '#0f172a';
  ctxM.fillRect(0, 0, canvasM.width, canvasM.height);

  if (globosJuego.length < 6) { globosJuego.push(new GloboObjetivo()); }

  globosJuego.forEach((g, idx) => {
    g.actualizar();
    g.dibujar();
    if (g.y < -g.radio * 2) { globosJuego[idx] = new GloboObjetivo(); }
  });

  loopActivo = requestAnimationFrame(bucleJuegoMouse);
}

canvasM.addEventListener('mousedown', (e) => {
  const rect = canvasM.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  globosJuego.forEach((g, idx) => {
    // Cálculo matemático de distancia euclidiana entre clic y centro del globo
    const dx = mouseX - g.x;
    const dy = mouseY - g.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia < g.radio * 1.2) {
      globosJuego.splice(idx, 1);
      scoreM++;
      txtScoreMouse.innerText = scoreM;
      actualizarPuntosGlobales(5);

      if (scoreM >= 10) {
        alert("🎉 ¡Misión Cumplida! Has dominado el uso del Ratón.");
        salirAlMenu();
      }
    }
  });
});

// =========================================================================
// MOTOR DEL JUEGO 2: LLUVIA DE LETRAS (CONTROL DE TECLADO)
// =========================================================================
const canvasT = document.getElementById('canvas-teclado');
const ctxT = canvasT.getContext('2d');
let letrasJuego = [];
let scoreT = 0;

class LetraCaida {
  constructor() {
    const alfabeto = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    this.letra = alfabeto[Math.floor(Math.random() * alfabeto.length)];
    this.x = Math.random() * (canvasT.width - 60) + 30;
    this.y = -30 - Math.random() * 50;
    this.velocidad = Math.random() * 1 + 1.2;
    const coloresClaros = ['#38bdf8', '#4ade80', '#facc15', '#f472b6', '#fb923c', '#c084fc'];
    this.color = coloresClaros[Math.floor(Math.random() * coloresClaros.length)];
  }
  dibujar() {
    ctxT.save();
    ctxT.fillStyle = this.color;
    ctxT.font = "bold 38px 'Fredoka One', cursive";
    ctxT.textAlign = "center";
    
    // Contenedor visual tipo bloque de código
    ctxT.strokeStyle = 'rgba(255,255,255,0.15)';
    ctxT.lineWidth = 2;
    ctxT.strokeRect(this.x - 25, this.y - 32, 50, 48);
    ctxT.fillStyle = 'rgba(255,255,255,0.05)';
    ctxT.fillRect(this.x - 25, this.y - 32, 50, 48);

    ctxT.fillStyle = this.color;
    ctxT.fillText(this.letra, this.x, this.y + 6);
    ctxT.restore();
  }
  actualizar() {
    this.y += this.velocidad;
  }
}

function bucleJuegoTeclado() {
  ctxT.fillStyle = '#090d16';
  ctxT.fillRect(0, 0, canvasT.width, canvasT.height);

  if (letrasJuego.length < 5) { letrasJuego.push(new LetraCaida()); }

  letrasJuego.forEach((l, idx) => {
    l.actualizar();
    l.dibujar();
    if (l.y > canvasT.height + 40) { letrasJuego[idx] = new LetraCaida(); }
  });

  loopActivo = requestAnimationFrame(bucleJuegoTeclado);
}

window.addEventListener('keydown', (e) => {
  if (pTeclado.classList.contains('oculto')) return;

  const teclaPresionada = e.key.toUpperCase();
  
  for (let i = 0; i < letrasJuego.length; i++) {
    if (letrasJuego[i].letra === teclaPresionada) {
      letrasJuego.splice(i, 1);
      scoreT++;
      txtScoreTeclado.innerText = scoreT;
      actualizarPuntosGlobales(10);

      if (scoreT >= 10) {
        alert("🎉 ¡Increíble! Tus dedos ya reconocen las teclas de la computadora.");
        salirAlMenu();
      }
      break;
    }
  }
});

// =========================================================================
// SISTEMA DE NAVEGACIÓN Y ENRUTAMIENTO ENTRE PANTALLAS
// =========================================================================
function dimensionarLienzos() {
  canvasM.width = window.innerWidth;
  canvasM.height = window.innerHeight;
  canvasT.width = window.innerWidth;
  canvasT.height = window.innerHeight;
}
window.addEventListener('resize', dimensionarLienzos);

function actualizarPuntosGlobales(puntos) {
  puntosTotales += puntos;
  txtPuntosGlobales.innerText = puntosTotales;
}

function salirAlMenu() {
  cancelAnimationFrame(loopActivo);
  pMouse.classList.add('oculto');
  pTeclado.classList.add('oculto');
  pMenu.classList.remove('oculto');
}

// Disparadores de arranque de Misiones
document.getElementById('card-mouse').addEventListener('click', () => {
  pMenu.classList.add('oculto');
  pMouse.classList.remove('oculto');
  dimensionarLienzos();
  scoreM = 0;
  txtScoreMouse.innerText = scoreM;
  globosJuego = [];
  bucleJuegoMouse();
});

document.getElementById('card-teclado').addEventListener('click', () => {
  pMenu.classList.add('oculto');
  pTeclado.classList.remove('oculto');
  dimensionarLienzos();
  scoreT = 0;
  txtScoreTeclado.innerText = scoreT;
  letrasJuego = [];
  bucleJuegoTeclado();
});

document.getElementById('card-graduacion').addEventListener('click', () => {
  alert("🎓 ¡Misión Final Desbloqueada! Accediendo a tu pasarela de graduación...");
  // Enrutamiento directo: Aquí puedes redirigir a las páginas de diplomas hechas previamente.
});

// Listeners para botones de retroceso
document.getElementById('btn-salir-mouse').addEventListener('click', salirAlMenu);
document.getElementById('btn-salir-teclado').addEventListener('click', salirAlMenu);
