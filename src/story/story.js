export const SHIFTS=[
{title:'SHIFT 1 — NORMAL',call:'Night desk. Umbrella came in from Platform 3. Log it, find the owner, go home.',kind:'umbrella',color:0x8a2b2b,name:'Red Umbrella',date:'03 NOV',
 clues:[{part:'Handle',text:'Initials "M.R." burned into the wooden handle.',tags:['MR']},{part:'Paper tag',text:'Found Platform 3, 9:10 PM.',tags:['P3']}],owners:['Mara Rowe','Mark Rigby','Nina Ostrov'],correct:0},
{title:'SHIFT 2 — STRANGE',call:'Another one. This watch stopped a long time ago. The clerk says it was handed in tonight. He is wrong.',kind:'watch',color:0x9aa3a8,name:'Silver Watch',date:'03 NOV',
 clues:[{part:'Dial',text:'Hands frozen at 11:43.',tags:['1143']},{part:'Case back',text:'Engraved: "Platform 7 — 11:43 PM". D.H.',tags:['P7','1143','DH']}],owners:['Daniel Hale','David Holm','Harold Dunn'],correct:0},
{title:'SHIFT 3 — THE FIRST CONNECTION',call:'Guard on the radio: "Same date, same hour. Funny how that works."',kind:'musicbox',color:0x5b4331,name:"Child's Music Box",date:'03 NOV',
 clues:[{part:'Lid',text:'Inscribed: "For Ellie. Train 714."',tags:['714','DH']},{part:'Mechanism',text:'The melody stops at the 43rd note.',tags:['1143']}],owners:['Ellie Hale','Ellen Hart','Unclaimed'],correct:0},
{title:'SHIFT 4 — THE MISSING PASSENGER',call:'Records say "No incident reported" for Train 714. Check the ticket.',kind:'ticket',color:0xd7c9a2,name:'Torn Train Ticket',date:'03 NOV',
 clues:[{part:'Front',text:'Train 714 · Platform 7 · 11:43 PM · Seat 12.',tags:['714','P7','1143']},{part:'Reverse',text:'Pencilled: "He never got off. Nobody asked."',tags:['DH']}],owners:['Daniel Hale','Station Records','Unknown'],correct:0},
{title:'SHIFT 5 — SOMEONE IS WATCHING',call:'(The phone rings. Nobody speaks. A train announcement for a train that does not exist.)',kind:'wallet',color:0x2d2a28,name:'Leather Wallet',date:'—',
 clues:[{part:'Card slot',text:'No submission record. Nobody remembers handing it in.',tags:['NOREC']},{part:'ID card',text:'Your own handwriting on the back: "Platform 7."',tags:['P7','YOU']}],owners:['You','Daniel Hale','Nobody'],correct:0},
{title:'SHIFT 6 — THE RESTRICTED AREA',call:'The basement door is open. It was locked yesterday. A key is on your desk.',kind:'key',color:0x7a4a2c,name:'Rusted Key',date:'—',
 clues:[{part:'Bow',text:'Stamped: "ARCHIVE B".',tags:['ARCH']},{part:'Bit',text:'Knotted tag: "Lost & Found collects. It does not return."',tags:['ARCH','YOU']}],owners:['Station Manager','The Archive','Back on the shelf'],correct:1},
{title:'FINAL SHIFT — LOST & FOUND',call:'Every object on the shelf has a name tag. One tag is blank. It is in your handwriting.',kind:'tag',color:0xb9a77a,name:'Blank Name Tag',date:'TONIGHT',final:true,
 clues:[{part:'Tag',text:'Dated eleven years ago. Train 714. 11:43 PM. Your name.',tags:['714','1143','YOU']}],owners:['Return it to yourself','Leave it on the shelf','Burn it'],correct:0}];
export const ENDINGS={
truth:['THE TRUTH','You publish the archive. Eleven years of silence ends. Daniel Hale is named, the office is sealed, and on the last night the shelves are empty.'],
cover:['THE COVER-UP','You burn the files. The station sleeps again. The next night, the desk lamp comes on by itself.'],
replace:['THE REPLACEMENT','You return the tag to yourself and remember: you never worked here. You were a passenger. The clerk handing you the keys wears your face.'],
loop:['THE LOOP','You leave the tag on the shelf. The clock stops at 11:43. Someone knocks, holding an umbrella, and you hear yourself say: "Night desk. How can I help?"']};
export function ending(f){if(f.chose==='self')return 'replace';if(f.chose==='burn')return 'cover';if(f.reported>=2&&f.kept<=1)return 'truth';return 'loop'}
