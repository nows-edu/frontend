// src/services/api.ts

import { MediaItem, NowItem } from '../types/media';

// Configuration - Check for environment variable or fake mode
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const FAKE_MODE = process.env.EXPO_PUBLIC_FAKE_MODE === 'true' || false;
const USE_BACKEND = !FAKE_MODE; // Use backend only if not in fake mode

console.log('API Configuration:', { API_URL, USE_BACKEND, FAKE_MODE });

const PAGE_SIZE = 10;

// Convert NOWs to MediaItem format for backward compatibility
function convertNowToMediaItem(now: NowItem): MediaItem {
  return {
    id: now.id.toString(),
    type: now.url_content.includes('.mp4') || now.url_content.includes('video') ? 'video' : 'image',
    uri: now.url_content,
    text: `[${now.type}] ${now.url_content}`,
    author: {
      id: now.creator.id.toString(),
      name: now.creator.name,
      avatarUri: now.creator.profileImage || `https://i.pravatar.cc/150?u=${now.creator.username}`,
    },
    likes: now.positiveVotes,
    comments: 0, // NOWs don't have comments in the current schema
  };
}

// NOWs API functions
export const fetchNows = async (page: number = 1, type?: string): Promise<{ data: MediaItem[], hasMore: boolean }> => {
  console.log(`Fetching NOWs page ${page}... (Type: ${type || 'all'})`);
  
  if (USE_BACKEND) {
    try {
      const url = type 
        ? `${API_URL}/api/nows/feed?page=${page}&limit=${PAGE_SIZE}&type=${type}`
        : `${API_URL}/api/nows/feed?page=${page}&limit=${PAGE_SIZE}`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const nowsData: NowItem[] = result.data || [];
      
      return {
        data: nowsData.map(convertNowToMediaItem),
        hasMore: result.meta?.hasMore || false
      };
    } catch (error) {
      console.error('Backend fetch error:', error);
      // Fallback to dummy data on error
      return fetchFromDummyData(page);
    }
  } else {
    return fetchFromDummyData(page);
  }
};

// Raw NOWs API functions (for NOWs-specific functionality)
export const fetchNowsRaw = async (page: number = 1, type?: string): Promise<{ data: any[], hasMore: boolean }> => {
  if (USE_BACKEND) {
    try {
      const url = type 
        ? `${API_URL}/api/nows/feed?page=${page}&limit=${PAGE_SIZE}&type=${type}`
        : `${API_URL}/api/nows/feed?page=${page}&limit=${PAGE_SIZE}`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        data: result.data || [],
        hasMore: result.meta?.hasMore || false
      };
    } catch (error) {
      console.error('Backend fetch error:', error);
      // Fallback to dummy data on error
      return fetchNowsRawFromDummyData(page, type);
    }
  } else {
    // Use dummy data in fake mode
    return fetchNowsRawFromDummyData(page, type);
  }
};

// Create new NOW
export const createNow = async (url_content: string, type: string, id_creator: number): Promise<{ success: boolean, now?: any, error?: string }> => {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_URL}/api/nows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url_content, type, id_creator }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, now: result };
    } catch (error) {
      console.error('Error creating NOW:', error);
      return { success: false, error: 'Failed to create NOW' };
    }
  } else {
    // Simulate creating a NOW in fake mode
    const user = id_creator === 1 ? CURRENT_DEMO_USER : DUMMY_USERS.find(u => u.id === `u${id_creator}`) || DUMMY_USERS[1];
    const newNow = {
      id: Date.now(),
      url_content,
      type,
      positiveVotes: 1,
      negativeVotes: 0,
      totalVotes: 1,
      creator: {
        id: id_creator,
        name: user.name,
        username: user.username,
        profileImage: user.avatarUri,
      },
      created_at: new Date().toISOString(),
    };
    
    console.log('Created fake NOW:', newNow);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, now: newNow });
      }, 500);
    });
  }
};

