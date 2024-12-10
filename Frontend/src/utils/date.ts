// Date formatting utilities
export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString([], { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};