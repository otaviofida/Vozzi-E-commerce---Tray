{
    document.addEventListener('DOMContentLoaded', function () {
        const banner = document.querySelector('.s-home-banner');
    
        if (!banner) return;
    
        new Swiper(banner, {
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.container .swiper-pagination',
                clickable: true
            },
        });
    });
}

{
  document.querySelectorAll('.s-showcase').forEach((section) => {
    const swiperEl = section.querySelector('.d-showcase');
    const nextBtn = section.querySelector('.swiper-button-next');
    const prevBtn = section.querySelector('.swiper-button-prev');

    new Swiper(swiperEl, {
        breakpoints: {
            0: {
                slidesPerView: 1.3
            },
            768: {
                slidesPerView: 3
            }
        },
        spaceBetween: 24,
        speed: 1300,
        navigation: {
            nextEl: nextBtn,
            prevEl: prevBtn
        }
    });
});
}

{
    var slide_categorias = new Swiper(".s-categorias .container", {
    breakpoints: {
      0: {
        slidesPerView: 2.4
      },
      768: {
        slidesPerView: 5.2
      }
    },
    spaceBetween: 24,
    speed: 1300,
  });
}

{
    var slide_bannervitrine = new Swiper(".s-vitrine-banner .container", {
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 1
      }
    },
    spaceBetween: 24,
    speed: 1300,
    navigation: {
        nextEl: '.container .nav .swiper-button-next',
        prevEl: '.container .nav .swiper-button-prev',
    },
    pagination: {
        el: '.nav .swiper-dots',
        clickable: true
    },
  });
}

{
    var slide_bannermarcas = new Swiper(".s-banner-marcas .container", {
    breakpoints: {
      0: {
        slidesPerView: 2.5
      },
      768: {
        slidesPerView: 6
      }
    },
    spaceBetween: 24,
    speed: 1300,
  });
}

{
  var swiperThumbs = new Swiper(".mid-product .thumbs", {
    direction: "vertical",
    spaceBetween: 10,
    slidesPerView: 3,
    watchSlidesProgress: true,
    mousewheel: true,
  slideToClickedSlide: true,
  });
  
  var swiperMain = new Swiper(".mid-product .left" , {
    spaceBetween: 10,
    thumbs: {
      swiper: swiperThumbs,
    },
  });
}