{
    document.addEventListener('DOMContentLoaded', function () {
        const section = document.querySelector('.s-fullbanner');
        if (!section) return;
    
        function setSectionHeight() {
            const height = section.offsetHeight;
            document.documentElement.style.setProperty(
                '--hero-height',
                `${height}px`
            );
            console.log(height);
        }
    
        setSectionHeight();
    
        // Recalcula em resize (muito importante)
        window.addEventListener('resize', setSectionHeight);
    });
    
}

{
  document.addEventListener('DOMContentLoaded', function () {

    const modalSearch = document.querySelector('.modal-search');
    if (!modalSearch) return;

    const modalContainer = modalSearch.querySelector('.container');
    if (!modalContainer) return;

    // ✅ agora pega TODOS os botões que abrem a busca
    const searchIcons = document.querySelectorAll('.search-icon');
    if (!searchIcons.length) return;

    // ✅ Abrir modal (e impedir que o clique "vaze" pro overlay)
    searchIcons.forEach(icon => {
      icon.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); // 🔥 impede fechar na mesma hora
        modalSearch.classList.add('active');
      });
    });

    // ✅ Fechar clicando fora do container (overlay)
    modalSearch.addEventListener('click', function () {
      modalSearch.classList.remove('active');
    });

    // ✅ Impede fechar clicando dentro do container
    modalContainer.addEventListener('click', function (e) {
      e.stopPropagation();
    });

  });
}

