// src/services/api.ts

import { MediaItem } from '../types/media';

// Dummy data - In a real app, this comes from a server.
// Using free stock videos and images for demonstration.
const ALL_NOWS: MediaItem[] = [
  {
    id: '1',
    type: 'video',
    uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    text: 'Disfrutando de la naturaleza! 🌳 #naturaleza #relax',
    author: { id: 'u1', name: 'Elena', avatarUri: 'https://i.pravatar.cc/150?u=elena' },
    likes: 1204,
    comments: 152,
  },
  {
    id: '2',
    type: 'image',
    uri: 'https://picsum.photos/id/237/1080/1920',
    text: 'Mi mejor amigo. 🐾 #perros #mascotas',
    author: { id: 'u2', name: 'Carlos', avatarUri: 'https://i.pravatar.cc/150?u=carlos' },
    likes: 5432,
    comments: 341,
  },
  {
    id: '3',
    type: 'video',
    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    text: 'Reto de baile, ¿quién se apunta? 💃 #baile #reto',
    author: { id: 'u3', name: 'Ana', avatarUri: 'https://i.pravatar.cc/150?u=ana' },
    likes: 25890,
    comments: 1203,
  },
  {
    id: '4',
    type: 'image',
    uri: 'https://picsum.photos/id/10/1080/1920',
    text: 'Vistas que quitan el aliento. #viajes #montaña',
    author: { id: 'u4', name: 'Javier', avatarUri: 'https://i.pravatar.cc/150?u=javier' },
    likes: 876,
    comments: 99,
  },
  // Add 10-15 more items to test infinite scroll properly
  {
    id: '5',
    type: 'video',
    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    text: 'Cocinando algo delicioso! 😋 #receta #comida',
    author: { id: 'u1', name: 'Elena', avatarUri: 'https://i.pravatar.cc/150?u=elena' },
    likes: 4321,
    comments: 456,
  },
  {
    id: '6',
    type: 'image',
    uri: 'https://picsum.photos/id/101/1080/1920',
    text: 'Opinión: El arte debe ser accesible para todos. #arte #opinion',
    author: { id: 'u2', name: 'Carlos', avatarUri: 'https://i.pravatar.cc/150?u=carlos' },
    likes: 231,
    comments: 45,
  },
];


const PAGE_SIZE = 3;

// Simulates fetching a page of "NOWs"
export const fetchNows = async (page: number): Promise<{ data: MediaItem[], hasMore: boolean }> => {
  console.log(`Fetching page ${page}...`);
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000));

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  
  const data = ALL_NOWS.slice(start, end);
  const hasMore = end < ALL_NOWS.length;

  return { data, hasMore };
};