import { useState, useEffect, useCallback, useRef } from "react";

// ─── Sprout Society Brand Colors & Design System ─────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sprout-green: #2D5016;
    --sprout-sage: #7A9E5B;
    --sprout-lime: #B8D96E;
    --sprout-cream: #F7F3EC;
    --sprout-warm: #E8DFC8;
    --sprout-earth: #8B6F47;
    --sprout-bark: #4A3728;
    --sprout-sky: #6BAED6;
    --sprout-coral: #E07B54;
    --sprout-gold: #D4A840;
    --text-primary: #1C2B0E;
    --text-secondary: #5A6B40;
    --text-muted: #8A9B72;
    --border: #D4DEAD;
    --shadow: 0 2px 12px rgba(45,80,22,0.10);
    --shadow-lg: 0 8px 32px rgba(45,80,22,0.15);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--sprout-cream); color: var(--text-primary); }

  .app { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sidebar {
    width: 240px; min-width: 240px; background: var(--sprout-green);
    padding: 24px 0; display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; height: 100vh; overflow-y: auto; z-index: 100;
  }
  .sidebar-logo {
    padding: 0 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.12);
    margin-bottom: 16px;
  }
  .sidebar-logo h1 { font-family: 'Lora', serif; color: var(--sprout-lime); font-size: 18px; line-height: 1.3; }
  .sidebar-logo p { color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 3px; letter-spacing: 0.05em; text-transform: uppercase; }
  .nav-section { padding: 0 12px; margin-bottom: 8px; }
  .nav-label { color: rgba(255,255,255,0.35); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; padding: 0 8px; margin-bottom: 6px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 8px; cursor: pointer; color: rgba(255,255,255,0.7);
    font-size: 14px; font-weight: 500; transition: all 0.15s; margin-bottom: 2px;
  }
  .nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .nav-item.active { background: var(--sprout-sage); color: #fff; }
  .nav-item .badge {
    margin-left: auto; background: var(--sprout-lime); color: var(--sprout-green);
    border-radius: 10px; padding: 1px 7px; font-size: 11px; font-weight: 700;
  }
  .sidebar-footer { margin-top: auto; padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.12); }
  .sidebar-footer p { color: rgba(255,255,255,0.4); font-size: 11px; }

  /* Main */
  .main { margin-left: 240px; flex: 1; padding: 32px; min-height: 100vh; }
  .page-header { margin-bottom: 28px; }
  .page-header h2 { font-family: 'Lora', serif; font-size: 28px; color: var(--sprout-green); }
  .page-header p { color: var(--text-secondary); margin-top: 6px; font-size: 15px; }

  /* Cards */
  .card {
    background: #fff; border-radius: 14px; padding: 24px;
    box-shadow: var(--shadow); border: 1px solid var(--border); margin-bottom: 16px;
  }
  .card-sm { padding: 16px; }

  /* Stat Cards */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: #fff; border-radius: 14px; padding: 20px;
    box-shadow: var(--shadow); border: 1px solid var(--border);
  }
  .stat-card .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 8px; }
  .stat-card .value { font-family: 'Lora', serif; font-size: 32px; color: var(--sprout-green); font-weight: 700; }
  .stat-card .sub { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 7px; padding: 10px 18px;
    border-radius: 8px; border: none; cursor: pointer; font-size: 14px;
    font-weight: 600; font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .btn-primary { background: var(--sprout-green); color: #fff; }
  .btn-primary:hover { background: #3a6b1e; transform: translateY(-1px); box-shadow: var(--shadow); }
  .btn-primary:disabled { background: #aaa; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-secondary { background: var(--sprout-warm); color: var(--sprout-bark); }
  .btn-secondary:hover { background: #ddd4bb; }
  .btn-outline { background: transparent; color: var(--sprout-green); border: 2px solid var(--sprout-green); }
  .btn-outline:hover { background: var(--sprout-green); color: #fff; }
  .btn-danger { background: #FEE2E2; color: #B91C1C; }
  .btn-danger:hover { background: #FECACA; }
  .btn-sm { padding: 6px 12px; font-size: 13px; }

  /* Form */
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; }
  .form-input, .form-textarea, .form-select {
    width: 100%; padding: 10px 14px; border: 1.5px solid var(--border);
    border-radius: 8px; font-size: 14px; font-family: 'DM Sans', sans-serif;
    color: var(--text-primary); background: #fff; transition: border-color 0.15s;
    outline: none;
  }
  .form-input:focus, .form-textarea:focus, .form-select:focus { border-color: var(--sprout-sage); }
  .form-textarea { resize: vertical; min-height: 80px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* Tags / Badges */
  .tag {
    display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px;
    border-radius: 20px; font-size: 12px; font-weight: 600;
  }
  .tag-green { background: #DCFCE7; color: #166534; }
  .tag-yellow { background: #FEF9C3; color: #854D0E; }
  .tag-blue { background: #DBEAFE; color: #1E40AF; }
  .tag-red { background: #FEE2E2; color: #991B1B; }
  .tag-gray { background: #F3F4F6; color: #374151; }
  .tag-orange { background: #FEF3C7; color: #92400E; }

  /* Search */
  .search-box {
    display: flex; gap: 12px; margin-bottom: 24px; align-items: flex-start; flex-wrap: wrap;
  }
  .search-input-wrap { flex: 1; position: relative; min-width: 200px; }
  .search-input-wrap input { padding-left: 40px; }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }

  /* Grant Card */
  .grant-card {
    background: #fff; border-radius: 14px; padding: 20px 24px;
    box-shadow: var(--shadow); border: 1px solid var(--border);
    margin-bottom: 12px; cursor: pointer; transition: all 0.18s;
  }
  .grant-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); border-color: var(--sprout-sage); }
  .grant-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .grant-card h3 { font-family: 'Lora', serif; font-size: 17px; color: var(--text-primary); margin-bottom: 4px; }
  .grant-card .funder { font-size: 13px; color: var(--text-secondary); }
  .grant-card-meta { display: flex; gap: 10px; align-items: center; margin-top: 12px; flex-wrap: wrap; }
  .grant-card-desc { color: var(--text-secondary); font-size: 14px; margin-top: 10px; line-height: 1.6; }

  /* Grant Detail */
  .detail-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
  .detail-title { font-family: 'Lora', serif; font-size: 26px; color: var(--sprout-green); }
  .detail-funder { font-size: 15px; color: var(--text-secondary); margin-top: 4px; }

  .tabs { display: flex; gap: 4px; margin-bottom: 24px; background: var(--sprout-warm); padding: 4px; border-radius: 10px; width: fit-content; }
  .tab { padding: 8px 18px; border-radius: 7px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text-secondary); transition: all 0.15s; }
  .tab.active { background: #fff; color: var(--sprout-green); box-shadow: var(--shadow); font-weight: 600; }

  /* Todo */
  .todo-item {
    display: flex; align-items: flex-start; gap: 12px; padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }
  .todo-item:last-child { border-bottom: none; }
  .todo-check {
    width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border);
    cursor: pointer; flex-shrink: 0; margin-top: 2px; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .todo-check.done { background: var(--sprout-sage); border-color: var(--sprout-sage); }
  .todo-item.done .todo-text { text-decoration: line-through; color: var(--text-muted); }
  .todo-text { flex: 1; font-size: 14px; line-height: 1.5; }
  .todo-due { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
  .todo-priority { font-size: 11px; padding: 2px 7px; border-radius: 10px; font-weight: 600; }
  .priority-high { background: #FEE2E2; color: #B91C1C; }
  .priority-med { background: #FEF9C3; color: #854D0E; }
  .priority-low { background: #DCFCE7; color: #166534; }

  /* Timeline */
  .timeline { position: relative; padding-left: 24px; }
  .timeline::before { content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background: var(--border); }
  .timeline-item { position: relative; padding-bottom: 24px; }
  .timeline-dot {
    position: absolute; left: -20px; top: 4px; width: 12px; height: 12px;
    border-radius: 50%; background: var(--sprout-sage); border: 2px solid #fff;
    box-shadow: 0 0 0 2px var(--sprout-sage);
  }
  .timeline-dot.done { background: var(--sprout-green); box-shadow: 0 0 0 2px var(--sprout-green); }
  .timeline-dot.upcoming { background: var(--border); box-shadow: 0 0 0 2px var(--border); }
  .timeline-date { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
  .timeline-title { font-weight: 600; font-size: 14px; color: var(--text-primary); }
  .timeline-desc { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }

  /* AI Search result */
  .ai-result-card {
    background: #fff; border: 1.5px solid var(--border); border-radius: 12px;
    padding: 20px; margin-bottom: 12px; transition: border-color 0.15s;
  }
  .ai-result-card:hover { border-color: var(--sprout-sage); }
  .ai-result-card h3 { font-family: 'Lora', serif; font-size: 16px; color: var(--text-primary); margin-bottom: 4px; }
  .ai-result-card .funder { color: var(--text-secondary); font-size: 13px; margin-bottom: 10px; }
  .ai-result-card p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
  .ai-result-meta { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0; }
  .ai-result-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }

  /* Loading */
  .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-overlay { text-align: center; padding: 48px; color: var(--text-secondary); }
  .loading-overlay .big-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--sprout-sage); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }

  /* Empty state */
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
  .empty-state .icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state h3 { font-family: 'Lora', serif; color: var(--text-secondary); margin-bottom: 8px; }

  /* Profile section */
  .section-title { font-family: 'Lora', serif; font-size: 18px; color: var(--sprout-green); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid var(--sprout-warm); }

  /* Progress bar */
  .progress-bar { height: 8px; background: var(--sprout-warm); border-radius: 4px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--sprout-sage); border-radius: 4px; transition: width 0.4s; }

  /* Notification */
  .toast {
    position: fixed; bottom: 24px; right: 24px; background: var(--sprout-green); color: #fff;
    padding: 12px 20px; border-radius: 10px; box-shadow: var(--shadow-lg);
    font-size: 14px; z-index: 9999; animation: slideIn 0.3s ease;
  }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* Dashboard recent */
  .recent-list .recent-item {
    display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .recent-item:last-child { border-bottom: none; }
  .recent-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--sprout-warm); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .recent-info h4 { font-size: 14px; font-weight: 600; }
  .recent-info p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .recent-amount { margin-left: auto; font-weight: 700; color: var(--sprout-green); font-size: 14px; }

  .deadline-warning { color: var(--sprout-coral); font-weight: 600; }

  /* Notes */
  .notes-area { background: var(--sprout-cream); border-radius: 10px; padding: 16px; min-height: 120px; border: 1.5px solid var(--border); }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  /* Notifications */
  .notif-bell {
    position: relative; display: flex; align-items: center; justify-content: center;
    cursor: pointer; padding: 8px; border-radius: 8px; transition: background 0.15s;
  }
  .notif-bell:hover { background: rgba(255,255,255,0.08); }
  .notif-badge {
    position: absolute; top: 2px; right: 2px; min-width: 18px; height: 18px;
    background: var(--sprout-coral); color: #fff; border-radius: 10px;
    font-size: 10px; font-weight: 800; display: flex; align-items: center;
    justify-content: center; padding: 0 4px; border: 2px solid var(--sprout-green);
  }
  .notif-panel {
    position: fixed; top: 0; right: 0; width: 380px; height: 100vh; background: #fff;
    box-shadow: -8px 0 32px rgba(0,0,0,0.12); z-index: 200; display: flex;
    flex-direction: column; animation: notifSlide 0.22s ease;
  }
  @keyframes notifSlide { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .notif-header {
    padding: 20px 20px 16px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .notif-header h3 { font-family: 'Lora', serif; font-size: 18px; color: var(--sprout-green); }
  .notif-list { flex: 1; overflow-y: auto; padding: 8px 0; }
  .notif-item {
    display: flex; gap: 12px; padding: 14px 20px; border-bottom: 1px solid #f3f4f6;
    cursor: pointer; transition: background 0.12s;
  }
  .notif-item:hover { background: var(--sprout-cream); }
  .notif-item.unread { background: rgba(122,158,91,0.06); }
  .notif-item.unread:hover { background: rgba(122,158,91,0.1); }
  .notif-icon-wrap {
    width: 36px; height: 36px; border-radius: 10px; display: flex;
    align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
  }
  .notif-content { flex: 1; min-width: 0; }
  .notif-content h4 { font-size: 13px; font-weight: 600; color: var(--text-primary); line-height: 1.4; }
  .notif-content p { font-size: 12px; color: var(--text-muted); margin-top: 3px; }
  .notif-time { font-size: 11px; color: var(--text-muted); white-space: nowrap; flex-shrink: 0; margin-top: 1px; }
  .notif-empty { text-align: center; padding: 48px 20px; color: var(--text-muted); }

  /* Auto-refresh indicator */
  .auto-refresh-bar {
    display: flex; align-items: center; gap: 8px; padding: 10px 16px;
    background: rgba(122,158,91,0.08); border: 1px solid rgba(122,158,91,0.2);
    border-radius: 10px; margin-bottom: 14px; font-size: 13px; color: var(--text-secondary);
  }
  .auto-refresh-bar .pulse-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--sprout-sage);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  /* Custom tag input */
  .tag-input-wrap {
    display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 12px;
    border: 1.5px solid var(--border); border-radius: 8px; background: #fff;
    min-height: 44px; align-items: center; cursor: text; transition: border-color 0.15s;
  }
  .tag-input-wrap:focus-within { border-color: var(--sprout-sage); }
  .tag-input-wrap input {
    border: none; outline: none; font-size: 14px; font-family: 'DM Sans', sans-serif;
    color: var(--text-primary); flex: 1; min-width: 120px; padding: 4px 0;
    background: transparent;
  }
  .custom-tag {
    display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px;
    background: var(--sprout-warm); border-radius: 16px; font-size: 13px;
    font-weight: 600; color: var(--sprout-bark); white-space: nowrap;
  }
  .custom-tag button {
    background: none; border: none; cursor: pointer; font-size: 14px;
    color: var(--sprout-bark); opacity: 0.5; padding: 0; line-height: 1;
    transition: opacity 0.15s;
  }
  .custom-tag button:hover { opacity: 1; }

  /* Export button */
  .export-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px;
    border-radius: 8px; border: 1.5px solid var(--border); background: #fff;
    font-size: 13px; font-weight: 600; color: var(--text-secondary); cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .export-btn:hover { border-color: var(--sprout-sage); color: var(--sprout-green); background: var(--sprout-cream); }

  /* Documents & Strategy Library */
  .doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  .doc-card {
    background: #fff; border-radius: 14px; padding: 20px;
    box-shadow: var(--shadow); border: 1px solid var(--border);
    transition: all 0.18s; position: relative;
  }
  .doc-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); border-color: var(--sprout-sage); }
  .doc-icon {
    width: 44px; height: 44px; border-radius: 12px; display: flex;
    align-items: center; justify-content: center; font-size: 22px; margin-bottom: 12px;
  }
  .doc-card h4 { font-family: 'Lora', serif; font-size: 15px; color: var(--text-primary); margin-bottom: 4px; word-break: break-word; }
  .doc-card .doc-meta { font-size: 12px; color: var(--text-muted); margin-top: 8px; }
  .doc-card .doc-preview { font-size: 13px; color: var(--text-secondary); margin-top: 8px; line-height: 1.5; max-height: 60px; overflow: hidden; }
  .upload-zone {
    border: 2px dashed var(--border); border-radius: 14px; padding: 40px 24px;
    text-align: center; cursor: pointer; transition: all 0.2s; background: #fff;
  }
  .upload-zone:hover { border-color: var(--sprout-sage); background: var(--sprout-cream); }
  .upload-zone.active { border-color: var(--sprout-sage); background: rgba(122,158,91,0.06); }
  .upload-zone .icon { font-size: 36px; margin-bottom: 10px; }

  /* Strategy doc viewer */
  .strat-doc-content {
    background: #fff; border-radius: 14px; padding: 28px;
    box-shadow: var(--shadow); border: 1px solid var(--border);
    font-size: 14px; line-height: 1.8; color: var(--text-primary);
    white-space: pre-wrap; word-break: break-word;
  }
  .strat-doc-content strong { color: var(--sprout-green); }

  /* Multi-type tags / chips */
  .type-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
  .type-chip {
    display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px;
    border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer;
    border: 1.5px solid var(--border); background: #fff; color: var(--text-secondary);
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .type-chip:hover { border-color: var(--sprout-sage); background: var(--sprout-cream); }
  .type-chip.selected { background: var(--sprout-green); color: #fff; border-color: var(--sprout-green); }

  /* Database selector */
  .db-selector { display: flex; gap: 6px; flex-wrap: wrap; }
  .db-chip {
    padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1.5px solid var(--border); background: #fff;
    color: var(--text-secondary); transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .db-chip:hover { border-color: var(--sprout-sage); }
  .db-chip.selected { background: var(--sprout-sage); color: #fff; border-color: var(--sprout-sage); }

  /* Saved grants dashboard card */
  .saved-preview-card {
    display: flex; align-items: center; gap: 12px; padding: 10px 0;
    border-bottom: 1px solid var(--border); cursor: pointer;
  }
  .saved-preview-card:last-child { border-bottom: none; }
  .saved-preview-card:hover .saved-name { color: var(--sprout-sage); }
  .saved-name { font-size: 14px; font-weight: 600; transition: color 0.15s; }

  /* Sidebar collapsed */
  .sidebar.collapsed { width: 56px; min-width: 56px; }
  .sidebar.collapsed .sidebar-logo h1,
  .sidebar.collapsed .sidebar-logo p,
  .sidebar.collapsed .nav-label,
  .sidebar.collapsed .sidebar-footer p { display: none; }
  .sidebar.collapsed .nav-text { display: none; }
  .sidebar.collapsed .nav-item { justify-content: center; padding: 10px 8px; gap: 0; position: relative; }
  .sidebar.collapsed .nav-item .badge { position: absolute; top: 2px; right: 2px; margin: 0; font-size: 9px; padding: 0 4px; }
  .sidebar.collapsed .sidebar-logo { padding: 0 8px 16px; text-align: center; }
  .sidebar.collapsed .sidebar-footer { padding: 8px; text-align: center; }
  .main.collapsed { margin-left: 56px; }
  .expand-btn {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 10px 0; margin-top: 8px;
    background: rgba(255,255,255,0.08); border: none; color: rgba(255,255,255,0.7);
    cursor: pointer; font-size: 18px; border-radius: 6px; transition: all 0.15s;
  }
  .expand-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
  .sidebar-toggle {
    background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer;
    font-size: 18px; padding: 4px; border-radius: 4px; transition: all 0.15s;
  }
  .sidebar-toggle:hover { color: #fff; background: rgba(255,255,255,0.1); }

  /* Task Overlay / Card Modal */
  .task-overlay-bg {
    position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 300;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .task-card-modal {
    background: #fff; border-radius: 16px; width: 560px; max-width: 94vw;
    max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: modalSlide 0.2s ease;
  }
  @keyframes modalSlide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .task-card-header {
    padding: 20px 24px 16px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .task-card-body { padding: 20px 24px; }
  .task-card-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; }
  .task-field { margin-bottom: 16px; }
  .task-field-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .task-field-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .task-notes { min-height: 80px; font-size: 14px; line-height: 1.6; }

  /* Search Chat */
  .search-chat {
    background: #fff; border: 1.5px solid var(--border); border-radius: 14px;
    margin-bottom: 20px; overflow: hidden;
  }
  .search-chat-header {
    background: linear-gradient(135deg, var(--sprout-green) 0%, var(--sprout-sage) 100%);
    padding: 14px 18px; display: flex; align-items: center; gap: 10px; cursor: pointer;
  }
  .search-chat-header h4 { color: #fff; font-size: 14px; font-weight: 700; font-family: 'Lora', serif; }
  .search-chat-header p { color: rgba(255,255,255,0.75); font-size: 11px; }
  .search-chat-body { max-height: 360px; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
  .search-chat-body::-webkit-scrollbar { width: 4px; }
  .search-chat-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .search-chat-msg {
    max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.6;
    white-space: pre-wrap; word-break: break-word;
  }
  .search-chat-msg.user { background: var(--sprout-green); color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
  .search-chat-msg.assistant { background: var(--sprout-cream); color: var(--text-primary); align-self: flex-start; border: 1px solid var(--border); border-bottom-left-radius: 4px; }
  .search-chat-msg.assistant strong { color: var(--sprout-green); }
  .search-chat-msg.system { background: rgba(122,158,91,0.08); color: var(--text-secondary); align-self: center; border-radius: 8px; font-size: 12px; text-align: center; max-width: 95%; }
  .search-chat-input {
    display: flex; gap: 8px; padding: 12px 14px; border-top: 1px solid var(--border); background: #fff;
  }
  .search-chat-input textarea {
    flex: 1; border: 1.5px solid var(--border); border-radius: 8px; padding: 8px 12px;
    font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; resize: none;
    min-height: 38px; max-height: 80px; color: var(--text-primary);
  }
  .search-chat-input textarea:focus { border-color: var(--sprout-sage); }
  .search-chat-input button {
    width: 38px; height: 38px; border-radius: 8px; border: none; cursor: pointer;
    background: var(--sprout-green); color: #fff; font-size: 16px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; align-self: flex-end;
  }
  .search-chat-input button:disabled { background: var(--border); cursor: not-allowed; }

  /* Chat History */
  .chat-thread-card {
    background: #fff; border-radius: 12px; padding: 16px 20px;
    box-shadow: var(--shadow); border: 1px solid var(--border);
    margin-bottom: 10px; cursor: pointer; transition: all 0.15s;
  }
  .chat-thread-card:hover { box-shadow: var(--shadow-lg); border-color: var(--sprout-sage); }
  .chat-thread-card h4 { font-family: 'Lora', serif; font-size: 15px; color: var(--text-primary); margin-bottom: 4px; }
  .chat-thread-preview { font-size: 13px; color: var(--text-secondary); line-height: 1.5; max-height: 40px; overflow: hidden; }
  .chat-thread-meta { display: flex; gap: 8px; align-items: center; margin-top: 8px; font-size: 11px; color: var(--text-muted); }

  /* Gantt enhanced */
  .gantt-gridline { position: absolute; top: 0; bottom: 0; width: 1px; background: #f0f0f0; }
  .gantt-axis-label { font-size: 10px; color: var(--text-muted); text-align: center; flex-shrink: 0; }
  .gantt-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 14px; }
  .gantt-scale-btn {
    padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1.5px solid var(--border); background: #fff;
    color: var(--text-secondary); font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .gantt-scale-btn:hover { border-color: var(--sprout-sage); }
  .gantt-scale-btn.active { background: var(--sprout-green); color: #fff; border-color: var(--sprout-green); }
  .gantt-row.clickable { cursor: pointer; }
  .gantt-row.clickable:hover { background: rgba(122,158,91,0.04); }
  .gantt-hours { font-size: 11px; color: var(--text-muted); padding: 0 4px; white-space: nowrap; }

  /* Gantt Chart */
  .gantt-container { overflow-x: auto; padding-bottom: 8px; }
  .gantt-chart { min-width: 600px; }
  .gantt-row { display: flex; align-items: center; border-bottom: 1px solid #f0f0f0; min-height: 36px; }
  .gantt-label { width: 180px; min-width: 180px; padding: 8px 12px; font-size: 12px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .gantt-track { flex: 1; position: relative; height: 28px; }
  .gantt-bar {
    position: absolute; height: 20px; top: 4px; border-radius: 4px; min-width: 8px;
    font-size: 10px; color: #fff; display: flex; align-items: center; padding: 0 6px;
    white-space: nowrap; overflow: hidden;
  }
  .gantt-bar.research { background: var(--sprout-sky); }
  .gantt-bar.writing { background: var(--sprout-sage); }
  .gantt-bar.documents { background: var(--sprout-earth); }
  .gantt-bar.review { background: var(--sprout-gold); }
  .gantt-bar.submit { background: var(--sprout-coral); }
  .gantt-bar.general { background: var(--text-muted); }
  .gantt-bar.done { opacity: 0.5; }
  .gantt-header { display: flex; border-bottom: 2px solid var(--border); padding-bottom: 4px; margin-bottom: 4px; }
  .gantt-header-label { width: 180px; min-width: 180px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 12px; }
  .gantt-header-track { flex: 1; display: flex; justify-content: space-between; padding: 4px 0; }
  .gantt-date-marker { font-size: 10px; color: var(--text-muted); }
  .gantt-today { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--sprout-coral); z-index: 1; }
  .gantt-legend { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px; }
  .gantt-legend-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-muted); }
  .gantt-legend-dot { width: 10px; height: 10px; border-radius: 3px; }

  /* URL input highlight */
  .field-missing { border-color: #EF4444 !important; background: #FEF2F2 !important; }
  .missing-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: #EF4444; font-weight: 600; }

  /* Saved search card */
  .saved-search-card {
    background: #fff; border-radius: 14px; padding: 18px;
    box-shadow: var(--shadow); border: 1px solid var(--border);
    margin-bottom: 12px; transition: all 0.15s;
  }
  .saved-search-card:hover { box-shadow: var(--shadow-lg); }

  @media (max-width: 768px) {
    .sidebar { width: 200px; min-width: 200px; }
    .sidebar.collapsed { width: 48px; min-width: 48px; }
    .main { margin-left: 200px; padding: 20px; }
    .main.collapsed { margin-left: 48px; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .form-grid { grid-template-columns: 1fr; }
    .two-col { grid-template-columns: 1fr; }
    .doc-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    dashboard: "🌿", search: "🔍", grants: "📋", profile: "🏢",
    add: "＋", check: "✓", trash: "🗑", edit: "✏️", arrow: "→",
    calendar: "📅", money: "💰", save: "💾", back: "←", star: "⭐",
    deadline: "⏰", pending: "⏳", submitted: "✉️", awarded: "🏆",
    rejected: "✗", todo: "☑️", timeline: "📅", notes: "📝",
    info: "ℹ️", link: "🔗", sprout: "🌱", ai: "✨",
    docs: "📁", strategy: "🧭", upload: "⬆️", file: "📄", database: "🗄️"
  };
  return <span style={{ fontSize: size }}>{icons[name] || "•"}</span>;
};

// ─── Default Org Profile ──────────────────────────────────────────────────────
const DEFAULT_PROFILE = {
  orgName: "Sprout Society",
  legalName: "Sprout Society LLC / The RJE Foundation",
  taxId: "83-1298420",
  address: "449 Troutman St, Unit C1, Brooklyn, NY 11237",
  website: "https://sproutsociety.org",
  phone: "",
  email: "",
  contactPerson: "",
  contactTitle: "",
  founded: "2018",
  mission: "Sprout Society builds community and fosters connection for mental wellness. We believe nobody should go through it alone. Through peer support models, we help combat the loneliness epidemic by providing free, evidence-based programs including one-on-one empathetic stranger connections, peer support groups, and expert-led Connect to Learn sessions.",
  vision: "A world where everyone has access to community and peer support for mental wellness, free of cost.",
  programs: "Empathetic Strangers (1:1 peer connection), Peer Support Groups, Connect to Learn (expert-led sessions)",
  targetPopulation: "Adults experiencing loneliness, depression, or mental health challenges; young adults aged 19-29; underserved communities in Brooklyn, NY",
  annualBudget: "",
  numEmployees: "",
  numVolunteers: "",
  serviceArea: "Brooklyn, NY / New York City",
  outcomes: "Free mental health peer support programs; community building; reducing loneliness and social isolation",
  nonprofit501c3: "Yes — nonprofit through The RJE Foundation",
  instagram: "https://www.instagram.com/sproutsocietyorg/",
  linkedin: "https://www.linkedin.com/company/sproutsocietyorg/",
  sdgAligned: "SDG 3 (Good Health and Well-Being), SDG 10 (Reduced Inequalities), SDG 11 (Sustainable Communities)",
};

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS_META = {
  researching: { label: "Researching", cls: "tag-gray" },
  inProgress:  { label: "In Progress", cls: "tag-blue" },
  submitted:   { label: "Submitted",   cls: "tag-yellow" },
  awarded:     { label: "Awarded 🏆",  cls: "tag-green" },
  rejected:    { label: "Not Funded",  cls: "tag-red" },
  notStarted:  { label: "Not Started", cls: "tag-gray" },
};

function statusTag(status) {
  const m = STATUS_META[status] || { label: status, cls: "tag-gray" };
  return <span className={`tag ${m.cls}`}>{m.label}</span>;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  return diff;
}

function formatAmount(n) {
  if (!n) return "Unknown";
  return "$" + Number(n).toLocaleString();
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App({ onLogout, userEmail, onSwitchTool }) {
  const [view, setView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [grants, setGrants] = useState([]);
  const [savedGrants, setSavedGrants] = useState([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [documents, setDocuments] = useState([]);
  const [strategyDocs, setStrategyDocs] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [searchRunHistory, setSearchRunHistory] = useState([]);
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lifted search state (persists across tab switches)
  const [searchState, setSearchState] = useState({
    results: [],
    filteredOut: 0,
    searchQuery: "",
    filters: { category: "all", size: "all", deadlineWindow: "all" },
    searched: false,
    selectedDatabases: ["all"],
    selectedTypes: [],
    customTags: [],
    autoRefresh: false,
    lastRefreshTime: null,
    searchedUrls: [],
    searching: false,
  });

  // Notification system
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const autoRefreshRef = useRef(null);

  // ── Persist to storage ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const g = await window.storage.get("sprout_grants");
        if (g) setGrants(JSON.parse(g.value));
        const s = await window.storage.get("sprout_saved");
        if (s) setSavedGrants(JSON.parse(s.value));
        const p = await window.storage.get("sprout_profile");
        if (p) setProfile(JSON.parse(p.value));
        const d = await window.storage.get("sprout_documents");
        if (d) setDocuments(JSON.parse(d.value));
        const sd = await window.storage.get("sprout_strategy");
        if (sd) setStrategyDocs(JSON.parse(sd.value));
        const n = await window.storage.get("sprout_notifications");
        if (n) setNotifications(JSON.parse(n.value));
        const ss = await window.storage.get("sprout_search_state");
        if (ss) setSearchState(prev => ({ ...prev, ...JSON.parse(ss.value) }));
        const svs = await window.storage.get("sprout_saved_searches");
        if (svs) setSavedSearches(JSON.parse(svs.value));
        const ch = await window.storage.get("sprout_chat_history");
        if (ch) setChatHistory(JSON.parse(ch.value));
        const srh = await window.storage.get("sprout_search_run_history");
        if (srh) setSearchRunHistory(JSON.parse(srh.value));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const saveGrants = useCallback(async (updated) => {
    setGrants(updated);
    try { await window.storage.set("sprout_grants", JSON.stringify(updated)); } catch {}
  }, []);

  const saveSavedGrants = useCallback(async (updated) => {
    setSavedGrants(updated);
    try { await window.storage.set("sprout_saved", JSON.stringify(updated)); } catch {}
  }, []);

  const saveProfile = useCallback(async (updated) => {
    setProfile(updated);
    try { await window.storage.set("sprout_profile", JSON.stringify(updated)); } catch {}
  }, []);

  const saveDocuments = useCallback(async (updated) => {
    setDocuments(updated);
    try { await window.storage.set("sprout_documents", JSON.stringify(updated)); } catch {}
  }, []);

  const saveStrategyDocs = useCallback(async (updated) => {
    setStrategyDocs(updated);
    try { await window.storage.set("sprout_strategy", JSON.stringify(updated)); } catch {}
  }, []);

  const saveNotifications = useCallback(async (updated) => {
    setNotifications(updated);
    try { await window.storage.set("sprout_notifications", JSON.stringify(updated)); } catch {}
  }, []);

  const addNotification = useCallback((notif) => {
    setNotifications(prev => {
      const updated = [{ id: `notif_${Date.now()}_${Math.random().toString(36).slice(2,5)}`, read: false, createdAt: new Date().toISOString(), ...notif }, ...prev].slice(0, 50);
      try { window.storage.set("sprout_notifications", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const saveSavedSearches = useCallback(async (updated) => {
    setSavedSearches(updated);
    try { await window.storage.set("sprout_saved_searches", JSON.stringify(updated)); } catch {}
  }, []);

  const saveChatHistory = useCallback(async (updated) => {
    setChatHistory(updated);
    try { await window.storage.set("sprout_chat_history", JSON.stringify(updated)); } catch {}
  }, []);

  const saveSearchRunHistory = useCallback(async (updated) => {
    setSearchRunHistory(updated);
    try { await window.storage.set("sprout_search_run_history", JSON.stringify(updated)); } catch {}
  }, []);

  // Scheduled auto-refresh at 10am, 4pm, 8pm
  useEffect(() => {
    if (savedSearches.filter(s => s.autoRefresh).length === 0) return;
    const REFRESH_HOURS = [10, 16, 20];
    const checkSchedule = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      if (REFRESH_HOURS.includes(hour) && minute < 5) {
        const todayKey = `${now.toISOString().split("T")[0]}_${hour}`;
        setSavedSearches(prev => {
          let changed = false;
          const updated = prev.map(s => {
            if (!s.autoRefresh || s.lastScheduledKey === todayKey) return s;
            changed = true;
            return { ...s, needsRefresh: true, lastScheduledKey: todayKey };
          });
          if (changed) { try { window.storage.set("sprout_saved_searches", JSON.stringify(updated)); } catch {} }
          return changed ? updated : prev;
        });
      }
    };
    checkSchedule();
    const interval = setInterval(checkSchedule, 60000);
    return () => clearInterval(interval);
  }, [savedSearches.length]);

  // Persist search state when it changes (debounced via key fields)
  useEffect(() => {
    const { autoRefresh, lastRefreshTime, customTags, selectedTypes, selectedDatabases, filters, searchQuery, searchedUrls } = searchState;
    try { window.storage.set("sprout_search_state", JSON.stringify({ autoRefresh, lastRefreshTime, customTags, selectedTypes, selectedDatabases, filters, searchQuery, searchedUrls })); } catch {}
  }, [searchState.autoRefresh, searchState.lastRefreshTime, searchState.customTags, searchState.selectedTypes, searchState.selectedDatabases, searchState.searchQuery, searchState.searchedUrls]);

  // Show popup when background search finishes on a different page
  const prevSearchingRef = useRef(false);
  useEffect(() => {
    if (prevSearchingRef.current && !searchState.searching && searchState.searched && view !== "searchGrants") {
      const count = (searchState.results || []).length;
      showToast(`Grant search complete — ${count} result${count !== 1 ? "s" : ""} found!`);
      addNotification({
        type: "newGrant",
        title: `✨ Grant search finished`,
        body: `${count} grant${count !== 1 ? "s" : ""} found. Go to Find Grants to review.`,
        icon: "✨",
        iconBg: "#DCFCE7",
      });
    }
    prevSearchingRef.current = searchState.searching;
  }, [searchState.searching]);

  // Generate deadline & outstanding work notifications on load and periodically
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      grants.forEach(g => {
        if (!g.deadline || g.status === "awarded" || g.status === "rejected" || g.status === "submitted") return;
        const days = Math.ceil((new Date(g.deadline) - now) / 86400000);
        const notifKey = `deadline_${g.id}_${days <= 3 ? "3d" : days <= 7 ? "7d" : "14d"}`;
        if (days <= 14 && days > 7) {
          setNotifications(prev => {
            if (prev.some(n => n.key === notifKey)) return prev;
            const updated = [{ id: `notif_${Date.now()}`, key: notifKey, type: "deadline", read: false, createdAt: new Date().toISOString(), title: `📅 ${g.name} due in ${days} days`, body: `Deadline: ${g.deadline} — ${g.funder}`, grantId: g.id, icon: "📅", iconBg: "#FEF9C3" }, ...prev].slice(0, 50);
            try { window.storage.set("sprout_notifications", JSON.stringify(updated)); } catch {}
            return updated;
          });
        } else if (days <= 7 && days > 3) {
          setNotifications(prev => {
            if (prev.some(n => n.key === notifKey)) return prev;
            const updated = [{ id: `notif_${Date.now()}`, key: notifKey, type: "deadline", read: false, createdAt: new Date().toISOString(), title: `⚠️ ${g.name} due in ${days} days!`, body: `Deadline: ${g.deadline} — ${g.funder}. Review your application progress.`, grantId: g.id, icon: "⚠️", iconBg: "#FEF3C7" }, ...prev].slice(0, 50);
            try { window.storage.set("sprout_notifications", JSON.stringify(updated)); } catch {}
            return updated;
          });
        } else if (days <= 3 && days >= 0) {
          setNotifications(prev => {
            if (prev.some(n => n.key === notifKey)) return prev;
            const updated = [{ id: `notif_${Date.now()}`, key: notifKey, type: "deadline", read: false, createdAt: new Date().toISOString(), title: `🚨 ${g.name} due ${days === 0 ? "TODAY" : `in ${days} day${days > 1 ? "s" : ""}`}!`, body: `Deadline: ${g.deadline} — ${g.funder}. Submit ASAP!`, grantId: g.id, icon: "🚨", iconBg: "#FEE2E2" }, ...prev].slice(0, 50);
            try { window.storage.set("sprout_notifications", JSON.stringify(updated)); } catch {}
            return updated;
          });
        }

        // Outstanding work notifications
        const incomplete = (g.todos || []).filter(t => !t.done);
        const overdue = incomplete.filter(t => t.dueDate && new Date(t.dueDate) < now);
        const workKey = `work_${g.id}_${now.toISOString().split("T")[0]}`;
        if (overdue.length > 0) {
          setNotifications(prev => {
            if (prev.some(n => n.key === workKey)) return prev;
            const updated = [{ id: `notif_${Date.now()}`, key: workKey, type: "work", read: false, createdAt: new Date().toISOString(), title: `📋 ${overdue.length} overdue task${overdue.length > 1 ? "s" : ""} for ${g.name}`, body: `${overdue[0].text}${overdue.length > 1 ? ` and ${overdue.length - 1} more…` : ""}`, grantId: g.id, icon: "📋", iconBg: "#FEE2E2" }, ...prev].slice(0, 50);
            try { window.storage.set("sprout_notifications", JSON.stringify(updated)); } catch {}
            return updated;
          });
        }
      });
    };
    if (!loading) checkDeadlines();
    const interval = setInterval(checkDeadlines, 3600000); // Check every hour
    return () => clearInterval(interval);
  }, [grants, loading]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openGrant = (grant) => {
    setSelectedGrant(grant.id);
    setView("grantDetail");
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = {
    total: grants.length,
    inProgress: grants.filter(g => g.status === "inProgress").length,
    submitted: grants.filter(g => g.status === "submitted").length,
    awarded: grants.filter(g => g.status === "awarded").length,
    totalValue: grants.filter(g => g.status === "awarded").reduce((s, g) => s + (Number(g.amount) || 0), 0),
  };

  const upcoming = grants
    .filter(g => g.deadline && ["researching","inProgress","notStarted"].includes(g.status))
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F7F3EC" }}>
      <div className="loading-overlay">
        <div className="big-spinner" />
        <p>Loading your workspace…</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* ── Sidebar ── */}
        <nav className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
          <div className="sidebar-logo">
            {sidebarCollapsed ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>🌱</span>
                <button className="expand-btn" onClick={() => setSidebarCollapsed(false)} title="Expand sidebar">▸</button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1>🌱 Sprout Society</h1>
                  <p>Grant Manager</p>
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <div className="notif-bell" onClick={() => setShowNotifPanel(p => !p)}>
                    <span style={{ fontSize: 20 }}>🔔</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="notif-badge">{notifications.filter(n => !n.read).length}</span>
                    )}
                  </div>
                  <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(true)} title="Collapse sidebar">◂</button>
                </div>
              </div>
            )}
          </div>

          {sidebarCollapsed && (
            <div style={{ display: "flex", justifyContent: "center", padding: "0 4px 8px" }}>
              <div className="notif-bell" onClick={() => setShowNotifPanel(p => !p)}>
                <span style={{ fontSize: 16 }}>🔔</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="notif-badge" style={{ top: 0, right: 0, minWidth: 14, height: 14, fontSize: 8 }}>{notifications.filter(n => !n.read).length}</span>
                )}
              </div>
            </div>
          )}

          <div className="nav-section">
            <div className="nav-label">Overview</div>
            <div className={`nav-item ${view === "dashboard" ? "active" : ""}`} onClick={() => setView("dashboard")} title="Dashboard">
              <Icon name="dashboard" size={15} /> <span className="nav-text">Dashboard</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Grants</div>
            <div className={`nav-item ${view === "searchGrants" ? "active" : ""}`} onClick={() => setView("searchGrants")} title="Find Grants">
              <Icon name="search" size={15} /> <span className="nav-text">Find Grants</span>
            </div>
            <div className={`nav-item ${view === "autoSearches" ? "active" : ""}`} onClick={() => setView("autoSearches")} title="Auto Searches" style={{ position: "relative" }}>
              <span style={{ fontSize: 15 }}>🔄</span> <span className="nav-text">Auto Searches</span>
              {savedSearches.filter(s => s.autoRefresh).length > 0 && <span className="badge">{savedSearches.filter(s => s.autoRefresh).length}</span>}
            </div>
            <div className={`nav-item ${view === "searchHistory" ? "active" : ""}`} onClick={() => setView("searchHistory")} title="Search History" style={{ position: "relative" }}>
              <span style={{ fontSize: 15 }}>📜</span> <span className="nav-text">Search History</span>
              {searchRunHistory.length > 0 && <span className="badge">{searchRunHistory.length}</span>}
            </div>
            <div className={`nav-item ${view === "savedGrants" ? "active" : ""}`} onClick={() => setView("savedGrants")} title="Saved Grants">
              <span style={{ fontSize: 15 }}>🔖</span> <span className="nav-text">Saved Grants</span>
              {savedGrants.length > 0 && <span className="badge">{savedGrants.length}</span>}
            </div>
            <div className={`nav-item ${view === "myGrants" ? "active" : ""}`} onClick={() => { setView("myGrants"); setSelectedGrant(null); }} title="My Applications">
              <Icon name="grants" size={15} /> <span className="nav-text">My Applications</span>
              {grants.length > 0 && <span className="badge">{grants.length}</span>}
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Setup</div>
            <div className={`nav-item ${view === "profile" ? "active" : ""}`} onClick={() => setView("profile")} title="Org Profile">
              <Icon name="profile" size={15} /> <span className="nav-text">Org Profile</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Library</div>
            <div className={`nav-item ${view === "documents" ? "active" : ""}`} onClick={() => setView("documents")} title="Documents">
              <Icon name="docs" size={15} /> <span className="nav-text">Documents</span>
              {documents.length > 0 && <span className="badge">{documents.length}</span>}
            </div>
            <div className={`nav-item ${view === "strategyLibrary" ? "active" : ""}`} onClick={() => setView("strategyLibrary")} title="Strategy Library">
              <Icon name="strategy" size={15} /> <span className="nav-text">Strategy Library</span>
              {strategyDocs.length > 0 && <span className="badge">{strategyDocs.length}</span>}
            </div>
            <div className={`nav-item ${view === "chatHistory" ? "active" : ""}`} onClick={() => setView("chatHistory")} title="Chat History">
              <span style={{ fontSize: 15 }}>💬</span> <span className="nav-text">Chat History</span>
              {chatHistory.length > 0 && <span className="badge">{chatHistory.length}</span>}
            </div>
          </div>

          <div className="sidebar-footer">
            {!sidebarCollapsed && <p>🏠 449 Troutman St, Brooklyn NY</p>}
            {!sidebarCollapsed && <p style={{ marginTop: 4 }}>EIN: 83-1298420</p>}
            + {onSwitchTool && (
                <button onClick={() => onSwitchTool("home")} style={{
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                 color: "rgba(255,255,255,0.7)", borderRadius: 6, padding: "6px 12px",
                  fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%",
                  marginBottom: 8, display: "flex", alignItems: "center", gap: 6, justifyContent: "center"
                }}>← Back to Hub</button>
 )}
            {userEmail && !sidebarCollapsed && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                <p style={{ fontSize: 11, marginBottom: 6 }}>👤 {userEmail}</p>
                <button onClick={onLogout} style={{
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.7)", borderRadius: 6, padding: "5px 12px",
                  fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%"
                }}>Log Out</button>
              </div>
            )}
            {sidebarCollapsed && onLogout && (
              <button onClick={onLogout} title="Log out" style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.5)",
                cursor: "pointer", fontSize: 16, padding: 4
              }}>⏻</button>
            )}
          </div>
        </nav>

        {/* ── Main Content ── */}
        <main className={`main ${sidebarCollapsed ? "collapsed" : ""}`}>
          {view === "dashboard" && (
            <DashboardView stats={stats} grants={grants} savedGrants={savedGrants} savedSearches={savedSearches} upcoming={upcoming} onOpen={openGrant} setView={setView} />
          )}
          {view === "searchGrants" && (
            <SearchView profile={profile} grants={grants} saveGrants={saveGrants} savedGrants={savedGrants} saveSavedGrants={saveSavedGrants} showToast={showToast} setView={setView} searchState={searchState} setSearchState={setSearchState} addNotification={addNotification} savedSearches={savedSearches} saveSavedSearches={saveSavedSearches} chatHistory={chatHistory} saveChatHistory={saveChatHistory} searchRunHistory={searchRunHistory} saveSearchRunHistory={saveSearchRunHistory} />
          )}
          {view === "autoSearches" && (
            <AutoSearchesView savedSearches={savedSearches} saveSavedSearches={saveSavedSearches} showToast={showToast} addNotification={addNotification} setView={setView} />
          )}
          {view === "searchHistory" && (
            <SearchHistoryView searchRunHistory={searchRunHistory} saveSearchRunHistory={saveSearchRunHistory} savedSearches={savedSearches} saveSavedSearches={saveSavedSearches} showToast={showToast} setView={setView} setSearchState={setSearchState} />
          )}
          {view === "savedGrants" && (
            <SavedGrantsView savedGrants={savedGrants} saveSavedGrants={saveSavedGrants} grants={grants} saveGrants={saveGrants} showToast={showToast} setView={setView} />
          )}
          {view === "myGrants" && (
            <MyGrantsView grants={grants} saveGrants={saveGrants} onOpen={openGrant} showToast={showToast} addNotification={addNotification} />
          )}
          {view === "grantDetail" && (
            <GrantDetailView
              grantId={selectedGrant} grants={grants} saveGrants={saveGrants}
              profile={profile} showToast={showToast} onBack={() => setView("myGrants")}
              documents={documents} strategyDocs={strategyDocs} addNotification={addNotification}
            />
          )}
          {view === "profile" && (
            <ProfileView profile={profile} saveProfile={saveProfile} showToast={showToast} />
          )}
          {view === "documents" && (
            <DocumentsView documents={documents} saveDocuments={saveDocuments} showToast={showToast} />
          )}
          {view === "strategyLibrary" && (
            <StrategyLibraryView strategyDocs={strategyDocs} saveStrategyDocs={saveStrategyDocs} showToast={showToast} />
          )}
          {view === "chatHistory" && (
            <ChatHistoryView chatHistory={chatHistory} saveChatHistory={saveChatHistory} showToast={showToast} />
          )}
        </main>

        {toast && <div className="toast">✓ {toast}</div>}

        {/* Notification Panel */}
        {showNotifPanel && (
          <>
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 199 }} onClick={() => setShowNotifPanel(false)} />
            <div className="notif-panel">
              <div className="notif-header">
                <h3>🔔 Notifications</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {notifications.some(n => !n.read) && (
                    <button className="btn btn-secondary btn-sm" onClick={() => {
                      const updated = notifications.map(n => ({ ...n, read: true }));
                      saveNotifications(updated);
                    }}>Mark all read</button>
                  )}
                  <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--text-muted)" }}
                    onClick={() => setShowNotifPanel(false)}>✕</button>
                </div>
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">
                    <div style={{ fontSize: 36, marginBottom: 8 }}>🔔</div>
                    <p>No notifications yet</p>
                    <p style={{ fontSize: 12, marginTop: 4 }}>Deadline reminders and new grant alerts will appear here.</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`}
                      onClick={() => {
                        const updated = notifications.map(x => x.id === n.id ? { ...x, read: true } : x);
                        saveNotifications(updated);
                        if (n.grantId) { setSelectedGrant(n.grantId); setView("grantDetail"); setShowNotifPanel(false); }
                        else if (n.type === "newGrant") { setView("searchGrants"); setShowNotifPanel(false); }
                      }}>
                      <div className="notif-icon-wrap" style={{ background: n.iconBg || "var(--sprout-cream)" }}>{n.icon || "🔔"}</div>
                      <div className="notif-content">
                        <h4>{n.title}</h4>
                        {n.body && <p>{n.body}</p>}
                      </div>
                      <div className="notif-time">{(() => {
                        const mins = Math.floor((Date.now() - new Date(n.createdAt)) / 60000);
                        if (mins < 1) return "now";
                        if (mins < 60) return `${mins}m`;
                        const hrs = Math.floor(mins / 60);
                        if (hrs < 24) return `${hrs}h`;
                        return `${Math.floor(hrs / 24)}d`;
                      })()}</div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
                  <button className="btn btn-danger btn-sm" onClick={() => saveNotifications([])}>Clear All</button>
                </div>
              )}
            </div>
          </>
        )}

        <AIChatOverlay grants={grants} savedGrants={savedGrants} profile={profile} strategyDocs={strategyDocs} saveStrategyDocs={saveStrategyDocs} showToast={showToast} documents={documents} savedSearches={savedSearches} chatHistory={chatHistory} saveChatHistory={saveChatHistory} />
      </div>
    </>
  );
}

// ─── AI Chat Overlay ──────────────────────────────────────────────────────────
const CHAT_SUGGESTIONS = [
  { icon: "🔍", label: "Grant ideas", prompt: "What types of grants should Sprout Society be applying for? Give me 5 ideas based on our mission." },
  { icon: "✍️", label: "Improve my writing", prompt: "I'm writing a grant narrative for Sprout Society. Can you help me strengthen it? Here's what I have so far:" },
  { icon: "📋", label: "Proofread application", prompt: "Please proofread the following grant application text and suggest improvements for clarity, tone, and impact:" },
  { icon: "💡", label: "Funder research tips", prompt: "What are the best strategies for researching grant funders for a mental health peer support nonprofit in Brooklyn?" },
  { icon: "📊", label: "Budget help", prompt: "Help me create a grant budget narrative for Sprout Society. What line items should I include for a peer support program?" },
  { icon: "🎯", label: "Tailor my pitch", prompt: "How should Sprout Society frame our loneliness and peer support work for a foundation focused on mental health equity?" },
  { icon: "📝", label: "Write a bio", prompt: "Write a compelling organization description for Sprout Society that I can use in grant applications." },
  { icon: "❓", label: "Logic model", prompt: "Help me build a simple logic model for Sprout Society's Empathetic Strangers program for a grant application." },
];

const CHAT_STYLES = `
  .chat-fab {
    position: fixed; bottom: 28px; right: 28px; z-index: 1000;
    width: 58px; height: 58px; border-radius: 50%;
    background: linear-gradient(135deg, var(--sprout-green) 0%, var(--sprout-sage) 100%);
    border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(45,80,22,0.35);
    display: flex; align-items: center; justify-content: center; font-size: 24px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .chat-fab:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(45,80,22,0.45); }
  .chat-fab-pulse::after {
    content: ''; position: absolute; top: 0; right: 0; width: 14px; height: 14px;
    background: var(--sprout-lime); border-radius: 50%; border: 2px solid #fff;
  }

  .chat-window {
    position: fixed; bottom: 98px; right: 28px; z-index: 1000;
    width: 380px; max-height: 580px; background: #fff;
    border-radius: 20px; box-shadow: 0 12px 48px rgba(45,80,22,0.22);
    border: 1.5px solid var(--border); display: flex; flex-direction: column;
    overflow: hidden; animation: chatSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes chatSlideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }

  .chat-header {
    background: linear-gradient(135deg, var(--sprout-green) 0%, var(--sprout-sage) 100%);
    padding: 16px 18px; display: flex; align-items: center; gap: 10; flex-shrink: 0;
  }
  .chat-header-avatar {
    width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
  }
  .chat-header-text h4 { color: #fff; font-size: 15px; font-weight: 700; font-family: 'Lora', serif; }
  .chat-header-text p { color: rgba(255,255,255,0.75); font-size: 12px; margin-top: 1px; }
  .chat-header-close {
    margin-left: auto; background: rgba(255,255,255,0.15); border: none; color: #fff;
    width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center; transition: background 0.15s;
    flex-shrink: 0;
  }
  .chat-header-close:hover { background: rgba(255,255,255,0.28); }

  .chat-messages {
    flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12;
    scroll-behavior: smooth;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .chat-bubble {
    max-width: 88%; padding: 10px 14px; border-radius: 14px; font-size: 13.5px; line-height: 1.6;
    white-space: pre-wrap; word-break: break-word;
  }
  .chat-bubble.user {
    background: var(--sprout-green); color: #fff;
    border-bottom-right-radius: 4px; align-self: flex-end;
  }
  .chat-bubble.assistant {
    background: var(--sprout-cream); color: var(--text-primary);
    border-bottom-left-radius: 4px; align-self: flex-start; border: 1px solid var(--border);
  }
  .chat-bubble.assistant strong { color: var(--sprout-green); }
  .chat-bubble-row { display: flex; align-items: flex-end; gap: 7px; }
  .chat-bubble-row.user { flex-direction: row-reverse; }
  .chat-avatar {
    width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; font-size: 13px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 2px;
  }
  .chat-avatar.assistant { background: var(--sprout-warm); }
  .chat-avatar.user { background: var(--sprout-sage); }

  .chat-typing { display: flex; align-items: center; gap: 4px; padding: 10px 14px; }
  .chat-typing span {
    width: 7px; height: 7px; background: var(--sprout-sage); border-radius: 50%;
    animation: typingBounce 1.2s infinite ease-in-out;
  }
  .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
  .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

  .chat-suggestions-scroll {
    display: flex; gap: 7px; padding: 10px 14px 2px; overflow-x: auto; flex-shrink: 0;
    border-top: 1px solid var(--border);
  }
  .chat-suggestions-scroll::-webkit-scrollbar { height: 0; }
  .chat-suggestion-chip {
    display: flex; align-items: center; gap: 5px; padding: 6px 12px;
    background: var(--sprout-cream); border: 1.5px solid var(--border); border-radius: 20px;
    cursor: pointer; white-space: nowrap; font-size: 12px; font-weight: 600;
    color: var(--sprout-green); transition: all 0.15s; font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
  }
  .chat-suggestion-chip:hover { background: var(--sprout-warm); border-color: var(--sprout-sage); }

  .chat-input-row {
    display: flex; gap: 8px; padding: 12px 14px; border-top: 1px solid var(--border); flex-shrink: 0;
    background: #fff;
  }
  .chat-input {
    flex: 1; border: 1.5px solid var(--border); border-radius: 10px; padding: 9px 13px;
    font-size: 13.5px; font-family: 'DM Sans', sans-serif; outline: none; resize: none;
    line-height: 1.5; max-height: 100px; min-height: 38px; color: var(--text-primary);
    transition: border-color 0.15s;
  }
  .chat-input:focus { border-color: var(--sprout-sage); }
  .chat-send {
    width: 38px; height: 38px; border-radius: 10px; border: none; cursor: pointer;
    background: var(--sprout-green); color: #fff; font-size: 16px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: background 0.15s; align-self: flex-end;
  }
  .chat-send:hover { background: #3a6b1e; }
  .chat-send:disabled { background: var(--border); cursor: not-allowed; }
  .chat-clear { font-size: 11px; color: var(--text-muted); cursor: pointer; padding: 2px 6px; border-radius: 4px; }
  .chat-clear:hover { color: var(--sprout-coral); }
`;

function AIChatOverlay({ grants, savedGrants, profile, strategyDocs, saveStrategyDocs, showToast, documents, savedSearches, chatHistory, saveChatHistory }) {
  const [open, setOpen] = useState(false);
  const [threadId] = useState(`chat_${Date.now()}`);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Sprout Society grant assistant 🌱\n\nI can help you find grant ideas, write and proofread applications, research funders, build budgets, and more. What do you need help with today?\n\n💡 Tip: You can save any of my responses to your Strategy Library for future reference!",
    }
  ]);

  // Save conversation to chat history whenever messages change (debounced)
  useEffect(() => {
    if (messages.length <= 1) return;
    const title = messages.find(m => m.role === "user")?.content?.slice(0, 60) || "Chat";
    const thread = {
      id: threadId,
      title: title + (title.length >= 60 ? "…" : ""),
      messages,
      source: "Grant Assistant",
      updatedAt: new Date().toISOString(),
      createdAt: messages.length === 2 ? new Date().toISOString() : undefined,
    };
    const existing = (chatHistory || []).filter(c => c.id !== threadId);
    const updated = [{ ...((chatHistory || []).find(c => c.id === threadId) || {}), ...thread }, ...existing].slice(0, 50);
    if (saveChatHistory) saveChatHistory(updated);
  }, [messages.length]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useState(null);
  const textareaRef = useState(null);
  const [endRef] = messagesEndRef;
  const [taRef] = textareaRef;
  const endDiv = { current: null };
  const taDiv = { current: null };

  const scrollToBottom = () => {
    if (endDiv.current) endDiv.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { if (open) setTimeout(scrollToBottom, 50); }, [messages, open]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || typing) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setTyping(true);

    // Build comprehensive context from all tool data
    const grantContext = grants.length > 0
      ? `ACTIVE APPLICATIONS (${grants.length}): ${grants.map(g => `"${g.name}" by ${g.funder} — status: ${g.status}, deadline: ${g.deadline || "none"}, amount: ${g.amountDisplay || formatAmount(g.amount)}, tasks: ${(g.todos||[]).filter(t=>t.done).length}/${(g.todos||[]).length} done`).join("; ")}`
      : "No active grant applications yet.";

    const savedContext = (savedGrants || []).length > 0
      ? `SAVED GRANTS (${savedGrants.length}): ${savedGrants.slice(0, 8).map(g => `"${g.name}" by ${g.funder} — ${g.amountDisplay || ""}, deadline: ${g.deadline || "rolling"}, match: ${g.matchScore || "?"}%`).join("; ")}`
      : "No saved grants.";

    const docContext = (documents || []).length > 0
      ? `UPLOADED DOCUMENTS (${documents.length}): ${documents.map(d => `"${d.title}" (${d.category})`).join(", ")}`
      : "No documents uploaded.";

    const stratContext = (strategyDocs || []).length > 0
      ? `STRATEGY LIBRARY (${strategyDocs.length}): ${strategyDocs.slice(0, 5).map(d => `"${d.title}"`).join(", ")}`
      : "Strategy library is empty.";

    const searchContext = (savedSearches || []).filter(s => s.autoRefresh).length > 0
      ? `AUTO SEARCHES (${savedSearches.filter(s => s.autoRefresh).length} active): ${savedSearches.filter(s => s.autoRefresh).map(s => `"${s.name}" — ${(s.results||[]).length} results`).join("; ")}`
      : "No auto searches configured.";

    const systemPrompt = `You are an expert grant-writing assistant for Sprout Society — a peer mental wellness nonprofit in Brooklyn, NY (EIN: 83-1298420). You have deep expertise in nonprofit fundraising, grant strategy, narrative writing, budget development, logic models, and funder research.

ORGANIZATION PROFILE:
- Name: ${profile.orgName} | Legal: ${profile.legalName}
- Mission: ${profile.mission}
- Vision: ${profile.vision}
- Programs: ${profile.programs}
- Location: ${profile.address} | Service Area: ${profile.serviceArea}
- Target Population: ${profile.targetPopulation}
- Founded: ${profile.founded} | 501(c)3: ${profile.nonprofit501c3}
- Outcomes: ${profile.outcomes}
- SDG Alignment: ${profile.sdgAligned}
- Budget: ${profile.annualBudget || "Not specified"} | Staff: ${profile.numEmployees || "?"} | Volunteers: ${profile.numVolunteers || "?"}

CURRENT WORKSPACE DATA:
${grantContext}
${savedContext}
${docContext}
${stratContext}
${searchContext}

YOUR CAPABILITIES:
1. **Grant Strategy** — Advise on which grants to pursue, application strategy, funder research
2. **Narrative Writing** — Draft or improve grant narratives, program descriptions, impact statements
3. **Budget Development** — Help build program budgets, budget narratives, cost justifications
4. **Logic Models** — Create inputs/activities/outputs/outcomes frameworks
5. **Application Review** — Proofread, strengthen, and critique application drafts
6. **Funder Research** — Analyze funder priorities and suggest alignment strategies
7. **Timeline Planning** — Recommend task breakdowns with realistic timeframes based on professional grant writing standards
8. **Document Creation** — Create strategy guides, talking points, templates that users can export as .doc files

Always reference the ACTUAL data above when relevant. If asked about a specific grant, pull details from the workspace data. If asked to create content, tailor it specifically to Sprout Society's mission, programs, and impact. Be specific, actionable, and professional. Use **bold** for key terms. Keep responses well-structured with line breaks.`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        })
      });
      const data = await res.json();
      const reply = data.content?.map(i => i.text || "").join("") || "Sorry, I had trouble responding. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please check your connection and try again." }]);
    }
    setTyping(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Save assistant response to Strategy Library
  const saveToStrategy = (content) => {
    const title = content.slice(0, 60).replace(/\n/g, " ").trim() + (content.length > 60 ? "…" : "");
    const doc = {
      id: `strat_${Date.now()}`,
      title,
      content,
      createdAt: new Date().toISOString(),
      source: "AI Grant Assistant",
      category: "general",
    };
    const updated = [...(strategyDocs || []), doc];
    saveStrategyDocs(updated);
    if (showToast) showToast("Saved to Strategy Library!");
  };

  // Export chat response as .doc file
  const exportChatAsDoc = (content) => {
    const title = content.slice(0, 60).replace(/\n/g, " ").trim();
    const htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:'Calibri','Arial',sans-serif;font-size:11pt;line-height:1.6;color:#1C2B0E;max-width:7.5in;margin:1in auto;}h1{font-family:'Georgia',serif;font-size:16pt;color:#2D5016;border-bottom:2px solid #B8D96E;padding-bottom:8px;}strong{color:#2D5016;}.meta{font-size:10pt;color:#8A9B72;margin-bottom:16px;}</style></head>
<body><h1>Sprout Society — Grant Strategy</h1>
<div class="meta">Generated ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})} by AI Grant Assistant</div>
<div>${content.replace(/\n/g,"<br/>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>")}</div></body></html>`;
    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9 ]/g,"").replace(/\s+/g,"_").slice(0,50)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (showToast) showToast("Exported as .doc!");
  };

  // Simple markdown-ish bold renderer
  const renderContent = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : p
    );
  };

  return (
    <>
      <style>{CHAT_STYLES}</style>

      {open && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-avatar">🌱</div>
            <div className="chat-header-text" style={{ marginLeft: 10 }}>
              <h4>Grant Assistant</h4>
              <p>Sprout Society · Powered by AI</p>
            </div>
            <button className="chat-header-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i}>
                <div className={`chat-bubble-row ${m.role}`}>
                  <div className={`chat-avatar ${m.role}`}>{m.role === "assistant" ? "🌱" : "👤"}</div>
                  <div className={`chat-bubble ${m.role}`}>{renderContent(m.content)}</div>
                </div>
                {m.role === "assistant" && i > 0 && (
                  <div style={{ display: "flex", justifyContent: "flex-start", marginLeft: 33, marginTop: 4, gap: 6 }}>
                    <button style={{
                      background: "none", border: "1px solid var(--border)", borderRadius: 6,
                      padding: "3px 8px", fontSize: 11, color: "var(--text-muted)", cursor: "pointer",
                      fontFamily: "DM Sans, sans-serif", transition: "all 0.15s"
                    }}
                      onMouseOver={e => { e.target.style.borderColor = "var(--sprout-sage)"; e.target.style.color = "var(--sprout-green)"; }}
                      onMouseOut={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-muted)"; }}
                      onClick={() => saveToStrategy(m.content)}>
                      🧭 Save to Library
                    </button>
                    <button style={{
                      background: "none", border: "1px solid var(--border)", borderRadius: 6,
                      padding: "3px 8px", fontSize: 11, color: "var(--text-muted)", cursor: "pointer",
                      fontFamily: "DM Sans, sans-serif", transition: "all 0.15s"
                    }}
                      onMouseOver={e => { e.target.style.borderColor = "var(--sprout-sage)"; e.target.style.color = "var(--sprout-green)"; }}
                      onMouseOut={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-muted)"; }}
                      onClick={() => exportChatAsDoc(m.content)}>
                      📄 Export .doc
                    </button>
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="chat-bubble-row assistant">
                <div className="chat-avatar assistant">🌱</div>
                <div className="chat-bubble assistant" style={{ padding: "8px 14px" }}>
                  <div className="chat-typing"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={el => { endDiv.current = el; }} />
          </div>

          {/* Quick suggestion chips */}
          <div className="chat-suggestions-scroll">
            {CHAT_SUGGESTIONS.map((s, i) => (
              <button key={i} className="chat-suggestion-chip"
                onClick={() => sendMessage(s.prompt)}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input-row">
            <textarea
              className="chat-input"
              placeholder="Ask anything about grants…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              ref={el => { taDiv.current = el; }}
            />
            <button className="chat-send" onClick={() => sendMessage()} disabled={!input.trim() || typing}>
              ➤
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 14px 10px" }}>
            <span className="chat-clear" onClick={() => setMessages([{ role: "assistant", content: "Chat cleared! How can I help with your grant work today? 🌱" }])}>
              Clear chat
            </span>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button className={`chat-fab ${!open ? "chat-fab-pulse" : ""}`} onClick={() => setOpen(o => !o)}
        style={{ position: "fixed" }} title="Open Grant Assistant">
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardView({ stats, grants, savedGrants, savedSearches, upcoming, onOpen, setView }) {
  const activeSearches = (savedSearches || []).filter(s => s.autoRefresh);
  return (
    <div>
      <div className="page-header">
        <h2>🌱 Grant Dashboard</h2>
        <p>Welcome back — here's your Sprout Society funding overview.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Grants</div>
          <div className="value">{stats.total}</div>
          <div className="sub">tracked applications</div>
        </div>
        <div className="stat-card">
          <div className="label">In Progress</div>
          <div className="value" style={{ color: "#1E40AF" }}>{stats.inProgress}</div>
          <div className="sub">actively working</div>
        </div>
        <div className="stat-card">
          <div className="label">Submitted</div>
          <div className="value" style={{ color: "#92400E" }}>{stats.submitted}</div>
          <div className="sub">awaiting decision</div>
        </div>
        <div className="stat-card">
          <div className="label">Awarded</div>
          <div className="value" style={{ color: "#166534" }}>{stats.awarded}</div>
          <div className="sub">{stats.totalValue > 0 ? `$${stats.totalValue.toLocaleString()} secured` : "none yet"}</div>
        </div>
      </div>

      {/* Active Auto Searches */}
      {activeSearches.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 className="section-title" style={{ marginBottom: 0, borderBottom: "none", paddingBottom: 0 }}>🔄 Active Auto Searches</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setView("autoSearches")}>Manage →</button>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {activeSearches.slice(0, 4).map(s => (
              <div key={s.id} style={{ background: "rgba(122,158,91,0.08)", border: "1px solid rgba(122,158,91,0.2)", borderRadius: 10, padding: "8px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                <div className="pulse-dot" style={{ width: 6, height: 6 }} />
                <span style={{ fontWeight: 600, color: "var(--sprout-green)" }}>{s.name}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
                  {s.lastRefreshTime ? `Last: ${new Date(s.lastRefreshTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Pending"}
                </span>
              </div>
            ))}
            {activeSearches.length > 4 && <span style={{ fontSize: 13, color: "var(--text-muted)", alignSelf: "center" }}>+{activeSearches.length - 4} more</span>}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>Searches refresh daily at 10:00 AM, 4:00 PM, and 8:00 PM</div>
        </div>
      )}

      <div className="two-col">
        <div className="card">
          <h3 className="section-title">⏰ Upcoming Deadlines</h3>
          {upcoming.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px" }}>
              <p>No upcoming deadlines. <span style={{ cursor: "pointer", color: "var(--sprout-sage)", fontWeight: 600 }} onClick={() => setView("searchGrants")}>Find grants →</span></p>
            </div>
          ) : (
            <div className="recent-list">
              {upcoming.map(g => {
                const days = daysUntil(g.deadline);
                return (
                  <div key={g.id} className="recent-item" style={{ cursor: "pointer" }} onClick={() => onOpen(g)}>
                    <div className="recent-icon">📅</div>
                    <div className="recent-info">
                      <h4>{g.name}</h4>
                      <p>{g.funder}</p>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div className={days <= 14 ? "deadline-warning" : ""} style={{ fontSize: 13, fontWeight: 600 }}>
                        {days < 0 ? "Overdue!" : days === 0 ? "Today!" : `${days}d`}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{g.deadline}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="section-title">📋 Recent Applications</h3>
          {grants.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px" }}>
              <p>No applications yet. <span style={{ cursor: "pointer", color: "var(--sprout-sage)", fontWeight: 600 }} onClick={() => setView("searchGrants")}>Search for grants →</span></p>
            </div>
          ) : (
            <div className="recent-list">
              {[...grants].reverse().slice(0, 6).map(g => (
                <div key={g.id} className="recent-item" style={{ cursor: "pointer" }} onClick={() => onOpen(g)}>
                  <div className="recent-icon">🌿</div>
                  <div className="recent-info">
                    <h4>{g.name}</h4>
                    <p>{g.funder}</p>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    {statusTag(g.status)}
                    {g.amount && <div className="recent-amount">{formatAmount(g.amount)}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Saved Grants Tracker */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 className="section-title" style={{ marginBottom: 0, borderBottom: "none", paddingBottom: 0 }}>🔖 Saved Grants</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{savedGrants.length} bookmarked</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setView("savedGrants")}>View All →</button>
          </div>
        </div>
        {savedGrants.length === 0 ? (
          <div style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)", fontSize: 14 }}>
            <p>No saved grants yet. <span style={{ cursor: "pointer", color: "var(--sprout-sage)", fontWeight: 600 }} onClick={() => setView("searchGrants")}>Find grants →</span></p>
          </div>
        ) : (
          <div>
            {savedGrants.slice(0, 4).map(g => {
              const days = daysUntil(g.deadline);
              return (
                <div key={g.id} className="saved-preview-card" onClick={() => setView("savedGrants")}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--sprout-cream)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🔖</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="saved-name">{g.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{g.funder}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {g.amountDisplay && <div style={{ fontSize: 13, fontWeight: 700, color: "var(--sprout-green)" }}>{g.amountDisplay}</div>}
                    {g.deadline && days !== null && (
                      <div style={{ fontSize: 11, color: days <= 30 ? "var(--sprout-coral)" : "var(--text-muted)", marginTop: 2 }}>
                        {days < 0 ? "Overdue" : days === 0 ? "Today!" : `${days}d left`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {savedGrants.length > 4 && (
              <div style={{ textAlign: "center", paddingTop: 8 }}>
                <span style={{ fontSize: 13, color: "var(--sprout-sage)", cursor: "pointer", fontWeight: 600 }} onClick={() => setView("savedGrants")}>
                  +{savedGrants.length - 4} more saved grants →
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="card" style={{ background: "linear-gradient(135deg, #2D5016 0%, #7A9E5B 100%)", color: "#fff", border: "none" }}>
        <h3 style={{ fontFamily: "Lora, serif", fontSize: 18, marginBottom: 10 }}>💡 Grant Tips for Sprout Society</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, fontSize: 13, opacity: 0.9 }}>
          <div><strong>Mental Health Focus:</strong> Prioritize foundations supporting peer support & community wellness programs.</div>
          <div><strong>NYC Funding:</strong> Look for NYC-specific grants — DOHMH, Mayor's Office, and city council discretionary funds.</div>
          <div><strong>Loneliness Angle:</strong> The loneliness epidemic is gaining national attention — emphasize this in every application.</div>
        </div>
      </div>
    </div>
  );
}

// ─── Search View ──────────────────────────────────────────────────────────────
// Deadline window options: value → { label, minDays, maxDays }
const DEADLINE_WINDOWS = {
  all:      { label: "Any Deadline",       minDays: 1,    maxDays: 9999 },
  week:     { label: "Within 1 Week",      minDays: 1,    maxDays: 7    },
  month:    { label: "Within 1 Month",     minDays: 1,    maxDays: 30   },
  months3:  { label: "Within 3 Months",    minDays: 1,    maxDays: 90   },
  months6:  { label: "Within 6 Months",    minDays: 1,    maxDays: 180  },
  year:     { label: "Within 1 Year",      minDays: 1,    maxDays: 365  },
  over1yr:  { label: "More Than 1 Year",   minDays: 366,  maxDays: 9999 },
};

function SearchView({ profile, grants, saveGrants, savedGrants, saveSavedGrants, showToast, setView, searchState, setSearchState, addNotification, savedSearches, saveSavedSearches, chatHistory, saveChatHistory, searchRunHistory, saveSearchRunHistory }) {
  const [urlSearching, setUrlSearching] = useState(false);
  const [searchUrl, setSearchUrl] = useState("");
  const [addedIds, setAddedIds] = useState(new Set(grants.map(g => g.sourceId).filter(Boolean)));
  const [savedIds, setSavedIds] = useState(new Set(savedGrants.map(g => g.sourceId).filter(Boolean)));
  const [tagInput, setTagInput] = useState("");

  // Search chat state
  const [chatOpen, setChatOpen] = useState(true);
  const [chatMsgs, setChatMsgs] = useState([
    { role: "assistant", content: "Hi! Describe the types of grants you're looking for in plain language. I'll ask clarifying questions, then search for the best matches.\n\nFor example: \"We need funding for our peer support program expansion\" or \"Looking for NYC-based mental health grants under $50K\"" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const [chatThreadId] = useState(`search_chat_${Date.now()}`);
  const [chatReady, setChatReady] = useState(false);

  const { results, filteredOut, filters, searched, selectedDatabases, selectedTypes, customTags = [], searchedUrls = [], searching } = searchState;
  const updateSearch = (updates) => setSearchState(prev => ({ ...prev, ...updates }));

  const GRANT_DATABASES = [
    { id: "all", label: "All Databases" },
    { id: "grants.gov", label: "Grants.gov" },
    { id: "foundation-directory", label: "Foundation Directory Online" },
    { id: "candid", label: "Candid / GuideStar" },
    { id: "instrumentl", label: "Instrumentl" },
    { id: "grantwatch", label: "GrantWatch" },
    { id: "nyc-funding", label: "NYC Funding (DOHMH, City Council)" },
    { id: "sam.gov", label: "SAM.gov" },
    { id: "philanthropy-news", label: "Philanthropy News Digest" },
  ];

  const GRANT_TYPES = [
    { id: "mental-health-peer-support", label: "🧠 Mental Health / Peer Support", keywords: "mental health, peer support, counseling, wellness" },
    { id: "grassroots", label: "🌱 Grassroots / Small Org", keywords: "grassroots, small nonprofit, emerging organization, startup nonprofit" },
    { id: "community", label: "🏘️ Community Development", keywords: "community building, neighborhood, civic engagement, social cohesion" },
    { id: "youth", label: "👥 Youth Programs", keywords: "youth development, young adults, adolescent, emerging adults" },
    { id: "equity", label: "⚖️ Health Equity", keywords: "health equity, underserved, health disparities, social determinants" },
    { id: "loneliness", label: "💛 Loneliness / Isolation", keywords: "loneliness epidemic, social isolation, connection, belonging" },
    { id: "arts-culture", label: "🎨 Arts & Culture", keywords: "arts, culture, creative expression, healing through art" },
    { id: "general-operating", label: "🏢 General Operating", keywords: "general operating support, unrestricted, capacity building" },
  ];

  const toggleDatabase = (id) => {
    if (id === "all") {
      updateSearch({ selectedDatabases: ["all"] });
    } else {
      const without = selectedDatabases.filter(d => d !== "all");
      if (without.includes(id)) {
        const result = without.filter(d => d !== id);
        updateSearch({ selectedDatabases: result.length === 0 ? ["all"] : result });
      } else {
        updateSearch({ selectedDatabases: [...without, id] });
      }
    }
  };

  const toggleType = (id) => {
    updateSearch({ selectedTypes: selectedTypes.includes(id) ? selectedTypes.filter(t => t !== id) : [...selectedTypes, id] });
  };

  const addCustomTag = (text) => {
    const tag = text.trim();
    if (!tag || customTags.includes(tag)) return;
    updateSearch({ customTags: [...customTags, tag] });
  };

  const removeCustomTag = (tag) => {
    updateSearch({ customTags: customTags.filter(t => t !== tag) });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addCustomTag(tagInput);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && customTags.length > 0) {
      removeCustomTag(customTags[customTags.length - 1]);
    }
  };

  // Search chat: AI-guided grant search with clarifying questions
  const sendChatMsg = async (text) => {
    const userText = (text || chatInput).trim();
    if (!userText || chatTyping) return;
    setChatInput("");
    const newMsgs = [...chatMsgs, { role: "user", content: userText }];
    setChatMsgs(newMsgs);
    setChatTyping(true);

    const conversationContext = newMsgs.filter(m => m.role !== "system").map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: `You are a grant search assistant for Sprout Society, a mental health peer support nonprofit in Brooklyn, NY. Your job is to understand what grants the user is looking for, ask 1-2 clarifying questions if needed, and then generate search parameters.

WORKFLOW:
1. When the user describes what they're looking for, ask 1-2 brief clarifying questions about: grant size preference, deadline urgency, specific focus areas, or geographic scope. Keep questions short and natural.
2. Once you have enough information (usually after 1-2 exchanges), respond with a message that includes your recommended search, AND at the very end append a JSON block wrapped in |||SEARCH_CONFIG||| tags like this:
|||SEARCH_CONFIG|||{"types":["mental-health-peer-support","community"],"tags":["peer support expansion","NYC funding"],"category":"mental-health","size":"medium"}|||END_CONFIG|||

The types must be from: mental-health-peer-support, grassroots, community, youth, equity, loneliness, arts-culture, general-operating.
Category: mental-health, community, youth, arts, general-nonprofit, or "all".
Size: small, medium, large, or "all".
Tags: array of specific keyword strings.

Only include the config block when you're ready to search. Until then, just ask your clarifying questions in plain conversational text. Be concise and helpful.`,
          messages: conversationContext,
        })
      });
      const data = await res.json();
      const reply = data.content?.map(i => i.text || "").join("") || "Sorry, please try again.";

      // Check if the response contains a search config
      const configMatch = reply.match(/\|\|\|SEARCH_CONFIG\|\|\|(.*?)\|\|\|END_CONFIG\|\|\|/s);
      let displayReply = reply.replace(/\|\|\|SEARCH_CONFIG\|\|\|.*?\|\|\|END_CONFIG\|\|\|/s, "").trim();

      if (configMatch) {
        try {
          const config = JSON.parse(configMatch[1]);
          // Apply the config to the search state
          const updates = {};
          if (config.types) updates.selectedTypes = config.types;
          if (config.tags) updates.customTags = [...new Set([...customTags, ...config.tags])];
          if (config.category && config.category !== "all") updates.filters = { ...filters, category: config.category };
          if (config.size && config.size !== "all") updates.filters = { ...(updates.filters || filters), size: config.size };
          updateSearch(updates);
          setChatReady(true);
          displayReply += "\n\n✅ I've configured your search! Click **\"Find Grants\"** below to run it, or continue refining.";
        } catch {}
      }

      const updatedMsgs = [...newMsgs, { role: "assistant", content: displayReply }];
      setChatMsgs(updatedMsgs);

      // Save to chat history
      if (saveChatHistory && updatedMsgs.length > 2) {
        const title = newMsgs.find(m => m.role === "user")?.content?.slice(0, 60) || "Grant Search Chat";
        const thread = {
          id: chatThreadId,
          title: title + (title.length >= 60 ? "…" : ""),
          messages: updatedMsgs,
          source: "Grant Finder",
          updatedAt: new Date().toISOString(),
        };
        const existing = (chatHistory || []).filter(c => c.id !== chatThreadId);
        saveChatHistory([thread, ...existing].slice(0, 50));
      }
    } catch {
      setChatMsgs(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
    setChatTyping(false);
  };

  const renderChatContent = (text) => {
    const parts = (text || "").split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p);
  };

  const doSearch = async (isAutoRefresh = false) => {
    updateSearch({ searching: true });
    if (!isAutoRefresh) updateSearch({ results: [], filteredOut: 0, searched: false });
    const prevResultNames = isAutoRefresh ? new Set(results.map(r => r.name)) : new Set();

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const window = DEADLINE_WINDOWS[filters.deadlineWindow] || DEADLINE_WINDOWS.all;
    const minDate = new Date(today.getTime() + window.minDays * 86400000).toISOString().split("T")[0];
    const maxDate = new Date(today.getTime() + window.maxDays * 86400000).toISOString().split("T")[0];
    const deadlineInstruction = filters.deadlineWindow === "all"
      ? `All deadlines MUST be strictly after today (${todayStr}). Do not include any grant with a past deadline.`
      : `All deadlines MUST fall between ${minDate} and ${maxDate} (the user wants grants due ${DEADLINE_WINDOWS[filters.deadlineWindow].label.toLowerCase()}). Do not include any grant outside this window or with a past deadline.`;

    const allSearchTerms = [...customTags];

    const prompt = `You are a grant researcher helping Sprout Society, a 501(c)3 non-profit based in Brooklyn, NY.
Today's date is ${todayStr}.

About Sprout Society:
- Mission: Building community and peer connection for mental wellness; combating the loneliness epidemic
- Programs: Empathetic Strangers (1:1 peer listening), Peer Support Groups, Connect to Learn (expert sessions)
- Location: 449 Troutman St, Brooklyn NY 11237
- EIN: 83-1298420
- Serves: Adults experiencing loneliness/depression, young adults 19-29, Brooklyn/NYC community
- All programs are free of cost
- Founded through the RJE Foundation in memory of Russell J. Efros

${allSearchTerms.length > 0 ? `The user is searching for grants matching these tags/keywords: ${allSearchTerms.map(t => `"${t}"`).join(", ")}` : "Find a diverse mix of applicable grants."}
${filters.category !== "all" ? `Focus on category: ${filters.category}` : ""}
${filters.size !== "all" ? `Focus on grant size: ${filters.size}` : ""}
${selectedTypes.length > 0 ? `IMPORTANT — The user wants to search MULTIPLE grant types simultaneously. Include results from ALL of these categories: ${selectedTypes.map(t => GRANT_TYPES.find(gt => gt.id === t)?.keywords || t).join("; ")}. Try to include at least one result per selected type.` : ""}
${!selectedDatabases.includes("all") ? `Focus on grants from these specific databases/sources: ${selectedDatabases.map(d => GRANT_DATABASES.find(db => db.id === d)?.label || d).join(", ")}. Prioritize opportunities listed on or funded through these platforms.` : "Search across all major grant databases and foundations."}

DEADLINE REQUIREMENT (STRICT): ${deadlineInstruction}

VERIFICATION REQUIREMENTS (CRITICAL):
- ONLY include grants from REAL, established foundations and government programs that you are confident exist.
- Do NOT fabricate or hallucinate grant programs. If you are not confident a specific grant program exists, do NOT include it.
- applicationUrl MUST be a real, working URL to the funder's actual website (e.g. the foundation homepage, grants page, or specific program page). Do NOT guess URLs. If you cannot provide a verified URL, use the funder's main homepage.
- For each grant, provide a "sourceVerification" field explaining how you know this grant exists (e.g. "Well-known federal program listed on grants.gov", "Established NYC municipal funding program", "Major national foundation with public grantmaking program").
- Provide a "sourceDatabase" field indicating where this grant would be found (e.g. "Grants.gov", "Foundation Directory Online", "NYC.gov", "Funder's website").
- Provide a "funderWebsite" field with the funder's main organizational homepage URL (separate from the specific applicationUrl).
- Include a "confidenceLevel" field: "high" (well-known program you're certain exists), "medium" (likely exists based on funder's known grantmaking), or "low" (less certain). Only include grants with "high" or "medium" confidence.

Generate exactly ${selectedTypes.length > 2 ? 8 : 6} real grant opportunities genuinely applicable to Sprout Society with FUTURE deadlines only. Include a mix of national and NYC-specific opportunities.

For each grant provide:
- name: Full grant/program name
- funder: Foundation or organization name
- funderWebsite: Funder's main homepage URL
- amount: Max award as a number (e.g. 50000)
- amountDisplay: Human-readable range like "$10,000–$50,000"
- deadline: Next deadline in YYYY-MM-DD format — MUST be after ${todayStr}${filters.deadlineWindow !== "all" ? ` and before ${maxDate}` : ""}
- category: One of: mental-health, community, youth, arts, general-nonprofit
- description: 2-3 sentences on the grant and why it fits Sprout Society
- eligibility: Key eligibility in 1-2 sentences
- applicationUrl: REAL URL to grant application or funder's grants page (must be a real working URL)
- matchScore: Fit score 1-100
- focusAreas: Array of 2-4 tags (e.g. ["Mental Health", "Peer Support", "NYC"])
- tips: One specific tip for Sprout Society's application
- sourceDatabase: Where this grant is listed (e.g. "Grants.gov", "Foundation website")
- sourceVerification: Brief explanation of why this grant is verified/real
- confidenceLevel: "high" or "medium"

Respond ONLY with a valid JSON array, no markdown, no explanation.`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      const todayMs = today.getTime();
      const valid = parsed.filter(r => {
        if (!r.deadline) return true;
        const dMs = new Date(r.deadline).getTime();
        if (dMs <= todayMs) return false;
        const days = (dMs - todayMs) / 86400000;
        if (days < window.minDays || days > window.maxDays) return false;
        return true;
      });

      const mappedResults = valid.map((r, i) => ({ ...r, id: `search_${Date.now()}_${i}` }));

      // On auto-refresh: detect new grants and notify
      if (isAutoRefresh && prevResultNames.size > 0) {
        const newGrants = mappedResults.filter(r => !prevResultNames.has(r.name));
        if (newGrants.length > 0) {
          newGrants.forEach(g => {
            addNotification({
              type: "newGrant",
              title: `✨ New grant found: ${g.name}`,
              body: `${g.funder} — ${g.amountDisplay || ""}. Match: ${g.matchScore}%`,
              icon: "✨",
              iconBg: "#DCFCE7",
            });
          });
        }
      }

      updateSearch({
        filteredOut: parsed.length - valid.length,
        results: mappedResults,
        lastRefreshTime: new Date().toISOString(),
      });

      // Log to search history
      if (!isAutoRefresh && saveSearchRunHistory) {
        const searchName = customTags.length > 0 ? customTags.join(", ") : selectedTypes.length > 0 ? selectedTypes.map(t => GRANT_TYPES.find(gt => gt.id === t)?.label.replace(/^[^\s]+\s/, "") || t).join(", ") : "General Search";
        const historyEntry = {
          id: `sh_${Date.now()}`,
          name: searchName.slice(0, 60),
          config: { selectedTypes: [...selectedTypes], customTags: [...customTags], filters: { ...filters }, selectedDatabases: [...selectedDatabases] },
          results: mappedResults,
          resultCount: mappedResults.length,
          avgMatch: mappedResults.length > 0 ? Math.round(mappedResults.reduce((s, r) => s + (r.matchScore || 0), 0) / mappedResults.length) : 0,
          ranAt: new Date().toISOString(),
        };
        saveSearchRunHistory([historyEntry, ...(searchRunHistory || [])].slice(0, 30));
      }
    } catch (e) {
      updateSearch({ results: isAutoRefresh ? results : [] });
    }
    updateSearch({ searched: true, searching: false });
  };

  // URL-based search: search a specific website for grants
  const doUrlSearch = async () => {
    if (!searchUrl.trim()) return;
    setUrlSearching(true);
    const url = searchUrl.trim();
    const todayStr = new Date().toISOString().split("T")[0];

    // Save URL to history
    const updatedUrls = searchedUrls.includes(url) ? searchedUrls : [url, ...searchedUrls].slice(0, 20);
    updateSearch({ searchedUrls: updatedUrls });

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: `Search the website at ${url} for grant opportunities relevant to a mental health peer support nonprofit in Brooklyn, NY called Sprout Society (EIN: 83-1298420). Programs: Empathetic Strangers (1:1 peer listening), Peer Support Groups, Connect to Learn. Today's date: ${todayStr}.

Search this specific website and find all available grant programs, funding opportunities, or RFPs listed there that Sprout Society could apply to.

Return ONLY a valid JSON array of grants found on this website. For each grant include:
- name: Grant program name as listed on the website
- funder: The organization running this grant
- funderWebsite: "${url}"
- amount: Award amount as number or null
- amountDisplay: Human-readable amount or null
- deadline: Deadline in YYYY-MM-DD format or null if rolling/unknown
- category: "mental-health" or "community" or "youth" or "arts" or "general-nonprofit"
- description: 2-3 sentences about the grant
- eligibility: Key requirements
- applicationUrl: Direct URL to the specific grant page on this website (must be a real page on ${url})
- matchScore: Fit score 1-100 for Sprout Society
- focusAreas: Array of tags
- tips: One tip for applying
- sourceDatabase: "${new URL(url).hostname}"
- sourceVerification: "Found on ${url} via direct website search"
- confidenceLevel: "high"

If no relevant grants are found on this website, return an empty array []. No markdown, no explanation.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.filter(i => i.type === "text").map(i => i.text).join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const mapped = parsed.map((r, i) => ({ ...r, id: `urlsearch_${Date.now()}_${i}`, searchSource: url }));

      if (mapped.length > 0) {
        updateSearch({ results: [...mapped, ...results], searched: true });
        showToast(`Found ${mapped.length} grant${mapped.length > 1 ? "s" : ""} on ${new URL(url).hostname}`);
        // Log to search history
        if (saveSearchRunHistory) {
          let hostname = url; try { hostname = new URL(url).hostname; } catch {}
          const historyEntry = {
            id: `sh_url_${Date.now()}`, name: `Site: ${hostname}`,
            config: { customTags: [url], selectedTypes: [], filters: {}, selectedDatabases: [] },
            results: mapped, resultCount: mapped.length,
            avgMatch: mapped.length > 0 ? Math.round(mapped.reduce((s, r) => s + (r.matchScore || 0), 0) / mapped.length) : 0,
            ranAt: new Date().toISOString(), isUrlSearch: true, sourceUrl: url,
          };
          saveSearchRunHistory([historyEntry, ...(searchRunHistory || [])].slice(0, 30));
        }
      } else {
        showToast(`No relevant grants found on ${new URL(url).hostname}`);
      }
    } catch (e) {
      showToast("Couldn't search that URL — check the link and try again");
    }
    setSearchUrl("");
    setUrlSearching(false);
  };

  const removeSearchedUrl = (url) => {
    updateSearch({ searchedUrls: searchedUrls.filter(u => u !== url) });
  };

  const addGrant = (result) => {
    const newGrant = {
      id: `grant_${Date.now()}`,
      sourceId: result.id,
      name: result.name, funder: result.funder, amount: result.amount,
      amountDisplay: result.amountDisplay, deadline: result.deadline,
      category: result.category, description: result.description,
      eligibility: result.eligibility, applicationUrl: result.applicationUrl,
      matchScore: result.matchScore, focusAreas: result.focusAreas || [],
      tips: result.tips, status: "notStarted",
      funderWebsite: result.funderWebsite,
      sourceDatabase: result.sourceDatabase,
      sourceVerification: result.sourceVerification,
      confidenceLevel: result.confidenceLevel,
      resources: [result.applicationUrl, result.funderWebsite].filter(Boolean),
      todos: generateDefaultTodos(result), timeline: generateDefaultTimeline(result),
      notes: "", answers: {}, createdAt: new Date().toISOString(),
    };
    saveGrants([...grants, newGrant]);
    setAddedIds(prev => new Set([...prev, result.id]));
    showToast(`Added "${result.name}" to My Applications`);
  };

  const saveForLater = (result) => {
    const saved = {
      id: `saved_${Date.now()}`,
      sourceId: result.id,
      name: result.name, funder: result.funder, amount: result.amount,
      amountDisplay: result.amountDisplay, deadline: result.deadline,
      category: result.category, description: result.description,
      eligibility: result.eligibility, applicationUrl: result.applicationUrl,
      matchScore: result.matchScore, focusAreas: result.focusAreas || [],
      tips: result.tips, savedAt: new Date().toISOString(),
    };
    saveSavedGrants([...savedGrants, saved]);
    setSavedIds(prev => new Set([...prev, result.id]));
    showToast(`Saved "${result.name}" for later`);
  };

  return (
    <div>
      <div className="page-header">
        <h2>✨ Find Grants</h2>
        <p>AI-powered search for grants relevant to Sprout Society's mental wellness mission.</p>
      </div>

      {/* AI Search Chat */}
      <div className="search-chat">
        <div className="search-chat-header" onClick={() => setChatOpen(o => !o)}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <div style={{ flex: 1 }}>
            <h4>AI Grant Search Assistant</h4>
            <p>Describe what you're looking for in plain language</p>
          </div>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 18 }}>{chatOpen ? "▾" : "▸"}</span>
        </div>
        {chatOpen && (
          <>
            <div className="search-chat-body">
              {chatMsgs.map((m, i) => (
                <div key={i} className={`search-chat-msg ${m.role}`}>
                  {m.role === "assistant" ? renderChatContent(m.content) : m.content}
                </div>
              ))}
              {chatTyping && (
                <div className="search-chat-msg assistant" style={{ padding: "8px 14px" }}>
                  <div className="chat-typing"><span /><span /><span /></div>
                </div>
              )}
              {chatReady && (
                <div className="search-chat-msg system">
                  ✅ Search configured! Click the button below to run, or keep chatting to refine.
                </div>
              )}
            </div>
            <div className="search-chat-input">
              <textarea
                placeholder="Describe the grants you're looking for…"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMsg(); } }}
                rows={1}
              />
              <button onClick={() => sendChatMsg()} disabled={!chatInput.trim() || chatTyping}>➤</button>
            </div>
            {/* Find Grants + Save as Auto Search buttons inside chat */}
            <div style={{ padding: "8px 14px 14px", display: "flex", gap: 10 }}>
              <button className="btn btn-outline btn-sm" style={{ flex: "0 0 auto" }} onClick={() => {
                const searchName = customTags.length > 0 ? customTags.join(", ") : selectedTypes.length > 0 ? selectedTypes.map(t => GRANT_TYPES.find(gt => gt.id === t)?.label.replace(/^[^\s]+\s/, "") || t).join(", ") : "AI Chat Search";
                const newSearch = {
                  id: `as_${Date.now()}`,
                  name: searchName.slice(0, 60),
                  config: { selectedTypes: [...selectedTypes], customTags: [...customTags], filters: { ...filters }, selectedDatabases: [...selectedDatabases] },
                  autoRefresh: true, results: [], lastRefreshTime: null, lastScheduledKey: null, createdAt: new Date().toISOString(),
                };
                saveSavedSearches([...(savedSearches || []), newSearch]);
                showToast(`"${newSearch.name}" saved as auto search!`);
              }}>
                🔄 Save as Auto Search
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => doSearch(false)} disabled={searching}>
                {searching ? <><div className="spinner" /> Searching…</> : <><Icon name="ai" /> Find Grants</>}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="card">
        {/* 1. Grant Type Selector */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 8 }}>
            🎯 Grant Types (select all that apply)
          </label>
          <div className="type-chips">
            {GRANT_TYPES.map(t => (
              <button key={t.id} className={`type-chip ${selectedTypes.includes(t.id) ? "selected" : ""}`}
                onClick={() => toggleType(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          {selectedTypes.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--sprout-sage)", marginTop: 6 }}>
              ✓ {selectedTypes.length} type{selectedTypes.length > 1 ? "s" : ""} selected
              <span style={{ marginLeft: 8, cursor: "pointer", color: "var(--text-muted)", textDecoration: "underline" }} onClick={() => updateSearch({ selectedTypes: [] })}>Clear</span>
            </div>
          )}
        </div>

        {/* 2. Custom Tags Input */}
        <div style={{ marginBottom: 18, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 8 }}>
            🏷️ Custom Search Tags
          </label>
          <div className="tag-input-wrap" onClick={() => document.getElementById("custom-tag-input")?.focus()}>
            {customTags.map(tag => (
              <span key={tag} className="custom-tag">
                {tag}
                <button onClick={e => { e.stopPropagation(); removeCustomTag(tag); }}>✕</button>
              </span>
            ))}
            <input
              id="custom-tag-input"
              placeholder={customTags.length === 0 ? "Type a keyword and press Enter to add (e.g. Brooklyn nonprofits)…" : "Add another…"}
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Press Enter after each tag. Backspace removes the last tag.
          </div>
        </div>

        {/* 3. Filters */}
        <div style={{ marginBottom: 18, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 8 }}>
            ⚙️ Filters
          </label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: "1 1 160px" }}>
              <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>📅 Deadline Window</label>
              <select className="form-select" value={filters.deadlineWindow}
                onChange={e => updateSearch({ filters: { ...filters, deadlineWindow: e.target.value } })}>
                {Object.entries(DEADLINE_WINDOWS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: "1 1 150px" }}>
              <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>🏷 Category</label>
              <select className="form-select" value={filters.category}
                onChange={e => updateSearch({ filters: { ...filters, category: e.target.value } })}>
                <option value="all">All Categories</option>
                <option value="mental-health">Mental Health</option>
                <option value="community">Community</option>
                <option value="youth">Youth Programs</option>
                <option value="arts">Arts & Culture</option>
                <option value="general-nonprofit">General Nonprofit</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: "1 1 140px" }}>
              <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>💰 Grant Size</label>
              <select className="form-select" value={filters.size}
                onChange={e => updateSearch({ filters: { ...filters, size: e.target.value } })}>
                <option value="all">Any Size</option>
                <option value="small">Small (&lt;$25K)</option>
                <option value="medium">Medium ($25K–$100K)</option>
                <option value="large">Large (&gt;$100K)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Grant Databases */}
        <div style={{ marginBottom: 18, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 8 }}>
            🗄️ Grant Databases to Search
          </label>
          <div className="db-selector">
            {GRANT_DATABASES.map(db => (
              <button key={db.id} className={`db-chip ${selectedDatabases.includes(db.id) ? "selected" : ""}`}
                onClick={() => toggleDatabase(db.id)}>
                {db.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Search a Specific Website */}
        <div style={{ marginBottom: 18, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 8 }}>
            🔗 Search a Specific Grant Website
          </label>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <input className="form-input" value={searchUrl} onChange={e => setSearchUrl(e.target.value)}
                placeholder="https://www.examplefoundation.org/grants"
                onKeyDown={e => e.key === "Enter" && doUrlSearch()}
              />
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
                Paste a funder's website URL to search it directly for relevant grants
              </div>
            </div>
            <button className="btn btn-outline" onClick={doUrlSearch} disabled={urlSearching || !searchUrl.trim()} style={{ flexShrink: 0 }}>
              {urlSearching ? <><div className="spinner" style={{ borderColor: "rgba(45,80,22,0.3)", borderTopColor: "var(--sprout-green)" }} /> Searching…</> : "🔍 Search Site"}
            </button>
          </div>

          {/* Searched URL History */}
          {searchedUrls.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6 }}>Previously Searched Sites:</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {searchedUrls.map(url => {
                  let hostname = url;
                  try { hostname = new URL(url).hostname; } catch {}
                  return (
                    <div key={url} className="custom-tag" style={{ padding: "3px 8px", fontSize: 12 }}>
                      <span style={{ cursor: "pointer" }} onClick={() => setSearchUrl(url)} title={url}>🔗 {hostname}</span>
                      <button onClick={() => removeSearchedUrl(url)}>✕</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. Find Grants Button + Save as Auto Search */}
        <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <button className="btn btn-outline btn-sm" onClick={() => {
            const searchName = customTags.length > 0 ? customTags.join(", ") : selectedTypes.length > 0 ? selectedTypes.map(t => GRANT_TYPES.find(gt => gt.id === t)?.label.replace(/^[^\s]+\s/, "") || t).join(", ") : "General Grant Search";
            const newSearch = {
              id: `as_${Date.now()}`,
              name: searchName.slice(0, 60),
              config: { selectedTypes: [...selectedTypes], customTags: [...customTags], filters: { ...filters }, selectedDatabases: [...selectedDatabases] },
              autoRefresh: true,
              results: [],
              lastRefreshTime: null,
              lastScheduledKey: null,
              createdAt: new Date().toISOString(),
            };
            saveSavedSearches([...(savedSearches || []), newSearch]);
            showToast(`"${newSearch.name}" saved as auto search!`);
          }}>
            🔄 Save as Auto Search
          </button>
          <button className="btn btn-primary" onClick={() => doSearch(false)} disabled={searching}
            style={{ minWidth: 160 }}>
            {searching ? <><div className="spinner" /> Searching…</> : <><Icon name="ai" /> Find Grants</>}
          </button>
        </div>
      </div>

      {/* Filtered-out notice */}
      {filteredOut > 0 && !searching && (
        <div style={{ background: "#FEF9C3", border: "1px solid #FDE047", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#854D0E", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          ⚠️ <strong>{filteredOut} result{filteredOut > 1 ? "s were" : " was"} removed</strong> — their deadlines had already passed or fell outside your selected window.
        </div>
      )}

      {searching && (
        <div className="loading-overlay">
          <div className="big-spinner" />
          <p style={{ fontFamily: "Lora, serif", fontSize: 18, color: "var(--sprout-green)" }}>Searching for the perfect grants…</p>
          <p>Finding opportunities aligned with Sprout Society's mission</p>
        </div>
      )}

      {searched && !searching && results.length === 0 && (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No results found</h3>
          <p>Try adjusting your search types, tags, or filters.</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <h3 style={{ fontFamily: "Lora, serif", color: "var(--sprout-green)" }}>
              {results.length} Grant Opportunities Found
            </h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button className="btn btn-outline btn-sm" onClick={() => {
                const searchName = customTags.length > 0 ? customTags.join(", ") : selectedTypes.length > 0 ? selectedTypes.map(t => GRANT_TYPES.find(gt => gt.id === t)?.label.replace(/^[^\s]+\s/, "") || t).join(", ") : "Search Results";
                const newSearch = {
                  id: `as_${Date.now()}`,
                  name: searchName.slice(0, 60),
                  config: { selectedTypes: [...selectedTypes], customTags: [...customTags], filters: { ...filters }, selectedDatabases: [...selectedDatabases] },
                  autoRefresh: true, results: [...results], lastRefreshTime: new Date().toISOString(), lastScheduledKey: null, createdAt: new Date().toISOString(),
                };
                saveSavedSearches([...(savedSearches || []), newSearch]);
                showToast(`"${newSearch.name}" saved as auto search with current results!`);
              }}>
                🔄 Save as Auto Search
              </button>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Sorted by best match</span>
            </div>
          </div>

          {[...results].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).map(r => {
            const isAdded = addedIds.has(r.id);
            const isSaved = savedIds.has(r.id);
            const days = daysUntil(r.deadline);
            const confColor = r.confidenceLevel === "high" ? "tag-green" : r.confidenceLevel === "medium" ? "tag-yellow" : "tag-gray";
            return (
              <div key={r.id} className="ai-result-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h3>{r.name}</h3>
                    <div className="funder">
                      by {r.funder}
                      {r.funderWebsite && (
                        <a href={r.funderWebsite} target="_blank" rel="noreferrer" style={{ marginLeft: 8, color: "var(--sprout-sage)", fontSize: 12 }}>🌐 Funder site</a>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "Lora, serif", fontSize: 18, fontWeight: 700, color: "var(--sprout-green)" }}>
                      {r.amountDisplay}
                    </div>
                    <div style={{ fontSize: 12, color: days <= 30 ? "var(--sprout-coral)" : "var(--text-muted)", marginTop: 3 }}>
                      {r.deadline ? `Deadline: ${r.deadline}` : "Rolling deadline"}
                    </div>
                  </div>
                </div>

                <div className="ai-result-meta">
                  {(r.focusAreas || []).map(f => <span key={f} className="tag tag-green">{f}</span>)}
                  <span className="tag tag-blue">Match: {r.matchScore}%</span>
                  {r.confidenceLevel && <span className={`tag ${confColor}`}>{r.confidenceLevel === "high" ? "✓ Verified" : "◐ Likely"}</span>}
                  {r.sourceDatabase && <span className="tag tag-gray">📍 {r.sourceDatabase}</span>}
                  {days !== null && days <= 30 && days >= 0 && <span className="tag tag-orange">⏰ {days}d left</span>}
                </div>

                <p>{r.description}</p>

                {r.eligibility && (
                  <p style={{ marginTop: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                    <strong>Eligibility:</strong> {r.eligibility}
                  </p>
                )}

                {/* Source verification trace */}
                {r.sourceVerification && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 600 }}>📋 Source:</span> {r.sourceVerification}
                  </div>
                )}

                {r.tips && (
                  <div style={{ marginTop: 10, background: "var(--sprout-cream)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--sprout-bark)" }}>
                    💡 <strong>Tip for Sprout Society:</strong> {r.tips}
                  </div>
                )}

                <div className="ai-result-actions">
                  {r.applicationUrl && (
                    <a href={r.applicationUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                      <Icon name="link" size={13} /> Visit Website
                    </a>
                  )}
                  <button
                    className={`btn btn-sm ${isSaved || isAdded ? "btn-secondary" : "btn-outline"}`}
                    onClick={() => !isSaved && !isAdded && saveForLater(r)}
                    disabled={isSaved || isAdded}
                    title="Save for later"
                    style={{ minWidth: 36 }}
                  >
                    {isSaved || isAdded ? "🔖" : "🔖 Save"}
                  </button>
                  <button className={`btn btn-sm ${isAdded ? "btn-secondary" : "btn-primary"}`}
                    onClick={() => !isAdded && addGrant(r)} disabled={isAdded}>
                    {isAdded ? "✓ Tracking" : <><Icon name="add" /> Track Application</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Auto Searches View ──────────────────────────────────────────────────────
function AutoSearchesView({ savedSearches, saveSavedSearches, showToast, addNotification, setView }) {
  const [runningId, setRunningId] = useState(null);
  const [sizeFilter, setSizeFilter] = useState("all");

  const toggleAutoRefresh = (id) => {
    const updated = savedSearches.map(s => s.id === id ? { ...s, autoRefresh: !s.autoRefresh } : s);
    saveSavedSearches(updated);
    showToast(updated.find(s => s.id === id).autoRefresh ? "Auto-refresh enabled" : "Auto-refresh paused");
  };

  const deleteSearch = (id) => {
    saveSavedSearches(savedSearches.filter(s => s.id !== id));
    showToast("Auto search removed");
  };

  const runSearch = async (search) => {
    setRunningId(search.id);
    const config = search.config || {};
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const allTerms = [...(config.customTags || [])];
    const typesStr = (config.selectedTypes || []).length > 0
      ? `Search these types: ${(config.selectedTypes || []).join(", ")}.` : "";

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: `You are a grant researcher for Sprout Society (mental health peer support nonprofit, Brooklyn NY). Today: ${todayStr}. ${allTerms.length > 0 ? `Keywords: ${allTerms.join(", ")}.` : ""} ${typesStr} Find 6 real grant opportunities with future deadlines. Return ONLY a JSON array with objects having: name, funder, amount (number), amountDisplay, deadline (YYYY-MM-DD), category, description, matchScore. No markdown.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      const prevNames = new Set((search.results || []).map(r => r.name));
      const newGrants = parsed.filter(r => !prevNames.has(r.name));

      if (newGrants.length > 0) {
        newGrants.forEach(g => addNotification({
          type: "newGrant", title: `✨ New grant: ${g.name}`,
          body: `${g.funder} — ${g.amountDisplay || ""}`, icon: "✨", iconBg: "#DCFCE7"
        }));
      }

      const updated = savedSearches.map(s => s.id === search.id ? {
        ...s, results: parsed.map((r, i) => ({ ...r, id: `asr_${Date.now()}_${i}` })),
        lastRefreshTime: new Date().toISOString(), needsRefresh: false
      } : s);
      saveSavedSearches(updated);
      showToast(`"${search.name}" refreshed — ${parsed.length} results`);
    } catch {
      showToast("Search failed — try again");
    }
    setRunningId(null);
  };

  return (
    <div>
      <div className="page-header">
        <h2>🔄 Auto Searches</h2>
        <p>Saved grant searches that refresh automatically at 10:00 AM, 4:00 PM, and 8:00 PM daily. You'll get notified when new grants appear.</p>
      </div>

      {savedSearches.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔄</div>
          <h3>No auto searches yet</h3>
          <p>Go to <strong>Find Grants</strong>, set up your search criteria, then click <strong>"🔄 Save as Auto Search"</strong> to create one.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setView("searchGrants")}>✨ Find Grants</button>
        </div>
      ) : (
        <>
          {/* Filter controls */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>💰 Grant Size</label>
              <select className="form-select" style={{ width: 160 }} value={sizeFilter} onChange={e => setSizeFilter(e.target.value)}>
                <option value="all">Any Size</option>
                <option value="small">Small (&lt;$25K)</option>
                <option value="medium">Medium ($25K–$100K)</option>
                <option value="large">Large (&gt;$100K)</option>
              </select>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--text-muted)" }}>
              Sorted by highest match score
            </div>
          </div>

          {savedSearches.map(s => {
            const isRunning = runningId === s.id;
            // Sort results by matchScore descending and filter by size
            const filteredResults = (s.results || [])
              .filter(r => {
                if (sizeFilter === "all") return true;
                const amt = r.amount || 0;
                if (sizeFilter === "small") return amt < 25000;
                if (sizeFilter === "medium") return amt >= 25000 && amt <= 100000;
                if (sizeFilter === "large") return amt > 100000;
                return true;
              })
              .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
            const avgMatch = filteredResults.length > 0 ? Math.round(filteredResults.reduce((s, r) => s + (r.matchScore || 0), 0) / filteredResults.length) : 0;
          return (
            <div key={s.id} className="saved-search-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontFamily: "Lora, serif", fontSize: 17, color: "var(--text-primary)", marginBottom: 4 }}>{s.name}</h3>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Created {new Date(s.createdAt).toLocaleDateString()}
                    {s.lastRefreshTime && <> · Last refresh: {new Date(s.lastRefreshTime).toLocaleString()}</>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {s.autoRefresh && <div className="pulse-dot" style={{ width: 8, height: 8 }} />}
                  <span className={`tag ${s.autoRefresh ? "tag-green" : "tag-gray"}`}>{s.autoRefresh ? "Active" : "Paused"}</span>
                </div>
              </div>

              {/* Config summary */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {(s.config?.selectedTypes || []).map(t => <span key={t} className="tag tag-blue">{t.replace(/-/g, " ")}</span>)}
                {(s.config?.customTags || []).map(t => <span key={t} className="custom-tag" style={{ padding: "2px 8px" }}>{t}</span>)}
                {s.config?.filters?.category !== "all" && <span className="tag tag-gray">{s.config.filters.category}</span>}
                {s.config?.filters?.size !== "all" && <span className="tag tag-gray">{s.config.filters.size}</span>}
              </div>

              {/* Results preview */}
              {filteredResults.length > 0 && (
                <div style={{ background: "var(--sprout-cream)", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>{filteredResults.length} RESULTS · Avg match: {avgMatch}%</div>
                  {filteredResults.slice(0, 3).map(r => (
                    <div key={r.id || r.name} style={{ fontSize: 13, padding: "4px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between" }}>
                      <span><strong>{r.name}</strong> <span style={{ color: "var(--text-muted)" }}>by {r.funder}</span></span>
                      <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {r.amountDisplay && <span style={{ color: "var(--sprout-green)", fontWeight: 700, fontSize: 12 }}>{r.amountDisplay}</span>}
                        <span className="tag tag-blue" style={{ fontSize: 10, padding: "1px 6px" }}>{r.matchScore}%</span>
                      </span>
                    </div>
                  ))}
                  {filteredResults.length > 3 && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>+{filteredResults.length - 3} more</div>}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-sm" onClick={() => runSearch(s)} disabled={isRunning}>
                  {isRunning ? <><div className="spinner" /> Running…</> : "▶ Run Now"}
                </button>
                <button className={`btn btn-sm ${s.autoRefresh ? "btn-secondary" : "btn-outline"}`} onClick={() => toggleAutoRefresh(s.id)}>
                  {s.autoRefresh ? "⏸ Pause Auto" : "▶ Enable Auto"}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteSearch(s.id)}>
                  <Icon name="trash" size={13} /> Remove
                </button>
              </div>
            </div>
          );
        })}
        </>
      )}

      <div className="card" style={{ marginTop: 20, background: "linear-gradient(135deg, #2D5016 0%, #7A9E5B 100%)", color: "#fff", border: "none" }}>
        <h3 style={{ fontFamily: "Lora, serif", fontSize: 16, marginBottom: 8 }}>📅 Auto-Refresh Schedule</h3>
        <p style={{ fontSize: 13, opacity: 0.9 }}>All active auto searches refresh at <strong>10:00 AM</strong>, <strong>4:00 PM</strong>, and <strong>8:00 PM</strong> daily. New matching grants trigger a notification automatically.</p>
      </div>
    </div>
  );
}

// ─── Saved Grants ─────────────────────────────────────────────────────────────
function SavedGrantsView({ savedGrants, saveSavedGrants, grants, saveGrants, showToast, setView }) {
  const [sortBy, setSortBy] = useState("savedAt");
  const [filterCat, setFilterCat] = useState("all");
  const alreadyTrackedIds = new Set(grants.map(g => g.sourceId).filter(Boolean));

  const unsave = (id) => {
    saveSavedGrants(savedGrants.filter(g => g.id !== id));
    showToast("Removed from saved grants");
  };

  const startApplication = (saved) => {
    if (alreadyTrackedIds.has(saved.sourceId)) {
      showToast("Already in My Applications");
      return;
    }
    const newGrant = {
      id: `grant_${Date.now()}`,
      sourceId: saved.sourceId,
      name: saved.name,
      funder: saved.funder,
      amount: saved.amount,
      amountDisplay: saved.amountDisplay,
      deadline: saved.deadline,
      category: saved.category,
      description: saved.description,
      eligibility: saved.eligibility,
      applicationUrl: saved.applicationUrl,
      matchScore: saved.matchScore,
      focusAreas: saved.focusAreas || [],
      tips: saved.tips,
      status: "notStarted",
      todos: generateDefaultTodos(saved),
      timeline: generateDefaultTimeline(saved),
      notes: "",
      answers: {},
      createdAt: new Date().toISOString(),
    };
    saveGrants([...grants, newGrant]);
    saveSavedGrants(savedGrants.filter(g => g.id !== saved.id));
    showToast(`"${saved.name}" moved to My Applications!`);
    setView("myGrants");
  };

  const sorted = [...savedGrants]
    .filter(g => filterCat === "all" || g.category === filterCat)
    .sort((a, b) => {
      if (sortBy === "deadline") return new Date(a.deadline || "9999") - new Date(b.deadline || "9999");
      if (sortBy === "amount") return (b.amount || 0) - (a.amount || 0);
      if (sortBy === "match") return (b.matchScore || 0) - (a.matchScore || 0);
      return new Date(b.savedAt) - new Date(a.savedAt); // default: newest saved
    });

  return (
    <div>
      <div className="page-header">
        <h2>🔖 Saved Grants</h2>
        <p>Grants you've bookmarked to review later. Start an application whenever you're ready.</p>
      </div>

      {savedGrants.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ padding: "48px 20px" }}>
            <div className="icon">🔖</div>
            <h3>No saved grants yet</h3>
            <p style={{ marginBottom: 20 }}>When you find a grant you like, click <strong>🔖 Save</strong> to bookmark it here for later.</p>
            <button className="btn btn-primary" onClick={() => setView("searchGrants")}>
              ✨ Find Grants
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Sort By</label>
              <select className="form-select" style={{ width: 160 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="savedAt">Recently Saved</option>
                <option value="deadline">Deadline (Soonest)</option>
                <option value="amount">Award Amount</option>
                <option value="match">Best Match</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Category</label>
              <select className="form-select" style={{ width: 160 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="mental-health">Mental Health</option>
                <option value="community">Community</option>
                <option value="youth">Youth Programs</option>
                <option value="arts">Arts & Culture</option>
                <option value="general-nonprofit">General Nonprofit</option>
              </select>
            </div>
            <div style={{ marginLeft: "auto", alignSelf: "flex-end", fontSize: 13, color: "var(--text-muted)", paddingBottom: 2 }}>
              {sorted.length} saved grant{sorted.length !== 1 ? "s" : ""}
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="empty-state"><p>No grants match this filter.</p></div>
          ) : sorted.map(g => {
            const days = daysUntil(g.deadline);
            const isTracked = alreadyTrackedIds.has(g.sourceId);
            return (
              <div key={g.id} className="ai-result-card" style={{ position: "relative" }}>
                {/* Saved ribbon */}
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: "var(--sprout-warm)", borderRadius: 20, padding: "3px 10px",
                  fontSize: 11, fontWeight: 700, color: "var(--sprout-bark)", display: "flex", alignItems: "center", gap: 4
                }}>
                  🔖 Saved {g.savedAt ? new Date(g.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, paddingRight: 100 }}>
                  <div>
                    <h3 style={{ fontFamily: "Lora, serif", fontSize: 17, color: "var(--text-primary)", marginBottom: 3 }}>{g.name}</h3>
                    <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>by {g.funder}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {g.amountDisplay && (
                      <div style={{ fontFamily: "Lora, serif", fontSize: 17, fontWeight: 700, color: "var(--sprout-green)" }}>{g.amountDisplay}</div>
                    )}
                    {g.deadline && (
                      <div style={{ fontSize: 12, color: days !== null && days <= 30 ? "var(--sprout-coral)" : "var(--text-muted)", marginTop: 3 }}>
                        📅 {g.deadline}{days !== null ? ` (${days}d)` : ""}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "10px 0" }}>
                  {(g.focusAreas || []).map(f => <span key={f} className="tag tag-green">{f}</span>)}
                  {g.matchScore && <span className="tag tag-blue">Match: {g.matchScore}%</span>}
                  {days !== null && days <= 30 && days >= 0 && <span className="tag tag-orange">⏰ {days}d left</span>}
                </div>

                {g.description && <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{g.description}</p>}

                {g.eligibility && (
                  <p style={{ marginTop: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                    <strong>Eligibility:</strong> {g.eligibility}
                  </p>
                )}

                {g.tips && (
                  <div style={{ marginTop: 10, background: "var(--sprout-cream)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--sprout-bark)" }}>
                    💡 <strong>Tip:</strong> {g.tips}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  {g.applicationUrl && (
                    <a href={g.applicationUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                      🔗 Visit Website
                    </a>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => unsave(g.id)}>
                    🗑 Remove
                  </button>
                  {isTracked ? (
                    <button className="btn btn-secondary btn-sm" disabled>✓ Already Tracking</button>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => startApplication(g)}>
                      ＋ Start Application
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── My Grants ────────────────────────────────────────────────────────────────
function MyGrantsView({ grants, saveGrants, onOpen, showToast, addNotification }) {
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [grantUrl, setGrantUrl] = useState("");
  const [importing, setImporting] = useState(false);

  const filtered = filter === "all" ? grants : grants.filter(g => g.status === filter);

  // Import grant from URL using AI
  const importFromUrl = async () => {
    if (!grantUrl.trim()) return;
    setImporting(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: `Given this grant URL: ${grantUrl}\n\nExtract all available information about this grant opportunity. Return ONLY valid JSON with these fields (use null for anything you can't determine):\n{\n  "name": "Grant name",\n  "funder": "Organization name",\n  "amount": null or number,\n  "amountDisplay": "$X - $Y" or null,\n  "deadline": "YYYY-MM-DD" or null,\n  "category": "mental-health" or "community" or "youth" or "arts" or "general-nonprofit",\n  "description": "2-3 sentences",\n  "eligibility": "Key requirements",\n  "applicationUrl": "${grantUrl}",\n  "focusAreas": ["tag1", "tag2"],\n  "resources": ["any helpful links mentioned"],\n  "matchScore": 1-100 fit for a mental health peer support nonprofit in Brooklyn NY,\n  "tips": "One tip for the application",\n  "missingFields": ["list of fields that are null or couldn't be determined"]\n}\nNo markdown.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

      const g = {
        id: `grant_${Date.now()}`,
        ...parsed,
        applicationUrl: parsed.applicationUrl || grantUrl,
        resources: parsed.resources || [],
        status: "notStarted",
        todos: generateDefaultTodos(parsed),
        timeline: generateDefaultTimeline(parsed),
        notes: "",
        answers: {},
        createdAt: new Date().toISOString(),
      };
      saveGrants([...grants, g]);

      // Check for missing fields and notify
      const missing = parsed.missingFields || [];
      if (missing.length > 0) {
        addNotification({
          type: "work", title: `⚠️ Incomplete info for "${parsed.name || "New Grant"}"`,
          body: `Missing: ${missing.join(", ")}. Please fill in manually.`,
          grantId: g.id, icon: "⚠️", iconBg: "#FEF9C3"
        });
      }

      setGrantUrl("");
      setShowAdd(false);
      showToast(`"${parsed.name}" imported!${missing.length > 0 ? ` (${missing.length} fields need attention)` : ""}`);
    } catch {
      showToast("Couldn't parse that URL — try pasting the grant page link");
    }
    setImporting(false);
  };

  const deleteGrant = (id) => {
    saveGrants(grants.filter(g => g.id !== id));
    showToast("Grant removed");
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>📋 My Applications</h2>
            <p>Track and manage all of Sprout Society's grant applications.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
            <Icon name="add" /> Add Grant
          </button>
        </div>
      </div>

      {/* URL-based add form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 24, borderColor: "var(--sprout-sage)", borderWidth: 2 }}>
          <h3 className="section-title">Add Grant by URL</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
            Paste the grant's webpage URL and we'll automatically extract all the details. Any missing information will be flagged for you to complete.
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <input className="form-input" value={grantUrl} onChange={e => setGrantUrl(e.target.value)}
                placeholder="https://www.foundationname.org/grants/program-name"
                onKeyDown={e => e.key === "Enter" && importFromUrl()}
                style={{ fontSize: 15 }} />
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                Paste the full URL of the grant opportunity page
              </div>
            </div>
            <button className="btn btn-primary" onClick={importFromUrl} disabled={importing || !grantUrl.trim()}>
              {importing ? <><div className="spinner" /> Importing…</> : <><Icon name="ai" /> Import Grant</>}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {[
          { id: "all", label: `All (${grants.length})` },
          { id: "notStarted", label: "Not Started" },
          { id: "inProgress", label: "In Progress" },
          { id: "submitted", label: "Submitted" },
          { id: "awarded", label: "Awarded" },
        ].map(t => (
          <div key={t.id} className={`tab ${filter === t.id ? "active" : ""}`} onClick={() => setFilter(t.id)}>{t.label}</div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🌱</div>
          <h3>{grants.length === 0 ? "No grants yet" : "None in this status"}</h3>
          <p>{grants.length === 0 ? "Search for grants or add one manually to get started." : "Try a different filter."}</p>
        </div>
      ) : (
        filtered.map(g => {
          const days = daysUntil(g.deadline);
          const done = (g.todos || []).filter(t => t.done).length;
          const total = (g.todos || []).length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          return (
            <div key={g.id} className="grant-card" onClick={() => onOpen(g)}>
              <div className="grant-card-header">
                <div>
                  <h3>{g.name}</h3>
                  <div className="funder">{g.funder}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  {statusTag(g.status)}
                  {g.amount && <div style={{ fontFamily: "Lora, serif", fontWeight: 700, color: "var(--sprout-green)" }}>{formatAmount(g.amount)}</div>}
                </div>
              </div>

              {g.description && <div className="grant-card-desc">{g.description.slice(0, 140)}{g.description.length > 140 ? "…" : ""}</div>}

              <div className="grant-card-meta">
                {g.deadline && (
                  <span style={{ fontSize: 13, color: days !== null && days <= 14 ? "var(--sprout-coral)" : "var(--text-muted)" }}>
                    📅 {g.deadline} {days !== null && days >= 0 ? `(${days}d)` : days < 0 ? "(past)" : ""}
                  </span>
                )}
                {(g.focusAreas || []).slice(0, 3).map(f => <span key={f} className="tag tag-green">{f}</span>)}
                {total > 0 && (
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{done}/{total} tasks</div>
                    <div style={{ width: 80 }}>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                <button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); deleteGrant(g.id); }}>
                  <Icon name="trash" size={13} /> Remove
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── Grant Detail ─────────────────────────────────────────────────────────────
function GrantDetailView({ grantId, grants, saveGrants, profile, showToast, onBack, documents, strategyDocs, addNotification }) {
  const [tab, setTab] = useState("overview");
  const [aiGenerating, setAiGenerating] = useState(false);
  const grant = grants.find(g => g.id === grantId);

  if (!grant) return <div className="empty-state"><p>Grant not found.</p></div>;

  const updateGrant = (updates) => {
    // Auto-set to inProgress if user enters data and status is notStarted
    const current = grants.find(g => g.id === grantId);
    const autoStart = current && current.status === "notStarted" && Object.keys(updates).some(k => ["answers", "notes"].includes(k));
    saveGrants(grants.map(g => g.id === grantId ? { ...g, ...updates, ...(autoStart ? { status: "inProgress" } : {}) } : g));
    if (autoStart) showToast("Application auto-started!");
  };

  const startApplication = () => {
    updateGrant({ status: "inProgress" });
    showToast("Application started!");
  };

  // Missing fields detection
  const missingFields = [];
  if (!grant.name) missingFields.push("name");
  if (!grant.funder) missingFields.push("funder");
  if (!grant.amount) missingFields.push("amount");
  if (!grant.deadline) missingFields.push("deadline");
  if (!grant.description) missingFields.push("description");

  const generateAI = async () => {
    setAiGenerating(true);
    const prompt = `You are helping Sprout Society (mental health peer support nonprofit, Brooklyn NY) prepare a grant application.

Grant: "${grant.name}" by ${grant.funder}
${grant.description ? `Description: ${grant.description}` : ""}
${grant.deadline ? `Deadline: ${grant.deadline}` : ""}
${grant.eligibility ? `Eligibility: ${grant.eligibility}` : ""}

Generate a detailed to-do list and timeline for completing this application.

Return ONLY valid JSON with this exact structure:
{
  "todos": [
    {"id": "t1", "text": "...", "priority": "high|med|low", "dueOffset": 7, "done": false, "category": "research|writing|documents|review|submit", "estimatedHours": 4}
  ],
  "timeline": [
    {"id": "tl1", "title": "...", "description": "...", "daysBeforeDeadline": 30, "done": false, "phase": "research|writing|review|submit"}
  ],
  "questions": [
    {"id": "q1", "question": "...", "hint": "...", "category": "organization|program|budget|impact"}
  ]
}

Generate 8-12 todos, 5-7 timeline milestones, and 8-10 application questions specifically relevant to this grant and Sprout Society. For estimatedHours, use professional grant-writing standards: research tasks 3-8h, writing tasks 6-20h, document gathering 2-6h, review/proofreading 3-10h, submission 1-3h. Tasks that can be done concurrently should overlap in the timeline.`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 3000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      const deadline = grant.deadline ? new Date(grant.deadline) : new Date(Date.now() + 60 * 86400000);
      const todos = (parsed.todos || []).map(t => ({ ...t, dueDate: new Date(deadline.getTime() - (t.dueOffset || 7) * 86400000).toISOString().split("T")[0] }));
      const timeline = (parsed.timeline || []).map(tl => ({ ...tl, date: new Date(deadline.getTime() - (tl.daysBeforeDeadline || 14) * 86400000).toISOString().split("T")[0] }));
      updateGrant({ todos, timeline, questions: parsed.questions || [] });
      showToast("AI plan generated!");
    } catch { showToast("Generation failed — try again"); }
    setAiGenerating(false);
  };

  const totalTasks = (grant.todos || []).length + (grant.timeline || []).length;
  const doneTasks = (grant.todos || []).filter(t => t.done).length + (grant.timeline || []).filter(t => t.done).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ marginBottom: 16 }}>
          <Icon name="back" /> Back to Applications
        </button>

        {/* Missing fields warning */}
        {missingFields.length > 0 && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="missing-badge">⚠️ {missingFields.length} missing field{missingFields.length > 1 ? "s" : ""}</span>
            <span style={{ fontSize: 13, color: "#991B1B" }}>: {missingFields.join(", ")}</span>
          </div>
        )}

        <div className="detail-header">
          <div>
            <div className="detail-title">{grant.name || <span style={{ color: "#EF4444" }}>⚠ Grant Name Missing</span>}</div>
            <div className="detail-funder">by {grant.funder || <span style={{ color: "#EF4444" }}>⚠ Funder Missing</span>}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
              {statusTag(grant.status)}
              {grant.deadline ? (
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>📅 Deadline: {grant.deadline}</span>
              ) : <span style={{ fontSize: 13, color: "#EF4444" }}>📅 Deadline: Missing</span>}
              {grant.amount ? (
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--sprout-green)" }}>{formatAmount(grant.amount)}</span>
              ) : <span style={{ fontSize: 13, color: "#EF4444" }}>💰 Amount: Missing</span>}
              {grant.matchScore && <span className="tag tag-blue">Match: {grant.matchScore}%</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {grant.status === "notStarted" && (
              <button className="btn btn-outline" onClick={startApplication}>▶ Start Application</button>
            )}
            <select className="form-select" style={{ width: 160 }} value={grant.status}
              onChange={e => { updateGrant({ status: e.target.value }); showToast("Status updated"); }}>
              <option value="notStarted">Not Started</option>
              <option value="researching">Researching</option>
              <option value="inProgress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="awarded">Awarded 🏆</option>
              <option value="rejected">Not Funded</option>
            </select>
            <button className="btn btn-primary" onClick={generateAI} disabled={aiGenerating}>
              {aiGenerating ? <><div className="spinner" /> Generating…</> : <><Icon name="ai" /> AI Plan</>}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs — merged Tasks, added Docs & Guides */}
      <div className="tabs">
        {[
          { id: "overview", label: "Overview" },
          { id: "tasks", label: `Tasks (${doneTasks}/${totalTasks})` },
          { id: "answers", label: "Application Answers" },
          { id: "docsGuides", label: "Docs & Guides" },
          { id: "notes", label: "Notes" },
        ].map(t => (
          <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</div>
        ))}
      </div>

      {tab === "overview" && <OverviewTab grant={grant} updateGrant={updateGrant} showToast={showToast} onGanttClick={() => setTab("tasks")} />}
      {tab === "tasks" && <TasksTab grant={grant} updateGrant={updateGrant} showToast={showToast} />}
      {tab === "answers" && <AnswersTab grant={grant} updateGrant={updateGrant} profile={profile} showToast={showToast} />}
      {tab === "docsGuides" && <DocsGuidesTab documents={documents || []} strategyDocs={strategyDocs || []} />}
      {tab === "notes" && <NotesTab grant={grant} updateGrant={updateGrant} showToast={showToast} />}
    </div>
  );
}

function OverviewTab({ grant, updateGrant, showToast, onGanttClick }) {
  const [editing, setEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ name: grant.name, funder: grant.funder, amount: grant.amount || "", deadline: grant.deadline || "", description: grant.description || "", eligibility: grant.eligibility || "", applicationUrl: grant.applicationUrl || "" });

  const save = () => {
    updateGrant(form);
    setEditing(false);
    showToast("Grant details saved");
  };

  const saveTask = (updated) => {
    const todos = grant.todos || [];
    const timeline = grant.timeline || [];
    if (updated.type === "milestone" || timeline.some(t => t.id === updated.id)) {
      updateGrant({ timeline: timeline.map(t => t.id === updated.id ? { ...t, ...updated } : t) });
    } else {
      updateGrant({ todos: todos.map(t => t.id === updated.id ? { ...t, ...updated } : t) });
    }
    showToast("Task updated");
  };

  const deleteTask = (id) => {
    updateGrant({
      todos: (grant.todos || []).filter(t => t.id !== id),
      timeline: (grant.timeline || []).filter(t => t.id !== id),
    });
  };

  const done = (grant.todos || []).filter(t => t.done).length;
  const total = (grant.todos || []).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (editing) return (
    <div className="card">
      <h3 className="section-title">Edit Grant Details</h3>
      <div className="form-grid">
        <div className="form-group"><label className="form-label">Grant Name</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
        <div className="form-group"><label className="form-label">Funder</label><input className="form-input" value={form.funder} onChange={e => setForm(f => ({ ...f, funder: e.target.value }))} /></div>
        <div className="form-group"><label className="form-label">Amount</label><input className="form-input" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
        <div className="form-group"><label className="form-label">Deadline</label><input className="form-input" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} /></div>
        <div className="form-group"><label className="form-label">Application URL</label><input className="form-input" value={form.applicationUrl} onChange={e => setForm(f => ({ ...f, applicationUrl: e.target.value }))} /></div>
      </div>
      <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
      <div className="form-group"><label className="form-label">Eligibility</label><textarea className="form-textarea" style={{ minHeight: 60 }} value={form.eligibility} onChange={e => setForm(f => ({ ...f, eligibility: e.target.value }))} /></div>
      <div style={{ display: "flex", gap: 10 }}><button className="btn btn-primary" onClick={save}>Save</button><button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button></div>
    </div>
  );

  return (
    <div>
      {/* Task card overlay */}
      {editingTask && (
        <TaskCardOverlay
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={saveTask}
          onDelete={(id) => { deleteTask(id); setEditingTask(null); }}
        />
      )}

      {/* ── Top 1/3: Details + Progress + Description ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Grant Details */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 className="section-title" style={{ marginBottom: 0, borderBottom: "none", paddingBottom: 0, fontSize: 15 }}>Grant Details</h3>
            <button className="btn btn-secondary btn-sm" style={{ padding: "4px 10px" }} onClick={() => setEditing(true)}><Icon name="edit" size={12} /></button>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              ["Funder", grant.funder],
              ["Amount", grant.amountDisplay || formatAmount(grant.amount)],
              ["Deadline", grant.deadline || "Not set"],
              ["Category", grant.category],
              ["Application URL", grant.applicationUrl],
            ].map(([k, v]) => v && (
              <div key={k}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 1 }}>{k}</div>
                <div style={{ fontSize: 13, color: "var(--text-primary)", wordBreak: "break-all" }}>
                  {k === "Application URL" ? <a href={v} target="_blank" rel="noreferrer" style={{ color: "var(--sprout-sage)" }}>{v.length > 40 ? v.slice(0, 40) + "…" : v}</a> : v}
                </div>
              </div>
            ))}
          </div>
          {/* Resources */}
          {(grant.resources || []).length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 6 }}>Resources</div>
              {grant.resources.slice(0, 3).map((r, i) => (
                <div key={i}><a href={r} target="_blank" rel="noreferrer" style={{ color: "var(--sprout-sage)", fontSize: 12, wordBreak: "break-all" }}>🔗 {r.length > 40 ? r.slice(0, 40) + "…" : r}</a></div>
              ))}
            </div>
          )}
        </div>

        {/* Application Progress */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 className="section-title" style={{ marginBottom: 12, borderBottom: "none", paddingBottom: 0, fontSize: 15 }}>Application Progress</h3>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13 }}>Tasks completed</span>
              <span style={{ fontWeight: 700, fontSize: 18, color: "var(--sprout-green)" }}>{pct}%</span>
            </div>
            <div className="progress-bar" style={{ height: 14, borderRadius: 7 }}><div className="progress-fill" style={{ width: `${pct}%`, borderRadius: 7 }} /></div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{done} of {total} tasks done</div>
          </div>
          {grant.tips && (
            <div style={{ background: "var(--sprout-cream)", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "var(--sprout-bark)", lineHeight: 1.5 }}>
              💡 <strong>Tip:</strong> {grant.tips}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 className="section-title" style={{ marginBottom: 12, borderBottom: "none", paddingBottom: 0, fontSize: 15 }}>Description</h3>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)", maxHeight: 140, overflow: "auto" }}>{grant.description || "No description added."}</p>
          {grant.eligibility && (
            <>
              <div style={{ marginTop: 10, marginBottom: 4, fontWeight: 600, fontSize: 12, color: "var(--text-muted)" }}>Eligibility</div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text-secondary)", maxHeight: 60, overflow: "auto" }}>{grant.eligibility}</p>
            </>
          )}
        </div>
      </div>

      {/* ── Bottom 2/3: Full-width Application Timeline Gantt ── */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3
            className="section-title"
            style={{ marginBottom: 0, borderBottom: "none", paddingBottom: 0, cursor: "pointer", transition: "color 0.15s" }}
            onClick={() => onGanttClick && onGanttClick()}
            onMouseOver={e => e.target.style.color = "var(--sprout-sage)"}
            onMouseOut={e => e.target.style.color = "var(--sprout-green)"}
          >
            📊 Application Timeline →
          </h3>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Click title to open Tasks tab · Click any task to edit</span>
        </div>
        {(grant.todos || []).length > 0 && grant.deadline ? (
          <GanttChart
            todos={grant.todos || []}
            timeline={grant.timeline || []}
            deadline={grant.deadline}
            onTaskClick={(item) => setEditingTask(item)}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
            <p>Generate an AI Plan to populate the timeline, or add tasks in the Tasks tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Estimated Hours for Grant Tasks (professional standards) ─────────────────
const TASK_HOURS = {
  research: { min: 3, max: 8, label: "Research" },
  writing: { min: 6, max: 20, label: "Writing" },
  documents: { min: 2, max: 6, label: "Documents" },
  review: { min: 3, max: 10, label: "Review" },
  submit: { min: 1, max: 3, label: "Submit" },
  general: { min: 2, max: 5, label: "General" },
};

function estimateHours(task) {
  if (task.estimatedHours) return task.estimatedHours;
  const cat = task.category || task.phase || "general";
  const h = TASK_HOURS[cat] || TASK_HOURS.general;
  return Math.round((h.min + h.max) / 2);
}

// ─── Task Card Overlay (Trello-style) ────────────────────────────────────────
function TaskCardOverlay({ task, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({ ...task });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="task-overlay-bg" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="task-card-modal">
        <div className="task-card-header">
          <div style={{ flex: 1 }}>
            <input className="form-input" style={{ fontSize: 17, fontWeight: 700, fontFamily: "Lora, serif", border: "none", padding: "0", background: "transparent" }}
              value={form.text || form.title || ""} onChange={e => u(form.text !== undefined ? "text" : "title", e.target.value)} placeholder="Task name" />
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {form.done ? <span className="tag tag-green">✓ Complete</span> : <span className="tag tag-blue">In Progress</span>}
              {form.category && <span className="tag tag-gray">{form.category || form.phase}</span>}
            </div>
          </div>
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--text-muted)" }} onClick={onClose}>✕</button>
        </div>
        <div className="task-card-body">
          <div className="task-field-row">
            <div className="task-field" style={{ flex: 1 }}>
              <div className="task-field-label">Priority</div>
              <select className="form-select" value={form.priority || "med"} onChange={e => u("priority", e.target.value)}>
                <option value="high">🔴 High</option><option value="med">🟡 Medium</option><option value="low">🟢 Low</option>
              </select>
            </div>
            <div className="task-field" style={{ flex: 1 }}>
              <div className="task-field-label">Due Date</div>
              <input className="form-input" type="date" value={form.dueDate || form.date || ""} onChange={e => u(form.dueDate !== undefined ? "dueDate" : "date", e.target.value)} />
            </div>
            <div className="task-field" style={{ flex: 1 }}>
              <div className="task-field-label">Est. Hours</div>
              <input className="form-input" type="number" min="0" step="0.5" value={form.estimatedHours || estimateHours(form)} onChange={e => u("estimatedHours", parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div className="task-field-row">
            <div className="task-field" style={{ flex: 1 }}>
              <div className="task-field-label">Category</div>
              <select className="form-select" value={form.category || form.phase || "general"} onChange={e => { u("category", e.target.value); if (form.phase !== undefined) u("phase", e.target.value); }}>
                <option value="research">Research</option><option value="writing">Writing</option><option value="documents">Documents</option><option value="review">Review</option><option value="submit">Submit</option><option value="general">General</option>
              </select>
            </div>
            <div className="task-field" style={{ flex: 1 }}>
              <div className="task-field-label">Assigned To</div>
              <input className="form-input" value={form.assignee || ""} onChange={e => u("assignee", e.target.value)} placeholder="e.g. Sarah, Team Lead" />
            </div>
          </div>
          <div className="task-field">
            <div className="task-field-label">Description / Notes</div>
            <textarea className="form-textarea task-notes" value={form.description || form.notes || ""} onChange={e => u(form.description !== undefined ? "description" : "notes", e.target.value)} placeholder="Add details, links, or notes about this task…" />
          </div>
          <div className="task-field">
            <div className="task-field-label">Status</div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
              <input type="checkbox" checked={form.done || false} onChange={e => u("done", e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--sprout-sage)" }} />
              {form.done ? "Marked as complete" : "Mark as complete"}
            </label>
          </div>
        </div>
        <div className="task-card-footer">
          {onDelete && <button className="btn btn-danger btn-sm" onClick={() => { onDelete(form.id); onClose(); }} style={{ marginRight: "auto" }}>🗑 Delete</button>}
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSave(form); onClose(); }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── Enhanced Gantt Chart ────────────────────────────────────────────────────
function GanttChart({ todos, timeline, deadline, onTaskClick, scale: propScale, filter: propFilter }) {
  const [scale, setScale] = useState(propScale || "lifecycle");
  const [catFilter, setCatFilter] = useState(propFilter || "all");
  const [pageOffset, setPageOffset] = useState(0);

  // Reset page when scale changes
  const changeScale = (s) => { setScale(s); setPageOffset(0); };

  if (!deadline) return null;
  const dl = new Date(deadline);
  const COLORS = { research: "#6BAED6", writing: "#7A9E5B", documents: "#8B6F47", review: "#D4A840", submit: "#E07B54", general: "#8A9B72" };

  let allItems = [
    ...todos.map(t => ({ ...t, type: "todo", label: t.text, startDate: t.dueDate ? new Date(new Date(t.dueDate).getTime() - (estimateHours(t) / 8) * 86400000).toISOString().split("T")[0] : null, endDate: t.dueDate, hours: estimateHours(t) })),
    ...timeline.map(t => ({ ...t, type: "milestone", label: t.title, startDate: t.date, endDate: t.date, hours: estimateHours(t) })),
  ].filter(i => i.startDate || i.endDate);

  if (catFilter !== "all") {
    allItems = allItems.filter(i => (i.category || i.phase || "general") === catFilter);
  }
  allItems.sort((a, b) => new Date(a.startDate || a.endDate) - new Date(b.startDate || b.endDate));

  if (allItems.length === 0) return <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: 16 }}>No tasks to display. Generate an AI Plan first.</div>;

  const allDates = allItems.flatMap(i => [i.startDate, i.endDate].filter(Boolean)).map(d => new Date(d));
  const globalMin = new Date(Math.min(...allDates));
  const globalMax = new Date(Math.max(dl.getTime(), ...allDates.map(d => d.getTime())) + 86400000);
  const totalHours = allItems.reduce((s, i) => s + (i.hours || 0), 0);

  // Compute the visible window based on scale + pageOffset
  let windowStart, windowEnd, windowLabel, gridlines, axisLabels, totalPages;

  if (scale === "weekly") {
    // Find start of the first week (Sunday)
    const base = new Date(globalMin);
    base.setDate(base.getDate() - base.getDay());
    windowStart = new Date(base.getTime() + pageOffset * 7 * 86400000);
    windowEnd = new Date(windowStart.getTime() + 7 * 86400000);
    const weekEnd = new Date(windowEnd.getTime() - 86400000);
    windowLabel = `${windowStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    // Gridlines for each day of the week
    gridlines = [];
    axisLabels = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(windowStart.getTime() + d * 86400000);
      const pct = (d / 7) * 100;
      gridlines.push(pct);
      axisLabels.push({ pct: pct + (100 / 14), label: date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }) });
    }
    gridlines.push(100);

    totalPages = Math.ceil((globalMax - base) / (7 * 86400000));

  } else if (scale === "monthly") {
    const baseMonth = new Date(globalMin.getFullYear(), globalMin.getMonth() + pageOffset, 1);
    windowStart = baseMonth;
    windowEnd = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 1);
    windowLabel = baseMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    // Gridlines for each week within the month
    gridlines = [];
    axisLabels = [];
    const daysInMonth = Math.ceil((windowEnd - windowStart) / 86400000);
    const d = new Date(windowStart);
    d.setDate(d.getDate() - d.getDay()); // start of first week
    let weekNum = 0;
    while (d < windowEnd) {
      const pct = Math.max(0, ((d - windowStart) / (windowEnd - windowStart)) * 100);
      if (pct <= 100) {
        gridlines.push(pct);
        const weekStart = new Date(Math.max(d.getTime(), windowStart.getTime()));
        axisLabels.push({ pct: Math.min(100, pct + (100 / (daysInMonth / 7) / 2)), label: `Wk ${weekNum + 1} (${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })})` });
      }
      d.setDate(d.getDate() + 7);
      weekNum++;
    }
    gridlines.push(100);

    const lastMonth = new Date(globalMax.getFullYear(), globalMax.getMonth(), 1);
    totalPages = (lastMonth.getFullYear() - globalMin.getFullYear()) * 12 + (lastMonth.getMonth() - globalMin.getMonth()) + 1;

  } else {
    // lifecycle — show everything
    windowStart = globalMin;
    windowEnd = globalMax;
    windowLabel = `Full Lifecycle: ${globalMin.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${dl.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    gridlines = [];
    axisLabels = [];
    const totalDays = Math.ceil((globalMax - globalMin) / 86400000);
    // Divide into months
    const d = new Date(globalMin.getFullYear(), globalMin.getMonth(), 1);
    while (d <= globalMax) {
      const pct = Math.max(0, ((d - globalMin) / (globalMax - globalMin)) * 100);
      if (pct <= 100) {
        gridlines.push(pct);
        axisLabels.push({ pct, label: d.toLocaleDateString("en-US", { month: "short", year: totalDays > 180 ? "2-digit" : undefined }) });
      }
      d.setMonth(d.getMonth() + 1);
    }
    totalPages = 1;
  }

  // Filter items to those visible in the current window
  const isLifecycle = scale === "lifecycle";
  const visibleItems = isLifecycle ? allItems : allItems.filter(item => {
    const iStart = new Date(item.startDate || item.endDate);
    const iEnd = new Date(item.endDate || item.startDate);
    // Task is visible if it overlaps the window at all
    return iStart < windowEnd && iEnd >= windowStart;
  });

  const windowMs = windowEnd - windowStart;
  const today = new Date();
  const todayPct = Math.min(100, Math.max(0, ((today - windowStart) / windowMs) * 100));
  const todayInWindow = today >= windowStart && today < windowEnd;
  const windowHours = visibleItems.reduce((s, i) => s + (i.hours || 0), 0);

  return (
    <div>
      {/* Controls */}
      <div className="gantt-controls">
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Scale:</span>
        {["weekly", "monthly", "lifecycle"].map(s => (
          <button key={s} className={`gantt-scale-btn ${scale === s ? "active" : ""}`} onClick={() => changeScale(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginLeft: 12 }}>Filter:</span>
        {["all", "research", "writing", "documents", "review", "submit"].map(f => (
          <button key={f} className={`gantt-scale-btn ${catFilter === f ? "active" : ""}`} onClick={() => setCatFilter(f)}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>
          Est. total: <strong>{totalHours}h</strong>
        </div>
      </div>

      {/* Navigation for paginated scales */}
      {!isLifecycle && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 4px" }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setPageOffset(p => Math.max(0, p - 1))} disabled={pageOffset === 0}>
            ← Prev {scale === "weekly" ? "Week" : "Month"}
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Lora, serif", fontSize: 15, fontWeight: 700, color: "var(--sprout-green)" }}>{windowLabel}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {visibleItems.length} task{visibleItems.length !== 1 ? "s" : ""} · {windowHours}h in this {scale === "weekly" ? "week" : "month"}
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setPageOffset(p => Math.min(totalPages - 1, p + 1))} disabled={pageOffset >= totalPages - 1}>
            Next {scale === "weekly" ? "Week" : "Month"} →
          </button>
        </div>
      )}
      {isLifecycle && (
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: "Lora, serif", fontSize: 15, fontWeight: 700, color: "var(--sprout-green)" }}>{windowLabel}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{allItems.length} tasks · {totalHours}h total</div>
        </div>
      )}

      <div className="gantt-container">
        <div className="gantt-chart">
          {/* Axis labels */}
          <div style={{ display: "flex", marginBottom: 4 }}>
            <div style={{ width: 180, minWidth: 180 }} />
            <div style={{ flex: 1, position: "relative", height: 18 }}>
              {axisLabels.map((a, i) => (
                <span key={i} className="gantt-axis-label" style={{ position: "absolute", left: `${a.pct}%`, transform: "translateX(-50%)" }}>{a.label}</span>
              ))}
            </div>
            <div style={{ width: 40, minWidth: 40 }} />
          </div>

          {/* Empty state for this window */}
          {visibleItems.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px 16px", color: "var(--text-muted)", fontSize: 13 }}>
              No tasks scheduled for this {scale === "weekly" ? "week" : "month"}. Use the arrows to navigate.
            </div>
          )}

          {/* Rows */}
          {visibleItems.map((item, i) => {
            // Clamp bar positions to the visible window
            const iStart = new Date(item.startDate || item.endDate);
            const iEnd = new Date(item.endDate || item.startDate);
            const clampedStart = Math.max(0, ((iStart - windowStart) / windowMs) * 100);
            const clampedEnd = Math.min(100, ((iEnd - windowStart) / windowMs) * 100);
            const barLeft = Math.max(0, clampedStart);
            const barWidth = Math.max(1.5, clampedEnd - barLeft);
            const cat = item.category || item.phase || "general";

            return (
              <div key={i} className={`gantt-row ${onTaskClick ? "clickable" : ""}`} onClick={() => onTaskClick && onTaskClick(item)}>
                <div className="gantt-label" title={item.label}>{item.label?.slice(0, 28)}{(item.label||"").length > 28 ? "…" : ""}</div>
                <div className="gantt-track" style={{ position: "relative" }}>
                  {gridlines.map((g, gi) => <div key={gi} className="gantt-gridline" style={{ left: `${g}%` }} />)}
                  {(isLifecycle || todayInWindow) && <div className="gantt-today" style={{ left: `${todayPct}%` }} />}
                  <div className={`gantt-bar ${item.done ? "done" : ""}`} style={{ left: `${barLeft}%`, width: `${barWidth}%`, background: COLORS[cat] || COLORS.general }}>
                    {item.done ? "✓" : ""}
                  </div>
                </div>
                <div className="gantt-hours">{item.hours}h</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="gantt-legend" style={{ marginTop: 10 }}>
        {Object.entries(COLORS).map(([k, v]) => (
          <div key={k} className="gantt-legend-item"><div className="gantt-legend-dot" style={{ background: v }} />{k}</div>
        ))}
        <div className="gantt-legend-item" style={{ marginLeft: 12 }}><div style={{ width: 10, height: 2, background: "var(--sprout-coral)", borderRadius: 1 }} />Today</div>
      </div>
    </div>
  );
}

// ─── Merged Tasks Tab ────────────────────────────────────────────────────────
function TasksTab({ grant, updateGrant, showToast }) {
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("med");
  const [newDue, setNewDue] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [editingTask, setEditingTask] = useState(null);

  const todos = grant.todos || [];
  const timeline = grant.timeline || [];

  const toggleTodo = (id) => updateGrant({ todos: todos.map(t => t.id === id ? { ...t, done: !t.done } : t) });
  const deleteTodo = (id) => updateGrant({ todos: todos.filter(t => t.id !== id) });
  const toggleTimeline = (id) => updateGrant({ timeline: timeline.map(t => t.id === id ? { ...t, done: !t.done } : t) });

  const saveTask = (updated) => {
    if (updated.type === "milestone" || timeline.some(t => t.id === updated.id)) {
      updateGrant({ timeline: timeline.map(t => t.id === updated.id ? { ...t, ...updated } : t) });
    } else {
      updateGrant({ todos: todos.map(t => t.id === updated.id ? { ...t, ...updated } : t) });
    }
    showToast("Task updated");
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    updateGrant({ todos: [...todos, { id: `t_${Date.now()}`, text: newTask, priority: newPriority, dueDate: newDue, done: false, category: "general", estimatedHours: 2 }] });
    setNewTask(""); setNewDue("");
    showToast("Task added");
  };

  const handleGanttClick = (item) => setEditingTask(item);

  const totalHours = [...todos, ...timeline].reduce((s, t) => s + estimateHours(t), 0);
  const groups = { high: todos.filter(t => t.priority === "high"), med: todos.filter(t => t.priority === "med"), low: todos.filter(t => t.priority === "low" || !t.priority) };

  return (
    <div>
      {editingTask && (
        <TaskCardOverlay
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={saveTask}
          onDelete={(id) => { deleteTodo(id); }}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div className="tabs" style={{ marginBottom: 0 }}>
          <div className={`tab ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>📋 List</div>
          <div className={`tab ${viewMode === "gantt" ? "active" : ""}`} onClick={() => setViewMode("gantt")}>📊 Gantt</div>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Est. total effort: <strong style={{ color: "var(--sprout-green)" }}>{totalHours}h</strong> ({Math.ceil(totalHours / 8)} working days)
        </div>
      </div>

      {viewMode === "gantt" ? (
        <div className="card">
          <GanttChart todos={todos} timeline={timeline} deadline={grant.deadline} onTaskClick={handleGanttClick} />
        </div>
      ) : (
        <>
          <div className="card">
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
              <input className="form-input" style={{ flex: 1, minWidth: 200 }} placeholder="Add a new task..." value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} />
              <select className="form-select" style={{ width: 130 }} value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                <option value="high">High Priority</option><option value="med">Med Priority</option><option value="low">Low Priority</option>
              </select>
              <input className="form-input" type="date" style={{ width: 150 }} value={newDue} onChange={e => setNewDue(e.target.value)} />
              <button className="btn btn-primary" onClick={addTask}><Icon name="add" /> Add</button>
            </div>
          </div>

          {timeline.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--text-secondary)" }}>🏁 Milestones</h4>
              {timeline.sort((a, b) => new Date(a.date) - new Date(b.date)).map(item => (
                <div key={item.id} className="todo-item" style={{ cursor: "pointer" }} onClick={() => setEditingTask({ ...item, type: "milestone" })}>
                  <div className={`todo-check ${item.done ? "done" : ""}`} onClick={e => { e.stopPropagation(); toggleTimeline(item.id); }}>
                    {item.done && <span style={{ fontSize: 11, color: "#fff" }}>✓</span>}
                  </div>
                  <div className="todo-text" style={{ textDecoration: item.done ? "line-through" : "none", color: item.done ? "var(--text-muted)" : "var(--text-primary)" }}>
                    <strong>{item.title}</strong>
                    {item.description && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{item.description}</div>}
                  </div>
                  {item.assignee && <span className="tag tag-gray" style={{ fontSize: 11 }}>{item.assignee}</span>}
                  <div className="gantt-hours">{estimateHours(item)}h</div>
                  {item.date && <div className="todo-due">{item.date}</div>}
                </div>
              ))}
            </div>
          )}

          {todos.length === 0 && timeline.length === 0 ? (
            <div className="empty-state">
              <div className="icon">☑️</div><h3>No tasks yet</h3>
              <p>Add tasks manually or click "AI Plan" to auto-generate a checklist with estimated hours.</p>
            </div>
          ) : (
            [["high", "🔴 High Priority"], ["med", "🟡 Medium Priority"], ["low", "🟢 Low / Other"]].map(([p, label]) => {
              const items = groups[p];
              if (!items || items.length === 0) return null;
              return (
                <div key={p} className="card" style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--text-secondary)" }}>{label}</h4>
                  {items.map(t => (
                    <div key={t.id} className="todo-item" style={{ cursor: "pointer" }} onClick={() => setEditingTask(t)}>
                      <div className={`todo-check ${t.done ? "done" : ""}`} onClick={e => { e.stopPropagation(); toggleTodo(t.id); }}>
                        {t.done && <span style={{ fontSize: 11, color: "#fff" }}>✓</span>}
                      </div>
                      <div className="todo-text" style={{ textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--text-muted)" : "var(--text-primary)" }}>
                        {t.text}
                        {t.assignee && <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>→ {t.assignee}</span>}
                      </div>
                      <div className="gantt-hours">{estimateHours(t)}h</div>
                      {t.dueDate && <div className="todo-due">{t.dueDate}</div>}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
}

// ─── Docs & Guides Tab ───────────────────────────────────────────────────────
function DocsGuidesTab({ documents, strategyDocs }) {
  const [search, setSearch] = useState("");
  const allDocs = [
    ...documents.map(d => ({ ...d, source: "document" })),
    ...strategyDocs.map(d => ({ ...d, source: "strategy" })),
  ];
  const filtered = search
    ? allDocs.filter(d => (d.title || "").toLowerCase().includes(search.toLowerCase()) || (d.content || "").toLowerCase().includes(search.toLowerCase()))
    : allDocs;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: "Lora, serif", color: "var(--sprout-green)", marginBottom: 10 }}>📁 Documents & Strategy Guides</h3>
        <input className="form-input" placeholder="Search documents and guides..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400 }} />
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📁</div><h3>{allDocs.length === 0 ? "No documents or guides yet" : "No matches"}</h3>
          <p>Upload documents in the Library tab, or save AI chat responses to your Strategy Library.</p>
        </div>
      ) : (
        <div className="doc-grid">
          {filtered.sort((a, b) => new Date(b.uploadedAt || b.createdAt) - new Date(a.uploadedAt || a.createdAt)).map(doc => (
            <div key={doc.id} className="doc-card">
              <div className="doc-icon" style={{ background: doc.source === "strategy" ? "#E0E7FF" : "#DCFCE7" }}>{doc.source === "strategy" ? "🧭" : "📄"}</div>
              <h4>{doc.title}</h4>
              <div className="doc-preview">{(doc.content || doc.notes || "").slice(0, 80)}…</div>
              <div className="doc-meta">
                <span className={`tag ${doc.source === "strategy" ? "tag-blue" : "tag-green"}`} style={{ marginRight: 6 }}>{doc.source === "strategy" ? "Strategy" : "Document"}</span>
                {new Date(doc.uploadedAt || doc.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function AnswersTab({ grant, updateGrant, profile, showToast }) {
  const questions = grant.questions || DEFAULT_QUESTIONS;
  const answers = grant.answers || {};

  const updateAnswer = (id, value) => {
    updateGrant({ answers: { ...answers, [id]: value } });
  };

  // Auto-fill with profile data
  const autoFill = () => {
    const fills = {};
    questions.forEach(q => {
      const ql = q.question.toLowerCase();
      if (ql.includes("organization name") || ql.includes("org name")) fills[q.id] = profile.orgName;
      else if (ql.includes("mission")) fills[q.id] = profile.mission;
      else if (ql.includes("ein") || ql.includes("tax id")) fills[q.id] = profile.taxId;
      else if (ql.includes("address") || ql.includes("location")) fills[q.id] = profile.address;
      else if (ql.includes("website")) fills[q.id] = profile.website;
      else if (ql.includes("population") || ql.includes("target") || ql.includes("serve")) fills[q.id] = profile.targetPopulation;
      else if (ql.includes("program")) fills[q.id] = profile.programs;
      else if (ql.includes("vision")) fills[q.id] = profile.vision;
      else if (ql.includes("outcome") || ql.includes("impact")) fills[q.id] = profile.outcomes;
      else if (ql.includes("budget")) fills[q.id] = profile.annualBudget;
      else if (ql.includes("founded") || ql.includes("year")) fills[q.id] = profile.founded;
    });
    updateGrant({ answers: { ...answers, ...fills } });
    showToast("Auto-filled from org profile!");
  };

  const categoryGroups = {};
  questions.forEach(q => {
    const c = q.category || "general";
    if (!categoryGroups[c]) categoryGroups[c] = [];
    categoryGroups[c].push(q);
  });

  const catLabels = { organization: "🏢 Organization Info", program: "🌱 Programs & Services", budget: "💰 Budget & Financials", impact: "📊 Impact & Outcomes", general: "📝 General" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "Lora, serif", color: "var(--sprout-green)" }}>Application Answers</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary" onClick={autoFill}>✨ Auto-fill from Profile</button>
          <button className="btn btn-primary" onClick={() => { updateGrant({ answers }); showToast("Answers saved!"); }}>
            <Icon name="save" /> Save Answers
          </button>
        </div>
      </div>

      {Object.entries(categoryGroups).map(([cat, qs]) => (
        <div key={cat} className="card" style={{ marginBottom: 16 }}>
          <h4 className="section-title">{catLabels[cat] || cat}</h4>
          {qs.map(q => (
            <div key={q.id} className="form-group">
              <label className="form-label">{q.question}</label>
              {q.hint && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>💡 {q.hint}</div>}
              <textarea className="form-textarea" value={answers[q.id] || ""} onChange={e => updateAnswer(q.id, e.target.value)} placeholder="Enter your answer here..." style={{ minHeight: 80 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function NotesTab({ grant, updateGrant, showToast }) {
  const [notes, setNotes] = useState(grant.notes || "");

  useEffect(() => { setNotes(grant.notes || ""); }, [grant.id]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ fontFamily: "Lora, serif", color: "var(--sprout-green)" }}>Notes & Research</h3>
        <button className="btn btn-primary" onClick={() => { updateGrant({ notes }); showToast("Notes saved!"); }}>
          <Icon name="save" /> Save Notes
        </button>
      </div>
      <div className="card">
        <textarea className="form-textarea" style={{ minHeight: 400, fontSize: 14, lineHeight: 1.7 }}
          value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Add your research, contacts, funder notes, strategy ideas, and anything else relevant to this application..." />
      </div>
    </div>
  );
}

// ─── Profile View ─────────────────────────────────────────────────────────────
function ProfileView({ profile, saveProfile, showToast }) {
  const [form, setForm] = useState(profile);
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = () => { saveProfile(form); showToast("Organization profile saved!"); };

  const Field = ({ label, k, type = "text", hint }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {hint && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{hint}</div>}
      {type === "textarea"
        ? <textarea className="form-textarea" value={form[k] || ""} onChange={e => update(k, e.target.value)} />
        : <input className="form-input" type={type} value={form[k] || ""} onChange={e => update(k, e.target.value)} />
      }
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>🏢 Organization Profile</h2>
            <p>Pre-fill common grant information about Sprout Society. This data will auto-populate application answers.</p>
          </div>
          <button className="btn btn-primary" onClick={save}><Icon name="save" /> Save Profile</button>
        </div>
      </div>

      <div className="two-col">
        <div>
          <div className="card">
            <h3 className="section-title">Basic Information</h3>
            <Field label="Organization Name" k="orgName" />
            <Field label="Legal Name (if different)" k="legalName" />
            <Field label="EIN / Tax ID Number" k="taxId" hint="Pre-filled: 83-1298420" />
            <Field label="Address" k="address" />
            <Field label="Website" k="website" />
            <Field label="Phone" k="phone" type="tel" />
            <Field label="Email" k="email" type="email" />
            <Field label="Year Founded" k="founded" />
          </div>

          <div className="card">
            <h3 className="section-title">Primary Contact</h3>
            <Field label="Contact Person Name" k="contactPerson" />
            <Field label="Contact Title" k="contactTitle" />
          </div>

          <div className="card">
            <h3 className="section-title">Social & Online Presence</h3>
            <Field label="Instagram" k="instagram" />
            <Field label="LinkedIn" k="linkedin" />
          </div>
        </div>

        <div>
          <div className="card">
            <h3 className="section-title">Mission & Vision</h3>
            <Field label="Mission Statement" k="mission" type="textarea" />
            <Field label="Vision Statement" k="vision" type="textarea" />
          </div>

          <div className="card">
            <h3 className="section-title">Programs & Impact</h3>
            <Field label="Programs & Services" k="programs" type="textarea" />
            <Field label="Target Population" k="targetPopulation" type="textarea" />
            <Field label="Service Area / Geography" k="serviceArea" />
            <Field label="Key Outcomes" k="outcomes" type="textarea" />
            <Field label="SDG Alignment" k="sdgAligned" hint="Sustainable Development Goals this work aligns with" />
          </div>

          <div className="card">
            <h3 className="section-title">Organizational Details</h3>
            <Field label="Annual Budget" k="annualBudget" />
            <Field label="Number of Staff / Employees" k="numEmployees" />
            <Field label="Number of Volunteers" k="numVolunteers" />
            <Field label="501(c)3 Status" k="nonprofit501c3" hint="e.g. Yes - fiscal sponsor, Yes - direct, Pending" />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button className="btn btn-primary btn-sm" onClick={save}><Icon name="save" /> Save All Changes</button>
      </div>
    </div>
  );
}

// ─── Search History View ─────────────────────────────────────────────────────
function SearchHistoryView({ searchRunHistory, saveSearchRunHistory, savedSearches, saveSavedSearches, showToast, setView, setSearchState }) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = search
    ? searchRunHistory.filter(h =>
        (h.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (h.results || []).some(r => (r.name || "").toLowerCase().includes(search.toLowerCase()) || (r.funder || "").toLowerCase().includes(search.toLowerCase()))
      )
    : searchRunHistory;

  const deleteEntry = (id) => {
    saveSearchRunHistory(searchRunHistory.filter(h => h.id !== id));
    showToast("Search history entry removed");
  };

  const saveAsAuto = (entry) => {
    const newSearch = {
      id: `as_${Date.now()}`,
      name: entry.name || "Saved Search",
      config: entry.config || {},
      autoRefresh: true,
      results: entry.results || [],
      lastRefreshTime: entry.ranAt,
      lastScheduledKey: null,
      createdAt: new Date().toISOString(),
    };
    saveSavedSearches([...(savedSearches || []), newSearch]);
    showToast(`"${newSearch.name}" saved as auto search!`);
  };

  const rerunSearch = (entry) => {
    const config = entry.config || {};
    setSearchState(prev => ({
      ...prev,
      selectedTypes: config.selectedTypes || [],
      customTags: config.customTags || [],
      filters: config.filters || prev.filters,
      selectedDatabases: config.selectedDatabases || ["all"],
      results: [],
      searched: false,
    }));
    setView("searchGrants");
    showToast("Search criteria loaded — click Find Grants to run");
  };

  return (
    <div>
      <div className="page-header">
        <h2>📜 Search History</h2>
        <p>A log of every grant search you've run. Re-run past searches or save them as auto searches.</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input className="form-input" placeholder="Search history by name, grant, or funder…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400 }} />
        {search && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📜</div>
          <h3>{searchRunHistory.length === 0 ? "No search history yet" : "No matching searches"}</h3>
          <p>{searchRunHistory.length === 0 ? "Run a search in Find Grants and it will appear here." : "Try different search terms."}</p>
        </div>
      ) : (
        filtered.map(entry => {
          const isExpanded = expandedId === entry.id;
          const sortedResults = [...(entry.results || [])].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
          return (
            <div key={entry.id} className="saved-search-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setExpandedId(isExpanded ? null : entry.id)}>
                  <h3 style={{ fontFamily: "Lora, serif", fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>{entry.name}</h3>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {new Date(entry.ranAt).toLocaleString()} · {entry.resultCount || 0} results
                    {entry.avgMatch > 0 && <> · Avg match: {entry.avgMatch}%</>}
                  </div>
                </div>
                <span style={{ fontSize: 14, color: "var(--text-muted)", cursor: "pointer" }} onClick={() => setExpandedId(isExpanded ? null : entry.id)}>{isExpanded ? "▾" : "▸"}</span>
              </div>

              {/* Config tags */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {(entry.config?.selectedTypes || []).map(t => <span key={t} className="tag tag-blue" style={{ fontSize: 11 }}>{t.replace(/-/g, " ")}</span>)}
                {(entry.config?.customTags || []).map(t => <span key={t} className="custom-tag" style={{ padding: "2px 8px", fontSize: 11 }}>{t}</span>)}
                {entry.config?.filters?.category && entry.config.filters.category !== "all" && <span className="tag tag-gray" style={{ fontSize: 11 }}>{entry.config.filters.category}</span>}
                {entry.config?.filters?.size && entry.config.filters.size !== "all" && <span className="tag tag-gray" style={{ fontSize: 11 }}>{entry.config.filters.size}</span>}
              </div>

              {/* Expanded results */}
              {isExpanded && sortedResults.length > 0 && (
                <div style={{ marginTop: 12, background: "var(--sprout-cream)", borderRadius: 10, padding: "12px 16px" }}>
                  {sortedResults.map(r => (
                    <div key={r.id || r.name} style={{ padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                      <div>
                        <strong>{r.name}</strong> <span style={{ color: "var(--text-muted)" }}>by {r.funder}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                        {r.amountDisplay && <span style={{ color: "var(--sprout-green)", fontWeight: 700, fontSize: 12 }}>{r.amountDisplay}</span>}
                        <span className="tag tag-blue" style={{ fontSize: 10, padding: "1px 6px" }}>{r.matchScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn btn-outline btn-sm" onClick={() => rerunSearch(entry)}>🔄 Re-run Search</button>
                <button className="btn btn-outline btn-sm" onClick={() => saveAsAuto(entry)}>🔄 Save as Auto Search</button>
                <button className="btn btn-danger btn-sm" style={{ marginLeft: "auto" }} onClick={() => deleteEntry(entry.id)}>
                  <Icon name="trash" size={12} />
                </button>
              </div>
            </div>
          );
        })
      )}

      {searchRunHistory.length > 0 && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button className="btn btn-danger btn-sm" onClick={() => { saveSearchRunHistory([]); showToast("Search history cleared"); }}>Clear All History</button>
        </div>
      )}
    </div>
  );
}

// ─── Chat History View ───────────────────────────────────────────────────────
function ChatHistoryView({ chatHistory, saveChatHistory, showToast }) {
  const [search, setSearch] = useState("");
  const [viewingId, setViewingId] = useState(null);

  const viewThread = chatHistory.find(c => c.id === viewingId);

  const deleteThread = (id) => {
    saveChatHistory(chatHistory.filter(c => c.id !== id));
    showToast("Chat deleted");
    if (viewingId === id) setViewingId(null);
  };

  const filtered = search
    ? chatHistory.filter(c =>
        (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.messages || []).some(m => (m.content || "").toLowerCase().includes(search.toLowerCase()))
      )
    : chatHistory;

  const renderContent = (text) => {
    const parts = (text || "").split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p);
  };

  // Viewing a thread
  if (viewThread) return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary btn-sm" onClick={() => setViewingId(null)} style={{ marginBottom: 12 }}>
          <Icon name="back" /> Back to Chat History
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>💬 {viewThread.title}</h2>
            <p style={{ marginTop: 4 }}>
              <span className="tag tag-blue">{viewThread.source || "Chat"}</span>
              <span style={{ marginLeft: 12, color: "var(--text-muted)", fontSize: 13 }}>{new Date(viewThread.updatedAt || viewThread.createdAt).toLocaleString()}</span>
              <span style={{ marginLeft: 8, color: "var(--text-muted)", fontSize: 13 }}>{(viewThread.messages || []).length} messages</span>
            </p>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => deleteThread(viewThread.id)}>
            <Icon name="trash" size={13} /> Delete
          </button>
        </div>
      </div>
      <div className="card" style={{ padding: "20px 24px" }}>
        {(viewThread.messages || []).map((m, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: m.role === "assistant" ? "var(--sprout-warm)" : "var(--sprout-sage)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                {m.role === "assistant" ? "🌱" : "👤"}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                {m.role === "assistant" ? "Grant Assistant" : "You"}
              </span>
            </div>
            <div style={{ marginLeft: 34, fontSize: 14, lineHeight: 1.7, color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>
              {renderContent(m.content)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h2>💬 Chat History</h2>
        <p>All conversations with the AI Grant Assistant and Grant Finder chat are saved here.</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input className="form-input" placeholder="Search conversations…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }} />
        {search && (
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">💬</div>
          <h3>{chatHistory.length === 0 ? "No chat history yet" : "No matching conversations"}</h3>
          <p>{chatHistory.length === 0 ? "Start a conversation using the AI Grant Assistant (💬 button) or the Grant Finder search chat." : "Try different search terms."}</p>
        </div>
      ) : (
        filtered.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)).map(thread => {
          const msgCount = (thread.messages || []).length;
          const lastAssistant = [...(thread.messages || [])].reverse().find(m => m.role === "assistant");
          const preview = lastAssistant ? lastAssistant.content.slice(0, 120) : "";
          return (
            <div key={thread.id} className="chat-thread-card" onClick={() => setViewingId(thread.id)}>
              <h4>{thread.title}</h4>
              {preview && <div className="chat-thread-preview">{preview}{preview.length >= 120 ? "…" : ""}</div>}
              <div className="chat-thread-meta">
                <span className="tag tag-blue" style={{ fontSize: 10, padding: "1px 6px" }}>{thread.source || "Chat"}</span>
                <span>{new Date(thread.updatedAt || thread.createdAt).toLocaleDateString()}</span>
                <span>{msgCount} message{msgCount !== 1 ? "s" : ""}</span>
                <button className="btn btn-danger btn-sm" style={{ marginLeft: "auto", padding: "2px 8px", fontSize: 11 }}
                  onClick={e => { e.stopPropagation(); deleteThread(thread.id); }}>
                  🗑
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── Documents View ──────────────────────────────────────────────────────────
const DOC_CATEGORIES = [
  { id: "all", label: "All Documents" },
  { id: "business-model", label: "📊 Business Models" },
  { id: "financial", label: "💰 Financial Documents" },
  { id: "legal", label: "⚖️ Legal / Compliance" },
  { id: "program", label: "🌱 Program Materials" },
  { id: "impact", label: "📈 Impact Reports" },
  { id: "letters", label: "✉️ Letters of Support" },
  { id: "other", label: "📎 Other" },
];

const DOC_TYPE_ICONS = {
  "business-model": { bg: "#DBEAFE", icon: "📊" },
  "financial": { bg: "#FEF9C3", icon: "💰" },
  "legal": { bg: "#FEE2E2", icon: "⚖️" },
  "program": { bg: "#DCFCE7", icon: "🌱" },
  "impact": { bg: "#E0E7FF", icon: "📈" },
  "letters": { bg: "#FCE7F3", icon: "✉️" },
  "other": { bg: "#F3F4F6", icon: "📎" },
};

function DocumentsView({ documents, saveDocuments, showToast }) {
  const [filterCat, setFilterCat] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [newDoc, setNewDoc] = useState({ title: "", category: "other", notes: "", content: "" });

  const filtered = filterCat === "all" ? documents : documents.filter(d => d.category === filterCat);

  const handleFileRead = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const isText = file.type.startsWith("text/") || file.name.endsWith(".md") || file.name.endsWith(".txt") || file.name.endsWith(".csv");
      const doc = {
        id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: newDoc.title || file.name,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || "application/octet-stream",
        category: newDoc.category,
        notes: newDoc.notes,
        content: isText ? e.target.result : null,
        dataUrl: !isText ? e.target.result : null,
        uploadedAt: new Date().toISOString(),
      };
      saveDocuments([...documents, doc]);
      showToast(`"${doc.title}" uploaded!`);
      setNewDoc({ title: "", category: "other", notes: "", content: "" });
      setShowUpload(false);
    };
    if (file.type.startsWith("text/") || file.name.endsWith(".md") || file.name.endsWith(".txt") || file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileRead(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleFileRead(file);
  };

  const addManualDoc = () => {
    if (!newDoc.title) return;
    const doc = {
      id: `doc_${Date.now()}`,
      title: newDoc.title,
      fileName: null,
      fileSize: null,
      fileType: "text/plain",
      category: newDoc.category,
      notes: newDoc.notes,
      content: newDoc.content,
      dataUrl: null,
      uploadedAt: new Date().toISOString(),
    };
    saveDocuments([...documents, doc]);
    showToast(`"${doc.title}" added!`);
    setNewDoc({ title: "", category: "other", notes: "", content: "" });
    setShowUpload(false);
  };

  const deleteDoc = (id) => {
    saveDocuments(documents.filter(d => d.id !== id));
    showToast("Document removed");
    if (viewingDoc === id) setViewingDoc(null);
  };

  const viewDoc = documents.find(d => d.id === viewingDoc);

  // Viewing a single document
  if (viewDoc) return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary btn-sm" onClick={() => setViewingDoc(null)} style={{ marginBottom: 12 }}>
          <Icon name="back" /> Back to Documents
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>📄 {viewDoc.title}</h2>
            <p style={{ marginTop: 4 }}>
              {viewDoc.fileName && <span style={{ marginRight: 12 }}>{viewDoc.fileName}</span>}
              <span className={`tag ${DOC_TYPE_ICONS[viewDoc.category] ? "tag-blue" : "tag-gray"}`}>{DOC_CATEGORIES.find(c => c.id === viewDoc.category)?.label || viewDoc.category}</span>
              <span style={{ marginLeft: 12, color: "var(--text-muted)", fontSize: 13 }}>Uploaded {new Date(viewDoc.uploadedAt).toLocaleDateString()}</span>
            </p>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => deleteDoc(viewDoc.id)}>
            <Icon name="trash" size={13} /> Delete
          </button>
        </div>
      </div>
      {viewDoc.notes && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Notes</h4>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{viewDoc.notes}</p>
        </div>
      )}
      {viewDoc.content && (
        <div className="card">
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12 }}>Content</h4>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-primary)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{viewDoc.content}</div>
        </div>
      )}
      {viewDoc.dataUrl && (
        <div className="card">
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12 }}>File Preview</h4>
          {viewDoc.fileType.startsWith("image/") ? (
            <img src={viewDoc.dataUrl} alt={viewDoc.title} style={{ maxWidth: "100%", borderRadius: 8 }} />
          ) : (
            <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📄</div>
              <p>Preview not available for this file type.</p>
              <p style={{ fontSize: 12 }}>{viewDoc.fileType} — {viewDoc.fileSize ? `${(viewDoc.fileSize / 1024).toFixed(1)} KB` : ""}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>📁 Documents</h2>
            <p>Upload and organize business models, financial docs, letters of support, and other relevant materials for grant applications.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowUpload(!showUpload)}>
            <Icon name="upload" /> Upload / Add
          </button>
        </div>
      </div>

      {showUpload && (
        <div className="card" style={{ marginBottom: 24, borderColor: "var(--sprout-sage)", borderWidth: 2 }}>
          <h3 className="section-title">Add Document</h3>

          <div
            className={`upload-zone ${dragActive ? "active" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("doc-file-input").click()}
            style={{ marginBottom: 20 }}
          >
            <input id="doc-file-input" type="file" style={{ display: "none" }} onChange={handleFileInput}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md,.csv,.png,.jpg,.jpeg,.gif" />
            <div className="icon">📂</div>
            <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
              Drop a file here, or click to browse
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              PDF, Word, Excel, text, images — up to 5MB
            </p>
          </div>

          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, margin: "-8px 0 16px", fontWeight: 600 }}>— or add a text document manually —</div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Document Title *</label>
              <input className="form-input" value={newDoc.title} onChange={e => setNewDoc(n => ({ ...n, title: e.target.value }))}
                placeholder="e.g. 2024 Business Model Canvas" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={newDoc.category} onChange={e => setNewDoc(n => ({ ...n, category: e.target.value }))}>
                {DOC_CATEGORIES.filter(c => c.id !== "all").map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <input className="form-input" value={newDoc.notes} onChange={e => setNewDoc(n => ({ ...n, notes: e.target.value }))}
              placeholder="Brief description or context for this document" />
          </div>
          <div className="form-group">
            <label className="form-label">Content (for text documents)</label>
            <textarea className="form-textarea" style={{ minHeight: 120 }} value={newDoc.content} onChange={e => setNewDoc(n => ({ ...n, content: e.target.value }))}
              placeholder="Paste your document content here..." />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" onClick={addManualDoc} disabled={!newDoc.title}>Add Document</button>
            <button className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="tabs" style={{ marginBottom: 20, overflowX: "auto", width: "100%" }}>
        {DOC_CATEGORIES.map(c => (
          <div key={c.id} className={`tab ${filterCat === c.id ? "active" : ""}`} style={{ whiteSpace: "nowrap" }} onClick={() => setFilterCat(c.id)}>
            {c.id === "all" ? `All (${documents.length})` : c.label}
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📁</div>
          <h3>{documents.length === 0 ? "No documents yet" : "No documents in this category"}</h3>
          <p>{documents.length === 0 ? "Upload business models, financials, and other materials to keep everything organized for grant applications." : "Try a different category."}</p>
        </div>
      ) : (
        <div className="doc-grid">
          {filtered.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).map(doc => {
            const typeStyle = DOC_TYPE_ICONS[doc.category] || DOC_TYPE_ICONS.other;
            return (
              <div key={doc.id} className="doc-card" onClick={() => setViewingDoc(doc.id)} style={{ cursor: "pointer" }}>
                <div className="doc-icon" style={{ background: typeStyle.bg }}>{typeStyle.icon}</div>
                <h4>{doc.title}</h4>
                {doc.fileName && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{doc.fileName}</div>}
                {doc.notes && <div className="doc-preview">{doc.notes}</div>}
                <div className="doc-meta">
                  <span className={`tag tag-gray`} style={{ marginRight: 6 }}>{DOC_CATEGORIES.find(c => c.id === doc.category)?.label || doc.category}</span>
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                  {doc.fileSize && ` · ${(doc.fileSize / 1024).toFixed(0)} KB`}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                  <button className="btn btn-danger btn-sm" style={{ padding: "3px 10px" }}
                    onClick={e => { e.stopPropagation(); deleteDoc(doc.id); }}>
                    <Icon name="trash" size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Strategy Library View ───────────────────────────────────────────────────
const STRATEGY_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "general", label: "📝 General" },
  { id: "narrative", label: "✍️ Narratives" },
  { id: "budget", label: "💰 Budgets" },
  { id: "research", label: "🔍 Research" },
  { id: "template", label: "📋 Templates" },
  { id: "talking-points", label: "💬 Talking Points" },
];

function StrategyLibraryView({ strategyDocs, saveStrategyDocs, showToast }) {
  const [filterCat, setFilterCat] = useState("all");
  const [viewingId, setViewingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", category: "", content: "" });

  const filtered = filterCat === "all" ? strategyDocs : strategyDocs.filter(d => d.category === filterCat);
  const viewDoc = strategyDocs.find(d => d.id === viewingId);

  const deleteDoc = (id) => {
    saveStrategyDocs(strategyDocs.filter(d => d.id !== id));
    showToast("Strategy document removed");
    if (viewingId === id) setViewingId(null);
  };

  const startEdit = (doc) => {
    setEditingId(doc.id);
    setEditForm({ title: doc.title, category: doc.category, content: doc.content });
  };

  const saveEdit = () => {
    saveStrategyDocs(strategyDocs.map(d => d.id === editingId ? { ...d, ...editForm } : d));
    setEditingId(null);
    showToast("Document updated!");
  };

  // Export as .doc (HTML-based, compatible with Google Docs and MS Word)
  const exportAsDoc = (doc) => {
    const htmlContent = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${doc.title}</title>
<style>
  body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #1C2B0E; max-width: 7.5in; margin: 1in auto; }
  h1 { font-family: 'Georgia', serif; font-size: 20pt; color: #2D5016; border-bottom: 2px solid #B8D96E; padding-bottom: 8px; margin-bottom: 16px; }
  h2 { font-family: 'Georgia', serif; font-size: 14pt; color: #2D5016; margin-top: 20px; }
  strong { color: #2D5016; }
  .meta { font-size: 10pt; color: #8A9B72; margin-bottom: 20px; border-bottom: 1px solid #D4DEAD; padding-bottom: 10px; }
  .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #D4DEAD; font-size: 9pt; color: #8A9B72; }
</style></head>
<body>
  <h1>${doc.title.replace(/</g, "&lt;")}</h1>
  <div class="meta">
    Sprout Society — Strategy Library<br/>
    Category: ${STRATEGY_CATEGORIES.find(c => c.id === doc.category)?.label || doc.category}<br/>
    Created: ${new Date(doc.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}<br/>
    Source: ${doc.source || "AI Grant Assistant"}
  </div>
  <div>${(doc.content || "").replace(/\n/g, "<br/>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</div>
  <div class="footer">Generated by Sprout Society Grant Manager</div>
</body></html>`;
    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_").slice(0, 60)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Document exported! Open in Word or upload to Google Drive.");
  };

  // Export as Google Docs-compatible plain HTML
  const exportAsGoogleDoc = (doc) => {
    const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${doc.title}</title></head>
<body style="font-family:Arial,sans-serif;font-size:11pt;line-height:1.6;color:#333;">
<h1 style="color:#2D5016;">${doc.title.replace(/</g, "&lt;")}</h1>
<p style="color:#888;font-size:10pt;">Sprout Society — ${new Date(doc.createdAt).toLocaleDateString()}</p>
<hr style="border:1px solid #D4DEAD;"/>
<div>${(doc.content || "").replace(/\n/g, "<br/>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</div>
</body></html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_").slice(0, 60)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("HTML exported! Upload to Google Drive → Open with Google Docs.");
  };

  // Markdown-ish bold renderer
  const renderContent = (text) => {
    const parts = (text || "").split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : p
    );
  };

  // Viewing a single strategy doc
  if (viewDoc) return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary btn-sm" onClick={() => setViewingId(null)} style={{ marginBottom: 12 }}>
          <Icon name="back" /> Back to Strategy Library
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>🧭 {viewDoc.title}</h2>
            <p style={{ marginTop: 4 }}>
              <span className="tag tag-blue">{STRATEGY_CATEGORIES.find(c => c.id === viewDoc.category)?.label || viewDoc.category}</span>
              <span style={{ marginLeft: 12, color: "var(--text-muted)", fontSize: 13 }}>Created {new Date(viewDoc.createdAt).toLocaleDateString()}</span>
              <span style={{ marginLeft: 12, color: "var(--text-muted)", fontSize: 13 }}>Source: {viewDoc.source || "AI Assistant"}</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="export-btn" onClick={() => exportAsDoc(viewDoc)}>
              📄 Export .doc
            </button>
            <button className="export-btn" onClick={() => exportAsGoogleDoc(viewDoc)}>
              📝 Export for Google Docs
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => startEdit(viewDoc)}>
              <Icon name="edit" /> Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => deleteDoc(viewDoc.id)}>
              <Icon name="trash" size={13} /> Delete
            </button>
          </div>
        </div>
      </div>
      {editingId === viewDoc.id ? (
        <div className="card">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
              {STRATEGY_CATEGORIES.filter(c => c.id !== "all").map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea className="form-textarea" style={{ minHeight: 300, fontSize: 14, lineHeight: 1.7 }} value={editForm.content}
              onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
            <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="strat-doc-content">{renderContent(viewDoc.content)}</div>
      )}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>🧭 Strategy Library</h2>
            <p>AI-generated strategy guides, narratives, templates, and research saved from the Grant Assistant chat. Edit and refine them for your applications.</p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {STRATEGY_CATEGORIES.map(c => (
          <div key={c.id} className={`tab ${filterCat === c.id ? "active" : ""}`} onClick={() => setFilterCat(c.id)}>
            {c.id === "all" ? `All (${strategyDocs.length})` : c.label}
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🧭</div>
          <h3>{strategyDocs.length === 0 ? "No strategy documents yet" : "No documents in this category"}</h3>
          <p>{strategyDocs.length === 0
            ? <>Use the AI Grant Assistant (💬 button in the bottom-right) and click <strong>"🧭 Save to Strategy Library"</strong> on any response to build your library.</>
            : "Try a different category."
          }</p>
        </div>
      ) : (
        <div className="doc-grid">
          {filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(doc => (
            <div key={doc.id} className="doc-card" onClick={() => setViewingId(doc.id)} style={{ cursor: "pointer" }}>
              <div className="doc-icon" style={{ background: "#E0E7FF" }}>🧭</div>
              <h4>{doc.title}</h4>
              <div className="doc-preview">{doc.content?.slice(0, 120)}…</div>
              <div className="doc-meta">
                <span className="tag tag-blue" style={{ marginRight: 6 }}>{STRATEGY_CATEGORIES.find(c => c.id === doc.category)?.label || doc.category}</span>
                {new Date(doc.createdAt).toLocaleDateString()}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, gap: 6 }}>
                <button className="btn btn-secondary btn-sm" style={{ padding: "3px 10px" }}
                  onClick={e => { e.stopPropagation(); startEdit(doc); setViewingId(doc.id); }}>
                  <Icon name="edit" size={12} />
                </button>
                <button className="btn btn-danger btn-sm" style={{ padding: "3px 10px" }}
                  onClick={e => { e.stopPropagation(); deleteDoc(doc.id); }}>
                  <Icon name="trash" size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateDefaultTodos(grant) {
  const deadline = grant.deadline ? new Date(grant.deadline) : null;
  const offset = (days) => deadline ? new Date(deadline.getTime() - days * 86400000).toISOString().split("T")[0] : "";
  return [
    { id: "t1", text: "Research funder priorities and past grants awarded", priority: "high", dueDate: offset(35), done: false, category: "research" },
    { id: "t2", text: "Review grant guidelines and eligibility requirements thoroughly", priority: "high", dueDate: offset(30), done: false, category: "research" },
    { id: "t3", text: "Gather required financial documents (IRS letter, audit, budget)", priority: "high", dueDate: offset(21), done: false, category: "documents" },
    { id: "t4", text: "Draft project narrative / program description", priority: "high", dueDate: offset(18), done: false, category: "writing" },
    { id: "t5", text: "Develop detailed program budget", priority: "med", dueDate: offset(14), done: false, category: "writing" },
    { id: "t6", text: "Collect letters of support / references if required", priority: "med", dueDate: offset(14), done: false, category: "documents" },
    { id: "t7", text: "Write organization background & mission statement section", priority: "med", dueDate: offset(12), done: false, category: "writing" },
    { id: "t8", text: "Draft evaluation plan and outcomes metrics", priority: "med", dueDate: offset(10), done: false, category: "writing" },
    { id: "t9", text: "Internal review — have a colleague proofread the full application", priority: "high", dueDate: offset(5), done: false, category: "review" },
    { id: "t10", text: "Final revisions and polish", priority: "high", dueDate: offset(3), done: false, category: "review" },
    { id: "t11", text: "Submit application (confirm receipt confirmation email)", priority: "high", dueDate: offset(1), done: false, category: "submit" },
  ];
}

function generateDefaultTimeline(grant) {
  const deadline = grant.deadline ? new Date(grant.deadline) : null;
  const offset = (days) => deadline ? new Date(deadline.getTime() - days * 86400000).toISOString().split("T")[0] : "";
  return [
    { id: "tl1", title: "Begin Research Phase", description: "Review funder website, past grantees, and guidelines", date: offset(35), done: false, phase: "research" },
    { id: "tl2", title: "Documents Gathered", description: "All required supporting documents collected and ready", date: offset(21), done: false, phase: "documents" },
    { id: "tl3", title: "First Draft Complete", description: "Full application narrative drafted — ready for internal review", date: offset(14), done: false, phase: "writing" },
    { id: "tl4", title: "Internal Review Done", description: "Leadership has reviewed and approved the application", date: offset(5), done: false, phase: "review" },
    { id: "tl5", title: "Application Submitted ✉️", description: "Application submitted before deadline, confirmation received", date: offset(1), done: false, phase: "submit" },
  ];
}

const DEFAULT_QUESTIONS = [
  { id: "dq1", question: "Organization Name", hint: "Legal name of your organization", category: "organization" },
  { id: "dq2", question: "EIN / Tax Identification Number", hint: "Your federal tax ID number", category: "organization" },
  { id: "dq3", question: "Organization Mission Statement", hint: "Keep to 2-3 sentences", category: "organization" },
  { id: "dq4", question: "Organization Address", category: "organization" },
  { id: "dq5", question: "Year Founded", category: "organization" },
  { id: "dq6", question: "Description of Programs and Services", hint: "Describe Empathetic Strangers, Peer Groups, Connect to Learn", category: "program" },
  { id: "dq7", question: "Target Population Served", hint: "Who does Sprout Society serve?", category: "program" },
  { id: "dq8", question: "Geographic Service Area", category: "program" },
  { id: "dq9", question: "Annual Operating Budget", category: "budget" },
  { id: "dq10", question: "Requested Grant Amount and How It Will Be Used", category: "budget" },
  { id: "dq11", question: "Measurable Outcomes and Impact", hint: "How do you measure success?", category: "impact" },
  { id: "dq12", question: "Why is this grant a good fit for your organization?", hint: "Connect Sprout Society's work to the funder's priorities", category: "general" },
];
