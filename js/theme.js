// Troca background da section-brand no mobile
{
  document.addEventListener("DOMContentLoaded", function () {
    var section = document.querySelector(".s-section-brands[data-bg-mobile]");
    if (!section) return;
    function setBg() {
      var mobile = section.getAttribute("data-bg-mobile");
      var desktop = section.getAttribute("data-bg-desktop");
      if (window.innerWidth <= 998 && mobile) {
        section.style.backgroundImage = "url(" + mobile + ")";
      } else if (desktop) {
        section.style.backgroundImage = "url(" + desktop + ")";
      }
    }
    setBg();
    window.addEventListener("resize", setBg);
  });
}

// Troca banner responsivo (section-highlight, etc.)
{
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".js-responsive-banner").forEach(function (img) {
      var desktop = img.getAttribute("data-desktop");
      var mobile = img.getAttribute("data-mobile");
      if (!mobile) return;
      function swap() {
        img.src = window.innerWidth <= 998 ? mobile : desktop;
      }
      swap();
      window.addEventListener("resize", swap);
    });
  });
}

{
  document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".s-fullbanner");
    if (!section) return;

    function setSectionHeight() {
      requestAnimationFrame(function () {
        const height = section.offsetHeight;
        if (height > 0) {
          document.documentElement.style.setProperty(
            "--hero-height",
            `${height}px`,
          );
        }
      });
    }

    setSectionHeight();

    // Recalcula quando a imagem do banner carregar
    const bannerImg = section.querySelector("img");
    if (bannerImg) {
      if (bannerImg.complete) {
        setSectionHeight();
      } else {
        bannerImg.addEventListener("load", setSectionHeight);
      }
    }

    // Recalcula em resize
    window.addEventListener("resize", setSectionHeight);
  });
}

// Header: gradiente -> roxo no scroll (home) / sólido em todas as outras páginas
{
  document.addEventListener("DOMContentLoaded", function () {
    const html = document.documentElement;
    const header = document.querySelector("header:not(.header-mobile)");
    if (!header) return;

    if (html.classList.contains("page-home")) {
      // Home: toggle no scroll
      function onScroll() {
        if (window.scrollY > 80) {
          header.classList.add("header-solid");
        } else {
          header.classList.remove("header-solid");
        }
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    } else {
      // Todas as outras páginas: header sempre sólido roxo
      header.classList.add("header-solid");
    }
  });
}

// Dropdown "Selecione por aparelho" 
{
  document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown-aparelho");
    if (!dropdown) return;

    const toggle = dropdown.querySelector(".dropdown-aparelho-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });

    document.addEventListener("click", function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });

    // Expand/collapse subcategorias no dropdown desktop
    dropdown.querySelectorAll(".dropdown-aparelho-item.has-children").forEach(function (item) {
      var link = item.querySelector(".dropdown-aparelho-link");
      if (!link) return;
      link.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        item.classList.toggle("expanded");
      });
    });
  });
}

// Expand/collapse subcategorias no menu mobile
{
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".sub-new-mobile li.has-children").forEach(function (li) {
      var subLink = li.querySelector(".mobile-sub-link");
      if (!subLink) return;
      // Ao clicar em qualquer lugar da linha (link ou arrow), expande/recolhe
      subLink.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle("expanded");
      });
    });
  });
}

// Ordena subcategorias por ordem alfabética
{
  function sortList(ul) {
    if (!ul) return;
    var items = Array.from(ul.children);
    items.sort(function (a, b) {
      var textA = (a.textContent || "").trim().toLowerCase();
      var textB = (b.textContent || "").trim().toLowerCase();
      return textA.localeCompare(textB, "pt-BR");
    });
    var frag = document.createDocumentFragment();
    items.forEach(function (item) {
      frag.appendChild(item);
    });
    ul.appendChild(frag);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Desktop: ordena primeiro nível e sublistas
    var desktopList = document.querySelector(".dropdown-aparelho-list");
    sortList(desktopList);
    document.querySelectorAll(".dropdown-aparelho-sublist").forEach(sortList);

    // Mobile: ordena itens dentro do "Selecione por aparelho"
    document.querySelectorAll(".sub-new-mobile").forEach(function (ul) {
      var title = ul.querySelector(".title span");
      if (title && title.textContent.trim() === "Selecione por aparelho") {
        var lis = Array.from(ul.querySelectorAll(":scope > li"));
        lis.sort(function (a, b) {
          var textA = (a.querySelector("a") || a).textContent.trim().toLowerCase();
          var textB = (b.querySelector("a") || b).textContent.trim().toLowerCase();
          return textA.localeCompare(textB, "pt-BR");
        });
        var lisFrag = document.createDocumentFragment();
        lis.forEach(function (li) {
          lisFrag.appendChild(li);
        });
        ul.appendChild(lisFrag);
        // Ordena sub-children
        ul.querySelectorAll(".sub-children").forEach(sortList);
      }
    });
  });
}

