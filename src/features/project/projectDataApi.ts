import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { RemedyDateRequest, RemedyDateType } from "../../types/date";
import { ProjectWizardData, WizardDraftResponse } from "../../types/project";

export interface SaveWizardStepRequest {
  draft_id?: number;
  step: number;
  data: Partial<ProjectWizardData>;
}

export interface FinalProjectRequest {
  data: ProjectWizardData;
}

/* ---------------- API ---------------- */

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({

    /* ---------- SAVE WIZARD STEP (AUTO-SAVE) ---------- */
    saveWizardStep: builder.mutation<
      ApiResponse<{ draft_id: number }>,
      SaveWizardStepRequest
    >({
      query: (body) => ({
        url: "/projects/wizard/save-step",
        method: "POST",
        body,
      }),
    }),

    /* ---------- GET DRAFT (RESUME) ---------- */
    getProjectInfo: builder.query<
      ApiResponse<WizardDraftResponse>,
      {projectId: number}
    >({
      query: (params) => ({
        url: "/projects/info",
        params,
      }),
    }),

    /* ---------- FINAL SUBMIT ---------- */
    submitProject: builder.mutation<
      ApiResponse<any>,
      FormData
    >({
      query: (body) => ({
        url: "/save-project",
        method: "POST",
        body,
      }),
    }),

    /* ---------- DELETE DRAFT AFTER SUBMIT ---------- */
    deleteWizardDraft: builder.mutation<void, number>({
      query: (draftId) => ({
        url: `/projects/wizard/draft/${draftId}`,
        method: "DELETE",
      }),
    }),
     getRemedyDates: builder.query<
          ApiResponse<RemedyDateType[]>,
          RemedyDateRequest
        >({
          query: (body) => ({
            url: "/remedy-dates",
            method: "POST",
            body,
          }),
        }),
  }),

  overrideExisting: false,
});

/* ---------------- HOOK EXPORTS ---------------- */

export const {
  useSaveWizardStepMutation,
  useGetProjectInfoQuery,
  useSubmitProjectMutation,
  useDeleteWizardDraftMutation,
  useGetRemedyDatesQuery
} = projectApi;