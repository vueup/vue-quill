import{d as e,c as l,o as t,a,r as o,b as n,w as s,v as r,m as i,t as d,F as c,e as u,f as p,g as m,h as f,u as b,s as h}from"./app.2f52c901.js";var v=e({props:{selected:{type:String},name:{type:String,required:!0,default:"option"},options:{type:Array,default:[{value:"1",label:"Option 1"}]}},emits:["update:selected"],setup:(e,t)=>({localValue:l({get:()=>e.selected,set:e=>t.emit("update:selected",e)})})});const y={class:"inline-flex items-center cursor-pointer w-full"},g={class:"ml-2"};v.render=function(e,l,u,p,m,f){return t(!0),a(c,null,o(e.options,((o,c)=>(t(),a("div",{key:c},[n("label",y,[s(n("input",i({type:"radio",class:"form-radio bg-gray-200"},e.$attrs,{name:e.name,value:o.value,checked:o.value===e.localValue,"onUpdate:modelValue":l[1]||(l[1]=l=>e.localValue=l)}),null,16,["name","value","checked"]),[[r,e.localValue]]),n("span",g,d(o.label),1)])])))),128)};var x=e({components:{VOptions:v},setup:()=>{const e=u();p((()=>{}));const l=u([{insert:"Hello "},{insert:"World!",attributes:{bold:!0}},{insert:"\n"}]),t=u("");let a=null;return{selectedTheme:u("snow"),selectedToolbar:u("essential"),myEditor:e,clickMe:()=>{t.value=null==a?void 0:a.root.innerHTML,console.log(null==a?void 0:a.root.innerHTML)},myContent:l,myHTML:t,handleReady:e=>{a=e},handleTextChange:(e,l,o)=>{t.value=null==a?void 0:a.root.innerHTML}}}});const T={class:"flex flex-col md:flex-row gap-3"},w={class:"flex flex-col w-28"},k=n("div",{class:"text-sm text-gray-400 font-bold mb-2"},"THEME",-1),M={class:"flex md:flex-col gap-2 mb-4"},V=n("div",{class:"text-sm text-gray-400 font-bold mb-2"},"TOOLBAR",-1),C={class:"flex md:flex-col gap-2 mb-4"},L={class:"initial flex-1 flex flex-col"};x.render=function(e,l,o,s,r,i){const d=m("VOptions"),c=m("QuillEditor");return t(),a("div",T,[n("div",w,[k,n("div",M,[n(d,{name:"theme",selected:e.selectedTheme,"onUpdate:selected":l[1]||(l[1]=l=>e.selectedTheme=l),options:[{value:"snow",label:"Snow"},{value:"bubble",label:"Bubble"},{value:"",label:"None"}]},null,8,["selected"])]),V,n("div",C,[n(d,{name:"toolbar",selected:e.selectedToolbar,"onUpdate:selected":l[2]||(l[2]=l=>e.selectedToolbar=l),options:[{value:"essential",label:"Essential"},{value:"minimal",label:"Minimal"},{value:"full",label:"Full"},{value:"",label:"None"}]},null,8,["selected"])])]),n("div",L,[n(c,{ref:"myEditor",class:"h-80 flex-1",content:e.myContent,"onUpdate:content":l[3]||(l[3]=l=>e.myContent=l),onReady:e.handleReady,onTextChange:e.handleTextChange,theme:e.selectedTheme,toolbar:e.selectedToolbar},null,8,["content","onReady","onTextChange","theme","toolbar"])])])};const U={class:"border-t border-gray-200 block py-4"},E=n("header",{class:"text-center pb-5"},[n("h2",{class:"font-semibold border-none mb-2"},"Interactive Demo"),n("p",{class:"mx-auto max-w-lg my-2"}," What you see is what you get. Try out our interactive demo and discover all the features packed into VueUpQuill. ")],-1),H={class:"frontpage sponsors"},O=n("h2",null,"Sponsors",-1),S=n("br",null,null,-1),A=n("a",{href:"https://paypal.me/bledex",target:"_blank",rel:"noopener"},"Buy me a cup of coffee",-1),B='{"title":"Home","description":"","frontmatter":{"home":true,"heroImage":"/quill.svg","actionText":"Get Started","actionLink":"/guide/","altActionText":"Learn More","altActionLink":"/guide/why","features":[{"title":"💚 Built With Vue 3","details":"More powerful and performant framework than ever before."},{"title":"🧙‍♂️ Fully Typescript","details":"VueUpQuill source code is written entirely in TypeScript."},{"title":"🛠️ Easy To Use","details":"Straightforward implementation through a simple API."}],"footer":"MIT Licensed | Copyright © 2020-present Luthfi Masruri & VueUpQuill Contributors"},"relativePath":"index.md","lastUpdated":1615952230326}',R={};const I=Object.assign(R,{expose:[],setup:function(e){return(e,l)=>{const s=m("ClientOnly");return t(),a("div",null,[n("div",U,[E,n(s,null,{default:f((()=>[n(x)])),_:1})]),n("div",H,[O,(t(!0),a(c,null,o(b(h),(({href:l,src:o,name:s})=>(t(),a("a",{href:l,target:"_blank",rel:"noopener","aria-label":"sponsor-img"},[n("img",{src:e.$withBase(o),alt:s},null,8,["src","alt"])],8,["href"])))),256)),S,A])])}}});export default I;export{B as __pageData};
