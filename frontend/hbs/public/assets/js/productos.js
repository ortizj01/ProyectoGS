const formularioproductos = document.getElementById('formularioProductos');
const inputs = document.querySelectorAll('#formularioProductos input');


const expresiones = {
	Nombreproducto: /^[^0-9][a-zA-Z0-9]*$/, 
    Precioproducto: /^(?:\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)$/,
    Productosingresar: /^[0-9]+$/,
	Ivaproducto:  /^([1-9]|[1-9][0-9]|100)%?$/
}

const campos={
    Nombreproducto:false,
    Precioproducto:false,
    Productosingresar:false,
    Ivaproducto:false
}


const validarformularioProductos = (e)=> {
    switch(e.target.name){
        case "Nombreproducto":
            validarcampo(expresiones.Nombreproducto, e.target,"Nombreproducto");
            break
    }
    switch(e.target.name){
        case "Precioproducto":
            validarcampo(expresiones.Precioproducto, e.target,"Precioproducto");
            break
    }
    switch(e.target.name){
        case "Productosingresar":
            validarcampo(expresiones.Productosingresar, e.target,"Productosingresar");
            break
    }
    switch(e.target.name){
        case "Ivaproducto":
            validarcampo(expresiones.Ivaproducto, e.target,"Ivaproducto");
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
    input.addEventListener('keyup',validarformularioProductos);
    input.addEventListener('blur',validarformularioProductos);
    });

formularioproductos.addEventListener('submit',(e) => {
    e.preventDefault();
    if(campos.Nombreproducto && campos.Precioproducto && campos.Productosingresar && campos.Ivaproducto){
        formularioproductos.reset()
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