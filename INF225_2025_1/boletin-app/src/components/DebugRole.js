import React from 'react';
import { useAuth } from '../context';
import styled from 'styled-components';

const DebugContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 12px;
  max-width: 300px;
  z-index: 9999;
  border: 2px solid #333;
`;

const DebugTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #4CAF50;
  font-size: 14px;
`;

const DebugItem = styled.div`
  margin: 5px 0;
  padding: 3px 0;
  border-bottom: 1px solid #333;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DebugLabel = styled.span`
  color: #FFC107;
  font-weight: bold;
`;

const DebugValue = styled.span`
  color: #E3F2FD;
  margin-left: 8px;
`;

const DebugRole = () => {
  const { currentUser, userProfile, session, loading } = useAuth();
  
  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <DebugContainer>
      <DebugTitle>🐛 Debug Auth Info</DebugTitle>
      
      <DebugItem>
        <DebugLabel>Loading:</DebugLabel>
        <DebugValue>{loading ? 'true' : 'false'}</DebugValue>
      </DebugItem>
      
      <DebugItem>
        <DebugLabel>Session:</DebugLabel>
        <DebugValue>{session ? 'active' : 'none'}</DebugValue>
      </DebugItem>
      
      <DebugItem>
        <DebugLabel>User ID:</DebugLabel>
        <DebugValue>{currentUser?.id ? currentUser.id.substring(0, 8) + '...' : 'none'}</DebugValue>
      </DebugItem>
      
      <DebugItem>
        <DebugLabel>Email:</DebugLabel>
        <DebugValue>{currentUser?.email || 'none'}</DebugValue>
      </DebugItem>
      
      <DebugItem>
        <DebugLabel>Metadata Role:</DebugLabel>
        <DebugValue>{currentUser?.user_metadata?.role || 'none'}</DebugValue>
      </DebugItem>
      
      <DebugItem>
        <DebugLabel>Metadata Username:</DebugLabel>
        <DebugValue>{currentUser?.user_metadata?.username || 'none'}</DebugValue>
      </DebugItem>
      
      <DebugItem>
        <DebugLabel>Profile Username:</DebugLabel>
        <DebugValue>{userProfile?.username || 'none'}</DebugValue>
      </DebugItem>
      
      <DebugItem>
        <DebugLabel>Profile Role:</DebugLabel>
        <DebugValue style={{ 
          color: userProfile?.role === 'administrador' ? '#4CAF50' : 
                userProfile?.role === 'usuario-privado' ? '#FF9800' : 
                userProfile?.role === 'usuario-publico' ? '#2196F3' : '#F44336'
        }}>
          {userProfile?.role || 'none'}
        </DebugValue>
      </DebugItem>
      
      <DebugItem>
        <DebugLabel>Email Confirmed:</DebugLabel>
        <DebugValue>{currentUser?.email_confirmed_at ? 'yes' : 'no'}</DebugValue>
      </DebugItem>
      
      {currentUser && (
        <DebugItem>
          <DebugLabel>Created:</DebugLabel>
          <DebugValue>
            {new Date(currentUser.created_at).toLocaleTimeString()}
          </DebugValue>
        </DebugItem>
      )}
    </DebugContainer>
  );
};

export default DebugRole;