{
  document.addEventListener("DOMContentLoaded", function () {
    const modalSearch = document.querySelector(".modal-search");
    if (!modalSearch) return;

    const modalContainer = modalSearch.querySelector(".container");
    if (!modalContainer) return;

    // ✅ agora pega TODOS os botões que abrem a busca
    const searchIcons = document.querySelectorAll(".search-icon");
    if (!searchIcons.length) return;

    // ✅ Abrir modal (e impedir que o clique "vaze" pro overlay)
    searchIcons.forEach((icon) => {
      icon.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation(); // 🔥 impede fechar na mesma hora
        modalSearch.classList.add("active");
      });
    });

    // ✅ Fechar clicando fora do container (overlay)
    modalSearch.addEventListener("click", function () {
      modalSearch.classList.remove("active");
    });

    // ✅ Impede fechar clicando dentro do container
    modalContainer.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });
}

//Script Carrinho Lateral
{
  function toReal(value, str_cifrao) {
    return (
      str_cifrao +
      " " +
      value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function toBRL(value) {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
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
      var badge = jQuery("span[data-cart=amount]");
      if (!badge.length) return;

      var total = Number(qnt) || 0;

      badge.text(total);
      badge.attr("data-amount", String(total));

      if (total > 0) badge.addClass("is-visible");
      else badge.removeClass("is-visible");
    },

    /* ===============================
       FRETE GRÁTIS (progress)
    =============================== */
    getFreeShippingThreshold: function () {
      var box = document.querySelector(".cart-sidebar .free-shipping");
      if (!box) return 0;

      var raw = box.getAttribute("data-free-shipping") || "0";

      raw = raw
        .toString()
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

      var v = parseFloat(raw);
      return Number.isFinite(v) ? v : 0;
    },

    updateFreeShipping: function (cartTotal) {
      var box = document.querySelector(".cart-sidebar .free-shipping");
      if (!box) return;

      var threshold = cart.getFreeShippingThreshold();

      if (!threshold || threshold <= 0) {
        box.style.display = "none";
        return;
      }

      box.style.display = "block";

      var textEl = box.querySelector(".free-shipping__text");
      var fillEl = box.querySelector(".free-shipping__bar-fill");

      var total = Number(cartTotal) || 0;
      if (total < 0) total = 0;

      if (total >= threshold) {
        if (textEl) {
          textEl.innerHTML =
            "<strong>Voc&ecirc; ganhou Frete Gr&aacute;tis</strong>!";
        }
        if (fillEl) fillEl.style.width = "100%";
        return;
      }

      var remaining = threshold - total;
      var percent = Math.max(0, Math.min(100, (total / threshold) * 100));

      if (textEl) {
        textEl.innerHTML =
          "Adicione mais <strong>" +
          toBRL(remaining) +
          "</strong> e ganhe <strong>Frete Gr&aacute;tis</strong>";
      }

      if (fillEl) fillEl.style.width = percent.toFixed(2) + "%";
    },

    /* ===============================
       REMOVE (mantém seu padrão)
    =============================== */
    removeProduct: function (element) {
      var id = parseInt(jQuery(element).attr("data-id"));
      var variant = "/" + jQuery(element).attr("data-variant");
      var together =
        jQuery(element).attr("data-together") !== ""
          ? "/" + jQuery(element).attr("data-together")
          : "";
      var addText =
        jQuery(element).attr("data-add") == ""
          ? ""
          : jQuery(element).attr("data-add");

      jQuery
        .ajax({
          method: "DELETE",
          url:
            "/web_api/carts/" +
            cart.session() +
            "/" +
            id +
            variant +
            together +
            "?" +
            jQuery.param({ additional_information: addText }),
        })
        .always(function () {
          cart.listProduct();
        });
    },

    /* ===============================
       UPDATE QTY ( + / - )
       ✅ Estratégia: DELETE + POST (quantidade final)
    =============================== */
    updateItemQty: function (btn, delta) {
      var $btn = jQuery(btn);

      var productId = parseInt($btn.attr("data-id"), 10);
      var variantId = parseInt($btn.attr("data-variant"), 10) || 0;
      var togetherId = $btn.attr("data-together") || "";
      var addText = $btn.attr("data-add") || "";

      var currentQty = parseInt($btn.attr("data-qty"), 10) || 1;
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
        delUrl += "?" + jQuery.param({ additional_information: addText });
      }

      jQuery
        .ajax({
          method: "DELETE",
          url: delUrl,
        })
        .always(function () {
          // 2) POST com quantidade FINAL (recria item)
          jQuery
            .ajax({
              method: "POST",
              url: "/web_api/cart/",
              contentType: "application/json; charset=utf-8",
              data: JSON.stringify({
                Cart: {
                  session_id: cart.session(),
                  product_id: productId,
                  variant_id: variantId,
                  quantity: newQty,
                },
              }),
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
          if (Array.isArray(response) && response.length)
            cart.forProduct(response);
          else cart.forProduct([]);
        },
        error: function () {
          cart.forProduct([]);
        },
      });
    },

    /* ===============================
       TOTAL
    =============================== */
    total: function (price) {
      jQuery(".cart-sidebar .total .value").text(
        toReal(parseFloat(price || 0), "R$"),
      );
    },

    /* ===============================
       RENDER PRODUCTS
    =============================== */
    forProduct: function (listProducts) {
      var listDom = jQuery(".cart-sidebar .content-cart .list");
      listDom.find("*").remove();
      listDom.parent().removeClass("empty");

      var qnt = 0;
      var total = 0.0;

      if (listProducts.length) {
        listProducts.forEach(function (product) {
          product = product.Cart;

          var addMsg = product.additional_information || "";
          var productImage = "";

          if (product.product_image) {
            if (product.product_image.https) {
              productImage = product.product_image.https;
            } else if (product.product_image.thumbs) {
              var thumbs = product.product_image.thumbs;
              var preferredSizes = [
                600, 450, 300, 250, 200, 180, 150, 120, 100, 90,
              ];

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

          listDom.append(
            cart.templateProduct(
              product.product_id,
              product.variant_id,
              product.product_name,
              productImage,
              product.quantity,
              product.price,
              product.product_url.https,
              addMsg,
              product.bought_together_id,
            ),
          );

          qnt += parseInt(product.quantity, 10);
          total += parseFloat(product.price) * parseInt(product.quantity, 10);
        });

        cart.total(total);
        cart.updateBadge(qnt);
        cart.updateFreeShipping(total);
      } else {
        listDom.append(
          '<div class="error"><div clas="text">Carrinho Vazio</div></div>',
        );
        listDom.parent().addClass("empty");

        cart.updateBadge(0);
        cart.total(0);
        cart.updateFreeShipping(0);
      }
    },

    /* ===============================
       OPEN/CLOSE
    =============================== */
    startCart: function () {
      jQuery(".cart-toggle").on("click", function (e) {
        e.preventDefault();
        cart.showCart();
      });

      jQuery(".shadow-cart, .cart-sidebar .box-prev").on("click", function () {
        jQuery(".cart-sidebar").removeClass("active");
        jQuery(".shadow-cart").removeClass("active");
      });

      // ✅ Delegação: +/- funciona mesmo após re-render
      jQuery(document).on("click", ".cart-sidebar .qty-btn", function (e) {
        e.preventDefault();
        var delta = parseInt(jQuery(this).attr("data-delta"), 10) || 0;
        cart.updateItemQty(this, delta);
      });
    },

    showCart: function () {
      cart.listProduct();
      jQuery(".cart-sidebar").addClass("active");
      jQuery(".shadow-cart").addClass("active");

      // Init related products carousel
      if (!cart._relatedInited) {
        var source = document.getElementById('cart-related-source');
        var wrapper = document.querySelector('.cart-related-carousel .swiper-wrapper');
        if (source && wrapper) {
          var slides = source.querySelectorAll('.cart-related-item');
          if (slides.length) {
            slides.forEach(function (slide) {
              var clone = slide.cloneNode(true);
              var imgs = clone.querySelectorAll('img[data-src]');
              imgs.forEach(function (img) {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
              });
              wrapper.appendChild(clone);
            });
            setTimeout(function () {
              new Swiper('.cart-related-carousel', {
                slidesPerView: 1.2,
                spaceBetween: 12,
              });
            }, 100);
          }
        }
        cart._relatedInited = true;
      }
    },

    /* ===============================
       TEMPLATE
    =============================== */
    templateProduct: function (
      id,
      variant,
      name,
      image,
      qnt,
      price,
      url,
      addMsg,
      together,
    ) {
      var template =
        '\
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

      price = toReal(parseFloat(price), "R$");

      template = template.replace(/{url}/g, url);
      template = template.replace(/{image}/g, image);
      template = template.replace(/{name}/g, name);
      template = template.replace(/{id}/g, id);
      template = template.replace(/{variant}/g, variant || 0);
      template = template.replace(/{length}/g, qnt);
      template = template.replace(/{addMsg}/g, addMsg || "");
      template = template.replace(/{price}/g, price);
      template = template.replace(/{together}/g, together || "");

      return template;
    },
  };

  jQuery(function () {
    cart.startCart();
    cart.listProduct();

    // Cart related: color variant selection
    jQuery(document).on('click', '.cart-related-item .circle', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var item = jQuery(this).closest('.cart-related-item');
      item.find('.circle').removeClass('active');
      jQuery(this).addClass('active');
      item.attr('data-variant-id', jQuery(this).attr('data-variant-id'));
    });

    // Cart related: add to cart
    jQuery(document).on('click', '.cart-related-add', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var item = jQuery(this).closest('.cart-related-item');
      var productId = item.attr('data-product-id');
      var hasVariation = item.attr('data-has-variation');
      var variantId = item.attr('data-variant-id');
      var dataSession = jQuery('html').attr('data-session');

      if (hasVariation && !variantId) {
        alert('Selecione uma cor.');
        return;
      }

      var cartData = {
        Cart: {
          session_id: dataSession,
          product_id: productId,
          quantity: 1
        }
      };
      if (variantId) {
        cartData.Cart.variant_id = variantId;
      }

      jQuery.ajax({
        method: 'POST',
        url: '/web_api/cart/',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(cartData),
        success: function () {
          cart.showCart();
        },
        error: function (jqXHR) {
          console.log(jqXHR.responseText);
        }
      });
    });
  });
}

//Script para mudar foto do produto na vitrine
{
  document.addEventListener("click", function (e) {
    const button = e.target.closest(".js-variant-color");
    if (!button) return;

    const newImage = button.dataset.image;
    const variantId = button.dataset.variantId;

    const productCard = button.closest(".product-slide");
    if (!productCard) return;

    // ✅ GUARDA A VARIANTE SELECIONADA NO CARD
    productCard.dataset.variantId = variantId;

    const imgProduct = productCard.querySelector(".img-product");
    if (newImage && imgProduct) {
      imgProduct.src = newImage;
    }

    // estado ativo
    productCard.querySelectorAll(".js-variant-color").forEach((el) => {
      el.classList.remove("active");
    });
    button.classList.add("active");
  });

  // Auto-seleciona a primeira variação de cor em cada card
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".product-slide").forEach(function (card) {
      const firstColor = card.querySelector(".js-variant-color");
      if (!firstColor) return;

      firstColor.classList.add("active");
      if (firstColor.dataset.variantId) {
        card.dataset.variantId = firstColor.dataset.variantId;
      }
    });
  });
}

