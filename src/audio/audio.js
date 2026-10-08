// Procedural audio, no asset files.
let ctx,master,musicG,sfxG,drone,droneG;
export function init(v){try{if(ctx){ctx.resume();return}
 ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();musicG=ctx.createGain();sfxG=ctx.createGain();musicG.connect(master);sfxG.connect(master);master.connect(ctx.destination);setVol(v);
 const n=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 const rain=ctx.createBufferSource();rain.buffer=n;rain.loop=true;const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=3200;const g=ctx.createGain();g.gain.value=.1;rain.connect(f).connect(g).connect(sfxG);rain.start();
 const hum=ctx.createOscillator();hum.frequency.value=100;const hg=ctx.createGain();hg.gain.value=.012;hum.connect(hg).connect(sfxG);hum.start();
 drone=ctx.createOscillator();drone.type='sawtooth';drone.frequency.value=55;const lp=ctx.createBiquadFilter();lp.frequency.value=180;droneG=ctx.createGain();droneG.gain.value=.04;drone.connect(lp).connect(droneG).connect(musicG);drone.start();
 const o2=ctx.createOscillator();o2.frequency.value=82.4;const g2=ctx.createGain();g2.gain.value=.04;o2.connect(g2).connect(musicG);o2.start();
}catch(e){console.warn('Audio unavailable',e)}}
export function setVol(v){if(!ctx)return;master.gain.value=v.master;musicG.gain.value=v.music;sfxG.gain.value=v.sfx}
export function tension(t){if(!ctx)return;droneG.gain.value=.03+.1*t;drone.frequency.value=55-8*t}
function beep(f,d,type='sine',vol=.2,t0=0){if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f;const t=ctx.currentTime+t0;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(sfxG);o.start(t);o.stop(t+d)}
export const ui=()=>beep(660,.08,'sine',.08);
export const pick=()=>{beep(180,.12,'triangle',.2);beep(240,.1,'triangle',.1,.08)};
export const ring=()=>{for(let i=0;i<4;i++){beep(440,.18,'square',.06,i*.45);beep(480,.18,'square',.06,i*.45)}};
export const thud=()=>beep(70,.4,'sine',.35);
export const step=()=>beep(90+Math.random()*30,.07,'triangle',.05);
