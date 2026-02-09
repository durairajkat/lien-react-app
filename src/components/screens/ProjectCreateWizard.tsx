import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import Swal from "sweetalert2";
import ProjectWizardStepper from "../wizard/projects/ProjectWizardStepper";
import DocumentUploadFirstStep from "../wizard/projects/DocumentUploadFirstStep";
import { initialProjectWizardData, ProjectWizardData } from "../../types/project";
import DetailsStep from "../wizard/projects/DetailsStep";
import DatesStep from "../wizard/projects/DatesStep";
import { useGetCountriesQuery, useGetProjectRolesQuery, useGetProjectTypesQuery } from "../../features/master/masterDataApi";
import { Template } from "../layout/member/Template";
import { useGetProjectInfoQuery, useSubmitProjectMutation } from "../../features/project/projectDataApi";
import { SESSION_WIZARD_KEY } from "../../utils/constant";

const ProjectCreateWizard = () => {
    const { projectId: routeProjectId } = useParams<{ projectId?: string }>();
    const navigate = useNavigate();
    const resolvedProjectId = routeProjectId ? Number(routeProjectId) : undefined;

    const [currentStep, setCurrentStep] = useState(1);
    const [projectData, setProjectData] = useState<ProjectWizardData>(initialProjectWizardData);

    const [
        submitProject,
        { isLoading: saveLoading},
    ] = useSubmitProjectMutation();


    const { data: typesRes } = useGetProjectTypesQuery();
    const { data: rolesRes } = useGetProjectRolesQuery();
    const { data: countriesRes } = useGetCountriesQuery(undefined, {
        refetchOnFocus: false,
        refetchOnReconnect: false
    });
    const { data, isLoading } = useGetProjectInfoQuery(
        resolvedProjectId ? { projectId: resolvedProjectId } : skipToken,
        {
            skip: !resolvedProjectId,
        }
    );

    const isEditMode = Boolean(resolvedProjectId);

    console.log('Is Edit Mode:', isEditMode);
    console.log('Fetched Project Info:', data, isLoading);

    const countries = countriesRes?.data ?? [];
    const projectTypes = typesRes?.data ?? [];
    const roles = rolesRes?.data ?? [];

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 11));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
    const goToStep = (step: number) => setCurrentStep(step);

    const updateProjectData = useCallback((data: Partial<ProjectWizardData>) => {
        setProjectData((prev) => {
            const updatedData = { ...prev, ...data };
            if (!isEditMode) {
                sessionStorage.setItem(
                    SESSION_WIZARD_KEY,
                    JSON.stringify({
                        data: updatedData,
                        step: currentStep,
                    })
                );
            }
            return updatedData;
        });
    }, []);

    const saveAndExit = async () => {
        try {
            const response = await submitProject(projectData).unwrap();

            if (response.status) {
                sessionStorage.removeItem(SESSION_WIZARD_KEY);
                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: "Project saved successfully",
                });
                navigate("/dashboard");
            }

        } catch (err) {

            const errorMessage =
                (err as any)?.data?.errors?.projectError?.[0] ||
                (err as any)?.data?.message ||
                "Something went wrong";

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        }
    };

    useEffect(() => {
        if (countries && countries.length > 0 && !projectData.countryId) {
            let usCountryId = countries.find(c => c.name === 'United States')?.id || 0;
            setProjectData((prev) => ({ ...prev, countryId: usCountryId }));
        }
    }, [countries]);

    useEffect(() => {
        const saved = sessionStorage.getItem(SESSION_WIZARD_KEY);

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setProjectData(parsed.data ?? initialProjectWizardData);
                setCurrentStep(parsed.step ?? 1);
            } catch (e) {
                console.error("Invalid session wizard data", e);
                sessionStorage.removeItem(SESSION_WIZARD_KEY);
            }
        }

    }, []);

    console.log('Project Data:', projectData);

    const renderWizardStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <DocumentUploadFirstStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        onNext={nextStep}
                        onSkip={nextStep}
                    />
                );
            case 2:
                return (
                    <DetailsStep
                        data={projectData}
                        countries={countries}
                        projectTypes={projectTypes}
                        roles={roles}
                        onUpdate={updateProjectData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 3:
                return (
                    <DatesStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        onNext={nextStep}
                        onBack={prevStep}
                        onSaveAndExit={saveAndExit}
                    />
                );

            default:
                return null;
        }
    };
    return (
        <Template content={
            <>
                <ProjectWizardStepper
                    currentStep={currentStep}
                    onStepClick={goToStep}
                />
                <div className="overflow-y-auto">
                    {renderWizardStep()}
                </div>
            </>
        }
            wizardMode={true}
            saveAndExit={saveAndExit}
            saveAndExitDisabled={saveLoading}
        />

    )
}

export default ProjectCreateWizard