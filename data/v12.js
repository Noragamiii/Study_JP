/* Sổ luyện N3 — v12: giao diện mới (xanh lá, 5 nhóm điều hướng) + bạn đồng hành Momo
   Phủ lên v11 theo cùng cách v11 phủ lên v10: bọc các hàm toàn cục (render, lkShow, lkHide, toast).
   Tắt: localStorage["so-luyen-n3-ui"]="v11" (hoặc Momo → Cài đặt → Dùng giao diện cũ). */
(function(){
"use strict";
if(!document.documentElement.classList.contains("v12")) return;
/* ===== Momo — bạn đồng hành (nhân vật gốc của Sổ luyện N3, vẽ bằng SVG) ===== */
const BD_MOODS=["idle","happy","wow","cheer","oops","think","explain","wave","sleepy","sad"];
let BD_SKIN="imp";
function buddySVG(mood,opt){ return (BD_SKIN==="my"&&window.BD_MY_IMG?bdMy:BD_SKIN==="momo"?bdMomo:bdImp)(mood,opt) }
/* v12.2: nhân vật do người dùng thiết kế (ảnh data/buddy-my.js, khung 200×285) */
function bdMy(mood,opt){
  mood=BD_MOODS.includes(mood)?mood:"idle"; opt=opt||{};
  const sp=(x,y,r)=>`<path class="bd-spark" d="M${x},${y-r} q${r*.18},${r*.82} ${r},${r} q${-r*.82},${r*.18} ${-r},${r} q${-r*.18},${-r*.82} ${-r},${-r} q${r*.82},${-r*.18} ${r},${-r}z" fill="#FFC93C"/>`;
  const T=(x,y,t,sz,c)=>`<text x="${x}" y="${y}" font-size="${sz}" fill="${c}" font-family="Nunito,system-ui,sans-serif" font-weight="900" stroke="#fff" stroke-width="3" paint-order="stroke">${t}</text>`;
  const drop=(x,y,c1,c2)=>`<path d="M${x},${y} c4,6 6,9.5 6,12.5 a6,6 0 0 1 -12,0 c0,-3 2,-6.5 6,-12.5z" fill="${c1}" stroke="${c2}" stroke-width="1.4"/>`;
  const FX={happy:sp(30,70,9)+sp(172,60,11)+sp(180,108,6),wow:T(160,62,"!",34,"#FF8A3D")+sp(30,64,8),cheer:sp(28,60,10)+sp(176,56,10)+T(150,40,"♪",22,"#FF6FA0"),
    oops:drop(166,70,"#8ED3FF","#58B4EE"),think:T(162,58,"?",30,"#4E9BFF")+`<circle cx="152" cy="74" r="3" fill="#4E9BFF"/>`,explain:sp(176,70,8)+T(150,46,"💡",22,"#000"),
    wave:T(160,52,"♪",24,"#FFB020"),sleepy:`<g fill="#7FB5FF" font-family="Nunito,system-ui,sans-serif" font-weight="900" stroke="#fff" stroke-width="2.5" paint-order="stroke"><text x="156" y="66" font-size="22">z</text><text x="172" y="46" font-size="16">z</text><text x="184" y="30" font-size="12">z</text></g>`,
    sad:drop(146,150,"#8ED3FF","#58B4EE"),idle:""};
  return `<svg class="bd bd-${mood} bd-myskin${opt.cls?" "+opt.cls:""}" viewBox="${opt.bust?"0 14 200 176":"0 0 200 285"}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="${opt.label||"Bạn đồng hành"}">
  <g class="bd-all"><g class="bd-my"><image href="${window.BD_MY_IMG}" xlink:href="${window.BD_MY_IMG}" x="0" y="0" width="200" height="285" preserveAspectRatio="xMidYMid meet"/></g>${FX[mood]||""}</g></svg>`;
}
function bdMomo(mood,opt){
  mood=BD_MOODS.includes(mood)?mood:"idle"; opt=opt||{};
  const HAIR="#5A3825", HAIR2="#7B5236", HAIR3="#432818", SKIN="#FFE6D3", SKIN2="#F6C9AE", TOP="#FFC93C", TOP2="#F2A91E", INK="#3A2418";
  const eyeOpen=(cx,look)=>{const dx=look?look[0]:0, dy=look?look[1]:0; return `
    <g class="bd-eye">
      <ellipse cx="${cx}" cy="99" rx="10" ry="13" fill="#fff"/>
      <ellipse cx="${cx+dx}" cy="${100+dy}" rx="8.6" ry="11.6" fill="#1F7A46"/>
      <ellipse cx="${cx+dx}" cy="${103+dy}" rx="6.4" ry="7.4" fill="#49C47E"/>
      <ellipse cx="${cx+dx}" cy="${99+dy}" rx="3.8" ry="5.2" fill="#12301F"/>
      <circle cx="${cx-3.4+dx}" cy="${93.5+dy}" r="3.3" fill="#fff"/>
      <circle cx="${cx+3.6+dx}" cy="${105+dy}" r="1.7" fill="#fff" opacity=".9"/>
      <path d="M${cx-11.5},94 Q${cx},81 ${cx+11.5},94" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>
    </g>`};
  const eyeStar=cx=>`
    <g class="bd-eye">
      <ellipse cx="${cx}" cy="99" rx="10" ry="13" fill="#fff"/>
      <ellipse cx="${cx}" cy="100" rx="8.6" ry="11.6" fill="#1F7A46"/>
      <path d="M${cx},90 l2.6,6.2 6.6,.6 -5,4.4 1.5,6.5 -5.7,-3.5 -5.7,3.5 1.5,-6.5 -5,-4.4 6.6,-.6z" fill="#FFE27A"/>
      <path d="M${cx-11.5},94 Q${cx},81 ${cx+11.5},94" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>
    </g>`;
  const eyeHappy=cx=>`<path d="M${cx-10},102 Q${cx},88 ${cx+10},102" fill="none" stroke="${INK}" stroke-width="3.8" stroke-linecap="round"/>`;
  const eyeSqueeze=(cx,dir)=>`<path d="M${cx-8*dir},92 L${cx+7*dir},99 L${cx-8*dir},106" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  const eyeSleepy=cx=>`<path d="M${cx-10},99 Q${cx},106 ${cx+10},99" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`;
  const brow=(cx,type)=>{ // type: 0 thường, 1 quyết tâm, 2 lo lắng
    const s=cx<100?1:-1;
    if(type===1) return `<path d="M${cx-9*s},76 L${cx+8*s},80" stroke="${HAIR3}" stroke-width="2.8" stroke-linecap="round"/>`;
    if(type===2) return `<path d="M${cx-9*s},80 L${cx+8*s},75" stroke="${HAIR3}" stroke-width="2.8" stroke-linecap="round"/>`;
    return `<path d="M${cx-8},78 Q${cx},75 ${cx+8},78" fill="none" stroke="${HAIR3}" stroke-width="2.6" stroke-linecap="round"/>`};
  const M={
    smile:`<path d="M92,118 Q100,125 108,118" fill="none" stroke="#9A4B3C" stroke-width="2.8" stroke-linecap="round"/>`,
    open:`<path d="M89,115 Q100,133 111,115 Z" fill="#B8434F" stroke="#9A4B3C" stroke-width="1.6" stroke-linejoin="round"/><path d="M94,122 Q100,128 106,122 Q100,119.5 94,122Z" fill="#FF9AA6"/>`,
    o:`<ellipse cx="100" cy="120" rx="4.6" ry="5.6" fill="#B8434F"/>`,
    wavy:`<path d="M90,120 q3.4,-4 6.6,0 t6.6,0 t6.6,0" fill="none" stroke="#9A4B3C" stroke-width="2.6" stroke-linecap="round"/>`,
    small:`<path d="M95,119 Q100,122 105,119" fill="none" stroke="#9A4B3C" stroke-width="2.6" stroke-linecap="round"/>`,
    frown:`<path d="M93,122 Q100,116 107,122" fill="none" stroke="#9A4B3C" stroke-width="2.6" stroke-linecap="round"/>`,
    cat:`<path d="M90,116 Q95,123 100,117 Q105,123 110,116" fill="none" stroke="#9A4B3C" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`
  };
  // tay: sleeve + bàn tay. Tọa độ vai trái (66,160), vai phải (134,160)
  const arm=(x1,y1,x2,y2,cls)=>`<g class="${cls||""}"><path d="M${x1},${y1} L${x2},${y2}" stroke="${TOP2}" stroke-width="21" stroke-linecap="round"/><path d="M${x1},${y1} L${x2},${y2}" stroke="${TOP}" stroke-width="17" stroke-linecap="round"/><circle cx="${x2+(x2-x1)*0.2}" cy="${y2+(y2-y1)*0.2}" r="8.6" fill="${SKIN}" stroke="${SKIN2}" stroke-width="1.4"/></g>`;
  const armsDown=arm(66,162,56,190)+arm(134,162,144,190);
  let eyes, mouth=M.smile, brows=brow(78,0)+brow(122,0), arms=armsDown, fx="", blush=.55, front="";
  switch(mood){
    case "idle": eyes=eyeOpen(78)+eyeOpen(122); break;
    case "happy": eyes=eyeHappy(78)+eyeHappy(122); mouth=M.open; blush=.8; arms=arm(66,160,42,128)+arm(134,160,158,128);
      fx=spark(30,96,7)+spark(172,90,8)+spark(160,40,5)+spark(40,44,5); break;
    case "wow": eyes=eyeStar(78)+eyeStar(122); mouth=M.open; blush=.8; arms=arm(66,160,40,132)+arm(134,160,160,132);
      fx=spark(26,84,8)+spark(176,78,9)+spark(150,30,6)+spark(52,30,6)+spark(186,128,5); break;
    case "cheer": eyes=eyeOpen(78)+eyeOpen(122); brows=brow(78,1)+brow(122,1); mouth=M.cat; arms=arm(66,160,46,130,"bd-pump")+arm(134,162,144,190);
      fx=`<path d="M28,110 l-8,-4 M30,122 l-9,1 M34,100 l-6,-7" stroke="#FF9F1C" stroke-width="3" stroke-linecap="round"/>`; break;
    case "oops": eyes=eyeSqueeze(78,1)+eyeSqueeze(122,-1); brows=brow(78,2)+brow(122,2); mouth=M.wavy; arms=arm(66,162,58,188)+arm(134,162,142,188);
      fx=`<path d="M158,56 c5,8 7,12 7,15.5 a7,7 0 0 1 -14,0 c0,-3.5 2,-7.5 7,-15.5z" fill="#8ED3FF" stroke="#58B4EE" stroke-width="1.4"/>`; break;
    case "think": eyes=eyeOpen(78,[-2.4,-3])+eyeOpen(122,[-2.4,-3]); mouth=M.small; brows=brow(78,0)+`<path d="M114,75 L130,78" stroke="${HAIR3}" stroke-width="2.8" stroke-linecap="round"/>`;
      arms=arm(66,162,56,190); front=arm(134,164,118,140);
      fx=`<g fill="#49C47E"><circle cx="170" cy="62" r="4"/><circle cx="182" cy="46" r="5.5"/><circle cx="170" cy="26" r="8"/></g>`; break;
    case "explain": eyes=eyeOpen(78)+eyeOpen(122); mouth=M.open; arms=arm(66,162,56,190);
      front=`<g class="bd-point">${arm(134,160,156,126)}<path d="M160.5,120 L164,104" stroke="${SKIN}" stroke-width="6.5" stroke-linecap="round"/><path d="M160.5,120 L164,104" stroke="${SKIN2}" stroke-width="1" stroke-linecap="round" opacity=".0"/></g>`;
      fx=`<g stroke="#FFC93C" stroke-width="3.2" stroke-linecap="round"><path d="M166,90 v-10"/><path d="M178,96 l7,-7"/><path d="M154,94 l-6,-7"/></g>`; break;
    case "wave": eyes=eyeOpen(78)+eyeHappy(122); mouth=M.open; arms=arm(66,162,56,190); front=arm(134,160,160,124,"bd-wave");
      fx=`<g stroke="#FF9F1C" stroke-width="3" stroke-linecap="round" fill="none"><path d="M180,104 q6,6 3,14"/><path d="M150,100 q-5,-8 -1,-14" opacity=".0"/></g>`; break;
    case "sleepy": eyes=eyeSleepy(78)+eyeSleepy(122); mouth=M.o; blush=.4; brows=brow(78,2)+brow(122,2);
      fx=`<g fill="#7FB5FF" font-family="Nunito,system-ui,sans-serif" font-weight="900"><text x="160" y="64" font-size="20">z</text><text x="174" y="46" font-size="15">z</text><text x="184" y="32" font-size="11">z</text></g>`; break;
    case "sad": eyes=eyeOpen(78,[0,2])+eyeOpen(122,[0,2]); brows=brow(78,2)+brow(122,2); mouth=M.frown; blush=.35;
      fx=`<path d="M136,112 c3,5 4.4,7.6 4.4,9.8 a4.4,4.4 0 0 1 -8.8,0 c0,-2.2 1.4,-4.8 4.4,-9.8z" fill="#8ED3FF" stroke="#58B4EE" stroke-width="1.2"/>`; break;
  }
  function spark(x,y,r){return `<path class="bd-spark" d="M${x},${y-r} q${r*.18},${r*.82} ${r},${r} q${-r*.82},${r*.18} ${-r},${r} q${-r*.18},${-r*.82} ${-r},${-r} q${r*.82},${-r*.18} ${r},${-r}z" fill="#FFC93C"/>`}
  return `<svg class="bd bd-${mood}${opt.cls?" "+opt.cls:""}" viewBox="${opt.bust?"14 6 172 150":"0 0 200 222"}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${opt.label||"Momo"}">
  <g class="bd-all">
    <!-- tóc sau -->
    <path d="M34,96 C28,44 62,18 100,18 C138,18 172,44 166,96 C169,122 168,140 160,154 C154,163 141,163 140,158 L60,158 C59,163 46,163 40,154 C32,140 31,122 34,96Z" fill="${HAIR3}"/>
    <!-- thân áo -->
    <path d="M62,160 C62,146 80,140 100,140 C120,140 138,146 138,160 L144,208 C144,216 138,220 130,220 L70,220 C62,220 56,216 56,208Z" fill="${TOP}"/>
    <path d="M57,200 L143,200 L144,208 C144,216 138,220 130,220 L70,220 C62,220 56,216 56,208Z" fill="${TOP2}"/>
    <path d="M100,176 c-5,-7 -15,-1 -9,7 c2.6,3.4 6,5.6 9,8 c3,-2.4 6.4,-4.6 9,-8 c6,-8 -4,-14 -9,-7z" fill="#fff" opacity=".9"/>
    ${arms}
    <!-- cổ áo / mũ -->
    <path d="M70,150 C74,160 88,166 100,166 C112,166 126,160 130,150 C124,142 112,138 100,138 C88,138 76,142 70,150Z" fill="${TOP2}"/>
    <rect x="92" y="132" width="16" height="16" rx="6" fill="${SKIN2}"/>
    <!-- mặt -->
    <ellipse cx="100" cy="92" rx="58" ry="53" fill="${SKIN}"/>
    <path d="M44,78 C60,64 140,64 156,78 C150,52 126,40 100,40 C74,40 50,52 44,78Z" fill="${SKIN2}" opacity=".55"/>
    <ellipse cx="62" cy="114" rx="10" ry="6" fill="#FF8FA3" opacity="${blush}"/>
    <ellipse cx="138" cy="114" rx="10" ry="6" fill="#FF8FA3" opacity="${blush}"/>
    <g class="bd-eyes">${eyes}</g>
    ${mouth}
    <!-- tóc mái -->
    <path d="M38,98 C30,46 64,20 100,20 C136,20 170,46 162,98 C160,84 154,72 146,64 C144,74 138,82 130,87 C131,77 127,68 121,61 C113,73 101,82 86,87 C89,79 87,70 82,63 C72,74 60,82 48,86 C44,90 40,94 38,98Z" fill="${HAIR}"/>
    <path d="M38,96 C34,112 37,132 46,146 C52,134 53,112 50,88Z" fill="${HAIR}"/>
    <path d="M162,96 C166,112 163,132 154,146 C148,134 147,112 150,88Z" fill="${HAIR}"/>
    <path d="M60,48 C76,32 112,28 134,40" fill="none" stroke="${HAIR2}" stroke-width="6" stroke-linecap="round" opacity=".9"/>
    <path d="M97,24 C88,6 104,-2 116,8 C108,8 103,15 106,25Z" fill="${HAIR}"/>
    ${brows}
    <!-- kẹp tóc quả đào -->
    <g transform="translate(147,60) rotate(18)">
      <path d="M0,-12 C5,-18 13,-15 12,-9 C7,-10 3,-9 0,-6Z" fill="#49C47E"/>
      <path d="M0,10 C-12,8 -13,-7 -5,-9 C-2,-10 0,-8 0,-6 C0,-8 2,-10 5,-9 C13,-7 12,8 0,10Z" fill="#FF8FA3"/>
      <path d="M0,-6 C-1,-1 -1,4 0,9" fill="none" stroke="#F0647E" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="-5" cy="-3" r="2" fill="#fff" opacity=".7"/>
    </g>
    ${front}
    ${fx}
  </g></svg>`;
}

/* ===== Nhân vật thứ hai: bạn đồng hành tinh nghịch (nhân vật gốc, cùng bộ 10 biểu cảm) ===== */
function bdImp(mood,opt){
  mood=BD_MOODS.includes(mood)?mood:"idle"; opt=opt||{};
  const HAIR="#EEF1F7", HAIR2="#FFFFFF", HAIR3="#CDD4E3", HLINE="#A7B1C6", BROW="#8F98AD", SKIN="#FFE6D3", SKIN2="#F6C9AE", TOP="#FF7A59", TOP2="#E4573A", INK="#2B2838", LIP="#9A4B3C";
  const lash=cx=>`<path d="M${cx-12},94.5 Q${cx},80.5 ${cx+12},94.5" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`;
  const eyeOpen=(cx,look)=>{const dx=look?look[0]:0, dy=look?look[1]:0; return `
    <g class="bd-eye">
      <ellipse cx="${cx}" cy="99" rx="10.5" ry="13.5" fill="#fff"/>
      <ellipse cx="${cx+dx}" cy="${100+dy}" rx="9" ry="12" fill="#B45309"/>
      <ellipse cx="${cx+dx}" cy="${103.5+dy}" rx="6.8" ry="7.6" fill="#FBBF24"/>
      <ellipse cx="${cx+dx}" cy="${99+dy}" rx="3.8" ry="5.2" fill="#3B1D06"/>
      <circle cx="${cx-3.6+dx}" cy="${93+dy}" r="3.7" fill="#fff"/>
      <circle cx="${cx+3.8+dx}" cy="${105.5+dy}" r="1.9" fill="#fff" opacity=".9"/>
      ${lash(cx)}
    </g>`};
  const eyeStar=cx=>`
    <g class="bd-eye">
      <ellipse cx="${cx}" cy="99" rx="10.5" ry="13.5" fill="#fff"/>
      <ellipse cx="${cx}" cy="100" rx="9" ry="12" fill="#B45309"/>
      <path d="M${cx},90 l2.6,6.2 6.6,.6 -5,4.4 1.5,6.5 -5.7,-3.5 -5.7,3.5 1.5,-6.5 -5,-4.4 6.6,-.6z" fill="#FFF3B0"/>
      ${lash(cx)}
    </g>`;
  const eyeHappy=cx=>`<path d="M${cx-10},103 Q${cx},89 ${cx+10},103" fill="none" stroke="${INK}" stroke-width="3.8" stroke-linecap="round"/>`;
  const eyeSqueeze=(cx,dir)=>`<path d="M${cx-8*dir},93 L${cx+7*dir},100 L${cx-8*dir},107" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  const eyeSleepy=cx=>`<path d="M${cx-10},100 Q${cx},107 ${cx+10},100" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`;
  const brow=(cx,type)=>{const s=cx<100?1:-1; // 0 thường, 1 quyết tâm, 2 lo lắng
    if(type===2) return `<path d="M${cx-9*s},80 L${cx+8*s},75.5" stroke="${BROW}" stroke-width="2.8" stroke-linecap="round"/>`;
    if(type===1) return `<path d="M${cx-9*s},76 L${cx+8*s},79.5" stroke="${BROW}" stroke-width="2.8" stroke-linecap="round"/>`;
    return `<path d="M${cx-8},78 Q${cx},74.5 ${cx+8},78" fill="none" stroke="${BROW}" stroke-width="2.8" stroke-linecap="round"/>`};
  const fang=(x,y)=>`<path d="M${x},${y} l1.9,3.8 l1.9,-4.6z" fill="#fff" stroke="${LIP}" stroke-width=".9" stroke-linejoin="round"/>`;
  const M={
    grin:`<path d="M92,118 Q100,125.5 108,118" fill="none" stroke="${LIP}" stroke-width="2.8" stroke-linecap="round"/>${fang(103.2,120.2)}`,
    open:`<path d="M87,114 Q100,135 113,114 Z" fill="#B8434F" stroke="${LIP}" stroke-width="1.6" stroke-linejoin="round"/><path d="M93,123 Q100,129 107,123 Q100,120 93,123Z" fill="#FF9AA6"/>${fang(91.5,114.6)}`,
    tehe:`<path d="M92,117 Q100,124 108,117" fill="none" stroke="${LIP}" stroke-width="2.6" stroke-linecap="round"/><path d="M99,120.5 q0,7.5 4,7.5 q4,0 4,-6.5z" fill="#FF9AA6" stroke="${LIP}" stroke-width="1.2" stroke-linejoin="round"/>`,
    o:`<ellipse cx="100" cy="121" rx="4.4" ry="5.4" fill="#B8434F"/>`,
    smirk:`<path d="M93,119 Q101,123 109,116" fill="none" stroke="${LIP}" stroke-width="2.6" stroke-linecap="round"/>`,
    pout:`<path d="M93,122 Q100,115 107,122" fill="none" stroke="${LIP}" stroke-width="2.6" stroke-linecap="round"/>`
  };
  const arm=(x1,y1,x2,y2,cls)=>`<g class="${cls||""}"><path d="M${x1},${y1} L${x2},${y2}" stroke="${TOP2}" stroke-width="21" stroke-linecap="round"/><path d="M${x1},${y1} L${x2},${y2}" stroke="${TOP}" stroke-width="17" stroke-linecap="round"/><circle cx="${x2+(x2-x1)*0.2}" cy="${y2+(y2-y1)*0.2}" r="8.6" fill="${SKIN}" stroke="${SKIN2}" stroke-width="1.4"/></g>`;
  const spark=(x,y,r)=>`<path class="bd-spark" d="M${x},${y-r} q${r*.18},${r*.82} ${r},${r} q${-r*.82},${r*.18} ${-r},${r} q${-r*.18},${-r*.82} ${-r},${-r} q${r*.82},${-r*.18} ${r},${-r}z" fill="#FFC93C"/>`;
  let eyes, mouth=M.grin, brows=brow(78,0)+brow(122,0), arms=arm(66,162,56,190)+arm(134,162,144,190), fx="", blush=.6, front="";
  switch(mood){
    case "idle": eyes=eyeOpen(78)+eyeOpen(122); break;
    case "happy": eyes=eyeHappy(78)+eyeHappy(122); mouth=M.open; blush=.75; arms=arm(66,160,42,128)+arm(134,160,158,128);
      fx=spark(28,98,7)+spark(174,92,8)+spark(162,40,5)+spark(36,150,5); break;
    case "wow": eyes=eyeStar(78)+eyeStar(122); mouth=M.open; blush=.75; arms=arm(66,160,40,132)+arm(134,160,160,132);
      fx=spark(24,90,8)+spark(178,80,9)+spark(156,30,6)+spark(186,130,5)+spark(30,150,5); break;
    case "cheer": eyes=eyeOpen(78)+eyeOpen(122); brows=brow(78,1)+brow(122,1); mouth=M.open; arms=arm(66,160,46,130,"bd-pump")+arm(134,162,144,190);
      fx=`<path d="M28,112 l-8,-4 M30,124 l-9,1 M34,102 l-6,-7" stroke="#FFC93C" stroke-width="3" stroke-linecap="round"/>`; break;
    case "oops": eyes=eyeSqueeze(78,1)+eyeSqueeze(122,-1); brows=brow(78,2)+brow(122,2); mouth=M.tehe; arms=arm(66,162,58,188); front=arm(134,160,150,112);
      fx=`<path d="M170,62 c5,8 7,12 7,15.5 a7,7 0 0 1 -14,0 c0,-3.5 2,-7.5 7,-15.5z" fill="#8ED3FF" stroke="#58B4EE" stroke-width="1.4"/>`; break;
    case "think": eyes=eyeOpen(78,[-2.4,-3])+eyeOpen(122,[-2.4,-3]); mouth=M.smirk; brows=brow(78,0)+`<path d="M114,74 L130,78" stroke="${BROW}" stroke-width="3.4" stroke-linecap="round"/>`;
      arms=arm(66,162,56,190); front=arm(134,164,118,140);
      fx=`<g fill="#FBBF24"><circle cx="172" cy="64" r="4"/><circle cx="184" cy="48" r="5.5"/><circle cx="174" cy="28" r="8"/></g>`; break;
    case "explain": eyes=eyeOpen(78)+eyeHappy(122); mouth=M.open; arms=arm(66,162,56,190);
      front=`<g class="bd-point">${arm(134,160,156,126)}<path d="M160.5,120 L164,104" stroke="${SKIN}" stroke-width="6.5" stroke-linecap="round"/></g>`;
      fx=`<g stroke="#FFC93C" stroke-width="3.2" stroke-linecap="round"><path d="M166,90 v-10"/><path d="M178,96 l7,-7"/><path d="M154,94 l-6,-7"/></g>`; break;
    case "wave": eyes=eyeHappy(78)+eyeHappy(122); mouth=M.open; arms=arm(66,162,56,190); front=arm(134,160,160,124,"bd-wave");
      fx=`<path d="M180,104 q6,6 3,14" stroke="#FFC93C" stroke-width="3" stroke-linecap="round" fill="none"/>`; break;
    case "sleepy": eyes=eyeSleepy(78)+eyeSleepy(122); mouth=M.o; blush=.35; brows=brow(78,2)+brow(122,2);
      fx=`<g fill="#7FB5FF" font-family="Nunito,system-ui,sans-serif" font-weight="900"><text x="164" y="64" font-size="20">z</text><text x="178" y="46" font-size="15">z</text><text x="188" y="32" font-size="11">z</text></g>`; break;
    case "sad": eyes=eyeOpen(78,[0,2])+eyeOpen(122,[0,2]); brows=brow(78,2)+brow(122,2); mouth=M.pout; blush=.3;
      fx=`<path d="M136,113 c3,5 4.4,7.6 4.4,9.8 a4.4,4.4 0 0 1 -8.8,0 c0,-2.2 1.4,-4.8 4.4,-9.8z" fill="#8ED3FF" stroke="#58B4EE" stroke-width="1.2"/>`; break;
  }
  return `<svg class="bd bd-${mood}${opt.cls?" "+opt.cls:""}" viewBox="${opt.bust?"14 6 172 150":"0 0 200 222"}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${opt.label||"Bạn đồng hành"}">
  <g class="bd-all">
    <!-- tóc sau: bob ngắn, ôm vào cổ -->
    <path d="M34,96 C28,44 62,16 100,16 C138,16 172,44 166,96 C168,114 164,131 155,143 C149,148 140,146 138,139 L62,139 C60,146 51,148 45,143 C36,131 32,114 34,96Z" fill="${HAIR3}" stroke="${HLINE}" stroke-width="1.6" stroke-linejoin="round"/>
    <!-- áo hoodie -->
    <path d="M62,160 C62,146 80,140 100,140 C120,140 138,146 138,160 L144,208 C144,216 138,220 130,220 L70,220 C62,220 56,216 56,208Z" fill="${TOP}"/>
    <path d="M57,200 L143,200 L144,208 C144,216 138,220 130,220 L70,220 C62,220 56,216 56,208Z" fill="${TOP2}"/>
    <path d="M100,174 l2.9,6.6 7.1,.7 -5.4,4.8 1.6,7 -6.2,-3.7 -6.2,3.7 1.6,-7 -5.4,-4.8 7.1,-.7z" fill="#fff" opacity=".95"/>
    ${arms}
    <path d="M68,152 C72,163 88,168 100,168 C112,168 128,163 132,152 C126,143 112,138 100,138 C88,138 74,143 68,152Z" fill="${TOP2}"/>
    <path d="M90,164 v12 M110,164 v12" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="92" y="132" width="16" height="16" rx="6" fill="${SKIN2}"/>
    <!-- mặt -->
    <ellipse cx="100" cy="92" rx="58" ry="53" fill="${SKIN}"/>
    <path d="M44,78 C60,64 140,64 156,78 C150,52 126,40 100,40 C74,40 50,52 44,78Z" fill="${SKIN2}" opacity=".55"/>
    <ellipse cx="61" cy="115" rx="9.5" ry="5.5" fill="#FF8FA3" opacity="${blush}"/>
    <ellipse cx="139" cy="115" rx="9.5" ry="5.5" fill="#FF8FA3" opacity="${blush}"/>
    <g class="bd-eyes">${eyes}</g>
    ${mouth}
    <!-- tóc mái bo tròn -->
    <path d="M38,98 C30,46 64,18 100,18 C136,18 170,46 162,98 C160,87 155,77 148,70 C146,78 141,84 133,88 C134,80 131,72 126,66 C119,76 110,84 97,88 C99,80 96,72 91,66 C84,76 74,84 62,88 C54,87 44,91 38,98Z" fill="${HAIR}" stroke="${HLINE}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M38,96 C35,110 37,124 45,134 C50,124 51,106 50,88Z" fill="${HAIR}" stroke="${HLINE}" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M162,96 C165,110 163,124 155,134 C150,124 149,106 150,88Z" fill="${HAIR}" stroke="${HLINE}" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M62,46 C78,31 112,27 134,39" fill="none" stroke="${HAIR2}" stroke-width="6" stroke-linecap="round" opacity=".95"/>
    <path d="M90,25 L85,5 L99,17 L107,1 L112,25" fill="${HAIR}" stroke="${HLINE}" stroke-width="1.6" stroke-linejoin="round"/>
    ${brows}
    <!-- kẹp tóc hình ngôi sao -->
    <path d="M55,50 l2.6,5.8 6.4,.6 -4.8,4.3 1.4,6.3 -5.6,-3.2 -5.6,3.2 1.4,-6.3 -4.8,-4.3 6.4,-.6z" fill="#FFC93C" stroke="#E6A417" stroke-width="1.2" stroke-linejoin="round"/>
    ${front}
    ${fx}
  </g></svg>`;
}

/* ---------- tiện ích ---------- */
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const V=window.V12={buddySVG,moods:BD_MOODS};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const safe=(f,d)=>{try{const v=f(); return v==null?d:v}catch(e){return d}};
const LS="so-luyen-n3-buddy";
const SKIN_NAME={my:"Ngọc",imp:"Riko",momo:"Momo"};
const DEF={name:"",skin:"my",theme:"auto",sound:true,quiet:false,lkAt:"buddy",seen:0,lastDay:0,folds:{}};
let B=(()=>{try{return Object.assign({},DEF,JSON.parse(localStorage.getItem(LS)||"{}"))}catch(e){return Object.assign({},DEF)}})();
if(!B.folds||typeof B.folds!=="object") B.folds={};
if(!SKIN_NAME[B.skin]) B.skin="my";
if(!B.mig122){B.mig122=1; B.skin="my"; if(B.name==="Riko"||B.name==="Momo") B.name="";} // v12.2: chuyển sang nhân vật của bạn
if(B.name==="Momo") B.name=""; // tên mặc định của bản trước → để trống, dùng tên theo nhân vật đang chọn
BD_SKIN=B.skin;
const rawName=()=>B.name||SKIN_NAME[B.skin]||"Ngọc";
function save(){try{localStorage.setItem(LS,JSON.stringify(B))}catch(e){}}
const RT={combo:0,miss:0,first:!B.seen,gap:B.lastDay?TODAY-B.lastDay:0,left:false,tip:"",lastAct:Date.now(),lastNudge:Date.now(),hiddenAt:0,sayT:0,last:{}};
B.seen=1; B.lastDay=TODAY; save();
const nm=()=>esc(rawName());
const J=t=>`<span class="v12-jp">${t}</span>`;

const IC={
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.8V20h13V9.8"/><path d="M10 20v-5.5h4V20"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 5.5c2.8-1.3 5.8-1.2 8.5.6 2.7-1.8 5.7-1.9 8.5-.6v13c-2.8-1.3-5.8-1.2-8.5.6-2.7-1.8-5.7-1.9-8.5-.6z"/><path d="M12 6.1v13"/></svg>',
  pen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.2-4.7L16.4 4.1a2.1 2.1 0 0 1 3 0l.5.5a2.1 2.1 0 0 1 0 3L8.7 18.8z"/><path d="M14.3 6.2l3.5 3.5"/></svg>',
  game:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M6.8 12.5h4M8.8 10.5v4"/><circle cx="15.3" cy="11.3" r="1" fill="currentColor" stroke="none"/><circle cx="17.7" cy="13.7" r="1" fill="currentColor" stroke="none"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20v-8M10.5 20V5M16 20v-6M3 20h18"/></svg>',
  flame:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.3 2.2c.7 3.5 5.2 5.6 5.2 10.8a5.5 5.5 0 0 1-11 0c0-2.1.9-3.6 2.1-4.6.2 1.7.9 2.7 1.9 3 -.6-3.3.2-6.7 1.8-9.2z"/><path d="M12 20.5a2.6 2.6 0 0 0 2.6-2.6c0-1.7-1.5-2.3-2.3-3.9-1.3 1.2-2.9 2.2-2.9 3.9A2.6 2.6 0 0 0 12 20.5z" fill="#FFE27A"/></svg>',
  flag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4"/><path d="M6 4.5h11.5l-2.4 3.7 2.4 3.8H6" fill="currentColor" fill-opacity=".25"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.4 6.3L12 16.8 6.3 20l1.4-6.3-4.8-4.3 6.4-.7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2.5 5 13.5h5.5l-1 8 8.5-11h-5.5z"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  cloud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18.5a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5 3.8 3.8 0 0 1-.5 7.5z"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>'
};
const GROUPS=[
  {k:"home",l:"Hôm nay",ic:IC.home,views:["today"]},
  {k:"learn",l:"Học",ic:IC.book,views:["vocab","kanji","kb"]},
  {k:"practice",l:"Luyện",ic:IC.pen,views:["practice","review","listen","exam","coach"]},
  {k:"play",l:"Chơi",ic:IC.game,views:["games"]},
  {k:"me",l:"Tiến độ",ic:IC.chart,views:["stats","plan"]}
];
const VIEW_L={today:"Hôm nay",vocab:"Từ vựng",kanji:"Kanji",kb:"Kiến thức",practice:"Luyện đề",review:"Ôn tập",listen:"Nghe",exam:"Thi thử",coach:"Huấn luyện",games:"Chơi & nhớ",stats:"Phân tích",plan:"Lộ trình"};

/* ---------- lời thoại ---------- */
const L={
  ok:[["正解！","Chính xác!"],["すごい！","Giỏi quá!"],["やったね！","Làm được rồi!"],["その調子！","Cứ thế phát huy!"],["ばっちり！","Chuẩn luôn!"],["さすが！","Đúng là bạn!"],["いいね！","Ngon lành!"],["完璧！","Hoàn hảo!"]],
  okSub:["Mình biết bạn làm được mà.","Nhớ tốt lắm!","Thêm một bước gần N3 hơn rồi.","Câu này bạn nắm chắc rồi đó.","Giữ nhịp này nhé!"],
  bad:[["惜しい！","Tiếc quá, suýt nữa thôi!"],["大丈夫！","Không sao đâu!"],["ドンマイ！","Đừng lo nhé!"],["次は大丈夫！","Lần sau sẽ đúng!"]],
  badSub:["Sai để nhớ lâu hơn — đọc lời giải bên dưới nhé.","Giờ bạn biết thêm một cái bẫy rồi đó.","Mình sẽ cho câu này quay lại để bạn ôn.","Ai học cũng vấp chỗ này, xem lại một chút là nhớ."],
  lkFound:["Để mình tra giúp nhé!","Từ này nghĩa là:","Mình biết từ này!","Đây nè:"],
  lkSent:["Mình tách câu này ra cho dễ hiểu nhé:","Cả câu luôn hả? Để mình phân tích:"],
  lkNone:["Hmm… từ này mình chưa có trong từ điển.","Từ này lạ quá, mình chưa biết rồi."],
  nudge:["Mình làm tiếp một nhiệm vụ nhé?","Còn nhiệm vụ đang chờ bạn đó!","Nghỉ đủ rồi, học tiếp vài câu nào?","5 phút thôi, làm thêm một nhiệm vụ nhé?"]
};

const L_IMP=Object.assign({},L,{
  ok:[["やるじゃん！","Ghê nha!"],["ふふん、さすが！","Biết ngay mà!"],["ナイス！","Đẹp luôn!"],["正解〜！","Trúng phóc!"],["天才かも？","Thiên tài chăng?"],["いい感じ！","Ngon nghẻ!"],["お見事！","Cao tay đấy!"]],
  okSub:["Hehe, câu này làm khó bạn sao được.","Cứ đà này thì đề N3 phải dè chừng bạn đó.","Ơ kìa, giỏi vậy mà giấu hả?","Mình đoán trước là bạn làm được mà.","Tiếp nào, đang hăng!"],
  bad:[["あらら〜","Dính bẫy rồi nha!"],["おっと！","Ối, trượt xíu thôi!"],["ドンマイ！","Không sao, gỡ lại liền!"],["惜しい〜！","Suýt nữa thì trúng!"]],
  badSub:["Đề nó gài đó, không phải tại bạn đâu. Xem lời giải rồi phục thù nhé.","Sai lần này để lần sau cười vào mặt cái bẫy này.","Mình ghi sổ câu này rồi, mai mình xử lại nó.","Ai cũng vấp chỗ này hết á. Đọc lại một chút là nhớ."],
  lkFound:["Để mình soi cho!","Từ này hả? Dễ ợt:","Hehe, mình biết từ này!","Đây đây:"],
  lkSent:["Cả câu luôn hả? Để mình mổ xẻ nó:","Câu dài mấy cũng tách được, xem nè:"],
  lkNone:["Ơ… từ này mình chịu, chưa có trong từ điển.","Từ gì lạ vậy ta? Mình chưa biết từ này."],
  nudge:["Này này, còn nhiệm vụ kìa~","Lười rồi hả? Làm một nhiệm vụ nữa đi nào!","5 phút thôi, làm với mình một nhiệm vụ nhé?","Ngồi không chán lắm, làm vài câu cho vui đi!"]
});
const LL=()=>B.skin==="momo"?L:L_IMP;
const imp=()=>B.skin!=="momo";

/* ---------- âm thanh & pháo giấy ---------- */
let AC=null;
function tone(fs,dur,type,vol){
  if(!B.sound) return;
  try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==="suspended") AC.resume(); const t0=AC.currentTime+0.01;
    fs.forEach((f,i)=>{const o=AC.createOscillator(), g=AC.createGain(), t=t0+i*dur; o.type=type||"sine"; o.frequency.value=f; g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol||0.07,t+0.012); g.gain.exponentialRampToValueAtTime(0.0001,t+dur*1.7); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t+dur*1.8)});
  }catch(e){}
}
const sfx={ok:()=>tone([659,988],0.085,"sine",0.07),bad:()=>tone([311,247],0.12,"triangle",0.06),done:()=>tone([523,659,784,1047],0.1,"sine",0.07),pop:()=>tone([587],0.05,"sine",0.035)};
function confetti(n){
  if(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const box=document.createElement("div"); box.className="v12-confetti"; const cols=["#1FA64C","#FFC93C","#FF8A1F","#2488CF","#FF7F9B","#7C5CE0"];
  for(let i=0;i<(n||36);i++){const p=document.createElement("i"); p.style.cssText=`left:${Math.random()*100}%;background:${cols[i%cols.length]};--dx:${(Math.random()*160-80).toFixed(0)}px;--rot:${(Math.random()*900-200).toFixed(0)}deg;--t:${(1.2+Math.random()*1.1).toFixed(2)}s;animation-delay:${(Math.random()*0.35).toFixed(2)}s`; box.appendChild(p)}
  document.body.appendChild(box); setTimeout(()=>box.remove(),2900);
}
V.confetti=confetti;

/* ---------- giao diện sáng / tối ---------- */
function applyTheme(){
  const r=document.documentElement; if(B.theme==="light"||B.theme==="dark") r.dataset.theme=B.theme; else delete r.dataset.theme;
  const dark=B.theme==="dark"||(B.theme!=="light"&&window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches);
  const mt=$('meta[name="theme-color"]'); if(mt) mt.content=dark?"#0F1512":"#F3F8EE";
}
applyTheme();

/* ---------- khung: thanh điều hướng, tab con, chỉ số ---------- */
const elNav=$("#v12nav"), elSub=$("#v12sub"), elStats=$("#v12stats");
let fab=$("#v12fab"), sayEl=$("#v12say"), panel=$("#v12panel");
function ensure(id,tag,attrs){let el=document.getElementById(id); if(!el){el=document.createElement(tag); el.id=id; document.body.appendChild(el)} Object.entries(attrs||{}).forEach(([k,v])=>el.setAttribute(k,v)); return el}
fab=ensure("v12fab","button",{type:"button","aria-label":"Trò chuyện với "+rawName(),"data-v12":"panel"});
sayEl=ensure("v12say","div",{role:"status","aria-live":"polite"}); sayEl.hidden=true;
panel=ensure("v12panel","div",{role:"dialog","aria-label":"Trò chuyện với "+rawName()}); panel.hidden=true;

function curView(){return view==="quiz"?((session&&session.from)||"practice"):view}
function groupOf(v){return GROUPS.find(g=>g.views.includes(v))||GROUPS[2]}
function inFocus(){
  return safe(()=>{
    if(view==="quiz"&&session&&!session.done) return true;
    if(view==="exam"&&session&&session.mode==="exam"&&!session.done) return true;
    if(view==="vocab"&&VS&&VS.i<VS.q.length) return true;
    return false},false);
}
function streakNow(){return safe(()=>streak(),0)}
function daysLeft(){return safe(()=>Math.max(0,Math.round(dayNum(EXAM)-TODAY)),0)}
function mission(){return safe(()=>{const mis=misToday(); return misProgress(mis)},{list:[],done:0,total:0,mins:0,all:false})}
function chrome(){
  const cv=curView(); const g=groupOf(cv); if(g.views.includes(cv)) RT.last[g.k]=cv;
  const due=safe(()=>dueList().length,0);
  if(elNav){
    if(!elNav.dataset.built){
      elNav.innerHTML=`<div class="v12-railbrand">Sổ luyện N3 <span class="jp">合格</span></div>`+GROUPS.map(x=>`<button type="button" data-v12g="${x.k}">${x.ic}<span>${x.l}</span></button>`).join("");
      elNav.dataset.built="1";
    }
    $$("button[data-v12g]",elNav).forEach(b=>{const on=b.dataset.v12g===g.k; if(on) b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current");
      const old=$(".v12-badge",b); if(old) old.remove(); if(b.dataset.v12g==="practice"&&due) b.insertAdjacentHTML("beforeend",`<span class="v12-badge" aria-label="${due} câu đến hạn ôn">${due>99?"99+":due}</span>`)});
  }
  if(elSub){
    elSub.innerHTML=g.views.length>1?g.views.map(v=>`<button type="button" role="tab" data-v12v="${v}" aria-selected="${v===cv}">${VIEW_L[v]}${v==="review"&&due?`<span class="v12-badge">${due>99?"99+":due}</span>`:""}</button>`).join(""):"";
    const on=$('[aria-selected="true"]',elSub); if(on&&on.scrollIntoView&&elSub.scrollWidth>elSub.clientWidth) elSub.scrollLeft=Math.max(0,on.offsetLeft-40);
  }
  if(elStats){
    const st=streakNow();
    elStats.innerHTML=`<button type="button" class="v12-stat fire ${st?"":"zero"}" data-v12="streak" aria-label="Chuỗi ${st} ngày học liên tiếp">${IC.flame}<span>${st}</span></button><button type="button" class="v12-stat exam" data-v12="days" aria-label="Còn ${daysLeft()} ngày đến kỳ thi">${IC.flag}<span>${daysLeft()}</span></button>`;
  }
  document.documentElement.classList.toggle("v12-focus",inFocus());
}

/* ---------- Momo nói ---------- */
function setMood(m){RT.mood=m; if(fab) fab.innerHTML=buddySVG(m,{bust:1})}
function fabVisible(){return !!fab&&getComputedStyle(fab).display!=="none"}
function hush(){clearTimeout(RT.sayT); if(sayEl) sayEl.hidden=true; if(!document.documentElement.classList.contains("v12-lk-open")&&panel.hidden) setMood("idle")}
function say(html,opt){
  opt=opt||{}; if(!fabVisible()||!panel.hidden) return false;
  sayEl.innerHTML=html+(opt.acts?`<div class="acts">${opt.acts}</div>`:""); sayEl.hidden=false; sayEl.style.animation="none"; void sayEl.offsetWidth; sayEl.style.animation="";
  setMood(opt.mood||"explain"); fab.classList.remove("bump"); void fab.offsetWidth; fab.classList.add("bump");
  clearTimeout(RT.sayT); RT.sayT=setTimeout(hush,opt.ms||(opt.acts?11000:Math.min(9000,2600+html.replace(/<[^>]+>/g,"").length*55)));
  return true;
}
V.say=say;
sayEl.addEventListener("click",e=>{ if(!e.target.closest("button")) hush(); else setTimeout(hush,0) });
const _toast=window.toast;
window.toast=function(t){
  const big=/^Xong nhiệm vụ/.test(t), good=big||/^(Đã (lưu|chép|đồng bộ|thêm)|Đặt )/.test(t);
  if(!say(esc(t),{mood:big?"wow":good?"happy":"explain"})) _toast(t);
  if(big){ sfx.done(); confetti(40) }
};

/* ---------- trang Hôm nay ---------- */
const MIS_IC={due:"復",new:"新",words:"語",listen:"聴",read:"読",weak:"直",scan:"速",rx:"反",conj:"活",write:"書"};
function ringSVG(done,total){const p=total?done/total:0, C=2*Math.PI*14; return `<svg class="v12-ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="none" stroke="var(--line)" stroke-width="5"/><circle cx="18" cy="18" r="14" fill="none" stroke="var(--fill)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(C*p).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 18 18)"/>${p>=1?'<path d="M12 18.500l4 4 8-8.500" fill="none" stroke="var(--fill)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>':""}</svg>`}
function greeting(pr){
  const h=new Date().getHours(), st=streakNow(); let hi, mood="wave", msg;
  if(RT.left){ hi=pr.all?J("よくできました！")+" Giỏi lắm":imp()?"Chiến tiếp nào!":"Tiếp tục nào!"; mood=pr.all?"happy":"cheer" }
  else if(RT.first) hi=`${J("はじめまして！")} Mình là ${nm()}`;
  else if(RT.gap>=3) hi=J("久しぶり！")+" Lâu rồi mới gặp bạn";
  else if(h<5){hi="Khuya rồi mà vẫn học à?"; mood="sleepy"}
  else if(h<11) hi=imp()?J("おはよ〜！")+" Dậy sớm ghê ta":J("おはよう！")+" Chào buổi sáng";
  else if(h<18) hi=imp()?J("やっほー！")+" Tới rồi hả":J("こんにちは！")+" Chào bạn";
  else if(h<22) hi=imp()?J("こんばんは〜！")+" Học tí chứ nhỉ":J("こんばんは！")+" Chào buổi tối";
  else {hi="Muộn rồi, học một chút thôi nhé"; mood="sleepy"}
  if(RT.first&&!RT.left) msg=`Mình sẽ đồng hành cùng bạn tới ngày thi N3. Hôm nay có ${pr.total} nhiệm vụ, khoảng ${pr.mins} phút. Gặp chữ Nhật nào khó, cứ bôi đen để mình tra giúp nhé!`;
  else if(!pr.total) msg="Hôm nay không có nhiệm vụ bắt buộc. Muốn luyện thêm thì mình luôn sẵn sàng!";
  else if(pr.all){msg=`Bạn đã xong cả ${pr.total} nhiệm vụ hôm nay. <span class="jp">お疲れ様！</span> Nghỉ ngơi, hoặc luyện thêm tuỳ sức nhé.`; if(!RT.left){hi=J("よくできました！")+" Giỏi lắm"; mood="happy"}}
  else if(pr.done){msg=`Xong ${pr.done}/${pr.total} nhiệm vụ rồi, còn khoảng ${pr.mins} phút nữa thôi. <span class="jp">がんばって！</span>`; if(!RT.left&&mood==="wave") mood="cheer"}
  else if(RT.gap>=3) msg=`Mình nhớ bạn đó! Không sao cả, hôm nay mình bắt đầu lại nhẹ nhàng: ${pr.total} nhiệm vụ, khoảng ${pr.mins} phút.`;
  else if(h>=20) msg=`Sắp hết ngày rồi. ${st>1?`Làm nhiệm vụ để giữ chuỗi ${st} ngày nhé!`:`Chỉ cần khoảng ${pr.mins} phút cho ${pr.total} nhiệm vụ thôi, bắt đầu nào!`}`;
  else msg=`Hôm nay có ${pr.total} nhiệm vụ, khoảng ${pr.mins} phút. ${st>1?`Chuỗi ${st} ngày đang chờ bạn nối dài đó!`:"Mình cùng bắt đầu nhé!"}`;
  return {hi,msg,mood};
}
function fold(node,o){
  const d=document.createElement("details"); d.className="v12-fold"; const open=(o.key in B.folds)?B.folds[o.key]:!!o.open; if(open) d.open=true;
  d.innerHTML=`<summary><span class="ico">${o.icon||IC.star}</span><span>${esc(o.title)}${o.sub?`<small>${esc(o.sub)}</small>`:""}</span></summary><div class="v12-foldbody"></div>`;
  node.replaceWith(d); d.lastChild.appendChild(node);
  d.addEventListener("toggle",()=>{B.folds[o.key]=d.open; save()});
  return d;
}
function decorateToday(m){
  if($(".v12-hero",m)) return;
  const pr=mission(); const next=pr.list.find(x=>!x.done); const g=greeting(pr); const st=streakNow();
  const tipEl=$(".v11-tip",m); if(tipEl) RT.tip=tipEl.innerHTML;
  const hero=document.createElement("section"); hero.className="sheet v12-hero";
  hero.innerHTML=`<button type="button" class="v12-heroava" data-v12="panel" aria-label="Trò chuyện với ${nm()}">${buddySVG(g.mood)}</button>
    <div class="v12-talk"><b class="hi">${g.hi}</b><span class="msg">${g.msg}</span></div>
    <div class="v12-goal">
      <div>${ringSVG(pr.done,pr.total)}<span><b>${pr.done}/${pr.total}</b><small>nhiệm vụ</small></span></div>
      <div><i style="color:${st?"var(--orange)":"var(--line-strong)"}">${IC.flame}</i><span><b>${st}</b><small>chuỗi ngày</small></span></div>
      <div><i style="color:var(--sky)">${IC.flag}</i><span><b>${daysLeft()}</b><small>ngày tới kỳ thi</small></span></div>
    </div>
    <div class="v12-herocta">${next?`<button class="btn primary" data-co="mis" data-arg="${esc(next.t.k)}">${pr.done?"Học tiếp":"Bắt đầu học"}: ${esc(next.t.t)}</button>`:`<button class="btn primary" data-co="adaptive">Luyện thêm 20 câu</button>`}<button type="button" class="btn" data-v12="panel">Hỏi ${nm()}</button></div>`;
  // nhiệm vụ: biểu tượng + làm nổi nhiệm vụ kế tiếp
  const mis=$("section.mis",m);
  if(mis){
    $$(".mislist li",mis).forEach((li,i)=>{const x=pr.list[i]; const chk=$(".mchk",li); if(!x||!chk) return;
      if(x.done) chk.innerHTML=IC.check; else {chk.textContent=MIS_IC[x.t.k]||String(i+1); chk.classList.add("jp")}
      if(next&&x===next){li.classList.add("v12-next"); const b=$(".btn",li); if(b) b.textContent="Bắt đầu"}});
    const eb=$(".eyebrow",mis); if(eb) eb.textContent="Nhiệm vụ hôm nay";
  }
  const week=$("section.hero",m);
  const frag=[hero]; if(mis) frag.push(mis); if(week) frag.push(week);
  const rest=[...m.children].filter(c=>!frag.includes(c));
  const sync=rest.filter(c=>c.classList.contains("syncbanner")||(!c.matches("section.sheet,section.tiles,section.grid2,section")&&c.tagName!=="SECTION"));
  m.prepend(...sync, ...frag);
  const label=document.createElement("div"); label.className="v12-foldtitle"; label.textContent="Xem thêm";
  let labeled=false;
  rest.forEach(c=>{
    if(sync.includes(c)||c.hidden||c.tagName!=="SECTION") return;
    let o=null; const eb=$(".eyebrow",c); const et=eb?eb.textContent.replace(/\s*·.*$/,"").trim():"";
    if(c.classList.contains("xtra")){ const open=!c.classList.contains("locked"); o={key:"xtra",title:"Luyện thêm",sub:open?"Đã mở — làm thêm tuỳ sức":"Mở khi xong nhiệm vụ hôm nay",icon:IC.plus,open} ; if(open&&!("xtra" in B.folds)) o.open=true }
    else if(c.classList.contains("v11-radar")) o={key:"radar",title:"Điểm yếu & mẹo hôm nay",sub:"Dạng bài bạn hay sai, luyện dồn vào đó",icon:IC.target};
    else if(c.classList.contains("lvcard")) o={key:"level",title:"Trình độ hiện tại",sub:safe(()=>levelReady().lvTxt,""),icon:IC.chart};
    else if(c.classList.contains("tiles")) o={key:"nums",title:"Con số của bạn",sub:"Số câu đã làm, tỉ lệ đúng, ngày đã luyện",icon:IC.star};
    else if(c.classList.contains("grid2")) o={key:"acc",title:"Tỉ lệ đúng & điểm yếu cần ôn",icon:IC.target};
    else if(/Trọng tâm/i.test(et)) o={key:"focus",title:"Trọng tâm tuần này",sub:"3 việc đáng làm nhất tuần này",icon:IC.bolt};
    else if(/Nhịp học/i.test(et)) o={key:"pace",title:"Nhịp học",sub:"Chọn tốc độ lên N3",icon:IC.cal};
    else o={key:"x-"+(et||c.className||"s").slice(0,24),title:et||"Khác",icon:/sao lưu|đồng bộ|sổ/i.test(et)?IC.cloud:IC.star};
    if(!labeled){c.before(label); labeled=true}
    fold(c,o);
  });
}

/* ---------- câu hỏi: khen / động viên ---------- */
function makeFb(ok,s,q){
  const o=q._orig||q; const st=safe(()=>q.sec==="conj"?null:S.srs[o.id],null);
  if(ok){
    RT.combo++; RT.miss=0; let [jp,vi]=pick(LL().ok), sub=pick(LL().okSub), mood="happy";
    if([3,5,7,10,15,20,30].includes(RT.combo)){ jp="すごい！"; vi=`${RT.combo} câu đúng liên tiếp!`; sub=RT.combo>=10?"天才！ Bạn đang vào phom cực tốt.":"Bạn đang vào nhịp rồi đó, giữ vững nhé!"; mood="wow" }
    else if(st&&st.w>0) sub="Câu này bạn từng sai, giờ đúng rồi — tiến bộ thật đó!";
    return {ok,mood,t:`<span class="jp v12-jp">${jp}</span> ${vi}`,s:sub,combo:RT.combo};
  }
  RT.combo=0; RT.miss++; let [jp,vi]=pick(LL().bad), sub=pick(LL().badSub), mood=RT.miss%2?"oops":"cheer";
  if(s.prev&&s.prev[s.i]&&s.prev[s.i].same) sub="Lại đúng cái bẫy lần trước rồi. Đọc kỹ phần chẩn đoán bên dưới, lần sau mình tin bạn sẽ qua!";
  else if(RT.miss>=3){ jp="ゆっくりでいいよ"; vi="Cứ từ từ thôi"; sub="Hít thở một chút, đọc kỹ từng phương án. Bạn làm được mà!"; mood="cheer" }
  return {ok,mood,t:`<span class="jp v12-jp">${jp}</span> ${vi}`,s:`Đáp án đúng là ${q.a+1}. ${sub}`,combo:0};
}
function decorateQuiz(m){
  const s=session; if(!s||s.done) return; const q=s.items[s.i]; if(!q||s.mode==="exam"||!s.checked[s.i]) return;
  s._fb=s._fb||{}; let fresh=false;
  if(!s._fb[s.i]){ const ok=!!(s.ok&&s.ok[s.i]); s._fb[s.i]=makeFb(ok,s,q); fresh=true }
  const fb=s._fb[s.i]; const v=$(".explain .verdict",m); if(!v) return;
  const d=document.createElement("div"); d.className="v12-fb "+(fb.ok?"ok":"bad"); d.setAttribute("role","status");
  d.innerHTML=`${buddySVG(fb.mood,{bust:1})}<div><b>${fb.t}${fb.combo>=3?`<span class="v12-combo">${IC.flame.replace("<svg",'<svg width="13" height="13"')}×${fb.combo}</span>`:""}</b><span>${esc(fb.s)}</span></div>`;
  if(!fresh) d.style.animation="none";
  const foot=$(".qfoot",m);
  if(foot&&window.innerWidth<980){ v.remove(); foot.prepend(d); foot.classList.add(fb.ok?"v12-ok":"v12-bad") } else v.replaceWith(d);
  if(fresh){ fb.ok?sfx.ok():sfx.bad(); if(fb.ok&&[5,10,20,30].includes(fb.combo)) confetti(24); if(fabVisible()) setMood(fb.mood) }
}
function starsHTML(n){return `<div class="v12-stars" aria-label="${n} trên 3 sao">${[0,1,2].map(i=>IC.star.replace("<svg",`<svg class="${i<n?"on":""}"`)).join("")}</div>`}
function decorateResult(m){
  if($(".v12-res",m)) return; const s=session; if(!s) return; const exam=s.mode==="exam";
  const rows=s.items.map((q,k)=>({ok:s.ans[k]===q.a,done:exam||s.checked[k]})).filter(r=>r.done); const n=rows.length, r=rows.filter(x=>x.ok).length, p=n?r/n:0;
  const pr=mission(); const next=pr.list.find(x=>!x.done); let mood,t,msg;
  if(!n){mood="idle"; t="Chưa làm câu nào"; msg="Không sao, lúc nào sẵn sàng thì mình làm lại nhé."}
  else if(p>=0.9){mood="wow"; t=J("最高！")+" Xuất sắc!"; msg=`Đúng ${r}/${n} câu. Phong độ này mà đi thi thì yên tâm rồi!`}
  else if(p>=0.7){mood="happy"; t=J("よくできました！")+" Tốt lắm!"; msg=`Đúng ${r}/${n} câu. Xem lại ${n-r} câu sai bên dưới là trọn vẹn.`}
  else if(p>=0.5){mood="cheer"; t=J("いい調子！")+" Đang tiến bộ!"; msg=`Đúng ${r}/${n} câu. Các câu sai đã vào danh sách Ôn tập, mai mình gặp lại chúng nhé.`}
  else {mood="cheer"; t=J("大丈夫！")+" Không sao cả!"; msg=`Đúng ${r}/${n} câu — bài này khó thật. Đọc lời giải từng câu sai, rồi làm lại là lên ngay. Mình tin bạn!`}
  let tail="";
  if(pr.total&&pr.all) tail=` Hôm nay bạn đã xong hết nhiệm vụ rồi. <span class="jp">お疲れ様でした！ また明日！</span> (mai gặp lại nhé)`;
  else if(next) tail=` Còn ${pr.total-pr.done} nhiệm vụ hôm nay (~${pr.mins} phút).`;
  const sec=document.createElement("section"); sec.className="sheet v12-res";
  sec.innerHTML=`${buddySVG(mood)}<div>${n?starsHTML(p>=0.9?3:p>=0.7?2:p>=0.5?1:0):""}<h2>${t}</h2><p>${msg}${tail}</p></div>
    <div class="row">${next?`<button class="btn primary" data-co="mis" data-arg="${esc(next.t.k)}">Học tiếp: ${esc(next.t.t)}</button>`:""}${pr.total&&pr.all?`<button type="button" class="btn" data-v12="bye">Nghỉ thôi, tạm biệt ${nm()}</button>`:""}</div>`;
  m.prepend(sec);
  if(!s._v12done){ s._v12done=1; RT.combo=0; RT.miss=0; if(n){ sfx.done(); if(p>=0.8||(pr.total&&pr.all)) confetti(p>=0.9?48:30) } }
}
function decorateVocab(m){
  if(!(VS&&VS.q)) return;
  if(VS.i<VS.q.length){
    const c=$(".wcard .chip.ok, .wcard .chip.bad",m);
    if(c&&VS.pick!=null&&!$(".v12-mini",m)){ const ok=c.classList.contains("ok"); const it=VS.q[VS.i]; const quick=it&&(it.mode==="scan"||it.mode==="rx");
      if(VS._v12!==VS.i){ VS._v12=VS.i; ok?sfx.ok():sfx.bad() }
      if(!quick) c.insertAdjacentHTML("beforebegin",`<span class="v12-mini">${buddySVG(ok?"happy":"cheer",{bust:1})}<b>${ok?pick(LL().ok)[1]:pick(LL().bad)[1]}</b></span> `) }
    return;
  }
  const again=$("#wAgain",m); const sec=again&&again.closest("section");
  if(sec&&!$(".v12-res",m)){ const st=VS.stats||{n:0,ok:0}; const p=st.n?st.ok/st.n:0;
    const b=document.createElement("section"); b.className="sheet v12-res";
    b.innerHTML=`${buddySVG(p>=0.8?"happy":"cheer")}<div><h2>${p>=0.8?J("よくできました！")+" Xong phiên từ vựng":J("おつかれ！")+" Xong một phiên rồi"}</h2><p>${st.n?`${st.ok}/${st.n} lượt nhớ tốt. `:""}Từ nào chưa nhớ mình sẽ cho gặp lại sớm, đừng lo nhé.</p></div>`;
    sec.before(b); if(VS._v12d!==1){VS._v12d=1; sfx.done()} }
}

/* ---------- mô tả dài: thu gọn ---------- */
function clamp(m){
  $$("p.note, p.small.muted, .mis .small.muted",m).forEach(p=>{
    if(p.dataset.v12c) return; p.dataset.v12c="1";
    if(p.closest(".explain,.kbbody,.aiout,.v11-sent,.v12-hero,.v12-res,.lkbody,.kxdlg,details:not(.v12-fold),.mislist")) return;
    if(p.querySelector("button,a,input,select,textarea,label")) return;
    if(p.textContent.trim().length<150) return;
    p.classList.add("v12-clamp"); p.tabIndex=0; p.setAttribute("role","button"); p.title="Bấm để xem hết";
  });
}
document.addEventListener("click",e=>{const p=e.target.closest(".v12-clamp"); if(!p) return; if(String(window.getSelection()||"").trim()) return; p.classList.toggle("open")});
document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.classList&&e.target.classList.contains("v12-clamp")){e.preventDefault(); e.stopPropagation(); e.target.classList.toggle("open")}},true);

