import{p as j}from"./pako.esm-96f6146f.js";function a(s){if(s==null)return"";const t=document.createElement("div");return t.textContent=String(s),t.innerHTML}function L(s){const t=[],i=(o,d)=>{d!=null&&d!==""&&t.push(`${o}:${String(d).replace(/\n/g," ")}`)};i("title",s.title),i("type",s.type),i("episodes",s.episodes),i("status",s.status),s.animeSeason&&(i("year",s.animeSeason.year),i("season",s.animeSeason.season));const r=s.score?.arithmeticMean??s.payload?.score_avg??s.score;return i("score",r),s.picture&&i("picture",s.picture),s.synonyms?.length&&i("synonyms",s.synonyms.join("|")),s.tags?.length&&i("tags",s.tags.slice(0,20).join("|")),s.sources?.length&&i("sources",s.sources.join("|")),t.join(`
`)}function T(s){const t=L(s),i=new TextEncoder().encode(t),r=j.gzip(i,{level:9}),o=new Blob([r],{type:"application/gzip"}),d=(s.title||"anime").replace(/[^a-zA-Z0-9-_]/g,"-").slice(0,60)+".txt.gz",c=document.createElement("a");c.href=URL.createObjectURL(o),c.download=d,c.click(),URL.revokeObjectURL(c.href)}function U(s){return s?s.includes("myanimelist")?"tv":s.includes("anilist")?"link":s.includes("anidb")?"database":s.includes("kitsu")?"film":s.includes("anime-planet")?"globe":s.includes("animenewsnetwork")||s.includes("ann")?"newspaper":"external-link-alt":"external-link-alt"}function E(s){return s?s.includes("myanimelist")?"MyAnimeList":s.includes("anilist")?"AniList":s.includes("anidb")?"AniDB":s.includes("kitsu")?"Kitsu":s.includes("anime-planet")?"Anime Planet":"View":"View"}function R(s){const t=document.getElementById("anime-root");if(!t)return;const i=s.payload||{},r=i.score_avg??s.score?.arithmeticMean??0,o=i.duration_mins??0,d=i.languages||["Subtitled"],c=s.title||"Unknown",u=s.type||"UNKNOWN",p=s.episodes??"Unknown",S=s.status||"UNKNOWN",v=s.animeSeason||{},f=v.year||"N/A",g=(v.season||"N/A").toString(),w=g.charAt(0).toUpperCase()+g.slice(1).toLowerCase(),h=s.picture||"",x=(s.studios||[]).map(n=>String(n)).join(", ")||"Unknown",A=(s.producers||[]).map(n=>String(n)).join(", ")||"Unknown",m=(s.tags||[]).slice(0,15),y=(s.synonyms||[]).slice(0,8),b=(s.sources||[]).slice(0,6),N=h?`<img src="${a(h)}" alt="">`:'<div style="background:#ddd;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;"><i class="fas fa-film"></i></div>';let l=`
    <div class="ad-info-card ad-score-card">
      <div class="ad-score-label">Community Rating</div>
      <div class="ad-score-value">${Number(r).toFixed(1)}</div>
      <div class="ad-score-label">/ 10.0</div>
    </div>
    <div class="ad-info-card"><div class="ad-info-card-title">Type</div><div class="ad-info-card-value">${a(u)}</div></div>
    <div class="ad-info-card"><div class="ad-info-card-title">Episodes</div><div class="ad-info-card-value">${a(String(p))}</div></div>
    <div class="ad-info-card"><div class="ad-info-card-title">Status</div><div class="ad-info-card-value">${a(S)}</div></div>
  `;f!=="N/A"&&(l+=`<div class="ad-info-card"><div class="ad-info-card-title">Year</div><div class="ad-info-card-value">${a(String(f))}</div></div>`),v.season&&(l+=`<div class="ad-info-card"><div class="ad-info-card-title">Season</div><div class="ad-info-card-value">${a(w)}</div></div>`),o&&(l+=`<div class="ad-info-card"><div class="ad-info-card-title">Duration</div><div class="ad-info-card-value">${o} min/ep</div></div>`),l+=`<div class="ad-info-card"><div class="ad-info-card-title">Language</div><div class="ad-info-card-value">${a(d.join(", "))}</div></div>`,l+=`
    <div class="ad-action-buttons">
      <button type="button" class="ad-btn" id="ad-download-data"><i class="fas fa-file-archive"></i> Download data (.txt.gz)</button>
      <a href="../index.html" class="ad-btn ad-btn-secondary"><i class="fas fa-arrow-left"></i> Back to Database</a>
    </div>
  `;let e="";s.studios?.length&&(e+=`<div class="ad-section"><div class="ad-section-title"><i class="fas fa-building"></i> Studios</div><p>${a(x)}</p></div>`),s.producers?.length&&(e+=`<div class="ad-section"><div class="ad-section-title"><i class="fas fa-handshake"></i> Producers</div><p>${a(A)}</p></div>`),m.length&&(e+=`<div class="ad-section"><div class="ad-section-title"><i class="fas fa-tags"></i> Genres & Tags</div><div class="ad-tags">${m.map(n=>`<span class="ad-tag">${a(n)}</span>`).join("")}</div></div>`),y.length&&(e+=`<div class="ad-section"><div class="ad-section-title"><i class="fas fa-globe"></i> Other Names</div><p>${a(y.join(", "))}</p></div>`),b.length&&(e+='<div class="ad-section"><div class="ad-section-title"><i class="fas fa-stream"></i> Watch Online</div><div class="ad-links-grid">',b.forEach(n=>{e+=`<a href="${a(n)}" target="_blank" rel="noopener" class="ad-link-card"><i class="fas fa-${U(n)}"></i><div><h4>${a(E(n))}</h4><p>Watch now</p></div></a>`}),e+="</div></div>"),e+=`
    <div class="ad-footer-section">
      <h3>Support AnimeRepo</h3>
      <p style="margin:10px 0 20px 0;">Free anime database.</p>
      <a href="https://github.com/mTulsiram/AnimeRepo" target="_blank" rel="noopener">GitHub</a>
      <a href="https://github.com/mTulsiram/AnimeRepo/issues" target="_blank" rel="noopener">Report Bug</a>
    </div>
  `,t.innerHTML=`
    <div class="ad-navbar">
      <div class="ad-nav-back"><a href="../index.html"><i class="fas fa-arrow-left"></i> Back to Database</a></div>
    </div>
    <div class="ad-container">
      <div class="ad-hero">
        <div class="ad-hero-content">
          <div class="ad-hero-poster">${N}</div>
          <div>
            <div class="ad-hero-title">${a(c)}</div>
            <div class="ad-hero-subtitle">${a(u)} • ${p} episodes • ${a(String(f))}</div>
          </div>
        </div>
      </div>
      <div class="ad-main-grid">
        <div class="ad-sidebar">${l}</div>
        <div class="ad-content">${e}</div>
      </div>
    </div>
  `;const $=t.querySelector("#ad-download-data");$&&$.addEventListener("click",()=>T(s))}const k=document.getElementById("anime-data");if(k)try{const s=JSON.parse(k.textContent||"{}");R(s)}catch{document.body.innerHTML='<div style="padding:20px;color:red;">Invalid anime data.</div>'}
