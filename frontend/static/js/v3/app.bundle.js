(()=>{function v(e,r=16,t=1,o=0,i="currentColor",l=""){let a=`${e==="bgGym"?"width:auto;":`width:${r}px;`} height:${r}px; stroke:${i}; stroke-width:2; fill:none; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:text-bottom; flex-shrink:0; opacity:${t}; margin-right:${o}px;`,s=l?`class="${l}"`:"";return{weight:`<svg ${s} style="${a}" viewBox="0 0 24 24"><path d="M5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/><circle cx="12" cy="12" r="3"/><path d="M12 7v2"/></svg>`,muscle:`<svg ${s} style="${a}" viewBox="0 0 24 24"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h2"/><path d="M18 18h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2"/><path d="M6 12h12"/><path d="M10 7v10"/><path d="M14 7v10"/></svg>`,water:`<svg ${s} style="${a}" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>`,energy:`<svg ${s} style="${a}" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,trend:`<svg ${s} style="${a}" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3"/></svg>`,sync:`<svg ${s} style="${a}" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,fat:`<svg ${s} style="${a}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,protein:`<svg ${s} style="${a}" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,calendar:`<svg ${s} style="${a}" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,sun:`<svg ${s} style="${a}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,moon:`<svg ${s} style="${a}" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`,radar:`<svg ${s} style="${a}" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 2v20M2 12h20"/></svg>`,bar:`<svg ${s} style="${a}" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6M3 20h18"/></svg>`,bgGym:`<svg ${s} style="${a}" viewBox="0 0 800 200">
      <rect x="180" y="70" width="15" height="60" rx="3" fill="currentColor" stroke="none" />
      <rect x="200" y="60" width="20" height="80" rx="4" fill="currentColor" stroke="none" />
      <line x1="220" y1="100" x2="260" y2="100" stroke-width="8" />
      <path d="M 50 100 L 260 100 L 275 100 L 285 60 L 300 150 L 315 30 L 330 120 L 340 100 L 370 100" stroke-width="5" />
      <path d="M 370 100 C 370 80, 400 70, 410 90 C 420 70, 450 80, 450 100 C 450 120, 425 145, 410 155 C 395 145, 370 120, 370 100 Z" fill="currentColor" fill-opacity="0.15" stroke-width="5" />
      <path d="M 450 100 L 480 100 L 490 70 L 505 140 L 520 40 L 535 120 L 545 100 L 580 100" stroke-width="5" />
      <line x1="580" y1="100" x2="620" y2="100" stroke-width="8" />
      <rect x="620" y="60" width="20" height="80" rx="4" fill="currentColor" stroke="none" />
      <rect x="645" y="70" width="15" height="60" rx="3" fill="currentColor" stroke="none" />
      <path d="M 660 100 L 750 100" stroke-width="5" />
    </svg>`}[e]||""}if(!document.getElementById("health-msg-styles")){let e=document.createElement("style");e.id="health-msg-styles",e.textContent=`
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
    [data-theme="dark"] .health-toast-box {
        background-color: #010101 !important;
        border: 1px solid #2c2c2e !important;
        color: #ffffff !important;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6) !important;
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
  `,document.head.appendChild(e)}function F(e,r="info"){let t=document.getElementById("healthUniqueSnackbarContainer");t||(t=document.createElement("div"),t.id="healthUniqueSnackbarContainer",t.className="health-snackbar-wrap",document.body.appendChild(t));let l=v(r==="success"?"weight":r==="error"?"energy":"trend",18,r==="success"?"var(--apple-green)":r==="error"?"var(--apple-red)":"var(--apple-blue)"),n=document.createElement("div");n.className=`health-toast-box h-msg-${r}`,n.innerHTML=`${l}<div style="flex:1; line-height: 1.4;">${e}</div>`,t.appendChild(n),setTimeout(()=>{n&&(n.classList.add("health-toast-out"),n.addEventListener("transitionend",()=>n.remove()))},r==="success"?1500:4e3)}var m={text:"#8e8e93",grid:"#e5e5ea",radarBg:"rgba(0,122,255,0.1)"};function _(){let e=document.documentElement.getAttribute("data-theme")==="dark";m.text=e?"#aeaea2":"#8e8e93",m.grid=e?"#2c2c2e":"#e5e5ea",m.radarBg=e?"rgba(10,132,255,0.15)":"rgba(0,122,255,0.08)"}function O(e,r=3){return e.map((t,o)=>{if(o<r-1){let l=e.slice(0,o+1);return l.reduce((n,d)=>n+d,0)/l.length}return e.slice(o-r+1,o+1).reduce((l,n)=>l+n,0)/r})}function ye(e,r,t){let o=e.filter(h=>h[t]&&h[t]>0),i=o[o.length-1]?.[t]||0,l=o.length>0?o.reduce((h,b)=>h+b[t],0)/o.length:0,n=new Set(e.map(h=>h.date)),d=r.filter(h=>!n.has(h.date)&&h[t]&&h[t]>0),a=d.length>0?d.reduce((h,b)=>h+b[t],0)/d.length:l,s=l-a,p=s>.02?"\u25B2":s<-.02?"\u25BC":"\u25CF",g=["fat","visceral"].includes(t),f="badge-stable";return Math.abs(s)>.02&&(s>0?f=g?"badge-danger":"badge-success":f=g?"badge-success":"badge-danger"),{latest:i.toFixed(1),avg:l.toFixed(1),prevAvg:a.toFixed(1),diff:(s>0?"+":"")+s.toFixed(1),arrow:p,className:f}}function M(e,r,t,o){let l=document.getElementById(e)?.closest(".chart-card");if(!l)return;if(!document.getElementById("summary-footer-styles-v7")){let a=document.createElement("style");a.id="summary-footer-styles-v7",a.textContent=`
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
    `,document.head.appendChild(a)}let n=l.querySelector(".chart-summary-footer");n||(n=document.createElement("div"),n.className="chart-summary-footer",l.appendChild(n));let d=r.map(a=>{let s=ye(t,o,a.field),p=parseFloat(s.diff)===0?"0.0":s.diff;return`
      <div class="summary-block">
        <div class="summary-metric-title">${a.label} <span style="font-size: 11px; font-weight:500; text-transform:none;">(${a.unit})</span></div>

        <div class="summary-grid">
          <div class="summary-col">
            <span class="summary-col-label">Aktuell</span>
            <span class="summary-col-value" style="font-size: 15px; color:var(--apple-blue);">${s.latest}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">\xD8 Zeitraum</span>
            <span class="summary-col-value">${s.avg}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">\xD8 Vor-Per.</span>
            <span class="summary-col-value" style="color:var(--text-muted); font-weight:500;">${s.prevAvg}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">Trend</span>
            <div class="summary-pill ${s.className}">
              <span>${s.arrow}</span>
              <span>${p}</span>
            </div>
          </div>
        </div>
      </div>
    `}).join("");n.innerHTML=d}function L(){return{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,labels:{color:m.text,boxWidth:10,usePointStyle:!0,font:{size:12,weight:"600"}}}},scales:{x:{type:"category",grid:{display:!1},ticks:{color:m.text,font:{size:11,weight:"500"}}},y:{grid:{color:m.grid},ticks:{color:m.text,font:{size:11,weight:"500"}}}}}}function q(e,r,t,o){let i=document.getElementById("chartWeight"),l="transparent";if(i){let b=document.documentElement.getAttribute("data-theme")==="dark";l=i.getContext("2d").createLinearGradient(0,0,0,300),l.addColorStop(0,b?"rgba(255, 69, 58, 0.35)":"rgba(255, 59, 48, 0.22)"),l.addColorStop(1,"rgba(255, 59, 48, 0.0)")}M("chartWeight",[{field:"weight",label:"Gewicht",unit:"kg"},{field:"lbm",label:"Fettfreie Masse",unit:"kg"}],e,r);let n=e.map(b=>b.weight),d=e.map(b=>b.lbm),a=Math.min(...n,...d),s=Math.max(...n),p=s-a,g=a-1,f=s+1;if(p<3.5){let b=(a+s)/2;g=b-1.75,f=b+1.75}let h=L();h.scales&&delete h.scales,t("chartWeight",{type:"line",data:{labels:o,datasets:[{label:"Gewicht",data:n,borderColor:"#ff453a",backgroundColor:l,fill:!0,borderWidth:2.5,pointRadius:e.length>45?0:2,pointBackgroundColor:"#ff453a",tension:.2},{label:"Gewicht Trend",data:O(n,3),borderColor:"#ff9f0a",backgroundColor:"transparent",borderWidth:1.5,borderDash:[3,3],pointRadius:0,tension:.3},{label:"Fettfreie Masse",data:d,borderColor:"#0a84ff",backgroundColor:"transparent",borderWidth:1.5,pointRadius:0,tension:.2}]},options:{...h,responsive:!0,maintainAspectRatio:!1,scales:{x:{type:"category",grid:{color:m.grid||"#3a3a3c"},ticks:{color:m.text||"#ffffff",maxRotation:0,autoSkip:!0,maxTicksLimit:6}},y:{type:"linear",min:Math.floor(g),max:Math.ceil(f),title:{display:!0,text:"Masse (kg)",color:m.text||"#ffffff"},grid:{color:m.grid||"#3a3a3c"},ticks:{color:m.text||"#ffffff"}}}}})}function U(e,r,t,o){M("chartSummary",[{field:"weight",label:"Gewicht",unit:"kg"},{field:"muscle",label:"Muskeln",unit:"kg"},{field:"bmi",label:"BMI",unit:""}],e,r);let i=e.length<=1,l=e.map(c=>c.weight),n=e.map(c=>c.muscle),d=e.map(c=>c.bmi),a=Math.min(...l)-(i?5:1),s=Math.max(...l)+(i?5:1),p=Math.min(...n)-(i?5:.5),g=Math.max(...n)+(i?5:.5),f=Math.min(...d)-(i?5:.5),h=Math.max(...d)+(i?5:.5);if(i&&e.length>0){let c=e[0];t("chartSummary",{type:"bar",data:{labels:["Gewicht (kg)","Muskelmasse (kg)","BMI"],datasets:[{data:[c.weight,c.muscle,c.bmi],backgroundColor:["rgba(255, 69, 58, 0.6)","rgba(48, 209, 88, 0.6)","rgba(255, 159, 10, 0.6)"],borderColor:["#ff453a","#30d158","#ff9f0a"],borderWidth:1,borderRadius:12,barThickness:45,maxBarThickness:50}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1},ticks:{color:m.text||"#ffffff",font:{weight:"600"}}},y:{type:"linear",position:"left",min:Math.floor(Math.min(c.weight,c.muscle,c.bmi)-5),max:Math.ceil(Math.max(c.weight,c.muscle,c.bmi)+5),grid:{color:m.grid||"#3a3a3c"},ticks:{color:m.text||"#ffffff"}}}}});return}let b=e.map(c=>({x:new Date(c.timestamp),y:c.weight})),w=e.map(c=>({x:new Date(c.timestamp),y:c.muscle})),x=e.map(c=>({x:new Date(c.timestamp),y:c.bmi}));t("chartSummary",{type:"bar",data:{datasets:[{type:"bar",label:"BMI",data:x,borderColor:"#ff9f0a",backgroundColor:"rgba(255, 159, 10, 0.15)",borderWidth:{top:1,right:0,bottom:0,left:0},borderRadius:4,barThickness:e.length>30?8:16,yAxisID:"yBmi",order:3},{type:"line",label:"Gewicht (kg)",data:b,borderColor:"#ff453a",backgroundColor:"transparent",borderWidth:1,pointRadius:e.length<20?4:0,pointBackgroundColor:"#ff453a",yAxisID:"yWeight",tension:.2,order:1},{type:"line",label:"Muskeln (kg)",data:w,borderColor:"#30d158",backgroundColor:"transparent",borderWidth:1,pointRadius:e.length<20?4:0,pointBackgroundColor:"#30d158",yAxisID:"yMuscle",tension:.2,order:2}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{x:{type:"time",time:{tooltipFormat:"dd.MM.yyyy",unit:e.length>45?"month":"day",stepSize:e.length>180?2:1,displayFormats:{day:"dd.MM",month:"MMM yyyy"}},grid:{color:m.grid||"#3a3a3c"},ticks:{color:m.text||"#ffffff",maxRotation:0,maxTicksLimit:6}},yWeight:{type:"linear",position:"left",min:Math.floor(a),max:Math.ceil(s),title:{display:!0,text:"Gewicht (kg)",color:"#ff453a"},ticks:{color:m.text||"#ffffff"},grid:{color:m.grid||"#3a3a3c"}},yMuscle:{type:"linear",position:"right",min:Math.floor(p),max:Math.ceil(g),title:{display:!0,text:"Muskelmasse (kg)",color:"#30d158"},ticks:{color:m.text||"#ffffff"},grid:{display:!1}},yBmi:{type:"linear",position:"right",min:Math.floor(f),max:Math.ceil(h),display:!1,grid:{display:!1}}}}})}function Y(e,r,t,o){let i=L();M("chartFat",[{field:"fat",label:"Fett",unit:"%"},{field:"visceral",label:"Viszeral",unit:"Lvl"}],e,r),t("chartFat",{type:"line",data:{labels:o,datasets:[{label:"K\xF6rperfett (%)",data:e.map(l=>l.fat),borderColor:"#ff9f0a",backgroundColor:"transparent",borderWidth:1,pointRadius:0},{label:"Viszeralfett",data:e.map(l=>l.visceral),borderColor:"#bf5af2",backgroundColor:"transparent",borderWidth:1,pointRadius:0,yAxisID:"yVisc"}]},options:{...i,scales:{x:i.scales.x,y:{grid:{color:m.grid},ticks:{color:m.text}},yVisc:{position:"right",grid:{display:!1},ticks:{color:m.text}}}}})}function X(e,r,t,o){M("chartMuscle",[{field:"muscle",label:"Muskeln",unit:"kg"},{field:"protein",label:"Protein",unit:"%"}],e,r);let i=e.map(f=>f.muscle),l=e.map(f=>f.protein),n=Math.min(...i),d=Math.max(...i),a=d-n,s=n-.5,p=d+.5;if(a<3){let f=(n+d)/2;s=f-1.5,p=f+1.5}let g=L();g.scales&&delete g.scales,t("chartMuscle",{type:"line",data:{labels:o,datasets:[{label:"Muskelmasse (kg)",data:i,borderColor:"#30d158",backgroundColor:"transparent",borderWidth:.9,pointRadius:e.length>45?0:2,pointBackgroundColor:"#30d158",yAxisID:"yMuscle",tension:.2},{label:"Protein (%)",data:l,borderColor:"#0a84ff",backgroundColor:"transparent",borderWidth:.6,pointRadius:0,yAxisID:"yProtein",tension:.2}]},options:{...g,responsive:!0,maintainAspectRatio:!1,scales:{x:{type:"category",grid:{color:m.grid||"#3a3a3c"},ticks:{color:m.text||"#ffffff",maxRotation:0,autoSkip:!0,maxTicksLimit:6}},yMuscle:{type:"linear",position:"left",min:Math.floor(s),max:Math.ceil(p),title:{display:!0,text:"Muskelmasse (kg)",color:"#30d158"},grid:{color:m.grid||"#3a3a3c"},ticks:{color:m.text||"#ffffff"}},yProtein:{type:"linear",position:"right",title:{display:!0,text:"Protein (%)",color:"#0a84ff"},grid:{display:!1},ticks:{color:m.text||"#ffffff"}}}}})}function J(e,r,t=null){let o=e[e.length-1]||{},i=[o];M("chartRadar",[{field:"weight",label:"Gewicht",unit:"kg"},{field:"fat",label:"Fett",unit:"%"},{field:"muscle",label:"Muskeln",unit:"kg"},{field:"bmi",label:"BMI",unit:""}],i,i);let n=(t?.name||t?.username||"").toLowerCase()==="reni",d={weight:n?54:70,fat:n?15.5:11.5,water:n?57:55,muscle:n?48:56,protein:n?18:22,bmi:22},a=[o.weight?Math.min(Math.max(o.weight/d.weight*100,40),160):100,o.fat?Math.min(Math.max(o.fat/d.fat*100,40),160):100,o.water?Math.min(Math.max(o.water/d.water*100,40),160):100,o.muscle?Math.min(Math.max(o.muscle/d.muscle*100,40),160):100,o.protein?Math.min(Math.max(o.protein/d.protein*100,40),160):100,o.bmi?Math.min(Math.max(o.bmi/d.bmi*100,40),160):100];r("chartRadar",{type:"radar",data:{labels:["Gewicht","K\xF6rperfett","Wasser","Muskeln","Protein","BMI"],datasets:[{label:"Dein Ist-Zustand (%)",data:a,backgroundColor:m.radarBg||"rgba(10, 132, 255, 0.15)",borderColor:"#0a84ff",borderWidth:2.5,pointRadius:4,pointBackgroundColor:"#0a84ff",order:1},{label:"Optimales Ziel (100%)",data:[100,100,100,100,100,100],borderColor:"#30d158",borderWidth:1.5,borderDash:[4,4],backgroundColor:"transparent",pointRadius:0,order:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"top",labels:{color:m.text,boxWidth:12,font:{size:11,weight:"600"}}},tooltip:{callbacks:{label:s=>` ${s.dataset.label}: ${s.raw.toFixed(1)}%`}}},scales:{r:{min:50,max:150,grid:{color:m.grid||"#3a3a3c"},angleLines:{color:m.grid||"#3a3a3c"},pointLabels:{color:m.text,font:{size:11,weight:"600"},padding:12},ticks:{display:!0,color:m.text,backdropColor:"transparent",font:{size:9},stepSize:25,callback:s=>s===100?"100%":`${s}%`}}}}})}function Q(e,r,t,o=null){let i=e.filter(g=>g.poi&&g.poi>0),n=(i.length>0?i.reduce((g,f)=>g+f.poi,0)/i.length:12.9)*150,a=(e[e.length-1]||{}).tdee||o?.scores?.BMR||2400,s=e.map(g=>({...g,poi:n,tdee:a})),p=(t||e).map(g=>({...g,poi:n,tdee:a}));M("chartNutrition",[{field:"poi",label:"Energie-Zufuhr",unit:" kcal"},{field:"tdee",label:"Gesamtverbrauch",unit:" kcal"}],s,p),M("chartNutrition",[{field:"poi",label:"Energie-Zufuhr",unit:" kcal"},{field:"tdee",label:"Gesamtverbrauch",unit:" kcal"}],s,p),r("chartNutrition",{type:"bar",data:{labels:["Kohlenhydrate","Proteine","Fette"],datasets:[{data:[n*.45,n*.3,n*.25],backgroundColor:["#ff9f0a","#0a84ff","#ff453a"],borderRadius:{topLeft:8,topRight:8,bottomLeft:0,bottomRight:0},borderSkipped:"bottom",barPercentage:.85}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:g=>` \xD8 ${g.raw.toFixed(0)} kcal/Tag`}}},scales:{x:{grid:{display:!1},ticks:{color:m.text,font:{size:12,weight:"600"}}},y:{grid:{color:m.grid},ticks:{color:m.text,callback:g=>`${g} kcal`},title:{display:!0,text:`Zeitraum-Schnitt: Gesamt \xD8 ${n.toFixed(0)} kcal/Tag`,color:m.text}}}}})}function ee(e,r,t,o,i){M("chartDelta",[{field:"weight",label:"Gewicht",unit:"kg"},{field:"fat",label:"K\xF6rperfett",unit:"%"},{field:"muscle",label:"Muskelmasse",unit:"kg"},{field:"water",label:"K\xF6rperwasser",unit:"%"}],e,r);let l=L(),n=e.length<3||o===i,d=[...e],a="";if(n)d=r.filter(c=>c.weight&&c.weight>0).slice(-7).sort((c,k)=>new Date(c.timestamp)-new Date(k.timestamp)),a=" (Review: Letzte 7 Tage)";else{let x=new Date(o).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}),c=new Date(i).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"});a=` (Ver\xE4nderung ${x} bis ${c})`}if(d.length<2)return;let s=d[0],p=d[d.length-1],g=p.weight-s.weight,f=p.fat&&s.fat?p.fat-s.fat:0,h=p.muscle&&s.muscle?p.muscle-s.muscle:0,b=p.water&&s.water?p.water-s.water:0,w=document.getElementById("chartDelta")?.closest(".chart-card");if(w){let x=w.querySelector(".chart-title");if(x){let c=v("bar",16);x.innerHTML=`${c}<span style="margin-left: 8px;">Ver\xE4nderung (Fett, Muskeln, Wasser)</span><span style="font-size:12px; font-weight:normal; color:var(--text-muted); margin-left:6px;">${a}</span>`,x.style.display="inline-flex",x.style.alignItems="center"}}t("chartDelta",{type:"bar",data:{labels:["Gewicht","K\xF6rperfett","Muskelmasse","K\xF6rperwasser"],datasets:[{data:[g,f,h,b],backgroundColor:["#ff453a","#ff9f0a","#30d158","#0a84ff"],borderRadius:function(x){let c=x.dataIndex;return x.dataset.data[c]>=0?{topLeft:8,topRight:8,bottomLeft:0,bottomRight:0}:{topLeft:0,topRight:0,bottomLeft:8,bottomRight:8}},borderSkipped:!1,barPercentage:.85}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:function(x){let c=x.raw,k=x.dataIndex===0||x.dataIndex===2?" kg":" %";return` Bilanz: ${c>=0?"+":""}${c.toFixed(1)}${k}`}}}},scales:{x:{grid:{display:!1},ticks:{color:m.text,font:{size:12,weight:"600"}}},y:{grid:{color:m.grid},ticks:{color:m.text,callback:function(x){return(x>=0?"+":"")+x.toFixed(1)}}}}}})}function te(e,r){if(!e)return;let t=window.Chart?.instances?.chartNutrition?.config?._data?.datasets?.[0]?.data||{},o=2411,i=1148,l=o-i;r("chartEnergySplit",{type:"doughnut",data:{labels:["Grundumsatz (BMR)","Aktivit\xE4tsumsatz"],datasets:[{data:[i,l],backgroundColor:["#bf5af2","#30d158"],borderWidth:0,cutout:"75%",borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"bottom",labels:{color:m.text,boxWidth:10,usePointStyle:!0,font:{size:11,weight:"600"}}},tooltip:{callbacks:{label:n=>` ${n.label}: ${n.raw.toFixed(0)} kcal`}}},layout:{padding:4}},plugins:[{id:"centerText",beforeDraw:n=>{let{ctx:d,width:a,height:s}=n;d.save();let p=document.documentElement.getAttribute("data-theme")==="dark";d.font="600 10px -apple-system, BlinkMacSystemFont, sans-serif",d.textAlign="center",d.fillStyle="#8e8e93",d.fillText("BEDARF",a/2,s/2-10),d.font="700 18px -apple-system, BlinkMacSystemFont, sans-serif",d.fillStyle=p?"#ffffff":"#000000",d.fillText(`${o.toFixed(0)}`,a/2,s/2+10),d.font="600 10px -apple-system, BlinkMacSystemFont, sans-serif",d.fillStyle="#8e8e93",d.fillText("KCAL / TAG",a/2,s/2+24),d.restore()}}]})}var H={};function K(){_()}function E(e,r){let t=document.getElementById(e);if(!t)return;if(H[e])try{H[e].destroy()}catch{}let o=t.cloneNode(!0);t.parentNode.replaceChild(o,t),H[e]=new Chart(o.getContext("2d"),r)}function R(e,r=null,t="",o=""){if(!e||e.length===0)return;let i=e.filter(p=>p&&p.weight&&p.weight>0);if(i.length===0)return;let l=t?new Date(t+"T00:00:00"):null,n=o?new Date(o+"T23:59:59"):null,d=i.filter(p=>{if(!l||!n)return!0;let g=new Date(p.timestamp);return g>=l&&g<=n}).sort((p,g)=>new Date(p.timestamp)-new Date(g.timestamp)),a=[...d];d.length<5&&(a=i.slice(-30).sort((p,g)=>new Date(p.timestamp)-new Date(g.timestamp)));let s=a.map(p=>{if(p.date)return Array.isArray(p.date)?p.date[0]:p.date;let g=new Date(p.timestamp);return g.getFullYear()+"-"+String(g.getMonth()+1).padStart(2,"0")+"-"+String(g.getDate()).padStart(2,"0")});q(a,i,E,s),U(a,i,E,s),Y(a,i,E,s),X(a,i,E,s),Q(a,E,i,r),ee(d.length>0?d:[i[i.length-1]],i,E,t,o),J(i,E,r),r&&te(r,E),console.log(`\u{1F680} Charts stabilisiert gezeichnet. X-Achsen-Punkte: ${s.length} Tage.`)}function Z(){Object.entries({"#titleWeight":{icon:"weight",text:"Gewicht (mit Trend) & Fettfreie Masse"},"#titleSummary":{icon:"trend",text:"Zusammenfassung (Gewicht / Muskeln / BMI)"},"#titleFat":{icon:"fat",text:"K\xF6rperfett & Viszeralfett"},"#titleMuscle":{icon:"muscle",text:"Muskeln & Protein"},"#titleRadar":{icon:"radar",text:"K\xF6rperwerte (aktuell normalisiert)"},"#titleEnergy":{icon:"energy",text:"Energie-Bilanz (Zufuhr vs. Verbrauch)"},"#titleDelta":{icon:"bar",text:"Ver\xE4nderung (Fett, Muskeln, Wasser)"}}).forEach(([r,t])=>{let o=document.querySelector(r);if(!o)return;let i=v(t.icon,16,.8,8);o.innerHTML=`${i}<span>${t.text}</span>`,o.style.display="inline-flex",o.style.alignItems="center"})}function re(e,r,t,o,i,l){if(!document.getElementById("profile-left-premium-styles")){let s=document.createElement("style");s.id="profile-left-premium-styles",s.textContent=`
      .profile-text-side {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .profile-title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 6px;
      }
      /* Clean Apple Header Select */
      .profile-user-select {
        font-size: 22px;
        font-weight: 700;
        color: var(--text-main, #1c1c1e);
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        letter-spacing: -0.5px;
        outline: none;
      }
      /* Flache Apple Status-Pille */
      .status-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 6px;
        white-space: nowrap;
      }
      .status-badge.status-active {
        color: #34c759;
        background: rgba(52, 199, 89, 0.1);
      }
      .status-badge.status-inactive {
        color: #8e8e93;
        background: rgba(142, 142, 147, 0.08);
      }
      /* Apple Health Line-Rows */
      .profile-meta-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--text-muted, #8e8e93);
        margin: 1px 0;
      }
      /* D\xFCnne, einfarbige SVG-Icons */
      .apple-health-icon {
        width: 14px;
        height: 14px;
        stroke: var(--text-muted, #8e8e93);
        stroke-width: 1.8;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        opacity: 0.7;
      }
      .profile-meta-row strong {
        color: var(--text-main, #1c1c1e);
        font-weight: 600;
      }
      [data-theme=dark] .profile-user-select,
      [data-theme=dark] .profile-meta-row strong { color: #ffffff; }
    `,document.head.appendChild(s)}let n=v("weight",14,"currentColor","apple-health-icon"),d=v("trend",14,"currentColor","apple-health-icon"),a=v("sync",14,"currentColor","apple-health-icon");return`
    <div class="profile-left-combined">
      <div class="profile-text-side">

        <div class="profile-title-row">
          <div style="position: relative; display: inline-flex; align-items: center;">
            <select id="userSelect" class="profile-user-select">
              ${e}
            </select>
            <span style="font-size: 9px; color: var(--text-muted, #8e8e93); pointer-events: none; margin-left: 3px;">\u25BC</span>
          </div>
          <span class="status-badge ${r?"status-active":"status-inactive"}">
            ${r?"Aktiv":"Inaktiv"}
          </span>
        </div>

        <p class="profile-meta-row">
          ${n}
          <span>Letzte Messung: <strong>${t} um ${o} Uhr</strong></span>
        </p>

        <p class="profile-meta-row">
          ${d}
          <span>Messungen im Zeitraum: <strong>${i}</strong></span>
        </p>

        <p class="profile-meta-row">
          ${a}
          <span>Synchronisiert: <strong>${l}</strong></span>
        </p>

      </div>
    </div>
  `}function A(e,r,t,o="",i=!1){if(!r)return"";let l=typeof t=="number"&&!isNaN(t)?t:r||0,n=r-l,d="\u25CF",a="badge-success",s="Optimal";Math.abs(n)<=.5?(d="\u25CF",a="badge-success",s="Optimal"):n>0?(d="\u25B2",s=`+${n.toFixed(1)} ${o}`,a=i?"badge-danger":"badge-success"):(d="\u25BC",s=`${n.toFixed(1)} ${o}`,a=i?"badge-success":"badge-danger"),e==="Gewicht"&&(s=n>0?`+${n.toFixed(1)} ${o}`:`${n.toFixed(1)} ${o}`,a=n>0?"badge-danger":n<0?"badge-info":"badge-success",d=n>0?"\u25B2":"\u25BC");let p="";e==="Gewicht"&&(p=v("weight",11,.6,4)),e==="K\xF6rperfett"&&(p=v("fat",11,.6,4)),e==="Muskeln"&&(p=v("muscle",11,.6,4)),e==="Protein"&&(p=v("protein",11,.6,4));let g=document.getElementById("scorebadge-apple-styles");g&&g.remove();let f=document.createElement("style");f.id="scorebadge-apple-styles",f.textContent=`
    /* \u{1F31F} FIX: flex: 1 und feste min-width zwingen alle 4 Badges in dieselbe quadratische Breite */
    .score-badge {
      position: relative !important;
      cursor: pointer !important;
      pointer-events: auto !important;
      overflow: visible !important;
      flex: 1 !important;
      min-width: 95px !important;
      max-width: 115px !important;
      box-sizing: border-box !important;
    }
    .score-badge-title { display: inline-flex; align-items: center; justify-content: center; width: 100%; white-space: nowrap; pointer-events: none; }
    .score-badge-value { pointer-events: none; white-space: nowrap; }

    /* \u{1F31F} FIX: Verhindert, dass lange Statustexte das Badge aufbl\xE4hen oder umbrechen */
    .score-badge-status {
      pointer-events: none;
      white-space: nowrap !important;
      font-size: 10px !important;
      letter-spacing: -0.2px !important;
    }

    /* Der schwebende Premium-Tooltip nach UNTEN \xF6ffnend */
    .apple-custom-tooltip {
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%) translateY(5px);
      background: rgba(28, 28, 30, 0.98) !important;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: #ffffff !important;
      padding: 12px 14px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      width: 180px;
      z-index: 99999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.2s ease;
      line-height: 1.5;
      text-align: left;
      border: 1px solid rgba(255,255,255,0.08);
      overflow: visible !important;
    }

    /* Einblenden bei Maus-Hover */
    .score-badge:hover .apple-custom-tooltip { opacity: 1; transform: translateX(-50%) translateY(0); }
    [data-theme="dark"] .apple-custom-tooltip { border-color: rgba(255,255,255,0.15); }
  `,document.head.appendChild(f);let h=`
    <div class="apple-custom-tooltip">
      <svg xmlns="http://w3.org" viewBox="0 0 20 10" style="display: block !important; width: 20px; height: 10px; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); pointer-events: none; z-index: 100000;">
        <polygon points="10,0 20,10 0,10" fill="#bd1111" />
      </svg>
      <strong style="display:block; margin-bottom:6px; font-size:10px; text-transform:uppercase; letter-spacing:0.3px; opacity:0.6;">\u25A0 ${e}</strong>
      <div>\u2022 Aktuell: <strong>${r.toFixed(1)} ${o}</strong></div>
      <div>\u2022 Sollwert: <strong>${l.toFixed(1)} ${o}</strong></div>
      <div style="margin-top:4px; padding-top:4px; border-top:1px solid rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15);">
        \u2022 Abw.: <strong>${n>=0?"+":""}${n.toFixed(1)} ${o}</strong>
      </div>
    </div>
  `;return`
    <div class="score-badge ${a}" style="position: relative !important; overflow: visible !important; cursor: pointer;">
      ${h}
      <span class="score-badge-title">${p}${e}</span>
      <span class="score-badge-value">${d} ${r.toFixed(1)}${o}</span>
      <span class="score-badge-status">${s}</span>
    </div>
  `}if(!document.getElementById("profile-core-styles")){let e=document.createElement("style");e.id="profile-core-styles",e.textContent=`
    .profile-main-layout {
      background: var(--card-bg, #ffffff);
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 24px;
      border: none;
      box-shadow: var(--shadow-sm);
      box-sizing: border-box;
      transition: background-color 0.3s, border-color 0.3s;
    }
    .profile-status-side {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    .score-badge {
      padding: 10px 14px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;
      box-shadow: var(--shadow-sm);
      border: 1px solid transparent;
      box-sizing: border-box;
    }
    .badge-success { background-color: rgba(52, 199, 89, 0.12); border-color: rgba(52, 199, 89, 0.2); }
    .badge-success .score-badge-value { color: var(--apple-green, #34c759); }
    .badge-danger { background-color: rgba(255, 59, 48, 0.12); border-color: rgba(255, 59, 48, 0.2); }
    .badge-danger .score-badge-value { color: var(--apple-red, #ff3b30); }
    .badge-info { background-color: rgba(0, 122, 255, 0.12); border-color: rgba(0, 122, 255, 0.2); }
    .badge-info .score-badge-value { color: var(--apple-blue, #007aff); }
    .score-badge-title { font-size: 10px; font-weight: 700; color: var(--text-muted, #8e8e93); text-transform: uppercase; margin-bottom: 4px; }
    .score-badge-value { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
    .score-badge-status { font-size: 11px; font-weight: 700; text-transform: capitalize; color: var(--text-muted, #8e8e93); }
    .ring-container { position: relative; width: 76px; height: 76px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: 12px; }
    .ring-svg { transform: rotate(-90deg); width: 100%; height: 100%; }
    .ring-bg { fill: transparent; stroke: var(--bg-color, #f2f2f7); stroke-width: 6; }
    .ring-fill { fill: transparent; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s; }
    .ring-text { position: absolute; font-size: 11px; font-weight: 700; color: var(--text-main, #000000); text-transform: uppercase; letter-spacing: 0.5px; text-align: center; }
    [data-theme="dark"] .score-badge-title { color: var(--text-main, #ffffff); opacity: 0.7; }
    [data-theme="dark"] .ring-bg { stroke: #2c2c2e; }
  `,document.head.appendChild(e)}function W(e,r,t,o,i=[],l=null){let n=document.querySelector(".profile-info"),d=document.getElementById("userAvatar");if(!n||!e||!t||o.length===0)return;d&&(d.src=e.avatar||`dashboard/avatar/${e.name.toLowerCase()}`);let a=t.date||"--",s="--:--";if(t.timestamp){let D=new Date(t.timestamp);isNaN(D.getTime())||(s=String(D.getHours()).padStart(2,"0")+":"+String(D.getMinutes()).padStart(2,"0"))}let p=t.timestamp?new Date(t.timestamp):new Date,f=Math.ceil(Math.abs(new Date-p)/(1e3*60*60*24))<=4,h=e.scores||{},b=e.target||h.WEIGHT||70,w=t.weight||0,x=w-b,c=0,k="var(--apple-blue)",$="Ziel",B=o&&o.length>0?o[0].weight:w,z=B-b,I=B-w;Math.abs(x)<=.2?(c=100,k="var(--apple-green)",$='<span style="font-size:16px;">\u2713</span>'):x<0?(c=w/b*100,k="var(--apple-blue)",$="Ziel"):z>0&&I>0?(c=I/z*100,k="var(--apple-red)",$="Ziel"):z<0&&I<0?(c=Math.abs(I)/Math.abs(z)*100,k="var(--apple-blue)",$="Ziel"):(c=25,k=x>0?"var(--apple-red)":"var(--apple-blue)",$="Ziel"),c=Math.min(Math.max(Math.round(c),15),100);let y=2*Math.PI*32,S=y-c/100*y,be=i.map(D=>{let ve=D.name.toLowerCase()===e.name.toLowerCase()?"selected":"";return`<option value="${D.name}" ${ve}>${D.name.toUpperCase()}</option>`}).join("");n.innerHTML=`
    <div class="profile-main-layout">

      <!-- Linker Block: Textdaten mit den edlen Apple-Health Line Icons -->
      ${re(be,f,a,s,o.length,r.servertime)}

      <!-- Mittlerer Block: Die vier farbigen Status-Tiles -->
      <div class="profile-status-side">
        ${A("Gewicht",t.weight,b,"kg",!0)}
        ${A("K\xF6rperfett",t.fat,h.FAT||15,"%",!0)}
        ${A("Muskeln",t.muscle,h.MUSCLE||50,"kg",!1)}
        ${A("Protein",t.protein,h.PROTEIN||20,"%",!1)}
      </div>

      <!-- Rechter Block: Der Fortschrittsring als edler Abschluss der Karte -->
      <div class="ring-container" title="Dein aktueller Zielerreichungsgrad">
        <svg class="ring-svg" viewBox="0 0 72 72">
          <circle class="ring-bg" cx="36" cy="36" r="32"></circle>
          <circle class="ring-fill" cx="36" cy="36" r="32"
                  style="stroke-dasharray: ${y}; stroke-dashoffset: ${S}; stroke: ${k};">
          </circle>
        </svg>
        <div class="ring-text">${$}</div>
      </div>

    </div>
  `,l&&document.getElementById("userSelect").addEventListener("change",D=>{l(D.target.value)})}function ae(e,r,t,o){let i=new Date(r+"T00:00:00"),l=new Date(t+"T23:59:59"),n=e.filter(y=>{let S=new Date(y.timestamp);return S>=i&&S<=l}).sort((y,S)=>new Date(y.timestamp)-new Date(S.timestamp)),d=r===t,a,s,p=!1;n.length>0?(a=n[n.length-1],s=n[0]):(a=e[e.length-1],s=a,p=!0);let g=s;if(d||n.length<2||p){let y=e.findIndex(S=>S.id===a.id||new Date(S.timestamp).getTime()===new Date(a.timestamp).getTime());g=y>0?e[y-1]:a}else g=s;let f=d||p?e.slice(-7):n,h="";p?h=`Fokus: Keine heutigen Messdaten <span style="font-weight:normal;color:var(--apple-orange);font-size:13px;">(R\xFCckblick vom ${new Date(a.timestamp).toLocaleDateString("de-DE")})</span>`:d?h=`Fokus: Einzelmessung vom ${new Date(a.timestamp).toLocaleDateString("de-DE")}`:h=`Analyse: ${new Date(r).toLocaleDateString("de-DE")} bis ${new Date(t).toLocaleDateString("de-DE")} <span style="font-weight:normal;color:var(--text-muted);font-size:13px;">(Letzter Messpunkt: ${new Date(a.timestamp).toLocaleDateString("de-DE")})</span>`;let b=o?.scores||{},w=o?.target||b.WEIGHT||70,x=b.MUSCLE||55,c=b.WATER||55,k=v("weight",18,.85,6),$=v("muscle",18,.85,6),B=v("water",18,.85,6),z=v("energy",18,.85,6);return{metrics:[{id:"w_group",title:`${k} Gewicht & Index (${a.bodytype||"Normal"})`,val:a.weight,pVal:g.weight,unit:"kg",color:"var(--apple-red)",history:f.map(y=>y.weight),min:w*.85,max:w*1.15,subMetrics:[{title:"BMI",val:a.bmi,unit:""},{title:"Fettfrei (LBM)",val:a.lbm,unit:"kg"},{title:"Ziel-Abw.",val:a.weight-w,unit:"kg"}]},{id:"f_group",title:`${$} K\xF6rperbau & Muskeln`,val:a.muscle,pVal:g.muscle,unit:"kg",color:"var(--apple-orange)",history:f.map(y=>y.muscle),min:x*.85,max:x*1.15,subMetrics:[{title:"K\xF6rperfett",val:a.fat,unit:"%"},{title:"Viszeralfett",val:a.visceral,unit:"Lvl"},{title:"FFMI Index",val:a.ffmi,unit:""}]},{id:"wa_group",title:`${B} Hydration & Proteine`,val:a.water,pVal:g.water,unit:"%",color:"var(--apple-blue)",history:f.map(y=>y.water),min:c*.85,max:c*1.15,subMetrics:[{title:"Proteinanteil",val:a.protein,unit:"%"},{title:"Knochenmasse",val:a.bone,unit:"kg"}]},{id:"i_group",title:`${z} Stoffwechsel & Alter`,val:a.metabolic_age,pVal:g.metabolic_age,unit:" J.",color:"var(--apple-green)",history:f.map(y=>y.metabolic_age),min:18,max:75,subMetrics:[{title:"Score (POI)",val:a.poi,unit:"Pts"},{title:"Grundumsatz",val:a.bmr,unit:" kcal"},{title:"Bedarf (TDEE)",val:a.tdee,unit:" kcal"}]}],periodHeadline:h}}function oe(){return`
    <div style="grid-column: 1 / -1; width: 100%; margin-bottom: 5px; padding: 5px 0;">
      <div class="skeleton-line" style="width: 250px; height: 20px; border-radius: 4px;"></div>
    </div>
    ${Array(4).fill(0).map(()=>`
      <div class="tile skeleton-tile">
        <div class="tile-header">
          <div class="skeleton-line" style="width: 100px; height: 16px; border-radius: 4px;"></div>
          <div class="skeleton-line" style="width: 60px; height: 20px; border-radius: 6px;"></div>
        </div>
        <div class="tile-body">
          <div class="skeleton-line" style="width: 80px; height: 32px; border-radius: 6px;"></div>
          <div class="skeleton-line" style="width: 100px; height: 38px; border-radius: 4px;"></div>
        </div>
        <div class="skeleton-line" style="width: 100%; height: 4px; border-radius: 2px; margin: 8px 0;"></div>
        <div class="tile-subs-wrapper" style="border: none; padding-top: 5px;">
          <div class="skeleton-line" style="width: 30%; height: 24px; border-radius: 4px;"></div>
          <div class="skeleton-line" style="width: 30%; height: 24px; border-radius: 4px;"></div>
          <div class="skeleton-line" style="width: 30%; height: 24px; border-radius: 4px;"></div>
        </div>
      </div>
    `).join("")}
  `}function ie(e){let r=e.val-e.pVal,t="trend-stable",o="\u2192",i="Stabil",l=["w_group","i_group"].includes(e.id);r>.02?(t=l?"trend-down":"trend-up",o="\u25B2",i=`+${r.toFixed(1)}`):r<-.02&&(t=l?"trend-up":"trend-down",o="\u25BC",i=`${r.toFixed(1)}`);let n=e.unit==="%"?Math.min(Math.max(e.val,5),100):Math.min(Math.max((e.val-e.min)/(e.max-e.min)*100,5),100),d=e.unit==="%"?55:50,a=["w_group","f_group","wa_group"].includes(e.id),s=e.subMetrics?.map(p=>{let g=p.val?p.val.toFixed(1):"--";return(p.title.includes("BMR")||p.title.includes("Bedarf")||p.title.includes("Umsatz")||p.title.includes("TDEE"))&&(g=Math.round(p.val)),p.title.includes("Ziel-Abw.")&&p.val>0&&(g=`+${p.val.toFixed(1)}`),`
      <div class="tile-sub-item">
        <span class="sub-title">${p.title}</span>
        <span class="sub-value">${g}<span class="sub-unit">${p.unit}</span></span>
      </div>
    `}).join("")||"";return`
    <div class="tile">
      <div class="tile-header">
        <div class="tile-title">${e.title}</div>
        <div class="tile-trend ${t}"><span>${o}</span> ${i}</div>
      </div>
      <div class="tile-body">
        <div class="tile-value">${e.val?e.val.toFixed(1):"--"}<span>${e.unit}</span></div>
        <div class="sparkline-container"><canvas id="spark_${e.id}"></canvas></div>
      </div>

      <!-- Fortschritts-Zone mit integrierter Ziel-Markierung und Skala-Indikatoren -->
      <div class="progress-zone">
        <div class="progress-container">
          <div class="progress-bar" style="width: ${n}%; background-color: ${e.color};"></div>
        </div>
        ${a?`
          <div class="progress-scale-labels">
            <span class="scale-min">-</span>
            <div class="progress-target-line" style="left: ${d}%;">
              <span class="target-label">Ziel</span>
            </div>
            <span class="scale-max">+</span>
          </div>
        `:""}
      </div>
      <div class="tile-subs-wrapper">${s}</div>
    </div>
  `}function N(){if(document.getElementById("tile-styles"))return;let e=document.createElement("style");e.id="tile-styles",e.textContent=`
    #kpiGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; padding: 16px 0; width: 100%; }
    .tile { background: var(--card-bg,#fff); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 24px rgba(0,0,0,.04); border: 1px solid var(--border-color,rgba(0,0,0,.04)); transition: transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s ease; min-height: 185px; position: relative; overflow: hidden; }
    .tile:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,.08); }
    .tile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .tile-title {font-size: 13px; font-weight: 600; color: var(--text-muted); letter-spacing: -.2px; display: inline-flex; align-items: center;}
    .tile-trend { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 20px; white-space: nowrap; display: flex; align-items: center; gap: 4px; box-shadow: inset 0 -1px 0 rgba(0,0,0,.05); }
    .tile-trend.trend-up { color: #34c759; background: rgba(52,199,89,.12); }
    .tile-trend.trend-down { color: #ff3b30; background: rgba(255,59,48,.12); }
    .tile-trend.trend-stable { color: #8e8e93; background: rgba(142,142,147,.1); }
    .tile-body { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; gap: 12px; }
    .tile-value { font-size: 28px; font-weight: 700; color: var(--text-main,#1a1d27); letter-spacing: -.7px; line-height: 1; }
    .tile-value span { font-size: 13px; font-weight: 600; color: var(--text-muted,#8e8e93); margin-left: 2px; }
    .sparkline-container { flex: 1; height: 40px; position: relative; max-width: 110px; }

    /* Zielerreichungs-Zone */
    .progress-zone { position: relative; width: 100%; padding: 4px 0 10px 0; }
    .progress-container { width: 100%; height: 5px; background: var(--bg-progress-track,#f2f2f7); border-radius: 3px; overflow: hidden; position: relative; }
    .progress-bar { height: 100%; border-radius: 3px; transition: width .5s ease; position: relative; }
    .progress-bar::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 10px; background: #fff; opacity: .3; filter: blur(2px); }

    /* Minimalistischer Ziel-Strich (left wird jetzt dynamisch per JS gesetzt) */
    .progress-target-line { position: absolute; top: 0; bottom: 4px; width: 1.5px; background: var(--text-muted, #8e8e93); opacity: 0.4; pointer-events: none; }
    .target-label { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); font-size: 8px; font-weight: 700; color: var(--text-muted, #8e8e93); text-transform: uppercase; letter-spacing: 0.3px; }

    .tile-subs-wrapper { margin-top: 6px; padding-top: 12px; border-top: 1px solid var(--border-color,rgba(0,0,0,.04)); display: flex; gap: 6px; justify-content: space-between; }
    .tile-sub-item { display: flex; flex-direction: column; flex: 1; background: var(--bg-sub-box,#f8f9fa); padding: 6px 6px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.01); text-align: center; }
    .sub-title { font-size: 9px; color: var(--text-muted,#8e8e93); font-weight: 600; margin-bottom: 2px; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.2px; }
    .sub-value { font-size: 13px; font-weight: 700; color: var(--text-main,#1a1d27); letter-spacing: -.2px; }
    .sub-unit { font-size: 10px; font-weight: 500; color: var(--text-muted,#8e8e93); margin-left: 1px; }
    .skeleton-tile { pointer-events: none; box-shadow: none!important; border-color: var(--border-color,rgba(0,0,0,.04))!important; }
    .skeleton-line { background: linear-gradient(90deg,var(--bg-progress-track,#f2f2f7) 25%,var(--bg-sub-box,#e5e5ea) 50%,var(--bg-progress-track,#f2f2f7) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite linear; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    [data-theme=dark] .tile { --card-bg: #1a1d27; --border-color: rgba(255,255,255,.05); --text-main: #ffffff; --bg-progress-track: #2c2c2e; --bg-sub-box: #000000; }

    /* Zielerreichungs-Zone */
    .progress-zone { position: relative; width: 100%; padding: 4px 0 14px 0; }
    .progress-container { width: 100%; height: 5px; background: var(--bg-progress-track,#f2f2f7); border-radius: 3px; overflow: hidden; position: relative; }
    .progress-bar { height: 100%; border-radius: 3px; transition: width .5s ease; position: relative; }
    .progress-bar::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 10px; background: #fff; opacity: .3; filter: blur(2px); }

    /* Achsen-Beschriftungen (Sichtbarkeit erh\xF6ht, auf gleicher Linie mit 'Ziel') */
    .progress-scale-labels { position: relative; display: flex; justify-content: space-between; width: 100%; height: 12px; margin-top: 6px; pointer-events: none; align-items: center; }
    .scale-min, .scale-max { font-size: 13px; font-weight: 700; color: var(--text-muted, #8e8e93); opacity: 0.75; line-height: 1; transform: translateY(-1px); }

    /* Minimalistischer Ziel-Strich (Reicht jetzt bis nach unten) */
    .progress-target-line { position: absolute; top: -11px; bottom: -2px; width: 1.5px; background: var(--text-muted, #8e8e93); opacity: 0.4; }
    .target-label { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); font-size: 8px; font-weight: 700; color: var(--text-muted, #8e8e93); text-transform: uppercase; letter-spacing: 0.3px; }


  `,document.head.appendChild(e)}function ne(e){return(document.documentElement.getAttribute("data-theme")==="dark"?{"var(--apple-red)":"#ff453a","var(--apple-orange)":"#ff9f0a","var(--apple-green)":"#30d158","var(--apple-purple)":"#bf5af2","var(--apple-blue)":"#0a84ff","#8e8e93":"#aeaeac"}:{"var(--apple-red)":"#ff3b30","var(--apple-orange)":"#ff9500","var(--apple-green)":"#34c759","var(--apple-purple)":"#af52de","var(--apple-blue)":"#007aff","#8e8e93":"#8e8e93"})[e]||e}function se(e,r,t){let o=document.documentElement.getAttribute("data-theme")==="dark",i=e.createLinearGradient(0,0,0,r.height||40),l="10, 132, 255";return t.startsWith("#")&&t.length===7&&(l=`${parseInt(t.slice(1,3),16)}, ${parseInt(t.slice(3,5),16)}, ${parseInt(t.slice(5,7),16)}`),i.addColorStop(0,o?`rgba(${l}, 0.28)`:`rgba(${l}, 0.18)`),i.addColorStop(1,`rgba(${l}, 0.0)`),i}var V={},C={timeline:null,start:"",end:"",user:null,initialized:!1};function le(){let e=document.getElementById("kpiGrid");N(),e&&(e.innerHTML=oe())}function P(e,r,t,o){let i=document.getElementById("kpiGrid");if(!i||!e?.length)return;C.timeline=e,C.start=r,C.end=t,C.user=o,N();let{metrics:l,periodHeadline:n}=ae(e,r,t,o);if(i.innerHTML=`<div style="grid-column: 1 / -1; width: 100%; margin-bottom: 5px; padding: 5px 0;"><h2 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin: 0; letter-spacing: -0.3px;">${n}</h2></div>${l.map(ie).join("")}`,l.forEach(d=>{let a=document.getElementById(`spark_${d.id}`),s=a?.getContext("2d");if(!s)return;V[d.id]&&V[d.id].destroy();let p=ne(d.color);V[d.id]=new Chart(s,{type:"line",data:{labels:d.history.map((g,f)=>f),datasets:[{data:d.history,borderColor:p,borderWidth:2.5,pointRadius:d.history.length===1?4:0,pointBackgroundColor:p,backgroundColor:se(s,a,p),fill:!0,tension:.35}]},options:{responsive:!0,maintainAspectRatio:!1,animation:{duration:150},plugins:{legend:!1,tooltip:!1},scales:{x:{display:!1},y:{display:!1,offset:!0}}}})}),!C.initialized){C.initialized=!0;let d;window.addEventListener("resize",()=>{clearTimeout(d),d=setTimeout(()=>P(C.timeline,C.start,C.end,C.user),150)}),new MutationObserver(()=>P(C.timeline,C.start,C.end,C.user)).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}}var j={Heute:"today",Gestern:"gestern","Diese Woche":"woche","Letzte 7 Tage":"7tage","Letzte 30 Tage":"30tage","Dieser Monat":"monat"},de="em-period-label";function ce(e){let r=new Date,t=new Date,o=new Date;switch(t.setHours(0,0,0,0),o.setHours(23,59,59,999),e){case"today":break;case"gestern":t.setDate(r.getDate()-1),o.setDate(r.getDate()-1);break;case"woche":{let i=r.getDay();t.setDate(r.getDate()-i+(i===0?-6:1));break}case"7tage":t.setDate(r.getDate()-6);break;case"30tage":t.setDate(r.getDate()-29);break;case"monat":t.setDate(1);break}return{from:G(t),to:G(o)}}function G(e){return e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0")}function pe(e,r){let t=localStorage.getItem(de)||"Heute";!j[t]&&!t.startsWith("Jahr ")&&t!=="Individuell"&&(t="Heute");let o=new Date().getFullYear(),i="";for(let c=o;c>=2018;c--)i+=`<option value="${c}">Jahr ${c}</option>`;if(!document.getElementById("ds-styles")){let c=document.createElement("style");c.id="ds-styles",c.textContent=`
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
                right: 0;
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
        `,document.head.appendChild(c)}let l=document.createElement("div");l.className="ds-wrap";let n=v("calendar",16,.7,5);l.innerHTML=`
        <span class="ds-label" style="display: inline-flex; align-items: center;">${n}Zeitraum:</span>
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
                ${i}
            </select>
            <div class="ds-section" style="cursor:pointer; margin-top:5px;" id="dsCustomToggle">Individuell\u2026</div>
            <div class="ds-custom" id="dsCustom">
                <input type="date" id="dsFrom">
                <input type="date" id="dsTo">
                <button id="dsApply">Anwenden</button>
            </div>
        </div>
    `,e.appendChild(l);let d=l.querySelector("#dsBtn"),a=l.querySelector("#dsDrop"),s=l.querySelector("#dsYear"),p=l.querySelector("#dsCustomToggle"),g=l.querySelector("#dsCustom"),f=l.querySelector("#dsFrom"),h=l.querySelector("#dsTo"),b=l.querySelector("#dsApply");d.addEventListener("click",c=>{c.stopPropagation(),a.classList.toggle("hidden")}),document.addEventListener("click",()=>a.classList.add("hidden")),a.addEventListener("click",c=>c.stopPropagation()),p.addEventListener("click",()=>g.classList.toggle("show"));function w(c,k,$){t=c,localStorage.setItem(de,c),d.textContent=c,a.classList.add("hidden"),a.querySelectorAll(".ds-item").forEach(B=>{B.classList.toggle("active",B.textContent.trim()===c)}),r(k,$)}a.querySelectorAll(".ds-item").forEach(c=>{c.addEventListener("click",()=>{let k=c.getAttribute("data-key"),$=ce(k);w(c.textContent.trim(),$.from,$.to)})}),s.addEventListener("change",()=>{if(!s.value)return;let c=s.value;w(`Jahr ${c}`,`${c}-01-01`,`${c}-12-31`)}),b.addEventListener("click",()=>{!f.value||!h.value||w("Individuell",f.value,h.value)});function x(){if(j[t]){let c=ce(j[t]);r(c.from,c.to)}else if(t.startsWith("Jahr ")){let c=t.replace("Jahr ","");r(`${c}-01-01`,`${c}-12-31`)}else r(f.value||G(new Date),h.value||G(new Date))}return x}var ge=P,u={lastTimeline:[],currentFrom:"",currentTo:"",usersCache:[],triggerSelectorRefresh:null,pollingInterval:null,lastKnownCount:0,currentFetchController:null},we="3.2.0",T=e=>document.querySelector(e),me="health-active-user",ue="health-theme";document.addEventListener("DOMContentLoaded",()=>{Me(),$e(),ke(),setTimeout(()=>{Z()},10);let e=document.getElementById("themeToggleFooter");e&&e.addEventListener("click",Ce),xe(5)});window.addEventListener("resize",()=>{if(u.lastTimeline.length>0){let e=T("#userSelect")?.value,r=u.usersCache.find(t=>t.name.toLowerCase()===e?.toLowerCase());R(u.lastTimeline,r,u.currentFrom,u.currentTo)}});function ke(){let e=T(".header");if(!e)return;let r=document.createElement("div");r.className="header-bg-wrapper",r.innerHTML=v("bgGym",85,.45,0,"#ff3b30"),e.appendChild(r)}function Me(){let e=localStorage.getItem(ue)||"light";document.documentElement.setAttribute("data-theme",e),fe(e)}function Ce(){let e=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e),localStorage.setItem(ue,e),fe(e),u.lastTimeline.length>0&&requestAnimationFrame(()=>{setTimeout(()=>{K();let r=T("#userSelect")?.value,t=u.usersCache.find(o=>o.name.toLowerCase()===r?.toLowerCase());ge(u.lastTimeline,u.currentFrom,u.currentTo,t),R(u.lastTimeline,t,u.currentFrom,u.currentTo)},0)})}function fe(e){let r=document.getElementById("themeToggleFooter");r&&(e==="dark"?r.innerHTML="\u2600\uFE0F Helles Design":r.innerHTML="\u{1F319} Dunkles Design")}function he(e,r){let t=[...e.previous||[],...e.current||[]].map(l=>({...l,timestamp:new Date(l.timestamp)})).sort((l,n)=>l.timestamp-n.timestamp);u.lastTimeline=t,e.all_users&&(u.usersCache=e.all_users);let o=u.usersCache.find(l=>l.name.toLowerCase()===r.toLowerCase());u.lastKnownCount=o?o.count:e.count||0;let i=typeof W=="function"?W:window.renderProfile||W.renderProfile;typeof i=="function"?i(e.user,e.system,t[t.length-1],t,u.usersCache,l=>{localStorage.setItem(me,l),u.triggerSelectorRefresh&&u.triggerSelectorRefresh(),xe(5)}):console.error("Fehler: renderProfile-Modul konnte nicht als Funktion geladen werden."),ge(t,u.currentFrom,u.currentTo,e.user),Z(),K(),R(t,e.user,u.currentFrom,u.currentTo)}function xe(e=5){u.pollingInterval&&clearInterval(u.pollingInterval),u.pollingInterval=setInterval(async()=>{let r=T("#userSelect")?.value;if(r)try{let t=`dashboard/api/datav2?user=${r.toLowerCase()}&from=${u.currentFrom}&to=${u.currentTo}`,i=await(await fetch(t)).json();if(i&&i.all_users){let l=i.all_users.find(n=>n.name.toLowerCase()===r.toLowerCase());l&&typeof l.count<"u"&&l.count!==u.lastKnownCount&&(console.log(`\u{1F514} Live-Messung im Hintergrund verarbeitet! (${l.count})`),F(`Neue Waagen-Messung f\xFCr ${r.toUpperCase()} empfangen!`,"success"),he(i,r))}}catch(t){console.error("Polling Fehler:",t)}},e*60*1e3)}async function $e(){try{let e=localStorage.getItem(me)||"peter";u.triggerSelectorRefresh=pe(T("#dateSelectorContainer"),(r,t)=>{u.currentFrom=r,u.currentTo=t,Se(T("#userSelect")?.value||e)}),u.triggerSelectorRefresh&&u.triggerSelectorRefresh()}catch(e){console.error("Dropdown Fehler:",e)}}async function Se(e,r=!1){if(e){if(u.currentFetchController&&u.currentFetchController.abort(),u.currentFetchController=new AbortController,!r){let t=document.getElementById("kpiGrid");(!t||t.children.length<=1)&&le(),T("#dashboardContent").style.display="block",T("#loadBox")&&(T("#loadBox").style.display="none")}try{let t=`dashboard/api/datav2?user=${e.toLowerCase()}&from=${u.currentFrom}&to=${u.currentTo}`,i=await(await fetch(t,{signal:u.currentFetchController.signal})).json();i.current&&i.current.length>0||i.previous&&i.previous.length>0?(he(i,e),r||(F(`Daten f\xFCr ${e.toUpperCase()} geladen.`,"success"),setTimeout(()=>{let l=document.createElement("style");l.id="temp-msg-hide",l.textContent=`
            .message-box, .alert, .success, [class*="message"], #messageBoxContainer div {
              opacity: 0 !important;
              visibility: hidden !important;
              transform: translateY(-10px) !important;
              transition: opacity 0.1s ease, visibility 0.1s ease !important;
              display: none !important;
            }
          `,document.head.appendChild(l),setTimeout(()=>{let n=document.getElementById("temp-msg-hide");n&&n.remove()},2800)},500))):r||F("Keine Messwerte im gew\xE4hlten Zeitraum vorhanden.","info")}catch(t){if(t.name==="AbortError")return;console.error("Dashboard Ladefehler:",t),r||F("Fehler beim Laden der Benutzerdaten.","error")}}}console.info(`%c \u{1F31F} BodyScale Health Dashboard %c ESM v${we} `,"color:#fff;background:#e94560;padding:4px 8px;border-radius:4px;","color:#fff;background:#1a1a2e;padding:4px 8px;border-radius:4px;");})();
//# sourceMappingURL=app.bundle.js.map
