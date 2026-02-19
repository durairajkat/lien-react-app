import { ArrowRight, ArrowLeft, Calendar, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { ProjectWizardData } from '../../../types/project';
import { CalculatedDeadline, DeadLineRequestType } from '../../../types/deadline';
import { useCalculateDeadlineMutation } from '../../../features/project/ProjectDeadlineApi';

interface DeadlinesStepProps {
    readonly data: ProjectWizardData;
    readonly onNext: () => void;
    readonly onBack: () => void;
    readonly onSaveAndExit?: () => void;
}

export default function DeadlinesStep({ data, onNext, onBack, onSaveAndExit }: DeadlinesStepProps) {
    const [calculatedDeadlineData, setCalculatedDeadlineData] = useState<CalculatedDeadline[]>([]);

     const [
        calculatedDeadline,
        { isLoading: calculateLoading },
      ] = useCalculateDeadlineMutation();

    const doDeadlineCalculation = async () => {
        const payload: DeadLineRequestType = {
            role_id: data.roleId,
            state_id: data.stateId,
            project_type_id: data.projectTypeId,
            customer_id: data.customerTypeId,
            furnishing_dates: data.furnishingDates,
        };
        try {
            const response = await calculatedDeadline(payload).unwrap();

            if (response.data.deadlines) {
                setCalculatedDeadlineData(response?.data?.deadlines ?? []);
            }

        } catch (err) {

            const errorResponse = (err as any)?.data;

            let errorMessage = "Something went wrong";

            if (errorResponse?.errors) {
                const firstErrorKey = Object.keys(errorResponse.errors)[0];
                errorMessage = errorResponse.errors[firstErrorKey][0];
            } else if (errorResponse?.message) {
                errorMessage = errorResponse.message;
            }

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        }
    };

    useEffect(() => {
      doDeadlineCalculation()
    }, [])
    

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'urgent': return 'bg-red-100 border-red-500 text-red-900';
            case 'soon': return 'bg-orange-100 border-orange-500 text-orange-900';
            default: return 'bg-green-100 border-green-500 text-green-900';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'urgent': return <AlertCircle className="w-6 h-6" />;
            case 'soon': return <Clock className="w-6 h-6" />;
            default: return <CheckCircle className="w-6 h-6" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Remedies and Deadlines</h1>
                <p className="text-lg text-slate-600">
                    Based on your project details and {data.country} ({data.state}) construction laws.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
                {calculatedDeadlineData.length === 0 || data.furnishingDates.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600">Complete Dates steps to calculate deadlines</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {calculatedDeadlineData.map((deadline, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`p-6 border-2 rounded-xl ${getStatusColor(deadline.daysRemaining > 30 ? 'act' :  (deadline?.daysRemaining > 0 ? 'soon' : 'urgent'))}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="mt-1">
                                                {getStatusIcon(deadline.daysRemaining > 30 ? 'act' :  (deadline?.daysRemaining > 0 ? 'soon' : 'urgent'))}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold mb-1">{deadline.title}</h3>
                                                <p className="text-sm opacity-80 mb-2">{deadline.requirement}</p>
                                                <div className="flex items-center gap-4 text-sm font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {deadline.date}
                                                    </div>
                                                    <div>
                                                        {deadline.daysRemaining >= 0
                                                            ? `${deadline.daysRemaining} days remaining`
                                                            : `${Math.abs(deadline.daysRemaining)} days overdue`
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Important Legal Disclaimer
                    </h3>
                    <p className="text-sm text-amber-800">
                        These deadlines are estimates based on typical state rules. Always consult with a construction attorney
                        licensed in your state for legal advice specific to your situation. Deadlines vary by state, project type,
                        and your role.
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="flex gap-3">
                    {onSaveAndExit && (
                        <button
                            onClick={onSaveAndExit}
                            className="px-6 py-3 text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            Save & Exit to Dashboard
                        </button>
                    )}
                    <button
                        onClick={onNext}
                        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        Continue
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