// Vote on a NOW
export const voteNow = async (nowId: number, userId: number, type: boolean = true): Promise<{ success: boolean, result?: any, error?: string }> => {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_URL}/api/nows/${nowId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_user: userId, type }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, result };
    } catch (error) {
      console.error('Error voting on NOW:', error);
      return { success: false, error: 'Failed to vote' };
    }
  } else {
    // Simulate voting in fake mode
    const voteResult = {
      id: Date.now(),
      nowId,
      userId,
      type,
      created_at: new Date().toISOString(),
    };
    
    console.log(`Simulated vote on NOW ${nowId} by user ${userId}: ${type ? 'positive' : 'negative'}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, result: voteResult });
      }, 300);
    });
  }
};

// Upload NOWs file
export const uploadNowFile = async (file: File, type: string, id_creator: number): Promise<{ success: boolean, now?: any, error?: string }> => {
  if (USE_BACKEND) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('id_creator', id_creator.toString());

      const response = await fetch(`${API_URL}/api/upload/now`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, now: result.now };
    } catch (error) {
      console.error('Error uploading NOW file:', error);
      return { success: false, error: 'Failed to upload file' };
    }
  } else {
    // Simulate file upload in fake mode
    const user = id_creator === 1 ? CURRENT_DEMO_USER : DUMMY_USERS.find(u => u.id === `u${id_creator}`) || DUMMY_USERS[1];
    const fakeUrl = file.type.startsWith('video/') 
      ? DUMMY_CONTENT_URLS.videos[0] 
      : DUMMY_CONTENT_URLS.images[0];
    
    const newNow = {
      id: Date.now(),
      url_content: fakeUrl,
      type,
      positiveVotes: 0,
      negativeVotes: 0,
      totalVotes: 0,
      creator: {
        id: id_creator,
        name: user.name,
        username: user.username,
        profileImage: user.avatarUri,
      },
      created_at: new Date().toISOString(),
    };
    
    console.log('Simulated file upload for NOW:', newNow);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, now: newNow });
      }, 1000); // Simulate upload time
    });
  }
};

// Create NOW from URL
export const createNowFromUrl = async (url_content: string, type: string, id_creator: number): Promise<{ success: boolean, now?: any, error?: string }> => {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_URL}/api/upload/now/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url_content, type, id_creator }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, now: result.now };
    } catch (error) {
      console.error('Error creating NOW:', error);
      return { success: false, error: 'Failed to create NOW' };
    }
  } else {
    // Simulate URL creation in fake mode
    const user = id_creator === 1 ? CURRENT_DEMO_USER : DUMMY_USERS.find(u => u.id === `u${id_creator}`) || DUMMY_USERS[1];
    const newNow = {
      id: Date.now(),
      url_content,
      type,
      positiveVotes: 0,
      negativeVotes: 0,
      totalVotes: 0,
      creator: {
        id: id_creator,
        name: user.name,
        username: user.username,
        profileImage: user.avatarUri,
      },
      created_at: new Date().toISOString(),
    };
    
    console.log('Simulated NOW creation from URL:', newNow);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, now: newNow });
      }, 600);
    });
  }
};

// Alias for uploadNowUrl
export const uploadNowUrl = createNowFromUrl;

// Categories API functions
export const fetchCategories = async (): Promise<string[]> => {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['Retos', 'Opiniones', 'Usuarios', 'Clubes', 'Comunidades', 'Actividades'];
    }
  } else {
    // Dummy categories
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(['Retos', 'Opiniones', 'Usuarios', 'Clubes', 'Comunidades', 'Actividades']);
      }, 500);
    });
  }
};

export const fetchSelectedCategories = async (userId?: string): Promise<string[]> => {
  if (USE_BACKEND && userId) {
    try {
      const response = await fetch(`${API_URL}/api/categories/user/${userId}/preferences`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return ['Populares', 'Nuevos'];
    }
  } else {
    // Dummy selected categories
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(['Populares', 'Nuevos']);
      }, 300);
    });
  }
};

export const updateSelectedCategories = async (categories: string[], userId?: string): Promise<boolean> => {
  if (USE_BACKEND && userId) {
    try {
      const response = await fetch(`${API_URL}/api/categories/user/${userId}/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating categories:', error);
      return false;
    }
  } else {
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Categories updated in backend:', categories);
        resolve(true);
      }, 700);
    });
  }
};

// Media interaction functions
export const likePost = async (postId: string, userId: string): Promise<boolean> => {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_URL}/api/media/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error liking post:', error);
      return false;
    }
  } else {
    // Simulate like
    console.log(`Liked post ${postId} by user ${userId}`);
    return true;
  }
};

export const unlikePost = async (postId: string, userId: string): Promise<boolean> => {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_URL}/api/media/${postId}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error unliking post:', error);
      return false;
    }
  } else {
    // Simulate unlike
    console.log(`Unliked post ${postId} by user ${userId}`);
    return true;
  }
};

export const addComment = async (postId: string, content: string, userId: string): Promise<boolean> => {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_URL}/api/media/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, userId }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  } else {
    // Simulate comment
    console.log(`Added comment to post ${postId}: ${content}`);
    return true;
  }
};

