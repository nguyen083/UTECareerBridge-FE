import { useQuery } from "@tanstack/react-query";
import interview from "../services/api/interview";

export const useListInterviewEmployer = () => {
    return useQuery({
        queryKey: ["listInterviewEmployer"],
        queryFn: () => interview.getListInterviewEmployer(),
    });
};


