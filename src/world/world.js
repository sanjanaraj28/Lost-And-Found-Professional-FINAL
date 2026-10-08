import * as THREE from 'three';
function tex(w,h,fn,rep=[1,1]){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...rep);t.colorSpace=THREE.SRGBColorSpace;return t}
const noise=(g,w,h,a)=>{for(let i=0;i<w*h/6;i++){g.fillStyle=`rgba(0,0,0,${Math.random()*a})`;g.fillRect(Math.random()*w,Math.random()*h,2,2)}};
export function makeItem(kind,color){
 const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color,roughness:.6,metalness:kind==='watch'||kind==='key'?.7:.1});
 const add=(geo,x=0,y=0,z=0,rx=0,rz=0,mat=m)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.rotation.set(rx,0,rz);o.castShadow=true;g.add(o);return o};
 const dark=new THREE.MeshStandardMaterial({color:0x151515,roughness:.5});
 if(kind==='umbrella'){add(new THREE.CylinderGeometry(.015,.015,.8),0,0,0,0,Math.PI/2);add(new THREE.ConeGeometry(.2,.35,12,1,true),-.3,0,0,0,Math.PI/2).material=m.clone();add(new THREE.TorusGeometry(.05,.012,8,12,Math.PI),.4,-.05,0,0,0,dark)}
 else if(kind==='watch'){add(new THREE.CylinderGeometry(.12,.12,.04,24),0,0,0,Math.PI/2);add(new THREE.CylinderGeometry(.1,.1,.045,24),0,0,0,Math.PI/2,0,dark);add(new THREE.BoxGeometry(.06,.5,.015),0,.3,0,0,0,dark);add(new THREE.BoxGeometry(.06,.5,.015),0,-.3,0,0,0,dark)}
 else if(kind==='musicbox'){add(new THREE.BoxGeometry(.4,.22,.3),0,0,0);add(new THREE.BoxGeometry(.42,.04,.32),0,.13,0,0,0,new THREE.MeshStandardMaterial({color:0x8a6a45}));add(new THREE.CylinderGeometry(.03,.03,.06),.22,0,0,0,Math.PI/2,dark)}
 else if(kind==='ticket'){add(new THREE.BoxGeometry(.4,.01,.22))}
 else if(kind==='wallet'){add(new THREE.BoxGeometry(.3,.05,.2));add(new THREE.BoxGeometry(.26,.012,.01),0,.03,.06,0,0,dark)}
 else if(kind==='key'){add(new THREE.TorusGeometry(.07,.02,8,16),-.2,0,0);add(new THREE.BoxGeometry(.35,.03,.03),0,0,0);add(new THREE.BoxGeometry(.04,.08,.03),.15,-.04,0)}
 else{add(new THREE.BoxGeometry(.3,.015,.18));add(new THREE.TorusGeometry(.015,.006,6,10),-.12,0,.0,Math.PI/2,0,dark)}
 return g}
