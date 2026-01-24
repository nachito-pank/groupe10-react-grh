import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavigationContextType {
    currentPage: string;
    navigateTo: (page: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentPage, setCurrentPage] = useState('landing');

    // Listen to hash changes for navigation
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1) || 'landing';
            setCurrentPage(hash);
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigateTo = (page: string) => {
        window.location.hash = page;
        setCurrentPage(page);
    };

    return (
        <NavigationContext.Provider value={{ currentPage, navigateTo }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within NavigationProvider');
    }
    return context;
};
