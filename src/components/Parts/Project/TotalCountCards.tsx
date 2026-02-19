import { Calendar, CheckSquare, FileText, FolderOpen } from "lucide-react"
import { useGetProjectStatusCountQuery } from "../../../features/project/projectDataApi";

const TotalCountCards = () => {
    const { data } = useGetProjectStatusCountQuery();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Total Projects</p>
                        <p className="text-3xl font-bold text-slate-900">{data?.data?.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Active</p>
                        <p className="text-3xl font-bold text-green-600">{data?.data?.active}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckSquare className="w-6 h-6 text-green-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Pending</p>
                        <p className="text-3xl font-bold text-amber-600">{data?.data?.inprogress}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-amber-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-slate-600">{data?.data?.completed}</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-600" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TotalCountCards