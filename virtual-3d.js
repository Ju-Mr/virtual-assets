/*
 * <virtual-3d> : scènes 3D au défilement pour le site Virtual (Wix Studio, élément personnalisé)
 *
 * Attributs :
 *   scene     home | classique | internationale | prestige | depot | homologation | ethanol | controles | auto
 *             "auto" déduit la scène de l'adresse de la page (/solutions/prestige -> prestige, etc.)
 *   base      dossier des modèles (défaut : dépôt GitHub Ju-Mr/virtual-assets, version v1)
 *   cta-href  lien du bouton principal (sans lien : le bouton fait défiler jusqu'à la suite de la page)
 *   alt-href  lien secondaire (accueil : dépôt-vente ; internationale : article douane). Masqué si absent,
 *             sauf sur l'accueil (défaut /solutions/depot-vente)
 *
 * Scènes "voiture" : l'élément remplit une section haute (environ 320 vh) et garde la voiture à l'écran.
 * Scène "controles" : le moteur suit tout le défilement de la page. Sur ordinateur, il s'affiche dans les
 * marges, par-dessus la page, sans bloquer les clics ; sur mobile et tablette, dans le cadre de l'élément.
 */
const DEFAULT_BASE = 'https://cdn.jsdelivr.net/gh/Ju-Mr/virtual-assets@v1/';
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/+esm';
const GLTF_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js/+esm';

const K = (p, ry, rx, d, y, x) => ({ p: p, ry: ry, rx: rx, d: d, y: y, x: x || 0 });
const HOME_KEYS = [K(0, -0.55, 0.10, 11.5, -0.75), K(0.47, 0.05, 0.04, 10.5, 0.55), K(1, 0.8, 0.14, 12, 0.55)];

