// jquery 替代

// 返回 NodeList
// var $ = document.querySelectorAll.bind(document);

function nodes2Arr(url, callback) {
  return Array.prototype.slice.call(myNodeList);
}

// Element.prototype.on = Element.prototype.addEventListener;

function loadJs(url, callback) {
  var link = document.createElement('script');
  var fn = callback || function() { };
  link.type = 'text/javascript';
  link.onload = function() {
    fn();
  };
  link.async = 1;
  link.src = url;
  // link.rel = 'preload';
  link.crossorigin = 'anonymous';
  document.getElementsByTagName('head')[0].appendChild(link);
}

function loadCss(url, callback) {
  var link = document.createElement('link');
  var fn = callback || function() { };
  link.rel = 'stylesheet';
  link.onload = function() {
    fn();
  };
  link.async = 1;
  link.href = url;
  link.crossorigin = 'anonymous';
  document.getElementsByTagName('head')[0].appendChild(link);
}

/*字符串解析成元素节点类型*/
function parseElement(str) {
  var o = document.createElement('div');
  o.innerHTML = str;
  return o.childNodes[0];
}

// From: https://remysharp.com/2010/07/21/throttling-function-calls
function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last;
  var deferTimer;
  return function() {
    var context = scope || this;
    var now = +new Date();
    var args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function() {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

// svg -> png download

async function svg_to_png(svg_id) {
  var svgElement = document.getElementById(svg_id);
  let { width, height } = svgElement.getBBox();
  // 矫正
  width *= 2;
  height = ((height * 9) / 10) * 2;

  let clonedSvgElement = svgElement.cloneNode(true);

  let outerHTML = clonedSvgElement.outerHTML,
    blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });

  let URL = window.URL || window.webkitURL || window;
  let blobURL = URL.createObjectURL(blob);

  var download = function(href, name) {
    var link = document.createElement('a');
    link.download = name;
    link.style.opacity = '0';
    document.body.append(link);
    link.href = href;
    link.click();
    link.remove();
  };

  let canvas = document.createElement('canvas');
  bottom_padding = 10;
  canvas.width = width;
  canvas.height = height + bottom_padding;
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height + bottom_padding);

  let image = new Image();
  image.setAttribute('crossOrigin', 'Anonymous');
  image.onload = () => {
    ctx.drawImage(image, 0, 0, width, height);
    let png = canvas.toDataURL('image/png');
    download(png, svg_id + '.png');
  };
  image.src = blobURL;
}
