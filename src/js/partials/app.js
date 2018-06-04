
var ui = {
  orderType: function () {
    $('.main-banner .order-type .item').click(function (e) {
      $(this).addClass('active').siblings().removeClass('active');
      e.preventDefault();
    });
  },
  toggleMenu: function () {
    $('.burger').click(function (e) {
      $(this).toggleClass('open');
      $($(this).attr('href')).stop().slideToggle();
      e.preventDefault();
    });
  },
  mainSearch: function () {
    $('#search').bind("keyup change", function(e) {
      var val = $(this).val(),
          type = $(this).closest('.main-banner').find('.order-type .item.active').data('type'),
          date = new Date().getMilliseconds();
      if (val.length>3) {
        $.ajax({
          url: 'search.html?h='+date + '&orderType='+type+'&search='+val,
          success: function (data) {
            if ($(data).find('li').length>0) {
              $('#search-autocomplete .inner').html(data);
              $('#search-autocomplete').addClass('open');
            }
          },
          error: function (msg) {
            alert('Ошибка. Попробуйте позже!');
          }
        });
      } else {
        $('#search-autocomplete').removeClass('open');
      }
    });

    $(document).click( function(event){
      if( $(event.target).closest('.main-banner .search-wrap .input-wrap').length )
        return;
      $('#search-autocomplete').removeClass('open');
      event.stopPropagation();
    });
  },
  footerEmpty: function () {
    if ($('.footer-empty').length>0) {
      $('.footer-empty').height($('footer').outerHeight());
      setTimeout(function () {
        $('.footer-empty').height($('footer').outerHeight());
      }, 300);
    }
  },
  maskPhone: function () {
    $('.maskphone').mask('+41 79 999 99 99');
  },
  fancybox: function () {
    $('[data-fancybox]').fancybox({
      afterClose : function( instance, current ) {
        setTimeout(function () {
          $('.popup .error').removeClass('error').find('input').val('');
        }, 300)
      }
    });
  },
  loginPopup: function () {
    $('.popup.popup-login .tablnk a').click(function () {
      $($(this).attr('href')).addClass('active').siblings().removeClass('active');
    });
    $('.popup.popup-login .radio-wrap input[type="radio"]').bind("change", function(e) {
      if ($(this).is(':checked')) {
        $($(this).data('href')).closest('.tabs-wrap').find('.error').removeClass('error').find('input').val('');
        $($(this).data('href')).addClass('active').siblings().removeClass('active');
        $($(this).data('href')).find('input').addClass('required');
        $($(this).data('href')).siblings().find('input').removeClass('required');
      }
    });
  },
  inpCount: function () {
    $('.inp-count-wrap .count a.minus').click(function(){
      var inp = $(this).closest('.count').find('input[type=text]'),
          step = inp.data('step')*1,
          v = inp.val()*1,
          min = inp.data('min')*1;
      if (v>min){ v -= step; inp.val(v); }
      return false;
    });
    $('.inp-count-wrap .count a.plus').click(function(){
      var inp = $(this).closest('.count').find('input[type=text]'),
      v = inp.val()*1,
      step = inp.data('step')*1;
      v += step;
      inp.val(v);
      return false;
    });
  },
  inpNumbers: function () {
    $('input.inp-number').bind("keydown", function(e) {
      var ths = $(this);
      var keyKode = e.keyCode;
      if (keyKode>95 && keyKode<106 || keyKode>47 && keyKode<58 || keyKode == 8 || keyKode == 46 || keyKode ==9) { } else return false;
    });
  },
  orders: function () {
    $('.tbc-order .order .open').click(function () {
      $(this).closest('.order').toggleClass('open');
    });
    $(document).on('change', '.tbc-order .order input[type="radio"]', function (e) {
      $(this).closest('.order').removeClass('open');
    });
  },
  tabs: function () {
    $('.tabs-head a').click(function (e) {
      $(this).closest('li').addClass('active').siblings().removeClass('active');
      $($(this).attr('href')).addClass('active').siblings().removeClass('active');
      e.preventDefault();
    });
  },
  validate: function () {
    $(document).on('focus', 'input.required', function (e) {
      $(this).closest('.inp-wrap').removeClass('error validate');
    });
    $('form .inp-wrap input').each(function () {
      if ($(this).val() != '') {
        inpCheck($(this));
      }
    });
    $(document).on('blur', '.form-control', function (e) {
      inpCheck($(this));
    });
    $(document).on('change', 'input[type="checkbox"].required', function (e) {
      inpCheck($(this));
    });
    $(document).on('click', 'form .btn', function (e) {
      var form = $(this).closest('form');
      form.find('.inp-wrap .required').each(function () {
        inpCheck($(this));
        if (!form.hasClass('ajax')) {
          setTimeout(function () {
            if (!form.find('.inp-wrap.error').length>0) {
              form.submit();
            }
          }, 300)
        }

      });
      return false;
    });
    function inpCheck(elem) {
      var $this = $(elem),
          $form = $this.closest('form'),
          $errorsText = '',
          $errors = $form.find('.forms-errors');

      if ($this[0].tagName == 'INPUT') {
        var type = $this.attr('type');
        switch (type) {
          case 'email':
            var regexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;
            if($this.hasClass('required')){
              if (regexp.test($this.val())) {
                $this.closest('.inp-wrap').removeClass('error').addClass('validate');
              }else {
                $this.closest('.inp-wrap').addClass('error').removeClass('validate');
              }
            }else{
              if($this.val() != ''){
                if (regexp.test($this.val())) {
                  $this.closest('.inp-wrap').removeClass('error').addClass('validate');
                }else {
                  $this.closest('.inp-wrap').addClass('error').removeClass('validate');
                }
              }else{
                $this.closest('.inp-wrap').removeClass('error').addClass('validate');
              }
            }
            // console.log('Toлько email');
            break
          case 'text':
            // console.log('Toлько text');
            if ($this.hasClass('required')) {
              if ($this.has('maskphone')) {
                setTimeout(function () {
                  if ($this.val()  != '' ) {
                    $this.closest('.inp-wrap').removeClass('error').addClass('validate');
                  } else {
                    $this.closest('.inp-wrap').addClass('error').removeClass('validate');
                  }
                }, 100)
              } else {
                if ($this.val().length>1 ) {
                  $this.closest('.inp-wrap').removeClass('error').addClass('validate');
                } else {
                  $this.closest('.inp-wrap').addClass('error').removeClass('validate');
                }
              }
            } else {
              setTimeout(function () {
                if($this.val() != ''){
                  $this.closest('.inp-wrap').removeClass('error').addClass('validate');
                }
              }, 100)
            }

            break
          case 'checkbox':
            // console.log('Toлько checkbox');
            if($this.is(':checked')){
              $this.closest('.inp-wrap').removeClass('error').addClass('validate');
            } else {
              $this.closest('.inp-wrap').addClass('error').removeClass('validate');
            }
            break
          case 'password':
              if ($this.hasClass('pass1') || $this.hasClass('pass2')) {
                console.log('Toлько password');
                var pass01 = $('.pass1').val();
                var pass02 = $('.pass2').val();
                if ($this.val().length > 5  ) {
                  if(pass01 == pass02){
                    $('.pass1, .pass2').closest('.inp-wrap').removeClass('error');
                    $('.pass1, .pass2').closest('.inp-wrap').addClass('validate');
                  } else {
                    $this.closest('.inp-wrap').addClass('error').removeClass('validate');
                    $('.pass1, .pass2').closest('.inp-wrap').addClass('error');
                    $('.pass1, .pass2').closest('.inp-wrap').removeClass('validate');
                  }
                } else {
                  $('.pass1, .pass2').closest('.inp-wrap').addClass('error');
                  $('.pass1, .pass2').closest('.inp-wrap').removeClass('validate');
                }
              } else {
              if ($this.val().length > 5  ) {
                  $this.closest('.inp-wrap').removeClass('error').addClass('validate');
                  $this.closest('.inp-wrap').addClass('validate');
                } else {
                  $this.closest('.inp-wrap').addClass('error').removeClass('validate');
                }
              }
            break
          default:

        }
      } else if ($this[0].tagName == 'TEXTAREA') {
        if ($this.hasClass('required')) {
          if ($this.val().length>1 ) {
            $this.closest('.inp-wrap').removeClass('error').addClass('validate');
            $this.closest('.inp-wrap').addClass('validate');
          } else {
            $this.closest('.inp-wrap').addClass('error').removeClass('validate');
          }
        } else {
          if($this.val() != ''){
            $this.closest('.inp-wrap').removeClass('error').addClass('validate');
          }
        }

      }
      setTimeout(function () {
        if ($form.find('.inp-wrap.error input').length>0) {

            $form.find('.inp-wrap.error .required').each(function () {
              if ($errorsText.length>1) {
                $errorsText += ', ' + $(this).data('error');
              } else {
                $errorsText += $(this).data('error');
              }
            });
            $errors.text($errorsText);

          $errors.stop().fadeIn();
        } else {
          $errors.text('').stop().fadeOut();
        }
      }, 100);
    }
  },

  // new

  navShop: function () {
    $('.nav-shop .icon-wrap').click(function (e) {
      e.preventDefault();
      $(this).closest('li').toggleClass('open').find('>ul').stop().slideToggle(function () {
        if (!$(this).closest('li').hasClass('open')) {
          $(this).closest('li').find('li').removeClass('open')
          $(this).closest('li').find('ul').stop().hide();
        }
      });
    });
  },
  prodDetSlider: function () {
    if ($('.product-detail .slider').length>0) {
      $('.product-detail .slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        asNavFor: '.product-detail .carousel'
      });
      $('.product-detail .carousel').slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        asNavFor: '.product-detail .slider',
        focusOnSelect: true
      });
    }
  },
  OurOfferCarousel: function () {
    if ($('.our-offer-container .carousel').length>0) {
      $('.our-offer-container .carousel').each(function () {
        var carousel = $(this),
            prev = carousel.closest('.our-offer-container').find('.prev'),
            next = carousel.closest('.our-offer-container').find('.next');
        carousel.slick({
          slidesToShow: 4,
          slidesToScroll: 4,
          prevArrow: prev,
          nextArrow: next,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
        });
      });

    }
  },

  mainInit: function () {
    this.OurOfferCarousel();
    this.navShop();
    this.prodDetSlider();

    this.tabs();
    this.orders();
    this.inpNumbers();
    this.inpCount();
    this.toggleMenu();
    this.orderType();
    this.mainSearch();
    this.footerEmpty();
    this.maskPhone();
    this.validate();
    this.loginPopup();
    this.fancybox();
  }
};
$(document).ready(function(){
  ui.mainInit();
}); // end document.ready

$(window).load(function() {

}); // end window.load

$(window).resize(function(){
  ui.footerEmpty();
}); // end window.resize

$(window).scroll(function () {
}); // end window.scroll
