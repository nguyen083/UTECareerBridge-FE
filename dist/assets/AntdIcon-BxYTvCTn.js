import{r as c,aP as O,aQ as D,N as F,P as b,R as x,L as l,H as N,F as _,f as G,G as h,_ as H,aR as Q}from"./index-BjGqDy_t.js";import{g as U}from"./index-etMpTjZA.js";var S=c.createContext({});function W(n){return n.replace(/-(.)/g,function(e,o){return o.toUpperCase()})}function q(n,e){F(n,"[@ant-design/icons] ".concat(e))}function k(n){return b(n)==="object"&&typeof n.name=="string"&&typeof n.theme=="string"&&(b(n.icon)==="object"||typeof n.icon=="function")}function I(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return Object.keys(n).reduce(function(e,o){var r=n[o];switch(o){case"class":e.className=r,delete e.class;break;default:delete e[o],e[W(o)]=r}return e},{})}function T(n,e,o){return o?x.createElement(n.tag,l(l({key:e},I(n.attrs)),o),(n.children||[]).map(function(r,a){return T(r,"".concat(e,"-").concat(n.tag,"-").concat(a))})):x.createElement(n.tag,l({key:e},I(n.attrs)),(n.children||[]).map(function(r,a){return T(r,"".concat(e,"-").concat(n.tag,"-").concat(a))}))}function R(n){return O(n)[0]}function E(n){return n?Array.isArray(n)?n:[n]:[]}var J=`
.anticon {
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon > * {
  line-height: 1;
}

.anticon svg {
  display: inline-block;
}

.anticon::before {
  display: none;
}

.anticon .anticon-icon {
  display: block;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon-spin::before,
.anticon-spin {
  display: inline-block;
  -webkit-animation: loadingCircle 1s infinite linear;
  animation: loadingCircle 1s infinite linear;
}

@-webkit-keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`,K=function(e){var o=c.useContext(S),r=o.csp,a=o.prefixCls,i=J;a&&(i=i.replace(/anticon/g,a)),c.useEffect(function(){var s=e.current,m=U(s);D(i,"@ant-design-icons",{prepend:!0,csp:r,attachTo:m})},[])},M=["icon","className","onClick","style","primaryColor","secondaryColor"],d={primaryColor:"#333",secondaryColor:"#E6E6E6",calculated:!1};function V(n){var e=n.primaryColor,o=n.secondaryColor;d.primaryColor=e,d.secondaryColor=o||R(e),d.calculated=!!o}function X(){return l({},d)}var f=function(e){var o=e.icon,r=e.className,a=e.onClick,i=e.style,s=e.primaryColor,m=e.secondaryColor,y=N(e,M),u=c.useRef(),C=d;if(s&&(C={primaryColor:s,secondaryColor:m||R(s)}),K(u),q(k(o),"icon should be icon definiton, but got ".concat(o)),!k(o))return null;var t=o;return t&&typeof t.icon=="function"&&(t=l(l({},t),{},{icon:t.icon(C.primaryColor,C.secondaryColor)})),T(t.icon,"svg-".concat(t.name),l(l({className:r,onClick:a,style:i,"data-icon":t.name,width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true"},y),{},{ref:u}))};f.displayName="IconReact";f.getTwoToneColors=X;f.setTwoToneColors=V;function z(n){var e=E(n),o=_(e,2),r=o[0],a=o[1];return f.setTwoToneColors({primaryColor:r,secondaryColor:a})}function Y(){var n=f.getTwoToneColors();return n.calculated?[n.primaryColor,n.secondaryColor]:n.primaryColor}var Z=["className","icon","spin","rotate","tabIndex","onClick","twoToneColor"];z(Q.primary);var v=c.forwardRef(function(n,e){var o=n.className,r=n.icon,a=n.spin,i=n.rotate,s=n.tabIndex,m=n.onClick,y=n.twoToneColor,u=N(n,Z),C=c.useContext(S),t=C.prefixCls,g=t===void 0?"anticon":t,P=C.rootClassName,j=G(P,g,h(h({},"".concat(g,"-").concat(r.name),!!r.name),"".concat(g,"-spin"),!!a||r.name==="loading"),o),p=s;p===void 0&&m&&(p=-1);var A=i?{msTransform:"rotate(".concat(i,"deg)"),transform:"rotate(".concat(i,"deg)")}:void 0,$=E(y),w=_($,2),B=w[0],L=w[1];return c.createElement("span",H({role:"img","aria-label":r.name},u,{ref:e,tabIndex:p,onClick:m,className:j}),c.createElement(f,{icon:r,primaryColor:B,secondaryColor:L,style:A}))});v.displayName="AntdIcon";v.getTwoToneColor=Y;v.setTwoToneColor=z;export{v as I};
