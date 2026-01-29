import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
console.log('API Base URL:', API_BASE_URL);
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add authentication token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (username && password) {
            // Basic Auth
            const credentials = btoa(`${username}:${password}`);
            config.headers.Authorization = `Basic ${credentials}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// API Methods
export const bookAPI = {
    getCurrentBook: () => api.get('/books/current'),
    getWeeks: (bookId) => api.get(`/books/${bookId}/weeks`),
    createBook: (book) => api.post('/books', book),
    setActiveBook: (bookId) => api.put(`/books/${bookId}/activate`),
};

export const weekAPI = {
    getChapters: (weekId) => api.get(`/chapters/week/${weekId}`),
    getWeeksByBook: (bookId) => api.get(`/weeks/book/${bookId}`),
    createWeek: (week) => api.post('/weeks', week),
};

export const commentAPI = {
    getByChapter: (chapterId) => api.get(`/comments/chapter/${chapterId}`),
    create: (comment) => api.post('/comments', comment),
    update: (id, content) => api.put(`/comments/${id}`, content),
    delete: (id) => api.delete(`/comments/${id}`),
};

export const authAPI = {
    login: (username, password) => api.post('/users/login', { username, password }),
    register: (user) => api.post('/users/register', user),
};

export const userAPI = {
    getAllUsers: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    getByUsername: (username) => api.get(`/users/username/${username}`),
    create: (user) => api.post('/users', user),
    update: (id, user) => api.put(`/users/${id}`, user),
    updateProgress: (id, chapterNumber) => api.put(`/users/${id}/progress/${chapterNumber}`),
};

export const questionAPI = {
    getByWeek: (weekId) => api.get(`/questions/week/${weekId}`),
    getAnswers: (questionId) => api.get(`/answers/question/${questionId}`),
    create: (question) => api.post('/questions', question),
    submitAnswer: (answer) => api.post('/answers', answer),
    update: (id, questionText) => api.put(`/questions/${id}`, questionText),
    delete: (id) => api.delete(`/questions/${id}`),
};

export default api;
