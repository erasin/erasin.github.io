// jquery 替代

// 返回 NodeList
// var $ = document.querySelectorAll.bind(document);


export function nodes2Arr(_url, _callback) {
  return Array.prototype.slice.call(myNodeList);
}

// Element.prototype.on = Element.prototype.addEventListener;

export function loadJs(url, callback) {
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

export async function loadModule(url, callback) {
  var link = document.createElement('script');
  var fn = callback || function() { };
  link.type = 'module';
  link.onload = function() {
    fn();
  };
  link.async = 1;
  link.src = url;
  // link.rel = 'preload';
  link.crossorigin = 'anonymous';
  document.getElementsByTagName('head')[0].appendChild(link);
}

export function loadCss(url, callback) {
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
export function parseElement(str) {
  var o = document.createElement('div');
  o.innerHTML = str;
  return o.childNodes[0];
}

// From: https://remysharp.com/2010/07/21/throttling-function-calls
export function throttle(fn, threshhold, scope) {
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

export function make_svg(node, lang_id, index, svg_data, show_btn = true) {
  let id = lang_id + "-svg-" + index;
  // render
  let tmp = document.createElement('div');
  tmp.className = lang_id + '-svg center';
  tmp.setAttribute('index', index);
  tmp.setAttribute("id", id);
  tmp.innerHTML = svg_data;

  if (!show_btn) {
    return tmp;
  }

  // 按钮
  var btn_group = document.createElement('div');
  btn_group.style.textAlign = 'right';

  var btn = document.createElement('a');
  btn.className = 'button';
  btn.setAttribute('show', 0);
  btn.setAttribute('index', index);
  btn.innerText = '显示代码';
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    var _this = event.target;
    var show = _this.getAttribute('show') - 0;
    // var index = _this.getAttribute('index') - 0;

    if (show) {
      btn.setAttribute('show', 0);
      node.parentElement.style.display = 'none';
      btn.innerText = '显示代码';
    } else {
      btn.setAttribute('show', 1);
      node.parentElement.style.display = 'block';
      btn.innerText = '隐藏代码';
    }
  });
  btn_group.prepend(btn);

  var btn_down = document.createElement('a');
  btn_down.className = 'button';
  btn_down.setAttribute('index', index);
  btn_down.innerText = ' 下载 ';
  btn_down.href = '#';
  btn_down.addEventListener('click', (event) => {
    event.preventDefault();
    // var _this = event.target;
    // var index = _this.getAttribute('index') - 0;
    svg_to_png(id)
  });

  btn_group.prepend(btn_down);
  tmp.prepend(btn_group);

  return tmp;
}

// svg -> png download
export async function svg_to_png(svg_id ) {
  var svgElement = document.querySelector("#" + svg_id + " svg");

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
  let bottom_padding = 10;
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
