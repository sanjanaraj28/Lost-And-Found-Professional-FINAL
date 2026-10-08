const K='lf_save_v1',S='lf_settings_v1',DEF={master:.8,music:.6,sfx:.8,sens:1,subs:true};
export function save(s){try{localStorage.setItem(K,JSON.stringify(s));return true}catch(e){return false}}
export function load(){try{const r=localStorage.getItem(K);if(!r)return null;const s=JSON.parse(r);return(typeof s.shift==='number'&&Array.isArray(s.clues)&&s.flags)?s:null}catch(e){return null}}
export function newState(){return{shift:0,clues:[],flags:{returned:0,reported:0,kept:0,chose:''}}}
export function loadSettings(){try{return Object.assign({},DEF,JSON.parse(localStorage.getItem(S)||'{}'))}catch(e){return{...DEF}}}
export function saveSettings(v){try{localStorage.setItem(S,JSON.stringify(v))}catch(e){}}
