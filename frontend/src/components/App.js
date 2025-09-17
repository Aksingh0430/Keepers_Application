// frontend/src/components/App.js

import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

// New API_BASE_URL declaration to force a new Vercel build
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notes from backend on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/notes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      
      const data = await response.json();
      setNotes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (newNote) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const createdNote = await response.json();
      setNotes(prevNotes => [createdNote, ...prevNotes]);
      setError(null);
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note. Please try again.');
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note. Please try again.');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading notes...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          margin: '10px',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {error}
          <button 
            onClick={fetchNotes}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Retry
          </button>
        </div>
      )}
      
      <CreateArea onAdd={addNote} />
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '20px' }}>
        {notes.length === 0 ? (
          <p style={{ textAlign: 'center', width: '100%' }}>
            No notes yet. Create your first note above!
          </p>
        ) : (
          notes.map(note => (
            <Note
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              onDelete={deleteNote}
            />
          ))
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
