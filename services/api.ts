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
    mediaType: now.url_content.includes('.mp4') || now.url_content.includes('video') ? 'video' : 'image',
    contentType: now.type === 'RETO' ? 'challenge' : 'opinion',
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
export const fetchNows = async (page: number = 1, type?: string, categories?: string[]): Promise<{ data: MediaItem[], hasMore: boolean }> => {
  console.log(`Fetching NOWs page ${page}... (Type: ${type || 'all'}, Categories: ${categories?.join(', ') || 'all'})`);
  
  if (USE_BACKEND) {
    try {
      let url = `${API_URL}/api/nows/feed?page=${page}&limit=${PAGE_SIZE}`;
      
      if (type) {
        url += `&type=${type}`;
      }
      
      if (categories && categories.length > 0) {
        url += `&categories=${categories.join(',')}`;
      }
        
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
      return fetchFromDummyData(page, categories);
    }
  } else {
    return fetchFromDummyData(page, categories);
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
      ? UNIVERSITY_MEDIA_URLS.videos[0] 
      : UNIVERSITY_MEDIA_URLS.images[0];
    
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
export const createNowFromUrl = async (url_content: string, type: string, id_creator: number, description?: string): Promise<{ success: boolean, now?: any, error?: string }> => {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_URL}/api/upload/now/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url_content, type, id_creator, description }),
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
    
    // Create MediaItem for the feed
    const feedItem: MediaItem = {
      id: newNow.id.toString(),
      mediaType: url_content.includes('.mp4') || url_content.includes('video') || url_content.toLowerCase().includes('video') ? 'video' : 'image',
      contentType: 'challenge',
      uri: url_content,
      text: description || `[${type}] ${url_content}`,
      author: {
        id: user.id,
        name: user.name,
        avatarUri: user.avatarUri,
      },
      likes: 0,
      comments: 0,
    };
    
    // Add to dummy feed
    addCreatedNowToFeed(feedItem);
    
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
      return ['Retos', 'Opiniones', 'Perfiles', 'Actividades', 'Comunidades', 'Clubes'];
    }
  } else {
    // Dummy categories que coinciden con nuestro contenido
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(['Retos', 'Opiniones', 'Perfiles', 'Actividades', 'Comunidades', 'Clubes']);
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
      return ['Retos', 'Opiniones', 'Perfiles', 'Estudio', 'Campus', 'Vida Universitaria'];
    }
  } else {
    // Por defecto, todas las categorías están seleccionadas
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(['Retos', 'Opiniones', 'Perfiles', 'Estudio', 'Campus', 'Vida Universitaria']);
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
      ? UNIVERSITY_MEDIA_URLS.videos[0] 
      : UNIVERSITY_MEDIA_URLS.images[0];
    
    const newPost: MediaItem = {
      id: Date.now().toString(),
      mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      contentType: 'opinion',
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
      mediaType: uri.includes('.mp4') || uri.includes('video') ? 'video' : 'image',
      contentType: 'opinion',
      uri,
      text,
      author: { id: authorId, name: 'Current User', avatarUri: 'https://i.pravatar.cc/150?u=current' },
      likes: 0,
      comments: 0,
    };
    return { success: true, post: newPost };
  }
};

