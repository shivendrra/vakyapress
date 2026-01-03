import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { MOCK_ARTICLES } from './mockData';
import { Article, UserProfile, UserRole, SiteContent } from '../types';

// User provided configuration
const firebaseConfig = {
  apiKey: "AIzaSyA61Acr4UMzZn0ksB-jYYSNCSGSYlZWzAE",
  authDomain: "vakyapress.firebaseapp.com",
  projectId: "vakyapress",
  storageBucket: "vakyapress.firebasestorage.app",
  messagingSenderId: "985686115980",
  appId: "1:985686115980:web:9dee5696c13e2cab6edda9",
  measurementId: "G-70L7Z8CZPF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth and DB
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// --- Auth Helpers ---

// Helper to determine role based on email/username
const determineRoleFromEmail = (email: string): UserRole => {
  const normalizedEmail = email.toLowerCase();

  // Specific Admin/Writer mapping requested
  if (normalizedEmail.startsWith('shivendrra')) return 'admin';
  if (normalizedEmail.startsWith('pradyumn')) return 'admin';
  if (normalizedEmail.startsWith('aakash')) return 'writer';

  // Generic logic for other vakyapress emails
  if (normalizedEmail.endsWith('@vakyapress.com')) return 'writer';

  return 'audience';
};

// Get User Profile from Firestore (or create default if missing)
export const getUserProfile = async (uid: string, email: string | null): Promise<UserProfile> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  } else {
    // Create new profile
    // Note: Since we are creating the profile now, we check the email to see if they should be admin/writer
    const role = email ? determineRoleFromEmail(email) : 'audience';
    const newProfile: UserProfile = {
      uid,
      email,
      displayName: email?.split('@')[0] || 'User',
      role,
      preferences: {
        mutedTopics: [],
        emailNotifications: true
      }
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  }
};

export const signInWithGoogle = async (): Promise<UserProfile> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return await getUserProfile(user.uid, user.email);
  } catch (error) {
    console.error("Google Sign In Error", error);
    throw error;
  }
};

export const signOutUser = async () => {
  await firebaseSignOut(auth);
};

// --- Data Services ---

// Mock Service for UI Demo (retained for functionality until Firestore is populated)
export const getArticles = async (): Promise<Article[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ARTICLES), 500);
  });
};

export const getArticleById = async (id: string): Promise<Article | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ARTICLES.find(a => a.id === id)), 300);
  });
};

export const getRelatedArticles = async (currentArticleId: string, category: string): Promise<Article[]> => {
  // In a real app, this would be a Firestore query
  return new Promise((resolve) => {
    setTimeout(() => {
      const related = MOCK_ARTICLES
        .filter(a => a.category === category && a.id !== currentArticleId)
        .slice(0, 3);

      // If not enough related by category, just fill with others for demo
      if (related.length < 3) {
        const others = MOCK_ARTICLES
          .filter(a => a.id !== currentArticleId && a.category !== category)
          .slice(0, 3 - related.length);
        resolve([...related, ...others]);
      } else {
        resolve(related);
      }
    }, 300);
  });
};

// --- Site Content Management ---

export const getSiteContent = async (): Promise<SiteContent | null> => {
  try {
    const docRef = doc(db, "site_settings", "content");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SiteContent;
    }
    return null;
  } catch (e) {
    console.error("Error fetching site content", e);
    return null;
  }
};

export const saveSiteContent = async (content: SiteContent): Promise<void> => {
  try {
    const docRef = doc(db, "site_settings", "content");
    await setDoc(docRef, content);
  } catch (e) {
    console.error("Error saving site content", e);
    throw e;
  }
};