// Sổ luyện N3 – service worker: mở được khi không có mạng
const V="sln3-3bbdabdd69";
const SHELL=["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png"];
const AUDIO=[];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
  // tải dần file nghe để dùng được khi không có mạng (không chặn cài đặt)
  caches.open(V+"-audio").then(c=>AUDIO.reduce((p,f)=>p.then(()=>c.match(f).then(m=>m||c.add(f).catch(()=>{}))),Promise.resolve()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==V+"-audio"&&!k.endsWith("-audio")).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url); if(e.request.method!=="GET"||u.origin!==location.origin) return;
  if(u.pathname.includes("/audio/")){e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok){const c=r.clone(); caches.open(V+"-audio").then(x=>x.put(e.request,c))} return r})));return}
  // trang chính: lấy bản mới nếu có mạng (chờ tối đa 4 giây), không thì dùng bản đã lưu
  e.respondWith(new Promise(res=>{let done=false; const fall=()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match("index.html")).then(m=>{if(!done&&m){done=true;res(m)}});
    const t=setTimeout(fall,4000);
    fetch(e.request).then(r=>{clearTimeout(t); if(r.ok){const c=r.clone(); caches.open(V).then(x=>x.put(e.request,c))} if(!done){done=true;res(r)}}).catch(()=>{clearTimeout(t); fall().then(()=>{if(!done){done=true;res(Response.error())}})});
  }));
});