//Script Variacoes - Marca e Cor
{
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".list-variants").forEach((form) => {
      let variantsRaw = form.getAttribute("data-variants") || "[]";
      variantsRaw = variantsRaw.replace(/&quot;/g, '"');
      const variants = JSON.parse(variantsRaw);

      const mainSelect = form.querySelector(".first.option-select");
      const colorItems = Array.from(form.querySelectorAll(".option-color li"));

      if (!colorItems.length) return;

      let selectedMain = null;
      let selectedColor = null;

      /* ===============================
               ATUALIZA CORES
            =============================== */
      function updateColors(autoSelectFirst = true) {
        selectedColor = null;

        const allowedColors = variants
          .filter((v) => {
            if (mainSelect && selectedMain !== null) {
              return v.main === selectedMain && Number(v.stock) > 0;
            }
            return Number(v.stock) > 0;
          })
          .map((v) => v.color);

        let firstValidColor = null;

        colorItems.forEach((li) => {
          li.classList.remove("active");

          if (allowedColors.includes(li.dataset.value)) {
            li.style.display = "flex";

            if (!firstValidColor) {
              firstValidColor = li;
            }
          } else {
            li.style.display = "none";
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
        colorItems.forEach((i) => i.classList.remove("active"));
        li.classList.add("active");

        selectedColor = li.dataset.value;

        const variant = variants.find(
          (v) => {
            const matchMain = mainSelect ? v.main === selectedMain : true;
            return matchMain &&
              v.color === selectedColor &&
              Number(v.stock) > 0;
          }
        );

        if (!variant) return;

        // TROCA IMAGENS DO SWIPER (todas da variante)
        updateHighlightImage(variant);
      }

      function updateHighlightImage(variant) {
        var images = variant.images;
        if (!images || !images.length) {
          images = variant.imageProduct ? [{ large: variant.imageProduct }] : [];
        }
        if (!images.length) return;

        var mainWrapper = document.querySelector(
          ".mid-product .swipermain",
        );
        var thumbWrapper = document.querySelector(
          ".mid-product .thumbs .swiper-wrapper",
        );

        if (!mainWrapper || !thumbWrapper) return;

        // Reconstrói slides principais
        mainWrapper.innerHTML = images
          .map(function (img) {
            var src = img.large || img.https || img.full || "";
            return (
              '<div class="swiper-slide">' +
              '<img class="img-product" src="' + src + '" alt="' + (variant.color || '') + '" />' +
              "</div>"
            );
          })
          .join("");

        // Reconstrói thumbs
        thumbWrapper.innerHTML = images
          .map(function (img) {
            var src = img.large || img.https || img.full || "";
            return (
              '<div class="swiper-slide">' +
              '<img class="img-product" src="' + src + '" alt="' + (variant.color || '') + '" />' +
              "</div>"
            );
          })
          .join("");

        // Atualiza os swipers
        if (typeof swiperMain !== "undefined") {
          swiperMain.update();
          swiperMain.slideTo(0, 0);
        }

        if (typeof swiperThumbs !== "undefined") {
          swiperThumbs.update();
          swiperThumbs.slideTo(0, 0);
        }
      }

      /* ===============================
               CHANGE MARCA
            =============================== */
      if (mainSelect) {
        mainSelect.addEventListener("change", function () {
          selectedMain = this.value;
          if (!selectedMain) return;
          updateColors(true);
        });
      }

      /* ===============================
               CLICK COR
            =============================== */
      colorItems.forEach((li) => {
        li.addEventListener("click", function () {
          if (mainSelect && !selectedMain) return;
          selectColor(this);
        });
      });

      /* ===============================
               ESTADO INICIAL
            =============================== */
      if (mainSelect) {
        const firstValidOption = Array.from(mainSelect.options).find(
          (opt) => opt.value && opt.value !== "Selecione",
        );

        if (firstValidOption) {
          mainSelect.value = firstValidOption.value;
          selectedMain = firstValidOption.value;
          updateColors(true);
        }
      } else {
        updateColors(true);
      }
    });
  });
}

