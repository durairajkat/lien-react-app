import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { CustomerTier, CustomerTypeRequest, ProjectRole, ProjectType, State } from "../../types/master";

export const masterDataApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<ApiResponse<State[]>, void>({
      query: () => "/countries",
      keepUnusedDataFor: 3600, 
    }),

    getProjectTypes: builder.query<ApiResponse<ProjectType[]>, void>({
      query: () => "/project-types",
      keepUnusedDataFor: 3600, 
    }),

    getProjectRoles: builder.query<ApiResponse<ProjectRole[]>, void>({
      query: () => "/project-roles",
      keepUnusedDataFor: 3600, 
    }),

    getStates: builder.query<ApiResponse<State[]>, { country_id: number }>({
      query: (body) => ({
        url: "/states",
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 3600, 
    }),
    getCustomerTypes: builder.query<
      ApiResponse<CustomerTier[]>,
      CustomerTypeRequest
    >({
      query: (body) => ({
        url: "/check-project-roles-customers",
        method: "POST",
        body,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetStatesQuery,
  useGetProjectTypesQuery,
  useGetProjectRolesQuery,
  useGetCountriesQuery,
  useLazyGetCustomerTypesQuery
} = masterDataApi;
