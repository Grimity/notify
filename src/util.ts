const imagePrefix = 'https://image.grimity.com';
const servicePrefix = 'https://www.grimity.com';

export function getImageUrl(image: string): string;
export function getImageUrl(image: string | null): string | null;
export function getImageUrl(image: string | null) {
  return image ? `${imagePrefix}/${image}` : null;
}

export function getProfileLink(url: string) {
  return `${servicePrefix}/${url}`;
}

export function getFeedLink(id: string) {
  return `${servicePrefix}/feeds/${id}`;
}

export function getPostLink(id: string) {
  return `${servicePrefix}/posts/${id}`;
}
