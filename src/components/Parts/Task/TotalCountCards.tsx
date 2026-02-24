import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useGetTaskStatusCountQuery } from "../../../features/task/taskDataApi";

const TotalCountCards = () => {

    const { data } = useGetTaskStatusCountQuery();

    return (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-600 mb-1">Total Tasks</p>
                        <p className="text-3xl font-bold text-slate-900">{data?.data?.total_count || 0}</p>
                    </div>
                    <CheckCircle2 className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-orange-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-600 mb-1">Upcoming (7 days)</p>
                        <p className="text-3xl font-bold text-orange-600">{data?.data?.upcoming_count || 0}</p>
                    </div>
                    <Clock className="w-12 h-12 text-orange-600 opacity-20" />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-red-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-600 mb-1">Overdue</p>
                        <p className="text-3xl font-bold text-red-600">{data?.data?.overdue_count || 0}</p>
                    </div>
                    <AlertCircle className="w-12 h-12 text-red-600 opacity-20" />
                </div>
            </div>
        </div>
    )
}

export default TotalCountCards