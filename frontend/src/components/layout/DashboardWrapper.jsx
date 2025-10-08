import React from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from './DashboardLayout';

/**
 * DashboardWrapper - Automatically wraps components with DashboardLayout
 * based on the current user's role
 */
const DashboardWrapper = ({ 
  children, 
  forceRole = null, 
  activeSection = null,
  onSectionChange = null,
  pageTitle = null,
  showWelcome = false,
  welcomeMessage = null
}) => {
  const { user } = useSelector(state => state.auth);
  
  // Determine user role
  const getUserRole = () => {
    if (forceRole) return forceRole;
    
    if (!user) return 'patient'; // Default fallback
    
    // Check user role from Redux state
    if (user.role) {
      return user.role.toLowerCase();
    }
    
    // Fallback to patient if no role specified
    return 'patient';
  };

  const userRole = getUserRole();
  
  // Generate welcome message if not provided
  const getWelcomeMessage = () => {
    if (welcomeMessage) return welcomeMessage;
    
    const name = user?.profile?.firstName || user?.firstName || 'User';
    const roleMap = {
      'patient': 'Patient',
      'doctor': 'Doctor', 
      'pharmacy': 'Pharmacist',
      'admin': 'Administrator'
    };
    
    return `Welcome back, ${name}! 👋`;
  };

  return (
    <DashboardLayout
      userRole={userRole}
      activeSection={activeSection}
      onSectionChange={onSectionChange}
      pageTitle={pageTitle}
      showWelcome={showWelcome}
      welcomeMessage={getWelcomeMessage()}
    >
      {children}
    </DashboardLayout>
  );
};

export default DashboardWrapper;