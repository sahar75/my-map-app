import { queryKeys } from "@/queryKeys";
import { IRecommendationParams, IRoute } from "@/types/route.types";
import { useQuery } from "@tanstack/react-query";

const getRecommendations = async (data?: IRecommendationParams) => {
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

export const useGetRecommendationsQuery = (params?: IRecommendationParams) =>
  useQuery<IRoute[]>({
    queryKey: [queryKeys.recommendations],
    queryFn: () => getRecommendations(params),
    enabled: Boolean(params?.lat && params?.lng),
  });
