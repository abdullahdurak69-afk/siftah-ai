// Çerezsiz ziyaretçi sayacı: sayfa açılışını ve telefon / WhatsApp tıklamalarını /api/t'ye bildirir.
// Sadece yayındaki sitede eklenir; önizlemelerde sayılmaz. sendBeacon sayfa kapanırken de gönderir.
const script = `(function(){
function s(e){try{navigator.sendBeacon("/api/t",e)}catch(_){}}
s("view");
document.addEventListener("click",function(ev){
var a=ev.target&&ev.target.closest?ev.target.closest("a[href]"):null;if(!a)return;
var h=a.getAttribute("href")||"";
if(h.indexOf("tel:")===0)s("tel");else if(h.indexOf("wa.me/")>-1||h.indexOf("whatsapp")>-1)s("wa");
},true);
})();`;

export function StatsBeacon() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
