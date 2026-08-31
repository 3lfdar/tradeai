import {chromium} from 'playwright';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
for (const vp of [{width:1440,height:900,tag:'desk'},{width:390,height:844,tag:'phone'}]) {
  const ctx=await b.newContext({viewport:{width:vp.width,height:vp.height}});
  const p=await ctx.newPage();
  const errs=[], failed=[];
  p.on('pageerror',e=>errs.push(e.message));
  p.on('response',r=>{ if(r.status()>=400) failed.push(r.status()+' '+r.url().split('/').pop()); });
  await p.goto('http://127.0.0.1:8123/',{waitUntil:'load'});
  await p.waitForTimeout(4000);
  // کدام پوشه‌ی فریم استفاده شد؟
  const used = await p.evaluate(()=>performance.getEntriesByType('resource')
    .filter(r=>r.name.includes('.webp')).slice(0,1).map(r=>r.name.split('/').slice(-2,-1)[0])[0]);
  await p.evaluate(()=>{const t=document.querySelector('.hero-track');
    scrollTo(0,t.offsetTop+(t.offsetHeight-innerHeight)*0.6);});
  await p.waitForTimeout(1500);
  await p.screenshot({path:'/tmp/pkg-'+vp.tag+'.png'});
  const drawn = await p.evaluate(()=>{
    const c=document.querySelector('canvas'), g=c.getContext('2d');
    const d=g.getImageData(0,0,c.width,c.height).data; let s=0;
    for(let i=0;i<d.length;i+=4*1013) s+=d[i];
    return s;
  });
  console.log(vp.tag, '| فریم‌ها از:', used, '| مجموع روشنایی:', drawn, drawn>1000?'✓':'✗ خالی');
  console.log('   خطاها:', errs.length?errs.slice(0,2):'ندارد', '| درخواست ناموفق:', failed.length?failed.slice(0,3):'ندارد');
  await ctx.close();
}
await b.close();
