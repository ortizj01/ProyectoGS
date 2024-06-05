const url = 'http://localhost:8585/beneficiario'

const listarBeneficiarios = async() => {
    //Objeto del html donde se deslegará la información
    let objectId = document.getElementById('contenido') 
    let contenido = ''//Contiene filas y celdas que se desplegarán en el tbody

    //Fecth permite reaizar peticiones http a una url
    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then((res) => res.json())//Obtener respuesta de la petición
    .then(function(data){//Se manipulan los datos obtenidos de la url
        let listarBeneficiarios = data.msg //msg es el nombre de la lista retorna con json
        console.log(listarBeneficiarios)

        listarBeneficiarios.map(function (beneficiario) {
            //Configurar el objeto para enviarlo por url
            objetoBeneficiario = Object.keys(beneficiario).map(key => key + '=' + 
            encodeURIComponent(beneficiario[key])).join('&');
            console.log(beneficiario)
            contenido += `<tr>`+
            `<td>`+"001"+`</td>`+
            `<td>`+beneficiario.documentoBeneficiario+`</td>`+
            `<td>`+beneficiario.nombreBeneficiario+`</td>`+
            `<td>`+beneficiario.telefonoBeneficiario+`</td>`+
            `<td>`+beneficiario.correoBeneficiario+`</td>`+
            `<td>`+beneficiario.estadoBeneficiario+`</td>`+
            `<td  style="text-align: center;">
                                                    <div class="centered-container">
                                                    <i class="fa-regular fa-pen-to-square fa-xl me-2" onclick="abrirModalEditar('${objetoBeneficiario}')"></i>
                                                    <a href="detalleBeneficiario"><i class="fa-regular fa-eye fa-xl me-2"></i></a>
                                                        <i class="fa-solid fa-trash fa-xl me-2 trash-icon" onclick="abrirModalEliminar('${objetoBeneficiario}')"></i>
                                                        <div class="wrap-toggle" style="margin-top:10px;">
                                                            <input type="checkbox" id="toggle" class="offscreen" />
                                                            <label for="toggle" class="switch"></label>
                                                        </div>
                                                </td>`
            + `</tr>`
        })
        objectId.innerHTML = contenido
    })

    /*for(i = 1; i<10; i++){
        contenido = contenido + '<tr>'+
        '<td>nombre</td>'+
        '<td>rol</td>'+
        '<td>estado</td>'
    }
    */

}

const registrarBeneficiario= () => {
    const nombreBeneficiario = document.getElementById('nombreBeneficiario').value;
    const documentoBeneficiario = document.getElementById('documentoBeneficiario').value
    const correoBeneficiario = document.getElementById('correoBeneficiario').value
    const telefonoBeneficiario = document.getElementById('telefonoBeneficiario').value
    const direccionBeneficiario = document.getElementById('direccionBeneficiario').value
    const estadoBeneficiario = document.getElementById('estadoBeneficiario').value


    if(documentoBeneficiario.length == 0){
        document.getElementById('documentoBeneficiarioHelp').innerHTML = 'Dato requerido'
    } 
    else if(nombreBeneficiario.length == 0){
        document.getElementById('nombreBeneficiarioHelp').innerHTML = 'Dato requerido'

    }
    else if(correoBeneficiario.length == 0){
        document.getElementById('correoBeneficiarioHelp').innerHTML = 'Dato requerido'
    }
    else if(telefonoBeneficiario.length == 0){
        document.getElementById('telefonoBeneficiarioHelp').innerHTML = 'Dato requerido'
    }  
    else if(direccionBeneficiario.length == 0){
        document.getElementById('direccionBeneficiarioHelp').innerHTML = 'Dato requerido'
    }                                                                             
    else if(estadoBeneficiario == ""){
        document.getElementById('estadoBeneficiarioHelp').innerHTML = 'Dato requerido'
    }
    else{
        let beneficiario = {
            nombreBeneficiario: nombreBeneficiario,
            documentoBeneficiario: documentoBeneficiario,
            correoBeneficiario: correoBeneficiario,
            telefonoBeneficiario: telefonoBeneficiario,
            direccionBeneficiario: direccionBeneficiario,
            estadoBeneficiario: estadoBeneficiario
        }
        
        //Fecth permite reaizar peticiones http a una url
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(beneficiario),//Convertir el objeto a JSON
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then((res) => res.json())//Obtener respuesta de la petición
        .then(json => {
            // alert(json.msg) //Imprimir el mensaje de la transacción
            document.getElementById('nombreBeneficiario').value = ""
            document.getElementById('documentoBeneficiario').value = ""
            document.getElementById('correoBeneficiario').value = ""
            document.getElementById('telefonoBeneficiario').value = ""
            document.getElementById('direccionBeneficiario').value = ""
            document.getElementById('estadoBeneficiario').value = ""
        })
        }
}

