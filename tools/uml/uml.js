var plantUmlUrl = 'https://www.plantuml.com/plantuml';

var loadsvg = throttle(function(e, o) {
  $loader = document.getElementById('loader');
  $uml = document.getElementById('uml');
  $umlpng = document.getElementById('uml_png');
  $umlsvg = document.getElementById('uml_svg');
  $loader.style.display = 'block';

  var code = e.getValue();
  code = unescape(encodeURIComponent(code));
  var deflated_code = RawDeflate.deflate(code, 9);
  var encoded_code = code64.encode(deflated_code);
  $loader.style.display = 'none';

  var url_svg = plantUmlUrl + '/svg/' + encoded_code;
  var url_png = plantUmlUrl + '/png/' + encoded_code;

  $umlpng.setAttribute('href', url_png);
  $umlsvg.setAttribute('href', url_svg);
  $umlpng.style.display = 'block';
  $umlsvg.style.display = 'block';

  $uml.innerHTML = '<embed src="' + url_svg + '" type="image/svg+xml" />';
}, 3000);

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

window.document.documentElement.addEventListener('resize', function(event) {
  event.preventDefault();
  meditor.setSize('100%', window.innerHeight * 0.9);
});

meditor.on('change', loadsvg);
