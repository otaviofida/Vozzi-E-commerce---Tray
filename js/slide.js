{
  document.addEventListener("DOMContentLoaded", function () {
    const banner = document.querySelector(".s-home-banner");

    if (!banner) return;

    new Swiper(banner, {
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".container .swiper-pagination",
        clickable: true,
      },
    });
  });
}

// Variáveis globais para Swipers do produto (usadas em theme.js)  
var swiperThumbs, swiperMain;

{
  requestAnimationFrame(function () {
    document.querySelectorAll(".s-showcase:not(.s-showcase--grid)").forEach((section) => {
      const swiperEl = section.querySelector(".d-showcase");
      const nextBtn = section.querySelector(".swiper-button-next");
      const prevBtn = section.querySelector(".swiper-button-prev");

      new Swiper(swiperEl, {
        breakpoints: {
          0: {
            slidesPerView: 1.3,
          },
          768: {
            slidesPerView: 3,
          },
        },
        spaceBetween: 24,
        speed: 1300,
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
        },
      });
    });
  });
}

{
  requestAnimationFrame(function () {
    new Swiper(".s-categorias .container", {
      breakpoints: {
        0: {
          slidesPerView: 2.4,
        },
        768: {
          slidesPerView: 5.2,
        },
      },
      spaceBetween: 24,
      speed: 1300,
    });
  });
}

{
  requestAnimationFrame(function () {
    new Swiper(".s-vitrine-banner .container", {
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 1,
        },
      },
      spaceBetween: 24,
      speed: 1300,
      navigation: {
        nextEl: ".container .nav .swiper-button-next",
        prevEl: ".container .nav .swiper-button-prev",
      },
      pagination: {
        el: ".nav .swiper-dots",
        clickable: true,
      },
    });
  });
}

{
  requestAnimationFrame(function () {
    new Swiper(".s-banner-marcas .container", {
      breakpoints: {
        0: {
          slidesPerView: 2.5,
        },
        768: {
          slidesPerView: 6,
        },
      },
      spaceBetween: 24,
      speed: 1300,
    });
  });
}

{
  requestAnimationFrame(function () {
    swiperThumbs = new Swiper(".mid-product .thumbs", {
      direction: "vertical",
      spaceBetween: 10,
      slidesPerView: 3,
      watchSlidesProgress: true,
      mousewheel: true,
      slideToClickedSlide: true,
    });

    swiperMain = new Swiper(".mid-product .left", {
      spaceBetween: 10,
      thumbs: {
        swiper: swiperThumbs,
      },
    });
  });
}

{
  document.addEventListener("DOMContentLoaded", () => {
    const mainEl = document.querySelector(".js-gallery-main");
    if (!mainEl) return;

    if (mainEl.classList.contains("is-swiper-initialized")) return;
    mainEl.classList.add("is-swiper-initialized");

    const thumbsEl = document.querySelector(".js-gallery-thumbs");
    const prevEl = document.querySelector(".js-gallery-thumbs-prev");
    const nextEl = document.querySelector(".js-gallery-thumbs-next");

    let thumbsSwiper = null;
    const mobileBreak = 630;

    function getThumbsConfig() {
      var isMobile = window.innerWidth <= mobileBreak;
      return {
        direction: isMobile ? "horizontal" : "vertical",
        slidesPerView: isMobile ? "auto" : 3,
        spaceBetween: 8,
        freeMode: false,
        watchSlidesProgress: true,
        navigation: prevEl && nextEl ? { prevEl, nextEl } : undefined,
        mousewheel: !isMobile,
      };
    }

    if (thumbsEl && thumbsEl.querySelectorAll(".swiper-slide").length > 1) {
      thumbsSwiper = new Swiper(thumbsEl, getThumbsConfig());

      // Recria o swiper de thumbs ao cruzar o breakpoint mobile
      var wasMobile = window.innerWidth <= mobileBreak;
      window.addEventListener("resize", function () {
        var isMobile = window.innerWidth <= mobileBreak;
        if (isMobile !== wasMobile) {
          wasMobile = isMobile;
          thumbsSwiper.destroy(true, true);
          thumbsSwiper = new Swiper(thumbsEl, getThumbsConfig());
          if (mainSwiper) {
            mainSwiper.thumbs.swiper = thumbsSwiper;
            mainSwiper.thumbs.init();
            mainSwiper.thumbs.update(true);
          }
        }
      });
    }

    const mainSwiper = new Swiper(mainEl, {
      slidesPerView: 1,
      spaceBetween: 0,
      thumbs: thumbsSwiper ? { swiper: thumbsSwiper } : undefined,
    });

    if (thumbsSwiper) {
      thumbsEl.addEventListener("click", (e) => {
        const slideEl = e.target.closest(".swiper-slide");
        if (!slideEl) return;

        const slides = Array.from(thumbsEl.querySelectorAll(".swiper-slide"));
        const index = slides.indexOf(slideEl);
        if (index >= 0) mainSwiper.slideTo(index);
      });
    }
  });
}

{
  requestAnimationFrame(function () {
    const relatedEl = document.querySelector(".pageProduct-related .related-showcase");
    if (relatedEl) {
      new Swiper(relatedEl, {
        breakpoints: {
          0: {
            slidesPerView: 1.3,
          },
          768: {
            slidesPerView: 3,
          },
        },
        spaceBetween: 24,
        speed: 1300,
        navigation: {
          nextEl: ".related-next",
          prevEl: ".related-prev",
        },
      });
    }
  });
}
