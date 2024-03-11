const productos = [
    { id: 1, nombre: "Remera", precio: 20000 },
    { id: 2, nombre: "Pantalón", precio: 30000 },
    { id: 3, nombre: "Zapatillas", precio: 50000 }
  ];

  // En esta funcion mostramos los productos a traves de un Prompt
  function mostrarProductos     () {
    let mensaje = "Lista de productos \n";
    for (let i = 0; i < productos.length; i++) {
      mensaje += `${productos[i].id} -${productos[i].nombre} - $${productos[i].precio}\n`;
    }
    alert(mensaje);
}

//En esta linea de codigo vamos a seleccionar y pagar los productos 
function seleccionarYPagarProductos(){
    let total = 0;
    let seguirComprando = true;

     while(seguirComprando){
        mostrarProductos();
            const seleccion = prompt("Seleccione el producto que quiere comprar : \n");
            if(seleccion == null){
                seguirComprando = false;
            }else{
                const seleccionSinEspacios = seleccion.replace(/\s/g,'');
                for(const producto of productos){
                    if(seleccionSinEspacios.includes(producto.nombre)){
                        total += producto.precio;
                    }
                }
                seguirComprando = confirm("El total a pagar es : \n" + total + "¿Desea seguir comprando?");
            }
        }
        if(total >= 0){
            alert("¡Gracias por su compra! Total pagado : \n" + total);
        }else{
            alert("¡Gracias por visitarnos!")
        }
    }

  seleccionarYPagarProductos();  

