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

  /* ---------- data views (Hidden items never show) ---------- */
  var jobs = function () { return DB.jobs.filter(function (x) { return x.status !== 'Hidden'; }); };
  var services = function () { return DB.services.filter(function (x) { return x.status !== 'Hidden'; }); };
  var employees = function () { return DB.employees.filter(function (x) { return x.status !== 'Hidden'; }); };
  var businesses = function () { return DB.businesses.filter(function (x) { return x.status === 'Active'; }); };

  /* ---------- header / footer ---------- */
  var NAV = [['home','','Home'],['jobs','jobs/','Jobs'],['services','services/','Services'],
             ['employees','employees/','Employees'],['businesses','businesses/','Businesses'],['contact','contact/','Contact']];

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
         '<a class="btn sm pri" href="' + url('register/') + '">Register</a></div>' +
         '<button class="burger" id="burger" aria-label="Menu" aria-expanded="false">☰</button></div></header>';
    $('#hdr-slot').outerHTML = h;
    $('#burger').onclick = function () {
      var hd = $('#hdr'); var o = hd.classList.toggle('open');
      this.setAttribute('aria-expanded', o);
    };
  }

  function waLink(text) {
    return 'https://wa.me/' + SITE.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  function renderFooter() {
    var f = '<footer class="ftr"><div class="wrap"><div class="fg"><div>' + brandHTML() +
      '<p style="margin-top:12px;max-width:340px">Connecting people, supporting local businesses and creating digital opportunities across Bangladesh.</p></div>' +
      '<div><h4>Quick Links</h4>';
    NAV.forEach(function (n) { f += '<a href="' + url(n[1]) + '">' + n[2] + '</a>'; });
    f += '</div><div><h4>Contact</h4><a href="' + waLink('') + '" target="_blank" rel="noopener">WhatsApp</a>' +
         '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + '</a><a href="' + url('contact/') + '">Contact form</a></div></div>' +
         '<div class="copy">© ' + new Date().getFullYear() + ' DigiSER BD. All rights reserved.</div></div></footer>';
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
    var st = e.status === 'Available' ? '<span class="pill g">Available</span>' : '<span class="pill o">' + esc(e.status) + '</span>';
    return '<div class="emp"><div class="av" style="background:' + colorFor(e.name) + '">' + esc((e.name || '?').trim().charAt(0).toUpperCase()) + '</div>' +
      '<h3>' + esc(e.name) + '</h3><div class="rl">' + esc(e.role) + '</div>' +
      '<div class="rt"><b>★ ' + esc(e.rating) + '</b> (' + esc(e.reviews) + ') ' + st + '</div>' +
      '<a class="btn sm" href="' + url('contact/') + '?subject=' + encodeURIComponent('Hire: ' + e.name + ' (' + e.role + ')') + '">Contact</a></div>';
  }
  function bizRow(b) {
    return '<div class="row"><div class="ic">🏪</div><div class="mid"><h3>' + esc(b.name) + '</h3><div class="sub">' + esc(b.category) + ' · 📍 ' + esc(b.location) + '</div></div>' +
      '<div class="side"><a class="btn sm" href="' + url('contact/') + '?subject=' + encodeURIComponent('Business: ' + b.name) + '">Contact</a></div></div>';
  }
  function rows(list, fn, emptyText) {
    return list.length ? '<div class="rows">' + list.map(fn).join('') + '</div>' : '<div class="empty">' + emptyText + '</div>';
  }
  function cards(list, fn, emptyText) {
    return list.length ? '<div class="grid">' + list.map(fn).join('') + '</div>' : '<div class="empty">' + emptyText + '</div>';
  }
  function put(id, html) { var el = $('#' + id); if (el) el.innerHTML = html; }

  /* ---------- messages (saved for admin + sent via WhatsApp) ---------- */
  function saveMessage(name, contact, message) {
    DB = getDB();
    DB.messages.unshift({ id: 'm' + Date.now(), name: name, contact: contact, message: message, status: 'New' });
    saveDB(DB);
  }

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
        $('#q').placeholder = 'Search ' + tab + '...';
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
      var c = $('#count'); if (c) c.textContent = list.length + ' found';
    }
    if (q) q.oninput = draw;
    if (sel) sel.onchange = draw;
    draw();
  }

  function contact() {
    var subject = params.get('subject') || '';
    if (subject) $('#msg').value = subject + '\n\n';
    $('#cform').onsubmit = function (e) {
      e.preventDefault();
      var name = $('#name').value.trim(), contactVal = $('#contact').value.trim(), msg = $('#msg').value.trim();
      if (!name || !contactVal || !msg) return;
      saveMessage(name, contactVal, msg);
      var text = 'Hello DigiSER BD,\nName: ' + name + '\nContact: ' + contactVal + '\n\n' + msg;
      $('#ok').classList.add('show');
      $('#cform').reset();
      window.open(waLink(text), '_blank', 'noopener');
    };
  }

  function register() {
    $('#rform').onsubmit = function (e) {
      e.preventDefault();
      var name = $('#name').value.trim(), phone = $('#phone').value.trim(), email = $('#email').value.trim(), type = $('#type').value;
      if (!name || !phone) return;
      saveMessage(name, phone + (email ? ' / ' + email : ''), 'Registration request: ' + type);
      $('#ok').classList.add('show');
      $('#rform').reset();
    };
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
    };
  }

  /* ---------- boot ---------- */
  renderHeader();
  renderFooter();
  var wa = document.querySelectorAll('[data-wa]');
  wa.forEach(function (a) { a.href = waLink(''); a.target = '_blank'; a.rel = 'noopener'; });

  if (PAGE === 'home') home();
  if (PAGE === 'jobs') listPage(jobs, jobRow, 'No jobs match your search.', {filterKey: 'type'});
  if (PAGE === 'services') { $('#list').innerHTML = ''; listPage(services, svcCard, 'No services match your search.', {grid: true}); }
  if (PAGE === 'employees') listPage(employees, empCard, 'No employees match your search.', {grid: true});
  if (PAGE === 'businesses') { listPage(businesses, bizRow, 'No businesses listed yet. Be the first, list yours below.'); bizForm(); }
  if (PAGE === 'contact') contact();
  if (PAGE === 'register') register();
})();
