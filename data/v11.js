/* Sổ luyện N3 — nâng cấp v11
   1. Từ điển: nghĩa Việt cho 1.448 từ còn thiếu, từ chức năng, 1800 từ Tango
   2. Bôi đen câu dài → phân tích từng từ, ngữ pháp, dịch nháp
   3. Ẩn gợi ý ở đầu câu hỏi; chế độ che phương án (nhớ chủ động)
   4. Shadowing: 20 bài có audio + phụ đề; nhập video YouTube
   5. Xưởng nhớ kanji + trò Ghép bộ phận
   6. Ngữ pháp dễ nhầm, bẫy JLPT, mẹo học & làm bài; Chạy nước rút ngữ pháp
   7. Radar điểm yếu trên trang Hôm nay */
(function(){
"use strict";
const V=window.V11={};
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];

/* ---------- CSS ---------- */
const css=`
.v11-tok{display:inline-flex;flex-direction:column;align-items:center;margin:2px 3px;padding:3px 6px;border-radius:8px;background:var(--accent-soft);cursor:pointer;vertical-align:top;max-width:160px;border:1px solid transparent}
.v11-tok.f{background:transparent;border-color:var(--line)}
.v11-tok.u{background:var(--warn-soft)}
.v11-tok .j{font-family:var(--font-jp);font-size:17px;line-height:1.2}
.v11-tok .r{font-family:var(--font-jp);font-size:11px;color:var(--muted);line-height:1.1}
.v11-tok .v{font-size:11.5px;color:var(--ink);line-height:1.2;text-align:center;margin-top:2px}
.v11-tok.f .v{color:var(--muted)}
.v11-tok.on{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent-soft)}
.v11-toks{line-height:1.2;margin:4px 0}
.v11-draft{font-size:15px;padding:8px 10px;border-left:3px solid var(--accent);background:var(--accent-soft);border-radius:0 8px 8px 0;margin:6px 0}
.v11-sec{margin-top:10px}
.v11-gr{padding:6px 8px;border:1px solid var(--line);border-radius:8px;margin:4px 0;font-size:13.5px}
.v11-gr b.jp{font-size:15px}
.v11-det{margin-top:6px;padding:8px;border-radius:8px;background:var(--paper);font-size:13.5px}
.v11-cover{position:relative;min-height:120px}
.v11-cover .ov{position:absolute;inset:0;background:var(--sheet);border:1px dashed var(--line-strong);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:12px;text-align:center;z-index:2}
.v11-sub{display:flex;flex-direction:column;gap:2px;margin-top:8px}
.v11-line{display:grid;grid-template-columns:48px 1fr;gap:8px;padding:8px 10px;border-radius:10px;border:1px solid transparent;cursor:pointer}
.v11-line:hover{background:var(--accent-soft)}
.v11-line.cur{border-color:var(--accent);background:var(--accent-soft)}
.v11-line .t{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums;padding-top:3px}
.v11-line .jp{font-size:17px}
.v11-line .rd{font-size:12px;color:var(--muted);font-family:var(--font-jp)}
.v11-line .vi{font-size:13px;color:var(--muted)}
.v11-line.hidejp .jp,.v11-line.hidejp .rd{filter:blur(6px)}
.v11-line.hidevi .vi{filter:blur(6px)}
.v11-line .jp.blank u{color:var(--accent);text-decoration:none;border-bottom:2px solid var(--accent)}
.v11-ctl{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0}
.v11-modes button[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.v11-yt{position:relative;width:100%;aspect-ratio:16/9;border-radius:10px;overflow:hidden;background:#000}
.v11-yt iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.v11-dict{font-size:14px}
.v11-dict input,.v11-dict textarea{width:100%}
.v11-cf details{margin:6px 0}
.v11-cf table{border-collapse:collapse;width:100%;font-size:13.5px}
.v11-cf td,.v11-cf th{border:1px solid var(--line);padding:6px 8px;vertical-align:top}
.v11-cf th{background:var(--paper);text-align:left}
.v11-radar .bar{grid-template-columns:120px 1fr 44px auto;align-items:center}
button.ltype{font:inherit;color:inherit;background:var(--sheet);width:100%}
.v11-img{display:inline-flex;flex-direction:column;align-items:center;padding:6px 10px;border-radius:10px;background:var(--warn-soft);margin:3px;min-width:70px}
.v11-img .jp{font-size:24px;line-height:1.1}
.v11-img small{font-size:11px;text-align:center;max-width:120px}
.v11-story{padding:8px 10px;border-radius:8px;background:var(--paper);margin:4px 0;font-size:14px}
.v11-asm{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin:8px 0}
.v11-asm button{font-family:var(--font-jp);font-size:34px;padding:14px 6px;border-radius:12px;border:1px solid var(--line-strong);background:var(--sheet);color:var(--ink);cursor:pointer}
.v11-asm button.ok{background:var(--ok-soft);border-color:var(--ok)}
.v11-asm button.bad{background:var(--bad-soft);border-color:var(--bad)}
.v11-sprint .q{font-family:var(--font-jp);font-size:20px;margin:8px 0}
.v11-sprint .opts{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.v11-sprint .opts button{font-family:var(--font-jp);font-size:17px;padding:12px;border-radius:10px;border:1px solid var(--line-strong);background:var(--sheet);color:var(--ink);cursor:pointer;text-align:left}
.v11-sprint .opts button.ok{background:var(--ok-soft)}
.v11-sprint .opts button.bad{background:var(--bad-soft)}
.v11-big{font-size:26px;font-weight:700}
.v11-rec{display:inline-flex;gap:6px;align-items:center}
.v11-rec.on{color:var(--bad)}
.v11-tip{padding:8px 10px;border-radius:8px;background:var(--warn-soft);font-size:13.5px}
#lkpop .v11-toks{max-height:160px;overflow:auto}
@media(max-width:640px){.v11-line{grid-template-columns:40px 1fr}.v11-sprint .opts{grid-template-columns:1fr}}
`;
const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);

