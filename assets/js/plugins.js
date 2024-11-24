// module
// import { loadModule } from "./utils.js"

// svg bob 处理
let bob_node = document.querySelectorAll('code.language-bob');
if (bob_node.length) {
  const { bob_render } = await import('./module.bob.js');
  await bob_render(bob_node);
}

// plantuml
let puml_node = document.querySelectorAll('code.language-plantuml');
if (puml_node.length) {
  const { plantuml_render } = await import("./module.plantuml.js");
  await plantuml_render(puml_node);
}

// mermaid
let mermaid_node = document.querySelectorAll('code.language-mermaid');
if (mermaid_node.length) {
  const { mermaid_render } = await import("./module.mermaid.js");
  await mermaid_render(mermaid_node);
}

let math_node = document.querySelectorAll('.math');
if (math_node.length) {
  const { katex_render } = await import("./module.katex.js");
  await katex_render(math_node);
}
