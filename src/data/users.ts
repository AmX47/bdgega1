interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

const defaultAvatar = "https://i.postimg.cc/VvRHKt3X/default-avatar.png";

export const users: User[] = [];

export const addUser = (user: Omit<User, 'id' | 'createdAt'>): User => {
  const newUser = {
    ...user,
    id: String(users.length + 1),
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};

export const updateUser = (email: string, updates: Partial<User>) => {
  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
    return users[userIndex];
  }
  return null;
};

export const findUser = (username: string, password: string): User | undefined => {
  return users.find(u => u.username === username && u.password === password);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find(u => u.email === email);
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    return { ...user };
  }
  return null;
};

// Load users from localStorage on startup
const loadUsers = () => {
  const savedUsers = localStorage.getItem('users');
  if (savedUsers) {
    users.push(...JSON.parse(savedUsers));
  }
};

loadUsers();
