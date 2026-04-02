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

{
  document.querySelectorAll(".s-showcase").forEach((section) => {
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
}

{
  var slide_categorias = new Swiper(".s-categorias .container", {
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
}

{
  var slide_bannervitrine = new Swiper(".s-vitrine-banner .container", {
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
}

{
  var slide_bannermarcas = new Swiper(".s-banner-marcas .container", {
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

  var swiperMain = new Swiper(".mid-product .left", {
    spaceBetween: 10,
    thumbs: {
      swiper: swiperThumbs,
    },
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

    if (thumbsEl && thumbsEl.querySelectorAll(".swiper-slide").length > 1) {
      thumbsSwiper = new Swiper(thumbsEl, {
        direction: "vertical",
        slidesPerView: 3, // quantos thumbs visíveis
        spaceBetween: 8,
        freeMode: false,
        watchSlidesProgress: true,
        navigation: prevEl && nextEl ? { prevEl, nextEl } : undefined,
        mousewheel: true, // scroll do mouse/trackpad
        lazy: { loadPrevNext: true },
      });
    }

    const mainSwiper = new Swiper(mainEl, {
      slidesPerView: 1,
      spaceBetween: 0,
      lazy: { loadPrevNext: true, loadPrevNextAmount: 2 },
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
}
