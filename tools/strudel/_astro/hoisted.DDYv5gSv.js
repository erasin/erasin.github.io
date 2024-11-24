function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{i as m,c as g,_ as w}from"./preload-helper.D9icLcHi.js";import"./index.viSaGVza.js";import"./_commonjsHelpers.BosuxZz1.js";m(g.get().theme);const n=()=>{document.documentElement.style.setProperty("--app-height",`${window.innerHeight-1}px`)};typeof window<"u"&&(window.addEventListener("resize",n),n());function u(i={}){const{immediate:d=!1,onNeedRefresh:h,onOfflineReady:a,onRegistered:c,onRegisteredSW:r,onRegisterError:l}=i;let t,o;const p=async(s=!0)=>{await o};async function f(){if("serviceWorker"in navigator){const{Workbox:s}=await w(()=>import("./workbox-window.prod.es5.DFjpnwFp.js"),__vite__mapDeps([]));t=new s("/tools/strudel/sw.js",{scope:"/tools/strudel/",type:"classic"}),t.addEventListener("activated",e=>{(e.isUpdate||e.isExternal)&&window.location.reload()}),t.addEventListener("installed",e=>{e.isUpdate||a?.()}),t.register({immediate:d}).then(e=>{r?r("/tools/strudel/sw.js",e):c?.(e)}).catch(e=>{l?.(e)})}}return o=f(),p}u({immediate:!0,onRegisteredSW(i){},onOfflineReady(){}});
