import { Hono } from 'hono'

const app = new Hono()

const APP_NAMES = ['library', 'exam-cell', 'fees', 'admin-office']
const APP_DETAILS = {
    library: {
        title: 'Library',
        content: 'Borrowed books, digital reading lists, and study hall reservations.',
        description: 'Borrowed books, reservations, and reading lists.'
    },
    'exam-cell': {
        title: 'Exam Cell',
        content: 'Exam timetables, results portals, and assessment notices for faculty.',
        description: 'Timetables, results, and exam notices.'
    },
    fees: {
        title: 'Fees',
        content: 'Fee receipts, payment history, and tuition statements for accounts staff.',
        description: 'Receipts, billing, and tuition records.'
    },
    'admin-office': {
        title: 'Admin Office',
        content: 'Admissions records, approvals, and campus-wide settings.',
        description: 'Admissions, approvals, and settings.'
    }
}

const ROLE_DISPLAY = {
    student: 'Student',
    faculty: 'Faculty',
    accounts: 'Accounts',
    admin: 'Admin',
    none: 'No role'
}

function escapeHtml(value) {
    return String(value === null || value === undefined ? '' : value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character])
}

function roleClass(role) {
    switch (role) {
        case 'student':
            return 'role-student'
        case 'faculty':
            return 'role-faculty'
        case 'accounts':
            return 'role-accounts'
        case 'admin':
            return 'role-admin'
        default:
            return 'role-none'
    }
}

function roleDisplayName(role) {
    return ROLE_DISPLAY[role] || 'No role'
}

