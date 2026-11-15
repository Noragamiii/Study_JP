/* Sổ luyện N3 — v14: cây trồng (6 giai đoạn: hạt → mầm → cây non → cây lớn → ra hoa → kết trái)
   + hòn đảo isometric để trồng cây và các "đảo kỷ niệm" theo tháng. Hình SVG vẽ riêng cho app. */
(function(){
"use strict";
const A=window.V13ART; if(!A) return;
const P=A.P={};
/* n tên · jp · r cách đọc · t kiểu · g điểm lớn để ra hoa · c chu kỳ thu hoạch · y xu mỗi lần thu · p giá hạt · fr màu quả · fl màu hoa · lf màu lá · rare: chỉ có trong túi phúc */
P.SP={
 ichigo:{n:"Dâu tây",jp:"苺",r:"いちご",t:"bush",g:150,c:60,y:2,p:220,fl:"#FFFFFF",fr:"#E8364B",lf:"#4FA94A"},
 asagao:{n:"Hoa bìm bìm",jp:"朝顔",r:"あさがお",t:"vine",g:140,c:70,y:1,p:180,fl:"#6C7BEF",lf:"#5CB85A"},
 himawari:{n:"Hướng dương",jp:"向日葵",r:"ひまわり",t:"sun",g:220,c:90,y:2,p:260,fl:"#FFC93C",lf:"#4FA94A"},
 sugi:{n:"Cây tuyết tùng",jp:"杉",r:"すぎ",t:"conifer",g:300,c:0,y:0,p:300,lf:"#2E7D5B"},
 ajisai:{n:"Cẩm tú cầu",jp:"紫陽花",r:"あじさい",t:"bushfl",g:300,c:120,y:2,p:380,fl:"#8FA3F0",fl2:"#C89BEA",lf:"#4E9A4A"},
 take:{n:"Tre",jp:"竹",r:"たけ",t:"bamboo",g:320,c:110,y:3,p:400,lf:"#5FB34A"},
 tsubaki:{n:"Hoa trà",jp:"椿",r:"つばき",t:"bushfl",g:360,c:130,y:2,p:450,fl:"#E0384E",fl2:"#FFD23F",lf:"#2F7F45"},
 ume:{n:"Hoa mai Nhật",jp:"梅",r:"うめ",t:"tree",g:560,c:160,y:5,p:650,fl:"#FFD3E0",fr:"#C9D65A",lf:"#6DBA5A"},
 mikan:{n:"Quýt",jp:"蜜柑",r:"みかん",t:"tree",g:620,c:140,y:6,p:750,fl:"#FFFFFF",fr:"#FF9A1F",lf:"#3F9B45"},
 momiji:{n:"Cây phong",jp:"紅葉",r:"もみじ",t:"tree",g:700,c:180,y:4,p:800,fl:null,canopy4:["#E4572E","#F28C28","#C93A1E"],lf:"#5FB55A"},
 kaki:{n:"Hồng (quả)",jp:"柿",r:"かき",t:"tree",g:760,c:150,y:7,p:880,fr:"#F07A1A",lf:"#4E9A44"},
 sakura:{n:"Anh đào",jp:"桜",r:"さくら",t:"tree",g:820,c:200,y:5,p:950,fl:null,canopy4:["#FFB7CE","#FFD3E0","#FF8FB3"],lf:"#6DBA5A"},
 momo:{n:"Đào",jp:"桃",r:"もも",t:"tree",g:840,c:150,y:7,p:980,fl:"#FF9DBB",fr:"#FFB09A",lf:"#5CAF52"},
 ringo:{n:"Táo",jp:"林檎",r:"りんご",t:"tree",g:900,c:160,y:8,p:1080,fl:"#FFFFFF",fr:"#E33B2E",lf:"#4FA94A"},
 fuji:{n:"Tử đằng",jp:"藤",r:"ふじ",t:"hang",g:980,c:200,y:6,p:1300,fl:"#A884E6",lf:"#5CB85A"},
 bonsai:{n:"Bonsai thông",jp:"盆栽",r:"ぼんさい",t:"bonsai",g:1300,c:240,y:8,p:1700,lf:"#2F8050"},
 kane:{n:"Cây ra tiền",jp:"金のなる木",r:"かねのなるき",t:"tree",g:1000,c:150,y:20,p:0,rare:1,fr:"#FFC93C",lf:"#3E9E6A",coin:1},
 niji:{n:"Anh đào cầu vồng",jp:"虹桜",r:"にじざくら",t:"tree",g:1100,c:220,y:12,p:0,rare:1,canopy4:["#FF9DBB","#9FD8FF","#FFE27A"],rainbow:1,lf:"#6DBA5A"},
 gekka:{n:"Quỳnh hoa",jp:"月下美人",r:"げっかびじん",t:"cactus",g:600,c:160,y:10,p:0,rare:1,fl:"#FFFFFF",lf:"#4FA05A"}
};
P.ORDER=Object.keys(P.SP);
P.fruit=sp=>!!(P.SP[sp]&&P.SP[sp].fr);
P.stageOf=(sp,gp)=>{ const s=P.SP[sp]; if(!s) return 0; const f=gp/s.g; if(f<.06) return 0; if(f<.22) return 1; if(f<.5) return 2; if(f<1) return 3; if(P.fruit(sp)&&gp>=s.g*1.2) return 5; return 4 };
P.finalStage=sp=>P.fruit(sp)?5:4;
P.STAGE_VI=["Hạt giống","Nảy mầm","Cây non","Cây lớn","Ra hoa","Kết trái"];

/* ---------- vẽ cây (gốc ở (0,0), cao tối đa ~95) ---------- */
const dots=(pts,r,c)=>pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join("");
function flower5(x,y,r,c,cc){ let p=""; for(let i=0;i<5;i++){ const a=i*72*Math.PI/180; p+=`<circle cx="${(x+Math.sin(a)*r).toFixed(1)}" cy="${(y-Math.cos(a)*r).toFixed(1)}" r="${(r*.85).toFixed(1)}"/>` } return `<g fill="${c}">${p}</g><circle cx="${x}" cy="${y}" r="${(r*.6).toFixed(1)}" fill="${cc||"#FFD23F"}"/>` }
const sprout=lf=>`<path d="M0,0 V-12" stroke="${lf}" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="-5" cy="-13" rx="5.5" ry="3" fill="${lf}" transform="rotate(-25 -5 -13)"/><ellipse cx="5" cy="-15" rx="5.5" ry="3" fill="${lf}" transform="rotate(25 5 -15)"/>`;
function treeG(s,st,o){
  const lf=s.lf, dark="#00000022";
  if(st===2) return `<path d="M-1.5,0 V-26 M1.5,0 V-26" stroke="#7A5237" stroke-width="2.2"/><circle cx="0" cy="-30" r="10" fill="${lf}"/><circle cx="-4" cy="-33" r="4" fill="#ffffff33"/>`;
  let can=st>=4&&s.canopy4?s.canopy4:[lf,shade(lf,1.15),shade(lf,.85)];
  let g=`<path d="M-4,0 Q-3,-20 -1,-34 L1,-34 Q3,-20 4,0Z" fill="#7A5237"/><path d="M-1,-26 l-9,-8 M1,-28 l9,-9" stroke="#7A5237" stroke-width="2.2" stroke-linecap="round"/>`;
  if(s.rainbow&&st>=4) g+=`<circle cx="-12" cy="-44" r="14" fill="${can[0]}"/><circle cx="11" cy="-48" r="15" fill="${can[1]}"/><circle cx="0" cy="-62" r="15" fill="${can[2]}"/><circle cx="-2" cy="-50" r="9" fill="#C9B6FF"/>`;
  else g+=`<g fill="${can[0]}"><circle cx="-12" cy="-44" r="14"/><circle cx="11" cy="-48" r="15"/><circle cx="0" cy="-62" r="15"/></g><g fill="${can[1]}"><circle cx="-4" cy="-56" r="8"/><circle cx="12" cy="-52" r="6"/></g><path d="M-22,-40 q10,10 30,4 q8,-2 14,-10" stroke="${can[2]}" stroke-width="3" fill="none" opacity=".6"/>`;
  if(st>=4&&s.fl) g+=[[-14,-50],[2,-66],[14,-52],[-4,-44],[8,-60],[-18,-40],[18,-42]].map(([x,y])=>flower5(x,y,2.1,s.fl,"#FFE27A")).join("");
  if(st>=5&&s.fr) g+=[[-12,-36],[8,-40],[-2,-48],[16,-46],[-18,-46]].map(([x,y])=>s.coin?`<circle cx="${x}" cy="${y}" r="4.2" fill="#FFC93C" stroke="#DE9E05" stroke-width="1"/><path d="M${x-1.5},${y-1} h3" stroke="#DE9E05" stroke-width="1"/>`:`<circle cx="${x}" cy="${y}" r="3.8" fill="${s.fr}"/><circle cx="${x-1.2}" cy="${y-1.3}" r="1.2" fill="#ffffff88"/><path d="M${x},${y-3.8} l1,-2" stroke="#4E7A2E" stroke-width="1"/>`).join("");
  return g;
}
function shade(hex,f){ const n=parseInt(hex.slice(1),16); const c=[(n>>16)&255,(n>>8)&255,n&255].map(v=>Math.max(0,Math.min(255,Math.round(v*f)))); return "#"+c.map(v=>v.toString(16).padStart(2,"0")).join("") }
function plantBody(sp,st){
  const s=P.SP[sp]; if(!s) return ""; const lf=s.lf;
  if(st===0) return `<ellipse cx="0" cy="-1" rx="9" ry="4" fill="#8A5A36"/><ellipse cx="-2" cy="-3" rx="2.6" ry="1.8" fill="#E8D3A6"/><path d="M8,0 V-14" stroke="#C9A06A" stroke-width="1.6"/><rect x="4" y="-20" width="9" height="7" rx="1" fill="#F4E6CA" stroke="#C9A06A" stroke-width=".8"/>`;
  if(st===1) return sprout(lf);
  switch(s.t){
    case "tree": return treeG(s,st);
    case "conifer": { const h=st===2?34:st===3?58:70, w=st===2?12:20; let g=`<rect x="-2.5" y="-8" width="5" height="8" fill="#7A5237"/>`; for(let i=0;i<3;i++){ const yb=-6-i*(h/3.4), ww=w*(1-i*.25); g+=`<path d="M${-ww},${yb} L0,${yb-h/2.4} L${ww},${yb}Z" fill="${i%2?shade(lf,1.15):lf}"/>` } return g+`<path d="M0,${-6-h} l0,0" />` }
    case "bush": { let g=`<ellipse cx="0" cy="-8" rx="${st===2?9:15}" ry="${st===2?7:10}" fill="${lf}"/><ellipse cx="-5" cy="-12" rx="6" ry="4" fill="${shade(lf,1.15)}"/>`; if(st>=4) g+=[[-8,-12],[6,-14],[0,-6]].map(([x,y])=>flower5(x,y,1.8,s.fl)).join(""); if(st>=5) g+=[[-10,-4],[2,-2],[10,-6],[-3,-10]].map(([x,y])=>`<path d="M${x-3},${y-2} q3,8 6,0z" fill="${s.fr}"/><path d="M${x-2},${y-3} h4" stroke="#3E8E4B" stroke-width="1.6"/>`).join(""); return g }
    case "bushfl": { let g=`<ellipse cx="0" cy="-10" rx="${st===2?10:17}" ry="${st===2?8:13}" fill="${lf}"/><ellipse cx="6" cy="-14" rx="7" ry="5" fill="${shade(lf,1.15)}"/>`; if(st>=4) g+=s.fl2&&sp==="ajisai"?[[-8,-16,s.fl],[6,-20,s.fl2],[10,-8,s.fl],[-3,-6,s.fl2]].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="5.5" fill="${c}"/><g fill="#ffffff66"><circle cx="${x-2}" cy="${y-1}" r="1.3"/><circle cx="${x+2}" cy="${y+1}" r="1.3"/></g>`).join(""):[[-9,-14],[5,-20],[10,-8],[-2,-6]].map(([x,y])=>flower5(x,y,2.6,s.fl,s.fl2)).join(""); return g }
    case "vine": { let g=`<path d="M-8,0 V-46 M8,0 V-46 M-8,-30 H8 M-8,-14 H8" stroke="#C9A06A" stroke-width="1.8"/>`; const h=st===2?24:44; g+=`<path d="M0,0 q-10,${-h*.25} 0,${-h*.5} q10,${-h*.25} 0,${-h*.5}" stroke="${lf}" stroke-width="2" fill="none"/>`+[[-6,-10],[6,-18],[-5,-28],[5,-38]].filter((_,i)=>i<(st===2?2:4)).map(([x,y])=>`<path d="M${x},${y} q-5,-4 0,-8 q5,4 0,8z" fill="${lf}"/>`).join(""); if(st>=4) g+=[[-8,-24],[7,-34],[-2,-44],[8,-14]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="${s.fl}"/><circle cx="${x}" cy="${y}" r="2" fill="#FFFFFF"/>`).join(""); return g }
    case "sun": { const h=st===2?26:st===3?50:60; let g=`<path d="M0,0 V${-h}" stroke="#5C9A3A" stroke-width="3"/><path d="M0,${-h*.4} q-12,-2 -14,-10 q10,0 14,8z M0,${-h*.6} q12,-2 14,-10 q-10,0 -14,8z" fill="${lf}"/>`; if(st===3) g+=`<circle cx="0" cy="${-h}" r="5" fill="#7FB55A"/>`; if(st>=4) g+=`<g transform="translate(0 ${-h})">${[...Array(12)].map((_,i)=>`<ellipse cx="0" cy="-10" rx="3.4" ry="7" fill="${s.fl}" transform="rotate(${i*30})"/>`).join("")}<circle r="7" fill="#7A4A1E"/><g fill="#5A3412">${dots([[-2,-2],[2,1],[0,3],[3,-3],[-3,2]],1,"#5A3412")}</g></g>`; return g }
    case "bamboo": { const h=st===2?30:62; let g=""; [[-6,h],[2,h*.85],[9,h*.7]].forEach(([x,hh],i)=>{ g+=`<rect x="${x-2.2}" y="${-hh}" width="4.4" height="${hh}" fill="${i%2?shade(lf,1.1):lf}"/>`; for(let y=-10;y>-hh;y-=12) g+=`<rect x="${x-2.8}" y="${y}" width="5.6" height="1.6" fill="#3E7E2C"/>`; g+=`<ellipse cx="${x+6}" cy="${-hh+4}" rx="7" ry="2" fill="${lf}" transform="rotate(-25 ${x+6} ${-hh+4})"/>` }); if(st>=4) g+=[[-12,0],[14,0]].map(([x])=>`<path d="M${x-4},0 L${x},-10 L${x+4},0Z" fill="#B88A4E"/><path d="M${x-2},-3 l2,-4 l2,4" stroke="#8A6B4A" stroke-width=".8" fill="none"/>`).join(""); return g }
    case "hang": { let g=`<path d="M-16,0 V-50 M16,0 V-50 M-20,-50 H20" stroke="#8A6B4A" stroke-width="3"/><path d="M-16,-50 q16,-8 32,0" stroke="${lf}" stroke-width="5" fill="none"/>`+[[-14,-52],[-4,-55],[6,-55],[15,-52]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="3" fill="${lf}"/>`).join(""); if(st>=4) g+=[-13,-5,3,11,17].map((x,i)=>`<path d="M${x},-50 q-3,${12+i%2*4} 0,${20+i%2*6} q3,${-10} 0,${-20-i%2*6}z" fill="${s.fl}"/><path d="M${x},-48 v${16+i%2*6}" stroke="${shade(s.fl,1.2)}" stroke-width="1.6" stroke-dasharray="2 2"/>`).join(""); if(st===2) return `<path d="M-16,0 V-30 M16,0 V-30" stroke="#8A6B4A" stroke-width="3"/>`+sprout(lf); return g }
    case "bonsai": { let g=`<path d="M-16,0 h32 l-4,-8 h-24z" fill="#3D6FB6"/><rect x="-18" y="-10" width="36" height="3" fill="#2E558E"/><path d="M0,-10 q-8,-10 4,-18 q10,-8 0,-18" stroke="#6B4A2F" stroke-width="4" fill="none" stroke-linecap="round"/>`; const pads=st===2?[[2,-30,10]]:[[4,-28,12],[-10,-38,10],[6,-46,11]]; g+=pads.map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.45}" fill="${lf}"/><ellipse cx="${x-2}" cy="${y-2}" rx="${r*.5}" ry="${r*.2}" fill="#48A46B"/>`).join(""); if(st>=4) g+=`<g fill="#FFFFFF" opacity=".9">${dots([[-6,-50],[12,-42],[0,-34]],1.4,"#FFFFFF")}</g>`; return g }
    case "cactus": { let g=`<path d="M-12,0 h24 l-3,-8 h-18z" fill="#C97A4A"/><path d="M0,-8 V-40" stroke="${lf}" stroke-width="7" stroke-linecap="round"/><path d="M0,-22 q-12,0 -12,-12" stroke="${lf}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M0,-28 q12,0 12,-10" stroke="${lf}" stroke-width="5" fill="none" stroke-linecap="round"/>`; if(st===2) return `<path d="M-12,0 h24 l-3,-8 h-18z" fill="#C97A4A"/><path d="M0,-8 V-24" stroke="${lf}" stroke-width="7" stroke-linecap="round"/>`; if(st>=4) g+=`<g transform="translate(0 -46)">${[...Array(10)].map((_,i)=>`<ellipse cx="0" cy="-8" rx="3.4" ry="9" fill="#FFFFFF" stroke="#F0E6FF" transform="rotate(${i*36})"/>`).join("")}<circle r="4" fill="#FFF3B0"/></g>`; return g }
  }
  return sprout(lf);
}
P.plantG=function(sp,st,o){ o=o||{}; const t=(P.SP[sp]||{}).t; const sc=st>=2&&(t==="bush"||t==="bushfl")?1.45:st>=2&&t==="vine"?1.2:1; const body=sc!==1?`<g transform="scale(${sc})">${plantBody(sp,st)}</g>`:plantBody(sp,st); return `<g class="v14-plant${o.wilt?" wilt":""}${o.ready?" ready":""}">${body}${o.ready?`<g class="v14-ready" transform="translate(${st>=3?16:10} ${st>=3?-70:-30})"><circle r="8" fill="#FFFFFF" stroke="#F2B632" stroke-width="2"/><path d="M-3,-1 l2.4,3 4,-5" stroke="#1FA64C" stroke-width="2" fill="none" stroke-linecap="round"/></g>`:""}</g>` };
P.plantCard=function(sp,st,o){ return `<svg viewBox="-38 -100 76 108" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="0" cy="2" rx="22" ry="6" fill="#8A5A36" opacity=".35"/>${P.plantG(sp,st,o)}</svg>` };

/* ---------- hòn đảo isometric ---------- */
const GR={haru:{top:"#9BDB72",top2:"#8CD064",lip:"#6FBF4E"},natsu:{top:"#79C653",top2:"#6CBB48",lip:"#4FA43E"},aki:{top:"#F4E0B4",top2:"#EBD4A2",lip:"#7CBF5A"},fuyu:{top:"#F7FAFD",top2:"#EAF1F8",lip:"#FFFFFF"}};
/* tiles: mảng N*N, mỗi phần tử null hoặc {sp,st,wilt,ready} ; o.empty = vẽ ô đất trống bấm được */
P.islandSVG=function(o){
  const N=o.n||3, TW=64, TH=32, top=96, dep=26, x0=N*TW/2+12, W=N*TW+24, H=top+N*TH+dep+12;
  const g=GR[o.season]||GR.haru, ttl=o.label?`<title>${o.label}</title>`:"";
  const P0=[x0,top], P1=[x0+N*TW/2,top+N*TH/2], P2=[x0,top+N*TH], P3=[x0-N*TW/2,top+N*TH/2];
  const pt=p=>p.join(","); let s="";
  // mặt bên
  s+=`<path d="M${pt(P3)} L${pt(P2)} L${P2[0]},${P2[1]+dep} L${P3[0]},${P3[1]+dep}Z" fill="#9A6B44"/><path d="M${pt(P2)} L${pt(P1)} L${P1[0]},${P1[1]+dep} L${P2[0]},${P2[1]+dep}Z" fill="#7E5434"/>`;
  const lipW=o.season==="fuyu"?9:7, seg=N*4, wv=[];
  for(let i=0;i<=seg;i++){ const t=i/seg; wv.push([P3[0]+(P2[0]-P3[0])*t, P3[1]+(P2[1]-P3[1])*t+lipW+(i%2?3.5:0)]) }
  for(let i=1;i<=seg;i++){ const t=i/seg; wv.push([P2[0]+(P1[0]-P2[0])*t, P2[1]+(P1[1]-P2[1])*t+lipW+(i%2?3.5:0)]) }
  s+=`<path d="M${pt(P3)} L${pt(P2)} L${pt(P1)} ${wv.reverse().map(q=>"L"+q[0].toFixed(1)+","+q[1].toFixed(1)).join(" ")}Z" fill="${g.lip}"/>`;
  // mặt trên + ô
  s+=`<path d="M${pt(P0)} L${pt(P1)} L${pt(P2)} L${pt(P3)}Z" fill="${g.top}"/>`;
  const C=(i,j)=>[x0+(i-j)*TW/2, top+(i+j)*TH/2+TH/2];
  for(let i=0;i<N;i++) for(let j=0;j<N;j++){ const [cx,cy]=C(i,j); if((i+j)%2) s+=`<path d="M${cx},${cy-TH/2} L${cx+TW/2},${cy} L${cx},${cy+TH/2} L${cx-TW/2},${cy}Z" fill="${g.top2}"/>` }
  if(o.season==="aki") for(let i=0;i<N*N;i++){ const [cx,cy]=C(i%N,Math.floor(i/N)); s+=`<circle cx="${cx-14+(i*7)%20}" cy="${cy-4+(i*5)%9}" r="1.6" fill="#D9B97A"/>` }
  if(o.season==="haru"||o.season==="natsu") for(let i=0;i<N*N;i+=2){ const [cx,cy]=C(i%N,Math.floor(i/N)); s+=`<path d="M${cx+10},${cy+6} l2,-5 l2,5" stroke="${shade(g.top,.85)}" stroke-width="1.4" fill="none"/>` }
  // vật trên ô, vẽ từ sau ra trước
  const order=[]; for(let i=0;i<N;i++) for(let j=0;j<N;j++) order.push([i,j]); order.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])||a[0]-b[0]);
  order.forEach(([i,j])=>{ const idx=i*N+j, [cx,cy]=C(i,j), t=(o.tiles||[])[idx];
    if(t){ s+=`<ellipse cx="${cx}" cy="${cy+2}" rx="16" ry="6" fill="${o.season==="fuyu"?"#D7E2EE":"#7A5234"}" opacity="${o.season==="fuyu"?.8:.45}"/><g transform="translate(${cx} ${cy+3}) scale(${o.scale||1})">${t.memo?P.memoTree(t.memo,o.season):P.plantG(t.sp,t.st,t)}</g>`;
      if(o.season==="fuyu"&&!t.memo&&t.st>=3) s+=`<ellipse cx="${cx}" cy="${cy-((P.SP[t.sp]||{}).t==="tree"?60:30)}" rx="9" ry="3" fill="#fff" opacity=".9"/>` }
    else if(o.empty) s+=`<path d="M${cx},${cy-9} L${cx+18},${cy} L${cx},${cy+9} L${cx-18},${cy}Z" fill="${o.season==="fuyu"?"#DCE6F1":"#8A5A36"}" opacity=".55"/><path d="M${cx-4},${cy} h8 M${cx},${cy-4} v8" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity=".9"/>`;
    if(o.click) s+=`<path class="v14-tile${o.sel===idx?" sel":""}" data-v13="tile:${idx}" d="M${cx},${cy-TH/2} L${cx+TW/2},${cy} L${cx},${cy+TH/2} L${cx-TW/2},${cy}Z" fill="transparent"/>`; });
  if(o.season==="fuyu") s+=[...Array(18)].map((_,i)=>`<circle cx="${(i*53)%W}" cy="${(i*37)%(H-30)}" r="${1.4+(i%3)*.6}" fill="#fff" opacity=".85"/>`).join("");
  return `<svg class="v14-island" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">${ttl}${s}</svg>`;
};
/* cây kỷ niệm: mỗi ngày học xong hết nhiệm vụ mọc một cây, kiểu cây theo mùa của tháng đó */
P.memoTree=function(kind,season){
  const t={haru:"sakuraM",natsu:"greenM",aki:"momijiM",fuyu:"pineM"}[season]||"greenM";
  const v=kind%3;
  if(t==="pineM"){ const lf=["#2E6F8E","#2E7D5B","#3A6F9E"][v]; let g=`<rect x="-2" y="-7" width="4" height="7" fill="#7A5237"/>`; for(let i=0;i<3;i++){ const yb=-5-i*13, w=15-i*4; g+=`<path d="M${-w},${yb} L0,${yb-20} L${w},${yb}Z" fill="${i%2?shade(lf,1.2):lf}"/><path d="M${-w+3},${yb-1} q${w-3},-4 ${2*w-6},0" stroke="#fff" stroke-width="2.4" fill="none"/>` } return g+`<path d="M0,-50 l2,-4 l2,4z" fill="#fff"/>` }
  const can={sakuraM:[["#FFB7CE","#FFD3E0"],["#FF9DBB","#FFC4D6"],["#FFFFFF","#FFE3EC"]],greenM:[["#4FA94A","#6CC45C"],["#3F9B45","#5FBF57"],["#5CB85A","#FFD23F"]],momijiM:[["#E4572E","#F28C28"],["#F28C28","#F2B632"],["#C93A1E","#E4572E"]]}[t][v];
  return `<path d="M-3,0 Q-2,-14 0,-22 Q2,-14 3,0Z" fill="#7A5237"/><circle cx="-8" cy="-28" r="10" fill="${can[0]}"/><circle cx="8" cy="-30" r="10" fill="${can[0]}"/><circle cx="0" cy="-40" r="11" fill="${can[1]}"/>${t==="greenM"&&v===2?dots([[-6,-32],[6,-38],[2,-26]],2.4,"#FF9A1F"):""}`;
};
})();
