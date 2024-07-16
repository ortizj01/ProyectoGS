const formularioServicio = document.getElementById('FormularioServicios');
const inputsServicio = document.querySelectorAll('#FormularioServicios input');

const expresionesServicio = {
    NombreServicio: /^[a-zA-Z0-9À-ÿ\s.,-]+$/,
    Instructor: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
    Frecuencia: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
    Cantidad: /^[0-9]+$/,
    FechaInicio: /^\d{2}\/\d{2}\/\d{4}$/,
    CostoTotal: /^\d+(\.\d{1,2})?$/,
    FechaFin: /^\d{2}\/\d{2}\/\d{4}$/,
    CostoVenta: /^\d+(\.\d{1,2})?$/
};

const camposServicio = {
    NombreServicio: false,
    Instructor: false,
    Frecuencia: false,
    Cantidad: false,
    FechaInicio: false,
    CostoTotal: false,
    FechaFin: false,
    CostoVenta: false
};

const validarformularioServicio = (e) => {
    switch (e.target.name) {
        case "NombreServicio":
            validarCampo(expresionesServicio.NombreServicio, e.target, 'NombreServicio');
            break;
        case "Instructor":
            validarCampo(expresionesServicio.Instructor, e.target, 'Instructor');
            break;
        case "Frecuencia":
            validarCampo(expresionesServicio.Frecuencia, document.getElementById('SelectorFrecuencia'), 'Frecuencia');
            break;
        case "Cantidad":
            validarCampo(expresionesServicio.Cantidad, e.target, 'Cantidad');
            break;
       
        case "CostoVenta":
            validarCampo(expresionesServicio.CostoVenta, e.target, 'CostoVenta');
            break;
        
        case "CostoTotal":
            validarCampo(expresionesServicio.CostoTotal, e.target, 'CostoTotal');
            break;
    }
};

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
        camposServicio[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
        camposServicio[campo] = false;
    }
};

inputsServicio.forEach((input) => {
    input.addEventListener('keyup', validarformularioServicio);
    input.addEventListener('blur', validarformularioServicio);
});

formularioServicio.addEventListener('submit', (e) => {
    e.preventDefault();

    if (camposServicio.NombreServicio && camposServicio.Instructor && camposServicio.Cantidad && camposServicio.CostoTotal && camposServicio.CostoVenta) {
        formularioServicio.reset();
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "Guardado correctamente"
        });
        document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formulario__grupo-correcto');
        });

        // Redirección a serviciosAdmin después de 3 segundos (3000 milisegundos)
        setTimeout(() => {
            window.location.href = 'serviciosAdmin'; // Ajusta el nombre de la página si es necesario
        }, 2000);
    } else {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "error",
            title: "Ingrese los datos correctamente"
        });
    }
});
