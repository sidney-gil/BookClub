import React, { useState, useEffect } from 'react';
import { weekAPI } from '../services/api';
import ChapterComments from './ChapterComments';
import WeeklyQuestion from './WeeklyQuestion';
import './WeekDropdown.css';
import { BsChatSquareHeart } from "react-icons/bs";

function WeekDropdown({ week, isExpanded, onToggle, currentChapter, onProgressUpdate }) {
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);

    useEffect(() => {
        if (isExpanded && chapters.length === 0) {
            fetchChapters();
        }
    }, [isExpanded]);

    const fetchChapters = async () => {
        setLoading(true);
        try {
            const response = await weekAPI.getChapters(week.id);
            setChapters(response.data);
        } catch (err) {
            console.error('Failed to load chapters:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleChapterClick = (chapter) => {
        if (selectedChapter?.id === chapter.id) {
            setSelectedChapter(null);
        } else {
            setSelectedChapter(chapter);
            setShowQuestions(false);
        }
    };

    const markChapterComplete = (chapterNumber, e) => {
        e.stopPropagation();
        if (onProgressUpdate) {
            onProgressUpdate(chapterNumber);
        }
    };

    const isChapterComplete = (chapterNumber) => {
        return currentChapter >= chapterNumber;
    };

    return (
        <div className="week-dropdown">
            <div className="week-header" onClick={onToggle}>
                <div className="week-info">
                    <h3>Week {week.weekNumber}: {week.title}</h3>
                    <span className="week-dates">
                        {formatDate(week.startDate)} - {formatDate(week.endDate)}
                    </span>
                </div>
                <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
            </div>

            {isExpanded && (
                <div className="week-content">
                    <div className="week-actions">
                        <button
                            className={`action-btn ${showQuestions ? 'active' : ''}`}
                            onClick={() => {
                                setShowQuestions(!showQuestions);
                                setSelectedChapter(null);
                            }}
                        >
                            Weekly Questions
                        </button>
                    </div>

                    {showQuestions ? (
                        <WeeklyQuestion weekId={week.id} />
                    ) : (
                        <>
                            {loading ? (
                                <div className="loading-chapters">Loading chapters...</div>
                            ) : chapters.length === 0 ? (
                                <div className="no-chapters">No chapters assigned yet</div>
                            ) : (
                                <div className="chapters-list">
                                    {chapters.map(chapter => (
                                        <div key={chapter.id} className="chapter-item">
                                            <div
                                                className={`chapter-header ${selectedChapter?.id === chapter.id ? 'active' : ''} ${isChapterComplete(chapter.chapterNumber) ? 'completed' : ''}`}
                                                onClick={() => handleChapterClick(chapter)}
                                            >
                                                <div className="chapter-title-wrapper">
                                                    <button
                                                        className={`chapter-checkbox ${isChapterComplete(chapter.chapterNumber) ? 'checked' : ''}`}
                                                        onClick={(e) => markChapterComplete(chapter.chapterNumber, e)}
                                                        title={isChapterComplete(chapter.chapterNumber) ? 'Mark as unread' : 'Mark as complete'}
                                                    >
                                                        {isChapterComplete(chapter.chapterNumber) ? '✓' : ''}
                                                    </button>
                                                    <span className="chapter-title">
                                                        Chapter {chapter.chapterNumber}{chapter.title ? `: ${chapter.title}` : ''}
                                                    </span>
                                                </div>
                                                <div className="chapter-meta">
                                                    {chapter.comments && chapter.comments.length > 0 && (
                                                        <span className="comment-count">
                                                            <BsChatSquareHeart /> {chapter.comments.length}
                                                        </span>
                                                    )}
                                                    <span className="chapter-arrow">
                                                        {selectedChapter?.id === chapter.id ? '▲' : '▼'}
                                                    </span>
                                                </div>
                                            </div>
                                            {selectedChapter?.id === chapter.id && (
                                                <ChapterComments chapter={chapter} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default WeekDropdown;