/* ---------- móc vào render() ---------- */
function afterRender(){
  if(view!=="today") RT.left=true;
  chrome();
  const m=document.getElementById("main"); if(!m) return;
  const quiz=(view==="quiz"&&session)||(view==="exam"&&session&&session.mode==="exam");
  if(quiz){ if(session.done) decorateResult(m); else decorateQuiz(m) }
  else if(view==="today") decorateToday(m);
  else if(view==="vocab") decorateVocab(m);
  else if(view==="kanji"){ const d=$("section.sheet>details[open]",m); if(d&&/Cách nhớ kanji/.test(($("summary",d)||d).textContent)){ if(!RT.kjTips) d.open=false; d.addEventListener("toggle",()=>{RT.kjTips=d.open}) } }
  clamp(m);
}
const _render=window.render;
window.render=function(){ const r=_render.apply(this,arguments); try{afterRender()}catch(e){console.error("[v12]",e)} return r };
// chọn đáp án bài nghe không gọi render() → vẫn cần cập nhật khung
if(elNav) elNav.addEventListener("click",e=>{const b=e.target.closest("button[data-v12g]"); if(!b) return; const g=GROUPS.find(x=>x.k===b.dataset.v12g); if(!g) return; closePanel(); const cur=groupOf(curView()); go(cur===g&&!inFocus()?g.views[0]:(RT.last[g.k]||g.views[0]))});
if(elSub) elSub.addEventListener("click",e=>{const b=e.target.closest("button[data-v12v]"); if(b) go(b.dataset.v12v)});

