import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { Customer } from "../../types/customer";

export const ProjectContactApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProjectContacts: builder.query<
            {
                customerContact: any[];
                projectContact: any[];
            },
            void
        >({
            query: () => "/project-contacts-all",
            providesTags: ["ProjectContacts"],
            // keepUnusedDataFor: 3600,
        }),

        uploadCustomerExcel: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "/upload-customer-contact-excel",
                method: "POST",
                body: formData,
            }),
        }),
        submitCustomerContact: builder.mutation<
              ApiResponse<any>,
              Customer
            >({
              query: (body) => ({
                url: "/save-customer-contact",
                method: "POST",
                body,
              }),
              invalidatesTags: ["ProjectContacts"],
            }),

            submitProjectContact: builder.mutation<
              ApiResponse<any>,
              Customer
            >({
              query: (body) => ({
                url: "/save-project-contact",
                method: "POST",
                body,
              }),
              invalidatesTags: ["ProjectContacts"],
            }),
    }),
    overrideExisting: false,
});

export const {
    useGetProjectContactsQuery,
    useUploadCustomerExcelMutation,
    useSubmitCustomerContactMutation,
    useSubmitProjectContactMutation
} = ProjectContactApi;