/* ---------- 1. TỪ ĐIỂN ---------- */
const FUNC=window.V11_FUNC||[]; const FUNC_BY={}; FUNC.forEach(f=>{if(!FUNC_BY[f[0]]) FUNC_BY[f[0]]=f});
const FUNC_MAX=Math.max(...FUNC.map(f=>f[0].length));
(function fill(){ const F=window.V11_VI||{}; let n=0; Object.keys(F).forEach(i=>{ if(DIC[i]&&!DIC[i][3]){DIC[i][3]=F[i]; n++} }); V.filled=n; })();
let tangoMerged=false;
function mergeTango(){
  if(tangoMerged||!window.KX||!KX.ready) return; tangoMerged=true;
  const idx=lkIndex(); let n=0;
  KX.T.forEach(t=>{ if(!t.vi) return; const w=String(t.w).replace(/[（(].*$/,"").trim(); if(!w||idx.has(w)) return;
    const pos=/する$/.test(w)?"vs":/[いしきい]$/.test(w)&&/[ぁ-ん]$/.test(w)?"n":"n";
    DIC.push([w,t.r||w,pos,t.vi,"",[]]); n++; });
  LK.idx=null; V.tangoAdded=n;
}
V.mergeTango=mergeTango;
if(typeof kxLoad==="function") kxLoad().then(mergeTango).catch(()=>{});

/* ---------- 2. PHÂN TÍCH CÂU ---------- */
const isKana=c=>/[ぁ-ゖァ-ヺー]/.test(c), isHira=c=>/[ぁ-ゖ]/.test(c), isKata=c=>/[ァ-ヺー]/.test(c);
const PUNCT=/[、。！？!?,.「」『』（）()・…〜～：:；;　\s]/;
const COUNTERS={"分":"phút","時":"giờ","時間":"tiếng","日":"ngày","か月":"tháng","ヶ月":"tháng","カ月":"tháng","月":"tháng","年":"năm","週間":"tuần","円":"yên","人":"người","回":"lần","個":"cái","本":"cây/chai","枚":"tờ","歳":"tuổi","才":"tuổi","番":"số","階":"tầng","度":"lần","台":"chiếc","冊":"quyển","杯":"cốc","匹":"con","部":"bản","つ":"cái","秒":"giây","キロ":"kg/km","メートル":"mét","倍":"lần","割":"phần mười","％":"%","%":"%","名":"người","件":"vụ","社":"công ty","か所":"chỗ","種類":"loại","泊":"đêm","点":"điểm","課":"bài","号":"số"};
const KNUM={"〇":0,"一":1,"二":2,"三":3,"四":4,"五":5,"六":6,"七":7,"八":8,"九":9};
function kanjiNum(str){ let total=0, cur=0; for(const ch of str){ if(KNUM[ch]!=null) cur=KNUM[ch]; else if(ch==="十"){ total+=(cur||1)*10; cur=0 } else if(ch==="百"){ total+=(cur||1)*100; cur=0 } else if(ch==="千"){ total+=(cur||1)*1000; cur=0 } else if(ch==="万"){ total=(total+cur||1)*10000; cur=0 } } return total+cur }
function numRun(t,i){ let j=i; while(j<t.length&&/[〇一二三四五六七八九十百千万]/.test(t[j])) j++; if(j===i) return null; const numS=t.slice(i,j); if(numS==="一"&&!COUNTERS[t[j]]&&!COUNTERS[t.slice(j,j+2)]) return null;
  let cnt="", cs=""; for(const k of [3,2,1]){ const c=t.slice(j,j+k); if(COUNTERS[c]){ cnt=COUNTERS[c]; cs=c; break } }
  if(!cnt&&/[十百千万]/.test(numS)===false&&numS.length===1) return null;
  const v=kanjiNum(numS); let vi=String(v)+(cnt?" "+cnt:""); if(cs==="日"&&v<=31){ const sp={1:"mùng 1 / một ngày",2:"mùng 2 / hai ngày",3:"mùng 3 / ba ngày",4:"mùng 4 / bốn ngày",5:"mùng 5 / năm ngày",6:"mùng 6 / sáu ngày",7:"mùng 7 / bảy ngày",8:"mùng 8 / tám ngày",9:"mùng 9 / chín ngày",10:"mùng 10 / mười ngày",20:"ngày 20 / hai mươi ngày"}; vi=sp[v]||("ngày "+v+" / "+v+" ngày") } if(cs==="月"&&v<=12) vi="tháng "+v;
  return {n:j-i+cs.length,s:t.slice(i,j+cs.length),vi} }
try{ [["きます","thể ます"],["きません","phủ định lịch sự"],["きました","lịch sự quá khứ"],["きませんでした","lịch sự quá khứ phủ định"],["きましょう","rủ rê (ましょう)"],["きたい","muốn (〜たい)"],["きなさい","mệnh lệnh nhẹ"],["きて","thể て"],["きた","quá khứ (た)"],["きたら","điều kiện (たら)"],["きたり","liệt kê (たり)"]].forEach(([f,l])=>LK_RULES.push([f,"くる",T_ALL|T_TE|T_MASU|T_ADJ|T_V1,T_VK,l])); LK_RULES.sort((a,b)=>b[0].length-a[0].length) }catch(e){}
[["大阪","Osaka"],["東京","Tokyo"],["京都","Kyoto"],["名古屋","Nagoya"],["福岡","Fukuoka"],["北海道","Hokkaido"],["沖縄","Okinawa"],["横浜","Yokohama"],["神戸","Kobe"],["札幌","Sapporo"],["広島","Hiroshima"],["仙台","Sendai"],["千葉","Chiba"],["埼玉","Saitama"],["新宿","Shinjuku"],["渋谷","Shibuya"],["銀座","Ginza"],["秋葉原","Akihabara"],["池袋","Ikebukuro"],["品川","Shinagawa"],["浅草","Asakusa"],["富士山","núi Phú Sĩ"],["関東","vùng Kanto"],["関西","vùng Kansai"],["日本","Nhật Bản"],["ベトナム","Việt Nam"],["ハノイ","Hà Nội"],["ホーチミン","TP. Hồ Chí Minh"],["ダナン","Đà Nẵng"],["アメリカ","Mỹ"],["中国","Trung Quốc"],["韓国","Hàn Quốc"],["田中","Tanaka"],["山田","Yamada"],["佐藤","Sato"],["鈴木","Suzuki"],["高橋","Takahashi"],["伊藤","Ito"],["渡辺","Watanabe"],["中村","Nakamura"],["小林","Kobayashi"],["加藤","Kato"],["グエン","Nguyễn"],["チャン","Trần"],["レ","Lê"]].forEach(([w,vi])=>{ if(!FUNC_BY[w]) FUNC_BY[w]=[w,vi,"Tên riêng","pn"] });
const BAD_N=new Set(["(tính từ な)","(phó từ 〜に)","だ","です","phỏng đoán","nếu (なら)","さん"]);
function okCand(x){ const L=x.l||[]; const pos=String(x.e[2]||""); const isNa=/\bna\b/.test(pos), verbish=/v1|v5|vs|vk|adj/.test(pos);
  for(const l of L){ if(l==="(tính từ な)"&&!isNa) return false; if(l==="(phó từ 〜に)"&&!isNa) return false; if(BAD_N.has(l)&&l!=="(tính từ な)"&&l!=="(phó từ 〜に)") return false; if((l==="quá khứ"||l==="phủ định")&&!verbish) return false }
  return true }
function tokenize(text){
  const t=String(text).replace(/\s+/g,""); const N=t.length; const best=new Array(N+1).fill(null); best[0]={c:0};
  for(let i=0;i<N;i++){ if(!best[i]) continue; const ch=t[i]; const cands=[];
    if(PUNCT.test(ch)) cands.push({n:1,tok:{s:ch,ty:"p"},c:0});
    else if(/[0-9０-９A-Za-zＡ-Ｚａ-ｚ]/.test(ch)){ let j=i+1; while(j<N&&/[0-9０-９A-Za-zＡ-Ｚａ-ｚ.,%]/.test(t[j])) j++; cands.push({n:j-i,tok:{s:t.slice(i,j),ty:"n",vi:t.slice(i,j)},c:1}) }
    else if(/[〇一二三四五六七八九十百千万]/.test(ch)&&numRun(t,i)){ const r=numRun(t,i); cands.push({n:r.n,tok:{s:r.s,ty:"n",vi:r.vi},c:0.8}) }
    if(cands.length&&cands[0].tok.ty==="n"&&!/[0-9０-９A-Za-zＡ-Ｚａ-ｚ]/.test(ch)){} else if(!PUNCT.test(ch)&&!/[0-9０-９A-Za-zＡ-Ｚａ-ｚ]/.test(ch)) {
      for(let n=Math.min(14,N-i);n>=1;n--){ const s=t.substr(i,n); const f=FUNC_BY[s];
        if(f) cands.push({n,tok:{s,ty:"f",f},c:f[3]==="d"?0.95:f[3]==="x"?0.9:0.9});
        else if(n>=3&&!isKj(s[0])){ for(const c of lkDeinflect(s)){ if(c.w!==s&&c.w.length>=2&&FUNC_BY[c.w]&&/^(a|c)$/.test(FUNC_BY[c.w][3])){ cands.push({n,tok:{s,ty:"f",f:FUNC_BY[c.w],l:c.l},c:0.95+c.l.length*0.03}); break } } }
        if(n>=2||isKj(s)){ const d=lkFind(s).filter(okCand); if(d.length){ const L=d[0].l||[]; const stem=/^thể ます$/.test(L[L.length-1]||"")&&!/[ます]$/.test(s); cands.push({n,tok:{s,ty:"w",e:d[0].e,l:L,di:d[0].i},c:1+(stem?0.7:0)+L.length*0.03}) } } }
      if(isKj(ch)){ const d=KJD[ch]; cands.push({n:1,tok:{s:ch,ty:"kj",hv:d?d[0]:(typeof kjHv==="function"?kjHv(ch):""),vi:d?d[3]:""},c:1.6}) }
      if(isKata(ch)){ let j=i+1; while(j<N&&isKata(t[j])) j++; cands.push({n:j-i,tok:{s:t.slice(i,j),ty:"k"},c:1.3}) }
      cands.push({n:1,tok:{s:ch,ty:"u"},c:3});
    }
    for(const cd of cands){ const j=i+cd.n; const c=best[i].c+cd.c; if(!best[j]||c<best[j].c-1e-9) best[j]={c,prev:i,tok:cd.tok} }
  }
  const out=[]; for(let j=N;j>0;j=best[j].prev) out.push(best[j].tok); out.reverse();
  // gộp các ký tự lạ liền nhau
  const m=[]; out.forEach(k=>{ const l=m[m.length-1]; if(k.ty==="u"&&l&&l.ty==="u") l.s+=k.s; else m.push(k) }); return m;
}
V.tokenize=tokenize;
const POS_VI={v1:"động từ nhóm 2",v5:"động từ nhóm 1",vsi:"động từ する",vk:"động từ 来る",adj:"tính từ い",na:"tính từ な",n:"danh từ",vs:"danh từ + する",adv:"phó từ",exp:"cụm",conj:"liên từ",int:"thán từ",pn:"liên thể từ",suf:"hậu tố",pref:"tiền tố"};
function short(s0,n){ let s=String(s0||"").replace(/[（(][^）)]*[）)]/g,"").replace(/〜[^;；]*/g,"").split(/[;；]/)[0].split(/[,、/]/)[0].trim(); if(!s) s=String(s0||"").split(/[;；]/)[0].trim(); return s.length>(n||16)?s.slice(0,(n||16)-1)+"…":s }
function tokVi(k){ if(k.ty==="w") return short(k.e[3]||k.e[4]); if(k.ty==="f") return k.f[1]; if(k.ty==="kj") return (k.vi?short(k.vi,10):"")||k.hv; if(k.ty==="n") return k.vi||k.s; if(k.ty==="k") return k.s; return "?" }
function tokRead(k){ if(k.ty==="w") return k.e[1]&&k.e[1]!==k.s?k.e[1]:""; if(k.ty==="kj"){const d=KJD[k.s]; return d?(d[2]||d[1]||"").split(/[、,]/)[0].replace(/\..*/,""):""} return "" }
function tokHTML(k,i){
  if(k.ty==="p") return `<span class="jp" style="margin:0 2px">${esc(k.s)}</span>`;
  const cls=k.ty==="f"?"f":(k.ty==="u"||k.ty==="k")?"u":"";
  const r=tokRead(k);
  return `<button class="v11-tok ${cls}" data-v11tok="${i}"><span class="j">${esc(k.s)}</span>${r?`<span class="r">${esc(r)}</span>`:""}<span class="v">${esc(tokVi(k))}</span></button>`;
}
function tokDetail(k){
  if(k.ty==="w"){ const x={e:k.e,i:k.di,l:k.l,src:k.s}; return lkEntryHTML(x,true)+(k.l&&k.l.length?`<div class="small"><b>Chia:</b> ${esc(k.e[0])} → ${esc(k.l.join(" → "))} → ${esc(k.s)}</div>`:"") }
  if(k.ty==="f"){ const f=k.f; return `<div class="lkent"><div class="lkhead"><span class="jp lkw">${esc(f[0])}</span><span class="chip plain">${({p:"trợ từ",c:"nối mệnh đề",a:"trợ động từ / đuôi",d:"đại từ, chỉ định",e:"đuôi câu",q:"nghi vấn",x:"cụm cố định",pn:"tên riêng"})[f[3]]||"từ chức năng"}</span></div><div class="lkvi">${esc(f[1])}</div>${f[2]?`<div class="small">${esc(f[2])}</div>`:""}${k.l&&k.l.length?`<div class="small"><b>Chia:</b> ${esc(f[0])} → ${esc(k.l.join(" → "))} → ${esc(k.s)}</div>`:""}</div>` }
  if(k.ty==="kj") return lkKanjiRow(k.s);
  if(k.ty==="k") return `<div class="lkent"><span class="jp lkw">${esc(k.s)}</span> <span class="small muted">Từ katakana (ngoại lai) — thử đọc thành tiếng Anh: ${esc(k.s)}.</span></div>`;
  return `<div class="lkent small muted">Chưa phân tích được «${esc(k.s)}» — có thể là một phần của từ chia, tên riêng hoặc văn nói.</div>`;
}

