import{Camera as e,Mesh as t,Plane as n,Program as r,Renderer as i,Texture as a,Transform as o}from"https://esm.sh/ogl@1.0.11";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function s(e,t){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>e.apply(this,r),t)}}function c(e,t,n){return e+(t-e)*n}function l(e){Object.getOwnPropertyNames(Object.getPrototypeOf(e)).forEach(t=>{t!==`constructor`&&typeof e[t]==`function`&&(e[t]=e[t].bind(e))})}function u(e,t,n=`700 100px "Plus Jakarta Sans"`,r=`white`){let i=document.createElement(`canvas`),o=i.getContext(`2d`);o.font=n;let s=o.measureText(t),c=Math.ceil(s.width),l=Math.ceil(parseInt(n,10))||30;i.width=c+20,i.height=l+20,o.font=n,o.fillStyle=r,o.textBaseline=`middle`,o.textAlign=`center`,o.clearRect(0,0,i.width,i.height),o.fillText(t,i.width/2,i.height/2);let u=new a(e,{generateMipmaps:!1});return u.image=i,u.needsUpdate=!0,{texture:u,width:i.width,height:i.height}}var d=class{constructor({gl:e,plane:t,renderer:n,text:r,textColor:i=`#ffffff`,font:a=`700 100px "Plus Jakarta Sans"`}){l(this),this.gl=e,this.plane=t,this.renderer=n,this.text=r,this.textColor=i,this.font=a,this.createMesh()}createMesh(){let{texture:e,width:i,height:a}=u(this.gl,this.text,this.font,this.textColor),o=new n(this.gl),s=new r(this.gl,{vertex:`
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragment:`
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,uniforms:{tMap:{value:e}},transparent:!0});this.mesh=new t(this.gl,{geometry:o,program:s});let c=i/a,l=this.plane.scale.y*.42,d=l*c;this.mesh.scale.set(d,l,1),this.mesh.position.y=-this.plane.scale.y*.5-l*.35,this.mesh.setParent(this.plane)}},f=class{constructor({geometry:e,gl:t,image:n,index:r,length:i,renderer:a,scene:o,screen:s,text:c,viewport:l,bend:u,textColor:d,borderRadius:f=0,font:p}){this.extra=0,this.geometry=e,this.gl=t,this.image=n,this.index=r,this.length=i,this.renderer=a,this.scene=o,this.screen=s,this.text=c,this.viewport=l,this.bend=u,this.textColor=d,this.borderRadius=f,this.font=p,this.createShader(),this.createMesh(),this.createTitle(),this.onResize()}createShader(){let e=new a(this.gl,{generateMipmaps:!0});this.program=new r(this.gl,{depthTest:!1,depthWrite:!1,vertex:`
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,fragment:`
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Smooth antialiasing for edges
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,uniforms:{tMap:{value:e},uPlaneSizes:{value:[0,0]},uImageSizes:{value:[1,1]},uSpeed:{value:0},uTime:{value:100*Math.random()},uBorderRadius:{value:this.borderRadius}},transparent:!0});let t=new Image;t.crossOrigin=`anonymous`,t.src=this.image,t.onload=()=>{e.image=t,e.needsUpdate=!0,this.program.uniforms.uImageSizes.value=[t.naturalWidth,t.naturalHeight]}}createMesh(){this.plane=new t(this.gl,{geometry:this.geometry,program:this.program}),this.plane.setParent(this.scene)}createTitle(){this.title=new d({gl:this.gl,plane:this.plane,renderer:this.renderer,text:this.text,textColor:this.textColor,font:this.font})}update(e,t){this.plane.position.x=this.x-e.current-this.extra;let n=this.plane.position.x,r=this.viewport.width/2;if(this.bend===0)this.plane.position.y=0,this.plane.rotation.z=0;else{let e=Math.abs(this.bend),t=(r*r+e*e)/(2*e),i=Math.min(Math.abs(n),r),a=t-Math.sqrt(t*t-i*i);this.bend>0?(this.plane.position.y=-a,this.plane.rotation.z=-Math.sign(n)*Math.asin(i/t)):(this.plane.position.y=a,this.plane.rotation.z=Math.sign(n)*Math.asin(i/t))}this.speed=e.current-e.last,this.program.uniforms.uTime.value+=.04,this.program.uniforms.uSpeed.value=this.speed;let i=this.plane.scale.x/2,a=this.viewport.width/2;this.isBefore=this.plane.position.x+i<-a,this.isAfter=this.plane.position.x-i>a,t===`right`&&this.isBefore&&(this.extra-=this.widthTotal,this.isBefore=this.isAfter=!1),t===`left`&&this.isAfter&&(this.extra+=this.widthTotal,this.isBefore=this.isAfter=!1)}onResize({screen:e,viewport:t}={}){e&&(this.screen=e),t&&(this.viewport=t,this.plane.program.uniforms.uViewportSizes&&(this.plane.program.uniforms.uViewportSizes.value=[this.viewport.width,this.viewport.height])),this.scale=this.screen.height/1500;let n=window.innerWidth<=768,r=n?1200:900,i=n?1e3:700;this.plane.scale.y=this.viewport.height*(r*this.scale)/this.screen.height,this.plane.scale.x=this.viewport.width*(i*this.scale)/this.screen.width,this.plane.program.uniforms.uPlaneSizes.value=[this.plane.scale.x,this.plane.scale.y],this.padding=n?1.2:2,this.width=this.plane.scale.x+this.padding,this.widthTotal=this.width*this.length,this.x=this.width*this.index}},p=class{constructor(e,{items:t,bend:n,textColor:r=`#ffffff`,borderRadius:i=0,font:a=`700 36px "Plus Jakarta Sans"`,scrollSpeed:o=2,scrollEase:c=.05}={}){document.documentElement.classList.remove(`no-js`),this.container=e,this.scrollSpeed=o,this.scroll={ease:c,current:0,target:0,last:0},this.onCheckDebounce=s(this.onCheck,200),this.createRenderer(),this.createCamera(),this.createScene(),this.onResize(),this.createGeometry(),this.createMedias(t,n,r,i,a),this.update(),this.addEventListeners()}createRenderer(){this.renderer=new i({alpha:!0,antialias:!0,dpr:Math.min(window.devicePixelRatio||1,2)}),this.gl=this.renderer.gl,this.gl.clearColor(0,0,0,0),this.container.appendChild(this.gl.canvas)}createCamera(){this.camera=new e(this.gl),this.camera.fov=45,this.camera.position.z=20}createScene(){this.scene=new o}createGeometry(){this.planeGeometry=new n(this.gl,{heightSegments:50,widthSegments:100})}createMedias(e,t=1,n,r,i){let a=e&&e.length?e:[{image:`https://i.ibb.co/TQ6v7kX/shardul.jpg`,text:`Shardul Singh`},{image:`https://i.ibb.co/sdSbM852/zaara.jpg`,text:`Zaara Zaidi`},{image:`https://i.ibb.co/Y4pct9nv/samar.jpg`,text:`Samar Nasir`},{image:`https://i.ibb.co/DPS9mcQ0/ojas.jpg`,text:`Ojas Srivastava`},{image:`https://i.ibb.co/TM6gwL5s/tirth.jpg`,text:`Tirth Virkar`},{image:`https://i.ibb.co/BHSpSjhb/ajeet.jpg`,text:`Ajeet Verma`},{image:`https://i.ibb.co/yFvmB972/gaurav.jpg`,text:`Gaurav Kalal`}];this.mediasImages=a.concat(a),this.medias=this.mediasImages.map((e,a)=>new f({geometry:this.planeGeometry,gl:this.gl,image:e.image,index:a,length:this.mediasImages.length,renderer:this.renderer,scene:this.scene,screen:this.screen,text:e.text,viewport:this.viewport,bend:t,textColor:n,borderRadius:r,font:i}))}onTouchDown(e){this.isDown=!0,this.scroll.position=this.scroll.current,this.start=e.touches?e.touches[0].clientX:e.clientX}onTouchMove(e){if(!this.isDown)return;let t=e.touches?e.touches[0].clientX:e.clientX,n=(this.start-t)*(this.scrollSpeed*.025);this.scroll.target=this.scroll.position+n}onTouchUp(){this.isDown=!1,this.onCheck()}onWheel(e){let t=e.deltaY||e.wheelDelta||e.detail;this.scroll.target+=(t>0?this.scrollSpeed:-this.scrollSpeed)*.2,this.onCheckDebounce()}onCheck(){if(!this.medias||!this.medias[0])return;let e=this.medias[0].width,t=e*Math.round(Math.abs(this.scroll.target)/e);this.scroll.target=this.scroll.target<0?-t:t}onResize(){this.screen={width:this.container.clientWidth,height:this.container.clientHeight},this.renderer.setSize(this.screen.width,this.screen.height),this.camera.perspective({aspect:this.screen.width/this.screen.height});let e=this.camera.fov*Math.PI/180,t=2*Math.tan(e/2)*this.camera.position.z;this.viewport={width:t*this.camera.aspect,height:t},this.medias&&this.medias.forEach(e=>e.onResize({screen:this.screen,viewport:this.viewport}))}update(){this.scroll.current=c(this.scroll.current,this.scroll.target,this.scroll.ease);let e=this.scroll.current>this.scroll.last?`right`:`left`;this.medias&&this.medias.forEach(t=>t.update(this.scroll,e)),this.renderer.render({scene:this.scene,camera:this.camera}),this.scroll.last=this.scroll.current,this.raf=window.requestAnimationFrame(this.update.bind(this))}addEventListeners(){this.boundOnResize=this.onResize.bind(this),this.boundOnWheel=this.onWheel.bind(this),this.boundOnTouchDown=this.onTouchDown.bind(this),this.boundOnTouchMove=this.onTouchMove.bind(this),this.boundOnTouchUp=this.onTouchUp.bind(this),window.addEventListener(`resize`,this.boundOnResize),this.container.addEventListener(`mousewheel`,this.boundOnWheel),this.container.addEventListener(`wheel`,this.boundOnWheel),this.container.addEventListener(`mousedown`,this.boundOnTouchDown),this.container.addEventListener(`touchstart`,this.boundOnTouchDown),window.addEventListener(`mousemove`,this.boundOnTouchMove),window.addEventListener(`mouseup`,this.boundOnTouchUp),window.addEventListener(`touchmove`,this.boundOnTouchMove),window.addEventListener(`touchend`,this.boundOnTouchUp)}destroy(){window.cancelAnimationFrame(this.raf),window.removeEventListener(`resize`,this.boundOnResize),this.container.removeEventListener(`mousewheel`,this.boundOnWheel),this.container.removeEventListener(`wheel`,this.boundOnWheel),this.container.removeEventListener(`mousedown`,this.boundOnTouchDown),this.container.removeEventListener(`touchstart`,this.boundOnTouchDown),window.removeEventListener(`mousemove`,this.boundOnTouchMove),window.removeEventListener(`mouseup`,this.boundOnTouchUp),window.removeEventListener(`touchmove`,this.boundOnTouchMove),window.removeEventListener(`touchend`,this.boundOnTouchUp),this.renderer&&this.renderer.gl&&this.renderer.gl.canvas.parentNode&&this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)}},m=document.getElementById(`team-gallery`);if(m){let e=()=>{let e=window.innerWidth<=768;new p(m,{bend:e?1.5:3,textColor:`#ffffff`,borderRadius:.05,font:e?`700 80px "Plus Jakarta Sans"`:`700 100px "Plus Jakarta Sans"`,scrollSpeed:e?1.5:2,scrollEase:.02})};document.fonts&&document.fonts.ready?document.fonts.ready.then(e):window.addEventListener(`load`,e)}function h(e){let t=document.getElementById(e);if(!t)return;let n=t.querySelectorAll(`.rotating-item`),r=0;setInterval(()=>{let e=n[r];r=(r+1)%n.length;let t=n[r];e.classList.remove(`active`),e.classList.add(`exit`),t.classList.remove(`exit`),t.classList.add(`active`),setTimeout(()=>{e.classList.remove(`exit`)},600)},3500)}window.addEventListener(`load`,()=>{h(`trad-rotator-1`),h(`our-rotator-1`)});