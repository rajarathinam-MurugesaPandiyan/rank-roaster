import axios from "axios";

/**
 * Returns a valid URL for displaying or downloading a document/photo.
 * If given an S3 object key or relative key, fetches a fresh presigned GET URL from the backend.
 */
export async function getPresignedDocumentUrl(
  keyOrUrl?: string,
): Promise<string> {
  if (!keyOrUrl) return "";

  // If it's already a full HTTP/HTTPS URL, return it directly
  if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
    return keyOrUrl;
  }

  const formatBackendUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `http://localhost:8080${cleanPath}`;
  };

  try {
    const response = await axios.get(
      `http://localhost:8080/public/documents/presigned-url?key=${encodeURIComponent(keyOrUrl)}`,
    );
    if (response.data && response.data.url) {
      return formatBackendUrl(response.data.url);
    }
  } catch (err) {
    console.error("Error fetching presigned URL for key:", keyOrUrl, err);
  }

  return formatBackendUrl(keyOrUrl);
}
