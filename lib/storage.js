/**
 * Storage adapter — drop-in replacement for Claude's window.storage API
 * backed by Supabase. Attach this to `window.storage` before the tool mounts.
 */
import { supabase } from './supabase';

let currentUserId = null;

// Call this after login to bind storage to a user
export function setStorageUser(userId) {
  currentUserId = userId;
}

export const storage = {
  async get(key) {
    if (!currentUserId) return null;
    const { data, error } = await supabase
      .from('app_storage')
      .select('key, value')
      .eq('user_id', currentUserId)
      .eq('key', key)
      .single();
    if (error || !data) return null;
    return { key: data.key, value: typeof data.value === 'string' ? data.value : JSON.stringify(data.value) };
  },

  async set(key, value) {
    if (!currentUserId) return null;
    const parsed = typeof value === 'string' ? (() => { try { return JSON.parse(value); } catch { return value; } })() : value;
    const { data, error } = await supabase
      .from('app_storage')
      .upsert(
        { user_id: currentUserId, key, value: parsed },
        { onConflict: 'user_id,key' }
      )
      .select()
      .single();
    if (error) { console.error('Storage set error:', error); return null; }
    return { key, value: typeof value === 'string' ? value : JSON.stringify(value) };
  },

  async delete(key) {
    if (!currentUserId) return null;
    const { error } = await supabase
      .from('app_storage')
      .delete()
      .eq('user_id', currentUserId)
      .eq('key', key);
    return { key, deleted: !error };
  },

  async list(prefix) {
    if (!currentUserId) return { keys: [] };
    let query = supabase
      .from('app_storage')
      .select('key')
      .eq('user_id', currentUserId);
    if (prefix) query = query.like('key', `${prefix}%`);
    const { data, error } = await query;
    if (error) return { keys: [] };
    return { keys: data.map(d => d.key) };
  }
};

// Attach to window so the tool component can use it without changes
export function initWindowStorage() {
  if (typeof window !== 'undefined') {
    window.storage = storage;
  }
}