const SCENES = {
  home: {
    model: 'bmw-m3-touring', len: 4.8, keys: HOME_KEYS,
    caps: [
      ['top', 0, 0.26, 'h1', 'Virtual.', 'Votre prochaine voiture. Trouvée, contrôlée, livrée.'],
      ['bottom', 0.34, 0.6, 'h2', 'Plus de 250 points de contrôle.', 'Mécanique, carrosserie, historique. Rapport complet sous 48 h.'],
      ['bottom', 0.68, 1.01, 'h2', 'Livrée devant chez vous.', 'Administratif compris. Partout en France.', 'Trouver mon véhicule', 'Vendre le mien']
    ],
    ctaDefault: '/nos-solutions', altDefault: '/solutions/depot-vente'
  },
  classique: {
    model: 'bmw-m3-touring', len: 4.8,
    keys: [K(0, 0.6, 0.10, 11.5, -0.75), K(0.47, 0.0, 0.04, 10.5, 0.55), K(1, -0.7, 0.12, 12, 0.55)],
    caps: [
      ['top', 0, 0.26, 'h1', 'Solution classique.', 'Votre prochaine voiture, trouvée dans plus de 15 pays européens.'],
      ['bottom', 0.34, 0.6, 'h2', 'Plus de 9 000 concessions partenaires.', 'Plus de choix. Mieux équipée. Au juste prix.'],
      ['bottom', 0.68, 1.01, 'h2', 'Livrée chez vous sous deux semaines.', 'Contrôlée, immatriculée, sans kilomètre parcouru.', 'Lancer ma recherche']
    ]
  },
  internationale: {
    model: 'ford-mustang-gt500', len: 4.8,
    keys: [K(0, -0.6, 0.10, 11.5, -0.75), K(0.47, -2.35, 0.10, 11, 0.55), K(1, -3.14, 0.04, 12, 0.55)],
    caps: [
      ['top', 0, 0.28, 'h1', 'Import USA et Canada.', 'RAM, Mustang, Challenger, Raptor.'],
      ['bottom', 0.36, 0.62, 'h2', 'Contrôlé sur place. Carfax clean.', 'Nos partenaires inspectent chaque véhicule avant son départ.'],
      ['bottom', 0.7, 1.01, 'h2', '0 % de droits de douane.', 'Pour les véhicules d’origine américaine, depuis le 1er juillet 2026.', 'Lancer ma recherche', 'Lire l’article']
    ]
  },
  prestige: {
    model: 'mercedes-amg-gt', len: 4.6,
    keys: [K(0, -0.5, 0.12, 11, -0.75), K(0.47, 0.35, 0.05, 10, 0.55), K(1, 1.3, 0.16, 11.5, 0.55)],
    caps: [
      ['top', 0, 0.3, 'h1', 'Prestige.', 'Les voitures qu’on ne trouve pas en ligne.'],
      ['bottom', 0.38, 0.64, 'h2', 'Une recherche, une voiture.', 'Séries limitées, configurations précises, historique irréprochable.'],
      ['bottom', 0.72, 1.01, 'h2', 'Sur demande. En toute discrétion.', '', 'Faire une demande confidentielle']
    ]
  },
  depot: {
    model: 'audi-rs6', len: 4.9,
    keys: [K(0, -0.55, 0.10, 11.5, -0.75), K(0.47, -2.5, 0.10, 11.5, 0.55), K(1, -3.4, 0.05, 12, 0.55)],
    caps: [
      ['top', 0, 0.3, 'h1', 'Dépôt-vente.', 'On vend votre voiture pour vous.'],
      ['bottom', 0.38, 0.64, 'h2', 'Plus de visibilité. Moins de contraintes.', 'Votre annonce profite de notre audience et de nos acheteurs en recherche.'],
      ['bottom', 0.72, 1.01, 'h2', 'Transaction sécurisée. Administratif compris.', '', 'Estimer mon véhicule']
    ]
  },
  homologation: {
    // la voiture "arrive" de la gauche, puis se tourne vers nous : l'arrivée en France
    model: 'ford-f150-raptor', len: 5.4, yaw: Math.PI,
    keys: [K(0, 0.0, 0.04, 12.5, -0.7, -1.25), K(0.5, 0.0, 0.05, 12, 0.55, 0), K(1, -0.62, 0.12, 11.5, 0.55, 0)],
    caps: [
      ['top', 0, 0.3, 'h1', 'Homologation.', 'Votre véhicule importé, conforme et immatriculé en France.'],
      ['bottom', 0.38, 0.64, 'h2', 'Mise en conformité. Dossier. Carte grise.', 'On s’occupe de tout, de l’étude à l’immatriculation.'],
      ['bottom', 0.72, 1.01, 'h2', 'Prête à rouler en France.', '', 'Demander un devis']
    ],
    badge: true
  },
  ethanol: {
    // vue de profil qui tourne vers l'arrière, avec une jauge E85 qui se remplit au défilement
    model: 'ford-f150-raptor', len: 5.4, yaw: Math.PI,
    keys: [K(0, 0.0, 0.04, 12.5, -0.7, -0.25), K(0.5, -2.6, 0.10, 12, 0.55, -0.25), K(1, -3.14, 0.05, 12.5, 0.55, -0.25)],
    caps: [
      ['top', 0, 0.3, 'h1', 'Conversion éthanol.', 'Roulez au superéthanol E85.'],
      ['bottom', 0.38, 0.64, 'h2', 'Boîtier homologué.', 'Compatibilité vérifiée, carte grise mise à jour.'],
      ['bottom', 0.72, 1.01, 'h2', 'Moins cher à la pompe.', 'Idéal pour les moteurs de forte cylindrée.', 'Demander un devis']
    ],
    gauge: true
  },
  controles: { model: 'v8-engine', engine: true }
};

const PATH_MAP = {
  'classique': 'classique', 'internationale': 'internationale', 'prestige': 'prestige', 'depot-vente': 'depot',
  'homologation': 'homologation', 'conversion-ethanol': 'ethanol', 'controles': 'controles'
};

