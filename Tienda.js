const btnCart = document.querySelector('.container-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const cartProductsContainer = document.querySelector('.cart-products-list'); // Necesitaremos crear este contenedor

// Evento para mostrar/ocultar el carrito al hacer clic en el icono
btnCart.addEventListener('click', (e) => {
    e.stopPropagation();
    containerCartProducts.classList.toggle('hidden-cart');
});

// Cerrar carrito al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (!containerCartProducts.contains(e.target) && !btnCart.contains(e.target)) {
        containerCartProducts.classList.add('hidden-cart');
    }
});

// Seleccionar todos los elementos relacionados con los productos
const productsList = document.querySelector('.container-items');
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');

let allProducts = [];
let total = 0;
let count = 0;

productsList.addEventListener('click', e => {
    let productElement = null;
    
    // Verificar si el clic fue en un botón o dentro de info-product
    if (e.target.tagName === 'BUTTON') {
        productElement = e.target.closest('.info-product');
    } else if (e.target.classList.contains('info-product')) {
        productElement = e.target;
    }
    
    if (productElement) {
        const titleElement = productElement.querySelector('h2');
        const priceElement = productElement.querySelector('.price');
        
        if (titleElement && priceElement) {
            const infoProduct = {
                quantity: 1,
                title: titleElement.textContent,
                price: parseFloat(priceElement.textContent.replace('Q', '').trim()),
            };
            
            const exists = allProducts.some(p => p.title === infoProduct.title);
            
            if (exists) {
                allProducts = allProducts.map(p =>
                    p.title === infoProduct.title ? { ...p, quantity: p.quantity + 1 } : p
                );
            } else {
                allProducts.push(infoProduct);
            }
            
            showHTML();
        }
    }
});

// Función para eliminar productos del carrito (mejorada)
const removeProduct = (title) => {
    allProducts = allProducts.filter(p => p.title !== title);
    showHTML();
};

// Función para mostrar / actualizar el HTML del carrito
const showHTML = () => {
    // Crear o obtener el contenedor de productos del carrito
    let cartProductsContainer = document.querySelector('.cart-products-container');
    
    if (!cartProductsContainer) {
        // Si no existe, creamos la estructura del carrito
        cartProductsContainer = document.createElement('div');
        cartProductsContainer.classList.add('cart-products-container');
        
        // Limpiar el contenedor principal y agregar la nueva estructura
        containerCartProducts.innerHTML = '';
        containerCartProducts.appendChild(cartProductsContainer);
        
        // Agregar el footer del total
        const cartTotal = document.createElement('div');
        cartTotal.classList.add('cart-total');
        cartTotal.innerHTML = `
            <h3>Total:</h3>
            <span class="total-pagar">Q0.00</span>
        `;
        containerCartProducts.appendChild(cartTotal);
        
        // Actualizar referencia al total
        const newTotalSpan = containerCartProducts.querySelector('.total-pagar');
        if (newTotalSpan) {
            valorTotal.textContent = newTotalSpan.textContent;
        }
    }
    
    cartProductsContainer = document.querySelector('.cart-products-container');
    cartProductsContainer.innerHTML = '';
    total = 0;
    count = 0;
    
    // Si no hay productos
    if (allProducts.length === 0) {
        cartProductsContainer.innerHTML = `
            <div class="cart-empty" style="color: #000; padding: 20px; text-align: center;">
                El carrito está vacío
            </div>
        `;
        valorTotal.textContent = 'Q0.00';
        countProducts.textContent = '0';
        return;
    }
    
    // Mostrar cada producto
    allProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('cart-product');
        
        productDiv.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">Q${(product.price * product.quantity).toFixed(2)}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
                data-title="${product.title}">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        `;
        
        // Agregar evento de eliminación directamente al SVG
        const closeIcon = productDiv.querySelector('.icon-close');
        closeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const title = closeIcon.getAttribute('data-title');
            removeProduct(title);
            // El carrito PERMANECE ABIERTO - no se cierra
        });
        
        cartProductsContainer.appendChild(productDiv);
        
        total += product.quantity * product.price;
        count += product.quantity;
    });
    
    // Actualizar el total en el footer
    const totalSpan = containerCartProducts.querySelector('.total-pagar');
    if (totalSpan) {
        totalSpan.textContent = `Q${total.toFixed(2)}`;
        valorTotal.textContent = `Q${total.toFixed(2)}`;
    }
    
    countProducts.textContent = count;
};

// También actualizar el evento de eliminación por delegación (fallback)
containerCartProducts.addEventListener('click', (e) => {
    const closeIcon = e.target.closest('.icon-close');
    if (closeIcon) {
        e.stopPropagation();
        const title = closeIcon.getAttribute('data-title');
        if (title) {
            removeProduct(title);
        }
    }
});