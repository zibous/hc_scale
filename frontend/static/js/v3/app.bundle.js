(()=>{var u={text:"#8e8e93",grid:"#e5e5ea",radarBg:"rgba(0,122,255,0.1)"};function q(){let e=document.documentElement.getAttribute("data-theme")==="dark";u.text=e?"#aeaea2":"#8e8e93",u.grid=e?"#2c2c2e":"#e5e5ea",u.radarBg=e?"rgba(10,132,255,0.15)":"rgba(0,122,255,0.08)"}function U(e,a=3){return e.map((t,s)=>{if(s<a-1){let n=e.slice(0,s+1);return n.reduce((p,i)=>p+i,0)/n.length}return e.slice(s-a+1,s+1).reduce((n,p)=>n+p,0)/a})}function ue(e,a,t){let s=e.filter(b=>b[t]&&b[t]>0),o=s[s.length-1]?.[t]||0,n=s.length>0?s.reduce((b,y)=>b+y[t],0)/s.length:0,p=new Set(e.map(b=>b.date)),i=a.filter(b=>!p.has(b.date)&&b[t]&&b[t]>0),c=i.length>0?i.reduce((b,y)=>b+y[t],0)/i.length:n,g=n-c,m=g>.02?"\u25B2":g<-.02?"\u25BC":"\u25CF",f=["fat","visceral"].includes(t),x="badge-stable";return Math.abs(g)>.02&&(g>0?x=f?"badge-danger":"badge-success":x=f?"badge-success":"badge-danger"),{latest:o.toFixed(1),avg:n.toFixed(1),prevAvg:c.toFixed(1),diff:(g>0?"+":"")+g.toFixed(1),arrow:m,className:x}}function M(e,a,t,s){let n=document.getElementById(e)?.closest(".chart-card");if(!n)return;if(!document.getElementById("summary-footer-styles-v7")){let c=document.createElement("style");c.id="summary-footer-styles-v7",c.textContent=`
      .chart-summary-footer {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        margin-top: 24px;
        border-top: 1px solid var(--card-border);
        padding-top: 20px;
        display: flex;
        flex-direction: row; /* \u{1F527} Desktop-Standard: Boxen nebeneinander ausrichten */
        flex-wrap: wrap;     /* \u{1F527} Mobil-Standard: Automatischer Zeilenumbruch falls zu schmal */
        gap: 20px;
        width: 100%;
        justify-content: center; /* Zentriert die Kacheln in der Mitte */
      }
      .summary-block-notused {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1 1 340px;    /* \u{1F527} L\xE4sst Kacheln flexibel wachsen, bricht aber ab 340px Breite um */
        max-width: 440px;   /* Begrenzt die maximale Weite f\xFCr kompakten Look */
      }
      .summary-metric-title {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
      }
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        align-items: center;
        background: var(--bg-color);
        padding: 12px 16px;
        border-radius: 16px;
        border: 1px solid var(--card-border);
      }
      .summary-col {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .summary-col-label {
        font-size: 9px;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      .summary-col-value {
        font-size: 14px;
        font-weight: 700;
        color: var(--text-main);
      }
      .summary-pill {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        gap: 2px;
        justify-content: center;
      }
      .badge-success { background-color: rgba(52, 199, 89, 0.16); color: #248a3d; }
      .badge-danger { background-color: rgba(255, 59, 48, 0.16); color: #d6241a; }
      .badge-stable { background-color: rgba(142, 142, 147, 0.16); color: var(--text-muted); }

      [data-theme="dark"] .badge-success { color: #30d158; background-color: rgba(48, 209, 88, 0.2); }
      [data-theme="dark"] .badge-danger { color: #ff453a; background-color: rgba(255, 69, 58, 0.2); }

      @media (max-width: 768px) {
        .chart-summary-footer { flex-direction: column; align-items: center; }
        .summary-block { width: 100%; max-width: 100%; }
        .summary-grid { gap: 8px; padding: 10px; }
      }
    `,document.head.appendChild(c)}let p=n.querySelector(".chart-summary-footer");p||(p=document.createElement("div"),p.className="chart-summary-footer",n.appendChild(p));let i=a.map(c=>{let g=ue(t,s,c.field),m=parseFloat(g.diff)===0?"0.0":g.diff;return`
      <div class="summary-block">
        <div class="summary-metric-title">${c.label} <span style="font-size: 11px; font-weight:500; text-transform:none;">(${c.unit})</span></div>

        <div class="summary-grid">
          <div class="summary-col">
            <span class="summary-col-label">Aktuell</span>
            <span class="summary-col-value" style="font-size: 15px; color:var(--apple-blue);">${g.latest}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">\xD8 Zeitraum</span>
            <span class="summary-col-value">${g.avg}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">\xD8 Vor-Per.</span>
            <span class="summary-col-value" style="color:var(--text-muted); font-weight:500;">${g.prevAvg}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">Trend</span>
            <div class="summary-pill ${g.className}">
              <span>${g.arrow}</span>
              <span>${m}</span>
            </div>
          </div>
        </div>
      </div>
    `}).join("");p.innerHTML=i}function D(){return{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,labels:{color:u.text,boxWidth:10,usePointStyle:!0,font:{size:12,weight:"600"}}}},scales:{x:{type:"category",grid:{display:!1},ticks:{color:u.text,font:{size:11,weight:"500"}}},y:{grid:{color:u.grid},ticks:{color:u.text,font:{size:11,weight:"500"}}}}}}function Y(e,a,t,s){let o=document.getElementById("chartWeight"),n="transparent";if(o){let y=document.documentElement.getAttribute("data-theme")==="dark";n=o.getContext("2d").createLinearGradient(0,0,0,300),n.addColorStop(0,y?"rgba(255, 69, 58, 0.35)":"rgba(255, 59, 48, 0.22)"),n.addColorStop(1,"rgba(255, 59, 48, 0.0)")}M("chartWeight",[{field:"weight",label:"Gewicht",unit:"kg"},{field:"lbm",label:"Fettfreie Masse",unit:"kg"}],e,a);let p=e.map(y=>y.weight),i=e.map(y=>y.lbm),c=Math.min(...p,...i),g=Math.max(...p),m=g-c,f=c-1,x=g+1;if(m<3.5){let y=(c+g)/2;f=y-1.75,x=y+1.75}let b=D();b.scales&&delete b.scales,t("chartWeight",{type:"line",data:{labels:s,datasets:[{label:"Gewicht",data:p,borderColor:"#ff453a",backgroundColor:n,fill:!0,borderWidth:2.5,pointRadius:e.length>45?0:2,pointBackgroundColor:"#ff453a",tension:.2},{label:"Gewicht Trend",data:U(p,3),borderColor:"#ff9f0a",backgroundColor:"transparent",borderWidth:1.5,borderDash:[3,3],pointRadius:0,tension:.3},{label:"Fettfreie Masse",data:i,borderColor:"#0a84ff",backgroundColor:"transparent",borderWidth:1.5,pointRadius:0,tension:.2}]},options:{...b,responsive:!0,maintainAspectRatio:!1,scales:{x:{type:"category",grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff",maxRotation:0,autoSkip:!0,maxTicksLimit:6}},y:{type:"linear",min:Math.floor(f),max:Math.ceil(x),title:{display:!0,text:"Masse (kg)",color:u.text||"#ffffff"},grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff"}}}}})}function _(e,a,t,s){M("chartSummary",[{field:"weight",label:"Gewicht",unit:"kg"},{field:"muscle",label:"Muskeln",unit:"kg"},{field:"bmi",label:"BMI",unit:""}],e,a);let o=e.length<=1,n=e.map(d=>d.weight),p=e.map(d=>d.muscle),i=e.map(d=>d.bmi),c=Math.min(...n)-(o?5:1),g=Math.max(...n)+(o?5:1),m=Math.min(...p)-(o?5:.5),f=Math.max(...p)+(o?5:.5),x=Math.min(...i)-(o?5:.5),b=Math.max(...i)+(o?5:.5);if(o&&e.length>0){let d=e[0];t("chartSummary",{type:"bar",data:{labels:["Gewicht (kg)","Muskelmasse (kg)","BMI"],datasets:[{data:[d.weight,d.muscle,d.bmi],backgroundColor:["rgba(255, 69, 58, 0.6)","rgba(48, 209, 88, 0.6)","rgba(255, 159, 10, 0.6)"],borderColor:["#ff453a","#30d158","#ff9f0a"],borderWidth:1,borderRadius:12,barThickness:45,maxBarThickness:50}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1},ticks:{color:u.text||"#ffffff",font:{weight:"600"}}},y:{type:"linear",position:"left",min:Math.floor(Math.min(d.weight,d.muscle,d.bmi)-5),max:Math.ceil(Math.max(d.weight,d.muscle,d.bmi)+5),grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff"}}}}});return}let y=e.map(d=>({x:new Date(d.timestamp),y:d.weight})),l=e.map(d=>({x:new Date(d.timestamp),y:d.muscle})),r=e.map(d=>({x:new Date(d.timestamp),y:d.bmi}));t("chartSummary",{type:"bar",data:{datasets:[{type:"bar",label:"BMI",data:r,borderColor:"#ff9f0a",backgroundColor:"rgba(255, 159, 10, 0.15)",borderWidth:{top:1,right:0,bottom:0,left:0},borderRadius:4,barThickness:e.length>30?8:16,yAxisID:"yBmi",order:3},{type:"line",label:"Gewicht (kg)",data:y,borderColor:"#ff453a",backgroundColor:"transparent",borderWidth:1,pointRadius:e.length<20?4:0,pointBackgroundColor:"#ff453a",yAxisID:"yWeight",tension:.2,order:1},{type:"line",label:"Muskeln (kg)",data:l,borderColor:"#30d158",backgroundColor:"transparent",borderWidth:1,pointRadius:e.length<20?4:0,pointBackgroundColor:"#30d158",yAxisID:"yMuscle",tension:.2,order:2}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{x:{type:"time",time:{tooltipFormat:"dd.MM.yyyy",unit:e.length>45?"month":"day",stepSize:e.length>180?2:1,displayFormats:{day:"dd.MM",month:"MMM yyyy"}},grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff",maxRotation:0,maxTicksLimit:6}},yWeight:{type:"linear",position:"left",min:Math.floor(c),max:Math.ceil(g),title:{display:!0,text:"Gewicht (kg)",color:"#ff453a"},ticks:{color:u.text||"#ffffff"},grid:{color:u.grid||"#3a3a3c"}},yMuscle:{type:"linear",position:"right",min:Math.floor(m),max:Math.ceil(f),title:{display:!0,text:"Muskelmasse (kg)",color:"#30d158"},ticks:{color:u.text||"#ffffff"},grid:{display:!1}},yBmi:{type:"linear",position:"right",min:Math.floor(x),max:Math.ceil(b),display:!1,grid:{display:!1}}}}})}function j(e,a,t,s){let o=D();M("chartFat",[{field:"fat",label:"Fett",unit:"%"},{field:"visceral",label:"Viszeral",unit:"Lvl"}],e,a),t("chartFat",{type:"line",data:{labels:s,datasets:[{label:"K\xF6rperfett (%)",data:e.map(n=>n.fat),borderColor:"#ff9f0a",backgroundColor:"transparent",borderWidth:1,pointRadius:0},{label:"Viszeralfett",data:e.map(n=>n.visceral),borderColor:"#bf5af2",backgroundColor:"transparent",borderWidth:1,pointRadius:0,yAxisID:"yVisc"}]},options:{...o,scales:{x:o.scales.x,y:{grid:{color:u.grid},ticks:{color:u.text}},yVisc:{position:"right",grid:{display:!1},ticks:{color:u.text}}}}})}function J(e,a,t,s){M("chartMuscle",[{field:"muscle",label:"Muskeln",unit:"kg"},{field:"protein",label:"Protein",unit:"%"}],e,a);let o=e.map(x=>x.muscle),n=e.map(x=>x.protein),p=Math.min(...o),i=Math.max(...o),c=i-p,g=p-.5,m=i+.5;if(c<3){let x=(p+i)/2;g=x-1.5,m=x+1.5}let f=D();f.scales&&delete f.scales,t("chartMuscle",{type:"line",data:{labels:s,datasets:[{label:"Muskelmasse (kg)",data:o,borderColor:"#30d158",backgroundColor:"transparent",borderWidth:.9,pointRadius:e.length>45?0:2,pointBackgroundColor:"#30d158",yAxisID:"yMuscle",tension:.2},{label:"Protein (%)",data:n,borderColor:"#0a84ff",backgroundColor:"transparent",borderWidth:.6,pointRadius:0,yAxisID:"yProtein",tension:.2}]},options:{...f,responsive:!0,maintainAspectRatio:!1,scales:{x:{type:"category",grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff",maxRotation:0,autoSkip:!0,maxTicksLimit:6}},yMuscle:{type:"linear",position:"left",min:Math.floor(g),max:Math.ceil(m),title:{display:!0,text:"Muskelmasse (kg)",color:"#30d158"},grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff"}},yProtein:{type:"linear",position:"right",title:{display:!0,text:"Protein (%)",color:"#0a84ff"},grid:{display:!1},ticks:{color:u.text||"#ffffff"}}}}})}function X(e,a,t=null){let s=e[e.length-1]||{},n=(t?.name||t?.username||"").toLowerCase()==="reni",p={weight:n?54:70,fat:n?15.5:11.5,water:n?57:55,muscle:n?48:56,protein:n?18:22,bmi:22},i=[s.weight?Math.min(Math.max(s.weight/p.weight*100,40),160):100,s.fat?Math.min(Math.max(s.fat/p.fat*100,40),160):100,s.water?Math.min(Math.max(s.water/p.water*100,40),160):100,s.muscle?Math.min(Math.max(s.muscle/p.muscle*100,40),160):100,s.protein?Math.min(Math.max(s.protein/p.protein*100,40),160):100,s.bmi?Math.min(Math.max(s.bmi/p.bmi*100,40),160):100];a("chartRadar",{type:"radar",data:{labels:["Gewicht","K\xF6rperfett","Wasser","Muskeln","Protein","BMI"],datasets:[{label:"Dein Ist-Zustand (%)",data:i,backgroundColor:u.radarBg||"rgba(10, 132, 255, 0.15)",borderColor:"#0a84ff",borderWidth:2.5,pointRadius:4,pointBackgroundColor:"#0a84ff",order:1},{label:"Optimales Ziel (100%)",data:[100,100,100,100,100,100],borderColor:"#30d158",borderWidth:1.5,borderDash:[4,4],backgroundColor:"transparent",pointRadius:0,order:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"top",labels:{color:u.text,boxWidth:12,font:{size:11,weight:"600"}}},tooltip:{callbacks:{label:c=>` ${c.dataset.label}: ${c.raw.toFixed(1)}%`}}},scales:{r:{min:50,max:150,grid:{color:u.grid||"#3a3a3c"},angleLines:{color:u.grid||"#3a3a3c"},pointLabels:{color:u.text,font:{size:11,weight:"600"},padding:12},ticks:{display:!0,color:u.text,backdropColor:"transparent",font:{size:9},stepSize:25,callback:c=>c===100?"100%":`${c}%`}}}}})}function Q(e,a){let t=e.filter(o=>o.poi&&o.poi>0),s=(t.length>0?t.reduce((o,n)=>o+n.poi,0)/t.length:13.3)*150;a("chartNutrition",{type:"bar",data:{labels:["Kohlenhydrate","Proteine","Fette"],datasets:[{data:[s*.45,s*.3,s*.25],backgroundColor:["#ff9f0a","#0a84ff","#ff453a"],borderRadius:{topLeft:8,topRight:8,bottomLeft:0,bottomRight:0},borderSkipped:"bottom",barPercentage:.85}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:o=>` \xD8 ${o.raw.toFixed(0)} kcal/Tag`}}},scales:{x:{grid:{display:!1},ticks:{color:u.text,font:{size:12,weight:"600"}}},y:{grid:{color:u.grid},ticks:{color:u.text,callback:o=>`${o} kcal`},title:{display:!0,text:`Zeitraum-Schnitt: Gesamt \xD8 ${s.toFixed(0)} kcal/Tag`,color:u.text}}}}})}function ee(e,a,t,s,o){let n=D(),p=e.length<3||s===o,i=[...e],c="";if(p)i=a.filter(d=>d.weight&&d.weight>0).slice(-7).sort((d,v)=>new Date(d.timestamp)-new Date(v.timestamp)),c=" (Review: Letzte 7 Tage)";else{let r=new Date(s).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}),d=new Date(o).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"});c=` (Ver\xE4nderung ${r} bis ${d})`}if(i.length<2)return;let g=i[0],m=i[i.length-1],f=m.weight-g.weight,x=m.fat&&g.fat?m.fat-g.fat:0,b=m.muscle&&g.muscle?m.muscle-g.muscle:0,y=m.water&&g.water?m.water-g.water:0,l=document.getElementById("chartDelta")?.closest(".chart-card");if(l){let r=l.querySelector(".chart-title");r&&(r.innerHTML=`Ver\xE4nderung (Fett, Muskeln, Wasser)<span style="font-size:12px; font-weight:normal; color:var(--text-muted);">${c}</span>`)}t("chartDelta",{type:"bar",data:{labels:["Gewicht","K\xF6rperfett","Muskelmasse","K\xF6rperwasser"],datasets:[{data:[f,x,b,y],backgroundColor:["#ff453a","#ff9f0a","#30d158","#0a84ff"],borderRadius:function(r){let d=r.dataIndex;return r.dataset.data[d]>=0?{topLeft:8,topRight:8,bottomLeft:0,bottomRight:0}:{topLeft:0,topRight:0,bottomLeft:8,bottomRight:8}},borderSkipped:!1,barPercentage:.85}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:function(r){let d=r.raw,v=r.dataIndex===0||r.dataIndex===2?" kg":" %";return` Bilanz: ${d>=0?"+":""}${d.toFixed(1)}${v}`}}}},scales:{x:{grid:{display:!1},ticks:{color:u.text,font:{size:12,weight:"600"}}},y:{grid:{color:u.grid},ticks:{color:u.text,callback:function(r){return(r>=0?"+":"")+r.toFixed(1)}}}}}})}function te(e,a){if(!e)return;let s=(e.scores||{}).BMR||(e.sex==="female"?1850:2200),o=e.activity||(e.sex==="female"?1.5:2.1),n=s*o,p=n-s;a("chartEnergySplit",{type:"doughnut",data:{labels:["Grundumsatz (BMR)","Aktivit\xE4tsumsatz"],datasets:[{data:[s,p],backgroundColor:["#bf5af2","#30d158"],borderWidth:0,cutout:"75%",borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"bottom",labels:{color:u.text,boxWidth:10,usePointStyle:!0,font:{size:11,weight:"600"}}},tooltip:{callbacks:{label:i=>` ${i.label}: ${i.raw.toFixed(0)} kcal`}}},layout:{padding:4}},plugins:[{id:"centerText",beforeDraw:i=>{let{ctx:c,width:g,height:m}=i;c.save();let f=document.documentElement.getAttribute("data-theme")==="dark";c.font="600 10px -apple-system, BlinkMacSystemFont, sans-serif",c.textAlign="center",c.fillStyle="#8e8e93",c.fillText("BEDARF",g/2,m/2-10),c.font="700 18px -apple-system, BlinkMacSystemFont, sans-serif",c.fillStyle=f?"#ffffff":"#000000",c.fillText(`${n.toFixed(0)}`,g/2,m/2+10),c.font="600 10px -apple-system, BlinkMacSystemFont, sans-serif",c.fillStyle="#8e8e93",c.fillText("KCAL / TAG",g/2,m/2+24),c.restore()}}]})}var K={};function V(){q()}function S(e,a){let t=document.getElementById(e);if(!t)return;if(K[e])try{K[e].destroy()}catch{}let s=t.cloneNode(!0);t.parentNode.replaceChild(s,t),K[e]=new Chart(s.getContext("2d"),a)}function z(e,a=null,t="",s=""){let o=e.filter(m=>m.weight&&m.weight>0);if(o.length===0)return;let n=t?new Date(t+"T00:00:00"):null,p=s?new Date(s+"T23:59:59"):null,i=o.filter(m=>{if(!n||!p)return!0;let f=new Date(m.timestamp);return f>=n&&f<=p}).sort((m,f)=>new Date(m.timestamp)-new Date(f.timestamp)),c=[...i];i.length<5&&(c=o.slice(-30).sort((m,f)=>new Date(m.timestamp)-new Date(f.timestamp)));let g=c.map(m=>{if(m.date)return m.date;let f=new Date(m.timestamp);return f.getFullYear()+"-"+String(f.getMonth()+1).padStart(2,"0")+"-"+String(f.getDate()).padStart(2,"0")});Y(c,e,S,g),_(c,e,S,g),j(c,e,S,g),J(c,e,S,g),Q(c,S),X(o,S,a),ee(i.length>0?i:[o[o.length-1]],e,S,t,s),a&&te(a,S),console.log(`\u{1F680} Charts stabilisiert gezeichnet. X-Achsen-Punkte: ${g.length} Tage.`)}function ae(e,a,t,s=[],o=null){let n=document.querySelector(".profile-info"),p=document.getElementById("userAvatar");if(!n||!e||!a||t.length===0)return;p&&(p.src=e.avatar||`/dashboard/avatar/${e.name.toLowerCase()}`);let i=a.date||"--",c="--:--";if(a.timestamp){let C=new Date(a.timestamp);isNaN(C.getTime())||(c=String(C.getHours()).padStart(2,"0")+":"+String(C.getMinutes()).padStart(2,"0"))}let g=a.timestamp?new Date(a.timestamp):new Date,f=Math.ceil(Math.abs(new Date-g)/(1e3*60*60*24))<=4,x=e.scores||{},b=e.target||x.WEIGHT||70,y=a.weight||0,l=y-b,r=0,d="var(--apple-blue)",v="Ziel",k=t&&t.length>0?t[0].weight:y,$=k-b,L=k-y;Math.abs(l)<=.2?(r=100,d="var(--apple-green)",v='<span style="font-size:16px;">\u2713</span>'):l<0?(r=y/b*100,d="var(--apple-blue)",v="Ziel"):$>0&&L>0?(r=L/$*100,d="var(--apple-red)",v="Ziel"):$<0&&L<0?(r=Math.abs(L)/Math.abs($)*100,d="var(--apple-blue)",v="Ziel"):(r=25,d=l>0?"var(--apple-red)":"var(--apple-blue)",v="Ziel"),r=Math.min(Math.max(Math.round(r),15),100);let P=2*Math.PI*32,de=P-r/100*P;function E(C,T,me,Z="",N=!1){if(!T)return"";let F=T-me,A="\u25CF",R="badge-success",I="Ok";return Math.abs(F)<=.2?(A="\u25CF",R="badge-success",I="Optimal"):F>0?(A="\u25B2",I=`+${F.toFixed(1)}${Z}`,R=N?"badge-danger":"badge-success"):(A="\u25BC",I=`${F.toFixed(1)}${Z}`,R=N?"badge-success":"badge-danger"),`
      <div class="score-badge ${R}">
        <span class="score-badge-title">${C}</span>
        <span class="score-badge-value">${A} ${T.toFixed(1)}</span>
        <span class="score-badge-status">${I}</span>
      </div>
    `}let B="";l>0?B=` &bull; Noch <strong>${l.toFixed(1)} kg</strong> bis zum Wunschgewicht`:l<0?B=` &bull; <strong>${Math.abs(l).toFixed(1)} kg</strong> unter Wunschgewicht`:B=" &bull; <strong>Punktlandung! \u{1F389}</strong>";let pe=s.map(C=>{let T=C.name.toLowerCase()===e.name.toLowerCase()?"selected":"";return`<option value="${C.name}" ${T}>${C.name.toUpperCase()}</option>`}).join("");n.innerHTML=`
    <div class="profile-main-layout">

      <!-- Linker Block: Textdaten -->
      <div class="profile-left-combined">
        <div class="profile-text-side">
          <div class="profile-title-row">
            <select id="userSelect" class="profile-user-select">
              ${pe}
            </select>
            <span class="status-badge ${f?"status-active":"status-inactive"}">
              ${f?"\u25CF Aktiv":"\u25CF Inaktiv"}
            </span>
          </div>
          <p class="profile-meta-main">
            Geschlecht: ${e.sex==="female"?"Weiblich":"M\xE4nnlich"} &bull; Wunschgewicht: <strong>${b} kg</strong>${B}
          </p>
          <p class="profile-meta-secondary">
            Letzte Messung: <strong>${i}</strong> um <strong>${c} Uhr</strong> &bull;
            <strong>${t.length}</strong> Messungen im ausgew\xE4hlten Zeitraum
          </p>
        </div>
      </div>

      <!-- Mittlerer Block: Die vier farbigen Status-Tiles -->
      <div class="profile-status-side">
        ${E("Gewicht",a.weight,b,"kg",!0)}
        ${E("K\xF6rperfett",a.fat,x.FAT||15,"%",!0)}
        ${E("Muskeln",a.muscle,x.MUSCLE||50,"kg",!1)}
        ${E("Protein",a.protein,x.PROTEIN||20,"%",!1)}
      </div>

      <!-- Rechter Block: Der Fortschrittsring als edler Abschluss der Karte -->
      <div class="ring-container" title="Dein aktueller Zielerreichungsgrad">
        <svg class="ring-svg" viewBox="0 0 72 72">
          <circle class="ring-bg" cx="36" cy="36" r="32"></circle>
          <circle class="ring-fill" cx="36" cy="36" r="32"
                  style="stroke-dasharray: ${P}; stroke-dashoffset: ${de}; stroke: ${d};">
          </circle>
        </svg>
        <div class="ring-text">${v}</div>
      </div>

    </div>
  `,o&&document.getElementById("userSelect").addEventListener("change",C=>{o(C.target.value)})}var G={};function H(e,a,t){let s=document.getElementById("kpiGrid");if(!s||!e||e.length===0)return;let o=new Date(a+"T00:00:00"),n=new Date(t+"T23:59:59"),p=e.filter(l=>{let r=new Date(l.timestamp);return r>=o&&r<=n}).sort((l,r)=>new Date(l.timestamp)-new Date(r.timestamp));if(p.length===0){s.innerHTML=`
      <div class="tile" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
        <div class="tile-title" style="color: var(--apple-red);">Keine Messdaten im Zeitraum gefunden</div>
        <div class="tile-subtext" style="margin-top: 5px;">Bitte w\xE4hle einen anderen Zeitraum aus (Gew\xE4hlt: ${a} bis ${t}).</div>
      </div>
    `;return}let i=p[p.length-1],c=p[0],g=a===t,m=c;if(g||p.length<2){let l=e.findIndex(r=>r.id===i.id);m=l>0?e[l-1]:i}let f=g?e.slice(-7):p,x="";if(g)x=`Fokus: Einzelmessung vom ${new Date(i.timestamp).toLocaleDateString("de-DE")}`;else{let l=new Date(a).toLocaleDateString("de-DE"),r=new Date(t).toLocaleDateString("de-DE"),d=new Date(i.timestamp).toLocaleDateString("de-DE");x=`Analyse-Zeitraum: ${l} bis ${r} <span style="font-weight: normal; color: var(--text-muted); font-size: 13px;">(Letzter Messpunkt im Zeitraum: ${d})</span>`}let b=[{id:"w",title:"Gewicht",val:i.weight,pVal:m.weight,unit:"kg",color:"var(--apple-red)",history:f.map(l=>l.weight),min:50,max:100},{id:"f",title:"K\xF6rperfett",val:i.fat,pVal:m.fat,unit:"%",color:"var(--apple-orange)",history:f.map(l=>l.fat),min:5,max:35},{id:"m",title:"Muskelmasse",val:i.muscle,pVal:m.muscle,unit:"kg",color:"var(--apple-green)",history:f.map(l=>l.muscle),min:30,max:70},{id:"b",title:"BMI",val:i.bmi,pVal:m.bmi,unit:"",color:"var(--apple-purple)",history:f.map(l=>l.bmi),min:15,max:35},{id:"v",title:"Viszeralfett",val:i.visceral,pVal:m.visceral,unit:"Lvl",color:"var(--apple-purple)",history:f.map(l=>l.visceral),min:1,max:15},{id:"wa",title:"K\xF6rperwasser",val:i.water,pVal:m.water,unit:"%",color:"var(--apple-blue)",history:f.map(l=>l.water),min:40,max:70},{id:"p",title:"Protein",val:i.protein,pVal:m.protein,unit:"%",color:"var(--apple-blue)",history:f.map(l=>l.protein),min:10,max:25},{id:"l",title:"Fettfreie Masse (LBM)",val:i.lbm,pVal:m.lbm,unit:"kg",color:"var(--apple-red)",history:f.map(l=>l.lbm),min:40,max:85},{id:"po",title:"Punkte (POI)",val:i.poi,pVal:m.poi,unit:"Pts",color:"var(--apple-green)",history:f.map(l=>l.poi),min:5,max:20},{id:"i",title:"Impedanz",val:i.impedance,pVal:m.impedance,unit:"\u03A9",color:"#8e8e93",history:f.map(l=>l.impedance),min:400,max:800}],y=b.map(l=>{let r=l.val-l.pVal,d="trend-stable",v="\u2192",k="Stabil",$=["m","wa","p","po"].includes(l.id);r>.02?(d=$?"trend-up":"trend-down",v="\u25B2",k=`+${r.toFixed(1)}`):r<-.02&&(d=$?"trend-down":"trend-up",v="\u25BC",k=`${r.toFixed(1)}`);let L=Math.min(Math.max((l.val-l.min)/(l.max-l.min)*100,5),100);return`
      <div class="tile">
        <div class="tile-header">
          <div class="tile-title">${l.title}</div>
          <div class="tile-trend ${d}">${v} ${k}</div>
        </div>

        <div class="tile-body">
          <div class="tile-value">${l.val?l.val.toFixed(1):"--"}<span>${l.unit}</span></div>
          <div class="sparkline-container">
            <canvas id="spark_${l.id}"></canvas>
          </div>
        </div>

        <div class="progress-container">
          <div class="progress-bar" style="width: ${L}%; background-color: ${l.color};"></div>
        </div>
      </div>
    `}).join("");s.innerHTML=`
    <div style="grid-column: 1 / -1; width: 100%; margin-bottom: 5px; padding: 5px 0;">
      <h2 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin: 0; letter-spacing: -0.3px;">
        ${x}
      </h2>
    </div>
    ${y}
  `,b.forEach(l=>{let r=`spark_${l.id}`,d=document.getElementById(r)?.getContext("2d");d&&(G[r]&&G[r].destroy(),G[r]=new Chart(d,{type:"line",data:{labels:l.history.map((v,k)=>k),datasets:[{data:l.history,borderColor:l.color,borderWidth:2,pointRadius:l.history.length===1?3:0,backgroundColor:"transparent",tension:.3}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{enabled:!1}},scales:{x:{display:!1},y:{display:!1}}}}))})}var O={Heute:"today",Gestern:"gestern","Diese Woche":"woche","Letzte 7 Tage":"7tage","Letzte 30 Tage":"30tage","Dieser Monat":"monat"},re="em-period-label";function oe(e){let a=new Date,t=new Date,s=new Date;switch(t.setHours(0,0,0,0),s.setHours(23,59,59,999),e){case"today":break;case"gestern":t.setDate(a.getDate()-1),s.setDate(a.getDate()-1);break;case"woche":{let o=a.getDay();t.setDate(a.getDate()-o+(o===0?-6:1));break}case"7tage":t.setDate(a.getDate()-6);break;case"30tage":t.setDate(a.getDate()-29);break;case"monat":t.setDate(1);break}return{from:W(t),to:W(s)}}function W(e){return e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0")}function se(e,a){let t=localStorage.getItem(re)||"Heute";!O[t]&&!t.startsWith("Jahr ")&&t!=="Individuell"&&(t="Heute");let s=new Date().getFullYear(),o="";for(let r=s;r>=2018;r--)o+=`<option value="${r}">Jahr ${r}</option>`;if(!document.getElementById("ds-styles")){let r=document.createElement("style");r.id="ds-styles",r.textContent=`
            .ds-wrap { position: relative; display: inline-flex; align-items: center; gap: 10px; }
            .ds-label { font-size: 14px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .ds-btn {
                padding: 10px 16px; border-radius: 12px;
                border: 1px solid var(--card-border); background: var(--card-bg);
                color: var(--text-main); cursor: pointer; font-size: 14px; font-weight: 600; font-family: inherit;
                box-shadow: var(--shadow-sm); transition: background-color 0.3s, border-color 0.3s;
            }
            .ds-btn::after { content: " \u25BE"; opacity: .6; }
            .ds-dropdown {
                position: absolute;
                top: calc(100% + 8px);
                min-width: 240px;
                border-radius: 16px;
                padding: 8px;
                z-index: 9999;
                max-height: 420px;
                overflow-y: auto;
                box-shadow: var(--shadow-md);
                background: var(--card-bg);
                border: 1px solid var(--card-border);
                transition: background-color 0.3s, border-color 0.3s;
            }
            .ds-dropdown.hidden { display: none; }
            .ds-section { font-size: 11px; font-weight: 700; color: var(--text-muted); padding: 8px 12px 4px; text-transform: uppercase; letter-spacing: .5px; }
            .ds-item { padding: 10px 12px; border-radius: 10px; font-size: 14px; color: var(--text-main); cursor: pointer; font-weight: 500; }
            .ds-item:hover { background: var(--bg-color); }
            .ds-item.active { background: var(--apple-blue); color: #ffffff; font-weight: 600; }
            .ds-select { width: calc(100% - 24px); margin: 4px 12px; padding: 8px; border-radius: 8px; border: 1px solid var(--card-border); background: var(--bg-color); color: var(--text-main); font-size: 14px; font-family: inherit; outline: none; }
            .ds-custom { padding: 8px 12px; display: none; }
            .ds-custom.show { display: flex; flex-direction: column; gap: 8px; }
            .ds-custom input { padding: 8px; border-radius: 8px; border: 1px solid var(--card-border); background: var(--bg-color); color: var(--text-main); font-size: 14px; font-family: inherit; outline: none; }
            .ds-custom button { padding: 10px; border-radius: 10px; border: none; background: var(--apple-blue); color: #ffffff; font-size: 14px; cursor: pointer; font-weight: 600; transition: background-color 0.2s; }
            .ds-custom button:hover { opacity: 0.9; }
        `,document.head.appendChild(r)}let n=document.createElement("div");n.className="ds-wrap",n.innerHTML=`
        <span class="ds-label">\u{1F4C5} Zeitraum:</span>
        <button class="ds-btn" id="dsBtn">${t}</button>
        <div class="ds-dropdown hidden" id="dsDrop">
            <div class="ds-section">Relativ</div>
            <div class="ds-item" data-key="today">Heute</div>
            <div class="ds-item" data-key="gestern">Gestern</div>
            <div class="ds-item" data-key="woche">Diese Woche</div>
            <div class="ds-item" data-key="7tage">Letzte 7 Tage</div>
            <div class="ds-item" data-key="30tage">Letzte 30 Tage</div>
            <div class="ds-item" data-key="monat">Dieser Monat</div>
            <div class="ds-section">Archiv</div>
            <select class="ds-select" id="dsYear">
                <option value="">Jahr ausw\xE4hlen\u2026</option>
                ${o}
            </select>
            <div class="ds-section" style="cursor:pointer; margin-top:5px;" id="dsCustomToggle">Individuell\u2026</div>
            <div class="ds-custom" id="dsCustom">
                <input type="date" id="dsFrom">
                <input type="date" id="dsTo">
                <button id="dsApply">Anwenden</button>
            </div>
        </div>
    `,e.appendChild(n);let p=n.querySelector("#dsBtn"),i=n.querySelector("#dsDrop"),c=n.querySelector("#dsYear"),g=n.querySelector("#dsCustomToggle"),m=n.querySelector("#dsCustom"),f=n.querySelector("#dsFrom"),x=n.querySelector("#dsTo"),b=n.querySelector("#dsApply");p.addEventListener("click",r=>{r.stopPropagation(),i.classList.toggle("hidden")}),document.addEventListener("click",()=>i.classList.add("hidden")),i.addEventListener("click",r=>r.stopPropagation()),g.addEventListener("click",()=>m.classList.toggle("show"));function y(r,d,v){t=r,localStorage.setItem(re,r),p.textContent=r,i.classList.add("hidden"),i.querySelectorAll(".ds-item").forEach(k=>{k.classList.toggle("active",k.textContent.trim()===r)}),a(d,v)}i.querySelectorAll(".ds-item").forEach(r=>{r.addEventListener("click",()=>{let d=r.getAttribute("data-key"),v=oe(d);y(r.textContent.trim(),v.from,v.to)})}),c.addEventListener("change",()=>{if(!c.value)return;let r=c.value;y(`Jahr ${r}`,`${r}-01-01`,`${r}-12-31`)}),b.addEventListener("click",()=>{!f.value||!x.value||y("Individuell",f.value,x.value)});function l(){if(O[t]){let r=oe(O[t]);a(r.from,r.to)}else if(t.startsWith("Jahr ")){let r=t.replace("Jahr ","");a(`${r}-01-01`,`${r}-12-31`)}else a(f.value||W(new Date),x.value||W(new Date))}return l}var h={lastTimeline:[],currentFrom:"",currentTo:"",usersCache:[],triggerSelectorRefresh:null,pollingInterval:null,lastKnownCount:0},w=e=>document.querySelector(e),ne="health-active-user",ie="health-theme";document.addEventListener("DOMContentLoaded",()=>{ge(),he(),w("#themeToggle").addEventListener("click",fe),le(5)});window.addEventListener("resize",()=>{if(h.lastTimeline.length>0){let e=w("#userSelect")?.value,a=h.usersCache.find(t=>t.name.toLowerCase()===e?.toLowerCase());z(h.lastTimeline,a,h.currentFrom,h.currentTo)}});function ge(){let e=localStorage.getItem(ie)||"light";document.documentElement.setAttribute("data-theme",e)}function fe(){let a=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";if(document.documentElement.setAttribute("data-theme",a),localStorage.setItem(ie,a),h.lastTimeline.length>0){V();let t=w("#userSelect")?.value,s=h.usersCache.find(n=>n.name.toLowerCase()===t?.toLowerCase());z(h.lastTimeline,s);let o=h.lastTimeline[h.lastTimeline.length-1];H(h.lastTimeline,h.currentFrom,h.currentTo)}}function le(e=5){h.pollingInterval&&clearInterval(h.pollingInterval),h.pollingInterval=setInterval(async()=>{let a=w("#userSelect")?.value;if(a)try{let s=await(await fetch("/dashboard/api/users")).json();if(s&&Array.isArray(s)){h.usersCache=s;let o=s.find(n=>n.name.toLowerCase()===a.toLowerCase());o&&typeof o.count<"u"&&o.count!==h.lastKnownCount&&(console.log(`\u{1F514} Neue Messung! (${o.count})`),ce(a,!0))}}catch(t){console.error("Fehler beim Polling:",t)}},e*60*1e3)}async function he(){try{let a=await(await fetch("/dashboard/api/users")).json();if(a&&a.length>0){h.usersCache=a;let t=localStorage.getItem(ne),o=a.some(n=>n.name.toLowerCase()===t?.toLowerCase())?t:a[0].name;h.triggerSelectorRefresh=se(w("#dateSelectorContainer"),(n,p)=>{h.currentFrom=n,h.currentTo=p;let i=w("#userSelect")?.value||o;ce(i)}),h.triggerSelectorRefresh&&h.triggerSelectorRefresh()}else w("#loadBox").textContent="Keine Benutzer im System gefunden."}catch(e){console.error("Dropdown Fehler:",e),w("#loadBox").textContent="Backend nicht erreichbar."}}async function ce(e,a=!1){if(e){a||(w("#loadBox").style.display="block",w("#dashboardContent").style.display="none");try{let t=`/dashboard/api/data?user=${e.toLowerCase()}`;h.currentFrom&&(t+=`&from=${h.currentFrom}`),h.currentTo&&(t+=`&to=${h.currentTo}`);let o=await(await fetch(t)).json();if(o&&o.current&&o.current.length>0){let n=[...o.previous||[],...o.current||[]].map(i=>({...i,timestamp:new Date(i.timestamp)})).sort((i,c)=>i.timestamp-c.timestamp);h.lastTimeline=n;let p=h.usersCache.find(i=>i.name.toLowerCase()===e.toLowerCase());h.lastKnownCount=p?p.count:o.count||0,w("#loadBox").style.display="none",w("#dashboardContent").style.display="block",ae(o.user,o.current[o.current.length-1],n,h.usersCache,i=>{localStorage.setItem(ne,i),h.triggerSelectorRefresh&&h.triggerSelectorRefresh(),le(5)}),H(n,h.currentFrom,h.currentTo),V(),z(n,o.user,h.currentFrom,h.currentTo)}else a||(w("#loadBox").textContent="Keine Messwerte im gew\xE4hlten Zeitraum vorhanden.")}catch(t){console.error("Dashboard Ladefehler:",t),a||(w("#loadBox").textContent="Fehler beim Laden der Benutzerdaten.")}}}var be="3.1.0";console.info(`%c \u26A1 Health Dashboard %c ESM v${be} `,"color:#fff;background:#e94560;padding:4px 8px;border-radius:4px 0 0 4px;font-size:11px","color:#1a1a2e;background:#a8dadc;padding:4px 8px;border-radius:0 4px 4px 0;font-size:11px");})();
//# sourceMappingURL=app.bundle.js.map
