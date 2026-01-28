import React, { useState, useEffect } from 'react';
import { commentAPI } from '../services/api';
import './ChapterComments.css';

function ChapterComments({ chapter }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [chapter.id]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await commentAPI.getByChapter(chapter.id);
            setComments(response.data);
        } catch (err) {
            console.error('Failed to load comments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userId = localStorage.getItem('userId');

        setSubmitting(true);
        try {
            const commentData = {
                content: newComment,
                chapter: { id: chapter.id },
                user: { id: parseInt(userId) }
            };

            const response = await commentAPI.create(commentData);
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (err) {
            console.error('Failed to post comment:', err);
            alert('Failed to post comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await commentAPI.delete(commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
            alert('Failed to delete comment. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const currentUserId = parseInt(localStorage.getItem('userId'));

    return (
        <div className="chapter-comments">
            <div className="comment-form">
                <h4>Share Your Thoughts</h4>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="What did you think about this chapter?"
                        rows="4"
                        disabled={submitting}
                    />
                    <button type="submit" disabled={submitting || !newComment.trim()}>
                        {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            </div>

            <div className="comments-list">
                <h4>Discussion ({comments.length})</h4>
                {loading ? (
                    <div className="loading-comments">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="no-comments">
                        Be the first to share your thoughts on this chapter!
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <span className="comment-author">
                                    {comment.user?.username || 'Anonymous'}
                                </span>
                                <div className="comment-meta">
                                    <span className="comment-date">
                                        {formatDate(comment.createdAt)}
                                    </span>
                                    {comment.user?.id === currentUserId && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="delete-btn"
                                            title="Delete comment"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="comment-content">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ChapterComments;
