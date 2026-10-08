import * as THREE from 'three';
import {buildWorld,makeItem} from './world/world.js';
import {SHIFTS,ENDINGS,ending} from './story/story.js';
import * as store from './save/save.js';
import * as snd from './audio/audio.js';
const $=id=>document.getElementById(id);
const settings=store.loadSettings();let S=store.newState();let mode='menu';
let renderer,scene,camera,world;
try{
 const c=$('game');renderer=new THREE.WebGLRenderer({canvas:c,antialias:true});
 if(!renderer.getContext())throw new Error('no webgl')
}catch(e){document.body.innerHTML='<div style="padding:40px;color:#ccc;font-family:Georgia">WebGL is not available. Please use a current Chrome, Edge or Firefox with hardware acceleration enabled.</div>';throw e}
renderer.shadowMap.enabled=true;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(70,1,.05,40);camera.position.set(0,1.65,1.5);camera.rotation.order='YXZ';
world=buildWorld(scene,1);
function resize(){renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const hud=$('hud'),prompt=$('prompt');let subT;
function sub(t,ms=5000){if(!settings.subs)return;$('sub').textContent=t;clearTimeout(subT);subT=setTimeout(()=>$('sub').textContent='',ms)}
function fade(text,cb){const f=$('fade');f.textContent=text;f.style.opacity=1;setTimeout(()=>{cb&&cb();setTimeout(()=>f.style.opacity=0,1200)},1500)}
// ---- overlays
function overlay(html,m='ui'){mode=m;document.exitPointerLock?.();$('panel').innerHTML=html;$('ov').classList.add('on')}
function closeOverlay(){$('ov').classList.remove('on');mode='play'}
const btn=(label,id)=>`<button data-a="${id}">${label}</button>`;
document.addEventListener('click',e=>{const a=e.target?.dataset?.a;if(!a)return;snd.ui();actions[a]?.(e.target)});
function showMenu(){mode='menu';hud.style.display='none';$('ov').classList.remove('on');$('menu').classList.add('on');
 const has=!!store.load();$('mbtn').innerHTML=btn('New Game','new')+btn('Continue','cont').replace('<button',has?'<button':'<button disabled style="opacity:.3"')+btn('Settings','set')+btn('Credits','cred')}
const actions={
 new(){S=store.newState();start()},cont(){const s=store.load();if(!s){$('merr').textContent='No valid save found.';return}S=s;start()},
 set(){overlay(`<h2>Settings</h2>`+[['master','Master Volume'],['music','Music'],['sfx','Effects'],['sens','Mouse Sensitivity']].map(([k,l])=>`<div class="row">${l}<br><input type="range" min="0" max="${k==='sens'?3:1}" step="0.05" value="${settings[k]}" data-k="${k}"></div>`).join('')+`<div class="row"><label><input type="checkbox" id="subs" ${settings.subs?'checked':''}> Subtitles</label></div>`+btn('Fullscreen','fs')+btn('Back','back'),mode==='menu'?'menu':'ui')},
 fs(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.()},
 cred(){overlay(`<h2>Credits</h2><div class="row">LOST &amp; FOUND — an original mystery.<br>Built with Three.js and Vite. All audio and textures are procedural.</div>`+btn('Back','back'),'menu')},
 back(){if($('menu').classList.contains('on')){$('ov').classList.remove('on');mode='menu'}else resume()},
 resume,
 save(){const ok=store.save(S);sub(ok?'Game saved.':'Could not save (storage unavailable).',2500)},
 menu(){store.save(S);$('ov').classList.remove('on');showMenu()},
 inv(){inventory()},ev(){board()},
 exit(){$('ov').classList.remove('on');mode='menu';resume()}};
document.addEventListener('input',e=>{const k=e.target.dataset?.k;if(k){settings[k]=+e.target.value;store.saveSettings(settings);snd.setVol(settings)}if(e.target.id==='subs'){settings.subs=e.target.checked;store.saveSettings(settings)}});
function resume(){closeOverlay();mode='play';renderer.domElement.requestPointerLock?.()}
function start(){$('menu').classList.remove('on');$('ov').classList.remove('on');hud.style.display='block';snd.init(settings);mode='play';camera.position.set(0,1.65,1.5);yaw=0;pitch=0;beginShift();renderer.domElement.requestPointerLock?.()}
// ---- shift flow
let itemMesh=null,examined={};
function cur(){return SHIFTS[S.shift]}
function beginShift(){const sh=cur();examined={};if(itemMesh){world.spot.remove(itemMesh);itemMesh=null}
 snd.tension(S.shift/(SHIFTS.length-1));snd.ring();
 setTimeout(()=>{sub(sh.title+' — '+sh.call,8000);itemMesh=makeItem(sh.kind,sh.color);world.spot.add(itemMesh);snd.thud()},1800);
 $('info').textContent=sh.title;store.save(S)}
function inspect(){const sh=cur();if(!itemMesh)return;snd.pick();
 overlay(`<h2>${sh.name}</h2><div class="dim row">Case ${String(S.shift+1).padStart(3,'0')} · Logged ${sh.date}</div><canvas id="ic" width="640" height="260" style="width:100%;background:#080a0c;border:1px solid #20282b;cursor:grab"></canvas><div class="row dim">Drag to rotate. Examine each part.</div><div id="cl">${sh.clues.map((c,i)=>btn('Examine: '+c.part,'ex'+i)).join('')}</div><div id="ct" class="row"></div>${btn('Done','back')}${btn('Decide owner','decide')}`,'inspect');
 renderInspect(sh);refreshClues()}
function refreshClues(){const sh=cur();$('ct').innerHTML=sh.clues.filter((c,i)=>examined[i]).map(c=>`<div>◆ <b>${c.part}:</b> ${c.text}</div>`).join('')}
for(let i=0;i<3;i++)actions['ex'+i]=()=>{const c=cur().clues[i];if(!c)return;examined[i]=true;const id=S.shift+'-'+i;if(!S.clues.find(x=>x.id===id))S.clues.push({id,text:c.text,part:c.part,item:cur().name,tags:c.tags});refreshClues()};
let ir,irq;
function renderInspect(sh){const c=$('ic');if(!c)return;if(!ir)ir=new THREE.WebGLRenderer({canvas:document.createElement('canvas'),antialias:true});
 const can=c;const g=can.getContext('2d');const s=new THREE.Scene();const cam=new THREE.PerspectiveCamera(40,640/260,.1,10);cam.position.set(0,.2,1.4);cam.lookAt(0,0,0);
 s.add(new THREE.HemisphereLight(0xffffff,0x222222,1.4));const dl=new THREE.DirectionalLight(0xffe2b0,2);dl.position.set(1,2,2);s.add(dl);
 const m=makeItem(sh.kind,sh.color);m.scale.setScalar(2);s.add(m);ir.setSize(640,260);let drag=false,rx=.3,ry=0;
 can.onmousedown=()=>drag=true;addEventListener('mouseup',()=>drag=false);can.onmousemove=e=>{if(drag){ry+=e.movementX*.01;rx+=e.movementY*.01}};
 cancelAnimationFrame(irq);(function loop(){if(mode!=='inspect'||!$('ic'))return;if(!drag)ry+=.004;m.rotation.set(rx,ry,0);ir.render(s,cam);g.clearRect(0,0,640,260);g.drawImage(ir.domElement,0,0);irq=requestAnimationFrame(loop)})()}
actions.decide=()=>{const sh=cur();const miss=sh.clues.filter((c,i)=>!examined[i]).length;
 overlay(`<h2>Identify the owner</h2><div class="row dim">${miss?miss+' part(s) not yet examined.':'All clues examined.'}</div>`+sh.owners.map((o,i)=>btn(o,'own'+i)).join('<br>')+`<br><br>${btn('Report to station manager','report')}${btn('Keep investigating','back')}`,'ui')};
for(let i=0;i<3;i++)actions['own'+i]=()=>decide(i);
actions.report=()=>{S.flags.reported++;finish('You report the item to the station manager. He thanks you too quickly.')};
function decide(i){const sh=cur();const right=i===sh.correct;
 if(sh.final){S.flags.chose=['self','shelf','burn'][i];return endGame()}
 if(right)S.flags.returned++;else S.flags.kept++;
 finish(right?'Returned. The owner is gone before you can ask a question.':'You hand it over. Something about it feels wrong.')}
function finish(msg){closeOverlay();sub(msg,4000);S.shift++;S.flags.reported=S.flags.reported;
 setTimeout(()=>fade(cur().title,()=>{beginShift();renderer.domElement.requestPointerLock?.()}),2500)}
function endGame(){const key=ending(S.flags),[t,txt]=ENDINGS[key];mode='end';store.save({...store.newState()});
 overlay(`<h1 style="font-size:28px;letter-spacing:.3em">${t}</h1><div class="row" style="margin:24px 0;font-size:17px">${txt}</div>${btn('Main Menu','exit2')}`,'end')}
actions.exit2=()=>{$('ov').classList.remove('on');showMenu()};
// ---- inventory / board / computer / phone
function inventory(){overlay(`<h2>Inventory &amp; Evidence</h2>`+(S.clues.length?S.clues.map(c=>`<div class="row">◆ <b>${c.item}</b> — ${c.part}: ${c.text}</div>`).join(''):'<div class="dim">Nothing yet. Inspect items on the desk.</div>')+btn('Close','back'))}
function board(){const w=700;const ch=S.clues;const pos=ch.map((c,i)=>({x:40+(i%3)*220,y:20+Math.floor(i/3)*90}));let lines='';
 for(let a=0;a<ch.length;a++)for(let b=a+1;b<ch.length;b++){const shared=ch[a].tags.filter(t=>ch[b].tags.includes(t));if(shared.length)lines+=`<line x1="${pos[a].x+90}" y1="${pos[a].y+30}" x2="${pos[b].x+90}" y2="${pos[b].y+30}" stroke="#a33" stroke-width="1.5"/>`}
 overlay(`<h2>Evidence Board</h2><div style="position:relative;height:${Math.max(160,Math.ceil(ch.length/3)*90+30)}px"><svg width="100%" height="100%" style="position:absolute;inset:0">${lines}</svg>${ch.map((c,i)=>`<div class="chip" style="position:absolute;left:${pos[i].x}px;top:${pos[i].y}px;width:190px;font-size:12px"><b>${c.item}</b><br>${c.part}</div>`).join('')}</div><div class="row dim">Red lines join clues that share a name, place or time. ${ch.length?'':'No clues collected.'}</div>`+btn('Close','back'))}
function computer(){const rec=SHIFTS.map((s,i)=>({n:i+1,item:s.name,date:s.date,ok:i<S.shift+1&&i%4!==1||i<S.shift-1}));
 overlay(`<h2>Lost Item Database</h2><input type="text" id="q" placeholder="Search item, date or case…"><div id="rs" class="row"></div>`+btn('Close','back'),'ui');
 const draw=()=>{const q=$('q').value.toLowerCase();$('rs').innerHTML=rec.filter(r=>r.n<=S.shift+1).map(r=>{const t=r.ok?`${r.item} · ${r.date}`:'██████ · ██ ███';return `<div>Case ${String(r.n).padStart(3,'0')} — ${t} ${r.ok&&r.n>3?'· <span class="dim">Status: NO INCIDENT REPORTED</span>':''}</div>`}).filter(h=>h.toLowerCase().includes(q)).join('')||'<div class="dim">No matches.</div>'};
 $('q').oninput=draw;draw()}
function phone(){snd.ring();const lines=['Wrong number.','"Platform seven. Eleven forty-three. Please do not be late."','(Static.) "Is this the night desk? ... You have not logged me yet."','This is your own number. You hear yourself breathing.'];sub('☎  '+lines[Math.min(lines.length-1,Math.floor(S.shift/2))],6000)}
// ---- controls
const keys={};let yaw=0,pitch=0,flashOn=false,battery=100;
addEventListener('keydown',e=>{keys[e.code]=true;if(mode==='play'){if(e.code==='KeyE')interact();if(e.code==='KeyI')inventory();if(e.code==='Tab'){e.preventDefault();board()}if(e.code==='KeyF'){flashOn=!flashOn}}else if(e.code==='KeyI'&&mode==='ui')resume();
 if(e.code==='Escape'&&mode==='play'){overlay(`<h2>Paused</h2>`+btn('Resume','resume')+btn('Inventory','inv')+btn('Evidence','ev')+btn('Settings','set')+btn('Save','save')+btn('Main Menu','menu'))}});
addEventListener('keyup',e=>keys[e.code]=false);
addEventListener('mousemove',e=>{if(document.pointerLockElement&&mode==='play'){yaw-=e.movementX*.0022*settings.sens;pitch=Math.max(-1.4,Math.min(1.4,pitch-e.movementY*.0022*settings.sens))}});
addEventListener('mousedown',()=>{if(mode==='play'&&!document.pointerLockElement)renderer.domElement.requestPointerLock?.();else if(mode==='play')interact()});
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement&&mode==='play'&&!$('ov').classList.contains('on'))overlay(`<h2>Paused</h2>`+btn('Resume','resume')+btn('Inventory','inv')+btn('Evidence','ev')+btn('Settings','set')+btn('Save','save')+btn('Main Menu','menu'))});
const ray=new THREE.Raycaster();let target=null;
function interact(){if(!target)return;const id=target.userData.id;if(id==='computer')computer();else if(id==='phone')phone();else if(id==='board')board();else if(id==='desk')itemMesh?inspect():sub('The desk is empty. Wait for the next delivery.',2500)}
// ---- loop
let last=performance.now(),t=0,stepT=0;
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
 if(mode==='play'){const sp=(keys.ShiftLeft?3.2:1.8)*dt;const f=(keys.KeyW?1:0)-(keys.KeyS?1:0),r=(keys.KeyD?1:0)-(keys.KeyA?1:0);
  if(f||r){camera.position.x+=(-Math.sin(yaw)*f+Math.cos(yaw)*r)*sp;camera.position.z+=(-Math.cos(yaw)*f-Math.sin(yaw)*r)*sp;stepT+=dt;if(stepT>(keys.ShiftLeft?.32:.5)){stepT=0;snd.step()}}
  camera.position.x=Math.max(-3.4,Math.min(3.5,camera.position.x));camera.position.z=Math.max(-.9,Math.min(2.7,camera.position.z));
  camera.position.y=1.65+(f||r?Math.sin(t*9)*.015:0);camera.rotation.set(pitch,yaw,0);
  ray.setFromCamera({x:0,y:0},camera);const h=ray.intersectObjects(world.hits,false)[0];target=h&&h.distance<3.2?h.object:null;prompt.textContent=target?'[E] '+target.userData.label:'';
  if(flashOn){battery=Math.max(0,battery-dt*.4);if(!battery)flashOn=false}else battery=Math.min(100,battery+dt*.8);
  }
 world.flash.intensity=flashOn?30:0;world.flash.position.copy(camera.position);const d=new THREE.Vector3();camera.getWorldDirection(d);world.flash.target.position.copy(camera.position).add(d);
 world.update(t,dt,S.shift/6);renderer.render(scene,camera)}
requestAnimationFrame(loop);
showMenu();
