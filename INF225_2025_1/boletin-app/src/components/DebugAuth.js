import React from 'react';
import { useAuth } from '../context';

const DebugAuth = () => {
  const { currentUser, userProfile, session, loading, error } = useAuth();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px', 
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Debug Auth Info</h4>
      <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
      <p><strong>Error:</strong> {error || 'none'}</p>
      <p><strong>Current User:</strong> {currentUser ? 'exists' : 'null'}</p>
      {currentUser && (
        <div>
          <p><strong>User ID:</strong> {currentUser.id}</p>
          <p><strong>User Email:</strong> {currentUser.email}</p>
        </div>
      )}
      <p><strong>User Profile:</strong> {userProfile ? 'exists' : 'null'}</p>
      {userProfile && (
        <div>
          <p><strong>Username:</strong> {userProfile.username}</p>
          <p><strong>Role:</strong> {userProfile.role}</p>
        </div>
      )}
      <p><strong>Session:</strong> {session ? 'exists' : 'null'}</p>
    </div>
  );
};

export default DebugAuth;
