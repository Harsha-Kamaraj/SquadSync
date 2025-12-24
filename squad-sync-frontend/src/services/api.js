const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('squadSyncToken');
const setToken = (token) => localStorage.setItem('squadSyncToken', token);
const removeToken = () => localStorage.removeItem('squadSyncToken');

export async function signUp(userData) {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  if (data.token) {
    setToken(data.token);
  }

  return data;
}

export async function signIn(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  if (data.token) {
    setToken(data.token);
  }

  return data.user;
}

export async function getCurrentUser() {
  const token = getToken();
  
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      removeToken();
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (err) {
    removeToken();
    return null;
  }
}

export function logout() {
  removeToken();
}

export async function fetchMessages(filterType = 'All', userId = null) {
  let url = `${API_BASE}/posts?filterType=${filterType}`;
  
  if (userId && filterType === 'Created By Me') {
    url += `&userId=${userId}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch posts');
  }

  return data.posts || [];
}

export async function sendBroadcast(postData) {
  const token = getToken();
  
  if (!token) {
    throw new Error('You must be logged in to create a post');
  }

  const response = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(postData)
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create post');
  }

  return data.post;
}

export async function contactAuthor(postId) {
  const token = getToken();
  
  if (!token) {
    throw new Error('You must be logged in to express interest');
  }

  const response = await fetch(`${API_BASE}/posts/${postId}/interest`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to send interest');
  }

  return data;
}

export async function updateProfile(profileData) {
  const token = getToken();
  
  if (!token) {
    throw new Error('You must be logged in to update profile');
  }

  const response = await fetch(`${API_BASE}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }

  return data.user;
}

export async function getUserStats() {
  const token = getToken();
  
  if (!token) {
    throw new Error('You must be logged in to view stats');
  }

  const response = await fetch(`${API_BASE}/users/stats/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch stats');
  }

  return data.stats;
}

export async function markPostAsFound(postId) {
  const token = getToken();
  
  if (!token) {
    throw new Error('You must be logged in to mark posts');
  }

  const response = await fetch(`${API_BASE}/posts/${postId}/mark-found`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to mark post');
  }

  return data;
}

export async function deletePost(postId) {
  const token = getToken();
  
  if (!token) {
    throw new Error('You must be logged in to delete posts');
  }

  const response = await fetch(`${API_BASE}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete post');
  }

  return data;
}

export { getToken, setToken, removeToken };