const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ margin: 0, size: 'A4' });
const outputPath = path.join(__dirname, 'assets', 'Resume-Victor.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// ── Colours (Sample 1 — Dark Minimal) ─────────────────────────────────────
const BG       = '#1C1C1E';
const SIDEBAR  = '#141416';
const ACCENT   = '#93C5FD';
const WHITE    = '#FFFFFF';
const LIGHT    = '#E5E7EB';
const MID      = '#9CA3AF';
const RULE     = '#2D2D30';

// ── Dimensions ─────────────────────────────────────────────────────────────
const PW     = doc.page.width;   // 595.28
const PH     = doc.page.height;  // 841.89
const SB_W   = 175;              // sidebar width
const MAIN_X = SB_W + 20;
const MAIN_W = PW - MAIN_X - 24;
const SB_PAD = 16;

// ── Georgia Italic for name accent ─────────────────────────────────────────
const GEORGIA_ITALIC = 'C:\\Windows\\Fonts\\georgiai.ttf';
doc.registerFont('Georgia-Italic', GEORGIA_ITALIC);

// ── Helpers ────────────────────────────────────────────────────────────────
function drawBg() {
  doc.rect(0, 0, PW, PH).fill(BG);
  doc.rect(0, 0, SB_W, PH).fill(SIDEBAR);
}

function sideTitle(text, y) {
  doc.font('Helvetica-Bold').fontSize(7).fillColor(ACCENT)
     .text(text.toUpperCase(), SB_PAD, y, { characterSpacing: 1.6, width: SB_W - SB_PAD * 2 });
  doc.rect(SB_PAD, doc.y + 3, SB_W - SB_PAD * 2, 0.5).fill(RULE);
  return doc.y + 8;
}

function mainTitle(text, y) {
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(ACCENT)
     .text(text.toUpperCase(), MAIN_X, y, { characterSpacing: 1.6, width: MAIN_W });
  doc.rect(MAIN_X, doc.y + 3, MAIN_W, 0.5).fill(RULE);
  return doc.y + 8;
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 1
// ══════════════════════════════════════════════════════════════════════════
drawBg();

// ── SIDEBAR ────────────────────────────────────────────────────────────────

// Profile photo
const IMG_PATH = path.join(__dirname, 'assets', 'img', 'IMG_3844.JPG-Photoroom.png');
const IMG_SIZE = 80;
const IMG_X    = (SB_W - IMG_SIZE) / 2;
const IMG_Y    = 24;

if (fs.existsSync(IMG_PATH)) {
  doc.save();
  doc.circle(IMG_X + IMG_SIZE / 2, IMG_Y + IMG_SIZE / 2, IMG_SIZE / 2).clip();
  doc.image(IMG_PATH, IMG_X, IMG_Y, { width: IMG_SIZE, height: IMG_SIZE });
  doc.restore();
  doc.circle(IMG_X + IMG_SIZE / 2, IMG_Y + IMG_SIZE / 2, IMG_SIZE / 2)
     .lineWidth(1.5).strokeColor(ACCENT).stroke();
}

// Name under photo
doc.font('Helvetica-Bold').fontSize(11).fillColor(WHITE)
   .text('Victor Ajibade', SB_PAD, IMG_Y + IMG_SIZE + 10,
         { width: SB_W - SB_PAD * 2, align: 'center' });

// Roles — one per line to avoid breaking
const roles = [
  'Web Developer',
  'Virtual Assistant',
  'Data Analyst',
  'Graphic Designer',
  'Content Writer',
];
let roleY = doc.y + 5;
roles.forEach(role => {
  doc.font('Helvetica').fontSize(7).fillColor(ACCENT)
     .text(role, SB_PAD, roleY, { width: SB_W - SB_PAD * 2, align: 'center', lineBreak: false });
  roleY += 11;
});

let sideY = roleY + 10;

// ── CONTACT ────────────────────────────────────────────────────────────────
sideY = sideTitle('Contact', sideY);

const contacts = [
  { label: 'Email',    display: 'connect@victorblessed.com', url: 'mailto:connect@victorblessed.com' },
  { label: 'Web',      display: 'www.victorblessed.com',     url: 'https://victorblessed.com' },
  { label: 'LinkedIn', display: 'linkedin.com/in/victorblessed', url: 'https://linkedin.com/in/victorblessed' },
  { label: 'Fiverr',   display: 'fiverr.com/vickyscripts',   url: 'https://www.fiverr.com/vickyscripts' },
];
contacts.forEach(c => {
  doc.font('Helvetica-Bold').fontSize(7).fillColor(ACCENT)
     .text(c.label, SB_PAD, sideY, { width: SB_W - SB_PAD * 2 });
  sideY = doc.y;
  doc.font('Helvetica').fontSize(7).fillColor(LIGHT)
     .text(c.display, SB_PAD, sideY, { width: SB_W - SB_PAD * 2, lineGap: 1, link: c.url, underline: false });
  sideY = doc.y + 4;
});

sideY += 8;

// ── SKILLS ─────────────────────────────────────────────────────────────────
sideY = sideTitle('Skills', sideY);

const skillGroups = [
  { label: 'Web Development', items: 'HTML5, CSS3, JavaScript, React, Node.js' },
  { label: 'Data Analysis', items: 'Excel, SQL, Power BI, Reporting' },
  { label: 'Virtual Assistance', items: 'Streamline, Cloudbeds, Remote Ops' },
  { label: 'Content Writing', items: 'Articles, Scripts, Whitepapers' },
  { label: 'Graphic Design', items: 'Branding, Layouts, Visual Identity' },
  { label: 'E-commerce', items: 'Shopify, WooCommerce, Custom Builds' },
];

skillGroups.forEach(sg => {
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(LIGHT)
     .text(sg.label, SB_PAD, sideY, { width: SB_W - SB_PAD * 2 });
  sideY = doc.y + 1;
  doc.font('Helvetica').fontSize(7).fillColor(MID)
     .text(sg.items, SB_PAD, sideY, { width: SB_W - SB_PAD * 2, lineGap: 2 });
  sideY = doc.y + 6;
});

sideY += 4;

// ── EDUCATION ──────────────────────────────────────────────────────────────
sideY = sideTitle('Education', sideY);

const education = [
  { degree: 'B.Ed. English Language', school: 'Obafemi Awolowo University', year: '2017 – 2020' },
  { degree: 'High School Certificate', school: 'Osogbo Grammar School', year: '2007 – 2010' },
];

education.forEach(e => {
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(LIGHT)
     .text(e.degree, SB_PAD, sideY, { width: SB_W - SB_PAD * 2 });
  sideY = doc.y + 1;
  doc.font('Helvetica').fontSize(7).fillColor(ACCENT)
     .text(e.school, SB_PAD, sideY, { width: SB_W - SB_PAD * 2 });
  sideY = doc.y + 1;
  doc.font('Helvetica').fontSize(7).fillColor(MID)
     .text(e.year, SB_PAD, sideY, { width: SB_W - SB_PAD * 2 });
  sideY = doc.y + 8;
});

sideY += 4;

// ── CERTIFICATIONS ─────────────────────────────────────────────────────────
sideY = sideTitle('Certifications', sideY);

const certs = [
  { name: 'Virtual Assistant Programme', issuer: 'ALX Africa', year: 'Sep – Oct 2024 · 8 Weeks' },
  { name: 'Complete Web Dev Bootcamp', issuer: 'Udemy · Dr. Angela Yu', year: '2023' },
];

certs.forEach(c => {
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(LIGHT)
     .text(c.name, SB_PAD, sideY, { width: SB_W - SB_PAD * 2 });
  sideY = doc.y + 1;
  doc.font('Helvetica').fontSize(7).fillColor(ACCENT)
     .text(c.issuer, SB_PAD, sideY, { width: SB_W - SB_PAD * 2 });
  sideY = doc.y + 1;
  doc.font('Helvetica').fontSize(7).fillColor(MID)
     .text(c.year, SB_PAD, sideY, { width: SB_W - SB_PAD * 2 });
  sideY = doc.y + 8;
});

// ── MAIN CONTENT ───────────────────────────────────────────────────────────

// Name header — both words on same baseline
const NAME_Y = 28;
// Measure width of "Victor " to position Ajibade right after
doc.font('Helvetica-Bold').fontSize(28).fillColor(WHITE)
   .text('Victor', MAIN_X, NAME_Y, { lineBreak: false });
const victorWidth = doc.widthOfString('Victor') + 6;
doc.font('Georgia-Italic').fontSize(28).fillColor(ACCENT)
   .text('Ajibade', MAIN_X + victorWidth, NAME_Y, { lineBreak: false });

// Role tagline — fixed Y below name
const TAGLINE_Y = NAME_Y + 36;
doc.font('Helvetica').fontSize(7.5).fillColor(MID)
   .text('Web Developer  ·  Virtual Assistant  ·  Data Analyst  ·  Graphic Designer  ·  Content Writer',
         MAIN_X, TAGLINE_Y, { width: MAIN_W, lineGap: 3 });

// Divider
const DIVIDER_Y = TAGLINE_Y + 22;
doc.rect(MAIN_X, DIVIDER_Y, MAIN_W, 0.5).fill(RULE);

let mainY = DIVIDER_Y + 14;

// ── PROFILE ─────────────────────────────────────────────────────────────────
mainY = mainTitle('Profile', mainY);

doc.font('Helvetica').fontSize(8).fillColor(LIGHT)
   .text('A quietly accomplished multi-disciplinary professional with over 5 years of experience spanning web development, luxury vacation rental management, data analysis, graphic design, content writing, and soundtrack production. Consistently trusted by clients across multiple countries for precision, creative depth, and the ability to operate with complete autonomy.',
         MAIN_X, mainY, { width: MAIN_W, lineGap: 3, align: 'justify' });

mainY = doc.y + 10;

// ── EXPERIENCE ──────────────────────────────────────────────────────────────
mainY = mainTitle('Professional Experience', mainY);

const experiences = [
  {
    title: 'Virtual Assistant',
    company: 'Everyday Luxury Vacation Rentals',
    location: 'Dana Point, California, USA',
    date: 'Mar 2023 – Present',
    links: [
      { display: 'www.everydaylux.net', url: 'https://www.everydaylux.net' },
      { display: 'www.bluffslanding.com',  url: 'https://www.bluffslanding.com' },
    ],
    desc: 'Key team member managing end-to-end operations for a premium short-term rental brand, ensuring seamless high-end guest experiences while keeping operations running smoothly.',
    bullets: [
      'Guest Communications: Inquiry management, guest vetting, pre-arrival information.',
      'Operations: Cleaning coordination, maintenance dispatch, supply tracking, calendar syncing.',
      'Revenue & Listing: Dynamic pricing, listing optimisation, multi-platform distribution.',
      'Administrative & Financial: Bookkeeping, performance reports, claims management.',
    ],
    tools: 'Streamline PMS, Cloudbeds',
  },
  {
    title: 'Virtual Assistant',
    company: 'Righteous Rentals',
    location: 'Oceanside, California, USA',
    date: 'Jun 2024 – Present',
    desc: 'Supporting day-to-day operations with a strong focus on guest satisfaction, property efficiency, and seamless backend management for a premium vacation rental company.',
    bullets: [
      'Guest Communications: Managing inquiries, screening guests, providing pre-arrival details.',
      'Operations: Cleaning coordination, maintenance scheduling, supply tracking, calendar sync.',
      'Revenue & Listing: Dynamic pricing, listing visibility, multi-channel distribution.',
      'Administrative & Financial: Bookkeeping, performance reports, claims management.',
    ],
    tools: 'Streamline PMS, Cloudbeds',
  },
  {
    title: 'Frontend Developer',
    company: 'OPENSAUCERY',
    location: 'opensaucery.africa',
    locationUrl: 'https://www.opensaucery.africa',
    date: 'Aug 2021 – Present',
    desc: 'Building responsive, high-performance web interfaces for a software engineering company specialising in mobile & web apps, cloud infrastructure, AI & ML systems, and process automation.',
    bullets: [
      'Crafting clean, scalable frontend code in collaboration with backend engineers and designers.',
      'Delivering seamless user experiences across all devices and platforms.',
    ],
  },
  {
    title: 'Scriptwriter',
    company: 'Pak Filmmakers',
    date: 'Apr 2021 – Jun 2024',
    desc: 'Crafted production-ready scripts for commercial video projects, short films, and branded content, collaborating with directors and producers to meet tight broadcast deadlines.',
  },
  {
    title: 'Whitepaper Developer & Designer',
    company: 'Dow7 Coin',
    date: 'Oct 2021 – Feb 2023',
    desc: 'Authored and designed comprehensive blockchain whitepapers, translating complex technical concepts into clear, investor-ready documents with consistent brand identity.',
  },
  {
    title: 'Freelance Writer',
    company: 'Fiverr',
    date: 'Mar 2016 – Present',
    desc: 'Delivering high-quality articles, blog posts, web copy, and technical writing to a global clientele with a strong track record of 5-star reviews.',
  },
  {
    title: 'E-commerce Developer',
    company: 'Fiverr',
    date: 'Aug 2019 – Present',
    desc: 'Designing and optimising e-commerce stores worldwide, specialising in Shopify, WooCommerce, and custom HTML/CSS builds focused on clean UI and conversion.',
  },
];

experiences.forEach((exp, i) => {
  const estHeight = 50 + (exp.bullets ? exp.bullets.length * 18 : 0);
  if (mainY + estHeight > PH - 30) {
    doc.addPage();
    drawBg();
    mainY = 30;
  }

  // Dot + Title + Date
  doc.circle(MAIN_X + 3, mainY + 5, 2.5).fill(ACCENT);
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(WHITE)
     .text(exp.title, MAIN_X + 12, mainY, { width: MAIN_W - 90, lineBreak: false });
  doc.font('Helvetica').fontSize(7.5).fillColor(ACCENT)
     .text(exp.date, MAIN_X, mainY + 1, { width: MAIN_W, align: 'right' });

  mainY = doc.y + 2;

  // Company + Location
  if (exp.locationUrl) {
    doc.font('Helvetica').fontSize(8).fillColor(ACCENT)
       .text(exp.company + '  ·  ', MAIN_X + 12, mainY, { continued: true, width: MAIN_W - 12 })
       .text(exp.location, { link: exp.locationUrl, underline: false });
  } else {
    let compLine = exp.company;
    if (exp.location) compLine += '  ·  ' + exp.location;
    doc.font('Helvetica').fontSize(8).fillColor(ACCENT)
       .text(compLine, MAIN_X + 12, mainY, { width: MAIN_W - 12 });
  }
  mainY = doc.y + 4;

  // Website links (if any)
  if (exp.links) {
    exp.links.forEach((lnk, li) => {
      const isLast = li === exp.links.length - 1;
      doc.font('Helvetica').fontSize(7.5).fillColor(ACCENT)
         .text(lnk.display + (isLast ? '' : '  ·  '), MAIN_X + 12, mainY,
               { link: lnk.url, underline: false, continued: !isLast, width: MAIN_W - 12 });
      if (isLast) mainY = doc.y + 3;
    });
  }

  // Description
  doc.font('Helvetica').fontSize(8).fillColor(LIGHT)
     .text(exp.desc, MAIN_X + 12, mainY, { width: MAIN_W - 12, lineGap: 2.5, align: 'justify' });
  mainY = doc.y + 3;

  // Bullets
  if (exp.bullets) {
    exp.bullets.forEach(b => {
      doc.rect(MAIN_X + 15, mainY + 3.5, 2.5, 2.5).fill(ACCENT);
      doc.font('Helvetica').fontSize(7.5).fillColor(LIGHT)
         .text(b, MAIN_X + 22, mainY, { width: MAIN_W - 22, lineGap: 2 });
      mainY = doc.y + 2;
    });
  }

  // Tools
  if (exp.tools) {
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(MID)
       .text('Tools: ', MAIN_X + 12, mainY, { continued: true })
       .font('Helvetica').fillColor(LIGHT).text(exp.tools);
    mainY = doc.y;
  }

  mainY += 8;

  // Separator
  if (i < experiences.length - 1) {
    doc.rect(MAIN_X + 12, mainY - 4, MAIN_W - 20, 0.3).fill(RULE);
  }
});

// ── FOOTER ─────────────────────────────────────────────────────────────────
doc.rect(0, PH - 24, PW, 24).fill(SIDEBAR);
doc.rect(0, PH - 24, PW, 0.5).fill(RULE);
const footerY = PH - 13;
const footerItems = [
  { display: 'connect@victorblessed.com', url: 'mailto:connect@victorblessed.com' },
  { display: 'www.victorblessed.com',     url: 'https://victorblessed.com' },
  { display: 'linkedin.com/in/victorblessed', url: 'https://linkedin.com/in/victorblessed' },
  { display: 'fiverr.com/vickyscripts',   url: 'https://www.fiverr.com/vickyscripts' },
];
const footerText = footerItems.map(f => f.display).join('  ·  ');
const totalW = PW - 40;
doc.font('Helvetica').fontSize(7).fillColor(MID)
   .text(footerText, 20, footerY, { width: totalW, align: 'center' });
// Add clickable regions over each link
let fx = (PW - doc.widthOfString(footerText)) / 2;
footerItems.forEach((f, i) => {
  const w = doc.widthOfString(f.display);
  doc.link(fx, footerY, w, 9, f.url);
  fx += w + doc.widthOfString('  ·  ');
});

doc.end();
console.log('✅ PDF saved to:', outputPath);