//Script Carrinho Lateral
{
  function toReal(value, str_cifrao) {
    return str_cifrao + ' ' + value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function toBRL(value){
    return Number(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  var cart = {

    session: function () {
      return jQuery("html").attr("data-session");
    },

    /* ===============================
       BADGE (header)
    =============================== */
    updateBadge: function (qnt) {
      var badge = jQuery('span[data-cart=amount]');
      if (!badge.length) return;

      var total = Number(qnt) || 0;

      badge.text(total);
      badge.attr('data-amount', String(total));

      if (total > 0) badge.addClass('is-visible');
      else badge.removeClass('is-visible');
    },

    /* ===============================
       FRETE GRÁTIS (progress)
    =============================== */
    getFreeShippingThreshold: function(){
      var box = document.querySelector('.cart-sidebar .free-shipping');
      if (!box) return 0;

      var raw = box.getAttribute('data-free-shipping') || '0';

      raw = raw.toString()
        .replace(/[^\d,.-]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');

      var v = parseFloat(raw);
      return Number.isFinite(v) ? v : 0;
    },

    updateFreeShipping: function(cartTotal){
      var box = document.querySelector('.cart-sidebar .free-shipping');
      if (!box) return;

      var threshold = cart.getFreeShippingThreshold();

      if (!threshold || threshold <= 0){
        box.style.display = 'none';
        return;
      }

      box.style.display = 'block';

      var textEl = box.querySelector('.free-shipping__text');
      var fillEl = box.querySelector('.free-shipping__bar-fill');

      var total = Number(cartTotal) || 0;
      if (total < 0) total = 0;

      if (total >= threshold){
        if (textEl) {
          textEl.innerHTML = '<strong>Voc&ecirc; ganhou Frete Gr&aacute;tis</strong>!';
        }
        if (fillEl) fillEl.style.width = '100%';
        return;
      }

      var remaining = threshold - total;
      var percent = Math.max(0, Math.min(100, (total / threshold) * 100));

      if (textEl) {
        textEl.innerHTML = 'Adicione mais <strong>'+toBRL(remaining)+'</strong> e ganhe <strong>Frete Gr&aacute;tis</strong>';
      }

      if (fillEl) fillEl.style.width = percent.toFixed(2) + '%';
    },

    /* ===============================
       REMOVE (mantém seu padrão)
    =============================== */
    removeProduct: function (element) {
      var id = parseInt(jQuery(element).attr('data-id'));
      var variant = '/' + jQuery(element).attr('data-variant');
      var together = jQuery(element).attr('data-together') !== '' ? '/' + jQuery(element).attr('data-together') : '';
      var addText = jQuery(element).attr('data-add') == "" ? '' : jQuery(element).attr('data-add');

      jQuery.ajax({
        method: "DELETE",
        url: "/web_api/carts/" + cart.session() + "/" + id + variant + together + "?" + jQuery.param({ "additional_information": addText })
      }).always(function () {
        cart.listProduct();
      });
    },

    /* ===============================
       UPDATE QTY ( + / - )
       ✅ Estratégia: DELETE + POST (quantidade final)
    =============================== */
    updateItemQty: function (btn, delta) {
      var $btn = jQuery(btn);

      var productId = parseInt($btn.attr('data-id'), 10);
      var variantId = parseInt($btn.attr('data-variant'), 10) || 0;
      var togetherId = $btn.attr('data-together') || '';
      var addText = $btn.attr('data-add') || '';

      var currentQty = parseInt($btn.attr('data-qty'), 10) || 1;
      var newQty = currentQty + (delta || 0);

      if (!productId) return;

      // se <= 0, remove e pronto
      if (newQty <= 0) {
        cart.removeProduct(btn);
        return;
      }

      // 1) DELETE item atual (mesma composição)
      var delUrl = "/web_api/carts/" + cart.session() + "/" + productId;

      if (variantId) delUrl += "/" + variantId;
      if (togetherId) delUrl += "/" + togetherId;

      if (addText) {
        delUrl += "?" + jQuery.param({ "additional_information": addText });
      }

      jQuery.ajax({
        method: "DELETE",
        url: delUrl
      })
      .always(function () {
        // 2) POST com quantidade FINAL (recria item)
        jQuery.ajax({
          method: "POST",
          url: "/web_api/cart/",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify({
            Cart: {
              session_id: cart.session(),
              product_id: productId,
              variant_id: variantId,
              quantity: newQty
            }
          })
        })
        .done(function () {
          cart.listProduct();
        })
        .fail(function (jqXHR) {
          console.log(jqXHR.responseText);

          // fallback: recarrega pra voltar estado correto se bater estoque
          cart.listProduct();
        });
      });
    },

    /* ===============================
       LIST
    =============================== */
    listProduct: function () {
      jQuery.ajax({
        method: "GET",
        url: "/web_api/cart/" + cart.session(),
        success: function (response) {
          if (Array.isArray(response) && response.length) cart.forProduct(response);
          else cart.forProduct([]);
        },
        error: function () {
          cart.forProduct([]);
        }
      });
    },

    /* ===============================
       TOTAL
    =============================== */
    total: function (price) {
      jQuery('.cart-sidebar .total .value').text(toReal(parseFloat(price || 0), 'R$'));
    },

    /* ===============================
       RENDER PRODUCTS
    =============================== */
    forProduct: function (listProducts) {

      var listDom = jQuery('.cart-sidebar .content-cart .list');
      listDom.find('*').remove();
      listDom.parent().removeClass('empty');

      var qnt = 0;
      var total = 0.0;

      if (listProducts.length) {

        listProducts.forEach(function (product) {

          product = product.Cart;

          var addMsg = product.additional_information || '';
          var productImage = '';

          if (product.product_image) {
            if (product.product_image.https) {
              productImage = product.product_image.https;
            } else if (product.product_image.thumbs) {
              var thumbs = product.product_image.thumbs;
              var preferredSizes = [600, 450, 300, 250, 200, 180, 150, 120, 100, 90];

              for (var i = 0; i < preferredSizes.length; i++) {
                var size = preferredSizes[i];
                if (thumbs[size] && thumbs[size].https) {
                  productImage = thumbs[size].https;
                  break;
                }
              }

              if (!productImage) {
                var keys = Object.keys(thumbs);
                for (var k = 0; k < keys.length; k++) {
                  var key = keys[k];
                  if (thumbs[key] && thumbs[key].https) {
                    productImage = thumbs[key].https;
                    break;
                  }
                }
              }
            }
          }

          listDom.append(cart.templateProduct(
            product.product_id,
            product.variant_id,
            product.product_name,
            productImage,
            product.quantity,
            product.price,
            product.product_url.https,
            addMsg,
            product.bought_together_id
          ));

          qnt += parseInt(product.quantity, 10);
          total += (parseFloat(product.price) * parseInt(product.quantity, 10));
        });

        cart.total(total);
        cart.updateBadge(qnt);
        cart.updateFreeShipping(total);

      } else {

        listDom.append('<div class="error"><div clas="text">Carrinho Vazio</div></div>');
        listDom.parent().addClass('empty');

        cart.updateBadge(0);
        cart.total(0);
        cart.updateFreeShipping(0);
      }
    },

    /* ===============================
       OPEN/CLOSE
    =============================== */
    startCart: function () {

      jQuery('.cart-toggle').on('click', function (e) {
        e.preventDefault();
        cart.showCart();
      });

      jQuery('.shadow-cart, .cart-sidebar .box-prev').on('click', function () {
        jQuery('.cart-sidebar').removeClass('active');
        jQuery('.shadow-cart').removeClass('active');
      });

      // ✅ Delegação: +/- funciona mesmo após re-render
      jQuery(document).on('click', '.cart-sidebar .qty-btn', function(e){
        e.preventDefault();
        var delta = parseInt(jQuery(this).attr('data-delta'), 10) || 0;
        cart.updateItemQty(this, delta);
      });
    },

    showCart: function () {
      cart.listProduct();
      jQuery('.cart-sidebar').addClass('active');
      jQuery('.shadow-cart').addClass('active');
    },

    /* ===============================
       TEMPLATE
    =============================== */
    templateProduct: function (id, variant, name, image, qnt, price, url, addMsg, together) {

      var template = '\
        <div class="item">\
          <div class="box-cart flex align-center">\
            <div class="box-image">\
              <a href="{url}" class="image">\
                <img src="{image}" alt="{name}">\
              </a>\
              <div class="remove" data-id="{id}" data-together="{together}" data-variant="{variant}" data-add="{addMsg}" onclick="cart.removeProduct(this)">\
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none"><path d="M6.97656 1.48438H0.445312C0.327208 1.48438 0.213941 1.53129 0.130429 1.6148C0.0469167 1.69832 0 1.81158 0 1.92969C0 2.04779 0.0469167 2.16106 0.130429 2.24457C0.213941 2.32808 0.327208 2.375 0.445312 2.375H0.59375V7.42188C0.59375 7.61872 0.671944 7.80749 0.811132 7.94668C0.950319 8.08587 1.1391 8.16406 1.33594 8.16406H6.08594C6.28278 8.16406 6.47156 8.08587 6.61074 7.94668C6.74993 7.80749 6.82812 7.61872 6.82812 7.42188V2.375H6.97656C7.09467 2.375 7.20793 2.32808 7.29145 2.24457C7.37496 2.16106 7.42188 2.04779 7.42188 1.92969C7.42188 1.81158 7.37496 1.69832 7.29145 1.6148C7.20793 1.53129 7.09467 1.48438 6.97656 1.48438ZM5.9375 7.27344H1.48438V2.375H5.9375V7.27344ZM1.78125 0.445312C1.78125 0.327208 1.82817 0.213941 1.91168 0.130429C1.99519 0.0469167 2.10846 0 2.22656 0H5.19531C5.31342 0 5.42668 0.0469167 5.5102 0.130429C5.59371 0.213941 5.64062 0.327208 5.64062 0.445312C5.64062 0.563417 5.59371 0.676684 5.5102 0.760196C5.42668 0.843708 5.31342 0.890625 5.19531 0.890625H2.22656C2.10846 0.890625 1.99519 0.843708 1.91168 0.760196C1.82817 0.676684 1.78125 0.563417 1.78125 0.445312Z" fill="#9CA3AF"/></svg>\
                <span>Remover</span>\
              </div>\
            </div>\
            <div class="info-product">\
              <div class="line-top flex justify-between">\
                <a href="{url}" class="name t-color">{name}</a>\
              </div>\
              <div class="line-down">\
                <div class="price">{price}</div>\
                <div class="qnt">\
                  <button type="button" class="qty-btn" data-delta="-1" data-id="{id}" data-variant="{variant}" data-together="{together}" data-add="{addMsg}" data-qty="{length}">-</button>\
                  <span class="qty-value">{length}</span>\
                  <button type="button" class="qty-btn" data-delta="1" data-id="{id}" data-variant="{variant}" data-together="{together}" data-add="{addMsg}" data-qty="{length}">+</button>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      ';

      price = toReal(parseFloat(price), 'R$');

      template = template.replace(/{url}/g, url);
      template = template.replace(/{image}/g, image);
      template = template.replace(/{name}/g, name);
      template = template.replace(/{id}/g, id);
      template = template.replace(/{variant}/g, variant || 0);
      template = template.replace(/{length}/g, qnt);
      template = template.replace(/{addMsg}/g, addMsg || '');
      template = template.replace(/{price}/g, price);
      template = template.replace(/{together}/g, together || '');

      return template;
    }
  };

  jQuery(function () {
    cart.startCart();
    cart.listProduct();
  });
}

//Script para mudar foto do produto na vitrine
{
    document.addEventListener('click', function (e) {
        const button = e.target.closest('.js-variant-color');
        if (!button) return;

        const newImage = button.dataset.image;
        const variantId = button.dataset.variantId;

        const productCard = button.closest('.product-slide');
        if (!productCard) return;

        // ✅ GUARDA A VARIANTE SELECIONADA NO CARD
        productCard.dataset.variantId = variantId;

        const imgProduct = productCard.querySelector('.img-product');
        if (newImage && imgProduct) {
            imgProduct.src = newImage;
        }

        // estado ativo
        productCard.querySelectorAll('.js-variant-color').forEach(el => {
            el.classList.remove('active');
        });
        button.classList.add('active');
    });
}

//Script Variacoes - Marca e Cor
{
    document.addEventListener('DOMContentLoaded', function () {

        document.querySelectorAll('.list-variants').forEach(form => {
    
            let variantsRaw = form.getAttribute('data-variants') || '[]';
            variantsRaw = variantsRaw.replace(/&quot;/g, '"');
            const variants = JSON.parse(variantsRaw);
    
            const mainSelect = form.querySelector('.first.option-select');
            const colorItems = Array.from(form.querySelectorAll('.option-color li'));
    
            if (!mainSelect || !colorItems.length) return;
    
            let selectedMain = null;
            let selectedColor = null;
    
            /* ===============================
               ATUALIZA CORES
            =============================== */
            function updateColors(autoSelectFirst = true) {
    
                selectedColor = null;
    
                const allowedColors = variants
                    .filter(v => v.main === selectedMain && Number(v.stock) > 0)
                    .map(v => v.color);
    
                let firstValidColor = null;
    
                colorItems.forEach(li => {
                    li.classList.remove('active');
    
                    if (allowedColors.includes(li.dataset.value)) {
                        li.style.display = 'flex';
    
                        if (!firstValidColor) {
                            firstValidColor = li;
                        }
                    } else {
                        li.style.display = 'none';
                    }
                });
    
                if (autoSelectFirst && firstValidColor) {
                    selectColor(firstValidColor);
                }
            }
    
            /* ===============================
               SELECIONA COR
            =============================== */
            function selectColor(li) {
    
                colorItems.forEach(i => i.classList.remove('active'));
                li.classList.add('active');
    
                selectedColor = li.dataset.value;
    
                const variant = variants.find(v =>
                    v.main === selectedMain &&
                    v.color === selectedColor &&
                    Number(v.stock) > 0
                );
    
                if (!variant) return;
    
                // 🔥 TROCA IMAGEM DO SWIPER
                if (variant.imageProduct) {
                    updateHighlightImage(variant.imageProduct);
                }
            }

            function updateHighlightImage(imageUrl) {
                if (!imageUrl) return;
            
                const mainImg  = document.querySelector('.js-main-product-image');
                const thumbImg = document.querySelector(
                    '.mid-product .thumbs .swiper-slide:first-child img'
                );
            
                if (!mainImg || !thumbImg) return;
            
                // fade out
                mainImg.style.opacity = 0;
                thumbImg.style.opacity = 0;
            
                setTimeout(() => {
                    // atualiza imagem principal
                    mainImg.src = imageUrl;
            
                    // atualiza thumb 0
                    thumbImg.src = imageUrl;
            
                    // força swiper voltar pro slide 0
                    if (typeof swiperMain !== 'undefined') {
                        swiperMain.slideTo(0, 300);
                        swiperMain.update();
                    }
            
                    if (typeof swiperThumbs !== 'undefined') {
                        swiperThumbs.slideTo(0, 0);
                        swiperThumbs.update();
                    }
            
                    // fade in
                    mainImg.style.opacity = 1;
                    thumbImg.style.opacity = 1;
            
                }, 120);
            }
    
            /* ===============================
               CHANGE MARCA
            =============================== */
            mainSelect.addEventListener('change', function () {
                selectedMain = this.value;
                if (!selectedMain) return;
                updateColors(true);
            });
    
            /* ===============================
               CLICK COR
            =============================== */
            colorItems.forEach(li => {
                li.addEventListener('click', function () {
                    if (!selectedMain) return;
                    selectColor(this);
                });
            });
    
            /* ===============================
               ESTADO INICIAL
            =============================== */
            const firstValidOption = Array.from(mainSelect.options)
                .find(opt => opt.value && opt.value !== 'Selecione');
    
            if (firstValidOption) {
                mainSelect.value = firstValidOption.value;
                selectedMain = firstValidOption.value;
                updateColors(true);
            }
    
        });
    
    });
}


//Add Cart
{
    function addCart(dataProductId){
        var dataSession = $("html").attr("data-session");

        $.ajax({
            method: "POST",
            url: "/web_api/cart/",
            contentType: "application/json; charset=utf-8",
            data: '{"Cart":{"session_id":"'+dataSession+'","product_id":"'+dataProductId+'","quantity":"1"}}'
        })
        .done(function(response) {

            console.log(response);

            var qtdCart = parseInt($("span[data-cart=amount]").html());
            $("span[data-cart=amount]").html(qtdCart + 1);

            // ✅ ABRE CARRINHO LATERAL
            if (typeof cart !== 'undefined') {
                cart.showCart();
            }

        })
        .fail(function(jqXHR){
            console.log(jqXHR.responseText);
        });
    }
}

//Add Cart - Produto COM VARIAÇÃO (usa variant_id selecionado)
{
    document.addEventListener('click', function(e){
        const btn = e.target.closest('.js-add-cart-variant');
        if (!btn) return;

        const productCard = btn.closest('.product-slide');
        if (!productCard) return;

        const productId = btn.dataset.productId;
        const variantId = productCard.dataset.variantId; // ✅ vem do clique na cor

        if (!variantId) {
            alert('Selecione uma cor para comprar.');
            return;
        }

        var dataSession = $("html").attr("data-session");

        $.ajax({
            method: "POST",
            url: "/web_api/cart/",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                Cart: {
                    session_id: dataSession,
                    product_id: productId,
                    variant_id: variantId,
                    quantity: 1
                }
            })
        })
        .done(function(response) {

            console.log(response);

            // atualiza badge
            var qtdCart = parseInt($("span[data-cart=amount]").html());
            $("span[data-cart=amount]").html(qtdCart + 1);

            // ✅ abre carrinho lateral
            if (typeof cart !== 'undefined') {
                cart.showCart();
            }

        })
        .fail(function(jqXHR){
            console.log(jqXHR.responseText);
        });
    });
}

//ADD CART HIGHLIGHT
/* ===============================
   DESTAQUE - VARIAÇÕES (main + cor) + ADD TO CART
   (compatível com seu HTML atual)
=============================== */
{
  document.addEventListener('DOMContentLoaded', function () {

    // Só roda onde existir o form de variantes do destaque
    document.querySelectorAll('.s-section-highlight .list-variants').forEach(form => {

      // ===== Helpers =====
      function parseVariants(raw) {
        if (!raw) return [];
        raw = raw.replace(/&quot;/g, '"'); // Tray pode vir com &quot;
        try { return JSON.parse(raw); } catch (e) { return []; }
      }

      function normalizeStr(v) {
        return (v ?? '').toString().trim();
      }

      // ===== Elements =====
      const productId = form.getAttribute('data-id');
      const variants  = parseVariants(form.getAttribute('data-variants') || '[]');

      const mainSelect = form.querySelector('.first.option-select');
      const colorItems = Array.from(form.querySelectorAll('.option-color li'));
      const qtyInput   = form.querySelector('input[name="qty"]');
      const btnAdd     = form.querySelector('.add-to-cart');

      const btnMinus   = form.querySelector('[data-app="product.qty"][data-action="minus"]');
      const btnPlus    = form.querySelector('[data-app="product.qty"][data-action="plus"]');

      const alertBox   = form.querySelector('.alert-dont-stock');

      if (!productId || !mainSelect || !colorItems.length || !btnAdd || !qtyInput) return;

      let selectedMain   = '';
      let selectedColor  = '';
      let selectedVariant = null;

      // ===== UI helpers =====
      function showAlert(msg) {
        if (!alertBox) return;
        alertBox.style.display = 'block';
        const p = alertBox.querySelector('p');
        if (p) p.textContent = msg || 'Variação indisponível';
      }

      function hideAlert() {
        if (!alertBox) return;
        alertBox.style.display = 'none';
      }

      function getQty() {
        const v = parseInt(qtyInput.value || '1', 10);
        return Number.isFinite(v) && v > 0 ? v : 1;
      }

      function setQty(next) {
        let value = parseInt(next || 1, 10);
        if (!Number.isFinite(value) || value < 1) value = 1;

        // max padrão
        let max = parseInt(qtyInput.getAttribute('max') || '99', 10);
        if (!Number.isFinite(max) || max <= 0) max = 99;

        // se já tem variante selecionada e estoque real, usa estoque como teto
        if (selectedVariant && selectedVariant.stock) {
          const stock = Number(selectedVariant.stock);
          // quando without_stock_sale você setou '99999' no twig, então ok
          if (Number.isFinite(stock) && stock > 0) {
            max = Math.min(max, stock);
          }
        }

        if (value > max) value = max;

        qtyInput.value = String(value);
      }

      // ===== Variant logic =====
      function findVariant(main, color) {
        main  = normalizeStr(main);
        color = normalizeStr(color);

        return variants.find(v =>
          normalizeStr(v.main)  === main &&
          normalizeStr(v.color) === color &&
          Number(v.stock) > 0
        ) || null;
      }

      function allowedColorsForMain(main) {
        main = normalizeStr(main);
        const colors = variants
          .filter(v => normalizeStr(v.main) === main && Number(v.stock) > 0)
          .map(v => normalizeStr(v.color));
        return Array.from(new Set(colors));
      }

      function setActiveColor(li) {
        colorItems.forEach(x => x.classList.remove('active'));
        if (li) li.classList.add('active');
      }

      function filterColors(autoSelectFirst = true) {
        selectedColor = '';
        selectedVariant = null;
        hideAlert();

        const allowed = allowedColorsForMain(selectedMain);
        let firstVisible = null;

        colorItems.forEach(li => {
          const value = normalizeStr(li.dataset.value);

          if (allowed.includes(value)) {
            li.style.display = 'flex';
            li.classList.remove('disabled');
            if (!firstVisible) firstVisible = li;
          } else {
            li.style.display = 'none';
            li.classList.remove('active');
          }
        });

        if (autoSelectFirst && firstVisible) {
          selectColor(firstVisible);
        } else {
          // sem cor selecionada -> volta qty pra 1 por segurança
          setQty(1);
        }
      }

      function selectColor(li) {
        const value = normalizeStr(li.dataset.value);
        if (!value) return;

        setActiveColor(li);
        selectedColor = value;

        selectedVariant = findVariant(selectedMain, selectedColor);

        if (!selectedVariant) {
          showAlert('Variação indisponível');
          return;
        }

        hideAlert();

        // ajusta max pelo estoque da variante selecionada
        const stock = Number(selectedVariant.stock);
        if (Number.isFinite(stock) && stock > 0) {
          qtyInput.setAttribute('max', String(Math.min(99, stock)));
        } else {
          qtyInput.setAttribute('max', '99');
        }

        // garante qty válida após trocar variante (ex: estava 5 e agora estoque 2)
        setQty(getQty());

        // troca imagem principal (swiper do destaque)
        if (selectedVariant.imageProduct) {
          updateHighlightImage(selectedVariant.imageProduct);
        }
      }

      // ===== Swiper image updater (usa o que você já vem usando) =====
      function updateHighlightImage(imageUrl) {
        if (!imageUrl) return;

        const mainImg  = document.querySelector('.s-section-highlight .js-main-product-image');
        const thumbImg = document.querySelector('.s-section-highlight .thumbs .swiper-slide:first-child img');

        if (!mainImg || !thumbImg) return;

        mainImg.style.opacity = 0;
        thumbImg.style.opacity = 0;

        setTimeout(() => {
          mainImg.src  = imageUrl;
          thumbImg.src = imageUrl;

          if (typeof swiperMain !== 'undefined') {
            swiperMain.slideTo(0, 300);
            swiperMain.update();
          }

          if (typeof swiperThumbs !== 'undefined') {
            swiperThumbs.slideTo(0, 0);
            swiperThumbs.update();
          }

          mainImg.style.opacity = 1;
          thumbImg.style.opacity = 1;
        }, 120);
      }

      // ===== Qty (+/-) =====
      function handlePlusMinus(delta) {
        hideAlert();

        // se ainda não tem variante selecionada, força seleção (primeira cor válida já é auto)
        if (!selectedVariant) {
          showAlert('Selecione uma cor.');
          return;
        }

        const current = getQty();
        setQty(current + delta);
      }

      if (btnMinus) {
        btnMinus.addEventListener('click', function () {
          handlePlusMinus(-1);
        });
      }

      if (btnPlus) {
        btnPlus.addEventListener('click', function () {
          handlePlusMinus(+1);
        });
      }

      // se digitar manualmente no input
      qtyInput.addEventListener('input', function () {
        setQty(getQty());
      });

      // ===== Events =====
      // main change
      mainSelect.addEventListener('change', function () {
        selectedMain = normalizeStr(this.value);
        if (!selectedMain) return;
        filterColors(true);
      });

      // color click
      colorItems.forEach(li => {
        li.addEventListener('click', function () {
          if (!selectedMain) return;
          selectColor(this);
        });
      });

      // submit add to cart
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        hideAlert();

        if (!selectedMain) {
          showAlert('Selecione uma opção.');
          return;
        }

        if (!selectedVariant) {
          showAlert('Selecione uma cor.');
          return;
        }

        const qty = getQty();
        const dataSession = jQuery('html').attr('data-session');

        // valida estoque (quando não é without_stock_sale)
        if (Number(selectedVariant.stock) > 0 && Number(selectedVariant.stock) < qty) {
          showAlert('Quantidade indisponível em estoque');
          return;
        }

        jQuery.ajax({
          method: 'POST',
          url: '/web_api/cart/',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify({
            Cart: {
              session_id: dataSession,
              product_id: productId,
              variant_id: selectedVariant.id,
              quantity: qty
            }
          })
        })
        .done(function () {
          if (typeof cart !== 'undefined') {
            cart.listProduct();
            cart.showCart();
          }
        })
        .fail(function (jqXHR) {
          console.log(jqXHR.responseText);
          showAlert('Não foi possível adicionar ao carrinho');
        });
      });

      // botão "Comprar" dispara submit do form
      btnAdd.addEventListener('click', function (e) {
        e.preventDefault();
        form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true }));
      });

      // ===== Estado inicial =====
      const firstMain = Array.from(mainSelect.options).find(opt => opt.value && opt.value !== 'Selecione');
      if (firstMain) {
        mainSelect.value = firstMain.value;
        selectedMain = normalizeStr(firstMain.value);
        filterColors(true);
      }

      // garante qty inicial correta
      setQty(getQty());
    });

  });
}