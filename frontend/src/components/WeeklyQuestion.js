import React, { useState, useEffect } from 'react';
import { questionAPI } from '../services/api';
import './WeeklyQuestion.css';

function WeeklyQuestion({ weekId }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [newAnswer, setNewAnswer] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [weekId]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await questionAPI.getByWeek(weekId);
            setQuestions(response.data);
            
            // Fetch answers for each question
            for (const question of response.data) {
                await fetchAnswers(question.id);
            }
        } catch (err) {
            console.error('Failed to load questions:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnswers = async (questionId) => {
        try {
            const response = await questionAPI.getAnswers(questionId);
            setAnswers(prev => ({
                ...prev,
                [questionId]: response.data
            }));
        } catch (err) {
            console.error('Failed to load answers:', err);
        }
    };

    const handleSubmitAnswer = async (questionId) => {
        const answerText = newAnswer[questionId];
        if (!answerText?.trim()) return;

        const userId = localStorage.getItem('userId');
        setSubmitting(true);

        try {
            const answerData = {
                answer: answerText,
                question: { id: questionId },
                user: { id: parseInt(userId) }
            };

            await questionAPI.submitAnswer(answerData);
            
            // Refresh answers
            await fetchAnswers(questionId);
            
            // Clear input
            setNewAnswer(prev => ({
                ...prev,
                [questionId]: ''
            }));
        } catch (err) {
            console.error('Failed to submit answer:', err);
            alert('Failed to submit answer. Please try again.');
        } finally {
            setSubmitting(false);
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

    if (loading) {
        return <div className="loading-questions">Loading questions...</div>;
    }

    if (questions.length === 0) {
        return (
            <div className="no-questions">
                No questions for this week yet. Check back soon!
            </div>
        );
    }

    return (
        <div className="weekly-questions">
            {questions.map(question => {
                const questionAnswers = answers[question.id] || [];
                const userAnswer = questionAnswers.find(a => a.user?.id === currentUserId);
                
                return (
                    <div key={question.id} className="question-block">
                        <div className="question-content">
                            <h4>Discussion Question</h4>
                            <p className="question-text">{question.question}</p>
                        </div>

                        <div className="answer-section">
                            {!userAnswer ? (
                                <div className="answer-form">
                                    <h5>Your Answer</h5>
                                    <textarea
                                        value={newAnswer[question.id] || ''}
                                        onChange={(e) => setNewAnswer(prev => ({
                                            ...prev,
                                            [question.id]: e.target.value
                                        }))}
                                        placeholder="Share your thoughts..."
                                        rows="4"
                                        disabled={submitting}
                                    />
                                    <button
                                        onClick={() => handleSubmitAnswer(question.id)}
                                        disabled={submitting || !newAnswer[question.id]?.trim()}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Answer'}
                                    </button>
                                </div>
                            ) : (
                                <div className="your-answer">
                                    <h5>Your Answer</h5>
                                    <div className="answer-item your-answer-item">
                                        <div className="answer-header">
                                            <span className="answer-author">You</span>
                                            <span className="answer-date">
                                                {formatDate(userAnswer.createdAt)}
                                            </span>
                                        </div>
                                        <p className="answer-text">{userAnswer.answer}</p>
                                    </div>
                                </div>
                            )}

                            <div className="all-answers">
                                <h5>Other Answers ({questionAnswers.filter(a => a.user?.id !== currentUserId).length})</h5>
                                {questionAnswers.filter(a => a.user?.id !== currentUserId).length === 0 ? (
                                    <div className="no-answers">
                                        No one else has answered yet. Be the first!
                                    </div>
                                ) : (
                                    <div className="answers-list">
                                        {questionAnswers
                                            .filter(a => a.user?.id !== currentUserId)
                                            .map(answer => (
                                                <div key={answer.id} className="answer-item">
                                                    <div className="answer-header">
                                                        <span className="answer-author">
                                                            {answer.user?.username || 'Anonymous'}
                                                        </span>
                                                        <span className="answer-date">
                                                            {formatDate(answer.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="answer-text">{answer.answer}</p>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default WeeklyQuestion;
