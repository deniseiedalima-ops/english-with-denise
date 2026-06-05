import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Community.css';

const CLOUD_NAME = 'dbkrebqs0';
const UPLOAD_PRESET = 'agrr8msy';
const EMOJIS = ['🔥','❤️','👏','🎉','✨','📚','👑','💛'];
const CATEGORIES = ['📖 Reading','🎧 Listening','✏️ Writing','🎙️ Speaking'];
const CAT_COLORS = {
  '📖 Reading':   { bg: '#e1f5ee', color: '#085041' },
  '🎧 Listening': { bg: '#e6f1fb', color: '#0C447C' },
  '✏️ Writing':   { bg: '#eeedfe', color: '#3C3489' },
  '🎙️ Speaking':  { bg: '#fbeaf0', color: '#72243E' },
};
const PODIUM_MEDALS = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

export default function Community({ user, student, onLogout }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('feed'); // 'feed' | 'podio' | 'post'
  const [posts, setPosts] = useState([]);
  const [podio, setPodio] = useState({ weekly: [], monthly: [] });
  const [podioView, setPodioView] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [myReactions, setMyReactions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ewd_reactions') || '{}'); } catch { return {}; }
  });

  // New post form
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [legenda, setLegenda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);
  const [todayCount, setTodayCount] = useState(0);
  const fileRef = useRef();

  const loadFeed = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/community?type=feed');
      const d = await r.json();
      setPosts(d.posts || []);
      // Count today's posts by this user
      const today = new Date().toISOString().split('T')[0];
      const mine = (d.posts || []).filter(p =>
        p.email === user?.email &&
        p.data?.startsWith(today)
      );
      setTodayCount(mine.length);
    } catch {}
    setLoading(false);
  };

  const loadPodio = async () => {
    try {
      const r = await fetch('/api/community?type=podio');
      const d = await r.json();
      setPodio(d);
    } catch {}
  };

  useEffect(() => {
    loadFeed();
    loadPodio();
  }, []);

  // Photo selection
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // Submit post
  const handlePost = async () => {
    setPostError('');
    const words = legenda.trim().split(/\s+/).filter(Boolean);
    if (!photo) return setPostError('Please select a photo!');
    if (!categoria) return setPostError('Please choose a category!');
    if (words.length < 3) return setPostError('Caption needs at least 3 words in English!');
    if (todayCount >= 4) return setPostError("You've reached your 4 posts for today! Come back tomorrow 🌟");

    setUploading(true);
    try {
      // Upload to Cloudinary
      const form = new FormData();
      form.append('file', photo);
      form.append('upload_preset', UPLOAD_PRESET);
      form.append('folder', 'english-rats');

      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST', body: form,
      });
      const upData = await upRes.json();
      if (!upData.secure_url) throw new Error('Upload failed');

      // Save to Notion via API
      const nome = `${user?.name?.split(' ').slice(0, 2).join(' ')}` || 'Student';
      const postRes = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome, email: user?.email,
          categoria, legenda,
          fotoUrl: upData.secure_url,
        }),
      });
      const postData = await postRes.json();
      if (!postData.success) throw new Error(postData.error || 'Post failed');

      setPostSuccess(true);
      setPhoto(null); setPhotoPreview(null); setLegenda(''); setCategoria('');
      setTimeout(() => { setPostSuccess(false); setTab('feed'); loadFeed(); }, 1500);
    } catch (err) {
      setPostError(err.message || 'Something went wrong. Try again!');
    }
    setUploading(false);
  };

  // React to post
  const handleReact = async (postId, emoji) => {
    const key = `${postId}_${emoji}`;
    if (myReactions[key]) return; // already reacted

    const updated = { ...myReactions, [key]: true };
    setMyReactions(updated);
    localStorage.setItem('ewd_reactions', JSON.stringify(updated));

    // Optimistic update
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, reactions: { ...p.reactions, [emoji]: (p.reactions[emoji] || 0) + 1 } }
      : p
    ));

    await fetch('/api/community', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, emoji }),
    });
  };

  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <div className="community-page">
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="community-content">

        {/* Header */}
        <div className="community-header">
          <div>
            <h1 className="community-title">EnglishRats 🐀</h1>
            <p className="community-sub">Share your English practice. Inspire your classmates!</p>
          </div>
          <button className="community-post-btn" onClick={() => setTab('post')}>
            + Post
          </button>
        </div>

        {/* Tabs */}
        <div className="community-tabs">
          {[
            { id: 'feed', label: '📸 Feed' },
            { id: 'podio', label: '🏆 Pódio' },
          ].map(t => (
            <button key={t.id} className={`community-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ── FEED ── */}
        {tab === 'feed' && (
          <div className="community-feed">
            {loading ? (
              <div className="community-loading">Loading posts... ✨</div>
            ) : posts.length === 0 ? (
              <div className="community-empty">
                <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
                <div className="community-empty-title">No posts yet!</div>
                <div className="community-empty-sub">Be the first to share your English practice today!</div>
                <button className="community-post-btn" style={{ marginTop: 16 }} onClick={() => setTab('post')}>
                  Share your first post →
                </button>
              </div>
            ) : posts.map(post => {
              const catStyle = CAT_COLORS[post.categoria] || {};
              const isMe = post.email === user?.email;
              const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);
              return (
                <div key={post.id} className="community-post-card">
                  {/* Post header */}
                  <div className="post-header">
                    <div className="post-avatar">{(post.nome || 'S')[0].toUpperCase()}</div>
                    <div className="post-meta">
                      <div className="post-name">{post.nome} {isMe && <span className="post-you">· you</span>}</div>
                      <div className="post-time">{timeAgo(post.data)}</div>
                    </div>
                    <span className="post-cat" style={{ background: catStyle.bg, color: catStyle.color }}>
                      {post.categoria}
                    </span>
                  </div>

                  {/* Photo */}
                  {post.fotoUrl && (
                    <div className="post-photo-wrap">
                      <img src={post.fotoUrl} alt="activity" className="post-photo" loading="lazy" />
                    </div>
                  )}

                  {/* Caption */}
                  <div className="post-caption">{post.legenda}</div>

                  {/* Reactions */}
                  <div className="post-reactions">
                    <div className="post-emoji-row">
                      {EMOJIS.map(emoji => {
                        const count = post.reactions[emoji] || 0;
                        const reacted = myReactions[`${post.id}_${emoji}`];
                        return (
                          <button key={emoji}
                            className={`post-emoji-btn ${reacted ? 'reacted' : ''}`}
                            onClick={() => !isMe && handleReact(post.id, emoji)}
                            disabled={isMe}
                            title={isMe ? "Can't react to your own post" : undefined}
                          >
                            {emoji}{count > 0 && <span className="emoji-count">{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                    {totalReactions > 0 && (
                      <div className="post-total-reactions">{totalReactions} reaction{totalReactions !== 1 ? 's' : ''}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PÓDIO ── */}
        {tab === 'podio' && (
          <div className="community-podio">
            <div className="podio-toggle">
              <button className={`podio-toggle-btn ${podioView === 'weekly' ? 'active' : ''}`}
                onClick={() => setPodioView('weekly')}>📅 This Week</button>
              <button className={`podio-toggle-btn ${podioView === 'monthly' ? 'active' : ''}`}
                onClick={() => setPodioView('monthly')}>🗓️ This Month</button>
            </div>

            {(podio[podioView] || []).length === 0 ? (
              <div className="community-empty">
                <div style={{ fontSize: 40 }}>🏆</div>
                <div className="community-empty-title">No posts yet this {podioView === 'weekly' ? 'week' : 'month'}!</div>
                <div className="community-empty-sub">Start posting to appear on the leaderboard!</div>
              </div>
            ) : (
              <>
                {/* Top 3 podium visual */}
                {(podio[podioView] || []).length >= 2 && (
                  <div className="podio-visual">
                    {[1, 0, 2].map(i => {
                      const entry = podio[podioView][i];
                      if (!entry) return <div key={i} className="podio-slot empty" />;
                      const heights = ['160px', '200px', '130px'];
                      const isMe = entry.email === user?.email;
                      return (
                        <div key={i} className={`podio-slot ${i === 0 ? 'first' : i === 1 ? 'second' : 'third'}`}>
                          <div className="podio-medal">{PODIUM_MEDALS[i]}</div>
                          <div className={`podio-avatar ${isMe ? 'me' : ''}`}>{(entry.nome || 'S')[0].toUpperCase()}</div>
                          <div className="podio-name">{entry.nome.split(' ')[0]}{isMe ? ' 👑' : ''}</div>
                          <div className="podio-score">{entry.posts} posts</div>
                          <div className="podio-bar" style={{ height: heights[i] }} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Full list */}
                <div className="podio-list">
                  {(podio[podioView] || []).map((entry, i) => {
                    const isMe = entry.email === user?.email;
                    return (
                      <div key={entry.email} className={`podio-list-item ${isMe ? 'me' : ''}`}>
                        <div className="podio-list-rank">{PODIUM_MEDALS[i]}</div>
                        <div className={`podio-list-avatar ${isMe ? 'me' : ''}`}>{(entry.nome || 'S')[0].toUpperCase()}</div>
                        <div className="podio-list-info">
                          <div className="podio-list-name">{entry.nome}{isMe ? ' (you)' : ''}</div>
                          <div className="podio-list-stats">{entry.posts} post{entry.posts !== 1 ? 's' : ''} · {entry.reactions} reactions</div>
                        </div>
                        <div className="podio-list-score">{entry.score.toFixed(1)} pts</div>
                      </div>
                    );
                  })}
                </div>
                <div className="podio-note">Score = posts + reactions × 0.1</div>
              </>
            )}
          </div>
        )}

        {/* ── NEW POST ── */}
        {tab === 'post' && (
          <div className="community-new-post">
            <button className="community-back-btn" onClick={() => { setTab('feed'); setPostError(''); setPhotoPreview(null); setPhoto(null); }}>
              ← Back to Feed
            </button>

            <div className="new-post-card">
              <div className="new-post-title">Share your practice! 📸</div>
              <div className="new-post-sub">Post a photo of your English activity today</div>

              {/* Daily counter */}
              <div className="post-daily-counter">
                <div className="post-daily-bar">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`post-daily-dot ${i < todayCount ? 'done' : ''}`} />
                  ))}
                </div>
                <div className="post-daily-label">{todayCount}/4 posts today</div>
              </div>

              {/* Photo upload */}
              <div className="new-post-photo-area" onClick={() => fileRef.current.click()}>
                {photoPreview ? (
                  <img src={photoPreview} alt="preview" className="new-post-preview" />
                ) : (
                  <div className="new-post-photo-placeholder">
                    <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
                    <div>Tap to select a photo</div>
                    <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>JPG, PNG or HEIC</div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />

              {/* Category */}
              <div className="new-post-label">Category</div>
              <div className="new-post-cats">
                {CATEGORIES.map(cat => {
                  const s = CAT_COLORS[cat] || {};
                  return (
                    <button key={cat}
                      className={`new-post-cat-btn ${categoria === cat ? 'selected' : ''}`}
                      style={categoria === cat ? { background: s.bg, color: s.color, borderColor: s.color } : {}}
                      onClick={() => setCategoria(cat)}
                    >{cat}</button>
                  );
                })}
              </div>

              {/* Caption */}
              <div className="new-post-label">Caption in English <span style={{ color: '#aaa', fontWeight: 400 }}>(min. 3 words)</span></div>
              <textarea
                className="new-post-textarea"
                placeholder="e.g. Reading my English grammar book! Loving it 📖"
                value={legenda}
                onChange={e => setLegenda(e.target.value)}
                rows={3}
              />
              <div className="new-post-wordcount" style={{ color: legenda.trim().split(/\s+/).filter(Boolean).length >= 3 ? '#1d9e75' : '#aaa' }}>
                {legenda.trim().split(/\s+/).filter(Boolean).length} / 3 words minimum
              </div>

              {postError && <div className="new-post-error">⚠️ {postError}</div>}
              {postSuccess && <div className="new-post-success">🎉 Posted successfully!</div>}

              <button className="new-post-submit" onClick={handlePost} disabled={uploading || todayCount >= 4}>
                {uploading ? 'Uploading... ⏳' : todayCount >= 4 ? 'Limit reached for today 🌟' : 'Share with the class! 🚀'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