/* ---------- tra từ: câu trả lời đi ra từ chỗ Momo ---------- */
const _lkShow=window.lkShow;
window.lkShow=function(text,rect,blockMsg){
  _lkShow(text,rect,blockMsg);
  try{
    const el=LK.el; if(!el) return; const body=$(".lkbody",el); const sent=!!(body&&$(".v11-sent",body)); const found=!!(body&&$(".lkent .lkw",body));
    const mood=blockMsg?"oops":sent||found?"explain":"think"; const line=blockMsg?"Khoan đã nào!":sent?pick(LL().lkSent):found?pick(LL().lkFound):pick(LL().lkNone);
    const top=$(".lktop",el);
    if(top){ const sel=$(".lksel",top); const box=document.createElement("div"); box.className="v12-lksay"; box.textContent=line; if(sel) box.appendChild(sel);
      top.prepend(box); top.insertAdjacentHTML("afterbegin",`<span class="v12-lkava">${buddySVG(mood,{bust:1})}</span>`) }
    document.documentElement.classList.add("v12-lk-open"); clearTimeout(RT.sayT); sayEl.hidden=true;
    const wide=window.innerWidth>=640; el.classList.remove("v12-atbuddy");
    if(wide&&B.lkAt==="buddy"&&fabVisible()&&!sent&&!blockMsg){
      const fr=fab.getBoundingClientRect(); const w=Math.min(380,window.innerWidth-24); el.style.width=w+"px"; el.style.maxHeight="";
      el.classList.add("v12-atbuddy"); const h=el.offsetHeight;
      el.style.left=Math.max(12,fr.right-w)+"px"; el.style.top=Math.max(12,fr.top-h-16)+"px";
    }
    if(fabVisible()) setMood(mood);
    sfx.pop();
  }catch(e){console.error("[v12]",e)}
};
const _lkHide=window.lkHide;
window.lkHide=function(){ const was=LK.el&&!LK.el.hidden; _lkHide(); document.documentElement.classList.remove("v12-lk-open"); if(was&&panel.hidden&&sayEl.hidden) setMood("idle") };

