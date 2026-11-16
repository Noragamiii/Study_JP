/* Sổ luyện N3 — v13: xu thưởng · cửa hàng · khu vườn Nhật · phụ kiện · bùa · theme
   + điểm danh 7 ngày · quẻ may mắn (おみくじ) · rương kho báu · thử thách tuần · thành tích · độ thân thiết (絆)
   + bạn đồng hành dạy học: mẹo đỗ JLPT, bài học nhỏ, kế hoạch để đỗ.
   Phủ lên v12 theo cùng cách v12 phủ lên v11. Dữ liệu lưu trong S.rw (đi theo sao lưu / đồng bộ). */
(function(){
"use strict";
const root=document.documentElement;
if(!root.classList.contains("v12")||!window.V12||!window.V13ART) return;
const V=window.V13=window.V13||{}, V12=window.V12, A=window.V13ART, TP=window.V13TIPS||{TIPS:[],SEC:{},NUG:[]};
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const safe=(f,d)=>{try{const v=f(); return v==null?d:v}catch(e){return d}};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const nm=()=>esc(V12.rawName());
const bud=(m,o)=>V12.buddySVG(m,o);
const J=t=>`<span class="jp v12-jp">${t}</span>`;

/* ================= trạng thái ================= */
function RW(){ let r=S.rw; if(!r||typeof r!=="object") r=S.rw={}; if(typeof r.c!=="number") r.c=0; if(typeof r.tot!=="number") r.tot=0;
  ["inv","eq","off","days","ach","frz","fl","pets"].forEach(k=>{ if(!r[k]||typeof r[k]!=="object") r[k]={} });
  if(!r.cd||typeof r.cd!=="object") r.cd={}; if(!r.cd.c||typeof r.cd.c!=="object") r.cd.c={};
  if(!r.v14){ r.v14=1; ["yuu","yoru"].forEach(t=>{ if(r.inv["sky:"+t]){ r.inv["tm:"+t]=1; delete r.inv["sky:"+t] } }); if(r.eq.sky){ r.sc=Object.assign({},r.sc,{t:r.eq.sky}); delete r.eq.sky } }
  return r }
function D(){ const r=RW(); if(!r.days[TODAY]){ r.days[TODAY]={}; Object.keys(r.days).map(Number).filter(d=>d<TODAY-10).forEach(d=>delete r.days[d]) } return r.days[TODAY] }
function mergeRw(a,b){
  if(!b||typeof b!=="object") return a; if(!a||typeof a!=="object") return b;
  const base=(b.t||0)>(a.t||0)?b:a, other=base===a?b:a; const o=JSON.parse(JSON.stringify(base));
  o.tot=Math.max(a.tot||0,b.tot||0); o.okAll=Math.max(a.okAll||0,b.okAll||0); o.best=Math.max(a.best||0,b.best||0); o.perf=Math.max(a.perf||0,b.perf||0);
  ["inv","ach","frz","fl"].forEach(k=>{ o[k]=o[k]||{}; Object.entries(other[k]||{}).forEach(([id,v])=>{ if(k==="inv"&&CONS[id]) return; if(o[k][id]==null) o[k][id]=v }) });
  o.pets=o.pets||{}; Object.entries(other.pets||{}).forEach(([id,v])=>{ const m=o.pets[id]; if(!m) o.pets[id]=v; else if((v.x||0)>(m.x||0)) o.pets[id]=Object.assign({},m,{x:v.x}) });
  o.cd=o.cd||{}; o.cd.c=o.cd.c||{}; Object.entries((other.cd||{}).c||{}).forEach(([id,n])=>{ if((o.cd.c[id]||0)<n) o.cd.c[id]=n });
  return o;
}
const _merge=window.mergeState;
window.mergeState=function(inc){ const mine=S.rw, n2=S.n2; const out=_merge.apply(this,arguments);
  try{ S.rw=mergeRw(S.rw||mine,inc&&inc.rw); if(inc&&inc.n2&&!(S.n2&&S.n2.on)) S.n2=inc.n2; else if(n2&&!S.n2) S.n2=n2 }catch(e){} return out };

/* ================= danh mục cửa hàng (v14: nhiều địa điểm, cây trồng, mùa & giờ) ================= */
const WL=A.W, PL=A.P;
const CONS={omamori:1,maneki:1,ofuda:1,hiryo:1,oyatsu:1};
const SHOP=[];
WL.ORDER.forEach(loc=>Object.entries(WL.ITEMS[loc]).forEach(([id,it])=>SHOP.push({id:loc==="niwa"?id:loc+":"+id,cat:"place",loc,key:id,n:it.n,jp:it.jp,p:it.p,need:it.need?(loc==="niwa"?it.need:loc+":"+it.need):null})));
WL.ORDER.slice(1).forEach(loc=>{ const L=WL.LOCS[loc]; SHOP.push({id:"loc:"+loc,cat:"trip",kind:"loc",v:loc,n:"Vé tới "+L.n,jp:L.jp,p:L.p,req:L.need}) });
WL.SEASONS.forEach(([v,n,jp])=>SHOP.push({id:"ss:"+v,cat:"trip",kind:"season",v,n:"Giữ mùa "+n,jp,p:600,d:"Cho khung cảnh luôn ở mùa này (mặc định: theo lịch thật)."}));
WL.TIMES.forEach(([v,n,jp])=>SHOP.push({id:"tm:"+v,cat:"trip",kind:"time",v,n:"Giữ giờ: "+n,jp,p:500,d:"Cho khung cảnh luôn ở thời điểm này (mặc định: theo giờ thật)."}));
PL.ORDER.forEach(sp=>{ const s=PL.SP[sp]; if(!s.rare) SHOP.push({id:"seed:"+sp,cat:"seed",kind:"seed",v:sp,n:s.n,jp:s.jp,r:s.r,p:s.p}) });
SHOP.push({id:"hiryo",cat:"seed",kind:"hiryo",n:"Phân bón",jp:"肥料",p:200,max:20,d:"Bón cho một cây: +60 điểm lớn ngay lập tức."});
SHOP.push({id:"fuku",cat:"seed",kind:"gacha",n:"Túi phúc",jp:"福袋",p:500,d:"Ngẫu nhiên: hạt giống, phân bón, bùa 50:50, hoặc hạt hiếm chỉ túi phúc mới có. 8 túi chưa ra hạt hiếm thì túi thứ 8 chắc chắn ra."});
SHOP.push({id:"land",cat:"seed",kind:"land",n:"Mở rộng đảo",jp:"土地",p:0});
[["ribbon","Nơ đỏ","リボン",600],["sakura","Hoa anh đào cài tóc","桜の髪飾り",600],["whisker","Râu mèo","猫ひげ",700],["muffler","Khăn quàng","マフラー",800],["glasses","Kính tròn","眼鏡",800],["hachimaki","Khăn quyết đỗ","合格鉢巻",900],["bansoko","Băng cá nhân","絆創膏",500],["hoshipin","Kẹp sao","星のピン",600],["usamimi","Tai thỏ","うさ耳",900],["beret","Mũ nồi","ベレー帽",900],
 ["hanakan","Vòng hoa","花冠",900],["santa","Mũ Noel","サンタ帽",1000],["headphone","Tai nghe","ヘッドホン",1200],["shades","Kính râm","サングラス",1300],["heartglass","Kính trái tim","ハートめがね",1100],["tsuno","Sừng quỷ nhỏ","鬼の角",1200],["kitsunemen","Mặt nạ cáo","狐面",1400],["majo","Mũ phù thuỷ","魔女帽",1500],["gradcap","Mũ tốt nghiệp","角帽",1600],["tenshi","Vòng thiên thần","天使の輪",2000],["crown","Vương miện","王冠",2500]]
 .forEach(([a,n,jp,p])=>SHOP.push({id:"a:"+a,cat:"acc",acc:a,n,jp,p}));
(A.ACC_NEW||[]).forEach(([a,n,jp,p])=>{ if(A.ACC[a]) SHOP.push({id:"a:"+a,cat:"acc",acc:a,n,jp,p}) });
SHOP.push({id:"omamori",cat:"charm",n:"Bùa giữ chuỗi",jp:"お守り",p:700,max:3,d:"Lỡ nghỉ 1–2 ngày, bùa tự dùng để chuỗi ngày học không bị đứt. Mang tối đa 3 lá."},
 {id:"maneki",cat:"charm",n:"Mèo thần tài",jp:"招き猫",p:500,max:5,d:"Bấm Dùng để nhân đôi mọi xu kiếm được đến hết hôm nay."},
 {id:"ofuda",cat:"charm",n:"Bùa 50:50 (3 lá)",jp:"お札",p:250,q:3,max:30,d:"Khi luyện đề: loại 2 phương án sai của một câu. Không dùng được khi thi thử."},
 {id:"t:sakura",cat:"look",kind:"theme",v:"sakura",n:"Màu Sakura",jp:"桜色",p:1800,c:"#E8548B"},{id:"t:umi",cat:"look",kind:"theme",v:"umi",n:"Màu Biển",jp:"海色",p:1800,c:"#1C8FD6"},
 {id:"t:yuuyake",cat:"look",kind:"theme",v:"yuuyake",n:"Màu Hoàng hôn",jp:"夕焼け色",p:1800,c:"#E8742A"},{id:"t:fuji",cat:"look",kind:"theme",v:"fuji",n:"Màu Tím Fuji",jp:"藤色",p:1800,c:"#7C5CE0"},
 {id:"f:sakura",cat:"look",kind:"fx",v:"sakura",n:"Mưa cánh hoa",jp:"花吹雪",p:1000},{id:"f:hoshi",cat:"look",kind:"fx",v:"hoshi",n:"Mưa sao",jp:"流れ星",p:1000},{id:"f:koban",cat:"look",kind:"fx",v:"koban",n:"Mưa xu vàng",jp:"小判",p:1000},
 {id:"ti:doryoku",cat:"look",kind:"title",v:"努力家 · Người chăm chỉ",n:"Danh hiệu: Người chăm chỉ",jp:"努力家",p:800},{id:"ti:kanji",cat:"look",kind:"title",v:"漢字ハンター · Thợ săn Kanji",n:"Danh hiệu: Thợ săn Kanji",jp:"漢字ハンター",p:1500},
 {id:"ti:bunpou",cat:"look",kind:"title",v:"文法マスター · Bậc thầy ngữ pháp",n:"Danh hiệu: Bậc thầy ngữ pháp",jp:"文法マスター",p:2500},{id:"ti:senpai",cat:"look",kind:"title",v:"先輩 · Senpai",n:"Danh hiệu: Senpai",jp:"先輩",p:4000},
 {id:"ti:goukaku",cat:"look",kind:"title",v:"合格確実 · Chắc suất đỗ",n:"Danh hiệu: Chắc suất đỗ",jp:"合格確実",p:8000});
(A.PET_ORDER||[]).forEach(id=>{ const P=A.PETS[id]; SHOP.push({id:"pet:"+id,cat:"pet",kind:"pet",v:id,n:P.n,jp:P.jp,p:P.p,pn:P.need||0,cn:P.card||0}) });
SHOP.push({id:"oyatsu",cat:"pet",kind:"snack",n:"Bánh thưởng thú cưng",jp:"おやつ",p:150,max:20,d:"Cho thú cưng đang đi cùng ăn: +40 điểm thân thiết và hết đói ngay."});
SHOP.push({id:"pack",cat:"card",kind:"pack",n:"Gói thẻ thường",jp:"戦士パック",p:300,d:"3 thẻ Chiến binh Kanji ngẫu nhiên (N 70% · R 24% · SR 5% · SSR 1%)."},
 {id:"packg",cat:"card",kind:"pack",gold:1,n:"Gói thẻ cao cấp",jp:"極パック",p:1000,d:"5 thẻ, chắc chắn có ít nhất 1 thẻ R trở lên (N 52% · R 33% · SR 11% · SSR 4%)."});
const SHOP_BY={}; SHOP.forEach(x=>SHOP_BY[x.id]=x);
const CATS=[["place","Trang trí","飾"],["seed","Cây & hạt","種"],["pet","Thú cưng","ペット"],["card","Thẻ bài","札"],["acc","Phụ kiện","小物"],["charm","Bùa","守"],["look","Giao diện","色"],["trip","Du lịch & mùa","旅"]];
const owned=id=>!!(RW().inv[id]>0);
const locOwned=loc=>loc==="niwa"||owned("loc:"+loc);
const curLoc=()=>{ const l=RW().eq.loc; return l&&WL.LOCS[l]&&locOwned(l)?l:"niwa" };
const placeOwned=loc=>SHOP.filter(x=>x.cat==="place"&&x.loc===loc&&owned(x.id));
const placeItems=loc=>placeOwned(loc).filter(x=>!RW().off[x.id]).map(x=>x.key);
const flowers=()=>Object.values(S.daydone||{}).filter(v=>v&&v[1]>0&&v[0]>=v[1]).length;
const scS=()=>RW().sc||{};
function curSeason(){ const s=scS().s; return s&&s!=="auto"&&owned("ss:"+s)?s:WL.autoSeason() }
function curTime(){ const t=scS().t; return t&&t!=="auto"&&owned("tm:"+t)?t:WL.autoTime() }
function sceneSVG(loc,o){ loc=loc||curLoc(); return WL.sceneSVG(Object.assign({loc,items:placeItems(loc),season:curSeason(),time:curTime(),flowers:flowers()},o||{})) }
function gardenHTML(){ return sceneSVG(curLoc(),{fx:false}) }
function locReq(loc){ const L=WL.LOCS[loc]; if(!L||!L.need) return {ok:true}; const [pl,c]=L.need; const have=placeOwned(pl).length; return {ok:have>=c,have,c,pl} }

/* ================= cây trồng — kiểu Forest: mua hạt, học để cây lớn, ra hoa, kết trái ================= */
const LAND_P={4:1500,5:3500,6:7000};
function PLs(){ const r=RW(); let p=r.pl; if(!p||typeof p!=="object") p=r.pl={}; if(!p.n) p.n=3; ["t","seed","dex","fr"].forEach(k=>{ if(!p[k]||typeof p[k]!=="object") p[k]={} }); p.hv=p.hv||0; p.pity=p.pity||0; if(!p.gift){ p.gift=1; p.seed.ichigo=(p.seed.ichigo||0)+2; p.seed.asagao=(p.seed.asagao||0)+1; p.seed.himawari=(p.seed.himawari||0)+1 } return p }
const wilted=()=>{ const p=PLs(); return !!(p.last&&TODAY-p.last>=3) };
const STAGE_F=[.06,.22,.5,1,1.2];
function plantState(key){ const p=PLs(), t=p.t[key]; if(!t||!PL.SP[t.sp]) return null; const s=PL.SP[t.sp], st=PL.stageOf(t.sp,t.gp), fin=PL.finalStage(t.sp);
  const base=s.g*(PL.fruit(t.sp)?1.2:1), nh=t.nh==null?base:t.nh, ready=st>=fin&&s.y>0&&t.gp>=nh;
  let a=0,b=1,lab; if(st<fin){ a=st?STAGE_F[st-1]*s.g:0; b=STAGE_F[st]*s.g; lab="tới “"+PL.STAGE_VI[st+1]+"”" } else if(s.y){ a=nh-s.c; b=nh; lab=ready?"sẵn sàng thu hoạch":"tới lần thu hoạch sau" } else { lab="đã trưởng thành" }
  return {key,sp:t.sp,gp:t.gp,st,fin,ready,wilt:wilted(),nh,s,prog:st>=fin&&!s.y?1:Math.max(0,Math.min(1,(t.gp-a)/(b-a))),left:Math.max(0,Math.ceil(b-t.gp)),lab} }
function grow(n,only){
  const p=PLs(); p.last=TODAY; const d=D(); d.gw=Math.round(((d.gw||0)+n)*10)/10;
  Object.keys(p.t).forEach(key=>{ if(only&&key!==only) return; const t=p.t[key]; if(!t||!PL.SP[t.sp]) return; const b0=PL.stageOf(t.sp,t.gp); t.gp=Math.round((t.gp+n)*10)/10; const b1=PL.stageOf(t.sp,t.gp);
    if(b1>b0){ (p.ev=p.ev||[]).push([t.sp,b1]); if(b1>=4&&!p.dex[t.sp]){ p.dex[t.sp]=TODAY; p.newdex=t.sp } } });
  RW().t=Date.now();
}
V.grow=grow;
const tileKey=(idx,N)=>Math.floor(idx/N)+"_"+(idx%N);
function islandTiles(){ const p=PLs(), N=p.n, out=[]; for(let i=0;i<N*N;i++){ const st=plantState(tileKey(i,N)); out.push(st?{sp:st.sp,st:st.st,ready:st.ready,wilt:st.wilt}:null) } return out }
function harvest(key){ const st=plantState(key); if(!st||!st.ready) return; const p=PLs(); p.t[key].nh=st.gp+st.s.c; p.hv++; p.fr[st.sp]=(p.fr[st.sp]||0)+1; const got=earn(st.s.y,"harvest"); coinSfx();
  safe(()=>V12.say(`${J(PL.fruit(st.sp)?"収穫！":"きれい！")} ${PL.fruit(st.sp)?"Thu hoạch":"Hái hoa"} ${esc(st.s.n)} (<span class="jp">${st.s.jp}</span>): <b>+${got} xu</b>. Học tiếp để cây ra lứa mới nhé!`,{mood:"happy"})); refresh(); setTimeout(checkAch,600) }
function sow(key,sp){ const p=PLs(); if(p.t[key]) return; if(!(p.seed[sp]>0)) return toast("Bạn chưa có hạt này — mua ở Cửa hàng → Cây & hạt"); p.seed[sp]--; p.t[key]={sp,gp:0,at:Date.now()}; markDirty(); coinSfx();
  const s=PL.SP[sp]; safe(()=>V12.say(`Gieo hạt <b>${esc(s.n)}</b> (<span class="jp">${s.jp}・${s.r}</span>) rồi! Mỗi câu bạn làm đúng là một lần tưới — cần khoảng <b>${s.g}</b> điểm lớn để ra hoa.`,{mood:"sing"})); refresh() }
function fertilize(key){ const r=RW(); if(!(r.inv.hiryo>0)) return toast("Hết phân bón — mua ở Cửa hàng → Cây & hạt"); if(!PLs().t[key]) return; r.inv.hiryo--; grow(60,key); markDirty(); coinSfx(); refresh() }
function dig(key,btn){ if(btn&&!btn.dataset.ok){ btn.dataset.ok=1; btn.textContent="Bấm lần nữa để nhổ cây"; return } delete PLs().t[key]; GV.sel=key; markDirty(); refresh() }
function openFuku(){
  const r=RW(), p=PLs(); if(!spend(500)) return toast(`Chưa đủ xu — túi phúc giá 500 xu`); p.pity++; let res, art="", txt;
  const rare=PL.ORDER.filter(sp=>PL.SP[sp].rare), common=PL.ORDER.filter(sp=>!PL.SP[sp].rare), x=Math.random();
  if(p.pity>=8||x<.12){ const sp=pick(rare); p.seed[sp]=(p.seed[sp]||0)+1; p.pity=0; res="rare"; art=PL.plantCard(sp,PL.finalStage(sp)); txt=`<b>Hạt hiếm: ${esc(PL.SP[sp].n)}</b> <span class="jp">${PL.SP[sp].jp}</span>`; }
  else if(x<.56){ const sp=pick(common.slice(6)); p.seed[sp]=(p.seed[sp]||0)+1; art=PL.plantCard(sp,PL.finalStage(sp)); txt=`Hạt <b>${esc(PL.SP[sp].n)}</b> <span class="jp">${PL.SP[sp].jp}</span>` }
  else if(x<.78){ r.inv.hiryo=Math.min(20,(r.inv.hiryo||0)+3); txt="<b>3 túi phân bón</b>"; art=A.CHARM.hiryo||"" }
  else if(x<.92){ r.inv.ofuda=Math.min(30,(r.inv.ofuda||0)+3); txt="<b>3 lá bùa 50:50</b>"; art=A.CHARM.ofuda }
  else { r.c+=300; txt="<b>300 xu</b> (lời 300%… à không, chỉ hoàn lại thêm thôi!)"; art=A.coin(80) }
  r.t=Date.now(); markDirty();
  popup(`<div class="v13-pop"><div class="v14-fuku">${art}</div><div class="eyebrow">福袋 · Túi phúc</div><h2>${res==="rare"?J("大当たり！"):J("当たり！")}</h2><p>Bạn nhận được ${txt}.</p><p class="small muted">${p.pity?`Còn ${8-p.pity} túi nữa chắc chắn ra hạt hiếm.`:"Bộ đếm hạt hiếm đã quay về 0."}</p><div class="row"><button class="btn primary" data-kxclose>Nhận</button><button class="btn" data-v13="buy:fuku" data-kxclose>Mở thêm (500)</button></div></div>`,res==="rare");
  refresh();
}
/* đảo kỷ niệm: mỗi ngày xong hết nhiệm vụ mọc một cây trên đảo của tháng đó */
const ymOf=day=>{ const d=new Date(day*86400000); return d.getUTCFullYear()+"-"+String(d.getUTCMonth()+1).padStart(2,"0") };
const seasonOfYm=ym=>{ const m=+ym.slice(5); return m>=3&&m<=5?"haru":m>=6&&m<=8?"natsu":m>=9&&m<=11?"aki":"fuyu" };
function memSync(){ const r=RW(); r.mem=r.mem&&typeof r.mem==="object"?r.mem:{}; let ch=false;
  Object.entries(S.daydone||{}).forEach(([d,v])=>{ d=+d; if(v&&v[1]>0&&v[0]>=v[1]){ const ym=ymOf(d), a=r.mem[ym]=r.mem[ym]||[]; if(!a.includes(d)){ a.push(d); a.sort((x,y)=>x-y); ch=true } } });
  if(ch){ r.t=Date.now(); markDirty() } return r.mem }
function memIsland(ym,big){ const days=(RW().mem||{})[ym]||[], n=days.length>25?6:days.length>16?5:big?5:4, tiles=[];
  const order=[]; for(let i=0;i<n;i++) for(let j=0;j<n;j++) order.push([i,j]); order.sort((a,b)=>((a[0]*7+a[1]*3)%n)-((b[0]*7+b[1]*3)%n)||a[0]-b[0]);
  for(let i=0;i<n*n;i++) tiles.push(null); days.slice(0,n*n).forEach((d,k)=>{ const [i,j]=order[k]; tiles[i*n+j]={memo:d+1} });
  const [y,m]=ym.split("-"); return {svg:PL.islandSVG({n,season:seasonOfYm(ym),tiles,label:`Tháng ${+m}/${y}: ${days.length} ngày xong hết nhiệm vụ`}),n:days.length,m:+m,y} }

/* ================= kiếm / tiêu xu ================= */
function bond(){ const t=RW().tot; let lv=1; while(t>=15*lv*(lv+3)&&lv<99) lv++; const a=15*(lv-1)*(lv+2), b=15*lv*(lv+3); return {lv,a,b,p:Math.max(0,Math.min(1,(t-a)/(b-a))),left:b-t} }
const bondName=lv=>lv>=20?"最強コンビ · Cặp đôi mạnh nhất":lv>=15?"師弟 · Thầy trò ăn ý":lv>=10?"相棒 · Cộng sự":lv>=6?"親友 · Bạn thân":lv>=3?"友達 · Bạn bè":"知り合い · Mới quen";
function earn(n,why){
  n=Math.round(n); if(!(n>0)) return 0; const r=RW(); if(r.dbl===TODAY) n*=2; const lv0=bond().lv;
  r.c+=n; r.tot+=n; r.t=Date.now(); const d=D(); d.e=(d.e||0)+n; if(why){ d.log=d.log||{}; d.log[why]=(d.log[why]||0)+n }
  markDirty(); floatCoin(n); paintChip(); const lv1=bond().lv; if(lv1>lv0) setTimeout(()=>whenIdle(()=>levelUp(lv1)),900); return n;
}
function spend(n){ const r=RW(); if(r.c<n) return false; r.c-=n; r.t=Date.now(); markDirty(); paintChip(); return true }
V.earn=earn; V.coins=()=>RW().c;
function coinSfx(){ safe(()=>V12.tone([988,1319],0.06,"sine",0.05)) }
function floatCoin(n){
  const chip=$(".v12-stat.coin"); const f=document.createElement("div"); f.className="v13-float"; f.innerHTML=`+${n} ${A.coin(16)}`;
  let x=window.innerWidth-90, y=60; if(chip){ const r=chip.getBoundingClientRect(); if(r.width){ x=r.left+r.width/2-18; y=r.bottom+2 } }
  f.style.left=Math.max(8,x)+"px"; f.style.top=y+"px"; document.body.appendChild(f); setTimeout(()=>f.remove(),1300);
  if(chip){ chip.classList.remove("pulse"); void chip.offsetWidth; chip.classList.add("pulse") }
}
function paintChip(){
  const st=$("#v12stats"); if(!st) return; const r=RW(); let c=$(".v12-stat.coin",st);
  if(!c){ st.insertAdjacentHTML("afterbegin",`<button type="button" class="v12-stat coin" data-v13="garden" aria-label="Xu thưởng"></button>`); c=$(".v12-stat.coin",st) }
  c.innerHTML=`${A.coin()}<span>${r.c}</span>${r.dbl===TODAY?'<i class="x2">×2</i>':""}`; c.setAttribute("aria-label",r.c+" xu thưởng — mở vườn và cửa hàng");
}
function levelUp(lv){
  const gift=5+3*lv; const r=RW(); r.c+=gift; r.t=Date.now(); markDirty(); paintChip();
  popup(`<div class="v13-pop">${bud("love")}<div class="eyebrow">絆レベルアップ！</div><h2>Độ thân thiết lên cấp ${lv}</h2><p>${esc(bondName(lv))}<br>${nm()} tặng bạn <b>+${gift} xu</b>. Cảm ơn vì đã học cùng mình mỗi ngày nhé!</p><div class="row"><button class="btn primary" data-kxclose>やった！</button></div></div>`,true);
}
/* không chen hộp thoại thưởng vào giữa lúc đang làm bài / đang mở hộp thoại khác */
function whenIdle(fn,n){ n=n||0; if(n<60&&(safe(()=>V12.inFocus(),false)||document.getElementById("kxmodal"))) return setTimeout(()=>whenIdle(fn,n+1),2500); try{ fn() }catch(e){ console.error("[v13]",e) } }
function popup(html,party){ const b=kxModal(html,"v13-dlg"); if(party){ safe(()=>V12.sfx.done()); safe(()=>V12.confetti(36)) } return b }

/* ----- móc vào làm bài ----- */
const COMBO_BONUS={3:1,5:2,7:2,10:3,15:4,20:5,30:8};
V.onAnswer=function(fb,q,s){
  const r=RW(), d=D(); const h=new Date().getHours(); if(h<7&&h>=4) r.fl.early=1; if(h>=23||h<4) r.fl.night=1;
  if(fb&&!fb.ok) safe(()=>grow(.3)); if(!fb||!fb.ok) return 0; safe(()=>grow(1)); safe(()=>petXp(1)); r.okAll=(r.okAll||0)+1; if(fb.combo>(r.best||0)) r.best=fb.combo;
  d.ans=(d.ans||0)+1; if(fb.combo>(d.cb||0)) d.cb=fb.combo; let n=1; if(fb.mood==="proud"){ n+=1; d.fx=(d.fx||0)+1 } n+=COMBO_BONUS[fb.combo]||0;
  fb.dmg=bossHit(1+(COMBO_BONUS[fb.combo]||0));
  return earn(n,"ans");
};
V.onResult=function(s,o){
  let n=0; if(o.n>=8&&o.p>=0.9) n+=5; else if(o.n>=8&&o.p>=0.7) n+=2; if(o.exam&&o.n>=10) n+=15;
  if(o.n>=10&&o.r===o.n){ const r=RW(); r.perf=(r.perf||0)+1 }
  if(o.n>=8&&o.p>=0.9){ const d=D(); d.pf=(d.pf||0)+1; bossHit(10) }
  setTimeout(checkAch,1500); setTimeout(()=>safe(()=>V13N2.check()),2500); return n?earn(n,"bonus"):0;
};
const _wGrade=window.wGrade;
if(typeof _wGrade==="function") window.wGrade=function(w,g){ const out=_wGrade.apply(this,arguments); try{ if(g>=2){ const d=D(); d.w=(d.w||0)+1; grow(.4); if(d.w%5===0) earn(1,"vocab") } }catch(e){} return out };
const _gmPlayed=window.gmPlayed;
if(typeof _gmPlayed==="function") window.gmPlayed=function(){ const out=_gmPlayed.apply(this,arguments); try{ const d=D(); d.gm=(d.gm||0)+1; if(d.gm<=3) earn(2,"game") }catch(e){} return out };
/* chuỗi ngày: ngày được bùa bảo vệ không làm đứt chuỗi */
const _streak=window.streak;
window.streak=function(){ try{ const by=dayStats(), f=RW().frz; let n=0, d=TODAY; if(!by[d]&&!f[d]) d--; for(;by[d]||f[d];d--){ if(by[d]) n++ } return n }catch(e){ return _streak() } };
function freezeCheck(){
  const r=RW(), by=dayStats(); let L=0; Object.keys(by).forEach(d=>{d=+d; if(d<TODAY&&d>L) L=d}); if(!L) return 0;
  const gap=TODAY-1-L; if(gap<1||gap>2) return 0; let n=0; for(let d=L;by[d]||r.frz[d];d--) if(by[d]) n++; if(n<2) return 0;
  const days=[]; for(let d=L+1;d<TODAY;d++) if(!r.frz[d]) days.push(d); if(!days.length||(r.inv.omamori||0)<days.length) return 0;
  r.inv.omamori-=days.length; days.forEach(d=>r.frz[d]=1); r.t=Date.now(); markDirty(); return days.length;
}

/* ================= cùng nhau vượt thử thách: thử thách mỗi ngày + yêu quái tuần ================= */
const QUESTS={
 ok20:["Trả lời đúng 20 câu",(d)=>[d.ans||0,20],6],ok40:["Trả lời đúng 40 câu",(d)=>[d.ans||0,40],10],
 cb5:["Đạt combo 5 câu đúng liên tiếp",(d)=>[d.cb||0,5],6],cb8:["Đạt combo 8 câu đúng liên tiếp",(d)=>[d.cb||0,8],10],
 pf:["Làm một bài ≥ 8 câu, đúng từ 90%",(d)=>[d.pf||0,1],8],fix:["Sửa đúng 3 câu bạn từng sai",(d)=>[d.fx||0,3],8],
 w12:["Nhớ được 12 từ vựng",(d)=>[d.w||0,12],6],m3:["Xong 3 nhiệm vụ hôm nay",(d,pr)=>[pr.done,Math.min(3,pr.total||3)],6],gm:["Chơi 1 trò ở tab Chơi",(d)=>[d.gm||0,1],4]
};
function questsToday(){ const g=[["ok20","ok40"],["cb5","cb8","pf","fix"],["w12","m3","gm"]]; return g.map((a,i)=>a[(TODAY*(i+2)+i)%a.length]) }
function questState(){ const d=D(), pr=V12.mission(); return questsToday().map(id=>{ const q=QUESTS[id]; const [c,g]=q[1](d,pr); return {id,t:q[0],c:Math.min(c,g),g,r:q[2],done:c>=g,paid:!!(d.q&&d.q[id])} }) }
function questCheck(){
  const d=D(); const qs=questState(); const got=qs.filter(x=>x.done&&!x.paid); if(!got.length) return;
  d.q=d.q||{}; let sum=0; got.forEach(x=>{ d.q[x.id]=1; sum+=earn(x.r,"quest") });
  let all=""; if(qs.every(x=>x.done)&&!d.qall){ d.qall=1; sum+=earn(8,"quest"); all=" Xong cả 3 thử thách hôm nay — thưởng thêm!" }
  setTimeout(()=>safe(()=>V12.say(`${J("クリア！")} Thử thách “${esc(got[0].t)}” xong rồi: <b>+${sum} xu</b>.${all} Tụi mình làm được mà!`,{mood:all?"sparkle":"proud",ms:7000})),700);
  if(view==="today"){ const m=$("#main"); if(m) setTimeout(()=>decorateToday(m),0) }
}
function boss(){ const r=RW(), id=weekId(); if(!r.boss||r.boss.id!==id){ const n=r.bossN||0; const max=240+40*Math.min(n,6); r.boss={id,k:id%A.YOKAI.length,max,hp:max,dead:0} } return r.boss }
function bossHit(n){
  const b=boss(); if(b.dead||!(n>0)) return 0; n=Math.min(n,b.hp); b.hp-=n; RW().t=Date.now();
  if(b.hp<=0){ b.dead=TODAY; const r=RW(); r.bossN=(r.bossN||0)+1; const y=A.YOKAI[b.k]; setTimeout(()=>whenIdle(()=>{ const got=earn(50+5*Math.min(r.bossN,8),"boss"); r.cd.fr=(r.cd.fr||0)+1;
    popup(`<div class="v13-pop">${bud("sparkle")}<div class="eyebrow">妖怪退治 · Hạ yêu quái tuần</div><h2>${J("やったー！")} Tụi mình thắng rồi!</h2><p><b>${esc(y.n)}</b> (${y.jp}) đã bị đánh bại nhờ ${b.max} đòn “trả lời đúng” của bạn. ${nm()} tự hào về bạn lắm!</p><p class="v13-gain">+${got} xu</p><div class="v13-lucky"><small>Phần thưởng thêm</small><b>戦士パック · 1 gói thẻ miễn phí</b><div>Mở ở Vườn → Album thẻ.</div></div><div class="row"><button class="btn primary" data-kxclose>万歳！</button><button class="btn" data-v13="pfree:0" data-kxclose>Mở gói thẻ</button></div></div>`,true); refresh(); checkAch() }),1200) }
  else { const half=b.max/2; if(b.hp<=half&&b.hp+n>half) setTimeout(()=>safe(()=>V12.say(`Yêu quái chỉ còn <b>nửa máu</b> rồi! Mình với bạn đánh tiếp nào!`,{mood:"fire"})),900) }
  return n;
}
function bossHTML(){ const b=boss(), y=A.YOKAI[b.k]; const left=7-((TODAY+3)%7);
  return `<div class="v13-boss ${b.dead?"dead":""}" id="v13boss">${A.yokai(b.k)}<div><b>${b.dead?"Đã hạ":"Yêu quái tuần này"}: <span class="jp">${y.jp}</span> ${esc(y.n)}</b><small>${b.dead?`${nm()} và bạn đã thắng! Yêu quái mới sẽ xuất hiện vào thứ Hai.`:`${esc(y.t)} Mỗi câu đúng là một đòn đánh, combo đánh mạnh hơn — còn ${left} ngày.`}</small>
    <div class="v13-hp"><span>HP</span><i><u style="width:${Math.round(100*b.hp/b.max)}%"></u></i><span>${b.hp}/${b.max}</span></div></div></div>` }
function questsHTML(){ const qs=questState(); const d=D();
  return `<div class="v13-quests"><div class="v13-sub">Thử thách hôm nay cùng ${nm()}${d.qall?" · xong cả 3!":""}</div>${qs.map(x=>`<div class="v13-qrow ${x.done?"on":""}"><span class="ck">${x.done?"✓":""}</span><span>${esc(x.t)}</span><em>${x.done?"":x.c+"/"+x.g+" · "}+${x.r} xu</em></div>`).join("")}</div>` }

/* ================= vận may hôm nay (今日の運勢) — theo ngày sinh, chỉ để vui ================= */
const SIGNS=[["やぎ座","Ma Kết",1,19],["みずがめ座","Bảo Bình",2,18],["うお座","Song Ngư",3,20],["おひつじ座","Bạch Dương",4,19],["おうし座","Kim Ngưu",5,20],["ふたご座","Song Tử",6,21],["かに座","Cự Giải",7,22],["しし座","Sư Tử",8,22],["おとめ座","Xử Nữ",9,22],["てんびん座","Thiên Bình",10,23],["さそり座","Bọ Cạp",11,22],["いて座","Nhân Mã",12,21],["やぎ座","Ma Kết",12,31]];
const ETO=[["子","Tý"],["丑","Sửu"],["寅","Dần"],["卯","Mão"],["辰","Thìn"],["巳","Tỵ"],["午","Ngọ"],["未","Mùi"],["申","Thân"],["酉","Dậu"],["戌","Tuất"],["亥","Hợi"]];
const F_COL=[["赤","đỏ","#E33B2E"],["青","xanh dương","#2488CF"],["緑","xanh lá","#1FA64C"],["黄色","vàng","#F2B632"],["ピンク","hồng","#FF7F9B"],["紫","tím","#7C5CE0"],["白","trắng","#F4F4F4"],["オレンジ","cam","#FF8A1F"],["水色","xanh nhạt","#7FD0F0"],["茶色","nâu","#8A6B4A"]];
const F_STUDY=[["漢字","Kanji — hôm nay chữ Hán dễ vào đầu lắm"],["語彙","Từ vựng — học từ mới hôm nay sẽ nhớ lâu"],["文法","Ngữ pháp — thử chinh phục mẫu bạn hay nhầm"],["読解","Đọc hiểu — làm một đoạn văn thật chậm và kỹ"],["聴解","Nghe — bật một bài shadowing đi nào"],["復習","Ôn tập — dọn sạch câu đến hạn là đẹp nhất"],["模試","Thử sức — hợp để làm một đề ngắn bấm giờ"]];
const F_ADV={5:["Hôm nay là ngày của bạn! Việc khó nhất cứ làm trước, vận may đang đỡ lưng.","Sao chiếu rực rỡ: thử thách nào hôm nay cũng đáng để thử."],4:["Một ngày thuận lợi. Giữ nhịp đều là mọi thứ vào guồng.","May mắn đến từ việc bắt đầu sớm — làm nhiệm vụ đầu tiên ngay nhé."],
 3:["Ngày bình thường mà yên ổn. Chậm mà chắc, đừng bỏ buổi là thắng.","Không quá may cũng chẳng xui: kết quả hôm nay đúng bằng công sức bạn bỏ ra."],2:["Hơi lận đận một chút. Đọc kỹ đề hai lần, đừng vội.","Dễ mất tập trung hôm nay — tắt thông báo điện thoại 25 phút rồi học."],
 1:["Vận hơi thấp, nhưng học thì không cần may: ôn lại cái cũ cho chắc là đủ.","Hôm nay đừng ép mình quá. Xong nhiệm vụ rồi nghỉ sớm, mai sẽ khác."]};
function hash32(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619)>>>0 } return h }
function rng(seed){ let a=seed>>>0; return ()=>{ a=(a+0x6D2B79F5)>>>0; let t=a; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296 } }
function fortune(){
  const bd=RW().bd; if(!bd||!/^\d{4}-\d{2}-\d{2}$/.test(bd)) return null; const [y,mo,da]=bd.split("-").map(Number);
  const sg=SIGNS.find(s=>mo<s[2]||(mo===s[2]&&da<=s[3]))||SIGNS[0]; const eto=ETO[(((y-4)%12)+12)%12];
  const r=rng(hash32(bd+"|"+TODAY)); const star=()=>{ const x=r(); return x<0.1?1:x<0.3?2:x<0.62?3:x<0.88?4:5 };
  const all=star(), study=Math.max(1,Math.min(5,all+(r()<0.5?0:(r()<0.5?1:-1)))), money=star(), love=star();
  const col=F_COL[Math.floor(r()*F_COL.length)], num=1+Math.floor(r()*9), st=F_STUDY[Math.floor(r()*F_STUDY.length)], adv=F_ADV[all][Math.floor(r()*2)];
  const rank=[null,"凶 · Hung","末吉 · Mạt cát","吉 · Cát","中吉 · Trung cát","大吉 · Đại cát"][all];
  return {sg,eto,all,study,money,love,col,num,st,adv,rank,y,mo,da};
}
V.fortune=fortune;
const stars=n=>`<span class="v13-stars" aria-label="${n} trên 5 sao">${"★".repeat(n)}<i>${"★".repeat(5-n)}</i></span>`;
function fortuneOpen(edit){
  const f=fortune(); const r=RW();
  if(!f||edit){ return popup(`<div class="v13-pop">${bud("please")}<div class="eyebrow">今日の運勢 · Vận may hôm nay</div><h2>Bạn sinh ngày nào?</h2><p>${nm()} sẽ xem cung hoàng đạo, con giáp và vận may mỗi ngày cho bạn. Ngày sinh chỉ lưu trong dữ liệu học của bạn.</p>
    <div class="row"><input type="date" id="v13bd" min="1930-01-01" max="2020-12-31" value="${esc(r.bd||"")}" aria-label="Ngày sinh"><button class="btn primary" data-v13="bdsave">Xem vận may</button></div></div>`) }
  const d=D(); let gain=0; if(!d.fo){ d.fo=1; gain=earn(f.all>=4?4:2,"fortune") }
  const mood=f.all>=5?"sparkle":f.all>=4?"happy":f.all===3?"wave":f.all===2?"think":"please";
  popup(`<div class="v13-pop v13-fortune">${bud(mood)}<div class="eyebrow">今日の運勢 · ${new Date().toLocaleDateString("vi-VN")}</div><h2><span class="jp">${f.sg[0]}</span> ${f.sg[1]} · <span class="jp">${f.eto[0]}</span> tuổi ${f.eto[1]}</h2>
    <div class="v13-frank">${esc(f.rank)}</div>
    <div class="v13-ftable"><div><span>全体運 · Tổng quát</span>${stars(f.all)}</div><div><span>勉強運 · Học tập</span>${stars(f.study)}</div><div><span>金運 · Tài lộc (xu)</span>${stars(f.money)}</div><div><span>対人運 · Quan hệ</span>${stars(f.love)}</div></div>
    <p>${esc(f.adv)}</p>
    <div class="v13-fluck"><div><small>Màu may mắn</small><b><i style="background:${f.col[2]}"></i><span class="jp">${f.col[0]}</span> ${f.col[1]}</b></div><div><small>Số may mắn</small><b>${f.num}</b></div><div><small>Nên học hôm nay</small><b><span class="jp">${f.st[0]}</span></b></div></div>
    <p class="small">${esc(f.st[1])}.${f.money>=5?" Tài lộc 5 sao: hôm nay xu từ rương kho báu được <b>+10</b>!":""}${f.all>=5?" Đại cát: cơ hội rút quẻ 大吉 hôm nay tăng gấp đôi.":""}</p>
    ${gain?`<p class="v13-gain">+${gain} xu</p>`:""}<p class="small muted">Bói vui theo ngày sinh — kết quả học thì vẫn do bạn quyết định đó.${f.mo<=2?" (Sinh tháng 1–2 thì con giáp có thể thuộc năm trước theo âm lịch.)":""}</p>
    <div class="row"><button class="btn primary" data-kxclose>Đi học thôi!</button><button class="btn ghost small" data-v13="bdedit">Đổi ngày sinh</button></div></div>`,f.all>=5&&gain>0);
  refresh();
}