// Contenido coherente y estructurado para NOWs con statements integrados
const COHERENT_NOW_CONTENT = [
  // --- RETOS COHERENTES ---
  {
    id: 1,
    type: 'RETO',
    mediaType: 'image',
    categories: ['Retos', 'Estudio'],
    // Imagen de un rincón acogedor de una biblioteca universitaria
    mediaUrl: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    statement: 'Enseña el spot más infravalorado de tu biblioteca',
    description: 'Muestra ese rincón secreto de la biblioteca donde la concentración es máxima. 🤫📚 #VidaEstudiantil #BibliotecaSecreta',
    challenge: '¿Cuál es tu lugar favorito para estudiar en la biblioteca?',
    context: 'Encontrar espacios únicos de estudio en el campus',
    keywords: ['biblioteca', 'estudio', 'campus', 'secreto']
  },
  {
    id: 2,
    type: 'RETO',
    mediaType: 'image',
    categories: ['Retos', 'Estudio'],
    // Imagen de un escritorio de estudiante bien organizado y con estilo
    mediaUrl: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    statement: 'Enseña tu setup de estudio más aesthetic',
    description: 'Un espacio de estudio que inspira a sacar dieces. ✨🌿 #AestheticDesk #StudyInspo',
    challenge: '¿Cómo organizas tu espacio de estudio?',
    context: 'Optimización del entorno de estudio personal',
    keywords: ['setup', 'escritorio', 'aesthetic', 'organización']
  },
  {
    id: 3,
    type: 'RETO',
    mediaType: 'image',
    categories: ['Retos', 'Vida Universitaria'],
    // Imagen de una bandeja de comida típica de cafetería universitaria
    mediaUrl: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    statement: 'Muestra la comida más típica (o extraña) de tu cafetería',
    description: 'El menú de hoy en la uni... un clásico que nunca falla. 🍽️😅 #ComidaUniversitaria #VidaDeEstudiante',
    challenge: '¿Cuál es el plato estrella de tu universidad?',
    context: 'Experiencias gastronómicas universitarias',
    keywords: ['comida', 'universidad', 'cafetería', 'menú']
  },
  {
    id: 4,
    type: 'RETO',
    mediaType: 'video',
    categories: ['Retos', 'Vida Universitaria'],
    // Vídeo corto de alguien preparando un desayuno rápido y sencillo
    mediaUrl: 'https://videos.pexels.com/video-files/7662269/7662269-hd_1080_1920_30fps.mp4',
    statement: 'Tu desayuno de estudiante en menos de 5 minutos',
    description: '¡Energía para empezar el día! Mi desayuno pre-clase súper rápido. ⏰🥣 #DesayunoExpress #RecetasEstudiante',
    challenge: '¿Cuál es tu desayuno ideal antes de clases?',
    context: 'Rutinas matutinas de estudiantes universitarios',
    keywords: ['desayuno', 'rutina', 'mañana', 'estudiante']
  },

  // --- OPINIONES COHERENTES ---
  {
    id: 5,
    type: 'OPINIÓN',
    mediaType: 'image',
    categories: ['Opiniones', 'Campus'],
    // Imagen de un aula universitaria con estudiantes
    mediaUrl: 'https://images.pexels.com/photos/159775/library-la-trobe-university-student-study-159775.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    statement: '¿Qué opinas sobre las clases híbridas?',
    description: 'Clases presenciales vs. online, ¿cuál es el futuro de la educación? 🤔💻 #DebateUni #EducacionHibrida',
    challenge: '¿Son más efectivas las clases presenciales o virtuales?',
    context: 'Evaluando modalidades de enseñanza universitaria',
    keywords: ['clases', 'online', 'presencial', 'educación']
  },
  {
    id: 6,
    type: 'OPINIÓN',
    mediaType: 'image',
    categories: ['Opiniones', 'Campus'],
    // Imagen de un campus universitario con zonas verdes
    mediaUrl: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    statement: '¿Qué mejorarías de los espacios comunes de tu universidad?',
    description: 'Si pudiera cambiar algo de mi campus, empezaría por aquí... 🌳💡 #MiCampus #MejorasUni',
    challenge: '¿Qué cambiarías del campus de tu universidad?',
    context: 'Propuestas de mejora para infraestructura universitaria',
    keywords: ['campus', 'infraestructura', 'mejoras', 'espacios']
  },
  {
    id: 7,
    type: 'OPINIÓN',
    mediaType: 'image',
    categories: ['Opiniones', 'Estudio'],
    // Imagen de estudiantes en una sala de exámenes
    mediaUrl: 'https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    statement: '¿Son justos los sistemas de evaluación actuales?',
    description: '¿Exámenes finales o evaluación continua? Se abre el debate. 📝🔄 #Evaluación #Examenes',
    challenge: '¿Son justos los métodos de evaluación actuales?',
    context: 'Reforma de sistemas de evaluación académica',
    keywords: ['exámenes', 'evaluación', 'sistema', 'educativo']
  },

  // --- PERFILES RECOMENDADOS (YA ERAN COHERENTES) ---
  {
    id: 8,
    type: 'PERFIL_RECOMENDADO',
    mediaType: 'profile',
    categories: ['Perfiles'],
    mediaUrl: 'https://i.pravatar.cc/150?img=1', // pravatar es ideal para perfiles dummy
    statement: null,
    description: '¡Conoce a Elena! 👋 Estudiante de Ingeniería Informática en la UAB 🎓',
    challenge: null,
    context: 'Perfil recomendado de estudiante',
    profileData: {
      name: 'Elena García',
      username: 'elena_codes',
      education: 'Ingeniería Informática - UAB',
      location: 'Sant Cugat del Vallès',
      interests: ['Programación', 'Gaming', 'Café'],
      status: 'Coding Queen',
      statusColor: 'rgb(168, 85, 247)',
      followers: 234,
      following: 189,
      visits: 1456
    },
    keywords: ['perfil', 'estudiante', 'programación', 'UAB']
  },
  {
    id: 9,
    type: 'PERFIL_RECOMENDADO',
    mediaType: 'profile',
    categories: ['Perfiles'],
    mediaUrl: 'https://i.pravatar.cc/150?img=3',
    statement: null,
    description: '¡Conoce a Sofia! ✨ Diseñadora en formación con un ojo artístico increíble 🎨',
    challenge: null,
    context: 'Perfil recomendado de estudiante',
    profileData: {
      name: 'Sofia Martín',
      username: 'sofia_design',
      education: 'Diseño Gráfico - ELISAVA',
      location: 'Barcelona',
      interests: ['Diseño', 'Arte', 'Fotografía'],
      status: 'Creative Soul',
      statusColor: 'rgb(251, 146, 60)',
      followers: 891,
      following: 445,
      visits: 3678
    },
    keywords: ['perfil', 'diseño', 'arte', 'creatividad']
  },
  
  // Añadir más contenido variado para el filtrado
  {
    id: 10,
    type: 'RETO',
    mediaType: 'image',
    categories: ['Retos', 'Campus'],
    mediaUrl: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    statement: 'Encuentra el rincón más instagrameable de tu universidad',
    description: '📸 Aquí es donde todos quieren hacerse la foto de graduación #InstagrammableSpot #Campus',
    challenge: '¿Cuál es el lugar más fotogénico de tu universidad?',
    context: 'Espacios universitarios más populares en redes sociales',
    keywords: ['campus', 'fotografía', 'instagram', 'viral']
  },
  {
    id: 11,
    type: 'OPINIÓN',
    mediaType: 'image',
    categories: ['Opiniones', 'Vida Universitaria'],
    mediaUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    statement: '¿Vale la pena estudiar un máster después de la carrera?',
    description: 'Máster vs experiencia laboral... el dilema de nuestra generación 🎓💼 #MasterVsExperiencia #FuturoLaboral',
    challenge: '¿Qué es más valioso: especialización académica o experiencia práctica?',
    context: 'Decisiones de formación post-universitaria',
    keywords: ['máster', 'carrera', 'formación', 'futuro']
  },
  {
    id: 12,
    type: 'PERFIL_RECOMENDADO',
    mediaType: 'profile',
    categories: ['Perfiles'],
    mediaUrl: 'https://i.pravatar.cc/150?img=4',
    statement: null,
    description: '¡Conoce a Marc! 🚀 Emprendedor tech con ideas revolucionarias 💡',
    challenge: null,
    context: 'Perfil recomendado de estudiante emprendedor',
    profileData: {
      name: 'Marc Fernández',
      username: 'marc_startup',
      education: 'ADE + Ingeniería - UPC',
      location: 'Barcelona Tech City',
      interests: ['Startups', 'Tech', 'Innovación'],
      status: 'Building the Future',
      statusColor: 'rgb(34, 197, 94)',
      followers: 567,
      following: 298,
      visits: 2134
    },
    keywords: ['perfil', 'emprendimiento', 'tecnología', 'startup']
  }
];


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
  // Short vertical videos for mobile/TikTok-like experience
  videos: [
    'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    // Fallback to images if videos don't load
    'https://picsum.photos/id/1020/1080/1920',
    'https://picsum.photos/id/1021/1080/1920',
  ]
};

