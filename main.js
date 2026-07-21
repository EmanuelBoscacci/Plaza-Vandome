document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. CONTROL DE NAVBAR & MENÚ MÓVIL
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Desenfoque al hacer scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle Menú Móvil
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }


  // ==========================================================================
  // 2. SHOWROOM INTERACTIVO (CUSTOMIZADOR AVANZADO BESPOKE & VISTA 3D)
  // ==========================================================================
  const metalButtons = document.querySelectorAll('.btn-metal');
  const caratButtons = document.querySelectorAll('.carat-selector .btn-custom-option');
  const cutButtons = document.querySelectorAll('.cut-selector .btn-custom-option');
  const ringSizeSelect = document.getElementById('ring-size');
  const ringEngravingInput = document.getElementById('ring-engraving');

  const showroomImg = document.getElementById('showroom-image');
  const showroomViewer = document.getElementById('showroom-3d-viewer');
  const selectedMetalName = document.getElementById('selected-metal-name');
  const selectedCaratsLabel = document.getElementById('selected-carats-label');
  const selectedCutLabel = document.getElementById('selected-cut-label');
  const productPrice = document.getElementById('product-price');
  const showroomWaBtn = document.getElementById('btn-showroom-wa');
  const showroomCtaBtn = document.getElementById('btn-showroom-cta');

  const btnViewPhoto = document.getElementById('btn-view-photo');
  const btnView3d = document.getElementById('btn-view-3d');
  const demoModelContainer = document.getElementById('demo-model-container');
  const btnToggleDemoGlb = document.getElementById('btn-toggle-demo-glb');

  // Estados de Personalización
  let activeMetalKey = 'yellow';
  let activeCarats = '2.0';
  let activeCut = 'Brillante';
  let activeRingSize = '14';
  let activeEngraving = '';
  let isDemo3DModelActive = false;

  const METALS_CONFIG = {
    yellow: { name: "Oro Amarillo de 18K", surcharge: 0, img: "assets/variant_yellow_gold.jpg", glb: "assets/ring_yellow.glb" },
    white: { name: "Oro Blanco de 18K", surcharge: 250, img: "assets/variant_white_gold.jpg", glb: "assets/ring_white.glb" },
    rose: { name: "Oro Rosa de 18K", surcharge: 100, img: "assets/variant_rose_gold.jpg", glb: "assets/ring_rose.glb" }
  };

  const CARAT_PRICES = {
    '1.0': 4500,
    '1.5': 6500,
    '2.0': 8500,
    '2.5': 11000
  };

  // Función Principal de Actualización del Customizador
  function updateBespokeShowroom() {
    const metalData = METALS_CONFIG[activeMetalKey];
    const baseCaratPrice = CARAT_PRICES[activeCarats];
    const totalCalc = baseCaratPrice + metalData.surcharge;

    // Formatear precio
    const formattedPrice = `U$D ${totalCalc.toLocaleString('en-US')}`;

    // Actualizar elementos visuales
    if (productPrice) productPrice.textContent = formattedPrice;
    if (selectedMetalName) selectedMetalName.textContent = metalData.name;
    if (selectedCaratsLabel) selectedCaratsLabel.textContent = `${activeCarats} ct`;
    if (selectedCutLabel) selectedCutLabel.textContent = activeCut;

    // Generar texto para WhatsApp
    const waText = `Hola Plaza Vendôme, deseo consultar por el Anillo Eternity Solitaire personalizado:\n- Metal: ${metalData.name}\n- Diamante: ${activeCarats} ct\n- Corte: ${activeCut}\n- Talla: ${activeRingSize}\n- Grabado: ${activeEngraving ? `"${activeEngraving}"` : 'Ninguno'}\nPrecio estimado: ${formattedPrice}`;
    if (showroomWaBtn) {
      showroomWaBtn.href = `https://wa.me/5491100000000?text=${encodeURIComponent(waText)}`;
    }

    // Pre-rellenar Formulario de Cita
    if (showroomCtaBtn) {
      showroomCtaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const interestSelect = document.getElementById('interest');
        const messageTextarea = document.getElementById('message');
        
        if (interestSelect) interestSelect.value = 'custom';
        if (messageTextarea) {
          messageTextarea.value = `Deseo agendar una consulta privada para el Anillo Eternity Solitaire personalizado:\n- Metal: ${metalData.name}\n- Diamante: ${activeCarats} ct\n- Corte: ${activeCut}\n- Talla: ${activeRingSize}\n- Grabado: ${activeEngraving || 'Ninguno'}`;
        }

        // Hacer scroll suave al formulario de contacto
        const contactSection = document.getElementById('contacto');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // 1. Selector de Metales
  metalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const metal = btn.getAttribute('data-metal');
      if (!metal || metal === activeMetalKey) return;

      metalButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeMetalKey = metal;
      const config = METALS_CONFIG[metal];

      // Transición suave para imagen estática
      if (showroomImg) {
        showroomImg.classList.remove('active');
        setTimeout(() => {
          showroomImg.src = config.img;
          showroomImg.alt = `Anillo Eternity Solitaire en ${config.name}`;
          showroomImg.classList.add('active');
        }, 300);
      }

      // Actualizar Visor 3D
      if (showroomViewer) {
        showroomViewer.setAttribute('poster', config.img);
        if (!isDemo3DModelActive) {
          showroomViewer.setAttribute('src', config.glb);
        }
      }

      updateBespokeShowroom();
    });
  });

  // 2. Selector de Quilates
  caratButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const carat = btn.getAttribute('data-carat');
      if (!carat || carat === activeCarats) return;

      caratButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCarats = carat;
      updateBespokeShowroom();
    });
  });

  // 3. Selector de Corte
  cutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cut = btn.getAttribute('data-cut');
      if (!cut || cut === activeCut) return;

      cutButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCut = cut;
      updateBespokeShowroom();
    });
  });

  // 4. Cambio de Talla de Anillo
  if (ringSizeSelect) {
    ringSizeSelect.addEventListener('change', (e) => {
      activeRingSize = e.target.value;
      updateBespokeShowroom();
    });
  }

  // 5. Entrada del Grabado Personalizado
  if (ringEngravingInput) {
    ringEngravingInput.addEventListener('input', (e) => {
      activeEngraving = e.target.value.trim();
      updateBespokeShowroom();
    });
  }

  // Inicializar showroom
  updateBespokeShowroom();

  // Alternar Modos de Vista (Fotografía vs 3D)
  if (btnViewPhoto && btnView3d) {
    btnViewPhoto.addEventListener('click', () => {
      btnViewPhoto.classList.add('active');
      btnViewPhoto.style.borderBottom = "1px solid #D4AF37";
      btnViewPhoto.style.color = "#1A1A1A";

      btnView3d.classList.remove('active');
      btnView3d.style.borderBottom = "1px solid transparent";
      btnView3d.style.color = "#8E8E93";

      if (showroomImg) showroomImg.style.display = "block";
      if (showroomViewer) showroomViewer.style.display = "none";
      if (demoModelContainer) demoModelContainer.style.display = "none";
    });

    btnView3d.addEventListener('click', () => {
      btnView3d.classList.add('active');
      btnView3d.style.borderBottom = "1px solid #D4AF37";
      btnView3d.style.color = "#1A1A1A";

      btnViewPhoto.classList.remove('active');
      btnViewPhoto.style.borderBottom = "1px solid transparent";
      btnViewPhoto.style.color = "#8E8E93";

      if (showroomImg) showroomImg.style.display = "none";
      if (showroomViewer) showroomViewer.style.display = "block";
      if (demoModelContainer) demoModelContainer.style.display = "block";
    });
  }

  // Alternar el modelo 3D de demo (Helmet)
  if (btnToggleDemoGlb && showroomViewer) {
    btnToggleDemoGlb.addEventListener('click', () => {
      isDemo3DModelActive = !isDemo3DModelActive;

      if (isDemo3DModelActive) {
        showroomViewer.setAttribute('src', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');
        btnToggleDemoGlb.textContent = "← Volver al archivo local (assets/ring_*.glb)";
      } else {
        showroomViewer.setAttribute('src', METALS_CONFIG[activeMetalKey].glb);
        btnToggleDemoGlb.textContent = "👉 Activar Modelo 3D de Demostración PBR (Helmet)";
      }
    });
  }


  // ==========================================================================
  // 3. FILTRADO DE CATÁLOGO POR PESTAÑAS (TODOS, JOYERÍA, RELOJERÍA, ACCESORIOS)
  // ==========================================================================
  const tabButtons = document.querySelectorAll('.btn-tab');
  const productCards = document.querySelectorAll('#catalog-products-grid .product-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');
      if (!tab) return;

      // Actualizar pestañas activas
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filtrar tarjetas de producto
      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Efecto visual de desvanecimiento
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (tab === 'todos' || category === tab) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });


  // ==========================================================================
  // 4. MODAL DETALLE DE PRODUCTO
  // ==========================================================================
  const detailsModal = document.getElementById('product-details-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-product-img');
  const modalTag = document.getElementById('modal-product-tag');
  const modalTitle = document.getElementById('modal-product-title');
  const modalPrice = document.getElementById('modal-product-price');
  const modalDesc = document.getElementById('modal-product-desc');
  const modalSpecsList = document.getElementById('modal-product-specs');
  const modalWaCta = document.getElementById('modal-wa-cta');

  // Abrir Modal
  productCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!detailsModal) return;

      const title = card.getAttribute('data-title');
      const price = card.getAttribute('data-price');
      const subcategory = card.getAttribute('data-subcategory');
      const description = card.getAttribute('data-description');
      const img = card.getAttribute('data-img');
      const category = card.getAttribute('data-category');
      const specsRaw = card.getAttribute('data-specs'); // Formato: "Label:Valor|Label:Valor"

      // Rellenar contenido
      if (modalTitle) modalTitle.textContent = title;
      if (modalPrice) modalPrice.textContent = price;
      if (modalTag) {
        const catLabel = category === 'joyeria' ? 'Joyería' : category === 'relojeria' ? 'Relojería' : 'Accesorios de Lujo';
        modalTag.textContent = `${catLabel} / ${subcategory}`;
      }
      if (modalDesc) modalDesc.textContent = description;
      if (modalImg) {
        modalImg.src = img;
        modalImg.alt = title;
      }

      // Rellenar Especificaciones Técnicas
      if (modalSpecsList && specsRaw) {
        modalSpecsList.innerHTML = '';
        const specsArray = specsRaw.split('|');
        specsArray.forEach(spec => {
          const parts = spec.split(':');
          if (parts.length === 2) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${parts[0]}:</strong> <span>${parts[1]}</span>`;
            modalSpecsList.appendChild(li);
          }
        });
      }

      // Configurar CTA de WhatsApp
      if (modalWaCta) {
        const text = `Hola, me gustaría recibir más información y asesoramiento personalizado sobre el producto: ${title} (${subcategory}).`;
        modalWaCta.href = `https://wa.me/5491100000000?text=${encodeURIComponent(text)}`;
      }

      // Mostrar Modal
      detailsModal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Bloquear scroll de la página de fondo
    });
  });

  // Cerrar Modal (Botón de Cerrar)
  if (modalCloseBtn && detailsModal) {
    modalCloseBtn.addEventListener('click', () => {
      detailsModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  // Cerrar Modal (Clic fuera del contenido)
  if (detailsModal) {
    detailsModal.addEventListener('click', (e) => {
      if (e.target === detailsModal) {
        detailsModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }


  // ==========================================================================
  // 5. ANIMACIONES INTERSECT OBSERVER (SCROLL REVEAL)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Solo animar una vez al entrar
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }


  // ==========================================================================
  // 6. CARRUSEL DE TESTIMONIOS (AUTO-ROTACIÓN)
  // ==========================================================================
  const slides = document.querySelectorAll('#testimonials-slider .testimonial-slide');
  const dots = document.querySelectorAll('#slider-dots .dot');
  let currentSlideIndex = 0;
  let slideInterval;

  const showSlide = (index) => {
    if (slides.length === 0) return;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlideIndex = index;
  };

  const nextSlide = () => {
    const nextIdx = (currentSlideIndex + 1) % slides.length;
    showSlide(nextIdx);
  };

  const startSlideShow = () => {
    slideInterval = setInterval(nextSlide, 7000);
  };

  const stopSlideShow = () => {
    clearInterval(slideInterval);
  };

  // Click en dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopSlideShow();
      const index = parseInt(dot.getAttribute('data-index') || '0', 10);
      showSlide(index);
      startSlideShow();
    });
  });

  if (slides.length > 0) {
    startSlideShow();
  }


  // ==========================================================================
  // 7. FORMULARIO DE CONTACTO (INTERCEPTAR SUBMIT)
  // ==========================================================================
  const contactForm = document.getElementById('appointment-form');
  const successMessage = document.getElementById('form-success-msg');

  if (contactForm && successMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Ocultar formulario con transición
      contactForm.style.opacity = '0';
      
      setTimeout(() => {
        contactForm.style.display = 'none';
        
        // Mostrar mensaje de éxito
        successMessage.style.display = 'flex';
        setTimeout(() => {
          successMessage.classList.add('active');
        }, 50);
      }, 400);
    });
  }

  // ==========================================================================
  // 8. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
  // ==========================================================================
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Cerrar otros acordeones abiertos
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      // Alternar estado actual
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ==========================================================================
  // 9. MODAL DE GUÍA DE TALLAS
  // ==========================================================================
  const sizeGuideModal = document.getElementById('size-guide-modal');
  const sizeGuideTrigger = document.getElementById('btn-size-guide-trigger');
  const sizeModalCloseBtn = document.getElementById('size-modal-close-btn');

  if (sizeGuideTrigger && sizeGuideModal) {
    sizeGuideTrigger.addEventListener('click', () => {
      sizeGuideModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  if (sizeModalCloseBtn && sizeGuideModal) {
    sizeModalCloseBtn.addEventListener('click', () => {
      sizeGuideModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  if (sizeGuideModal) {
    sizeGuideModal.addEventListener('click', (e) => {
      if (e.target === sizeGuideModal) {
        sizeGuideModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================================================
  // 10. CARRITO DE COMPRAS - LÓGICA E INTERACTIVIDAD
  // ==========================================================================
  let cart = [];

  const cartBackdrop = document.getElementById('cart-backdrop');
  const btnCart = document.getElementById('btn-cart');
  const btnCartClose = document.getElementById('btn-cart-close');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');
  const cartBadge = document.getElementById('cart-badge');
  const btnCartCheckout = document.getElementById('btn-cart-checkout');
  const btnShowroomAddToBag = document.getElementById('btn-showroom-add-to-bag');
  const modalAddToBagBtn = document.getElementById('modal-add-to-bag-btn');

  // Cargar carrito desde localStorage al arrancar
  const loadCart = () => {
    const savedCart = localStorage.getItem('plaza_vendome_cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartUI();
    }
  };

  // Guardar carrito en localStorage
  const saveCart = () => {
    localStorage.setItem('plaza_vendome_cart', JSON.stringify(cart));
  };

  // Formatear precio numérico a cadena
  const formatPrice = (val) => `U$D ${val.toLocaleString('en-US')}`;

  // Actualizar interfaz del carrito
  const updateCartUI = () => {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    let subtotalVal = 0;
    let totalQty = 0;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; color: var(--gray-medium); margin-top: 50px; font-family: var(--font-sans); font-size: 13px;">
          <p>Tu bolsa de compras está vacía.</p>
        </div>
      `;
    } else {
      cart.forEach((item, index) => {
        subtotalVal += item.price * item.quantity;
        totalQty += item.quantity;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
          <div class="cart-item-img">
            <img src="${item.thumbnail}" alt="${item.title}">
          </div>
          <div class="cart-item-details">
            <span class="cart-item-title">${item.title}</span>
            <span class="cart-item-meta">${item.details}</span>
            <div class="cart-item-quantity-controls">
              <button class="btn-qty btn-qty-minus" data-index="${index}">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="btn-qty btn-qty-plus" data-index="${index}">+</button>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; height: 80px;">
            <button class="btn-cart-remove" data-index="${index}" aria-label="Eliminar producto">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
            <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
          </div>
        `;
        cartItemsList.appendChild(cartItemDiv);
      });
    }

    // Actualizar totales y subtotal
    if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotalVal);
    if (cartTotal) cartTotal.textContent = formatPrice(subtotalVal);

    // Actualizar Badge del Navbar
    if (cartBadge) {
      if (totalQty > 0) {
        cartBadge.textContent = totalQty;
        cartBadge.style.display = 'flex';
      } else {
        cartBadge.style.display = 'none';
      }
    }

    // Configurar event listeners en botones dinámicos de cantidad y remoción
    const btnMinus = cartItemsList.querySelectorAll('.btn-qty-minus');
    const btnPlus = cartItemsList.querySelectorAll('.btn-qty-plus');
    const btnRemove = cartItemsList.querySelectorAll('.btn-cart-remove');

    btnMinus.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveCart();
        updateCartUI();
      });
    });

    btnPlus.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        cart[index].quantity += 1;
        saveCart();
        updateCartUI();
      });
    });

    btnRemove.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
      });
    });
  };

  // Abrir y Cerrar Carrito
  if (btnCart && cartBackdrop) {
    btnCart.addEventListener('click', () => {
      cartBackdrop.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  if (btnCartClose && cartBackdrop) {
    btnCartClose.addEventListener('click', () => {
      cartBackdrop.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', (e) => {
      if (e.target === cartBackdrop) {
        cartBackdrop.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // Añadir al Carrito: Showroom Anillo Bespoke
  if (btnShowroomAddToBag) {
    btnShowroomAddToBag.addEventListener('click', () => {
      // Capturar estados de personalización actuales
      const metalData = METALS_CONFIG[activeMetalKey];
      const baseCaratPrice = CARAT_PRICES[activeCarats];
      const finalPrice = baseCaratPrice + metalData.surcharge;

      const itemDetails = `${metalData.name}, ${activeCarats} ct, Corte ${activeCut}, Talla ${activeRingSize}${activeEngraving ? `, Grabado: "${activeEngraving}"` : ''}`;

      // ID único basado en su configuración para agruparlo si es idéntico
      const itemId = `ring-bespoke-${activeMetalKey}-${activeCarats}-${activeCut}-${activeRingSize}-${activeEngraving.replace(/\s+/g, '')}`;

      const existingItemIndex = cart.findIndex(item => item.id === itemId);

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          id: itemId,
          title: "Anillo Eternity Solitaire",
          details: itemDetails,
          price: finalPrice,
          thumbnail: metalData.img,
          quantity: 1
        });
      }

      saveCart();
      updateCartUI();
      
      // Abrir el panel del carrito para dar feedback inmediato
      cartBackdrop.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  // Añadir al Carrito: Modal de Detalles de Productos del Catálogo
  if (modalAddToBagBtn) {
    modalAddToBagBtn.addEventListener('click', () => {
      // Obtener el producto actualmente cargado en el modal
      const title = modalTitle.textContent;
      const priceText = modalPrice.textContent;
      const subcategory = modalTag.textContent.split(' / ')[1] || 'Edición Limitada';
      const imgUrl = modalImg.getAttribute('src');

      // Buscar el ID del producto que corresponde
      // Buscamos en el catálogo por título o imagen
      const matchedCatalogProduct = CATALOG_PRODUCTS.find(p => p.title === title || p.thumbnail === imgUrl);
      const itemId = matchedCatalogProduct ? matchedCatalogProduct.id : `catalog-prod-${Date.now()}`;

      // Limpiar precio para convertirlo en número (ej. "U$D 12,400" -> 12400)
      const priceNum = parseInt(priceText.replace(/[^\d]/g, ''), 10);
      const itemDetails = subcategory;

      const existingItemIndex = cart.findIndex(item => item.id === itemId);

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          id: itemId,
          title: title,
          details: itemDetails,
          price: priceNum,
          thumbnail: imgUrl,
          quantity: 1
        });
      }

      saveCart();
      updateCartUI();

      // Cerrar modal de detalles y abrir el carrito
      if (detailsModal) detailsModal.style.display = 'none';
      cartBackdrop.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  // Confirmar reserva por WhatsApp
  if (btnCartCheckout) {
    btnCartCheckout.addEventListener('click', () => {
      if (cart.length === 0) return;

      let waText = "Hola Plaza Vendôme, deseo realizar la reserva de las siguientes piezas exclusivas:\n\n";
      let totalSum = 0;

      cart.forEach((item, i) => {
        const itemTotal = item.price * item.quantity;
        totalSum += itemTotal;
        waText += `${i + 1}. ${item.title} (${item.details})\n   Cant: ${item.quantity} x ${formatPrice(item.price)} = ${formatPrice(itemTotal)}\n\n`;
      });

      waText += `Total estimado de la reserva: ${formatPrice(totalSum)}\n\n¿Podrían confirmarme la disponibilidad para retiro en su Atelier o envío asegurado?`;

      window.open(`https://wa.me/5491100000000?text=${encodeURIComponent(waText)}`, '_blank');
    });
  }

  // ==========================================================================
  // 11. PARALLAX DE DESTELLOS DORADOS EN LOS MARGENES
  // ==========================================================================
  const sparkles = document.querySelectorAll('.sparkle');
  
  if (sparkles.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      sparkles.forEach(sparkle => {
        const speed = parseFloat(sparkle.getAttribute('data-speed') || '0.1');
        // Desplazar verticalmente y rotar levemente con el scroll
        sparkle.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.04}deg)`;
      });
    });
  }

  // ==========================================================================
  // 12. PANTALLA DE BIENVENIDA (ATELIER PRELOADER)
  // ==========================================================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Asegurar que el scroll esté bloqueado durante el preloader
    document.body.style.overflow = 'hidden';
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.style.overflow = '';
      }, 1600); // Duración de la animación de bienvenida
    });

    // Failsafe: Si por alguna razón la carga tarda demasiado, quitarlo a los 3 segundos
    setTimeout(() => {
      if (!preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
        document.body.style.overflow = '';
      }
    }, 3000);
  }

  // ==========================================================================
  // 13. CURSOR DE EXPERIENCIA PERSONALIZADO (CUSTOM CURSOR)
  // ==========================================================================
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let isHovering = false;
  
  // Guardar coordenadas de la posición del mouse
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // El punto central sigue instantáneamente el mouse
    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }
  });
  
  // El anillo exterior sigue con inercia/física de suavizado
  const animateCursor = () => {
    const delay = 0.15; // Factor de suavizado (inercia)
    cursorX += (mouseX - cursorX) * delay;
    cursorY += (mouseY - cursorY) * delay;
    
    if (cursor) {
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
    }
    
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
  
  // Agregar interacciones hover de los elementos interactivos
  const addCursorHoverEvents = () => {
    const selectors = 'a, button, select, input, textarea, .btn-tab, .btn-metal, .btn-custom-option, .faq-question, .product-card, .gia-certificate-wrapper';
    const elements = document.querySelectorAll(selectors);
    
    elements.forEach(el => {
      // Evitar duplicar listeners
      if (el.getAttribute('data-cursor-bound')) return;
      el.setAttribute('data-cursor-bound', 'true');

      el.addEventListener('mouseenter', () => {
        if (!cursor || !cursorDot) return;
        cursor.classList.add('hovered');
        cursorDot.classList.add('hovered');
        
        // Personalizar el texto interior del cursor en base a la clase del elemento
        if (el.classList.contains('product-card')) {
          cursor.textContent = 'VER';
        } else if (el.id === 'btn-showroom-add-to-bag' || el.id === 'modal-add-to-bag-btn') {
          cursor.textContent = 'BOLSA';
        } else if (el.id === 'btn-showroom-wa' || el.id === 'modal-wa-cta') {
          cursor.textContent = 'CHAT';
        } else if (el.classList.contains('gia-certificate-wrapper')) {
          cursor.textContent = 'GIRAR';
        } else {
          cursor.textContent = '';
        }
      });
      
      el.addEventListener('mouseleave', () => {
        if (!cursor || !cursorDot) return;
        cursor.classList.remove('hovered');
        cursorDot.classList.remove('hovered');
        cursor.textContent = '';
      });
    });
  };
  
  // Inicializar listeners de cursor
  addCursorHoverEvents();

  // Escuchar cuando el portafolio de productos se vuelve a renderizar para volver a enlazar el cursor
  const portfolioContainer = document.getElementById('portfolio-grid');
  if (portfolioContainer) {
    const observer = new MutationObserver(() => {
      addCursorHoverEvents();
    });
    observer.observe(portfolioContainer, { childList: true });
  }

  // ==========================================================================
  // 14. LUPA DE JOYERO INTERACTIVA (JEWELER'S LOUPE)
  // ==========================================================================
  const imageContainer = document.querySelector('.product-image-container');
  const staticImage = document.getElementById('showroom-image');
  const lens = document.getElementById('image-lens-overlay');
  
  if (imageContainer && staticImage && lens) {
    imageContainer.addEventListener('mousemove', (e) => {
      // Mostrar la lupa solo si estamos en modo fotografía estática
      if (!staticImage.classList.contains('active')) {
        lens.style.display = 'none';
        return;
      }
      
      lens.style.display = 'block';
      
      const rect = imageContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Centrar la lente bajo la posición del cursor
      lens.style.left = (x - lens.offsetWidth / 2) + 'px';
      lens.style.top = (y - lens.offsetHeight / 2) + 'px';
      
      // Asignar imagen del showroom como fondo de la lente
      lens.style.backgroundImage = `url('${staticImage.src}')`;
      
      // Factor de ampliación/zoom (2x)
      const zoomFactor = 2.2;
      
      // Calcular la posición del fondo de la lente para centrar el zoom
      const bgX = (x * zoomFactor) - (lens.offsetWidth / 2);
      const bgY = (y * zoomFactor) - (lens.offsetHeight / 2);
      
      lens.style.backgroundSize = `${rect.width * zoomFactor}px ${rect.height * zoomFactor}px`;
      lens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
    });
    
    imageContainer.addEventListener('mouseleave', () => {
      lens.style.display = 'none';
    });
  }

  // ==========================================================================
  // 15. TARJETA CERTIFICADO GIA VOLTEABLE 3D (FLIP CARD)
  // ==========================================================================
  const giaWrapper = document.getElementById('gia-cert-container');
  if (giaWrapper) {
    giaWrapper.addEventListener('click', () => {
      giaWrapper.classList.toggle('flipped');
    });
  }

  // Cargar carrito inicial
  loadCart();
});