const CSS = `
:host{display:block;width:100%;height:100%;position:relative;font-family:inherit}
.wrap{position:relative;width:100%;height:100%;background:#000;color:#f5f5f7;overflow:hidden}
.wrap.engine{background:transparent}
.pin{position:absolute;left:0;top:0;width:100%;height:100vh;will-change:transform;
  background:radial-gradient(60% 45% at 50% 72%,#3a3a40 0%,#141416 45%,#000 75%)}
.engine .pin{height:100%;background:transparent}
canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.ld{position:absolute;left:50%;top:55%;transform:translate(-50%,-50%);color:#6e6e73;font-size:14px;transition:opacity .4s;text-align:center}
.ld.hide{opacity:0}
.cap{position:absolute;left:0;right:0;top:9vh;text-align:center;padding:0 22px;opacity:0;pointer-events:none;will-change:opacity,transform}
.cap.bottom{top:auto;bottom:9vh}
.cap.on{pointer-events:auto}
h1,h2,p{margin:0}
h1,h2{font-weight:600;letter-spacing:-.032em;line-height:1.04;font-size:clamp(40px,6.6vw,84px)}
h2{font-size:clamp(30px,4.6vw,60px)}
p{font-size:clamp(18px,2.2vw,26px);color:#a1a1a6;margin-top:12px;font-weight:500;letter-spacing:-.015em}
.ctas{display:flex;gap:18px;justify-content:center;align-items:center;margin-top:24px;flex-wrap:wrap}
.pill{display:inline-flex;align-items:center;min-height:44px;padding:0 22px;border-radius:980px;background:#6d3cf0;color:#fff;font-size:17px;font-weight:500;text-decoration:none;border:0;cursor:pointer;font-family:inherit}
.pill:hover{background:#5b2bd6}
.more{color:#b995ff;font-size:17px;text-decoration:none}
.more::after{content:" \\203A"}
.more:hover{text-decoration:underline}
a:focus-visible,button:focus-visible{outline:2px solid #b995ff;outline-offset:3px;border-radius:6px}
.badge{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-6deg) scale(.9);opacity:0;border:2px solid #b995ff;color:#b995ff;border-radius:14px;padding:10px 18px;font-weight:600;font-size:clamp(15px,1.6vw,20px);letter-spacing:.02em;pointer-events:none;background:rgba(0,0,0,.35)}
.gauge{position:absolute;right:max(24px,6vw);top:50%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0;pointer-events:none}
.gauge .bar{width:10px;height:min(42vh,340px);border-radius:10px;background:rgba(255,255,255,.12);position:relative;overflow:hidden}
.gauge .fill{position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(0deg,#5b2bd6,#b995ff);border-radius:10px}
.gauge .lab{font-size:13px;color:#a1a1a6;font-weight:600;letter-spacing:.04em}
.gauge .val{font-size:22px;font-weight:600;color:#f5f5f7;font-variant-numeric:tabular-nums}
@media (max-width:760px){.gauge{right:16px}.gauge .bar{height:28vh}}
`;

function sstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

class Virtual3D extends HTMLElement {
  connectedCallback() {
    if (this._root) return;
    let key = (this.getAttribute('scene') || 'auto').trim();
    if (key === 'auto') {
      const parts = location.pathname.split('/').filter(Boolean);
      key = PATH_MAP[decodeURIComponent(parts[parts.length - 1] || '')] || '';
    }
    this._key = key;
    this._cfg = SCENES[key];
    this._root = this.attachShadow({ mode: 'open' });
    if (!this._cfg) {
      this._root.innerHTML = '';
      this.setAttribute('data-empty', 'true');
      return;
    }
    this._mobile = window.matchMedia('(max-width: 899px)').matches || window.matchMedia('(pointer: coarse)').matches;
    this._reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._cfg.engine ? this._buildEngine() : this._buildStage();
    this._cur = null;
    this._last = 0;
    const loop = (ts) => {
      if (this._dead) return;
      requestAnimationFrame(loop);
      this._frame(ts);
    };
    requestAnimationFrame(loop);
    this._init3D().catch(() => { if (this._ld) this._ld.textContent = 'Affichage 3D indisponible sur cet appareil'; });
  }

  disconnectedCallback() {
    this._dead = true;
    if (this._ro) this._ro.disconnect();
    if (this._overlay && this._overlay.parentNode) this._overlay.parentNode.removeChild(this._overlay);
  }

