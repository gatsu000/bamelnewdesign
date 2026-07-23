import re

with open('src/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Fonts
css = css.replace(
    "@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap');",
    "@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap');"
)
css = css.replace("'Satoshi'", "'Manrope'")
css = css.replace("'Clash Display'", "'Manrope'")
css = css.replace("'Newsreader Variable'", "'Newsreader'")

# 2. Colors and Variables
root_old = """:root {
  --ink:#1c1d1f; --ink-deep:#121314; --ink-soft:#2a2b2e; --ink-mute:#55585d;
  --paper:#f5f4f0; --paper-deep:#ebe9e4; --paper-tint:#fbfbf9;
  --white:#ffffff; --sand:#e3ddce; --line:#d9d6ce; --line-soft:#e6e4dc;
  --copper:#c65327; --copper-deep:#9b3f1c; --copper-light:#d96d45; --copper-glow:#f29574;
  --mist:#9ca3af; --success:#207849; --danger:#a83333;
  --container:1180px;
  --grain-paper: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .08  0 0 0 0 .13  0 0 0 0 .22  0 0 0 .045 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  --grain-ink: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .035 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  --shadow-soft: 3px 3px 0 var(--ink);
  --shadow-lift: 4px 4px 0 var(--copper);
}"""

root_new = """:root {
  --ink: #1e1b18; --ink-deep: #0c0a09; --ink-soft: #292524; --ink-mute: #57534e;
  --paper: #fcfbf9; --paper-deep: #f5f4f0; --paper-tint: #faf9f6;
  --white: #ffffff; --sand: #e7e5df; --line: #e7e5df; --line-soft: #f0efe9;
  --copper: #c65327; --copper-deep: #9b3f1c; --copper-light: #d96d45; --copper-glow: #f29574;
  --mist: #a8a29e; --success: #15803d; --danger: #b91c1c;
  --container: 1180px;
  --shadow-soft: 0 4px 20px rgba(12, 10, 9, 0.05);
  --shadow-lift: 0 12px 32px rgba(12, 10, 9, 0.08);
  --radius: 12px;
}"""
css = css.replace(root_old, root_new)

# 3. Clean up brutalist styles
css = re.sub(r'body::before \{ content:""; position:fixed; inset:0; z-index:-1; pointer-events:none; background-image:var\(--grain-paper\); opacity:\.6; mix-blend-mode:multiply; \}', '', css)
css = css.replace('border-radius:1px', 'border-radius:var(--radius)')
css = css.replace('border-radius:0', 'border-radius:var(--radius)')

# Fix button brutalism
css = css.replace('transform:translate(-2px, -2px)', 'transform:translateY(-2px)')
css = css.replace('transform:translate(2px, 2px)', 'transform:translateY(0)')
css = css.replace('box-shadow:4px 4px 0 var(--ink)', 'box-shadow:var(--shadow-lift)')
css = css.replace('box-shadow:6px 6px 0 var(--ink)', 'box-shadow:0 16px 40px rgba(12,10,9,0.15)')
css = css.replace('box-shadow:4px 4px 0 var(--copper)', 'box-shadow:var(--shadow-lift)')
css = css.replace('box-shadow:6px 6px 0 var(--copper)', 'box-shadow:0 16px 40px rgba(198,83,39,0.25)')
css = css.replace('box-shadow:8px 8px 0 var(--copper)', 'box-shadow:var(--shadow-lift)')
css = css.replace('box-shadow:3px 3px 0 var(--copper)', 'box-shadow:var(--shadow-soft)')
css = css.replace('border:1px solid var(--ink)', 'border:1px solid var(--line); border-radius:var(--radius)')
css = css.replace('border:1.5px solid var(--ink)', 'border:1px solid var(--line); border-radius:var(--radius)')

# Fix weave grid & backgrounds
css = re.sub(r'\.hero-next::after \{.*?\}', '', css)
css = re.sub(r'\.process-section::after \{.*?\}', '', css)
css = re.sub(r'\.cta-next::after \{.*?\}', '', css)
css = re.sub(r'\.page-hero-next::after \{.*?\}', '', css)
css = re.sub(r'\.service-steps::before \{.*?\}', '', css)
css = re.sub(r'\.footer-next::after \{.*?\}', '', css)
css = re.sub(r'\.signal-card::before \{.*?\}', '', css)
css = re.sub(r'\.paper-panel::before \{.*?\}', '', css)
css = re.sub(r'\.quote-section::before \{.*?\}', '', css)
css = re.sub(r'\.faq-section::before \{.*?\}', '', css)
css = re.sub(r'\.services-section::before \{.*?\}', '', css)
css = css.replace('background-image:var(--grain-paper); background-blend-mode:multiply;', '')
css = css.replace('background-image:var(--grain-ink); opacity:.8; mix-blend-mode:overlay;', '')
css = css.replace('background-image:radial-gradient(rgba(255,255,255,.09) .6px,transparent .6px);', 'background-image:radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px);')

# Round corners
css = css.replace('.float-card { position:absolute;', '.float-card { position:absolute; border-radius:var(--radius);')
css = css.replace('.weave-caption { position:absolute;', '.weave-caption { position:absolute; border-radius:var(--radius);')
css = css.replace('.hero-photo { position:absolute;', '.hero-photo { position:absolute; border-radius:var(--radius);')
css = css.replace('.brand-mark { display:grid;', '.brand-mark { display:grid; border-radius: 8px;')

# Grids and gaps (fix brutalist borders on grids)
css = css.replace('.services-grid { display:grid; gap:0; background:var(--ink); border:1px solid var(--ink); box-shadow:6px 6px 0 var(--copper); }', '.services-grid { display:grid; gap:1.5rem; background:transparent; }')
css = css.replace('.service-card-next { position:relative; min-height:320px; background:var(--white); transition:transform .2s ease, background .3s ease, box-shadow .2s ease; border:1px solid var(--ink); margin:-1px 0 0 -1px; }', '.service-card-next { position:relative; min-height:320px; background:var(--white); transition:transform .2s ease, background .3s ease, box-shadow .2s ease; border:1px solid var(--line); border-radius:var(--radius); overflow:hidden; }')

css = css.replace('.gallery-next { display:grid; grid-template-columns:1fr 1fr; gap:0; border:1px solid var(--ink); background:var(--ink); box-shadow:6px 6px 0 var(--copper); }', '.gallery-next { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }')
css = css.replace('.gallery-next figure { position:relative; min-height:240px; margin:0; overflow:hidden; background:var(--ink); border:1px solid var(--ink); margin:-1px 0 0 -1px; }', '.gallery-next figure { position:relative; min-height:240px; margin:0; overflow:hidden; background:var(--ink); border:1px solid var(--line); border-radius:var(--radius); }')

css = css.replace('.contact-grid { display:grid; gap:0; background:var(--ink); border:1px solid var(--ink); box-shadow:6px 6px 0 var(--copper); }', '.contact-grid { display:grid; gap:1.5rem; }')
css = css.replace('.contact-grid article { position:relative; min-height:260px; padding:1.8rem; background:var(--white); transition:transform .2s ease, background .3s ease; border:1px solid var(--ink); margin:-1px 0 0 -1px; }', '.contact-grid article { position:relative; min-height:260px; padding:1.8rem; background:var(--white); transition:transform .2s ease, background .3s ease; border:1px solid var(--line); border-radius:var(--radius); overflow:hidden; }')

# Fix service steps card
css = css.replace('.service-steps { position:relative; display:grid; align-content:start; gap:.85rem; padding:1.6rem; color:var(--white); background:var(--ink); box-shadow:var(--shadow-lift); overflow:hidden; }', '.service-steps { position:relative; display:grid; align-content:start; gap:.85rem; padding:1.6rem; color:var(--white); background:var(--ink); box-shadow:var(--shadow-lift); overflow:hidden; border-radius:var(--radius); }')
css = css.replace('.quote-form { max-width:880px; margin:auto; padding:2rem; background:var(--white); border:1px solid var(--ink); box-shadow:8px 8px 0 var(--copper); border-top:4px solid var(--copper); }', '.quote-form { max-width:880px; margin:auto; padding:2rem; background:var(--white); border:1px solid var(--line); box-shadow:var(--shadow-lift); border-top:4px solid var(--copper); border-radius:var(--radius); }')
css = css.replace('.signal-card { position:relative; align-self:start; padding:2rem; overflow:hidden; color:var(--white); background:var(--ink); box-shadow:8px 8px 0 var(--copper); border:1px solid var(--ink); }', '.signal-card { position:relative; align-self:start; padding:2rem; overflow:hidden; color:var(--white); background:var(--ink); box-shadow:var(--shadow-lift); border-radius:var(--radius); }')

# Fix inputs
css = css.replace('.field input,.field textarea { width:100%; min-height:54px; padding:.75rem 1rem; color:var(--ink); border:1px solid var(--ink); background:var(--paper-tint); transition:all .2s ease; border-radius:0; }', '.field input,.field textarea { width:100%; min-height:54px; padding:.75rem 1rem; color:var(--ink); border:1px solid var(--line); background:var(--paper-tint); transition:all .2s ease; border-radius:8px; }')
css = css.replace('.field input:focus,.field textarea:focus { outline:0; background:var(--white); box-shadow:4px 4px 0 var(--copper); transform:translate(-2px,-2px); }', '.field input:focus,.field textarea:focus { outline:0; background:var(--white); box-shadow:var(--shadow-soft); border-color:var(--copper); transform:translateY(-2px); }')

# Buttons border radius
css = css.replace('.button { display:inline-flex;', '.button { display:inline-flex; border-radius:8px;')
css = css.replace('.service-icon { display:grid; width:44px; height:44px; place-items:center; margin-bottom:auto; border:1px solid var(--ink); background:var(--paper); color:var(--copper); transition:all .3s cubic-bezier(.2,.7,.2,1); box-shadow:2px 2px 0 var(--ink); }', '.service-icon { display:grid; width:44px; height:44px; place-items:center; margin-bottom:auto; border-radius:8px; background:var(--paper-tint); color:var(--copper); transition:all .3s cubic-bezier(.2,.7,.2,1); }')
css = css.replace('.brand-mark { border-color:var(--ink); box-shadow:2px 2px 0 var(--ink); }', '.brand-mark { border-color:var(--line); box-shadow:var(--shadow-soft); }')

# Image border radius
css = css.replace('.quality-image-wrap { position:relative; min-height:360px; box-shadow:var(--shadow-lift); }', '.quality-image-wrap { position:relative; min-height:360px; box-shadow:var(--shadow-lift); border-radius:var(--radius); overflow:hidden; }')
css = css.replace('.detail-image { width:100%; aspect-ratio:16/8; object-fit:cover; margin-bottom:2.2rem; filter:saturate(.72) contrast(1.03); box-shadow:var(--shadow-lift); }', '.detail-image { width:100%; aspect-ratio:16/8; object-fit:cover; margin-bottom:2.2rem; filter:saturate(.72) contrast(1.03); box-shadow:var(--shadow-lift); border-radius:var(--radius); }')

with open('src/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("CSS updated successfully")
