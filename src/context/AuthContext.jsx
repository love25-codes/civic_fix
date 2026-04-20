import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {

      // FIRST TIME ONLY: stop global loading
      setLoading(false);

      if (!firebaseUser) {
        setUser(null);
        return;
      }

      // STEP 1: set user immediately (NO WAIT)
      const basicUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || "User",
      };

      setUser(basicUser);

      // STEP 2: enrich from Firestore (non-blocking)
      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));

        if (snap.exists()) {
          setUser((prev) => ({
            ...prev,
            name: snap.data().name || prev.name,
          }));
        }
      } catch (err) {
        console.error("Firestore error:", err);
      }
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);