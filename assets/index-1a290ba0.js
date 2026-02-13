import{p as D}from"./pako.esm-96f6146f.js";function B(e){if(!e||typeof e!="string")return"Unknown.html";let t=e.replace(/\//g,"_").replace(/\\/g,"_").replace(/\?/g,"").replace(/\*/g,"").replace(/:/g,"_").replace(/</g,"").replace(/>/g,"").replace(/\|/g,"_").replace(/["\u201C\u201D\u201F]/g,"").replace(/['\u2018\u2019\u201A\u2032]/g,"").replace(/`/g,"").replace(/\u00B4/g,"").trim();return t=t.slice(0,200),t?t+".html":"Unknown.html"}function H(e){return"anime/"+encodeURIComponent(B(e))}let A={english_dubbed:[],hindi_dubbed:[]};function R(e){const t=(e||"").trim(),s=(A.english_dubbed||[]).indexOf(t)>=0,r=(A.hindi_dubbed||[]).indexOf(t)>=0;return s&&r?["English Dubbed","Hindi Dubbed"]:s?["English Dubbed"]:r?["Hindi Dubbed"]:["Subtitled"]}const N="anime-offline-database-minified.json",I="language_dubs.json";async function P(){const[e,t]=await Promise.all([fetch(N),fetch(I).catch(()=>null)]);if(!e.ok)throw new Error("Failed to load anime data");const s=await e.json(),r=Array.isArray(s)?s:s.data||s.anime||[];return t&&t.ok&&(A=await t.json()),r}function p(e){if(e==null)return"";const t=document.createElement("div");return t.textContent=String(e),t.innerHTML}const O=["1990","2000","2010"];function V(e,t){const{type:s,genre:r,yearVal:a,status:o,language:i,searchQuery:l}=t;return e.filter(c=>{if(l&&l.trim()){const d=l.trim().toLowerCase(),m=(c.title||"").toLowerCase().includes(d),y=(c.synonyms||[]).some(w=>String(w).toLowerCase().includes(d));if(!m&&!y)return!1}if(s&&(c.type||"").toUpperCase()!==s.toUpperCase())return!1;const u=(c.tags||[]).map(d=>String(d).toLowerCase()),g=r?r.trim().toLowerCase():"";if(!(!g||u.some(d=>d.includes(g))))return!1;if(a&&a.trim()){const d=c.animeSeason&&c.animeSeason.year!=null?Number(c.animeSeason.year):null;if(d==null)return!1;const m=a.trim(),y=parseInt(m,10);if(O.includes(m)){if(d<y||d>=y+10)return!1}else if(d!==y)return!1}if(o&&(c.status||"").toUpperCase()!==o.toUpperCase())return!1;const v=R(c.title);return!(i==="English"&&!v.some(d=>d.toLowerCase().includes("english"))||i==="Hindi"&&!v.some(d=>d.toLowerCase().includes("hindi"))||i==="Subtitled"&&!v.some(d=>d.toLowerCase().includes("subtitled")))})}function x(e,t){const s=document.createElement("a");s.href=URL.createObjectURL(e),s.download=t,s.click(),URL.revokeObjectURL(s.href)}function z(e){const t=[],s=(a,o)=>{o!=null&&o!==""&&t.push(`${a}:${String(o).replace(/\n/g," ")}`)};s("title",e.title),s("type",e.type),s("episodes",e.episodes),s("status",e.status),e.animeSeason&&(s("year",e.animeSeason.year),s("season",e.animeSeason.season));const r=e.score&&typeof e.score=="object"?e.score.arithmeticMean:e.score;return s("score",r),e.picture&&s("picture",e.picture),e.synonyms&&e.synonyms.length&&s("synonyms",e.synonyms.join("|")),e.tags&&e.tags.length&&s("tags",e.tags.slice(0,20).join("|")),e.sources&&e.sources.length&&s("sources",e.sources.join("|")),t.join(`
`)}function G(e,t=!0){const s=z(e),a=`anime-${(e.title||"anime").replace(/[^a-zA-Z0-9-_]/g,"-").slice(0,60)}.txt`,i=new TextEncoder().encode(s);if(t){const l=D.gzip(i,{level:9}),c=new Blob([l],{type:"application/gzip"});x(c,a+".gz")}else{const l=new Blob([i],{type:"text/plain"});x(l,a)}}let f=null;function W(e){return e?e.includes("myanimelist")?"MyAnimeList":e.includes("anilist")?"AniList":e.includes("anidb")?"AniDB":e.includes("kitsu")?"Kitsu":e.includes("anime-planet")?"Anime Planet":"Details":"Link"}function K(){const e=document.getElementById("modal-root");if(!e)return null;const t=document.createElement("div");return t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-labelledby","modal-title"),t.innerHTML=`
    <div class="modal-dialog">
      <div class="modal-header">
        <h2 class="modal-title" id="modal-title">Anime</h2>
        <button type="button" class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" id="modal-download-data">
          <i class="fas fa-file-archive"></i> Download data
        </button>
        <a href="#" class="btn btn-secondary" id="modal-full-page" target="_blank" rel="noopener">
          <i class="fas fa-external-link-alt"></i> Full page
        </a>
      </div>
    </div>
  `,e.appendChild(t),f=t,t.querySelector(".modal-close").addEventListener("click",C),t.addEventListener("click",s=>{s.target===t&&C()}),document.addEventListener("keydown",T),t}function T(e){e.key==="Escape"&&f&&C()}function C(){f&&(document.removeEventListener("keydown",T),f.remove(),f=null)}function Q(e){const t=e.score&&typeof e.score=="object"?e.score.arithmeticMean:e.score,s=e.animeSeason||{},r=e.episodes??"?",a=e.type||"—",o=s.year||"—",i=e.status||"—",l=(e.studios||[]).slice(0,3).join(", ")||"—",c=(e.tags||[]).slice(0,12).join(", ")||"—",u=(e.synonyms||[]).slice(0,4).join(", ")||"—",g=(e.sources||[]).slice(0,6),k=encodeURIComponent((e.title||"").trim()),v=`https://www.crunchyroll.com/search?q=${k}`,d=`https://www.justwatch.com/us/search?q=${k}`,m=f.querySelector(".modal-body");m.innerHTML="";const y=e.picture?`<img class="modal-poster" src="${p(e.picture)}" alt="" loading="lazy" onerror="this.style.display='none'">`:"";let w="";g.length>0&&(w=`
      <div class="modal-section">
        <h3 class="modal-section-title"><i class="fas fa-play-circle"></i> Where to watch & details</h3>
        <p class="modal-section-desc">Open database links for info and streaming availability.</p>
        <div class="modal-watch-links">
          ${g.map(F=>`<a href="${p(F)}" target="_blank" rel="noopener" class="modal-watch-btn">${p(W(F))}</a>`).join("")}
        </div>
        <div class="modal-stream-search">
          <a href="${p(v)}" target="_blank" rel="noopener" class="modal-stream-link"><i class="fas fa-tv"></i> Search Crunchyroll</a>
          <a href="${p(d)}" target="_blank" rel="noopener" class="modal-stream-link"><i class="fas fa-search"></i> Find on JustWatch</a>
        </div>
      </div>
    `),m.innerHTML=`
    ${y}
    <p class="modal-meta">${p(a)} · ${r} eps · ${o}${i!=="—"?" · "+p(i):""}</p>
    <dl class="modal-dl">
      <dt>Score</dt>
      <dd>${t!=null?Number(t).toFixed(1):"—"}/10</dd>
      <dt>Studios</dt>
      <dd>${p(l)}</dd>
      <dt>Tags</dt>
      <dd>${p(c)}</dd>
      <dt>Other names</dt>
      <dd>${p(u)}</dd>
    </dl>
    ${w}
  `;const _=f.querySelector("#modal-title");_.textContent=e.title||"Anime";const U=f.querySelector("#modal-full-page");U.href=H(e.title);const q=f.querySelector("#modal-download-data");q.onclick=()=>{G(e,!0)}}function J(e){f||K(),f&&(Q(e),f.style.display="flex",f.querySelector(".modal-close").focus())}let h=[],b=[],L=1;const $=24,n=e=>document.getElementById(e);function M(e){const t=n("loading");t&&(t.style.display=e?"block":"none")}function E(){const e=n("animeGrid"),t=(L-1)*$,s=t+$,r=b.slice(t,s);if(r.length===0){e.innerHTML="";const i=n("emptyState");i&&(i.style.display="block");const l=n("resultCount");l&&(l.textContent="0"),j(0);return}const a=n("emptyState");a&&(a.style.display="none"),e.innerHTML=r.map(i=>`
    <article class="anime-card" role="listitem" data-anime-index="${h.indexOf(i)}">
      <div class="anime-poster">
        ${i.picture?`<img src="${p(i.picture)}" alt="" loading="lazy" onerror="this.style.display='none';var n=this.nextElementSibling;if(n)n.style.display='flex';"><i class="fas fa-film poster-fallback" aria-hidden="true"></i>`:'<i class="fas fa-film" aria-hidden="true"></i>'}
      </div>
      <div class="anime-info">
        <div class="anime-title">${p(i.title)}</div>
        <div class="anime-meta">
          <span>${i.type||"—"}</span>
          <span>${i.episodes??"?"} eps</span>
        </div>
        <div class="anime-rating">
          <i class="fas fa-star"></i>
          ${i.score?.arithmeticMean!=null?Number(i.score.arithmeticMean).toFixed(1):"N/A"}
        </div>
      </div>
    </article>
  `).join("");const o=n("resultCount");o&&(o.textContent=b.length),j(b.length),e.querySelectorAll(".anime-card").forEach((i,l)=>{const c=r[l];i.addEventListener("click",u=>{u.preventDefault(),J(c)})})}function j(e){const t=n("pagination");t.innerHTML="";const s=Math.ceil(e/$);if(s<=1)return;const r=10;for(let a=1;a<=Math.min(s,r);a++){const o=document.createElement("button");o.type="button",o.className=`page-btn ${a===L?"active":""}`,o.textContent=a,o.addEventListener("click",()=>{L=a,E(),window.scrollTo({top:0,behavior:"smooth"})}),t.appendChild(o)}}function S(){L=1;const e=n("searchInput")&&n("searchInput").value||"";b=V(h,{type:n("typeFilter")&&n("typeFilter").value||"",genre:n("genreFilter")&&n("genreFilter").value||"",yearVal:n("yearFilter")&&n("yearFilter").value||"",status:n("statusFilter")&&n("statusFilter").value||"",language:n("languageFilter")&&n("languageFilter").value||"",searchQuery:e}),E()}function Y(){const e=["typeFilter","genreFilter","yearFilter","statusFilter","languageFilter"];e.forEach(u=>{const g=n(u);g&&g.addEventListener("change",S)});const t=n("searchBtn"),s=n("searchInput");t&&t.addEventListener("click",S),s&&s.addEventListener("keypress",u=>{u.key==="Enter"&&S()});const r=n("clearFilters");r&&r.addEventListener("click",()=>{e.forEach(u=>{const g=n(u);g&&(g.value="")}),s&&(s.value=""),b=h,L=1,E()});const a=n("gridView"),o=n("listView"),i=n("animeGrid");a&&a.addEventListener("click",()=>{a.classList.add("active"),o?.classList.remove("active"),i?.classList.remove("list-view"),a?.setAttribute("aria-pressed","true"),o?.setAttribute("aria-pressed","false")}),o&&o.addEventListener("click",()=>{o.classList.add("active"),a?.classList.remove("active"),i?.classList.add("list-view"),o?.setAttribute("aria-pressed","true"),a?.setAttribute("aria-pressed","false")});const l=n("navToggle"),c=n("navLinks");l&&c&&(l.addEventListener("click",()=>{const u=c.classList.toggle("open");l.setAttribute("aria-expanded",u),l.querySelector("i")?.classList.toggle("fa-bars",!u),l.querySelector("i")?.classList.toggle("fa-times",u)}),c.querySelectorAll("a").forEach(u=>{u.addEventListener("click",()=>{c.classList.remove("open"),l?.setAttribute("aria-expanded","false"),l?.querySelector("i")?.classList.toggle("fa-bars",!0),l?.querySelector("i")?.classList.toggle("fa-times",!1)})}))}async function Z(){M(!0);try{h=await P(),b=h;const e=n("statCount");e&&(e.textContent=h.length.toLocaleString()+"+"),Y(),E()}catch(e){console.error(e);const t=n("loading");t&&(t.innerHTML='<p style="color:red;">Failed to load data. Check console.</p>')}finally{M(!1)}}Z();
