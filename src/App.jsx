import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const STORAGE_KEY = 'dailyMotivationLiked_v4'; // Unique key to avoid old data conflicts

  // Helper to get available storage (local > session > none)
  const getStorage = () => {
    try {
      window.localStorage.setItem('__storage_test__', 'test');
      window.localStorage.removeItem('__storage_test__');
      return window.localStorage;
    } catch (e) {
      console.warn('localStorage unavailable, falling back to sessionStorage:', e);
      try {
        window.sessionStorage.setItem('__storage_test__', 'test');
        window.sessionStorage.removeItem('__storage_test__');
        return window.sessionStorage;
      } catch (e2) {
        console.error('No storage available, using in-memory only (won\'t persist on refresh):', e2);
        return null;
      }
    }
  };

  // Load likedQuotes
  const [likedQuotes, setLikedQuotes] = useState(() => {
    const storage = getStorage();
    if (!storage) return [];
    try {
      const saved = storage.getItem(STORAGE_KEY);
      console.log('Raw saved data:', saved);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          console.log('Loaded liked quotes:', parsed);
          return parsed;
        } else {
          console.warn('Invalid data, clearing...');
          storage.removeItem(STORAGE_KEY);
          return [];
        }
      }
      console.log('No saved quotes found.');
      return [];
    } catch (err) {
      console.error('Parse error:', err);
      storage.removeItem(STORAGE_KEY);
      return [];
    }
  });

  const [currentQuote, setCurrentQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [storageType, setStorageType] = useState('local');

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) {
      if (storageType !== 'none') {
        setStorageType('none');
        showToast('⚠️ Storage blocked—quotes won\'t persist! Run via local server (npm start) or use Firefox.');
      }
      return;
    }

    if (Array.isArray(likedQuotes)) {
      try {
        const jsonData = JSON.stringify(likedQuotes);
        storage.setItem(STORAGE_KEY, jsonData);
        console.log('Saved liked quotes:', likedQuotes);
        console.log('Saved JSON:', jsonData);
        if (storage === window.sessionStorage && storageType !== 'session') {
          setStorageType('session');
          showToast('⚠️ Using session storage—persists on refresh but clears on close/reopen. Use http:// for full save.');
        }
      } catch (err) {
        console.error('Save error:', err);
        showToast('⚠️ Save failed—check console!');
      }
    }
  }, [likedQuotes, storageType]);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.quotable.io/random');
      const data = await res.json();
      setCurrentQuote({
        _id: data._id,
        content: data.content,
        author: data.author,
      });
    } catch {
      const fallbacks = [
        { _id: 'f1', content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
        { _id: 'f2', content: 'Everything you’ve ever wanted is sitting on the other side of fear.', author: 'George Addair' },
        { _id: 'f3', content: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
      ];
      setCurrentQuote(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    }
    setLoading(false);
  };

  const toggleLike = () => {
    if (!currentQuote) return;
    const alreadyLiked = likedQuotes.some(q => q._id === currentQuote._id);
    if (alreadyLiked) {
      setLikedQuotes(prev => prev.filter(q => q._id !== currentQuote._id));
      showToast('Removed from collection');
    } else {
      setLikedQuotes(prev => [currentQuote, ...prev]);
      showToast('Added to your collection ❤️');
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    }
  };

  const removeLikedQuote = (id) => {
    setLikedQuotes(prev => prev.filter(q => q._id !== id));
    showToast('Quote removed');
  };

  const clearAll = () => {
    if (window.confirm('Clear entire collection?')) {
      setLikedQuotes([]);
      showToast('Collection cleared');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const isCurrentLiked = currentQuote ? likedQuotes.some(q => q._id === currentQuote._id) : false;

  return (
    <div className="motivation-app">
      <div className="container">
        <div className="header">
          <div className="logo-group">
            <div className="sun-icon">🌞</div>
            <div>
              <h1 className="title">Daily Motivation</h1>
              <p className="subtitle">One quote. One powerful start.</p>
            </div>
          </div>
          <div className="collection-pill" onClick={() => {
            if (likedQuotes.length === 0) showToast("You haven't liked any quotes yet!");
            else {
              const list = likedQuotes.map(q => `• “${q.content}” — ${q.author}`).join('\n\n');
              alert(`❤️ Your Liked Quotes (${likedQuotes.length})\n\n${list}`);
            }
          }}>
            <span className="pill-heart">❤️</span>
            <span className="pill-text">YOUR COLLECTION</span>
            <span className="pill-count">{likedQuotes.length}</span>
          </div>
        </div>
        <div className="main-grid">
          <div className="quote-card">
            {loading && (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p className="loading-text">Finding today’s wisdom...</p>
              </div>
            )}
            <div className={`quote-content ${loading ? 'hidden' : ''}`}>
              <p className="quote-text">
                {currentQuote ? currentQuote.content : "Click New Quote to begin your day with inspiration ✨"}
              </p>
              <div className="author">— {currentQuote?.author || 'Unknown'}</div>
              <button onClick={fetchQuote} disabled={loading} className="new-quote-btn">
                New Quote <span className="refresh-icon">↻</span>
              </button>
            </div>
            <button
              onClick={toggleLike}
              disabled={!currentQuote || loading}
              className={`like-btn ${isCurrentLiked ? 'liked' : ''}`}
            >
              <span className={`heart ${isCurrentLiked ? 'liked' : ''}`}>
                {isCurrentLiked ? '❤️' : '♡'}
              </span>
              <span className="like-text">{isCurrentLiked ? 'Saved' : 'Save quote'}</span>
            </button>
            {showHeartBurst && <div className="heart-burst">❤️</div>}
          </div>
          <div className="sidebar">
            <div className="sidebar-header">
              <div className="sidebar-title">
                <span className="sidebar-heart">❤️</span>
                Saved Wisdom
              </div>
              <div className="count-circle">{likedQuotes.length}</div>
            </div>
            <div className="liked-list">
              {likedQuotes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-heart">❤️</div>
                  <p className="empty-title">Your collection is empty</p>
                  <p className="empty-desc">Tap the heart on any quote to save it here forever</p>
                </div>
              ) : (
                likedQuotes.map(quote => (
                  <div key={quote._id} className="liked-item">
                    <p className="liked-quote">“{quote.content}”</p>
                    <div className="liked-author">— {quote.author}</div>
                    <button onClick={() => removeLikedQuote(quote._id)} className="remove-btn">✕</button>
                  </div>
                ))
              )}
            </div>
            {likedQuotes.length > 0 && (
              <button onClick={clearAll} className="clear-all-btn">Clear All</button>
            )}
          </div>
        </div>
      </div>
      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}