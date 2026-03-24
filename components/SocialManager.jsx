import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

// ─── Sprout Society Brand Colors & Design System (Shared with GrantTool) ─────
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
    --sprout-rose: #C4748A;
    --text-primary: #1C2B0E;
    --text-secondary: #5A6B40;
    --text-muted: #8A9B72;
    --border: #D4DEAD;
    --shadow: 0 2px 12px rgba(45,80,22,0.10);
    --shadow-lg: 0 8px 32px rgba(45,80,22,0.15);
    --draft-bg: #E8F4FD; --draft-text: #1E6FA8;
    --pending-bg: #FFF8E1; --pending-text: #B45309;
    --approved-bg: #F0FDF4; --approved-text: #166534;
    --published-bg: #F5F3FF; --published-text: #5B21B6;
    --scheduled-bg: #FFF0F6; --scheduled-text: #9D174D;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--sprout-cream); color: var(--text-primary); }
  .app { display: flex; min-height: 100vh; }

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

  .main { margin-left: 240px; flex: 1; padding: 32px; min-height: 100vh; }
  .main.collapsed { margin-left: 56px; }
  .page-header { margin-bottom: 28px; }
  .page-header h2 { font-family: 'Lora', serif; font-size: 28px; color: var(--sprout-green); }
  .page-header p { color: var(--text-secondary); margin-top: 6px; font-size: 15px; }

  .card {
    background: #fff; border-radius: 14px; padding: 24px;
    box-shadow: var(--shadow); border: 1px solid var(--border); margin-bottom: 16px;
  }
  .card-sm { padding: 16px; }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: #fff; border-radius: 14px; padding: 20px;
    box-shadow: var(--shadow); border: 1px solid var(--border);
  }
  .stat-card .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 8px; }
  .stat-card .value { font-family: 'Lora', serif; font-size: 32px; color: var(--sprout-green); font-weight: 700; }
  .stat-card .sub { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }

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
  .btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-danger { background: #FEE2E2; color: #B91C1C; }
  .btn-danger:hover { background: #FECACA; }
  .btn-sm { padding: 6px 12px; font-size: 13px; }

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

  .tag {
    display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px;
    border-radius: 20px; font-size: 12px; font-weight: 600;
  }
  .tag-green { background: #DCFCE7; color: #166534; }
  .tag-yellow { background: #FEF9C3; color: #854D0E; }
  .tag-blue { background: #DBEAFE; color: #1E40AF; }
  .tag-red { background: #FEE2E2; color: #991B1B; }
  .tag-gray { background: #F3F4F6; color: #374151; }
  .tag-purple { background: #F5F3FF; color: #5B21B6; }
  .tag-pink { background: #FFF0F6; color: #9D174D; }

  .badge-draft { background: var(--draft-bg); color: var(--draft-text); }
  .badge-pending { background: var(--pending-bg); color: var(--pending-text); }
  .badge-approved { background: var(--approved-bg); color: var(--approved-text); }
  .badge-published { background: var(--published-bg); color: var(--published-text); }
  .badge-scheduled { background: var(--scheduled-bg); color: var(--scheduled-text); }

  .tabs { display: flex; gap: 4px; margin-bottom: 24px; background: var(--sprout-warm); padding: 4px; border-radius: 10px; width: fit-content; }
  .tab { padding: 8px 18px; border-radius: 7px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text-secondary); transition: all 0.15s; }
  .tab.active { background: #fff; color: var(--sprout-green); box-shadow: var(--shadow); font-weight: 600; }

  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border); border-radius: 12px; overflow: hidden; }
  .cal-day-hdr {
    background: #fff; padding: 10px; text-align: center;
    font-size: 11px; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .cal-cell {
    background: #fff; min-height: 100px; padding: 8px;
    transition: background 0.1s; cursor: pointer;
  }
  .cal-cell:hover { background: rgba(122,158,91,0.04); }
  .cal-cell.other { background: #FAF8F5; }
  .cal-cell.today { background: rgba(122,158,91,0.06); }
  .cal-date-num {
    font-size: 12px; color: var(--text-muted); margin-bottom: 4px; font-weight: 500;
    width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;
  }
  .cal-date-num.today { background: var(--sprout-green); color: #fff; }
  .cal-chip {
    font-size: 10px; padding: 2px 7px; border-radius: 4px; margin-bottom: 2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    cursor: pointer; font-weight: 500; transition: opacity 0.1s; display: block;
  }
  .cal-chip:hover { opacity: 0.8; }
  .cal-chip.draft { background: var(--draft-bg); color: var(--draft-text); }
  .cal-chip.pending_review { background: var(--pending-bg); color: var(--pending-text); }
  .cal-chip.approved { background: var(--approved-bg); color: var(--approved-text); }
  .cal-chip.published { background: var(--published-bg); color: var(--published-text); }

  .ig-mock {
    background: #fff; border: 1px solid #dbdbdb; border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; overflow: hidden;
    max-width: 340px;
  }
  .ig-hdr { display: flex; align-items: center; gap: 9px; padding: 10px 12px; }
  .ig-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px;
  }
  .ig-uname { font-weight: 600; font-size: 12px; line-height: 1; }
  .ig-loc { font-size: 10px; color: #8e8e8e; margin-top: 2px; }
  .ig-img {
    width: 100%; aspect-ratio: 1; background: #f0f0f0; overflow: hidden;
    display: flex; align-items: center; justify-content: center; color: #bbb; font-size: 36px;
  }
  .ig-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ig-acts { display: flex; justify-content: space-between; padding: 9px 12px 4px; }
  .ig-acts-left { display: flex; gap: 14px; }
  .ig-icon { cursor: pointer; font-size: 18px; filter: grayscale(1); opacity: 0.7; }
  .ig-likes { font-weight: 600; padding: 0 12px; font-size: 12px; margin-bottom: 4px; }
  .ig-caption { padding: 0 12px 10px; font-size: 12px; line-height: 1.5; color: #262626; }
  .ig-caption .ig-uname-inline { font-weight: 600; margin-right: 4px; }
  .ig-time { padding: 0 12px 10px; font-size: 10px; color: #8e8e8e; text-transform: uppercase; }

  .post-card {
    background: #fff; border-radius: 14px; padding: 16px 20px;
    box-shadow: var(--shadow); border: 1px solid var(--border);
    margin-bottom: 12px; cursor: pointer; transition: all 0.18s;
    display: flex; gap: 16px; align-items: flex-start;
  }
  .post-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); border-color: var(--sprout-sage); }
  .post-thumb {
    width: 64px; height: 64px; border-radius: 8px; background: #f0f0f0;
    flex-shrink: 0; overflow: hidden; display: flex; align-items: center; justify-content: center;
    color: var(--text-muted); font-size: 24px;
  }
  .post-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .post-info { flex: 1; min-width: 0; }
  .post-info h4 { font-family: 'Lora', serif; font-size: 15px; color: var(--text-primary); margin-bottom: 4px; }
  .post-info .caption-preview { font-size: 13px; color: var(--text-secondary); line-height: 1.5; max-height: 40px; overflow: hidden; }
  .post-meta { display: flex; gap: 8px; align-items: center; margin-top: 8px; flex-wrap: wrap; }

  .upload-zone {
    border: 2px dashed var(--border); border-radius: 14px; padding: 40px 24px;
    text-align: center; cursor: pointer; transition: all 0.2s; background: #fff;
  }
  .upload-zone:hover { border-color: var(--sprout-sage); background: var(--sprout-cream); }
  .upload-zone.active { border-color: var(--sprout-sage); background: rgba(122,158,91,0.06); }

  .section-title { font-family: 'Lora', serif; font-size: 18px; color: var(--sprout-green); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid var(--sprout-warm); }

  .progress-bar { height: 8px; background: var(--sprout-warm); border-radius: 4px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--sprout-sage); border-radius: 4px; transition: width 0.4s; }

  .toast {
    position: fixed; bottom: 24px; right: 24px; background: var(--sprout-green); color: #fff;
    padding: 12px 20px; border-radius: 10px; box-shadow: var(--shadow-lg);
    font-size: 14px; z-index: 9999; animation: slideIn 0.3s ease;
  }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-overlay { text-align: center; padding: 48px; color: var(--text-secondary); }
  .loading-overlay .big-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--sprout-sage); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }

  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
  .empty-state .icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state h3 { font-family: 'Lora', serif; color: var(--text-secondary); margin-bottom: 8px; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  .recent-list .recent-item {
    display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .recent-item:last-child { border-bottom: none; }
  .recent-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--sprout-warm); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }

  .appr-card {
    background: #fff; border: 1px solid var(--border); border-radius: 14px;
    padding: 20px; display: flex; gap: 16px; margin-bottom: 12px; align-items: flex-start;
    transition: all 0.15s;
  }
  .appr-card:hover { box-shadow: var(--shadow); }

  .char-count { font-size: 12px; color: var(--text-muted); text-align: right; margin-top: 4px; }
  .char-count.warn { color: var(--sprout-coral); }
  .char-count.over { color: #B91C1C; font-weight: 600; }

  .brand-sidebar {
    background: var(--sprout-cream); border: 1.5px solid var(--border); border-radius: 12px;
    padding: 16px; font-size: 13px;
  }
  .brand-sidebar h4 { font-family: 'Lora', serif; font-size: 14px; color: var(--sprout-green); margin-bottom: 10px; }
  .brand-rule { padding: 8px 0; border-bottom: 1px solid var(--border); }
  .brand-rule:last-child { border-bottom: none; }
  .brand-rule .rule-label { font-weight: 600; color: var(--text-secondary); font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; }

  .bar-wrap { display: flex; align-items: flex-end; gap: 5px; height: 120px; margin-top: 10px; }
  .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; }
  .bar-fill { width: 100%; border-radius: 3px 3px 0 0; opacity: 0.82; transition: all 0.3s; cursor: pointer; }
  .bar-fill:hover { opacity: 1; }
  .bar-lbl { font-size: 9px; color: var(--text-muted); margin-top: 3px; text-align: center; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 300;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-card {
    background: #fff; border-radius: 16px; width: 600px; max-width: 94vw;
    max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: modalSlide 0.2s ease;
  }
  @keyframes modalSlide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-header {
    padding: 20px 24px 16px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .modal-body { padding: 20px 24px; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; }

  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th {
    font-size: 11px; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.05em;
    padding: 9px 13px; text-align: left; border-bottom: 2px solid var(--border);
  }
  .data-table td { padding: 11px 13px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .data-table tr:hover td { background: rgba(122,158,91,0.03); }

  .hashtag-chip {
    display: inline-flex; padding: 4px 10px; border-radius: 16px;
    font-size: 12px; font-weight: 600; background: var(--sprout-warm);
    color: var(--sprout-bark); margin: 2px 4px 2px 0; cursor: default;
  }

  .chat-fab {
    position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px;
    border-radius: 50%; background: linear-gradient(135deg, var(--sprout-green), var(--sprout-sage));
    color: #fff; border: none; cursor: pointer; font-size: 24px;
    box-shadow: 0 4px 20px rgba(45,80,22,0.3);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; transition: all 0.2s;
  }
  .chat-fab:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(45,80,22,0.4); }
  .chat-window {
    position: fixed; bottom: 90px; right: 24px; width: 400px; max-height: 560px;
    background: #fff; border-radius: 16px; box-shadow: 0 12px 48px rgba(0,0,0,0.18);
    display: flex; flex-direction: column; z-index: 201;
    animation: chatSlide 0.2s ease; overflow: hidden;
  }
  @keyframes chatSlide { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .chat-header {
    background: linear-gradient(135deg, var(--sprout-green), var(--sprout-sage));
    padding: 14px 16px; display: flex; align-items: center; gap: 10px;
  }
  .chat-header-avatar { font-size: 24px; }
  .chat-header h4 { color: #fff; font-size: 14px; font-weight: 700; font-family: 'Lora', serif; }
  .chat-header p { color: rgba(255,255,255,0.7); font-size: 11px; }
  .chat-header-close {
    margin-left: auto; background: rgba(255,255,255,0.15); border: none;
    color: #fff; width: 28px; height: 28px; border-radius: 50%;
    cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;
  }
  .chat-messages { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 8px; max-height: 350px; }
  .chat-bubble-row { display: flex; align-items: flex-start; gap: 8px; }
  .chat-bubble-row.user { justify-content: flex-end; }
  .chat-avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .chat-avatar.assistant { background: var(--sprout-cream); }
  .chat-avatar.user { background: var(--sprout-green); color: #fff; font-size: 12px; }
  .chat-bubble {
    max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.6;
    white-space: pre-wrap; word-break: break-word;
  }
  .chat-bubble.assistant { background: var(--sprout-cream); color: var(--text-primary); border-bottom-left-radius: 4px; }
  .chat-bubble.assistant strong { color: var(--sprout-green); }
  .chat-bubble.user { background: var(--sprout-green); color: #fff; border-bottom-right-radius: 4px; }
  .chat-input-row { display: flex; gap: 8px; padding: 12px 14px; border-top: 1px solid var(--border); }
  .chat-input {
    flex: 1; border: 1.5px solid var(--border); border-radius: 8px; padding: 8px 12px;
    font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; resize: none;
    min-height: 38px; max-height: 80px; color: var(--text-primary);
  }
  .chat-input:focus { border-color: var(--sprout-sage); }
  .chat-send {
    width: 38px; height: 38px; border-radius: 8px; border: none; cursor: pointer;
    background: var(--sprout-green); color: #fff; font-size: 16px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; align-self: flex-end;
  }
  .chat-send:disabled { background: var(--border); cursor: not-allowed; }
  .chat-typing span {
    display: inline-block; width: 6px; height: 6px; background: var(--text-muted);
    border-radius: 50%; margin: 0 2px; animation: typingDot 1.2s infinite;
  }
  .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
  .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingDot { 0%,60%,100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-4px); } }
  .chat-suggestion-chip {
    display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px;
    border-radius: 16px; border: 1px solid var(--border); background: #fff;
    font-size: 12px; color: var(--text-secondary); cursor: pointer;
    font-family: 'DM Sans', sans-serif; white-space: nowrap; transition: all 0.15s;
  }
  .chat-suggestion-chip:hover { border-color: var(--sprout-sage); background: var(--sprout-cream); }
  .chat-suggestions-scroll {
    display: flex; gap: 6px; padding: 8px 14px; overflow-x: auto; border-top: 1px solid var(--border);
  }
  .chat-suggestions-scroll::-webkit-scrollbar { height: 0; }
  .chat-clear { font-size: 11px; color: var(--text-muted); cursor: pointer; transition: color 0.15s; }
  .chat-clear:hover { color: var(--sprout-coral); }

  .confirm-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 400;
    display: flex; align-items: center; justify-content: center;
  }
  .confirm-card {
    background: #fff; border-radius: 16px; padding: 28px; max-width: 440px; width: 90%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25); text-align: center;
  }

  @media (max-width: 768px) {
    .sidebar { width: 200px; min-width: 200px; }
    .sidebar.collapsed { width: 48px; min-width: 48px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .two-col { grid-template-columns: 1fr; }
    .form-grid { grid-template-columns: 1fr; }
    .chat-window { width: 92vw; right: 4vw; bottom: 80px; }
  }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    dashboard: "🌿", calendar: "📅", edit: "✏️", check: "✓",
    approve: "✅", analytics: "📊", brand: "🎨", add: "＋",
    trash: "🗑", back: "←", save: "💾", image: "🖼️",
    send: "📤", clock: "⏰", heart: "❤️", comment: "💬",
    eye: "👁️", bookmark: "🔖", sprout: "🌱", ai: "✨",
    hashtag: "#️⃣", star: "⭐", info: "ℹ️", link: "🔗",
    refresh: "🔄", filter: "🔽", upload: "⬆️",
  };
  return <span style={{ fontSize: size }}>{icons[name] || "•"}</span>;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const POST_STATUSES = {
  draft: { label: "Draft", cls: "badge-draft", icon: "📝" },
  pending_review: { label: "Pending Review", cls: "badge-pending", icon: "⏳" },
  approved: { label: "Approved", cls: "badge-approved", icon: "✅" },
  published: { label: "Published", cls: "badge-published", icon: "🟣" },
};

const CONTENT_TYPES = [
  { id: "post", label: "Post", icon: "📷" },
  { id: "carousel", label: "Carousel", icon: "🎠" },
  { id: "story", label: "Story", icon: "📱" },
  { id: "reel", label: "Reel", icon: "🎬" },
];

const CATEGORIES = [
  { id: "community", label: "Community", color: "#DCFCE7" },
  { id: "event", label: "Event", color: "#FEF9C3" },
  { id: "educational", label: "Educational", color: "#DBEAFE" },
  { id: "promotional", label: "Promotional", color: "#F5F3FF" },
  { id: "behind_scenes", label: "Behind the Scenes", color: "#FFF0F6" },
  { id: "testimonial", label: "Testimonial", color: "#FEF3C7" },
];

const BRAND_VOICE = {
  tone: "Warm, inclusive, hopeful — like a supportive friend who always shows up.",
  sentenceStyle: "Short, active, accessible. Avoid clinical or corporate language.",
  vocabulary: "Community-first. Say 'community' not 'customers'. Say 'connect' not 'network'.",
  emojis: "🌱 ✨ 💚 🤝 🌿 💡 — max 2 per post, never to start a sentence.",
  hashtags: "Max 5 per post. Always include #SproutSociety + #MentalWellness. Add 3 niche tags.",
  cta: "End with a question to invite engagement. Example: 'What helps you feel connected?'",
  weSay: ["Community", "Connection", "Peer support", "Wellness", "Together", "Safe space"],
  weNeverSay: ["Customers", "Users", "Synergy", "Game-changer", "Crazy", "Insane"],
  brandHashtags: ["#SproutSociety", "#MentalWellness", "#PeerSupport", "#CommunityHeals", "#YouAreNotAlone"],
};

const CHAT_SUGGESTIONS = [
  { icon: "✨", label: "Caption ideas", prompt: "Give me 3 caption ideas for an Instagram post about our upcoming peer support group session. Keep the tone warm and inviting." },
  { icon: "📊", label: "Post timing", prompt: "Based on best practices for mental health nonprofits on Instagram, when should I post this week for maximum engagement?" },
  { icon: "#️⃣", label: "Hashtag help", prompt: "Suggest 5 hashtags for a post about our Empathetic Strangers program. Mix branded and discovery hashtags." },
  { icon: "🎨", label: "Content ideas", prompt: "What content themes should Sprout Society focus on this month? Give me 5 post ideas with captions." },
  { icon: "🔍", label: "Review caption", prompt: "Review this caption against our brand guidelines and suggest improvements:" },
  { icon: "📅", label: "Week plan", prompt: "Create a 5-post content plan for this week. Include post type, topic, and suggested caption for each." },
];

// ─── Supabase transform helpers ───────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusBadge(status) {
  const m = POST_STATUSES[status] || { label: status, cls: "tag-gray" };
  return <span className={`tag ${m.cls}`}>{m.icon} {m.label}</span>;
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) days.push({ day: prevDays - i, month: month - 1, other: true });
  for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, month, other: false });
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) days.push({ day: i, month: month + 1, other: true });
  return days;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function truncate(str, len = 80) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

// ─── Supabase field translation ───────────────────────────────────────────────
function rowToPost(row) {
  return {
    id: row.id,
    title: row.title || "",
    caption: row.caption || "",
    contentType: row.content_type || "post",
    category: row.category || "community",
    status: row.status || "draft",
    scheduledAt: row.scheduled_at || "",
    publishedAt: row.published_at || "",
    imageUrl: row.image_url || "",
    instagramMediaId: row.instagram_media_id || "",
    likes: row.likes || 0,
    comments: row.comments || 0,
    reach: row.reach || 0,
    hashtags: row.tags || [...BRAND_VOICE.brandHashtags],
    notes: row.notes || "",
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function postToRow(post, userId) {
  return {
    id: post.id,
    user_id: userId,
    title: post.title || "",
    caption: post.caption || "",
    content_type: post.contentType || "post",
    category: post.category || "community",
    status: post.status || "draft",
    scheduled_at: post.scheduledAt || null,
    published_at: post.publishedAt || null,
    image_url: post.imageUrl || null,
    instagram_media_id: post.instagramMediaId || null,
    likes: post.likes || 0,
    comments: post.comments || 0,
    reach: post.reach || 0,
    tags: post.hashtags || [...BRAND_VOICE.brandHashtags],
    notes: post.notes || "",
    updated_at: new Date().toISOString(),
  };
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SocialManager({ onLogout, userEmail, onSwitchTool }) {
  const [view, setView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Load posts from Supabase ────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setPosts(data.map(rowToPost));
      setLoading(false);
    })();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Supabase CRUD ───────────────────────────────────────────────────────
  const addPost = async (post) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('social_posts')
      .insert([{ ...postToRow(post), user_id: user.id }])
      .select().single();
    if (error) { showToast("Error creating post"); return null; }
    const newPost = rowToPost(data);
    setPosts(prev => [newPost, ...prev]);
    showToast("Post created!");
    return newPost;
  };

  const updatePost = async (id, changes) => {
    const existing = posts.find(p => p.id === id);
    const { data, error } = await supabase
      .from('social_posts')
      .update(postToRow({ ...existing, ...changes }))
      .eq('id', id)
      .select().single();
    if (!error && data) setPosts(prev => prev.map(p => p.id === id ? rowToPost(data) : p));
  };

  const deletePost = async (id) => {
    const { error } = await supabase.from('social_posts').delete().eq('id', id);
    if (!error) { setPosts(prev => prev.filter(p => p.id !== id)); showToast("Post deleted"); }
  };

  // ── Instagram publish ───────────────────────────────────────────────────
  const [publishingId, setPublishingId] = useState(null);

  const handlePublishToInstagram = async (post) => {
    if (!post.imageUrl || post.imageUrl.startsWith('data:')) {
      showToast('A public Image URL is required to publish to Instagram.');
      return;
    }
    setPublishingId(post.id);
    try {
      const res = await fetch('/api/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          imageUrl: post.imageUrl,
          caption: [post.caption, ...(post.hashtags || [])].filter(Boolean).join('\n\n'),
        }),
      });
      const data = await res.json();
      if (data.success) {
        await updatePost(post.id, {
          status: 'published',
          instagramMediaId: data.media_id,
          publishedAt: new Date().toISOString(),
        });
        showToast('Published to Instagram! 🎉');
      } else {
        showToast(`Publish failed: ${data.error}`);
      }
    } catch {
      showToast('Publish failed. Check your connection.');
    }
    setPublishingId(null);
  };

  // ── Stats ───────────────────────────────────────────────────────────────
  const stats = {
    total: posts.length,
    drafts: posts.filter(p => p.status === "draft").length,
    pending: posts.filter(p => p.status === "pending_review").length,
    approved: posts.filter(p => p.status === "approved").length,
    published: posts.filter(p => p.status === "published").length,
    totalEngagement: posts.filter(p => p.status === "published").reduce((s, p) => s + (p.likes || 0) + (p.comments || 0), 0),
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F7F3EC" }}>
      <div className="loading-overlay">
        <div className="big-spinner" />
        <p>Loading Social Manager…</p>
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
                  <p>Social Manager</p>
                </div>
                <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(true)} title="Collapse sidebar">◂</button>
              </div>
            )}
          </div>

          <div className="nav-section">
            <div className="nav-label">Overview</div>
            <div className={`nav-item ${view === "dashboard" ? "active" : ""}`} onClick={() => setView("dashboard")} title="Dashboard">
              <Icon name="dashboard" size={15} /> <span className="nav-text">Dashboard</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Content</div>
            <div className={`nav-item ${view === "calendar" ? "active" : ""}`} onClick={() => setView("calendar")} title="Calendar">
              <Icon name="calendar" size={15} /> <span className="nav-text">Calendar</span>
            </div>
            <div className={`nav-item ${view === "editor" ? "active" : ""}`} onClick={() => { setEditingPost(null); setView("editor"); }} title="New Post">
              <Icon name="add" size={15} /> <span className="nav-text">New Post</span>
            </div>
            <div className={`nav-item ${view === "allPosts" ? "active" : ""}`} onClick={() => setView("allPosts")} title="All Posts">
              <span style={{ fontSize: 15 }}>📋</span> <span className="nav-text">All Posts</span>
              {posts.length > 0 && <span className="badge">{posts.length}</span>}
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Workflow</div>
            <div className={`nav-item ${view === "approvals" ? "active" : ""}`} onClick={() => setView("approvals")} title="Approvals">
              <Icon name="approve" size={15} /> <span className="nav-text">Approvals</span>
              {stats.pending > 0 && <span className="badge">{stats.pending}</span>}
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Insights</div>
            <div className={`nav-item ${view === "analytics" ? "active" : ""}`} onClick={() => setView("analytics")} title="Analytics">
              <Icon name="analytics" size={15} /> <span className="nav-text">Analytics</span>
            </div>
            <div className={`nav-item ${view === "brandVoice" ? "active" : ""}`} onClick={() => setView("brandVoice")} title="Brand Voice">
              <Icon name="brand" size={15} /> <span className="nav-text">Brand Voice</span>
            </div>
          </div>

          <div className="sidebar-footer">
            {!sidebarCollapsed && onSwitchTool && (
              <button onClick={() => onSwitchTool("home")} style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.7)", borderRadius: 6, padding: "6px 12px",
                fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%",
                marginBottom: 8, display: "flex", alignItems: "center", gap: 6, justifyContent: "center"
              }}>← Back to Hub</button>
            )}
            {userEmail && !sidebarCollapsed && (
              <div style={{ paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                <p style={{ fontSize: 11, marginBottom: 6, color: "rgba(255,255,255,0.4)" }}>👤 {userEmail}</p>
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
            <DashboardView stats={stats} posts={posts} setView={setView} setEditingPost={setEditingPost} />
          )}
          {view === "calendar" && (
            <CalendarView posts={posts} setView={setView} setEditingPost={setEditingPost} />
          )}
          {view === "editor" && (
            <EditorView
              post={editingPost ? posts.find(p => p.id === editingPost) : null}
              addPost={addPost} updatePost={updatePost} deletePost={deletePost}
              showToast={showToast} setView={setView} setEditingPost={setEditingPost}
              onPublish={handlePublishToInstagram} publishingId={publishingId}
            />
          )}
          {view === "allPosts" && (
            <AllPostsView posts={posts} setView={setView} setEditingPost={setEditingPost} deletePost={deletePost} updatePost={updatePost} />
          )}
          {view === "approvals" && (
            <ApprovalsView posts={posts} updatePost={updatePost} showToast={showToast}
              setView={setView} setEditingPost={setEditingPost}
              onPublish={handlePublishToInstagram} publishingId={publishingId} />
          )}
          {view === "analytics" && (
            <AnalyticsView posts={posts} />
          )}
          {view === "brandVoice" && (
            <BrandVoiceView />
          )}
        </main>

        {toast && <div className="toast">✓ {toast}</div>}
        <AIChatOverlay posts={posts} showToast={showToast} />
      </div>
    </>
  );
}

