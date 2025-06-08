import { useQuery } from "@tanstack/react-query";
import about from "../services/api/about";

export const useAbout = () => {
  return useQuery({
    queryKey: ["about"],
    queryFn: () => about.getAbout(),
    refetchOnWindowFocus: false,
  });
};