// Contenido universitario consistente con challenges y contexts
const UNIVERSITY_CONTENT = [
  {
    type: 'RETO',
    text: 'RETO: Muestra el lugar más secreto de tu universidad que nadie conoce 🕵️‍♀️ #secretspot #universidad',
    challenge: '¿Cuál es el rincón más oculto de tu campus?',
    context: 'Encontrar espacios únicos en el campus universitario',
    mediaType: 'image',
    keywords: ['campus', 'university', 'secret', 'hidden']
  },
  {
    type: 'RETO', 
    text: 'RETO: ¿Puedes estudiar 4 horas seguidas sin distracciones? �⏰ #estudiante #productividad',
    challenge: 'Sesión de estudio maratónica sin distracciones',
    context: 'Mejorar técnicas de concentración y productividad académica',
    mediaType: 'video',
    keywords: ['study', 'productivity', 'focus']
  },
  {
    type: 'OPINION',
    text: 'OPINIÓN: ¿Las clases online son realmente efectivas? Mi experiencia 🤔 #educacion #online',
    challenge: '¿Qué opinas sobre la educación virtual?',
    context: 'Evaluando la efectividad del aprendizaje remoto',
    mediaType: 'image',
    keywords: ['education', 'online', 'learning']
  },
  {
    type: 'RETO',
    text: 'RETO: Cocina algo delicioso con solo 5€ de presupuesto 👩‍🍳💰 #estudiante #cocina',
    challenge: 'Comida universitaria con presupuesto limitado',
    context: 'Vida de estudiante: cocinar económico y nutritivo',
    mediaType: 'video',
    keywords: ['cooking', 'budget', 'student']
  },
  {
    type: 'EXPERIENCIA',
    text: 'MI EXPERIENCIA: Primer día de prácticas en empresa 😱✨ #practicas #trabajo',
    challenge: '¿Cómo fue tu primer día de prácticas?',
    context: 'Transición del mundo académico al profesional',
    mediaType: 'image',
    keywords: ['internship', 'work', 'professional']
  },
  {
    type: 'RETO',
    text: 'RETO: Organiza tu escritorio de estudio de forma estética y funcional 📐✨ #organizacion #estudio',
    challenge: 'Workspace perfecto para estudiar',
    context: 'Optimizar el espacio de estudio personal',
    mediaType: 'image',
    keywords: ['desk', 'organization', 'aesthetic']
  },
  {
    type: 'OPINION',
    text: 'OPINIÓN: ¿Vale la pena madrugar para ir a primera hora? ☀️� #universidad #horarios',
    challenge: '¿Prefieres clases matutinas o tardías?',
    context: 'Optimización de horarios universitarios',
    mediaType: 'image',
    keywords: ['morning', 'schedule', 'university']
  },
  {
    type: 'RETO',
    text: 'RETO: Aprende algo nuevo en 30 minutos usando YouTube �📱 #aprendizaje #reto',
    challenge: 'Micro-learning challenge',
    context: 'Aprendizaje autodidacta y recursos online',
    mediaType: 'video',
    keywords: ['learning', 'youtube', 'skills']
  },
  {
    type: 'EXPERIENCIA',
    text: 'MI EXPERIENCIA: Erasmus en Italia, lo que nadie te cuenta 🇮�✈️ #erasmus #viajes',
    challenge: '¿Qué te sorprendió más de tu intercambio?',
    context: 'Vivencias reales del programa Erasmus',
    mediaType: 'video',
    keywords: ['erasmus', 'italy', 'travel']
  },
  {
    type: 'RETO',
    text: 'RETO: Haz networking en menos de 5 minutos en el campus 🤝� #networking #universidad',
    challenge: 'Speed networking universitario',
    context: 'Desarrollo de habilidades sociales y profesionales',
    mediaType: 'video',
    keywords: ['networking', 'social', 'campus']
  },
  {
    type: 'PREGUNTA',
    text: 'PREGUNTA: ¿Cuál es la mejor app para tomar apuntes? �📱 #apps #estudio',
    challenge: '¿Qué herramientas digitales usas para estudiar?',
    context: 'Tecnología aplicada al estudio',
    mediaType: 'image',
    keywords: ['apps', 'notes', 'digital']
  },
  {
    type: 'RETO',
    text: 'RETO: Presenta tu proyecto final en 60 segundos 🎯⏱️ #presentacion #proyecto',
    challenge: 'Elevator pitch de tu proyecto académico',
    context: 'Habilidades de presentación y síntesis',
    mediaType: 'video',
    keywords: ['presentation', 'project', 'pitch']
  },
  {
    type: 'OPINION',
    text: 'OPINIÓN: ¿Los trabajos en grupo son productivos o un infierno? 👥😅 #trabajogrupo #universidad',
    challenge: '¿Prefieres trabajar solo o en equipo?',
    context: 'Dinámicas de trabajo colaborativo en la universidad',
    mediaType: 'image',
    keywords: ['teamwork', 'group', 'collaboration']
  },
  {
    type: 'EXPERIENCIA',
    text: 'MI EXPERIENCIA: Cambié de carrera y fue la mejor decisión 🔄💡 #carrera #cambio',
    challenge: '¿Has pensado alguna vez en cambiar de carrera?',
    context: 'Decisiones académicas y reorientación profesional',
    mediaType: 'image',
    keywords: ['career', 'change', 'decision']
  },
  {
    type: 'RETO',
    text: 'RETO: Crea contenido educativo en TikTok sobre tu carrera 📚🎬 #tiktok #educacion',
    challenge: 'Divulgación académica en redes sociales',
    context: 'Uso creativo de las redes para educar',
    mediaType: 'video',
    keywords: ['tiktok', 'education', 'content']
  },
  {
    type: 'TUTORIAL',
    text: 'TUTORIAL: Cómo hacer que tu CV destaque entre 1000 �✨ #cv #trabajo',
    challenge: '¿Qué hace especial a un CV universitario?',
    context: 'Preparación para el mundo laboral',
    mediaType: 'image',
    keywords: ['cv', 'resume', 'job']
  },
  {
    type: 'RETO',
    text: 'RETO: Sobrevive una semana con comida de la universidad �️😤 #comidauniversitaria #supervivencia',
    challenge: 'Challenge: Solo comida del campus por 7 días',
    context: 'Realidades de la vida universitaria',
    mediaType: 'video',
    keywords: ['university', 'food', 'cafeteria']
  },
  {
    type: 'PREGUNTA',
    text: 'PREGUNTA: ¿Cuál es el mejor lugar de la biblioteca para estudiar? 📚🔍 #biblioteca #estudio',
    challenge: '¿Dónde encuentras tu zona de concentración perfecta?',
    context: 'Optimización del entorno de estudio',
    mediaType: 'image',
    keywords: ['library', 'study', 'concentration']
  },
  {
    type: 'EXPERIENCIA',
    text: 'MI EXPERIENCIA: Así fue mi primera presentación en inglés 🇬🇧😰 #ingles #presentacion',
    challenge: '¿Cómo superas el miedo a hablar en público en otro idioma?',
    context: 'Desarrollo de competencias linguísticas académicas',
    mediaType: 'video',
    keywords: ['english', 'presentation', 'language']
  },
  {
    type: 'RETO',
    text: 'RETO: Organiza un evento universitario desde cero 🎪📋 #evento #organizacion',
    challenge: 'De la idea a la realidad: crear un evento estudiantil',
    context: 'Liderazgo y gestión de proyectos universitarios',
    mediaType: 'image',
    keywords: ['event', 'organization', 'leadership']
  }
];

