import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { useLocation } from 'react-router-dom';
import { Eye } from 'lucide-react';
import TotalCountCards from '../Parts/Task/TotalCountCards';
import { useGetTasksQuery } from '../../features/task/taskDataApi';
import FilterPane from '../Parts/Task/FilterPane';
import { DBTask } from '../../types/tasks';
import TaskView from '../Parts/Task/TaskView';

export default function ProjectTasks() {
    const location = useLocation();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [search, setSearch] = useState(location.state?.project_name || "");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [selectedTask, setSelectedTask] = useState<number | null>(null);

    const { data, isLoading } = useGetTasksQuery({
        page: page + 1,
        per_page: pageSize,
        sort_by: sortModel[0]?.field || "created_at",
        sort_dir: sortModel[0]?.sort || "desc",
        search: debouncedSearch,
        action_id: actionFilter === "all" ? undefined : actionFilter,
    });

    const rows = data?.data?.data || [];
    const total = data?.data?.total || 0;

    const getUrgencyColor = (days: number) => {
        if (days < 0) return 'text-red-600 font-bold';
        if (days <= 7) return 'text-orange-600 font-semibold';
        if (days <= 14) return 'text-yellow-600';
        return 'text-slate-600';
    };

    const columns: GridColDef<DBTask>[] = [
        { field: "project_name", headerName: "Project", flex: 1 },
        { field: "task_name", headerName: "Task Name", flex: 1, sortable: false },
        { field: "task_action_name", headerName: "Task Action", flex: 1, sortable: false },
        { field: "due_date", headerName: "Due Date", flex: 1, sortable: false },
        {
            field: "due_status", headerName: "Days until due", flex: 1,
            renderCell: (params) => {
                const days = params.row.days_difference;
                return (
                    <span className={`px-3 py-1 rounded-full text-sm ${getUrgencyColor(Number(days))}`}>
                        {params.row.due_status}
                    </span>
                );
            }
        },
        {
            field: "assigned_to", headerName: "Assigned To", flex: 1,
            valueGetter: (_value, row) => row.assigned_to_user?.name || "Unassigned"
        },
        {
            field: "assigned_at", headerName: "Assigned At", flex: 1
        },
        {
            field: "status", headerName: "Status", flex: 1
        },
        {
            field: "action", headerName: " Action", flex: 1, sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <button
                        onClick={() => setSelectedTask(row.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        View
                    </button>
                );
            }
        }
    ];

    useEffect(() => {
        const handler = setTimeout(() => {
            if (search.length >= 3 || search.length === 0) {
                setDebouncedSearch(search);
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Tasks</h1>
                    <p className="text-lg text-slate-600">
                        Track and manage all your construction project tasks and deadlines
                    </p>
                </div>

                <TotalCountCards />

                <FilterPane
                    filterStatus={actionFilter}
                    setFilterStatus={setActionFilter}
                    search={search}
                    setSearch={setSearch}
                />

                <div className="bg-white rounded-lg border border-slate-200">
                    <div style={{ height: 600, width: "100%" }}>
                        <DataGrid<DBTask>
                            rows={rows}
                            loading={isLoading}
                            columns={columns}
                            slots={{
                                noRowsOverlay: () => (
                                    <div className="p-6 text-center">
                                        {debouncedSearch
                                            ? `No results for "${debouncedSearch}"`
                                            : "No projects available"}
                                    </div>
                                ),
                            }}
                            getRowId={(row) => row.id}
                            rowCount={total}
                            paginationMode="server"
                            sortingMode="server"
                            pageSizeOptions={[10, 25, 50]}
                            paginationModel={{ page, pageSize }}
                            onPaginationModelChange={(model) => {
                                setPage(model.page);
                                setPageSize(model.pageSize);
                            }}
                            onSortModelChange={(model) => setSortModel([...model])}
                            sx={{
                                border: "none",
                                "& .MuiDataGrid-columnHeader": {
                                    backgroundColor: "#f1f5f9", // slate-100
                                },
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    fontWeight: 600,
                                    color: "#334155", // slate-700
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    borderBottom: "1px solid #e2e8f0",
                                },
                                "& .MuiDataGrid-columnHeader:hover": {
                                    backgroundColor: "#e2e8f0",
                                },
                                "& .MuiDataGrid-row:hover": {
                                    backgroundColor: "rgb(248 250 252)", // slate-50
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {selectedTask && <TaskView taskId={selectedTask} onClose={() => setSelectedTask(null)} />}
        </div>
    );
}
