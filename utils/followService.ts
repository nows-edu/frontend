import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  followers: string[];
  following: string[];
  visits: string[];
};

type Users = {
  [key: string]: User;
};

// Mock de usuarios iniciales
export const MOCK_USERS: Users = {
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

// Interface has been moved to the top of the file

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

  async getFollowStatus(targetUserId: string): Promise<boolean> {
    try {
      const currentUserId = await AsyncStorage.getItem('currentUserId') || 'carol';
      const currentUser = MOCK_USERS[currentUserId];
      return currentUser.following.includes(targetUserId);
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }

  async followUser(targetUserId: string): Promise<void> {
    try {
      const currentUserId = await AsyncStorage.getItem('currentUserId') || 'carol';
      const currentUser = MOCK_USERS[currentUserId];
      if (!currentUser.following.includes(targetUserId)) {
        currentUser.following.push(targetUserId);
        MOCK_USERS[targetUserId].followers.push(currentUserId);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  }

  async unfollowUser(targetUserId: string): Promise<void> {
    try {
      const currentUserId = await AsyncStorage.getItem('currentUserId') || 'carol';
      const currentUser = MOCK_USERS[currentUserId];
      currentUser.following = currentUser.following.filter(id => id !== targetUserId);
      MOCK_USERS[targetUserId].followers = MOCK_USERS[targetUserId].followers.filter(id => id !== currentUserId);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  }

  async getFollowers(userId: string): Promise<User[]> {
    try {
      const users = await this.getUsers();
      const user = users[userId];
      if (!user) return [];
      return user.followers.map(id => users[id]).filter(Boolean);
    } catch (error) {
      console.error('Error getting followers:', error);
      return [];
    }
  }

  async getFollowing(userId: string): Promise<User[]> {
    try {
      const users = await this.getUsers();
      const user = users[userId];
      if (!user) return [];
      return user.following.map(id => users[id]).filter(Boolean);
    } catch (error) {
      console.error('Error getting following:', error);
      return [];
    }
  }

  async isFollowing(followerId: string, followedId: string): Promise<boolean> {
    try {
      const users = await this.getUsers();
      const follower = users[followerId];
      if (!follower) return false;
      return follower.following.includes(followedId);
    } catch (error) {
      console.error('Error checking following status:', error);
      return false;
    }
  }

  async getUserStats(userId: string): Promise<{ followers: number; following: number; visits: number }> {
    try {
      const users = await this.getUsers();
      const user = users[userId];
      if (!user) {
        return { followers: 0, following: 0, visits: 0 };
      }
      return {
        followers: user.followers.length,
        following: user.following.length,
        visits: user.visits.length
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { followers: 0, following: 0, visits: 0 };
    }
  }

  async recordVisit(visitorId: string, visitedId: string): Promise<void> {
    try {
      const users = await this.getUsers();
      const visitor = users[visitorId];
      const visited = users[visitedId];
      
      // Verificar que ambos usuarios existen y no son el mismo
      if (!visitor || !visited || visitorId === visitedId) return;

      const visits = visited.visits;
      // Mantener solo las últimas 100 visitas y añadir la nueva al principio
      visits.unshift(visitorId);
      visited.visits = visits.slice(0, 100);
      await this.saveUsers(users);
    } catch (error) {
      console.error('Error recording visit:', error);
    }
  }

  async getVisits(userId: string): Promise<User[]> {
    try {
      const users = await this.getUsers();
      const user = users[userId];
      if (!user) return [];
      // Obtener usuarios únicos de las visitas y filtrar usuarios que no existen
      const uniqueVisits = [...new Set(user.visits)];
      return uniqueVisits.map(id => users[id]).filter(Boolean);
    } catch (error) {
      console.error('Error getting visits:', error);
      return [];
    }
  }
}

export const followService = new FollowService();
