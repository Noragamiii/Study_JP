/* Sổ luyện N3 — v11 phần 2: câu hỏi, shadowing, kanji, trò chơi, kiến thức, hôm nay */
(function(){
"use strict";
const V=window.V11; const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const LS_AR="so-luyen-n3-ar";
const AR=()=>{try{return localStorage.getItem(LS_AR)==="1"}catch(e){return false}};
const setAR=v=>{try{localStorage.setItem(LS_AR,v?"1":"0")}catch(e){}};

/* ---------- 3. CÂU HỎI: che phương án (nhớ chủ động) ---------- */
const _renderQuiz=window.renderQuiz;
window.renderQuiz=function(m){
  _renderQuiz(m);
  const s=session; if(!s||s.done) return; const q=s.items[s.i]; const checked=s.checked[s.i]; const exam=s.mode==="exam";
  const foot=m.querySelector(".qfoot .kbd");
  if(foot&&!exam) foot.insertAdjacentHTML("beforeend",` · <button class="lkbtn" data-v11="ar" title="Che phương án để tự nghĩ đáp án trước — nhớ chủ động">👁 Che phương án: ${AR()?"bật":"tắt"}</button>`);
  if(AR()&&!checked&&!exam&&q.sec!=="chokai"&&!(s._rev&&s._rev[s.i])){
    const opts=m.querySelector("#opts"); if(!opts) return;
    const wrap=document.createElement("div"); wrap.className="v11-cover"; opts.parentNode.insertBefore(wrap,opts); wrap.appendChild(opts);
    wrap.insertAdjacentHTML("beforeend",`<div class="ov"><b>Tự nghĩ đáp án trước</b><span class="small muted">Đọc câu, đoán chỗ trống cần dạng gì / nghĩa gì, rồi mới mở phương án. Nhớ chủ động giúp nhớ lâu gấp đôi so với đọc đáp án.</span><button class="btn primary small" data-v11="reveal">Hiện phương án (phím Space)</button></div>`);
  }
};
function reveal(){ const s=session; if(!s) return; s._rev=s._rev||{}; s._rev[s.i]=true; const c=$(".v11-cover"); if(c){ const ov=c.querySelector(".ov"); if(ov) ov.remove() } }
document.addEventListener("keydown",e=>{ if(!session||session.done||!(view==="quiz")) return; if(e.target.closest&&e.target.closest("select,input,textarea")) return;
  if($(".v11-cover .ov")&&((e.key>="1"&&e.key<="4")||e.key===" ")){ e.preventDefault(); e.stopImmediatePropagation(); reveal() } },true);

/* ---------- Ngữ pháp dễ nhầm → thêm vào ngân hàng câu ---------- */
const CONF=window.V11_CONF||[]; const CF_BY={};
CONF.forEach(c=>{ CF_BY[c.id]=c; c.quiz.forEach((z,i)=>{ const id="cf-"+c.id+"-"+(i+1); if(BY_ID[id]) return;
  const q={id,sec:c.id==="youhou"?"youhou":c.id==="narabe"?"narabe":"bunpou",lv:"N3",wk:1,tag:c.t,q:z.q,opts:z.opts,a:z.a,ex:z.ex,pt:"g|cf-"+c.id,gen:"cf",cf:c.id,noshuf:c.id==="narabe"};
  BANK.push(q); BY_ID[id]=q; }); });
try{ _SK=null }catch(e){}
function cfItems(id){ return BANK.filter(q=>q.cf===id) }
function startConf(id){ const items=id?cfItems(id):shuffle(BANK.filter(q=>q.cf)).slice(0,12); if(!items.length) return; startSession(items,{mode:"practice",title:id?"Dễ nhầm · "+CF_BY[id].t:"Ngữ pháp dễ nhầm (trộn)",from:"kb"}) }
V.startConf=startConf;

/* ---------- 4. SHADOWING ---------- */
const SHD=window.SHD||[], TS=window.SHD_TS||{}; const LS_SH="so-luyen-n3-shadow";
let SP=(()=>{try{return Object.assign({rate:1,mode:"sub",hideJp:false,hideVi:false,showRd:true,auto:true},JSON.parse(localStorage.getItem(LS_SH)||"{}"))}catch(e){return {rate:1,mode:"sub",hideJp:false,hideVi:false,showRd:true,auto:true}}})();
const spSave=()=>{try{localStorage.setItem(LS_SH,JSON.stringify(SP))}catch(e){}};
let P=null; // phiên đang mở
function shStat(id){ return (S.sh||{})[id]||{n:0,best:0} }
function shMark(id,p){ S.sh=S.sh||{}; const v=S.sh[id]||{n:0,best:0}; Object.assign(v,p); v.t=Date.now(); S.sh[id]=v; markDirty() }
function ytLessons(){ return (window.SHD_YT||[]).concat(S.yt||[]) }
function lessonOf(id){ return SHD.find(l=>l.id===id)||ytLessons().find(l=>l.id===id) }
function ytId(u){ const m=String(u||"").match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/)||String(u||"").match(/^([A-Za-z0-9_-]{11})$/); return m?m[1]:"" }
function parseTranscript(txt,viTxt){
  const lines=String(txt||"").split(/\r?\n/).map(s=>s.trim()).filter(Boolean); const out=[]; let pend=null;
  const T=/^(?:(\d+):)?(\d{1,2}):(\d{2})(?:[.,](\d+))?$/;
  const toSec=m=>(+(m[1]||0))*3600+(+m[2])*60+(+m[3]);
  for(const ln of lines){
    let m=ln.match(T); if(m){ pend=toSec(m); continue }
    m=ln.match(/^(?:(\d+):)?(\d{1,2}):(\d{2})(?:[.,]\d+)?\s*(?:-->\s*[\d:.,]+)?\s+(.+)$/); if(m){ out.push([toSec(m),m[4].trim(),""]); pend=null; continue }
    if(/^\d+$/.test(ln)||/-->/.test(ln)) continue;
    if(pend!=null){ out.push([pend,ln,""]); pend=null } else if(out.length){ out[out.length-1][1]+=ln } else out.push([0,ln,""]);
  }
  const vi=String(viTxt||"").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  out.forEach((l,i)=>{ const sp=l[1].split(/\s*\|\|\|\s*/); if(sp.length>1){l[1]=sp[0]; l[2]=sp[1]} else if(vi[i]) l[2]=vi[i] });
  return out;
}
V.parseTranscript=parseTranscript;
function linesOf(L){ if(L.lines[0]&&typeof L.lines[0][0]==="number") return L.lines.map(([t,jp,vi],i)=>({s:t,e:(L.lines[i+1]?L.lines[i+1][0]:t+6),jp,vi:vi||"",rd:"",spk:""})); const ts=TS[L.id]||[]; return L.lines.map(([spk,jp,rd,vi],i)=>({s:ts[i]?ts[i][0]:i*5,e:ts[i]?ts[i][1]:i*5+4.5,jp,rd,vi,spk})) }
function clozeWord(jp){ const toks=V.tokenize(jp).filter(k=>k.ty==="w"&&k.s.length>=2); if(!toks.length) return null; toks.sort((a,b)=>([...b.s].filter(isKj).length-[...a.s].filter(isKj).length)||(b.s.length-a.s.length)); return toks[0].s }
function norm(s){ return String(s||"").replace(/[、。！？!?,.「」『』（）()・…〜～：:；;　\s]/g,"").replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-96)) }
function hubHTML(){
  const cats=[...new Set(SHD.map(l=>l.cat))]; const yl=ytLessons();
  const card=L=>{ const st=shStat(L.id); return `<button class="ltype" style="text-align:left;cursor:pointer" data-v11="shopen" data-id="${esc(L.id)}"><div class="row" style="justify-content:space-between"><b>${esc(L.t)}</b><span class="chip ${st.n?"ok":"plain"}">${st.n?"đã nghe "+st.n+" lần":"mới"}</span></div><div class="small muted">${esc(L.desc||"")}</div><div class="small"><span class="chip plain">${esc(L.cat||"YouTube")}</span> <span class="chip plain">${esc(L.lv||"")}</span> ${L.lines.length} câu${L.vid?" · ▶ YouTube":""}</div></button>` };
  return `<section class="sheet" id="v11sh">
    <div class="eyebrow">Shadowing · nói đuổi theo</div>
    <h2 style="font-size:18px;margin:4px 0 6px">${SHD.length} bài hội thoại & độc thoại N3 có phụ đề song ngữ${yl.length?` + ${yl.length} video YouTube`:""}</h2>
    <p class="note" style="margin:0 0 10px">Mỗi bài có 4 chế độ: <b>Phụ đề</b> (nghe – nhìn – bấm câu để nghe lại), <b>Shadowing</b> (máy dừng sau mỗi câu để bạn nói theo), <b>Chính tả</b> (nghe rồi gõ lại), <b>Điền từ</b> (nghe rồi điền từ bị che). Có nút ghi âm giọng mình để so với bản gốc. Chủ đề: công việc IT, văn phòng, đời sống — đúng dạng 聴解.</p>
    <div class="lgrid">${SHD.map(card).join("")}</div>
    ${yl.length?`<div class="eyebrow" style="margin-top:14px">Video YouTube của bạn</div><div class="lgrid">${yl.map(card).join("")}</div>`:""}
    <details style="margin-top:12px"><summary style="font-weight:600;cursor:pointer">＋ Thêm video YouTube (dán link + bản chép lời)</summary>
      <div class="small muted" style="margin:6px 0">Trình duyệt không tự lấy được phụ đề của YouTube, nên bạn làm 2 bước: (1) dán link video; (2) trên YouTube bấm <b>… → Hiển thị bản chép lời</b> (Show transcript), bôi đen toàn bộ rồi dán vào ô dưới (dạng "0:05" rồi dòng chữ, hoặc "0:05 chữ"). Sổ luyện tự tách câu theo mốc thời gian và dịch nháp từng câu. Muốn bản dịch chuẩn hơn: dán thêm bản dịch tiếng Việt mỗi câu một dòng, hoặc gửi link cho Claude trong chat để Claude soạn phụ đề + dịch rồi thêm vào app.</div>
      <div class="formgrid"><div class="field"><span class="lab">Link YouTube</span><input id="v11ytUrl" placeholder="https://www.youtube.com/watch?v=…"></div><div class="field"><span class="lab">Tên bài</span><input id="v11ytTitle" placeholder="VD: Hội thoại ở quán cà phê"></div></div>
      <div class="field" style="margin-top:6px"><span class="lab">Bản chép lời (transcript)</span><textarea id="v11ytTr" rows="6" placeholder="0:00\nこんにちは、今日は天気がいいですね。\n0:04\nそうですね。"></textarea></div>
      <div class="field" style="margin-top:6px"><span class="lab">Bản dịch tiếng Việt (tuỳ chọn, mỗi câu một dòng)</span><textarea id="v11ytVi" rows="3" placeholder="Xin chào, hôm nay trời đẹp nhỉ.\nĐúng vậy."></textarea></div>
      <div class="row" style="gap:6px;margin-top:8px"><button class="btn primary small" data-v11="ytadd">Thêm bài</button><span class="small muted">Video phát qua YouTube nên cần mạng; phụ đề và bản dịch lưu trong sổ.</span></div>
    </details></section>`;
}
function playerHTML(L){
  const lines=linesOf(L); const yt=!!L.vid; const st=shStat(L.id);
  const modeBtn=(k,t)=>`<button class="btn small" data-v11="shmode" data-m="${k}" aria-pressed="${SP.mode===k}">${t}</button>`;
  const lineHTML=(l,i)=>{ const cls=["v11-line",P.i===i?"cur":"",SP.hideJp&&SP.mode==="sub"?"hidejp":"",SP.hideVi&&SP.mode==="sub"?"hidevi":""].join(" ");
    let jp=esc(l.jp); const hidden=SP.mode==="dict"||(SP.mode==="shadow"&&SP.hideJp);
    if(SP.mode==="cloze"){ const w=P.cloze[i]; if(w){ const r=P.done[i]; jp=esc(l.jp).replace(esc(w),r?`<u>${esc(w)}</u>`:`<u>${"＿".repeat(Math.min(6,Math.max(2,w.length)))}</u>`) } }
    const vi=l.vi||(yt?"<i class='muted'>"+esc(V.draft(V.tokenize(l.jp)))+"</i> <span class='chip plain'>dịch nháp</span>":"");
    return `<div class="${cls}" data-v11="shline" data-i="${i}"><div class="t">${fmt(l.s)}${l.spk?"<br>"+esc(({M:"男",F:"女",N:"Dẫn"})[l.spk]||l.spk):""}</div><div>
      ${hidden&&!P.done[i]?`<div class="jp muted">（nghe rồi gõ lại — ${P.done[i]?"":"ẩn"}）</div>`:`<div class="jp ${SP.mode==="cloze"?"blank":""}">${jp}</div>${SP.showRd&&l.rd&&l.rd!==l.jp?`<div class="rd">${esc(l.rd)}</div>`:""}`}
      ${SP.mode==="sub"||P.done[i]?`<div class="vi">${vi}</div>`:""}
      ${(SP.mode==="dict"||SP.mode==="cloze")&&P.i===i?`<div class="row" style="gap:6px;margin-top:6px"><input class="jp" id="v11in" placeholder="${SP.mode==="dict"?"Gõ câu vừa nghe (kana hoặc kanji đều được)":"Điền từ bị che"}" autocomplete="off" style="flex:1;min-width:160px"><button class="btn primary small" data-v11="shcheck">Kiểm tra</button></div><div class="small" id="v11fb"></div>`:""}
    </div></div>` };
  return `<section class="sheet">
    <div class="row" style="justify-content:space-between;gap:8px"><button class="btn ghost small" data-v11="shback">← Danh sách</button><span class="small muted">${esc(L.cat||"YouTube")} · ${esc(L.lv||"")} · nghe ${st.n} lần</span></div>
    <h2 style="font-size:18px;margin:6px 0 4px">${esc(L.t)}</h2><p class="small muted" style="margin:0 0 8px">${esc(L.desc||"")}</p>
    ${yt?`<div class="v11-yt"><iframe id="v11ytf" src="https://www.youtube-nocookie.com/embed/${esc(L.vid)}?enablejsapi=1&playsinline=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`:`<audio id="v11au" controls preload="auto" src="${esc(L.au||"audio/"+L.id+".mp3")}" style="width:100%"></audio>`}
    <div class="v11-ctl v11-modes">${modeBtn("sub","Phụ đề")}${modeBtn("shadow","Shadowing")}${modeBtn("dict","Chính tả")}${modeBtn("cloze","Điền từ")}</div>
    <div class="v11-ctl"><span class="small muted">Tốc độ</span>${[0.7,0.85,1,1.15].map(r=>`<button class="kbchip ${SP.rate===r?"on":""}" data-v11="shrate" data-r="${r}">${r}×</button>`).join("")}
      <button class="kbchip ${P.loop?"on":""}" data-v11="shloop">🔁 lặp câu</button>
      ${SP.mode==="sub"?`<button class="kbchip ${SP.hideJp?"on":""}" data-v11="shtog" data-k="hideJp">ẩn tiếng Nhật</button><button class="kbchip ${SP.hideVi?"on":""}" data-v11="shtog" data-k="hideVi">ẩn tiếng Việt</button>`:""}
      ${SP.mode==="shadow"?`<button class="kbchip ${SP.hideJp?"on":""}" data-v11="shtog" data-k="hideJp">không nhìn chữ</button><button class="kbchip ${SP.auto?"on":""}" data-v11="shtog" data-k="auto">tự tiếp sau khi dừng</button>`:""}
      ${lines.some(l=>l.rd)?`<button class="kbchip ${SP.showRd?"on":""}" data-v11="shtog" data-k="showRd">cách đọc</button>`:""}
      <span class="v11-rec"><button class="kbchip" data-v11="shrec" id="v11rec">🎙 ghi âm giọng mình</button><span id="v11recout"></span></span></div>
    ${SP.mode==="shadow"?`<div class="v11-tip">Shadowing: máy phát từng câu rồi <b>dừng</b>. Bạn nói đuổi theo đúng ngữ điệu, bấm vào câu hoặc phím <b>→</b> để sang câu sau, <b>R</b> để nghe lại. Lần 1 nhìn chữ, lần 2–3 bật "không nhìn chữ".</div>`:SP.mode==="dict"?`<div class="v11-tip">Chính tả: nghe câu đang chọn (bấm câu hoặc phím R), gõ lại rồi Kiểm tra. Gõ kana hay kanji đều được chấp nhận. Chỗ sai sẽ được tô đỏ.</div>`:SP.mode==="cloze"?`<div class="v11-tip">Điền từ: mỗi câu bị che một từ quan trọng. Nghe rồi điền từ (kanji hoặc cách đọc). Đúng → câu hiện đầy đủ kèm bản dịch.</div>`:`<div class="v11-tip">Phụ đề: bấm vào câu để nghe lại đúng câu đó. Phím ←/→ chuyển câu, R nghe lại, Space phát/dừng. Bôi đen chữ Nhật để tra từ.</div>`}
    <div class="v11-sub" id="v11lines">${lines.map(lineHTML).join("")}</div>
    ${L.voc&&L.voc.length?`<details class="kbcard" style="margin-top:10px"><summary><span class="kbsrc">語彙</span><span class="kbtitle">Từ cần nhớ</span></summary><div class="kbbody"><div class="tablewrap"><table class="kbtable"><tbody>${L.voc.map(([w,r,m])=>`<tr><td class="jp nw">${esc(w)}</td><td class="jp nw">${esc(r)}</td><td>${esc(m)}</td></tr>`).join("")}</tbody></table></div></div></details>`:""}
    ${L.gr&&L.gr.length?`<details class="kbcard"><summary><span class="kbsrc">文法</span><span class="kbtitle">Ngữ pháp trong bài</span></summary><div class="kbbody">${L.gr.map(([p,d])=>`<div class="v11-gr"><b class="jp">${esc(p)}</b> — ${esc(d)}</div>`).join("")}</div></details>`:""}
    ${yt&&(S.yt||[]).some(x=>x.id===L.id)?`<div class="row" style="margin-top:10px"><button class="btn ghost small" data-v11="ytdel" data-id="${esc(L.id)}">Xóa bài này</button></div>`:""}
  </section>`;
}
const fmt=s=>{s=Math.max(0,Math.floor(s)); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
/* điều khiển phát */
const YT={ready:false,t:0,playing:false};
function ytCmd(func,args){ const f=$("#v11ytf"); if(!f||!f.contentWindow) return; f.contentWindow.postMessage(JSON.stringify({event:"command",func,args:args||[]}),"*") }
window.addEventListener("message",e=>{ if(!/youtube/.test(e.origin)) return; let d; try{d=typeof e.data==="string"?JSON.parse(e.data):e.data}catch(x){return} if(!d) return;
  if(d.event==="onReady"||d.event==="initialDelivery"){ YT.ready=true; ytCmd("setPlaybackRate",[SP.rate]) }
  if(d.event==="infoDelivery"&&d.info){ if(d.info.currentTime!=null){ YT.t=d.info.currentTime; onTime(YT.t) } if(d.info.playerState!=null) YT.playing=d.info.playerState===1 } });
function ytListen(){ const f=$("#v11ytf"); if(!f) return; const send=()=>{ try{ f.contentWindow.postMessage(JSON.stringify({event:"listening",id:1,channel:"widget"}),"*") }catch(x){} }; f.addEventListener("load",()=>{send(); setTimeout(send,800)}); setTimeout(send,1200) }
function cur(){ return P&&P.yt?YT.t:($("#v11au")||{}).currentTime||0 }
function seek(t,play){ if(!P) return; if(P.yt){ ytCmd("seekTo",[t,true]); if(play) ytCmd("playVideo") } else { const a=$("#v11au"); if(!a) return; a.currentTime=t; if(play) a.play().catch(()=>{}) } }
function pause(){ if(!P) return; if(P.yt) ytCmd("pauseVideo"); else { const a=$("#v11au"); if(a) a.pause() } }
function playLine(i){ if(!P) return; const l=P.lines[i]; if(!l) return; P.i=i; P.stopAt=l.e; P.lineStart=l.s; paintCur(); seek(l.s,true); $$(".v11-line")[i]&&$$(".v11-line")[i].scrollIntoView({block:"nearest",behavior:"smooth"}); if(SP.mode==="dict"||SP.mode==="cloze"){ const inp=$("#v11in"); if(inp) setTimeout(()=>inp.focus(),50) } }
function paintCur(){ $$(".v11-line").forEach((el,i)=>el.classList.toggle("cur",i===P.i)) }
function onTime(t){ if(!P) return;
  const lines=P.lines; const idx=lines.findIndex(l=>t>=l.s&&t<l.e);
  if(P.stopAt!=null&&t>=P.stopAt-0.05){ if(P.loop){ seek(P.lineStart,true); return } if(SP.mode==="shadow"||SP.mode==="dict"||SP.mode==="cloze"){ pause(); P.stopAt=null; if(SP.mode==="shadow"&&SP.auto){ const l=lines[P.i]; clearTimeout(P.autoT); P.autoT=setTimeout(()=>{ if(P&&SP.mode==="shadow"&&P.i<lines.length-1) playLine(P.i+1); else if(P&&P.i>=lines.length-1) finishLesson() },Math.max(1200,(l.e-l.s)*1300/SP.rate)) } return } P.stopAt=null }
  if(SP.mode==="sub"&&idx>=0&&idx!==P.i){ P.i=idx; paintCur() }
  if(SP.mode==="sub"&&t>=lines[lines.length-1].e-0.1&&!P.fin){ P.fin=true; finishLesson() }
}
function finishLesson(){ if(!P) return; shMark(P.id,{n:shStat(P.id).n+1}); toast("Đã nghe xong một lượt — giờ thử chế độ Shadowing hoặc Chính tả nhé") }
function wirePlayer(m){
  if(P.yt) ytListen(); else { const a=$("#v11au"); if(a){ try{a.playbackRate=SP.rate; a.preservesPitch=true}catch(e){} a.addEventListener("timeupdate",()=>onTime(a.currentTime)); a.addEventListener("play",()=>{try{a.playbackRate=SP.rate}catch(e){}}) } }
  const inp=$("#v11in"); if(inp) inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); checkInput() } });
}
function checkInput(){ const inp=$("#v11in"); const fb=$("#v11fb"); if(!inp||!P) return; const l=P.lines[P.i]; const v=inp.value.trim(); if(!v) return;
  let ok=false, ans="";
  if(SP.mode==="dict"){ const a=norm(l.jp), b=norm(l.rd||""), u=norm(v); ok=u===a||(b&&u===b); ans=l.jp; if(!ok){ let h=""; const ref=/[一-鿿]/.test(v)||!b?a:b; for(let i=0;i<Math.max(ref.length,u.length);i++){ const c=u[i]||""; h+=c===ref[i]?esc(c):`<span style="color:var(--bad);text-decoration:underline">${esc(c||"_")}</span>` } fb.innerHTML=`<div>Bạn gõ: <span class="jp">${h}</span></div><div>Đúng là: <span class="jp" style="color:var(--ok)">${esc(l.jp)}</span>${l.rd?` <span class="jp muted small">${esc(l.rd)}</span>`:""}</div><div class="muted">${esc(l.vi||"")}</div>`; P.miss++; } }
  else { const w=P.cloze[P.i]; const t=V.tokenize(w)[0]; const rd=t&&t.ty==="w"?t.e[1]:""; ok=norm(v)===norm(w)||(rd&&norm(v)===norm(rd)); ans=w; if(!ok){ fb.innerHTML=`<span style="color:var(--bad)">Chưa đúng.</span> Từ bị che: <span class="jp" style="color:var(--ok)">${esc(w)}</span>${rd?` (${esc(rd)})`:""}. Nghe lại rồi thử câu sau.`; P.miss++ } }
  if(ok){ P.done[P.i]=true; P.hit++; toast("Đúng rồi ✓"); if(P.i<P.lines.length-1){ P.i++; renderPlayer(); playLine(P.i) } else { renderPlayer(); const sc=Math.round(P.hit*100/(P.hit+P.miss)); shMark(P.id,{n:shStat(P.id).n+1,best:Math.max(shStat(P.id).best||0,sc)}); toast(`Xong bài: đúng ${P.hit}/${P.hit+P.miss} câu ngay lần đầu (${sc}%)`) } }
  else { P.done[P.i]=false; }
}
function openLesson(id){ const L=lessonOf(id); if(!L) return; const lines=linesOf(L); P={id,L,lines,i:0,yt:!!L.vid,loop:false,done:{},hit:0,miss:0,cloze:lines.map(l=>clozeWord(l.jp))}; YT.ready=false; YT.t=0; renderPlayer(); window.scrollTo({top:0}) }
function renderPlayer(){ const m=$("#main"); if(!m||!P) return; m.innerHTML=playerHTML(P.L); wirePlayer(m) }
const _renderListen=window.renderListen;
window.renderListen=function(m){ if(P&&view==="listen"){ renderPlayer(); return } _renderListen(m); const first=m.querySelector("#lview section.sheet"); if(first) first.insertAdjacentHTML("afterend",hubHTML()) };
let REC=null, RECB=[];
async function toggleRec(){ const btn=$("#v11rec"), out=$("#v11recout"); if(REC){ REC.stop(); return }
  try{ const st=await navigator.mediaDevices.getUserMedia({audio:true}); REC=new MediaRecorder(st); RECB=[]; REC.ondataavailable=e=>RECB.push(e.data); REC.onstop=()=>{ st.getTracks().forEach(t=>t.stop()); const b=new Blob(RECB,{type:REC.mimeType||"audio/webm"}); const u=URL.createObjectURL(b); out.innerHTML=`<audio controls src="${u}" style="height:30px;vertical-align:middle"></audio>`; REC=null; btn.textContent="🎙 ghi âm giọng mình"; btn.classList.remove("on") }; REC.start(); btn.textContent="⏹ dừng ghi"; btn.classList.add("on"); out.textContent="đang ghi…" }
  catch(e){ toast("Không mở được micro (cần cho phép trình duyệt dùng micro)") } }
document.addEventListener("click",e=>{ const b=e.target.closest("[data-v11]"); if(!b) return; const a=b.dataset.v11;
  if(a==="ar"){ setAR(!AR()); render(); return }
  if(a==="reveal"){ reveal(); return }
  if(a==="shopen"){ openLesson(b.dataset.id); return }
  if(a==="shback"){ pause(); P=null; render(); return }
  if(a==="shmode"){ SP.mode=b.dataset.m; spSave(); if(P){ P.done={}; P.hit=0; P.miss=0; P.fin=false; pause(); renderPlayer() } return }
  if(a==="shrate"){ SP.rate=+b.dataset.r; spSave(); if(P){ if(P.yt) ytCmd("setPlaybackRate",[SP.rate]); else { const au=$("#v11au"); if(au) au.playbackRate=SP.rate } } $$("[data-v11=shrate]").forEach(x=>x.classList.toggle("on",+x.dataset.r===SP.rate)); return }
  if(a==="shloop"){ if(P){ P.loop=!P.loop; b.classList.toggle("on",P.loop); if(P.loop) playLine(P.i) } return }
  if(a==="shtog"){ SP[b.dataset.k]=!SP[b.dataset.k]; spSave(); if(P) renderPlayer(); return }
  if(a==="shline"){ const i=+b.dataset.i; if((SP.mode==="dict"||SP.mode==="cloze")&&P.i!==i){ P.i=i; renderPlayer() } playLine(i); return }
  if(a==="shcheck"){ checkInput(); return }
  if(a==="shrec"){ toggleRec(); return }
  if(a==="ytadd"){ const vid=ytId($("#v11ytUrl").value); if(!vid){toast("Link YouTube chưa đúng");return} const lines=parseTranscript($("#v11ytTr").value,$("#v11ytVi").value); if(!lines.length){toast("Dán bản chép lời vào ô Transcript");return} S.yt=S.yt||[]; const t=($("#v11ytTitle").value||"").trim()||("YouTube "+vid); S.yt.push({id:"yt"+Date.now().toString(36),vid,t,lines,cat:"YouTube",lv:"",desc:lines.length+" câu · thêm "+new Date().toLocaleDateString("vi-VN")}); markDirty(); toast("Đã thêm bài "+t); render(); return }
  if(a==="ytdel"){ S.yt=(S.yt||[]).filter(x=>x.id!==b.dataset.id); markDirty(); P=null; render(); return }
  if(a==="conf"){ startConf(b.dataset.id||null); return }
  if(a==="weaksec"){ startWeakSec(b.dataset.sec); return }
  if(a==="skill"){ practiceKey(b.dataset.k); return }
  if(a==="frame"){ const box=b.closest(".v11-ws"); const e=KX.BY[b.dataset.k]; if(box&&e) box.querySelector(".v11-frame").textContent=makeStory(e); return }
  if(a==="savestory"){ const box=b.closest(".v11-ws"); const ta=box&&box.querySelector("textarea"); if(!ta) return; S.kst=S.kst||{}; const t=ta.value.trim(); if(t) S.kst[b.dataset.k]={s:t,t:Date.now()}; else delete S.kst[b.dataset.k]; markDirty(); toast(t?"Đã lưu câu chuyện của bạn":"Đã xóa"); return }
  if(a==="usestory"){ const box=b.closest(".v11-ws"); const ta=box&&box.querySelector("textarea"); if(ta){ ta.value=box.querySelector(".v11-frame").textContent; ta.focus() } return }
  if(a==="asm"){ gmLaunch("asm",b.dataset.src||null); return }
  if(a==="sprint"){ gmLaunch("sprint"); return }
  if(a==="asmpick"){ asmPick(b); return }
  if(a==="asmnext"){ asmRound(); return }
  if(a==="sppick"){ spPick(b); return }
});
document.addEventListener("keydown",e=>{ if(!P||view!=="listen"||e.target.closest("input,textarea,select")) return;
  const inp=SP.mode==="dict"||SP.mode==="cloze";
  if(e.key==="ArrowRight"){ e.preventDefault(); if(P.i<P.lines.length-1){ if(inp){P.i++; renderPlayer(); playLine(P.i)} else playLine(P.i+1) } }
  else if(e.key==="ArrowLeft"){ e.preventDefault(); if(P.i>0){ if(inp){P.i--; renderPlayer(); playLine(P.i)} else playLine(P.i-1) } }
  else if(e.key==="r"||e.key==="R"){ e.preventDefault(); playLine(P.i) }
  else if(e.key===" "){ e.preventDefault(); if(P.yt){ YT.playing?ytCmd("pauseVideo"):ytCmd("playVideo") } else { const a=$("#v11au"); if(a){ a.paused?a.play():a.pause() } } } });

/* ---------- 5. XƯỞNG NHỚ KANJI ---------- */
const IMG=window.V11_IMG||{}, FRAMES=window.V11_FRAMES||[];
function partImg(p){ const c=p[0]; const im=IMG[c]; if(im) return im[1]||im[0]; const e=KX.BY&&KX.BY[c]; if(e) return V11short(e.vi); const r=KX.RC&&KX.RC[c]; if(r) return r.vi.split(/[,;]/)[0]; return String(p[1]||"").replace(/^bộ\s+\S+\s+[—-]\s*/,"").split(/[,;]/)[0] }
const V11short=(s,n)=>{s=String(s||"").split(/[;；]/)[0].split(/[,、]/)[0].trim(); return s.length>(n||18)?s.slice(0,(n||18)-1)+"…":s};
function makeStory(e){ const ps=e.p.filter(p=>p[0]!==e.k); if(!ps.length) return "Chữ này là một khối — hãy nhớ bằng hình: "+(e.me||e.vi); const A=partImg(ps[0]), B=partImg(ps[1]||ps[0]), fr=FRAMES[Math.floor(Math.random()*FRAMES.length)]; return fr.replace(/{A}/g,A).replace(/{B}/g,B).replace(/{M}/g,V11short(e.vi,30)).replace(/{HV}/g,e.hv||"").replace(/{ON}/g,(e.on[0]||e.kun[0]||"")) }
function workshopHTML(e){
  const ps=e.p.filter(p=>p[0]!==e.k); const own=(S.kst||{})[e.k];
  return `<div class="kxsec v11-ws" data-k="${esc(e.k)}"><div class="eyebrow">Xưởng câu chuyện — biến bộ phận thành cảnh bạn thấy mỗi ngày</div>
    ${ps.length?`<div style="margin:6px 0">${ps.map(p=>`<span class="v11-img"><span class="jp">${esc(p[0])}</span><small>${esc(partImg(p))}</small></span>`).join("<span style='font-size:20px;vertical-align:middle'> + </span>")}<span style="font-size:20px;vertical-align:middle"> = </span><span class="v11-img" style="background:var(--ok-soft)"><span class="jp">${esc(e.k)}</span><small>${esc(V11short(e.vi,24))}</small></span></div>`:`<p class="small muted">Chữ này không tách được thành bộ phận lớn — nhớ bằng hình dáng: ${esc(e.me||"")}</p>`}
    <div class="v11-story"><b>Gợi ý khung:</b> <span class="v11-frame">${esc(makeStory(e))}</span></div>
    <div class="row" style="gap:6px"><button class="btn ghost small" data-v11="frame" data-k="${esc(e.k)}">🎲 Khung khác</button><button class="btn ghost small" data-v11="usestory">Dùng khung này rồi sửa</button></div>
    <p class="small muted" style="margin:8px 0 4px">Câu chuyện <b>của bạn</b> (nhớ lâu nhất là câu do chính mình đặt: có hình ảnh cụ thể, hơi buồn cười, và nhắc tới nghĩa «${esc(V11short(e.vi,20))}» + âm «${esc(e.on[0]||"")}»):</p>
    <textarea rows="2" style="width:100%" placeholder="VD: ${esc(ps.length?partImg(ps[0]):"…")} đang ${esc(ps[1]?partImg(ps[1]):"…")}, thế là ${esc(V11short(e.vi,20))}…">${esc(own?own.s:"")}</textarea>
    <div class="row" style="gap:6px;margin-top:6px"><button class="btn primary small" data-v11="savestory" data-k="${esc(e.k)}">Lưu câu chuyện</button>${ps.length?`<button class="btn small" data-v11="asm" data-src="${KX.RN[e.r]?"rad:"+e.r:"N3"}">Chơi Ghép bộ phận (bộ ${esc(KX.RN[e.r]?KX.RN[e.r].c:"")})</button>`:""}</div>
    <p class="small muted" style="margin:8px 0 0"><b>Mẹo nhớ âm:</b> Hán Việt «${esc(e.hv||"")}» → On «${esc(e.on.join("、")||"—")}». Vần -ng/-nh → âm dài; -c/-ch → く/き; -t → つ/ち; -n/-m → ん.</p>
  </div>`;
}
const _renderKanji=window.renderKanji;
window.renderKanji=function(m){ _renderKanji(m); const v=m.querySelector("#kjview"); const sec=v&&v.querySelector("#wordsBox"); if(!sec) return;
  const own=Object.keys(S.kst||{}); sec.insertAdjacentHTML("beforebegin",`<section class="sheet"><div class="eyebrow">Xưởng câu chuyện — nhớ kanji bằng cảnh bạn tự dựng</div>
    <p class="small muted" style="margin:4px 0 8px">Khó nhớ vì "không tưởng tượng ra bối cảnh"? Mỗi thẻ chữ giờ có <b>Xưởng câu chuyện</b>: các bộ phận được đổi thành đồ vật quen thuộc (bàn tay gõ phím, tin nhắn chat, cây trước công ty…), có khung gợi ý để bạn sửa thành câu chuyện của riêng mình, rồi ôn ngược bằng trò <b>Ghép bộ phận</b>. Mở bất kỳ chữ nào (bấm chữ → "Thứ tự nét · bộ thủ · xưởng câu chuyện") để bắt đầu.</p>
    <div class="row" style="gap:6px"><button class="btn primary small" data-v11="asm" data-src="core">Chơi Ghép bộ phận (115 chữ cốt lõi)</button><button class="btn small" data-kxopen="${esc((kjToday()[0])||"待")}">Mở xưởng với chữ hôm nay</button>${own.length?`<span class="small muted">Bạn đã viết ${own.length} câu chuyện: ${own.slice(0,12).map(k=>`<button class="kjchip" data-kxopen="${esc(k)}"><span class="jp">${esc(k)}</span></button>`).join(" ")}</span>`:""}</div></section>`) };
const _kxCardHTML=window.kxCardHTML;
window.kxCardHTML=function(e){ return _kxCardHTML(e)+workshopHTML(e) };
// thẻ 115 chữ cốt lõi: thêm câu chuyện của bạn nếu có
const _kjCardHTML=window.kjCardHTML;
window.kjCardHTML=function(c,opts){ const h=_kjCardHTML(c,opts).replace('Thứ tự nét · bộ thủ · câu nhớ khác','Thứ tự nét · bộ thủ · xưởng câu chuyện'); const own=(S.kst||{})[c]; return own?h.replace('<div class="kjwords">',`<div class="kbtip" style="background:var(--ok-soft)"><b>Câu chuyện của bạn</b> ${esc(own.s)}</div><div class="kjwords">`):h };

/* ---------- Trò chơi: Ghép bộ phận & Chạy nước rút ngữ pháp ---------- */
let ASM=null, SPR=null;
function asmPool(src){ let pool=gmKanjiPool(src||GMC.src); pool=pool.filter(e=>e.p&&e.p.filter(p=>p[0]!==e.k).length>=2); if(pool.length<8) pool=KX.K.filter(e=>e.lv>=3&&e.p.filter(p=>p[0]!==e.k).length>=2); return pool }
function asmStart(m,src){ ASM={pool:asmPool(src),round:0,score:0,streak:0,n:10,log:[]}; asmRound() }
function asmRound(){ const m=$("#main"); if(!ASM||!m) return; if(ASM.round>=ASM.n) return asmEnd(m);
  const pool=ASM.pool; const scored=pool.map(e=>[gmScore({id:e.k}),e]).sort((a,b)=>b[0]-a[0]); const tgt=scored[Math.floor(Math.random()*Math.min(6,scored.length))][1];
  const parts=tgt.p.filter(p=>p[0]!==tgt.k); const sameRad=pool.filter(e=>e.k!==tgt.k&&e.r===tgt.r); const others=pool.filter(e=>e.k!==tgt.k&&e.r!==tgt.r);
  let ds=shuffle(sameRad).slice(0,2); ds=ds.concat(shuffle(others).slice(0,3-ds.length)); if(ds.length<3) ds=ds.concat(shuffle(KX.K.filter(e=>e.k!==tgt.k&&!ds.includes(e))).slice(0,3-ds.length));
  const opts=shuffle([tgt,...ds]); ASM.cur={tgt,opts,parts,t:Date.now()}; ASM.round++;
  m.innerHTML=`<section class="sheet">${gmTop("Ghép bộ phận",`<span class="small">Câu ${ASM.round}/${ASM.n} · <b class="num">${ASM.score}</b> điểm${ASM.streak>=2?" · 🔥"+ASM.streak:""}</span>`)}
    <p class="small muted" style="margin:4px 0">Nhìn các bộ phận và gợi ý nghĩa, chọn chữ được ghép từ chúng. Đúng liên tiếp được thưởng điểm.</p>
    <div style="margin:10px 0;text-align:center">${parts.map(p=>`<span class="v11-img"><span class="jp">${esc(p[0])}</span><small>${esc(partImg(p))}</small></span>`).join("<span style='font-size:22px;vertical-align:middle'> + </span>")}</div>
    <div style="text-align:center;margin:4px 0"><span class="chip plain">nghĩa: ${esc(V11short(tgt.vi,24))}</span> <span class="chip plain">Hán Việt: ${esc(tgt.hv||"")}</span></div>
    <div class="v11-asm">${opts.map((e,i)=>`<button data-v11="asmpick" data-i="${i}">${esc(e.k)}</button>`).join("")}</div>
    <div id="v11asmfb" class="small" style="min-height:40px"></div></section>`;
  gmWireExit(m);
}
function asmPick(b){ if(!ASM||!ASM.cur||ASM.cur.done) return; const i=+b.dataset.i; const {tgt,opts}=ASM.cur; const ok=opts[i].k===tgt.k; ASM.cur.done=true;
  $$(".v11-asm button").forEach((x,j)=>{ if(opts[j].k===tgt.k) x.classList.add("ok"); else if(j===i) x.classList.add("bad") });
  kgMark(tgt.k,ok); if(!ok) kgMark(opts[i].k,false);
  if(ok){ ASM.streak++; const fast=Date.now()-ASM.cur.t<4000; ASM.score+=10+(ASM.streak>=3?5:0)+(fast?3:0) } else ASM.streak=0;
  ASM.log.push([tgt.k,ok]);
  $("#v11asmfb").innerHTML=`<div class="${ok?"":""}"><b style="color:var(--${ok?"ok":"bad"})">${ok?"Đúng!":"Chưa đúng."}</b> <span class="jp" style="font-size:18px">${esc(tgt.k)}</span> ${esc(tgt.hv||"")} · ${esc(V11short(tgt.vi,30))} · <span class="jp">${esc(tgt.on.join("、"))}</span>${tgt.v[0]?` · <span class="jp">${esc(tgt.v[0][0])}</span> ${esc(tgt.v[0][1])} ${esc(V11short(tgt.v[0][2],20))}`:""}<div class="muted">${esc(((S.kst||{})[tgt.k]||{}).s||tgt.mv[0]||tgt.me||"")}</div></div><div class="row" style="gap:6px;margin-top:6px"><button class="btn primary small" data-v11="asmnext">Câu tiếp (Enter)</button><button class="btn ghost small" data-kxopen="${esc(tgt.k)}">Thẻ chữ · xưởng câu chuyện</button></div>`;
}
function asmEnd(m){ gmStat("asm","best",ASM.score,true); gmStat("asm","n",1); gmPlayed(); markDirty(); const wrong=ASM.log.filter(x=>!x[1]).map(x=>x[0]);
  m.innerHTML=`<section class="sheet">${gmTop("Ghép bộ phận")}<div class="gmend"><div class="v11-big num">${ASM.score} điểm</div><div class="small muted">Đúng ${ASM.log.filter(x=>x[1]).length}/${ASM.log.length} · kỷ lục ${(S.gm.asm||{}).best||0}</div>
    ${wrong.length?`<div style="margin-top:8px">Chữ cần xem lại: <div class="kjchips">${wrong.map(k=>kxChip(k)).join("")}</div></div>`:""}
    <div class="row" style="gap:6px;margin-top:10px"><button class="btn primary" data-v11="asm">Chơi lại</button></div></div></section>`; gmWireExit(m); ASM=null }
document.addEventListener("keydown",e=>{ if(view!=="games") return; if(ASM&&ASM.cur){ if(e.key==="Enter"&&ASM.cur.done){ e.preventDefault(); asmRound() } else if(e.key>="1"&&e.key<="4"&&!ASM.cur.done){ const b=$$(".v11-asm button")[+e.key-1]; if(b) asmPick(b) } }
  if(SPR&&SPR.cur&&!SPR.cur.done&&e.key>="1"&&e.key<="4"){ const b=$$(".v11-sprint .opts button")[+e.key-1]; if(b) spPick(b) } });
function spPool(){ let pool=BANK.filter(q=>(q.sec==="bunpou"||q.cf)&&!q.pid&&q.opts&&q.opts.length===4&&q.q.length<60); const un=pool.filter(q=>unlocked(q)||q.cf); if(un.length>=30) pool=un; return shuffle(pool) }
function sprintStart(m){ SPR={pool:spPool(),i:0,score:0,streak:0,log:[],end:Date.now()+60000,done:false}; spRound(); SPR.timer=setInterval(()=>{ const el=$("#v11sptime"); const left=Math.max(0,SPR.end-Date.now()); if(el) el.textContent=(left/1000).toFixed(0)+"s"; if(left<=0) spEnd() },250) }
function spRound(){ const m=$("#main"); if(!SPR||!m) return; const q=viewOf(SPR.pool[SPR.i%SPR.pool.length]); SPR.cur={q,done:false,t:Date.now()};
  m.innerHTML=`<section class="sheet v11-sprint">${gmTop("Chạy nước rút ngữ pháp",`<span class="small"><b class="num" id="v11sptime">60s</b> · <b class="num">${SPR.score}</b> điểm${SPR.streak>=3?" · 🔥"+SPR.streak:""}</span>`)}
    <p class="small muted" style="margin:4px 0">Trả lời càng nhanh càng nhiều điểm. 60 giây. Phím 1–4.</p>
    <div class="q">${stemHTML(q)}</div>
    <div class="opts">${q.opts.map((o,k)=>`<button data-v11="sppick" data-k="${k}"><span class="bub" style="margin-right:6px">${k+1}</span>${esc(o)}</button>`).join("")}</div>
    <div id="v11spfb" class="small" style="min-height:24px;margin-top:6px"></div></section>`; gmWireExit(m) }
function spPick(b){ if(!SPR||!SPR.cur||SPR.cur.done) return; const k=+b.dataset.k; const q=SPR.cur.q; const ok=k===q.a; SPR.cur.done=true;
  $$(".v11-sprint .opts button").forEach((x,j)=>{ if(j===q.a) x.classList.add("ok"); else if(j===k) x.classList.add("bad") });
  record(q,k); SPR.log.push([origOf(q).id,ok?1:0]);
  if(ok){ SPR.streak++; const dt=Date.now()-SPR.cur.t; SPR.score+=10+(dt<3000?5:dt<6000?2:0)+(SPR.streak>=3?3:0) } else { SPR.streak=0; SPR.wrong=(SPR.wrong||[]).concat([origOf(q)]) }
  $("#v11spfb").innerHTML=ok?`<b style="color:var(--ok)">Đúng</b>`:`<b style="color:var(--bad)">Sai</b> — đáp án ${q.a+1}. ${esc(String(q.ex).slice(0,120))}`;
  SPR.i++; setTimeout(()=>{ if(SPR&&!SPR.done) spRound() },ok?500:1600) }
function spEnd(){ if(!SPR||SPR.done) return; SPR.done=true; clearInterval(SPR.timer); const m=$("#main"); gmStat("sprint","best",SPR.score,true); gmPlayed();
  if(SPR.log.length){ S.hist.push({at:Date.now(),day:TODAY,mode:"practice",title:"Chạy nước rút ngữ pháp",secs:60,items:SPR.log}); if(S.hist.length>400) S.hist=S.hist.slice(-400) } markDirty();
  const wrong=SPR.wrong||[];
  m.innerHTML=`<section class="sheet">${gmTop("Chạy nước rút ngữ pháp")}<div class="gmend"><div class="v11-big num">${SPR.score} điểm</div><div class="small muted">${SPR.log.length} câu · đúng ${SPR.log.filter(x=>x[1]).length} · kỷ lục ${(S.gm.sprint||{}).best||0}. Câu sai đã vào Ôn tập.</div>
    ${wrong.length?`<div class="errlist" style="margin-top:10px">${wrong.map(q=>`<div class="err"><div class="small muted">${esc(q.tag||"")}</div><div class="s jp">${stemHTML(q)}</div><div class="small">Đúng: <span class="jp" style="color:var(--ok)">${esc(q.opts[q.a])}</span> — ${esc(q.ex)}</div></div>`).join("")}</div>`:""}
    <div class="row" style="gap:6px;margin-top:10px"><button class="btn primary" data-v11="sprint">Chơi lại</button></div></div></section>`; gmWireExit(m); SPR=null }
const _renderGames=window.renderGames;
window.renderGames=function(m){ if(GV.g==="asm"&&GV.start){ GV.start=false; m.innerHTML=`<section class="sheet"><div class="small muted">Đang tải…</div></section>`; kxLoad().then(()=>asmStart(m,GMC.src)); return } if(GV.g==="sprint"&&GV.start){ GV.start=false; sprintStart(m); return } if(GV.g==="asm"&&ASM) return asmRound(); if(GV.g==="sprint"&&SPR&&!SPR.done) return spRound(); _renderGames(m) };
const _gmStop=window.gmStop; window.gmStop=function(){ _gmStop(); ASM=null; if(SPR){ clearInterval(SPR.timer); SPR=null } };
const _gmHub=window.gmHub;
window.gmHub=function(m){ _gmHub(m); const cards=m.querySelector(".gmcards"); if(!cards) return; const g=S.gm||{};
  cards.insertAdjacentHTML("beforeend",`<section class="sheet gmcard"><div class="gmico jp">合</div><h3>Ghép bộ phận</h3><p class="small muted">Nhìn các bộ phận (đã hình dung thành đồ vật quen thuộc) + nghĩa, chọn chữ ghép đúng trong 4 chữ. Luyện "nhìn thấy" cấu tạo chữ để nhớ bằng hình ảnh.</p><div class="small">Kỷ lục: <b>${(g.asm||{}).best||0}</b> điểm</div><div class="row" style="gap:6px;margin-top:8px"><button class="btn primary" data-v11="asm">Chơi</button></div></section>
  <section class="sheet gmcard"><div class="gmico jp">速</div><h3>Chạy nước rút ngữ pháp</h3><p class="small muted">60 giây, câu điền ngữ pháp liên tục. Càng nhanh càng nhiều điểm; câu sai tự vào Ôn tập. Luyện phản xạ "dạng nối" cho 文法 問題1.</p><div class="small">Kỷ lục: <b>${(g.sprint||{}).best||0}</b> điểm</div><div class="row" style="gap:6px;margin-top:8px"><button class="btn primary" data-v11="sprint">Chơi</button></div></section>
  <section class="sheet gmcard"><div class="gmico jp">比</div><h3>Cặp dễ nhầm</h3><p class="small muted">12 câu đố trộn từ ${CONF.length} nhóm ngữ pháp dễ nhầm (ように/ために, 間/間に, そうだ/ようだ…), mỗi câu có giải thích vì sao.</p><div class="small">${BANK.filter(q=>q.cf&&S.srs[q.id]).length}/${BANK.filter(q=>q.cf).length} câu đã làm</div><div class="row" style="gap:6px;margin-top:8px"><button class="btn primary" data-v11="conf">Làm 12 câu</button></div></section>`) };

/* ---------- 6. KIẾN THỨC: dịch câu, ngữ pháp dễ nhầm, mẹo ---------- */
const TIPS=window.V11_TIPS||[];
function confHTML(){
  const acc=id=>{ const qs=cfItems(id); const done=qs.filter(q=>S.srs[q.id]); const ok=done.filter(q=>S.srs[q.id].w===0||S.srs[q.id].b>=3); return done.length?`<span class="chip ${ok.length===done.length?"ok":"warn"}">${ok.length}/${done.length} đúng</span>`:`<span class="chip plain">chưa đố</span>` };
  return `<section class="sheet v11-cf" id="v11conf"><div class="row" style="justify-content:space-between;gap:8px"><div><div class="eyebrow">Ngữ pháp dễ nhầm · ${CONF.length} nhóm</div><div class="small muted">Mỗi nhóm: bảng so sánh, điểm khác cốt lõi, mẹo nhận dạng trong đề, câu đố có giải thích. Đây là những chỗ mất điểm nhiều nhất ở 文法 N3.</div></div><button class="btn primary small" data-v11="conf">Đố 12 câu trộn</button></div>
    <div class="field" style="margin:8px 0"><input id="v11cfq" type="search" placeholder="Tìm: ように, おかげ, そうだ, kính ngữ…"></div>
    <div id="v11cflist">${CONF.map(c=>`<details class="kbcard" data-cf="${esc(c.id)}"><summary><span class="kbsrc">${esc(c.g)}</span><span class="kbtitle">${esc(c.t)}</span> ${acc(c.id)}</summary><div class="kbbody">
      <div class="tablewrap"><table><thead><tr><th style="width:26%">Mẫu</th><th>Dùng khi</th><th style="width:36%">Ví dụ</th></tr></thead><tbody>${c.items.map(it=>`<tr><td><b class="jp">${esc(it.p)}</b>${it.s?`<div class="small muted">${esc(it.s)}</div>`:""}</td><td>${esc(it.u)}</td><td>${it.ex.map(e=>`<div class="jp">${esc(e[0])}</div><div class="small muted">${esc(e[1])}</div>`).join("")}</td></tr>`).join("")}</tbody></table></div>
      <div class="kbtip" style="margin-top:8px"><b>Khác nhau ở đâu</b> ${esc(c.diff)}</div><div class="kbtip"><b>Mẹo nhận dạng trong đề</b> ${esc(c.tip)}</div>
      <div class="row" style="gap:6px;margin-top:8px"><button class="btn small" data-v11="conf" data-id="${esc(c.id)}">Đố ${c.quiz.length} câu nhóm này</button></div></div></details>`).join("")}</div></section>`;
}
function tipsHTML(){ return `<section class="sheet" id="v11tips"><div class="eyebrow">Mẹo học · bẫy mất điểm · chiến thuật làm bài JLPT N3</div><div class="small muted" style="margin:4px 0 8px">Rút từ cấu trúc đề N3 và các lỗi bạn hay gặp. Đọc một mục mỗi ngày; mục "Bẫy mất điểm" nên đọc lại trước mỗi đề thi thử.</div>
  ${TIPS.map(cat=>`<details class="kbcard"><summary><span class="kbsrc">${cat.items.length}</span><span class="kbtitle">${esc(cat.cat)}</span></summary><div class="kbbody">${cat.items.map(t=>`<div class="v11-gr"><b>${esc(t.t)}</b><div class="small">${esc(t.d)}</div></div>`).join("")}</div></details>`).join("")}</section>` }
const _renderKB=window.renderKB;
window.renderKB=function(m){ _renderKB(m); const first=m.querySelector("section.sheet"); if(first) first.insertAdjacentHTML("afterend",V.dictToolHTML()+confHTML()+tipsHTML());
  const q=m.querySelector("#v11cfq"); if(q) q.oninput=()=>{ const t=q.value.trim().toLowerCase(); $$("#v11cflist details").forEach(d=>{ const c=CF_BY[d.dataset.cf]; const txt=(c.t+" "+c.g+" "+c.items.map(i=>i.p+" "+i.u).join(" ")+" "+c.diff+" "+c.tip).toLowerCase(); d.hidden=!!t&&!txt.includes(t); if(t&&!d.hidden) d.open=true }) } };

/* ---------- 7. HÔM NAY: radar điểm yếu ---------- */
function secAcc(days){ const r={}; answerLog(days||30).forEach(x=>{ const q=BY_ID[x.id]; if(!q||q.sec==="conj") return; const e=r[q.sec]=r[q.sec]||{n:0,ok:0}; e.n++; if(x.ok) e.ok++ }); return r }
function weakestSec(){ const r=secAcc(30); const arr=Object.entries(r).filter(([k,v])=>v.n>=3).map(([k,v])=>({k,acc:(v.ok+1)/(v.n+2),n:v.n})).sort((a,b)=>a.acc-b.acc); return arr }
function weakSecItems(sec,n){ const pool=BANK.filter(q=>q.sec===sec&&!q.pid&&(unlocked(q)||q.cf)); const st=id=>S.srs[id]; const wrong=shuffle(pool.filter(q=>st(q.id)&&st(q.id).w>0&&st(q.id).b<=2)), fresh=shuffle(pool.filter(q=>!st(q.id))), rest=shuffle(pool.filter(q=>st(q.id)&&!(st(q.id).w>0&&st(q.id).b<=2)));
  let items=wrong.slice(0,Math.ceil(n/2)); items=items.concat(fresh.slice(0,n-items.length)); items=items.concat(rest.slice(0,n-items.length)); if(sec==="dokkai"||sec==="bunshou"){ const ps=passages(sec).filter(p=>p.qs.some(q=>st(q.id)&&st(q.id).w>0)||p.qs.some(q=>!st(q.id))); if(ps.length) items=ps[0].qs } return items }
function startWeakSec(sec){ const items=weakSecItems(sec,10); if(!items.length){toast("Chưa có câu phù hợp");return} startSession(orderReading(items),{mode:"practice",title:"Tập trung dạng yếu · "+SEC[sec].vi,from:"today",dedupe:true}) }
V.startWeakSec=startWeakSec;
function radarHTML(){
  const arr=weakestSec(); const mm=masteryMap(); const skills=Object.values(mm).filter(e=>e.n>=3&&e.p<0.7).sort((a,b)=>a.p-b.p).slice(0,3);
  const tip=TIPS.length?(()=>{ const all=TIPS.flatMap(c=>c.items.map(i=>Object.assign({cat:c.cat},i))); return all[TODAY%all.length] })():null;
  if(!arr.length&&!skills.length) return `<section class="sheet v11-radar"><div class="eyebrow">Radar điểm yếu</div><p class="small muted" style="margin:4px 0">Làm thêm vài bài, Sổ luyện sẽ chỉ ra dạng bài và mẫu ngữ pháp bạn hay sai nhất, rồi dồn bài luyện vào đó.</p>${tip?`<div class="v11-tip" style="margin-top:8px"><b>Mẹo hôm nay · ${esc(tip.cat)}</b><br><b>${esc(tip.t)}</b> ${esc(tip.d)}</div>`:""}</section>`;
  return `<section class="sheet v11-radar"><div class="row" style="justify-content:space-between;gap:8px"><div><div class="eyebrow">Radar điểm yếu · 30 ngày</div><div class="small muted">Độ chính xác theo dạng bài. Bấm "Luyện" để làm 10 câu dồn vào dạng đó (ưu tiên câu đã sai, rồi câu mới).</div></div>
    <label class="toggle small"><input type="checkbox" data-v11="wf" ${S.wf?"checked":""}> Ưu tiên dạng yếu trong Bài luyện hôm nay (+4 câu)</label></div>
    <div class="bars" style="margin-top:8px">${arr.slice(0,6).map(a=>{const p=Math.round(a.acc*100); return `<div class="bar"><span>${esc(SEC[a.k].vi)}</span><div class="track"><div class="fill ${p<60?"low":p<80?"mid":"hi"}" style="width:${p}%"></div></div><span class="pct num">${p}%</span><button class="btn small" data-v11="weaksec" data-sec="${a.k}">Luyện</button></div>`}).join("")}</div>
    ${skills.length?`<div class="small" style="margin-top:8px"><span class="muted">Mẫu hay sai nhất:</span> ${skills.map(e=>`<button class="kbchip" data-v11="skill" data-k="${esc(e.k)}">${esc(skillLabel(e.k))} <span class="chip bad">${Math.round(e.p*100)}%</span></button>`).join(" ")}</div>`:""}
    ${tip?`<div class="v11-tip" style="margin-top:8px"><b>Mẹo hôm nay · ${esc(tip.cat)}</b><br><b>${esc(tip.t)}</b> ${esc(tip.d)}</div>`:""}
  </section>`;
}
const _renderToday=window.renderToday;
window.renderToday=function(m){ _renderToday(m); const hero=m.querySelector("section.hero"); if(hero) hero.insertAdjacentHTML("afterend",radarHTML()); const cb=m.querySelector('[data-v11="wf"]'); if(cb) cb.onchange=()=>{ S.wf=cb.checked; markDirty() } };
const _startDaily=window.startDaily;
window.startDaily=function(){ _startDaily(); if(S.wf&&session&&session.title==="Bài luyện hôm nay"&&!session.done){ const w=weakestSec()[0]; if(!w) return; const used=new Set(session.items.map(q=>origOf(q).id)); const add=weakSecItems(w.k,8).filter(q=>!used.has(q.id)&&!q.pid).slice(0,4).map(viewOf); if(add.length){ add.forEach(q=>{ const pos=Math.floor(Math.random()*(session.items.length+1)); session.items.splice(pos,0,q); session.why=session.why||{}; session.why[q.id]="Dạng yếu: "+SEC[w.k].vi }); render() } } };

/* ---------- giữ gợi ý "Dạng yếu/Điểm yếu" ẩn cho tới khi kiểm tra (đã sửa trong renderQuiz) ---------- */
V.ready=true;
if(typeof render==="function") render();
})();
