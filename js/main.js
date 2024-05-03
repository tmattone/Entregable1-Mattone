document.addEventListener('DOMContentLoaded', function() {
  mostrarProductos();
});

function mostrarProductos() {
  fetch('js/productos.json') // Corregido para usar la ruta relativa adecuada
    .then(response => response.json())
    .then(productos => {
      const productosDiv = document.getElementById('productos');
      productosDiv.innerHTML = ''; // Limpiar el contenido anterior
      productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.innerHTML = `
          <p>${producto.nombre} - $${producto.precio}</p>
          <img src="${producto.img}" alt="Imagen Producto ${producto.id}" class="producto-img">
          <button class="btn btn-primary add-to-cart-btn" data-id="${producto.id}">Agregar al carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
      });

      // Agregar listener de evento clic a cada botón de agregar al carrito
      const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
      addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const productId = parseInt(btn.getAttribute('data-id'));
          agregarAlCarrito(productId);
        });
      });
      
      // Estilos para las imágenes de los productos
      const imagenes = document.querySelectorAll('.producto-img');
      imagenes.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
      });
    })
    .catch(error => {
      console.error('Error al cargar los productos:', error);
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
    // Mostrar alerta con SweetAlert
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
      title: "Producto Agregado"
    });
  } else {
    alert("Producto no encontrado.");
  }
}

function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter(item => item.id !== idProducto);
  mostrarCarrito();
  guardarCarrito();
}
