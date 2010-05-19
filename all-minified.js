(function(b){b.widget("ui.spinner",{_create:function(){this.currVal=0;this._draw();this._mousewheel();this.options.showButtons!=="always"&&this.buttons.hide();this._aria()},_draw:function(){var g=this,l=g.options,c=g.element.outerWidth(),d=g.element.width()-l.buttonWidth,f=g.element.css("margin-left"),h=g.element.css("margin-right"),e=g.element.addClass("ui-spinner-input").attr("autocomplete","off").wrap(g._uiSpinnerHtml()).css({"margin-left":"0px","margin-right":"0px",width:d}).bind("keydown.spinner",
function(o){return g._keyDown(o)}).bind("keyup.spinner",function(o){return g._keyUp(o)}).bind("blur.spinner",function(){g.source=="keyboard"&&g._stop();g._readValue()}).parent().append(g._buttonHtml()).width(c).css({"margin-left":f,"margin-right":h}).hover(function(){},function(){g.source=="mouse"&&g._stop()});!b.support.opacity&&e.css("display")=="inline-block"&&b.browser.version<8&&e.css("display","inline");this.element.attr("id",function(){this.id&&e.attr("id","ui-spinner-"+this.id)});l.disabled&&
this.disable();this.buttons=e.find(".ui-spinner-button").css("width",l.buttonWidth).bind("mousedown",function(o){var n=b(this).hasClass("ui-spinner-up")?1:-1;g._stop();g.source="mouse";g._spin(n,o.shiftKey);g.options.disabled||b(this).addClass("ui-state-active");return true}).bind("mouseup",function(){g._stop();g.element.focus();b(this).removeClass("ui-state-active")}).hover(function(){g.options.disabled||b(this).addClass("ui-state-hover")},function(){b(this).removeClass("ui-state-active ui-state-hover")});
b.browser.msie&&this.buttons.bind("dblclick",function(){b(this).trigger("mousedown").trigger("mouseup")});g.uiSpinner=e},_uiSpinnerHtml:function(){return'<span role="spinbutton" class="ui-spinner ui-widget ui-corner-all '+(this.options.spinnerClass||"")+" ui-spinner-"+this.options.dir+'"></span>'},_buttonHtml:function(){return'<a class="ui-spinner-button ui-spinner-up ui-state-default ui-corner-t'+this.options.dir.substr(-1,1)+'"><span class="ui-icon ui-icon-triangle-1-n">&#9650;</span></a><a class="ui-spinner-button ui-spinner-down ui-state-default ui-corner-b'+
this.options.dir.substr(-1,1)+'"><span class="ui-icon ui-icon-triangle-1-s">&#9660;</span></a>'},_keyDown:function(g){var l;l=g.keyCode;var c=this.options,d=b.ui.keyCode;if(this.timer)return false;if(l==d.UP||l==d.DOWN||l==d.PAGE_UP||l==d.PAGE_DOWN||l==d.RIGHT||l==d.LEFT){g=l==d.PAGE_UP||l==d.PAGE_DOWN||g.shiftKey;l=l==d.UP||l==d.PAGE_UP||l==d.RIGHT?1:-1;this.source="keyboard";this._spin(l,g);return false}else if(l==d.HOME&&!g.shiftKey&&c.max!==null){this.value(c.max);return false}else if(l==d.END&&
!g.shiftKey&&c.min!==null){this.value(c.min);return false}else if(l==d.ENTER){this._readValue();return false}else return true},_keyUp:function(){this._stop()},_spin:function(g,l){var c,d;d=this.options;var f=this;this.spinCounter=this.spinCounter||0;this.spinStage=this.spinStage||0;c=d.increments[this.spinStage];c.count&&this.spinCounter>=c.count&&this.spinStage++;c=d.increments[this.spinStage];d=d.next(this.currVal,c[l?"page":"increment"],g,d.min,d.max,d.step);if(d!==false){this.timer=setTimeout(function(){f._spin(g,
l)},c.delay);this.value(d);this.spinCounter++}},_stop:function(){if(this.timer){clearTimeout(this.timer);this.source=this.timer=this.spinCounter=this.spinStage=null;this._trigger("stop",null,{value:this.currVal})}},value:function(g,l){if(arguments.length==0)return this.currVal;else{this.currVal=g;l||this._trigger("change",null,{value:g,spinning:!!this.timer});this.element.val(this._formatted());this._aria()}},_readValue:function(){var g=this.options.parse(this.element.val());g!=this._formatted()&&
this.value(g)},_formatted:function(){var g=this.options;return g.format(this.currVal,g.precision,g.radixPoint)},_mousewheel:function(){var g=this;b.fn.mousewheel&&g.options.mouseWheel&&this.element.mousewheel(function(l,c){c=b.browser.opera?-c/Math.abs(c):c;if(!g._start(l))return false;g._spin((c>0?1:-1)*g._step(),l);g.timeout&&window.clearTimeout(g.timeout);g.timeout=window.setTimeout(function(){if(g.spinning){g._stop(l);g._change(l)}},400);l.preventDefault()})},_aria:function(){var g=this.options;
this.uiSpinner&&this.uiSpinner.attr("aria-valuemin",g.format(g.min)).attr("aria-valuemax",g.format(g.max)).attr("aria-valuenow",this._formatted())},destroy:function(){b.fn.mousewheel&&this.element.unmousewheel();this.element.removeClass("ui-spinner-input").removeAttr("disabled").removeAttr("autocomplete").removeData("spinner").unbind(".spinner");if(this.uiSpinner)if(this.uiSpinner.parent()[0]!=null)this.uiSpinner.replaceWith(this.element);else return this.element.clone(true)},enable:function(){this.element.removeAttr("disabled").siblings().removeAttr("disabled").parent().removeClass("ui-spinner-disabled ui-state-disabled");
this.options.disabled=false},disable:function(){this.element.attr("disabled",true).siblings().attr("disabled",true).parent().addClass("ui-spinner-disabled ui-state-disabled");this.options.disabled=true}});b.extend(b.ui.spinner.prototype,{version:"@VERSION",eventPrefix:"spin",options:{initValue:0,defaultValue:0,precision:0,radixPoint:".",min:null,max:null,dir:"ltr",step:1,showButtons:"always",buttonWidth:16,increments:[{count:2,increment:1,page:10,delay:500},{count:50,increment:1,page:10,delay:50},
{count:null,increment:10,page:50,delay:50}],format:function(g,l,c){return g.toFixed(l).replace(".",c)},parse:function(g){return parseFloat(g)},next:function(g,l,c,d,f,h){return c>0&&g==f||c<0&&g==d?false:Math.max(d,Math.min(f,g+l*h*c))}}})})(jQuery);if(!this.JSON)this.JSON={};
(function(){function b(n){return n<10?"0"+n:n}function g(n){d.lastIndex=0;return d.test(n)?'"'+n.replace(d,function(k){var p=e[k];return typeof p==="string"?p:"\\u"+("0000"+k.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function l(n,k){var p,q,r,t,a=f,j,m=k[n];if(m&&typeof m==="object"&&typeof m.toJSON==="function")m=m.toJSON(n);if(typeof o==="function")m=o.call(k,n,m);switch(typeof m){case "string":return g(m);case "number":return isFinite(m)?String(m):"null";case "boolean":case "null":return String(m);
case "object":if(!m)return"null";f+=h;j=[];if(Object.prototype.toString.apply(m)==="[object Array]"){t=m.length;for(p=0;p<t;p+=1)j[p]=l(p,m)||"null";r=j.length===0?"[]":f?"[\n"+f+j.join(",\n"+f)+"\n"+a+"]":"["+j.join(",")+"]";f=a;return r}if(o&&typeof o==="object"){t=o.length;for(p=0;p<t;p+=1){q=o[p];if(typeof q==="string")if(r=l(q,m))j.push(g(q)+(f?": ":":")+r)}}else for(q in m)if(Object.hasOwnProperty.call(m,q))if(r=l(q,m))j.push(g(q)+(f?": ":":")+r);r=j.length===0?"{}":f?"{\n"+f+j.join(",\n"+f)+
"\n"+a+"}":"{"+j.join(",")+"}";f=a;return r}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+b(this.getUTCMonth()+1)+"-"+b(this.getUTCDate())+"T"+b(this.getUTCHours())+":"+b(this.getUTCMinutes())+":"+b(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var c=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
d=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,f,h,e={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},o;if(typeof JSON.stringify!=="function")JSON.stringify=function(n,k,p){var q;h=f="";if(typeof p==="number")for(q=0;q<p;q+=1)h+=" ";else if(typeof p==="string")h=p;if((o=k)&&typeof k!=="function"&&(typeof k!=="object"||typeof k.length!=="number"))throw new Error("JSON.stringify");return l("",
{"":n})};if(typeof JSON.parse!=="function")JSON.parse=function(n,k){function p(r,t){var a,j,m=r[t];if(m&&typeof m==="object")for(a in m)if(Object.hasOwnProperty.call(m,a)){j=p(m,a);if(j!==undefined)m[a]=j;else delete m[a]}return k.call(r,t,m)}var q;n=String(n);c.lastIndex=0;if(c.test(n))n=n.replace(c,function(r){return"\\u"+("0000"+r.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(n.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){q=eval("("+n+")");return typeof k==="function"?p({"":q},""):q}throw new SyntaxError("JSON.parse");}})();
(function(b){var g,l,c,d,f,h,e,o,n,k,p,q,r,t;f=b.Colour=function(a){if(!(this instanceof f))return new f(a);if(!a)throw"Invalid colour specification";if(a instanceof f){this.hsl=a.hsl;this.rgb=a.rgb}else if(a.h!==undefined&&a.s!==undefined&&a.l!==undefined)this.hsl=a;else if(typeof a=="string"){this.rgb=g(a)||p(a)||g(f.swatches[a.toLowerCase()]);if(!this.rgb){this.hsl=q(a);if(!this.hsl)throw"Invalid colour specification";}}else if(a.r!==undefined&&a.g!==undefined&&a.b!==undefined)this.rgb=a};f.prototype=
{_makeRGB:function(){if(typeof this.rgb=="undefined")this.rgb=d(this.hsl)},_makeHSL:function(){if(typeof this.hsl=="undefined")this.hsl=c(this.rgb)},luma:function(){this._makeRGB();return(0.3*this.rgb.r+0.59*this.rgb.g+0.11*this.rgb.b)/255},red:function(a){this._makeRGB();return typeof a=="undefined"?this.rgb.r:new f({r:parseInt(a,10),g:this.rgb.g,b:this.rgb.b,a:this.rgb.a})},green:function(a){this._makeRGB();return typeof a=="undefined"?this.rgb.g:new f({r:this.rgb.r,g:parseInt(a,10),b:this.rgb.b,
a:this.rgb.a})},blue:function(a){this._makeRGB();return typeof a=="undefined"?this.rgb.b:new f({r:this.rgb.r,g:this.rgb.g,b:parseInt(a,10),a:this.rgb.a})},hue:function(a){this._makeHSL();return typeof a=="undefined"?this.hsl.h:new f({h:parseFloat(a),s:this.hsl.s,l:this.hsl.l,a:this.hsl.a})},saturation:function(a){this._makeHSL();return typeof a=="undefined"?this.hsl.s:new f({h:this.hsl.h,s:parseFloat(a),l:this.hsl.l,a:this.hsl.a})},lightness:function(a){this._makeHSL();return typeof a=="undefined"?
this.hsl.l:new f({h:this.hsl.h,s:this.hsl.s,l:parseFloat(a),a:this.hsl.a})},alpha:function(a){if(arguments.length===0)return(this.hsl||this.rgb).a;else{a=a===null||a===undefined?undefined:parseFloat(a);return this.hsl?new f({h:this.hsl.h,s:this.hsl.s,l:this.hsl.l,a:a}):new f({r:this.rgb.r,g:this.rgb.g,b:this.rgb.b,a:a})}},lighten:function(a){this._makeHSL();return new f({h:this.hsl.h,s:this.hsl.s,l:this.hsl.l+(1-this.hsl.l)*a,a:this.hsl.a})},darken:function(a){this._makeHSL();return new f({h:this.hsl.h,
s:this.hsl.s,l:this.hsl.l*(1-a),a:this.hsl.a})},invert:function(){this._makeRGB();return new f({r:255-this.rgb.r,g:255-this.rgb.g,b:255-this.rgb.b,a:this.rgb.a})},complement:function(){this._makeHSL();return new f({h:(this.hsl.h+0.5)%1,s:this.hsl.s,l:this.hsl.l,a:this.hsl.a})},desaturate:function(){this._makeHSL();return new f({h:this.hsl.h,s:0,l:this.hsl.l,a:this.hsl.a})},contrast:function(a,j){return new f(this.luma()>0.6?j||"#111":a||"#eee")},analagous:function(){return[this,this.hue(this.hue()-
1/12),this.hue(this.hue()+1/12)]},tetrad:function(){return[this,this.hue(this.hue()+0.25),this.hue(this.hue()+0.5),this.hue(this.hue()+0.75)]},rectTetrad:function(){return[this,this.hue(this.hue()+1/6),this.hue(this.hue()+0.5),this.hue(this.hue()+4/6)]},triad:function(){return[this,this.hue(this.hue()-1/3),this.hue(this.hue()+1/3)]},splitComplementary:function(){return[this,this.hue(this.hue()-5/12),this.hue(this.hue()+5/12)]},toString:function(){return this.toHexString()},toHexString:function(){this._makeRGB();
return l(this.rgb)},toRGBString:function(){this._makeRGB();return r(this.rgb)},toHSLString:function(){this._makeHSL();return t(this.hsl)}};k=function(a){if(a.length==1)a+=a;return Math.max(0,Math.min(255,parseInt(a,16)))};h=function(a){var j=a.charAt(a.length-1)=="%";if(j)a=a.slice(0,a.length-1);return Math.max(0,Math.min(255,Math.round(parseInt(a,10)*(j?2.55:1))))};e=function(a){return a?Math.max(0,Math.min(1,parseFloat(a))):undefined};n=function(a){a=parseInt(a,10)%360;if(a<0)a+=360;return a/360};
o=function(a){return Math.max(0,Math.min(100,parseInt(a,10)))/100};g=f.hexToRGB=function(a){return(a=/^#([\da-f])([\da-f])([\da-f])([\da-f])?$/i.exec(a)||/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i.exec(a))?{r:k(a[1]),g:k(a[2]),b:k(a[3]),a:typeof a[4]=="undefined"||a[4]==""?undefined:k(a[4])/255}:undefined};p=f.cssRGBToRGB=function(a){return(a=/^rgba?\(\s*(-?\d+%?)\s*,\s*(-?\d+%?)\s*,\s*(-?\d+%?)\s*(?:,\s*(-?\d*(?:\.\d+)?)?)?\s*\)$/.exec(a))?{r:h(a[1]),g:h(a[2]),b:h(a[3]),a:e(a[4])}:undefined};
r=f.rgbToCSSRGB=function(a){return"rgb"+(a.a?"a":"")+"("+Math.round(a.r)+", "+Math.round(a.g)+", "+Math.round(a.b)+(a.a?", "+a.a.toFixed(2):"")+")"};t=f.hslToCSSHSL=function(a){return"hsl"+(a.a?"a":"")+"("+Math.round(a.h*360)+", "+Math.round(a.s*100)+"%, "+Math.round(a.l*100)+"%"+(a.a?", "+a.a.toFixed(2):"")+")"};q=f.cssHSLToHSL=function(a){return(a=/^hsla?\(\s*(-?\d+)\s*,\s*(-?\d+%)\s*,\s*(-?\d+%)\s*(?:,\s*(-?\d*(?:\.\d+)?)?)?\s*\)$/.exec(a))?{h:n(a[1]),s:o(a[2]),l:o(a[3]),a:e(a[4])}:undefined};
l=f.rgbToHex=function(a){var j="#"+(a.r<16?"0":"")+a.r.toString(16)+(a.g<16?"0":"")+a.g.toString(16)+(a.b<16?"0":"")+a.b.toString(16);if(a.a!==undefined){a=Math.floor(a.a*255);j+=(a<16?"0":"")+a.toString(16)}return j};c=f.rgbToHSL=function(a){var j,m,u,v,s,y=a.r/255,x=a.g/255,w=a.b/255,z=v=0,A=0;j=Math.max(y,x,w);m=Math.min(y,x,w);A=(m+j)/2;if(A>0){z=u=j-m;if(z>0){z/=A<=0.5?j+m:2-j-m;v=(j-y)/u;s=(j-x)/u;u=(j-w)/u;v=y==j?x==m?5+u:1-s:x==j?w==m?1+v:3-u:y==m?3+s:5-v;v/=6}}return{h:v%1,s:z,l:A,a:a.a}};
d=f.hslToRGB=function(a){var j,m,u,v,s,y,x,w;w=a.h%1;j=a.s;s=a.l;if(w<0)w+=1;m=u=v=s;j=s<=0.5?s*(1+j):s+j-s*j;if(j>0){s=s+s-j;w*=6;y=Math.floor(w);x=j*((j-s)/j)*(w-y);w=s+x;x=j-x;switch(y){case 0:m=j;u=w;v=s;break;case 1:m=x;u=j;v=s;break;case 2:m=s;u=j;v=w;break;case 3:m=s;u=x;v=j;break;case 4:m=w;u=s;v=j;break;case 5:m=j;u=s;v=x;break}}return{r:Math.floor(m*255),g:Math.floor(u*255),b:Math.floor(v*255),a:a.a}};f.swatches={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",
azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",
darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",
greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",
lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",
olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",
slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"}})(this);
(function(b){var g=8,l=50;b.widget("ui.colourComponent",{_create:function(){var c=this;this.element.addClass("colour-component");c.queuedUpdate=null;this.sliderDiv=b("<span/>").addClass("colour-component-slider").appendTo(this.element);this.slider=this.sliderDiv.slider({min:0,max:this.options.scale,step:this.options.step,slide:function(d,f){c.options.colourProxy.set(c.options.colourProxy[c.options.component](f.value),true)},stop:function(d,f){c.options.colourProxy.set(c.options.colourProxy[c.options.component](f.value))}}).data("slider");
this.canvas=b("<canvas/>").addClass("ui-corner-all").attr({width:255,height:20}).appendTo(this.sliderDiv);this._acquireCtx();this.handle=this.sliderDiv.find(".ui-slider-handle").append("<img src='thumb.png' class='colour-component-grippy'>");this.input=b("<input/>").appendTo(this.element);this.input.spinner({min:0,max:this.options.scale,step:this.options.step,precision:this.options.places,change:function(d,f){c.options.colourProxy.set(c.options.colourProxy[c.options.component](c.input.spinner("value")),
f.spinning)},stop:function(){c.options.colourProxy.set(c.options.colourProxy[c.options.component](c.input.spinner("value")))}});this.leftHeader=b("<h4/>").addClass("slider-label").html(this.options.title).appendTo(this.sliderDiv);this.rightHeader=b("<div/>").addClass("slider-label").addClass("slider-label-secondary").html(this.options.title).appendTo(this.sliderDiv).hide();this.shownHeader="left";this.options.colourProxy.change(function(d){c.update(d)})},_acquireCtx:function(){function c(){try{d.ctx=
d.canvas[0].getContext("2d");d.queuedUpdate&&d.update(d.queuedUpdate)}catch(h){if(f<g){typeof G_vmlCanvasManager!="undefined"&&G_vmlCanvasManager.initElement(d.canvas.get(0));setTimeout(c,(Math.pow(2,f)-1)*l);f++}}}var d=this,f=0;c()},update:function(c){var d=c[this.options.component]();this.slider.value(d);if(this.ctx){c=this.options.getGradient(c);var f=this.ctx.createLinearGradient(0,0,255,0);for(i=0;i<c.length;i++)try{f.addColorStop(i*(1/(c.length-1)),c[i].toString())}catch(h){return}this.ctx.fillStyle=
f;this.ctx.fillRect(0,0,256,20);f=c[0].contrast().toString();c=c.slice(-1)[0].contrast().toString();this.leftHeader.css("color",f);this.rightHeader.css("color",c)}else this.queuedUpdate=c;this.input.spinner("value",d,true);d=this.handle.position().left;if(d>120&&this.shownHeader=="right"){this.rightHeader.stop(false,true).hide();this.leftHeader.stop(false,true).show();this.shownHeader="left"}if(d<120&&this.shownHeader=="left"){this.rightHeader.stop(false,true).show();this.leftHeader.stop(false,true).hide();
this.shownHeader="right"}}});b.ui.colourComponent.prototype.options={scale:255,step:1,places:0};b.widget("ui.colourComponentRGB",b.ui.colourComponent.prototype);b.ui.colourComponentRGB.prototype.options={scale:255,step:1,places:0};b.widget("ui.colourComponentHSL",b.ui.colourComponent.prototype);b.ui.colourComponentHSL.prototype.options={scale:1,step:0.01,places:2};b.widget("ui.colourSwatch",{_create:function(){var c=this;this.element.addClass("colour-swatch ui-corner-all");this.swatch=b("<div/>").addClass("colour-swatch-inner ui-corner-all").appendTo(this.element);
this.readout=b("<span class='colour-swatch-readout'/>").click(function(){return false}).appendTo(this.element);this.options.colourProxy&&this.options.colourProxy.change(function(d){c.update(d)});this.element.click(function(d){c.options.click.call(c.options,d,{element:c.element,swatch:c.swatch})})},update:function(c){this.options.colour=this.options.makeColour(c);this.swatch.css({"background-color":this.options.colour.toString()});this.readout.html(this.options.colour.toString())}});b.ui.colourSwatch.prototype.options=
{colour:new Colour("black"),makeColour:function(c){return c},click:function(){this.colourProxy&&this.colourProxy.set(this.colour)}};b.widget("ui.colourSwatchGroup",{_create:function(){var c=this;this.swatches=[];b("<h2/>").html(this.options.title).appendTo(this.element);this.options.colourProxy.change(function(d){c.update(d)});this.element.addClass("colour-swatch-group")},update:function(c,d){var f=this;if(d||this.element.is(":visible")){for(this.colours=this.options.makeColours(c);this.swatches.length<
this.colours.length;)this.swatches.push(b("<span/>").colourSwatch({click:function(){f.options.colourProxy.set(this.colour)}}).appendTo(f.element).data("colourSwatch"));for(;this.swatches.length>this.colours.length;)this.swatches.pop().element.remove();b.each(this.swatches,function(h,e){e.update(f.colours[h])})}}});b.ui.colourSwatchGroup.prototype.options={title:""}})(jQuery);
(function(b){function g(c){var d,f=this;this.colour=new Colour(c||"#000");this.updateQueued=false;this.changeCallbacks=[];this.historyCallbacks=[];this.historyList=[];for(d in Colour.prototype)Object.prototype.toString.call(Colour.prototype[d])==="[object Function]"&&function(h){f[h]=function(){return f.colour[h].apply(f.colour,arguments)}}(d)}function l(c,d){this._cookieName=c||"settings";this._days=d||100;try{this._settings=JSON.parse(this._readCookie())}catch(f){}this._settings=this._settings||
{}}g.prototype={set:function(c,d){if(d){if(!this.histColour)this.histColour=this.colour}else{this.historyList.push(this.histColour||this.colour);this.histColour=null;this._history(c)}this.colour=c;this._change()},getColour:function(){return this.colour},change:function(c){c?this.changeCallbacks.push(c):this._change()},_change:function(){var c,d=this;if(!this.updateQueued){setTimeout(function(){d.updateQueued=false;for(c=0;c<d.changeCallbacks.length;c++)d.changeCallbacks[c].call(d.colour,d.colour)},
0);this.updateQueued=true}},history:function(c){c?this.historyCallbacks.push(c):this._history()},_history:function(c){var d;for(d=0;d<this.historyCallbacks.length;d++)this.historyCallbacks[d].call(this.historyList,this.historyList,c)},toString:function(){return this.colour.toString()}};l.prototype={get:function(c,d){return this._settings[c]||d||null},set:function(c,d){this._settings[c]=d;this._createCookie(JSON.stringify(this._settings),365)},destroy:function(){this._eraseCookie();this._settings=
{}},_createCookie:function(c){var d=new Date;d.setTime(d.getTime()+this._days*24*60*60*1E3);d="; expires="+d.toGMTString();document.cookie=this._cookieName+"="+c+d+"; path=/"},_readCookie:function(){for(var c=this._cookieName+"=",d=document.cookie.split(";"),f=0;f<d.length;f++){for(var h=d[f];h.charAt(0)==" ";)h=h.substring(1,h.length);if(h.indexOf(c)==0)return h.substring(c.length,h.length)}return null},_eraseCookie:function(){createCookie(this._cookieName,"",-1)}};b.ColourProxy=g;b.Settings=l})(this);
(function(b){function g(e){var o;o=window.location.toString().replace(/#[^#]*$/,"");var n=[e.toHexString().substring(1)];e=f.get("palette");if(e!==null){e=e.split(",");b.each(e,function(k,p){n.push(p.substring(1))})}o=[o,"#",n.join("-")].join("");b("#share-url").attr("value",o);window.location=o}function l(){return b.map(window.location.toString().replace(/^[^#]+(#|$)/,"").split("-"),function(e){return e.length?new Colour("#"+e):null})}function c(e,o,n){if(n){var k=new Date;k.setTime(k.getTime()+
n*24*60*60*1E3);n="; expires="+k.toGMTString()}else n="";document.cookie=e+"="+o+n+"; path=/"}function d(e){e=e+"=";for(var o=document.cookie.split(";"),n=0;n<o.length;n++){for(var k=o[n];k.charAt(0)==" ";)k=k.substring(1,k.length);if(k.indexOf(e)==0)return k.substring(e.length,k.length)}return null}var f=new Settings,h;b(function(){function e(k){b("link.theme").each(function(){var p=b(this);p.hasClass(k)?p.attr("media","screen"):p.attr("media","none")});f.set("theme",k)}var o=b("[name=theme]"),n=
f.get("theme","dark-theme");n=="light-theme"?b("#select-light").attr("checked","checked"):b("#select-dark").attr("checked","checked");b("#theme-select").buttonset({text:true});o.change(function(k){e(k.target.value)});e(n)});b(function(){var e,o,n=b("#main-swatch"),k=b("#main-readout"),p=b("#history");updateQueued=false;histList=(histCookie=d("colour-history"))?histCookie.split(","):[];h=new ColourProxy(f.get("current-colour","hotpink"));k.change(function(){try{h.set((new Colour(k.val())).alpha(null))}catch(q){try{h.set((new Colour("#"+
k.val())).alpha(null))}catch(r){}}});h.history(function(q){b("<div/>").addClass("colour-history-swatch ui-corner-all").css({"background-color":q.slice(-1)[0].toString()}).prependTo(p).hide().slideDown();p.children(":gte(250)").remove()});h.history(function(q,r){c("colour-history",b.map(q,function(t){return t.toString()}).slice(-250).join(","),365);g(r)});p.delegate(".colour-history-swatch","click",function(q){h.set(Colour(b(q.target).css("background-color")))});o=[];h.historyList=b.map(histList,function(q){return Colour(q)});
for(e=histList.length;e--;)o.push("<div class='colour-history-swatch ui-corner-all' style='background-color: ",histList[e],";'/>");p.append(o.join(""));h.change(function(){n.css({"background-color":h.toString(),color:h.contrast()});k.css({"border-color":h.contrast().toString(),background:h.toString()+" none",color:h.contrast().toString()}).val(h.toString());f.set("current-colour",h.toString())})});b(function(){rSlider=b("#r-slider").colourComponentRGB({title:"Red",component:"red",getGradient:function(e){return[e.red(0),
e.red(255)]},colourProxy:h}).data("colourComponentRGB");gSlider=b("#g-slider").colourComponentRGB({title:"Green",component:"green",getGradient:function(e){return[e.green(0),e.green(255)]},colourProxy:h}).data("colourComponentRGB");bSlider=b("#b-slider").colourComponentRGB({title:"Blue",component:"blue",getGradient:function(e){return[e.blue(0),e.blue(255)]},colourProxy:h}).data("colourComponentRGB");hSlider=b("#h-slider").colourComponentHSL({title:"Hue",component:"hue",getGradient:function(e){return[e.hue(0),
e.hue(1/6),e.hue(1/3),e.hue(0.5),e.hue(2/3),e.hue(5/6),e.hue(0)]},colourProxy:h}).data("colourComponentHSL");sSlider=b("#s-slider").colourComponentHSL({title:"Saturation",component:"saturation",getGradient:function(e){return[e.saturation(0),e.saturation(1)]},colourProxy:h}).data("colourComponentHSL");lSlider=b("#l-slider").colourComponentHSL({title:"Lightness",component:"lightness",getGradient:function(e){return[e.lightness(0),e.lightness(0.5),e.lightness(1)]},colourProxy:h}).data("colourComponentHSL");
variants=b("#swatch-variants").colourSwatchGroup({makeColours:function(e){return[e,e.invert(),e.complement(),e.desaturate()]},colourProxy:h}).data("colourSwatch");analagous=b("#swatch-analagous").colourSwatchGroup({makeColours:function(e){return e.analagous()},colourProxy:h}).data("colourSwatchGroup");tetrad=b("#swatch-tetrad").colourSwatchGroup({makeColours:function(e){return e.tetrad()},colourProxy:h}).data("colourSwatchGroup");rectTerad=b("#swatch-rect-tetrad").colourSwatchGroup({makeColours:function(e){return e.rectTetrad()},
colourProxy:h}).data("colourSwatchGroup");triad=b("#swatch-triad").colourSwatchGroup({makeColours:function(e){return e.triad()},colourProxy:h}).data("colourSwatchGroup");split=b("#swatch-split").colourSwatchGroup({makeColours:function(e){return e.splitComplementary()},colourProxy:h}).data("colourSwatchGroup");shades=b("#swatch-shades").colourSwatchGroup({makeColours:function(e){return[e.darken(0.5),e.darken(0.25),e,e.lighten(0.25),e.lighten(0.5)]},colourProxy:h}).data("colourSwatchGroup");h.change()});
b(function(){var e,o=f.get("accordion");o=o?b(o).prev():0;b("#swatches").accordion({header:"> h3",autoHeight:false,fillSpace:true,active:o,changestart:function(n,k){k.newContent.colourSwatchGroup("update",h,true);f.set("accordion","#"+k.newContent.attr("id"))}});b(window).bind("resize",function(){e&&clearTimeout(e);e=setTimeout(function(){b("#swatches").accordion("resize");e=null},50)})});b(function(){function e(){var t=[];b("#palette-bag .colour-swatch").each(function(){t.push(b(this).colourSwatch("option",
"colour").toString())});f.set("palette",t.join(","));g(h)}function o(){b("#palette-bag .ui-selected").length===0?b("#delete-colour").button("disable"):b("#delete-colour").button("enable")}function n(t,a){b("<span/>").colourSwatch({click:function(j,m){h.set(this.colour);if(j.ctrlKey||j.shiftKey)m.element.toggleClass("ui-selected");else{b("#palette-bag .ui-selected").removeClass("ui-selected");m.element.addClass("ui-selected")}o()}}).colourSwatch("update",t).css("opacity",0).prependTo(r).animate({opacity:1});
a||e()}var k,p=f.get("palette"),q=l(),r=b("#palette-bag");if(q&&q.length>0){h.set(q[0],true);for(k=q.length;k-- >1;)n(q[k],true);e()}else if(p){p=p.split(",");for(k=p.length;k--;)n(new Colour(p[k]),true)}b("#save-colour").button({icons:{primary:"ui-icon-disk"}}).click(function(){n(h.getColour())});b("#palette-bag").sortable({forcePlaceholderSize:true,scroll:false,tolerance:"pointer",stop:e}).selectable({filter:".colour-swatch",unselected:o,selected:o});b("#delete-colour").button({disabled:true,icons:{primary:"ui-icon-trash"}}).click(function(){b("#palette-bag .ui-selected").remove();
e();o()})});b(function(){b("#disqus_thread").dialog({width:600,height:450,autoOpen:false,title:"Comment on The Colour Toy"});b("#help-frame").dialog({width:600,height:450,autoOpen:false,title:"Colour Toy Help",autoResize:true});b("#share-frame").dialog({width:600,height:130,autoOpen:false,title:"Save & share"});b("#discuss-button").button({icons:{primary:"ui-icon-person"}}).click(function(){b("#disqus_thread").dialog("open")});b("#save-button").button({icons:{primary:"ui-icon-star"}}).click(function(){b("#share-frame").dialog("open")});
b("#help-button").button({icons:{primary:"ui-icon-info"}}).click(function(){b("#help-frame").attr("src","http://docs.google.com/View?id=dc4kk99z_56c7zkfhdx").dialog("open").width(590).height(440)})});b(function(){b.browser.msie&&b.browser.version<7&&b("#ie6-warning").dialog({width:600,title:"Very old browser detected"})})})(jQuery,this);
