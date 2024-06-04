const url = 'http://localhost:3000/api/rutinas/';

const listarRutinas = async () => {
    let ObjectId = document.getElementById('contenidoRutina'); // obj donde se mostrara la info
    let contenido = ''; // contiene las filas y celdas que se mostraran en el tbody

    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        
        // Verificar datos recibidos
        console.log('Datos recibidos:', data);
        
        // Aquí asumimos que data es un array de objetos de rutinas
        data.forEach(rutina => {
            // Verificar cada rutina
            console.log('Rutina:', rutina);
            
            // Asegurarse de que las propiedades existan
            if (rutina.NombreRutina && rutina.IdUsuario && rutina.EstadoRutina !== undefined) {
                contenido += `
                    <tr>
                        <td>${rutina.NombreRutina}</td>
                        <td>${rutina.IdUsuario}</td>
                        <td>${rutina.EstadoRutina}</td>
                        <td style="text-align: center;">
                            <div class="centered-container">
                                <i class="fa-regular fa-pen-to-square fa-xl me-2"
                                    onclick="window.location.href='/nueva-rutina?rutinaId=${rutina.IdRutina}'"></i>
                                <i class="fa-regular fa-eye fa-xl me-2"></i>
                            <div class="wrap-toggle" style="margin-top:10px;">
                                <input type="checkbox" id="toggle3" class="offscreen" />
                                    <label for="toggle3" class="switch"></label>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                console.error('Formato de datos incorrecto', rutina);
            }
        });

        ObjectId.innerHTML = contenido;

    } catch (error) {
        console.error('Error:', error);
    }
};

// Asegúrate de llamar a listarRutinas cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', listarRutinas);