/* ================= cơ chế hằng ngày ================= */
const CI=[2,3,4,5,6,8,15];
function ciState(){ const c=RW().ci||{n:0,d:0}; const done=c.d===TODAY; const next=done?c.n:(c.d===TODAY-1?c.n%7+1:1); return {done,n:next} }
function ciClaim(){ const st=ciState(); if(st.done) return; const r=RW(); r.ci={n:st.n,d:TODAY}; let extra=""; if(st.n===7){ r.inv.ofuda=Math.min(30,(r.inv.ofuda||0)+1); extra=" + 1 bùa 50:50" }
  const got=earn(CI[st.n-1],"checkin"); coinSfx(); safe(()=>V12.say(`${J("出席！")} Điểm danh ngày ${st.n}/7: <b>+${got} xu</b>${extra}. ${st.n<7?`Mai quay lại nhận ${CI[st.n]} xu nhé!`:"Trọn 7 ngày rồi, giỏi quá!"}`,{mood:st.n===7?"sparkle":"happy"})); if(st.n===7) safe(()=>V12.confetti(30)); refresh(); checkAch() }
const OMI=[["大吉","Đại cát",8,20,"sparkle",["Hôm nay học gì cũng vào! Thử luôn dạng bài bạn ngại nhất đi.","Vận may rực rỡ: câu khó hôm nay sẽ thành câu dễ của ngày mai."]],
 ["中吉","Trung cát",20,12,"happy",["Một ngày thuận lợi. Làm xong nhiệm vụ sớm là còn thời gian chơi.","May mắn đang ở bên bạn — nhất là với phần từ vựng."]],
 ["小吉","Tiểu cát",27,8,"sing",["Chậm mà chắc. Đọc kỹ đề thêm một lần là ăn điểm.","Niềm vui nhỏ đang chờ: một từ bạn từng quên hôm nay sẽ nhớ lại."]],
 ["吉","Cát",25,6,"wave",["Ngày bình yên. Đều đặn chính là phép màu.","Cứ làm từng nhiệm vụ một, kết quả sẽ tự tới."]],
 ["末吉","Mạt cát",15,4,"think",["May mắn đến muộn — càng về cuối buổi học càng vào phom.","Kiên nhẫn một chút, phần thưởng ở phía sau."]],
 ["凶","Hung",5,2,"shock",["Ối! Nhưng đừng lo: làm thêm một nhiệm vụ là giải hạn ngay.","Quẻ xấu thì buộc lại ở đền thôi. Còn bạn chỉ cần ôn câu đến hạn là hết xui."]]];
