// var URL_SERVE = 'https://api.erasin.wang/svgbob';

 
import {make_svg} from '../../assets/js/utils.js'
const {default: init,render} = await import('../../assets/svgbob-wasm/svgbob_wasm.js');
await init();

var loadsvg = throttle(function (e, o) {
  uml = document.getElementById('uml');

  var code = e.getValue();
  let svg_data = render(code);
  let tmp = make_svg(0, "bob" ,"false", svg_data, false);

  uml.innerHTML = tmp.innerHTML;

}, 500);

// editor

var meditor = CodeMirror.fromTextArea(document.getElementById('code'), {
  lineNumbers: true,
  mode: 'yaml',
  styleActiveLine: true,
  matchBrackets: true,
  viewportMargin: Infinity,
  autofocus: true,
});

meditor.setSize('100%', window.innerHeight * 0.9);

window.document.documentElement.addEventListener('resize', function (event) {
  event.preventDefault();
  meditor.setSize('100%', window.innerHeight * 0.9);
});

meditor.on('change', loadsvg);
