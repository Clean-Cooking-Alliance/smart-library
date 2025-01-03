// import React, { createContext, useContext, useState } from 'react';

// interface Document {
//   document_id: number;
//   title: string;
//   summary: string;
//   source_url: string;
//   tags: Tag[];
// }

// interface SavedDocumentsContextType {
//   savedDocuments: Document[];
//   saveDocument: (document: Document) => void;
//   unsaveDocument: (document_id: number) => void;
// }

// const SavedDocumentsContext = createContext<SavedDocumentsContextType | undefined>(undefined);

// export const SavedDocumentsProvider: React.FC = ({ children }) => {
//   const [savedDocuments, setSavedDocuments] = useState<Document[]>([]);

//   const saveDocument = (document: Document) => {
//     setSavedDocuments((prev) => [...prev, document]);
//   };

//   const unsaveDocument = (document_id: number) => {
//     setSavedDocuments((prev) => prev.filter(doc => doc.document_id !== document_id));
//   };

//   return (
//     <SavedDocumentsContext.Provider value={{ savedDocuments, saveDocument, unsaveDocument }}>
//       {children}
//     </SavedDocumentsContext.Provider>
//   );
// };

// export const useSavedDocuments = () => {
//   const context = useContext(SavedDocumentsContext);
//   if (!context) {
//     throw new Error('useSavedDocuments must be used within a SavedDocumentsProvider');
//   }
//   return context;
// };