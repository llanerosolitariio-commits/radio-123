let peer = new Peer(); // Crea un ID único para ti
let conn;
let currentCall;
const pttButton = document.getElementById('ptt-button');
const statusLight = document.getElementById('status-light');
const statusText = document.getElementById('status-text');

// Al iniciar, mostramos tu ID para que se lo des al otro
peer.on('open', (id) => {
    document.getElementById('my-id').innerText = id;
});

// Cuando alguien te llama (conecta el audio)
peer.on('call', (call) => {
    call.answer(); // Contestamos automáticamente
    call.on('stream', (remoteStream) => {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play();
    });
});

function conectar() {
    const remoteId = document.getElementById('peer-id').value;
    if (!remoteId) return alert("Introduce el ID del otro");

    // Conectamos datos para saber que estamos unidos
    conn = peer.connect(remoteId);
    
    conn.on('open', () => {
        statusLight.style.background = "#22c55e";
        statusText.innerText = "CONECTADO";
        pttButton.disabled = false;
    });
}

// Lógica de "Mantener para hablar"
pttButton.onmousedown = pttButton.ontouchstart = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const remoteId = document.getElementById('peer-id').value;
    currentCall = peer.call(remoteId, stream);
    statusText.innerText = "TRANSMITIENDO...";
};

pttButton.onmouseup = pttButton.ontouchend = () => {
    if (currentCall) {
        currentCall.close(); // Corta el envío de audio
        statusText.innerText = "CONECTADO";
    }
};