// File upload function
export const uploadMediaFile = async (file: File, text: string, authorId: string): Promise<{ success: boolean, post?: MediaItem, error?: string }> => {
  if (USE_BACKEND) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('text', text);
      formData.append('authorId', authorId);

      const response = await fetch(`${API_URL}/api/upload/media`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, post: result.post };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { success: false, error: 'Failed to upload file' };
    }
  } else {
    // Simulate file upload in fake mode
    const user = DUMMY_USERS.find(u => u.id === authorId) || DUMMY_USERS[0];
    const fakeUrl = file.type.startsWith('video/') 
      ? DUMMY_CONTENT_URLS.videos[0] 
      : DUMMY_CONTENT_URLS.images[0];
    
    const newPost: MediaItem = {
      id: Date.now().toString(),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      uri: fakeUrl,
      text,
      author: { 
        id: authorId, 
        name: user.name, 
        avatarUri: user.avatarUri 
      },
      likes: 0,
      comments: 0,
    };
    
    console.log('Simulated media file upload:', newPost);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, post: newPost });
      }, 1000); // Simulate upload time
    });
  }
};

// Create post from URL
export const createPostFromUrl = async (uri: string, text: string, authorId: string): Promise<{ success: boolean, post?: MediaItem, error?: string }> => {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_URL}/api/upload/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uri, text, authorId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, post: result.post };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: 'Failed to create post' };
    }
  } else {
    // Simulate post creation
    const newPost: MediaItem = {
      id: Date.now().toString(),
      type: uri.includes('.mp4') || uri.includes('video') ? 'video' : 'image',
      uri,
      text,
      author: { id: authorId, name: 'Current User', avatarUri: 'https://i.pravatar.cc/150?u=current' },
      likes: 0,
      comments: 0,
    };
    return { success: true, post: newPost };
  }
};

// Dummy data fallback - Extensive realistic content for demo mode
const CURRENT_DEMO_USER = { 
  id: 'u_current', 
  name: 'Tu Perfil', 
  username: 'your_profile', 
  avatarUri: 'https://i.pravatar.cc/150?u=current_user' 
};

const DUMMY_USERS = [
  CURRENT_DEMO_USER,
  { id: 'u1', name: 'Elena García', username: 'elena_g', avatarUri: 'https://i.pravatar.cc/150?u=elena' },
  { id: 'u2', name: 'Carlos López', username: 'carlos_l', avatarUri: 'https://i.pravatar.cc/150?u=carlos' },
  { id: 'u3', name: 'Ana Martínez', username: 'ana_m', avatarUri: 'https://i.pravatar.cc/150?u=ana' },
  { id: 'u4', name: 'Miguel Torres', username: 'miguel_t', avatarUri: 'https://i.pravatar.cc/150?u=miguel' },
  { id: 'u5', name: 'Laura Sánchez', username: 'laura_s', avatarUri: 'https://i.pravatar.cc/150?u=laura' },
  { id: 'u6', name: 'Diego Ruiz', username: 'diego_r', avatarUri: 'https://i.pravatar.cc/150?u=diego' },
  { id: 'u7', name: 'Sofia Pérez', username: 'sofia_p', avatarUri: 'https://i.pravatar.cc/150?u=sofia' },
  { id: 'u8', name: 'Javier Morales', username: 'javier_m', avatarUri: 'https://i.pravatar.cc/150?u=javier' },
  { id: 'u9', name: 'Carmen Flores', username: 'carmen_f', avatarUri: 'https://i.pravatar.cc/150?u=carmen' },
  { id: 'u10', name: 'Roberto Silva', username: 'roberto_s', avatarUri: 'https://i.pravatar.cc/150?u=roberto' },
];

