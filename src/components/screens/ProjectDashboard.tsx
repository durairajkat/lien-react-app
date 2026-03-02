import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import TotalCountCards from "../Parts/Project/TotalCountCards";
import { useGetProjectsQuery } from "../../features/project/projectDataApi";
import { useGetUsedStatesQuery } from "../../features/master/masterDataApi";
import FilterPane from "../Parts/Project/FilterPane";
import NewProjectCreateCard from "../Parts/Project/NewProjectCreateCard";
import { DBProject } from "../../types/project";
import ActionColumn from "../Parts/Project/ActionColumn";
import QuickActionColumn from "../Parts/Project/QuickActionColumn";

export default function ProjectDashboard() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [stateFilter, setStateFilter] = useState("all");

    const { data, isLoading } = useGetProjectsQuery({
        page: page + 1,
        per_page: pageSize,
        sort_by: sortModel[0]?.field || "created_at",
        sort_dir: sortModel[0]?.sort || "desc",
        search: debouncedSearch,
        status: statusFilter === "all" ? undefined : statusFilter,
        state_id: stateFilter === "all" ? undefined : stateFilter,
    });

    const { data: stateData } = useGetUsedStatesQuery();

    const rows = data?.data?.data || [];
    const total = data?.data?.total || 0;
    const overall_total = data?.overall_total;

    const columns: GridColDef<DBProject>[] = [
        { field: "project_name", headerName: "Project", flex: 1, minWidth: 180, },
        { field: "city", headerName: "Customer", flex: 1, sortable: false, minWidth: 180, },
        { field: "zip", headerName: "Contact", flex: 1, sortable: false, minWidth: 180, },
        {
            field: "base_amount", headerName: "Contract", flex: 1, minWidth: 180,
            valueGetter: (_value, row) =>
                row.project_contract?.base_amount ?? "",

        },
        {
            field: "state", headerName: "State", flex: 1, minWidth: 180,
        },
        {
            field: "status", headerName: "Status", flex: 1, minWidth: 180,
            valueGetter: (_value, row) => {
                const value = row.status;
                return value === '1' ? 'Active' : 'Pending';
            },
        },
        {
            field: "created_at",
            headerName: "Created",
            flex: 1,
            minWidth: 180,
            valueGetter: (_value, row) => {
                const value = row.created_at;
                if (!value) return "";
                return new Date(value).toLocaleDateString();
            },
        },
        {
            field: "quick_action", headerName: "Quick Actions", flex: 0, minWidth: 120, sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <QuickActionColumn data={row} />
                );
            }
        },
        {
            field: "action", headerName: " Action", flex: 0, minWidth: 120, sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <ActionColumn data={row} />
                );
            }
        }
    ];

    useEffect(() => {
        const handler = setTimeout(() => {
            if (search.length >= 3 || search.length === 0) {
                setDebouncedSearch(search);
            }
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-6">
                <p className="text-lg text-slate-600">
                    Manage and track all of your active projects
                </p>
            </div>

            <TotalCountCards />
            {overall_total === 0 && !isLoading && (
                <NewProjectCreateCard />
            )}

            <FilterPane search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                stateFilter={stateFilter}
                setStateFilter={setStateFilter}
                stateData={stateData?.data || []}
            />

            <div className="bg-white rounded-lg border border-slate-200">
                <div style={{ height: 600, width: "100%" }}>
                    <DataGrid<DBProject>
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
    )
}
