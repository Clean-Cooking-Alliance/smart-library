import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document } from '../types';

interface SavedDocumentsContextProps {
  savedDocuments: Document[];
  saveDocument: (document: Document) => void;
}

const SavedDocumentsContext = createContext<SavedDocumentsContextProps | undefined>(undefined);

export const SavedDocumentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedDocuments, setSavedDocuments] = useState<Document[]>([]);

  const saveDocument = (document: Document) => {
    setSavedDocuments((prev) => [...prev, document]);
  };

  return (
    <SavedDocumentsContext.Provider value={{ savedDocuments, saveDocument }}>
      {children}
    </SavedDocumentsContext.Provider>
  );
};

export const useSavedDocuments = () => {
  const context = useContext(SavedDocumentsContext);
  if (!context) {
    throw new Error('useSavedDocuments must be used within a SavedDocumentsProvider');
  }
  return context;
};