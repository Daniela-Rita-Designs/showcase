/* template build: every photo is a shared placeholder tile picked by aspect ratio */
const ASPECT={"helena-01":"r080","helena-02":"r075","helena-03":"r075","helena-04":"r075","helena-05":"r075","helena-06":"r075","helena-07":"r075","helena-08":"r075","helena-09":"r133","helena-10":"r075","helena-100":"r075","helena-101":"r066","helena-102":"r066","helena-103":"r066","helena-104":"r066","helena-105":"r075","helena-106":"r075","helena-107":"r075","helena-108":"r075","helena-109":"r133","helena-11":"r075","helena-110":"r075","helena-111":"r075","helena-112":"r075","helena-113":"r075","helena-114":"r075","helena-115":"r075","helena-116":"r102","helena-117":"r075","helena-118":"r075","helena-119":"r075","helena-12":"r075","helena-120":"r075","helena-121":"r075","helena-122":"r075","helena-123":"r075","helena-124":"r046","helena-125":"r072","helena-126":"r075","helena-127":"r075","helena-13":"r075","helena-14":"r075","helena-15":"r075","helena-16":"r066","helena-17":"r075","helena-18":"r075","helena-19":"r075","helena-20":"r067","helena-21":"r075","helena-22":"r075","helena-23":"r100","helena-24":"r075","helena-25":"r075","helena-26":"r075","helena-27":"r066","helena-28":"r075","helena-29":"r075","helena-30":"r075","helena-31":"r075","helena-32":"r075","helena-33":"r075","helena-34":"r066","helena-35":"r075","helena-36":"r075","helena-37":"r075","helena-38":"r075","helena-39":"r079","helena-40":"r075","helena-41":"r133","helena-42":"r056","helena-43":"r075","helena-44":"r075","helena-45":"r088","helena-46":"r075","helena-47":"r075","helena-48":"r133","helena-49":"r133","helena-50":"r075","helena-51":"r075","helena-52":"r075","helena-53":"r075","helena-54":"r075","helena-55":"r067","helena-56":"r075","helena-57":"r075","helena-58":"r075","helena-59":"r056","helena-60":"r075","helena-61":"r075","helena-62":"r075","helena-63":"r075","helena-64":"r075","helena-65":"r075","helena-66":"r075","helena-67":"r075","helena-68":"r075","helena-69":"r075","helena-70":"r075","helena-71":"r075","helena-72":"r075","helena-73":"r075","helena-74":"r075","helena-75":"r075","helena-76":"r075","helena-77":"r072","helena-78":"r133","helena-79":"r133","helena-80":"r133","helena-81":"r133","helena-82":"r056","helena-83":"r100","helena-84":"r075","helena-85":"r103","helena-86":"r114","helena-87":"r075","helena-88":"r075","helena-89":"r075","helena-90":"r080","helena-91":"r080","helena-92":"r080","helena-93":"r088","helena-94":"r083","helena-95":"r075","helena-96":"r075","helena-97":"r075","helena-98":"r075","helena-99":"r075","momentos-01":"r079","momentos-02":"r075","momentos-03":"r178","momentos-04":"r075","momentos-05":"r075","momentos-06":"r067","momentos-07":"r066","momentos-08":"r062","momentos-09":"r067","momentos-10":"r075","momentos-11":"r075","momentos-12":"r075","momentos-13":"r056","momentos-14":"r133","papa-01":"r059","papa-02":"r092","papa-03":"r075","papa-04":"r056","papa-05":"r133","papa-06":"r075","papa-07":"r075","papa-08":"r057","papa-09":"r075","papa-10":"r089","papa-11":"r091","papa-12":"r075","papa-13":"r057","papa-14":"r056","papa-15":"r075","papa-16":"r075","papa-17":"r075","papa-18":"r075","papa-19":"r075","papa-20":"r075","papa-21":"r075","papa-22":"r066","papa-23":"r062","papa-24":"r075","papa-25":"r075","papa-26":"r046"};
const TILE=id=>'img/s/'+(ASPECT[id]||'r075')+'.jpg';
/* ==========================================================================
   Helena — the app. Renders every chapter from data.js, no framework.
   ========================================================================== */
