import { useState, useEffect, useMemo } from 'react';
import { FolderOpen, ArrowUpDown, FileText, ClipboardList, Trash2, Edit, Users, CheckSquare, Calendar, Search, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleAddProject } from '../../utils/navigation';

interface DBProject {
    id: string;
    name: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
    data: any;
    project_type: string;
}

type SortField = 'id' | 'name' | 'status' | 'created_at' | 'updated_at';
type SortDirection = 'asc' | 'desc';

export default function ProjectDashboard() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<DBProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [stateFilter, setStateFilter] = useState<string>('all');
    const [generatingSampleData, setGeneratingSampleData] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, [sortField, sortDirection]);

    const fetchProjects = async () => {

        setLoading(true);
        setLoading(false);

    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleDelete = async (projectId: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        setProjects(projects.filter(p => p.id !== projectId));
    };

    const handleGenerateSampleData = async () => {

        setGeneratingSampleData(true);

        setGeneratingSampleData(false);
    };

    const getCustomerName = (project: DBProject) => {
        return project.data?.parties?.owner?.name || 'N/A';
    };

    const getContact = (project: DBProject) => {
        return project.data?.parties?.owner?.email || 'N/A';
    };

    const getPhoneNumber = (project: DBProject) => {
        return project.data?.parties?.owner?.phone || 'N/A';
    };

    const getState = (project: DBProject) => {
        return project.data?.state || 'N/A';
    };

    const getAddress = (project: DBProject) => {
        return project.data?.propertyAddress || 'N/A';
    };

    const getLienProvider = (project: DBProject) => {
        return project.data?.parties?.claimant?.name || 'NLB';
    };

    const getDeadline = (project: DBProject) => {
        return project.data?.extractedData?.projectStartDate || 'N/A';
    };

    const uniqueStatuses = useMemo(() => {
        const statuses = new Set(projects.map(p => p.status));
        return Array.from(statuses).sort();
    }, [projects]);

    const uniqueStates = useMemo(() => {
        const states = new Set(projects.map(p => getState(p)).filter(s => s !== 'N/A'));
        return Array.from(states).sort();
    }, [projects]);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch =
                searchQuery === '' ||
                project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                getCustomerName(project).toLowerCase().includes(searchQuery.toLowerCase()) ||
                getContact(project).toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
            const matchesState = stateFilter === 'all' || getState(project) === stateFilter;

            return matchesSearch && matchesStatus && matchesState;
        });
    }, [projects, searchQuery, statusFilter, stateFilter]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setStateFilter('all');
    };

    const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || stateFilter !== 'all';

    const stats = useMemo(() => {
        const activeProjects = projects.filter(p => p.status === 'active').length;
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        const pendingProjects = projects.filter(p => p.status === 'pending').length;

        return {
            total: projects.length,
            active: activeProjects,
            completed: completedProjects,
            pending: pendingProjects,
        };
    }, [projects]);

    if (loading) {
        return (
            <div>
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 text-lg">Loading projects...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-6">
                <p className="text-lg text-slate-600">
                    Manage and track all of your active projects
                </p>
            </div>

            {projects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 mb-1">Total Projects</p>
                                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
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
                                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
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
                                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
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
                                <p className="text-3xl font-bold text-slate-600">{stats.completed}</p>
                            </div>
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-slate-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {projects.length > 0 && (
                <div className="mb-6 bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by project, customer, or contact..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                    {uniqueStatuses.map(status => (
                                        <option key={status} value={status} className="capitalize">
                                            {status}
                                        </option>
                                    ))}
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
                                    {uniqueStates.map(state => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={handleClearFilters}
                                    className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <div className="mt-3 text-sm text-slate-600">
                            Showing {filteredProjects.length} of {projects.length} projects
                        </div>
                    )}
                </div>
            )}

            {projects.length === 0 ? (
                <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                    <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Projects Yet</h3>
                    <p className="text-slate-600 mb-6">
                        Get started by creating your first project or generate sample data to explore the app
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => handleAddProject(navigate)}

                            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Create Your First Project
                        </button>
                        <button
                            onClick={handleGenerateSampleData}
                            disabled={generatingSampleData}
                            className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {generatingSampleData ? 'Generating...' : 'Generate Sample Data'}
                        </button>
                    </div>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Projects Found</h3>
                    <p className="text-slate-600 mb-6">
                        Try adjusting your search or filters to find what you're looking for
                    </p>
                    <button
                        onClick={handleClearFilters}
                        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="block md:hidden space-y-4">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 mb-1">{project.name || 'Untitled'}</h3>
                                        <p className="text-xs text-slate-500">{getCustomerName(project)}</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 capitalize">
                                        {project.status}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Users className="w-4 h-4" />
                                        <span>{getContact(project)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-slate-200">
                                    <button
                                        onClick={() => onViewProject(project.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <FolderOpen className="w-4 h-4" />
                                        View
                                    </button>
                                    <button
                                        onClick={() => onEditProject(project.id)}
                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-3 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('name')}>
                                        <div className="flex items-center gap-1">
                                            Project <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="px-3 py-3 text-left font-semibold text-slate-700">
                                        Customer
                                    </th>
                                    <th className="px-3 py-3 text-left font-semibold text-slate-700">Contact</th>
                                    <th className="px-3 py-3 text-left font-semibold text-slate-700">State</th>
                                    <th className="px-3 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('status')}>
                                        <div className="flex items-center gap-1">
                                            Status <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="px-3 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('created_at')}>
                                        <div className="flex items-center gap-1">
                                            Created <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="px-3 py-3 text-center font-semibold text-slate-700">Quick Actions</th>
                                    <th className="px-3 py-3 text-center font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map((project, index) => (
                                    <tr
                                        key={project.id}
                                        className={`border-b border-slate-200 hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                                    >
                                        <td className="px-3 py-3 text-slate-900 font-medium">{project.name || 'Untitled'}</td>
                                        <td className="px-3 py-3 text-slate-700">{getCustomerName(project)}</td>
                                        <td className="px-3 py-3 text-slate-600 text-xs">{getContact(project)}</td>
                                        <td className="px-3 py-3 text-slate-700">{getState(project)}</td>
                                        <td className="px-3 py-3">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 capitalize">
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-slate-600 text-xs">
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Deadlines"
                                                >
                                                    <Calendar className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={onViewTasks}
                                                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Tasks"
                                                >
                                                    <ClipboardList className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={onViewDocuments}
                                                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Documents"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => onViewProject(project.id)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="View"
                                                >
                                                    <FolderOpen className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onEditProject(project.id)}
                                                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