function omiReady(){ const d=D(); if(d.omi) return "done"; const pr=V12.mission(); return (pr.done>=1||(d.ans||0)>=5)?"ready":"lock" }
const UNLUCKY=/mộ|chết|tang|bệnh|ốm|đau|tai nạn|thất bại|trượt|nợ|buồn|khổ|tội|giết|cháy|ma\b|quỷ|xấu|nghèo|mất|thua|lỗi|sai|hỏng|rác|bẩn|chiến tranh|động đất|bão|lũ|khóc|sợ|ghét|giận|nguy|hại|độc|cấm|phạt|trộm|cướp|thiệt|máu|vết thương|tử |tự sát|hoả hoạn|thảm|ác|lười|chán|mệt/i;
function luckyWord(){ return safe(()=>{ for(let k=0;k<80;k++){ const x=WD[Math.floor(Math.random()*WD.length)]; const e=DIC[x[0]]; if(x[6]===3&&e&&e[3]&&!UNLUCKY.test(e[3])) return e } return null },null) }
function omiDraw(){
  if(omiReady()!=="ready") return; const fo=fortune(); const dk=fo&&fo.all>=5?8:0; let t=Math.random()*(100+dk), o=OMI[OMI.length-1]; for(const x of OMI){ const w=x[2]+(x[0]==="大吉"?dk:0); if(t<w){o=x;break} t-=w }
  const d=D(); d.omi=o[0]; if(o[0]==="大吉") RW().fl.daikichi=1; const w=luckyWord();
  const b=popup(`<div class="v13-pop v13-omi"><div class="v13-omibox" aria-hidden="true"><i></i></div><div class="v13-omires" hidden>${bud(o[4])}<div class="eyebrow">おみくじ · Quẻ hôm nay</div><h2><span class="jp v13-omikj">${o[0]}</span> ${o[1]}</h2><p>${esc(pick(o[5]))}</p>
    ${w?`<div class="v13-lucky"><small>Từ may mắn hôm nay</small><b class="jp">${esc(w[0])}</b> <span class="jp">${esc(w[1]!==w[0]?w[1]:"")}</span><div>${esc(w[3])}</div></div>`:""}
    <p class="v13-gain">+<b id="v13omiGain">…</b> xu</p><div class="row"><button class="btn primary" data-kxclose>Nhận</button></div></div></div>`);
  setTimeout(()=>{ const got=earn(o[3],"omikuji"); const g=$("#v13omiGain",b); if(g) g.textContent=got; const bx=$(".v13-omibox",b), rs=$(".v13-omires",b); if(bx) bx.hidden=true; if(rs) rs.hidden=false; coinSfx(); if(o[0]==="大吉"){ safe(()=>V12.confetti(44)); safe(()=>V12.sfx.done()) } refresh(); checkAch() },1100);
}
function chestState(){ const d=D(); if(d.chest) return "done"; const pr=V12.mission(); return pr.total&&pr.all?"ready":"lock" }
function chestOpen(){
  if(chestState()!=="ready") return; const d=D(), r=RW(); d.chest=1; const fo=fortune(); const base=15+Math.floor(Math.random()*21)+(fo&&fo.money>=5?10:0); let extra=""; const t=Math.random();
  if(t<0.15&&(r.inv.omamori||0)<3){ r.inv.omamori=(r.inv.omamori||0)+1; extra=`<div class="v13-lucky"><small>Vật phẩm hiếm!</small><b>お守り · Bùa giữ chuỗi</b><div>Tự bảo vệ chuỗi ngày học khi bạn lỡ nghỉ.</div></div>` }
  else if(t<0.4){ r.inv.ofuda=Math.min(30,(r.inv.ofuda||0)+1); extra=`<div class="v13-lucky"><small>Kèm theo</small><b>お札 · 1 bùa 50:50</b></div>` }
  else if(t<0.6){ r.cd.fr=(r.cd.fr||0)+1; extra=`<div class="v13-lucky"><small>Kèm theo</small><b>戦士パック · 1 gói thẻ miễn phí</b></div>` }
  const got=earn(base,"chest"); const fl=flowers();
  popup(`<div class="v13-pop">${chestSVG(true)}<div class="eyebrow">宝箱 · Rương kho báu</div><h2>${J("お疲れ様！")} +${got} xu</h2><p>Bạn đã xong hết nhiệm vụ hôm nay. Một bông hoa mới vừa nở trong vườn — vườn đang có <b>${fl}</b> bông.</p>${extra}<div class="row"><button class="btn primary" data-v13="garden" data-kxclose>Ra vườn xem</button><button class="btn" data-kxclose>Đóng</button></div></div>`,true);
  refresh(); checkAch();
}
const chestSVG=open=>`<svg class="v13-chest${open?" open":""}" viewBox="0 0 80 70" aria-hidden="true"><ellipse cx="40" cy="64" rx="30" ry="4" fill="#000" opacity=".12"/>${open?`<g class="glow"><path d="M40,30 L16,2 M40,30 L40,-2 M40,30 L64,2 M40,30 L4,16 M40,30 L76,16" stroke="#FFD23F" stroke-width="3" stroke-linecap="round"/></g>`:""}<rect x="12" y="32" width="56" height="30" rx="5" fill="#B5682E" stroke="#7A4218" stroke-width="2.5"/><rect x="12" y="42" width="56" height="6" fill="#F2B632"/><g class="lid"><path d="M10,34 q0,-20 30,-20 q30,0 30,20z" fill="#C97B3A" stroke="#7A4218" stroke-width="2.5" stroke-linejoin="round"/><path d="M10,31 h60" stroke="#F2B632" stroke-width="5"/></g><rect x="34" y="36" width="12" height="14" rx="3" fill="#FFD23F" stroke="#B5820A" stroke-width="2"/><circle cx="40" cy="42" r="2" fill="#7A4218"/></svg>`;
const weekId=()=>Math.floor((TODAY+3)/7);
function weekState(){ const id=weekId(), st=id*7-3; const dd=S.daydone||{}; let n=0; const dots=[]; for(let d=st;d<st+7;d++){ const v=dd[d]; const ok=!!(v&&v[1]>0&&v[0]>=v[1]); if(ok) n++; dots.push(ok?2:d===TODAY?1:d<TODAY?0:-1) } const w=RW().wk; return {id,n,dots,goal:5,claimed:!!(w&&w.id===id&&w.c)} }
function weekClaim(){ const w=weekState(); if(w.claimed||w.n<w.goal) return; RW().wk={id:w.id,c:1}; const got=earn(50,"week"); RW().cd.fg=(RW().cd.fg||0)+1; popup(`<div class="v13-pop">${bud("proud")}<div class="eyebrow">Thử thách tuần</div><h2>${J("達成！")} +${got} xu</h2><p>Tuần này bạn đã xong hết nhiệm vụ ${w.n} ngày. Đây chính là nhịp học của người sẽ đỗ đó!</p><div class="row"><button class="btn primary" data-kxclose>Tuyệt!</button></div></div>`,true); refresh() }