// ─── Dashboard View ──────────────────────────────────────────────────────────
function DashboardView({ stats, posts, setView, setEditingPost }) {
  const recentPosts = [...posts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
  const pendingPosts = posts.filter(p => p.status === "pending_review");
  const scheduledPosts = posts.filter(p => p.status === "approved" && p.scheduledAt).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)).slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>🌿 Social Dashboard</h2>
            <p>Your content command center. Create, approve, and publish — all in one place.</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingPost(null); setView("editor"); }}>
            <Icon name="add" /> New Post
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Posts</div>
          <div className="value">{stats.total}</div>
          <div className="sub">{stats.published} published</div>
        </div>
        <div className="stat-card">
          <div className="label">Pending Review</div>
          <div className="value" style={{ color: stats.pending > 0 ? "var(--sprout-coral)" : undefined }}>{stats.pending}</div>
          <div className="sub">{stats.approved} approved & ready</div>
        </div>
        <div className="stat-card">
          <div className="label">Published</div>
          <div className="value">{stats.published}</div>
          <div className="sub">to Instagram</div>
        </div>
        <div className="stat-card">
          <div className="label">Engagement</div>
          <div className="value">{stats.totalEngagement.toLocaleString()}</div>
          <div className="sub">likes + comments</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3 className="section-title">📋 Recent Posts</h3>
          {recentPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
              <p>No posts yet. Create your first one!</p>
            </div>
          ) : (
            <div className="recent-list">
              {recentPosts.map(post => (
                <div key={post.id} className="recent-item" style={{ cursor: "pointer" }}
                  onClick={() => { setEditingPost(post.id); setView("editor"); }}>
                  <div className="recent-icon">📷</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>{post.title || "Untitled"}</h4>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{truncate(post.caption, 50)}</p>
                  </div>
                  <div>{statusBadge(post.status)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {pendingPosts.length > 0 && (
            <div className="card" style={{ borderColor: "var(--sprout-coral)", borderWidth: 2 }}>
              <h3 className="section-title">⏳ Needs Your Approval</h3>
              {pendingPosts.slice(0, 3).map(post => (
                <div key={post.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{post.title || "Untitled"}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{truncate(post.caption, 40)}</div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setView("approvals")}>Review</button>
                </div>
              ))}
            </div>
          )}

          <div className="card">
            <h3 className="section-title">🚀 Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => { setEditingPost(null); setView("editor"); }}>
                📝 Create New Post
              </button>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setView("calendar")}>
                📅 View Calendar
              </button>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setView("analytics")}>
                📊 View Analytics
              </button>
            </div>
          </div>

          {scheduledPosts.length > 0 && (
            <div className="card">
              <h3 className="section-title">📅 Upcoming</h3>
              {scheduledPosts.map(post => (
                <div key={post.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 13 }}>{post.title || "Untitled"}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(post.scheduledAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Calendar View ───────────────────────────────────────────────────────────
function CalendarView({ posts, setView, setEditingPost }) {
  const [calDate, setCalDate] = useState(new Date());
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const days = getMonthDays(year, month);
  const today = new Date();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const getPostsForDay = (d) => {
    if (d.other) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
    return posts.filter(p => {
      const pDate = p.scheduledAt || p.publishedAt || p.createdAt;
      return pDate && pDate.startsWith(dateStr);
    });
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>📅 Content Calendar</h2>
            <p>Plan and visualize your content schedule at a glance.</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingPost(null); setView("editor"); }}>
            <Icon name="add" /> New Post
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setCalDate(new Date(year, month - 1))}>← Prev</button>
          <h3 style={{ fontFamily: "'Lora', serif", fontSize: 20, color: "var(--sprout-green)" }}>
            {monthNames[month]} {year}
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setCalDate(new Date(year, month + 1))}>Next →</button>
        </div>

        <div className="cal-grid">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="cal-day-hdr">{d}</div>
          ))}
          {days.map((d, i) => {
            const dayPosts = getPostsForDay(d);
            const isToday = !d.other && d.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <div key={i} className={`cal-cell ${d.other ? "other" : ""} ${isToday ? "today" : ""}`}
                onClick={() => { if (!d.other) { setEditingPost(null); setView("editor"); } }}>
                <div className={`cal-date-num ${isToday ? "today" : ""}`}>{d.day}</div>
                {dayPosts.slice(0, 3).map(p => (
                  <div key={p.id} className={`cal-chip ${p.status}`}
                    onClick={(e) => { e.stopPropagation(); setEditingPost(p.id); setView("editor"); }}
                    title={p.title || p.caption?.slice(0, 40)}>
                    {truncate(p.title || p.caption, 16)}
                  </div>
                ))}
                {dayPosts.length > 3 && (
                  <div style={{ fontSize: 10, color: "var(--text-muted)", paddingLeft: 4 }}>+{dayPosts.length - 3} more</div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
          {Object.entries(POST_STATUSES).map(([key, val]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <span className={`tag ${val.cls}`} style={{ fontSize: 10, padding: "1px 6px" }}>{val.icon}</span>
              <span style={{ color: "var(--text-muted)" }}>{val.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Editor View ─────────────────────────────────────────────────────────────
function EditorView({ post, addPost, updatePost, deletePost, showToast, setView, setEditingPost, onPublish, publishingId }) {
  const [form, setForm] = useState({
    title: "", caption: "", contentType: "post", category: "community",
    scheduledAt: "", hashtags: [...BRAND_VOICE.brandHashtags], imageData: null,
    imageUrl: "", status: "draft",
    ...(post || {}),
  });
  const [dragActive, setDragActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const isEditing = !!post;

  useEffect(() => {
    if (post) setForm({
      title: "", caption: "", contentType: "post", category: "community",
      scheduledAt: "", hashtags: [...BRAND_VOICE.brandHashtags], imageData: null,
      imageUrl: "", status: "draft", ...post
    });
  }, [post?.id]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 8 * 1024 * 1024) { showToast("Image must be under 8MB"); return; }
    const reader = new FileReader();
    reader.onload = (e) => update("imageData", e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragActive(false); handleImageUpload(e.dataTransfer.files[0]); };
  const handleFileInput = (e) => handleImageUpload(e.target.files[0]);

  const saveDraft = async () => {
    if (!form.caption.trim() && !form.title.trim()) { showToast("Add a title or caption first"); return; }
    if (isEditing) {
      await updatePost(post.id, { ...form, status: form.status === "published" ? "published" : "draft" });
      showToast("Post updated!");
    } else {
      const newPost = await addPost({ ...form, status: "draft" });
      if (newPost) setEditingPost(newPost.id);
    }
  };

  const submitForReview = async () => {
    if (!form.caption.trim()) { showToast("Caption is required"); return; }
    if (isEditing) {
      await updatePost(post.id, { ...form, status: "pending_review" });
      showToast("Submitted for review!");
    } else {
      await addPost({ ...form, status: "pending_review" });
    }
    setView("approvals");
  };

  const publishNow = () => {
  if (form.status !== "approved") return;
  if (!form.imageUrl?.trim()) { showToast("Add a public image URL before publishing"); return; }
  setShowConfirm(true);
};

  const confirmPublish = async () => {
    setShowConfirm(false);
    await onPublish({ ...post, ...form });
    setView("allPosts");
  };

  const captionLen = (form.caption || "").length;
  const captionClass = captionLen > 2200 ? "over" : captionLen > 2000 ? "warn" : "";

  const [hashInput, setHashInput] = useState("");
  const addHashtag = () => {
    const tag = hashInput.trim().startsWith("#") ? hashInput.trim() : `#${hashInput.trim()}`;
    if (tag.length > 1 && !(form.hashtags || []).includes(tag)) {
      update("hashtags", [...(form.hashtags || []), tag]);
    }
    setHashInput("");
  };
  const removeHashtag = (tag) => update("hashtags", (form.hashtags || []).filter(t => t !== tag));

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary btn-sm" onClick={() => setView("allPosts")} style={{ marginBottom: 12 }}>
          <Icon name="back" /> Back to Posts
        </button>
        <h2>{isEditing ? "✏️ Edit Post" : "📝 New Post"}</h2>
        <p>{isEditing ? `Editing: ${post.title || "Untitled"}` : "Create a new Instagram post with live preview."}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "flex-start" }}>
        <div>
          <div className="card">
            <div className="form-group">
              <label className="form-label">Post Title</label>
              <input className="form-input" value={form.title} onChange={e => update("title", e.target.value)}
                placeholder="e.g. Mother's Day Event Announcement" />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Content Type</label>
                <select className="form-select" value={form.contentType} onChange={e => update("contentType", e.target.value)}>
                  {CONTENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => update("category", e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Caption *</label>
              <textarea className="form-textarea" style={{ minHeight: 140, lineHeight: 1.7 }}
                value={form.caption} onChange={e => update("caption", e.target.value)}
                placeholder="Write your Instagram caption here... Remember to end with a question!" />
              <div className={`char-count ${captionClass}`}>{captionLen} / 2,200 characters</div>
            </div>

            <div className="form-group">
              <label className="form-label">Hashtags</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                {(form.hashtags || []).map(tag => (
                  <span key={tag} className="hashtag-chip">
                    {tag}
                    <button onClick={() => removeHashtag(tag)} style={{
                      background: "none", border: "none", cursor: "pointer", marginLeft: 4,
                      fontSize: 12, color: "var(--sprout-bark)", opacity: 0.5
                    }}>✕</button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-input" value={hashInput} onChange={e => setHashInput(e.target.value)}
                  placeholder="Add hashtag..." onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                  style={{ flex: 1 }} />
                <button className="btn btn-secondary btn-sm" onClick={addHashtag}>Add</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preview Image (local, optional)</label>
              {form.imageData ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src={form.imageData} alt="Post" style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 12, border: "1px solid var(--border)" }} />
                  <button onClick={() => update("imageData", null)} style={{
                    position: "absolute", top: 8, right: 8, background: "#fff", border: "1px solid var(--border)",
                    borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>✕</button>
                </div>
              ) : (
                <div className={`upload-zone ${dragActive ? "active" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("post-image-input").click()}>
                  <input id="post-image-input" type="file" style={{ display: "none" }} accept="image/*" onChange={handleFileInput} />
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🖼️</div>
                  <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>Drop image here or click to browse</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>JPG, PNG, WebP — max 8MB · for preview only</p>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Image URL <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(required to publish to Instagram)</span>
              </label>
              <input className="form-input" value={form.imageUrl || ""} onChange={e => update("imageUrl", e.target.value)}
                placeholder="https://... (direct public URL — no query params)" />
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                Must be a publicly accessible URL. CDN links and Supabase Storage URLs work. Signed/expiring URLs do not.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Scheduled Date/Time (optional)</label>
              <input className="form-input" type="datetime-local" value={form.scheduledAt || ""} onChange={e => update("scheduledAt", e.target.value)} />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
              <button className="btn btn-secondary" onClick={saveDraft}><Icon name="save" /> Save Draft</button>
              <button className="btn btn-primary" onClick={submitForReview}><Icon name="send" /> Submit for Review</button>
              {form.status === "approved" && (
                <button className="btn btn-outline" onClick={publishNow}
                  disabled={publishingId === post?.id}
                  style={{ borderColor: "var(--sprout-coral)", color: "var(--sprout-coral)" }}>
                  {publishingId === post?.id ? "⏳ Publishing…" : "🚀 Publish Now"}
                </button>
              )}
              {isEditing && (
                <button className="btn btn-danger btn-sm" onClick={async () => { await deletePost(post.id); setView("allPosts"); }} style={{ marginLeft: "auto" }}>
                  <Icon name="trash" size={13} /> Delete
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 16 }}>
            <h4 style={{ fontFamily: "'Lora', serif", fontSize: 14, color: "var(--sprout-green)", marginBottom: 12 }}>📱 Instagram Preview</h4>
            <div className="ig-mock">
              <div className="ig-hdr">
                <div className="ig-avatar">🌱</div>
                <div>
                  <div className="ig-uname">sproutsocietyorg</div>
                  <div className="ig-loc">Brooklyn, NY</div>
                </div>
              </div>
              <div className="ig-img">
                {form.imageData ? <img src={form.imageData} alt="Preview" /> : form.imageUrl ? <img src={form.imageUrl} alt="Preview" onError={e => { e.target.style.display = 'none'; }} /> : "📷"}
              </div>
              <div className="ig-acts">
                <div className="ig-acts-left">
                  <span className="ig-icon">♡</span>
                  <span className="ig-icon">💬</span>
                  <span className="ig-icon">📤</span>
                </div>
                <span className="ig-icon">🔖</span>
              </div>
              <div className="ig-likes">0 likes</div>
              <div className="ig-caption">
                <span className="ig-uname-inline">sproutsocietyorg</span>
                {form.caption || "Your caption will appear here..."}
              </div>
              {(form.hashtags || []).length > 0 && (
                <div style={{ padding: "0 12px 8px", fontSize: 11, color: "#00376b" }}>
                  {(form.hashtags || []).join(" ")}
                </div>
              )}
              <div className="ig-time">{form.scheduledAt ? formatDate(form.scheduledAt) : "Just now"}</div>
            </div>
          </div>

          <div className="brand-sidebar" style={{ marginTop: 16 }}>
            <h4>🎨 Brand Voice Guide</h4>
            <div className="brand-rule">
              <div className="rule-label">Tone</div>
              <div>{BRAND_VOICE.tone}</div>
            </div>
            <div className="brand-rule">
              <div className="rule-label">Approved Emojis</div>
              <div>{BRAND_VOICE.emojis}</div>
            </div>
            <div className="brand-rule">
              <div className="rule-label">CTA Reminder</div>
              <div>{BRAND_VOICE.cta}</div>
            </div>
            <div className="brand-rule">
              <div className="rule-label">Never Say</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {BRAND_VOICE.weNeverSay.map(w => (
                  <span key={w} className="tag tag-red" style={{ fontSize: 10, padding: "1px 6px" }}>✕ {w}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-card" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
            <h3 style={{ fontFamily: "'Lora', serif", color: "var(--sprout-green)", marginBottom: 8 }}>Publish to Instagram?</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
              This will post "{form.title || "Untitled"}" to @sproutsocietyorg. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmPublish} style={{ background: "var(--sprout-coral)", color: "#fff" }}>
                🚀 Confirm Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── All Posts View ──────────────────────────────────────────────────────────
function AllPostsView({ posts, setView, setEditingPost, deletePost, updatePost }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = posts
    .filter(p => filter === "all" || p.status === filter)
    .filter(p => !search || (p.title || "").toLowerCase().includes(search.toLowerCase()) || (p.caption || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>📋 All Posts</h2>
            <p>Manage all your content in one place.</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingPost(null); setView("editor"); }}>
            <Icon name="add" /> New Post
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div className="tabs" style={{ marginBottom: 0 }}>
          <div className={`tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All ({posts.length})</div>
          {Object.entries(POST_STATUSES).map(([key, val]) => {
            const count = posts.filter(p => p.status === key).length;
            return <div key={key} className={`tab ${filter === key ? "active" : ""}`} onClick={() => setFilter(key)}>{val.icon} {val.label} ({count})</div>;
          })}
        </div>
        <input className="form-input" style={{ width: 240, padding: "6px 12px", fontSize: 13 }}
          placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>{posts.length === 0 ? "No posts yet" : "No matching posts"}</h3>
          <p>{posts.length === 0 ? "Create your first post to get started!" : "Try a different filter."}</p>
        </div>
      ) : (
        filtered.map(post => (
          <div key={post.id} className="post-card" onClick={() => { setEditingPost(post.id); setView("editor"); }}>
            <div className="post-thumb">📷</div>
            <div className="post-info">
              <h4>{post.title || "Untitled"}</h4>
              <div className="caption-preview">{truncate(post.caption, 80)}</div>
              <div className="post-meta">
                {statusBadge(post.status)}
                <span className="tag tag-gray" style={{ fontSize: 10 }}>{CONTENT_TYPES.find(t => t.id === post.contentType)?.icon} {post.contentType}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(post.updatedAt)}</span>
                {post.status === "published" && (
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>❤️ {post.likes || 0} · 💬 {post.comments || 0}</span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Approvals View ──────────────────────────────────────────────────────────
function ApprovalsView({ posts, updatePost, showToast, setView, setEditingPost, onPublish, publishingId }) {
  const [feedback, setFeedback] = useState({});
  const pending = posts.filter(p => p.status === "pending_review").sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const recentApproved = posts.filter(p => p.status === "approved").sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  const approve = async (id) => {
    await updatePost(id, { status: "approved", approvedAt: new Date().toISOString(), feedback: feedback[id] || "" });
    showToast("Post approved! ✅");
  };

  const requestChanges = async (id) => {
    if (!feedback[id]?.trim()) { showToast("Add feedback before requesting changes"); return; }
    await updatePost(id, { status: "draft", feedback: feedback[id] });
    showToast("Sent back for changes");
  };

  return (
    <div>
      <div className="page-header">
        <h2>✅ Approvals</h2>
        <p>Review pending posts and approve or request changes before publishing.</p>
      </div>

      {pending.length === 0 ? (
        <div className="empty-state">
          <div className="icon">✅</div>
          <h3>All caught up!</h3>
          <p>No posts pending review.</p>
        </div>
      ) : (
        pending.map(post => (
          <div key={post.id} className="appr-card">
            <div style={{ width: 80, height: 80, borderRadius: 10, background: "#f0f0f0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
              📷
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <h4 style={{ fontFamily: "'Lora', serif", fontSize: 16, marginBottom: 4 }}>{post.title || "Untitled"}</h4>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className="tag tag-gray" style={{ fontSize: 10 }}>{CONTENT_TYPES.find(t => t.id === post.contentType)?.icon} {post.contentType}</span>
                    <span className="tag tag-gray" style={{ fontSize: 10 }}>{CATEGORIES.find(c => c.id === post.category)?.label}</span>
                    {post.scheduledAt && <span className="tag tag-pink" style={{ fontSize: 10 }}>📅 {formatDate(post.scheduledAt)}</span>}
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => { setEditingPost(post.id); setView("editor"); }}>
                  View Full Post
                </button>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>{truncate(post.caption, 200)}</p>
              {(post.hashtags || []).length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  {post.hashtags.map(tag => <span key={tag} className="hashtag-chip" style={{ fontSize: 10 }}>{tag}</span>)}
                </div>
              )}
              <div className="form-group" style={{ marginBottom: 10 }}>
                <textarea className="form-textarea" style={{ minHeight: 50, fontSize: 13 }}
                  placeholder="Add feedback or notes (optional)..."
                  value={feedback[post.id] || ""} onChange={e => setFeedback(f => ({ ...f, [post.id]: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={() => approve(post.id)}>✅ Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => requestChanges(post.id)}>↩️ Request Changes</button>
              </div>
            </div>
          </div>
        ))
      )}

      {recentApproved.length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3 className="section-title">🟢 Recently Approved (Ready to Publish)</h3>
          {recentApproved.map(post => (
            <div key={post.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{post.title || "Untitled"}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Approved {formatDate(post.approvedAt)}</div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                disabled={publishingId === post.id}
                onClick={() => onPublish(post)}
                style={{ background: "var(--sprout-coral)", borderColor: "var(--sprout-coral)" }}>
                {publishingId === post.id ? "⏳ Publishing…" : "📤 Publish to Instagram"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Analytics View ──────────────────────────────────────────────────────────
function AnalyticsView({ posts }) {
  const published = posts.filter(p => p.status === "published").sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const totalLikes = published.reduce((s, p) => s + (p.likes || 0), 0);
  const totalComments = published.reduce((s, p) => s + (p.comments || 0), 0);
  const totalReach = published.reduce((s, p) => s + (p.reach || 0), 0);
  const totalSaves = published.reduce((s, p) => s + (p.saves || 0), 0);
  const avgEngagement = published.length > 0 ? Math.round((totalLikes + totalComments) / published.length) : 0;
  const bestPost = published.length > 0 ? published.reduce((best, p) => ((p.likes || 0) + (p.comments || 0)) > ((best.likes || 0) + (best.comments || 0)) ? p : best, published[0]) : null;
  const maxEng = published.length > 0 ? Math.max(...published.map(p => (p.likes || 0) + (p.comments || 0))) : 1;

  return (
    <div>
      <div className="page-header">
        <h2>📊 Analytics</h2>
        <p>Track your content performance. Data updates after posts are published.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Reach</div>
          <div className="value">{totalReach.toLocaleString()}</div>
          <div className="sub">{published.length} posts</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Likes</div>
          <div className="value">{totalLikes.toLocaleString()}</div>
          <div className="sub">❤️ across all posts</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Comments</div>
          <div className="value">{totalComments.toLocaleString()}</div>
          <div className="sub">💬 conversations started</div>
        </div>
        <div className="stat-card">
          <div className="label">Avg. Engagement</div>
          <div className="value">{avgEngagement}</div>
          <div className="sub">per post (likes + comments)</div>
        </div>
      </div>

      {published.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📊</div>
          <h3>No published posts yet</h3>
          <p>Analytics will appear here once you publish content to Instagram.</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="section-title">📈 Engagement by Post</h3>
            <div className="bar-wrap">
              {published.slice(0, 12).reverse().map(p => {
                const eng = (p.likes || 0) + (p.comments || 0);
                const height = maxEng > 0 ? Math.max((eng / maxEng) * 100, 4) : 4;
                return (
                  <div key={p.id} className="bar-col" title={`${p.title || "Post"}: ${eng} engagement`}>
                    <div className="bar-fill" style={{ height: `${height}%`, background: "var(--sprout-sage)" }} />
                    <div className="bar-lbl">{truncate(p.title || "Post", 8)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {bestPost && (
            <div className="card" style={{ marginBottom: 20, borderColor: "var(--sprout-sage)", borderWidth: 2 }}>
              <h3 className="section-title">🏆 Best Performing Post</h3>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 10, background: "#f0f0f0", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  📷
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Lora', serif", fontSize: 16 }}>{bestPost.title || "Untitled"}</h4>
                  <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 13 }}>
                    <span>❤️ {bestPost.likes}</span>
                    <span>💬 {bestPost.comments}</span>
                    <span>👁️ {bestPost.reach}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="section-title">📋 Post Performance</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Post</th>
                    <th>Published</th>
                    <th>❤️ Likes</th>
                    <th>💬 Comments</th>
                    <th>👁️ Reach</th>
                  </tr>
                </thead>
                <tbody>
                  {published.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.title || "Untitled"}
                      </td>
                      <td>{formatDate(p.publishedAt)}</td>
                      <td>{(p.likes || 0).toLocaleString()}</td>
                      <td>{(p.comments || 0).toLocaleString()}</td>
                      <td>{(p.reach || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Brand Voice View ────────────────────────────────────────────────────────
function BrandVoiceView() {
  return (
    <div>
      <div className="page-header">
        <h2>🎨 Brand Voice Guide</h2>
        <p>Reference guide for consistent, on-brand content.</p>
      </div>

      <div className="two-col">
        <div className="card">
          <h3 className="section-title">🗣️ Voice & Tone</h3>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: 12, textTransform: "uppercase", marginBottom: 4 }}>Tone</div>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>{BRAND_VOICE.tone}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: 12, textTransform: "uppercase", marginBottom: 4 }}>Sentence Style</div>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>{BRAND_VOICE.sentenceStyle}</p>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: 12, textTransform: "uppercase", marginBottom: 4 }}>Vocabulary</div>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>{BRAND_VOICE.vocabulary}</p>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">📝 Content Rules</h3>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: 12, textTransform: "uppercase", marginBottom: 4 }}>Emoji Usage</div>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>{BRAND_VOICE.emojis}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: 12, textTransform: "uppercase", marginBottom: 4 }}>Hashtag Strategy</div>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>{BRAND_VOICE.hashtags}</p>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: 12, textTransform: "uppercase", marginBottom: 4 }}>Call to Action</div>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>{BRAND_VOICE.cta}</p>
          </div>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: 0 }}>
        <div className="card">
          <h3 className="section-title">✅ We Say</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {BRAND_VOICE.weSay.map(w => <span key={w} className="tag tag-green">{w}</span>)}
          </div>
        </div>
        <div className="card">
          <h3 className="section-title">🚫 We Never Say</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {BRAND_VOICE.weNeverSay.map(w => <span key={w} className="tag tag-red">✕ {w}</span>)}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">#️⃣ Brand Hashtags</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {BRAND_VOICE.brandHashtags.map(tag => <span key={tag} className="hashtag-chip" style={{ fontSize: 13 }}>{tag}</span>)}
        </div>
      </div>
    </div>
  );
}

// ─── AI Chat Overlay ─────────────────────────────────────────────────────────
function AIChatOverlay({ posts, showToast }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I'm your Sprout Society content assistant 🌱\n\nI can help you brainstorm captions, plan content, suggest hashtags, review your writing against brand guidelines, and more.\n\nWhat are we working on today?",
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endDiv = useRef(null);

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

    const postContext = posts.length > 0
      ? `CURRENT POSTS (${posts.length}): ${posts.slice(0, 10).map(p => `"${p.title || "Untitled"}" — status: ${p.status}, type: ${p.contentType}, caption: "${(p.caption || "").slice(0, 80)}"`).join("; ")}`
      : "No posts created yet.";

    const publishedContext = posts.filter(p => p.status === "published").length > 0
      ? `PUBLISHED POSTS (${posts.filter(p => p.status === "published").length}): ${posts.filter(p => p.status === "published").slice(0, 5).map(p => `"${p.title}" — likes: ${p.likes || 0}, comments: ${p.comments || 0}, reach: ${p.reach || 0}`).join("; ")}`
      : "No published posts yet.";

    const systemPrompt = `You are a social media content strategist for Sprout Society — a peer mental wellness nonprofit in Brooklyn, NY. You help create engaging Instagram content that builds community and destigmatizes mental health support.

ORGANIZATION:
- Name: Sprout Society | Location: Brooklyn, NY
- Mission: Build community and foster connection for mental wellness. Nobody should go through it alone.
- Programs: Empathetic Strangers (1:1 peer connection), Peer Support Groups, Connect to Learn (expert-led sessions)
- Instagram: @sproutsocietyorg

BRAND VOICE RULES (ALWAYS FOLLOW):
- Tone: ${BRAND_VOICE.tone}
- Style: ${BRAND_VOICE.sentenceStyle}
- Vocabulary: ${BRAND_VOICE.vocabulary}
- Emojis: ${BRAND_VOICE.emojis}
- Hashtags: ${BRAND_VOICE.hashtags}
- CTA: ${BRAND_VOICE.cta}
- We say: ${BRAND_VOICE.weSay.join(", ")}
- We NEVER say: ${BRAND_VOICE.weNeverSay.join(", ")}

WORKSPACE DATA:
${postContext}
${publishedContext}

YOUR CAPABILITIES:
1. **Caption Writing** — Draft, iterate, and polish Instagram captions in brand voice
2. **Content Strategy** — Recommend topics, themes, posting schedules, content mix
3. **Hashtag Research** — Suggest relevant hashtags mixing branded + discovery tags
4. **Brand Validation** — Check captions against brand guidelines, flag issues
5. **Post Ideas** — Generate content concepts based on programs, events, community themes
6. **Engagement Tips** — Advise on best practices for growing Instagram engagement

Always write captions in Sprout Society's warm, inclusive voice. End captions with an engaging question. Keep responses actionable and specific. Use **bold** for emphasis.`;

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => showToast("Copied to clipboard!")).catch(() => {});
  };

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
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-avatar">🌱</div>
            <div style={{ marginLeft: 10 }}>
              <h4>Content Assistant</h4>
              <p>Sprout Society · Powered by AI</p>
            </div>
            <button className="chat-header-close" onClick={() => setOpen(false)}>✕</button>
          </div>

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
                      onClick={() => copyToClipboard(m.content)}>
                      📋 Copy
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
            <div ref={endDiv} />
          </div>

          <div className="chat-suggestions-scroll">
            {CHAT_SUGGESTIONS.map((s, i) => (
              <button key={i} className="chat-suggestion-chip" onClick={() => sendMessage(s.prompt)}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <div className="chat-input-row">
            <textarea className="chat-input" placeholder="Ask about captions, hashtags, strategy…"
              value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} rows={1} />
            <button className="chat-send" onClick={() => sendMessage()} disabled={!input.trim() || typing}>➤</button>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 14px 10px" }}>
            <span className="chat-clear" onClick={() => setMessages([{ role: "assistant", content: "Chat cleared! What content can I help with? 🌱" }])}>
              Clear chat
            </span>
          </div>
        </div>
      )}

      <button className="chat-fab" onClick={() => setOpen(!open)} title="Content Assistant">
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