/* ----- dịch nháp theo cấu trúc ----- */
const PLACE=/(phòng|ga\b|công ty|trường|nhà|cửa hàng|thành phố|nước|công viên|thư viện|bệnh viện|quán|nhật|đường|văn phòng|sân|khách sạn|chỗ|nơi|bãi|chợ|siêu thị|trạm|bờ|hội trường|cuộc họp|tokyo|osaka|kyoto|hà nội|việt nam|lớp|phố|làng|đảo|núi|biển|sông|bưu điện|ngân hàng|chung cư|ký túc|bếp|vườn|phía|bên|trong|ngoài|trên|dưới|giữa|đây|đó|kia|đâu)/i;
const TIME=/(giờ|phút|ngày|tháng|năm|tuần|sáng|chiều|tối|đêm|hôm|mai|nay|qua|lúc|khi|thứ|cuối|đầu|mùa|hè|đông|xuân|thu|trước|sau|\d)/i;
const SAY=/(nói|nghĩ|bảo|gọi|hỏi|nghe|viết|trả lời|kể|báo|cho rằng|tin|cảm thấy|thấy)/i;
function vtype(k){ if(k.ty==="f"&&k.f[3]==="x") return "x"; if(k.ty==="f"&&k.f[3]==="pn") return "f"; if(k.ty!=="w") return k.ty==="kj"||k.ty==="k"||k.ty==="n"?"n":k.ty==="f"?"f":"u";
  if((k.l||[]).some(l=>/N \+ する|thể て|quá khứ \(た\)|thể ます|phủ định|khả năng|sai khiến|bị động|điều kiện|ý chí|mệnh lệnh/.test(l))) return "v";
  const p=String(k.e[2]||""); if(/v1|v5|vsi|vk/.test(p)) return "v"; if(/adj/.test(p)) return "adj"; if(/\bna\b/.test(p)) return "na"; if(/adv/.test(p)) return "adv"; if(/conj/.test(p)) return "conj"; if(/int/.test(p)) return "int"; if(/pn/.test(p)) return "pn"; return "n" }
