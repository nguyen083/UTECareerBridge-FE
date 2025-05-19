import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import topic from "../services/api/topic";

export const useAllTopic = () => {
  return useQuery({
    queryKey: ["topics"],
    queryFn: () => topic.getAllTopic(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

export const useAllTopicByForumId = (id, params) => {
  return useQuery({
    queryKey: ["topicsByForumId", id, params],
    queryFn: () => topic.getByForumId(id, params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

export const useSearchTopic = (params) => {
  return useQuery({
    queryKey: ["searchTopics"],
    queryFn: () => topic.searchTopic(params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};
export const useTopicDetail = (id) => {
  return useQuery({
    queryKey: ["topicDetail", id],
    queryFn: () => topic.getDetailById(id),
    refetchOnWindowFocus: false,
  });
};
export const useTopicByUserId = (id) => {
  return useQuery({
    queryKey: ["topicByUserId", id],
    queryFn: () => topic.getByUserId(id),
    refetchOnWindowFocus: false,
  });
};
export const useCreateTopicMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => topic.createTopic(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["searchTopics", "topics", "topicsByForumId"],
      });
    },
  });
};
export const useUpdateTopicMutation = () => {
  return useMutation({
    mutationFn: (id, params) => topic.updateTopic(id, params),
  });
};
export const useDeleteTopicMutation = () => {
  return useMutation({
    mutationFn: (id) => topic.deleteTopic(id),
  });
};
export const usePinTopicMutation = () => {
  return useMutation({
    mutationFn: (id) => topic.pinTopic(id),
  });
};
