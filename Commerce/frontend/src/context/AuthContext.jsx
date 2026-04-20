import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('name');
        const role = localStorage.getItem('role');
        if (token && name && role) {
            setUser({ token, name, role });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/authenticate', { email, password });
        const { token, name, role } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('name', name);
        localStorage.setItem('role', role);
        setUser({ token, name, role });
    };

    const register = async (name, email, password, isSeller = false, sellerData = {}) => {
        const payload = { 
            name, 
            email, 
            password, 
            isSeller,
            ...sellerData 
        };
        const response = await api.post('/auth/register', payload);
        const { token, role, sellerStatus } = response.data;
        const resName = response.data.name;
        localStorage.setItem('token', token);
        localStorage.setItem('name', resName);
        localStorage.setItem('role', role);
        localStorage.setItem('sellerStatus', sellerStatus);
        setUser({ token, name: resName, role, sellerStatus });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
