/* 요양원채움 사이트 화면 구성. 문구는 data/content.js 에서 가져옴
   페이지 구분: <body data-page="home|review|column|overview"> */
(function () {
  var D = window.CHAEUM;
  var PAGE = document.body.getAttribute('data-page') || 'home';
  var $ = function (id) { return document.getElementById(id); };

  // 링크 이름(kakao 등)을 실제 주소로
  function url(h) { return D.links[h] || h; }
  function isOut(h) { return /^https?:/.test(url(h)) || /\.pdf$/.test(url(h)); }
  function a(h, label, cls) {
    var u = url(h);
    return '<a class="' + (cls || '') + '" href="' + u + '"' + (isOut(h) ? ' target="_blank" rel="noopener"' : '') + '>' + label + '</a>';
  }
  function btn(b) { return a(b.href, b.label, 'btn ' + b.style); }
  function head(o, mod) {
    return '<div class="sec-head ' + (mod || '') + '">' +
      '<span class="eyebrow">' + o.eyebrow + '</span>' +
      '<h2>' + o.title + '</h2>' + (o.desc ? '<p>' + o.desc + '</p>' : '') + '</div>';
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function list(arr, fn) { return arr.map(fn).join(''); }
  var kakaoIcon = '<svg viewBox="0 0 24 24"><path fill="#172033" d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.7 6.6l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.5.1 1 .1 1.5.1 5.5 0 10-3.5 10-7.9S17.5 3 12 3z"/></svg>';

  /* ── 공통: 상단 메뉴 ── */
  $('top').innerHTML =
    '<a class="logo" href="index.html"><img src="' + D.brand.logoMark + '" alt=""><span><b>' + D.brand.name + '</b><span>' + D.brand.tagline + '</span></span></a>' +
    '<nav class="gnb" id="gnb">' + list(D.nav, function (n) { return '<a href="' + n.href + '"' + (n.page === PAGE ? ' class="on"' : '') + '>' + n.label + '</a>'; }) + '</nav>' +
    '<button class="menu-btn" id="menuBtn" aria-label="메뉴 열기"><i></i><i></i><i></i></button>';

  /* ── 메인 ── */
  function home() {
    var h = D.hero, v = D.video, r = D.results, p = D.points, b = D.blog, s = D.service, k = D.packages, f = D.faq, c = D.cta;
    var html = '';
    html += '<section class="hero">' +
      '<div class="hero-inner">' +
        '<span class="kicker">' + h.badge + '</span>' +
        '<h1>' + h.title + '</h1>' +
        '<p class="desc">' + h.desc + '</p>' +
        '<div class="btns">' + list(h.buttons, btn) + '</div>' +
        '<div class="hero-note">' + list(h.notes, function (n) { return '<div class="note-card"><b>' + n.title + '</b><p>' + n.desc + '</p></div>'; }) + '</div>' +
      '</div></section>';

    html += '<section class="sec reveal" id="video"><div class="video-wrap">' +
      '<div class="video-box"><div class="poster" id="poster" role="button" aria-label="영상 재생" style="background-image:url(https://i.ytimg.com/vi/' + v.youtubeId + '/hqdefault.jpg)"></div></div>' +
      '<div>' + head(v) + '<div class="btns">' + list(v.buttons, btn) + '</div></div>' +
      '</div></section>';

    html += '<section class="sec soft reveal" id="results">' + head(r, 'center') +
      '<div class="review-grid">' + list(r.items, function (i) {
        return '<div class="review-card"><div class="num">' + i.num + '</div><p>' + i.text + '</p><div class="who">' + i.who + '</div></div>';
      }) + '</div></section>';

    html += '<section class="sec reveal">' + head(p, 'center') +
      '<div class="step-list">' + list(p.items, function (i, n) {
        return '<div class="step-card"><div class="step-num">' + pad2(n + 1) + '</div><div class="step-body"><h3>' + i.title + '</h3><p>' + i.desc + '</p></div></div>';
      }) + '</div></section>';

    html += '<section class="sec soft reveal">' + head(b, 'narrow') +
      '<div class="blog-box">' +
        '<div class="blog-visual"><div class="ph"><img src="' + b.visual.image + '" alt=""></div><div class="cap">' + b.visual.caption + '</div></div>' +
        '<div class="blog-points">' + list(b.items, function (i) { return '<div class="mini-card"><b>' + i.title + '</b><p>' + i.desc + '</p></div>'; }) + '</div>' +
      '</div></section>';

    html += '<section class="sec reveal" id="service">' + head(s, 'narrow') +
      '<div class="grid-2">' + list(s.items, function (i) {
        return '<div class="card"><h3>' + i.title + '</h3><p>' + i.desc + '</p><ul class="check-list">' +
          list(i.checks, function (x) { return '<li>' + x + '</li>'; }) + '</ul></div>';
      }) + '</div></section>';

    html += '<section class="sec soft reveal" id="packages">' + head(k, 'center') +
      '<div class="package-row">' + list(k.items, function (i) {
        var price = i.price == null ? '<b>' + i.priceText + '</b>' : '<b><em>' + i.price + '</em><span>만원</span></b>';
        return '<div class="package-card' + (i.featured ? ' featured' : '') + '"><span class="label">' + i.label + '</span>' +
          '<h3>' + i.name + '</h3><p>' + i.desc + '</p>' +
          '<div class="price"><small>' + i.priceNote + '</small>' + price + '</div>' +
          a('kakao', k.button, 'btn dark') + '</div>';
      }) + '</div></section>';

    html += '<section class="sec reveal" id="faq">' + head(f, 'center') +
      '<div class="faq-list">' + list(f.items, function (i) { return '<div class="faq-item"><b>' + i.q + '</b><p>' + i.a + '</p></div>'; }) + '</div></section>';

    html += '<section class="sec dark reveal" id="contact"><div class="cta-box">' +
      '<div><h2>' + c.title + '</h2><p>' + c.desc + '</p></div>' +
      '<div class="kakao-card"><b>' + c.cardTitle + '</b><p>' + c.cardDesc + '</p>' + a('kakao', c.button, 'btn kakao') + '</div>' +
      '</div></section>';

    html += '<div class="footnote"><ul>' + list(D.footnotes, function (x) { return '<li>' + x + '</li>'; }) + '</ul></div>';
    html += brandFooter();
    return html;
  }

  /* ── 운영 사례 · 원장 칼럼: 두 단 히어로 + 글 카드 2열 (원본 /review/, /column/) ── */
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
    html += '<div class="post-grid">' + list(P.items, function (i) {
      var meta = kind === 'column' ? '<span class="post-meta">' + i.source + ' · ' + i.date + '</span>' : '';
      return '<article class="post reveal">' +
        a(i.link, '<div class="post-thumb" style="background-image:url(' + i.image + ')"><div class="pt-over"><b>' + i.over + '</b>' + (i.overSub ? '<span>' + i.overSub + '</span>' : '') + '</div></div>', 'post-img') +
        '<h2 class="post-title">' + a(i.link, i.title) + '</h2>' + meta +
        '<p class="post-ex">' + i.excerpt + '</p>' +
        a(i.link, kind === 'column' ? '원문 보기' : '더 보기', 'post-more') +
        '</article>';
    }) + '</div>';
    return html;
  }

  /* ── 서비스안내 (원본 /overview/) ── */
  function overview() {
    var P = D.overviewPage, h = P.hero;
    function headLR(o) {
      return '<div class="sec-lr"><div><span class="eyebrow">' + o.eyebrow + '</span><h2>' + o.title + '</h2></div>' + (o.desc ? '<p>' + o.desc + '</p>' : '') + '</div>';
    }
    var html = '<section class="ov-hero"><div class="ov-inner"><span class="kicker">' + h.badge + '</span><h1>' + h.title + '</h1><p>' + h.desc + '</p>' +
      '<div class="btns">' + list(h.buttons, btn) + '</div></div></section>';

    html += '<section class="ov-sec">' + headLR(P.packagesHead) + '<div class="ov-pack">' + list(P.packages, function (k) {
      var price = k.price == null ? '<b>' + k.priceText + '</b>' : '<b><em>' + k.price + '</em><span>만원</span></b>';
      return '<article class="ov-card' + (k.featured ? ' featured' : '') + '">' + (k.label ? '<span class="ov-flag">' + k.label + '</span>' : '') +
        '<h3>' + k.name + '</h3><p>' + k.desc + '</p>' +
        '<div class="price"><small>' + k.priceNote + '</small>' + price + '</div>' +
        '<ul class="check-list">' + list(k.checks, function (x) { return '<li>' + x + '</li>'; }) + '</ul>' +
        a('kakao', k.button, 'btn ' + (k.featured ? 'brown' : 'dark')) + '</article>';
    }) + '</div></section>';

    html += '<section class="ov-sec" id="compare">' + headLR(P.compareHead) + '<div class="ov-table-wrap"><table class="ov-table"><thead><tr><th>구성</th>' +
      list(P.compareCols, function (c) { return '<th>' + c + '</th>'; }) + '</tr></thead><tbody>' +
      list(P.compare, function (r) { return '<tr><th>' + r[0] + '</th>' + list(r.slice(1), function (c) { return '<td>' + c + '</td>'; }) + '</tr>'; }) +
      '</tbody></table></div></section>';

    html += '<section class="ov-sec">' + headLR(P.chooseHead) + '<div class="ov-use">' +
      list(P.choose, function (c) { return '<div><h3>' + c.title + '</h3><p>' + c.desc + '</p></div>'; }) + '</div></section>';

    html += '<section class="ov-sec ov-notice-sec"><div class="ov-notice"><h2>' + P.notice.title + '</h2><p>' + P.notice.desc + '</p></div></section>';

    html += '<section class="ov-final"><h2>' + P.final.title + '</h2><p>' + P.final.desc + '</p>' +
      (P.final.ask ? '<ul class="ask-list">' + list(P.final.ask, function (x) { return '<li>' + x + '</li>'; }) + '</ul>' : '') +
      a('kakao', P.final.button, 'btn brown big') +
      (P.final.brochure ? '<div class="brochure-link">' + a('brochure', P.final.brochure) + '</div>' : '') + '</section>';
    html += '<div class="footnote white"><ul>' + list(P.footnotes, function (x) { return '<li>' + x + '</li>'; }) + '</ul></div>';
    html += brandFooter('soft');
    return html;
  }

  // 메인·서비스안내 맨 아래 회사 한 줄 (원본 .nfm-footer)
  function brandFooter(mod) {
    return '<div class="brand-foot ' + (mod || '') + '"><div><b>' + D.brand.name + '</b> | ' + D.footer.desc + '</div><div>' + D.footer.people + '</div></div>';
  }

  var main = $('main');
  if (PAGE === 'review') main.innerHTML = archive(D.reviewPage, 'review');
  else if (PAGE === 'column') main.innerHTML = archive(D.columnPage, 'column');
  else if (PAGE === 'overview') main.innerHTML = overview();
  else main.innerHTML = home();

  /* ── 공통: 채널 링크 줄 + 하단 정보 (원본: 공유 아이콘 줄 + 이용약관 줄) ── */
  var ft = D.footer;
  $('footer').innerHTML =
    '<div class="share-row">' + list(ft.channels, function (x) { return a(x.href, x.label); }) + '</div>' +
    '<div class="foot-info"><span>' + D.brand.name + '</span><span>' + ft.people + '</span><span>이메일 ' + ft.email + '</span><span>연락처 ' + ft.phone + '</span>' +
    '<span>' + ft.address + '</span>' + (ft.bizInfo ? '<span>' + ft.bizInfo + '</span>' : '') + '</div>';

  // 떠 있는 상담 버튼
  var fl = $('floating');
  fl.href = D.links.kakao;
  fl.innerHTML = '<i>' + kakaoIcon + '</i><span><b>' + D.floating.title + '</b><span>' + D.floating.sub + '</span></span>';

  // 모바일 메뉴
  $('menuBtn').addEventListener('click', function () { $('gnb').classList.toggle('open'); });

  // 영상: 누르면 유튜브 재생
  var poster = $('poster');
  if (poster) poster.addEventListener('click', function () {
    this.outerHTML = '<iframe src="https://www.youtube.com/embed/' + D.video.youtubeId + '?autoplay=1&rel=0" title="소개 영상" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
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