//Add Cart
{
  function addCart(dataProductId) {
    var dataSession = $("html").attr("data-session");

    $.ajax({
      method: "POST",
      url: "/web_api/cart/",
      contentType: "application/json; charset=utf-8",
      data:
        '{"Cart":{"session_id":"' +
        dataSession +
        '","product_id":"' +
        dataProductId +
        '","quantity":"1"}}',
    })
      .done(function (response) {
        console.log(response);

        var qtdCart = parseInt($("span[data-cart=amount]").html());
        $("span[data-cart=amount]").html(qtdCart + 1);

        // ✅ ABRE CARRINHO LATERAL
        if (typeof cart !== "undefined") {
          cart.showCart();
        }
      })
      .fail(function (jqXHR) {
        console.log(jqXHR.responseText);
      });
  }
}

//Add Cart - Produto COM VARIAÇÃO (usa variant_id selecionado)
{
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".js-add-cart-variant");
    if (!btn) return;

    const productCard = btn.closest(".product-slide");
    if (!productCard) return;

    const productId = btn.dataset.productId;
    const variantId = productCard.dataset.variantId; // ✅ vem do clique na cor

    if (!variantId) {
      alert("Selecione uma cor para comprar.");
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
          quantity: 1,
        },
      }),
    })
      .done(function (response) {
        console.log(response);

        // atualiza badge
        var qtdCart = parseInt($("span[data-cart=amount]").html());
        $("span[data-cart=amount]").html(qtdCart + 1);

        // ✅ abre carrinho lateral
        if (typeof cart !== "undefined") {
          cart.showCart();
        }
      })
      .fail(function (jqXHR) {
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
  document.addEventListener("DOMContentLoaded", function () {
    // Só roda onde existir o form de variantes do destaque
    document
      .querySelectorAll(".s-section-highlight .list-variants")
      .forEach((form) => {
        // ===== Helpers =====
        function parseVariants(raw) {
          if (!raw) return [];
          raw = raw.replace(/&quot;/g, '"'); // Tray pode vir com &quot;
          try {
            return JSON.parse(raw);
          } catch (e) {
            return [];
          }
        }

        function normalizeStr(v) {
          return (v ?? "").toString().trim();
        }

        // ===== Elements =====
        const productId = form.getAttribute("data-id");
        const variants = parseVariants(
          form.getAttribute("data-variants") || "[]",
        );

        const mainSelect = form.querySelector(".first.option-select");
        const colorItems = Array.from(
          form.querySelectorAll(".option-color li"),
        );
        const qtyInput = form.querySelector('input[name="qty"]');
        const btnAdd = form.querySelector(".add-to-cart");

        const btnMinus = form.querySelector(
          '[data-app="product.qty"][data-action="minus"]',
        );
        const btnPlus = form.querySelector(
          '[data-app="product.qty"][data-action="plus"]',
        );

        const alertBox = form.querySelector(".alert-dont-stock");

        if (
          !productId ||
          (!mainSelect && !colorItems.length) ||
          !btnAdd ||
          !qtyInput
        )
          return;

        let selectedMain = "";
        let selectedColor = "";
        let selectedVariant = null;

        // ===== UI helpers =====
        function showAlert(msg) {
          if (!alertBox) return;
          alertBox.style.display = "block";
          const p = alertBox.querySelector("p");
          if (p) p.textContent = msg || "Variação indisponível";
        }

        function hideAlert() {
          if (!alertBox) return;
          alertBox.style.display = "none";
        }

        function getQty() {
          const v = parseInt(qtyInput.value || "1", 10);
          return Number.isFinite(v) && v > 0 ? v : 1;
        }

        function setQty(next) {
          let value = parseInt(next || 1, 10);
          if (!Number.isFinite(value) || value < 1) value = 1;

          // max padrão
          let max = parseInt(qtyInput.getAttribute("max") || "99", 10);
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
          main = normalizeStr(main);
          color = normalizeStr(color);

          return (
            variants.find(
              (v) => {
                const matchMain = mainSelect ? normalizeStr(v.main) === main : true;
                return matchMain &&
                  normalizeStr(v.color) === color &&
                  Number(v.stock) > 0;
              }
            ) || null
          );
        }

        function allowedColorsForMain(main) {
          main = normalizeStr(main);
          const colors = variants
            .filter((v) => {
              const matchMain = mainSelect ? normalizeStr(v.main) === main : true;
              return matchMain && Number(v.stock) > 0;
            })
            .map((v) => normalizeStr(v.color));
          return Array.from(new Set(colors));
        }

        function setActiveColor(li) {
          colorItems.forEach((x) => x.classList.remove("active"));
          if (li) li.classList.add("active");
        }

        function filterColors(autoSelectFirst = true) {
          selectedColor = "";
          selectedVariant = null;
          hideAlert();

          const allowed = allowedColorsForMain(selectedMain);
          let firstVisible = null;

          colorItems.forEach((li) => {
            const value = normalizeStr(li.dataset.value);

            if (allowed.includes(value)) {
              li.style.display = "flex";
              li.classList.remove("disabled");
              if (!firstVisible) firstVisible = li;
            } else {
              li.style.display = "none";
              li.classList.remove("active");
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
            showAlert("Variação indisponível");
            return;
          }

          hideAlert();

          // ajusta max pelo estoque da variante selecionada
          const stock = Number(selectedVariant.stock);
          if (Number.isFinite(stock) && stock > 0) {
            qtyInput.setAttribute("max", String(Math.min(99, stock)));
          } else {
            qtyInput.setAttribute("max", "99");
          }

          // garante qty válida após trocar variante (ex: estava 5 e agora estoque 2)
          setQty(getQty());

          // troca imagens do swiper do destaque (todas da variante)
          updateHighlightImage(selectedVariant);
        }

        // ===== Swiper image updater — reconstrói slides com TODAS as imagens da variante =====
        function updateHighlightImage(variant) {
          var images = variant.images;
          if (!images || !images.length) {
            // fallback: se não tiver array de imagens, usa imageProduct como antes
            images = variant.imageProduct ? [{ large: variant.imageProduct }] : [];
          }
          if (!images.length) return;

          var mainWrapper = document.querySelector(
            ".s-section-highlight .swipermain",
          );
          var thumbWrapper = document.querySelector(
            ".s-section-highlight .thumbs .swiper-wrapper",
          );

          if (!mainWrapper || !thumbWrapper) return;

          // Reconstrói slides principais
          mainWrapper.innerHTML = images
            .map(function (img) {
              var src = img.large || img.https || img.full || "";
              return (
                '<div class="swiper-slide">' +
                '<img class="img-product" src="' + src + '" alt="' + (variant.color || '') + '" />' +
                "</div>"
              );
            })
            .join("");

          // Reconstrói thumbs
          thumbWrapper.innerHTML = images
            .map(function (img) {
              var src = img.large || img.https || img.full || "";
              return (
                '<div class="swiper-slide">' +
                '<img class="img-product" src="' + src + '" alt="' + (variant.color || '') + '" />' +
                "</div>"
              );
            })
            .join("");

          // Atualiza os swipers
          if (typeof swiperMain !== "undefined") {
            swiperMain.update();
            swiperMain.slideTo(0, 0);
          }

          if (typeof swiperThumbs !== "undefined") {
            swiperThumbs.update();
            swiperThumbs.slideTo(0, 0);
          }
        }

        // ===== Qty (+/-) =====
        function handlePlusMinus(delta) {
          hideAlert();

          // se ainda não tem variante selecionada, força seleção (primeira cor válida já é auto)
          if (!selectedVariant) {
            showAlert("Selecione uma cor.");
            return;
          }

          const current = getQty();
          setQty(current + delta);
        }

        if (btnMinus) {
          btnMinus.addEventListener("click", function () {
            handlePlusMinus(-1);
          });
        }

        if (btnPlus) {
          btnPlus.addEventListener("click", function () {
            handlePlusMinus(+1);
          });
        }

        // se digitar manualmente no input
        qtyInput.addEventListener("input", function () {
          setQty(getQty());
        });

        // ===== Events =====
        // main change
        if (mainSelect) {
          mainSelect.addEventListener("change", function () {
            selectedMain = normalizeStr(this.value);
            if (!selectedMain) return;
            filterColors(true);
          });
        }

        // color click
        colorItems.forEach((li) => {
          li.addEventListener("click", function () {
            if (mainSelect && !selectedMain) return;
            selectColor(this);
          });
        });

        // submit add to cart
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          hideAlert();

          if (mainSelect && !selectedMain) {
            showAlert("Selecione uma opção.");
            return;
          }

          if (!selectedVariant) {
            showAlert("Selecione uma cor.");
            return;
          }

          const qty = getQty();
          const dataSession = jQuery("html").attr("data-session");

          // valida estoque (quando não é without_stock_sale)
          if (
            Number(selectedVariant.stock) > 0 &&
            Number(selectedVariant.stock) < qty
          ) {
            showAlert("Quantidade indisponível em estoque");
            return;
          }

          jQuery
            .ajax({
              method: "POST",
              url: "/web_api/cart/",
              contentType: "application/json; charset=utf-8",
              data: JSON.stringify({
                Cart: {
                  session_id: dataSession,
                  product_id: productId,
                  variant_id: selectedVariant.id,
                  quantity: qty,
                },
              }),
            })
            .done(function () {
              if (typeof cart !== "undefined") {
                cart.listProduct();
                cart.showCart();
              }
            })
            .fail(function (jqXHR) {
              console.log(jqXHR.responseText);
              showAlert("Não foi possível adicionar ao carrinho");
            });
        });

        // botão "Comprar" dispara submit do form
        btnAdd.addEventListener("click", function (e) {
          e.preventDefault();
          form.requestSubmit
            ? form.requestSubmit()
            : form.dispatchEvent(new Event("submit", { cancelable: true }));
        });

        // ===== Estado inicial =====
        if (mainSelect) {
          const firstMain = Array.from(mainSelect.options).find(
            (opt) => opt.value && opt.value !== "Selecione",
          );
          if (firstMain) {
            mainSelect.value = firstMain.value;
            selectedMain = normalizeStr(firstMain.value);
            filterColors(true);
          }
        } else {
          filterColors(true);
        }

        // garante qty inicial correta
        setQty(getQty());
      });
  });
}

{
  document.addEventListener("DOMContentLoaded", () => {
    const ul = document.querySelector("#opcoes0.lista_radios");
    if (!ul) return;

    const radios = Array.from(ul.querySelectorAll('input[type="radio"][name]'));
    if (!radios.length) return;

    // Evita rodar 2x
    if (ul.dataset.selectBuilt === "1") return;
    ul.dataset.selectBuilt = "1";

    const name = radios[0].name;

    // Cria select
    const select = document.createElement("select");
    select.className = "js-variant-select";
    select.setAttribute("aria-label", "Selecionar variação");

    // Monta options
    radios.forEach((radio) => {
      const label = radio.closest("label");
      const text = (
        label?.querySelector("span")?.textContent ||
        radio.value ||
        ""
      ).trim();

      const opt = document.createElement("option");
      opt.value = radio.value; // mantém o value do radio
      opt.textContent = text;

      if (radio.checked) opt.selected = true;
      select.appendChild(opt);
    });

    // Quando mudar o select -> marca o radio correspondente e dispara change
    select.addEventListener("change", () => {
      const target = ul.querySelector(
        `input[type="radio"][name="${CSS.escape(name)}"][value="${CSS.escape(select.value)}"]`,
      );
      if (target) {
        target.checked = true;
        target.dispatchEvent(new Event("change", { bubbles: true }));
        target.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    // Se o radio mudar por outro motivo -> atualiza o select
    ul.addEventListener("change", (e) => {
      const t = e.target;
      if (t && t.matches(`input[type="radio"][name="${CSS.escape(name)}"]`)) {
        select.value = t.value;
      }
    });

    // Insere antes da UL e esconde a UL
    ul.parentElement.insertBefore(select, ul);
    ul.style.display = "none";
  });
}

{
  (function ($) {
    if (!window.theme || !$("html").hasClass("page-product")) return;

    // =========================
    // HELPERS
    // =========================
    function fadeSwap(img, url) {
      if (!img || !url) return;

      img.style.transition = "opacity .12s ease";
      img.style.opacity = "0";

      setTimeout(function () {
        // PDP usa lazy (data-src). Atualiza ambos:
        img.setAttribute("src", url);
        img.setAttribute("data-src", url);

        // evita depender do lazy depois da troca
        img.classList.remove("swiper-lazy");
        img.classList.remove("lazyload");

        img.style.opacity = "1";
      }, 120);
    }

    function pickThumb90(item) {
      // item vem do /web_api/variants/{id} => VariantImage
      // geralmente tem thumbs[90].https
      if (item && item.thumbs && item.thumbs[90] && item.thumbs[90].https)
        return item.thumbs[90].https;
      if (item && item.thumbs) {
        // fallback: pega qualquer thumb
        var keys = Object.keys(item.thumbs);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          if (item.thumbs[k] && item.thumbs[k].https)
            return item.thumbs[k].https;
        }
      }
      return item && item.https ? item.https : "";
    }

    // =========================
    // 1) OVERRIDE: init da galeria usando seu HTML real
    // =========================
    theme.gallerySlidesOnProductPage = function () {
      var targetGallery = ".js-gallery-main";
      var targetThumbs = ".js-gallery-thumbs";

      // destroi se existir (agora com params seguros)
      try {
        if (
          theme.settings.productThumbs &&
          typeof theme.settings.productThumbs.destroy === "function"
        ) {
          theme.settings.productThumbs.destroy(true, true);
        }
      } catch (e) { }

      try {
        if (
          theme.settings.productGallery &&
          typeof theme.settings.productGallery.destroy === "function"
        ) {
          theme.settings.productGallery.destroy(true, true);
        }
      } catch (e) { }

      theme.settings.productThumbs = new Swiper(targetThumbs, {
        spaceBetween: 10,
        lazy: { loadPrevNext: true },
        breakpoints: {
          0: { slidesPerView: 2 },
          350: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        },
        freeMode: true,
        watchSlidesProgress: true,
      });

      theme.settings.productGallery = new Swiper(targetGallery, {
        spaceBetween: 10,
        lazy: { loadPrevNext: true },
        navigation: {
          prevEl: ".js-gallery-thumbs-prev",
          nextEl: ".js-gallery-thumbs-next",
        },
        thumbs: {
          swiper: theme.settings.productThumbs,
        },
      });
    };

    // =========================
    // 2) NOVO: só troca as imagens (sem recriar slides)
    // =========================
    theme.swapGalleryImages = function (variantImages) {
      var mainWrapper = document.querySelector(
        ".js-gallery-main .swiper-wrapper",
      );
      var thumbsWrapper = document.querySelector(
        ".js-gallery-thumbs .swiper-wrapper",
      );
      if (!mainWrapper || !thumbsWrapper) return;

      var mainImgs = Array.from(mainWrapper.querySelectorAll("img"));
      var thumbsImgs = Array.from(thumbsWrapper.querySelectorAll("img"));

      if (!Array.isArray(variantImages) || !variantImages.length) return;

      // troca até o limite existente (não recria slide)
      var max = Math.min(mainImgs.length, variantImages.length);

      for (var i = 0; i < max; i++) {
        var full = variantImages[i].https || "";
        var th90 = pickThumb90(variantImages[i]) || full;

        if (full) fadeSwap(mainImgs[i], full);
        if (th90) fadeSwap(thumbsImgs[i], th90);
      }

      // se veio menos imagens na variação, mantém o restante como está (não apaga)
      // update + volta pro início
      if (
        theme.settings.productThumbs &&
        typeof theme.settings.productThumbs.update === "function"
      ) {
        theme.settings.productThumbs.update();
        theme.settings.productThumbs.slideTo(0, 0);
      }
      if (
        theme.settings.productGallery &&
        typeof theme.settings.productGallery.update === "function"
      ) {
        theme.settings.productGallery.update();
        theme.settings.productGallery.slideTo(0, 0);
      }
    };

    // =========================
    // 3) OVERRIDE: carrega imagens da variação e chama swapGalleryImages
    // =========================
    theme.loadProductVariantImage = function (id) {
      $.ajax({
        url: "/web_api/variants/" + id,
        method: "get",
        success: function (response) {
          var newVariationImages =
            response && response.Variant && response.Variant.VariantImage
              ? response.Variant.VariantImage
              : [];

          if (newVariationImages.length) {
            theme.swapGalleryImages(newVariationImages);
          }
        },
        error: function (request, status, error) {
          console.log("[Theme] Erro ao buscar imagens da variação:", error);
        },
      });
    };

    // =========================
    // 4) OVERRIDE: listeners de variação (remove antigos e aplica novos)
    // =========================
    theme.initProductVariationImageChange = function () {
      var productVariationBox = $(".pageProduct-variants");

      // remove handlers antigos do tema (evita duplicar)
      productVariationBox.off("click", ".lista_cor_variacao li[data-id]");
      productVariationBox.off("click", ".lista-radios-input");
      productVariationBox.off("change", "select");

      // cor (li[data-id])
      productVariationBox.on(
        "click",
        ".lista_cor_variacao li[data-id]",
        function () {
          var id = $(this).data("id");
          if (id) theme.loadProductVariantImage(id);
        },
      );

      // radios
      productVariationBox.on("click", ".lista-radios-input", function () {
        var v = $(this).find("input").val();
        if (v) theme.loadProductVariantImage(v);
      });

      // selects
      productVariationBox.on("change", "select", function () {
        var v = $(this).val();
        if (v) theme.loadProductVariantImage(v);
      });
    };

    // =========================
    // 5) REAPLICA NA PDP
    // =========================
    // reinicia swipers com seus seletores
    theme.gallerySlidesOnProductPage();

    // reaplica listeners de variação (sem recriar galeria)
    theme.initProductVariationImageChange();
  })(jQuery);
}

{
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".sub-new-mobile").forEach(function (ul) {
      const title = ul.querySelector(".title");

      if (!title) return;

      title.addEventListener("click", function () {
        ul.classList.toggle("open");
      });
    });
  });
}

