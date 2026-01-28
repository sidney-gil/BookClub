import React, { useState, useEffect } from 'react';
import api from '../services/api';
import WeekDropdown from './WeekDropdown';

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
            setWeeks(response.data);
        } catch (err) {
            console.error('Error fetching weeks:', err);
        }
    };

    const toggleWeek = (weekId) => {
        setExpandedWeek(expandedWeek === weekId ? null : weekId);
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
            <div className="header">
                <div className="user-info">
                    <span>Welcome, {user?.username}!</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
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
                    <h1>{book?.title}</h1>
                    <p className="book-author">by {book?.author}</p>
                    <div className="weeks-container">
                        {weeks.length === 0 ? (
                            <p>No weeks scheduled yet for this book.</p>
                        ) : (
                            weeks.map(week => (
                                <WeekDropdown 
                                    key={week.id}
                                    week={week}
                                    isExpanded={expandedWeek === week.id}
                                    onToggle={() => toggleWeek(week.id)}
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