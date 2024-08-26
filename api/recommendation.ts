import { IRecommendationParams } from "@/types/route.types";

export const getRecommendations = async (data?: IRecommendationParams) => {
  try {
    const response = await fetch(
      `http://95.80.185.74:5151/api/v1/Map/GetRecommendations?lat=${data?.lat}&lng=${data?.lng}`
    );
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(error);
  }
};
