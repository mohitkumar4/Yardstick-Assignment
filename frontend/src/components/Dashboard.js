import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

// A simple spinner component
const Spinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Decode user email from JWT for a personalized welcome
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Capitalize the first letter of the user's name
        const name = payload.userId.split('@')[0];
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    } catch (e) { console.error("Failed to parse token"); }

    const fetchNotes = async () => {
      try {
        const response = await api.get('/notes');
        setNotes(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) handleLogout();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotes();
  }, [navigate, handleLogout]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await api.post('/notes', { title, content });
      setNotes([response.data, ...notes]);
      setTitle('');
      setContent('');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create note.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    // Optimistic UI update
    const originalNotes = [...notes];
    setNotes(notes.filter((note) => note._id !== noteId));
    try {
      await api.delete(`/notes/${noteId}`);
    } catch (err) {
      // Revert if API call fails
      setNotes(originalNotes);
      console.error('Failed to delete note', err);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>Welcome, {userName || 'User'}!</h2>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
      
      <div className="dashboard-grid">
        <div className="note-creator">
          <div className="card">
            <h3 style={{fontWeight: 600}}>Add a New Note</h3>
            <form onSubmit={handleCreateNote}>
              <div style={{marginBottom: '1rem'}}>
                <input type="text" placeholder="Note Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div style={{marginBottom: '1.5rem'}}>
                <textarea placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Note'}
              </button>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>
        
        <div className="notes-list">
          {isLoading ? <Spinner /> : 
            notes.length > 0 ? (
              notes.map((note) => (
                <div key={note._id} className="card note-item">
                  <button onClick={() => handleDeleteNote(note._id)} className="btn-delete" title="Delete Note">&times;</button>
                  <h4>{note.title}</h4>
                  <p>{note.content}</p>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div>
                  <h3 style={{fontWeight: 600}}>Your notebook is empty!</h3>
                  <p>Create your first note on the left.</p>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
