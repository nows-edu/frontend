import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock de usuarios iniciales
export const MOCK_USERS = {
  'carol': {
    id: 'carol',
    name: 'Carol B.G.',
    username: 'carool.bg',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    followers: [],
    following: [],
    visits: []
  },
  '1': {
    id: '1',
    name: 'Aina F.C.',
    username: 'aina.fc',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    followers: [],
    following: [],
    visits: []
  },
  '2': {
    id: '2',
    name: 'Jan G.S.',
    username: 'jan.gs',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    followers: [],
    following: [],
    visits: []
  },
  'u1': {
    id: 'u1',
    name: 'Elena García',
    username: 'elena_g',
    avatarUrl: 'https://i.pravatar.cc/150?u=elena',
    followers: [],
    following: [],
    visits: []
  },
  'u2': {
    id: 'u2',
    name: 'Carlos López',
    username: 'carlos_l',
    avatarUrl: 'https://i.pravatar.cc/150?u=carlos',
    followers: [],
    following: [],
    visits: []
  },
  'u3': {
    id: 'u3',
    name: 'Ana Martínez',
    username: 'ana_m',
    avatarUrl: 'https://i.pravatar.cc/150?u=ana',
    followers: [],
    following: [],
    visits: []
  },
  'u4': {
    id: 'u4',
    name: 'Miguel Torres',
    username: 'miguel_t',
    avatarUrl: 'https://i.pravatar.cc/150?u=miguel',
    followers: [],
    following: [],
    visits: []
  },
  'u5': {
    id: 'u5',
    name: 'Laura Sánchez',
    username: 'laura_s',
    avatarUrl: 'https://i.pravatar.cc/150?u=laura',
    followers: [],
    following: [],
    visits: []
  },
  'u6': {
    id: 'u6',
    name: 'Diego Ruiz',
    username: 'diego_r',
    avatarUrl: 'https://i.pravatar.cc/150?u=diego',
    followers: [],
    following: [],
    visits: []
  },
  'u7': {
    id: 'u7',
    name: 'Sofia Pérez',
    username: 'sofia_p',
    avatarUrl: 'https://i.pravatar.cc/150?u=sofia',
    followers: [],
    following: [],
    visits: []
  },
  'u8': {
    id: 'u8',
    name: 'Javier Morales',
    username: 'javier_m',
    avatarUrl: 'https://i.pravatar.cc/150?u=javier',
    followers: [],
    following: [],
    visits: []
  },
  'u9': {
    id: 'u9',
    name: 'Carmen Flores',
    username: 'carmen_f',
    avatarUrl: 'https://i.pravatar.cc/150?u=carmen',
    followers: [],
    following: [],
    visits: []
  },
  'u10': {
    id: 'u10',
    name: 'Roberto Silva',
    username: 'roberto_s',
    avatarUrl: 'https://i.pravatar.cc/150?u=roberto',
    followers: [],
    following: [],
    visits: []
  },
};

export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  followers: string[];
  following: string[];
  visits: string[];
};

class FollowService {
  async allUsers(): Promise<Record<string, User>> {
    return this.getUsers();
  }

  private async getUsers(): Promise<Record<string, User>> {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      if (!usersJson) {
        await AsyncStorage.setItem('users', JSON.stringify(MOCK_USERS));
        return MOCK_USERS;
      }
      return JSON.parse(usersJson);
    } catch (error) {
      console.error('Error getting users:', error);
      return MOCK_USERS;
    }
  }

  private async saveUsers(users: Record<string, User>): Promise<void> {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  async followUser(followerId: string, followedId: string): Promise<void> {
    const users = await this.getUsers();
    
    // Actualizar seguidores del usuario seguido
    if (!users[followedId].followers.includes(followerId)) {
      users[followedId].followers.push(followerId);
    }
    
    // Actualizar seguidos del usuario que sigue
    if (!users[followerId].following.includes(followedId)) {
      users[followerId].following.push(followedId);
    }
    
    await this.saveUsers(users);
  }

  async unfollowUser(followerId: string, followedId: string): Promise<void> {
    const users = await this.getUsers();
    
    // Remover de seguidores
    users[followedId].followers = users[followedId].followers.filter(id => id !== followerId);
    
    // Remover de seguidos
    users[followerId].following = users[followerId].following.filter(id => id !== followedId);
    
    await this.saveUsers(users);
  }

  async getFollowers(userId: string): Promise<User[]> {
    const users = await this.getUsers();
    const user = users[userId];
    return user.followers.map(id => users[id]);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const users = await this.getUsers();
    const user = users[userId];
    return user.following.map(id => users[id]);
  }

  async isFollowing(followerId: string, followedId: string): Promise<boolean> {
    const users = await this.getUsers();
    return users[followerId].following.includes(followedId);
  }

  async getUserStats(userId: string): Promise<{ followers: number; following: number; visits: number }> {
    const users = await this.getUsers();
    const user = users[userId];
    return {
      followers: user.followers.length,
      following: user.following.length,
      visits: user.visits.length
    };
  }

  async recordVisit(visitorId: string, visitedId: string): Promise<void> {
    const users = await this.getUsers();
    
    // Añadir visita solo si no es el mismo usuario
    if (visitorId !== visitedId) {
      const visits = users[visitedId].visits;
      // Mantener solo las últimas 100 visitas y añadir la nueva al principio
      visits.unshift(visitorId);
      users[visitedId].visits = visits.slice(0, 100);
      await this.saveUsers(users);
    }
  }

  async getVisits(userId: string): Promise<User[]> {
    const users = await this.getUsers();
    const user = users[userId];
    // Obtener usuarios únicos de las visitas
    const uniqueVisits = [...new Set(user.visits)];
    return uniqueVisits.map(id => users[id]);
  }
}

export const followService = new FollowService();
