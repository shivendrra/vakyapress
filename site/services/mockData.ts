import { Article } from '../types';

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: "The Silent Echo of the Mountains",
    subtitle: "How climate change is shifting the cultural landscape of the Himalayas.",
    excerpt: "In the high peaks, the snow is melting, and with it, centuries of tradition are flowing away into the swollen rivers below.",
    content: "Full article content would go here...",
    author: "Elena Fisher",
    authorImage: "https://picsum.photos/100/100?random=1",
    category: "Environment",
    imageUrl: "https://picsum.photos/800/600?random=101",
    publishedAt: "Oct 12, 2023",
    featured: true
  },
  {
    id: '2',
    title: "Digital Nomads in a Analog World",
    excerpt: "Exploring the friction between remote work hubs and local communities in Southeast Asia.",
    content: "Content...",
    author: "Raj Patel",
    category: "Culture",
    imageUrl: "https://picsum.photos/800/600?random=102",
    publishedAt: "Nov 05, 2023"
  },
  {
    id: '3',
    title: "The Future of Public Transport",
    excerpt: "Why mega-cities are turning back to buses and trams to solve congestion.",
    content: "Content...",
    author: "Sarah Jenkins",
    category: "Urbanism",
    imageUrl: "https://picsum.photos/800/600?random=103",
    publishedAt: "Nov 10, 2023"
  },
  {
    id: '4',
    title: "Culinary Heritage of the Deep South",
    excerpt: "Preserving recipes that tell the story of struggle and triumph.",
    content: "Content...",
    author: "Jerome Bell",
    category: "Food",
    imageUrl: "https://picsum.photos/800/600?random=104",
    publishedAt: "Nov 12, 2023"
  }
];