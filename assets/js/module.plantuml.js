import { make_svg,loadJs } from './utils.js'

const plantUmlUrl = 'https://www.plantuml.com/plantuml';

export async function plantuml_render(puml_node) {
  loadJs('/assets/js/rawdeflate.js', () => {
    loadJs('/assets/js/url_code64.js', () => {
      puml_node.forEach(function(item, index) {
        var code = item.innerText;
        code = unescape(encodeURIComponent(code));
        var deflated_code = RawDeflate.deflate(code, 9);
        var encoded_code = code64.encode(deflated_code);
         var url_svg = plantUmlUrl + '/svg/' + encoded_code;
        // let svg_data = '<embed src="' + url_svg + '" type="image/svg+xml" />';
        fetch(url_svg).then((res)=>{
          return res.text();
        // }).then( (str)=>{
        //   return (new window.DOMParser()).parseFromString(str,"text/xml");
        }).then( (data)=>{
          var tmp = make_svg(item, "puml", index, data);
          puml_node[index].parentElement.style.display = 'none';
          puml_node[index].parentElement.after(tmp);
        });
      });
    });
  });
}
