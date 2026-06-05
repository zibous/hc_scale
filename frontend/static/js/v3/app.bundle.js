(()=>{if(!document.getElementById("health-msg-styles")){let e=document.createElement("style");e.id="health-msg-styles",e.textContent=`
    /* Schwebender Container zentriert am unteren Rand */
    .health-snackbar-wrap {
        position: fixed !important;
        bottom: 35px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 999999 !important;
        display: flex !important;
        flex-direction: column-reverse !important;
        gap: 12px !important;
        pointer-events: none !important;
        width: max-content !important;
    }

    /* Die schwebende Apple-S\xE4ule */
    .health-toast-box {
        min-width: 320px !important;
        max-width: 450px !important;
        padding: 14px 22px !important;
        border-radius: 16px !important;

        /* LIGHTMODE STANDARD (Solides Wei\xDF mit leichtem Schatten) */
        background-color: #ffffff !important;
        border: 1px solid #e5e5ea !important;
        color: #000000 !important;

        font-size: 14px !important;
        font-weight: 600 !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
        pointer-events: auto !important;
        display: flex !important;
        align-items: center !important;
        gap: 14px !important;
        animation: healthToastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        transition: opacity 0.3s, transform 0.3s !important;
    }

    /* \u{1F527} 100% BRUTALER DARKMODE ADAPTER */
    /* Greift unbarmherzig, sobald das data-theme auf dark springt, v\xF6llig egal auf welchem Element! */
    [data-theme="dark"] .health-toast-box {
        background-color: #010101 !important; /* Tiefdunkles, sattes Anthrazit-Schwarz */
        border: 1px solid #2c2c2e !important;   /* Knallharte, hellgraue Trennkante */
        color: #ffffff !important;               /* Kristallwei\xDFer Text */
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6) !important; /* Maximaler, fetter Eigenschatten */
    }

    /* Farbige Statusbalken links */
    .h-msg-info { border-left: 5px solid #0a84ff !important; }
    .h-msg-success { border-left: 5px solid #30d158 !important; }
    .h-msg-error { border-left: 5px solid #ff453a !important; }

    @keyframes healthToastIn {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .health-toast-out {
        opacity: 0 !important;
        transform: translateY(10px) scale(0.95) !important;
    }
  `,document.head.appendChild(e)}function z(e,r="info"){let a=document.getElementById("healthUniqueSnackbarContainer");a||(a=document.createElement("div"),a.id="healthUniqueSnackbarContainer",a.className="health-snackbar-wrap",document.body.appendChild(a));let s={info:"\u2139\uFE0F",success:"\u2705",error:"\u26A0\uFE0F"},o=document.createElement("div");o.className=`health-toast-box h-msg-${r}`,o.innerHTML=`<span style="font-size: 16px;">${s[r]||"\u{1F514}"}</span><div style="flex:1; line-height: 1.4;">${e}</div>`,a.appendChild(o),setTimeout(()=>{o.classList.add("health-toast-out"),o.addEventListener("transitionend",()=>o.remove())},4e3)}var u={text:"#8e8e93",grid:"#e5e5ea",radarBg:"rgba(0,122,255,0.1)"};function X(){let e=document.documentElement.getAttribute("data-theme")==="dark";u.text=e?"#aeaea2":"#8e8e93",u.grid=e?"#2c2c2e":"#e5e5ea",u.radarBg=e?"rgba(10,132,255,0.15)":"rgba(0,122,255,0.08)"}function Q(e,r=3){return e.map((a,s)=>{if(s<r-1){let i=e.slice(0,s+1);return i.reduce((l,c)=>l+c,0)/i.length}return e.slice(s-r+1,s+1).reduce((i,l)=>i+l,0)/r})}function he(e,r,a){let s=e.filter(x=>x[a]&&x[a]>0),o=s[s.length-1]?.[a]||0,i=s.length>0?s.reduce((x,y)=>x+y[a],0)/s.length:0,l=new Set(e.map(x=>x.date)),c=r.filter(x=>!l.has(x.date)&&x[a]&&x[a]>0),n=c.length>0?c.reduce((x,y)=>x+y[a],0)/c.length:i,p=i-n,f=p>.02?"\u25B2":p<-.02?"\u25BC":"\u25CF",m=["fat","visceral"].includes(a),g="badge-stable";return Math.abs(p)>.02&&(p>0?g=m?"badge-danger":"badge-success":g=m?"badge-success":"badge-danger"),{latest:o.toFixed(1),avg:i.toFixed(1),prevAvg:n.toFixed(1),diff:(p>0?"+":"")+p.toFixed(1),arrow:f,className:g}}function C(e,r,a,s){let i=document.getElementById(e)?.closest(".chart-card");if(!i)return;if(!document.getElementById("summary-footer-styles-v7")){let n=document.createElement("style");n.id="summary-footer-styles-v7",n.textContent=`
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
    `,document.head.appendChild(n)}let l=i.querySelector(".chart-summary-footer");l||(l=document.createElement("div"),l.className="chart-summary-footer",i.appendChild(l));let c=r.map(n=>{let p=he(a,s,n.field),f=parseFloat(p.diff)===0?"0.0":p.diff;return`
      <div class="summary-block">
        <div class="summary-metric-title">${n.label} <span style="font-size: 11px; font-weight:500; text-transform:none;">(${n.unit})</span></div>

        <div class="summary-grid">
          <div class="summary-col">
            <span class="summary-col-label">Aktuell</span>
            <span class="summary-col-value" style="font-size: 15px; color:var(--apple-blue);">${p.latest}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">\xD8 Zeitraum</span>
            <span class="summary-col-value">${p.avg}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">\xD8 Vor-Per.</span>
            <span class="summary-col-value" style="color:var(--text-muted); font-weight:500;">${p.prevAvg}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">Trend</span>
            <div class="summary-pill ${p.className}">
              <span>${p.arrow}</span>
              <span>${f}</span>
            </div>
          </div>
        </div>
      </div>
    `}).join("");l.innerHTML=c}function B(){return{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,labels:{color:u.text,boxWidth:10,usePointStyle:!0,font:{size:12,weight:"600"}}}},scales:{x:{type:"category",grid:{display:!1},ticks:{color:u.text,font:{size:11,weight:"500"}}},y:{grid:{color:u.grid},ticks:{color:u.text,font:{size:11,weight:"500"}}}}}}function ee(e,r,a,s){let o=document.getElementById("chartWeight"),i="transparent";if(o){let y=document.documentElement.getAttribute("data-theme")==="dark";i=o.getContext("2d").createLinearGradient(0,0,0,300),i.addColorStop(0,y?"rgba(255, 69, 58, 0.35)":"rgba(255, 59, 48, 0.22)"),i.addColorStop(1,"rgba(255, 59, 48, 0.0)")}C("chartWeight",[{field:"weight",label:"Gewicht",unit:"kg"},{field:"lbm",label:"Fettfreie Masse",unit:"kg"}],e,r);let l=e.map(y=>y.weight),c=e.map(y=>y.lbm),n=Math.min(...l,...c),p=Math.max(...l),f=p-n,m=n-1,g=p+1;if(f<3.5){let y=(n+p)/2;m=y-1.75,g=y+1.75}let x=B();x.scales&&delete x.scales,a("chartWeight",{type:"line",data:{labels:s,datasets:[{label:"Gewicht",data:l,borderColor:"#ff453a",backgroundColor:i,fill:!0,borderWidth:2.5,pointRadius:e.length>45?0:2,pointBackgroundColor:"#ff453a",tension:.2},{label:"Gewicht Trend",data:Q(l,3),borderColor:"#ff9f0a",backgroundColor:"transparent",borderWidth:1.5,borderDash:[3,3],pointRadius:0,tension:.3},{label:"Fettfreie Masse",data:c,borderColor:"#0a84ff",backgroundColor:"transparent",borderWidth:1.5,pointRadius:0,tension:.2}]},options:{...x,responsive:!0,maintainAspectRatio:!1,scales:{x:{type:"category",grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff",maxRotation:0,autoSkip:!0,maxTicksLimit:6}},y:{type:"linear",min:Math.floor(m),max:Math.ceil(g),title:{display:!0,text:"Masse (kg)",color:u.text||"#ffffff"},grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff"}}}}})}function te(e,r,a,s){C("chartSummary",[{field:"weight",label:"Gewicht",unit:"kg"},{field:"muscle",label:"Muskeln",unit:"kg"},{field:"bmi",label:"BMI",unit:""}],e,r);let o=e.length<=1,i=e.map(t=>t.weight),l=e.map(t=>t.muscle),c=e.map(t=>t.bmi),n=Math.min(...i)-(o?5:1),p=Math.max(...i)+(o?5:1),f=Math.min(...l)-(o?5:.5),m=Math.max(...l)+(o?5:.5),g=Math.min(...c)-(o?5:.5),x=Math.max(...c)+(o?5:.5);if(o&&e.length>0){let t=e[0];a("chartSummary",{type:"bar",data:{labels:["Gewicht (kg)","Muskelmasse (kg)","BMI"],datasets:[{data:[t.weight,t.muscle,t.bmi],backgroundColor:["rgba(255, 69, 58, 0.6)","rgba(48, 209, 88, 0.6)","rgba(255, 159, 10, 0.6)"],borderColor:["#ff453a","#30d158","#ff9f0a"],borderWidth:1,borderRadius:12,barThickness:45,maxBarThickness:50}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1},ticks:{color:u.text||"#ffffff",font:{weight:"600"}}},y:{type:"linear",position:"left",min:Math.floor(Math.min(t.weight,t.muscle,t.bmi)-5),max:Math.ceil(Math.max(t.weight,t.muscle,t.bmi)+5),grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff"}}}}});return}let y=e.map(t=>({x:new Date(t.timestamp),y:t.weight})),v=e.map(t=>({x:new Date(t.timestamp),y:t.muscle})),d=e.map(t=>({x:new Date(t.timestamp),y:t.bmi}));a("chartSummary",{type:"bar",data:{datasets:[{type:"bar",label:"BMI",data:d,borderColor:"#ff9f0a",backgroundColor:"rgba(255, 159, 10, 0.15)",borderWidth:{top:1,right:0,bottom:0,left:0},borderRadius:4,barThickness:e.length>30?8:16,yAxisID:"yBmi",order:3},{type:"line",label:"Gewicht (kg)",data:y,borderColor:"#ff453a",backgroundColor:"transparent",borderWidth:1,pointRadius:e.length<20?4:0,pointBackgroundColor:"#ff453a",yAxisID:"yWeight",tension:.2,order:1},{type:"line",label:"Muskeln (kg)",data:v,borderColor:"#30d158",backgroundColor:"transparent",borderWidth:1,pointRadius:e.length<20?4:0,pointBackgroundColor:"#30d158",yAxisID:"yMuscle",tension:.2,order:2}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{x:{type:"time",time:{tooltipFormat:"dd.MM.yyyy",unit:e.length>45?"month":"day",stepSize:e.length>180?2:1,displayFormats:{day:"dd.MM",month:"MMM yyyy"}},grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff",maxRotation:0,maxTicksLimit:6}},yWeight:{type:"linear",position:"left",min:Math.floor(n),max:Math.ceil(p),title:{display:!0,text:"Gewicht (kg)",color:"#ff453a"},ticks:{color:u.text||"#ffffff"},grid:{color:u.grid||"#3a3a3c"}},yMuscle:{type:"linear",position:"right",min:Math.floor(f),max:Math.ceil(m),title:{display:!0,text:"Muskelmasse (kg)",color:"#30d158"},ticks:{color:u.text||"#ffffff"},grid:{display:!1}},yBmi:{type:"linear",position:"right",min:Math.floor(g),max:Math.ceil(x),display:!1,grid:{display:!1}}}}})}function ae(e,r,a,s){let o=B();C("chartFat",[{field:"fat",label:"Fett",unit:"%"},{field:"visceral",label:"Viszeral",unit:"Lvl"}],e,r),a("chartFat",{type:"line",data:{labels:s,datasets:[{label:"K\xF6rperfett (%)",data:e.map(i=>i.fat),borderColor:"#ff9f0a",backgroundColor:"transparent",borderWidth:1,pointRadius:0},{label:"Viszeralfett",data:e.map(i=>i.visceral),borderColor:"#bf5af2",backgroundColor:"transparent",borderWidth:1,pointRadius:0,yAxisID:"yVisc"}]},options:{...o,scales:{x:o.scales.x,y:{grid:{color:u.grid},ticks:{color:u.text}},yVisc:{position:"right",grid:{display:!1},ticks:{color:u.text}}}}})}function re(e,r,a,s){C("chartMuscle",[{field:"muscle",label:"Muskeln",unit:"kg"},{field:"protein",label:"Protein",unit:"%"}],e,r);let o=e.map(g=>g.muscle),i=e.map(g=>g.protein),l=Math.min(...o),c=Math.max(...o),n=c-l,p=l-.5,f=c+.5;if(n<3){let g=(l+c)/2;p=g-1.5,f=g+1.5}let m=B();m.scales&&delete m.scales,a("chartMuscle",{type:"line",data:{labels:s,datasets:[{label:"Muskelmasse (kg)",data:o,borderColor:"#30d158",backgroundColor:"transparent",borderWidth:.9,pointRadius:e.length>45?0:2,pointBackgroundColor:"#30d158",yAxisID:"yMuscle",tension:.2},{label:"Protein (%)",data:i,borderColor:"#0a84ff",backgroundColor:"transparent",borderWidth:.6,pointRadius:0,yAxisID:"yProtein",tension:.2}]},options:{...m,responsive:!0,maintainAspectRatio:!1,scales:{x:{type:"category",grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff",maxRotation:0,autoSkip:!0,maxTicksLimit:6}},yMuscle:{type:"linear",position:"left",min:Math.floor(p),max:Math.ceil(f),title:{display:!0,text:"Muskelmasse (kg)",color:"#30d158"},grid:{color:u.grid||"#3a3a3c"},ticks:{color:u.text||"#ffffff"}},yProtein:{type:"linear",position:"right",title:{display:!0,text:"Protein (%)",color:"#0a84ff"},grid:{display:!1},ticks:{color:u.text||"#ffffff"}}}}})}function oe(e,r,a=null){let s=e[e.length-1]||{},o=[s];C("chartRadar",[{field:"weight",label:"Gewicht",unit:"kg"},{field:"fat",label:"Fett",unit:"%"},{field:"muscle",label:"Muskeln",unit:"kg"},{field:"bmi",label:"BMI",unit:""}],o,o);let l=(a?.name||a?.username||"").toLowerCase()==="reni",c={weight:l?54:70,fat:l?15.5:11.5,water:l?57:55,muscle:l?48:56,protein:l?18:22,bmi:22},n=[s.weight?Math.min(Math.max(s.weight/c.weight*100,40),160):100,s.fat?Math.min(Math.max(s.fat/c.fat*100,40),160):100,s.water?Math.min(Math.max(s.water/c.water*100,40),160):100,s.muscle?Math.min(Math.max(s.muscle/c.muscle*100,40),160):100,s.protein?Math.min(Math.max(s.protein/c.protein*100,40),160):100,s.bmi?Math.min(Math.max(s.bmi/c.bmi*100,40),160):100];r("chartRadar",{type:"radar",data:{labels:["Gewicht","K\xF6rperfett","Wasser","Muskeln","Protein","BMI"],datasets:[{label:"Dein Ist-Zustand (%)",data:n,backgroundColor:u.radarBg||"rgba(10, 132, 255, 0.15)",borderColor:"#0a84ff",borderWidth:2.5,pointRadius:4,pointBackgroundColor:"#0a84ff",order:1},{label:"Optimales Ziel (100%)",data:[100,100,100,100,100,100],borderColor:"#30d158",borderWidth:1.5,borderDash:[4,4],backgroundColor:"transparent",pointRadius:0,order:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"top",labels:{color:u.text,boxWidth:12,font:{size:11,weight:"600"}}},tooltip:{callbacks:{label:p=>` ${p.dataset.label}: ${p.raw.toFixed(1)}%`}}},scales:{r:{min:50,max:150,grid:{color:u.grid||"#3a3a3c"},angleLines:{color:u.grid||"#3a3a3c"},pointLabels:{color:u.text,font:{size:11,weight:"600"},padding:12},ticks:{display:!0,color:u.text,backdropColor:"transparent",font:{size:9},stepSize:25,callback:p=>p===100?"100%":`${p}%`}}}}})}function se(e,r,a,s=null){let o=e.filter(m=>m.poi&&m.poi>0),l=(o.length>0?o.reduce((m,g)=>m+g.poi,0)/o.length:12.9)*150,n=(e[e.length-1]||{}).tdee||s?.scores?.BMR||2400,p=e.map(m=>({...m,poi:l,tdee:n})),f=(a||e).map(m=>({...m,poi:l,tdee:n}));C("chartNutrition",[{field:"poi",label:"Energie-Zufuhr",unit:" kcal"},{field:"tdee",label:"Gesamtverbrauch",unit:" kcal"}],p,f),C("chartNutrition",[{field:"poi",label:"Energie-Zufuhr",unit:" kcal"},{field:"tdee",label:"Gesamtverbrauch",unit:" kcal"}],p,f),r("chartNutrition",{type:"bar",data:{labels:["Kohlenhydrate","Proteine","Fette"],datasets:[{data:[l*.45,l*.3,l*.25],backgroundColor:["#ff9f0a","#0a84ff","#ff453a"],borderRadius:{topLeft:8,topRight:8,bottomLeft:0,bottomRight:0},borderSkipped:"bottom",barPercentage:.85}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:m=>` \xD8 ${m.raw.toFixed(0)} kcal/Tag`}}},scales:{x:{grid:{display:!1},ticks:{color:u.text,font:{size:12,weight:"600"}}},y:{grid:{color:u.grid},ticks:{color:u.text,callback:m=>`${m} kcal`},title:{display:!0,text:`Zeitraum-Schnitt: Gesamt \xD8 ${l.toFixed(0)} kcal/Tag`,color:u.text}}}}})}function ne(e,r,a,s,o){C("chartDelta",[{field:"weight",label:"Gewicht",unit:"kg"},{field:"fat",label:"K\xF6rperfett",unit:"%"},{field:"muscle",label:"Muskelmasse",unit:"kg"},{field:"water",label:"K\xF6rperwasser",unit:"%"}],e,r);let i=B(),l=e.length<3||s===o,c=[...e],n="";if(l)c=r.filter(t=>t.weight&&t.weight>0).slice(-7).sort((t,h)=>new Date(t.timestamp)-new Date(h.timestamp)),n=" (Review: Letzte 7 Tage)";else{let d=new Date(s).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}),t=new Date(o).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"});n=` (Ver\xE4nderung ${d} bis ${t})`}if(c.length<2)return;let p=c[0],f=c[c.length-1],m=f.weight-p.weight,g=f.fat&&p.fat?f.fat-p.fat:0,x=f.muscle&&p.muscle?f.muscle-p.muscle:0,y=f.water&&p.water?f.water-p.water:0,v=document.getElementById("chartDelta")?.closest(".chart-card");if(v){let d=v.querySelector(".chart-title");d&&(d.innerHTML=`Ver\xE4nderung (Fett, Muskeln, Wasser)<span style="font-size:12px; font-weight:normal; color:var(--text-muted);">${n}</span>`)}a("chartDelta",{type:"bar",data:{labels:["Gewicht","K\xF6rperfett","Muskelmasse","K\xF6rperwasser"],datasets:[{data:[m,g,x,y],backgroundColor:["#ff453a","#ff9f0a","#30d158","#0a84ff"],borderRadius:function(d){let t=d.dataIndex;return d.dataset.data[t]>=0?{topLeft:8,topRight:8,bottomLeft:0,bottomRight:0}:{topLeft:0,topRight:0,bottomLeft:8,bottomRight:8}},borderSkipped:!1,barPercentage:.85}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:function(d){let t=d.raw,h=d.dataIndex===0||d.dataIndex===2?" kg":" %";return` Bilanz: ${t>=0?"+":""}${t.toFixed(1)}${h}`}}}},scales:{x:{grid:{display:!1},ticks:{color:u.text,font:{size:12,weight:"600"}}},y:{grid:{color:u.grid},ticks:{color:u.text,callback:function(d){return(d>=0?"+":"")+d.toFixed(1)}}}}}})}function ie(e,r){if(!e)return;let a=window.Chart?.instances?.chartNutrition?.config?._data?.datasets?.[0]?.data||{},s=2411,o=1148,i=s-o;r("chartEnergySplit",{type:"doughnut",data:{labels:["Grundumsatz (BMR)","Aktivit\xE4tsumsatz"],datasets:[{data:[o,i],backgroundColor:["#bf5af2","#30d158"],borderWidth:0,cutout:"75%",borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"bottom",labels:{color:u.text,boxWidth:10,usePointStyle:!0,font:{size:11,weight:"600"}}},tooltip:{callbacks:{label:l=>` ${l.label}: ${l.raw.toFixed(0)} kcal`}}},layout:{padding:4}},plugins:[{id:"centerText",beforeDraw:l=>{let{ctx:c,width:n,height:p}=l;c.save();let f=document.documentElement.getAttribute("data-theme")==="dark";c.font="600 10px -apple-system, BlinkMacSystemFont, sans-serif",c.textAlign="center",c.fillStyle="#8e8e93",c.fillText("BEDARF",n/2,p/2-10),c.font="700 18px -apple-system, BlinkMacSystemFont, sans-serif",c.fillStyle=f?"#ffffff":"#000000",c.fillText(`${s.toFixed(0)}`,n/2,p/2+10),c.font="600 10px -apple-system, BlinkMacSystemFont, sans-serif",c.fillStyle="#8e8e93",c.fillText("KCAL / TAG",n/2,p/2+24),c.restore()}}]})}var Z={};function q(){X()}function R(e,r){let a=document.getElementById(e);if(!a)return;if(Z[e])try{Z[e].destroy()}catch{}let s=a.cloneNode(!0);a.parentNode.replaceChild(s,a),Z[e]=new Chart(s.getContext("2d"),r)}function V(e,r=null,a="",s=""){if(!e||e.length===0)return;let o=e.filter(f=>f&&f.weight&&f.weight>0);if(o.length===0)return;let i=a?new Date(a+"T00:00:00"):null,l=s?new Date(s+"T23:59:59"):null,c=o.filter(f=>{if(!i||!l)return!0;let m=new Date(f.timestamp);return m>=i&&m<=l}).sort((f,m)=>new Date(f.timestamp)-new Date(m.timestamp)),n=[...c];c.length<5&&(n=o.slice(-30).sort((f,m)=>new Date(f.timestamp)-new Date(m.timestamp)));let p=n.map(f=>{if(f.date)return Array.isArray(f.date)?f.date[0]:f.date;let m=new Date(f.timestamp);return m.getFullYear()+"-"+String(m.getMonth()+1).padStart(2,"0")+"-"+String(m.getDate()).padStart(2,"0")});ee(n,o,R,p),te(n,o,R,p),ae(n,o,R,p),re(n,o,R,p),se(n,R,o,r),ne(c.length>0?c:[o[o.length-1]],o,R,a,s),oe(o,R,r),r&&ie(r,R),console.log(`\u{1F680} Charts stabilisiert gezeichnet. X-Achsen-Punkte: ${p.length} Tage.`)}function H(e,r,a,s=[],o=null){let i=document.querySelector(".profile-info"),l=document.getElementById("userAvatar");if(!i||!e||!r||a.length===0)return;l&&(l.src=e.avatar||`dashboard/avatar/${e.name.toLowerCase()}`);let c=r.date||"--",n="--:--";if(r.timestamp){let k=new Date(r.timestamp);isNaN(k.getTime())||(n=String(k.getHours()).padStart(2,"0")+":"+String(k.getMinutes()).padStart(2,"0"))}let p=r.timestamp?new Date(r.timestamp):new Date,m=Math.ceil(Math.abs(new Date-p)/(1e3*60*60*24))<=4,g=e.scores||{},x=e.target||g.WEIGHT||70,y=r.weight||0,v=y-x,d=0,t="var(--apple-blue)",h="Ziel",M=a&&a.length>0?a[0].weight:y,$=M-x,w=M-y;Math.abs(v)<=.2?(d=100,t="var(--apple-green)",h='<span style="font-size:16px;">\u2713</span>'):v<0?(d=y/x*100,t="var(--apple-blue)",h="Ziel"):$>0&&w>0?(d=w/$*100,t="var(--apple-red)",h="Ziel"):$<0&&w<0?(d=Math.abs(w)/Math.abs($)*100,t="var(--apple-blue)",h="Ziel"):(d=25,t=v>0?"var(--apple-red)":"var(--apple-blue)",h="Ziel"),d=Math.min(Math.max(Math.round(d),15),100);let S=2*Math.PI*32,E=S-d/100*S;function L(k,I,O,A="",j=!1){if(!I)return"";let J=typeof O=="number"&&!isNaN(O)?O:I||0,T=I-J,P="\u25CF",G="badge-success",K="Optimal";Math.abs(T)<=.5?(P="\u25CF",G="badge-success",K="Optimal"):T>0?(P="\u25B2",K=`+${T.toFixed(1)} ${A}`,G=j?"badge-danger":"badge-success"):(P="\u25BC",K=`${T.toFixed(1)} ${A}`,G=j?"badge-success":"badge-danger"),k==="Gewicht"&&(K=T>0?`+${T.toFixed(1)} ${A}`:`${T.toFixed(1)} ${A}`,G=T>0?"badge-danger":v<0?"badge-info":"badge-success",P=T>0?"\u25B2":"\u25BC");let ge=`\u{1F4CA} METRIK: ${k.toUpperCase()}

\u25CF Aktuell: ${I.toFixed(1)} ${A}
\u25CF Zielwert: ${J.toFixed(1)} ${A}
\u25CF Abweichung: ${T>=0?"+":""}${T.toFixed(1)} ${A}

Bewertung basiert auf deinem Profil-Sollwert.`;return`
      <div class="score-badge ${G}" data-title="${ge}" style="cursor: help;">
        <span class="score-badge-title">${k}</span>
        <span class="score-badge-value">${P} ${I.toFixed(1)}${A}</span>
        <span class="score-badge-status">${K}</span>
      </div>
    `}let F="";v>0?F=` &bull; Noch <strong>${v.toFixed(1)} kg</strong> bis zum Wunschgewicht`:v<0?F=` &bull; <strong>${Math.abs(v).toFixed(1)} kg</strong> unter Wunschgewicht`:F=" &bull; <strong>Punktlandung! \u{1F389}</strong>";let W=s.map(k=>{let I=k.name.toLowerCase()===e.name.toLowerCase()?"selected":"";return`<option value="${k.name}" ${I}>${k.name.toUpperCase()}</option>`}).join("");i.innerHTML=`
    <div class="profile-main-layout">

      <!-- Linker Block: Textdaten -->
      <div class="profile-left-combined">
        <div class="profile-text-side">
          <div class="profile-title-row">
            <select id="userSelect" class="profile-user-select">
              ${W}
            </select>
            <span class="status-badge ${m?"status-active":"status-inactive"}">
              ${m?"\u25CF Aktiv":"\u25CF Inaktiv"}
            </span>
          </div>
          <p class="profile-meta-main">
            Geschlecht: ${e.sex==="female"?"Weiblich":"M\xE4nnlich"} &bull; Wunschgewicht: <strong>${x} kg</strong>${F}
          </p>
          <p class="profile-meta-secondary">
            Letzte Messung: <strong>${c}</strong> um <strong>${n} Uhr</strong> &bull;
            <strong>${a.length}</strong> Messungen im ausgew\xE4hlten Zeitraum
          </p>
        </div>
      </div>

      <!-- Mittlerer Block: Die vier farbigen Status-Tiles -->
      <div class="profile-status-side">
        ${L("Gewicht",r.weight,x,"kg",!0)}
        ${L("K\xF6rperfett",r.fat,g.FAT||15,"%",!0)}
        ${L("Muskeln",r.muscle,g.MUSCLE||50,"kg",!1)}
        ${L("Protein",r.protein,g.PROTEIN||20,"%",!1)}
      </div>

      <!-- Rechter Block: Der Fortschrittsring als edler Abschluss der Karte -->
      <div class="ring-container" title="Dein aktueller Zielerreichungsgrad">
        <svg class="ring-svg" viewBox="0 0 72 72">
          <circle class="ring-bg" cx="36" cy="36" r="32"></circle>
          <circle class="ring-fill" cx="36" cy="36" r="32"
                  style="stroke-dasharray: ${S}; stroke-dashoffset: ${E}; stroke: ${t};">
          </circle>
        </svg>
        <div class="ring-text">${h}</div>
      </div>

    </div>
  `,o&&document.getElementById("userSelect").addEventListener("change",k=>{o(k.target.value)})}var _={};function U(e,r,a){let s=document.getElementById("kpiGrid");if(!s||!e||e.length===0)return;let o=new Date(r+"T00:00:00"),i=new Date(a+"T23:59:59"),l=e.filter(t=>{let h=new Date(t.timestamp);return h>=o&&h<=i}).sort((t,h)=>new Date(t.timestamp)-new Date(h.timestamp)),c=r===a,n,p,f=!1;l.length>0?(n=l[l.length-1],p=l[0]):(n=e[e.length-1],p=n,f=!0);let m=p;if(c||l.length<2||f){let t=e.findIndex(h=>n&&n.id&&h.id?h.id===n.id:new Date(h.timestamp).getTime()===new Date(n.timestamp).getTime());m=t>0?e[t-1]:n}let g=c||f?e.slice(-7):l,x="";if(f)x=`Fokus: Heute noch keine Messung <span style="font-weight: normal; color: var(--apple-orange); font-size: 13px;">(Historischer R\xFCckblick vom ${new Date(n.timestamp).toLocaleDateString("de-DE")})</span>`;else if(c)x=`Fokus: Einzelmessung vom ${new Date(n.timestamp).toLocaleDateString("de-DE")}`;else{let t=new Date(r).toLocaleDateString("de-DE"),h=new Date(a).toLocaleDateString("de-DE"),M=new Date(n.timestamp).toLocaleDateString("de-DE");x=`Analyse-Zeitraum: ${t} bis ${h} <span style="font-weight: normal; color: var(--text-muted); font-size: 13px;">(Letzter Messpunkt im Zeitraum: ${M})</span>`}let y=[{id:"w",title:"Gewicht",val:n.weight,pVal:m.weight,unit:"kg",color:"var(--apple-red)",history:g.map(t=>t.weight),min:50,max:100},{id:"f",title:"K\xF6rperfett",val:n.fat,pVal:m.fat,unit:"%",color:"var(--apple-orange)",history:g.map(t=>t.fat),min:5,max:35},{id:"m",title:"Muskelmasse",val:n.muscle,pVal:m.muscle,unit:"kg",color:"var(--apple-green)",history:g.map(t=>t.muscle),min:30,max:70},{id:"b",title:"BMI",val:n.bmi,pVal:m.bmi,unit:"",color:"var(--apple-purple)",history:g.map(t=>t.bmi),min:15,max:35},{id:"v",title:"Viszeralfett",val:n.visceral,pVal:m.visceral,unit:"Lvl",color:"var(--apple-purple)",history:g.map(t=>t.visceral),min:1,max:15},{id:"wa",title:"K\xF6rperwasser",val:n.water,pVal:m.water,unit:"%",color:"var(--apple-blue)",history:g.map(t=>t.water),min:40,max:70},{id:"p",title:"Protein",val:n.protein,pVal:m.protein,unit:"%",color:"var(--apple-blue)",history:g.map(t=>t.protein),min:10,max:25},{id:"l",title:"Fettfreie Masse (LBM)",val:n.lbm,pVal:m.lbm,unit:"kg",color:"var(--apple-red)",history:g.map(t=>t.lbm),min:40,max:85},{id:"po",title:"Punkte (POI)",val:n.poi,pVal:m.poi,unit:"Pts",color:"var(--apple-green)",history:g.map(t=>t.poi),min:5,max:20},{id:"i",title:"Biologisches Alter",val:n.metabolic_age,pVal:m.metabolic_age,unit:" J.",color:"#8e8e93",history:g.map(t=>t.metabolic_age),min:18,max:80}],v=y.map(t=>{let h=t.val-t.pVal,M="trend-stable",$="\u2192",w="Stabil",S=["m","wa","p","po"].includes(t.id);h>.02?(M=S?"trend-up":"trend-down",$="\u25B2",w=`+${h.toFixed(1)}`):h<-.02&&(M=S?"trend-down":"trend-up",$="\u25BC",w=`${h.toFixed(1)}`);let E=Math.min(Math.max((t.val-t.min)/(t.max-t.min)*100,5),100);return`
      <div class="tile">
        <div class="tile-header">
          <div class="tile-title">${t.title}</div>
          <div class="tile-trend ${M}">${$} ${w}</div>
        </div>

        <div class="tile-body">
          <div class="tile-value">${t.val?t.val.toFixed(1):"--"}<span>${t.unit}</span></div>
          <div class="sparkline-container">
            <canvas id="spark_${t.id}"></canvas>
          </div>
        </div>

        <div class="progress-container">
          <div class="progress-bar" style="width: ${E}%; background-color: ${t.color};"></div>
        </div>
      </div>
    `}).join("");s.innerHTML=`
    <div style="grid-column: 1 / -1; width: 100%; margin-bottom: 5px; padding: 5px 0;">
      <h2 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin: 0; letter-spacing: -0.3px;">
        ${x}
      </h2>
    </div>
    ${v}
  `;let d=document.documentElement.getAttribute("data-theme")==="dark";y.forEach(t=>{let h=`spark_${t.id}`,M=document.getElementById(h),$=M?.getContext("2d");if(!$)return;_[h]&&_[h].destroy();let w=t.color;d?w={"var(--apple-red)":"#ff453a","var(--apple-orange)":"#ff9f0a","var(--apple-green)":"#30d158","var(--apple-purple)":"#bf5af2","var(--apple-blue)":"#0a84ff","#8e8e93":"#aeaeac"}[t.color]||t.color:w={"var(--apple-red)":"#ff3b30","var(--apple-orange)":"#ff9500","var(--apple-green)":"#34c759","var(--apple-purple)":"#af52de","var(--apple-blue)":"#007aff","#8e8e93":"#8e8e93"}[t.color]||t.color;let S=$.createLinearGradient(0,0,0,M.height||40),E="10, 132, 255",L=w.startsWith("#")?w:"#0a84ff";if(L.startsWith("#")){let F=parseInt(L.slice(1,3),16),W=parseInt(L.slice(3,5),16),k=parseInt(L.slice(5,7),16);E=`${F}, ${W}, ${k}`}d?(S.addColorStop(0,`rgba(${E}, 0.25)`),S.addColorStop(1,`rgba(${E}, 0.0)`)):(S.addColorStop(0,`rgba(${E}, 0.15)`),S.addColorStop(1,`rgba(${E}, 0.0)`)),_[h]=new Chart($,{type:"line",data:{labels:t.history.map((F,W)=>W),datasets:[{data:t.history,borderColor:w,borderWidth:2.5,pointRadius:t.history.length===1?4:0,pointBackgroundColor:w,backgroundColor:S,fill:!0,tension:.35}]},options:{responsive:!0,maintainAspectRatio:!1,animation:{duration:150},plugins:{legend:{display:!1},tooltip:{enabled:!1}},scales:{x:{display:!1},y:{display:!1,offset:!0}}}})})}var Y={Heute:"today",Gestern:"gestern","Diese Woche":"woche","Letzte 7 Tage":"7tage","Letzte 30 Tage":"30tage","Dieser Monat":"monat"},le="em-period-label";function ce(e){let r=new Date,a=new Date,s=new Date;switch(a.setHours(0,0,0,0),s.setHours(23,59,59,999),e){case"today":break;case"gestern":a.setDate(r.getDate()-1),s.setDate(r.getDate()-1);break;case"woche":{let o=r.getDay();a.setDate(r.getDate()-o+(o===0?-6:1));break}case"7tage":a.setDate(r.getDate()-6);break;case"30tage":a.setDate(r.getDate()-29);break;case"monat":a.setDate(1);break}return{from:N(a),to:N(s)}}function N(e){return e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0")}function de(e,r){let a=localStorage.getItem(le)||"Heute";!Y[a]&&!a.startsWith("Jahr ")&&a!=="Individuell"&&(a="Heute");let s=new Date().getFullYear(),o="";for(let d=s;d>=2018;d--)o+=`<option value="${d}">Jahr ${d}</option>`;if(!document.getElementById("ds-styles")){let d=document.createElement("style");d.id="ds-styles",d.textContent=`
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
        `,document.head.appendChild(d)}let i=document.createElement("div");i.className="ds-wrap",i.innerHTML=`
        <span class="ds-label">\u{1F4C5} Zeitraum:</span>
        <button class="ds-btn" id="dsBtn">${a}</button>
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
    `,e.appendChild(i);let l=i.querySelector("#dsBtn"),c=i.querySelector("#dsDrop"),n=i.querySelector("#dsYear"),p=i.querySelector("#dsCustomToggle"),f=i.querySelector("#dsCustom"),m=i.querySelector("#dsFrom"),g=i.querySelector("#dsTo"),x=i.querySelector("#dsApply");l.addEventListener("click",d=>{d.stopPropagation(),c.classList.toggle("hidden")}),document.addEventListener("click",()=>c.classList.add("hidden")),c.addEventListener("click",d=>d.stopPropagation()),p.addEventListener("click",()=>f.classList.toggle("show"));function y(d,t,h){a=d,localStorage.setItem(le,d),l.textContent=d,c.classList.add("hidden"),c.querySelectorAll(".ds-item").forEach(M=>{M.classList.toggle("active",M.textContent.trim()===d)}),r(t,h)}c.querySelectorAll(".ds-item").forEach(d=>{d.addEventListener("click",()=>{let t=d.getAttribute("data-key"),h=ce(t);y(d.textContent.trim(),h.from,h.to)})}),n.addEventListener("change",()=>{if(!n.value)return;let d=n.value;y(`Jahr ${d}`,`${d}-01-01`,`${d}-12-31`)}),x.addEventListener("click",()=>{!m.value||!g.value||y("Individuell",m.value,g.value)});function v(){if(Y[a]){let d=ce(Y[a]);r(d.from,d.to)}else if(a.startsWith("Jahr ")){let d=a.replace("Jahr ","");r(`${d}-01-01`,`${d}-12-31`)}else r(m.value||N(new Date),g.value||N(new Date))}return v}var b={lastTimeline:[],currentFrom:"",currentTo:"",usersCache:[],triggerSelectorRefresh:null,pollingInterval:null,lastKnownCount:0},be="3.1.0",D=e=>document.querySelector(e),pe="health-active-user",me="health-theme";document.addEventListener("DOMContentLoaded",()=>{xe(),ve(),D("#themeToggle").addEventListener("click",ye),fe(5)});window.addEventListener("resize",()=>{if(b.lastTimeline.length>0){let e=D("#userSelect")?.value,r=b.usersCache.find(a=>a.name.toLowerCase()===e?.toLowerCase());V(b.lastTimeline,r,b.currentFrom,b.currentTo)}});function xe(){let e=localStorage.getItem(me)||"light";document.documentElement.setAttribute("data-theme",e)}function ye(){let e=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e),localStorage.setItem(me,e),b.lastTimeline.length>0&&requestAnimationFrame(()=>{setTimeout(()=>{q(),U(b.lastTimeline,b.currentFrom,b.currentTo);let r=D("#userSelect")?.value,a=b.usersCache.find(s=>s.name.toLowerCase()===r?.toLowerCase());V(b.lastTimeline,a,b.currentFrom,b.currentTo)},0)})}function ue(e,r){let a=[...e.previous||[],...e.current||[]].map(i=>({...i,timestamp:new Date(i.timestamp)})).sort((i,l)=>i.timestamp-l.timestamp);b.lastTimeline=a,e.all_users&&(b.usersCache=e.all_users);let s=b.usersCache.find(i=>i.name.toLowerCase()===r.toLowerCase());b.lastKnownCount=s?s.count:e.count||0;let o=typeof H=="function"?H:window.renderProfile||H.renderProfile;typeof o=="function"?o(e.user,a[a.length-1],a,b.usersCache,i=>{localStorage.setItem(pe,i),b.triggerSelectorRefresh&&b.triggerSelectorRefresh(),fe(5)}):console.error("Fehler: renderProfile-Modul konnte nicht als Funktion geladen werden."),U(a,b.currentFrom,b.currentTo),q(),V(a,e.user,b.currentFrom,b.currentTo)}function fe(e=5){b.pollingInterval&&clearInterval(b.pollingInterval),b.pollingInterval=setInterval(async()=>{let r=D("#userSelect")?.value;if(r)try{let a=`dashboard/api/datav2?user=${r.toLowerCase()}&from=${b.currentFrom}&to=${b.currentTo}`,o=await(await fetch(a)).json();if(o&&o.all_users){let i=o.all_users.find(l=>l.name.toLowerCase()===r.toLowerCase());i&&typeof i.count<"u"&&i.count!==b.lastKnownCount&&(console.log(`\u{1F514} Live-Messung im Hintergrund verarbeitet! (${i.count})`),z(`Neue Waagen-Messung f\xFCr ${r.toUpperCase()} empfangen!`,"success"),ue(o,r))}}catch(a){console.error("Polling Fehler:",a),z("Verbindung zum Waagen-Server verloren.","error")}},e*60*1e3)}async function ve(){try{let e=localStorage.getItem(pe)||"peter";b.triggerSelectorRefresh=de(D("#dateSelectorContainer"),(r,a)=>{b.currentFrom=r,b.currentTo=a,we(D("#userSelect")?.value||e)}),b.triggerSelectorRefresh&&b.triggerSelectorRefresh()}catch(e){console.error("Dropdown Fehler:",e),D("#loadBox").textContent="Fehler beim Starten des Dashboards."}}async function we(e,r=!1){if(e){r||(D("#loadBox").style.display="block",D("#dashboardContent").style.display="none");try{let a=`dashboard/api/datav2?user=${e.toLowerCase()}&from=${b.currentFrom}&to=${b.currentTo}`,o=await(await fetch(a)).json();o.current&&o.current.length>0||o.previous&&o.previous.length>0?(D("#loadBox").style.display="none",D("#dashboardContent").style.display="block",ue(o,e),r||z(`Daten f\xFCr ${e.toUpperCase()} geladen.`,"success")):(D("#loadBox").style.display="none",r||z("Keine Messwerte im gew\xE4hlten Zeitraum vorhanden.","info"))}catch(a){console.error("Dashboard Ladefehler:",a),D("#loadBox").style.display="none",r||z("Fehler beim Laden der Benutzerdaten.","error")}}}console.info(`%c \u26A1 BodyScale Health Dashboard %c ESM v${be} `,"color:#fff;background:#e94560;padding:4px 8px;border-radius:4px 0 0 4px;font-size:11px","color:#1a1a2e;background:#a8dadc;padding:4px 8px;border-radius:0 4px 4px 0;font-size:11px");})();
//# sourceMappingURL=app.bundle.js.map