  _buildStage() {
    const cfg = this._cfg;
    const cta = this.getAttribute('cta-href') || cfg.ctaDefault || '';
    const alt = this.getAttribute('alt-href') || cfg.altDefault || '';
    const caps = cfg.caps.map((c) => {
      const [pos, a, b, tag, title, sub, ctaLabel, altLabel] = c;
      let btns = '';
      if (ctaLabel) {
        btns += cta ? `<a class="pill" href="${esc(cta)}">${esc(ctaLabel)}</a>` : `<button class="pill" type="button" data-next>${esc(ctaLabel)}</button>`;
      }
      if (altLabel && alt) btns += `<a class="more" href="${esc(alt)}">${esc(altLabel)}</a>`;
      return `<div class="cap ${pos === 'bottom' ? 'bottom' : ''}" data-a="${a}" data-b="${b}"><${tag}>${esc(title)}</${tag}>${sub ? `<p>${esc(sub)}</p>` : ''}${btns ? `<div class="ctas">${btns}</div>` : ''}</div>`;
    }).join('');
    const extra = (cfg.badge ? '<div class="badge">Homologuée · Immatriculée en France</div>' : '') +
      (cfg.gauge ? '<div class="gauge" aria-hidden="true"><div class="lab">E85</div><div class="bar"><div class="fill"></div></div><div class="val">0 %</div></div>' : '');
    this._root.innerHTML = `<style>${CSS}</style><div class="wrap"><div class="pin"><canvas aria-hidden="true"></canvas><div class="ld">Chargement du modèle 3D…</div>${extra}${caps}</div></div>`;
    this._wrap = this._root.querySelector('.wrap');
    this._pin = this._root.querySelector('.pin');
    this._canvas = this._root.querySelector('canvas');
    this._ld = this._root.querySelector('.ld');
    this._caps = Array.from(this._root.querySelectorAll('.cap'));
    this._badge = this._root.querySelector('.badge');
    this._gauge = this._root.querySelector('.gauge');
    this._fill = this._root.querySelector('.fill');
    this._gval = this._root.querySelector('.gauge .val');
    const nb = this._root.querySelector('[data-next]');
    if (nb) nb.addEventListener('click', () => {
      const r = this._wrap.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + r.bottom, behavior: this._reduce ? 'auto' : 'smooth' });
    });
  }

  _buildEngine() {
    this._root.innerHTML = `<style>${CSS}</style><div class="wrap engine"><div class="pin"><div class="ld">Chargement du moteur…</div></div></div>`;
    this._wrap = this._root.querySelector('.wrap');
    this._pin = this._root.querySelector('.pin');
    this._ld = this._root.querySelector('.ld');
    this._canvas = document.createElement('canvas');
    this._canvas.setAttribute('aria-hidden', 'true');
    this._overlayMode = !this._mobile;
    if (this._overlayMode) {
      // Sur ordinateur : calque fixé à l'écran, au-dessus de la page, qui laisse passer les clics
      const o = document.createElement('div');
      o.style.cssText = 'position:fixed;inset:0;z-index:30;pointer-events:none;';
      this._canvas.style.cssText = 'width:100%;height:100%;display:block;';
      o.appendChild(this._canvas);
      document.body.appendChild(o);
      this._overlay = o;
      this._wrap.style.minHeight = '1px';
      this._ld.style.display = 'none';
    } else {
      this._pin.appendChild(this._canvas);
    }
  }

  async _init3D() {
    const THREE = await import(THREE_URL);
    const { GLTFLoader } = await import(GLTF_URL);
    this._three = THREE;
    const r = new THREE.WebGLRenderer({ canvas: this._canvas, antialias: !this._mobile, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, this._mobile ? 1.5 : 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.0;
    r.setClearColor(0x000000, 0);
    this._r = r;
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(26, 1, 0.1, 200);
    this._scene = scene;
    this._cam = cam;

    const pm = new THREE.PMREMGenerator(r);
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.BoxGeometry(24, 12, 24), new THREE.MeshBasicMaterial({ color: 0x1c1c1f, side: THREE.BackSide })));
    const panel = (w, h, c, x, y, z, rx, ry) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
      m.position.set(x, y, z);
      m.rotation.set(rx || 0, ry || 0, 0);
      env.add(m);
    };
    panel(16, 4, 0xffffff, 0, 5.8, 0, Math.PI / 2, 0);
    panel(8, 3, 0xffffff, -11.8, 2.5, 0, 0, Math.PI / 2);
    panel(8, 3, 0xe9e9ee, 11.8, 2.5, 0, 0, -Math.PI / 2);
    panel(16, 2, 0xd8d8de, 0, 2, -11.8);
    scene.environment = pm.fromScene(env, 0.03).texture;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x303036, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(5, 8, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.8);
    fill.position.set(-6, 4, -5);
    scene.add(fill);

    this._holder = new THREE.Group();
    scene.add(this._holder);
    this._ro = new ResizeObserver(() => this._size());
    this._ro.observe(this._overlayMode ? this._overlay : this._pin);
    window.addEventListener('resize', () => this._size());
    this._size();

    const base = (this.getAttribute('base') || DEFAULT_BASE).replace(/\/?$/, '/');
    const file = base + this._cfg.model + (this._mobile ? '-mobile' : '') + '.glb';
    new GLTFLoader().load(file, (g) => (this._cfg.engine ? this._setupEngine(g) : this._setupCar(g)), undefined, () => {
      if (this._ld) { this._ld.style.display = ''; this._ld.textContent = 'Modèle 3D introuvable : ' + file; }
    });
  }

  _size() {
    if (!this._r) return;
    const box = this._overlayMode ? this._overlay : this._pin;
    const w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    this._r.setSize(w, h, false);
    this._cam.aspect = w / h;
    this._cam.fov = this._cfg.engine ? 30 : (w < 760 ? 38 : 26);
    this._cam.updateProjectionMatrix();
  }

  _setupCar(g) {
    const THREE = this._three;
    const cfg = this._cfg;
    const obj = g.scene;
    const inner = new THREE.Group();
    inner.add(obj);
    obj.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(obj);
    let size = box.getSize(new THREE.Vector3());
    if (size.z > size.x) inner.rotation.y = Math.PI / 2;
    inner.rotation.y += cfg.yaw || 0;
    inner.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(inner);
    size = box.getSize(new THREE.Vector3());
    inner.scale.setScalar(cfg.len / Math.max(size.x, size.z));
    inner.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(inner);
    const c = box.getCenter(new THREE.Vector3());
    inner.position.set(-c.x, -box.min.y, -c.z);
    obj.traverse((m) => {
      if (!m.isMesh) return;
      m.frustumCulled = false;
      (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => { if (x && x.isMeshStandardMaterial) x.envMapIntensity = 1.0; });
    });
    const cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    const ctx = cv.getContext('2d');
    const gr = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
    gr.addColorStop(0, 'rgba(0,0,0,.7)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, 256, 256);
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(cfg.len * 1.35, cfg.len * 0.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }));
    sh.rotation.x = -Math.PI / 2;
    sh.position.y = 0.005;
    const hold = new THREE.Group();
    hold.add(inner);
    hold.add(sh);
    this._holder.add(hold);
    this._ld.classList.add('hide');
  }

  _setupEngine(g) {
    const THREE = this._three;
    const obj = g.scene;
    const inner = new THREE.Group();
    inner.add(obj);
    this._holder.add(inner);
    const clip = g.animations && g.animations[0];
    if (clip) {
      this._mixer = new THREE.AnimationMixer(obj);
      const action = this._mixer.clipAction(clip);
      action.play();
      this._dur = clip.duration;
    }
        // cadrage sur le moteur monté (fin de l'animation) : les pièces arrivent de l'extérieur
    if (this._mixer) this._mixer.setTime(Math.max(0, this._dur - 0.001));
    obj.updateMatrixWorld(true);
    const union = new THREE.Box3().setFromObject(obj);
    const size = union.getSize(new THREE.Vector3());
    const c = union.getCenter(new THREE.Vector3());
    const s = 2.6 / Math.max(size.x, size.y, size.z);
    inner.scale.setScalar(s);
    inner.position.set(-c.x * s, -c.y * s, -c.z * s);
    obj.traverse((m) => {
      if (!m.isMesh) return;
      m.frustumCulled = false;
      (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => { if (x && x.isMeshStandardMaterial) x.envMapIntensity = 1.1; });
    });
    if (this._ld) this._ld.classList.add('hide');
    this._ready = true;
  }

  _frame(ts) {
    const dt = Math.min(0.05, (ts - this._last) / 1000 || 0.016);
    this._last = ts;
    if (this._cfg.engine) return this._frameEngine(dt);

    const rect = this._wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const pinH = this._pin.clientHeight;
    const top = Math.max(0, Math.min(rect.height - pinH, -rect.top));
    this._pin.style.transform = 'translateY(' + top + 'px)';
    if (rect.bottom < 0 || rect.top > vh) return;
    const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - pinH)));

    this._caps.forEach((cap) => {
      const a = +cap.dataset.a, b = +cap.dataset.b;
      const v = (a <= 0 ? 1 : sstep(a, a + 0.07, p)) * (b > 1 ? 1 : 1 - sstep(b - 0.07, b, p));
      cap.style.opacity = v.toFixed(3);
      cap.style.transform = this._reduce ? 'none' : 'translateY(' + ((1 - v) * 14).toFixed(1) + 'px)';
      cap.classList.toggle('on', v > 0.5);
    });
    if (this._badge) {
      const v = sstep(0.5, 0.62, p) * (1 - sstep(0.66, 0.72, p));
      this._badge.style.opacity = v.toFixed(3);
      this._badge.style.transform = 'translate(-50%,-50%) rotate(-6deg) scale(' + (0.9 + 0.1 * v).toFixed(3) + ')';
    }
    if (this._gauge) {
      const v = sstep(0.05, 0.15, p);
      const pct = Math.round(sstep(0.1, 0.9, p) * 100);
      this._gauge.style.opacity = v.toFixed(3);
      this._fill.style.height = pct + '%';
      this._gval.textContent = pct + ' %';
    }

    if (!this._r) return;
    const KEYS = this._cfg.keys;
    let i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
    const A = KEYS[i], B = KEYS[i + 1], t = sstep(A.p, B.p, p);
    const T = {};
    ['ry', 'rx', 'd', 'y', 'x'].forEach((k) => { T[k] = A[k] + (B[k] - A[k]) * t; });
    if (!this._cur) this._cur = T;
    const f = this._reduce ? 1 : 1 - Math.pow(0.0008, dt);
    ['ry', 'rx', 'd', 'y', 'x'].forEach((k) => { this._cur[k] += (T[k] - this._cur[k]) * f; });
    const mob = this._cam.aspect < 0.9;
    const halfW = Math.tan(this._cam.fov * Math.PI / 360) * this._cur.d * this._cam.aspect;
    this._holder.rotation.y = this._cur.ry;
    this._holder.rotation.x = this._cur.rx;
    this._holder.position.set(this._cur.x * halfW * (mob ? 0.6 : 1), this._cur.y * (mob ? 0.55 : 1), 0);
    this._cam.position.set(0, 1.1, this._cur.d * (mob ? 1.35 : 1));
    this._cam.lookAt(0, 0.55, 0);
    this._r.render(this._scene, this._cam);
  }

  _frameEngine(dt) {
    if (!this._r || !this._ready) return;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const target = Math.max(0, Math.min(1, window.scrollY / max));
    if (this._p == null) this._p = target;
    this._p += (target - this._p) * (this._reduce ? 1 : 1 - Math.pow(0.0005, dt));
    const p = this._p;
    if (this._mixer) this._mixer.setTime(Math.min(this._dur - 0.001, p * this._dur));

    const turns = 1.5;
    const ang = p * Math.PI * 2 * turns;
    let d = 11, x = 0, y = 0;
    if (this._overlayMode) {
      // spirale : va d'une marge à l'autre et s'éloigne quand il passe au centre, pour éviter les textes
      const swing = Math.cos(p * Math.PI * 3);
      const halfW0 = Math.tan(this._cam.fov * Math.PI / 360) * 11 * this._cam.aspect;
      x = swing * halfW0 * 0.68;
      d = 11 + (1 - Math.abs(swing)) * 9;
      y = Math.sin(p * Math.PI * 2) * 0.25;
    }
    this._holder.rotation.set(0.35 + Math.sin(ang) * 0.12, ang, 0);
    this._holder.position.set(x, y, 0);
    this._cam.position.set(0, 0.6, d);
    this._cam.lookAt(0, 0, 0);
    this._r.render(this._scene, this._cam);
  }
}

if (!customElements.get('virtual-3d')) customElements.define('virtual-3d', Virtual3D);
