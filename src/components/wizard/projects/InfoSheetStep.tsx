import { ArrowLeft, CheckCircle, Calendar, FileSignature, AlertCircle } from 'lucide-react';
import { ProjectWizardData } from '../../../types/project';
import { useGetStatesQuery } from '../../../features/master/masterDataApi';
import { ProjectType, State } from '../../../types/master';

interface InfoSheetStepProps {
    readonly data: ProjectWizardData;
    readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
    readonly onBack: () => void;
    readonly onComplete: () => void;
    readonly countries: State[];
    readonly projectTypes: ProjectType[];
    readonly saveLoading: boolean;
}

export default function InfoSheetStep({ data, onUpdate, onBack, onComplete, countries, projectTypes, saveLoading}: InfoSheetStepProps) {

    const { data: states } = useGetStatesQuery(
        { country_id: Number(data.countryId) },
        { skip: !data.countryId }
    );

    const country = countries.find(x => x.id === data.countryId);
    const state = states?.data?.find(x => x.id === data.stateId);
    const projectType = projectTypes?.find(x => x.id === data.projectTypeId);

    return (
        <div className="max-w-4xl mx-auto p-8 py-12">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileSignature className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Project Information Sheet</h1>
                <p className="text-lg text-slate-600">
                    Review and confirm all project details before finalizing.
                </p>
            </div>

            <div className="bg-white rounded-xl border-2 border-slate-200 p-8 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Project Summary
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-blue-700 font-semibold">Project Name:</div>
                            <div className="text-blue-900">{data.projectName}</div>
                        </div>
                        <div>
                            <div className="text-blue-700 font-semibold">Location:</div>
                            <div className="text-blue-900">{state?.name}, {country?.name}</div>
                        </div>
                        <div>
                            <div className="text-blue-700 font-semibold">Type:</div>
                            <div className="text-blue-900 capitalize">{projectType?.project_type}</div>
                        </div>
                        <div>
                            <div className="text-blue-700 font-semibold">Contract Amount:</div>
                            <div className="text-blue-900">${data.revisedCost}</div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="text-blue-700 font-semibold">Job Address:</div>
                            <div className="text-blue-900">
                                {data.jobAddress}, {data.jobCity}, {state?.name} {data.jobZip}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Confirmation Details</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Customer Signature
                            </label>
                            <input
                                type="text"
                                value={data.customerSignature}
                                onChange={(e) => onUpdate({ customerSignature: e.target.value })}
                                placeholder="Type full name to sign (optional)"
                                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-serif italic text-lg"
                            />
                            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                                <FileSignature className="w-3 h-3" />
                                By typing your name, you electronically sign this document
                            </p>
                        </div>

                        <div className="max-w-md">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Signature Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={data.signatureDate}
                                    onChange={(e) => onUpdate({ signatureDate: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-amber-900 mb-2">Legal Disclaimer</h3>
                    <p className="text-xs text-amber-800">
                        This information is provided for record-keeping purposes. By signing, you confirm that the information
                        provided is accurate to the best of your knowledge. This does not constitute legal advice. Always consult
                        with a licensed attorney for legal matters related to mechanics liens and payment bond claims.
                    </p>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    onClick={onComplete}
                    disabled={!data.customerSignature || !data.signatureDate || saveLoading}
                    className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg"
                >
                    {saveLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Project...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            {data?.projectId ? 'Update Project' : 'Create Project'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
