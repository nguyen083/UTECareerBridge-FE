import { keepPreviousData, useQuery } from "@tanstack/react-query";
import company from "../services/api/company";

export const useCompany = (page, limit) => {
  return useQuery({
    queryKey: ["all-company", page, limit],
    queryFn: () =>
      company.getAllCompanyforStudent({
        page: page - 1,
        limit,
        status: "APPROVED",
      }),
    retry: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