function campusCss() {
    return `
    :root {
      color-scheme: dark light;
      --bg: #091321;
      --bg-soft: #121f2f;
      --panel: rgba(17, 27, 42, 0.85);
      --panel-strong: #101b2c;
      --panel-alt: #0d1726;
      --card: rgba(15, 25, 38, 0.90);
      --border: rgba(148, 163, 184, 0.18);
      --text: #e6edf7;
      --muted: #9fb1c8;
      --indigo: #7c8cff;
      --cyan: #59d5ff;
      --green: #4ade80;
      --amber: #fbbf24;
      --red: #f87171;
      --purple: #a78bfa;
      --shadow: 0 24px 48px rgba(15, 23, 42, 0.42);
    }

    @media (prefers-color-scheme: light) {
      :root {
        color-scheme: light;
        --bg: #edf4ff;
        --bg-soft: #dfeaf9;
        --panel: rgba(255,255,255,0.9);
        --panel-strong: #ffffff;
        --panel-alt: #f4f7fb;
        --card: #ffffff;
        --border: rgba(68, 94, 128, 0.18);
        --text: #182333;
        --muted: #55657f;
        --shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
      }
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: Inter, "Segoe UI", Arial, sans-serif;
      background:
        radial-gradient(circle at top left, rgba(124, 140, 255, 0.20), transparent 22%),
        radial-gradient(circle at top right, rgba(89, 213, 255, 0.18), transparent 20%),
        linear-gradient(180deg, var(--bg) 0%, var(--bg-soft) 100%);
      color: var(--text);
    }
    a { color: inherit; text-decoration: none; }
    button, input, select, textarea { font: inherit; }
    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .topbar {
      position: relative;
      padding: 18px 0 0;
      background: linear-gradient(180deg, rgba(15, 25, 38, 0.82), rgba(15, 25, 38, 0.20));
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(12px);
    }
    .topbar::before {
      content: "";
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 20% 0%, rgba(124, 140, 255, 0.35), transparent 38%);
      pointer-events: none;
    }
    .header-inner {
      position: relative;
      z-index: 1;
      max-width: 1190px;
      margin: 0 auto;
      padding: 0 20px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-weight: 800;
      letter-spacing: 0.04em;
      font-size: clamp(1.1rem, 2vw, 1.5rem);
    }
    .brand-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(124, 140, 255, 0.2), rgba(89, 213, 255, 0.2));
      border: 1px solid rgba(124, 140, 255, 0.28);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 18px rgba(124,140,255,0.2);
    }
    .brand-icon svg, .icon svg, .card-icon svg, .lock-icon svg, .live-dot, .checkmark svg {
      width: 1em;
      height: 1em;
      display: block;
    }
    .header-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 10px;
    }
    .user-pill {
      padding: 7px 12px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: rgba(9, 19, 33, 0.38);
      color: var(--text);
      font-size: 0.88rem;
      line-height: 1.2;
      word-break: break-all;
      max-width: min(32vw, 320px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .role-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 7px 11px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      border: 1px solid transparent;
      text-transform: uppercase;
    }
    .role-student { background: rgba(59,130,246,0.15); color: #a7d0ff; border-color: rgba(59,130,246,0.35); }
    .role-faculty { background: rgba(168,85,247,0.15); color: #dcc5ff; border-color: rgba(168,85,247,0.35); }
    .role-accounts { background: rgba(245,158,11,0.15); color: #f8d47c; border-color: rgba(245,158,11,0.35); }
    .role-admin { background: rgba(34,197,94,0.15); color: #b6f0ca; border-color: rgba(34,197,94,0.35); }
    .role-none { background: rgba(148,163,184,0.12); color: #dfe8f3; border-color: rgba(148,163,184,0.3); }
    .logout-link {
      color: var(--muted);
      font-weight: 600;
      transition: color 0.2s ease;
    }
    .logout-link:hover, .logout-link:focus-visible { color: var(--text); }

    .page-shell {
      width: min(1180px, calc(100% - 28px));
      margin: 28px auto 48px;
      display: grid;
      gap: 22px;
    }
    .zero-trust-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 8px;
    }
    .zero-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      background: rgba(15, 25, 38, 0.75);
      border: 1px solid var(--border);
      color: var(--text);
      box-shadow: var(--shadow);
    }
    .check-bubble {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(74, 222, 128, 0.25), rgba(89, 213, 255, 0.18));
      color: #c9f9d8;
      border: 1px solid rgba(74, 222, 128, 0.35);
      flex-shrink: 0;
    }
    .check-bubble svg { width: 12px; height: 12px; }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 6px;
    }
    .section-title {
      margin: 0;
      font-size: clamp(1.8rem, 3vw, 2.6rem);
      letter-spacing: -0.04em;
    }
    .summary-line {
      color: var(--muted);
      font-size: 0.96rem;
      margin: 0;
    }

    .app-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
      margin-top: 8px;
    }
    .app-card {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
      min-height: 240px;
      width: 100%;
      padding: 18px 18px 16px;
      border-radius: 16px;
      border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(17, 27, 42, 0.86), rgba(12, 20, 31, 0.92));
      box-shadow: var(--shadow);
      transition: transform 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
    }
    @media (prefers-color-scheme: light) {
      .app-card { background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,247,251,0.95)); }
    }
    .app-card:hover, .app-card:focus-visible {
      transform: translateY(-2px);
      border-color: rgba(124, 140, 255, 0.42);
    }
    .app-card.locked {
      opacity: 0.68;
      filter: saturate(0.8);
    }
    .card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .card-main {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .card-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(124,140,255,0.18), rgba(89,213,255,0.15));
      border: 1px solid rgba(124,140,255,0.28);
      color: var(--text);
      font-size: 1.4rem;
    }
    .card-title {
      margin: 0;
      font-size: clamp(1.15rem, 2vw, 1.4rem);
      letter-spacing: -0.03em;
    }
    .card-copy {
      margin: 0;
      color: var(--muted);
      line-height: 1.6;
      font-size: 0.96rem;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 7px 10px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 0.75rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }
    .status-pill.allowed { background: rgba(74,222,128,0.14); color: #baf7ce; border: 1px solid rgba(74,222,128,0.28); }
    .status-pill.locked { background: rgba(248,113,113,0.12); color: #fecaca; border: 1px solid rgba(248,113,113,0.22); }
    .card-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .status-line {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--muted);
      font-size: 0.86rem;
      font-weight: 600;
    }
    .lock-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      color: var(--red);
    }
    .button-primary, .button-muted, .button-ghost {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      padding: 10px 16px;
      border: 1px solid transparent;
      font-weight: 700;
      transition: transform 0.2s ease, opacity 0.2s ease, border-color 0.2s ease, background 0.2s ease;
      cursor: pointer;
    }
    .button-primary {
      background: linear-gradient(135deg, rgba(124, 140, 255, 0.96), rgba(89, 213, 255, 0.90));
      color: #071827;
      box-shadow: 0 12px 22px rgba(120, 142, 255, 0.30);
    }
    .button-muted {
      background: rgba(124, 140, 255, 0.08);
      border-color: rgba(124,140,255,0.22);
      color: var(--text);
    }
    .button-ghost {
      background: rgba(9, 19, 33, 0.38);
      border-color: var(--border);
      color: var(--text);
    }
    .button-primary:hover, .button-primary:focus-visible, .button-muted:hover, .button-muted:focus-visible, .button-ghost:hover, .button-ghost:focus-visible { transform: translateY(-1px); }

    .admin-cta {
      display: flex;
      justify-content: flex-start;
      margin-top: 10px;
    }

    .page-card {
      background: rgba(15, 25, 38, 0.78);
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: var(--shadow);
      padding: clamp(18px, 2vw, 28px);
    }
    @media (prefers-color-scheme: light) {
      .page-card { background: rgba(255,255,255,0.94); }
    }
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }
    .page-heading {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      margin: 0;
      font-size: clamp(1.7rem, 2.8vw, 2.5rem);
      letter-spacing: -0.05em;
    }
    .page-title-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(124,140,255,0.18), rgba(89,213,255,0.16));
      border: 1px solid rgba(124,140,255,0.28);
    }
    .chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(124,140,255,0.10);
      border: 1px solid rgba(124,140,255,0.20);
      color: var(--text);
      font-size: 0.82rem;
      font-weight: 700;
    }

    .content-block {
      margin-top: 18px;
      padding: clamp(18px, 2vw, 26px);
      border-radius: 18px;
      border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(17,27,42,0.92), rgba(11,18,28,0.92));
    }
    @media (prefers-color-scheme: light) {
      .content-block { background: linear-gradient(180deg, rgba(247,250,255,0.95), rgba(242,246,250,0.92)); }
    }
    .content-block ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 12px;
    }
    .content-block li {
      position: relative;
      padding-left: 18px;
      color: var(--text);
      line-height: 1.6;
    }
    .content-block li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 10px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--indigo), var(--cyan));
    }
    .content-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
    .content-table th, .content-table td {
      padding: 12px 10px;
      border-bottom: 1px solid var(--border);
      text-align: left;
      vertical-align: middle;
    }
    .content-table th { color: var(--muted); font-size: 0.8rem; letter-spacing: 0.05em; text-transform: uppercase; }
    .pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .pill-paid { background: rgba(74,222,128,0.15); color: #baf7ce; border: 1px solid rgba(74,222,128,0.25); }
    .pill-pending { background: rgba(245,158,11,0.14); color: #f9d58c; border: 1px solid rgba(245,158,11,0.26); }
    .page-actions { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 12px; }

    .blocked-wrapper {
      min-height: calc(100vh - 120px);
      display: grid;
      place-items: center;
      padding: 26px 0 40px;
    }
    .blocked-card {
      width: min(620px, calc(100% - 20px));
      padding: clamp(22px, 4vw, 40px);
      background: rgba(15,25,38,0.9);
      border: 1px solid rgba(248,113,113,0.25);
      border-radius: 20px;
      box-shadow: var(--shadow);
      text-align: center;
    }
    @media (prefers-color-scheme: light) {
      .blocked-card { background: rgba(255,255,255,0.96); }
    }
    .lock-hero {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 76px;
      height: 76px;
      border-radius: 24px;
      background: rgba(248,113,113,0.12);
      color: var(--red);
      border: 1px solid rgba(248,113,113,0.24);
      margin-bottom: 16px;
      font-size: 2.2rem;
    }
    .blocked-card h1 { margin: 0 0 8px; font-size: clamp(2rem, 4vw, 3rem); letter-spacing: -0.05em; }
    .blocked-meta {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      margin: 18px 0;
    }
    .meta-pill { padding: 8px 12px; border-radius: 999px; background: rgba(124,140,255,0.08); border: 1px solid var(--border); color: var(--text); }
    .blocked-copy { color: var(--muted); margin: 0 0 20px; }

    .audit-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }
    .live-trace {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(74, 222, 128, 0.10);
      border: 1px solid rgba(74, 222, 128, 0.24);
      color: #baf7ce;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .live-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
      animation: pulse 1.6s infinite;
    }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0.0); } 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); } }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }
    .stat-card {
      padding: 16px 18px;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: rgba(15,25,38,0.8);
      box-shadow: var(--shadow);
    }
    @media (prefers-color-scheme: light) {
      .stat-card { background: rgba(255,255,255,0.96); }
    }
    .stat-label { color: var(--muted); font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .stat-value { margin-top: 10px; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 800; letter-spacing: -0.05em; }
    .audit-table-wrap { overflow: auto; }
    table.audit-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 760px;
      background: rgba(15,25,38,0.55);
      border-radius: 14px;
      overflow: hidden;
    }
    @media (prefers-color-scheme: light) {
      table.audit-table { background: rgba(255,255,255,0.8); }
    }
    .audit-table th, .audit-table td {
      text-align: left;
      padding: 12px 10px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }
    .audit-table th {
      color: var(--muted);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .audit-row--allow { border-left: 3px solid rgba(74,222,128,0.8); }
    .audit-row--deny { border-left: 3px solid rgba(248,113,113,0.8); }
    .audit-row.flash { animation: flashRow 1.5s ease; }
    @keyframes flashRow {
      0% { background: rgba(89, 213, 255, 0.10); }
      100% { background: transparent; }
    }
    .decision-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      border: 1px solid transparent;
    }
    .decision-allow {
      background: rgba(74,222,128,0.12);
      color: #baf7ce;
      border-color: rgba(74,222,128,0.28);
    }
    .decision-deny {
      background: rgba(248,113,113,0.12);
      color: #fecaca;
      border-color: rgba(248,113,113,0.25);
    }
    .empty-state {
      padding: 20px 14px;
      color: var(--muted);
      text-align: center;
      background: rgba(15,25,38,0.55);
      border: 1px dashed var(--border);
      border-radius: 14px;
    }
    .top-actions { display: flex; align-items: center; gap: 10px; }
    .tiny-time {
      color: var(--muted);
      font-size: 0.81rem;
      font-weight: 600;
    }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
    @media (max-width: 760px) {
      .zero-trust-strip, .stats-grid, .app-grid { grid-template-columns: 1fr; }
      .header-inner { flex-direction: column; align-items: flex-start; }
      .header-meta { justify-content: flex-start; }
      .page-actions, .top-actions { align-items: stretch; }
      .button-primary, .button-muted, .button-ghost { width: 100%; }
      .user-pill { max-width: 100%; }
    }
  `
}

