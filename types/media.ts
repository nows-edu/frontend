
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
  challengeId?: string;
  challengeTitle?: string;
}

// NOWs types for backend integration
export interface NowCreator {
  id: number;
  name: string;
  username: string;
  profileImage?: string;
}

export interface NowItem {
  id: number;
  url_content: string;
  type: string; // Reto, Opiniones, Actividad, etc.
  created_at: string;
  creator: NowCreator;
  votesCount: number;
  positiveVotes: number;
  negativeVotes: number;
  activity?: any;
  context?: any;
  tags: any[];
}
