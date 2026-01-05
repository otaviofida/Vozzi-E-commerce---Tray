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
        }
    
        setSectionHeight();
    
        // Recalcula em resize (muito importante)
        window.addEventListener('resize', setSectionHeight);
    });
    
}

{
    document.addEventListener('DOMContentLoaded', function () {

        const searchIcon = document.querySelector('header .nav-icons .search-icon');
        const modalSearch = document.querySelector('.modal-search');
        const modalContainer = modalSearch.querySelector('.container');
    
        if (!searchIcon || !modalSearch || !modalContainer) return;
    
        // Abrir modal
        searchIcon.addEventListener('click', function () {
            modalSearch.classList.add('active');
        });
    
        // Fechar clicando fora do container
        modalSearch.addEventListener('click', function () {
            modalSearch.classList.remove('active');
        });
    
        // Impede fechar clicando dentro
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
    
    
    var cart = {
    
        session: function () {
            return jQuery("html").attr("data-session");
        },
    
        removeProduct: function (element){
    
            var id = parseInt(jQuery(element).attr('data-id'));
            var variant = '/' + jQuery(element).attr('data-variant');
            var together = jQuery(element).attr('data-together') !== '' ? '/' + jQuery(element).attr('data-together') : '';
            var addText = jQuery(element).attr('data-add') == "" ? '' : jQuery(element).attr('data-add');
                    
            jQuery.ajax({
                method: "DELETE",
                url: "/web_api/carts/" + cart.session() + "/" + id + variant + together + "?" + jQuery.param({ "additional_information": addText })
            }).done(function(response) {
                cart.listProduct();
            }).fail(function(error) {
                cart.listProduct();
            })
        },
    
        listProduct: function () {
            jQuery.ajax({
                method: "GET",
                url: "/web_api/cart/" + cart.session(),
                success: function (response) {
        
                    // AQUI ESTÁ A CORREÇÃO
                    if (Array.isArray(response) && response.length) {
                        cart.forProduct(response);
                    } else {
                        cart.forProduct([]);
                    }
                },
                error: function () {
                    cart.forProduct([]);
                }
            });
        },
    
        total: function(price){
            jQuery('.cart-sidebar .total .value').text(toReal(parseFloat(price), 'R$'));
        },
    
        forProduct: function (listProducts) {
    
            var listDom = jQuery('.cart-sidebar .content-cart .list');
            listDom.find('*').remove();
            listDom.parent().removeClass('empty');

            console.log('LISTANDO PRODUTOS:', listProducts);
    
            var qnt = 0;
            var total = 0.0;
            var listId = [];
    
            if (listProducts.length) {
    
                listProducts.forEach(function (product) {
    
                    product = product.Cart;
                    var addMsg = product.additional_information;
                    prices = product;
                    var productImage = '';

                    if (product.product_image) {
                        if (product.product_image.thumbs && product.product_image.thumbs[90]) {
                            productImage = product.product_image.thumbs[90].https;
                        } else if (product.product_image.https) {
                            productImage = product.product_image.https;
                        }
                    }
                    listDom.append(cart.templateProduct(product.product_id, product.variant_id, product.product_name, productImage, product.quantity, product.price, product.product_url.https,addMsg,product.bought_together_id));
                    qnt += parseInt(product.quantity);
                    total += (parseFloat(product.price) * parseInt(product.quantity));
                    listId.push(parseInt(product.product_id));
    
                });
    
                cart.total(total);
    
            } else {
    
                listDom.append('<div class="error"><div clas="text">Carrinho Vazio</div></div>');
                listDom.parent().addClass('empty');
    
            }
        },
    
        startCart: function () {
    
            jQuery('.cart-toggle').on('click', function(e){
                e.preventDefault();
                cart.showCart();
            });
    
            jQuery('.shadow-cart, .cart-sidebar .box-prev').on('click', function(e){
                jQuery('.cart-sidebar').removeClass('active');
                jQuery('.shadow-cart').removeClass('active');
            });
    
        },
    
        showCart: function(){
            cart.listProduct();
            jQuery('.cart-sidebar').addClass('active');
            jQuery('.shadow-cart').addClass('active');
        },
    
        templateProduct: function (id, variant, name, image, qnt, price, url, addMsg, together) {
    
            var template = '\
                <div class="item">\
                    <div class="box-cart flex align-center">\
                        <div class="box-image">\
                            <a href="{url}" class="image">\
                                <img src="{image}" alt="{name}">\
                            </a>\
                        </div>\
                        <div class="info-product">\
                            <div class="line-top flex justify-between">\
                                <a href="{url}" class="name t-color">{name}</a>\
                                <div class="remove" data-id="{id}" data-together="{together}" data-variant="{variant}" data-add="{addMsg}" onclick="cart.removeProduct(this)">\
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 438.529 438.529">\
                                        <path d="M417.689,75.654c-1.711-1.709-3.901-2.568-6.563-2.568h-88.224L302.917,25.41c-2.854-7.044-7.994-13.04-15.413-17.989C280.078,2.473,272.556,0,264.945,0h-91.363c-7.611,0-15.131,2.473-22.554,7.421c-7.424,4.949-12.563,10.944-15.419,17.989l-19.985,47.676h-88.22c-2.667,0-4.853,0.859-6.567,2.568c-1.709,1.713-2.568,3.903-2.568,6.567v18.274c0,2.664,0.855,4.854,2.568,6.564c1.714,1.712,3.904,2.568,6.567,2.568h27.406v271.8c0,15.803,4.473,29.266,13.418,40.398c8.947,11.139,19.701,16.703,32.264,16.703h237.542c12.566,0,23.319-5.756,32.265-17.268c8.945-11.52,13.415-25.174,13.415-40.971V109.627h27.411c2.662,0,4.853-0.856,6.563-2.568c1.708-1.709,2.57-3.9,2.57-6.564V82.221C420.26,79.557,419.397,77.367,417.689,75.654z M169.301,39.678c1.331-1.712,2.95-2.762,4.853-3.14h90.504c1.903,0.381,3.525,1.43,4.854,3.14l13.709,33.404H155.311L169.301,39.678z M347.173,380.291c0,4.186-0.664,8.042-1.999,11.561c-1.334,3.518-2.717,6.088-4.141,7.706c-1.431,1.622-2.423,2.427-2.998,2.427H100.493c-0.571,0-1.565-0.805-2.996-2.427c-1.429-1.618-2.81-4.188-4.143-7.706c-1.331-3.519-1.997-7.379-1.997-11.561V109.627h255.815V380.291z"/>\
                                        <path d="M137.04,347.172h18.271c2.667,0,4.858-0.855,6.567-2.567c1.709-1.718,2.568-3.901,2.568-6.57V173.581c0-2.663-0.859-4.853-2.568-6.567c-1.714-1.709-3.899-2.565-6.567-2.565H137.04c-2.667,0-4.854,0.855-6.567,2.565c-1.711,1.714-2.568,3.904-2.568,6.567v164.454c0,2.669,0.854,4.853,2.568,6.57C132.186,346.316,134.373,347.172,137.04,347.172z"/>\
                                        <path d="M210.129,347.172h18.271c2.666,0,4.856-0.855,6.564-2.567c1.718-1.718,2.569-3.901,2.569-6.57V173.581c0-2.663-0.852-4.853-2.569-6.567c-1.708-1.709-3.898-2.565-6.564-2.565h-18.271c-2.664,0-4.854,0.855-6.567,2.565c-1.714,1.714-2.568,3.904-2.568,6.567v164.454c0,2.669,0.854,4.853,2.568,6.57C205.274,346.316,207.465,347.172,210.129,347.172z"/>\
                                        <path d="M283.22,347.172h18.268c2.669,0,4.859-0.855,6.57-2.567c1.711-1.718,2.562-3.901,2.562-6.57V173.581c0-2.663-0.852-4.853-2.562-6.567c-1.711-1.709-3.901-2.565-6.57-2.565H283.22c-2.67,0-4.853,0.855-6.571,2.565c-1.711,1.714-2.566,3.904-2.566,6.567v164.454c0,2.669,0.855,4.853,2.566,6.57C278.367,346.316,280.55,347.172,283.22,347.172z" />\
                                    </svg>\
                                </div>\
                            </div>\
                            <div class="line-down">\
                                <div class="qnt">Quantidade: {length}</div>\
                                <div class="price">{price}</div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            ';
    
            price = toReal(parseFloat(price), 'R$');
    
            template = template.replace(/{url}/g,url);
            template = template.replace(/{image}/g,image);
            template = template.replace(/{name}/g,name);
            template = template.replace(/{id}/g,id);
            template = template.replace(/{variant}/g,variant);
            template = template.replace(/{length}/g,qnt);
            template = template.replace(/{addMsg}/g,addMsg);
            template = template.replace(/{price}/g,price);
            template = template.replace(/{together}/g,together);
    
            return template;
    
        }
    
    }
    
    jQuery(function(){
    
        cart.startCart();
    
    }); 
}

//Script para mudar foto do produto na vitrine
{
    document.addEventListener('click', function (e) {
        const button = e.target.closest('.js-variant-color');
        if (!button) return;
    
        const newImage = button.dataset.image;
        const productCard = button.closest('.product-slide');
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

//Script Variacoes
{
document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.list-variants').forEach(form => {

        const variants = JSON.parse(form.dataset.variants || '[]');
        const firstSelect = form.querySelector('.first');
        const secondSelect = form.querySelector('.second');
        const colorItems = form.querySelectorAll('.option-color li');

        let selectedFirst = '';

        // 👉 CLICK EM COR (LI)
        colorItems.forEach(li => {
            li.addEventListener('click', () => {

                colorItems.forEach(i => i.classList.remove('active'));
                li.classList.add('active');

                selectedFirst = li.dataset.value;

                if (secondSelect) {
                    secondSelect.disabled = false;
                    filterSecondOptions();
                }

            });
        });

        // 👉 CHANGE SELECT 1
        if (firstSelect && firstSelect.tagName === 'SELECT') {
            firstSelect.addEventListener('change', () => {
                selectedFirst = firstSelect.value;

                if (secondSelect) {
                    secondSelect.disabled = false;
                    filterSecondOptions();
                }
            });
        }

        function filterSecondOptions() {
            secondSelect.querySelectorAll('option').forEach(opt => {
                if (!opt.value) return;

                const exists = variants.some(v =>
                    v.option === selectedFirst && v.option2 === opt.value
                );

                opt.style.display = exists ? 'block' : 'none';
            });

            secondSelect.value = '';
        }

    });

});

}