/* ================= thành tích ================= */
function stats(){ const r=RW(); let ok=0; S.hist.forEach(h=>(h.items||[]).forEach(x=>{ if(x[1]) ok++ })); r.okAll=Math.max(r.okAll||0,ok); const p=PLs();
  return {ok:r.okAll,st:safe(()=>streak(),0),best:r.best||0,perf:r.perf||0,full:flowers(),words:safe(()=>vocabStats().learned,0),
    gd:SHOP.filter(x=>x.cat==="place"&&owned(x.id)).length,acc:SHOP.filter(x=>x.cat==="acc"&&owned(x.id)).length,mock:S.hist.some(h=>h.mode==="exam"&&safe(()=>mockPass(h),false)),n2:!!(S.n2&&S.n2.on),fl:r.fl,lv:bond().lv,boss:r.bossN||0,
    loc:WL.ORDER.filter(locOwned).length,pets:Object.keys(r.pets).filter(id=>owned("pet:"+id)).length,plv:Math.max(0,...Object.values(r.pets).map(p=>petLv(p.x||0))),cards:Object.values(r.cd.c).filter(n=>n>0).length,ssr:A.CARDS.filter(c=>c.r===3&&r.cd.c[c.id]>0).length,holo:Object.values(r.cd.c).filter(n=>n>=3).length,dex:PL.ORDER.filter(sp=>p.dex[sp]).length,hv:p.hv,land:p.n,mem:Math.max(0,...Object.values(r.mem||{}).map(a=>a.length))} }
const ACH=[
 ["ok10","初めの一歩","Bước đầu tiên","Trả lời đúng 10 câu",10,s=>s.ok>=10],["ok500","五百問","500 câu đúng","Trả lời đúng 500 câu",60,s=>s.ok>=500],["ok2000","二千問","2.000 câu đúng","Trả lời đúng 2.000 câu",200,s=>s.ok>=2000],["ok5000","五千問","5.000 câu đúng","Trả lời đúng 5.000 câu",500,s=>s.ok>=5000],
 ["cb10","コンボ10","Combo 10","10 câu đúng liên tiếp",20,s=>s.best>=10],["cb20","コンボ20","Combo 20","20 câu đúng liên tiếp",60,s=>s.best>=20],["perf","百発百中","Trăm phát trăm trúng","Một bài ≥ 10 câu đúng hết",30,s=>s.perf>=1],
 ["s4","三日坊主卒業","Hết “cả thèm chóng chán”","Chuỗi 4 ngày học liên tiếp",20,s=>s.st>=4],["s7","一週間","Một tuần bền bỉ","Chuỗi 7 ngày",40,s=>s.st>=7],["s14","二週間","Hai tuần không nghỉ","Chuỗi 14 ngày",80,s=>s.st>=14],
 ["s30","一か月","Tròn một tháng","Chuỗi 30 ngày",200,s=>s.st>=30],["s60","二か月","Hai tháng thép","Chuỗi 60 ngày",400,s=>s.st>=60],["s100","百日","Trăm ngày","Chuỗi 100 ngày",600,s=>s.st>=100],
 ["f10","皆勤","Chuyên cần","10 ngày xong hết nhiệm vụ",80,s=>s.full>=10],["f30","皆勤賞","Giải chuyên cần","30 ngày xong hết nhiệm vụ",250,s=>s.full>=30],["mem20","森の番人","Người giữ rừng","Một tháng có 20 cây kỷ niệm",200,s=>s.mem>=20],
 ["w300","語彙300","300 từ đã thuộc","Thuộc 300 từ vựng",60,s=>s.words>=300],["w1000","語彙1000","1.000 từ đã thuộc","Thuộc 1.000 từ vựng",200,s=>s.words>=1000],
 ["early","早起き","Chim sớm","Học trước 7 giờ sáng",15,s=>!!s.fl.early],["night","夜更かし","Cú đêm","Học sau 11 giờ đêm",15,s=>!!s.fl.night],["daikichi","大吉","Đại cát","Rút được quẻ 大吉",30,s=>!!s.fl.daikichi],
 ["gd5","飾り好き","Thích trang trí","Có 5 món trang trí",30,s=>s.gd>=5],["gd20","コレクター","Nhà sưu tầm","Có 20 món trang trí",150,s=>s.gd>=20],["gd50","大コレクター","Đại sưu tầm","Có 50 món trang trí",400,s=>s.gd>=50],
 ["loc2","初旅行","Chuyến đi đầu tiên","Mở địa điểm thứ 2",50,s=>s.loc>=2],["loc4","旅人","Lữ khách","Mở 4 địa điểm",150,s=>s.loc>=4],["loc6","旅の達人","Bậc thầy du lịch","Mở 6 địa điểm",400,s=>s.loc>=6],["locall","日本一周","Vòng quanh Nhật Bản","Mở tất cả "+WL.ORDER.length+" địa điểm",800,s=>s.loc>=WL.ORDER.length],
 ["dex1","初開花","Bông hoa đầu tiên","Trồng một cây ra hoa",20,s=>s.dex>=1],["dex8","植物好き","Yêu cây cỏ","8 loài ra hoa",120,s=>s.dex>=8],["dexall","植物博士","Tiến sĩ thực vật","Hoàn thành Sổ thực vật",500,s=>s.dex>=PL.ORDER.length],
 ["hv50","収穫祭","Lễ hội mùa màng","Thu hoạch 50 lần",100,s=>s.hv>=50],["land6","大農園","Đại nông trại","Mở rộng đảo cây 6×6",150,s=>s.land>=6],
 ["acc3","おしゃれ","Sành điệu","Có 3 phụ kiện",30,s=>s.acc>=3],["acc10","ファッショニスタ","Tín đồ thời trang","Có 10 phụ kiện",150,s=>s.acc>=10],
 ["pet1","初めてのペット","Bạn nhỏ đầu tiên","Nuôi thú cưng đầu tiên",30,s=>s.pets>=1],["pet5","動物好き","Yêu động vật","Nuôi 5 thú cưng",120,s=>s.pets>=5],["pet10","動物園","Vườn thú mini","Nuôi 10 thú cưng",300,s=>s.pets>=10],["petlv10","最高の相棒","Thân nhất trần đời","Một thú cưng đạt cấp 10",200,s=>s.plv>=10],
 ["card10","カード集め","Nhà sưu tầm thẻ","Có 10 thẻ khác nhau",50,s=>s.cards>=10],["card30","カードマスター","Bậc thầy thẻ bài","Có 30 thẻ khác nhau",200,s=>s.cards>=30],["cardall","漢字戦士全集","Trọn bộ Chiến binh Kanji","Đủ cả 48 thẻ",600,s=>s.cards>=A.CARDS.length],["ssr1","覇者降臨","Thẻ SSR đầu tiên","Mở được một thẻ SSR",100,s=>s.ssr>=1],["holo1","キラキラ","Lấp lánh","Có một thẻ HOLO (3 bản giống nhau)",60,s=>s.holo>=1],["boss1","妖怪退治","Diệt yêu quái","Hạ yêu quái tuần lần đầu",40,s=>s.boss>=1],["boss4","妖怪ハンター","Thợ săn yêu quái","Hạ 4 yêu quái tuần",150,s=>s.boss>=4],
 ["lv10","相棒","Cộng sự","Độ thân thiết cấp 10",100,s=>s.lv>=10],["mock","模試合格","Đỗ thi thử","Đỗ một đề thi thử",100,s=>s.mock],["n2","N2への扉","Cánh cửa N2","Mở khoá nội dung N2",100,s=>s.n2]
];
function checkAch(){
  if(safe(()=>V12.inFocus(),false)) return; // đang làm bài: để lúc xem kết quả / về trang chính mới báo
  const r=RW(); const st=stats(); const got=[]; ACH.forEach(a=>{ if(!r.ach[a[0]]&&safe(()=>a[5](st),false)){ r.ach[a[0]]=TODAY; got.push(a) } });
  if(!got.length) return; let sum=0; got.forEach(a=>sum+=earn(a[4],"ach"));
  if(got.length===1&&got[0][4]<100){ const a=got[0]; safe(()=>V12.say(`🏅 Thành tích mới: <b>${J(a[1])} ${esc(a[2])}</b> — +${sum} xu`,{mood:"proud",ms:7000})) }
  else whenIdle(()=>popup(`<div class="v13-pop">${bud("sparkle")}<div class="eyebrow">Thành tích mới</div><h2>+${sum} xu</h2>${got.map(a=>`<div class="v13-achrow on"><span class="jp">${a[1]}</span><b>${esc(a[2])}</b><small>${esc(a[3])}</small></div>`).join("")}<div class="row"><button class="btn primary" data-kxclose>やった！</button></div></div>`,true));
  if(view==="garden") refresh();
}
V.checkAch=checkAch;

/* ================= phụ kiện · theme · hiệu ứng ================= */
V.accSVG=kind=>{ const e=RW().eq; const ids=[e.head,e.face,e.neck].filter(id=>id&&owned("a:"+id)); return ids.length?A.accSVG(kind,ids):"" };
V.applyTheme=function(){ const t=RW().eq.theme; if(t&&owned("t:"+t)) root.dataset.v13theme=t; else delete root.dataset.v13theme };
V.confetti=function(n){
  const fx=RW().eq.fx; if(!fx||!owned("f:"+fx)) return false;
  const box=document.createElement("div"); box.className="v12-confetti v13-fx-"+fx; const cols=fx==="sakura"?["#FFB7CE","#FF9DBB","#FFD3E0","#FF7FA8"]:fx==="hoshi"?["#FFD23F","#FFF3B0","#7FD0F0","#FF9DBB","#B79CFF"]:["#FFC93C","#F2B632","#FFE27A"];
  for(let i=0;i<(n||36);i++){ const p=document.createElement("i"); p.style.cssText=`left:${Math.random()*100}%;background:${cols[i%cols.length]};--dx:${(Math.random()*200-100).toFixed(0)}px;--rot:${(Math.random()*900-200).toFixed(0)}deg;--t:${(1.6+Math.random()*1.4).toFixed(2)}s;animation-delay:${(Math.random()*0.4).toFixed(2)}s`; box.appendChild(p) }
  document.body.appendChild(box); setTimeout(()=>box.remove(),3600); return true;
};
const titleNow=()=>{ const t=RW().eq.title; const it=t&&SHOP_BY["ti:"+t]; return it&&owned(it.id)?it.v:"" };

/* ================= dạy học: mẹo, bài học nhỏ, kế hoạch để đỗ ================= */
const TS={i:TODAY%Math.max(1,TP.TIPS.length),n:TODAY%Math.max(1,TP.NUG.length)};
const TIP_K={all:"Luật chơi",time:"Phân bổ giờ",vocab:"Từ vựng",gram:"Ngữ pháp",read:"Đọc hiểu",listen:"Nghe",study:"Cách học",day:"Ngày thi",n2:"N2"};
function tipHTML(step){ if(!TP.TIPS.length) return ""; const n2=!!(S.n2&&S.n2.on); if(step) TS.i=(TS.i+step+TP.TIPS.length)%TP.TIPS.length; for(let k=0;k<TP.TIPS.length&&TP.TIPS[TS.i].k==="n2"&&!n2;k++) TS.i=(TS.i+1)%TP.TIPS.length; const t=TP.TIPS[TS.i]; return `<span class="chip">${esc(TIP_K[t.k]||"Mẹo")}</span> ${t.t}` }
function nugHTML(step){ if(!TP.NUG.length) return ""; if(step) TS.n=(TS.n+step)%TP.NUG.length; return TP.NUG[TS.n] }
function passPlan(){
  const R=safe(()=>levelReady(),null); if(!R) return "Mình chưa đủ dữ liệu để lập kế hoạch. Làm vài bài luyện rồi hỏi lại mình nhé!";
  const days=safe(()=>Math.max(0,Math.round(dayNum(EXAM)-TODAY)),0); const rd=Math.round(Math.min(1,R.r[3]/0.75)*100);
  const parts=[["Từ vựng N5→N3",R.v3.cov,"vocab","Học từ hôm nay","Từ vựng đang kéo điểm xuống nhiều nhất. Mỗi ngày học đủ từ mới + ôn từ đến hạn; dùng “Quét nhanh” để đánh dấu từ đã biết."],
    ["Ngữ pháp N3",R.g3.s,"adaptive","Luyện thích ứng 20 câu","Ngữ pháp N3 còn nhiều mẫu chưa gặp hoặc hay sai. Làm “Bài học mới” đều mỗi ngày và xem thẻ kiến thức sau mỗi câu sai."],
    ["Đọc – nghe N3",R.r3.s,"listen","Luyện nghe","Bạn chưa làm đủ bài đọc / nghe để quen tốc độ. Mỗi ngày 1 đoạn đọc + 2 câu nghe, cuối tuần 1 đề bấm giờ."]];
  const weak=parts.slice().sort((a,b)=>a[1]-b[1])[0];
  const phase=days>120?"Giai đoạn <b>xây nền</b>: ưu tiên bài học mới + từ vựng, mỗi tuần 1 buổi đọc – nghe.":days>30?"Giai đoạn <b>tăng tốc</b>: giữ nhiệm vụ hằng ngày, mỗi tuần thêm 1 đề thi thử bấm giờ và sửa hết câu sai.":days>0?"Giai đoạn <b>nước rút</b>: không học kiến thức mới; làm đề bấm giờ, ôn sổ lỗi sai, ngủ đủ.":"Kỳ thi đã tới hoặc đã qua — đặt lại mục tiêu ở tab Lộ trình nhé.";
  return `<b>Kế hoạch để đỗ N3</b> — còn <b>${days}</b> ngày.<div class="v13-plan">${parts.map(p=>`<div><span>${esc(p[0])}</span><i><u style="width:${Math.round(Math.min(1,p[1])*100)}%"></u></i><b>${Math.round(Math.min(1,p[1])*100)}%</b></div>`).join("")}</div>
  Mức sẵn sàng N3 hiện tại: <b>${rd}%</b> của mốc “chắc N3”. ${phase}<br><b>Nên dồn sức vào: ${esc(weak[0])}.</b> ${esc(weak[4])}<br><span class="small muted">Nhớ luật đỗ: tổng ≥ 95/180 và mỗi phần ≥ 19/60.</span>
  <div class="v12-quick" style="margin-top:8px"><button type="button" class="go" data-co="${weak[2]}">${esc(weak[3])}</button><button type="button" data-co="adaptive">Luyện thích ứng</button><button type="button" data-v13="tipmsg">Mẹo thi JLPT</button></div>`;
}
V.passPlan=passPlan;
function teachMsg(kind,step){ const m=V12.msg; if(!m) return; if(kind==="tip") m("b",`<b>Mẹo thi JLPT</b><br>${tipHTML(step)}<div class="v12-quick" style="margin-top:8px"><button type="button" data-v13="tipmsg">Mẹo khác</button><button type="button" data-v13="planmsg">Kế hoạch để đỗ</button></div>`,"explain");
  else if(kind==="nug") m("b",`<b>Bạn có biết?</b><br>${nugHTML(step)}<div class="v12-quick" style="margin-top:8px"><button type="button" data-v13="nugmsg">Dạy mình điều khác</button></div>`,pick(["explain","proud","sing"]));
  else m("b",passPlan(),"cheer") }

