import{j as e}from"./jsx-runtime.DDS51bD4.js";import{j as d}from"./preload-helper.D9icLcHi.js";import{MiniRepl as x}from"./MiniRepl.CIoq-VYD.js";import"./index.DIn8BZQ7.js";import"./_commonjsHelpers.BosuxZz1.js";import"./index.viSaGVza.js";import"./scope.BGTCAvJh.js";import"./useClient.Bn08DQwb.js";/* empty css                      */import"./Claviature.DCnIPR8v.js";const j=d.docs.reduce((i,r)=>Object.assign(i,{[r.longname]:r}),{});function z({name:i,h:r=3,hideDescription:c,punchcard:m,canvasHeight:l}){const s=j[i];if(!s)return console.warn("Not found: "+i),e.jsx("div",{});const p=`h${r}`,a=s.description?.replaceAll(/\{@link ([a-zA-Z\.]+)?#?([a-zA-Z]*)\}/g,(n,o,t)=>`<a href="#${o.replaceAll(".","").toLowerCase()}${t?`-${t}`:""}">${o}${t?`#${t}`:""}</a>`)||"";return e.jsxs(e.Fragment,{children:[!!r&&e.jsx(p,{children:s.longname}),!c&&e.jsxs(e.Fragment,{children:[!!s.synonyms_text&&e.jsxs("span",{children:["Synonyms: ",e.jsx("code",{children:s.synonyms_text})]}),e.jsx("div",{dangerouslySetInnerHTML:{__html:a}})]}),e.jsx("ul",{children:s.params?.map((n,o)=>e.jsxs("li",{children:[n.name," (",n.type?.names?.join("|"),"): ",n.description?.replace(/(<([^>]+)>)/gi,"")]},o))}),s.examples?.length?e.jsx("div",{className:"space-y-2",children:s.examples?.map((n,o)=>e.jsx(x,{tune:n,punchcard:m,canvasHeight:l},o))}):e.jsx("div",{})]})}export{z as JsDoc};
