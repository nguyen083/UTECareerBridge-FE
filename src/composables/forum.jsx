import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import forum from "../services/api/forum";

export const useForumActive = (page = 1, size = 12) => {
  return useQuery({
    queryKey: ["forumsActive", page, size],
    queryFn: () => forum.getAllForumActive({ page: page - 1, size }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

export const useAllForum = (page = 1, size = 12) => {
  return useQuery({
    queryKey: ["forums", page, size],
    queryFn: () => forum.getAllForum({ page: page - 1, size }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

export const useSearchForum = (params) => {
  return useQuery({
    queryKey: ["searchForums", params],
    queryFn: () => forum.searchForum(params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};
export const useForumDetail = (id) => {
  return useQuery({
    queryKey: ["forumDetail", id],
    queryFn: () => forum.getDetailById(id),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};
export const useCreateForumMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => forum.createForum(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["searchForums", "forums", "forumsActive"],
      });
    },
  });
};
export const useUpdateForumMutation = () => {
  return useMutation({
    mutationFn: ({ id, ...params }) => forum.updateForum(id, params),
  });
};
export const useDeleteForumMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => forum.deleteForum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["searchForums", "forums", " forumsActive"],
      });
    },
  });
};

export const useCreateForum = () => {
  return useMutation({
    mutationFn: (params) => forum.createForum(params),
  });
};
