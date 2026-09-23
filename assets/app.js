(function () {
  var body = document.body;
  var ROOT = body.dataset.root || '';
  var PAGE = body.dataset.page || 'home';
  var DB = getDB();

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  };
  var url = function (p) { return (ROOT + p) || './'; };
  var params = new URLSearchParams(location.search);

  /* ---------- language (English default, Bangla switch) ---------- */
  var LANG = 'en';
  try { LANG = localStorage.getItem('digiserbd_lang') || 'en'; } catch (e) {}
  var BNX = window.BN || {};
  var T = function (s) { return (LANG === 'bn' && BNX[s]) ? BNX[s] : s; };

  function translateAll() {
    if (LANG !== 'bn') return;
    document.documentElement.lang = 'bn';
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (node) {
      var p = node.parentNode && node.parentNode.nodeName;
      if (p === 'SCRIPT' || p === 'STYLE') return;
      var k = node.nodeValue.trim();
      if (k && BNX[k]) node.nodeValue = node.nodeValue.replace(k, BNX[k]);
    });
    document.querySelectorAll('[placeholder]').forEach(function (el) {
      var k = el.getAttribute('placeholder'); if (BNX[k]) el.setAttribute('placeholder', BNX[k]);
    });
    document.querySelectorAll('.lang-en').forEach(function (e) { e.hidden = true; });
    document.querySelectorAll('.lang-bn').forEach(function (e) { e.hidden = false; });
  }

  /* ---------- data views (Hidden/Draft items never show) ---------- */
  var jobs = function () { return DB.jobs.filter(function (x) { return x.status !== 'Hidden'; }); };
  var services = function () { return DB.services.filter(function (x) { return x.status !== 'Hidden'; }); };
  var employees = function () { return DB.employees.filter(function (x) { return x.status !== 'Hidden'; }); };
  var businesses = function () { return DB.businesses.filter(function (x) { return x.status === 'Active'; }); };
  var posts = function () {
    return DB.blog.filter(function (x) { return x.status === 'Published'; })
      .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  };

  /* ---------- header / footer ---------- */
  var NAV = [['home','','Home'],['jobs','jobs/','Jobs'],['services','services/','Services'],
             ['employees','employees/','Employees'],['businesses','businesses/','Businesses'],
             ['blog','blog/','Blog'],['contact','contact/','Contact']];

  function brandHTML() {
    return '<a class="brand" href="' + url('') + '"><img src="' + url('logo.png') + '" alt="DigiSER BD logo" width="40" height="40">' +
           '<span class="logo-t">DigiSER BD<small>' + esc(SITE.tagline) + '</small></span></a>';
  }

  function renderHeader() {
    var h = '<header class="hdr" id="hdr"><div class="wrap">' + brandHTML() + '<nav class="nav" aria-label="Main">';
    NAV.forEach(function (n) {
      h += '<a href="' + url(n[1]) + '"' + (n[0] === PAGE ? ' class="on" aria-current="page"' : '') + '>' + n[2] + '</a>';
    });
    h += '</nav><div class="acts"><a class="btn sm" href="' + url('login/') + '">Login</a>' +
         '<a class="btn sm pri" href="' + url('register/') + '">Register</a>' +
         '<button class="btn sm lang" id="lang" type="button" aria-label="Language">' + (LANG === 'bn' ? 'EN' : 'বাংলা') + '</button></div>' +
         '<button class="burger" id="burger" aria-label="Menu" aria-expanded="false">☰</button></div></header>';
    $('#hdr-slot').outerHTML = h;
    $('#burger').onclick = function () {
      var hd = $('#hdr'); var o = hd.classList.toggle('open');
      this.setAttribute('aria-expanded', o);
    };
    $('#lang').onclick = function () {
      try { localStorage.setItem('digiserbd_lang', LANG === 'bn' ? 'en' : 'bn'); } catch (e) {}
      location.reload();
    };
  }

  function waLink(text) {
    return 'https://wa.me/' + SITE.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  function renderFooter() {
    var f = '<footer class="ftr"><div class="wrap"><div class="fg"><div>' + brandHTML() +
      '<p style="margin-top:12px;max-width:340px">Connecting people, supporting local businesses and creating digital opportunities across Bangladesh.</p></div>' +
      '<div><h4>Quick Links</h4>';
    NAV.forEach(function (n) { if (n[0] !== 'contact') f += '<a href="' + url(n[1]) + '">' + n[2] + '</a>'; });
    f += '</div><div><h4>Company</h4><a href="' + url('about/') + '">About us</a><a href="' + url('privacy/') + '">Privacy Policy</a>' +
         '<a href="' + url('terms/') + '">Terms of Use</a><a href="' + url('contact/') + '">Contact</a></div>' +
         '<div><h4>Reach us</h4><a href="' + waLink('') + '" target="_blank" rel="noopener">WhatsApp</a>' +
         '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + '</a></div></div>' +
         '<div class="copy">© ' + new Date().getFullYear() + ' DigiSER BD. ' + T('All rights reserved.') + '</div></div></footer>';
    $('#ftr-slot').outerHTML = f;
  }

  /* ---------- small builders ---------- */
  var COLORS = ['#0087c4','#12805c','#b4530a','#7b3fa0','#c0392b','#0b2233'];
  function colorFor(s) { var n = 0; for (var i = 0; i < s.length; i++) n += s.charCodeAt(i); return COLORS[n % COLORS.length]; }
  function jobIcon(j) {
    var t = (j.title || '').toLowerCase();
    if (/design/.test(t)) return '🎨'; if (/social|market/.test(t)) return '📱';
    if (/web|develop|software/.test(t)) return '💻'; if (/data|office|assist|admin/.test(t)) return '🧑‍💼';
    return '💼';
  }
  function jobRow(j) {
    return '<div class="row"><div class="ic">' + jobIcon(j) + '</div><div class="mid"><h3>' + esc(j.title) + '</h3>' +
      '<div class="sub">' + esc(j.company) + ' · 📍 ' + esc(j.location) + '</div></div>' +
      '<div class="side"><div><span class="pill">' + esc(j.type) + '</span><span class="sal">' + esc(j.salary) + '</span></div>' +
      '<a class="btn sm pri" href="' + url('contact/') + '?subject=' + encodeURIComponent('Apply: ' + j.title + ' (' + j.company + ')') + '">Apply Now</a></div></div>';
  }
  function svcCard(s) {
    return '<div class="svc"><div class="ic">' + esc(s.icon) + '</div><h3>' + esc(s.title) + '</h3><p>' + esc(s.desc) + '</p>' +
      '<div class="pr">' + esc(s.price) + '</div><a class="btn sm" href="' + url('contact/') + '?subject=' + encodeURIComponent('Service: ' + s.title) + '">Get this service</a></div>';
  }
  function empCard(e) {
    var st = e.status === 'Available' ? '<span class="pill g">' + esc(e.status) + '</span>' : '<span class="pill o">' + esc(e.status) + '</span>';
    return '<div class="emp" data-emp="' + esc(e.id) + '"><div class="av" style="background:' + colorFor(e.name) + '">' + esc((e.name || '?').trim().charAt(0).toUpperCase()) + '</div>' +
      '<h3>' + esc(e.name) + '</h3><div class="rl">' + esc(e.role) + '</div>' +
      '<div class="rt"><b>★ ' + esc(e.rating) + '</b> (' + esc(e.reviews) + ') ' + st + '</div>' +
      '<a class="btn sm" href="' + url('contact/') + '?subject=' + encodeURIComponent('Hire: ' + e.name + ' (' + e.role + ')') + '" onclick="event.stopPropagation()">Contact</a></div>';
  }
  function bizRow(b) {
    return '<div class="row"><div class="ic">🏪</div><div class="mid"><h3>' + esc(b.name) + '</h3><div class="sub">' + esc(b.category) + ' · 📍 ' + esc(b.location) + '</div></div>' +
      '<div class="side"><a class="btn sm" href="' + url('contact/') + '?subject=' + encodeURIComponent('Business: ' + b.name) + '">Contact</a></div></div>';
  }
  function postRow(p) {
    return '<div class="row"><div class="ic">📝</div><div class="mid"><h3><a href="' + url('blog/') + '?p=' + encodeURIComponent(p.id) + '">' + esc(p.title) + '</a></h3>' +
      '<div class="sub">' + esc(p.category) + ' · ' + esc(p.date) + '</div><p class="sum">' + esc(p.summary) + '</p></div>' +
      '<div class="side"><a class="btn sm" href="' + url('blog/') + '?p=' + encodeURIComponent(p.id) + '">Read more</a></div></div>';
  }
  function rows(list, fn, emptyText) {
    return list.length ? '<div class="rows">' + list.map(fn).join('') + '</div>' : '<div class="empty">' + emptyText + '</div>';
  }
  function cards(list, fn, emptyText) {
    return list.length ? '<div class="grid">' + list.map(fn).join('') + '</div>' : '<div class="empty">' + emptyText + '</div>';
  }
  function put(id, html) { var el = $('#' + id); if (el) el.innerHTML = html; }

  /* ---------- sending: WhatsApp is the real channel for now ---------- */
  function saveMessage(name, contact, message) {
    DB = getDB();
    DB.messages.unshift({ id: 'm' + Date.now(), name: name, contact: contact, message: message, status: 'New' });
    saveDB(DB);
  }
  function toWhatsApp(text) { window.open(waLink(text), '_blank', 'noopener'); }

  /* ---------- pages ---------- */
  function home() {
    var open = jobs().slice(0, 3);
    put('live', open.length ? open.map(function (j) {
      return '<a href="' + url('jobs/') + '"><b>' + esc(j.title) + '</b><span>' + esc(j.company) + ' · ' + esc(j.salary) + '</span></a>';
    }).join('') : '<span>No open jobs right now.</span>');
    put('homeServices', cards(services().slice(0, 8), svcCard, 'No services yet.'));
    put('homeJobs', rows(jobs().slice(0, 4), jobRow, 'No open jobs right now.'));
    put('homeEmployees', cards(employees().slice(0, 6), empCard, 'No employees listed yet.'));

    var tab = 'jobs';
    var tabs = document.querySelectorAll('.tabs button');
    tabs.forEach(function (b) {
      b.onclick = function () {
        tab = b.dataset.t;
        tabs.forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
        $('#q').placeholder = T('Search ' + tab + '...');
      };
    });
    $('#searchForm').onsubmit = function (e) {
      e.preventDefault();
      var q = $('#q').value.trim();
      location.href = url(tab + '/') + (q ? '?q=' + encodeURIComponent(q) : '');
    };
  }

  function listPage(getList, fn, emptyText, opts) {
    var q = $('#q'), sel = $('#f');
    if (q && params.get('q')) q.value = params.get('q');
    function draw() {
      var term = (q ? q.value : '').toLowerCase().trim();
      var val = sel ? sel.value : '';
      var list = getList().filter(function (x) {
        if (term && JSON.stringify(x).toLowerCase().indexOf(term) < 0) return false;
        if (val && opts && opts.filterKey && x[opts.filterKey] !== val) return false;
        return true;
      });
      put('list', (opts && opts.grid ? cards : rows)(list, fn, emptyText));
      var c = $('#count'); if (c) c.textContent = LANG === 'bn' ? list.length + 'টি পাওয়া গেছে' : list.length + ' found';
      translateAll();
    }
    if (q) q.oninput = draw;
    if (sel) sel.onchange = draw;
    draw();
  }

  function blog() {
    var id = params.get('p');
    var post = id ? posts().filter(function (x) { return x.id === id; })[0] : null;
    if (post) {
      document.title = post.title + ' | DigiSER BD';
      var paras = String(post.content).split(/\n\s*\n/).map(function (t) { return '<p>' + esc(t).replace(/\n/g, '<br>') + '</p>'; }).join('');
      put('list', '<article class="prose"><p><a class="more" href="' + url('blog/') + '">← Back to blog</a></p><h1>' + esc(post.title) + '</h1>' +
        '<p class="meta">' + esc(post.category) + ' · ' + esc(post.author) + ' · ' + esc(post.date) + '</p>' + paras + '</article>');
      var hd = $('#blogHead'); if (hd) hd.hidden = true;
    } else {
      put('list', rows(posts(), postRow, 'No posts yet.'));
    }
  }

  function contact() {
    var subject = params.get('subject') || '';
    if (subject) $('#msg').value = subject + '\n\n';
    $('#cform').onsubmit = function (e) {
      e.preventDefault();
      var name = $('#name').value.trim(), contactVal = $('#contact').value.trim(), msg = $('#msg').value.trim();
      if (!name || !contactVal || !msg) return;
      saveMessage(name, contactVal, msg);
      $('#ok').classList.add('show');
      $('#cform').reset();
      toWhatsApp('Hello DigiSER BD,\nName: ' + name + '\nContact: ' + contactVal + '\n\n' + msg);
    };
  }

  function val(id) { var el = $('#' + id); return el ? el.value.trim() : ''; }
  function chk(id) { var el = $('#' + id); return el && el.checked; }

  function register() {
    $('#rform').onsubmit = function (e) {
      e.preventDefault();
      var name = val('name'), phone = val('phone');
      if (!name || !phone || !chk('declare')) return;
      var jtypeEl = document.querySelector('input[name="jtype"]:checked');
      var profile = {
        id: 'u' + Date.now(), status: 'Available', updated: new Date().toISOString().slice(0, 10),
        personal: { name: name, father: val('father'), mother: val('mother'), dob: val('dob'), nid: val('nid'),
          phone: phone, emergency: val('emergency'), email: val('email'), address: val('address'), permanent: val('permanent') },
        education: {
          ssc: { inst: val('edu_ssc_inst'), sub: val('edu_ssc_sub'), res: val('edu_ssc_res'), year: val('edu_ssc_year') },
          hsc: { inst: val('edu_hsc_inst'), sub: val('edu_hsc_sub'), res: val('edu_hsc_res'), year: val('edu_hsc_year') },
          grad: { inst: val('edu_grad_inst'), sub: val('edu_grad_sub'), res: val('edu_grad_res'), year: val('edu_grad_year') },
          other: { inst: val('edu_other_inst'), sub: val('edu_other_sub'), res: val('edu_other_res'), year: val('edu_other_year') }
        },
        experience: { inst: val('exp_inst'), role: val('exp_role'), period: val('exp_period'), duty: val('exp_duty'), salary: val('exp_salary') },
        skills: { computer: chk('sk_computer'), word: chk('sk_word'), excel: chk('sk_excel'), internet: chk('sk_internet'), design: chk('sk_design'), social: chk('sk_social') },
        language: { bn: { rw: val('lang_bn_rw'), sp: val('lang_bn_sp') }, en: { rw: val('lang_en_rw'), sp: val('lang_en_sp') }, other: val('lang_other') },
        wanted: { role: val('want_role'), salary: val('want_salary'), type: jtypeEl ? jtypeEl.value : '', location: val('want_loc') },
        reference: { name: val('ref_name'), role: val('ref_role'), inst: val('ref_inst'), phone: val('ref_phone') },
        attachments: { photo: chk('att_photo'), nid: chk('att_nid'), cert: chk('att_cert'), exp: chk('att_exp'), other: val('att_other') }
      };
      DB = getDB();
      DB.users = DB.users.filter(function (u) { return u.personal.phone !== phone; });
      DB.users.unshift(profile);
      saveDB(DB);
      $('#ok').classList.add('show');

      var lines = [
        'নতুন আবেদন - DigiSER BD',
        'নাম: ' + name, 'মোবাইল: ' + phone,
        val('email') ? 'ই-মেইল: ' + val('email') : '', val('address') ? 'ঠিকানা: ' + val('address') : '',
        val('want_role') ? 'আবেদনকৃত পদ: ' + val('want_role') : '', val('want_salary') ? 'প্রত্যাশিত বেতন: ' + val('want_salary') : '',
        jtypeEl ? 'কাজের ধরন: ' + jtypeEl.value : '', val('want_loc') ? 'কাজের স্থান পছন্দ: ' + val('want_loc') : '',
        val('exp_inst') ? 'অভিজ্ঞতা: ' + val('exp_role') + ' - ' + val('exp_inst') + ' (' + val('exp_period') + ')' : '',
        val('edu_grad_inst') ? 'স্নাতক: ' + val('edu_grad_sub') + ', ' + val('edu_grad_inst') + ' (' + val('edu_grad_year') + ')' : ''
      ].filter(Boolean);
      toWhatsApp(lines.join('\n'));
    };
  }

  function login() {
    var found = null;
    $('#lookupForm').onsubmit = function (e) {
      e.preventDefault();
      var phone = val('lphone');
      DB = getDB();
      found = DB.users.filter(function (u) { return u.personal && u.personal.phone === phone; })[0];
      if (!found) { $('#lerr').classList.add('show'); $('#editForm').style.display = 'none'; return; }
      $('#lerr').classList.remove('show');
      $('#e_name').value = found.personal.name || '';
      $('#e_phone').value = found.personal.phone || '';
      $('#e_emergency').value = found.personal.emergency || '';
      $('#e_email').value = found.personal.email || '';
      $('#e_address').value = found.personal.address || '';
      $('#e_status').value = found.status || 'Available';
      $('#editForm').style.display = 'block';
    };
    $('#editForm').onsubmit = function (e) {
      e.preventDefault();
      if (!found) return;
      found.personal.name = val('e_name'); found.personal.phone = val('e_phone');
      found.personal.emergency = val('e_emergency'); found.personal.email = val('e_email');
      found.personal.address = val('e_address'); found.status = $('#e_status').value;
      found.updated = new Date().toISOString().slice(0, 10);
      saveDB(DB);
      $('#eok').classList.add('show');
    };
  }

  function empModal(e) {
    var st = e.status === 'Available' ? 'উপলব্ধ আছে' : (e.status || '');
    var m = document.createElement('div');
    m.className = 'modal open';
    m.innerHTML = '<div class="mbox"><button class="x" aria-label="Close">&times;</button>' +
      '<div class="av" style="background:' + colorFor(e.name) + '">' + esc((e.name || '?').charAt(0).toUpperCase()) + '</div>' +
      '<h3>' + esc(e.name) + '</h3><div class="rl">' + esc(e.role) + '</div>' +
      '<p>★ ' + esc(e.rating) + ' (' + esc(e.reviews) + ' reviews)</p>' +
      '<p>অবস্থা: <b>' + esc(st) + '</b></p>' +
      (e.phone ? '<p>ফোন: ' + esc(e.phone) + '</p>' : '') +
      '<div class="acts"><a class="btn pri sm" href="' + url('contact/') + '?subject=' + encodeURIComponent('Hire: ' + e.name + ' (' + e.role + ')') + '">Contact</a></div></div>';
    document.body.appendChild(m);
    var close = function () { m.remove(); };
    m.querySelector('.x').onclick = close;
    m.onclick = function (ev) { if (ev.target === m) close(); };
  }

  function bizForm() {
    var f = $('#bform'); if (!f) return;
    f.onsubmit = function (e) {
      e.preventDefault();
      var name = $('#bname').value.trim(), phone = $('#bphone').value.trim(), cat = $('#bcat').value.trim();
      if (!name || !phone) return;
      saveMessage(name, phone, 'List my business. Category: ' + (cat || '-'));
      $('#bok').classList.add('show');
      f.reset();
      toWhatsApp('Hello DigiSER BD, I want to list my business.\nBusiness: ' + name + '\nPhone: ' + phone + '\nCategory: ' + (cat || '-'));
    };
  }

  /* ---------- boot ---------- */
  renderHeader();
  renderFooter();
  document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = waLink(''); a.target = '_blank'; a.rel = 'noopener'; });

  document.addEventListener('click', function (ev) {
    var card = ev.target.closest('[data-emp]');
    if (!card) return;
    var emp = employees().filter(function (x) { return x.id === card.dataset.emp; })[0];
    if (emp) empModal(emp);
  });

  if (PAGE === 'home') home();
  if (PAGE === 'jobs') listPage(jobs, jobRow, 'No jobs match your search.', {filterKey: 'type'});
  if (PAGE === 'services') listPage(services, svcCard, 'No services match your search.', {grid: true});
  if (PAGE === 'employees') listPage(employees, empCard, 'No employees match your search.', {grid: true});
  if (PAGE === 'businesses') { listPage(businesses, bizRow, 'No businesses listed yet. Be the first, list yours below.'); bizForm(); }
  if (PAGE === 'blog') blog();
  if (PAGE === 'contact') contact();
  if (PAGE === 'register') register();
  if (PAGE === 'login') login();
  translateAll();
})();
