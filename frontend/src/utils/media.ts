/**
 * Utility function to parse, detect and format image, video, and Google Drive links.
 * Automatically converts Google Drive share URLs into direct CDN/preview links.
 */
export function parseMediaUrl(inputUrl: string, explicitType?: 'image' | 'video'): {
  displayUrl: string;
  isEmbed: boolean;
  mediaType: 'image' | 'video';
} {
  if (!inputUrl) {
    return { displayUrl: "", isEmbed: false, mediaType: explicitType || 'image' };
  }
  
  const trimmed = inputUrl.trim();

  // 1. Google Drive Link Matching
  // e.g. https://drive.google.com/file/d/1x2y3z4w5v/view?usp=sharing
  // e.g. https://drive.google.com/open?id=1x2y3z4w5v
  // e.g. https://drive.google.com/uc?id=1x2y3z4w5v
  const driveMatch = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    
    // Check if explicit video or URL contains video indicators
    if (explicitType === 'video' || trimmed.includes("video") || trimmed.includes(".mp4") || trimmed.includes(".mov") || trimmed.includes("/preview")) {
      return {
        displayUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        isEmbed: true,
        mediaType: 'video'
      };
    }
    // High-res direct image link for Google Drive
    return {
      displayUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
      isEmbed: false,
      mediaType: explicitType || 'image'
    };
  }

  // 2. YouTube Link Matching
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    return {
      displayUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      isEmbed: true,
      mediaType: 'video'
    };
  }

  // 3. Direct video files or explicit video type
  if (explicitType === 'video' || trimmed.endsWith('.mp4') || trimmed.endsWith('.webm') || trimmed.endsWith('.mov')) {
    return {
      displayUrl: trimmed,
      isEmbed: false,
      mediaType: 'video'
    };
  }

  return {
    displayUrl: trimmed,
    isEmbed: false,
    mediaType: explicitType || 'image'
  };
}
