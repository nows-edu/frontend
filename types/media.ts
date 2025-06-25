export interface Author {
  id: string;
  name: string;
  avatarUri: string;
  status?: string;
}

export interface MediaItem {
  id: string;
  mediaType: 'video' | 'image';
  contentType: 'challenge' | 'opinion' | 'user-profile';
  uri: string;
  text: string;
  author: Author;
  likes: number;
  comments: number;
  challengeId?: string;
  challengeTitle?: string;
  // Datos específicos para user-profile
  profileData?: {
    education: string;
    location: string;
    interests: string[];
    status: string;
    statusColor?: string;
  };
}

// NOWs types for backend integration
export interface NowCreator {
  id: number;
  name: string;
  username: string;
  profileImage?: string;
  status?: string;
}

export interface NowItem {
  id: number;
  url_content: string;
  type: string;
  created_at: string;
  creator: NowCreator;
  votesCount: number;
  positiveVotes: number;
  negativeVotes: number;
  activity?: any;
  context?: any;
  tags: any[];
}
