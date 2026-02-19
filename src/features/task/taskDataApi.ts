import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { CommonData } from "../../types/master";

export const taskDataApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTaskActions: builder.query<ApiResponse<CommonData[]>, void>({
          query: () => "/task-actions",
          // keepUnusedDataFor: 3600,
        }),
        
  }),
});

export const {
    useGetTaskActionsQuery
} = taskDataApi;