import { keepPreviousData, useQuery } from "@tanstack/react-query";
import forum from "../services/api/forum";

export const useForumActive = (page = 1, size = 12) => {
  return useQuery({
    queryKey: ["forumsActive", page, size],
    queryFn: () => forum.getAllForumActive({ page: page - 1, size }),
    placeholderData: keepPreviousData,
  });
};

export const useAllForum = () => {
  return useQuery({
    queryKey: ["forums"],
    queryFn: () => forum.getAllForum(),
    placeholderData: keepPreviousData,
  });
};

export const useSearchForum = (params) => {
  return useQuery({
    queryKey: ["forums", params],
    queryFn: () => forum.searchForum(params),
    placeholderData: keepPreviousData,
  });
};
