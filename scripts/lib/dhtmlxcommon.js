function dtmlXMLLoaderObject(a,b,c,d){return this.xmlDoc="",this.async="undefined"!=typeof c?c:!0,this.onloadAction=a||null,this.mainObject=b||null,this.waitCall=null,this.rSeed=d||!1,this}function callerFunction(a,b){return this.handler=function(c){return c||(c=window.event),a(c,b),!0}}function getAbsoluteLeft(a){return getOffset(a).left}function getAbsoluteTop(a){return getOffset(a).top}function getOffsetSum(a){for(var b=0,c=0;a;)b+=parseInt(a.offsetTop),c+=parseInt(a.offsetLeft),a=a.offsetParent;return{top:b,left:c}}function getOffsetRect(a){var b=a.getBoundingClientRect(),c=document.body,d=document.documentElement,e=window.pageYOffset||d.scrollTop||c.scrollTop,f=window.pageXOffset||d.scrollLeft||c.scrollLeft,g=d.clientTop||c.clientTop||0,h=d.clientLeft||c.clientLeft||0,i=b.top+e-g,j=b.left+f-h;return{top:Math.round(i),left:Math.round(j)}}function getOffset(a){return a.getBoundingClientRect?getOffsetRect(a):getOffsetSum(a)}function convertStringToBoolean(a){switch("string"==typeof a&&(a=a.toLowerCase()),a){case"1":case"true":case"yes":case"y":case 1:case!0:return!0;default:return!1}}function getUrlSymbol(a){return-1!=a.indexOf("?")?"&":"?"}function dhtmlDragAndDropObject(){return window.dhtmlDragAndDrop?window.dhtmlDragAndDrop:(this.dragStartObject=this.dragStartNode=this.dragNode=this.lastLanding=0,this.tempDOMM=this.tempDOMU=null,this.waitDrag=0,window.dhtmlDragAndDrop=this,this)}function j(){return this.catches||(this.catches=[]),this}function dhtmlXHeir(a,b){for(var c in b)"function"==typeof b[c]&&(a[c]=b[c]);return a}function dhtmlxEvent(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c)}dhtmlx=function(a){for(var b in a)dhtmlx[b]=a[b];return dhtmlx},dhtmlx.extend_api=function(a,b,c){var d=window[a];d&&(window[a]=function(a){if(a&&"object"==typeof a&&!a.tagName){var c,e=d.apply(this,b._init?b._init(a):arguments);for(c in dhtmlx)b[c]&&this[b[c]](dhtmlx[c]);for(c in a)b[c]?this[b[c]](a[c]):0==c.indexOf("on")&&this.attachEvent(c,a[c])}else e=d.apply(this,arguments);return b._patch&&b._patch(this),e||this},window[a].prototype=d.prototype,c&&dhtmlXHeir(window[a].prototype,c))},dhtmlxAjax={get:function(a,b){var c=new dtmlXMLLoaderObject(!0);return c.async=arguments.length<3,c.waitCall=b,c.loadXML(a),c},post:function(a,b,c){var d=new dtmlXMLLoaderObject(!0);return d.async=arguments.length<4,d.waitCall=c,d.loadXML(a,!0,b),d},getSync:function(a){return this.get(a,null,!0)},postSync:function(a,b){return this.post(a,b,null,!0)}},dtmlXMLLoaderObject.prototype.waitLoadFunction=function(a){var b=!0;return this.check=function(){!a||null==a.onloadAction||a.xmlDoc.readyState&&4!=a.xmlDoc.readyState||!b||(b=!1,"function"==typeof a.onloadAction&&a.onloadAction(a.mainObject,null,null,null,a),a.waitCall&&(a.waitCall.call(this,a),a.waitCall=null))}},dtmlXMLLoaderObject.prototype.getXMLTopNode=function(a,b){if(this.xmlDoc.responseXML){var c=this.xmlDoc.responseXML.getElementsByTagName(a);0==c.length&&-1!=a.indexOf(":")&&(c=this.xmlDoc.responseXML.getElementsByTagName(a.split(":")[1]));var d=c[0]}else d=this.xmlDoc.documentElement;if(d)return this._retry=!1,d;if(_isIE&&!this._retry){var e=this.xmlDoc.responseText,b=this.xmlDoc;return this._retry=!0,this.xmlDoc=new ActiveXObject("Microsoft.XMLDOM"),this.xmlDoc.async=!1,this.xmlDoc.loadXML(e),this.getXMLTopNode(a,b)}return dhtmlxError.throwError("LoadXML","Incorrect XML",[b||this.xmlDoc,this.mainObject]),document.createElement("DIV")},dtmlXMLLoaderObject.prototype.loadXMLString=function(a){if(_isIE)this.xmlDoc=new ActiveXObject("Microsoft.XMLDOM"),this.xmlDoc.async=this.async,this.xmlDoc.onreadystatechange=function(){},this.xmlDoc.loadXML(a);else{var b=new DOMParser;this.xmlDoc=b.parseFromString(a,"text/xml")}this.onloadAction&&this.onloadAction(this.mainObject,null,null,null,this),this.waitCall&&(this.waitCall(),this.waitCall=null)},dtmlXMLLoaderObject.prototype.loadXML=function(a,b,c,d){this.rSeed&&(a+=(-1!=a.indexOf("?")?"&":"?")+"a_dhx_rSeed="+(new Date).valueOf()),this.filePath=a,this.xmlDoc=!_isIE&&window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),this.async&&(this.xmlDoc.onreadystatechange=new this.waitLoadFunction(this)),this.xmlDoc.open(b?"POST":"GET",a,this.async),d?(this.xmlDoc.setRequestHeader("User-Agent","dhtmlxRPC v0.1 ("+navigator.userAgent+")"),this.xmlDoc.setRequestHeader("Content-type","text/xml")):b&&this.xmlDoc.setRequestHeader("Content-type","application/x-www-form-urlencoded"),this.xmlDoc.setRequestHeader("X-Requested-With","XMLHttpRequest"),this.xmlDoc.send(c),this.async||new this.waitLoadFunction(this)()},dtmlXMLLoaderObject.prototype.destructor=function(){return this.setXSLParamValue=this.getXMLTopNode=this.xmlNodeToJSON=this.doSerialization=this.loadXMLString=this.loadXML=this.doXSLTransToString=this.doXSLTransToObject=this.doXPathOpera=this.doXPath=this.xmlDoc=this.mainObject=this.onloadAction=this.filePath=this.rSeed=this.async=this._retry=this._getAllNamedChilds=this._filterXPath=null},dtmlXMLLoaderObject.prototype.xmlNodeToJSON=function(a){for(var b={},c=0;c<a.attributes.length;c++)b[a.attributes[c].name]=a.attributes[c].value;for(b._tagvalue=a.firstChild?a.firstChild.nodeValue:"",c=0;c<a.childNodes.length;c++){var d=a.childNodes[c].tagName;d&&(b[d]||(b[d]=[]),b[d].push(this.xmlNodeToJSON(a.childNodes[c])))}return b},dhtmlDragAndDropObject.prototype.removeDraggableItem=function(a){a.onmousedown=null,a.dragStarter=null,a.dragLanding=null},dhtmlDragAndDropObject.prototype.addDraggableItem=function(a,b){a.onmousedown=this.preCreateDragCopy,a.dragStarter=b,this.addDragLanding(a,b)},dhtmlDragAndDropObject.prototype.addDragLanding=function(a,b){a.dragLanding=b},dhtmlDragAndDropObject.prototype.preCreateDragCopy=function(a){return!a&&!window.event||2!=(a||event).button?window.dhtmlDragAndDrop.waitDrag?(window.dhtmlDragAndDrop.waitDrag=0,document.body.onmouseup=window.dhtmlDragAndDrop.tempDOMU,document.body.onmousemove=window.dhtmlDragAndDrop.tempDOMM,!1):(window.dhtmlDragAndDrop.dragNode&&window.dhtmlDragAndDrop.stopDrag(a),window.dhtmlDragAndDrop.waitDrag=1,window.dhtmlDragAndDrop.tempDOMU=document.body.onmouseup,window.dhtmlDragAndDrop.tempDOMM=document.body.onmousemove,window.dhtmlDragAndDrop.dragStartNode=this,window.dhtmlDragAndDrop.dragStartObject=this.dragStarter,document.body.onmouseup=window.dhtmlDragAndDrop.preCreateDragCopy,document.body.onmousemove=window.dhtmlDragAndDrop.callDrag,window.dhtmlDragAndDrop.downtime=(new Date).valueOf(),a&&a.preventDefault&&a.preventDefault(),!1):void 0},dhtmlDragAndDropObject.prototype.callDrag=function(a){if(a||(a=window.event),dragger=window.dhtmlDragAndDrop,!((new Date).valueOf()-dragger.downtime<100)){if(!dragger.dragNode){if(!dragger.waitDrag)return dragger.stopDrag(a,!0);if(dragger.dragNode=dragger.dragStartObject._createDragNode(dragger.dragStartNode,a),!dragger.dragNode)return dragger.stopDrag();dragger.dragNode.onselectstart=function(){return!1},dragger.gldragNode=dragger.dragNode,document.body.appendChild(dragger.dragNode),document.body.onmouseup=dragger.stopDrag,dragger.waitDrag=0,dragger.dragNode.pWindow=window,dragger.initFrameRoute()}if(dragger.dragNode.parentNode!=window.document.body&&dragger.gldragNode){var b=dragger.gldragNode;dragger.gldragNode.old&&(b=dragger.gldragNode.old),b.parentNode.removeChild(b);var c=dragger.dragNode.pWindow;if(b.pWindow&&b.pWindow.dhtmlDragAndDrop.lastLanding&&b.pWindow.dhtmlDragAndDrop.lastLanding.dragLanding._dragOut(b.pWindow.dhtmlDragAndDrop.lastLanding),_isIE){var d=document.createElement("Div");d.innerHTML=dragger.dragNode.outerHTML,dragger.dragNode=d.childNodes[0]}else dragger.dragNode=dragger.dragNode.cloneNode(!0);dragger.dragNode.pWindow=window,dragger.gldragNode.old=dragger.dragNode,document.body.appendChild(dragger.dragNode),c.dhtmlDragAndDrop.dragNode=dragger.dragNode}dragger.dragNode.style.left=a.clientX+15+(dragger.fx?-1*dragger.fx:0)+(document.body.scrollLeft||document.documentElement.scrollLeft)+"px",dragger.dragNode.style.top=a.clientY+3+(dragger.fy?-1*dragger.fy:0)+(document.body.scrollTop||document.documentElement.scrollTop)+"px";var e=a.srcElement?a.srcElement:a.target;dragger.checkLanding(e,a)}},dhtmlDragAndDropObject.prototype.calculateFramePosition=function(a){if(window.name){for(var b=parent.frames[window.name].frameElement.offsetParent,c=0,d=0;b;)c+=b.offsetLeft,d+=b.offsetTop,b=b.offsetParent;if(parent.dhtmlDragAndDrop){var e=parent.dhtmlDragAndDrop.calculateFramePosition(1);c+=1*e.split("_")[0],d+=1*e.split("_")[1]}if(a)return c+"_"+d;this.fx=c,this.fy=d}return"0_0"},dhtmlDragAndDropObject.prototype.checkLanding=function(a,b){a&&a.dragLanding?(this.lastLanding&&this.lastLanding.dragLanding._dragOut(this.lastLanding),this.lastLanding=a,this.lastLanding=this.lastLanding.dragLanding._dragIn(this.lastLanding,this.dragStartNode,b.clientX,b.clientY,b),this.lastLanding_scr=_isIE?b.srcElement:b.target):a&&"BODY"!=a.tagName?this.checkLanding(a.parentNode,b):(this.lastLanding&&this.lastLanding.dragLanding._dragOut(this.lastLanding,b.clientX,b.clientY,b),this.lastLanding=0,this._onNotFound&&this._onNotFound())},dhtmlDragAndDropObject.prototype.stopDrag=function(a,b){if(dragger=window.dhtmlDragAndDrop,!b){dragger.stopFrameRoute();var c=dragger.lastLanding;dragger.lastLanding=null,c&&c.dragLanding._drag(dragger.dragStartNode,dragger.dragStartObject,c,_isIE?event.srcElement:a.target)}dragger.lastLanding=null,dragger.dragNode&&dragger.dragNode.parentNode==document.body&&dragger.dragNode.parentNode.removeChild(dragger.dragNode),dragger.dragNode=0,dragger.gldragNode=0,dragger.fx=0,dragger.fy=0,dragger.dragStartNode=0,dragger.dragStartObject=0,document.body.onmouseup=dragger.tempDOMU,document.body.onmousemove=dragger.tempDOMM,dragger.tempDOMU=null,dragger.tempDOMM=null,dragger.waitDrag=0},dhtmlDragAndDropObject.prototype.stopFrameRoute=function(a){a&&window.dhtmlDragAndDrop.stopDrag(1,1);for(var b=0;b<window.frames.length;b++)try{window.frames[b]!=a&&window.frames[b].dhtmlDragAndDrop&&window.frames[b].dhtmlDragAndDrop.stopFrameRoute(window)}catch(c){}try{parent.dhtmlDragAndDrop&&parent!=window&&parent!=a&&parent.dhtmlDragAndDrop.stopFrameRoute(window)}catch(d){}},dhtmlDragAndDropObject.prototype.initFrameRoute=function(a,b){a&&(window.dhtmlDragAndDrop.preCreateDragCopy(),window.dhtmlDragAndDrop.dragStartNode=a.dhtmlDragAndDrop.dragStartNode,window.dhtmlDragAndDrop.dragStartObject=a.dhtmlDragAndDrop.dragStartObject,window.dhtmlDragAndDrop.dragNode=a.dhtmlDragAndDrop.dragNode,window.dhtmlDragAndDrop.gldragNode=a.dhtmlDragAndDrop.dragNode,window.document.body.onmouseup=window.dhtmlDragAndDrop.stopDrag,window.waitDrag=0,!_isIE&&b&&(!_isFF||1.8>_FFrv)&&window.dhtmlDragAndDrop.calculateFramePosition());try{parent.dhtmlDragAndDrop&&parent!=window&&parent!=a&&parent.dhtmlDragAndDrop.initFrameRoute(window)}catch(c){}for(var d=0;d<window.frames.length;d++)try{window.frames[d]!=a&&window.frames[d].dhtmlDragAndDrop&&window.frames[d].dhtmlDragAndDrop.initFrameRoute(window,!a||b?1:0)}catch(e){}},_OperaRv=_KHTMLrv=_FFrv=_isChrome=_isMacOS=_isKHTML=_isOpera=_isIE=_isFF=!1,-1!=navigator.userAgent.indexOf("Macintosh")&&(_isMacOS=!0),navigator.userAgent.toLowerCase().indexOf("chrome")>-1&&(_isChrome=!0),-1!=navigator.userAgent.indexOf("Safari")||-1!=navigator.userAgent.indexOf("Konqueror")?(_KHTMLrv=parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf("Safari")+7,5)),_KHTMLrv>525?(_isFF=!0,_FFrv=1.9):_isKHTML=!0):-1!=navigator.userAgent.indexOf("Opera")?(_isOpera=!0,_OperaRv=parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf("Opera")+6,3))):-1!=navigator.appName.indexOf("Microsoft")?(_isIE=!0,-1!=navigator.appVersion.indexOf("MSIE 8.0")&&"BackCompat"!=document.compatMode&&(_isIE=8),-1!=navigator.appVersion.indexOf("MSIE 9.0")&&"BackCompat"!=document.compatMode&&(_isIE=8)):(_isFF=!0,_FFrv=parseFloat(navigator.userAgent.split("rv:")[1])),dtmlXMLLoaderObject.prototype.doXPath=function(a,b,c,d){if(_isKHTML||!_isIE&&!window.XPathResult)return this.doXPathOpera(a,b);if(_isIE)return b||(b=this.xmlDoc.nodeName?this.xmlDoc:this.xmlDoc.responseXML),b||dhtmlxError.throwError("LoadXML","Incorrect XML",[b||this.xmlDoc,this.mainObject]),null!=c&&b.setProperty("SelectionNamespaces","xmlns:xsl='"+c+"'"),"single"==d?b.selectSingleNode(a):b.selectNodes(a)||[];var e=b;b||(b=this.xmlDoc.nodeName?this.xmlDoc:this.xmlDoc.responseXML),b||dhtmlxError.throwError("LoadXML","Incorrect XML",[b||this.xmlDoc,this.mainObject]),-1!=b.nodeName.indexOf("document")?e=b:(e=b,b=b.ownerDocument);var f=XPathResult.ANY_TYPE;"single"==d&&(f=XPathResult.FIRST_ORDERED_NODE_TYPE);var g=[],h=b.evaluate(a,e,function(){return c},f,null);if(f==XPathResult.FIRST_ORDERED_NODE_TYPE)return h.singleNodeValue;for(var i=h.iterateNext();i;)g[g.length]=i,i=h.iterateNext();return g},j.prototype.catchError=function(a,b){this.catches[a]=b},j.prototype.throwError=function(a,b,c){return this.catches[a]?this.catches[a](a,b,c):this.catches.ALL?this.catches.ALL(a,b,c):(alert("Error type: "+a+"\nDescription: "+b),null)},window.dhtmlxError=new j,dtmlXMLLoaderObject.prototype.doXPathOpera=function(a,b){var c=a.replace(/[\/]+/gi,"/").split("/"),d=null,e=1;if(!c.length)return[];if("."==c[0])d=[b];else{if(""!=c[0])return[];d=(this.xmlDoc.responseXML||this.xmlDoc).getElementsByTagName(c[e].replace(/\[[^\]]*\]/g,"")),e++}for(;e<c.length;e++)d=this._getAllNamedChilds(d,c[e]);return-1!=c[e-1].indexOf("[")&&(d=this._filterXPath(d,c[e-1])),d},dtmlXMLLoaderObject.prototype._filterXPath=function(a,b){for(var c=[],b=b.replace(/[^\[]*\[\@/g,"").replace(/[\[\]\@]*/g,""),d=0;d<a.length;d++)a[d].getAttribute(b)&&(c[c.length]=a[d]);return c},dtmlXMLLoaderObject.prototype._getAllNamedChilds=function(a,b){var c=[];_isKHTML&&(b=b.toUpperCase());for(var d=0;d<a.length;d++)for(var e=0;e<a[d].childNodes.length;e++)_isKHTML?a[d].childNodes[e].tagName&&a[d].childNodes[e].tagName.toUpperCase()==b&&(c[c.length]=a[d].childNodes[e]):a[d].childNodes[e].tagName==b&&(c[c.length]=a[d].childNodes[e]);return c},dtmlXMLLoaderObject.prototype.xslDoc=null,dtmlXMLLoaderObject.prototype.setXSLParamValue=function(a,b,c){c||(c=this.xslDoc),c.responseXML&&(c=c.responseXML);var d=this.doXPath("/xsl:stylesheet/xsl:variable[@name='"+a+"']",c,"http://www.w3.org/1999/XSL/Transform","single");null!=d&&(d.firstChild.nodeValue=b)},dtmlXMLLoaderObject.prototype.doXSLTransToObject=function(a,b){if(a||(a=this.xslDoc),a.responseXML&&(a=a.responseXML),b||(b=this.xmlDoc),b.responseXML&&(b=b.responseXML),_isIE){d=new ActiveXObject("Msxml2.DOMDocument.3.0");try{b.transformNodeToObject(a,d)}catch(c){d=b.transformNode(a)}}else{this.XSLProcessor||(this.XSLProcessor=new XSLTProcessor,this.XSLProcessor.importStylesheet(a));var d=this.XSLProcessor.transformToDocument(b)}return d},dtmlXMLLoaderObject.prototype.doXSLTransToString=function(a,b){var c=this.doXSLTransToObject(a,b);return"string"==typeof c?c:this.doSerialization(c)},dtmlXMLLoaderObject.prototype.doSerialization=function(a){if(a||(a=this.xmlDoc),a.responseXML&&(a=a.responseXML),_isIE)return a.xml;var b=new XMLSerializer;return b.serializeToString(a)},dhtmlxEventable=function(a){a.attachEvent=function(a,b,c){return a="ev_"+a.toLowerCase(),this[a]||(this[a]=new this.eventCatcher(c||this)),a+":"+this[a].addEvent(b)},a.callEvent=function(a,b){return a="ev_"+a.toLowerCase(),this[a]?this[a].apply(this,b):!0},a.checkEvent=function(a){return!!this["ev_"+a.toLowerCase()]},a.eventCatcher=function(a){var c=[],d=function(){for(var b=!0,d=0;d<c.length;d++)if(null!=c[d])var e=c[d].apply(a,arguments),b=b&&e;return b};return d.addEvent=function(a){return"function"!=typeof a&&(a=eval(a)),a?c.push(a)-1:!1},d.removeEvent=function(a){c[a]=null},d},a.detachEvent=function(a){if(0!=a){var b=a.split(":");this[b[0]].removeEvent(b[1])}},a.detachAllEvents=function(){for(var a in this)0==a.indexOf("ev_")&&delete this[a]}},function(){var a=dhtmlx.message=function(b,c,d,e){a.area||(a.area=document.createElement("DIV"),a.area.style.cssText="position:absolute;right:5px;width:250px;z-index:100;",a.area.className="dhtmlx_message_area",a.area.style[a.defPosition]="5px",document.body.appendChild(a.area)),"object"!=typeof b&&(b={text:b,type:c,lifetime:d,id:e}),b.type=b.type||"info",b.id=b.id||a.uid(),b.lifetime=b.lifetime||a.defTimeout,a.hide(b.id);var f=document.createElement("DIV");return f.style.cssText="border-radius:4px; padding:4px 4px 4px 20px;background-color:#FFFFCC;font-size:12px;font-family:Tahoma;color:navy;z-index: 10000;margin:5px;border:1px solid lightgrey;",f.innerHTML=b.text,f.className=b.type,"bottom"==a.defPosition&&a.area.firstChild?a.area.insertBefore(f,a.area.firstChild):a.area.appendChild(f),a.timers[b.id]=window.setTimeout(function(){a.hide(b.id)},b.lifetime),a.pull[b.id]=f,b.id};a.defTimeout=4e3,a.defPosition="top",a.pull={},a.timers={},a.seed=(new Date).valueOf(),a.uid=function(){return a.seed++},a.hideAll=function(){for(var b in a.pull)a.hide(b)},a.hide=function(b){var c=a.pull[b];c&&c.parentNode&&(c.parentNode.removeChild(c),window.clearTimeout(a.timers[b]),delete a.pull[b])}}();
//# sourceMappingURL=dhtmlxcommon.map