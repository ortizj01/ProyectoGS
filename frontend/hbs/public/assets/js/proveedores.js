const formularioproveedores = document.getElementById('formularioProveedores');
const inputs = document.querySelectorAll('#formularioProveedores input');


const expresiones = {
	Nombreproveedor: /^[a-zA-Z]+$/, 
    Contactoproveedor: /^(?:\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)$/,
    Telefono: /^[0-9]+$/,
	Direccion:  /^([1-9]|[1-9][0-9]|100)%?$/,
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