/* ================= trang Hôm nay: thẻ thưởng mỗi ngày + góc học ================= */
function dailyHTML(){
  const r=RW(), b=bond(), ci=ciState(), om=omiReady(), ch=chestState(), wk=weekState(), pr=V12.mission(), d=D();
  const tile=(act,ready,done,ic,t,s)=>`<button type="button" class="v13-tile ${done?"done":ready?"ready":"lock"}" ${ready&&!done?`data-v13="${act}"`:"disabled"}><span class="ic">${ic}</span><b>${t}</b><small>${s}</small></button>`;
  return `<div class="v13-dhead"><button type="button" class="v13-thumb" data-v13="garden" aria-label="Mở vườn và thế giới">${gardenHTML()}</button>
    <div class="v13-dinfo"><div class="v13-bal">${A.coin(26)}<b>${r.c}</b><span>xu${r.dbl===TODAY?' · <i class="x2">×2 hôm nay</i>':""}${d.e?` · hôm nay +${d.e}`:""}</span></div>
      <div class="v13-bond" title="Độ thân thiết tăng theo tổng số xu bạn kiếm được"><span>絆 Thân thiết cấp <b>${b.lv}</b> · ${esc(bondName(b.lv).split(" · ")[1])}</span><i><u style="width:${Math.round(b.p*100)}%"></u></i></div>
      <button type="button" class="btn small" data-v13="garden">Vườn &amp; cửa hàng</button></div></div>
  <div class="v13-tiles">
    ${tile("ci",!ci.done,ci.done,"📅",ci.done?`Đã điểm danh ${ci.n}/7`:`Điểm danh ngày ${ci.n}/7`,ci.done?(ci.n<7?`Mai: +${CI[ci.n]} xu`:"Mai bắt đầu vòng mới"):`Nhận +${CI[ci.n-1]} xu`)}
    ${tile("omi",om==="ready",om==="done","🎋",om==="done"?`Quẻ hôm nay: ${d.omi}`:"Rút quẻ おみくじ",om==="done"?"Mai rút quẻ mới":om==="ready"?"May mắn hôm nay thế nào?":"Xong 1 nhiệm vụ để rút")}
    ${(()=>{ const f=fortune(); return `<button type="button" class="v13-tile ${f&&d.fo?"done":"ready"}" data-v13="fortune"><span class="ic">🔮</span><b>${f&&d.fo?`${f.sg[1]}: ${"★".repeat(f.all)}`:"Vận may hôm nay"}</b><small>${f&&d.fo?esc(f.rank.split(" · ")[1])+" · xem lại":f?"Xem 今日の運勢 (+xu)":"Nhập ngày sinh để xem"}</small></button>` })()}
    ${tile("chest",ch==="ready",ch==="done",chestSVG(ch==="done"),ch==="done"?"Đã mở rương":"Rương kho báu",ch==="done"?"Mai lại có rương mới":ch==="ready"?"Bấm để mở!":`Xong ${pr.done}/${pr.total} nhiệm vụ để mở`)}
  </div>
  ${(()=>{ const pl=Object.keys(PLs().t).map(plantState).filter(Boolean), rd=pl.filter(x=>x.ready).length; return `<button type="button" class="v14-farmline" data-v13="garden"><span>🌱</span><span>${pl.length?`Đảo cây: ${pl.length} cây${rd?` · <b>${rd} cây chờ thu hoạch</b>`:""}${wilted()?` · <b style="color:var(--bad)">cây đang héo</b>`:""} · hôm nay +${D().gw||0} điểm lớn`:"Mua hạt giống và trồng cây — mỗi câu đúng là một lần tưới!"}</span><span>›</span></button>` })()}
  ${questsHTML()}
  ${bossHTML()}
  <div class="v13-week"><span>Thử thách tuần: xong hết nhiệm vụ <b>${Math.min(wk.n,wk.goal)}/${wk.goal}</b> ngày</span><span class="dots">${wk.dots.map(x=>`<i class="${x===2?"on":x===1?"now":x===0?"miss":""}"></i>`).join("")}</span>${wk.claimed?`<span class="chip ok">Đã nhận 50 xu</span>`:wk.n>=wk.goal?`<button type="button" class="btn small primary" data-v13="week">Nhận 50 xu</button>`:`<span class="small muted">Thưởng 50 xu</span>`}</div>`;
}
function cornerHTML(){ return `<span class="v13-cava">${bud("explain",{bust:1})}</span><div class="v13-cbody"><div class="eyebrow">Học cùng ${nm()} · Mẹo đỗ JLPT hôm nay</div><p id="v13tip">${tipHTML(0)}</p>
  <div class="v12-quick"><button type="button" data-v13="tipnext">Mẹo khác</button><button type="button" data-v13="nug">Bạn có biết?</button><button type="button" class="go" data-v13="plan">Kế hoạch để đỗ</button></div></div>` }
function decorateToday(m){
  const hero=$(".v12-hero",m); if(!hero) return; let d=$(".v13-daily",m);
  if(!d){ d=document.createElement("section"); d.className="sheet v13-daily"; const mis=$("section.mis",m); (mis||hero).after(d); const c=document.createElement("section"); c.className="sheet v13-corner"; c.innerHTML=cornerHTML(); d.after(c) }
  d.innerHTML=dailyHTML();
}

/* ================= trang Vườn & thế giới ================= */
const GV={tab:"shop",cat:"place",mood:"wave",sel:null,ploc:null};
const GARDEN_SAY=["Hôm nay mình đi đâu chơi tiếp nhỉ?","Mỗi câu bạn làm đúng là cây trong vườn lại lớn thêm một chút đó!","Mình thích đi cùng bạn lắm.","Tích thêm xu là mình đi được chỗ mới rồi!","えへへ、ありがとう！","Bấm vào mình nữa đi, mình còn nhiều biểu cảm lắm~","Học đều mỗi ngày thì đảo kỷ niệm sẽ kín cây luôn!"];
const LOC_SAY={niwa:"Về nhà vẫn là thích nhất~",tokyo:"東京だ！ Phố đông vui ghê!",kyoto:"京都、きれい… Yên bình quá.",kamakura:"海だ〜！ Gió biển mát ghê.",onsen:"温泉、気持ちいい〜 Ngâm mình thôi!",odaiba:"お台場！ Tối nay xem pháo hoa nha!",nikko:"日光の紅葉、すごい… Lá đỏ rực cả núi luôn!",osaka:"大阪や！ Đi ăn takoyaki liền đi~",hokkaido:"北海道、寒い！ Nhưng kem sữa ngon xỉu~",miyajima:"鳥居が海に浮かんでる… Đẹp như tranh!",okinawa:"沖縄、めっちゃ青い！ Biển xanh quá trời!"};
function itemState(x){ const r=RW(); const n=r.inv[x.id]||0;
  if(x.cat==="charm"||x.kind==="hiryo"||x.kind==="snack") return {have:n,canBuy:n<(x.max||9)};
  if(x.kind==="pack") return {have:0,canBuy:true};
  if(x.kind==="pet"&&!n){ const q=petReq(x); return {have:0,canBuy:q.ok,preq:q} }
  if(x.kind==="seed") return {have:PLs().seed[x.v]||0,canBuy:(PLs().seed[x.v]||0)<9};
  if(x.kind==="gacha") return {have:0,canBuy:true};
  if(x.kind==="land"){ const N=PLs().n; return {have:0,canBuy:N<6,next:N+1,price:LAND_P[N+1]} }
  if(!n){ if(x.kind==="loc"){ const q=locReq(x.v); return {have:0,canBuy:q.ok,req:q} } if(x.cat==="place"&&!locOwned(x.loc)) return {have:0,canBuy:false,lock:1}; return {have:0,canBuy:!x.need||owned(x.need)} }
  let on=false; if(x.kind==="loc") on=curLoc()===x.v; else if(x.kind==="season") on=scS().s===x.v; else if(x.kind==="time") on=scS().t===x.v; else if(x.cat==="place") on=!r.off[x.id]; else if(x.acc) on=r.eq[A.ACC[x.acc].slot]===x.acc; else if(x.kind) on=r.eq[x.kind]===(x.kind==="title"?x.id.slice(3):x.v);
  return {have:1,on} }
const priceOf=x=>x.kind==="land"?(LAND_P[PLs().n+1]||0):x.p;
function itemPreview(x){
  if(x.cat==="place") return WL.itemPreview(x.loc,x.key);
  if(x.kind==="loc") return `<span class="v14-locprev">${WL.locThumb(x.v,"haru","hiru")}</span>`;
  if(x.kind==="season") return WL.seasonChip(x.v); if(x.kind==="time") return WL.skyChip(x.v);
  if(x.kind==="seed") return PL.plantCard(x.v,PL.finalStage(x.v)); if(x.kind==="hiryo") return A.CHARM.hiryo; if(x.kind==="gacha") return A.CHARM.fuku;
  if(x.kind==="land") return PL.islandSVG({n:Math.min(6,PLs().n+1),season:"haru",tiles:[],empty:true});
  if(x.kind==="pet") return A.petSVG(x.v,{lv:(RW().pets[x.v]&&petLv(RW().pets[x.v].x))||0}); if(x.kind==="snack") return A.CHARM.oyatsu; if(x.kind==="pack") return A.packSVG(x.gold);
  if(x.acc) return A.accPreview(x.acc); if(x.cat==="charm") return A.CHARM[x.id]||"";
  if(x.kind==="theme") return `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="20" fill="${x.c}"/><path d="M24,4 a20,20 0 0 1 0,40z" fill="#fff" opacity=".28"/></svg>`;
  if(x.kind==="fx") return `<span class="v13-fxprev v13-fx-${x.v}"><i></i><i></i><i></i></span>`;
  return `<span class="jp v13-tiprev">${esc(x.jp)}</span>`;
}
const priceBtn=(x,can)=>`<button type="button" class="btn small ${can?"primary":""}" data-v13="buy:${x.id}" ${can?"":"disabled"}>${A.coin(15)} ${priceOf(x).toLocaleString("vi-VN")}</button>`;
function cardHTML(x){
  const r=RW(), st=itemState(x), pr=priceOf(x), can=r.c>=pr&&st.canBuy; let act, sub=x.jp, note=x.d||"";
  if(x.kind==="seed"){ const s=PL.SP[x.v]; sub=`${x.jp}・${s.r}`; note=`Ra hoa sau ~${s.g} điểm lớn${s.y?` · thu hoạch +${s.y} xu mỗi lứa`:" · cây cảnh"}.`; act=`${st.have?`<span class="chip ok">Đang có ${st.have}</span>`:""}${st.canBuy?priceBtn(x,can):`<span class="small muted">Túi đã đầy (9)</span>`}` }
  else if(x.kind==="land"){ if(!st.canBuy){ note="Đảo đã rộng tối đa 6×6."; act="" } else { note=`Đảo hiện ${PLs().n}×${PLs().n} → ${st.next}×${st.next}: thêm ${st.next*st.next-PLs().n**2} ô trồng cây.`; act=priceBtn(x,can) } }
  else if(x.kind==="pack"){ const cd=RW().cd, fr=x.gold?(cd.fg||0):(cd.fr||0); act=`${fr?`<button type="button" class="btn small" data-v13="pfree:${x.gold?1:0}">Mở miễn phí ×${fr}</button>`:""}${priceBtn(x,can)}`; note=x.d+(x.gold?"":` Còn ${Math.max(1,PITY-(cd.pity||0))} gói nữa chắc chắn ra SSR.`) }
  else if(x.kind==="gacha"||x.kind==="hiryo"||x.kind==="snack"||x.cat==="charm") act=`${st.have?`<span class="chip ok">Đang có ${st.have}</span>`:""}${x.id==="maneki"&&st.have?(r.dbl===TODAY?`<span class="chip warn">×2 đang bật</span>`:`<button type="button" class="btn small" data-v13="use:maneki">Dùng</button>`):""}${st.canBuy?priceBtn(x,can):`<span class="small muted">Đã đủ</span>`}`;
  else if(!st.have&&x.kind==="pet"){ const P=A.PETS[x.v]; note=P.say; act=st.canBuy?priceBtn(x,can):`<span class="small muted">🔒 ${st.preq.c?`Cần sưu tầm ${st.preq.c} thẻ (đang có ${st.preq.have})`:`Cần nuôi ${st.preq.p} thú cưng (đang có ${st.preq.have})`}</span>` }
  else if(x.kind==="pet"){ const ps=RW().pets[x.v]||{x:0}; note=`Cấp ${petLv(ps.x)} · ${esc(petMoodVi(x.v))}`; act=`<button type="button" class="btn small ${st.on?"on":""}" data-v13="eq:${x.id}" aria-pressed="${st.on}">${st.on?"✓ Đang đi cùng":"Dẫn theo"}</button>` }
  else if(!st.have){ if(st.lock) act=`<span class="small muted">🔒 Cần vé tới ${esc(WL.LOCS[x.loc].n)}</span>`; else if(x.kind==="loc"&&!st.req.ok) act=`<span class="small muted">🔒 Cần ${st.req.c} món ở ${esc(WL.LOCS[st.req.pl].n)} (đang có ${st.req.have})</span>`; else if(!st.canBuy) act=`<span class="small muted">Cần ${esc(SHOP_BY[x.need].n)} trước</span>`; else act=priceBtn(x,can) }
  else if(x.kind==="loc") act=`<button type="button" class="btn small ${st.on?"on":""}" data-v13="loc:${x.v}">${st.on?"✓ Đang ở đây":"Đi tới"}</button>`;
  else act=`<button type="button" class="btn small ${st.on?"on":""}" data-v13="eq:${x.id}" aria-pressed="${st.on}">${st.on?(x.cat==="place"?"✓ Đang bày":"✓ Đang dùng"):(x.cat==="place"?"Bày ra":"Dùng")}</button>`;
  return `<div class="v13-item ${st.have&&x.kind!=="seed"?"own":""} ${!st.have&&!can&&st.canBuy!==false?"poor":""} ${x.kind==="loc"?"wide":""}"><div class="pv ${x.cat}${x.kind?" k-"+x.kind:""}${x.cat==="place"?" l-"+x.loc:""}">${itemPreview(x)}</div><b>${esc(x.n)}</b><small class="jp">${esc(sub)}</small>${note?`<p>${esc(note)}</p>`:""}<div class="acts">${act}</div></div>`;
}
function shopHTML(){
  let list=SHOP.filter(x=>x.cat===GV.cat), head="";
  if(GV.cat==="place"){ const L=GV.ploc||curLoc(); list=list.filter(x=>x.loc===L);
    head=`<div class="v13-cats v14-sub">${WL.ORDER.map(l=>`<button type="button" aria-selected="${l===L}" data-v13="ploc:${l}">${locOwned(l)?"":"🔒 "}<span class="jp">${WL.LOCS[l].jp}</span>${esc(WL.LOCS[l].n)} <small>${placeOwned(l).length}/${Object.keys(WL.ITEMS[l]).length}</small></button>`).join("")}</div>`+(locOwned(L)?"":`<p class="small muted" style="margin:0 0 10px">Mua vé ở mục <b>Du lịch & mùa</b> để tới ${esc(WL.LOCS[L].n)}; xem trước đồ ở đây nhé.</p>`) }
  const note={acc:`Đeo cùng lúc tối đa 1 món trên đầu, 1 món trên mặt và 1 món ở cổ. Phụ kiện hiện ở mọi nơi ${nm()} xuất hiện.`,look:`Màu giao diện, kiểu pháo giấy khi bạn làm tốt, và danh hiệu hiện cạnh tên ${nm()}.`,
    seed:"Mua hạt rồi gieo trên đảo cây bên trên. Cây chỉ lớn khi bạn học: mỗi câu đúng +1, câu sai +0,3, mỗi từ nhớ được +0,4, xong hết nhiệm vụ trong ngày +25. Cây ra hoa / kết trái thì thu hoạch được xu.",
    trip:"Mỗi địa điểm mở khi bạn đã có đủ 5 món trang trí ở địa điểm trước. Mùa và giờ mặc định chạy theo lịch thật; mua để giữ cố định mùa / giờ bạn thích.",
    place:"Món đã mua tự xuất hiện ở địa điểm đó; bấm “Đang bày” để cất đi."}[GV.cat]||"";
  return `<div class="v13-cats" role="tablist">${CATS.map(([k,l,j])=>`<button type="button" role="tab" aria-selected="${GV.cat===k}" data-v13="cat:${k}"><span class="jp">${j}</span>${l}</button>`).join("")}</div>${head}${note?`<p class="small muted" style="margin:0 0 10px">${note}</p>`:""}<div class="v13-grid">${list.map(cardHTML).join("")}</div>`;
}
function dexHTML(){ const p=PLs(), sps=PL.ORDER, n=sps.filter(sp=>p.dex[sp]).length;
  return `<p class="small muted" style="margin:0 0 10px">Sổ thực vật 植物図鑑: đã trồng ra hoa <b>${n}/${sps.length}</b> loài. Tên cây cũng là từ vựng — đọc to tên tiếng Nhật mỗi lần hái nhé. Đã thu hoạch tổng cộng <b>${p.hv}</b> lần.</p><div class="v14-dex">${sps.map(sp=>{ const s=PL.SP[sp], got=!!p.dex[sp]; return `<div class="v14-dexc ${got?"on":""}">${PL.plantCard(sp,got?PL.finalStage(sp):3)}<b class="jp">${got?s.jp:"？？"}</b><small>${got?`${s.r} · ${esc(s.n)}`:s.rare?"Hạt hiếm (túi phúc)":esc(s.n)}</small>${got&&p.fr[sp]?`<em>đã hái ${p.fr[sp]} lần</em>`:""}</div>` }).join("")}</div>` }
function achHTML(){ const r=RW(); const n=ACH.filter(a=>r.ach[a[0]]).length;
  return `<p class="small muted" style="margin:0 0 10px">Đã đạt <b>${n}/${ACH.length}</b> thành tích. Mỗi thành tích thưởng xu một lần.</p><div class="v13-achs">${ACH.map(a=>`<div class="v13-achrow ${r.ach[a[0]]?"on":""}"><span class="jp">${a[1]}</span><b>${esc(a[2])}</b><small>${esc(a[3])}</small><em>${r.ach[a[0]]?"✓":""} ${A.coin(14)} ${a[4]}</em></div>`).join("")}</div>` }
