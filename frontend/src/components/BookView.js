import React, { useState, useEffect } from 'react';
import api from '../services/api';
import WeekDropdown from './WeekDropdown';
import ProgressTracker from './ProgressTracker';
import './BookView.css';
import bookCover from '../assets/BookImage.jpg';

function BookView() {
    const [book, setBook] = useState(null);
    const [weeks, setWeeks] = useState([]);
    const [expandedWeek, setExpandedWeek] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        }
        fetchCurrentBook();
    }, []);

    const fetchCurrentBook = async () => {
        try {
            setLoading(true);
            const response = await api.get('/books/current');
            setBook(response.data);
            fetchWeeks(response.data.id);
        } catch (err) {
            setError('No active book found. Please contact an administrator to set up a book.');
            console.error('Error fetching book:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWeeks = async (bookId) => {
        try {
            const response = await api.get(`/books/${bookId}/weeks`);
            setWeeks(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching weeks:', err);
            setWeeks([]);
        }
    };

    const toggleWeek = (weekId) => {
        setExpandedWeek(expandedWeek === weekId ? null : weekId);
    };

    const updateProgress = async (chapterNumber) => {
        if (!user) return;
        
        try {
            const response = await api.put(`/users/${user.id}/progress`, {
                currentChapter: chapterNumber
            });
            
            const updatedUser = { ...user, currentChapter: response.data.currentChapter };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        } catch (err) {
            console.error('Error updating progress:', err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="book-view">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="book-view">
            <div className="magical-header">
                <div className="header-content">
                    <div className="user-info">
                        <span className="welcome-text">✨ Welcome, {user?.username}! ✨</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </div>
            
            {error ? (
                <div className="error-container">
                    <h2>Welcome to Book Club!</h2>
                    <p>{error}</p>
                    <p>Your account has been created successfully.</p>
                </div>
            ) : (
                <>
                    <div className="book-hero">
                        <div className="book-cover-container">
                            <a href="/book.pdf" target="_blank" rel="noopener noreferrer" style={{display: 'block'}}>
                                <img src={bookCover} alt="Book Cover" className="book-cover" style={{cursor: 'pointer'}} />
                            </a>
                            <div className="book-glow"></div>
                        </div>
                        <div className="book-details">
                            <h1 className="book-title">{book?.title}</h1>
                            <p className="book-author">by {book?.author}</p>
                            <div className="book-stats">
                                <span className="stat">☰ {book?.totalChapters} Chapters</span>
                                <span className="stat">✓ Active Reading</span>
                            </div>
                            {user && (
                                <div className="progress-indicator">
                                    <div className="progress-text">
                                        Reading Chapter {user.currentChapter || 1} of {book?.totalChapters}
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{width: `${((user.currentChapter || 0) / (book?.totalChapters || 1)) * 100}%`}}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="weeks-container">
                        <ProgressTracker 
                            totalChapters={book?.totalChapters}
                            currentUserId={user?.id}
                        />
                        <h2 className="section-title">Reading Schedule</h2>
                        {!weeks || weeks.length === 0 ? (
                            <div className="no-weeks">
                                <p>✨ No weeks scheduled yet for this book ✨</p>
                            </div>
                        ) : (
                            weeks.map(week => (
                                <WeekDropdown 
                                    key={week.id}
                                    week={week}
                                    isExpanded={expandedWeek === week.id}
                                    onToggle={() => toggleWeek(week.id)}
                                    currentChapter={user?.currentChapter || 0}
                                    onProgressUpdate={updateProgress}
                                />
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default BookView;