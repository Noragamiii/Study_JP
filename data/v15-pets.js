/* Sổ luyện N3 — v15: thú cưng, thẻ bài "Chiến binh Kanji", phụ kiện mới. Toàn bộ hình là SVG vẽ riêng cho app (nhân vật gốc). */
(function(){
"use strict";
const A=window.V13ART=window.V13ART||{};
const OL="#4A3B47";
let U=0; const uid=p=>p+(U=(U+1)%1e6);

/* ================= THÚ CƯNG ================= */
/* mặt cute dùng chung */
function face(cx,cy,o){ o=o||{}; const m=o.mood||"idle", ec=o.eye||"#2B2320", ec2=o.eye2||ec, fc=o.fc||"#2B2320", sp=o.sp||10;
  let s="";
  if(m==="happy") s+=`<path d="M${cx-sp-4},${cy+1} q4,-5 8,0 M${cx+sp-4},${cy+1} q4,-5 8,0" stroke="${fc}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  else { const ry=m==="hungry"?3.2:4.8; [[cx-sp,ec],[cx+sp,ec2]].forEach(([x,c])=>{ s+=`<ellipse cx="${x}" cy="${cy}" rx="3.700" ry="${ry}" fill="${c}"/>${c!==fc?`<ellipse cx="${x}" cy="${cy+.5}" rx="1.900" ry="${ry*.55}" fill="#2B2320"/>`:""}<circle cx="${x+1.300}" cy="${cy-ry*.45}" r="1.400" fill="#FFFFFF"/>` });
    if(m==="hungry") s+=`<path d="M${cx-sp-4},${cy-7} l7,2 M${cx+sp+4},${cy-7} l-7,2" stroke="${fc}" stroke-width="1.600" stroke-linecap="round"/>` }
  if(o.blush!==false) s+=`<ellipse cx="${cx-sp-6}" cy="${cy+7}" rx="4.500" ry="2.600" fill="#FF8FA8" opacity=".55"/><ellipse cx="${cx+sp+6}" cy="${cy+7}" rx="4.500" ry="2.600" fill="#FF8FA8" opacity=".55"/>`;
  if(o.beak) s+=`<path d="M${cx-3},${cy+5} l3,4 l3,-4z" fill="${o.beak}" stroke="#C77A1F" stroke-width=".8" stroke-linejoin="round"/>`;
  else { if(o.nose!==false) s+=`<path d="M${cx-2},${cy+4.500} h4 l-2,2.200z" fill="${o.nose||"#FF7F9B"}"/>`; s+=m==="hungry"?`<path d="M${cx-3},${cy+10} q3,-2.500 6,0" stroke="${fc}" stroke-width="1.500" fill="none" stroke-linecap="round"/>`:`<path d="M${cx-4},${cy+7.500} q2,2.800 4,0 q2,2.800 4,0" stroke="${fc}" stroke-width="1.500" fill="none" stroke-linecap="round"/>` }
  return s }
const shadow=`<ellipse cx="50" cy="96" rx="26" ry="3.500" fill="#000" opacity=".13"/>`;
/* mèo — một khung, nhiều bộ lông */
function cat(o,mood){ const b=o.b, id=uid("pc"), st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  const head=o.fluffy?`M23,46 q-4,-10 2,-16 q-2,-10 8,-12 q6,-8 17,-6 q11,-2 17,6 q10,2 8,12 q6,6 2,16 q2,12 -10,16 q-6,8 -17,7 q-11,1 -17,-7 q-12,-4 -10,-16z`:`M23,44 q0,-22 27,-23 q27,1 27,23 q0,21 -27,22 q-27,-1 -27,-22z`;
  const ears=o.fold?`<path d="M30,28 q2,-9 13,-6 q-3,7 -13,6z M70,28 q-2,-9 -13,-6 q3,7 13,6z" fill="${o.ear||b}" ${st}/>`
    :`<path d="M27,33 L29,10 L46,23Z M73,33 L71,10 L54,23Z" fill="${o.ear||b}" ${st}/><path d="M31,28 L32,16 L41,23Z M69,28 L68,16 L59,23Z" fill="${o.inner||"#FFB3C4"}"/>`;
  let s=shadow+`<defs><clipPath id="${id}"><path d="${head}"/><ellipse cx="50" cy="77" rx="22" ry="18"/></clipPath></defs>`;
  s+=`<path d="M68,88 q20,-2 16,-24 q-1,-6 -5,-6" stroke="${OL}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M68,88 q20,-2 16,-24 q-1,-6 -5,-6" stroke="${o.tail||b}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  s+=ears+`<ellipse cx="50" cy="77" rx="22" ry="18" fill="${b}" ${st}/><path d="${head}" fill="${b}" ${st}/>`;
  if(o.pat) s+=`<g clip-path="url(#${id})">${o.pat}</g><path d="${head}" fill="none" ${st}/><ellipse cx="50" cy="77" rx="22" ry="18" fill="none" ${st}/>`;
  s+=`<ellipse cx="41" cy="93" rx="6.500" ry="4" fill="${o.paw||b}" ${st}/><ellipse cx="59" cy="93" rx="6.500" ry="4" fill="${o.paw||b}" ${st}/>`;
  if(o.whisk!==false) s+=`<g stroke="${o.fc||OL}" stroke-width="1" opacity=".55" stroke-linecap="round"><path d="M22,48 l-9,-2 M22,52 l-9,2 M78,48 l9,-2 M78,52 l9,2"/></g>`;
  return s+face(50,45,{mood,eye:o.eye,eye2:o.eye2,fc:o.fc,nose:o.nose}) }
/* các loài khác */
function shiba(mood){ const b="#E3A35A", w="#FFF6E8", st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  return shadow+`<path d="M66,70 q18,-6 12,-20 q-6,-8 -12,0 q-4,6 4,8" stroke="${OL}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M66,70 q18,-6 12,-20 q-6,-8 -12,0 q-4,6 4,8" stroke="${b}" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M27,34 L30,11 L45,24Z M73,34 L70,11 L55,24Z" fill="${b}" ${st}/><path d="M31,29 L32,17 L41,24Z M69,29 L68,17 L59,24Z" fill="#F7D3A8"/>
  <ellipse cx="50" cy="77" rx="21" ry="18" fill="${b}" ${st}/><path d="M38,66 q12,8 24,0 q2,18 -12,26 q-14,-8 -12,-26z" fill="${w}"/>
  <path d="M23,44 q0,-22 27,-23 q27,1 27,23 q0,21 -27,22 q-27,-1 -27,-22z" fill="${b}" ${st}/><path d="M26,50 q6,-4 14,0 q6,6 10,6 q4,0 10,-6 q8,-4 14,0 q-2,14 -24,16 q-22,-2 -24,-16z" fill="${w}"/>
  <ellipse cx="38" cy="36" rx="3" ry="2" fill="${w}"/><ellipse cx="62" cy="36" rx="3" ry="2" fill="${w}"/>
  <ellipse cx="41" cy="93" rx="6.500" ry="4" fill="${w}" ${st}/><ellipse cx="59" cy="93" rx="6.500" ry="4" fill="${w}" ${st}/>`+face(50,45,{mood,nose:"#2B2320"}) }
function corgi(mood){ const b="#F0A04B", w="#FFF6E8", st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  return shadow+`<path d="M22,36 L22,4 L46,24Z M78,36 L78,4 L54,24Z" fill="${b}" ${st}/><path d="M27,30 L27,12 L41,24Z M73,30 L73,12 L59,24Z" fill="#FFC9A8"/>
  <ellipse cx="50" cy="80" rx="25" ry="15" fill="${b}" ${st}/><ellipse cx="50" cy="83" rx="14" ry="10" fill="${w}"/>
  <path d="M23,46 q0,-22 27,-23 q27,1 27,23 q0,20 -27,21 q-27,-1 -27,-21z" fill="${b}" ${st}/><path d="M46,23 q4,-2 8,0 l2,22 q8,2 14,8 q-4,12 -20,13 q-16,-1 -20,-13 q6,-6 14,-8z" fill="${w}"/>
  <ellipse cx="39" cy="94" rx="6" ry="3.500" fill="${w}" ${st}/><ellipse cx="61" cy="94" rx="6" ry="3.500" fill="${w}" ${st}/>`+face(50,46,{mood,nose:"#2B2320",sp:11}) }
function usagi(mood){ const b="#FFFFFF", st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  return shadow+`<ellipse cx="38" cy="16" rx="7.500" ry="18" fill="${b}" ${st} transform="rotate(-10 38 30)"/><ellipse cx="62" cy="16" rx="7.500" ry="18" fill="${b}" ${st} transform="rotate(14 62 30)"/><ellipse cx="38" cy="17" rx="3.500" ry="12" fill="#FFB3C4" transform="rotate(-10 38 30)"/><ellipse cx="62" cy="17" rx="3.500" ry="12" fill="#FFB3C4" transform="rotate(14 62 30)"/>
  <circle cx="74" cy="86" r="7" fill="${b}" ${st}/><ellipse cx="50" cy="78" rx="21" ry="17" fill="${b}" ${st}/><ellipse cx="50" cy="50" rx="24" ry="20" fill="${b}" ${st}/>
  <ellipse cx="42" cy="93" rx="6" ry="3.600" fill="${b}" ${st}/><ellipse cx="58" cy="93" rx="6" ry="3.600" fill="${b}" ${st}/>`+face(50,50,{mood,eye:"#C2185B",fc:OL,sp:9}) }
function hamu(mood){ const b="#F2C38B", w="#FFF8EC", st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  return shadow+`<circle cx="30" cy="40" r="7" fill="${b}" ${st}/><circle cx="70" cy="40" r="7" fill="${b}" ${st}/><circle cx="30" cy="40" r="3.500" fill="#FFB3C4"/><circle cx="70" cy="40" r="3.500" fill="#FFB3C4"/>
  <path d="M18,66 q0,-30 32,-30 q32,0 32,30 q0,28 -32,28 q-32,0 -32,-28z" fill="${b}" ${st}/><path d="M26,72 q4,-14 24,-14 q20,0 24,14 q-2,18 -24,18 q-22,0 -24,-18z" fill="${w}"/>
  <ellipse cx="50" cy="80" rx="6" ry="8" fill="#5A4636"/><path d="M50,73 v14" stroke="#F2E3C6" stroke-width="1.200"/><ellipse cx="44" cy="80" rx="4" ry="3.200" fill="#FFC7B5" ${st}/><ellipse cx="56" cy="80" rx="4" ry="3.200" fill="#FFC7B5" ${st}/>`+face(50,56,{mood,nose:"#FF7F9B",sp:9}) }
function fukurou(mood){ const b="#9A7A5A", w="#F2E2C6", st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  const eyes=mood==="happy"?`<path d="M34,46 q6,-6 12,0 M54,46 q6,-6 12,0" stroke="${OL}" stroke-width="2.400" fill="none" stroke-linecap="round"/>`:`<circle cx="40" cy="46" r="9" fill="#FFFFFF" ${st}/><circle cx="60" cy="46" r="9" fill="#FFFFFF" ${st}/><circle cx="40" cy="${mood==="hungry"?48:46}" r="5" fill="#2B2320"/><circle cx="60" cy="${mood==="hungry"?48:46}" r="5" fill="#2B2320"/><circle cx="42" cy="44" r="1.800" fill="#fff"/><circle cx="62" cy="44" r="1.800" fill="#fff"/>`;
  return shadow+`<path d="M26,30 L24,14 L38,24Z M74,30 L76,14 L62,24Z" fill="${b}" ${st}/>
  <path d="M22,56 q0,-34 28,-34 q28,0 28,34 q0,36 -28,36 q-28,0 -28,-36z" fill="${b}" ${st}/><path d="M32,64 q18,-10 36,0 q0,24 -18,26 q-18,-2 -18,-26z" fill="${w}"/>
  <g stroke="#B8946A" stroke-width="1.500" fill="none">${[70,77,84].map(y=>`<path d="M42,${y} l3,3 l3,-3 M52,${y} l3,3 l3,-3"/>`).join("")}</g>
  <path d="M22,58 q-8,14 4,26 M78,58 q8,14 -4,26" stroke="${OL}" stroke-width="1.800" fill="#7E5F44"/>${eyes}<path d="M47,54 l3,6 l3,-6z" fill="#F2A33B" stroke="#C77A1F" stroke-width=".8"/>
  <ellipse cx="28" cy="58" rx="4.500" ry="2.600" fill="#FF8FA8" opacity=".5"/><ellipse cx="72" cy="58" rx="4.500" ry="2.600" fill="#FF8FA8" opacity=".5"/><path d="M42,92 v4 M46,92 v4 M54,92 v4 M58,92 v4" stroke="#F2A33B" stroke-width="2.400" stroke-linecap="round"/>` }
function kitsune(mood,white){ const b=white?"#FFFFFF":"#F08A3A", w=white?"#FFF4F7":"#FFF6E8", tip=white?"#C9B6FF":"#FFFFFF", st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  const tail=(rot)=>`<g transform="rotate(${rot} 64 84)"><path d="M62,86 q30,-6 26,-34 q-2,-10 -8,-12 q2,18 -18,30z" fill="${b}" ${st}/><path d="M88,52 q-2,-10 -8,-12 q2,8 0,14 q6,2 8,-2z" fill="${tip}"/></g>`;
  let s=shadow+(white?[-120,-100,-80,-62,-44,-26,-8,10,28].map(r=>`<g transform="rotate(${r} 56 84)">${tail(0)}</g>`).join(""):tail(0));
  s+=`<path d="M25,36 L24,8 L46,24Z M75,36 L76,8 L54,24Z" fill="${b}" ${st}/><path d="M29,30 L28,14 L41,24Z M71,30 L72,14 L59,24Z" fill="${white?"#FFB3C4":"#3A2A22"}"/>
  <ellipse cx="50" cy="78" rx="20" ry="17" fill="${b}" ${st}/><path d="M40,66 q10,6 20,0 q2,16 -10,24 q-12,-8 -10,-24z" fill="${w}"/>
  <path d="M23,44 q0,-22 27,-23 q27,1 27,23 q0,10 -10,16 l-17,8 l-17,-8 q-10,-6 -10,-16z" fill="${b}" ${st}/><path d="M28,50 q10,-2 16,4 l6,10 l6,-10 q6,-6 16,-4 q-4,8 -22,16 q-18,-8 -22,-16z" fill="${w}"/>
  <ellipse cx="42" cy="93" rx="6" ry="3.600" fill="${white?w:"#3A2A22"}" ${st}/><ellipse cx="58" cy="93" rx="6" ry="3.600" fill="${white?w:"#3A2A22"}" ${st}/>`;
  if(white) s+=`<path d="M46,28 q4,-6 8,0 q-4,4 -8,0z" fill="#E33B2E"/><path d="M29,47 q-3,-3 -1,-7 M71,47 q3,-3 1,-7" stroke="#E33B2E" stroke-width="1.600" stroke-linecap="round"/><g class="v15-wisp"><path d="M86,22 q-6,-8 0,-16 q6,8 0,16z" fill="#7FD0FF" opacity=".85"/><path d="M14,30 q-5,-7 0,-13 q5,7 0,13z" fill="#7FD0FF" opacity=".7"/></g>`;
  return s+face(50,45,{mood,nose:"#2B2320",eye:white?"#C2185B":undefined,fc:OL}) }
function tanuki(mood){ const b="#9A7458", d="#4A3A30", w="#F2E2C6", st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  return shadow+`<path d="M68,86 q20,0 18,-18" stroke="${OL}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M68,86 q20,0 18,-18" stroke="${b}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M84,76 q3,-4 2,-8" stroke="${d}" stroke-width="7" stroke-linecap="round"/>
  <circle cx="31" cy="27" r="7" fill="${d}" ${st}/><circle cx="69" cy="27" r="7" fill="${d}" ${st}/>
  <ellipse cx="50" cy="77" rx="23" ry="19" fill="${b}" ${st}/><ellipse cx="50" cy="80" rx="15" ry="13" fill="${w}"/>
  <path d="M23,46 q0,-22 27,-23 q27,1 27,23 q0,20 -27,21 q-27,-1 -27,-21z" fill="${b}" ${st}/><path d="M26,46 q4,-10 14,-6 q6,4 10,10 q4,-6 10,-10 q10,-4 14,6 q-2,8 -10,8 q-8,0 -14,-4 q-6,4 -14,4 q-8,0 -10,-8z" fill="${d}"/><ellipse cx="50" cy="54" rx="9" ry="7" fill="${w}"/>
  <path d="M44,20 q6,-14 16,-6 q-6,2 -8,8 q-4,0 -8,-2z" fill="#6CC45C" stroke="#3A8A3E" stroke-width="1.200"/><path d="M47,19 q5,-4 10,-4" stroke="#3A8A3E" stroke-width="1"/>
  <ellipse cx="41" cy="94" rx="6" ry="3.600" fill="${d}" ${st}/><ellipse cx="59" cy="94" rx="6" ry="3.600" fill="${d}" ${st}/>`+face(50,46,{mood,eye:"#F2E2C6",nose:"#2B2320",fc:OL}) }
function lesser(mood){ const b="#C2552B", w="#FFF6E8", d="#3A2420", st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  return shadow+`<path d="M66,88 q22,-2 20,-28" stroke="${OL}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M66,88 q22,-2 20,-28" stroke="${b}" stroke-width="10" fill="none" stroke-linecap="round"/><g stroke="#E8A070" stroke-width="3">${[[78,84],[84,76],[86,67]].map(([x,y])=>`<path d="M${x-5},${y-3} l9,5"/>`).join("")}</g>
  <path d="M25,34 L26,14 L44,24Z M75,34 L74,14 L56,24Z" fill="${b}" ${st}/><path d="M29,30 L30,18 L40,24Z M71,30 L70,18 L60,24Z" fill="${w}"/>
  <ellipse cx="50" cy="78" rx="20" ry="17" fill="${d}" ${st}/>
  <path d="M23,44 q0,-22 27,-23 q27,1 27,23 q0,21 -27,22 q-27,-1 -27,-22z" fill="${b}" ${st}/><ellipse cx="39" cy="35" rx="6" ry="3" fill="${w}"/><ellipse cx="61" cy="35" rx="6" ry="3" fill="${w}"/>
  <path d="M30,48 q8,-2 12,4 q4,6 8,6 q4,0 8,-6 q4,-6 12,-4 q-2,14 -20,16 q-18,-2 -20,-16z" fill="${w}"/>
  <ellipse cx="41" cy="93" rx="6" ry="3.600" fill="${d}" ${st}/><ellipse cx="59" cy="93" rx="6" ry="3.600" fill="${d}" ${st}/>`+face(50,44,{mood,nose:"#2B2320"}) }
function pen(mood){ const b="#2F3A4A", w="#FFFFFF", st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  return shadow+`<path d="M26,60 q-10,10 -4,22 M74,60 q10,10 4,22" stroke="${OL}" stroke-width="1.800" fill="${b}"/>
  <path d="M24,58 q0,-38 26,-38 q26,0 26,38 q0,34 -26,34 q-26,0 -26,-34z" fill="${b}" ${st}/><path d="M30,48 q0,-14 10,-16 q6,0 10,6 q4,-6 10,-6 q10,2 10,16 q2,40 -20,40 q-22,0 -20,-40z" fill="${w}"/>
  <path d="M38,94 l-6,2 h10z M62,94 l6,2 h-10z" fill="#F2A33B" stroke="#C77A1F" stroke-width="1"/>`+face(50,48,{mood,beak:"#F2A33B",fc:OL}) }
function ryu(mood){ const b="#5CC9A7", d="#2E8F74", w="#FFF2C2", st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  return shadow+`<path d="M66,86 q22,4 22,-14 q0,-6 -6,-8" stroke="${OL}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M66,86 q22,4 22,-14 q0,-6 -6,-8" stroke="${b}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M82,62 l6,-6 l2,8z" fill="${d}"/>
  <path d="M28,62 q-20,-10 -18,-28 q8,8 16,6 q-4,10 6,16z M72,62 q20,-10 18,-28 q-8,8 -16,6 q4,10 -6,16z" fill="#8FE0C8" ${st}/>
  <path d="M34,22 l-4,-14 l10,10z M66,22 l4,-14 l-10,10z" fill="#FFD86B" ${st}/>
  <ellipse cx="50" cy="77" rx="21" ry="18" fill="${b}" ${st}/><path d="M40,64 q10,6 20,0 l-2,26 h-16z" fill="${w}"/><g stroke="#E8D28A" stroke-width="1.200">${[70,76,82].map(y=>`<path d="M42,${y} h16"/>`).join("")}</g>
  <path d="M23,44 q0,-22 27,-23 q27,1 27,23 q0,21 -27,22 q-27,-1 -27,-22z" fill="${b}" ${st}/><path d="M44,22 l3,-6 l3,6 l3,-6 l3,6" fill="${d}"/>
  <ellipse cx="42" cy="93" rx="6" ry="3.600" fill="${b}" ${st}/><ellipse cx="58" cy="93" rx="6" ry="3.600" fill="${b}" ${st}/>`+face(50,45,{mood,eye:"#E9A23B",fc:OL,nose:false}) }
function kinneko(mood){ const b="#F7CD45", st=`stroke="${OL}" stroke-width="1.800" stroke-linejoin="round"`;
  return cat({b,inner:"#FF9DB0",eye:"#2B2320",tail:b,paw:b},mood).replace(/<ellipse cx="59" cy="93"[^>]*\/>/,"")+`<path d="M64,70 q12,-4 12,-20" stroke="${OL}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M64,70 q12,-4 12,-20" stroke="${b}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="76" cy="48" r="6.500" fill="${b}" ${st}/>
  <path d="M32,64 q18,8 36,0" stroke="#E33B2E" stroke-width="4" fill="none"/><circle cx="50" cy="69" r="4" fill="#FFD23F" stroke="#B88A10" stroke-width="1.200"/><rect x="38" y="78" width="24" height="14" rx="6" fill="#FFE27A" stroke="#B88A10" stroke-width="1.400"/><text x="50" y="88.500" font-size="8" text-anchor="middle" fill="#8A5A00" font-family="'BIZ UDPMincho',serif" font-weight="700">合格</text>
  <g fill="#FFFFFF" class="v15-sparkle"><path d="M16,24 l2,-6 l2,6 l6,2 l-6,2 l-2,6 l-2,-6 l-6,-2z"/><path d="M84,30 l1.400,-4 l1.400,4 l4,1.400 l-4,1.400 l-1.400,4 l-1.400,-4 l-4,-1.400z"/></g>` }

/* bộ lông mèo */
const CAT={
 mike:{b:"#FFFDF7",tail:"#F2A04B",pat:`<path d="M20,20 q14,-6 26,6 q-4,14 -16,16 q-12,-4 -10,-22z" fill="#F2A04B"/><path d="M60,18 q14,0 20,14 q-6,10 -16,6 q-6,-8 -4,-20z" fill="#3A3436"/><path d="M54,68 q12,-4 20,6 q-4,12 -14,10 q-8,-6 -6,-16z" fill="#F2A04B"/><path d="M28,80 q8,-6 14,2 q-4,8 -14,-2z" fill="#3A3436"/>`,eye:"#7BC96F"},
 chatora:{b:"#F5B062",paw:"#FFF3E2",pat:`<g stroke="#D9822B" stroke-width="3.400" stroke-linecap="round"><path d="M44,24 v7 M50,23 v8 M56,24 v7 M30,60 q4,6 10,4 M70,60 q-4,6 -10,4 M32,72 q6,4 12,2"/></g><path d="M36,50 q14,18 28,0 q2,18 -14,20 q-16,-2 -14,-20z" fill="#FFF3E2"/>`,eye:"#E9A23B"},
 kuro:{b:"#2F2B33",inner:"#7A5A70",eye:"#F2C230",fc:"#E9E2F2",nose:"#C98A9A"},
 shiro:{b:"#FFFFFF",eye:"#5AB7F0",eye2:"#F2C230",inner:"#FFB3C4"},
 hachi:{b:"#2F2B33",inner:"#7A5A70",paw:"#FFFFFF",eye:"#7BC96F",pat:`<path d="M50,30 l-14,40 h28z" fill="#FFFFFF"/><path d="M30,52 q20,22 40,0 q2,16 -20,16 q-22,0 -20,-16z" fill="#FFFFFF"/><ellipse cx="50" cy="80" rx="12" ry="14" fill="#FFFFFF"/>`},
 saba:{b:"#A9ADB5",eye:"#7BC96F",pat:`<g stroke="#6F737C" stroke-width="3.200" stroke-linecap="round" fill="none"><path d="M44,23 v8 M50,22 v9 M56,23 v8 M26,40 h7 M67,40 h7 M30,66 q6,6 12,2 M58,68 q6,4 12,-2 M34,78 q8,4 14,0"/></g>`,tail:"#8E929B"},
 siam:{b:"#F6EBDD",ear:"#5A4438",tail:"#5A4438",paw:"#5A4438",eye:"#5AB7F0",pat:`<ellipse cx="50" cy="52" rx="13" ry="11" fill="#7A5E50"/>`,fc:"#FFFFFF",nose:"#3A2A22"},
 persia:{b:"#F3E2C7",fluffy:1,eye:"#E9893B",tail:"#E8D2AE",pat:`<path d="M30,60 q20,14 40,0 q-2,30 -20,30 q-18,0 -20,-30z" fill="#FFF6E6"/>`},
 fold:{b:"#B9BCC6",fold:1,eye:"#E9A23B",pat:`<g stroke="#9296A2" stroke-width="2.600" stroke-linecap="round"><path d="M46,25 v6 M54,25 v6"/></g>`}
};
const PETS=A.PETS={
 mike:{n:"Mèo tam thể",jp:"三毛猫",p:1200,f:m=>cat(CAT.mike,m),say:"Meo~ cho mình ngồi cạnh bạn học nhé!"},
 chatora:{n:"Mèo mướp cam",jp:"茶トラ",p:1200,f:m=>cat(CAT.chatora,m),say:"Ăn no rồi học tiếp thôi, nyan!"},
 hachi:{n:"Mèo mặt nạ",jp:"ハチワレ",p:1500,f:m=>cat(CAT.hachi,m),say:"Bộ vest đen trắng này là đồng phục đi thi đó."},
 kuro:{n:"Mèo mun",jp:"黒猫",p:1500,f:m=>cat(CAT.kuro,m),say:"Mèo đen mang may mắn tới phòng thi đó nha."},
 shiro:{n:"Mèo trắng hai màu mắt",jp:"白猫",p:1800,f:m=>cat(CAT.shiro,m),say:"Một mắt nhìn kanji, một mắt nhìn ngữ pháp~"},
 saba:{n:"Mèo mướp xám",jp:"サバトラ",p:1800,f:m=>cat(CAT.saba,m),say:"Sọc của mình giống vạch kẻ vở ôn thi ghê."},
 siam:{n:"Mèo Xiêm",jp:"シャム猫",p:2200,f:m=>cat(CAT.siam,m),say:"Mắt xanh biếc này chỉ nhìn bạn học thôi."},
 persia:{n:"Mèo Ba Tư",jp:"ペルシャ猫",p:2500,f:m=>cat(CAT.persia,m),say:"Chải lông xong rồi, giờ tới lượt bạn chải từ vựng."},
 fold:{n:"Mèo tai cụp",jp:"スコティッシュ",p:2500,f:m=>cat(CAT.fold,m),say:"Tai cụp nhưng nghe giỏi lắm nha, luyện nghe thôi!"},
 hamu:{n:"Chuột hamster",jp:"ハムスター",p:1000,f:hamu,say:"Hạt hướng dương = năng lượng học bài!"},
 usagi:{n:"Thỏ trắng",jp:"うさぎ",p:1600,f:usagi,say:"Nhảy từng bước nhỏ thôi, mỗi ngày một chút~"},
 shiba:{n:"Chó Shiba",jp:"柴犬",p:2000,f:shiba,say:"ワン！ Đi dạo xong là học tiếp nhé!"},
 corgi:{n:"Chó Corgi",jp:"コーギー",p:2500,f:corgi,say:"Chân ngắn nhưng chạy tới N2 vẫn kịp!"},
 fukurou:{n:"Cú mèo",jp:"ふくろう",p:2200,f:fukurou,say:"ふくろう nghe như 不苦労 — không còn khổ nữa đó."},
 pen:{n:"Chim cánh cụt",jp:"ペンギン",p:2400,f:pen,say:"Lạch bạch… nhưng chưa bao giờ bỏ cuộc!"},
 tanuki:{n:"Lửng chó",jp:"たぬき",p:2600,f:tanuki,say:"Đặt lá lên đầu là biến thành học sinh giỏi~"},
 kitsune:{n:"Cáo nhỏ",jp:"きつね",p:2800,f:m=>kitsune(m,false),say:"コンコン！ Hôm nay mình học gì đây?"},
 lesser:{n:"Gấu trúc đỏ",jp:"レッサーパンダ",p:3000,f:lesser,say:"Đứng thẳng lên là cao bằng điểm đỗ rồi!"},
 kyubi:{n:"Hồ ly chín đuôi",jp:"九尾の狐",p:8000,need:5,f:m=>kitsune(m,true),say:"Chín cái đuôi, chín bài thi thử — mình đi cùng bạn hết.",rare:1},
 ryu:{n:"Rồng con",jp:"子竜",p:12000,need:10,f:ryu,say:"Một ngày nào đó mình sẽ bay cao — như điểm thi của bạn!",rare:1},
 kinneko:{n:"Mèo vàng đỗ đạt",jp:"合格招き猫",p:5000,card:30,f:kinneko,say:"Vẫy tay gọi chữ 合格 về cho bạn nè!",rare:1}
};
A.PET_ORDER=Object.keys(PETS);
A.petSVG=function(id,o){ o=o||{}; const P=PETS[id]; if(!P) return ""; let body=""; try{ body=P.f(o.mood||"idle") }catch(e){ console.error(e) }
  let deco=""; const lv=o.lv||0;
  if(lv>=5) deco+=`<path d="M33,64 q17,7 34,0" stroke="#FF5A7A" stroke-width="3.500" fill="none" stroke-linecap="round"/><circle cx="50" cy="68.500" r="3.400" fill="#FFD23F" stroke="#B88A10" stroke-width="1"/>`;
  if(lv>=10) deco+=`<g transform="translate(66 22) rotate(18)"><path d="M-9,4 L-10,-6 L-4,-1 L0,-9 L4,-1 L10,-6 L9,4Z" fill="#FFC93C" stroke="#DE9E05" stroke-width="1.200" stroke-linejoin="round"/></g>`;
  if(o.mood==="happy") deco+=`<g class="v15-hearts" fill="#FF6F91"><path d="M84,24 c-3,-4 -9,0 0,7 c9,-7 3,-11 0,-7z"/><path d="M14,30 c-2,-3 -7,0 0,5 c7,-5 2,-8 0,-5z"/></g>`;
  if(o.mood==="hungry") deco+=`<g transform="translate(82 18)"><circle r="9" fill="#FFFFFF" stroke="${OL}" stroke-width="1.200"/><path d="M-4,1 q4,-6 8,0 q-4,4 -8,0z" fill="#C98A3E"/><circle cx="-12" cy="10" r="2.400" fill="#FFFFFF" stroke="${OL}" stroke-width="1"/></g>`;
  return `<svg class="v15-pet${o.cls?" "+o.cls:""}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}${deco}</svg>` };
A.petShadow=function(id){ return A.petSVG(id).replace(/fill="#[0-9A-Fa-f]{3,6}"/g,'fill="#C9CED8"').replace(/stroke="#[0-9A-Fa-f]{3,6}"/g,'stroke="#AEB6C2"') };
A.CHARM=A.CHARM||{};
A.CHARM.oyatsu=`<svg viewBox="0 0 56 56" aria-hidden="true"><path d="M8,30 q20,-16 40,0 l-4,18 h-32z" fill="#FFB3C4" stroke="#E0607A" stroke-width="2" stroke-linejoin="round"/><path d="M14,30 h28" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/><g><path d="M18,22 q2,-8 10,-8 q8,0 10,8z" fill="#C98A3E" stroke="#8A5A28" stroke-width="1.600"/><path d="M22,18 l3,2 M30,16 l2,3" stroke="#FFF1C8" stroke-width="1.600"/></g><path d="M22,38 l2,-3 l2,3 l3,1 l-3,1 l-2,3 l-2,-3 l-3,-1z" fill="#fff"/></svg>`;

/* ================= THẺ BÀI · 漢字戦士 Chiến binh Kanji ================= */
/* [kanji, Hán Việt, nghĩa, âm On, âm Kun, tên trận (vi), màu 1, màu 2, mũ, kính, hoạ tiết] */
const CD=[
 ["火","HỎA","lửa","カ","ひ","Lửa","#E8452C","#FFB13B",0,0,"flame"],["水","THỦY","nước","スイ","みず","Nước","#2E8BE6","#8FD3FF",1,1,"wave"],["木","MỘC","cây, gỗ","モク・ボク","き","Cây","#3FA64C","#B5E36B",2,0,"leaf"],
 ["金","KIM","vàng, tiền","キン・コン","かね","Hoàng Kim","#D9A400","#FFE680",3,1,"rays"],["土","THỔ","đất","ド・ト","つち","Đất","#A0703C","#E3C08A",4,0,"rock"],["日","NHẬT","mặt trời, ngày","ニチ・ジツ","ひ・か","Mặt Trời","#FF8A1F","#FFE27A",0,2,"sun"],
 ["月","NGUYỆT","mặt trăng, tháng","ゲツ・ガツ","つき","Mặt Trăng","#5B5FD6","#C9CCFF",1,0,"moon"],["山","SƠN","núi","サン","やま","Núi","#4E7D5B","#A8D5A2",3,0,"rock"],["川","XUYÊN","sông","セン","かわ","Dòng Sông","#2AA3B8","#A6E6F0",2,1,"wave"],
 ["石","THẠCH","đá","セキ","いし","Đá","#7A7F8A","#C9CED8",4,2,"rock"],["花","HOA","hoa","カ","はな","Hoa","#F06292","#FFC1D9",0,1,"petal"],["雨","VŨ","mưa","ウ","あめ","Mưa","#4A7FC1","#B7D3F2",1,2,"rain"],
 ["雪","TUYẾT","tuyết","セツ","ゆき","Tuyết","#6FB7E0","#E8F6FF",2,1,"snow"],["草","THẢO","cỏ","ソウ","くさ","Cỏ Xanh","#5AAE3A","#CDEFA0",4,1,"leaf"],["竹","TRÚC","tre","チク","たけ","Tre","#3C9A5F","#BDE8C8",3,2,"leaf"],
 ["糸","MỊCH","sợi chỉ","シ","いと","Sợi Chỉ","#C25BB0","#F3C4EA",0,1,"wind"],["刀","ĐAO","đao, dao","トウ","かたな","Đao","#59606E","#D5DAE3",1,0,"spark"],["力","LỰC","sức mạnh","リョク・リキ","ちから","Sức Mạnh","#D9432F","#FFB59E",3,0,"rays"],
 ["心","TÂM","trái tim, tâm","シン","こころ","Trái Tim","#E84A7F","#FFC3D6",2,2,"petal"],["目","MỤC","mắt","モク","め","Con Mắt","#3B6FD8","#BFD2FF",4,2,"rays"],["手","THỦ","tay","シュ","て","Bàn Tay","#E07A2E","#FFD1A8",0,0,"rays"],
 ["足","TÚC","chân; đủ","ソク","あし・たりる","Đôi Chân","#7B5CD6","#D8CCFF",1,1,"wind"],["光","QUANG","ánh sáng","コウ","ひかり","Ánh Sáng","#F2B000","#FFF3B0",2,2,"sun"],["音","ÂM","âm thanh","オン・イン","おと","Âm Thanh","#1FA2A8","#B5F0EE",3,1,"wind"],
 ["風","PHONG","gió","フウ","かぜ","Gió","#35B37E","#C5F2DD",2,1,"wind"],["雷","LÔI","sấm sét","ライ","かみなり","Sấm Sét","#F2C200","#4A3FB0",1,0,"spark"],["炎","VIÊM","ngọn lửa","エン","ほのお","Hỏa Diệm","#FF5A1F","#FFD23F",3,0,"flame"],
 ["氷","BĂNG","băng","ヒョウ","こおり","Băng Giá","#4FC3F7","#E1F7FF",4,1,"snow"],["鉄","THIẾT","sắt, thép","テツ","—","Thép","#5E6673","#B0B8C4",1,2,"spark"],["星","TINH","ngôi sao","セイ","ほし","Ngôi Sao","#6A4FD6","#FFE27A",0,1,"star"],
 ["雲","VÂN","mây","ウン","くも","Mây","#7FA6D9","#FFFFFF",2,2,"wind"],["森","SÂM","rừng rậm","シン","もり","Rừng","#2E7D4F","#9FD9A8",3,1,"leaf"],["海","HẢI","biển","カイ","うみ","Biển Cả","#1565C0","#7FD0F0",1,1,"wave"],
 ["空","KHÔNG","bầu trời; trống","クウ","そら・から","Bầu Trời","#2E9BEA","#D4EEFF",4,0,"wind"],["牙","NHA","nanh","ガ・ゲ","きば","Nanh Sắc","#8A3B2E","#F2E6D0",3,0,"spark"],["翼","DỰC","cánh","ヨク","つばさ","Đôi Cánh","#2FA7C9","#FFFFFF",2,1,"wind"],
 ["剣","KIẾM","kiếm","ケン","つるぎ","Thanh Kiếm","#4A5A8A","#D5DCF2",1,0,"spark"],["盾","THUẪN","cái khiên","ジュン","たて","Lá Chắn","#3E7F6A","#D9C27A",4,2,"rays"],
 ["龍","LONG","rồng","リュウ","たつ","Rồng","#1E9E7A","#FFD86B",1,0,"wave"],["虎","HỔ","hổ","コ","とら","Mãnh Hổ","#F08A1F","#2B2320",3,0,"spark"],["鷹","ƯNG","chim ưng","ヨウ","たか","Chim Ưng","#7A4E2E","#F2E2C6",2,1,"wind"],
 ["鬼","QUỶ","quỷ","キ","おに","Quỷ Đỏ","#C62828","#FFCDD2",1,2,"flame"],["影","ẢNH","cái bóng","エイ","かげ","Bóng Tối","#3A2E5C","#9C8BD6",4,1,"moon"],["時","THỜI","thời gian","ジ","とき","Thời Gian","#00897B","#B2DFDB",0,2,"star"],
 ["夢","MỘNG","giấc mơ","ム","ゆめ","Giấc Mơ","#C05BD6","#FFD6F5",2,1,"star"],
 ["神","THẦN","thần","シン・ジン","かみ","Thần Linh","#D9A400","#FFFFFF",3,2,"rays"],["天","THIÊN","trời","テン","あめ・あま","Thiên Không","#4F8DF7","#FFF3B0",2,0,"sun"],["輝","HUY","toả sáng","キ","かがやく","Hào Quang","#FF4FA0","#FFE27A",0,1,"star"]
];
const RAR=["N","R","SR","SSR"];
const CARDS=A.CARDS=CD.map((c,i)=>({id:"c"+String(i+1).padStart(2,"0"),no:i+1,k:c[0],hv:c[1],m:c[2],on:c[3],kun:c[4],vi:c[5],c1:c[6],c2:c[7],hm:c[8],vs:c[9],mo:c[10],r:i<24?0:i<38?1:i<45?2:3}));
CARDS.forEach(c=>c.jp=c.k+(c.r===3?"の覇者":c.r===2?"の勇者":"の戦士"));
A.RAR=RAR;
const RC=[{bd:"#8E9AA8",bg:"#EEF2F6",tx:"#4A5563"},{bd:"#3D8BDB",bg:"#E6F1FC",tx:"#1F5FA8"},{bd:"#8A5CE0",bg:"#F1EBFF",tx:"#5B34B0",gold:1},{bd:"#E0A800",bg:"#FFF8E1",tx:"#9A6A00",gold:1,holo:1}];
function motif(mo,c1,c2){ const o=`opacity=".55"`;
  switch(mo){
   case "flame": return `<g fill="${c2}" ${o}><path d="M20,112 q-6,-22 8,-34 q-2,14 8,18 q-2,-20 12,-30 q-4,18 8,26 q4,-10 0,-18 q16,14 10,38z"/><path d="M76,112 q-4,-16 6,-26 q0,10 6,12 q0,-14 10,-20 q-2,14 4,20 q6,8 2,14z"/></g>`;
   case "wave": return `<g fill="none" stroke="${c2}" stroke-width="4" ${o}>${[86,98,110].map(y=>`<path d="M8,${y} q13,-10 26,0 t26,0 t26,0 t26,0"/>`).join("")}</g>`;
   case "leaf": return `<g fill="${c2}" ${o}>${[[22,40,-30],[96,50,30],[18,96,-60],[100,96,50],[60,30,0]].map(([x,y,r])=>`<path d="M${x},${y} q10,-12 0,-24 q-10,12 0,24z" transform="rotate(${r} ${x} ${y})"/>`).join("")}</g>`;
   case "rays": return `<g fill="${c2}" ${o}>${[...Array(12)].map((_,i)=>`<path d="M60,70 L${60+70*Math.cos(i*Math.PI/6-.12)},${70+70*Math.sin(i*Math.PI/6-.12)} L${60+70*Math.cos(i*Math.PI/6+.12)},${70+70*Math.sin(i*Math.PI/6+.12)}Z"/>`).join("")}</g>`;
   case "rock": return `<g fill="${c2}" ${o}><path d="M8,112 L22,84 L34,96 L50,72 L66,98 L80,80 L96,100 L112,86 V112Z"/></g>`;
   case "sun": return `<g ${o}><circle cx="60" cy="58" r="30" fill="${c2}"/>${[...Array(16)].map((_,i)=>`<path d="M${60+34*Math.cos(i*Math.PI/8)},${58+34*Math.sin(i*Math.PI/8)} L${60+44*Math.cos(i*Math.PI/8)},${58+44*Math.sin(i*Math.PI/8)}" stroke="${c2}" stroke-width="4" stroke-linecap="round"/>`).join("")}</g>`;
   case "moon": return `<g ${o}><circle cx="88" cy="40" r="18" fill="${c2}"/><circle cx="96" cy="34" r="15" fill="${c1}"/>${[[20,34],[30,60],[100,80],[16,90]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.800" fill="${c2}"/>`).join("")}</g>`;
   case "petal": return `<g fill="${c2}" ${o}>${[[20,36],[98,44],[28,92],[96,96],[58,26],[14,64],[106,70]].map(([x,y],i)=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="4" transform="rotate(${i*40} ${x} ${y})"/>`).join("")}</g>`;
   case "rain": return `<g stroke="${c2}" stroke-width="2.400" stroke-linecap="round" ${o}>${[...Array(14)].map((_,i)=>`<path d="M${10+i*8},${28+(i*17)%50} l-4,10"/>`).join("")}</g>`;
   case "snow": return `<g fill="${c2}" ${o}>${[...Array(14)].map((_,i)=>`<circle cx="${10+(i*29)%100}" cy="${28+(i*23)%80}" r="${2+i%3}"/>`).join("")}</g>`;
   case "star": return `<g fill="${c2}" ${o}>${[[22,36,6],[98,42,8],[18,94,5],[100,98,6],[60,26,4]].map(([x,y,r])=>`<path d="M${x},${y-r} L${x+r*.3},${y-r*.3} L${x+r},${y} L${x+r*.3},${y+r*.3} L${x},${y+r} L${x-r*.3},${y+r*.3} L${x-r},${y} L${x-r*.3},${y-r*.3}Z"/>`).join("")}</g>`;
   case "spark": return `<g fill="${c2}" ${o}><path d="M22,30 l10,18 h-8 l10,22 l-18,-26 h8z"/><path d="M98,40 l8,14 h-6 l8,18 l-14,-20 h6z"/></g>`;
   default: return `<g fill="none" stroke="${c2}" stroke-width="3" stroke-linecap="round" ${o}><path d="M10,46 q30,-10 54,0 q20,8 44,-4"/><path d="M14,96 q26,-12 50,0 q22,10 44,-2"/></g>`;
  } }
/* chiến binh: mũ giáp chibi + kính + huy hiệu kanji trên ngực (nhân vật gốc) */
function hero(c,g){ const c1=c.c1, c2=c.c2, dk="#232533", st=`stroke="${dk}" stroke-width="1.600" stroke-linejoin="round"`;
  let s="";
  if(c.r===3) s+=`<g fill="#FFE27A" stroke="#C99A1E" stroke-width="1.400" stroke-linejoin="round"><path d="M34,84 q-26,-10 -26,-44 q10,10 20,8 q-8,8 2,14 q-8,6 4,12z"/><path d="M86,84 q26,-10 26,-44 q-10,10 -20,8 q8,8 -2,14 q8,6 -4,12z"/></g>`;
  if(c.r>=2) s+=`<path d="M30,86 q-10,14 -16,28 h92 q-6,-14 -16,-28z" fill="${c2}" opacity=".85" ${st}/>`;
  s+=`<path d="M24,112 q2,-26 36,-28 q34,2 36,28z" fill="${c1}" ${st}/><path d="M34,112 q2,-18 26,-20 q24,2 26,20z" fill="#2E3142"/>`;
  s+=`<path d="M26,96 q-8,-8 -4,-16 l12,4z M94,96 q8,-8 4,-16 l-12,4z" fill="${c2}" ${st}/>`;
  s+=`<path d="M60,84 q-12,0 -16,14 h32 q-4,-14 -16,-14z" fill="${c2}" opacity=".9"/><circle cx="60" cy="101" r="9" fill="#FFFFFF" ${st}/><text x="60" y="105.500" font-size="11" text-anchor="middle" fill="${c1}" font-family="'BIZ UDPMincho','Hiragino Mincho ProN',serif" font-weight="800">${c.k}</text>`;
  s+=`<path d="M48,84 l2,-8 h20 l2,8z" fill="#3A3D50"/>`;
  const H=c.hm; let hl="";
  if(H===1) hl=`<path d="M36,46 q-14,-12 -12,-28 q8,10 18,16z M84,46 q14,-12 12,-28 q-8,10 -18,16z" fill="${c2}" ${st}/>`;
  if(H===2) hl=`<path d="M56,26 q4,-18 14,-22 q-2,12 -6,24z" fill="${c2}" ${st}/>`;
  if(H===3) hl=`<path d="M44,30 l-6,-16 l12,10z M60,26 l0,-18 l6,16z M76,30 l6,-16 l-12,10z" fill="${c2}" ${st}/>`;
  if(H===4) hl=`<path d="M36,38 l2,-18 l14,10z M84,38 l-2,-18 l-14,10z" fill="${c2}" ${st}/>`;
  s+=hl+`<path d="M32,56 q0,-30 28,-30 q28,0 28,30 q0,14 -6,22 h-44 q-6,-8 -6,-22z" fill="${c1}" ${st}/><path d="M38,40 q6,-10 18,-12" stroke="#FFFFFF" stroke-width="3" opacity=".45" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="M38,78 q-2,-6 2,-10 h40 q4,4 2,10z" fill="${c2}" ${st}/><path d="M50,74 h20" stroke="${dk}" stroke-width="1.600" stroke-linecap="round"/>`;
  const V=c.vs; if(V===0) s+=`<path d="M36,52 q24,-8 48,0 l-2,12 q-22,-6 -44,0z" fill="#1E2030" ${st}/><path d="M42,54 q18,-5 36,0" stroke="${c2}" stroke-width="2.400" fill="none" opacity=".9"/>`;
  else if(V===1) s+=`<path d="M38,52 q10,-4 18,6 q-10,6 -18,2z M82,52 q-10,-4 -18,6 q10,6 18,2z" fill="#1E2030" ${st}/><path d="M42,54 l8,3 M78,54 l-8,3" stroke="${c2}" stroke-width="2.200" stroke-linecap="round"/>`;
  else s+=`<path d="M36,50 h48 v10 q-24,8 -48,0z" fill="#1E2030" ${st}/><circle cx="60" cy="55" r="5" fill="${c2}"/><circle cx="61.500" cy="53.500" r="1.600" fill="#FFFFFF"/>`;
  s+=`<g transform="translate(60 36)"><circle r="7" fill="#FFFFFF" ${st}/><text y="3.500" font-size="9" text-anchor="middle" fill="${dk}" font-family="'BIZ UDPMincho',serif" font-weight="800">${c.k}</text></g>`;
  return s }
A.cardSVG=function(id,o){ o=o||{}; const c=CARDS.find(x=>x.id===id); if(!c) return ""; const R=RC[c.r], u=uid("cd"), holo=o.holo||R.holo;
  let s=`<defs><linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.c1}"/><stop offset="1" stop-color="${c.c2}"/></linearGradient>`;
  if(holo) s+=`<linearGradient id="${u}h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF7AB8"/><stop offset=".25" stop-color="#FFE27A"/><stop offset=".5" stop-color="#7FFFD4"/><stop offset=".75" stop-color="#7FB2FF"/><stop offset="1" stop-color="#E07AFF"/></linearGradient>`;
  s+=`<clipPath id="${u}c"><rect x="8" y="22" width="104" height="90" rx="6"/></clipPath></defs>`;
  s+=`<rect x="1" y="1" width="118" height="166" rx="10" fill="${holo?`url(#${u}h)`:R.bd}"/><rect x="5" y="5" width="110" height="158" rx="7" fill="${R.bg}"/>`;
  if(R.gold) s+=`<rect x="3" y="3" width="114" height="162" rx="9" fill="none" stroke="#F2C230" stroke-width="1.600"/>`;
  s+=`<g clip-path="url(#${u}c)"><rect x="8" y="22" width="104" height="90" fill="url(#${u}b)"/>${motif(c.mo,c.c1,"#FFFFFF")}<text x="96" y="60" font-size="44" text-anchor="middle" fill="#FFFFFF" opacity=".22" font-family="'BIZ UDPMincho',serif" font-weight="800">${c.k}</text>${hero(c)}${holo?`<rect x="8" y="22" width="104" height="90" fill="url(#${u}h)" opacity=".28" style="mix-blend-mode:screen"/><rect class="v15-shine" x="-40" y="10" width="26" height="120" fill="#FFFFFF" opacity=".35" transform="rotate(20 0 60)"/>`:""}</g>`;
  s+=`<rect x="8" y="22" width="104" height="90" rx="6" fill="none" stroke="${R.bd}" stroke-width="1.600"/>`;
  s+=`<rect x="8" y="8" width="${c.r===3?30:c.r===2?24:18}" height="12" rx="4" fill="${R.bd}"/><text x="${8+(c.r===3?15:c.r===2?12:9)}" y="17.500" font-size="8.500" text-anchor="middle" fill="#FFFFFF" font-family="Nunito,sans-serif" font-weight="900">${RAR[c.r]}</text>`;
  s+=`<text x="112" y="17.500" font-size="8" text-anchor="end" fill="${R.tx}" font-family="Nunito,sans-serif" font-weight="800">No.${String(c.no).padStart(2,"0")}</text>`;
  s+=`<text x="60" y="125" font-size="10.500" text-anchor="middle" fill="${R.tx}" font-family="'BIZ UDPMincho','Hiragino Mincho ProN',serif" font-weight="800">${c.jp}</text>`;
  s+=`<text x="60" y="137" font-size="8.500" text-anchor="middle" fill="#3A3D50" font-family="Nunito,sans-serif" font-weight="800">Chiến binh ${c.vi}</text>`;
  s+=`<line x1="14" y1="142" x2="106" y2="142" stroke="${R.bd}" stroke-width=".8" opacity=".6"/>`;
  s+=`<text x="60" y="152" font-size="7.600" text-anchor="middle" fill="#3A3D50" font-family="'BIZ UDPGothic',Nunito,sans-serif">音 ${c.on}　訓 ${c.kun}</text>`;
  s+=`<text x="60" y="160.500" font-size="7.200" text-anchor="middle" fill="${R.tx}" font-family="Nunito,sans-serif" font-weight="700">${c.hv} · ${c.m}</text>`;
  if(o.holo&&!R.holo) s+=`<g transform="translate(100 104) rotate(-14)"><rect x="-14" y="-6" width="28" height="12" rx="4" fill="#FFFFFF" opacity=".9"/><text y="3.200" font-size="7.500" text-anchor="middle" fill="#B04AD6" font-family="Nunito,sans-serif" font-weight="900">HOLO</text></g>`;
  return `<svg class="v15-card r${c.r}${holo?" holo":""}" viewBox="0 0 120 168" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thẻ ${c.jp} — ${c.hv}, ${c.m}">${s}</svg>` };
A.cardBack=function(r){ const u=uid("cb"); return `<svg class="v15-card back" viewBox="0 0 120 168" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A2E8C"/><stop offset="1" stop-color="#C2185B"/></linearGradient></defs><rect x="1" y="1" width="118" height="166" rx="10" fill="url(#${u})"/><rect x="7" y="7" width="106" height="154" rx="7" fill="none" stroke="#FFD86B" stroke-width="1.600"/><g fill="#FFFFFF" opacity=".12">${[...Array(8)].map((_,i)=>`<text x="${16+(i%4)*28}" y="${40+Math.floor(i/4)*90}" font-size="22" font-family="'BIZ UDPMincho',serif">漢</text>`).join("")}</g><circle cx="60" cy="84" r="30" fill="none" stroke="#FFD86B" stroke-width="2.400"/><text x="60" y="96" font-size="32" text-anchor="middle" fill="#FFD86B" font-family="'BIZ UDPMincho',serif" font-weight="800">字</text><text x="60" y="146" font-size="8" text-anchor="middle" fill="#FFD86B" font-family="Nunito,sans-serif" font-weight="900" letter-spacing="1">KANJI SENSHI</text></svg>` };
A.packSVG=function(gold){ const c=gold?["#FFC93C","#E0A800","#8A5A00"]:["#7FB2FF","#3D6FD8","#1F3F8A"], u=uid("pk");
  return `<svg class="v15-pack" viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><path d="M8,8 h64 l-2,6 l2,6 v76 l-2,6 l2,6 h-64 l2,-6 l-2,-6 v-76 l2,-6z" fill="url(#${u})" stroke="${c[2]}" stroke-width="2" stroke-linejoin="round"/><path d="M8,20 h64 M8,96 h64" stroke="${c[2]}" stroke-width="1.400" stroke-dasharray="3 2"/><circle cx="40" cy="56" r="20" fill="#FFFFFF" opacity=".92"/><text x="40" y="64" font-size="22" text-anchor="middle" fill="${c[2]}" font-family="'BIZ UDPMincho',serif" font-weight="800">${gold?"極":"戦"}</text><text x="40" y="88" font-size="8" text-anchor="middle" fill="#FFFFFF" font-family="Nunito,sans-serif" font-weight="900">${gold?"×5 · R+":"×3"}</text>${gold?`<g fill="#FFFFFF" class="v15-sparkle"><path d="M16,32 l1.600,-5 l1.600,5 l5,1.600 l-5,1.600 l-1.600,5 l-1.600,-5 l-5,-1.600z"/><path d="M62,76 l1.200,-4 l1.200,4 l4,1.200 l-4,1.200 l-1.200,4 l-1.200,-4 l-4,-1.200z"/></g>`:""}</svg>` };

/* ================= phụ kiện mới ================= */
if(A.ACC) Object.assign(A.ACC,{
 usamimi:{slot:"head",bb:[-40,-58,80,66],at:{svg:[100,34,0,1],my:[100,40,0,1.4]},
  d:`<path d="M-26,4 Q-38,-34 -24,-54 Q-12,-40 -12,2Z M26,4 Q38,-34 24,-54 Q12,-40 12,2Z" fill="#FFFFFF" stroke="#D9C9D6" stroke-width="1.800" stroke-linejoin="round"/><path d="M-22,-4 Q-30,-30 -23,-44 Q-16,-32 -16,-4Z M22,-4 Q30,-30 23,-44 Q16,-32 16,-4Z" fill="#FFB7CE"/><path d="M-34,6 Q0,-8 34,6" stroke="#FF6FA0" stroke-width="5" fill="none" stroke-linecap="round"/>`},
 beret:{slot:"head",bb:[-46,-28,92,38],at:{svg:[104,30,-8,1],my:[92,32,-12,1.4]},
  d:`<path d="M-42,4 Q-44,-24 0,-24 Q40,-24 44,0 Q30,8 0,8 Q-30,10 -42,4Z" fill="#C2185B" stroke="#8A1040" stroke-width="1.800" stroke-linejoin="round"/><path d="M-36,4 Q0,12 38,2" stroke="#8A1040" stroke-width="3" fill="none"/><path d="M0,-24 l2,-6 l3,1" stroke="#8A1040" stroke-width="2.400" fill="none" stroke-linecap="round"/>`},
 majo:{slot:"head",bb:[-52,-80,104,92],at:{svg:[100,30,-8,1],my:[100,28,-8,1.38]},
  d:`<path d="M-24,0 Q-8,-40 4,-62 Q14,-78 28,-74 Q14,-66 12,-50 Q18,-20 26,0Z" fill="#4A2E7A" stroke="#2A1A4A" stroke-width="1.800" stroke-linejoin="round"/><path d="M-22,-8 Q2,-14 24,-8 L26,0 Q2,-6 -24,0Z" fill="#FFB13B"/><path d="M-50,2 Q0,-14 50,2 Q0,14 -50,2Z" fill="#5B3A8F" stroke="#2A1A4A" stroke-width="1.800"/><path d="M8,-36 l2,-5 l2,5 l5,1 l-5,1 l-2,5 l-2,-5 l-5,-1z" fill="#FFE27A"/>`},
 tenshi:{slot:"head",bb:[-36,-14,72,22],at:{svg:[100,12,-4,1],my:[100,5,-4,1.3]},
  d:`<ellipse cx="0" cy="0" rx="30" ry="8" fill="none" stroke="#FFD23F" stroke-width="6"/><ellipse cx="0" cy="0" rx="30" ry="8" fill="none" stroke="#FFF6C2" stroke-width="2"/><path d="M-30,-10 l1.400,-4 l1.400,4 l4,1.400 l-4,1.400 l-1.400,4 l-1.400,-4 l-4,-1.400z M32,6 l1,-3 l1,3 l3,1 l-3,1 l-1,3 l-1,-3 l-3,-1z" fill="#FFE27A"/>`},
 hoshipin:{slot:"head",bb:[-16,-16,32,32],at:{svg:[140,58,14,1],my:[156,84,14,1.35]},
  d:`<path d="M0,-14 L4,-4.500 L14,-4.300 L6.300,2 L9,12 L0,6.200 L-9,12 L-6.300,2 L-14,-4.300 L-4,-4.500Z" fill="#FFD23F" stroke="#E0A800" stroke-width="1.600" stroke-linejoin="round"/><circle cx="-3" cy="-3" r="2" fill="#FFFFFF" opacity=".8"/>`},
 tsuno:{slot:"head",bb:[-40,-30,80,34],at:{svg:[100,40,0,1],my:[100,52,0,1.42]},
  d:`<path d="M-30,2 Q-32,-18 -22,-28 Q-20,-12 -16,2Z M30,2 Q32,-18 22,-28 Q20,-12 16,2Z" fill="#FFE27A" stroke="#C99A1E" stroke-width="1.800" stroke-linejoin="round"/><path d="M-28,-6 h9 M-27,-14 h7 M28,-6 h-9 M27,-14 h-7" stroke="#C99A1E" stroke-width="1.400"/>`},
 heartglass:{slot:"face",bb:[-44,-18,88,34],at:{svg:[100,98,0,1],my:[100,137,0,1.56]},
  d:`<path d="M-22,12 C-40,0 -38,-16 -28,-16 C-24,-16 -22,-12 -22,-10 C-22,-12 -20,-16 -16,-16 C-6,-16 -4,0 -22,12Z M22,12 C4,0 6,-16 16,-16 C20,-16 22,-12 22,-10 C22,-12 24,-16 28,-16 C38,-16 40,0 22,12Z" fill="#FF4F8B" fill-opacity=".82" stroke="#C2185B" stroke-width="2"/><path d="M-7,-6 q7,-4 14,0" stroke="#C2185B" stroke-width="2.400" fill="none"/><path d="M-30,-10 l5,0 M14,-10 l5,0" stroke="#FFFFFF" stroke-width="2.400" stroke-linecap="round" opacity=".7"/>`},
 bansoko:{slot:"face",bb:[-14,-7,28,14],at:{svg:[128,114,-24,1],my:[148,162,-24,1.3]},
  d:`<rect x="-13" y="-5.500" width="26" height="11" rx="5.500" fill="#F7D2B0" stroke="#D9A57A" stroke-width="1.200"/><rect x="-5" y="-5" width="10" height="10" rx="1.500" fill="#FFE9D6"/><g fill="#D9A57A">${[[-9,-2],[-9,2],[9,-2],[9,2]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".8"/>`).join("")}</g>`}
});
})();
