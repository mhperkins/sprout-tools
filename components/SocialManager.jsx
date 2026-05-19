import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ── Styles (matches CRM design system) ────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:      #030000;
    --white:      #F7F7F6;
    --cyan:       #73C4D6;
    --fuchsia:    #E10098;
    --acid:       #C6C902;
    --banana:     #FAD100;
    --cyan-lt:    #C7E7EF;
    --acid-lt:    #E9E99A;
    --fuchsia-lt: #FFCDF0;
    --banana-lt:  #FEF4C1;
    --g50:  #F9FAFB;
    --g100: #F3F4F6;
    --g200: #E5E7EB;
    --g300: #D1D5DB;
    --g400: #9CA3AF;
    --g600: #4B5563;
    --g800: #1F2937;
    --sh-sm: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --sh:    0 4px 14px rgba(0,0,0,0.08);
    --sh-lg: 0 12px 40px rgba(0,0,0,0.13);
  }

  body { font-family: 'Lato', sans-serif; background: var(--white); color: var(--black); line-height: 1.5; }
  .app { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sb { width: 220px; min-width: 220px; background: var(--black); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; overflow-y: auto; z-index: 100; }
  .sb-brand { padding: 20px 18px 16px; border-bottom: 1px solid rgba(247,247,246,0.07); }
  .sb-name { font-size: 11px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; color: var(--white); }
  .sb-sub  { font-size: 9px; color: var(--cyan); margin-top: 3px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700; }
  .sb-nav  { padding: 10px; flex: 1; }
  .sb-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 6px; cursor: pointer; color: rgba(247,247,246,0.5); font-size: 12px; font-weight: 700; transition: all 0.12s; margin-bottom: 1px; }
  .sb-item:hover { background: rgba(247,247,246,0.07); color: var(--white); }
  .sb-item.on { background: var(--cyan); color: var(--black); }
  .sb-badge { margin-left: auto; background: var(--fuchsia); color: #fff; border-radius: 10px; padding: 1px 6px; font-size: 9px; font-weight: 900; min-width: 18px; text-align: center; }
  .sb-item.on .sb-badge { background: var(--black); color: var(--white); }
  .sb-foot { padding: 12px 18px 16px; border-top: 1px solid rgba(247,247,246,0.06); margin-top: auto; }
  .sb-foot-txt { font-size: 8px; color: rgba(247,247,246,0.18); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; line-height: 1.7; margin-bottom: 8px; }
  .sb-log-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 7px 10px; border-radius: 6px; border: 1px solid rgba(247,247,246,0.12); background: transparent; color: rgba(247,247,246,0.45); font-size: 10px; font-weight: 700; font-family: 'Lato', sans-serif; cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase; transition: all 0.12s; }
  .sb-log-btn:hover { background: rgba(247,247,246,0.07); color: var(--white); border-color: rgba(247,247,246,0.25); }
  .sb-back { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 6px; cursor: pointer; color: rgba(247,247,246,0.35); font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.12s; margin: 4px 10px; }
  .sb-back:hover { color: rgba(247,247,246,0.7); background: rgba(247,247,246,0.05); }

  /* Main */
  .main { margin-left: 220px; flex: 1; }
  .page { padding: 30px 32px; max-width: 1100px; }
  .pg-hd { margin-bottom: 24px; display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
  .pg-ttl { font-size: 23px; font-weight: 900; letter-spacing: -0.01em; }
  .pg-sub { font-size: 12px; color: var(--g600); margin-top: 3px; }

  /* Stats */
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 22px; }
  .stat { background: #fff; border-radius: 10px; padding: 15px 17px; border: 1.5px solid var(--g200); }
  .stat-lbl { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--g400); margin-bottom: 5px; }
  .stat-val { font-size: 25px; font-weight: 900; color: var(--black); }
  .stat-meta { font-size: 11px; color: var(--g600); margin-top: 2px; }

  /* Cards */
  .card { background: #fff; border-radius: 11px; border: 1.5px solid var(--g200); margin-bottom: 12px; box-shadow: var(--sh-sm); }
  .card-hd { padding: 13px 17px; border-bottom: 1px solid var(--g100); display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .card-ttl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--g600); }
  .card-bd { padding: 15px 17px; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; gap: 5px; padding: 8px 14px; border-radius: 7px; border: none; cursor: pointer; font-size: 12px; font-weight: 700; font-family: 'Lato', sans-serif; transition: all 0.12s; letter-spacing: 0.02em; white-space: nowrap; }
  .btn-blk { background: var(--black); color: var(--white); }
  .btn-blk:hover { background: var(--g800); transform: translateY(-1px); }
  .btn-blk:disabled { background: var(--g400); cursor: not-allowed; transform: none; }
  .btn-cyan { background: var(--cyan); color: var(--black); }
  .btn-cyan:hover { filter: brightness(1.07); }
  .btn-cyan:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-acid { background: var(--acid); color: var(--black); }
  .btn-acid:hover { filter: brightness(1.07); }
  .btn-acid:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: var(--g600); border: 1.5px solid var(--g200); }
  .btn-ghost:hover { border-color: var(--g400); color: var(--black); }
  .btn-danger { background: #FEE2E2; color: #B91C1C; }
  .btn-danger:hover { background: #FECACA; }
  .btn-sm { padding: 5px 10px; font-size: 11px; border-radius: 5px; }

  /* Forms */
  .fg { margin-bottom: 13px; }
  .fl { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--g600); margin-bottom: 4px; }
  .fi, .fs, .fta { width: 100%; padding: 8px 11px; border: 1.5px solid var(--g200); border-radius: 6px; font-size: 13px; font-family: 'Lato', sans-serif; color: var(--black); background: #fff; outline: none; transition: border-color 0.12s; }
  .fi:focus, .fs:focus, .fta:focus { border-color: var(--cyan); box-shadow: 0 0 0 2px rgba(115,196,214,0.15); }
  .fta { resize: vertical; min-height: 100px; line-height: 1.6; }
  .frow { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }

  /* Tabs */
  .tabs { display: flex; border-bottom: 2px solid var(--g200); margin-bottom: 18px; gap: 1px; }
  .tab { padding: 8px 14px; border: none; background: transparent; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--g400); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; font-family: 'Lato', sans-serif; transition: all 0.12s; }
  .tab:hover { color: var(--black); }
  .tab.on { color: var(--black); border-bottom-color: var(--cyan); }
  .tab-count { display: inline-block; background: var(--g200); color: var(--g600); border-radius: 8px; padding: 0 5px; font-size: 9px; margin-left: 3px; }
  .tab.on .tab-count { background: var(--cyan); color: var(--black); }

  /* Status badges */
  .tag { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px; font-size: 9px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; }
  .tag-draft            { background: var(--banana-lt); color: #7a5c00; }
  .tag-pending_approval { background: var(--fuchsia-lt); color: #8b005c; }
  .tag-approved         { background: var(--acid-lt); color: #3a3d00; }
  .tag-scheduled        { background: var(--cyan-lt); color: #155e6e; }
  .tag-published        { background: var(--g100); color: var(--g600); }
  .tag-failed           { background: #FEE2E2; color: #B91C1C; }
  .tag-image            { background: var(--cyan-lt); color: #155e6e; }
  .tag-video            { background: var(--fuchsia-lt); color: #8b005c; }
  .tag-carousel         { background: var(--acid-lt); color: #3a3d00; }

  /* Post card */
  .post-card { background: #fff; border: 1.5px solid var(--g200); border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; box-shadow: var(--sh-sm); }
  .post-card-hd { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; gap: 10px; }
  .post-caption { font-size: 13px; color: var(--black); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px; }
  .post-meta { display: flex; align-items: center; gap: 12px; font-size: 11px; color: var(--g400); flex-wrap: wrap; }
  .post-actions { display: flex; gap: 6px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--g100); flex-wrap: wrap; }
  .media-thumb { width: 52px; height: 52px; border-radius: 7px; object-fit: cover; border: 1px solid var(--g200); flex-shrink: 0; }
  .approval-card { border-left: 3px solid var(--fuchsia); }

  /* Section label */
  .sect-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--g600); margin-bottom: 12px; }

  /* Toast */
  .toast { position: fixed; bottom: 22px; right: 22px; padding: 11px 17px; border-radius: 8px; font-size: 13px; font-weight: 700; z-index: 9999; box-shadow: var(--sh-lg); animation: sUp 0.22s ease; }
  .t-ok  { background: var(--black); color: var(--white); }
  .t-err { background: #B91C1C; color: #fff; }
  @keyframes sUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* Empty state */
  .empty { text-align: center; padding: 52px 20px; }
  .empty-ico { font-size: 34px; margin-bottom: 12px; }
  .empty-ttl { font-size: 15px; font-weight: 900; color: var(--g600); margin-bottom: 6px; }
  .empty-txt { font-size: 12px; color: var(--g400); max-width: 280px; margin: 0 auto; line-height: 1.6; }

  /* Calendar */
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
  .cal-day-hdr { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--g400); text-align: center; padding: 5px 0; }
  .cal-cell { min-height: 100px; border: 1.5px solid var(--g200); border-radius: 7px; padding: 6px 7px; cursor: pointer; background: #fff; transition: border-color 0.12s; }
  .cal-cell:hover { border-color: var(--cyan); }
  .cal-cell.today { border-color: var(--cyan); background: rgba(115,196,214,0.05); }
  .cal-cell.other-month { background: var(--g50); opacity: 0.5; cursor: default; pointer-events: none; }
  .cal-date-num { font-size: 11px; font-weight: 700; color: var(--g600); margin-bottom: 3px; }
  .cal-date-num.today { color: var(--cyan); }
  .cal-chip { font-size: 9px; font-weight: 700; padding: 2px 5px; border-radius: 3px; margin-bottom: 2px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 100%; cursor: pointer; display: block; }
  .cal-chip-event { background: var(--acid-lt); color: #3a3d00; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: var(--g300); border-radius: 5px; }
`;

// ── Constants ──────────────────────────────────────────────────────────────────
const STATUS_FLOW = {
  draft: 'pending_approval',
  pending_approval: 'approved',
  approved: 'scheduled',
  scheduled: 'published',
};

const STATUS_LABELS = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  failed: 'Failed',
};

const STATUS_ACTIONS = {
  draft: 'Submit for Approval',
  pending_approval: 'Approve',
  approved: 'Mark Scheduled',
  scheduled: 'Publish to Instagram',
};

// ── DB Helpers ─────────────────────────────────────────────────────────────────

// Columns that may not exist in older table schemas — stripped on schema errors
const OPTIONAL_COLS = ['media_url', 'media_type', 'hashtags', 'canva_design_id', 'notes', 'platform', 'approved_by', 'approved_at', 'instagram_post_id', 'published_at'];

const isSchemaMiss = (err) => err?.message?.includes('schema cache') || err?.code === '42703';

const stripOptional = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !OPTIONAL_COLS.includes(k)));

const dbGetPosts = async () => {
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

const dbCreatePost = async (post) => {
  const { data: { user } } = await supabase.auth.getUser();
  const payload = { ...post, user_id: user?.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from('social_posts').insert([payload]).select().single();
  if (error) {
    if (isSchemaMiss(error)) {
      const { data: d2, error: e2 } = await supabase.from('social_posts').insert([stripOptional(payload)]).select().single();
      if (e2) throw e2;
      return d2;
    }
    throw error;
  }
  return data;
};

const dbUpdatePost = async (id, updates) => {
  const payload = { ...updates, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from('social_posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    if (isSchemaMiss(error)) {
      const { data: d2, error: e2 } = await supabase.from('social_posts').update(stripOptional(payload)).eq('id', id).select().single();
      if (e2) throw e2;
      return d2;
    }
    throw error;
  }
  return data;
};

const dbDeletePost = async (id) => {
  const { error } = await supabase.from('social_posts').delete().eq('id', id);
  if (error) throw error;
};

const dbUpdateStatus = async (id, status, extra = {}) =>
  dbUpdatePost(id, { status, ...extra });

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast ${type === 'error' ? 't-err' : 't-ok'}`}>{message}</div>;
}

// ── StatusTag ──────────────────────────────────────────────────────────────────
function StatusTag({ status }) {
  return <span className={`tag tag-${status}`}>{STATUS_LABELS[status] || status}</span>;
}

// ── PostCard ───────────────────────────────────────────────────────────────────
function PostCard({ post, onAdvance, onDelete, onEdit, advancing }) {
  const canAdvance = !!STATUS_FLOW[post.status];
  const isPublishing = post.status === 'scheduled';

  return (
    <div className={`post-card ${post.status === 'pending_approval' ? 'approval-card' : ''}`}>
      <div className="post-card-hd">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {post.media_url && (
            <img
              src={post.media_url}
              alt=""
              className="media-thumb"
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
          <StatusTag status={post.status} />
        </div>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(post.id)}>✕</button>
      </div>

      <p className="post-caption">
        {post.caption || <em style={{ color: 'var(--g400)' }}>No caption</em>}
      </p>

      <div className="post-meta">
        <span>📅 {post.scheduled_at ? new Date(post.scheduled_at).toLocaleString() : 'Not scheduled'}</span>
        {post.media_type && <span>🖼 {post.media_type}</span>}
        {post.hashtags?.length > 0 && (
          <span>#{post.hashtags.slice(0, 3).join(' #')}{post.hashtags.length > 3 ? '…' : ''}</span>
        )}
        {post.approved_by && <span style={{ color: 'var(--g600)' }}>✓ {post.approved_by}</span>}
      </div>

      <div className="post-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(post)}>Edit</button>
        {canAdvance && (
          <button
            className={`btn btn-sm ${isPublishing ? 'btn-acid' : 'btn-cyan'}`}
            onClick={() => onAdvance(post)}
            disabled={advancing === post.id}
          >
            {advancing === post.id
              ? 'Working…'
              : (isPublishing ? '🚀 ' : '✓ ') + STATUS_ACTIONS[post.status]}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Dashboard View ─────────────────────────────────────────────────────────────
function DashboardView({ posts, onAdvance, onDelete, onEdit, advancing, onNavigate }) {
  const counts = {
    draft: posts.filter(p => p.status === 'draft').length,
    pending_approval: posts.filter(p => p.status === 'pending_approval').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    published: posts.filter(p => p.status === 'published').length,
  };

  const pendingApproval = posts.filter(p => p.status === 'pending_approval');
  const upcoming = posts
    .filter(p => p.status === 'scheduled' && p.scheduled_at)
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
    .slice(0, 5);

  return (
    <div className="page">
      <div className="pg-hd">
        <div>
          <div className="pg-ttl">Dashboard</div>
          <div className="pg-sub">Your content pipeline at a glance.</div>
        </div>
        <button className="btn btn-blk" onClick={() => onNavigate('create')}>+ New Post</button>
      </div>

      <div className="stats">
        {[
          { label: 'Drafts', value: counts.draft },
          { label: 'Pending Approval', value: counts.pending_approval },
          { label: 'Scheduled', value: counts.scheduled },
          { label: 'Published', value: counts.published },
        ].map(s => (
          <div key={s.label} className="stat">
            <div className="stat-lbl">{s.label}</div>
            <div className="stat-val">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Human-in-the-loop: pending approvals */}
      {pendingApproval.length > 0 && (
        <div className="card" style={{ borderLeft: '3px solid var(--fuchsia)' }}>
          <div className="card-hd">
            <div className="card-ttl">⏳ Needs Your Approval</div>
            <span className="tag tag-pending_approval">{pendingApproval.length} pending</span>
          </div>
          <div className="card-bd">
            {pendingApproval.map(post => (
              <PostCard key={post.id} post={post} onAdvance={onAdvance} onDelete={onDelete} onEdit={onEdit} advancing={advancing} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming scheduled */}
      <div className="card">
        <div className="card-hd">
          <div className="card-ttl">📅 Upcoming Scheduled</div>
        </div>
        <div className="card-bd">
          {upcoming.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--g400)', padding: '8px 0' }}>
              No scheduled posts.{' '}
              <span
                style={{ color: 'var(--cyan)', cursor: 'pointer', fontWeight: 700 }}
                onClick={() => onNavigate('create')}
              >
                Create one →
              </span>
            </div>
          ) : upcoming.map(post => (
            <PostCard key={post.id} post={post} onAdvance={onAdvance} onDelete={onDelete} onEdit={onEdit} advancing={advancing} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Queue View ─────────────────────────────────────────────────────────────────
const QUEUE_TABS = ['draft', 'pending_approval', 'approved', 'scheduled', 'published'];

function QueueView({ posts, onAdvance, onDelete, onEdit, advancing }) {
  const [activeTab, setActiveTab] = useState('draft');
  const visible = posts.filter(p => p.status === activeTab);

  return (
    <div className="page">
      <div className="pg-hd">
        <div>
          <div className="pg-ttl">Content Queue</div>
          <div className="pg-sub">Move posts through the approval pipeline.</div>
        </div>
      </div>

      <div className="tabs">
        {QUEUE_TABS.map(s => {
          const count = posts.filter(p => p.status === s).length;
          return (
            <button
              key={s}
              className={`tab ${activeTab === s ? 'on' : ''}`}
              onClick={() => setActiveTab(s)}
            >
              {STATUS_LABELS[s]}
              <span className="tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <div className="empty-ico">📭</div>
          <div className="empty-ttl">No {STATUS_LABELS[activeTab]} posts</div>
          <div className="empty-txt">Posts at this stage will appear here.</div>
        </div>
      ) : (
        visible.map(post => (
          <PostCard key={post.id} post={post} onAdvance={onAdvance} onDelete={onDelete} onEdit={onEdit} advancing={advancing} />
        ))
      )}
    </div>
  );
}

// ── Canva Media Picker ─────────────────────────────────────────────────────────
function CanvaMediaPicker({ mediaUrl, onUrlChange }) {
  const [tab, setTab] = useState('url');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useState(null);

  const uploadFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File must be under 10MB');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(data.path);
      onUrlChange(publicUrl);
      setTab('url');
    } catch (e) {
      setUploadError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onFileInput = (e) => uploadFile(e.target.files?.[0]);
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    uploadFile(e.dataTransfer.files?.[0]);
  };

  const TABS = [{ id: 'url', label: 'URL' }, { id: 'upload', label: '↑ Upload' }];

  return (
    <div className="fg">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <label className="fl" style={{ marginBottom: 0 }}>Media</label>
        <div style={{ display: 'flex', gap: 3 }}>
          {TABS.map(t => (
            <button key={t.id} type="button" onClick={() => { setTab(t.id); setUploadError(null); }}
              style={{ padding: '2px 10px', borderRadius: 4, border: '1.5px solid var(--g200)', background: tab === t.id ? 'var(--black)' : '#fff', color: tab === t.id ? '#fff' : 'var(--g600)', fontSize: 10, fontWeight: 700, fontFamily: 'Lato, sans-serif', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'url' && (
        <>
          <input className="fi" value={mediaUrl} onChange={e => onUrlChange(e.target.value)} placeholder="https://…" />
          {mediaUrl && (
            <img src={mediaUrl} alt="preview"
              style={{ marginTop: 8, maxHeight: 200, borderRadius: 8, border: '1.5px solid var(--g200)', display: 'block' }}
              onError={e => { e.target.style.display = 'none'; }} />
          )}
        </>
      )}

      {tab === 'upload' && (
        <div
          onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
          onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragOver(false); }}
          onDrop={onDrop}
          onClick={() => !uploading && document.getElementById('media-file-input').click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--cyan)' : 'var(--g300)'}`,
            borderRadius: 8, padding: '28px 20px', textAlign: 'center',
            cursor: uploading ? 'wait' : 'pointer', background: dragOver ? 'rgba(115,196,214,0.05)' : 'var(--g50)',
            transition: 'all 0.15s',
          }}>
          <input id="media-file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileInput} />
          {uploading ? (
            <div style={{ fontSize: 13, color: 'var(--g400)' }}>Uploading…</div>
          ) : (
            <>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🖼</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--g600)', marginBottom: 4 }}>
                Drop an image or click to browse
              </div>
              <div style={{ fontSize: 11, color: 'var(--g400)' }}>JPG, PNG, GIF · Max 10MB</div>
            </>
          )}
          {uploadError && (
            <div style={{ fontSize: 12, color: '#B91C1C', marginTop: 8 }}>{uploadError}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Create / Edit View ─────────────────────────────────────────────────────────
const BLANK_FORM = {
  caption: '',
  media_url: '',
  media_type: 'image',
  scheduled_at: '',
  notes: '',
};

// CreateView is controlled for new posts (form lives in parent so it survives
// navigation) and uses local state for editing an existing post.
function CreateView({ editPost, draftForm, onDraftChange, onSave, onCancel }) {
  const editFromPost = (p) => ({
    caption: p.caption || '',
    media_url: p.media_url || '',
    media_type: p.media_type || 'image',
    scheduled_at: p.scheduled_at ? p.scheduled_at.slice(0, 16) : '',
    notes: p.notes || '',
  });

  const [editForm, setEditForm] = useState(() => editPost ? editFromPost(editPost) : null);

  // Re-init edit form whenever the target post changes
  useEffect(() => {
    if (editPost) setEditForm(editFromPost(editPost));
  }, [editPost?.id]);

  // Route reads/writes to the right state depending on mode
  const form = editPost ? (editForm || BLANK_FORM) : draftForm;
  const set = editPost
    ? (k, v) => setEditForm(f => ({ ...f, [k]: v }))
    : (k, v) => onDraftChange(f => ({ ...f, [k]: v }));

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.caption.trim()) {
      alert('Caption is required.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        caption: form.caption.trim(),
        media_url: form.media_url.trim() || null,
        media_type: form.media_type,
        scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
        notes: form.notes.trim() || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="pg-hd">
        <div>
          <div className="pg-ttl">{editPost ? 'Edit Post' : 'Create Post'}</div>
          <div className="pg-sub">{editPost ? 'Update this post.' : 'Draft a new Instagram post.'}</div>
        </div>
      </div>

      <div style={{ maxWidth: 640 }}>
        <div className="fg">
          <label className="fl">Caption *</label>
          <textarea
            className="fta"
            value={form.caption}
            onChange={e => set('caption', e.target.value)}
            placeholder="Write your Instagram caption…"
            rows={5}
          />
        </div>

        <div className="frow">
          <div className="fg">
            <label className="fl">Media Type</label>
            <select className="fs" value={form.media_type} onChange={e => set('media_type', e.target.value)}>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="carousel">Carousel</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Schedule Time</label>
            <input
              type="datetime-local"
              className="fi"
              value={form.scheduled_at}
              onChange={e => set('scheduled_at', e.target.value)}
            />
          </div>
        </div>

        <CanvaMediaPicker
          mediaUrl={form.media_url}
          onUrlChange={url => set('media_url', url)}
        />



        <div className="fg">
          <label className="fl">Internal Notes</label>
          <input
            className="fi"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Notes for the team…"
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button className="btn btn-blk" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : editPost ? 'Save Changes' : '+ Create Draft'}
          </button>
          {onCancel && (
            <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Calendar event DB helpers ──────────────────────────────────────────────────
const dbLoadEvents = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', user.id)
    .order('event_date', { ascending: true });
  if (error) throw error;
  return (data || []).map(e => ({
    id: e.id,
    title: e.title,
    notes: e.notes || '',
    date: e.event_date,
    recurrenceId: e.recurrence_id || null,
    recurrenceRule: e.recurrence_rule || null,
  }));
};

const dbSaveEvent = async (evt) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('calendar_events').insert([{
    id: evt.id,
    user_id: user?.id,
    title: evt.title,
    notes: evt.notes || null,
    event_date: evt.date,
    recurrence_id: evt.recurrenceId || null,
    recurrence_rule: evt.recurrenceRule || null,
  }]);
  if (error) throw error;
};

const dbDeleteEvent = async (id) => {
  const { error } = await supabase.from('calendar_events').delete().eq('id', id);
  if (error) throw error;
};

const dbDeleteEventSeries = async (recurrenceId) => {
  const { error } = await supabase.from('calendar_events').delete().eq('recurrence_id', recurrenceId);
  if (error) throw error;
};

// ── Calendar helpers ───────────────────────────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) days.push({ day: prevMonthDays - i, other: true });
  for (let d = 1; d <= daysInMonth; d++) days.push({ day: d, other: false });
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) days.push({ day: d, other: true });
  return days;
}

const calTrunc = (str, n) => !str ? '' : str.length > n ? str.slice(0, n) + '…' : str;

// ── Calendar View ───────────────────────────────────────────────────────────────
function CalendarView({ posts, onSave }) {
  const [calDate, setCalDate] = useState(new Date());
  const [calMode, setCalMode] = useState('month');
  const [selectedDay, setSelectedDay] = useState(null);
  const [calEvents, setCalEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [addingEvent, setAddingEvent] = useState(false);

  useEffect(() => {
    dbLoadEvents()
      .then(setCalEvents)
      .catch(console.error)
      .finally(() => setEventsLoading(false));
  }, []);
  const [newEvent, setNewEvent] = useState({ title: '', notes: '', recurrence: 'none' });
  const [statusFilter, setStatusFilter] = useState(new Set());
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);

  const openPostEdit = (p) => {
    setEditingPost(p);
    setEditForm({
      caption: p.caption || '',
      media_url: p.media_url || '',
      media_type: p.media_type || 'image',
      scheduled_at: p.scheduled_at ? p.scheduled_at.slice(0, 16) : '',
      notes: p.notes || '',
    });
    setSelectedDay(null);
  };

  const handleEditSave = async () => {
    setEditSaving(true);
    try {
      await onSave({
        caption: editForm.caption.trim(),
        media_url: editForm.media_url.trim() || null,
        media_type: editForm.media_type,
        scheduled_at: editForm.scheduled_at ? new Date(editForm.scheduled_at).toISOString() : null,
        notes: editForm.notes.trim() || null,
      }, editingPost);
      setEditingPost(null);
    } finally {
      setEditSaving(false);
    }
  };

  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const todayStr = new Date().toISOString().slice(0, 10);

  const fmtDate = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const postDate = (p) => (p.scheduled_at || p.published_at || p.created_at || '').slice(0, 10);

  const postsForDate = (str) =>
    posts.filter(p => postDate(p) === str && (statusFilter.size === 0 || statusFilter.has(p.status)));

  const eventsForDate = (str) => calEvents.filter(e => e.date === str);

  const getWeekDays = () => {
    const sun = new Date(calDate);
    sun.setDate(calDate.getDate() - calDate.getDay());
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(sun); d.setDate(sun.getDate() + i); return d; });
  };

  const navPrev = () => calMode === 'month'
    ? setCalDate(new Date(year, month - 1))
    : setCalDate(d => { const n = new Date(d); n.setDate(d.getDate() - 7); return n; });

  const navNext = () => calMode === 'month'
    ? setCalDate(new Date(year, month + 1))
    : setCalDate(d => { const n = new Date(d); n.setDate(d.getDate() + 7); return n; });

  const openDay = (str, day) => {
    setSelectedDay({ dateStr: str, day });
    setAddingEvent(false);
    setNewEvent({ title: '', notes: '', recurrence: 'none' });
  };

  const saveNewEvent = async () => {
    if (!newEvent.title.trim()) return;
    const recurrenceId = newEvent.recurrence !== 'none' ? `rec_${Date.now()}` : null;
    const base = {
      title: newEvent.title.trim(),
      notes: newEvent.notes.trim(),
      recurrenceId,
      recurrenceRule: newEvent.recurrence !== 'none' ? newEvent.recurrence : null,
    };
    const instances = [];
    let cursor = new Date(selectedDay.dateStr + 'T12:00:00');
    const count = newEvent.recurrence === 'none' ? 1 : 12;
    for (let i = 0; i < count; i++) {
      instances.push({ ...base, id: crypto.randomUUID(), date: cursor.toISOString().slice(0, 10) });
      if (newEvent.recurrence === 'monthly') cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate());
      else if (newEvent.recurrence !== 'none') cursor.setDate(cursor.getDate() + (newEvent.recurrence === 'daily' ? 1 : 7));
    }
    setCalEvents(ev => [...ev, ...instances]);
    setNewEvent({ title: '', notes: '', recurrence: 'none' });
    setAddingEvent(false);
    // Persist to Supabase (fire-and-forget — UI already updated)
    for (const inst of instances) {
      dbSaveEvent(inst).catch(console.error);
    }
  };

  const deleteEvent = async (ev) => {
    if (ev.recurrenceId && confirm('Delete all events in this recurring series?')) {
      setCalEvents(evs => evs.filter(e => e.recurrenceId !== ev.recurrenceId));
      dbDeleteEventSeries(ev.recurrenceId).catch(console.error);
    } else {
      setCalEvents(evs => evs.filter(e => e.id !== ev.id));
      dbDeleteEvent(ev.id).catch(console.error);
    }
  };

  const toggleFilter = (s) => setStatusFilter(prev => {
    const next = new Set(prev);
    next.has(s) ? next.delete(s) : next.add(s);
    return next;
  });

  const navTitle = calMode === 'month'
    ? `${MONTH_NAMES[month]} ${year}`
    : (() => { const wd = getWeekDays(); return `${MONTH_NAMES[wd[0].getMonth()]} ${wd[0].getDate()} – ${MONTH_NAMES[wd[6].getMonth()]} ${wd[6].getDate()}, ${wd[6].getFullYear()}`; })();

  const modalPosts = selectedDay ? postsForDate(selectedDay.dateStr) : [];
  const modalEvents = selectedDay ? eventsForDate(selectedDay.dateStr) : [];

  return (
    <div style={{ padding: '30px 32px 40px', maxWidth: 1400 }}>
      <div className="pg-hd">
        <div>
          <div className="pg-ttl">Calendar</div>
          <div className="pg-sub">View and manage your content schedule.</div>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {['month', 'week'].map(m => (
            <button key={m} className={`btn btn-sm ${calMode === m ? 'btn-blk' : 'btn-ghost'}`}
              onClick={() => setCalMode(m)} style={{ textTransform: 'capitalize' }}>{m}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '24px 28px 28px' }}>
        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button className="btn btn-ghost btn-sm" onClick={navPrev}>← Prev</button>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{navTitle}</div>
          <button className="btn btn-ghost btn-sm" onClick={navNext}>Next →</button>
        </div>

        {/* Month view */}
        {calMode === 'month' && (() => {
          const days = getMonthDays(year, month);
          return (
            <div className="cal-grid">
              {DAY_ABBR.map(d => <div key={d} className="cal-day-hdr">{d}</div>)}
              {days.map((d, i) => {
                const str = fmtDate(year, month, d.day);
                const dPosts = d.other ? [] : postsForDate(str);
                const dEvts = d.other ? [] : eventsForDate(str);
                const shownPosts = dPosts.slice(0, 2);
                const shownEvts = dEvts.slice(0, Math.max(0, 2 - shownPosts.length));
                const overflow = dPosts.length + dEvts.length - shownPosts.length - shownEvts.length;
                const isToday = !d.other && str === todayStr;
                return (
                  <div key={i} className={`cal-cell ${d.other ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => !d.other && openDay(str, d.day)}>
                    <div className={`cal-date-num ${isToday ? 'today' : ''}`}>{d.day}</div>
                    {shownPosts.map(p => (
                      <div key={p.id} className={`cal-chip tag-${p.status}`}
                        title={p.caption?.slice(0, 60)}
                        onClick={e => { e.stopPropagation(); openPostEdit(p); }}>
                        {calTrunc(p.caption?.split('\n')[0], 15) || '(no caption)'}
                      </div>
                    ))}
                    {shownEvts.map(ev => (
                      <div key={ev.id} className="cal-chip cal-chip-event" title={ev.title}>
                        📌 {calTrunc(ev.title, 12)}
                      </div>
                    ))}
                    {overflow > 0 && <div style={{ fontSize: 9, color: 'var(--g400)', fontWeight: 700, paddingLeft: 2 }}>+{overflow} more</div>}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Week view */}
        {calMode === 'week' && (() => {
          const weekDays = getWeekDays();
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {weekDays.map((d, i) => {
                const str = d.toISOString().slice(0, 10);
                const wPosts = postsForDate(str);
                const wEvts = eventsForDate(str);
                const isToday = str === todayStr;
                return (
                  <div key={i} onClick={() => openDay(str, d.getDate())}
                    style={{ minHeight: 130, border: `1.5px solid ${isToday ? 'var(--cyan)' : 'var(--g200)'}`, borderRadius: 8, padding: 6, cursor: 'pointer', background: isToday ? 'rgba(115,196,214,0.05)' : '#fff', transition: 'border-color 0.12s' }}>
                    <div style={{ textAlign: 'center', marginBottom: 6 }}>
                      <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: isToday ? 'var(--cyan)' : 'var(--g400)' }}>{DAY_ABBR[d.getDay()]}</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: isToday ? 'var(--cyan)' : 'var(--black)' }}>{d.getDate()}</div>
                    </div>
                    {wPosts.map(p => (
                      <div key={p.id} className={`cal-chip tag-${p.status}`} style={{ marginBottom: 2 }}
                        onClick={e => { e.stopPropagation(); openPostEdit(p); }}
                        title={p.caption?.slice(0, 60)}>
                        {calTrunc(p.caption?.split('\n')[0], 12) || '(no caption)'}
                      </div>
                    ))}
                    {wEvts.map(ev => (
                      <div key={ev.id} className="cal-chip cal-chip-event" style={{ marginBottom: 2 }}>
                        📌 {calTrunc(ev.title, 10)}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Status filter legend */}
        <div style={{ display: 'flex', gap: 6, marginTop: 16, marginBottom: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--g400)', marginRight: 2 }}>Filter:</span>
          {['draft','pending_approval','approved','scheduled','published'].map(s => (
            <span key={s} className={`tag tag-${s}`}
              style={{ cursor: 'pointer', opacity: statusFilter.size > 0 && !statusFilter.has(s) ? 0.3 : 1, transition: 'opacity 0.15s' }}
              onClick={() => toggleFilter(s)}>
              {STATUS_LABELS[s]}
            </span>
          ))}
        </div>
      </div>

      {/* Day modal */}
      {selectedDay && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(3,0,0,0.4)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fIn 0.15s ease' }}
          onClick={() => setSelectedDay(null)}>
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--sh-lg)', animation: 'sUp 0.18s ease' }}
            onClick={e => e.stopPropagation()}>
            <div className="m-hd">
              <div className="m-ttl">{MONTH_NAMES[new Date(selectedDay.dateStr + 'T12:00:00').getMonth()]} {selectedDay.day}, {new Date(selectedDay.dateStr + 'T12:00:00').getFullYear()}</div>
              <button className="m-close" onClick={() => setSelectedDay(null)}>✕</button>
            </div>
            <div className="m-bd">
              {/* Posts on this day */}
              {modalPosts.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--g400)', marginBottom: 8 }}>Posts</div>
                  {modalPosts.map(p => (
                    <div key={p.id}
                      onClick={() => openPostEdit(p)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--g200)', marginBottom: 6, cursor: 'pointer', background: '#fafafa', transition: 'background 0.1s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--g50)'}
                      onMouseOut={e => e.currentTarget.style.background = '#fafafa'}>
                      <span className={`tag tag-${p.status}`}>{STATUS_LABELS[p.status]}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.caption?.split('\n')[0]?.slice(0, 55) || 'No caption'}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--g400)' }}>→</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Manual events */}
              {modalEvents.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--g400)', marginBottom: 8 }}>Events</div>
                  {modalEvents.map(ev => (
                    <div key={ev.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--g200)', marginBottom: 6, background: '#fafafa' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>📌 {ev.title}</div>
                        {ev.notes && <div style={{ fontSize: 12, color: 'var(--g600)', marginTop: 2 }}>{ev.notes}</div>}
                        {ev.recurrenceId && <div style={{ fontSize: 10, color: 'var(--g400)', marginTop: 2 }}>↻ Recurring</div>}
                      </div>
                      <button onClick={() => deleteEvent(ev)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C', fontSize: 14, padding: '2px 6px' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              {modalPosts.length === 0 && modalEvents.length === 0 && (
                <p style={{ color: 'var(--g400)', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>Nothing scheduled for this day.</p>
              )}
              {/* Add event form */}
              {addingEvent ? (
                <div style={{ padding: 14, borderRadius: 8, background: 'var(--g50)', border: '1.5px solid var(--g200)', marginTop: 8 }}>
                  <div className="fg">
                    <input className="fi" placeholder="Event title *" autoFocus
                      value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && saveNewEvent()} />
                  </div>
                  <div className="fg">
                    <input className="fi" placeholder="Notes (optional)"
                      value={newEvent.notes} onChange={e => setNewEvent(p => ({ ...p, notes: e.target.value }))} />
                  </div>
                  <div className="fg">
                    <select className="fs" value={newEvent.recurrence} onChange={e => setNewEvent(p => ({ ...p, recurrence: e.target.value }))}>
                      <option value="none">Does not repeat</option>
                      <option value="daily">Daily (12 days)</option>
                      <option value="weekly">Weekly (12 weeks)</option>
                      <option value="monthly">Monthly (12 months)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-blk btn-sm" onClick={saveNewEvent}>Save Event</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setAddingEvent(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
                  onClick={() => setAddingEvent(true)}>+ Add Event</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post edit modal — stays on calendar page */}
      {editingPost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(3,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px 20px' }}
          onClick={() => setEditingPost(null)}>
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 580, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 60px)', boxShadow: 'var(--sh-lg)', animation: 'sUp 0.18s ease' }}
            onClick={e => e.stopPropagation()}>
            {/* Sticky header */}
            <div className="m-hd" style={{ flexShrink: 0 }}>
              <div className="m-ttl">Edit Post</div>
              <button className="m-close" onClick={() => setEditingPost(null)}>✕</button>
            </div>
            {/* Scrollable body */}
            <div className="m-bd" style={{ overflowY: 'auto', flex: 1 }}>
              <div className="fg">
                <label className="fl">Caption *</label>
                <textarea className="fta" rows={4} value={editForm.caption}
                  onChange={e => setEditForm(f => ({ ...f, caption: e.target.value }))} />
              </div>
              <div className="frow">
                <div className="fg">
                  <label className="fl">Media Type</label>
                  <select className="fs" value={editForm.media_type}
                    onChange={e => setEditForm(f => ({ ...f, media_type: e.target.value }))}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="carousel">Carousel</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="fl">Schedule Time</label>
                  <input type="datetime-local" className="fi" value={editForm.scheduled_at}
                    onChange={e => setEditForm(f => ({ ...f, scheduled_at: e.target.value }))} />
                </div>
              </div>
              <div className="fg">
                <label className="fl">Media URL</label>
                <input className="fi" value={editForm.media_url}
                  onChange={e => setEditForm(f => ({ ...f, media_url: e.target.value }))}
                  placeholder="https://…" />
                {editForm.media_url && (
                  <img src={editForm.media_url} alt="" style={{ marginTop: 8, maxHeight: 180, borderRadius: 8, border: '1.5px solid var(--g200)', display: 'block' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                )}
              </div>
              <div className="fg">
                <label className="fl">Internal Notes</label>
                <input className="fi" value={editForm.notes}
                  onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Notes for the team…" />
              </div>
            </div>
            {/* Sticky footer */}
            <div className="m-ft" style={{ flexShrink: 0 }}>
              <button className="btn btn-ghost" onClick={() => setEditingPost(null)}>Cancel</button>
              <button className="btn btn-blk" onClick={handleEditSave} disabled={editSaving}>
                {editSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Analytics View ─────────────────────────────────────────────────────────────
function AnalyticsView({ posts, showToast, onRefresh }) {
  const [dateRange, setDateRange] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [typeFilter, setTypeFilter] = useState('all');
  const [importing, setImporting] = useState(false);
  const [clickedBar, setClickedBar] = useState(null);

  const allPublished = posts
    .filter(p => p.status === 'published')
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

  const published = dateRange === 'all' ? allPublished : allPublished.filter(p => {
    if (!p.published_at) return false;
    const days = { '7d': 7, '30d': 30, '90d': 90 }[dateRange];
    return new Date(p.published_at) >= new Date(Date.now() - days * 86400000);
  });

  const thisMonth = allPublished.filter(p =>
    p.published_at && new Date(p.published_at) > new Date(new Date().setDate(1))
  );

  // Group published posts by week for bar chart
  const weeklyData = (() => {
    if (published.length === 0) return [];
    const weeks = {};
    [...published].reverse().forEach(p => {
      const d = new Date(p.published_at);
      const sun = new Date(d);
      sun.setDate(d.getDate() - d.getDay());
      const key = sun.toISOString().slice(0, 10);
      const label = sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!weeks[key]) weeks[key] = { label, posts: [] };
      weeks[key].posts.push(p);
    });
    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => ({ label: v.label, count: v.posts.length, posts: v.posts }));
  })();
  const maxCount = Math.max(...weeklyData.map(w => w.count), 1);

  // Import from Instagram
  const importFromInstagram = async () => {
    setImporting(true);
    try {
      const res = await fetch('/api/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getMedia' }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.error || 'Instagram API error', 'error');
        return;
      }
      if (!data.media?.length) {
        if (data._debug) console.warn('[getMedia] empty — raw Composio response:\n' + JSON.stringify(data._debug, null, 2));
        showToast('No posts found on Instagram', 'error');
        return;
      }
      const existingIds = new Set(posts.map(p => p.instagram_post_id).filter(Boolean));
      const toImport = data.media.filter(m => !existingIds.has(m.id));
      if (toImport.length === 0) {
        showToast('All Instagram posts are already imported');
        return;
      }
      let count = 0;
      for (const m of toImport) {
        await dbCreatePost({
          caption: m.caption || '',
          media_url: m.media_url || m.thumbnail_url || null,
          media_type: m.media_type === 'VIDEO' ? 'video'
            : m.media_type === 'CAROUSEL_ALBUM' ? 'carousel'
            : 'image',
          status: 'published',
          platform: 'instagram',
          instagram_post_id: m.id,
          published_at: m.timestamp || new Date().toISOString(),
        });
        count++;
      }
      showToast(`Imported ${count} post${count !== 1 ? 's' : ''} from Instagram`);
      onRefresh();
    } catch (e) {
      showToast('Import failed: ' + e.message, 'error');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="page">
      {/* Header + controls */}
      <div className="pg-hd">
        <div>
          <div className="pg-ttl">Analytics</div>
          <div className="pg-sub">Instagram performance overview.</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {[{ id: '7d', label: '7 Days' }, { id: '30d', label: '30 Days' }, { id: '90d', label: '90 Days' }, { id: 'all', label: 'All Time' }].map(r => (
            <button
              key={r.id}
              className={`btn btn-sm ${dateRange === r.id ? 'btn-blk' : 'btn-ghost'}`}
              onClick={() => { setDateRange(r.id); setClickedBar(null); }}
            >
              {r.label}
            </button>
          ))}
          <button
            className="btn btn-cyan btn-sm"
            onClick={importFromInstagram}
            disabled={importing}
          >
            {importing ? 'Importing…' : '📥 Import from Instagram'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats">
        {[
          { label: 'Published', value: published.length },
          { label: 'This Month', value: thisMonth.length },
          { label: 'Scheduled', value: posts.filter(p => p.status === 'scheduled').length },
          { label: 'In Pipeline', value: posts.filter(p => ['draft', 'pending_approval', 'approved'].includes(p.status)).length },
        ].map(s => (
          <div key={s.label} className="stat">
            <div className="stat-lbl">{s.label}</div>
            <div className="stat-val">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[{ id: 'overview', label: 'Overview' }, { id: 'table', label: 'All Posts' }].map(t => (
          <button key={t.id} className={`tab ${activeTab === t.id ? 'on' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {published.length === 0 ? (
        <div className="empty">
          <div className="empty-ico">📊</div>
          <div className="empty-ttl">No published posts yet</div>
          <div className="empty-txt">
            Use "Import from Instagram" to pull existing posts, or publish through the queue.
          </div>
        </div>
      ) : (
        <>
          {/* ── Overview tab: bar chart ── */}
          {activeTab === 'overview' && (
            <div className="card">
              <div className="card-hd">
                <div className="card-ttl">Posts published per week</div>
                <div style={{ fontSize: 11, color: 'var(--g400)', fontWeight: 700 }}>
                  Click a bar to see posts
                </div>
              </div>
              <div className="card-bd">
                {weeklyData.length === 0 ? (
                  <div style={{ color: 'var(--g400)', fontSize: 13 }}>No posts in this range.</div>
                ) : (
                  <>
                    {/* Y-axis (fixed) + scrollable bar area */}
                    {(() => {
                      const BAR_W = 36;
                      const BAR_GAP = 5;
                      const CHART_H = 160;
                      // Show a label every N bars so at most ~14 labels appear
                      const labelStep = Math.max(1, Math.ceil(weeklyData.length / 14));
                      return (
                        <div style={{ display: 'flex', gap: 8 }}>
                          {/* Y-axis — stays fixed outside scroll */}
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: CHART_H + 22, paddingBottom: 22, minWidth: 22, textAlign: 'right', flexShrink: 0 }}>
                            {[maxCount, Math.ceil(maxCount / 2), 0].map(tick => (
                              <span key={tick} style={{ fontSize: 9, color: 'var(--g400)', fontWeight: 700 }}>{tick}</span>
                            ))}
                          </div>
                          {/* Scrollable bars */}
                          <div style={{ flex: 1, overflowX: 'auto', overflowY: 'visible', paddingBottom: 4 }}>
                            <div style={{ minWidth: weeklyData.length * (BAR_W + BAR_GAP), position: 'relative' }}>
                              {/* Grid lines behind bars */}
                              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: CHART_H, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                                {[0, 1, 2].map(i => (
                                  <div key={i} style={{ borderTop: '1px dashed var(--g200)', width: '100%' }} />
                                ))}
                              </div>
                              {/* Bars */}
                              <div style={{ display: 'flex', gap: BAR_GAP, alignItems: 'flex-end', height: CHART_H }}>
                                {weeklyData.map((w, i) => {
                                  const pct = Math.max((w.count / maxCount) * 100, 4);
                                  const isActive = clickedBar === i;
                                  return (
                                    <div
                                      key={i}
                                      style={{ width: BAR_W, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', cursor: 'pointer' }}
                                      onClick={() => setClickedBar(isActive ? null : i)}
                                      title={`${w.label}: ${w.count} post${w.count !== 1 ? 's' : ''}`}
                                    >
                                      <div style={{
                                        width: '100%', borderRadius: '4px 4px 0 0',
                                        height: `${pct}%`, minHeight: 6,
                                        background: isActive ? 'var(--black)' : 'var(--cyan)',
                                        transition: 'background 0.15s',
                                      }} />
                                    </div>
                                  );
                                })}
                              </div>
                              {/* X labels — every Nth bar only */}
                              <div style={{ display: 'flex', gap: BAR_GAP, marginTop: 4 }}>
                                {weeklyData.map((w, i) => (
                                  <div key={i} style={{ width: BAR_W, flexShrink: 0, textAlign: 'center', fontSize: 9, color: 'var(--g400)', fontWeight: 700, overflow: 'hidden', visibility: i % labelStep === 0 ? 'visible' : 'hidden' }}>
                                    {w.label}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Clicked bar detail */}
                    {clickedBar !== null && weeklyData[clickedBar] && (
                      <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--g50)', borderRadius: 8, border: '1.5px solid var(--g200)' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--g600)', marginBottom: 10 }}>
                          Week of {weeklyData[clickedBar].label} — {weeklyData[clickedBar].count} post{weeklyData[clickedBar].count !== 1 ? 's' : ''}
                        </div>
                        {weeklyData[clickedBar].posts.map((p, i) => (
                          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i > 0 ? '1px solid var(--g200)' : 'none' }}>
                            {p.media_url && (
                              <img src={p.media_url} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--g200)', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {p.caption?.split('\n')[0]?.slice(0, 70) || 'No caption'}
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--g400)', marginTop: 2 }}>
                                {p.media_type} · {p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}
                              </div>
                            </div>
                            {p.media_type
                              ? <span className={`tag tag-${p.media_type}`}>{p.media_type}</span>
                              : <span style={{ color: 'var(--g300)', fontSize: 12 }}>—</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── All Posts table ── */}
          {activeTab === 'table' && (
            <div className="card">
              <div className="card-hd">
                <div className="card-ttl">All Published Posts</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[{ id: 'all', label: 'All' }, { id: 'image', label: 'Image' }, { id: 'video', label: 'Video' }, { id: 'carousel', label: 'Carousel' }].map(t => (
                    <button
                      key={t.id}
                      className={`btn btn-sm ${typeFilter === t.id ? 'btn-blk' : 'btn-ghost'}`}
                      onClick={() => setTypeFilter(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: 'var(--g50)' }}>
                      {['Caption', 'Type', 'Published', 'IG Post ID'].map(h => (
                        <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--g400)', borderBottom: '1.5px solid var(--g200)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {published
                      .filter(p => typeFilter === 'all' || p.media_type === typeFilter)
                      .map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--g100)' }}>
                          <td style={{ padding: '10px 14px', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 700 }}>
                            {p.caption?.split('\n')[0] || '—'}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            {p.media_type
                              ? <span className={`tag tag-${p.media_type}`}>{p.media_type}</span>
                              : <span style={{ color: 'var(--g300)', fontSize: 12 }}>—</span>}
                          </td>
                          <td style={{ padding: '10px 14px', color: 'var(--g600)' }}>
                            {p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}
                          </td>
                          <td style={{ padding: '10px 14px', color: 'var(--g400)', fontFamily: 'monospace', fontSize: 10 }}>
                            {p.instagram_post_id || '—'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── SocialManager ──────────────────────────────────────────────────────────────
export default function SocialManager({ onLogout, userEmail, onSwitchTool }) {
  const [view, setView] = useState('dashboard');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [advancing, setAdvancing] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [draftForm, setDraftForm] = useState(BLANK_FORM);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    try {
      const data = await dbGetPosts();
      setPosts(data);
    } catch (e) {
      showToast('Failed to load posts: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (payload) => {
    try {
      if (editPost) {
        const updated = await dbUpdatePost(editPost.id, payload);
        setPosts(ps => ps.map(p => p.id === editPost.id ? updated : p));
        showToast('Post updated');
      } else {
        const created = await dbCreatePost({ ...payload, status: 'draft', platform: 'instagram' });
        setPosts(ps => [created, ...ps]);
        setDraftForm(BLANK_FORM);
        showToast('Draft created');
      }
      setEditPost(null);
      setView('queue');
    } catch (e) {
      showToast('Save failed: ' + e.message, 'error');
    }
  };

  const handleAdvance = async (post) => {
    const nextStatus = STATUS_FLOW[post.status];
    if (!nextStatus) return;
    setAdvancing(post.id);
    try {
      if (post.status === 'scheduled') {
        if (!post.media_url) throw new Error('A media URL is required to publish.');
        const captionText = [
          post.caption,
          post.hashtags?.length ? post.hashtags.map(h => `#${h}`).join(' ') : null,
        ].filter(Boolean).join('\n\n');

        const res = await fetch('/api/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'publish',
            imageUrl: post.media_url,
            caption: captionText,
            contentType: post.media_type || 'image',
          }),
        });
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || 'Publish failed');

        const updated = await dbUpdateStatus(post.id, 'published', {
          instagram_post_id: json.media_id,
          published_at: new Date().toISOString(),
        });
        setPosts(ps => ps.map(p => p.id === post.id ? updated : p));
        showToast('Published to Instagram!');
      } else {
        const extra = post.status === 'pending_approval'
          ? { approved_by: userEmail, approved_at: new Date().toISOString() }
          : {};
        const updated = await dbUpdateStatus(post.id, nextStatus, extra);
        setPosts(ps => ps.map(p => p.id === post.id ? updated : p));
        showToast(`Moved to ${STATUS_LABELS[nextStatus]}`);
      }
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setAdvancing(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await dbDeletePost(id);
      setPosts(ps => ps.filter(p => p.id !== id));
      showToast('Post deleted');
    } catch (e) {
      showToast('Delete failed: ' + e.message, 'error');
    }
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setView('create');
  };

  const navigate = (v) => {
    setEditPost(null);
    setView(v);
  };

  const pendingCount = posts.filter(p => p.status === 'pending_approval').length;
  const sharedProps = { posts, onAdvance: handleAdvance, onDelete: handleDelete, onEdit: handleEdit, advancing };

  const renderView = () => {
    if (loading) {
      return (
        <div className="page">
          <div className="empty">
            <div className="empty-ico">⏳</div>
            <div className="empty-ttl">Loading posts…</div>
          </div>
        </div>
      );
    }
    if (view === 'create') {
      return (
        <CreateView
          editPost={editPost}
          draftForm={draftForm}
          onDraftChange={setDraftForm}
          onSave={handleSavePost}
          onCancel={() => navigate(editPost ? 'queue' : 'dashboard')}
        />
      );
    }
    if (view === 'queue') return <QueueView {...sharedProps} />;
    if (view === 'calendar') return (
      <CalendarView
        posts={posts}
        onSave={async (payload, post) => {
          const updated = await dbUpdatePost(post.id, payload);
          setPosts(ps => ps.map(p => p.id === post.id ? updated : p));
          showToast('Post updated');
        }}
      />
    );
    if (view === 'analytics') return <AnalyticsView posts={posts} showToast={showToast} onRefresh={loadPosts} />;
    return <DashboardView {...sharedProps} onNavigate={navigate} />;
  };

  const NAV = [
    { id: 'dashboard', icon: '⌂', label: 'Dashboard' },
    { id: 'queue',     icon: '≡', label: 'Content Queue', badge: pendingCount || null },
    { id: 'calendar',  icon: '□', label: 'Calendar' },
    { id: 'create',    icon: '+', label: 'Create Post' },
    { id: 'analytics', icon: '↗', label: 'Analytics' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <nav className="sb">
          <div className="sb-brand">
            <div className="sb-name">Sprout Social</div>
            <div className="sb-sub">Content Manager</div>
          </div>

          <div className="sb-nav">
            {NAV.map(item => (
              <div
                key={item.id}
                className={`sb-item ${view === item.id ? 'on' : ''}`}
                onClick={() => navigate(item.id)}
              >
                <span style={{ fontWeight: 900, fontSize: 14 }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge ? <span className="sb-badge">{item.badge}</span> : null}
              </div>
            ))}
          </div>

          <div className="sb-back" onClick={() => onSwitchTool?.('home')}>
            ← Hub
          </div>

          <div className="sb-foot">
            <div className="sb-foot-txt">{userEmail}</div>
            <button className="sb-log-btn" onClick={onLogout}>Log Out</button>
          </div>
        </nav>

        <main className="main">{renderView()}</main>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}
