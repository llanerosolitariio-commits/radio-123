let peer;
let conn;
let currentCall;

const pttButton = document.getElementById('ptt-button');
const statusLight = document.getElementById('status-light');
const statusText = document.getElementById('status-text');

// SONIDOS DE RADIO (Opcional pero genial)
const beepStart = new Audio('https://www.soundjay.com/communication/sounds/beeper-2.mp3');
const beepEnd = new Audio('https://www.soundjay.com/communication/sounds/radio-noise-1.mp3');

// 1. PASO UNO: Encender la radio con TU ID
function iniciarRadio() {
    const customId = document.getElementById('my-custom-id').value.trim();
    if (!customId) return alert("Por favor, escribe un nombre para tu radio");

    // Creamos el Peer con el ID que tú elegiste
    peer = new Peer(customId);

    peer.on('open', (id) => {
        statusLight.style.background = "orange";
        statusText.innerText = "ESCUCHANDO...";
        document.getElementById('btn-start').disabled = true;
        document.getElementById('my-custom-id').disabled = true;
        document.getElementById('connect-area').style.display = "block";
    });

    peer.on('error', (err) => {
        alert("Ese nombre ya está en uso o es inválido. Prueba con otro.");
        location.reload();
    });

    // Escuchar llamadas entrantes
    peer.on('call', (call) => {
        call.answer(); 
        call.on('stream', (remoteStream) => {
            const audio = new Audio();
            audio.srcObject = remoteStream;
            audio.play();
        });
    });
}

// 2. PASO DOS: Conectar con la otra radio
function conectar() {
    const remoteId = document.getElementById('peer-id').value.trim();
    if (!remoteId) return alert("Escribe el ID de la otra persona");

    conn = peer.connect(remoteId);
    
    conn.on('open', () => {
        statusLight.style.background = "#22c55e";
        statusText.innerText = "CONECTADO A: " + remoteId;
        pttButton.disabled = false;
    });
}

// 3. PASO TRES: Hablar (Push To Talk)
pttButton.onmousedown = pttButton.ontouchstart = async (e) => {
    e.preventDefault(); // Evita menús contextuales en móvil
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const remoteId = document.getElementById('peer-id').value;
        
        currentCall = peer.call(remoteId, stream);
        statusLight.style.background = "red";
        statusText.innerText = "TRANSMITIENDO...";
        beepStart.play();
    } catch (err) {
        alert("Error al acceder al micrófono");
    }
};

pttButton.onmouseup = pttButton.ontouchend = () => {
    if (currentCall) {
        currentCall.close();
        statusLight.style.background = "#22c55e";
        statusText.innerText = "CONECTADO";
        beepEnd.play();
    }
};};