function moodsHTML(){ return `<p class="small muted" style="margin:0 0 10px">${nm()} có <b>${V12.moods.length}</b> biểu cảm, tất cả đều có sẵn — bạn sẽ gặp chúng khi học (combo, sửa được câu từng sai, rút quẻ, mở rương…). Bấm để xem thử.</p><div class="v13-moods">${V12.moods.map(m=>`<button type="button" data-v13="mood:${m}" class="${GV.mood===m?"on":""}">${bud(m,{bust:1})}<span>${esc((V12.moodVi||{})[m]||m)}</span></button>`).join("")}</div>` }
function howHTML(){ const d=D(); const L={ans:"Trả lời đúng",vocab:"Học từ vựng",bonus:"Thưởng kết quả bài",checkin:"Điểm danh",omikuji:"Rút quẻ",chest:"Rương kho báu",week:"Thử thách tuần",ach:"Thành tích",game:"Trò chơi",n2:"Mở N2",fortune:"Xem vận may",quest:"Thử thách ngày",boss:"Hạ yêu quái",harvest:"Thu hoạch"};
  return `<div class="tablewrap"><table class="kbtable"><thead><tr><th>Việc bạn làm</th><th class="nw">Xu</th></tr></thead><tbody>
  <tr><td>Trả lời đúng một câu — không giới hạn (câu từng sai nay đúng: thêm 1)</td><td class="nw">+1</td></tr><tr><td>Combo 3 · 5 · 7 · 10 · 15 · 20 · 30 câu đúng liên tiếp</td><td class="nw">+1 … +8</td></tr>
  <tr><td>Nhớ được 5 từ vựng — không giới hạn</td><td class="nw">+1</td></tr><tr><td>Bài ≥ 8 câu đúng từ 70% / từ 90%</td><td class="nw">+2 / +5</td></tr><tr><td>Làm xong một bài thi thử</td><td class="nw">+15</td></tr>
  <tr><td>Điểm danh mỗi ngày (vòng 7 ngày, ngày 7 kèm 1 bùa 50:50)</td><td class="nw">+2 … +15</td></tr><tr><td>Rút quẻ おみくじ (sau khi xong 1 nhiệm vụ)</td><td class="nw">+2 … +20</td></tr><tr><td>Xem vận may hôm nay</td><td class="nw">+2 / +4</td></tr>
  <tr><td>Rương kho báu khi xong hết nhiệm vụ trong ngày</td><td class="nw">+15 … +35</td></tr><tr><td>3 thử thách mỗi ngày (xong cả 3 thêm 8)</td><td class="nw">+4 … +10</td></tr>
  <tr><td>Thử thách tuần: 5 ngày xong hết nhiệm vụ</td><td class="nw">+50</td></tr><tr><td>Hạ yêu quái tuần</td><td class="nw">+55 …</td></tr>
  <tr><td>Thu hoạch cây (mỗi lứa, tuỳ loài)</td><td class="nw">+1 … +20</td></tr><tr><td>Thú cưng lên cấp (mỗi câu đúng +1 điểm thân thiết cho bé đang đi cùng)</td><td class="nw">+30 … +150</td></tr><tr><td>Thẻ trùng từ bản thứ 4 trở đi (đổi lại xu)</td><td class="nw">+10 … +150</td></tr><tr><td>Thành tích, lên cấp thân thiết</td><td class="nw">+8 … +600</td></tr><tr><td>Chơi trò chơi (3 lượt đầu mỗi ngày)</td><td class="nw">+2</td></tr></tbody></table></div>
  <p class="small" style="margin:10px 0 0">Xu từ câu đúng và từ vựng <b>không giới hạn</b> — học càng chăm càng nhiều xu. Một ngày học đầy đủ thường được khoảng <b>130–200 xu</b>, ngày cày nhiều có thể gấp đôi. Món nhỏ vài trăm xu, công trình nổi tiếng 2.000–3.500 xu, thú cưng 1.000–3.000 xu (bé hiếm tới 12.000), gói thẻ 300 / 1.000 xu, vé đi địa điểm mới 2.500–20.000 xu — đủ để mỗi tuần có một mục tiêu mới.</p><p class="small" style="margin:6px 0 0">Gói thẻ miễn phí: hạ yêu quái tuần (+1 gói thường), xong thử thách tuần (+1 gói cao cấp), và rương kho báu đôi khi kèm 1 gói.</p>
  ${d.log?`<p class="small" style="margin:8px 0 0"><b>Hôm nay bạn đã kiếm ${d.e||0} xu:</b> ${Object.entries(d.log).map(([k,v])=>`${esc(L[k]||k)} +${v}`).join(" · ")}</p>`:""}
  <p class="small muted" style="margin:8px 0 0">Xu chỉ dùng trong app để trang trí, trồng cây và mua bùa, không ảnh hưởng tới lịch ôn tập hay kết quả học.</p>` }
function sceneHTML(){ const pid=petNow(); return `${sceneSVG(curLoc())}<button type="button" class="v13-gbuddy" data-v13="poke" aria-label="Chạm vào ${nm()}">${bud(GV.mood)}</button>${pid?`<button type="button" class="v15-gpet" data-v13="pat:${pid}" aria-label="Vuốt ve ${esc(A.PETS[pid].n)}">${A.petSVG(pid,{mood:petMood(pid),lv:petLv(RW().pets[pid].x)})}</button>`:""}<div class="v13-gsay" id="v13gsay" hidden></div>` }
function scChips(){ const s=scS(), cs=curSeason(), ct=curTime();
  const chip=(kind,v,lab,jp)=>{ const id=(kind==="s"?"ss:":"tm:")+v, on=(kind==="s"?s.s:s.t)===v, own=v==="auto"||owned(id); return `<button type="button" class="${on||(v==="auto"&&!(kind==="s"?s.s:s.t))?"on":""}" data-v13="sc:${kind}:${v}" title="${own?"":"Mua ở Du lịch & mùa"}">${own?"":"🔒"}<span class="jp">${jp}</span>${lab}</button>` };
  return `<div class="v14-sc"><span>Mùa</span>${chip("s","auto","Theo lịch ("+WL.SEASONS.find(x=>x[0]===WL.autoSeason())[1]+")","自")}${WL.SEASONS.map(([v,l,j])=>chip("s",v,l,j)).join("")}</div><div class="v14-sc"><span>Giờ</span>${chip("t","auto","Theo giờ thật","自")}${WL.TIMES.map(([v,l,j])=>chip("t",v,l,j)).join("")}</div>` }
function locBar(){ const cur=curLoc(); return `<div class="v14-locs">${WL.ORDER.map(l=>{ const L=WL.LOCS[l], own=locOwned(l), q=locReq(l); return `<button type="button" class="v14-loc ${l===cur?"on":""} ${own?"":"lock"}" data-v13="loc:${l}"><span class="th">${WL.sceneSVG({loc:l,items:own?placeItems(l):Object.keys(WL.ITEMS[l]),season:curSeason(),time:curTime(),fx:false})}</span><b><span class="jp">${L.jp}</span> ${esc(L.n)}</b><small>${own?`${placeOwned(l).length}/${Object.keys(WL.ITEMS[l]).length} món`:q.ok?`🔒 Vé ${L.p.toLocaleString("vi-VN")} xu`:`🔒 Cần ${q.c} món ở ${esc(WL.LOCS[q.pl].n)}`}</small></button>` }).join("")}</div>` }
function farmPanel(){ const p=PLs(), key=GV.sel, N=p.n; const bag=Object.entries(p.seed).filter(([,n])=>n>0);
  const bagHTML=bag.length?`<div class="v14-bag">${bag.map(([sp,n])=>`<button type="button" ${key&&!p.t[key]?`data-v13="sow:${key}|${sp}"`:"disabled"} title="${esc(PL.SP[sp].n)}">${PL.plantCard(sp,PL.finalStage(sp))}<span class="jp">${PL.SP[sp].jp}</span><i>×${n}</i></button>`).join("")}</div>`:`<p class="small muted" style="margin:6px 0">Túi hạt trống — mua hạt ở <button type="button" class="btn ghost small" data-v13="cat:seed">Cửa hàng → Cây & hạt</button></p>`;
  if(!key) return `<div class="v14-fp"><b>Bấm vào một ô trên đảo</b><p class="small muted">Ô có dấu + là đất trống để gieo hạt. Bấm vào cây để xem tiến độ, bón phân hoặc thu hoạch.</p><div class="small"><b>Túi hạt của bạn</b></div>${bagHTML}</div>`;
  const st=plantState(key);
  if(!st) return `<div class="v14-fp"><b>Ô đất trống</b><p class="small muted">Chọn một hạt trong túi để gieo vào ô này.</p>${bagHTML}</div>`;
  const s=st.s, hir=RW().inv.hiryo||0;
  return `<div class="v14-fp"><div class="v14-fphead">${PL.plantCard(st.sp,st.st,{wilt:st.wilt})}<div><b>${esc(s.n)}</b> <span class="jp">${s.jp}・${s.r}</span><div class="small">${PL.STAGE_VI[st.st]}${st.wilt?` · <span style="color:var(--bad)">đang héo — học vài câu để tưới</span>`:""}</div></div></div>
    <div class="v13-bond"><span>${st.ready?"✨ Sẵn sàng thu hoạch!":st.prog>=1?"Đã trưởng thành":`Còn <b>${st.left}</b> điểm lớn ${esc(st.lab)}`}</span><i><u style="width:${Math.round(st.prog*100)}%;background:linear-gradient(90deg,#9BDB72,#3FA64C)"></u></i></div>
    <div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap">${st.ready?`<button type="button" class="btn small primary" data-v13="harv:${key}">${PL.fruit(st.sp)?"Thu hoạch":"Hái hoa"} +${s.y} xu</button>`:""}${st.st<st.fin||s.y?`<button type="button" class="btn small" data-v13="fert:${key}" ${hir?"":"disabled"}>Bón phân (+60) · còn ${hir}</button>`:""}<button type="button" class="btn small ghost" data-v13="dig:${key}">Nhổ cây</button></div></div>` }
function farmHTML(){ const p=PLs(), N=p.n, d=D(), list=Object.keys(p.t).map(plantState).filter(Boolean), ready=list.filter(x=>x.ready).length;
  const sel=GV.sel?(()=>{ const [i,j]=GV.sel.split("_").map(Number); return i*N+j })():-1;
  return `<section class="sheet v14-farm"><div class="v13-ghead"><div><div class="eyebrow">畑 · Đảo cây của bạn</div><div class="small muted">Học càng nhiều, làm đúng càng nhiều, cây càng lớn nhanh.</div></div><div class="v14-water"><b>+${d.gw||0}</b><small>điểm lớn hôm nay</small></div></div>
    <div class="v14-farmgrid"><div class="v14-isl">${PL.islandSVG({n:N,season:curSeason(),tiles:islandTiles(),empty:true,click:true,sel})}</div>${farmPanel()}</div>
    <div class="v14-fstat"><span>${list.length}/${N*N} ô có cây</span><span>${list.filter(x=>x.st>=4).length} cây đã ra hoa</span>${ready?`<span class="chip ok">${ready} cây chờ thu hoạch</span>`:""}${wilted()?`<span class="chip bad">Cây đang héo vì ${TODAY-p.last} ngày chưa học</span>`:""}<span class="small muted">Sổ thực vật ${PL.ORDER.filter(sp=>p.dex[sp]).length}/${PL.ORDER.length}</span></div></section>` }
function memHTML(){ const mem=memSync(), cur=ymOf(TODAY), yms=Object.keys(mem).filter(k=>k!==cur).sort().reverse(); const now=memIsland(cur,true);
  return `<section class="sheet v14-mem"><div class="eyebrow">思い出の森 · Đảo kỷ niệm</div><p class="small muted" style="margin:2px 0 8px">Mỗi ngày bạn xong hết nhiệm vụ, một cây tự mọc trên đảo của tháng đó — cây đổi theo mùa. Đây là “khu rừng” ghi lại công sức của bạn.</p>
    <div class="v14-memrow"><div class="v14-memc big">${now.svg}<b>Tháng ${now.m}/${now.y}</b><small>${now.n} ngày trọn vẹn</small></div>${yms.slice(0,6).map(ym=>{ const x=memIsland(ym); return `<div class="v14-memc">${x.svg}<b>Tháng ${x.m}/${x.y}</b><small>${x.n} ngày</small></div>` }).join("")}</div></section>` }
