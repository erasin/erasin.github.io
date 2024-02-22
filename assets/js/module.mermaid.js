import { make_svg,loadJs } from './utils.js'

export async function mermaid_render(mermaid_node) {
  loadJs('https://cdn.jsdelivr.net/npm/mermaid@9.1.2/dist/mermaid.min.js', () => {
    // var config = {
    //   startOnLoad: true,
    //   flowchart: {
    //     useMaxWidth: true,
    //     htmlLabels: true,
    //     curve: 'cardinal',
    //   },

    //   securityLevel: 'loose',
    // };
    // mermaid.initialize(config);
    mermaid_node.forEach(function(item, index) {
      mermaid.render('mermaid-' + index, item.innerText, (svg_data) => {
        if (svg_data == '') {
          return false;
        }
        let tmp = make_svg(item, "mermaid" ,index, svg_data);
        mermaid_node[index].parentElement.style.display = 'none';
        mermaid_node[index].parentElement.after(tmp);
      });
    });
  });

}