// Perfiles de usuario para el tipo 'user-profile'
const USER_PROFILE_CONTENT = [
  {
    type: 'USER_PROFILE',
    text: '¡Conoce a Carolina! 👋 Estudiante de Ingeniería Informática en UAB 🎓 #perfil #estudiante',
    education: 'Ingeniería Informática - UAB',
    location: 'Sant Cugat del Vallès',
    interests: ['Sociable', 'Videojuegos', 'Viajes'],
    status: 'Imparable',
    statusColor: 'rgb(255, 105, 180)',
    mediaType: 'image',
  },
  {
    type: 'USER_PROFILE',
    text: '¡Conoce a Miguel! 🙋‍♂️ Futuro ingeniero con pasión por la tecnología 💻 #perfil #tech',
    education: 'Ingeniería de Software - UPC',
    location: 'Barcelona',
    interests: ['Programación', 'Gaming', 'AI'],
    status: 'Dev in progress',
    statusColor: 'rgb(88, 101, 242)',
    mediaType: 'image',
  },
  {
    type: 'USER_PROFILE',
    text: '¡Conoce a Sofía! ✨ Estudiante de Medicina con grandes sueños 🩺 #perfil #medicina',
    education: 'Medicina - UAB',
    location: 'Cerdanyola del Vallès',
    interests: ['Medicina', 'Deportes', 'Volunteering'],
    status: 'Future Doctor',
    statusColor: 'rgb(34, 197, 94)',
    mediaType: 'image',
  },
  {
    type: 'USER_PROFILE',
    text: '¡Conoce a Diego! 🎨 Diseñador gráfico en formación con ojo artístico 🖌️ #perfil #diseño',
    education: 'Diseño Gráfico - ELISAVA',
    location: 'Barcelona',
    interests: ['Diseño', 'Arte', 'Fotografía'],
    status: 'Creative Soul',
    statusColor: 'rgb(168, 85, 247)',
    mediaType: 'image',
  },
  {
    type: 'USER_PROFILE',
    text: '¡Conoce a Laura! 🌍 Estudiante de Relaciones Internacionales 🤝 #perfil #internacional',
    education: 'Relaciones Internacionales - UPF',
    location: 'Barcelona',
    interests: ['Política', 'Idiomas', 'Culturas'],
    status: 'Global Citizen',
    statusColor: 'rgb(239, 68, 68)',
    mediaType: 'image',
  },
  {
    type: 'USER_PROFILE',
    text: '¡Conoce a Carlos! ⚽ Estudiante de Ciencias del Deporte y atleta 🏃‍♂️ #perfil #deporte',
    education: 'Ciencias del Deporte - INEFC',
    location: 'Barcelona',
    interests: ['Fútbol', 'Fitness', 'Nutrición'],
    status: 'Athlete Mode',
    statusColor: 'rgb(251, 146, 60)',
    mediaType: 'image',
  },
];

