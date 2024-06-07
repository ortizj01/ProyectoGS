const url = 'http://localhost:3000/api/proveedores'
//const url = 'http://localhost:8081/proveedor'

const listarProveedores = async () => {
    let ObjectId = document.getElementById('contenidoProveedores'); // obj donde se mostrara la info
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
        data.forEach(proveedor => {

            console.log('proveedor:', proveedor);
            
            // Asegurarse de que las propiedades existan
            if (proveedor.NombreProveedor && proveedor.NombreContactoProveedor && proveedor.Telefono && proveedor.Direccion && proveedor.Direccion && proveedor.NIT && proveedor.EstadoProveedores !== undefined) {
                contenido += `
                    <tr>
                        <td>${proveedor.NombreProveedor}</td>
                        <td>${proveedor.NombreContactoProveedor}</td>
                        <td>${proveedor.Telefono}</td>
                        <td>${proveedor.Direccion}</td>
                        <td>${proveedor.NIT}</td>
                        <td>${proveedor.EstadoProveedores}</td>
                        <td style="text-align: center;">
                            <div class="centered-container">
                            <a href="../ProveedoresEditar?id=${proveedor.IdProveedores}">
                                <i class="fa-regular fa-pen-to-square fa-xl me-2"></i>
                            </a>
                        </td>
                    </tr>
                `;
            } else {
                console.error('Formato de datos incorrecto', proveedor);
            }
        });

        ObjectId.innerHTML = contenido;
        $('#dataTable').DataTable();

    } catch (error) {
        console.error('Error:', error);
    }
};

const precargarDatosProveedorEnFormulario = async () => {

    
    // Buscar el parámetro 'id' en la URL
    var urlParams = new URLSearchParams(window.location.search);
    var proveedorId = urlParams.get('id');
    console.log(proveedorId);
    try {
        const response = await fetch(`${url}/${proveedorId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }


        const proveedor = await response.json();

        // Precargar los datos del proveedor en el formulario
        document.getElementById('Nombreedit').value = proveedor.NombreProveedor;
        document.getElementById('Contactoedit').value = proveedor.NombreContactoProveedor;
        document.getElementById('Telefonoedit').value = proveedor.Telefono;
        document.getElementById('Direccionedit').value = proveedor.Direccion;
        document.getElementById('NITedit').value = proveedor.NIT;
        document.getElementById('Estadoedit').value = proveedor.EstadoProveedores;

    } catch (error) {
        console.error('Error:', error);
    }
};


const editarProveedor = async () => {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    const NombreProveedor = document.getElementById('Nombreedit').value;
    const NombreContactoProveedor = document.getElementById('Contactoedit').value;
    const Telefono = document.getElementById('Telefonoedit').value;
    const Direccion = document.getElementById('Direccionedit').value;
    const NIT = document.getElementById('NITedit').value;
    const EstadoProveedores = document.getElementById('Estadoedit').value;
    console.log(EstadoProveedores)
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PATCH', // Cambiado a 'PATCH' para cumplir con el método de la API
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                NombreProveedor,
                NombreContactoProveedor,
                Telefono,
                Direccion,
                NIT,
                EstadoProveedores,
            })
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Proveedor editado con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirigir a otra vista, por ejemplo, la lista de proveedores
                window.location.href = '../proveedores'; // Reemplaza esta URL con la ruta real
            }
        });
        // Aquí puedes llamar a listarProveedores() para actualizar la lista de proveedores
        listarProveedores();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al editar el proveedor',
            confirmButtonText: 'Aceptar'
        });
    }
};



const agregarProveedor = async () => {

    const NombreProveedor = document.getElementById('Nombreproveedor').value;
    const NombreContactoProveedor = document.getElementById('Contactoproveedor').value;
    const Telefono = document.getElementById('Telefono').value;
    const Direccion = document.getElementById('Direccion').value;
    const NIT = document.getElementById('Nit').value;


    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                NombreProveedor,
                NombreContactoProveedor,
                Telefono,
                Direccion,
                NIT,
                EstadoProveedores:1
            })
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Proveedor agregado con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirigir a otra vista, por ejemplo, la lista de proveedores
                window.location.href = '../proveedores'; // Reemplaza esta URL con la ruta real
            }
        });
        // Aquí puedes llamar a listarProveedores() para actualizar la lista de proveedores
        listarProveedores();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al agregar el proveedor',
            confirmButtonText: 'Aceptar'
        });
    }
};



// Asegúrate de llamar a listarProveedores cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', listarProveedores);


const formularioproveedores = document.getElementById('formularioProveedores');
const inputs = document.querySelectorAll('#formularioProveedores input');


const expresiones = {
	Nombreproveedor: /^[a-zA-Z\s]+$/, 
    Contactoproveedor: /^[a-zA-Z\s]+$/,
    Telefono: /^[0-9]+$/,
	Direccion:  /^[a-zA-Z0-9\s,.\-#]+$/,
    Nit:/^[0-9]+$/
}

const campos={
    Nombreproveedor:false,
    Contactoproveedor:false,
    Telefono:false,
    Direccion:false,
    Nit:false
}


const validarformularioproveedor = (e)=> {
    switch(e.target.name){
        case "Nombreproveedor":
            validarcampo(expresiones.Nombreproveedor, e.target,"Nombreproveedor");
            break
    }
    switch(e.target.name){
        case "Contactoproveedor":
            validarcampo(expresiones.Contactoproveedor, e.target,"Contactoproveedor");
            break
    }
    switch(e.target.name){
        case "Telefono":
            validarcampo(expresiones.Telefono, e.target,"Telefono");
            break
    }
    switch(e.target.name){
        case "Direccion":
            validarcampo(expresiones.Direccion, e.target,"Direccion");
            break
    }
    switch(e.target.name){
        case "Nit":
            validarcampo(expresiones.Nit, e.target,"Nit");
            break
    }


}


const validarcampo = (expresion,input,campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-incorrecto");
        document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-correcto");
        document.querySelector(`#grupo__${campo} i`).classList.add("fa-check-circle");
        document.querySelector(`#grupo__${campo} i`).classList.remove("fa-times-circle");
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove("formulario__input-error-activo");
        campos[campo]=true;
    }else {
        document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-incorrecto");
        document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-correcto");
        document.querySelector(`#grupo__${campo} i`).classList.add("fa-times-circle");
        document.querySelector(`#grupo__${campo} i`).classList.remove("fa-check-circle");
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add("formulario__input-error-activo");
        campos[campo]=false;
    }


}

inputs.forEach((input)=>{
    input.addEventListener('keyup',validarformularioproveedor);
    input.addEventListener('blur',validarformularioproveedor);
    });

formularioproveedores.addEventListener('submit',(e) => {
    e.preventDefault();
    if(campos.Nombreproveedor && campos.Contactoproveedor && campos.Telefono && campos.Direccion && campos.Nit){
        formularioproveedores.reset()
        alert("good")
        document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
        setTimeout(() => {
            document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
        }, 3000);
        document.querySelectorAll('.formulario__grupo-correcto').forEach((icono)=>{
            icono.classList.remove('formulario__grupo-correcto')
        });
    } else {
        alert("malo")
        document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo')
        setTimeout(() => {
            document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
        }, 3000);

    }
});