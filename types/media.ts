
export interface Author {
  id: string;
  name: string;
  avatarUri: string;
}

export interface MediaItem {
  id: string;
  type: 'video' | 'image';
  uri: string; // URL for the video or image
  text: string;
  author: Author;
  likes: number;
  comments: number;
}
