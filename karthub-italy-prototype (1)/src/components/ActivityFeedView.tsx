import React, { useState } from 'react';
import { ActivityFeedItem, DriverProfile, TelemetryLog } from '../types';
import { Activity, Heart, MessageSquare, PlusCircle, Trophy, Zap, Flag, UserPlus, Sparkles, CheckCircle2, Send, Globe, Users, Bell } from 'lucide-react';

interface ActivityFeedViewProps {
  feedItems: ActivityFeedItem[];
  currentUser: DriverProfile;
  telemetryLogs: TelemetryLog[];
  onOpenLogModal: () => void;
  onLikeToggle: (itemId: string) => void;
  onAddPost?: (title: string, description: string, visibility: 'public' | 'friends_only', trackName?: string, bestLapFormatted?: string) => void;
}

export const ActivityFeedView: React.FC<ActivityFeedViewProps> = ({
  feedItems,
  currentUser,
  telemetryLogs,
  onOpenLogModal,
  onLikeToggle,
  onAddPost
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'friends'>('friends');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postVisibility, setPostVisibility] = useState<'public' | 'friends_only'>('public');

  // Comment state per feed item
  const [activeCommentItemId, setActiveCommentItemId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');
  const [localComments, setLocalComments] = useState<{ [id: string]: { id: string; authorName: string; text: string; time: string }[] }>({
    'feed-1': [
      { id: 'c1', authorName: 'Marco Rossi', text: 'Gran sorpasso in variante! Ci vediamo giovedì a Misanino!', time: '10 min fa' },
      { id: 'c2', authorName: 'Elena Bianchi', text: 'Passo fantastico sul bagnato!', time: '5 min fa' }
    ]
  });

  const handleEditCommentSubmit = (itemId: string, commentId: string) => {
    if (!editingCommentText.trim()) return;
    setLocalComments(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || []).map(c => c.id === commentId ? { ...c, text: editingCommentText.trim() } : c)
    }));
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleDeleteComment = (itemId: string, commentId: string) => {
    setLocalComments(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || []).filter(c => c.id !== commentId)
    }));
  };

  // Sample completion prompt notifications (Strava style)
  const [suggestedPosts, setSuggestedPosts] = useState([
    {
      id: 'sug-1',
      title: '⚡ NUOVO GIRO VELOCE CERTIFICATO',
      description: 'Hai registrato 42.080s al Circuito Misanino! Vuoi condividerlo con la community?',
      trackName: 'Circuito Misanino',
      bestLapFormatted: '42.080s'
    },
    {
      id: 'sug-2',
      title: '🏆 RIMONTA SPECTACULAR P2 (+14 POSIZIONI)',
      description: 'Partito P16 e arrivato P2 nella Romagna Rental Cup. Consiglio Strava: condividi la telemetria!',
      trackName: 'Misanino Sprint',
      bestLapFormatted: '41.950s'
    }
  ]);

  const handlePublishSuggested = (sug: typeof suggestedPosts[0]) => {
    if (onAddPost) {
      onAddPost(sug.title, sug.description, 'public', sug.trackName, sug.bestLapFormatted);
    }
    setSuggestedPosts(suggestedPosts.filter(s => s.id !== sug.id));
  };

  const handleCreateGenericPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;
    if (onAddPost) {
      onAddPost(postTitle, postDescription, postVisibility);
    }
    setPostTitle('');
    setPostDescription('');
    setShowNewPostModal(false);
  };

  const handleSendComment = (itemId: string) => {
    const text = commentInputs[itemId];
    if (!text || !text.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      authorName: currentUser?.name || 'Pilota',
      text: text.trim(),
      time: 'Adesso'
    };

    setLocalComments(prev => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), newComment]
    }));

    setCommentInputs(prev => ({ ...prev, [itemId]: '' }));
  };

  // Filter items
  const filteredFeed = feedItems.filter(item => {
    if (activeFilter === 'friends') {
      return item.driverId !== currentUser.id; // Show friends
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Top Banner & Strava CTA */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-red-600" />
            KARTHUB COMMUNITY & PADDOCK
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Feed in stile Strava per pubblicare le tue gare, confrontare telemetrie e commentare i risultati dei piloti.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowNewPostModal(true)}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 cursor-pointer uppercase tracking-tight"
          >
            <MessageSquare className="w-4 h-4 text-red-500" />
            <span>+ NUOVO POST</span>
          </button>

          <button
            onClick={onOpenLogModal}
            className="px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm border border-red-600 transition flex items-center space-x-1.5 cursor-pointer uppercase tracking-tight"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>REGISTRA GARA</span>
          </button>
        </div>
      </div>

      {/* STRAVA-STYLE NOTIFICATION & SUGGESTION PROMPTS */}
      {suggestedPosts.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white p-4 rounded-2xl shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <span className="text-xs font-black uppercase tracking-wider flex items-center">
              <Bell className="w-4 h-4 mr-1.5 animate-bounce" />
              CONSIGLI DI PUBBLICAZIONE (TRAGUARDI RECENTI)
            </span>
            <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-md">
              {suggestedPosts.length} PRONTI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedPosts.map((sug) => (
              <div key={sug.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-xs font-extrabold uppercase">{sug.title}</h4>
                  <p className="text-[11px] opacity-90 font-sans mt-0.5">{sug.description}</p>
                </div>
                <button
                  onClick={() => handlePublishSuggested(sug)}
                  className="w-full py-1.5 bg-white text-red-600 hover:bg-slate-100 rounded-lg text-xs font-black uppercase transition shadow-sm cursor-pointer"
                >
                  📢 PUBBLICA NEL FEED COMMUNITY
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW POST MODAL / DIALOG */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black uppercase text-slate-900 flex items-center">
                <MessageSquare className="w-5 h-5 text-red-600 mr-2" />
                SCRIVI UN POST O APRI UNA DISCUSSIONE
              </h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGenericPost} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">TITOLO / ARGOMENTO</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Es. Chi c'è giovedì sera a Misanino per l'Endurance?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">MESSAGGIO</label>
                <textarea
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  rows={3}
                  placeholder="Scrivi qui il tuo messaggio per gli altri piloti del paddock..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">VISIBILITÀ DEL POST</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPostVisibility('public')}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold uppercase transition border flex items-center justify-center space-x-1.5 ${
                      postVisibility === 'public'
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>PUBBLICO 🌐</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostVisibility('friends_only')}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold uppercase transition border flex items-center justify-center space-x-1.5 ${
                      postVisibility === 'friends_only'
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>SOLO AMICI 👥</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase"
                >
                  ANNULLA
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-extrabold uppercase shadow-sm hover:bg-red-700 transition"
                >
                  PUBBLICA POST
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feed Filters */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveFilter('friends')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border uppercase tracking-wider ${
              activeFilter === 'friends'
                ? 'bg-red-600 text-white border-red-600 shadow-sm font-extrabold'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            👥 AMICI
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border uppercase tracking-wider ${
              activeFilter === 'all'
                ? 'bg-red-600 text-white border-red-600 shadow-sm font-extrabold'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            COMMUNITY KARTHUB ({feedItems.length})
          </button>
        </div>

        <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline">
          ORDINAMENTO: PIÙ RECENTI
        </span>
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {filteredFeed.map((item) => {
          const isMe = item.driverId === currentUser.id;
          const isFriend = !isMe;
          const comments = localComments[item.id] || [];

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm space-y-3 transition duration-200 ${
                isFriend ? 'border-cyan-200/80 hover:border-cyan-400 bg-gradient-to-b from-cyan-50/20 to-white' : 'border-slate-200/80 hover:border-red-400'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img src={item.driverAvatar} alt={item.driverName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    {isFriend && (
                      <span className="absolute -bottom-1 -right-1 bg-cyan-600 text-white text-[8px] font-extrabold px-1 rounded-full border border-white">
                        👥
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      {item.driverName}
                      {isMe && <span className="text-[9px] font-black text-white bg-red-600 px-1.5 py-0.2 rounded-md">TU</span>}
                      {isFriend && <span className="text-[9px] font-extrabold text-cyan-800 bg-cyan-100 px-1.5 py-0.2 rounded-md border border-cyan-200">AMICO</span>}
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span>{item.visibility === 'friends_only' ? '👥 Solo Amici' : '🌐 Pubblico'}</span>
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                  item.type === 'personal_best'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : item.type === 'badge_unlocked'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : item.type === 'generic_post'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {item.type === 'generic_post' ? 'POST COMMUNITY' : item.type.replace('_', ' ')}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Stat Highlight Box */}
              {(item.bestLapFormatted || item.trackName || item.position) && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 grid grid-cols-3 gap-2 text-center">
                  {item.trackName && (
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">CIRCUITO</p>
                      <p className="text-xs font-extrabold text-slate-900 truncate mt-0.5">{item.trackName}</p>
                    </div>
                  )}
                  {item.bestLapFormatted && (
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">BEST LAP</p>
                      <p className="text-xs font-black text-emerald-600 mt-0.5">{item.bestLapFormatted}</p>
                    </div>
                  )}
                  {item.position && (
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">POSIZIONE</p>
                      <p className="text-xs font-black text-red-600 mt-0.5">P{item.position}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Social interactions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onLikeToggle(item.id)}
                    className={`flex items-center space-x-1.5 transition cursor-pointer font-bold ${
                      item.likedByMe ? 'text-red-600' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${item.likedByMe ? 'fill-red-600' : ''}`} />
                    <span>{item.likesCount}</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentItemId(activeCommentItemId === item.id ? null : item.id)}
                    className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 font-medium transition cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{comments.length + item.commentsCount} Commenti</span>
                  </button>
                </div>

                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  TELEMETRIA VERIFICATA ✅
                </span>
              </div>

              {/* EXPANDABLE COMMENT SECTION */}
                  {(activeCommentItemId === item.id || comments.length > 0) && (
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      {comments.length > 0 && (
                        <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          {comments.map((c) => (
                            <div key={c.id} className="text-xs space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-slate-900">{c.authorName}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-[9px] text-slate-400">{c.time}</span>
                                  {c.authorName === currentUser?.name && (
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={() => {
                                          setEditingCommentId(c.id);
                                          setEditingCommentText(c.text);
                                        }}
                                        className="text-[9px] font-bold text-slate-500 hover:text-slate-900 uppercase underline cursor-pointer"
                                      >
                                        Modifica
                                      </button>
                                      <button
                                        onClick={() => handleDeleteComment(item.id, c.id)}
                                        className="text-[9px] font-bold text-red-600 hover:text-red-700 uppercase underline cursor-pointer"
                                      >
                                        Elimina
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {editingCommentId === c.id ? (
                                <div className="flex items-center space-x-2 mt-1">
                                  <input
                                    type="text"
                                    value={editingCommentText}
                                    onChange={(e) => setEditingCommentText(e.target.value)}
                                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-medium"
                                  />
                                  <button
                                    onClick={() => handleEditCommentSubmit(item.id, c.id)}
                                    className="px-2 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold uppercase"
                                  >
                                    Salva
                                  </button>
                                  <button
                                    onClick={() => setEditingCommentId(null)}
                                    className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold uppercase"
                                  >
                                    Annulla
                                  </button>
                                </div>
                              ) : (
                                <p className="text-slate-700 font-sans">{c.text}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                  {/* Add Comment Input */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={commentInputs[item.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [item.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(item.id);
                      }}
                      placeholder="Aggiungi un commento al post..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                    />
                    <button
                      onClick={() => handleSendComment(item.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
