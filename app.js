const URL = "https://698a177cc04d974bc6a15386.mockapi.io/api/v1/dispositivos_IoT";

const tabla = document.getElementById("tablaDatos");
const form = document.getElementById("form");
const modal = new bootstrap.Modal(document.getElementById("modalForm"));

const idInput = document.getElementById("id");
const deviceInput = document.getElementById("deviceName");
const direccionSelect = document.getElementById("direccionCode");
const ipInput = document.getElementById("ipClient");

/* ---------------- DIRECCIONES ---------------- */
const direcciones = {
    1: "Adelante",
    2: "Detener",
    3: "Atrás",
    4: "Vuelta derecha adelante",
    5: "Vuelta izquierda adelante",
    6: "Vuelta derecha atrás",
    7: "Vuelta izquierda atrás",
    8: "Giro 90° derecha",
    9: "Giro 90° izquierda"
};

function cargarSelect() {
    for (let key in direcciones) {
        direccionSelect.innerHTML += `<option value="${key}">${direcciones[key]}</option>`;
    }
}

/* ---------------- GET ---------------- */
async function obtenerDatos() {
    const res = await fetch(URL);
    const data = await res.json();
    renderTabla(data);
}

function renderTabla(data) {
    tabla.innerHTML = "";

    data.forEach(d => {
        tabla.innerHTML += `
        <tr>
            <td>${d.id}</td>
            <td>${d.deviceName}</td>
            <td>
                <span class="badge bg-info badge-direction">
                    ${d.direccionText}
                </span>
            </td>
            <td>${d.ipClient}</td>
            <td>${new Date(d.dateTime).toLocaleString()}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editar('${d.id}')">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="eliminar('${d.id}')">🗑️</button>
            </td>
        </tr>`;
    });
}

/* ---------------- CREATE / UPDATE ---------------- */
async function guardar() {

    const id = idInput.value;

    const payload = {
        deviceName: deviceInput.value,
        direccionCode: Number(direccionSelect.value),
        direccionText: direcciones[direccionSelect.value],
        ipClient: ipInput.value,
        dateTime: new Date().toISOString()
    };

    if (id) {
        await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } else {
        await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    }

    modal.hide();
    obtenerDatos();
}

/* ---------------- EDIT ---------------- */
async function editar(id) {
    const res = await fetch(`${URL}/${id}`);
    const d = await res.json();

    idInput.value = d.id;
    deviceInput.value = d.deviceName;
    direccionSelect.value = d.direccionCode;
    ipInput.value = d.ipClient;

    modal.show();
}

/* ---------------- DELETE ---------------- */
async function eliminar(id) {
    if (!confirm("¿Eliminar registro?")) return;

    await fetch(`${URL}/${id}`, {
        method: "DELETE"
    });

    obtenerDatos();
}

/* ---------------- EVENTOS ---------------- */
document.getElementById("btnNuevo").onclick = () => {
    form.reset();
    idInput.value = "";
    modal.show();
};

document.getElementById("btnGuardar").onclick = guardar;

/* ---------------- INIT ---------------- */
cargarSelect();
obtenerDatos();