V.renderGarden=function(m){
  const r=RW(), b=bond(), loc=curLoc(), L=WL.LOCS[loc], ti=titleNow(), np=placeOwned(loc).length, tot=Object.keys(WL.ITEMS[loc]).length;
  const TABS=[["shop","Cửa hàng"],["pets","Thú cưng"],["cards","Album thẻ"],["dex","Sổ thực vật"],["ach","Thành tích"],["moods","Biểu cảm"],["how","Cách kiếm xu"]];
  m.innerHTML=`<section class="sheet v13-gsec">
    <div class="v13-ghead"><div><div class="eyebrow">${L.jp} · ${esc(L.n)} cùng ${nm()}</div>${ti?`<div class="v13-title">${esc(ti)}</div>`:""}</div><div class="v13-bal big">${A.coin(30)}<b>${r.c.toLocaleString("vi-VN")}</b><span>xu</span></div></div>
    <div class="v15-locrow">${locBar()}<button type="button" class="v15-mapbtn" data-v13="map" aria-label="Mở bản đồ Nhật Bản"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3,6 l6,-3 l6,3 l6,-3 v15 l-6,3 l-6,-3 l-6,3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9,3 v15 M15,6 v15" stroke="currentColor" stroke-width="2"/></svg><span>Bản đồ</span></button></div>
    <div class="v13-scene" id="v13scene">${sceneHTML()}</div>${scChips()}
    <div class="v13-gstats"><div><b>${np}/${tot}</b><small>món ở ${esc(L.n)}</small></div><div><b>${WL.ORDER.filter(locOwned).length}/${WL.ORDER.length}</b><small>địa điểm đã mở</small></div><div><b>${safe(()=>streak(),0)}</b><small>chuỗi ngày</small></div><div><b>${r.tot.toLocaleString("vi-VN")}</b><small>tổng xu đã kiếm</small></div></div>
    <div class="v13-bond wide"><span>絆 Độ thân thiết cấp <b>${b.lv}</b> · ${esc(bondName(b.lv))}</span><i><u style="width:${Math.round(b.p*100)}%"></u></i><small>còn ${b.left} xu nữa lên cấp ${b.lv+1}</small></div>
  </section>${farmHTML()}${memHTML()}
  <section class="sheet v13-shop" id="v13shop"><div class="seg v13-tabs">${TABS.map(([k,l])=>`<button type="button" aria-pressed="${GV.tab===k}" data-v13="tab:${k}">${l}</button>`).join("")}</div>
    <div id="v13tab">${GV.tab==="pets"?petsHTML():GV.tab==="cards"?albumHTML():GV.tab==="ach"?achHTML():GV.tab==="moods"?moodsHTML():GV.tab==="how"?howHTML():GV.tab==="dex"?dexHTML():shopHTML()}</div></section>`;
  const lb=$(".v14-locs",m), on=lb&&$(".v14-loc.on",lb); if(on) lb.scrollLeft=Math.max(0,on.offsetLeft-lb.offsetLeft-(lb.clientWidth-on.clientWidth)/2);
};
function refresh(){ if(view==="garden"){ const y=window.scrollY; render(); window.scrollTo(0,y) } else if(view==="today"){ const m=$("#main"); if(m) decorateToday(m) } paintChip() }
function gsay(t,mood){ const el=$("#v13gsay"); const b=$(".v13-gbuddy"); if(b&&mood){ GV.mood=mood; b.innerHTML=bud(mood) } if(!el) return; el.innerHTML=t; el.hidden=false; clearTimeout(gsay._t); gsay._t=setTimeout(()=>{el.hidden=true},4200) }
function buy(id){
  const x=SHOP_BY[id]; if(!x) return; const r=RW(); const st=itemState(x), pr=priceOf(x);
  if(x.kind==="gacha") return openFuku();
  if(!st.canBuy) return toast(x.kind==="loc"&&st.req?`Cần ${st.req.c} món trang trí ở ${WL.LOCS[st.req.pl].n} trước`:st.lock?"Cần mua vé tới địa điểm này trước":x.need?"Cần mua "+SHOP_BY[x.need].n+" trước":"Đã đủ rồi");
  if(x.kind==="pack") return openPack(x,false);
  if(!["seed","hiryo","land","snack"].includes(x.kind)&&x.cat!=="charm"&&st.have) return;
  if(!spend(pr)) return toast(`Chưa đủ xu — còn thiếu ${(pr-r.c).toLocaleString("vi-VN")} xu. Học thêm vài bài nhé!`);
  coinSfx();
  if(x.kind==="seed"){ const p=PLs(); p.seed[x.v]=(p.seed[x.v]||0)+1; markDirty(); refresh(); return toast(`Đã thêm hạt ${PL.SP[x.v].n} vào túi — bấm một ô trống trên đảo để gieo`) }
  if(x.kind==="land"){ PLs().n++; markDirty(); safe(()=>V12.confetti(24)); refresh(); return safe(()=>V12.say(`Đảo cây đã rộng ${PLs().n}×${PLs().n}! Thêm chỗ cho cả một khu rừng rồi~`,{mood:"sparkle"})) }
  r.inv[id]=(r.inv[id]||0)+(x.q||1);
  if(x.kind==="loc"){ r.eq.loc=x.v; GV.ploc=x.v; GV.cat="place" } else if(x.kind==="season"){ r.sc=Object.assign({},r.sc,{s:x.v}) } else if(x.kind==="time"){ r.sc=Object.assign({},r.sc,{t:x.v}) }
  else if(x.acc) r.eq[A.ACC[x.acc].slot]=x.acc; else if(x.kind&&x.kind!=="hiryo"&&x.kind!=="snack") r.eq[x.kind]=x.kind==="title"?x.id.slice(3):x.v;
  if(x.kind==="pet"){ if(!r.pets[x.v]) r.pets[x.v]={x:0,d:TODAY,f:TODAY}; GV.tab="pets" }
  if(x.cat==="place"&&x.loc!==curLoc()&&locOwned(x.loc)) r.eq.loc=x.loc;
  if(x.kind==="theme") V.applyTheme(); r.t=Date.now(); markDirty(); safe(()=>V12.setMood("love")); render();
  const line=x.kind==="loc"?`${J("旅行だ！")} Tụi mình tới ${esc(WL.LOCS[x.v].n)} rồi! ${esc(LOC_SAY[x.v]||"")}`:x.cat==="place"?pick(["わあ、きれい！ Đẹp hơn hẳn rồi!","ありがとう！ Mình thích món này lắm!","やった！ Đặt vào liền nè."]):x.cat==="acc"?pick(["どう？ Hợp với mình không?","えへへ、 đẹp không nè?","Bạn chọn đồ có gu ghê!"]):x.kind==="pet"?`${J("かわいい！")} Chào mừng ${esc(x.n)} về nhà! Từ giờ mỗi câu bạn làm đúng, bé sẽ thân với bạn thêm một chút.`:x.kind==="snack"?"Bé nhà mình sẽ thích lắm cho xem~":x.cat==="charm"||x.kind==="hiryo"?"Có rồi, yên tâm học thôi!":"Đổi không khí một chút, học cho hứng nào!";
  if(view==="garden"){ gsay(line,x.cat==="acc"?"shy":x.kind==="loc"||x.kind==="pet"?"sparkle":"love"); const sc=$("#v13scene"); if(sc&&(x.cat==="place"||x.kind==="loc"||x.kind==="season"||x.kind==="time")) sc.scrollIntoView({behavior:"smooth",block:"center"}) }
  if(x.kind==="fx"||x.kind==="loc"||pr>=2000) safe(()=>V12.confetti(30)); setTimeout(checkAch,800);
}
function equip(id){
  const x=SHOP_BY[id]; if(!x||!owned(id)) return; const r=RW();
  if(x.kind==="season"){ r.sc=Object.assign({},r.sc,{s:scS().s===x.v?"auto":x.v}) } else if(x.kind==="time"){ r.sc=Object.assign({},r.sc,{t:scS().t===x.v?"auto":x.v}) }
  else if(x.cat==="place"){ if(r.off[id]) delete r.off[id]; else r.off[id]=1 }
  else if(x.acc){ const sl=A.ACC[x.acc].slot; r.eq[sl]=r.eq[sl]===x.acc?"":x.acc }
  else if(x.kind){ const v=x.kind==="title"?x.id.slice(3):x.v; r.eq[x.kind]=r.eq[x.kind]===v?"":v; if(x.kind==="theme") V.applyTheme(); if(x.kind==="fx"&&r.eq.fx) V.confetti(24) }
  r.t=Date.now(); markDirty(); safe(()=>V12.setMood("happy")); render();
}
function useCharm(id){ const r=RW(); if(id==="maneki"){ if(r.dbl===TODAY||!(r.inv.maneki>0)) return; r.inv.maneki--; r.dbl=TODAY; r.t=Date.now(); markDirty(); coinSfx(); refresh(); safe(()=>V12.say(`${J("招き猫！")} Mèo thần tài đã bật: mọi xu kiếm được hôm nay <b>nhân đôi</b>. Cày thôi nào!`,{mood:"fire"})) } }
function use5050(){
  const s=session; if(!s||s.done||s.mode==="exam"||view!=="quiz"||s.checked[s.i]) return; const r=RW(); if(!(r.inv.ofuda>0)) return; const q=s.items[s.i]; if(!q||q.opts.length<4) return;
  s._h5=s._h5||{}; if(s._h5[s.i]) return; const wrong=q.opts.map((_,k)=>k).filter(k=>k!==q.a).sort(()=>Math.random()-.5).slice(0,2);
  s._h5[s.i]=wrong; r.inv.ofuda--; r.t=Date.now(); if(wrong.includes(s.ans[s.i])) delete s.ans[s.i]; markDirty(); render();
}
function decorateQuiz(m){
  const s=session; if(!s||s.done||s.mode==="exam") return; const q=s.items[s.i]; if(!q) return;
  const h=s._h5&&s._h5[s.i]; if(h) $$("#opts .opt",m).forEach(b=>{ if(h.includes(+b.dataset.k)&&!s.checked[s.i]){ b.classList.add("v13-out"); b.disabled=true } });
  if(!s.checked[s.i]){ const n=RW().inv.ofuda||0; const row=$(".qfoot .row",m); if(n>0&&!h&&row&&q.opts.length>=4&&q.sec!=="conj"&&!$(".v13-5050",row)) row.insertAdjacentHTML("afterbegin",`<button type="button" class="btn small v13-5050" data-v13="use5050" title="Bùa 50:50 — loại 2 phương án sai">50:50 <span class="chip">×${n}</span></button>`); return }
  // sau khi trả lời sai: một mẹo ngắn cho đúng dạng bài (mỗi dạng 1 lần trong một bài)
  if(s.ok&&s.ok[s.i]===false||s.ok&&!s.ok[s.i]){ s._tip=s._tip||{}; s._tipSec=s._tipSec||{};
    if(s._tip[s.i]==null){ const t=TP.SEC[q.sec]; s._tip[s.i]=t&&!s._tipSec[q.sec]?t:""; if(t) s._tipSec[q.sec]=1 }
    if(s._tip[s.i]&&!$(".v13-sectip",m)){ const ex=$(".explain",m); if(ex){ const fb=$(".v12-fb",ex); const h2=`<div class="v13-sectip"><b>💡 ${nm()} mách:</b> ${s._tip[s.i]}</div>`; if(fb) fb.insertAdjacentHTML("afterend",h2); else ex.insertAdjacentHTML("afterbegin",h2) } } }
}
function plantNews(){
  if(safe(()=>V12.inFocus(),false)) return; const p=PLs(), d=D(); const pr=V12.mission();
  if(pr.total&&pr.all&&!d.rain){ d.rain=1; grow(25); memSync(); markDirty(); setTimeout(()=>safe(()=>V12.say(`${J("恵みの雨！")} Bạn xong hết nhiệm vụ: cơn mưa tưới cả đảo cây <b>+25 điểm lớn</b>, và một cây kỷ niệm vừa mọc trên đảo tháng này.`,{mood:"sing",ms:8000})),1200) }
  if(p.ev&&p.ev.length){ const ev=p.ev.slice(-1)[0]; p.ev=[]; const s=PL.SP[ev[0]]; if(s){ const msg=ev[1]>=5?`${J("実った！")} Cây <b>${esc(s.n)}</b> (<span class="jp">${s.jp}</span>) kết trái rồi — ra đảo cây thu hoạch nhé!`:ev[1]===4?`${J("咲いた！")} Cây <b>${esc(s.n)}</b> (<span class="jp">${s.jp}・${s.r}</span>) ra hoa rồi!${p.newdex===ev[0]?" Loài mới trong Sổ thực vật!":""}`:ev[1]===3?`Cây <b>${esc(s.n)}</b> đã lớn rồi đó. Học thêm chút nữa là ra hoa!`:ev[1]===2?`Cây <b>${esc(s.n)}</b> thành cây non rồi~`:`Hạt <b>${esc(s.n)}</b> nảy mầm rồi!`;
    setTimeout(()=>safe(()=>V12.say(msg,{mood:ev[1]>=4?"sparkle":"happy",ms:7000})),700); if(ev[1]>=4) setTimeout(checkAch,1500) } }
}
V.afterRender=function(){
  paintChip(); const m=$("#main"); if(!m) return; try{questCheck()}catch(e){} try{plantNews()}catch(e){ console.error("[v14]",e) }
  if(view==="today") decorateToday(m); else if(view==="quiz"&&session&&!session.done) decorateQuiz(m);
  try{ if(window.V13N2&&V13N2.after) V13N2.after() }catch(e){ console.error("[n2]",e) }
  const ps=$("#v12psub"); if(ps){ const t=titleNow(); ps.textContent=t||("絆 cấp "+bond().lv+" · "+bondName(bond().lv).split(" · ")[1]) }
};

/* ================= v15: thú cưng ================= */
const PET_LV=[0,30,80,160,280,450,680,980,1360,1830];
const petLv=x=>{ let l=1; while(l<10&&x>=PET_LV[l]) l++; return l };
function petReq(x){ const r=RW(); if(x.cn){ const have=Object.values(r.cd.c).filter(n=>n>0).length; return {ok:have>=x.cn,c:x.cn,have} } if(x.pn){ const have=Object.keys(r.pets).filter(id=>owned("pet:"+id)).length; return {ok:have>=x.pn,p:x.pn,have} } return {ok:true} }
function petNow(){ const id=RW().eq.pet; return id&&A.PETS&&A.PETS[id]&&owned("pet:"+id)?(RW().pets[id]||(RW().pets[id]={x:0,d:TODAY,f:TODAY}),id):"" }
const petHungry=id=>{ const p=RW().pets[id]; return !!p&&TODAY-Math.max(p.d||0,p.f||0)>=2 };
function petMood(id){ const p=RW().pets[id]; if(!p) return "idle"; if(petHungry(id)) return "hungry"; if(p.pat===TODAY||p.f===TODAY) return "happy"; return "idle" }
const petMoodVi=id=>{ const m=petMood(id); return m==="hungry"?"đang đói — học vài câu hoặc cho ăn nhé":m==="happy"?"đang rất vui":"khoẻ mạnh" };
function petXp(n){ const id=petNow(); if(!id) return; const p=RW().pets[id]; const a=petLv(p.x||0); p.x=(p.x||0)+n; p.d=TODAY; const b=petLv(p.x); if(b>a) petLevelUp(id,b) }
function petLevelUp(id,lv){ const P=A.PETS[id], got=earn(lv*15,"pet");
  if(lv===5||lv===10) whenIdle(()=>popup(`<div class="v13-pop"><div class="v15-petbig">${A.petSVG(id,{mood:"happy",lv})}</div><div class="eyebrow">ペット · Thú cưng lên cấp</div><h2>${esc(P.n)} cấp ${lv}!</h2><p>${lv===10?"Cấp tối đa — bé đội vương miện nhỏ rồi! Hai bạn đúng là cặp bài trùng.":"Bé được đeo vòng cổ chuông vàng — phần thưởng cho tình bạn bền bỉ."}</p><p class="v13-gain">+${got} xu</p><div class="row"><button class="btn primary" data-kxclose>やったね！</button></div></div>`,true));
  else setTimeout(()=>safe(()=>V12.say(`🐾 <b>${esc(P.n)}</b> lên cấp ${lv}! +${got} xu`,{mood:"happy",ms:5000})),600);
  setTimeout(checkAch,1200) }
function petPat(id){ const r=RW(), p=r.pets[id]; if(!p) return; const P=A.PETS[id];
  if(p.pat!==TODAY){ p.pat=TODAY; const a=petLv(p.x||0); p.x=(p.x||0)+3; if(petLv(p.x)>a) petLevelUp(id,petLv(p.x)); r.t=Date.now(); markDirty() }
  const el=$(".v15-gpet"); if(el){ el.innerHTML=A.petSVG(id,{mood:petMood(id),lv:petLv(p.x)}); el.classList.remove("hop"); void el.offsetWidth; el.classList.add("hop") }
  safe(()=>V12.tone([880,1175],0.05,"sine",0.04));
  const line=petHungry(id)?`${esc(P.n)} đói bụng rồi… cho bé một bánh thưởng nhé.`:pick([P.say,`${esc(P.n)} dụi đầu vào tay bạn~`,"ゴロゴロ… bé thích được vuốt ve lắm.",`Hôm nay ${esc(P.n)} đi cùng bạn học đó!`]);
  if(view==="garden"&&$("#v13gsay")) gsay(line,"love"); else toast(line);
  if(GV.tab==="pets"&&view==="garden"){ const t=$("#v13tab"); if(t) t.innerHTML=petsHTML() } }
function petFeed(){ const id=petNow(), r=RW(); if(!id) return toast("Dẫn theo một thú cưng trước đã"); if(!(r.inv.oyatsu>0)){ GV.tab="shop"; GV.cat="pet"; refresh(); return toast("Hết bánh thưởng — mua ở Cửa hàng → Thú cưng") }
  r.inv.oyatsu--; const p=r.pets[id]; p.f=TODAY; const a=petLv(p.x||0); p.x=(p.x||0)+40; r.t=Date.now(); markDirty(); coinSfx(); if(petLv(p.x)>a) petLevelUp(id,petLv(p.x));
  refresh(); setTimeout(()=>gsay(`${J("おいしい！")} ${esc(A.PETS[id].n)} ăn ngon lành — +40 điểm thân thiết.`,"happy"),50) }
function petsHTML(){ const r=RW(), id=petNow(), mine=A.PET_ORDER.filter(k=>owned("pet:"+k));
  let top="";
  if(id){ const P=A.PETS[id], p=r.pets[id], lv=petLv(p.x||0), a=PET_LV[lv-1], b=PET_LV[lv]||PET_LV[9], pr=lv>=10?1:Math.max(0,Math.min(1,((p.x||0)-a)/(b-a)));
    top=`<div class="v15-petmain"><button type="button" class="v15-petbig" data-v13="pat:${id}" aria-label="Vuốt ve">${A.petSVG(id,{mood:petMood(id),lv})}</button><div><div class="eyebrow">${P.jp} · đang đi cùng bạn</div><h3 style="margin:2px 0 4px">${esc(P.n)} <span class="chip">Cấp ${lv}</span></h3><p class="small muted" style="margin:0 0 8px">${esc(P.say)}</p>
      <div class="v13-bond"><span>${lv>=10?"Cấp tối đa 👑":`Còn <b>${b-(p.x||0)}</b> điểm lên cấp ${lv+1} (+${(lv+1)*15} xu)`}</span><i><u style="width:${Math.round(pr*100)}%;background:linear-gradient(90deg,#FFB3C4,#FF6F91)"></u></i></div>
      <p class="small" style="margin:8px 0">Tâm trạng: <b>${esc(petMoodVi(id))}</b>${p.pat===TODAY?" · đã vuốt ve hôm nay":" · bấm vào bé để vuốt ve (+3)"}</p>
      <div class="row" style="gap:6px;flex-wrap:wrap"><button type="button" class="btn small primary" data-v13="feed">${A.coin(14)} Cho ăn bánh thưởng (+40) · còn ${r.inv.oyatsu||0}</button><button type="button" class="btn small ghost" data-v13="cat:pet">Mua thêm</button></div></div></div>` }
  else top=`<p class="small muted" style="margin:0 0 10px">Chưa có bé nào đi cùng. Nuôi một thú cưng ở <button type="button" class="btn ghost small" data-v13="cat:pet">Cửa hàng → Thú cưng</button> — mỗi câu bạn làm đúng, bé thân với bạn thêm 1 điểm; lên cấp thì bạn được thưởng xu.</p>`;
  return `${top}<p class="small muted" style="margin:12px 0 8px">Bộ sưu tập thú cưng: <b>${mine.length}/${A.PET_ORDER.length}</b>. Bé hiếm mở khi bạn nuôi đủ nhiều bé hoặc sưu tầm đủ thẻ.</p>
  <div class="v15-pets">${A.PET_ORDER.map(k=>{ const P=A.PETS[k], own=owned("pet:"+k), p=r.pets[k]; return `<button type="button" class="v15-petc ${own?"own":""} ${k===id?"on":""}" data-v13="${own?"eq:pet:"+k:"cat:pet"}">${own?A.petSVG(k,{mood:k===id?petMood(k):"idle",lv:petLv((p&&p.x)||0)}):A.petShadow(k)}<b class="jp">${own||!P.rare?P.jp:"？？"}</b><small>${own?`Cấp ${petLv((p&&p.x)||0)}${k===id?" · đi cùng":""}`:`${P.p.toLocaleString("vi-VN")} xu`}</small></button>` }).join("")}</div>` }

/* ================= v15: thẻ bài Chiến binh Kanji ================= */
const PITY=25, RATE_N=[70,24,5,1], RATE_G=[52,33,11,4], REFUND=[10,25,60,150];
function rollR(rate){ let x=Math.random()*100; for(let i=0;i<4;i++){ if(x<rate[i]) return i; x-=rate[i] } return 0 }
function openPack(x,free){ if(!x) return; const r=RW(), cd=r.cd;
  if(free){ const k=x.gold?"fg":"fr"; if(!(cd[k]>0)) return toast("Chưa có gói miễn phí loại này"); cd[k]-- }
  else { if(!spend(x.p)) return toast(`Chưa đủ xu — còn thiếu ${(x.p-r.c).toLocaleString("vi-VN")} xu. Học thêm vài bài nhé!`); coinSfx() }
  const n=x.gold?5:3; cd.op=(cd.op||0)+1; cd.pity=(cd.pity||0)+1; let rs=[];
  for(let i=0;i<n;i++) rs.push(rollR(x.gold?RATE_G:RATE_N));
  if(x.gold&&Math.max(...rs)<1) rs[n-1]=1;
  if(cd.pity>=PITY&&Math.max(...rs)<3) rs[n-1]=3;
  if(rs.includes(3)) cd.pity=0;
  rs.sort((a,b)=>a-b);
  let refund=0; const got=rs.map(rar=>{ const pool=A.CARDS.filter(c=>c.r===rar), c=pool[Math.floor(Math.random()*pool.length)]; const before=cd.c[c.id]||0; cd.c[c.id]=before+1; let ref=0; if(before>=3){ ref=REFUND[rar]; refund+=ref } return {c,isNew:!before,holo:before===2,ref} });
  if(refund) earn(refund,"card"); r.t=Date.now(); markDirty();
  const best=rs[rs.length-1];
  const cards=got.map((g,i)=>`<div class="v15-flip r${g.c.r}" style="--d:${(0.35+i*0.45).toFixed(2)}s" data-v13="card:${g.c.id}"><div class="in"><div class="fc back">${A.cardBack()}</div><div class="fc front">${A.cardSVG(g.c.id,{holo:(cd.c[g.c.id]||0)>=3})}${g.isNew?`<em class="v15-new">MỚI!</em>`:g.holo?`<em class="v15-new holo">HOLO!</em>`:g.ref?`<em class="v15-new dup">+${g.ref} xu</em>`:`<em class="v15-new dup">×${cd.c[g.c.id]}</em>`}</div></div></div>`).join("");
  const nNew=got.filter(g=>g.isNew).length, tot=Object.values(cd.c).filter(v=>v>0).length;
  const line=best===3?`${J("覇者降臨！")} Thẻ SSR — hiếm lắm đó!`:best===2?`${J("すごい！")} Có thẻ SR nè!`:nNew?`${nNew} thẻ mới cho album!`:"Thêm bản trùng — đủ 3 bản là thẻ thành HOLO lấp lánh.";
  const fr=x.gold?(cd.fg||0):(cd.fr||0);
  popup(`<div class="v13-pop v15-packpop"><div class="eyebrow">${x.gold?"極パック · Gói cao cấp":"戦士パック · Gói thẻ"}</div><h2>${line}</h2><div class="v15-reveal n${n}">${cards}</div><p class="small muted">Album: <b>${tot}/${A.CARDS.length}</b> thẻ${refund?` · đổi thẻ trùng được <b>+${refund} xu</b>`:""} · còn ${Math.max(1,PITY-(cd.pity||0))} gói nữa chắc chắn ra SSR. Bấm vào thẻ để học chữ.</p><div class="row"><button class="btn primary" data-kxclose>Cất vào album</button>${fr?`<button class="btn" data-v13="pfree:${x.gold?1:0}" data-kxclose>Mở gói miễn phí (${fr})</button>`:`<button class="btn" data-v13="buy:${x.id}" data-kxclose>Mở thêm (${x.p.toLocaleString("vi-VN")})</button>`}</div></div>`,best>=2); wide();
  safe(()=>V12.setMood(best>=2?"sparkle":"happy"));
  setTimeout(()=>safe(()=>V12.tone(best>=3?[784,988,1319,1568]:best>=2?[784,988,1319]:[880,1175],0.08,"triangle",0.05)),400+n*450);
  refresh(); setTimeout(checkAch,800+n*450) }
