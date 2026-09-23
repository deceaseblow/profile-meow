import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const collections = [
          "games",
          "books",
          "music_playlists",
          "blog_posts",
          "manga",
          "socials",
          "shows",
          "movies",
          "list",
          "links",
          "blogs",
          "animes",
        ];

        const result = {};

        for (const collectionName of collections) {
          const snapshot = await getDocs(
            collection(db, collectionName)
          );

          result[collectionName] = snapshot.docs.map((doc) => ({
            ...doc.data(),
            firestoreId: doc.id,
          }));
        }

        setData(result);
      } catch (error) {
        console.error(
          "Error fetching data from Firestore:",
          error
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAppData();
  }, []);

  const getLinks = () => {
    return data?.links || [];
  };

  const getSubjects = () => {
    return data?.list || [];
  };

  return (
    <AppDataContext.Provider
      value={{
        data,
        loading,
        getLinks,
        getSubjects,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};