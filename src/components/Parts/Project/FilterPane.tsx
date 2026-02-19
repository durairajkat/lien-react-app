import { SetStateAction, useCallback } from "react";
import { Filter, Search, X } from "lucide-react";
import { State } from "../../../types/master";

interface FilterProps {
    search: string;
    statusFilter: string;
    stateFilter: string;
    setSearch: React.Dispatch<SetStateAction<string>>;
    setStateFilter: React.Dispatch<SetStateAction<string>>;
    setStatusFilter: React.Dispatch<SetStateAction<string>>;
    stateData: State[];
}

const FilterPane = ({ search, statusFilter, stateFilter, setSearch, setStateFilter, setStatusFilter, stateData }: FilterProps) => {

    const handleClearFilter = useCallback(() => {
            setSearch('');
            setStateFilter('all');
            setStatusFilter('all');
        }, []);

    return (
        <div className="mb-6 bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by project, customer, or contact..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active"> Active </option>
                            <option value="pending"> Inactive </option>
                        </select>
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        >
                            <option value="all">All States</option>
                            {stateData?.map((state) => (
                                <option value={state.id} key={state.id}> {state.name} </option>
                            ))}

                        </select>
                    </div>
                    {(stateFilter !== 'all' || statusFilter !== 'all' || search != '') &&
                        <button
                            onClick={handleClearFilter}
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    }


                </div>
            </div>
        </div>
    )
}

export default FilterPane;