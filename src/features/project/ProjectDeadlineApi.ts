import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { CalculatedDeadlineResponse, DeadLineRequestType } from "../../types/deadline";

export const DeadlineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* ---------- Deadline calculation ---------- */
    calculateDeadline: builder.mutation<
      ApiResponse<CalculatedDeadlineResponse>,
      DeadLineRequestType
    >({
      query: (body) => ({
        url: "/deadline-info",
        method: "POST",
        body,
      }),
    }),
     
  }),

  overrideExisting: false,
});

export const {
  useCalculateDeadlineMutation
} = DeadlineApi;