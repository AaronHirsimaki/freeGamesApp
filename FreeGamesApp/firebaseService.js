import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FirebaseFirestore } from "./firebaseConfig"; // Tuodaan Firestore

// Funktio pelin lisäämiseksi toivelistalle
export const addGameToWishlist = async (game) => {
  try {
    const docRef = await addDoc(collection(FirebaseFirestore, "wishlist"), game); // Lisää peli "wishlist" kokoelmaan
    console.log("Game added to wishlist with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding game: ", e);
  }
};

// Funktio toivelistan hakemiseksi
export const fetchWishlist = async () => {
  const querySnapshot = await getDocs(collection(FirebaseFirestore, "wishlist"));
  const wishlist = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return wishlist;
};

// Funktio pelin poistamiseksi toivelistalta
export const removeGameFromWishlist = async (gameId) => {
  try {
    const gameRef = doc(FirebaseFirestore, "wishlist", gameId); // Haetaan pelin viite toivelistalta
    await deleteDoc(gameRef); // Poistetaan peli
    console.log("Game removed from wishlist");
  } catch (e) {
    console.error("Error removing game: ", e);
  }
};