const DUMMY_CONTENT_URLS = {
  images: [
    'https://picsum.photos/id/237/1080/1920', // Dog
    'https://picsum.photos/id/1025/1080/1920', // Mountains
    'https://picsum.photos/id/1018/1080/1920', // Coffee
    'https://picsum.photos/id/1015/1080/1920', // Nature
    'https://picsum.photos/id/180/1080/1920', // Flowers
    'https://picsum.photos/id/206/1080/1920', // Architecture
    'https://picsum.photos/id/225/1080/1920', // Food
    'https://picsum.photos/id/292/1080/1920', // City
    'https://picsum.photos/id/319/1080/1920', // Beach
    'https://picsum.photos/id/421/1080/1920', // Art
    'https://picsum.photos/id/455/1080/1920', // Technology
    'https://picsum.photos/id/510/1080/1920', // Sports
  ],
  videos: [
    'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  ]
};

const DUMMY_POST_TEXTS = [
  'Disfrutando de la naturaleza! 🌳 #naturaleza #relax',
  'Mi mejor amigo. 🐾 #perros #mascotas',
  'Reto de baile, ¿quién se apunta? 💃 #baile #reto',
  'Café perfecto para empezar el día ☕ #café #mañana',
  'Atardecer increíble desde mi ventana 🌅 #atardecer #vista',
  'Nuevo proyecto en el que estoy trabajando 💻 #tech #programación',
  'Día de playa con amigos! 🏖️ #playa #amigos #verano',
  'Arte urbano que me encanta 🎨 #arte #street',
  'Reto fitness del día completado! 💪 #fitness #health',
  'Comida casera de la abuela 👵 #cocina #familia',
  '¿Alguien más adicto a los libros? 📚 #lectura #books',
  'Concierto increíble anoche! 🎵 #música #concierto',
  'Paisaje de montaña espectacular ⛰️ #montaña #hiking',
  'Nuevo reto de fotografía 📸 #fotografía #challenge',
  'Día productivo en la universidad 🎓 #universidad #estudio',
  'Reto de cocina: pasta carbonara 🍝 #cocina #reto',
  'Viaje en tren por Europa 🚂 #viajes #europa',
  'Sesión de gaming con los amigos 🎮 #gaming #friends',
  'Clase de yoga matutina 🧘‍♀️ #yoga #bienestar',
  'Experimento científico exitoso! 🧪 #ciencia #lab'
];

const DUMMY_NOW_TYPES = ['RETO', 'OPINION', 'EXPERIENCIA', 'PREGUNTA', 'TUTORIAL'];

// Generate comprehensive dummy data
function generateDummyNows(count: number = 50): MediaItem[] {
  const nows: MediaItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const isVideo = Math.random() > 0.7; // 30% videos, 70% images
    const user = DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)];
    const text = DUMMY_POST_TEXTS[Math.floor(Math.random() * DUMMY_POST_TEXTS.length)];
    
    const uri = isVideo 
      ? DUMMY_CONTENT_URLS.videos[Math.floor(Math.random() * DUMMY_CONTENT_URLS.videos.length)]
      : DUMMY_CONTENT_URLS.images[Math.floor(Math.random() * DUMMY_CONTENT_URLS.images.length)];
    
    const now: MediaItem = {
      id: (i + 1).toString(),
      type: isVideo ? 'video' : 'image',
      uri,
      text,
      author: {
        id: user.id,
        name: user.name,
        avatarUri: user.avatarUri,
      },
      likes: Math.floor(Math.random() * 10000) + 10,
      comments: Math.floor(Math.random() * 500) + 5,
    };
    
    nows.push(now);
  }
  
  return nows;
}

const ALL_NOWS: MediaItem[] = generateDummyNows(50);

// Generate NOWs with type information
function generateDummyNowsRaw(count: number = 30): any[] {
  const nows: any[] = [];
  
  for (let i = 0; i < count; i++) {
    const isVideo = Math.random() > 0.7;
    const user = DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)];
    const text = DUMMY_POST_TEXTS[Math.floor(Math.random() * DUMMY_POST_TEXTS.length)];
    const type = DUMMY_NOW_TYPES[Math.floor(Math.random() * DUMMY_NOW_TYPES.length)];
    
    const uri = isVideo 
      ? DUMMY_CONTENT_URLS.videos[Math.floor(Math.random() * DUMMY_CONTENT_URLS.videos.length)]
      : DUMMY_CONTENT_URLS.images[Math.floor(Math.random() * DUMMY_CONTENT_URLS.images.length)];
    
    const now = {
      id: i + 1,
      url_content: uri,
      type,
      positiveVotes: Math.floor(Math.random() * 5000) + 10,
      negativeVotes: Math.floor(Math.random() * 100),
      totalVotes: 0,
      creator: {
        id: parseInt(user.id.replace('u', '')),
        name: user.name,
        username: user.username,
        profileImage: user.avatarUri,
      },
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    now.totalVotes = now.positiveVotes + now.negativeVotes;
    nows.push(now);
  }
  
  return nows;
}

const ALL_NOWS_RAW = generateDummyNowsRaw(30);

function fetchFromDummyData(page: number): Promise<{ data: MediaItem[], hasMore: boolean }> {
  return new Promise(resolve => {
    setTimeout(() => {
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      
      const data = ALL_NOWS.slice(start, end);
      const hasMore = end < ALL_NOWS.length;

      resolve({ data, hasMore });
    }, FAKE_MODE ? 300 : 1000); // Faster response in fake mode
  });
}

function fetchNowsRawFromDummyData(page: number, type?: string): Promise<{ data: any[], hasMore: boolean }> {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredNows = ALL_NOWS_RAW;
      
      // Filter by type if specified
      if (type) {
        filteredNows = ALL_NOWS_RAW.filter(now => now.type === type);
      }
      
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      
      const data = filteredNows.slice(start, end);
      const hasMore = end < filteredNows.length;

      resolve({ data, hasMore });
    }, FAKE_MODE ? 300 : 1000); // Faster response in fake mode
  });
}

// Legacy Media API functions for backward compatibility