function albumHTML(){ const cd=RW().cd, tot=Object.values(cd.c).filter(v=>v>0).length, holo=Object.values(cd.c).filter(v=>v>=3).length;
  const pk=SHOP_BY.pack, pg=SHOP_BY.packg, c=RW().c;
  const groups=[[3,"SSR · 覇者"],[2,"SR · 勇者"],[1,"R · 戦士"],[0,"N · 戦士"]];
  return `<div class="v15-albumhead"><div><div class="eyebrow">漢字戦士 · Chiến binh Kanji</div><p class="small muted" style="margin:2px 0 0">Mỗi thẻ là một chữ Hán, kèm âm On/Kun và nghĩa Hán Việt. Sưu tầm <b>${tot}/${A.CARDS.length}</b> · ${holo} thẻ HOLO. Đủ 3 bản giống nhau thì thẻ thành HOLO; từ bản thứ 4 đổi lại xu. Đủ 30 thẻ: mở bé <b>Mèo vàng đỗ đạt</b>.</p></div></div>
  <div class="v15-packs">${[pk,pg].map(x=>{ const fr=x.gold?(cd.fg||0):(cd.fr||0); return `<div class="v15-packc">${A.packSVG(x.gold)}<div><b>${esc(x.n)}</b><small>${esc(x.d)}</small><div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap">${fr?`<button type="button" class="btn small primary" data-v13="pfree:${x.gold?1:0}">Mở miễn phí ×${fr}</button>`:""}${priceBtn(x,c>=x.p)}</div></div></div>` }).join("")}</div>
  <p class="small muted" style="margin:6px 0 10px">Còn <b>${Math.max(1,PITY-(cd.pity||0))}</b> gói nữa chắc chắn ra SSR · đã mở ${cd.op||0} gói.</p>
  ${groups.map(([rr,lab])=>{ const list=A.CARDS.filter(x=>x.r===rr); return `<h4 class="v15-rh r${rr}">${lab} <small>${list.filter(x=>cd.c[x.id]>0).length}/${list.length}</small></h4><div class="v15-album">${list.map(x=>{ const n=cd.c[x.id]||0; return n?`<button type="button" class="v15-slot own" data-v13="card:${x.id}">${A.cardSVG(x.id,{holo:n>=3})}${n>1?`<i>×${n}</i>`:""}</button>`:`<div class="v15-slot"><span class="q">？</span><small>No.${String(x.no).padStart(2,"0")}</small></div>` }).join("")}</div>` }).join("")}` }
function cardOpen(id){ const c=A.CARDS.find(x=>x.id===id); if(!c) return; const n=RW().cd.c[id]||0; if(!n) return;
  const b=popup(`<div class="v13-pop v15-carddlg"><div class="v15-cardbig">${A.cardSVG(id,{holo:n>=3})}</div><div class="v15-cardinfo"><div class="eyebrow">${A.RAR[c.r]} · No.${String(c.no).padStart(2,"0")} · có ${n} bản${n>=3?" · HOLO":""}</div><div class="v15-kbig jp">${c.k}</div><p><b>${c.hv}</b> — ${esc(c.m)}</p><p class="small">音読み <span class="jp">${c.on}</span>　·　訓読み <span class="jp">${c.kun}</span></p><div id="v15kx" class="small muted">Đang tìm từ ví dụ…</div><div class="row"><button class="btn primary" data-kxclose>Đóng</button></div></div></div>`); wide();
  const fill=()=>{ const el=document.getElementById("v15kx"); if(!el) return; const e=(window.KXD&&KXD.K||[]).find(x=>x[0]===c.k); if(!e){ el.textContent=""; return }
    const ex=(e[14]||[]).slice(0,3), mn=(e[11]||[])[0]; el.className="small"; el.innerHTML=`${ex.length?`<b>Từ ví dụ</b><ul class="v15-ex">${ex.map(w=>`<li><span class="jp">${esc(w[0])}</span> <span class="muted">(${esc(w[1])})</span> — ${esc(w[2])}</li>`).join("")}</ul>`:""}${mn?`<p class="muted" style="margin:6px 0 0">💡 ${esc(mn)}</p>`:""}` };
  if(window.KXD) fill(); else if(typeof kxLoad==="function") kxLoad().then(fill).catch(()=>{ const el=document.getElementById("v15kx"); if(el) el.textContent="" }); else fill();
  return b }
function mapOpen(){ const cur=curLoc(); popup(`<div class="v13-pop v15-mappop"><div class="eyebrow">日本地図 · Bản đồ du lịch</div><h2>Đi đâu hôm nay?</h2><div class="v15-mapwrap">${WL.mapSVG({cur,own:locOwned}).replace(/class="v15-pin/g,'data-kxclose class="v15-pin')}</div><p class="small muted">Đã mở <b>${WL.ORDER.filter(locOwned).length}/${WL.ORDER.length}</b> địa điểm. Địa điểm có ổ khoá: mua vé ở Cửa hàng → Du lịch & mùa (cần đủ 5 món ở địa điểm trước).</p><div class="row"><button class="btn" data-kxclose>Đóng</button></div></div>`); wide() }
function wide(){ const d=$("#kxmodal .kxdlg"); if(d) d.classList.add("v15-wide") }

/* ================= sự kiện ================= */
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-v13]"); if(!b) return; const a=b.dataset.v13; const [k,arg]=a.split(/:(.*)/);
  if(a==="garden"){ safe(()=>V12.closePanel()); if(session&&!session.done&&(view==="quiz"||view==="exam")) return toast("Làm xong bài rồi ra vườn nhé!"); go("garden"); return }
  if(k==="tab"){ GV.tab=arg; return refresh() }
  if(k==="cat"){ GV.cat=arg; GV.tab="shop"; refresh(); if(b.closest(".v14-fp")){ const sh=$("#v13shop"); if(sh) sh.scrollIntoView({behavior:"smooth"}) } return }
  if(k==="buy") return buy(arg);
  if(k==="pfree") return openPack(SHOP_BY[arg==="1"?"packg":"pack"],true);
  if(k==="card") return cardOpen(arg);
  if(k==="pat") return petPat(arg);
  if(k==="feed") return petFeed();
  if(a==="map") return mapOpen();
  if(k==="loc"){ if(!locOwned(arg)){ GV.tab="shop"; GV.cat="trip"; refresh(); const sh=$("#v13shop"); if(sh) sh.scrollIntoView({behavior:"smooth"}); return toast("Mua vé ở mục Du lịch & mùa để tới đây") } RW().eq.loc=arg; GV.ploc=arg; RW().t=Date.now(); markDirty(); refresh(); return gsay(esc(LOC_SAY[arg]||""),pick(["happy","sparkle","sing","wave"])) }
  if(k==="ploc"){ GV.ploc=arg; return refresh() }
  if(k==="sc"){ const [kind,v]=arg.split(":"); const id=(kind==="s"?"ss:":"tm:")+v; if(v!=="auto"&&!owned(id)){ GV.tab="shop"; GV.cat="trip"; refresh(); const sh=$("#v13shop"); if(sh) sh.scrollIntoView({behavior:"smooth"}); return toast("Mua “"+SHOP_BY[id].n+"” ở mục Du lịch & mùa") } RW().sc=Object.assign({},RW().sc,kind==="s"?{s:v}:{t:v}); RW().t=Date.now(); markDirty(); return refresh() }
  if(k==="tile"){ const N=PLs().n, key=tileKey(+arg,N); GV.sel=GV.sel===key?null:key; const st=plantState(key); if(st&&st.ready) return harvest(key); return refresh() }
  if(k==="sow"){ const [key,sp]=arg.split("|"); return sow(key,sp) }
  if(k==="harv") return harvest(arg);
  if(k==="fert") return fertilize(arg);
  if(k==="dig") return dig(arg,b);
  if(k==="eq") return equip(arg);
  if(k==="use") return useCharm(arg);
  if(a==="use5050") return use5050();
  if(a==="ci") return ciClaim();
  if(a==="omi") return omiDraw();
  if(a==="fortune") return fortuneOpen(false);
  if(a==="bdedit") return fortuneOpen(true);
  if(a==="bdsave"){ const i=$("#v13bd"); const v=i&&i.value; if(!v||!/^\d{4}-\d{2}-\d{2}$/.test(v)) return toast("Chọn ngày sinh của bạn trước nhé"); RW().bd=v; RW().t=Date.now(); markDirty(); return fortuneOpen(false) }
  if(a==="chest") return chestOpen();
  if(a==="week") return weekClaim();
  if(a==="poke"){ const ms=V12.moods.filter(x=>x!=="idle"&&x!==GV.mood); return gsay(esc(pick(GARDEN_SAY)),pick(ms)) }
  if(k==="mood"){ GV.mood=arg; $$(".v13-moods button").forEach(x=>x.classList.toggle("on",x===b)); const gb=$(".v13-gbuddy"); if(gb) gb.innerHTML=bud(arg); safe(()=>V12.setMood(arg)); const sc=$("#v13scene"); if(sc) sc.scrollIntoView({behavior:"smooth",block:"center"}); return }
  if(a==="tipnext"){ const p=$("#v13tip"); if(p) p.innerHTML=tipHTML(1); const av=$(".v13-cava"); if(av) av.innerHTML=bud("explain",{bust:1}); return }
  if(a==="nug"){ const p=$("#v13tip"); if(p) p.innerHTML=`<span class="chip">Bạn có biết?</span> ${nugHTML(1)}`; const av=$(".v13-cava"); if(av) av.innerHTML=bud(pick(["proud","sing","happy"]),{bust:1}); return }
  if(a==="plan"){ safe(()=>V12.open()); return teachMsg("plan") }
  if(a==="tipmsg") return teachMsg("tip",1);
  if(a==="nugmsg") return teachMsg("nug",1);
  if(a==="planmsg") return teachMsg("plan");
});

/* ================= khởi động ================= */
V.applyTheme();
safe(()=>{ if(typeof render==="function") render() });
setTimeout(()=>{ try{
  const saved=freezeCheck(); const st=safe(()=>streak(),0);
  if(saved) V12.say(`${J("お守り！")} Bùa giữ chuỗi đã bảo vệ chuỗi <b>${st}</b> ngày của bạn (dùng ${saved} lá). Hôm nay học lại nhé!`,{mood:"proud",ms:9000});
  else if(!ciState().done&&view==="today"&&!V12.B.quiet) V12.say(`Đừng quên <b>điểm danh</b> nhận xu hôm nay nha~`,{mood:"sing",acts:`<button type="button" class="btn small primary" data-v13="ci">Điểm danh</button>`});
  memSync(); checkAch(); refresh(); safe(()=>V13N2.check());
}catch(e){console.error("[v13]",e)} },1800);

/* ===== v16: hàng chọn cuộn ngang được (thanh kéo riêng, bánh xe chuột, kéo thả) ===== */
(function(){
 const SEL=".v13-cats,.v14-locs,.v14-memrow", store={};
 const keyOf=el=>{ const c=el.className.split(" ")[0]; return c+":"+[...document.querySelectorAll(SEL)].filter(x=>x.className.split(" ")[0]===c).indexOf(el) };
 const barOf=el=>{ const n=el.nextElementSibling; return n&&n.classList.contains("v16-bar")?n:null };
 function upd(el){ const bar=barOf(el); if(!bar) return; const sw=el.scrollWidth, cw=el.clientWidth, can=sw>cw+6; bar.classList.toggle("on",can); if(!can) return;
  const tw=bar.clientWidth, w=Math.max(36,tw*cw/sw), x=(tw-w)*(el.scrollLeft/(sw-cw)); const t=bar.firstChild; t.style.width=w+"px"; t.style.transform="translateX("+x+"px)" }
 function deco(el){ if(el.dataset.v16){ upd(el); return } el.dataset.v16="1"; el.classList.add("v16-hs");
  const bar=document.createElement("div"); bar.className="v16-bar"; bar.innerHTML="<i></i>"; el.after(bar);
  const k=keyOf(el); if(store[k]!=null) el.scrollLeft=store[k]; else { const s=el.querySelector('[aria-selected="true"],.on'); if(s) el.scrollLeft=Math.max(0,s.offsetLeft-el.clientWidth/2+s.offsetWidth/2) }
  upd(el) }
 let raf=0; const scan=()=>{ cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{ document.querySelectorAll(".v16-bar").forEach(b=>{ const p=b.previousElementSibling; if(!p||!p.classList.contains("v16-hs")) b.remove() }); document.querySelectorAll(SEL).forEach(deco) }) };
 new MutationObserver(scan).observe(document.body,{childList:true,subtree:true}); window.addEventListener("resize",scan); scan();
 document.addEventListener("scroll",e=>{ const el=e.target; if(el&&el.matches&&el.matches(SEL)){ store[keyOf(el)]=el.scrollLeft; upd(el) } },true);
 document.addEventListener("wheel",e=>{ const el=e.target.closest&&e.target.closest(SEL); if(!el||el.scrollWidth<=el.clientWidth+2) return; if(Math.abs(e.deltaY)<=Math.abs(e.deltaX)) return; const b=el.scrollLeft; el.scrollLeft+=e.deltaY; if(el.scrollLeft!==b) e.preventDefault() },{passive:false});
 let dr=null, moved=false;
 document.addEventListener("pointerdown",e=>{ if(e.button!==0) return;
  const bar=e.target.closest&&e.target.closest(".v16-bar"); if(bar){ const el=bar.previousElementSibling, t=bar.firstChild, r=t.getBoundingClientRect(); const ratio=(el.scrollWidth-el.clientWidth)/Math.max(1,bar.clientWidth-t.offsetWidth);
   if(e.clientX<r.left||e.clientX>r.right){ el.scrollLeft+=(e.clientX-(r.left+r.width/2))*ratio; dr={bar:1,el,x:e.clientX,l:el.scrollLeft,ratio} } else dr={bar:1,el,x:e.clientX,l:el.scrollLeft,ratio}; bar.classList.add("drag"); e.preventDefault(); return }
  if(e.pointerType!=="mouse") return; const el=e.target.closest&&e.target.closest(SEL); if(!el||el.scrollWidth<=el.clientWidth+2) return; dr={el,x:e.clientX,l:el.scrollLeft}; moved=false });
 document.addEventListener("pointermove",e=>{ if(!dr) return; const dx=e.clientX-dr.x; if(dr.bar){ dr.el.scrollLeft=dr.l+dx*dr.ratio; return } if(!moved&&Math.abs(dx)>6){ moved=true; dr.el.classList.add("v16-drag") } if(moved) dr.el.scrollLeft=dr.l-dx });
 const end=()=>{ if(dr){ if(dr.bar) document.querySelectorAll(".v16-bar.drag").forEach(b=>b.classList.remove("drag")); else dr.el.classList.remove("v16-drag"); const m=moved; dr=null; if(m) setTimeout(()=>{ moved=false },0) } };
 document.addEventListener("pointerup",end); document.addEventListener("pointercancel",end);
 document.addEventListener("click",e=>{ if(moved&&e.target.closest&&e.target.closest(SEL)){ e.preventDefault(); e.stopPropagation() } },true);
})();
V.petNow=petNow; V.petSVG=()=>{ const id=petNow(); return id?A.petSVG(id,{mood:petMood(id),lv:petLv(RW().pets[id].x)}):"" };
V.ready=true; V.SHOP=SHOP; V.RW=RW; V.refresh=refresh; V.popup=popup; V.bond=bond;
})();
