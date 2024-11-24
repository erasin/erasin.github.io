import {make_svg} from './utils.js'

export async function bob_render(bob_node) {
  const {default: init,render} = await import('../svgbob-wasm/svgbob_wasm.js');
  await init();
  bob_node.forEach(function(item, index) {
    let svg_data = render(item.innerText);
    let tmp = make_svg(item, "bob" ,index, svg_data);
    bob_node[index].parentElement.style.display = 'none';
    bob_node[index].parentElement.after(tmp);
  });
}