(() => {
  const D = window.CAPSULE_DATA;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rots = [-3, 2.5, -1.5, 3.5, -2.5, 1.5, -4, 2];
  const rot = i => rots[i % rots.length] + 'deg';

  const HELENA_ALL = D.helena.flatMap(m => m.photos);
  const GROUPS = { momentos: D.momentos, helena: HELENA_ALL, papa: D.papa };

  /* ----------------------------------------------------------------------
     tiny view helpers
     ---------------------------------------------------------------------- */
  const pola = (group, idx, e, cls = '', tape = true) => `
    <figure class="pola ${cls}" style="--rot:${rot(idx)}" data-view="${group}:${idx}">
      ${tape ? `<span class="tape ${idx % 2 ? 'tape--alt' : ''}"></span>` : ''}
      <div class="pola__photo"><img src="${TILE(e.id)}" alt="" loading="lazy" decoding="async"></div>
      <figcaption class="pola__cap">${e.cap}</figcaption>
    </figure>`;

  const bar = (title, sub = '', back = '#/home') => `
    <header class="bar">
      <a class="bar__btn" href="${back}" aria-label="voltar"><svg><use href="#i-back"/></svg></a>
      <div class="bar__title">${title}${sub ? `<small>${sub}</small>` : ''}</div>
      <span></span>
    </header>`;

  const head = (kicker, title, lede = '', compact = false) => `
    <div class="head ${compact ? 'head--compact' : ''}">
      <p class="kicker">${kicker}</p>
      <h1 class="chapter">${title}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ''}
      <svg class="rule" aria-hidden="true"><use href="#flourish"/></svg>
    </div>`;

  const next = (href, label, title) => `
    <a class="next" href="${href}"><div><span>${label}</span><b>${title}</b></div><svg><use href="#i-back" transform="rotate(180 12 12)"/></svg></a>`;

  const seg = on => `
    <nav class="seg" aria-label="álbuns">
      <a href="#/helena" class="${on === 'helena' ? 'is-on' : ''}">a Helena</a>
      <a href="#/papa" class="${on === 'papa' ? 'is-on' : ''}">menina do papá</a>
    </nav>`;

  /* ----------------------------------------------------------------------
     screens
     ---------------------------------------------------------------------- */
  const S = {};

  S.home = () => `
    <div class="body body--tight">
      <section class="hero">
        <div class="motes" id="motes" aria-hidden="true"></div>
        <svg class="lav" viewBox="0 0 60 220" aria-hidden="true"><use href="#lavender"/></svg>
        <svg class="sheep" viewBox="0 0 110 90" aria-hidden="true"><use href="#sheep"/></svg>
        <p class="hero__kicker"><svg class="rule" aria-hidden="true"><use href="#flourish"/></svg><span>um pequeno livro de pequenos momentos</span><svg class="rule" aria-hidden="true"><use href="#flourish"/></svg></p>
        <h1 class="title"><span>Helena</span><span class="title__shadow" aria-hidden="true">Helena</span></h1>
        <p class="subtitle">para cada pequeno momento, <em>mesmo de longe.</em></p>
        <p class="birthstamp" aria-label="nasceu a 13 de janeiro de 2026"><span></span><span class="birthstamp__text">n. 13 · 01 · 2026</span><span></span></p>
        <p class="tickets" aria-hidden="true"><span class="ticket">vol. I</span><span class="ticket ticket--alt">feito à mão</span><span class="ticket">com saudade</span></p>
      </section>

      <section class="chapters">
        <p class="chapters__label">cada peça abre um capítulo · toca para começar</p>

        <a class="chap" href="#/carta" style="--rot:-.6deg">
          <span class="chap__art chap__art--pad"><span class="env"><span class="env__flap"></span><span class="env__seal"><svg viewBox="0 0 40 40"><use href="#seal-H"/></svg></span></span></span>
          <span class="chap__text"><span class="chap__kicker">capítulo um</span><span class="chap__title">Uma carta antes de começar</span><span class="chap__meta">para a Helena · abrir devagar</span></span>
          <svg class="chap__go"><use href="#i-back"/></svg>
        </a>

        <a class="chap" href="#/momentos" style="--rot:.5deg">
          <span class="chap__art"><img src="img/a/${D.art.sister}" alt=""></span>
          <span class="chap__text"><span class="chap__kicker">capítulo dois</span><span class="chap__title">Um Ano de Pequenos Momentos</span><span class="chap__meta">${D.momentos.length} polaroids · um universo pequenino ✦</span></span>
          <svg class="chap__go"><use href="#i-back"/></svg>
        </a>

        <a class="chap" href="#/helena" style="--rot:-.4deg">
          <span class="chap__art"><img src="img/a/${D.art.trumpet}" alt=""></span>
          <span class="chap__text"><span class="chap__kicker">capítulo três</span><span class="chap__title">A Helena</span><span class="chap__meta">${HELENA_ALL.length} fotografias · a nossa pequena estrela</span></span>
          <svg class="chap__go"><use href="#i-back"/></svg>
        </a>

        <a class="chap" href="#/papa" style="--rot:.7deg">
          <span class="chap__art"><img src="${TILE(D.papa[0].id)}" alt=""></span>
          <span class="chap__text"><span class="chap__kicker">um capítulo só dele</span><span class="chap__title">Menina do Papá</span><span class="chap__meta">${D.papa.length} polaroids · ♡</span></span>
          <svg class="chap__go"><use href="#i-back"/></svg>
        </a>

        <a class="chap" href="#/galeria" style="--rot:-.5deg">
          <span class="chap__art chap__art--gallery"><img src="img/a/${D.art['first-strokes']}" alt=""></span>
          <span class="chap__text"><span class="chap__kicker">capítulo quatro</span><span class="chap__title">A Pequena Galeria</span><span class="chap__meta">os primeiros traços</span></span>
          <svg class="chap__go"><use href="#i-back"/></svg>
        </a>

        <a class="chap" href="#/familia" style="--rot:.4deg">
          <span class="chap__art chap__art--branch"><svg viewBox="0 0 240 110"><use href="#branch"/></svg></span>
          <span class="chap__text"><span class="chap__kicker">capítulo cinco</span><span class="chap__title">A Nossa Família</span><span class="chap__meta">${D.family.length + 1} retratos · quem já estava à espera</span></span>
          <svg class="chap__go"><use href="#i-back"/></svg>
        </a>
      </section>
    </div>`;

  S.carta = () => {
    const ages = [
      [1, 'para abrir no primeiro aniversário'],
      [3, 'para abrir quando começares a falar como gente grande'],
      [5, 'para o teu primeiro dia de escola'],
      [7, 'para quando já souberes ler tudo isto sozinha'],
      [10, 'primeira década, primeiro grande passo'],
      [13, 'para a Helena adolescente, com muito amor'],
      [16, 'para o mundo que estás a começar a descobrir'],
      [18, 'para a Helena adulta — escolhe tudo com coragem'],
    ];
    return bar('uma carta', 'capítulo um') + `
    <div class="body">
      ${head('capítulo um', 'Uma carta antes de começar')}
      <article class="letter paper" style="margin-top:44px">
        <figure class="letter-art"><span class="tape"></span><img src="img/a/${D.art['letter-art']}" alt=""></figure>
        <p class="letter__greeting">Querida Helena,</p>
        <p class="letter__body">Fiz esta pequena cápsula do tempo para ti porque, apesar de estar longe, quero fazer parte do teu crescimento de alguma forma. Tenho muitas saudades de casa, mas principalmente tenho saudades de te ver crescer todos os dias, de descobrir quem te vais tornar, das pequenas coisas que mudam sem ninguém dar conta.</p>
        <p class="letter__body">Às vezes custa-me pensar que estou a perder momentos teus — primeiros sorrisos, palavras, manias, fases. Então pensei que talvez pudesse criar um lugar onde as nossas memórias ficassem guardadas. Um cantinho só nosso, com fotografias, histórias, cartas e pequenos pedaços da tua vida, para que um dia possas olhar para trás e sentir o quanto foste amada desde sempre.</p>
        <p class="letter__body">Quero que saibas que penso em ti todos os dias. Mesmo longe, estás muito presente na minha vida. E espero que, quando fores mais velha e leres isto, consigas sentir o carinho enorme que tenho por ti.</p>
        <p class="letter__body">Talvez um dia possamos ver tudo isto juntas e rir das fotografias, das histórias e das cartas que te fui escrevendo ao longo do tempo.</p>
        <p class="letter__sign">Com muito amor,</p>
        <p class="letter__signature">a tua tia</p>
        <div class="seal--corner" aria-hidden="true"><svg viewBox="0 0 40 40"><use href="#seal-H"/></svg></div>
      </article>

      <section class="future">
        <p class="kicker">cartas para o futuro</p>
        <p class="future__lede">uma para cada vez que cresceres mais um bocadinho.</p>
        <div class="fletters">
          ${ages.map(([a, hnt], i) => `
          <button class="fletter" style="--rot:${rot(i)}" data-age="${a}" data-hint="${hnt}">
            <span class="fletter__flap"></span>
            <span class="fletter__seal"><svg viewBox="0 0 40 40"><use href="#seal-H"/></svg></span>
            <span class="fletter__age">${a} ano${a > 1 ? 's' : ''}</span>
            <span class="fletter__hint">${hnt}</span>
          </button>`).join('')}
        </div>
        <p class="hint" style="margin-top:0">↳ cada uma à espera do seu dia</p>
      </section>

      <div class="clip"><span class="tape"></span><em>"e há pontos entre nós, mesmo de longe, mesmo de muito longe."</em></div>
      <svg class="botanical" viewBox="0 0 80 180" aria-hidden="true"><use href="#wildflower"/></svg>
      ${next('#/momentos', 'próximo capítulo', 'um ano de pequenos momentos')}
    </div>`;
  };

  S.momentos = () => bar('momentos', 'capítulo dois') + `
    <div class="body">
      ${head('capítulo dois', 'Um Ano de Pequenos Momentos', 'Polaroids coladas um pouco tortas, pela ordem em que aconteceram.')}
      <div class="datestrip" id="datestrip">
        ${D.momentos.map((e, i) => `<button class="chip ${i === 0 ? 'is-on' : ''}" data-i="${i}">${e.cap}</button>`).join('')}
      </div>
      <div class="story">
        <div class="story__track" id="storyTrack">
          ${D.momentos.map((e, i) => `<div class="story__slide">${pola('momentos', i, e)}</div>`).join('')}
        </div>
        <div class="thread" aria-hidden="true">
          <div class="thread__line"></div>
          <div class="thread__dots" id="storyDots">${D.momentos.map((_, i) => `<i class="${i === 0 ? 'is-on' : ''}"></i>`).join('')}</div>
          <svg class="thread__bee" id="storyBee" viewBox="0 0 60 40" style="left:0%"><use href="#bee"/></svg>
        </div>
        <p class="counter" id="storyCount">1 / ${D.momentos.length}</p>
      </div>
      <p class="hint">↳ desliza para o próximo momento · toca para ampliar</p>
      ${next('#/helena', 'próximo capítulo', 'a Helena')}
    </div>`;

  // pages of four, month by month
  const PAGES = [];
  D.helena.forEach(m => {
    const start = HELENA_ALL.indexOf(m.photos[0]);
    for (let i = 0; i < m.photos.length; i += 4) {
      PAGES.push({ month: m.month, short: m.short, photos: m.photos.slice(i, i + 4), first: start + i });
    }
  });

  S.helena = () => bar('o álbum', 'capítulo três') + `
    <div class="body">
      ${head('capítulo três', 'A Helena', 'o álbum dela — começa aqui, e vai crescer com ela.', true)}
      ${seg('helena')}
      <div class="months" id="months">
        ${D.helena.map((m, i) => `<button class="chip chip--hand ${i === 0 ? 'is-on' : ''}" data-month="${m.month}">${m.month}<small>${m.photos.length}</small></button>`).join('')}
      </div>

      <div class="book-wrap" id="bookWrap">
        <div class="book" id="book">
          <div class="book__spine"></div>
          <div class="book__stack"></div>
          ${PAGES.map((p, pi) => `
          <div class="page" data-page="${pi}">
            <div class="page__side page__front">
              <div class="page__month"><b>${p.month}</b><span>2026</span></div>
              <div class="pgrid">
                ${p.photos.map((e, k) => pola('helena', p.first + k, e, '', false)).join('')}
                ${Array.from({ length: 4 - p.photos.length }).map(() => `<figure class="pola pola--ghost"><div class="pola__photo"></div></figure>`).join('')}
              </div>
              <p class="page__num">página ${pi + 1} · de ${PAGES.length}</p>
              <div class="page__shade"></div>
            </div>
            <div class="page__side page__back">
              <svg viewBox="0 0 40 40"><use href="#seal-H"/></svg>
              <span>verso da página ${pi + 1}</span>
              <div class="page__shade"></div>
            </div>
          </div>`).join('')}
          <button class="flip-btn flip-btn--prev" id="flipPrev" aria-label="página anterior"><svg><use href="#i-back"/></svg></button>
          <button class="flip-btn flip-btn--next" id="flipNext" aria-label="página seguinte"><svg><use href="#i-back"/></svg></button>
        </div>
        <div class="book-tools">
          <p class="hint">↳ desliza para virar a página</p>
          <button class="tool" id="gridToggle" aria-label="ver todas as fotografias"><svg><use href="#i-grid"/></svg></button>
        </div>
      </div>

      <div class="gridview" id="gridView" hidden>
        ${D.helena.map(m => `
          <section>
            <h3>${m.month} <span>${m.photos.length} fotografias</span></h3>
            <div class="tiles">
              ${m.photos.map(e => `<button class="tile" data-view="helena:${HELENA_ALL.indexOf(e)}"><img src="${TILE(e.id)}" alt="" loading="lazy" decoding="async"></button>`).join('')}
            </div>
          </section>`).join('')}
        <div class="book-tools"><p class="hint">↳ toca numa fotografia para a ampliar</p><button class="tool is-on" id="gridToggle2" aria-label="voltar ao livro"><svg><use href="#i-pages"/></svg></button></div>
      </div>

      <p class="hint">↳ o álbum vai-se enchendo, devagar, com cada nova memória</p>
      ${next('#/papa', 'um capítulo só dele', 'menina do papá')}
    </div>`;

  S.papa = () => bar('menina do papá', 'um capítulo só dele', '#/helena') + `
    <div class="body">
      ${head('um capítulo só dele', 'Menina do Papá', 'os momentos dela com o papá — os abraços de quem é, para sempre, a sua menina.', true)}
      ${seg('papa')}
      <div class="deck-wrap">
        <img class="controller" src="img/a/${D.art.controller}" alt="" aria-hidden="true">
        <div class="deck" id="deck">
          ${D.papa.map((e, i) => pola('papa', i, e)).join('')}
          <div class="deck-empty" id="deckEmpty" hidden>
            <p>para o papá, ela vai ser sempre esta menina</p>
            <button id="deckAgain">ver de novo ♡</button>
          </div>
        </div>
        <p class="counter" id="deckCount">1 / ${D.papa.length}</p>
      </div>
      <p class="hint">↳ desliza a polaroid para ver a próxima · toca para ampliar</p>
      ${next('#/galeria', 'próximo capítulo', 'a pequena galeria')}
    </div>`;

  S.galeria = () => bar('a galeria', 'capítulo quatro') + `
    <div class="body">
      ${head('capítulo quatro', 'A Pequena Galeria', 'Para já, apenas molduras à espera — ainda não desenha, mas em breve vai.')}
      <div class="under">
        <span class="hand">em construção</span>
        <p class="under__sub">esta página vai-se encher com cada risco, cada rabisco, cada arco-íris.</p>
      </div>
      <div class="line">
        <svg class="line__string" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12 Q300 72 600 32 T1200 22" stroke="#8a4a40" stroke-width="1.2" fill="none" opacity=".65"/></svg>
        <div class="frames">
          ${['o primeiro desenho', '"a mamã"', '"a casa"', '"para a tia"', 'um arco-íris', 'à espera ainda'].map((c, i) => `
          <figure class="frame" style="--rot:${rot(i)}">
            <div class="frame__peg ${i % 2 ? 'frame__peg--alt' : ''}"></div>
            <div class="frame__paper"><div class="frame__ph"></div><span class="frame__cap">${c}</span></div>
          </figure>`).join('')}
        </div>
      </div>
      ${next('#/familia', 'próximo capítulo', 'a nossa família')}
    </div>`;

  S.familia = () => {
    const F = Object.fromEntries(D.family.map(f => [f.id, f]));
    // canvas coordinates (px) — maternal side left, paternal side right
    const N = {
      victor:  { x: 70,  y: 74,  id: 'victor' },  candida: { x: 150, y: 74,  id: 'candida' }, teresa: { x: 230, y: 74, id: 'teresa' },
      pb1: { x: 336, y: 74, role: 'bisavô' }, pb2: { x: 392, y: 74, role: 'bisavó' }, pb3: { x: 448, y: 74, role: 'bisavô' }, pb4: { x: 504, y: 74, role: 'bisavó' },
      paula: { x: 110, y: 236, id: 'paula' }, nuno: { x: 190, y: 236, id: 'nuno' },
      pa1: { x: 380, y: 236, role: 'avó' }, pa2: { x: 460, y: 236, role: 'avô' },
      daniela: { x: 70, y: 398, id: 'daniela' }, rita: { x: 150, y: 398, id: 'rita', parent: true },
      luis: { x: 420, y: 398, id: 'luis', parent: true }, pt: { x: 500, y: 398, role: 'tia paterna' },
      helena: { x: 285, y: 566, helena: true },
    };
    const W = 570, H = 660, R = 27;
    const L = [];                                  // svg line segments
    const line = (x1, y1, x2, y2) => L.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
    const couple = (a, b) => { line(a.x + R, a.y, b.x - R, b.y); return { x: (a.x + b.x) / 2, y: a.y }; };
    const children = (mid, kids, busY) => { line(mid.x, mid.y, mid.x, busY); const xs = kids.map(k => k.x); line(Math.min(...xs, mid.x), busY, Math.max(...xs, mid.x), busY); kids.forEach(k => line(k.x, busY, k.x, k.y - R)); };
    const bracket = (tops, mid, busY) => { const xs = tops.map(t => t.x); tops.forEach(t => line(t.x, t.y + R, t.x, busY)); line(Math.min(...xs), busY, Math.max(...xs), busY); line((Math.min(...xs) + Math.max(...xs)) / 2, busY, (Math.min(...xs) + Math.max(...xs)) / 2, busY + 8); line((Math.min(...xs) + Math.max(...xs)) / 2, busY + 8, mid.x, busY + 8); line(mid.x, busY + 8, mid.x, mid.y - 6); };

    const mAv = couple(N.paula, N.nuno);           // avós maternos
    const pAv = couple(N.pa1, N.pa2);              // avós paternos
    bracket([N.victor, N.candida, N.teresa], mAv, 140);
    bracket([N.pb1, N.pb2, N.pb3, N.pb4], pAv, 140);
    children(mAv, [N.daniela, N.rita], 322);
    children(pAv, [N.luis, N.pt], 322);
    const pais = couple(N.rita, N.luis);           // Rita ♡ Luís
    line(pais.x, pais.y, pais.x, N.helena.y - 46);
    const hearts = [mAv, pAv, pais].map(m => `<span class="tree__heart" style="left:${m.x}px;top:${m.y}px">♡</span>`).join('');

    const node = (k, n) => {
      const f = n.id ? F[n.id] : null;
      const cls = `tree__node ${n.parent ? 'is-parent' : ''} ${n.helena ? 'is-helena' : ''} ${f ? '' : 'is-empty'}`;
      const img = n.helena ? `<img src="img/a/${D.art.trumpet}" alt="Helena">` : f ? `<img src="img/s/r100.jpg" alt="${f.name}">` : `<span>?</span>`;
      const name = n.helena ? 'Helena' : f ? f.name : '—';
      const role = n.helena ? 'a nossa pequena' : f ? f.role : n.role;
      return `<div class="${cls}" style="left:${n.x}px;top:${n.y}px"><div class="tree__photo">${img}</div><b>${name}</b><i>${role}</i></div>`;
    };

    return bar('a família', 'capítulo cinco') + `
    <div class="body">
      ${head('capítulo cinco', 'A Nossa Família', 'As pessoas que já estavam à tua espera.', true)}
      <div class="tree-scroll" id="treeScroll">
        <div class="tree" style="width:${W}px;height:${H}px">
          <div class="tree__card"><div class="tree__card-photo"><img src="img/a/${D.art.trumpet}" alt=""></div><div><b>árvore da família</b><span>4 gerações · ${D.family.length + 1} retratos</span></div></div>
          <span class="tree__side" style="left:150px">lado da mãe</span>
          <span class="tree__side" style="left:420px">lado do pai</span>
          <svg class="tree__lines" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${L.join('')}</svg>
          ${hearts}
          ${Object.entries(N).map(([k, n]) => node(k, n)).join('')}
        </div>
      </div>
      <p class="hint">↳ arrasta para os lados para veres toda a árvore · os retratos ainda hão-de chegar</p>
      ${next('#/home', 'voltar ao princípio', 'à capa')}
    </div>`;
  };

  /* ----------------------------------------------------------------------
     mount
     ---------------------------------------------------------------------- */
  const ORDER = ['home', 'carta', 'momentos', 'helena', 'papa', 'galeria', 'familia'];
  const TAB = { home: 'home', carta: 'carta', momentos: 'momentos', helena: 'helena', papa: 'helena', galeria: '', familia: 'familia' };
  const screensEl = $('#screens');
  screensEl.innerHTML = ORDER.map(id => `<section class="screen" data-screen="${id}" aria-hidden="true">${S[id]()}</section>`).join('');

  let current = null;
  function show(id, sub) {
    if (!ORDER.includes(id)) id = 'home';
    if (id !== current) {
      const to = $(`.screen[data-screen="${id}"]`);
      const from = current && $(`.screen[data-screen="${current}"]`);
      const fwd = !current || ORDER.indexOf(id) > ORDER.indexOf(current);
      to.classList.remove('from-left', 'from-right');
      to.classList.add(fwd ? 'from-right' : 'from-left');
      void to.offsetWidth;
      if (from) { from.classList.remove('from-left', 'from-right'); from.classList.add(fwd ? 'from-left' : 'from-right'); from.setAttribute('aria-hidden', 'true'); }
      to.setAttribute('aria-hidden', 'false');
      current = id;
      $$('#tabs a').forEach(a => a.classList.toggle('is-on', a.dataset.tab === TAB[id]));
    }
    if (id === 'helena' && sub) Book.goMonth(sub);
    if (id === 'familia') { const t = $('#treeScroll'); if (t && !t.dataset.centred) { t.dataset.centred = 1; t.scrollLeft = (t.scrollWidth - t.clientWidth) / 2; } }
  }
  function route() {
    const [, id = 'home', sub] = location.hash.replace(/^#\/?/, '/').split('/');
    show(id || 'home', sub);
    closeViewer(); closeSheet();
  }
  addEventListener('hashchange', route);

  /* ----------------------------------------------------------------------
     splash + motes
     ---------------------------------------------------------------------- */
  const splash = $('#splash');
  const seen = sessionStorage.getItem('helena-splash');
  setTimeout(() => { splash.classList.add('is-gone'); try { sessionStorage.setItem('helena-splash', '1'); } catch (e) {} }, seen ? 80 : 1300);

  const motes = $('#motes');
  if (motes && !reduceMotion) {
    for (let i = 0; i < 16; i++) {
      const m = document.createElement('span'); m.className = 'mote';
      const size = Math.random() * 5 + 3;
      m.style.cssText = `left:${Math.random() * 100}%;top:${50 + Math.random() * 50}%;width:${size}px;height:${size}px;--dx:${(Math.random() - .5) * 120}px;--dy:${-(Math.random() * 220 + 100)}px;animation-duration:${Math.random() * 12 + 12}s;animation-delay:-${Math.random() * 12}s;--o:${Math.random() * .5 + .35}`;
      motes.appendChild(m);
    }
  }

  /* ----------------------------------------------------------------------
     viewer
     ---------------------------------------------------------------------- */
  const viewer = $('#viewer');
  let vGroup = null, vTrack = null;
  function openViewer(group, index) {
    const list = GROUPS[group]; if (!list) return;
    vGroup = group;
    viewer.innerHTML = `
      <div class="viewer__bar"><span class="viewer__count" id="vCount"></span><button class="viewer__close" id="vClose" aria-label="fechar"><svg><use href="#i-close"/></svg></button></div>
      <div class="viewer__track" id="vTrack">${list.map(e => `<div class="viewer__slide"><img src="${TILE(e.id)}" alt="" loading="lazy" decoding="async"></div>`).join('')}</div>
      <p class="viewer__cap" id="vCap"></p>`;
    viewer.hidden = false;
    vTrack = $('#vTrack');
    const w = vTrack.clientWidth;
    vTrack.scrollLeft = index * w;
    requestAnimationFrame(() => viewer.classList.add('is-open'));
    const update = () => {
      const i = Math.round(vTrack.scrollLeft / vTrack.clientWidth);
      $('#vCount').textContent = `${i + 1} / ${list.length}`;
      $('#vCap').textContent = list[i]?.cap || '';
    };
    update();
    vTrack.addEventListener('scroll', update, { passive: true });
    $('#vClose').onclick = closeViewer;

    // swipe down to close · double tap to zoom
    let y0 = 0, x0 = 0, lastTap = 0;
    vTrack.addEventListener('pointerdown', e => { y0 = e.clientY; x0 = e.clientX; });
    vTrack.addEventListener('pointerup', e => {
      const dy = e.clientY - y0, dx = e.clientX - x0;
      if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) { closeViewer(); return; }
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
        const now = Date.now();
        if (now - lastTap < 320) { e.target.closest('.viewer__slide')?.classList.toggle('is-zoom'); lastTap = 0; }
        else lastTap = now;
      }
    });
  }
  function closeViewer() {
    if (viewer.hidden) return;
    viewer.classList.remove('is-open');
    setTimeout(() => { viewer.hidden = true; viewer.innerHTML = ''; }, 280);
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-view]');
    if (!t || t.closest('.is-drag') || dragged) return;
    const [g, i] = t.dataset.view.split(':');
    openViewer(g, +i);
  });
  let dragged = false;

  /* ----------------------------------------------------------------------
     bottom sheet (future letters)
     ---------------------------------------------------------------------- */
  const sheet = $('#sheet');
  function openSheet(age, hint) {
    sheet.innerHTML = `<div class="sheet__card paper"><div class="sheet__grab"></div><p class="sheet__age">${age} ano${age > 1 ? 's' : ''}</p><p class="sheet__hint">${hint}</p><p class="sheet__note">esta carta ainda está fechada.<br>abre-se no dia certo, nem um dia antes.</p><button class="sheet__close">até lá ♡</button></div>`;
    sheet.hidden = false; requestAnimationFrame(() => sheet.classList.add('is-open'));
    sheet.onclick = e => { if (e.target === sheet || e.target.closest('.sheet__close')) closeSheet(); };
  }
  function closeSheet() { if (sheet.hidden) return; sheet.classList.remove('is-open'); setTimeout(() => { sheet.hidden = true; }, 320); }
  document.addEventListener('click', e => { const f = e.target.closest('.fletter'); if (f) openSheet(+f.dataset.age, f.dataset.hint); });

  /* ----------------------------------------------------------------------
     momentos — story strip
     ---------------------------------------------------------------------- */
  (() => {
    const track = $('#storyTrack'), strip = $('#datestrip'), dots = $$('#storyDots i'), bee = $('#storyBee'), count = $('#storyCount');
    const n = D.momentos.length;
    let cur = 0;
    const sync = () => {
      const i = Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / track.clientWidth)));
      if (i === cur) return; cur = i;
      $$('.chip', strip).forEach((c, k) => c.classList.toggle('is-on', k === i));
      dots.forEach((d, k) => d.classList.toggle('is-on', k <= i));
      bee.style.left = `${(i / (n - 1)) * 100}%`;
      count.textContent = `${i + 1} / ${n}`;
      $$('.chip', strip)[i]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    track.addEventListener('scroll', sync, { passive: true });
    strip.addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) track.scrollTo({ left: +c.dataset.i * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' }); });
  })();

  /* ----------------------------------------------------------------------
     helena — flip book
     ---------------------------------------------------------------------- */
  const Book = (() => {
    const book = $('#book'), pages = $$('.page', book), months = $$('#months .chip');
    let cur = 0, busy = false;
    const last = pages.length - 1;

    function layout() {
      pages.forEach((p, i) => {
        p.classList.remove('is-current', 'is-next', 'is-prev', 'is-anim');
        p.style.transform = ''; p.style.setProperty('--shade', 0);
        if (i === cur) p.classList.add('is-current');
        else if (i === cur + 1) p.classList.add('is-next');
        else if (i === cur - 1) p.classList.add('is-prev');
      });
      months.forEach(m => m.classList.toggle('is-on', m.dataset.month === PAGES[cur].month));
      $('#flipPrev').style.visibility = cur === 0 ? 'hidden' : '';
      $('#flipNext').style.visibility = cur === last ? 'hidden' : '';
    }

    const setAngle = (p, a) => { p.style.transform = `rotateY(${a}deg)`; p.style.setProperty('--shade', (Math.min(90, Math.abs(a + (a < -90 ? 180 : 0))) / 90 * .7).toFixed(3)); };

    function finish(p, angle, then) {
      busy = true;
      p.classList.add('is-anim');
      const done = () => { p.removeEventListener('transitionend', done); busy = false; then(); layout(); };
      p.addEventListener('transitionend', done);
      requestAnimationFrame(() => setAngle(p, angle));
      setTimeout(() => { if (busy) done(); }, 700); // safety
    }
    function flip(dir) {
      if (busy) return;
      if (dir > 0 && cur < last) { const p = pages[cur]; setAngle(p, 0); finish(p, -180, () => cur++); }
      if (dir < 0 && cur > 0) { const p = pages[cur - 1]; setAngle(p, -180); finish(p, 0, () => cur--); }
    }
    function goMonth(month) {
      const i = PAGES.findIndex(p => p.month === month || p.short === month);
      if (i < 0 || i === cur || busy) return;
      const dir = i > cur ? 1 : -1;
      const p = dir > 0 ? pages[cur] : pages[i];
      // set the target as neighbour so it is visible under the flip, then flip
      pages.forEach(x => x.classList.remove('is-next', 'is-prev'));
      if (dir > 0) { pages[i].classList.add('is-next'); setAngle(p, 0); finish(p, -180, () => cur = i); }
      else { pages[i].classList.add('is-prev'); setAngle(p, -180); finish(p, 0, () => cur = i); }
    }

    // drag to flip
    let x0 = 0, t0 = 0, mode = 0, active = null, W = 1;
    book.addEventListener('pointerdown', e => {
      if (busy || e.target.closest('.flip-btn')) return;
      x0 = e.clientX; t0 = performance.now(); mode = 0; active = null; W = book.clientWidth; dragged = false;
    });
    book.addEventListener('pointermove', e => {
      if (busy || !x0 && x0 !== 0) return;
      if (e.buttons === 0 && e.pointerType === 'mouse') return;
      const dx = e.clientX - x0;
      if (!mode) {
        if (Math.abs(dx) < 8) return;
        if (dx < 0 && cur < last) { mode = 1; active = pages[cur]; }
        else if (dx > 0 && cur > 0) { mode = -1; active = pages[cur - 1]; }
        else return;
        dragged = true;
        try { book.setPointerCapture(e.pointerId); } catch (_) {}
      }
      if (mode === 1) setAngle(active, Math.max(-180, dx / W * 200));
      if (mode === -1) setAngle(active, -180 + Math.min(180, dx / W * 200));
    });
    const release = e => {
      if (!mode || !active) { setTimeout(() => dragged = false, 0); return; }
      const dx = e.clientX - x0, v = Math.abs(dx) / Math.max(1, performance.now() - t0);
      const go = Math.abs(dx) / W > .28 || v > .6;
      const p = active, m = mode; mode = 0; active = null;
      if (m === 1) finish(p, go ? -180 : 0, () => { if (go) cur++; });
      else finish(p, go ? 0 : -180, () => { if (go) cur--; });
      setTimeout(() => dragged = false, 50);
    };
    book.addEventListener('pointerup', release);
    book.addEventListener('pointercancel', release);
    $('#flipPrev').addEventListener('click', () => flip(-1));
    $('#flipNext').addEventListener('click', () => flip(1));
    document.addEventListener('keydown', e => { if (current !== 'helena') return; if (e.key === 'ArrowRight') flip(1); if (e.key === 'ArrowLeft') flip(-1); });
    $('#months').addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) goMonth(c.dataset.month); });

    // grid toggle
    const wrap = $('#bookWrap'), grid = $('#gridView');
    const toggle = on => { wrap.hidden = on; grid.hidden = !on; };
    $('#gridToggle').addEventListener('click', () => toggle(true));
    $('#gridToggle2').addEventListener('click', () => toggle(false));

    layout();
    return { goMonth, flip };
  })();

  /* ----------------------------------------------------------------------
     papá — deck of polaroids
     ---------------------------------------------------------------------- */
  (() => {
    const deck = $('#deck'), cards = $$('.pola', deck), empty = $('#deckEmpty'), count = $('#deckCount');
    const n = cards.length; let top = 0;
    function layout() {
      cards.forEach((c, i) => {
        c.classList.remove('is-top', 'is-2', 'is-3', 'is-drag');
        if (i < top) { c.classList.add('is-gone'); return; }
        c.classList.remove('is-gone');
        c.style.setProperty('--x', '0px'); c.style.setProperty('--y', `${(i - top) * 9}px`);
        c.style.setProperty('--r', `${[0, 3.5, -3][i - top] ?? 0}deg`);
        if (i === top) c.classList.add('is-top'); else if (i === top + 1) c.classList.add('is-2'); else if (i === top + 2) c.classList.add('is-3');
      });
      empty.hidden = top < n;
      count.textContent = top < n ? `${top + 1} / ${n}` : `${n} / ${n}`;
    }
    let x0 = 0, y0 = 0, on = null, moved = false;
    deck.addEventListener('pointerdown', e => {
      const c = e.target.closest('.pola.is-top'); if (!c) return;
      on = c; x0 = e.clientX; y0 = e.clientY; moved = false; dragged = false;
    });
    deck.addEventListener('pointermove', e => {
      if (!on) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (!moved && Math.abs(dx) < 8) return;
      if (!moved) { moved = true; dragged = true; on.classList.add('is-drag'); try { deck.setPointerCapture(e.pointerId); } catch (_) {} }
      on.style.setProperty('--x', `${dx}px`); on.style.setProperty('--y', `${dy * .3}px`); on.style.setProperty('--r', `${dx / 14}deg`);
    });
    const release = e => {
      if (!on) return;
      const c = on; on = null;
      const dx = e.clientX - x0;
      c.classList.remove('is-drag');
      if (moved && Math.abs(dx) > 80) {
        const s = Math.sign(dx);
        c.style.setProperty('--x', `${s * 520}px`); c.style.setProperty('--r', `${s * 28}deg`);
        c.classList.add('is-gone');
        top = Math.min(n, top + 1);
        setTimeout(layout, 60);
      } else layout();
      setTimeout(() => dragged = false, 50);
    };
    deck.addEventListener('pointerup', release);
    deck.addEventListener('pointercancel', release);
    $('#deckAgain').addEventListener('click', () => { top = 0; layout(); });
    layout();
  })();

  /* ----------------------------------------------------------------------
     go
     ---------------------------------------------------------------------- */
  if (!location.hash) history.replaceState(null, '', '#/home');
  route();
})();
