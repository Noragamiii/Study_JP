// Sổ luyện N3 – service worker: mở được khi không có mạng
const V="sln3-dc124866ba";
const SHELL=["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png","data/kx-data.js?v=10a","data/kx-strokes.js?v=10a"];
const AUDIO=["audio/l-g01.mp3", "audio/l-g02.mp3", "audio/l-g03.mp3", "audio/l-g04.mp3", "audio/l-g05.mp3", "audio/l-h01.mp3", "audio/l-h02.mp3", "audio/l-h03.mp3", "audio/l-h04.mp3", "audio/l-h05.mp3", "audio/l-h06.mp3", "audio/l-k01.mp3", "audio/l-k02.mp3", "audio/l-k03.mp3", "audio/l-k04.mp3", "audio/l-k05.mp3", "audio/l-k06.mp3", "audio/l-k07.mp3", "audio/l-k08.mp3", "audio/l-p01.mp3", "audio/l-p02.mp3", "audio/l-p03.mp3", "audio/l-p04.mp3", "audio/l-p05.mp3", "audio/l-p06.mp3", "audio/l-p07.mp3", "audio/l-s01.mp3", "audio/l-s02.mp3", "audio/l-s03.mp3", "audio/l-s04.mp3", "audio/l-s05.mp3", "audio/l-s06.mp3", "audio/l-s07.mp3", "audio/l-s08.mp3", "audio/l-s09.mp3", "audio/l-s10.mp3", "audio/x-lg1.mp3", "audio/x-lg2.mp3", "audio/x-lg3.mp3", "audio/x-lh1.mp3", "audio/x-lh2.mp3", "audio/x-lk1.mp3", "audio/x-lk2.mp3", "audio/x-lk3.mp3", "audio/x-lk4.mp3", "audio/x-lp1.mp3", "audio/x-lp2.mp3", "audio/x-lp3.mp3", "audio/x-lp4.mp3", "audio/x-lp5.mp3", "audio/x-ls1.mp3", "audio/x-ls2.mp3", "audio/x-ls3.mp3", "audio/x-ls4.mp3", "audio/x-ls5.mp3", "audio/x-ls6.mp3"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
  // tải dần file nghe để dùng được khi không có mạng (không chặn cài đặt)
  caches.open(V+"-audio").then(c=>AUDIO.reduce((p,f)=>p.then(()=>c.match(f).then(m=>m||c.add(f).catch(()=>{}))),Promise.resolve()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==V+"-audio"&&!k.endsWith("-audio")).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url); if(e.request.method!=="GET"||u.origin!==location.origin) return;
  if(e.request.headers.has("range")||u.pathname.includes("/audio/tango-")) return; // âm thanh 1800 từ: trang tự lấy từng đoạn + tự lưu
  if(u.pathname.includes("/audio/")){e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok){const c=r.clone(); caches.open(V+"-audio").then(x=>x.put(e.request,c))} return r})));return}
  // trang chính: lấy bản mới nếu có mạng (chờ tối đa 4 giây), không thì dùng bản đã lưu
  e.respondWith(new Promise(res=>{let done=false; const fall=()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match("index.html")).then(m=>{if(!done&&m){done=true;res(m)}});
    const t=setTimeout(fall,4000);
    fetch(e.request).then(r=>{clearTimeout(t); if(r.ok){const c=r.clone(); caches.open(V).then(x=>x.put(e.request,c))} if(!done){done=true;res(r)}}).catch(()=>{clearTimeout(t); fall().then(()=>{if(!done){done=true;res(Response.error())}})});
  }));
});
