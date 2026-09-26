* {
  box-sizing: border-box;
}

:root {
  --bg: #f4f7fb;
  --panel: #ffffff;
  --panel-soft: #eef3ff;
  --text: #10213a;
  --muted: #52657f;
  --primary: #2a5cff;
  --primary-dark: #1d44cf;
  --accent: #14b8a6;
  --warning: #f59e0b;
  --danger: #d95050;
  --border: #dfe7f2;
  --shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.container {
  width: min(1100px, calc(100% - 32px));
  margin: 0 auto;
}

.topbar {
  position: sticky;
  top: 0;
  background: rgba(244, 247, 251, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 10;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0;
  gap: 16px;
}

.brand {
  font-weight: 800;
  font-size: 1.05rem;
}

nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

nav a {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.95rem;
}

.primary-btn,
.secondary-btn {
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 700;
  border: none;
  transition: 0.2s ease;
}

.primary-btn {
  background: var(--primary);
  color: white;
  box-shadow: var(--shadow);
}

.primary-btn:hover {
  background: var(--primary-dark);
}

.secondary-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
}

.hero {
  padding: 72px 0 44px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.5fr 0.9fr;
  gap: 40px;
  align-items: center;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.74rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 10px;
}

.hero h1 {
  font-size: clamp(2.4rem, 4vw, 4.5rem);
  line-height: 1.05;
  margin: 0 0 16px;
}

.lede {
  font-size: 1.08rem;
  color: var(--muted);
  line-height: 1.7;
  max-width: 640px;
}

.cta-row {
  margin-top: 22px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-card,
.panel,
.step-card,
.stat-card,
.form-wrapper {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow);
}

.hero-card {
  padding: 28px 24px;
}

.mini-label {
  color: var(--muted);
  font-size: 0.84rem;
  margin-bottom: 18px;
}

.score-ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 12px auto 18px;
  display: grid;
  place-items: center;
  background: conic-gradient(var(--accent) 0 72%, var(--panel-soft) 72% 100%);
  position: relative;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text);
}

.score-ring::before {
  content: "";
  position: absolute;
  inset: 12px;
  background: white;
  border-radius: 50%;
}

.score-ring {
  line-height: 120px;
}

.score-ring::after {
  content: "72";
  position: relative;
  z-index: 1;
}

.hero-card ul {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.9;
}

.section {
  padding: 70px 0;
}

.alt-section {
  background: linear-gradient(180deg, #eef4ff, #f8faff);
}

h2 {
  font-size: clamp(2rem, 3vw, 2.7rem);
  margin-bottom: 28px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.step-card {
  padding: 24px 18px;
}

.step-card span {
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: var(--panel-soft);
  color: var(--primary);
  font-weight: 800;
  margin-bottom: 12px;
}

.step-card h3 {
  margin: 0 0 8px;
}

.step-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.phase-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 14px;
}

.phase-list > div {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px 18px;
  font-weight: 700;
}

.narrow {
  max-width: 760px;
}

.form-section {
  padding-top: 40px;
}

.form-wrapper {
  padding: 28px;
}

.form-grid,
.textarea-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text);
  font-weight: 600;
}

input,
textarea,
select {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: white;
  padding: 12px 14px;
  color: var(--text);
}

textarea {
  min-height: 110px;
  resize: vertical;
}

input[type="range"] {
  padding: 0;
}

.range-value {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 700;
}

.actions-row {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 22px;
}

.hidden {
  display: none !important;
}

.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(217, 80, 80, 0.1);
  color: var(--danger);
  border: 1px solid rgba(217, 80, 80, 0.18);
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-card span {
  color: var(--muted);
  font-size: 0.86rem;
}

.stat-card strong {
  font-size: 1.8rem;
}

.accent {
  background: linear-gradient(135deg, #ecfdf5, #eff6ff);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.panel {
  padding: 22px 20px;
}

.panel h3 {
  margin-top: 0;
}

.wide-panel {
  grid-column: 1 / -1;
}

.phase-panel p {
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 0;
}

ul {
  margin: 0;
  padding-left: 18px;
  line-height: 1.9;
}

@media (max-width: 840px) {
  .hero-grid,
  .steps-grid,
  .phase-list,
  .stats-grid,
  .dashboard-grid,
  .form-grid,
  .textarea-grid {
    grid-template-columns: 1fr;
  }

  .nav {
    flex-wrap: wrap;
  }

  nav {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 560px) {
  .nav {
    justify-content: center;
  }

  .topbar {
    padding-bottom: 6px;
  }

  .cta-row,
  .actions-row,
  .dashboard-header,
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
