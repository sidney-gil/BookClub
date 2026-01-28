import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import BookView from './components/BookView';
import Settings from './components/Settings';
import './App.css';

function App() {
    const PrivateRoute = ({ children }) => {
        const userId = localStorage.getItem('userId');
        return userId ? children : <Navigate to="/login" />;
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route 
                        path="/" 
                        element={
                            <PrivateRoute>
                                <BookView />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/settings" 
                        element={
                            <PrivateRoute>
                                <Settings />
                            </PrivateRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;