/* ---------- bảng trò chuyện ---------- */
function buildPanel(){
  if(panel.dataset.built) return; panel.dataset.built="1";
  panel.innerHTML=`<div class="v12-phead"><span id="v12pava">${buddySVG("wave",{bust:1})}</span><div><b id="v12pname">${nm()}</b><small>Tra từ · giải đáp · nhắc học</small></div><button type="button" class="x" data-v12="panel-close" aria-label="Đóng">✕</button></div>
    <div class="v12-plog" id="v12log" aria-live="polite"></div>
    <div class="v12-quick" id="v12quick" style="padding:0 12px 10px"></div>
    <form class="v12-pin" id="v12form"><input id="v12in" type="text" autocomplete="off" aria-label="Hỏi ${nm()}" placeholder="Gõ từ tiếng Nhật, tiếng Việt hoặc câu hỏi…"><button class="btn primary" type="submit" aria-label="Gửi">Gửi</button></form>`;
  const log=$("#v12log",panel);
  log.addEventListener("click",e=>{ if(e.target.closest("[data-v12],[data-co],[data-v11],[data-kxopen]")) return; try{lkClick(e)}catch(x){} });
  $("#v12form",panel).addEventListener("submit",e=>{e.preventDefault(); const i=$("#v12in",panel); const t=i.value.trim(); if(!t) return; i.value=""; ask(t)});
  log.addEventListener("change",e=>{const el=e.target; const k=el.dataset.v12set; if(!k) return;
    if(k==="name"){B.name=el.value.trim().slice(0,16); if(B.name===SKIN_NAME[B.skin]) B.name=""; $("#v12pname",panel).textContent=rawName()}
    else if(k==="skin"){B.skin=SKIN_NAME[el.value]?el.value:"my"; BD_SKIN=B.skin; $("#v12pname",panel).textContent=rawName(); $("#v12pava",panel).innerHTML=buddySVG("wave",{bust:1}); const ni=$('[data-v12set="name"]',panel); if(ni&&!B.name) ni.value=rawName()}
    else if(k==="theme"){B.theme=el.value; applyTheme()}
    else B[k]=el.type==="checkbox"?(k==="lkAt"?(el.checked?"buddy":"near"):el.checked):el.value;
    save(); if(k==="sound"&&B.sound) sfx.ok(); if(k==="name"||k==="skin"){ render(); if(!panel.hidden) setMood("happy") } });
}
function quickBar(){
  const pr=mission(); const next=pr.list.find(x=>!x.done); const due=safe(()=>dueList().length,0); const q=$("#v12quick",panel); if(!q) return;
  q.innerHTML=`${next?`<button type="button" class="go" data-v12="next">▶ ${pr.done?"Học tiếp":"Bắt đầu"}: ${esc(next.t.t)}</button>`:""}${due?`<button type="button" data-v12="due">Ôn ${due} câu đến hạn</button>`:""}<button type="button" data-v12="tip">Mẹo hôm nay</button><button type="button" data-v12="weak">Điểm yếu của mình</button><button type="button" data-v12="howto">Cách tra từ</button>${safe(()=>aiSource(),null)?`<button type="button" data-v12="aichat">Trò chuyện dài với AI</button>`:""}<button type="button" data-v12="settings">Cài đặt</button><button type="button" data-v12="bye">Nghỉ thôi 👋</button>`;
}
function msg(who,html,mood){
  buildPanel(); const log=$("#v12log",panel); const d=document.createElement("div"); d.className="v12-msg "+who; d.innerHTML=html; log.appendChild(d);
  if(who==="b"&&mood){ const a=$("#v12pava",panel); if(a) a.innerHTML=buddySVG(mood,{bust:1}) }
  while(log.children.length>40) log.firstChild.remove();
  requestAnimationFrame(()=>{ if(who==="u") log.scrollTop=log.scrollHeight; else log.scrollTop=Math.max(0,d.offsetTop-log.offsetTop-8) });
  return d;
}
function statusLine(){
  const pr=mission(); const st=streakNow();
  if(!pr.total) return "Hôm nay không có nhiệm vụ bắt buộc. Bạn muốn tra từ hay luyện thêm gì không?";
  if(pr.all) return `Hôm nay bạn đã xong cả ${pr.total} nhiệm vụ rồi. <span class="jp">お疲れ様！</span>${st>1?` Chuỗi ${st} ngày đó!`:""}`;
  return `Hôm nay xong ${pr.done}/${pr.total} nhiệm vụ, còn khoảng ${pr.mins} phút.${st>1?` Chuỗi hiện tại: ${st} ngày.`:""}`;
}
function openPanel(focus){
  buildPanel(); hush(); panel.hidden=false; document.documentElement.classList.add("v12-panel-open"); quickBar();
  const log=$("#v12log",panel);
  if(!log.children.length) msg("b",`<b>${nm()} đây!</b> ${statusLine()}<br>Bạn có thể gõ <b>chữ Nhật</b> để mình tra và phân tích, gõ <b>tiếng Việt</b> để tìm từ tiếng Nhật tương ứng, hoặc chọn nhanh bên dưới.`,"wave");
  setMood("happy"); if(focus!==false&&window.innerWidth>=640) setTimeout(()=>{const i=$("#v12in",panel); if(i) i.focus({preventScroll:true})},60);
}
function closePanel(){ if(panel.hidden) return; panel.hidden=true; document.documentElement.classList.remove("v12-panel-open"); setMood("idle") }
V.open=openPanel; V.close=closePanel;

