/* 요양원채움 사이트 화면 구성 (2026-11-24 개편). 문구는 data/content.js 에서 가져옴
   페이지 구분: <body data-page="home|review|column|overview"> */
(function () {
  var D = window.CHAEUM;
  var PAGE = document.body.getAttribute('data-page') || 'home';
  var $ = function (id) { return document.getElementById(id); };

  // 링크 이름(kakao 등)을 실제 주소로
  function url(h) { return D.links[h] || h; }
  function isOut(h) { return /^https?:/.test(url(h)) || /\.pdf$/.test(url(h)); }
  // cta: 클릭 구분용 이름 (data-cta). 카카오 링크는 이름이 없으면 페이지 이름으로 자동 부여
  function a(h, label, cls, cta) {
    var u = url(h);
    var c = cta || (h === 'kakao' ? PAGE + '-kakao' : '');
    return '<a class="' + (cls || '') + '" href="' + u + '"' + (isOut(h) ? ' target="_blank" rel="noopener"' : '') + (c ? ' data-cta="' + c + '"' : '') + '>' + label + '</a>';
  }
  function btn(b) { return a(b.href, b.label, 'btn ' + b.style, b.cta); }
  function head(o, mod) {
    return '<div class="sec-head ' + (mod || '') + '">' +
      '<span class="eyebrow">' + o.eyebrow + '</span>' +
      '<h2>' + o.title + '</h2>' + (o.desc ? '<p>' + o.desc + '</p>' : '') + '</div>';
  }
  function headLR(o) {
    return '<div class="sec-lr"><div><span class="eyebrow">' + o.eyebrow + '</span><h2>' + o.title + '</h2></div>' + (o.desc ? '<p>' + o.desc + '</p>' : '') + '</div>';
  }
  function list(arr, fn) { return arr.map(fn).join(''); }
  function ul(arr, cls) { return '<ul class="' + (cls || 'check-list') + '">' + list(arr, function (x) { return '<li>' + x + '</li>'; }) + '</ul>'; }
  var kakaoIcon = '<svg viewBox="0 0 24 24"><path fill="#172033" d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.7 6.6l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.5.1 1 .1 1.5.1 5.5 0 10-3.5 10-7.9S17.5 3 12 3z"/></svg>';

  /* ── 공통: 상단 메뉴 ── */
  $('top').innerHTML =
    '<a class="logo" href="index.html"><img src="' + D.brand.logoMark + '" alt=""><span><b>' + D.brand.name + '</b><span>' + D.brand.tagline + '</span></span></a>' +
    '<nav class="gnb" id="gnb" aria-label="주 메뉴">' + list(D.nav, function (n) { return '<a href="' + n.href + '"' + (n.page === PAGE ? ' class="on" aria-current="page"' : '') + '>' + n.label + '</a>'; }) + '</nav>' +
    '<button class="menu-btn" id="menuBtn" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="gnb"><i></i><i></i><i></i></button>';

  /* ───────── 공유 구성 요소 (메인·서비스안내에서 같이 씀) ───────── */

  function problemBlock() {
    var p = D.problem;
    return head(p, 'center') + '<ul class="problem-list">' + list(p.items, function (x) { return '<li>' + x + '</li>'; }) + '</ul>';
  }

  function scopeBlock(mode) {
    var s = D.scope;
    return (mode === 'lr' ? headLR(s) : head(s, 'center')) +
      '<div class="scope-grid">' +
      '<div class="scope-col do"><h3>' + s.doTitle + '</h3>' + ul(s.does) + '</div>' +
      '<div class="scope-col cant"><h3>' + s.cantTitle + '</h3>' + ul(s.cants, 'x-list') + '</div></div>';
  }

  function resultsBlock() {
    var r = D.results;
    return head(r, 'center') +
      '<div class="review-grid two">' + list(r.items, function (i) {
        return '<div class="review-card"><div class="num">' + i.num + '</div><p>' + i.text + '</p><div class="who">' + i.who + '</div></div>';
      }) + '</div><p class="result-note">' + r.note + '</p>' +
      '<p class="result-more">' + a('review', '근거와 집계 기준 자세히 보기 →', 'link-more', 'results-more') + '</p>';
  }

  function adBlock() {
    var r = D.adRecord, max = r.funnel[0].n;
    var bars = list(r.funnel, function (f, n) {
      var w = Math.max(Math.round(f.n / max * 100), 14);
      return '<div class="fn-row"><div class="fn-bar s' + n + '" style="width:' + w + '%"><strong>' + f.n + '<small>건</small></strong></div><span class="fn-label">' + f.label + '</span></div>' +
        (n < r.funnel.length - 1 ? '<div class="fn-arrow" aria-hidden="true">↓</div>' : '');
    });
    return head(r, 'center') +
      '<div class="ad-box"><div class="ad-funnel"><span class="ad-period">' + r.period + '</span><h3>' + r.funnelTitle + '</h3>' + bars + '<p class="fn-note">' + r.funnelNote + '</p></div>' +
      '<div class="ad-side"><table class="mini-table"><thead><tr>' + list(r.tableHead, function (h) { return '<th>' + h + '</th>'; }) + '</tr></thead><tbody>' +
      list(r.table, function (row) { return '<tr>' + list(row, function (c, n) { return n === 0 ? '<th>' + c + '</th>' : '<td>' + c + '</td>'; }) + '</tr>'; }) +
      '</tbody></table><div class="ad-limits"><b>이 숫자를 읽을 때 꼭 알아두실 점</b>' + ul(r.limits, 'dot-list') + '</div></div></div>';
  }

  function servicesBlock(mode) {
    var s = D.services;
    var extra = mode === 'lr';
    return (extra ? headLR(s) : head(s, 'narrow')) +
      '<div class="svc-grid">' + list(s.items, function (i) {
        return '<div class="svc-card"><div class="svc-no">' + i.no + '</div><h3>' + i.title + '</h3><p class="svc-role">' + i.role + '</p>' + ul(i.checks) +
          (extra ? '<div class="svc-price"><b>' + i.price + '</b><small>' + i.priceNote + '</small></div>' : '') + '</div>';
      }) + '</div>' +
      '<div class="ext-box"><h3>' + s.extTitle + '</h3><p>' + s.extDesc + '</p><div class="chip-row">' + list(s.ext, function (x) { return '<span>' + x + '</span>'; }) + '</div></div>';
  }

  function flowBlock(mode) {
    var f = D.flow;
    function path(p, cls) {
      return '<div class="flow-path ' + cls + '"><h3>' + p.name + '</h3><ol>' + list(p.steps, function (s) { return '<li>' + s + '</li>'; }) + '</ol></div>';
    }
    return (mode === 'lr' ? headLR(f) : head(f, 'center')) +
      '<div class="flow-wrap"><div class="flow-paths">' + path(f.pathA, 'pa') + path(f.pathB, 'pb') + '</div>' +
      '<div class="flow-link" aria-hidden="true"><span>↕</span></div>' +
      '<div class="flow-common"><h3>' + f.common.name + '</h3><div class="chip-row light">' + list(f.common.items, function (x) { return '<span>' + x + '</span>'; }) + '</div><p>' + f.common.note + '</p></div></div>';
  }

  function processBlock(mode) {
    var p = D.process;
    return (mode === 'lr' ? headLR(p) : head(p, 'center')) +
      '<div class="proc-grid">' + list(p.months, function (m, n) {
        return '<div class="proc-card"><div class="proc-top"><span>' + m.m + '</span><b>' + m.t + '</b></div>' + ul(m.items) + '</div>';
      }) + '</div>' +
      '<div class="deliver-box"><h3>' + p.deliverTitle + '</h3><div class="chip-row">' + list(p.deliver, function (x) { return '<span>' + x + '</span>'; }) + '</div></div>';
  }

  function priceBlock(mode, withIntro) {
    var p = D.price, m = p.main;
    var main = '<div class="price-main"><span class="pm-flag">' + m.flag + '</span><h3>' + m.name + '</h3>' +
      '<div class="pm-total"><em>' + m.total + '</em><span>만원</span><small>3개월 총액 · 제안가</small></div>' +
      ul(m.lines, 'dot-list light') + '<p class="pm-sum">' + m.sum + '</p>' +
      a('kakao', p.button, 'btn kakao', 'price-kakao') + '</div>';
    var rows = list(p.ind, function (r) { return '<tr><th>' + r[0] + '</th><td><b>' + r[1] + '</b></td><td>' + r[2] + '</td></tr>'; }) +
      '<tr class="sum"><th>' + p.indSum[0] + '</th><td><b>' + p.indSum[1] + '</b></td><td></td></tr>';
    var ind = '<div class="price-ind"><h3>' + p.indTitle + '</h3><p>' + p.indDesc + '</p><table class="mini-table left"><tbody>' + rows + '</tbody></table>' + ul(p.notes, 'dot-list') + '</div>';
    return (mode === 'lr' ? headLR(p) : head(p, 'center')) + '<div class="price-grid">' + main + ind + '</div>';
  }

  function scopeListBlock(mode) {
    var s = D.scopeList;
    return (mode === 'lr' ? headLR(s) : head(s, 'center')) +
      '<div class="incl-grid"><div class="incl-col in"><h3>' + s.inTitle + '</h3>' + ul(s.incl) + '</div>' +
      '<div class="incl-col out"><h3>' + s.outTitle + '</h3>' + ul(s.excl, 'x-list') + '</div></div>';
  }

  function teamBlock(mode) {
    var t = D.team;
    return (mode === 'lr' ? headLR(t) : head(t, 'center')) +
      '<div class="team-grid">' + list(t.items, function (p) {
        return '<div class="team-card"><span class="team-role">' + p.role + '</span><h3>' + p.name + '</h3>' + ul(p.items) + '<p class="team-note">' + p.note + '</p></div>';
      }) + '</div>';
  }

  function faqBlock(homeOnly, mode) {
    var f = D.faq;
    var items = homeOnly ? f.items.filter(function (i) { return i.home; }) : f.items;
    return (mode === 'lr' ? headLR(f) : head(f, 'center')) +
      '<div class="faq-list">' + list(items, function (i) { return '<div class="faq-item"><b>' + i.q + '</b><p>' + i.a + '</p></div>'; }) + '</div>' +
      (homeOnly ? '<p class="result-more">' + a('overview', '질문 12개 모두 보기 →', 'link-more', 'faq-more') + '</p>' : '');
  }

  function videoBlock() {
    var v = D.video;
    return '<div class="video-wrap"><div class="video-box"><button class="poster" id="poster" type="button" aria-label="영상 재생 (유튜브)" style="background-image:url(https://i.ytimg.com/vi/' + v.youtubeId + '/hqdefault.jpg)"></button></div>' +
      '<div>' + head(v) + '<div class="btns">' + list(v.buttons, btn) + '</div></div></div>';
  }

  function ctaBlock() {
    var c = D.cta;
    return '<div class="cta-box"><div><h2>' + c.title + '</h2><p>' + c.desc + '</p></div>' +
      '<div class="kakao-card"><b>' + c.cardTitle + '</b><p>' + c.cardDesc + '</p>' + a('kakao', c.button, 'btn kakao', 'final-kakao') + '</div></div>';
  }

  // 메인·서비스안내 맨 아래 회사 한 줄
  function brandFooter(mod) {
    return '<div class="brand-foot ' + (mod || '') + '"><div><b>' + D.brand.name + '</b> | ' + D.footer.desc + '</div><div>' + D.footer.people + '</div></div>';
  }

  /* ── 메인 ── */
  function home() {
    var h = D.hero;
    var html = '';
    html += '<section class="hero"><div class="hero-inner">' +
      '<span class="kicker">' + h.badge + '</span><h1>' + h.title + '</h1><p class="desc">' + h.desc + '</p>' +
      '<div class="btns">' + list(h.buttons, btn) + '</div>' +
      '<div class="hero-note">' + list(h.notes, function (n) { return '<div class="note-card"><b>' + n.title + '</b><p>' + n.desc + '</p></div>'; }) + '</div>' +
      '</div></section>';
    html += '<section class="sec reveal" id="problem">' + problemBlock() + '</section>';
    html += '<section class="sec soft reveal" id="results">' + resultsBlock() + '</section>';
    html += '<section class="sec reveal" id="inquiry">' + adBlock() + '</section>';
    html += '<section class="sec soft reveal" id="service">' + servicesBlock('center') + '</section>';
    html += '<section class="sec reveal" id="flow">' + flowBlock() + '</section>';
    html += '<section class="sec soft reveal" id="process">' + processBlock() + '</section>';
    html += '<section class="sec reveal" id="price">' + priceBlock() + '<p class="result-more">' + a('overview', '포함·제외 항목과 일정 자세히 보기 →', 'link-more', 'price-more') + '</p></section>';
    html += '<section class="sec soft reveal" id="scope">' + scopeBlock() + '</section>';
    html += '<section class="sec reveal" id="video">' + videoBlock() + '</section>';
    html += '<section class="sec soft reveal" id="team">' + teamBlock() + '</section>';
    html += '<section class="sec reveal" id="faq">' + faqBlock(true) + '</section>';
    html += '<section class="sec dark reveal" id="contact">' + ctaBlock() + '</section>';
    html += '<div class="footnote"><ul>' + list(D.footnotes, function (x) { return '<li>' + x + '</li>'; }) + '</ul></div>';
    html += brandFooter();
    return html;
  }

  /* ── 운영 사례 · 원장 칼럼 ── */
  function post(i, kind) {
    var meta = kind === 'column' ? '<span class="post-meta">' + i.source + ' · ' + i.date + '</span>' : '';
    var basis = i.basis ? '<details class="post-basis"><summary>근거·기준 보기</summary>' + ul(i.basis, 'dot-list') + '</details>' : '';
    return '<article class="post reveal"' + (i.cat ? ' data-cat="' + i.cat + '"' : '') + '>' +
      a(i.link, '<div class="post-thumb" style="background-image:url(' + i.image + ')"><div class="pt-over"><b>' + i.over + '</b>' + (i.overSub ? '<span>' + i.overSub + '</span>' : '') + '</div></div>', 'post-img') +
      '<h2 class="post-title">' + a(i.link, i.title) + '</h2>' + meta +
      '<p class="post-ex">' + i.excerpt + '</p>' + basis +
      a(i.link, i.linkLabel || (kind === 'column' ? '원문 보기' : '더 보기'), 'post-more') +
      '</article>';
  }

  function archive(P, kind) {
    var h = P.hero, pn = h.panel;
    var panel = '<div class="arch-panel"><div class="ap-top"><img src="' + D.brand.logoMark + '" alt=""><div><b>' + pn.title + '</b><span>' + pn.sub + '</span></div></div>';
    if (pn.stats) panel += '<div class="ap-stats">' + list(pn.stats, function (s) { return '<div><strong>' + s.big + '</strong><span>' + s.small + '</span></div>'; }) + '</div>';
    if (pn.points) panel += '<div class="ap-points">' + list(pn.points, function (s) { return '<div>' + s + '</div>'; }) + '</div>';
    panel += '<div class="ap-chips">' + list(pn.chips, function (c) { return '<span>' + c + '</span>'; }) + '</div></div>';

    var html = '<section class="arch-hero"><div class="arch-inner">' +
      '<div class="arch-copy"><span class="kicker">' + h.badge + '</span><h1>' + h.title + '</h1><p>' + h.desc + '</p>' +
      '<div class="btns">' + list(h.buttons, btn) + '</div></div>' + panel + '</div></section>';

    html += '<hr class="arch-line" id="list">';
    if (kind === 'review') {
      html += list(P.groups, function (g) {
        var its = P.items.filter(function (i) { return i.group === g.id; });
        return '<section class="grp"><div class="grp-head"><h2>' + g.title + '</h2><p>' + g.desc + '</p></div><div class="post-grid">' + list(its, function (i) { return post(i, kind); }) + '</div></section>';
      });
    } else {
      html += '<div class="cat-bar" role="group" aria-label="글 분류">' + list(P.cats, function (c, n) {
        return '<button type="button" class="cat-chip' + (n === 0 ? ' on' : '') + '" data-cat="' + c.id + '" aria-pressed="' + (n === 0) + '">' + c.label + '</button>';
      }) + '</div>';
      html += '<div class="post-grid" id="posts">' + list(P.items, function (i) { return post(i, kind); }) + '</div>';
    }
    html += '<section class="page-cta"><div><h2>' + P.cta.title + '</h2><p>' + P.cta.desc + '</p></div>' + a('kakao', P.cta.button, 'btn kakao', PAGE + '-bottom-kakao') + '</section>';
    return html;
  }

  /* ── 서비스안내 ── */
  function overview() {
    var P = D.overviewPage, h = P.hero;
    function sec(inner, id, cls) { return '<section class="ov-sec' + (cls ? ' ' + cls : '') + '"' + (id ? ' id="' + id + '"' : '') + '>' + inner + '</section>'; }
    var html = '<section class="ov-hero"><div class="ov-inner"><span class="kicker">' + h.badge + '</span><h1>' + h.title + '</h1><p>' + h.desc + '</p>' +
      '<div class="btns">' + list(h.buttons, btn) + '</div></div></section>';

    html += sec(servicesBlock('lr'), 'service');
    html += sec(priceBlock('lr'), 'price');
    html += sec(flowBlock('lr'), 'flow');
    html += sec(processBlock('lr'), 'process');
    html += sec(scopeListBlock('lr'), 'scope-list');
    html += sec('<div class="after-grid"><div class="after-card"><h3>' + D.after.title + '</h3><p>' + D.after.desc + '</p></div>' +
      '<div class="after-card free"><h3>' + D.freeConsult.title + '</h3><p>' + D.freeConsult.desc + '</p></div></div>', 'after');
    html += sec(scopeBlock('lr'), 'scope');
    html += sec(faqBlock(false, 'lr'), 'faq');

    html += '<section class="ov-final"><h2>' + P.final.title + '</h2><p>' + P.final.desc + '</p>' +
      '<ul class="ask-list">' + list(P.final.ask, function (x) { return '<li>' + x + '</li>'; }) + '</ul>' +
      a('kakao', P.final.button, 'btn brown big', 'ov-final-kakao') +
      '<div class="brochure-link">' + a('brochure', P.final.brochure, '', 'ov-brochure') + '</div></section>';
    html += '<div class="footnote white"><ul>' + list(P.footnotes, function (x) { return '<li>' + x + '</li>'; }) + '</ul></div>';
    html += brandFooter('soft');
    return html;
  }

  var main = $('main');
  if (PAGE === 'review') main.innerHTML = archive(D.reviewPage, 'review');
  else if (PAGE === 'column') main.innerHTML = archive(D.columnPage, 'column');
  else if (PAGE === 'overview') main.innerHTML = overview();
  else main.innerHTML = home();

  /* ── 공통: 채널 링크 줄 + 하단 정보 ── */
  var ft = D.footer;
  $('footer').innerHTML =
    '<div class="share-row">' + list(ft.channels, function (x) { return a(x.href, x.label); }) + '</div>' +
    '<div class="foot-info"><span>' + D.brand.name + '</span><span>' + ft.people + '</span><span>이메일 ' + ft.email + '</span><span>연락처 ' + ft.phone + '</span>' +
    '<span>' + ft.address + '</span>' + (ft.bizInfo ? '<span>' + ft.bizInfo + '</span>' : '') + '</div>';

  // 떠 있는 상담 버튼
  var fl = $('floating');
  fl.href = D.links.kakao;
  fl.setAttribute('data-cta', PAGE + '-floating-kakao');
  fl.innerHTML = '<i>' + kakaoIcon + '</i><span><b>' + D.floating.title + '</b><span>' + D.floating.sub + '</span></span>';

  // 모바일 메뉴
  var menuBtn = $('menuBtn');
  menuBtn.addEventListener('click', function () {
    var open = $('gnb').classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // 영상: 누르면 유튜브 재생 (버튼이라 키보드로도 가능)
  var poster = $('poster');
  if (poster) poster.addEventListener('click', function () {
    this.outerHTML = '<iframe src="https://www.youtube.com/embed/' + D.video.youtubeId + '?autoplay=1&rel=0" title="의정부 VIP요양원 영상" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  });

  // 칼럼 분류 필터
  var bar = document.querySelector('.cat-bar');
  if (bar) bar.addEventListener('click', function (e) {
    var b = e.target.closest('.cat-chip'); if (!b) return;
    var id = b.getAttribute('data-cat');
    bar.querySelectorAll('.cat-chip').forEach(function (c) { var on = c === b; c.classList.toggle('on', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    document.querySelectorAll('#posts .post').forEach(function (p) { p.hidden = !(id === 'all' || p.getAttribute('data-cat') === id); });
  });

  // 상담 버튼 클릭 구분용 기록. 측정 도구(GA4 등)를 붙이면 dataLayer 로 받을 수 있게 둠.
  // 버튼 클릭은 실제 상담 완료가 아님: 사이트 방문 → 서비스안내 조회 → 카카오톡 클릭 → 실제 상담 신청 → 미팅 → 계약 중 '클릭' 단계만 구분.
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cta]'); if (!el) return;
    window.dataLayer.push({ event: 'chaeum_cta_click', cta: el.getAttribute('data-cta'), page: PAGE });
  });

  // 스크롤 등장 효과
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
