/* =====================================================
   DigiSER BD - shared data
   1) SITE: contact info. WhatsApp number etc. shudhu ekhane bodlaben.
   2) getDB / saveDB: admin panel er shathe same storage key.
      Ekhon data browser e thake. Firebase jukto korle
      shudhu ei duita function bodlate hobe.
   ===================================================== */
window.SITE = {
  name: 'DigiSER BD',
  tagline: 'Job • Service • Growth',
  whatsapp: '8801719333614',        // WhatsApp button ei number e jabe (country code shoho, + chara)
  phone: '+880 1719-333614',
  email: 'info@digiserbd.com',      // <-- apnar asol email diye bodlan
  team: [
    {name: 'Helal', role: 'Founder', phone: '+880 1719-333614', wa: '8801719333614'},
    {name: 'SNK', role: 'Co-founder', phone: '+880 1705-633700', wa: '8801705633700'}
  ],
  address: 'Dhaka, Bangladesh'
};

(function () {
  var KEY = 'digiserbd_admin_v1';
  var DEFAULTS = {
    jobs: [
      {id:'j1',title:'Graphic Designer',company:'Creative Studio BD',type:'Full Time',location:'Dhaka, Bangladesh',salary:'৳15,000 – ৳25,000',status:'Active'},
      {id:'j2',title:'Social Media Manager',company:'Digital Growth Ltd.',type:'Part Time',location:'Dhaka, Bangladesh',salary:'৳10,000 – ৳18,000',status:'Active'},
      {id:'j3',title:'Web Developer',company:'Tech Solution BD',type:'Full Time',location:'Dhaka, Bangladesh',salary:'৳20,000 – ৳40,000',status:'Active'},
      {id:'j4',title:'Office Assistant',company:'Sunrise Trading',type:'Contract',location:'Dhaka, Bangladesh',salary:'৳8,000 – ৳12,000',status:'Active'}
    ],
    services: [
      {id:'s1',icon:'🎨',title:'Graphic Design',desc:'Logo, Banner, Social Media Post, Print Design and more.',price:'From ৳500',status:'Active'},
      {id:'s2',icon:'📱',title:'Social Media Management',desc:'Facebook, Instagram, YouTube, TikTok marketing and management.',price:'From ৳1,000',status:'Active'},
      {id:'s3',icon:'💻',title:'Website Maintenance',desc:'Website update, backup, security and content support.',price:'From ৳1,000',status:'Active'},
      {id:'s4',icon:'👨‍💼',title:'Employee Supplier',desc:'Skilled and unskilled manpower for your local business.',price:'Contact Us',status:'Active'},
      {id:'s5',icon:'🏠',title:'Land Supported Service',desc:'Land purchase, rent, document support and consultation.',price:'Contact Us',status:'Active'},
      {id:'s6',icon:'📈',title:'Digital Marketing',desc:'SEO, advertising, content and business lead generation.',price:'From ৳1,000',status:'Active'},
      {id:'s7',icon:'📝',title:'Data Entry & Admin Support',desc:'Data entry, Excel, PDF, virtual assistant support.',price:'From ৳500',status:'Active'},
      {id:'s8',icon:'🔧',title:'Other Local Services',desc:'Printing, delivery, event support and other local services.',price:'From ৳300',status:'Active'}
    ],
    employees: [
      {id:'e1',name:'Md. Rahman',role:'Graphic Designer',rating:'4.8',reviews:'24',phone:'',status:'Available'},
      {id:'e2',name:'Ayesha Akter',role:'Social Media Manager',rating:'4.7',reviews:'18',phone:'',status:'Available'},
      {id:'e3',name:'Tariq Hasan',role:'Web Developer',rating:'4.9',reviews:'32',phone:'',status:'Available'},
      {id:'e4',name:'Nusrat Jahan',role:'Content Writer',rating:'4.6',reviews:'21',phone:'',status:'Available'},
      {id:'e5',name:'Rasel Ahmed',role:'Data Entry Operator',rating:'4.5',reviews:'16',phone:'',status:'Available'},
      {id:'e6',name:'Shamim Hossain',role:'Video Editor',rating:'4.7',reviews:'14',phone:'',status:'Available'}
    ],
    businesses: [],
    messages: []
  };

  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  window.getDB = function () {
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    var db = {};
    for (var k in DEFAULTS) {
      db[k] = stored && Array.isArray(stored[k]) ? stored[k] : clone(DEFAULTS[k]);
    }
    return db;
  };

  window.saveDB = function (db) {
    try { localStorage.setItem(KEY, JSON.stringify(db)); return true; } catch (e) { return false; }
  };
})();