function reverseLookup(q){
  const low=q.toLowerCase().trim(); if(low.length<2||typeof DIC==="undefined") return [];
  const out=[]; const re=new RegExp("(^|[\\s,;/()…·.-])"+low.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"($|[\\s,;/()…·.!-])");
  for(let i=0;i<DIC.length;i++){ const e=DIC[i]; const vi=String(e[3]||"").toLowerCase(); if(!vi||vi.indexOf(low)<0) continue;
    const parts=vi.split(/[,;/]/).map(x=>x.trim()); const sc=parts.includes(low)?0:parts.some(x=>x.startsWith(low))?1:re.test(vi)?2:9; if(sc>2) continue;
    out.push({e,i,sc,len:vi.length}); }
  return out.sort((a,b)=>a.sc-b.sc||a.len-b.len).slice(0,5);
}
function kbFind(q){
  const low=q.toLowerCase().trim(); if(low.length<2||typeof KB==="undefined") return [];
  return safe(()=>KB.filter(c=>kbSearchText(c).includes(low)).slice(0,4),[]);
}
async function askAI(t){
  const ai=await safe(()=>getAI(),null); if(!ai){ msg("b",esc(safe(()=>aiNeedText(),"Chưa bật AI.")),"sad"); return }
  const d=msg("b",'<span class="muted">Đợi mình nghĩ một chút…</span>',"think");
  const paint=x=>{const p=safe(()=>chatParse(x),{body:x,acts:[]}); d.innerHTML=safe(()=>mdLite(p.body),esc(p.body))+(p.acts&&p.acts.length?`<div class="v12-quick" style="margin-top:8px">${p.acts.map(a=>`<button type="button" data-co="${esc(a.a)}" ${a.arg?`data-arg="${esc(a.arg)}"`:""}>${esc(a.l)}</button>`).join("")}</div>`:"")};
  try{ const prompt=safe(()=>chatCtx(),"")+`\n\nTrong lượt này bạn đóng vai "${B.name}", người bạn đồng hành dễ thương trong app: xưng "mình", gọi người học là "bạn", trả lời ngắn gọn (tối đa 130 từ), ấm áp, khích lệ.\n\n---\nNgười học hỏi: ${t}`;
    const r=await ai([{role:"user",content:prompt}],{cache:false,maxTok:900,onText:({text})=>paint(text)}); paint(r.text||""); $("#v12pava",panel).innerHTML=buddySVG("explain",{bust:1}) }
  catch(e){ d.innerHTML=esc(safe(()=>aiErrText(e),"Không hỏi được AI lúc này.")); $("#v12pava",panel).innerHTML=buddySVG("sad",{bust:1}) }
}
function tipMsg(){ msg("b",RT.tip?RT.tip:"Mẹo của mình: mỗi ngày làm hết nhiệm vụ trước, phần luyện thêm tính sau. Đều đặn quan trọng hơn học dồn!","explain") }
function weakMsg(){
  const w=safe(()=>weakTags().slice(0,4),[]);
  if(!w.length) return msg("b","Hiện chưa có điểm yếu nào được ghi nhận. Làm thêm vài bài, mình sẽ chỉ ra chỗ bạn hay sai nhé!","happy");
  msg("b",`Mấy chỗ bạn hay vấp nhất nè:<ul>${w.map(x=>`<li><span class="jp">${esc(x.tag)}</span> — sai ${x.w}/${x.n} lần</li>`).join("")}</ul>Luyện dồn vào đây là điểm lên nhanh nhất đó!<div class="v12-quick" style="margin-top:8px"><button type="button" class="go" data-v12="weakgo">Luyện lại điểm yếu</button></div>`,"cheer");
}
function settingsMsg(){
  msg("b",`<b>Cài đặt</b><div class="v12-set" style="margin-top:8px">
    <label>Nhân vật <select data-v12set="skin">${[["my","Nhân vật của tôi"],["imp","Tinh nghịch (Riko)"],["momo","Dịu dàng (Momo)"]].map(([v,l])=>`<option value="${v}" ${B.skin===v?"selected":""}>${l}</option>`).join("")}</select></label>
    <label>Tên bạn đồng hành <input type="text" maxlength="16" value="${nm()}" data-v12set="name"></label>
    <label>Giao diện <select data-v12set="theme">${[["auto","Theo máy"],["light","Sáng"],["dark","Tối"]].map(([v,l])=>`<option value="${v}" ${B.theme===v?"selected":""}>${l}</option>`).join("")}</select></label>
    <label>Âm thanh khi trả lời <input type="checkbox" data-v12set="sound" ${B.sound?"checked":""}></label>
    <label>Kết quả tra từ hiện ở chỗ ${nm()} (màn hình rộng) <input type="checkbox" data-v12set="lkAt" ${B.lkAt==="buddy"?"checked":""}></label>
    <label>${nm()} ít nói (không tự nhắc) <input type="checkbox" data-v12set="quiet" ${B.quiet?"checked":""}></label>
    <div class="v12-quick"><button type="button" data-v12="oldui">Dùng giao diện cũ (v11)</button></div>
    <div class="small muted">${esc(safe(()=>document.getElementById("sync").textContent,""))}</div></div>`,"idle");
}
function ask(text){
  msg("u",esc(text)); const t=text.trim(), low=t.toLowerCase();
  if(safe(()=>isJp(t),false)){
    try{ LK.sel=t; LK.ctx=t; const html=lkBuild(t); const found=/lkent|v11-sent/.test(html);
      msg("b",`<div class="small muted" style="margin-bottom:4px">${found?pick(LL().lkFound):pick(LL().lkNone)}</div><div class="lkbody">${html}</div>`,found?"explain":"think") }
    catch(e){ msg("b","Mình tra chưa được từ này, bạn thử lại nhé.","sad") }
    return;
  }
  if(/^(xin )?(chào|hello|hi|hey|ohayo|konnichiwa)\b/.test(low)) return msg("b",`<span class="jp">こんにちは！</span> ${statusLine()}`,"wave");
  if(/cảm ơn|cám ơn|thanks|thank you|arigat/.test(low)) return msg("b",`<span class="jp">どういたしまして！</span> Không có gì đâu, mình luôn ở đây mà.`,"happy");
  if(/tạm biệt|bye|đi ngủ|nghỉ thôi|mai học|hẹn gặp/.test(low)) return bye();
  if(/mẹo|tip/.test(low)) return tipMsg();
  if(/điểm yếu|hay sai|yếu ở|yếu gì/.test(low)) return weakMsg();
  if(/còn .*ngày|bao nhiêu ngày|mấy ngày|ngày thi|kỳ thi|khi nào thi/.test(low)) return msg("b",`Còn <b>${daysLeft()}</b> ngày nữa đến kỳ thi (${safe(()=>fmtDate(EXAM),"")}). Mỗi ngày xong nhiệm vụ là mình kịp!`,"cheer");
  if(/chuỗi|streak|liên tiếp/.test(low)) return msg("b",streakNow()?`Bạn đang có chuỗi <b>${streakNow()}</b> ngày học liên tiếp. Giữ lửa nhé!`:"Chuỗi ngày học đang là 0. Làm một nhiệm vụ hôm nay để bắt đầu chuỗi mới nào!","cheer");
  if(/học gì|làm gì|nhiệm vụ|hôm nay|tiếp theo|tiến độ/.test(low)){ const pr=mission(), next=pr.list.find(x=>!x.done);
    return msg("b",statusLine()+(next?`<div class="v12-quick" style="margin-top:8px"><button type="button" class="go" data-v12="next">▶ ${esc(next.t.t)}</button></div>`:""),pr.all?"happy":"cheer") }
  if(/cài đặt|đổi tên|giao diện|âm thanh|dark|tối/.test(low)) return settingsMsg();
  const rev=reverseLookup(t), kb=kbFind(t); const ai=safe(()=>aiSource(),null);
  if(rev.length||kb.length){
    let h="";
    if(rev.length) h+=`<div class="small muted" style="margin-bottom:4px">“${esc(t)}” trong tiếng Nhật:</div><div class="lkbody">${rev.map(x=>safe(()=>lkEntryHTML({e:x.e,i:x.i,l:[],src:x.e[0]},false),"")).join("")}</div>`;
    if(kb.length) h+=`<div class="small muted" style="margin:${rev.length?8:0}px 0 4px">Thẻ kiến thức liên quan:</div>${kb.map(c=>`<div class="lkgr" style="margin-top:4px"><span>${esc(c.t)}</span> <button class="lkbtn" data-lkcard="${esc(c.k)}">mở thẻ ${esc(safe(()=>kbLabel(c),""))}</button><div class="lkcard"></div></div>`).join("")}`;
    if(ai) h+=`<div class="v12-quick" style="margin-top:8px"><button type="button" data-v12="askai" data-q="${esc(t)}">Hỏi AI kỹ hơn</button></div>`;
    return msg("b",h,"explain");
  }
  if(ai) return askAI(t);
  msg("b",`Câu này mình chưa trả lời được khi chưa có AI. Mình tra được <b>chữ Nhật</b>, <b>nghĩa tiếng Việt → từ Nhật</b> và <b>thẻ kiến thức</b> (thử: “ように”, “cuộc họp”, “kính ngữ”). Muốn hỏi tự do, bật AI ở tab Huấn luyện nhé.<div class="v12-quick" style="margin-top:8px"><button type="button" data-co="gocoach">Mở Huấn luyện</button></div>`,"think");
}
function bye(){
  closePanel(); const pr=mission(); const next=pr.list.find(x=>!x.done); const d=safe(()=>dayStats()[TODAY],null)||{n:0,ok:0}; const st=streakNow();
  let mood,t,m2;
  if(pr.total&&pr.all){mood="wave"; t=J("お疲れ様でした！"); m2=`Hôm nay bạn đã hoàn thành hết nhiệm vụ. Nghỉ ngơi cho khoẻ, mai mình học tiếp nhé. <span class="jp">また明日！</span>`}
  else if(d.n){mood="cheer"; t="Hôm nay bạn đã cố gắng rồi!"; m2=`Bạn đã làm ${d.n} câu. Còn ${pr.total-pr.done} nhiệm vụ (~${pr.mins} phút) — làm nốt để ngày hôm nay trọn vẹn nhé? Còn nếu bận thì mai mình học bù, không sao cả.`}
  else {mood="sad"; t="Ơ, hôm nay mình chưa học gì…"; m2=`Chỉ cần 5 phút thôi cũng được. Thử một nhiệm vụ ngắn rồi hãy nghỉ nhé? ${st>1?`Chuỗi ${st} ngày đang chờ bạn giữ đó.`:""}`}
  const body=kxModal(`<div class="v12-bye">${buddySVG(mood)}<h2 class="jp-mix">${t}</h2><p style="margin:0;max-width:44ch">${m2}</p>
    <div class="tiles"><div class="tile"><div class="v num">${d.n}</div><div class="k">câu hôm nay</div></div><div class="tile"><div class="v num">${d.n?Math.round(100*d.ok/d.n)+"%":"—"}</div><div class="k">tỉ lệ đúng</div></div><div class="tile"><div class="v num">${pr.done}/${pr.total}</div><div class="k">nhiệm vụ</div></div></div>
    <div class="row" style="margin-top:6px">${next?`<button class="btn primary" data-co="mis" data-arg="${esc(next.t.k)}" data-kxclose>Làm nốt: ${esc(next.t.t)}</button>`:""}<button type="button" class="btn" data-kxclose>${pr.total&&pr.all?"Mai gặp lại nhé!":"Mai mình học tiếp"}</button></div></div>`);
  if(pr.total&&pr.all){ sfx.done(); confetti(30) }
  return body;
}
V.bye=bye;

