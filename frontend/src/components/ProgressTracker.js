import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ProgressTracker.css';

function ProgressTracker({ totalChapters, currentUserId }) {
    const [users, setUsers] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isExpanded && users.length === 0) {
            fetchAllUsers();
        }
    }, [isExpanded]);

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const getProgressPercentage = (currentChapter) => {
        return ((currentChapter || 0) / (totalChapters || 1)) * 100;
    };

    const getProgressStatus = (currentChapter) => {
        const percentage = getProgressPercentage(currentChapter);
        if (percentage === 0) return 'Not Started';
        if (percentage === 100) return 'Completed';
        return 'In Progress';
    };

    return (
        <div className="progress-tracker">
            <button 
                className="progress-tracker-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="toggle-text">
                    👥 Book Club Progress ({users.length || '...'} readers)
                </span>
                <span className={`toggle-arrow ${isExpanded ? 'expanded' : ''}`}>
                    ▼
                </span>
            </button>

            {isExpanded && (
                <div className="progress-tracker-content">
                    {loading ? (
                        <div className="loading-users">Loading readers...</div>
                    ) : users.length === 0 ? (
                        <div className="no-users">No readers yet</div>
                    ) : (
                        <div className="users-list">
                            {users.map(userItem => (
                                <div 
                                    key={userItem.id} 
                                    className={`user-progress-card ${userItem.id === currentUserId ? 'current-user' : ''}`}
                                >
                                    <div className="user-progress-header">
                                        <div className="user-avatar">
                                            {userItem.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-details">
                                            <div className="user-name">
                                                {userItem.username}
                                                {userItem.id === currentUserId && <span className="you-badge">You</span>}
                                            </div>
                                            <div className="user-chapter">
                                                Chapter {userItem.currentChapter || 0} of {totalChapters}
                                            </div>
                                        </div>
                                        <div className="progress-status">
                                            {getProgressStatus(userItem.currentChapter)}
                                        </div>
                                    </div>
                                    <div className="user-progress-bar">
                                        <div 
                                            className="user-progress-fill"
                                            style={{width: `${getProgressPercentage(userItem.currentChapter)}%`}}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProgressTracker;
