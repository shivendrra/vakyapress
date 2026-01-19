import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc, updateDoc, addDoc, query, orderBy, where } from "firebase/firestore";
import { Article, UserProfile, UserRole, SiteContent, Product, JobApplication, StaffProfile } from '../types';

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
// const analytics = getAnalytics(app);

// Export Auth and DB
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// --- Auth Helpers ---

// Helper to determine role based on email/username
const determineRoleFromEmail = (email: string): UserRole => {
  const normalizedEmail = email.toLowerCase();

  // Specific Admin/Writer mapping
  if (normalizedEmail.startsWith('shivendrra')) return 'admin';
  if (normalizedEmail.startsWith('pradyumn')) return 'admin';
  if (normalizedEmail.startsWith('aakash')) return 'writer';

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

// Update a user's role by finding them via email (Admin function)
export const updateUserRoleByEmail = async (email: string, newRole: UserRole): Promise<boolean> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`No user found with email ${email} to update role.`);
      return false;
    }

    // Assuming email is unique, update the first match
    const userDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, "users", userDoc.id), { role: newRole });
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    return false;
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

// --- Data Services (Articles) ---

export const getArticles = async (): Promise<Article[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "articles"));
    const articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      articles.push({ id: doc.id, ...doc.data() } as Article);
    });
    return articles;
  } catch (error) {
    console.error("Error getting articles: ", error);
    return [];
  }
};

export const getArticleById = async (id: string): Promise<Article | undefined> => {
  try {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Article;
    }
    return undefined;
  } catch (error) {
    console.error("Error getting article: ", error);
    return undefined;
  }
};

export const getArticlesByAuthor = async (authorName: string): Promise<Article[]> => {
  try {
    const q = query(collection(db, "articles"), where("author", "==", authorName));
    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      articles.push({ id: doc.id, ...doc.data() } as Article);
    });
    return articles;
  } catch (error) {
    console.error("Error getting articles by author: ", error);
    return [];
  }
};

export const saveArticle = async (article: Article, isNew: boolean): Promise<void> => {
  try {
    if (isNew) {
      // Remove ID for addDoc to generate one, or use setDoc with custom ID
      // Here we use the passed ID if it's meant to be custom, otherwise addDoc
      const { id, ...data } = article;
      await addDoc(collection(db, "articles"), data);
    } else {
      const { id, ...data } = article;
      const docRef = doc(db, "articles", id);
      await updateDoc(docRef, data as any);
    }
  } catch (error) {
    console.error("Error saving article: ", error);
    throw error;
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "articles", id));
  } catch (error) {
    console.error("Error deleting article: ", error);
    throw error;
  }
};

export const getRelatedArticles = async (currentArticleId: string, category: string): Promise<Article[]> => {
  // Basic client-side filtering for now as Firestore inequality filtering requires indexes
  const allArticles = await getArticles();
  return allArticles
    .filter(a => a.category === category && a.id !== currentArticleId)
    .slice(0, 3);
};

// --- Data Services (Products) ---

export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
  } catch (error) {
    console.error("Error getting products: ", error);
    return [];
  }
};

export const saveProduct = async (product: Product, isNew: boolean): Promise<void> => {
  try {
    if (isNew) {
      const { id, ...data } = product;
      await addDoc(collection(db, "products"), data);
    } else {
      const { id, ...data } = product;
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, data as any);
    }
  } catch (error) {
    console.error("Error saving product: ", error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "products", id));
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
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

// --- Job Applications ---

export const submitJobApplication = async (application: Omit<JobApplication, 'id'>): Promise<void> => {
  try {
    await addDoc(collection(db, "job_applications"), application);
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

export const getJobApplications = async (): Promise<JobApplication[]> => {
  try {
    const q = query(collection(db, "job_applications"), orderBy("submittedAt", "desc"));
    const snapshot = await getDocs(q);
    const apps: JobApplication[] = [];
    snapshot.forEach(doc => {
      apps.push({ id: doc.id, ...doc.data() } as JobApplication);
    });
    return apps;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};

export const updateApplicationStatus = async (id: string, status: JobApplication['status']): Promise<void> => {
  try {
    const docRef = doc(db, "job_applications", id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

// --- Staff/Author Profiles ---

export const getAllStaff = async (): Promise<StaffProfile[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "staff"));
    const staff: StaffProfile[] = [];
    querySnapshot.forEach((doc) => {
      staff.push(doc.data() as StaffProfile);
    });
    return staff;
  } catch (error) {
    console.error("Error getting staff:", error);
    return [];
  }
};

export const getStaffBySlug = async (slug: string): Promise<StaffProfile | undefined> => {
  try {
    const docRef = doc(db, "staff", slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as StaffProfile;
    }
    return undefined;
  } catch (error) {
    console.error("Error getting staff by slug:", error);
    return undefined;
  }
};

export const saveStaffMember = async (staff: StaffProfile): Promise<void> => {
  try {
    // Save public profile
    await setDoc(doc(db, "staff", staff.id), staff);

    // Update permission in users collection if email exists
    if (staff.email) {
      await updateUserRoleByEmail(staff.email, staff.accessLevel);
    }
  } catch (error) {
    console.error("Error saving staff member:", error);
    throw error;
  }
};

export const deleteStaffMember = async (id: string): Promise<void> => {
  try {
    // Optional: We might want to revoke access upon deletion, 
    // but typically we just remove the public profile here.
    await deleteDoc(doc(db, "staff", id));
  } catch (error) {
    console.error("Error deleting staff member:", error);
    throw error;
  }
};