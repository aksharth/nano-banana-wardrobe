// Clothing items data with external URLs
// These URLs represent the clothing items you want to use
export const clothingItemsData = [
  {
    id: "shirt1",
    name: "Compass Print Shirt",
    type: "top",
    url: "https://m.media-amazon.com/images/I/61F0UAXJyFL._AC_UY1100_.jpg",
    category: "shirt"
  },
  {
    id: "shirt2", 
    name: "Green Pattern Kurta",
    type: "top",
    url: "https://m.media-amazon.com/images/I/71cXYKjyCjL._AC_UY1100_.jpg",
    category: "kurta"
  },
  {
    id: "shirt3",
    name: "Green Ethnic Shirt", 
    type: "top",
    url: "https://m.media-amazon.com/images/I/71cXYKjyCjL._AC_UY1100_.jpg",
    category: "shirt"
  },
  {
    id: "shirt4",
    name: "Black Ribbed Shirt",
    type: "top", 
    url: "https://m.media-amazon.com/images/I/61mvPx8Y-4L._AC_UY1100_.jpg",
    category: "shirt"
  },
  {
    id: "shirt5",
    name: "Beige Ribbed Henley",
    type: "top",
    url: "https://m.media-amazon.com/images/I/71LpkosXVmL._AC_UY1100_.jpg",
    category: "henley"
  },
  {
    id: "shirt6",
    name: "Blue Casual Shirt",
    type: "top",
    url: "https://m.media-amazon.com/images/I/71VjSPCn-NL._AC_UY1100_.jpg",
    category: "shirt"
  },
  {
    id: "shirt7",
    name: "Linen Beach Shirt",
    type: "top",
    url: "https://m.media-amazon.com/images/I/61F0UAXJyFL._AC_UY1100_.jpg",
    category: "shirt"
  }
];

// Helper function to get random items
export const getRandomClothingItems = (count: number = 4) => {
  const shuffled = [...clothingItemsData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Helper to get items by type
export const getClothingItemsByType = (type: 'top' | 'bottom') => {
  return clothingItemsData.filter(item => item.type === type);
};