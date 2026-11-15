/* Sổ luyện — v13: chặng N2.
   Nạp trước boot(): từ vựng Shin Kanzen N2 vào từ điển + danh sách từ; nếu N2 đã mở thì thêm thẻ ngữ pháp + câu hỏi N2 vào ngân hàng.
   N2 tự mở khi chỉ số sẵn sàng N3 ≥ 75% (levelReady().r[3] ≥ READY_T), hoặc người học bấm "Mở N2 sớm".
   Khi N2 chưa mở, câu hỏi N2 KHÔNG nằm trong BANK nên mọi luồng N3 giữ nguyên. */
(function(){
"use strict";
const N=window.V13N2={inj:false,vocab:false,hide:false};
const D2=window.N2D; if(!D2) return;
const LSK="so-luyen-n3-v1";
const $=(s,r)=>(r||document).querySelector(s);
const safe=(f,d)=>{try{const v=f(); return v==null?d:v}catch(e){return d}};
function lsOpen(){ try{ const s=JSON.parse(localStorage.getItem(LSK)||"null"); return !!(s&&s.n2&&s.n2.on) }catch(e){ return false } }
N.open=()=>!!(S.n2&&S.n2.on);
N.perDay=()=>Math.max(2,Math.min(20,+(S.n2&&S.n2.per)||6));
const CARD_Q={}; D2.Q.forEach(q=>{ (CARD_Q[q.kb[0]]=CARD_Q[q.kb[0]]||[]).push(q) });

function cardOf(g){
  const b=[]; g.s.forEach((s,i)=>{ if(g.s.length>1) b.push(["p","**Nghĩa "+String.fromCharCode(65+i)+"**"]);
    if(s.m||s.mj) b.push(["p","**Ý nghĩa:** "+(s.m||"")+(s.mj?" （"+s.mj+"）":"")]); if(s.c) b.push(["p","**Cách nối:** "+s.c]);
    if(s.ex&&s.ex.length) b.push(["ex",s.ex]); if(s.note) b.push(["warn",s.note]) });
  return {k:g.k,src:"n2",n:"bài "+g.u,t:g.t,rel:[],b};
}
function injectVocab(){
  if(N.vocab) return; N.vocab=true; const di={}; DIC.forEach((d,i)=>{ if(di[d[0]]==null) di[d[0]]=i }); const inWD=new Set(WD.map(x=>x[0])); let add=0;
  D2.V.forEach(v=>{ const w=v[0]; let i=di[w]; if(i==null){ i=DIC.length; DIC.push([w,v[1]||w,v[2],v[3],v[4],[]]); di[w]=i } else if(!DIC[i][3]&&v[3]) DIC[i][3]=v[3];
    if(!inWD.has(i)){ WD.push([i,0,2,"",w,0,2,3]); inWD.add(i); add++ } });
  N.vocabAdded=add; try{ _WDI=null; _DICI=null; _ORD={}; LK.idx=null }catch(e){}
}
function injectGrammar(){
  if(N.inj) return; N.inj=true;
  KB_SRC.n2="Ngữ pháp N2 — tổng hợp từ các bộ thẻ Anki N2 của bạn";
  D2.G.forEach(g=>{ if(KB_BY[g.k]) return; const c=cardOf(g); KB.push(c); KB_BY[c.k]=c });
  D2.Q.forEach(q=>{ if(BY_ID[q.id]) return; BANK.push(q); BY_ID[q.id]=q });
  try{ _SK=null; KB_SEARCH=null }catch(e){}
}
/* tạm gỡ câu N2 khỏi ngân hàng trong lúc dựng đề thi thử N3 */
function withoutN2(fn,self,args){ const kept=[]; for(let i=BANK.length-1;i>=0;i--) if(BANK[i].n2) kept.push(BANK.splice(i,1)[0]); try{ return fn.apply(self,args) } finally { kept.reverse().forEach(q=>BANK.push(q)) } }
function hidden(name){ const f=window[name]; if(typeof f!=="function") return; window[name]=function(){ const h=N.hide; N.hide=true; try{ return f.apply(this,arguments) } finally { N.hide=h } } }

function install(){
  if(N.installed) return; N.installed=true;
  const _u=window.unlocked; window.unlocked=function(q){ return q&&q.n2?(N.open()&&!N.hide):_u(q) };
  const _r=window.reachable; window.reachable=function(q,a){ return q&&q.n2?(N.open()&&!N.hide):_r(q,a) };
  ["dailyPlan","startDaily","adaptiveSet"].forEach(hidden);
  const _be=window.buildExam; if(typeof _be==="function") window.buildExam=function(){ return withoutN2(_be,this,arguments) };
  try{ MIS_MIN.n2=0.9 }catch(e){}
  const _mb=window.misBuild;
  window.misBuild=function(old){
    const h=N.hide; N.hide=true; let r; try{ r=_mb.apply(this,arguments) } finally { N.hide=h }
    try{ if(N.open()&&N.inj){ const sod=sodMs(); const done=id=>{ const s=S.srs[id]; return !!(s&&s.t>=sod) };
      const o=old&&old.tasks.find(x=>x.k==="n2"); const ids=o?o.ids.filter(done):[]; const per=N.perDay();
      const pool=D2.Q.filter(q=>!S.srs[q.id]&&!ids.includes(q.id)); const seen=new Set(ids.map(id=>BY_ID[id]&&BY_ID[id].kb[0]));
      for(const q of pool){ if(ids.length>=per) break; if(seen.has(q.kb[0])) continue; seen.add(q.kb[0]); ids.push(q.id) }
      for(const q of pool){ if(ids.length>=per) break; if(!ids.includes(q.id)) ids.push(q.id) }
      if(ids.length){ const i=r.tasks.findIndex(x=>x.k==="new"); r.tasks.splice(i>=0?i+1:Math.min(1,r.tasks.length),0,{k:"n2",t:"Ngữ pháp N2 mới",ids,n:ids.length}) } } }catch(e){ console.error("[n2]",e) }
    return r;
  };
  const _mp=window.misProg; window.misProg=function(t,mis){ if(t.k==="n2"){ const sod=sodMs(); return t.ids.filter(id=>{ const s=S.srs[id]; return s&&s.t>=sod }).length } return _mp(t,mis) };
  const _msb=window.misSub; window.misSub=function(x){ if(x.t.k==="n2") return "Mẫu ngữ pháp N2 theo thứ tự bài: điền vào câu + hỏi nghĩa. Câu sai tự vào Ôn tập như N3."; return _msb(x) };
  const _mg=window.misGo; window.misGo=function(k){ if(k!=="n2") return _mg(k);
    const x=misProgress(misToday()).list.find(e=>e.t.k==="n2"); if(!x) return; const sod=sodMs();
    const ids=x.t.ids.filter(id=>BY_ID[id]&&!(S.srs[id]&&S.srs[id].t>=sod)); if(!ids.length) return toast("Phần này đã xong");
    return startSession(ids.map(id=>BY_ID[id]),{mode:"practice",title:"Nhiệm vụ: Ngữ pháp N2",from:"today"}) };
  const _kl=window.kbLabel; window.kbLabel=function(c){ return c&&c.src==="n2"?"Ngữ pháp N2 · "+c.n:_kl(c) };
  const _kc=window.kbCite; window.kbCite=function(c){ return c&&c.src==="n2"?"Tổng hợp từ các bộ thẻ Anki ngữ pháp N2 bạn đã cung cấp (Kanzen Master / Try N2); ví dụ và nghĩa giữ theo thẻ gốc.":_kc(c) };
  const _fp=window.filterPool; window.filterPool=function(){ const r=_fp(); if(P.scope==="N2") return r.filter(q=>q.lv==="N2"); if(P.scope==="all"||P.scope==="learned"||P.scope==="week") return r.filter(q=>!q.n2); return r };
  const _rp=window.renderPractice; window.renderPractice=function(m){ if(P.scope==="N2"&&!N.inj) P.scope="learned"; const out=_rp.apply(this,arguments);
    try{ const sel=$("#scopeSel",m); if(sel&&N.inj&&!sel.querySelector('option[value="N2"]')){ const o=document.createElement("option"); o.value="N2"; o.textContent="Toàn bộ N2 (ngữ pháp)"; const a=sel.querySelector('option[value="all"]'); sel.insertBefore(o,a); if(P.scope==="N2") sel.value="N2" } }catch(e){} return out };
  const _rk=window.renderKB; window.renderKB=function(m){ if(KBV.src==="n2"&&!N.inj) KBV.src="all"; const out=_rk.apply(this,arguments);
    try{ const sel=$("#kbs",m); if(sel&&N.inj&&!sel.querySelector('option[value="n2"]')){ const o=document.createElement("option"); o.value="n2"; o.textContent="Ngữ pháp N2"; sel.appendChild(o); if(KBV.src==="n2") sel.value="n2" } }catch(e){} return out };
}
window.V13_PRE=function(){ install(); injectVocab(); if(lsOpen()) injectGrammar() };

/* ---------- tiến độ ---------- */
function readiness(){ return safe(()=>{ const R=levelReady(); return {r:R.r[3],pct:Math.round(Math.min(1,R.r[3]/READY_T)*100),ok:R.r[3]>=READY_T} },{r:0,pct:0,ok:false}) }
function progress(){
  let seen=0, firm=0; D2.G.forEach(g=>{ const qs=CARD_Q[g.k]||[]; const ss=qs.map(q=>S.srs[q.id]).filter(Boolean); if(ss.length){ seen++; if(ss.some(s=>s.b>=3)) firm++ } });
  const withQ=D2.G.filter(g=>(CARD_Q[g.k]||[]).length).length; const due=safe(()=>dueList().filter(id=>BY_ID[id]&&BY_ID[id].n2).length,0);
  const L=safe(()=>levelStats(2),{total:0,known:0,seen:0}); return {seen,firm,total:withQ,cards:D2.G.length,due,L,left:D2.Q.filter(q=>!S.srs[q.id]).length};
}
function rebuildToday(){ try{ const m=(S.mis||{})[TODAY]; if(m&&!m.doneAt) S.mis[TODAY]=misBuild(m) }catch(e){} }
function openN2(how){
  S.n2=Object.assign({},S.n2,{on:1,t:Date.now(),how}); injectGrammar(); rebuildToday(); markDirty(); render();
  const b=window.V12?V12.buddySVG("sparkle"):""; const nm=window.V12?esc(V12.rawName()):"Mình";
  const body=kxModal(`<div class="v13-pop">${b}<div class="eyebrow">N2への扉が開いた！</div><h2>Đã mở chặng N2</h2><p>${how==="auto"?"Chỉ số sẵn sàng N3 của bạn đã vượt mốc 75% — bạn chắc N3 rồi đó!":"Bạn đã chọn mở N2 sớm. Nhiệm vụ N3 vẫn giữ nguyên, N2 chỉ thêm vào."} Từ giờ mỗi ngày có thêm nhiệm vụ <b>Ngữ pháp N2 mới</b> (${D2.G.length} mẫu, ${D2.Q.length} câu), thẻ N2 trong tab Kiến thức và ${safe(()=>levelStats(2).total,0).toLocaleString("vi-VN")} từ N2. ${nm} sẽ đi cùng bạn tới N2 nhé!</p><div class="row"><button class="btn primary" data-n2="learn" data-kxclose>Học thử 10 câu N2</button><button class="btn" data-kxclose>Để sau</button></div></div>`,"v13-dlg");
  safe(()=>V12.sfx.done()); safe(()=>V12.confetti(48)); setTimeout(()=>safe(()=>V13.checkAch()),1500); return body;
}
N.check=function(){ if(N.open()||safe(()=>V12.inFocus(),false)||document.getElementById("kxmodal")) return; const r=readiness(); if(r.ok) openN2("auto") };
function learn(n){
  if(!N.open()) return; const seen=new Set(); const items=[]; const pool=D2.Q.filter(q=>!S.srs[q.id]);
  for(const q of pool){ if(items.length>=n) break; if(seen.has(q.kb[0])) continue; seen.add(q.kb[0]); items.push(q) }
  for(const q of pool){ if(items.length>=n) break; if(!items.includes(q)) items.push(q) }
  if(!items.length) return toast("Bạn đã gặp hết câu N2 — vào Ôn tập để giữ nhịp nhé!");
  startSession(items,{mode:"practice",title:"Ngữ pháp N2 mới",from:"plan"});
}
function review(){ const ids=dueList().filter(id=>BY_ID[id]&&BY_ID[id].n2); if(!ids.length) return toast("Chưa có câu N2 đến hạn ôn"); startSession(shuffle(ids).slice(0,30).map(id=>BY_ID[id]),{mode:"practice",title:"Ôn N2 đến hạn",from:"plan"}) }

/* ---------- thẻ N2 (trang Hôm nay + Lộ trình) ---------- */
function cardHTML(){
  if(!N.open()){ const r=readiness();
    return `<div class="lv">N2</div><div><h3>🔒 Chặng tiếp theo: N2</h3><p>N2 tự mở khi bạn đã chắc N3 (chỉ số sẵn sàng N3 đạt 75%). Đã sẵn: <b>${D2.G.length}</b> mẫu ngữ pháp, <b>${D2.Q.length}</b> câu luyện, <b>${D2.V.length.toLocaleString("vi-VN")}</b> từ Shin Kanzen N2.</p>
      <div class="v13-bond"><span>Tiến tới mốc “chắc N3”: <b>${r.pct}%</b></span><i><u style="width:${r.pct}%"></u></i></div>
      <div class="row" style="margin-top:10px"><button type="button" class="btn small" data-n2="peek">Xem trước nội dung</button><button type="button" class="btn small ghost" data-n2="early">Mở N2 sớm</button></div></div>` }
  const p=progress(); const lv2=safe(()=>targetLv()===2,false); const pg=p.total?Math.round(100*p.seen/p.total):0, pv=p.L.total?Math.round(100*p.L.known/p.L.total):0;
  return `<div class="lv">N2</div><div><h3>Chặng N2 đang mở</h3><p>Học giống hệt N3: câu mới mỗi ngày → sai thì vào Ôn tập → ôn theo lịch 1 · 3 · 7 · 21 ngày.</p>
    <div class="v13-bond"><span>Ngữ pháp: đã gặp <b>${p.seen}/${p.total}</b> mẫu · nắm chắc ${p.firm}</span><i><u style="width:${pg}%"></u></i></div>
    <div class="v13-bond" style="margin-top:6px"><span>Từ vựng N2: đã thuộc <b>${p.L.known.toLocaleString("vi-VN")}/${p.L.total.toLocaleString("vi-VN")}</b></span><i><u style="width:${pv}%"></u></i></div>
    <div class="row" style="margin-top:10px"><button type="button" class="btn small primary" data-n2="learn">Học 10 câu N2 mới</button>${p.due?`<button type="button" class="btn small" data-n2="review">Ôn ${p.due} câu N2 đến hạn</button>`:""}<button type="button" class="btn small" data-n2="cards">Thẻ ngữ pháp N2</button><button type="button" class="btn small" data-n2="scan">Quét nhanh từ N2</button><button type="button" class="btn small ghost" data-n2="lock" title="Ẩn nội dung N2; tiến độ N2 đã học vẫn giữ">Tạm khoá N2</button></div>
    <div class="row small" style="margin-top:8px;gap:6px;align-items:center"><span class="muted">Từ mới mỗi ngày lấy từ:</span><span class="seg"><button type="button" aria-pressed="${!lv2}" data-n2="lv3">N3 trước</button><button type="button" aria-pressed="${lv2}" data-n2="lv2">N2 trước</button></span>
      <span class="muted">· Ngữ pháp N2 mới/ngày:</span><span class="seg">${[4,6,10].map(n=>`<button type="button" aria-pressed="${N.perDay()===n}" data-n2="per:${n}">${n}</button>`).join("")}</span></div></div>`;
}
N.after=function(){
  if(N.open()&&!N.inj){ injectGrammar(); rebuildToday(); return setTimeout(()=>safe(()=>render()),0) }
  const m=$("#main"); if(!m||(view!=="today"&&view!=="plan")) return;
  let c=$(".v13-n2card",m); if(!c){ c=document.createElement("section"); c.className="sheet v13-n2card"; if(view==="plan") m.prepend(c); else { const a=$(".v13-corner",m)||$(".v13-daily",m)||$(".v12-hero",m); if(a) a.after(c); else m.appendChild(c) } }
  c.classList.toggle("locked",!N.open()); c.innerHTML=cardHTML();
};
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-n2]"); if(!b) return; const a=b.dataset.n2;
  if(a==="early"){ kxModal(`<div class="v13-pop"><div class="eyebrow">Mở N2 sớm?</div><h2>Bạn chưa đạt mốc “chắc N3”</h2><p>Mở sớm thì mỗi ngày sẽ có thêm một nhiệm vụ <b>Ngữ pháp N2 mới</b> bên cạnh nhiệm vụ N3 (không thay thế). Nếu thấy quá tải, bạn có thể khoá lại bất cứ lúc nào ở thẻ N2 trong tab Lộ trình — tiến độ N2 đã học vẫn được giữ.</p><div class="row"><button class="btn primary" data-n2="early-yes" data-kxclose>Mở N2 ngay</button><button class="btn" data-kxclose>Để khi chắc N3</button></div></div>`,"v13-dlg"); return }
  if(a==="early-yes") return setTimeout(()=>openN2("early"),50);
  if(a==="peek"){ kxModal(`<div class="eyebrow">Xem trước N2</div><h2 style="font-size:19px;margin:4px 0 8px">${D2.G.length} mẫu ngữ pháp · ${D2.Q.length} câu luyện · ${D2.V.length.toLocaleString("vi-VN")} từ</h2><p class="small muted" style="margin:0 0 8px">Vài mẫu đầu tiên bạn sẽ học:</p><div class="v13-n2list">${D2.G.slice(0,10).map(g=>`<div class="lkgr"><b class="jp">${esc(g.t)}</b> — ${esc(g.s[0].m||"")}${g.s[0].ex&&g.s[0].ex[0]?`<div class="jp small" style="margin-top:2px">${esc(g.s[0].ex[0][0])}</div><div class="small muted">${esc(g.s[0].ex[0][1]||"")}</div>`:""}</div>`).join("")}</div>`); return }
  if(a==="learn") return learn(10);
  if(a==="review") return review();
  if(a==="cards"){ KBV.src="n2"; KBV.q=""; return go("kb") }
  if(a==="scan") return safe(()=>{ vsScan(2); if(typeof vsFrom==="function") vsFrom() });
  if(a==="lv2"||a==="lv3"){ setCo({lv:a==="lv2"?2:3}); toast(a==="lv2"?"Từ mới mỗi ngày sẽ lấy từ danh sách N2 trước":"Từ mới mỗi ngày lấy từ N3 trước, hết mới sang N2"); return render() }
  if(a.startsWith("per:")){ S.n2=Object.assign({},S.n2,{per:+a.slice(4)}); rebuildToday(); markDirty(); return render() }
  if(a==="lock"){ S.n2=Object.assign({},S.n2,{on:0}); markDirty(); try{ lsWrite() }catch(x){} return location.reload() }
});
})();
