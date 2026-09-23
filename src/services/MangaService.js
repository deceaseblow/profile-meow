import axios from "axios";

export const fetchMangaData = async () => {
  try {
    const response = await axios.get("./data.json");
    return response.data.manga;
  } catch (error) {
    console.error("Error fetching manga data:", error);
    return [];
  }
};
