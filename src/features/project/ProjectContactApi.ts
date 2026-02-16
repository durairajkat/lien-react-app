import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { Customer } from "../../types/customer";

export const ProjectContactApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProjectContacts: builder.query<ApiResponse<Customer[]>, void>({
            query: () => "/project-contacts-all",
            keepUnusedDataFor: 3600,
        }),
        uploadCustomerExcel: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "/upload-customer-contact-excel",
                method: "POST",
                body: formData,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetProjectContactsQuery,
    useUploadCustomerExcelMutation
} = ProjectContactApi;