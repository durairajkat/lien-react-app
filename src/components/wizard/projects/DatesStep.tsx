import { useState, useEffect } from 'react';
import { Info, Calendar } from 'lucide-react';
import { ProjectWizardData } from '../../../types/project';
import { useGetRemedyDatesQuery } from '../../../features/project/projectDataApi';
import SaveAndExitBtn from '../../Button/SaveAndExitBtn';
import ContinueBtn from '../../Button/ContinueBtn';
import BackBtn from '../../Button/BackBtn';
import RemedyDates from '../../Parts/RemedyDates';

interface DatesStepProps {
  readonly data: ProjectWizardData;
  readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
  readonly onSaveAndExit?: () => void;
  readonly disabled: boolean;
}

export default function DatesStep({ data, onUpdate, onNext, onBack, onSaveAndExit, disabled }: DatesStepProps) {
  const [calculatedEndDate, setCalculatedEndDate] = useState('');

  const { data: datesRes } = useGetRemedyDatesQuery({
    state_id: data.stateId,
    project_type_id: data.projectTypeId,
    role_id: data.roleId,
    customer_type_id: data.customerTypeId,
  }, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data.startDate && data.firstFurnishingDate) {
      const start = new Date(data.startDate);
      const furnishing = new Date(data.firstFurnishingDate);
      const days = Math.ceil((furnishing.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      const estimatedEnd = new Date(start);
      estimatedEnd.setDate(estimatedEnd.getDate() + Math.max(days * 2, 90));
      setCalculatedEndDate(estimatedEnd.toISOString().split('T')[0]);

      if (!data.endDate) {
        onUpdate({ endDate: estimatedEnd.toISOString().split('T')[0] });
      }
    }
  }, [data.startDate, data.firstFurnishingDate]);

  return (
    <div className="max-w-4xl mx-auto p-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Project Dates</h1>
        <p className="text-lg text-slate-600">
          Define the timeline for your project to calculate accurate filing deadlines.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Project Start Date <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={data.startDate}
                onChange={(e) => onUpdate({ startDate: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
              <Info className="w-3 h-3" />
              When the project officially began
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Estimated End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={data.endDate || calculatedEndDate}
                onChange={(e) => onUpdate({ endDate: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
              <Info className="w-3 h-3" />
              {calculatedEndDate ? 'Auto-calculated (editable)' : 'Expected project completion'}
            </p>
          </div>
        </div>
        {datesRes && datesRes.data.length > 0 && (
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Furnishing Dates</h3>
            <p className="text-sm text-slate-600 mb-4">
              These dates are critical for lien deadline calculations.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <RemedyDates dates={datesRes.data} onUpdate={onUpdate} data={data} />
            </div>
          </div>

        )}
      </div>

      <div className="flex justify-between items-center mt-8">
        <BackBtn onBack={onBack} />
        <div className="flex gap-3">
          {onSaveAndExit && (
            <SaveAndExitBtn onSaveAndExit={onSaveAndExit} disabled={disabled} />
          )}

          <ContinueBtn onNext={onNext} />
        </div>
      </div>
    </div>
  );
}
