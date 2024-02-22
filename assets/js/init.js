document.addEventListener('DOMContentLoaded', () => {
  // loadJs('https://cdn.jsdelivr.net/npm/animejs@3.1.0/lib/anime.min.js');

  // 导入模块
  let sc = document.createElement("script");
  sc.type = "module";
  sc.setAttribute("src", "/assets/js/plugins.js");
  document.body.append(sc);

  var $navbar_burger = document.getElementById('navbar-burger');
  var $sidebar_nav = document.getElementById('sidebar-nav');
  $navbar_burger.addEventListener('click', (event) => {
    event.preventDefault();
    $navbar_burger.classList.toggle('is-active');
    $sidebar_nav.classList.toggle('is-active');
  });

  const $container = document.getElementById('container');
  if ($container.clientHeight < window.screen.height - 140) {
    $container.style.minHeight = window.screen.height - 140 + 'px';
  }

  var linkSelf = /^https:\/\/erasin\.wang/;

  document.querySelectorAll('a:not(.tag)').forEach(function(link, i) {
    switch (link.innerText) {
      case 'github':
        link.innerHTML = '<i class="icon icon-github"></i>GitHub';
        break;
      case 'book':
        link.innerHTML = '<i class="icon icon-book"></i>书籍';
        break;
      case 'docs':
        link.innerHTML = '<i class="icon icon-paperclip"></i>文档';
        break;
      case 'home':
      case 'site':
        link.innerHTML = '<i class="icon icon-home"></i>站点';
        break;
      case 'crate':
        link.innerHTML = '<i class="icon icon-cubes"></i>';
        break;
      case 'git':
        link.innerHTML = '<i class="icon icon-git"></i>Git';
        break;
      case 'download':
        link.innerHTML = '<i class="icon icon-download"></i>DOWNLOAD';
        break;
      case 'video':
      case 'youtube':
        link.innerHTML = '<i class="icon icon-youtube"></i>VIDEO';
        break;
      default:
        break;
    }
    if (!linkSelf.test(link.href) && location.hostname != '127.0.0.1') {
      link.setAttribute('target', '_blank');
    }
  });

  var progress_change = function() {
    var $bar = document.getElementById('js-progress-bar');
    var $top = document.getElementById('btn-top');

    var a = window.scrollY; // $(window).scrollTop();
    var b = window.innerHeight; // $(window).height();
    var c = document.body.scrollHeight; // $(document).height();
    if (a > 0) {
      var d = ((a + b) / c) * 100;
    } else {
      d = 0;
    }
    if (d > 99.9) {
      d = 0;
    }
    $bar.style.width = ''.concat(d, 'vw');

    if (a > 150) {
      if ($top.style.opacity == 0) {
        anime({
          targets: $top,
          opacity: 0.8,
          duration: 500,
          easing: 'easeInOutQuad',
        });
      }
    } else {
      if ($top.style.display == '') {
        anime({
          targets: $top,
          opacity: 0,
          duration: 500,
          easing: 'easeInOutQuad',
        });
      }
    }
  };

  window.addEventListener('scroll', progress_change, false);
  // =================

  let lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
  let active = false;

  const lazyLoad = function() {
    if (active === false) {
      active = true;

      setTimeout(function() {
        lazyImages.forEach(function(lazyImage) {
          if (lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0 && getComputedStyle(lazyImage).display !== 'none') {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.srcset = lazyImage.dataset.srcset;
            lazyImage.classList.remove('lazy');

            lazyImages = lazyImages.filter(function(image) {
              return image !== lazyImage;
            });

            if (lazyImages.length === 0) {
              document.removeEventListener('scroll', lazyLoad);
              window.removeEventListener('resize', lazyLoad);
              window.removeEventListener('orientationchange', lazyLoad);
            }
          }
        });

        active = false;
      }, 200);
    }
  };

  document.addEventListener('scroll', lazyLoad);
  window.addEventListener('resize', lazyLoad);
  window.addEventListener('orientationchange', lazyLoad);

  // =================
  // //当点击跳转链接后，回到页面顶部位置
  document.getElementById('btn-top').addEventListener('click', function(event) {
    event.preventDefault();
    const scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement;

    anime({
      targets: scrollElement,
      scrollTop: 0,
      duration: 500,
      easing: 'easeInOutQuad',
    });
  });

  var search_input = document.querySelector('.search input');

  if (search_input) {
    document.querySelector('.search button').addEventListener('click', function(event) {
      event.preventDefault();
      open_search();
    });

    search_input.addEventListener('keydown', function(event) {
      if (event.keyCode == 13) {
        open_search();
      }
    });

    document
      .getElementById('search-result')
      .querySelector('a.clear')
      .addEventListener('click', function(event) {
        event.preventDefault();
        var sre = document.querySelector('#search-result');
        sre.style['display'] = 'none';
        sre.querySelector('.list').innerHTML = '';
        search_input.value = '';
      });
  }

  function open_search() {
    var search = search_input.value;
    if (search != '') {
      // search += '%20site%3Aerasin.wang';
      // var u = 'https://www.bing.com/search?q=site%3Aerasin.wang+' + search;
      // open(u, '_blank');
      loadJs('https://cdn.staticfile.org/axios/0.19.2/axios.min.js', () => {
        var api = 'https://erasin.wang/api/v1/search?s=' + encodeURI(search);
        axios.get(api).then((res) => {
          // console.log(res);

          var list = '';
          res.data.forEach((item, _i) => {
            list += '<li class="item"><a href="' + item.article_id + '">' + item.title + '</a><span class="sub-num">' + item.created_time.split('T')[0] + '</span></li>';
          });

          var sre = document.querySelector('#search-result');
          sre.style['display'] = 'block';
          sre.querySelector('.list').innerHTML = list;
        });
      });
    }
  }

  var localAddrs = ['localhost', '127.0.0.1', ''];
  if (localAddrs.indexOf(document.location.hostname) === -1) {
    // 百度统计
    loadJs('https://hm.baidu.com/hm.js?95746e6ce3cd7fc9f74d8c63e5307857');
  }
});