export function buildWorld(scene,quality){
 scene.background=new THREE.Color(0x07090b);scene.fog=new THREE.FogExp2(0x0a0d10,.075);
 const floor=tex(256,256,(g,w,h)=>{g.fillStyle='#262a2b';g.fillRect(0,0,w,h);g.strokeStyle='#15191a';for(let i=0;i<=w;i+=64){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.moveTo(0,i);g.lineTo(w,i);g.stroke()}noise(g,w,h,.35)},[8,6]);
 const wall=tex(256,256,(g,w,h)=>{g.fillStyle='#3a4140';g.fillRect(0,0,w,h);noise(g,w,h,.3);g.fillStyle='#2b312f';g.fillRect(0,h*.62,w,h*.38)},[4,1]);
 const wood=tex(128,128,(g,w,h)=>{g.fillStyle='#4a3524';g.fillRect(0,0,w,h);for(let i=0;i<30;i++){g.fillStyle=`rgba(0,0,0,${Math.random()*.2})`;g.fillRect(0,Math.random()*h,w,1)}});
 const std=(map,r=.9)=>new THREE.MeshStandardMaterial({map,roughness:r});
 const box=(w,h,d,x,y,z,mat,cast=true)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;scene.add(m);return m};
 const f=box(8,.1,6,0,-.05,0,std(floor,.5));
 box(8,3,.1,0,1.5,3,std(wall));box(.1,3,6,-4,1.5,0,std(wall));box(.1,3,6,4,1.5,0,std(wall));
 // north wall with window opening
 const nw=std(wall);box(2.6,3,.1,-2.7,1.5,-3,nw);box(2.6,3,.1,2.7,1.5,-3,nw);box(2.8,.9,.1,0,2.55,-3,nw);box(2.8,.9,.1,0,.45,-3,nw);
 box(8,.1,6,0,3.05,0,std(wall));
 // platform view through window
 const view=new THREE.Mesh(new THREE.PlaneGeometry(12,4),new THREE.MeshBasicMaterial({color:0x121a24}));view.position.set(0,1.6,-7);scene.add(view);
 for(let i=0;i<8;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.08),new THREE.MeshBasicMaterial({color:i%3?0xd8c68a:0x8aa6c8}));l.position.set(-4.5+i*1.3,1.5+Math.sin(i)*.5,-6.9);scene.add(l)}
 const train=new THREE.Mesh(new THREE.BoxGeometry(14,1.8,1.5),new THREE.MeshStandardMaterial({color:0x1b2128}));train.position.set(-30,1,-5.5);scene.add(train);
 for(let i=0;i<14;i++){const w=new THREE.Mesh(new THREE.PlaneGeometry(.5,.35),new THREE.MeshBasicMaterial({color:0xcbbf8f}));w.position.set(-6.5+i,.3,.76);train.add(w)}
 // desk
 const wm=std(wood,.6);const desk=box(2.6,.08,1,0,.8,-1.7,wm);box(.1,.8,.9,-1.2,.4,-1.7,wm);box(.1,.8,.9,1.2,.4,-1.7,wm);
 // shelves west with lost items
 for(let y=0;y<4;y++){box(.5,.05,5,-3.7,.4+y*.7,0,wm);for(let k=0;k<7;k++){const h=.15+Math.random()*.3;box(.3,h,.3,-3.7,.43+y*.7+h/2,-2.2+k*.7+Math.random()*.2,new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(Math.random()*.1+.05,.2,.18+Math.random()*.1),roughness:.9}))}}
 // computer
 const screenMat=new THREE.MeshBasicMaterial({color:0x2e5a4a});const comp=box(.55,.4,.08,-.85,1.1,-1.95,new THREE.MeshStandardMaterial({color:0x1a1a1a}));const scr=new THREE.Mesh(new THREE.PlaneGeometry(.46,.32),screenMat);scr.position.set(0,0,.045);comp.add(scr);
 const phone=box(.3,.12,.22,.9,.9,-1.6,new THREE.MeshStandardMaterial({color:0x111111,roughness:.3}));
 // evidence board east
 const board=box(.06,1.4,2.4,3.9,1.6,0,new THREE.MeshStandardMaterial({map:tex(128,128,(g,w,h)=>{g.fillStyle='#6b5a3d';g.fillRect(0,0,w,h);noise(g,w,h,.5)})}));
 // clock (stops at 11:43 late in the story)
 const clock=new THREE.Mesh(new THREE.CircleGeometry(.25,24),new THREE.MeshBasicMaterial({color:0xcfc8b4}));clock.position.set(2.7,2.4,2.93);clock.rotation.y=Math.PI;scene.add(clock);
 const hand=new THREE.Mesh(new THREE.BoxGeometry(.02,.2,.01),new THREE.MeshBasicMaterial({color:0x111111}));hand.position.set(0,.08,.01);clock.add(hand);
 // item spot
 const spot=new THREE.Group();spot.position.set(0,.88,-1.7);scene.add(spot);
 // lights
 scene.add(new THREE.HemisphereLight(0x5a6c80,0x151210,.35));
 const moon=new THREE.DirectionalLight(0x6f8cb0,.5);moon.position.set(0,4,-8);scene.add(moon);
 const lamp=new THREE.PointLight(0xffc27a,14,8,2);lamp.position.set(.4,1.6,-1.7);lamp.castShadow=quality>0;lamp.shadow.mapSize.set(512,512);scene.add(lamp);
 const fl=new THREE.PointLight(0xcfe6ff,5,10,2);fl.position.set(0,2.8,.5);scene.add(fl);
 const flash=new THREE.SpotLight(0xfff2d0,0,14,.45,.5,1.5);flash.castShadow=quality>0;scene.add(flash,flash.target);
 // rain particles in front of window
 const N=quality>0?500:200,pos=new Float32Array(N*3);for(let i=0;i<N;i++){pos.set([(Math.random()-.5)*10,Math.random()*4,-3.3-Math.random()*3],i*3)}
 const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(pos,3));scene.add(new THREE.Points(rg,new THREE.PointsMaterial({color:0x8fa4b8,size:.03,transparent:true,opacity:.6})));
 // dust
 const dp=new Float32Array(150*3);for(let i=0;i<150;i++)dp.set([(Math.random()-.5)*7,Math.random()*2.8,(Math.random()-.5)*5],i*3);
 const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(dp,3));scene.add(new THREE.Points(dg,new THREE.PointsMaterial({color:0xd8cfb0,size:.012,transparent:true,opacity:.35})));
 const hits=[];const itm=(mesh,id,label)=>{mesh.userData={id,label};hits.push(mesh)};
 itm(comp,'computer','Use computer');itm(phone,'phone','Answer phone');itm(board,'board','Evidence board');itm(desk,'desk','Examine item on desk');
 let flick=1;
 return{hits,spot,lamp,flash,train,hand,screenMat,
  update(t,dt,tension){
   const a=rg.attributes.position;for(let i=0;i<N;i++){let y=a.getY(i)-dt*6;if(y<0)y=4;a.setY(i,y)}a.needsUpdate=true;
   flick=Math.random()<.02+.05*tension?.3+Math.random()*.4:1;fl.intensity=5*flick*(.9+.1*Math.sin(t*50));
   if(Math.floor(t/50)%2===0||true){const p=(t%60)/60;train.position.x=p<.5?-30+p*2*60:60}
   hand.parent.rotation.z=0;}}}
