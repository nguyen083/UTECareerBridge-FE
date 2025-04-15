import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import notification from './../services/api/notification';

export const useNotification = (userId) => {
    return useQuery({
        queryKey: ["notificationList", userId],
        queryFn: () => notification.getAllNotification(userId),
        select: (data) => data.data.content,
        enabled: !!userId,
    });
};

export const useNotificationPersonal = (userId, params) => {
    return useQuery({
        queryKey: ["notificationPersonal", userId, params],
        queryFn: () => notification.getNotificationPersonal(userId, params),
        enabled: !!userId,
    });
};
export const useNotificationBroadcast = (params) => {
    return useQuery({
        queryKey: ["notificationBroadcast", params],
        queryFn: () => notification.getNotificationBroadcast(params),
    });
};

export const useNotificationCount = (userId) => {
    return useQuery({
        queryKey: ["notificationCount", userId],
        queryFn: () => notification.countNotification(userId),
        select: (data) => data.data,
        enabled: !!userId,
    });
};

export const useNotificationRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => notification.readNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
            queryClient.invalidateQueries({ queryKey: ["notificationList"] });
        },
    });
};

export const useNotificationReadAll = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => notification.readAllNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
            queryClient.invalidateQueries({ queryKey: ["notificationList"] });
        },
    });
};
export const useDetailNotification = (id) => {
    return useQuery({
        queryKey: ["notification", id],
        queryFn: () => notification.getNotificationById(id),
        enabled: !!id,
        select: (data) => data.data,
    });
};


