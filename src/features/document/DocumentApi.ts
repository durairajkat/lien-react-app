import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";

export interface Document {
    id: number;
    title: string;
    file_url: string;
    date: string;
    filename: string;
    file_size_bytes: number;
    file_size: string;
    note: string | null;
}

export interface ProjectDocumentResponse {
    project_id: number;
    project_name: string;
    documents: Document[];
}

export const projectDocumentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProjectDocument: builder.query<ApiResponse<ProjectDocumentResponse[]>, void>({
            query: () => `/documents`,
            providesTags: ['Documents'],
        }),
        deleteDocument: builder.mutation<
            ApiResponse<any>,
            { documentId: number }
        >({
            query: (body) => ({
                url: "/document/delete",
                method: "POST",
                body,
            }),
            invalidatesTags: ['Documents'],
        }),

        uploadDocument: builder.mutation<
            ApiResponse<any>,
            { projectId: number; files: File[] }
        >({
            query: ({ projectId, files }) => {

                const formData = new FormData();

                formData.append("project_id", projectId.toString());

                files.forEach((file) => {
                    formData.append("documents[]", file);
                });

                return {
                    url: "/documents/upload",
                    method: "POST",
                    body: formData,
                };
            },

            invalidatesTags: ['Documents'],
        }),
    }),
});


export const {
    useGetProjectDocumentQuery,
    useDeleteDocumentMutation,
    useUploadDocumentMutation
} = projectDocumentApi;