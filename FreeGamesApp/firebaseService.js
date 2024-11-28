import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FirebaseFirestore } from "./firebaseConfig";


export const addGameToWishlist = async (game) => {
  try {
    const docRef = await addDoc(collection(FirebaseFirestore, "wishlist"), game);
    console.log("Game added to wishlist with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding game: ", e);
  }
};


export const fetchWishlist = async () => {
  const querySnapshot = await getDocs(collection(FirebaseFirestore, "wishlist"));
  const wishlist = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return wishlist;
};


export const removeGameFromWishlist = async (gameId) => {
  try {
    const gameRef = doc(FirebaseFirestore, "wishlist", gameId);
    await deleteDoc(gameRef);
    console.log("Game removed from wishlist");
  } catch (e) {
    console.error("Error removing game: ", e);
  }
};