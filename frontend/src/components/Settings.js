import React, { useState } from 'react';
import api from '../services/api';
import './Settings.css';

function Settings() {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });
    
    const [usernameForm, setUsernameForm] = useState({
        newUsername: user?.username || ''
    });
    
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleUsernameUpdate = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        
        if (usernameForm.newUsername === user.username) {
            setMessage({ text: 'Username is the same as current username', type: 'error' });
            return;
        }
        
        setLoading(true);
        try {
            const response = await api.put(`/users/${user.id}/username`, {
                username: usernameForm.newUsername
            });
            
            const updatedUser = response.data;
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            setMessage({ text: 'Username updated successfully!', type: 'success' });
        } catch (err) {
            setMessage({ 
                text: err.response?.data?.message || 'Failed to update username. It may already be taken.', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ text: 'New passwords do not match', type: 'error' });
            return;
        }
        
        if (passwordForm.newPassword.length < 6) {
            setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
            return;
        }
        
        setLoading(true);
        try {
            await api.put(`/users/${user.id}/password`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            setMessage({ text: 'Password updated successfully!', type: 'success' });
        } catch (err) {
            setMessage({ 
                text: err.response?.data?.message || 'Failed to update password. Check your current password.', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToBook = () => {
        window.location.href = '/';
    };

    if (!user) {
        return (
            <div className="settings-container">
                <div className="settings-error">Please log in to access settings</div>
            </div>
        );
    }

    return (
        <div className="settings-container">
            <div className="settings-header">
                <button onClick={handleBackToBook} className="back-btn">
                    ← Back to Book Club
                </button>
                <h1>Account Settings</h1>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="settings-content">
                <div className="settings-card">
                    <h2>Update Username</h2>
                    <form onSubmit={handleUsernameUpdate}>
                        <div className="form-group">
                            <label>Current Username</label>
                            <input
                                type="text"
                                value={user.username}
                                disabled
                                className="disabled-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>New Username</label>
                            <input
                                type="text"
                                value={usernameForm.newUsername}
                                onChange={(e) => setUsernameForm({ newUsername: e.target.value })}
                                required
                                minLength="3"
                                placeholder="Enter new username"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? 'Updating...' : 'Update Username'}
                        </button>
                    </form>
                </div>

                {/* <div className="settings-card"> 
                    <h2>Change Password</h2>
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                required
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                required
                                minLength="6"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                required
                                minLength="6"
                                placeholder="Confirm new password"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? 'Updating...' : 'Change Password'}
                        </button>
                    </form>
                </div> */}
            </div>
        </div>
    );
}

export default Settings;