const DUMMY_NOW_TYPES = ['RETO', 'OPINION', 'EXPERIENCIA', 'PREGUNTA', 'TUTORIAL'];

// URLs de contenido que coinciden con el contexto universitario
const UNIVERSITY_MEDIA_URLS = {
  images: [
    'https://picsum.photos/id/1043/1080/1920', // Estudiante con libros
    'https://picsum.photos/id/935/1080/1920',  // Campus universitario
    'https://picsum.photos/id/159/1080/1920',  // Biblioteca
    'https://picsum.photos/id/201/1080/1920',  // Escritorio de estudio
    'https://picsum.photos/id/1019/1080/1920', // Aula vacía
    'https://picsum.photos/id/267/1080/1920',  // Cafetería universitaria
    'https://picsum.photos/id/2/1080/1920',    // Computadora portátil
    'https://picsum.photos/id/48/1080/1920',   // Apuntes y café
    'https://picsum.photos/id/357/1080/1920',  // Laboratorio
    'https://picsum.photos/id/927/1080/1920',  // Graduación
  ],
  videos: [
    // Short videos más pequeños y de formato adecuado para mobile (TikTok-style)
    'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4', // 10 seconds
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', // 30 seconds
    // More fallback to images since short videos are harder to find
    'https://picsum.photos/id/1043/1080/1920', // University student
    'https://picsum.photos/id/935/1080/1920',  // Campus
    'https://picsum.photos/id/159/1080/1920',  // Library
  ]
};