{
  function initHamburgerMenu() {
    const btn = document.getElementById("btn-hamburger");
    const menu = document.querySelector(".header-mobile");

    if (!btn || !menu) return;

    // evita múltiplos listeners
    if (btn.dataset.init) return;
    btn.dataset.init = "true";

    btn.addEventListener("click", function () {
      btn.classList.toggle("active");
      menu.classList.toggle("open2");

      const expanded = btn.classList.contains("active");
      btn.setAttribute("aria-expanded", expanded);

      // Muda background do header quando menu abre
      var header = btn.closest("header");
      if (header) {
        header.classList.toggle("menu-open", expanded);
      }
    });
  }

  // DOM normal
  document.addEventListener("DOMContentLoaded", initHamburgerMenu);

  // AJAX da Tray (quando a página troca sem reload)
  $(document).ajaxSuccess(function () {
    initHamburgerMenu();
  });
}

{
  function initFilterToggle() {
    const btnOpen = document.getElementById("btn-filter");
    const btnClose = document.querySelector(".js-close-filter");
    const filter = document.querySelector(".filter-catalog");

    if (!btnOpen || !filter) return;

    // evita duplicar listeners (Tray AJAX)
    if (btnOpen.dataset.init) return;
    btnOpen.dataset.init = "true";

    // abrir / fechar pelo botão principal
    btnOpen.addEventListener("click", function () {
      filter.classList.toggle("active");
    });

    // fechar pelo botão close
    if (btnClose) {
      btnClose.addEventListener("click", function () {
        filter.classList.remove("active");
      });
    }
  }

  // DOM normal
  document.addEventListener("DOMContentLoaded", initFilterToggle);

  // AJAX da Tray
  $(document).ajaxSuccess(function () {
    initFilterToggle();
  });
}