/* ---------- sự kiện chung ---------- */
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-v12]"); if(!b) return; const a=b.dataset.v12;
  if(a==="panel"){ panel.hidden?openPanel():closePanel(); return }
  if(a==="panel-close") return closePanel();
  if(a==="streak"){ const st=streakNow(); if(!say(st?`Chuỗi <b>${st}</b> ngày học liên tiếp! Học hôm nay để giữ lửa nhé.`:"Chưa có chuỗi ngày học. Làm một nhiệm vụ hôm nay để bắt đầu nào!",{mood:st?"happy":"cheer"})) _toast(st?`Chuỗi ${st} ngày học liên tiếp`:"Chưa có chuỗi ngày học"); return }
  if(a==="days"){ const t=`Còn <b>${daysLeft()}</b> ngày đến kỳ thi ${safe(()=>fmtDate(EXAM),"")}. Mỗi ngày một chút là kịp!`; if(!say(t,{mood:"cheer"})) _toast(`Còn ${daysLeft()} ngày đến kỳ thi`); return }
  if(a==="next"){ const next=mission().list.find(x=>!x.done); closePanel(); hush(); if(next) coAct("mis",next.t.k); else toast("Hôm nay đã xong hết nhiệm vụ rồi!"); return }
  if(a==="due"){ closePanel(); coAct("due"); return }
  if(a==="tip") return tipMsg();
  if(a==="weak") return weakMsg();
  if(a==="weakgo"){ closePanel(); safe(()=>startWeak()); return }
  if(a==="howto") return msg("b",`<b>3 cách tra từ:</b><ol><li><b>Bôi đen</b> chữ Nhật ở bất kỳ đâu (câu hỏi, bài đọc, lời giải) — mình sẽ hiện nghĩa, cách đọc, Hán Việt ngay.</li><li>Bôi đen <b>cả câu</b> — mình tách từng từ, chỉ ngữ pháp và dịch nháp.</li><li>Gõ vào ô bên dưới: chữ Nhật, hoặc nghĩa tiếng Việt (vd. “cuộc họp”).</li></ol>Trong lúc làm bài, từ đang được hỏi sẽ tạm khoá để không lộ đáp án nhé.`,"explain");
  if(a==="aichat"){ closePanel(); coAct("chat"); return }
  if(a==="askai") return askAI(b.dataset.q||"");
  if(a==="settings") return settingsMsg();
  if(a==="bye") return bye();
  if(a==="oldui"){ try{localStorage.setItem("so-luyen-n3-ui","v11")}catch(x){} location.reload(); return }
});
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&!panel.hidden&&!document.getElementById("kxmodal")) closePanel() });
// bấm ra ngoài bảng trò chuyện thì đóng (màn hình rộng)
document.addEventListener("pointerdown",e=>{ RT.lastAct=Date.now(); if(panel.hidden) return; if(e.target.closest("#v12panel,#v12fab,#lkpop,.kxmodal,[data-v12='panel']")) return; if(window.innerWidth>=640) closePanel() },true);
document.addEventListener("keydown",()=>{RT.lastAct=Date.now()},true);
// kéo khung hộp thoại bấm data-co bên trong bảng → đóng bảng
panel.addEventListener("click",e=>{ if(e.target.closest("[data-co]")) setTimeout(closePanel,0) });

