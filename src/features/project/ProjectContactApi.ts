import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { Customer } from "../../types/customer";

export const ProjectContactApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProjectContacts: builder.query<ApiResponse<Customer[]>, void>({
            query: () => "/project-contacts-all",
            keepUnusedDataFor: 3600,
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetProjectContactsQuery
} = ProjectContactApi;