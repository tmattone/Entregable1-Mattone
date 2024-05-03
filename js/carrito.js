document.addEventListener('DOMContentLoaded', function() {
  mostrarProductos();
  cargarCarrito(); // Cargar el carrito desde el localStorage
  document.getElementById('cart-btn')?.addEventListener('click', toggleCart); // Toggle cart dropdown
});

function mostrarProductos() {
  fetch('js/productos.json') // Corregido para usar la ruta relativa adecuada
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al cargar los productos');
          }
          return response.json();
      })
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
          console.error('Error al cargar los productos:', error.message);
          // Mostrar mensaje de error al usuario
          const productosDiv = document.getElementById('productos');
          productosDiv.innerHTML = '<p>Error al cargar los productos. Por favor, inténtelo de nuevo más tarde.</p>';
      });
}

function agregarAlCarrito(idProducto) {
  fetch('js/productos.json') // Corregido para usar la ruta relativa adecuada
      .then(response => response.json())
      .then(productos => {
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
      })
      .catch(error => {
          console.error('Error al agregar producto al carrito:', error);
          // Mostrar mensaje de error al usuario
          alert("Error al agregar producto al carrito. Por favor, inténtelo de nuevo más tarde.");
      });
}


function mostrarCarrito() {
  const carritoDiv = document.getElementById('cart-items');
  carritoDiv.innerHTML = ''; // Limpiar el contenido anterior del carrito
  let totalCompra = 0; // Variable para almacenar el total de la compra
  
  carrito.forEach(item => {
      if (item.cantidad > 0) { // Verificar si la cantidad es mayor que 0
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('cart-item', 'row', 'align-items-center', 'mb-3');
          itemDiv.innerHTML = `
              <div class="col">${item.nombre} - $${item.precio}</div>
              <div class="col-auto">
                  <button class="btn btn-outline-primary btn-sm mr-2" onclick="agregarCantidad(${item.id})">+</button>
                  <span>${item.cantidad}</span>
                  <button class="btn btn-outline-danger btn-sm ml-2" onclick="disminuirCantidad(${item.id})">-</button>
              </div>
          `;
          carritoDiv.appendChild(itemDiv);
          
          // Calcular el costo total de cada producto y sumarlo al total de la compra
          totalCompra += item.precio * item.cantidad;
      }
  });

  // Mostrar el costo total de la compra más abajo del carrito
  const totalCompraDiv = document.createElement('div');
  totalCompraDiv.classList.add('total-compra', 'mt-3', 'text-right');
  totalCompraDiv.innerHTML = `<strong>Total:</strong> $${totalCompra.toFixed(2)}`;
  carritoDiv.appendChild(totalCompraDiv);

  const finalizarCompraBtn = document.getElementById('finalizar-compra-btn');
  if (!finalizarCompraBtn && carrito.length > 0) {
      const finalizarCompraBtn = document.createElement('button');
      finalizarCompraBtn.id = 'finalizar-compra-btn';
      finalizarCompraBtn.classList.add('btn', 'btn-primary', 'mt-3', 'mx-auto', 'mr-3');
      finalizarCompraBtn.textContent = 'Finalizar Compra';
      finalizarCompraBtn.addEventListener('click', finalizarCompra);
      carritoDiv.appendChild(finalizarCompraBtn);
  }

  // Botón para borrar todos los productos del carrito (si hay al menos 1 producto)
  if (carrito.length > 0) {
    const borrarTodoBtn = document.createElement('button');
    borrarTodoBtn.classList.add('btn', 'btn-danger', 'mt-3');
    borrarTodoBtn.textContent = 'Borrar Todos';
    borrarTodoBtn.style.marginRight = '10px'; // Separación del botón "Finalizar Compra"
    borrarTodoBtn.addEventListener('click', borrarTodosLosProductos);
    carritoDiv.appendChild(borrarTodoBtn);
  }
}

function borrarTodosLosProductos() {
  carrito = []; // Vaciar el array del carrito
  mostrarCarrito(); // Mostrar el carrito actualizado
  guardarCarrito(); // Guardar el carrito vacío en el localStorage
}

function agregarCantidad(idProducto) {
  const productoEnCarrito = carrito.find(item => item.id === idProducto);
  if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
      mostrarCarrito();
      guardarCarrito();
  }
}

function disminuirCantidad(idProducto) {
  const productoEnCarrito = carrito.find(item => item.id === idProducto);
  if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
      productoEnCarrito.cantidad--;
      mostrarCarrito();
      guardarCarrito();
  } else if (productoEnCarrito && productoEnCarrito.cantidad === 1) { // Si la cantidad es 1, eliminamos el producto
      eliminarDelCarrito(idProducto);
  }
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

function toggleCart() {
  const cartDropdown = document.getElementById('cart-dropdown');
  if (cartDropdown.style.display === 'none') {
      cartDropdown.style.display = 'block';
  } else {
      cartDropdown.style.display = 'none';
  }
}
  
  function finalizarCompra() {
    // Mostrar un modal de SweetAlert para ingresar los datos del comprador
    Swal.fire({
      title: 'Ingrese sus datos',
      html:
        '<input id="nombre" class="swal2-input" placeholder="Nombre">' +
        '<input id="email" class="swal2-input" placeholder="Email">' +
        '<input id="documento" class="swal2-input" placeholder="Documento de identidad">',
      focusConfirm: false,
      preConfirm: () => {
        return {
          nombre: document.getElementById('nombre').value,
          email: document.getElementById('email').value,
          documento: document.getElementById('documento').value
        }
      }
    }).then((result) => {
      // Una vez que se ingresan los datos, mostrar los detalles del comprador
      const comprador = result.value;
      if (comprador) {
        let detallesCompra = `Nombre: ${comprador.nombre}<br>
        Email: ${comprador.email}<br>
        Documento: ${comprador.documento}<br>
        <br>Productos Comprados:<br>`;
        carrito.forEach(item => {
          detallesCompra += `${item.nombre} - $${item.precio} - Cantidad: ${item.cantidad}<br>`;
        });
        const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        detallesCompra += `<br>Total a pagar: $${total.toFixed(2)}`;
  
        // Mostrar los detalles de la compra
        Swal.fire({
          title: 'Compra Finalizada',
          html: detallesCompra,
          icon: 'success',
          confirmButtonText: 'Gracias por su compra'
        });
  
        // Limpiar el carrito después de finalizar la compra
        carrito = [];
        mostrarCarrito();
        guardarCarrito();
      }
    });
  }