/* ---------- chào khi quay lại · nhắc học ---------- */
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="hidden"){RT.hiddenAt=Date.now(); return}
  const away=RT.hiddenAt?Date.now()-RT.hiddenAt:0; RT.hiddenAt=0; RT.lastAct=Date.now();
  if(away>30*60000&&!inFocus()&&!B.quiet){ const pr=mission(), next=pr.list.find(x=>!x.done);
    say(`<span class="jp"><b>おかえり！</b></span> Mừng bạn quay lại. ${pr.total&&pr.all?"Hôm nay bạn xong hết nhiệm vụ rồi đó!":next?`Còn ${pr.total-pr.done} nhiệm vụ, mình làm tiếp nhé?`:""}`,{mood:"wave",acts:next?`<button type="button" class="btn small primary" data-v12="next">Học tiếp</button>`:""}) }
});
setInterval(()=>{
  if(B.quiet||document.visibilityState!=="visible"||inFocus()||!panel.hidden||!sayEl.hidden) return;
  if(document.getElementById("kxmodal")||document.documentElement.classList.contains("v12-lk-open")) return;
  const now=Date.now(); if(now-RT.lastAct<90000||now-RT.lastNudge<12*60000) return;
  const pr=mission(), next=pr.list.find(x=>!x.done); if(!next) return;
  RT.lastNudge=now; say(`${pick(LL().nudge)} <span class="muted">(${pr.done}/${pr.total} xong)</span>`,{mood:"cheer",acts:`<button type="button" class="btn small primary" data-v12="next">${esc(next.t.t)}</button>`});
},30000);

/* ---------- khởi động ---------- */
setMood("idle");
document.documentElement.classList.add("v12-ready");
if(typeof render==="function") render();
// lời chào ở các trang không phải Hôm nay (khi mở thẳng vào trang khác)
setTimeout(()=>{ if(view!=="today"&&!inFocus()&&!B.quiet){ const pr=mission(); say(`<b>${nm()} đây!</b> ${statusLine()}`,{mood:"wave"}) } },900);
V.ready=true;

})();
