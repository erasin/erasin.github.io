// var remark_config = {
//     host: 'https://comment.erasin.wang',
//     site_id: 'erasin.wang',
//     components: ['embed'],
//     max_shown_comments: 10,
//     theme: 'light',
//     components: ['embed', 'counter'],
// };

const $scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement;

const $content = document.querySelector('#container .post-content');

document.addEventListener('DOMContentLoaded', () => {
    // loadJs('https://cdn.jsdelivr.net/npm/animejs@3.1.0/lib/anime.min.js');

    // 初始化高度
    // var $container = document.getElementById('container');
    $top = document.querySelector('#container .post h1');
    if ($top.offsetTop > $scrollElement.scrollTop) {
        scrollTo($top.offsetTop - 57);
    }

    function scrollTo(y) {
        // scrollElement.scrollTop = y;
        anime({
            targets: $scrollElement,
            scrollTop: y,
            duration: 500,
            easing: 'easeInOutQuad',
        });
    }

    if (document.getElementById('toc') != null) {
        //tscanlin.github.io/tocbot/
        // ...
        // https: loadJs(
        //   '//cdnjs.cloudflare.com/ajax/libs/tocbot/4.4.2/tocbot.min.js',
        //   () => {
        //     tocbot.init({
        //       tocSelector: '#toc',
        //       contentSelector: '.post-content',
        //       headingSelector: 'h1, h2, h3',
        //       hasInnerContainers: true,
        //       headingsOffset: 800
        //     });
        //   }
        // );

        var toc_click = function (event) {
            event.preventDefault();
            var $target = document.getElementById(event.target.attributes.data_id.textContent);
            scrollTo($target.offsetTop - 15);
            location.replace(event.target.href);
        };


        var $toc = document.querySelector('#toc');
        $toc.addEventListener('click', toc_click, false);

        var $toc_link = document.querySelectorAll('#toc a');
        var $content_toc = [];
        $toc_link.forEach((e) => {
            var $target = document.getElementById(e.attributes.data_id.textContent);
            $content_toc.push($target);
        });

        var page_scroll = throttle(function () {
            var $target_i = 0;

            var toc_fixed = $toc.offsetTop - $scrollElement.scrollTop;
            if (toc_fixed < 0) {
                $toc.classList.add('toc-fixed');
                const width = document.querySelector('#right-side').offsetWidth;
                $toc.style.minWidth = width+"px"; 
            } else {
                $toc.classList.remove('toc-fixed');
            }

            $content_toc.forEach((e, i) => {
                var cha = e.offsetTop - $scrollElement.scrollTop;
                if (cha < 100) {
                    $toc_link[i].classList.add('is-active-link');
                    $target_i = i;
                }
            });

            $toc_link.forEach((_e, i) => {
                if (i != $target_i) {
                    $toc_link[i].classList.remove('is-active-link');
                }
            });
        }, 200);

        window.addEventListener('scroll', page_scroll, false);
        window.addEventListener('resize', page_scroll, false);
    }

    // remark
    // if (document.getElementById('remark42') != null) {
    //     // comment
    //     (function (c) {
    //         for (var i = 0; i < c.length; i++) {
    //             var d = document,
    //                 s = d.createElement('script');
    //             s.src = remark_config.host + '/web/' + c[i] + '.js';
    //             s.defer = true;
    //             (d.head || d.body).appendChild(s);
    //         }
    //     })(remark_config.components || ['embed']);
    // }

    // gitalk
    // if (location.hostname == 'erasin.wang') {
    //     loadJs('https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js', function () {
    //         var gitalk = new Gitalk({
    //             clientID: '4b02056b17a834f7d86a',
    //             clientSecret: '8cc1b17fd7a1f3b34fd2235323f73c461b203433',
    //             repo: 'erasin.github.io',
    //             owner: 'erasin',
    //             admin: ['erasin'],
    //             id: location.pathname, // Ensure uniqueness and length less than 50
    //             distractionFreeMode: false, // Facebook-like distraction free mode
    //         });
    //         gitalk.render('gitalk-container');
    //     });
    // }

    // loadJs('https://cdn.jsdelivr.net/npm/vue/dist/vue.js', () => {
    //     loadJs('https://cdn.staticfile.org/axios/0.19.2/axios.min.js', () => {
    //         loadJs('https://cdn.jsdelivr.net/npm/moment@2.27.0/moment.min.js', () => {
    //             loadJs('https://erasin.wang/api/public/comments.js', () => {
    //                 // var u = window.location.href;
    //                 let comments = new Vue({
    //                     el: '#comments-container',
    //                     data: {
    //                         // u: "http://erasin.wang/a/b/c"
    //                         u: window.location.href
    //                     }
    //                 });
    //             });
    //         });
    //     });
    // });
});
