import Swal from "sweetalert2";
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react";
import { useDeleteCustomerContactMutation, useGetCustomerContactsQuery } from "../../features/project/ProjectContactApi";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { CustomerContactDB } from "../../types/contact";
import AddContactModal from "../modals/AddContactModal";

const ContactScreen = () => {

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [showAddModal, setShowAddModal] = useState(false);

    const { data, isLoading } = useGetCustomerContactsQuery({
        page: page + 1,
        per_page: pageSize,
        sort_by: sortModel[0]?.field || "created_at",
        sort_dir: sortModel[0]?.sort || "desc",
    });

    const [deleteCustomerContact] = useDeleteCustomerContactMutation();

    const rows = data?.data || [];
    const total = data?.meta?.total || 0;

    const handleDelete = async (id: number) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete this contact?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            buttonsStyling: false,
            customClass: {
                confirmButton:
                    "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mx-2",

                cancelButton:
                    "bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2",
            },
        });
        if (result.isConfirmed) {

            try {
                await deleteCustomerContact({ id }).unwrap();

                Swal.fire({
                    title: "Deleted!",
                    text: "Customer contact has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });

            } catch (error) {

                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete document.",
                    icon: "error",
                });

            }
        }
    };

    const columns: GridColDef<CustomerContactDB>[] = [
        { field: "company_name", headerName: "Company", flex: 1, minWidth: 180, },
        { field: "website", headerName: "Website", flex: 1, sortable: false, minWidth: 180, },
        { field: "address", headerName: "Address", flex: 1, sortable: false, minWidth: 180, },
        {
            field: "city_state", headerName: "City / State", flex: 1, sortable: false, minWidth: 180,
            valueGetter: (_value, row) => `${row.city}, ${row.state}`
        },
        { field: "zip", headerName: "Zip", flex: 1, sortable: false, minWidth: 60, },
        { field: "title", headerName: "Title", flex: 1, sortable: false, minWidth: 180, },
        { field: "first_name", headerName: "First Name", flex: 1, sortable: false, minWidth: 180, },
        { field: "last_name", headerName: "Last Name", flex: 1, sortable: false, minWidth: 180, },
        { field: "email", headerName: "Email", flex: 1, sortable: false, minWidth: 180, },
        { field: "direct_phone", headerName: "Direct Phone", flex: 1, sortable: false, minWidth: 180, },
        { field: "cell_phone", headerName: "Cell Phone", flex: 1, sortable: false, minWidth: 180, },
        {
            field: "action", headerName: " Action", flex: 0, minWidth: 100, sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                );
            }
        }
    ];


    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="mb-6 sm:mb-8 px-3 sm:px-0">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    {/* Title Section */}
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                            Customer Contacts
                        </h1>
                        <p className="text-sm sm:text-base text-slate-600">
                            Manage all your customer contacts in one place
                        </p>
                    </div>

                    {/* Button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="
                                    w-full sm:w-auto
                                    px-4 sm:px-6 
                                    py-2.5 sm:py-3
                                    bg-blue-600 text-white font-semibold 
                                    rounded-lg hover:bg-blue-700 
                                    transition-colors 
                                    flex items-center justify-center gap-2 
                                    shadow-lg
                                "
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        Add Customer Contact
                    </button>

                </div>
                <div className="bg-white rounded-lg border border-slate-200">
                    <div style={{ height: 600, width: "100%" }}>
                        <DataGrid<CustomerContactDB>
                            rows={rows}
                            loading={isLoading}
                            columns={columns}
                            slots={{
                                noRowsOverlay: () => (
                                    <div className="p-6 text-center">
                                        No Customer Contacts available
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

            <AddContactModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
        </div>
    )
}

export default ContactScreen