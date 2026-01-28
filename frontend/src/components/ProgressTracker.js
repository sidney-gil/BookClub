import React, { useState, useEffect } from 'react';
import { userAPI, bookAPI } from '../services/api';
import './ProgressTracker.css';

function ProgressTracker() {
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [book, setBook] = useState(null);
    const [newChapter, setNewChapter] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const userResponse = await userAPI.getById(userId);
            setCurrentUser(userResponse.data);
            setNewChapter(userResponse.data.currentChapter || 0);

            const usersResponse = await userAPI.getAllUsers();
            setAllUsers(usersResponse.data);

            const bookResponse = await bookAPI.getCurrentBook();
            setBook(bookResponse.data);
        } catch (err) {
            console.error('Failed to load progress data:', err);
        }
    };

    const handleUpdateProgress = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const userId = localStorage.getItem('userId');
            const response = await userAPI.updateProgress(userId, parseInt(newChapter));
            setCurrentUser(response.data);
            
            // Update local storage
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            
            // Refresh all users
            const usersResponse = await userAPI.getAllUsers();
            setAllUsers(usersResponse.data);
            
            alert('Progress updated successfully!');
        } catch (err) {
            console.error('Failed to update progress:', err);
            alert('Failed to update progress. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    const calculateProgress = (currentChapter, totalChapters) => {
        if (!totalChapters) return 0;
        return Math.min(Math.round((currentChapter / totalChapters) * 100), 100);
    };

    return (
        <div className="progress-tracker">
            <h2>Reading Progress</h2>

            <div className="my-progress">
                <h3>My Progress</h3>
                <div className="progress-details">
                    <div className="progress-info">
                        <span className="chapter-label">Current Chapter:</span>
                        <span className="chapter-value">{currentUser?.currentChapter || 0}</span>
                        {book?.totalChapters && (
                            <span className="total-chapters">of {book.totalChapters}</span>
                        )}
                    </div>
                    {book?.totalChapters && (
                        <div className="progress-bar-container">
                            <div 
                                className="progress-bar"
                                style={{
                                    width: `${calculateProgress(currentUser?.currentChapter || 0, book.totalChapters)}%`
                                }}
                            />
                            <span className="progress-percentage">
                                {calculateProgress(currentUser?.currentChapter || 0, book.totalChapters)}%
                            </span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleUpdateProgress} className="update-form">
                    <label>Update your progress:</label>
                    <div className="form-row">
                        <input
                            type="number"
                            min="0"
                            max={book?.totalChapters || 999}
                            value={newChapter}
                            onChange={(e) => setNewChapter(e.target.value)}
                            placeholder="Chapter number"
                        />
                        <button type="submit" disabled={updating}>
                            {updating ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="all-progress">
                <h3>Group Progress</h3>
                <div className="users-list">
                    {allUsers.length === 0 ? (
                        <div className="no-users">No users yet</div>
                    ) : (
                        allUsers.map(user => (
                            <div key={user.id} className="user-progress-item">
                                <div className="user-info">
                                    <span className="user-name">
                                        {user.username}
                                        {user.id === currentUser?.id && (
                                            <span className="you-badge">(You)</span>
                                        )}
                                    </span>
                                    <span className="user-chapter">
                                        Chapter {user.currentChapter || 0}
                                        {book?.totalChapters && ` of ${book.totalChapters}`}
                                    </span>
                                </div>
                                {book?.totalChapters && (
                                    <div className="mini-progress-bar">
                                        <div
                                            className="mini-progress-fill"
                                            style={{
                                                width: `${calculateProgress(user.currentChapter || 0, book.totalChapters)}%`
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProgressTracker;
