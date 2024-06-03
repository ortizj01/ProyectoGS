const url = 'http://localhost:3000/api/categorias'
//const url = 'http://localhost:8081/proveedor'




const editarCategoria = async (id) => {
    const NombreCategoriaProductos = document.getElementById('categoria').value;
    const EstadoCategoriaProductos = document.getElementById('Estado').value;

    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PATCH', // Cambiado a 'PATCH' para cumplir con el método de la API
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                NombreCategoriaProductos,
                EstadoCategoriaProductos,
            })
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        console.log('Categoria editada:', data);
        alert('Categoria editado con éxito');
        listarCategoria();
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al editar el Categoria');
    }
};


const agregarCategoria = async () => {
    const NombreCategoriaProductos=document.getElementById('NombreCategoriaProductos').value;
    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                NombreCategoriaProductos,
                EstadoCategoriaProductos:1,
            })
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        console.log('categoria agregado:', data);
        alert('categoria agregado con éxito');
        listarCategoria();
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al agregar la categoria');
    }
};


const listarCategoria = async () => {
    let ObjectId = document.getElementById('contenidoCategoria'); // obj donde se mostrara la info
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
        data.forEach(categoria => {
            // Verificar cada rutina
            console.log('categoria:', categoria);
            
            // Asegurarse de que las propiedades existan
            if (categoria.NombreCategoriaProductos && categoria.EstadoCategoriaProductos !== undefined) {
                contenido += `
                    <tr>
                        <td>${categoria.NombreCategoriaProductos}</td>
                        <td>${categoria.EstadoCategoriaProductos}</td>
                        <td style="text-align: center;">
                            <div class="centered-container">
                                <i class="fa-regular fa-pen-to-square fa-xl me-2"
                                data-bs-toggle="modal" data-bs-target="#exampleModal1" data-bs-whatever="@mdo" onclick="precargarDatosCategoriaEnFormulario(${categoria.IdCategoriaProductos})"></i>
                        </td>
                    </tr>
                `;
            } else {
                console.error('Formato de datos incorrecto', categoria);
            }
        });

        ObjectId.innerHTML = contenido;

    } catch (error) {
        console.error('Error:', error);
    }
};

const precargarDatosCategoriaEnFormulario = async (Id) => {
    try {
        const response = await fetch(`${url}/${Id}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }


        const categoria = await response.json();

        // Precargar los datos del proveedor en el formulario
        document.getElementById('categoria').value = categoria.NombreCategoriaProductos;
        document.getElementById('Estado').value = categoria.EstadoCategoriaProductos;
        document.getElementById('id').value = categoria.IdCategoriaProductos;


    } catch (error) {
        console.error('Error:', error);
    }
};