function renderHeader(user) {
    const role = user && user.role ? user.role : 'none'
    return `
      <header class="topbar">
        <div class="header-inner">
          <div class="brand" aria-label="GateKeeper Campus brand">
            <span class="brand-icon" aria-hidden="true">${shieldCapSvg()}</span>
            <span>GateKeeper Campus</span>
          </div>
          <div class="header-meta">
            <span class="user-pill" aria-label="Signed-in email">${escapeHtml(user && user.email ? user.email : 'unknown user')}</span>
            <span class="role-badge ${roleClass(role)}" aria-label="User role">${escapeHtml(roleDisplayName(role))}</span>
            <a class="logout-link" href="/cdn-cgi/access/logout" aria-label="Sign out">Sign out</a>
          </div>
        </div>
      </header>
    `
}

function page(title, content, status = 200, scripts = '') {
    return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | GateKeeper Campus</title>
  <style>${campusCss()}</style>
</head>
<body>
  <div class="app-shell">
    ${content}
  </div>
  ${scripts}
</body>
</html>`, {
        status,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
}

function parseRoles(rule) {
    if (!rule) return []
    try {
        const roles = JSON.parse(rule.allowed_roles)
        return Array.isArray(roles) ? roles.filter((role) => typeof role === 'string') : []
    } catch {
        return []
    }
}

async function getUser(c) {
    let access = null
    try {
        access = c.executionCtx ? c.executionCtx.access : null
    } catch {
        access = null
    }

    let identity = null
    if (access) {
        try {
            identity = await access.getIdentity()
        } catch {
            identity = null
        }
    }

    const email = identity && typeof identity.email === 'string' && identity.email.trim() ?
        identity.email.trim() :
        null

    if (!email) return { email: null, role: 'none' }

    const mapping = await c.env.DB.prepare(
        'SELECT role FROM role_map WHERE email = ? COLLATE NOCASE'
    ).bind(email).first()

    return { email, role: mapping ? mapping.role : 'none' }
}

function logAudit(c, user, appName, decision, reason) {
    const country = c.req.raw.cf && c.req.raw.cf.country ? c.req.raw.cf.country : null
    const write = c.env.DB.prepare(
        'INSERT INTO audit_log (email, app, decision, reason, country) VALUES (?, ?, ?, ?, ?)'
    ).bind(user.email, appName, decision, reason, country).run()

    c.executionCtx.waitUntil(write.catch(() => undefined))
}

async function loadAppRules(db) {
    const placeholders = APP_NAMES.map(() => '?').join(', ')
    const result = await db.prepare(
        `SELECT app, allowed_roles FROM app_rules WHERE app IN (${placeholders})`
    ).bind(...APP_NAMES).all()

    return new Map((result.results || []).map((rule) => [rule.app, parseRoles(rule)]))
}

function shieldCapSvg() {
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3.5L20.5 7.5L12 11.5L3.5 7.5L12 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M6 9V13.5C6 15.5 8.2 17.5 12 17.5C15.8 17.5 18 15.5 18 13.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M12 11.5V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M9 18H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
}

function iconForApp(name) {
    const icons = {
        library: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M4 7.5C4 6.4 4.9 5.5 6 5.5H18C19.1 5.5 20 6.4 20 7.5V16.5C20 17.6 19.1 18.5 18 18.5H6C4.9 18.5 4 17.6 4 16.5V7.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M8 5.5V18.5M16 5.5V18.5M4 10.5H20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
        'exam-cell': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="16" height="15" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 9H16M8 13H16M8 17H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
        fees: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M7 5.5H17C18.1 5.5 19 6.4 19 7.5V16.5C19 17.6 18.1 18.5 17 18.5H7C5.9 18.5 5 17.6 5 16.5V7.5C5 6.4 5.9 5.5 7 5.5Z" stroke="currentColor" stroke-width="1.5"/><path d="M8 9.5H16M8 13.5H13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
        'admin-office': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L18 7V11C18 15.3 15.4 18.8 12 20C8.6 18.8 6 15.3 6 11V7L12 4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 8V12M12 12L14.5 14.5M12 12L9.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    }
    return icons[name] || icons['admin-office']
}

function appCardMarkup(name, allowed, role) {
    const details = APP_DETAILS[name]
    const url = `/app/${escapeHtml(name)}`
    const statusText = allowed ? 'Allowed' : 'Locked'
    const statusClass = allowed ? 'allowed' : 'locked'
    const actionText = allowed ? 'Open' : 'View'
    const lockText = allowed ? 'Available' : 'Not allowed for your role'
    return `
      <a class="app-card ${allowed ? '' : 'locked'}" href="${url}" aria-label="${escapeHtml(details.title)} app">
        <div class="card-top">
          <div class="card-main">
            <span class="card-icon" aria-hidden="true">${iconForApp(name)}</span>
            <div>
              <h3 class="card-title">${escapeHtml(details.title)}</h3>
            </div>
          </div>
          <span class="status-pill ${statusClass}">${statusText}</span>
        </div>
        <p class="card-copy">${escapeHtml(details.description)}</p>
        <div class="card-actions">
          <span class="status-line">
            ${allowed ? '' : `<span class="lock-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10V8.5C7 6.0 9 4 12 4C15 4 17 6.0 17 8.5V10M8 10H16C17.1 10 18 10.9 18 12V16.5C18 17.6 17.1 18.5 16 18.5H8C6.9 18.5 6 17.6 6 16.5V12C6 10.9 6.9 10 8 10Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>`}
            ${allowed ? 'Ready for access' : escapeHtml(lockText)}
          </span>
          <span class="button-primary" aria-hidden="true">${actionText}</span>
        </div>
      </a>
    `
}

function renderZeroTrust(user) {
    return `
      <div class="zero-trust-strip" aria-label="Zero trust validation">
        <div class="zero-item"><span class="check-bubble" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5L9.5 17L19 7.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>1. Cloudflare Access verified your identity</span></div>
        <div class="zero-item"><span class="check-bubble" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5L9.5 17L19 7.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>2. Role resolved: ${escapeHtml(roleDisplayName(user.role || 'none'))}</span></div>
        <div class="zero-item"><span class="check-bubble" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5L9.5 17L19 7.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>3. Policy checked on every click</span></div>
      </div>
    `
}

function renderLauncherPage(user, appRules) {
    const cards = APP_NAMES.map((name) => appCardMarkup(name, appRules.get(name) ? appRules.get(name).includes(user.role) : false, user.role)).join('')
    const allowedCount = APP_NAMES.filter((name) => appRules.get(name) ? appRules.get(name).includes(user.role) : false).length
    const adminLink = user.role === 'admin' ? `<div class="admin-cta"><a class="button-primary" href="/admin/feed">Open live audit feed</a></div>` : ''

    return page('Campus launcher', `
      ${renderHeader(user)}
      <main class="page-shell">
        ${renderZeroTrust(user)}
        <div class="section-header">
          <h1 class="section-title">Campus launchpad</h1>
        </div>
        <p class="summary-line">You can open ${allowedCount} of 4 apps</p>
        <div class="app-grid">${cards}</div>
        ${adminLink}
      </main>
    `)
}

function renderAppPage(name, user, details) {
    const contentMap = {
        library: `
          <div class="content-block">
            <ul>
              <li>Introduction to Algorithms — due 18 Oct — checked out to A. Jones</li>
              <li>Campus Design Studio — due 21 Oct — reserved for study group</li>
              <li>Human Rights and Public Policy — due 25 Oct — renewed for finals week</li>
            </ul>
          </div>
        `,
        'exam-cell': `
          <div class="content-block">
            <table class="content-table">
              <thead><tr><th>Course</th><th>Time</th><th>Venue</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>CS 301</td><td>Tue 09:00</td><td>Hall A</td><td><span class="pill pill-paid">Approved</span></td></tr>
                <tr><td>ENG 214</td><td>Wed 11:30</td><td>Lab 2</td><td><span class="pill pill-paid">Scheduled</span></td></tr>
                <tr><td>LAW 110</td><td>Thu 14:00</td><td>Room 5</td><td><span class="pill pill-pending">Review</span></td></tr>
              </tbody>
            </table>
          </div>
        `,
        fees: `
          <div class="content-block">
            <table class="content-table">
              <thead><tr><th>Receipt</th><th>Amount</th><th>Status</th><th>Due</th></tr></thead>
              <tbody>
                <tr><td>Tuition - Semester 1</td><td>$2,450</td><td><span class="pill pill-paid">Paid</span></td><td>Cleared</td></tr>
                <tr><td>Hostel charges</td><td>$480</td><td><span class="pill pill-pending">Pending</span></td><td>15 Oct</td></tr>
                <tr><td>Lab fee</td><td>$175</td><td><span class="pill pill-paid">Paid</span></td><td>Cleared</td></tr>
              </tbody>
            </table>
          </div>
        `,
        'admin-office': `
          <div class="content-block">
            <div class="stats-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 0; margin-bottom: 16px;">
              <div class="stat-card"><div class="stat-label">Applicants</div><div class="stat-value">236</div></div>
              <div class="stat-card"><div class="stat-label">Reviews</div><div class="stat-value">19</div></div>
              <div class="stat-card"><div class="stat-label">Alerts</div><div class="stat-value">4</div></div>
            </div>
            <ul>
              <li>Admissions cycle reopened for international transfer candidates.</li>
              <li>Department room allocations updated for the Autumn quarter.</li>
              <li>Access policy review scheduled for Friday at 15:00.</li>
            </ul>
          </div>
        `
    }

    return page(`Campus ${details.title}`, `
      ${renderHeader(user)}
      <main class="page-shell">
        <div class="page-card">
          <div class="page-header">
            <h1 class="page-heading"><span class="page-title-icon" aria-hidden="true">${iconForApp(name)}</span>${escapeHtml(details.title)}</h1>
            <span class="chip" aria-label="Verified identity">Verified as ${escapeHtml(user.email)} (${escapeHtml(roleDisplayName(user.role || 'none'))})</span>
          </div>
          <p class="muted">${escapeHtml(details.content)}</p>
          ${contentMap[name] || '<div class="content-block"><p>No campus content configured.</p></div>'}
          <div class="page-actions">
            <a class="button-primary" href="/">Back to portal</a>
          </div>
        </div>
      </main>
    `)
}

function blockedPage(appName, user, reason) {
    const appLabel = appName ? escapeHtml(appName) : 'this portal'
    const roleLabel = escapeHtml(roleDisplayName(user && user.role ? user.role : 'none'))
    const reasonText = reason ? escapeHtml(reason) : 'Your role does not have access to this campus app.'
    return page('Access blocked', `
      ${renderHeader(user || { email: 'unknown user', role: 'none' })}
      <main class="blocked-wrapper">
        <div class="blocked-card">
          <div class="lock-hero" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10V8.5C7 6.0 9 4 12 4C15 4 17 6.0 17 8.5V10M8 10H16C17.1 10 18 10.9 18 12V16.5C18 17.6 17.1 18.5 16 18.5H8C6.9 18.5 6 17.6 6 16.5V12C6 10.9 6.9 10 8 10Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></div>
          <h1>Access blocked</h1>
          <p class="blocked-copy">${appLabel} is unavailable for your current campus access.</p>
          <div class="blocked-meta">
            <span class="meta-pill">App: ${appLabel}</span>
            <span class="meta-pill">Role: ${roleLabel}</span>
          </div>
          <p class="blocked-copy"><strong>Reason:</strong> ${reasonText}</p>
          <p class="blocked-copy">This attempt has been recorded in the audit log.</p>
          <div class="page-actions" style="justify-content:center;">
            <a class="button-primary" href="/">Back to portal</a>
          </div>
        </div>
      </main>
    `, 403)
}

function renderAuditPage(rows) {
    const total = rows.length
    const allowedCount = rows.filter((row) => row.decision === 'allow').length
    const deniedCount = rows.filter((row) => row.decision === 'deny').length
    const rowsMarkup = rows.length
        ? rows.map((row) => `
            <tr class="audit-row audit-row--${row.decision === 'allow' ? 'allow' : 'deny'}">
              <td>${escapeHtml(new Date(row.ts).toLocaleString())}</td>
              <td>${escapeHtml(row.email || 'unknown')}</td>
              <td>${escapeHtml(row.app)}</td>
              <td><span class="decision-pill ${row.decision === 'allow' ? 'decision-allow' : 'decision-deny'}">${escapeHtml(row.decision)}</span></td>
              <td>${escapeHtml(row.reason)}</td>
              <td>${escapeHtml(row.country || '—')}</td>
            </tr>
          `).join('')
        : `<tr><td colspan="6"><div class="empty-state">No activity yet.</div></td></tr>`

    const script = `
      <script>
        (() => {
          const tableBody = document.getElementById('auditBody');
          const timeStamp = document.getElementById('updatedAt');
          const toggle = document.getElementById('toggleRefresh');
          let paused = false;
          let timer = null;
          let seen = new Set();

          function updateStamp() {
            timeStamp.textContent = 'Updated just now';
          }

          function paintRow(row) {
            const tr = document.createElement('tr');
            tr.className = 'audit-row audit-row--' + (row.decision === 'allow' ? 'allow' : 'deny');
            const cells = [
              new Date(row.ts).toLocaleString(),
              row.email || 'unknown',
              row.app,
              row.decision,
              row.reason,
              row.country || '—'
            ];
            cells.forEach((value, index) => {
              const td = document.createElement('td');
              if (index === 3) {
                const pill = document.createElement('span');
                pill.className = 'decision-pill ' + (row.decision === 'allow' ? 'decision-allow' : 'decision-deny');
                pill.textContent = row.decision;
                td.appendChild(pill);
              } else {
                td.textContent = value;
              }
              tr.appendChild(td);
            });
            return tr;
          }

          function renderRows(rows) {
            if (!rows.length) {
              tableBody.innerHTML = '<tr><td colspan="6"><div class="empty-state">No activity yet.</div></td></tr>';
              return;
            }
            const current = new Set();
            const fragment = document.createDocumentFragment();
            rows.forEach((row) => {
              current.add(String(row.id));
              const existing = Array.from(tableBody.children).find((element) => element.dataset.id === String(row.id));
              if (existing) {
                existing.replaceWith(paintRow(row));
                return;
              }
              const tr = paintRow(row);
              tr.dataset.id = String(row.id);
              if (!seen.has(String(row.id))) {
                tr.classList.add('flash');
                setTimeout(() => tr.classList.remove('flash'), 1500);
              }
              fragment.appendChild(tr);
            });
            Array.from(tableBody.children).forEach((node) => {
              if (!current.has(node.dataset.id)) {
                node.remove();
              }
            });
            tableBody.appendChild(fragment);
            seen = current;
          }

          function renderStats(rows) {
            const allowed = rows.filter((row) => row.decision === 'allow').length;
            const denied = rows.filter((row) => row.decision === 'deny').length;
            document.getElementById('allowedCount').textContent = String(allowed);
            document.getElementById('deniedCount').textContent = String(denied);
            document.getElementById('totalCount').textContent = String(rows.length);
          }

          async function refreshFeed() {
            if (paused) return;
            const response = await fetch('/api/admin/feed');
            const data = await response.json();
            const rows = Array.isArray(data.rows) ? data.rows : [];
            renderStats(rows);
            renderRows(rows);
            updateStamp();
            timer = setTimeout(refreshFeed, 3000);
          }

          toggle.addEventListener('click', () => {
            paused = !paused;
            toggle.textContent = paused ? 'Resume' : 'Pause';
            if (!paused) {
              refreshFeed();
            } else if (timer) {
              clearTimeout(timer);
              timer = null;
            }
          });

          refreshFeed();
        })();
      </script>
    `

    return page('Audit feed', `
      ${renderHeader({ email: 'admin@campus.test', role: 'admin' })}
      <main class="page-shell">
        <div class="page-card">
          <div class="audit-header">
            <div class="live-trace"><span class="live-dot" aria-hidden="true"></span> Live</div>
            <div class="top-actions">
              <span id="updatedAt" class="tiny-time">Updated just now</span>
              <button id="toggleRefresh" class="button-muted" type="button">Pause</button>
            </div>
          </div>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-label">Allowed</div><div id="allowedCount" class="stat-value">${allowedCount}</div></div>
            <div class="stat-card"><div class="stat-label">Denied</div><div id="deniedCount" class="stat-value">${deniedCount}</div></div>
            <div class="stat-card"><div class="stat-label">Total</div><div id="totalCount" class="stat-value">${total}</div></div>
          </div>
          <div class="audit-table-wrap">
            <table class="audit-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Email</th>
                  <th>App</th>
                  <th>Decision</th>
                  <th>Reason</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody id="auditBody">${rowsMarkup}</tbody>
            </table>
          </div>
        </div>
      </main>
    `, 200, script)
}

function adminDenied(c, user) {
    logAudit(c, user, 'admin-feed', 'deny', `role ${user.role} not allowed for admin feed`)
}

async function loadAuditRows(db) {
    const result = await db.prepare(
        'SELECT id, ts, email, app, decision, reason, country FROM audit_log ORDER BY id DESC LIMIT 50'
    ).all()
    return result.results || []
}

app.use('*', async(c, next) => {
    let access = null
    try {
        access = c.executionCtx ? c.executionCtx.access : null
    } catch {
        access = null
    }

    if ((c.req.path === '/health' && c.req.method === 'GET') || access) return next()

    logAudit(c, { email: null }, c.req.path, 'deny', 'Cloudflare Access context missing')
    if (c.req.path.startsWith('/api/')) {
        return c.json({ error: 'Access blocked' }, 403)
    }
    return blockedPage(c.req.path, { email: 'unknown user', role: 'none' }, 'Cloudflare Access context missing')
})

app.get('/health', (c) => c.json({ status: 'ok' }))

app.get('/', async(c) => {
    const user = await getUser(c)
    const appRules = await loadAppRules(c.env.DB)
    return renderLauncherPage(user, appRules)
})

app.get('/api/me', async(c) => c.json(await getUser(c)))

app.get('/api/apps', async(c) => {
    const user = await getUser(c)
    const appRules = await loadAppRules(c.env.DB)
    return c.json({
        apps: APP_NAMES.map((name) => ({
            app: name,
            allowed: appRules.get(name) ? appRules.get(name).includes(user.role) : false
        }))
    })
})

app.get('/app/:name', async(c) => {
    const name = c.req.param('name')
    const user = await getUser(c)
    const rule = await c.env.DB.prepare(
        'SELECT allowed_roles FROM app_rules WHERE app = ?'
    ).bind(name).first()
    const allowedRoles = parseRoles(rule)
    const allowed = allowedRoles.includes(user.role)
    const reason = rule ?
        `role ${user.role} ${allowed ? 'allowed' : 'not allowed'} for ${name}` :
        `no app rule configured for ${name}`

    logAudit(c, user, name, allowed ? 'allow' : 'deny', reason)
    if (!allowed) return blockedPage(name, user, reason)

    const details = APP_DETAILS[name]
    return renderAppPage(name, user, details)
})

app.get('/api/admin/feed', async(c) => {
    const user = await getUser(c)
    if (user.role !== 'admin') {
        adminDenied(c, user)
        return c.json({ error: 'Access blocked' }, 403)
    }

    logAudit(c, user, 'admin-feed', 'allow', 'role admin allowed for admin feed')
    return c.json({ rows: await loadAuditRows(c.env.DB) })
})

app.get('/admin/feed', async(c) => {
    const user = await getUser(c)
    if (user.role !== 'admin') {
        adminDenied(c, user)
        return blockedPage('admin feed', user, `role ${user.role} not allowed for admin feed`)
    }

    logAudit(c, user, 'admin-feed', 'allow', 'role admin allowed for admin feed')
    const rows = await loadAuditRows(c.env.DB)
    return renderAuditPage(rows)
})

app.notFound((c) => c.json({ error: 'Not found' }, 404))

app.onError((error, c) => {
    console.error(error)
    if (c.req.path.startsWith('/api/')) {
        return c.json({ error: 'Internal server error' }, 500)
    }
    return page('Error', '<div class="page-shell"><div class="page-card"><h1>Something went wrong</h1><p>Please try again later.</p></div></div>', 500)
})

export default app