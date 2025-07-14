import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminShortcut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Shift+A (Windows/Linux) or Cmd+Shift+A (Mac)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        
        // Check if already authenticated
        const adminAuth = sessionStorage.getItem('admin_authenticated');
        if (adminAuth === 'true') {
          navigate('/admin');
          return;
        }

        // Prompt for admin password
        const password = prompt('Enter admin password:');
        if (password) {
          // Use the same default password as AdminLayout
          const adminPassword = 'admin123'; // This should match AdminLayout
          
          if (password === adminPassword) {
            sessionStorage.setItem('admin_authenticated', 'true');
            navigate('/admin');
          } else {
            alert('Invalid admin password');
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
};

export default useAdminShortcut;