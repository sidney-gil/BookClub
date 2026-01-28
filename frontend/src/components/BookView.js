import React, { useState, useEffect } from 'react';
import api from '../services/api';
import WeekDropdown from './WeekDropdown';

function BookView() {
    const [book, setBook] = useState(null);
    const [weeks, setWeeks] = useState([]);
    const [expandedWeek, setExpandedWeek] = useState(null);

    useEffect(() => {
        fetchCurrentBook();
    }, []);

    const fetchCurrentBook = async () => {
        const response = await api.get('/books/current');
        setBook(response.data);
        fetchWeeks(response.data.id);
    };

    const fetchWeeks = async (bookId) => {
        const response = await api.get(`/books/${bookId}/weeks`);
        setWeeks(response.data);
    };

    const toggleWeek = (weekId) => {
        setExpandedWeek(expandedWeek === weekId ? null : weekId);
    };

    return (
        <div className="book-view">
            <h1>{book?.title}</h1>
            <div className="weeks-container">
                {weeks.map(week => (
                    <WeekDropdown 
                        key={week.id}
                        week={week}
                        isExpanded={expandedWeek === week.id}
                        onToggle={() => toggleWeek(week.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default BookView;