// Generate comprehensive dummy data with university content using new coherent structure
function generateDummyNows(count: number = 50): MediaItem[] {
  const nows: MediaItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const user = DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)];
    const content = COHERENT_NOW_CONTENT[i % COHERENT_NOW_CONTENT.length];
    
    // Usar el mediaUrl específico de cada contenido
    const uri = content.mediaUrl;
    
    // Determinar el tipo de contenido
    let contentType: 'challenge' | 'opinion' | 'user-profile' = 'opinion';
    if (content.type === 'RETO') contentType = 'challenge';
    else if (content.type === 'PERFIL_RECOMENDADO') contentType = 'user-profile';
    
    const now: MediaItem = {
      id: (i + 1).toString(),
      mediaType: content.mediaType === 'profile' ? 'image' : content.mediaType as 'video' | 'image',
      contentType: contentType,
      uri: uri,
      text: content.description,
      challengeId: content.type === 'RETO' ? `challenge_${content.id}` : undefined,
      challengeTitle: content.challenge || undefined,
      statement: content.statement || undefined, // Añadir el statement aquí
      author: content.type === 'PERFIL_RECOMENDADO' && content.profileData ? {
        id: `profile_${content.id}`,
        name: content.profileData.name,
        avatarUri: content.mediaUrl,
        status: content.profileData.status,
      } : {
        id: user.id,
        name: user.name,
        avatarUri: user.avatarUri,
        status: user.username === 'your_profile' ? 'Estudiante' : `${content.type} Creator`,
      },
      likes: Math.floor(Math.random() * 10000) + 10,
      comments: Math.floor(Math.random() * 500) + 5,
      // Añadir datos de perfil para recomendaciones de perfil
      profileData: content.type === 'PERFIL_RECOMENDADO' ? content.profileData : undefined,
    };
    
    nows.push(now);
  }
  
  return nows;
}

