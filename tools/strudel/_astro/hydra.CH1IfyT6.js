function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{_ as h}from"./preload-helper.D9icLcHi.js";import{g as r,o as m,q as g}from"./index.viSaGVza.js";import"./_commonjsHelpers.BosuxZz1.js";let a,t;async function v(e={}){if(a&&JSON.stringify(a)!==JSON.stringify(e)&&document.getElementById("hydra-canvas")?.remove(),a=e,!document.getElementById("hydra-canvas")){const{src:i="https://unpkg.com/hydra-synth",feedStrudel:o=!1,contextType:d="webgl",pixelRatio:c=1,pixelated:l=!0,...s}={detectAudio:!1,...e},{canvas:y}=r("hydra-canvas",{contextType:d,pixelRatio:c,pixelated:l});if(s.canvas=y,await h(()=>import(i),__vite__mapDeps([])),t=new Hydra(s),o){const{canvas:n}=r();n.style.display="none",t.synth.s0.init({src:n})}}}function _(){t&&t.hush(),globalThis.s0?.clear(),document.getElementById("hydra-canvas")?.remove(),globalThis.speed=m,globalThis.shape=g}const T=e=>()=>e.queryArc(getTime(),getTime())[0].value;export{T as H,_ as clearHydra,v as initHydra};
