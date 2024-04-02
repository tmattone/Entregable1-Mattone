document.addEventListener('DOMContentLoaded', function() {
    mostrarProductos(); // Mostrar productos al cargar la página
    cargarCarrito(); // Cargar el carrito desde el localStorage
  });
  
  const productos = [
    { id: 1, nombre: "Remera", precio: 20000 },
    { id: 2, nombre: "Pantalón", precio: 30000 },
    { id: 3, nombre: "Zapatillas", precio: 50000 }
  ];
  
  let carrito = [];
  
  function mostrarProductos() {
    const productosDiv = document.getElementById('productos');
    productosDiv.innerHTML = ''; // Limpiar el contenido anterior
    productos.forEach(producto => {
      const productoDiv = document.createElement('div');
      productoDiv.innerHTML = `
        <p>${producto.nombre} - $${producto.precio}</p>
        <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
      `;
      productosDiv.appendChild(productoDiv);
    });
  }
  
  function agregarAlCarrito(idProducto) {
    const productoSeleccionado = productos.find(producto => producto.id === idProducto);
    if (productoSeleccionado) {
      const productoEnCarrito = carrito.find(item => item.id === idProducto);
      if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
      } else {
        carrito.push({ ...productoSeleccionado, cantidad: 1 });
      }
      mostrarCarrito();
      guardarCarrito(); // Guardar el carrito en el localStorage
      alert(`Producto agregado al carrito: ${productoSeleccionado.nombre}`);
    } else {
      alert("Producto no encontrado.");
    }
  }
  
  function mostrarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = ''; // Limpiar el contenido anterior
    carrito.forEach(item => {
      const productoDiv = document.createElement('div');
      productoDiv.innerHTML = `<p>${item.nombre} - $${item.precio} x ${item.cantidad}</p>`;
      carritoDiv.appendChild(productoDiv);
    });
  }
  
  function calcularTotal() {
    let total = 0;
    carrito.forEach(item => {
      total += item.precio * item.cantidad;
    });
    alert(`Total a pagar: $${total}`);
  }
  
  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
  
  function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      mostrarCarrito();
    }
  }