const ALL_NOWS: MediaItem[] = generateDummyNows(50);

// Array to store user created NOWs at runtime
const USER_CREATED_NOWS: MediaItem[] = [];

// Helper function to add a created NOW to the feed
export const addCreatedNowToFeed = (now: MediaItem) => {
  USER_CREATED_NOWS.unshift(now); // Add to the beginning
  console.log('Added NOW to dummy feed:', now);
};

// Generate NOWs with type information using coherent structure
function generateDummyNowsRaw(count: number = 30): any[] {
  const nows: any[] = [];
  
  for (let i = 0; i < count; i++) {
    const user = DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)];
    const content = COHERENT_NOW_CONTENT[i % COHERENT_NOW_CONTENT.length];
    
    // Skip profile recommendations for raw NOWs
    if (content.type === 'PERFIL_RECOMENDADO') {
      continue;
    }
    
    const now = {
      id: i + 1,
      url_content: content.mediaUrl,
      type: content.type,
      positiveVotes: Math.floor(Math.random() * 5000) + 10,
      negativeVotes: Math.floor(Math.random() * 100),
      totalVotes: 0,
      creator: {
        id: parseInt(user.id.replace('u', '') || '1'),
        name: user.name,
        username: user.username,
        profileImage: user.avatarUri,
      },
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      challenge: content.challenge,
      context: content.context,
      statement: content.statement,
      description: content.description
    };
    
    now.totalVotes = now.positiveVotes + now.negativeVotes;
    nows.push(now);
  }
  
  return nows;
}

const ALL_NOWS_RAW = generateDummyNowsRaw(30);

function fetchFromDummyData(page: number, categories?: string[]): Promise<{ data: MediaItem[], hasMore: boolean }> {
  return new Promise(resolve => {
    setTimeout(() => {
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      
      // Combine user created NOWs with dummy NOWs
      let allNows = [...USER_CREATED_NOWS, ...ALL_NOWS];
      let filteredNows = allNows;
      
      // Filter by categories if specified
      if (categories && categories.length > 0) {
        filteredNows = allNows.filter(now => {
          const content = COHERENT_NOW_CONTENT.find(c => {
            // Encontrar el contenido correspondiente basado en el statement o tipo
            if (now.contentType === 'user-profile') {
              return c.type === 'PERFIL_RECOMENDADO';
            } else if (now.contentType === 'challenge') {
              return c.type === 'RETO' && c.statement === now.statement;
            } else if (now.contentType === 'opinion') {
              return c.type === 'OPINIÓN' && c.statement === now.statement;
            }
            return false;
          });
          
          // Si encontramos el contenido, verificar si alguna de sus categorías está en el filtro
          if (content && content.categories) {
            return content.categories.some(cat => categories.includes(cat));
          }
          
          return false;
        });
      }
      
      const data = filteredNows.slice(start, end);
      const hasMore = end < filteredNows.length;

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

