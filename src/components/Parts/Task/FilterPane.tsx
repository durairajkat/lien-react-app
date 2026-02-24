import { Filter, Search } from "lucide-react"
import { useGetTaskActionsQuery } from "../../../features/task/taskDataApi";

type FilterPaneProps = {
    search: string;
    setSearch: (search: string) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
}

const FilterPane = (props: FilterPaneProps) => {
    const { filterStatus, setFilterStatus, search, setSearch } = props;

    const { data: taskActionData } = useGetTaskActionsQuery();

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
                <Filter className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Search
                    </label>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by project, task name or due date..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Task Actions
                    </label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Actions</option>
                        {taskActionData?.data.map((action) => (
                            <option key={action.id} value={action.id}>
                                {action.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default FilterPane