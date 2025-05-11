import Constants from 'expo-constants';

const PEXELS_API_KEY = Constants.expoConfig?.extra?.PEXELS_API_KEY;

interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  video_files: {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }[];
}

export async function getVerticalVideo(): Promise<string | null> {
  try {
    console.log('Fetching video from Pexels API...');
    console.log('API Key present:', !!PEXELS_API_KEY);
    
    const response = await fetch(
      'https://api.pexels.com/videos/search?query=nature&orientation=portrait&per_page=1',
      {
        headers: {
          Authorization: PEXELS_API_KEY!
        }
      }
    );
    
    console.log('Pexels API Response status:', response.status);
    const data = await response.json();
    
    if (data.videos?.[0]) {
      const video: PexelsVideo = data.videos[0];
      // First try to get HD (720p or 1080p) vertical video
      const videoFile = video.video_files
        .filter(file => 
          file.height > file.width && // Ensure vertical aspect ratio
          file.quality.toLowerCase().includes('hd') && // HD quality
          file.height <= 1280 // Max height 720p or 1080p
        )
        .sort((a, b) => (b.height * b.width) - (a.height * a.width))[0];

      // Fallback to any vertical video if HD not available
      const fallbackVideo = !videoFile ? video.video_files
        .filter(file => file.height > file.width)
        .sort((a, b) => (b.height * b.width) - (a.height * a.width))[0] : null;
      
      const selectedVideo = videoFile || fallbackVideo;
      console.log('Selected video file:', JSON.stringify(selectedVideo, null, 2));
      return selectedVideo?.link || null;
    }
    console.warn('No vertical videos found in response');
    return null;
  } catch (error) {
    console.error('Error fetching video from Pexels:', error);
    return null;
  }
}