const actualizarBeneficiario= () => {
    const nombreBeneficiario = document.getElementById('nombreBeneficiario').value;
    const documentoBeneficiario = document.getElementById('documentoBeneficiario').value
    const correoBeneficiario = document.getElementById('correoBeneficiario').value
    const telefonoBeneficiario = document.getElementById('telefonoBeneficiario').value
    const direccionBeneficiario = document.getElementById('direccionBeneficiario').value
    const estadoBeneficiario = document.getElementById('estadoBeneficiario').value

   
    if(documentoBeneficiario.length == 0){
        document.getElementById('documentoBeneficiarioHelp').innerHTML = 'Dato requerido'
    } 
    else if(nombreBeneficiario.length == 0){
        document.getElementById('nombreBeneficiarioHelp').innerHTML = 'Dato requerido'

    }
    else if(correoBeneficiario.length == 0){
        document.getElementById('correoBeneficiarioHelp').innerHTML = 'Dato requerido'
    }
    else if(telefonoBeneficiario.length == 0){
        document.getElementById('telefonoBeneficiarioHelp').innerHTML = 'Dato requerido'
    }  
    else if(direccionBeneficiario.length == 0){
        document.getElementById('direccionBeneficiarioHelp').innerHTML = 'Dato requerido'
    }                                                                             
    else if(estadoBeneficiario == ""){
        document.getElementById('estadoBeneficiarioHelp').innerHTML = 'Dato requerido'
    }
    else{
        let beneficiario = {
            nombreBeneficiario: nombreBeneficiario,
            documentoBeneficiario: documentoBeneficiario,
            correoBeneficiario: correoBeneficiario,
            telefonoBeneficiario: telefonoBeneficiario,
            direccionBeneficiario: direccionBeneficiario,
            estadoBeneficiario: estadoBeneficiario
        }
        
        //Fecth permite reaizar peticiones http a una url
        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(beneficiario),//Convertir el objeto a JSON
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then((res) => res.json())//Obtener respuesta de la petición
        .then(json => {
            // alert(json.msg) //Imprimir el mensaje de la transacción
            document.getElementById('nombreBeneficiario').value = ""
            document.getElementById('documentoBeneficiario').value = ""
            document.getElementById('correoBeneficiario').value = ""
            document.getElementById('telefonoBeneficiario').value = ""
            document.getElementById('direccionBeneficiario').value = ""
            document.getElementById('estadoBeneficiario').value = ""
        })
        }
}

const EliminarBeneficiario = () => {
    const documentoBeneficiario = document.getElementById('documentoBeneficiarioEliminar').value;

        let beneficiario = {
            documentoBeneficiario: documentoBeneficiario
        };

        // Fetch permite realizar peticiones HTTP a una URL
        fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            body: JSON.stringify(beneficiario), // Enviar el objeto en el cuerpo de la solicitud
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        .then((res) => res.json()) // Obtener respuesta de la petición
        .then(json => {
            // alert(json.msg); // Imprimir el mensaje de la transacción
            
        })
        .catch(error => {
            console.error('Error al eliminar beneficiario:', error);
        });
    }

    // Función para parsear la información del beneficiario
const parseBeneficiarioInfo = (objetoBeneficiario) => {
    const beneficiario = {};
    const params = new URLSearchParams(objetoBeneficiario);

    params.forEach((value, key) => {
        beneficiario[key] = value;
    });

    return beneficiario;
};


const abrirModalEditar = (objetoBeneficiario) => {
    // Parsea la información del beneficiario de la URL
    const beneficiario = parseBeneficiarioInfo(objetoBeneficiario);

    // Llena los campos del formulario con la información del beneficiario
    document.getElementById('documentoBeneficiario').value = beneficiario.documentoBeneficiario;
    document.getElementById('nombreBeneficiario').value = beneficiario.nombreBeneficiario;
    document.getElementById('correoBeneficiario').value = beneficiario.correoBeneficiario;
    document.getElementById('telefonoBeneficiario').value = beneficiario.telefonoBeneficiario;
    document.getElementById('direccionBeneficiario').value = beneficiario.direccionBeneficiario;
    document.getElementById('estadoBeneficiario').value = beneficiario.estadoBeneficiario;

    validarCamposModal();

     // Abre el modal
     $('#editarBeneficiarioModal').modal('show');
    
};

const abrirModalEliminar = (objetoBeneficiario) => {
    // Parsea la información del beneficiario de la URL
    const beneficiario = parseBeneficiarioInfo(objetoBeneficiario);

    // Abre el modal
    $('#eliminarBeneficiarioModal').modal('show');

    // Llena los campos del formulario con la información del beneficiario

    document.getElementById('documentoBeneficiarioEliminar').value = beneficiario.documentoBeneficiario;
    document.getElementById('nombreBeneficiarioEliminar').value = beneficiario.nombreBeneficiario;
    document.getElementById('correoBeneficiarioEliminar').value = beneficiario.correoBeneficiario;
    document.getElementById('telefonoBeneficiarioEliminar').value = beneficiario.telefonoBeneficiario;
    document.getElementById('direccionBeneficiarioEliminar').value = beneficiario.direccionBeneficiario;
    document.getElementById('estadoBeneficiarioEliminar').value = beneficiario.estadoBeneficiario;

     
};


if(document.querySelector('#btnRegistrar')){ //Si objeto exitste
document.querySelector('#btnRegistrar')
.addEventListener('click', registrarBeneficiario)
}

if(document.querySelector('#btnActualizar')){//Si objeto existe
document.querySelector('#btnActualizar')
.addEventListener('click', actualizarBeneficiario)
}

if(document.querySelector('#btnEliminar')){//Si objeto existe
    document.querySelector('#btnEliminar')
    .addEventListener('click', EliminarBeneficiario)
    }