function conjMarks(labels){
  const L=labels.join("|"); const pre=[], post=[]; let cond="";
  if(/quá khứ/.test(L)) pre.push("đã"); if(/đang|trạng thái/.test(L)) pre.push("đang");
  if(/phủ định|không \(ず\)|mà không/.test(L)) pre.push("không"); if(/muốn/.test(L)) pre.push("muốn");
  if(/khả năng/.test(L)&&!/bị động/.test(L)) pre.push("có thể"); if(/bị động \/ tôn kính|bị động/.test(L)) pre.push("được/bị");
  if(/bị bắt làm/.test(L)) pre.push("bị bắt"); else if(/sai khiến/.test(L)) pre.push("bắt/cho");
  if(/phải/.test(L)) pre.push("phải"); if(/không cần/.test(L)) pre.push("không cần"); if(/được phép/.test(L)) pre.push("được phép"); if(/không được/.test(L)) pre.push("không được");
  if(/thử/.test(L)) pre.push("thử"); if(/mệnh lệnh/.test(L)) pre.push("hãy"); if(/cấm/.test(L)) pre.push("đừng");
  if(/ý chí|rủ rê/.test(L)) pre.push("hãy cùng / định"); if(/mời/.test(L)) post.push("không?"); if(/đề nghị/.test(L)) post.push("nhé?");
  if(/làm sẵn/.test(L)) post.push("sẵn"); if(/lỡ|xong hẳn|xong \(ちゃう\)/.test(L)) post.push("mất"); if(/trông có vẻ sắp/.test(L)) pre.push("trông có vẻ sắp"); else if(/trông có vẻ/.test(L)) pre.push("trông có vẻ");
  if(/quá \(/.test(L)) pre.push("quá"); if(/dễ \(/.test(L)) pre.push("dễ"); if(/khó \(/.test(L)) pre.push("khó"); if(/trở nên/.test(L)) pre.push("trở nên");
  if(/\.\.\.dần|…dần|đi rồi về|dần đi/.test(L)) post.push("dần");
  if(/điều kiện/.test(L)) cond="nếu"; if(/liệt kê/.test(L)) pre.push("lúc thì");
  if(/phó từ/.test(L)) pre.push("một cách");
  if(/phải \(|không cần \(|được phép \(|không được \(/.test(L)){ const i=pre.indexOf("không"); if(i>=0) pre.splice(i,1) }
  if(/được làm cho/.test(L)){ pre.push("được"); post.push("cho") } else if(/làm cho tôi/.test(L)) post.push("cho tôi"); else if(/làm cho \(てあげる\)|làm cho \(てくださる\)/.test(L)) post.push("cho");
  if(/hãy \(てください\)/.test(L)) pre.unshift("hãy");
  return {pre,post,cond};
}
function draft(tokens){
  // 1. bunsetsu: từ nội dung + các trợ từ/đuôi theo sau
  const ph=[]; let cur=null;
  const flush=()=>{ if(cur){ph.push(cur); cur=null} };
  for(const k of tokens){
    if(k.ty==="p"){ flush(); ph.push({punct:k.s}); continue }
    if(k.ty==="u") continue;
    const vt=vtype(k);
    if(vt==="f"){ const ty=k.f[3];
      if(ty==="d"||ty==="q"||ty==="pn"){ flush(); cur={head:k,vi:k.f[1].replace(/\s*\(.*?\)/g,""),vt:"n",parts:[]}; continue }
      if(!cur) cur={head:null,vi:"",vt:"n",parts:[]};
      cur.parts.push(k); if(k.l&&k.l.length) cur.fl=(cur.fl||[]).concat(k.l); continue }
    if(vt==="x"){ flush(); ph.push({head:k,vi:k.f[1],vt:"x",parts:[]}); continue }
    flush(); cur={head:k,vi:tokVi(k),vt,parts:[],labels:k.l||[]};
  }
  flush();
  // 2. gộp bổ nghĩa: tính từ / động từ thể thường / danh từ ghép / この / Nの + N
  for(let i=0;i<ph.length-1;i++){ const a=ph[i], b=ph[i+1]; if(!a.head||!b.head||a.punct||b.punct) continue;
    const aParts=a.parts.map(p=>p.f[0]).join(""); if(b.vt!=="n") continue;
    if((a.vt==="adj"&&!a.parts.length)||(a.vt==="na"&&aParts==="な")||(a.vt==="v"&&!a.parts.length&&!/thể て|ます|ながら|điều kiện|liệt kê|dù \(|sau khi|ý chí|rủ rê|mời|đề nghị/.test((a.labels||[]).join()))){
      const m=conjMarks(a.labels||[]); const adj=[...m.pre,a.vi,...m.post].join(" ");
      b.vi=b.vi+(a.vt==="v"?" mà "+adj:" "+adj); ph.splice(i,1); i--; continue }
    if(!a.parts.length&&a.vt==="n"&&a.head.ty!=="f"&&!TIME.test(a.vi)){ b.vi=b.vi+" "+a.vi; ph.splice(i,1); i--; continue }
    if(!a.parts.length&&a.vt==="n"&&a.head.ty==="f"&&/^(この|その|あの|どの|こんな|そんな|あんな|どんな)$/.test(a.head.s)){ b.vi=b.vi+" "+a.vi; ph.splice(i,1); i--; continue }
    if(aParts==="の"&&a.vt==="n"){ const pron=/^(tôi|bạn|anh ấy|cô ấy|chúng tôi|mọi người|bản thân|ai|chúng ta)$/i.test(a.vi)||/さん|様|先生|部長|課長|社長|母|父|友達|家族|彼|私|僕/.test(a.head.s);
      b.vi=b.vi+(pron?" của ":" ")+a.vi; ph.splice(i,1); i--; continue }
  }
  // 3. tách mệnh đề
  const CONN={"ために":"để","ように":"để/sao cho","わりに":"so với","にしては":"xét là","上に":"thêm vào đó","一方で":"mặt khác","から":"vì","ので":"vì","のに":"vậy mà","けど":"nhưng","けれど":"nhưng","けれども":"nhưng","が":"nhưng","し":"vả lại","ても":"dù","たら":"nếu/khi","ば":"nếu","なら":"nếu","と":"hễ/khi","ながら":"vừa","とき":"khi","時":"khi","場合":"trường hợp","前に":"trước khi","後で":"sau khi","うちに":"trong khi còn","間に":"trong lúc","間":"suốt lúc","たびに":"mỗi lần","おかげで":"nhờ","せいで":"tại","ついでに":"nhân tiện","とたん":"vừa… thì","最中":"đang lúc"};
  const clauses=[]; let c={items:[],conn:""};
  for(const p of ph){
    if(p.punct){ if(/[。！？!?]/.test(p.punct)){ if(c.items.length) clauses.push(c); c={items:[],conn:""}; c.end=p.punct } else if(p.punct==="、"&&c.items.length&&c.items[c.items.length-1].vt==="v"&&!c.items[c.items.length-1].parts.length){ clauses.push(c); c={items:[],conn:"rồi"} } continue }
    c.items.push(p);
    const last=p.parts[p.parts.length-1]; let cw=last&&CONN[last.f[0]]?last.f[0]:null; if(cw&&p.vt==="n"&&/^(と|が|から|まで|し)$/.test(cw)) cw=null;
    const labs=p.labels||[]; const lastL=labs[labs.length-1]||"";
    const te=p.vt==="v"&&!p.parts.length&&/^thể て$/.test(lastL)&&!labs.some(l=>/đang|làm sẵn|lỡ|thử|đã được|xong/.test(l));
    let conn2=cw?CONN[cw]:te?"rồi":"";
    if(!conn2&&p.vt==="v"&&!p.parts.length){ if(labs.some(l=>/điều kiện/.test(l))){conn2="nếu/khi"; cw="たら"} else if(labs.some(l=>/vừa… vừa/.test(l))){conn2="vừa"; cw="ながら"} else if(labs.some(l=>/dù \(ても\)/.test(l))){conn2="dù"; cw="ても"} else if(labs.some(l=>/sau khi \(てから\)/.test(l))){conn2="sau khi"; cw="てから"} }
    if(conn2){ c.conn2=conn2; c.cw=cw||"て"; clauses.push(c); c={items:[],conn:""} }
  }
  if(c.items.length) clauses.push(c);
  // 3b. chủ đề は ở mệnh đề phụ (danh từ + liên từ) → chuyển sang mệnh đề chính
  for(let i=0;i<clauses.length-1;i++){ const cl=clauses[i]; if(!cl.cw||cl.items.length<2) continue; const pred=cl.items[cl.items.length-1]; if(pred.vt!=="n") continue; const si=cl.items.findIndex(p=>p.parts.some(x=>x.f[0]==="は")); if(si>=0&&si<cl.items.length-1){ const [sp]=cl.items.splice(si,1); clauses[i+1].items.unshift(sp) } }
  // 4. dịch từng mệnh đề
  const PART={"を":"","が":"","は":"","に":"","で":"","と":"với","へ":"đến","から":"từ","まで":"đến","までに":"trước","より":"hơn","も":"cũng","の":"của","か":"hay","だけ":"chỉ","しか":"chỉ","ばかり":"toàn","ほど":"đến mức","くらい":"khoảng","ぐらい":"khoảng","こそ":"chính","でも":"ngay cả","さえ":"ngay cả","など":"v.v.","には":"ở","とは":"với","のは":"việc","のが":"việc","のを":"việc","について":"về","に対して":"đối với","にとって":"đối với","によって":"tùy/bởi","によると":"theo","として":"với tư cách","とともに":"cùng với","や":"và","とか":"hay"};
  const NOM=/^(のは|のが|のを|のに|のも|のと|のより)$/;
  const timeish=p=>TIME.test(p.vi||"")&&p.parts.every(x=>/^(に|から|まで|は|も|までに|ごろ|の)$/.test(x.f[0]));
  function clauseText(items,cl,nominal){
    if(!items.length) return "";
    // mệnh đề danh hóa bên trong: … Vるのは / のが / のを
    for(let j=0;j<items.length-1;j++){ const p=items[j]; const nomP=p.parts.find(x=>NOM.test(x.f[0])); if(nomP&&(p.vt==="v"||p.vt==="adj")){ const inner=items.slice(0,j+1); const rest=p.parts; p.parts=rest.filter(x=>x!==nomP); const txt=clauseText(inner,{},true); const np={head:p.head,vi:"việc "+txt,vt:"n",parts:[{f:[nomP.f[0].slice(1)||"は","","","p"],ty:"f"}]}; items=[np].concat(items.slice(j+1)); break } }
    const pred=items[items.length-1]; const rest=items.slice(0,-1);
    const predLabs=(pred.labels||[]).concat(pred.fl||[]);
    const isPredV=pred.vt==="v"||pred.vt==="adj"||pred.vt==="na"||(pred.parts.some(p=>/^(です|だ|でした|だった|じゃない|ではない|でしょう|だろう)$/.test(p.f[0])));
    const causative=predLabs.some(l=>/sai khiến/.test(l))&&!predLabs.some(l=>/bị bắt làm/.test(l));
    const passive=predLabs.some(l=>/được làm cho|bị động/.test(l)); const become=/trở nên|trở thành|quyết định|làm thành/.test(pred.vi||"");
    const gaObj=predLabs.some(l=>/khả năng/.test(l))||/thích|ghét|muốn|có thể|hiểu|biết|giỏi|kém|cần|có\b|sợ|cho/.test(pred.vi||"");
    let subj=null, causee=null; const others=[];
    for(const p of rest){ const pp=p.parts.map(x=>x.f[0]);
      if(!subj&&(pp.includes("は")||(pp.includes("が")&&!gaObj))&&(p.vt==="n")&&!TIME.test(p.vi)) subj=p;
      else if(causative&&!causee&&(pp.includes("に")||pp.includes("を"))&&p.vt==="n"&&!TIME.test(p.vi)) causee=p;
      else others.push(p) }
    if(!subj&&!nominal&&rest[0]&&rest[0].vt==="n"&&!rest[0].parts.length&&rest.length>0&&!TIME.test(rest[0].vi)){ subj=rest[0]; others.splice(others.indexOf(rest[0]),1) }
    const phr=(p,bare)=>{ const pp=p.parts.map(x=>x.f[0]).filter(x=>x!=="は"&&x!=="が"&&!/^(です|だ|でした|だった|ね|よ|か|んです|のです|んだ|のだ)$/.test(x)&&!(p===pred&&(x===cl.cw||(cl.cw&&x==="の"))));
      let s=p.vi||""; const m=conjMarks(p.labels||[]); const m2=conjMarks(p.fl||[]);
      const perm=pp.some(x=>/いただ|もらえ|ください|くれ/.test(x))||(p.fl||[]).some(l=>/được làm cho|hãy/.test(l))||(p.labels||[]).some(l=>/được làm cho \(ていただく\)|được làm cho \(てもらう\)|hãy \(てください\)/.test(l));
      if(perm&&m.pre.includes("bắt/cho")){ m.pre=m.pre.filter(x=>x!=="bắt/cho"&&x!=="được"&&x!=="hãy"); m.pre.unshift("xin phép được"); m.post=m.post.filter(x=>x!=="cho") }
      if(p===pred&&causative&&causee){ const ci=m.pre.indexOf("bắt/cho"); if(ci>=0) m.pre[ci]="bắt/cho "+phr(causee,true) }
      if(p.vt==="v"||p.vt==="adj") s=[...m.pre,s,...m.post].join(" ");
      if(bare) return [...m2.pre,s,...m2.post].join(" ");
      const extra=[], postX=[]; pp.forEach(x=>{ if(x==="に"){ if(passive) extra.unshift("bởi"); else if(become||(p.vt==="v")) {} else extra.unshift(TIME.test(p.vi)?"vào":PLACE.test(p.vi)?"ở/đến":"cho/vào") } else if(x==="で"){ extra.unshift(PLACE.test(p.vi)?"ở":"bằng") } else if(x==="と"){ extra.unshift(SAY.test(pred.vi||"")?"rằng":"với") } else if(x==="も"){ extra.push("cũng") } else if(PART[x]!=null){ if(PART[x]) extra.unshift(PART[x]) } else if(FUNC_BY[x]&&FUNC_BY[x][3]==="a"){ const g=FUNC_BY[x][1].replace(/\s*\(.*?\)/g,"").split(" / ")[0].trim(); if(g.includes("…")){ const [g1,g2]=g.split("…"); if(g1.trim()) extra.unshift(g1.trim()); if(g2.trim()) postX.push(g2.trim()) } else if(/^(sẵn|mất)/.test(g)) postX.push(g); else extra.unshift(g) } });
      const pre=extra.filter(e=>!/^(cũng)$/.test(e)), post=extra.filter(e=>/^(cũng)$/.test(e)).concat(postX);
      return [...m2.pre,...pre,s,...post,...m2.post].filter(Boolean).join(" ") };
    let predS=phr(pred); const pp=pred.parts.map(x=>x.f[0]);
    if(!isPredV&&pred.vt==="n"&&!nominal&&pred.parts.every(x=>/^(です|だ|でした|だった|じゃない|ではない|でしょう|だろう|ね|よ|んです|のです|んだ|のだ|でございます|かもしれない|かも|か)$/.test(x.f[0]))&&!cl.cw&&(subj||!rest.length)) predS=(pp.some(x=>/じゃない|ではない/.test(x))?"không phải là ":"là ")+predS;
    if(pp.includes("か")||pp.includes("んですか")) predS+=" ?"; if(pp.includes("ね")) predS+=" nhỉ"; if(pp.includes("よ")) predS+=" đấy"; if(pp.some(x=>/^(んです|のです|んだ|のだ)$/.test(x))) predS+=" (đấy / là vì)";
    if(pp.includes("でしょう")||pp.includes("だろう")) predS="chắc là "+predS; if(pp.includes("かもしれない")||pp.includes("かも")) predS="có lẽ "+predS;
    const pri=p=>{ const pp2=p.parts.map(x=>x.f[0]); if(pp2.includes("を")||pp2.includes("が")) return 0; if(pp2.some(x=>/^(に|と|へ|には|のを|のが)$/.test(x))&&!TIME.test(p.vi)) return 1; return 2 };
    const times=others.filter(timeish), advs=others.filter(p=>!timeish(p)&&p.vt==="adv"&&!p.parts.length), objs=others.filter(p=>!timeish(p)&&!(p.vt==="adv"&&!p.parts.length)).sort((a,b)=>pri(a)-pri(b));
    let s=[...times.map(p=>phr(p)),subj?phr(subj):"",...advs.map(p=>phr(p)),predS,...objs.map(p=>phr(p))].filter(Boolean).join(" ");
    if(subj&&subj.parts.some(x=>x.f[0]==="は")&&/^(nên|phải|không|có thể|là|được|bị|cần|đã|đang|chỉ)/.test(predS)&&!/^(tôi|bạn|anh|cô|chúng|mọi|bản thân)/i.test(subj.vi)) s=s.replace(phr(subj)+" ",phr(subj)+" thì ");
    return s;
  }
  const out=clauses.map(cl=>{
    let s=clauseText(cl.items,cl,false); if(!s) return "";
    if(cl.cw){ const w=cl.conn2; if(/^(vì)$/.test(w)) s="vì "+s+", nên"; else if(/^(để|để\/sao cho)$/.test(w)) s=w+" "+s+","; else if(/^(nếu|nếu\/khi|hễ\/khi|dù|khi|trước khi|sau khi|trong khi còn|trong lúc|suốt lúc|mỗi lần|nhờ|tại|nhân tiện|vừa… thì|đang lúc|trường hợp|so với|xét là)$/.test(w)) s=w+" "+s+(w==="dù"?" thì vẫn":" thì"); else if(w==="vừa") s="vừa "+s+" vừa"; else if(w==="rồi") s=s+", rồi"; else s=s+", "+w; }
    if(cl.conn==="rồi") s="rồi "+s;
    return s+(cl.end?cl.end.replace("。",".").replace("！","!").replace("？","?"):"");
  }).filter(Boolean).join(" ");
  return out.replace(/\s+,/g,",").replace(/\s+\./g,".").replace(/\s{2,}/g," ").replace(/^\p{Ll}/u,ch=>ch.toUpperCase());
}
V.draft=draft;

/* ----- ngữ pháp trong câu ----- */
function grammarIn(text,tokens){
  const seen=new Set(), out=[];
  tokens.forEach(k=>{ if(k.ty==="f"&&/^(a|c|e)$/.test(k.f[3])&&!seen.has(k.f[0])&&k.f[0].length>=2){ seen.add(k.f[0]); out.push({p:k.f[0],m:k.f[1],d:k.f[2]}) }
    if(k.ty==="w"&&k.l&&k.l.length){ const chain=k.l.filter(l=>l!=="N + する"); if(chain.length&&!(chain.length===1&&/^(thể ます|lịch sự)$/.test(chain[0]))){ out.push({p:k.s,m:"chia: "+k.e[0]+" → "+chain.join(" → "),d:"Từ gốc "+k.e[0]+(k.e[1]&&k.e[1]!==k.e[0]?" ("+k.e[1]+")":"")+": "+short(k.e[3]||k.e[4],40)+(k.l.includes("N + する")?" · danh từ + する":"")}) } } });
  try{ lkGrammar(text).forEach(g=>{ if(!seen.has("g:"+g.p)){ seen.add("g:"+g.p); out.push({p:g.p,m:g.m,c:g.c}) } }) }catch(e){}
  if(window.KX&&KX.ready){ KX.G.forEach(g=>{ const core=String(g.t).replace(/[A-ZＡ-Ｚ〜～\-\s＋+・\/／()（）VNる]/g,"").split(/[、,]/)[0]; if(core.length>=3&&text.includes(core)&&!seen.has("x:"+core)){ seen.add("x:"+core); out.push({p:g.t,m:g.vi,g}) } }) }
  return out.slice(0,8);
}
function sentenceHTML(text,compact){
  const toks=tokenize(text); const dr=draft(toks); const gr=grammarIn(text,toks);
  const words=toks.filter(k=>k.ty==="w"); const kjs=[...new Set([...text].filter(isKj))];
  V._lastToks=toks;
  return `<div class="v11-sent">
    <div class="eyebrow">Dịch nháp theo cấu trúc</div>
    <div class="v11-draft">${esc(dr||"(chưa ghép được)")}</div>
    <p class="small muted" style="margin:2px 0 6px">Bản nháp do máy ghép từ + sắp lại trật tự (offline), có thể lủng củng — hãy đọc phần phân tích bên dưới để tự hiểu câu; đó mới là phần giúp bạn nhớ.</p>
    <div class="eyebrow">Từng từ (bấm để xem chi tiết)</div>
    <div class="v11-toks">${toks.map(tokHTML).join("")}</div><div class="v11-det" id="v11det" hidden></div>
    ${gr.length?`<div class="v11-sec"><div class="eyebrow">Ngữ pháp trong câu</div>${gr.map(g=>`<div class="v11-gr"><b class="jp">${esc(g.p)}</b> — ${esc(g.m)}${g.d?`<div class="small muted">${esc(g.d)}</div>`:""}${g.c?` <button class="lkbtn" data-lkcard="${esc(g.c.k)}">thẻ ${esc(kbLabel(g.c))}</button><div class="lkcard"></div>`:""}${g.g?`<details><summary class="small">chi tiết mẫu</summary><div class="small">${esc(g.g.d||"").replace(/\n/g,"<br>")}${(g.g.ex||[]).slice(0,2).map(e=>`<div class="jp" style="margin-top:4px">${esc(e[0])}</div><div class="muted">${esc(e[1]||"")}</div>`).join("")}</div></details>`:""}</div>`).join("")}</div>`:""}
    ${words.length&&!compact?`<div class="v11-sec"><details><summary class="small">Từ vựng trong câu (${words.length}) — lưu vào sổ</summary>${words.map((k,i)=>`<div class="row" style="justify-content:space-between;gap:6px;padding:4px 0;border-bottom:1px solid var(--line)"><span><span class="jp">${esc(k.e[0])}</span> <span class="jp small muted">${esc(k.e[1]||"")}</span> · ${esc(short(k.e[3]||k.e[4],40))} <span class="small muted">${esc(POS_VI[String(k.e[2]).split(",")[0]]||"")}</span></span><span class="row" style="gap:4px"><button class="lkbtn" data-lksay="${esc(k.e[1]||k.e[0])}">🔊</button><button class="lkbtn" data-lksave="${esc(k.e[0])}">${S.words&&S.words[k.e[0]]?"✓ đã lưu":"+ Lưu"}</button></span></div>`).join("")}</details></div>`:""}
    ${kjs.length&&!compact?`<details class="lkkjs"><summary class="small">Từng chữ Hán (${kjs.length})</summary>${kjs.slice(0,12).map(lkKanjiRow).join("")}</details>`:""}
    <div class="row" style="gap:6px;margin-top:8px"><button class="btn small" data-v11="say" data-t="${esc(text)}">🔊 Nghe cả câu</button>${compact?`<button class="btn small" data-v11="expand" data-t="${esc(text)}">Mở rộng</button>`:""}<a class="btn ghost small" target="_blank" rel="noopener" href="https://translate.google.com/?sl=ja&tl=vi&text=${encodeURIComponent(text)}&op=translate">So với Google Dịch ↗</a></div>
  </div>`;
}
V.sentenceHTML=sentenceHTML;
/* v13: vùng bôi đen / câu dán vào có lẫn tiếng Việt (vd. "すごい！ 3 câu đúng liên tiếp") → chỉ giữ phần tiếng Nhật để tra.
   Chữ Latin / số chỉ được giữ khi dính liền chữ Nhật (ITエンジニア, 20部, Tシャツ); từ tiếng Việt (có dấu, hoặc đứng riêng) bị bỏ. */
function jpOnly(text){
  const s=String(text||""); if(!/[A-Za-zÀ-ỹĐđ]/.test(s)) return s.trim();
  const JP=/[\u3040-\u30ff\u3400-\u9fff々〆]/;
  const runs=[]; let cur="", num="";
  const flush=()=>{ num=""; let r=cur.replace(/^[\s0-9０-９.,:;!?()\-–—=→+*\/'"“”‘’]+/,"").replace(/[\s.,:;()\-–—=→+*\/'"“”‘’]+$/,""); if(JP.test(r)) runs.push(r); cur="" };
  const toks=s.split(/(\s+)/);
  for(const tk of toks){
    if(!tk) continue;
    if(/^\s+$/.test(tk)){ if(cur&&!/\s$/.test(cur)) cur+=" "; continue }
    if(!JP.test(tk)){ // từ không có chữ Nhật: số đứng giữa câu Nhật thì giữ, còn lại là ranh giới
      if(/^[0-9０-９.,%％]+$/.test(tk)&&cur&&!num){ num=tk; continue } // số: chỉ giữ nếu ngay sau đó lại là chữ Nhật
      flush(); continue }
    if(num){ cur+=num; num="" }
    // từ có chữ Nhật: bỏ các cụm chữ Latin có dấu tiếng Việt, hoặc cụm Latin dài không dính chữ Nhật
    let t=tk.replace(/[A-Za-zÀ-ỹĐđ]+/g,(m,off,str)=>{ const vi=/[À-ỹĐđ]/.test(m); const prev=str[off-1]||"", next=str[off+m.length]||""; const adj=JP.test(prev)||JP.test(next)||/[0-9０-９]/.test(prev);
      return (!vi&&adj&&m.length<=8)?m:"\u0001" });
    t.split("\u0001").forEach((part,i,arr)=>{ if(i>0) flush(); cur+=part; });
  }
  flush();
  if(!runs.length) return s.trim();
  return runs.map(r=>r.replace(/\s+/g,"")).filter((r,i,a)=>a.indexOf(r)===i).slice(0,6).join("、").replace(/([、。！？!?])、/g,"$1");
}
window.lkJpOnly=jpOnly; V.jpOnly=jpOnly;
function isSentence(text){ return text.length>=8||/[、。]/.test(text)||tokenize(text).filter(k=>k.ty!=="p").length>=3 }
// patch lkBuild: câu dài → phân tích
const _lkBuild=window.lkBuild;
window.lkBuild=function(text){
  text=jpOnly(text);
  const whole=lkFind(text.replace(/\s+/g,""));
  if(!whole.length&&isSentence(text)) return sentenceHTML(text,true);
  return _lkBuild(text);
};
// patch lkOnSel: cho phép bôi đen tới 400 ký tự
window.lkOnSel=function(){
  const sel=window.getSelection(); if(!sel||sel.rangeCount===0){ if(!LK.pin) lkHide(); return }
  const text=String(sel).trim(); const range=sel.getRangeAt(0);
  if(LK.el&&!LK.el.hidden&&LK.el.contains(range.commonAncestorContainer)) return;
  if(!text||text.length>400||!isJp(text)){ if(!LK.pin&&!text) lkHide(); return }
  if(jpOnly(text)===LK.sel&&LK.el&&!LK.el.hidden) return;
  const node=range.commonAncestorContainer.nodeType===1?range.commonAncestorContainer:range.commonAncestorContainer.parentElement;
  if(node&&node.closest("input,textarea,select,#lkpop,.v11-sent")) return;
  LK.sel=text; LK.pin=false; LK.ctx=lkContext(range);
  const jp=jpOnly(text); LK.sel=jp; // chỉ tra phần tiếng Nhật (bỏ chữ Việt lẫn trong vùng bôi đen)
  lkShow(jp,range.getBoundingClientRect(),lkBlocked(range));
};
document.addEventListener("click",e=>{
  const tk=e.target.closest("[data-v11tok]"); if(tk){ const box=tk.closest(".v11-sent"); const det=box&&box.querySelector("#v11det, .v11-det"); const k=(V._lastToks||[])[+tk.dataset.v11tok]; if(det&&k){ const on=tk.classList.contains("on"); $$(".v11-tok.on",box).forEach(b=>b.classList.remove("on")); if(on){det.hidden=true; return} tk.classList.add("on"); det.hidden=false; det.innerHTML=tokDetail(k) } return }
  const b=e.target.closest("[data-v11]"); if(!b) return;
  const a=b.dataset.v11;
  if(a==="say"){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(b.dataset.t); u.lang="ja-JP"; if(typeof JA_VOICES!=="undefined"&&JA_VOICES[0]) u.voice=JA_VOICES[0]; u.rate=0.9; speechSynthesis.speak(u) }catch(x){ toast("Trình duyệt này không đọc được tiếng Nhật") } return }
  if(a==="expand"){ lkHide(); openSentence(b.dataset.t); return }
  if(a==="analyze"){ const ta=$("#v11sentIn"); const t=jpOnly((ta&&ta.value||"").trim()); if(!t||!isJp(t)){toast("Dán một câu tiếng Nhật vào ô trên");return} const out=$("#v11sentOut"); if(out){ out.innerHTML=sentenceHTML(t,false); out.hidden=false } return }
});
function openSentence(text){ text=jpOnly(text); lkHide(); const b=kxModal(`<div class="eyebrow">Phân tích câu</div><div class="jp" style="font-size:18px;margin:4px 0 10px">${esc(text)}</div>${sentenceHTML(text,false)}`); b.addEventListener("click",e=>{const x=e.target.closest("button"); if(!x) return; if(x.dataset.lksay){lkSay(x.dataset.lksay)} else if(x.dataset.lksave){lkSaveWord(x.dataset.lksave); x.textContent=S.words[x.dataset.lksave]?"✓ đã lưu":"+ Lưu"} else if(x.dataset.lkcard){const slot=x.nextElementSibling; slot.innerHTML=slot.innerHTML?"":kbCardHTML(KB_BY[x.dataset.lkcard],true)} else if(x.dataset.kxopen){kxOpen(x.dataset.kxopen)}}) }
V.openSentence=openSentence;
function dictToolHTML(){
  return `<section class="sheet v11-dict" id="v11dict"><div class="eyebrow">Dịch & phân tích câu (offline)</div>
    <p class="small muted" style="margin:4px 0 8px">Dán một câu tiếng Nhật (từ email, chat, bài đọc…). Sổ luyện tách từng từ, chỉ ra cách chia, trợ từ, mẫu ngữ pháp và ghép bản dịch nháp. Từ điển hiện có ${DIC.length.toLocaleString("vi-VN")} từ + ${FUNC.length} từ chức năng. Bôi đen chữ Nhật ở bất kỳ đâu cũng được phân tích như vậy.</p>
    <textarea id="v11sentIn" rows="2" placeholder="例：明日の会議までに、この資料をコピーしておいてください。"></textarea>
    <div class="row" style="gap:6px;margin-top:6px"><button class="btn primary small" data-v11="analyze">Phân tích & dịch</button></div>
    <div id="v11sentOut" hidden style="margin-top:10px"></div></section>`;
}
V.dictToolHTML=dictToolHTML;
})();
