// Real product images from Unsplash and other free sources
export const PRODUCT_IMAGES = {
  // Gaming products
  valorant: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
  steam: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
  fortnite: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
  gameCredits: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
  gameKey: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
};

// Real avatar images
export const AVATAR_IMAGES = {
  default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  gamer: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer',
  seller: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller',
  reviewer1: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reviewer1',
  reviewer2: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reviewer2',
};

// Helper function to get product image by name
export function getProductImage(productName: string): string {
  const name = productName.toLowerCase();
  if (name.includes('valorant')) return PRODUCT_IMAGES.valorant;
  if (name.includes('steam')) return PRODUCT_IMAGES.steam;
  if (name.includes('fortnite') || name.includes('v-bucks')) return PRODUCT_IMAGES.fortnite;
  if (name.includes('credit')) return PRODUCT_IMAGES.gameCredits;
  return PRODUCT_IMAGES.default;
}

// Helper function to get avatar
export function getAvatar(seed?: string): string {
  if (!seed) return AVATAR_IMAGES.default;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

