import { Plus, Home, ArrowLeft, LogOut, FileText, Users, CheckSquare, Save } from 'lucide-react';
import { useAppDispatch } from '../../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../features/auth/authSlice';
import { handleAddProject } from '../../../utils/navigation';

interface NavigationHeaderProps {
    readonly onBack?: () => void;
    readonly onHome?: () => void;
    readonly title?: string;
    readonly showBackButton?: boolean;
    readonly showHomeButton?: boolean;
    readonly showLogo?: boolean;
    readonly saveAndExit?: () => void;
    readonly wizardMode?: boolean;
}

export default function NavigationHeader({
    onBack,
    onHome,
    title,
    showBackButton = true,
    showHomeButton = false,
    showLogo = false,
    saveAndExit,
    wizardMode = false
}: NavigationHeaderProps) {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {showLogo && (
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-900">Lien Manager</span>
                            </div>
                        )}
                        {!wizardMode && showBackButton && onBack && (
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back
                            </button>
                        )}
                        {!wizardMode && showHomeButton && onHome && (
                            <button
                                onClick={onHome}
                                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <Home className="w-5 h-5" />
                                Dashboard
                            </button>
                        )}
                        {!wizardMode && title && !showLogo && (
                            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {!wizardMode && (
                            <>
                                <button
                                    onClick={() => handleAddProject(navigate)}
                                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <Plus className="w-4 h-4 inline mr-2" />
                                    New Project
                                </button>
                                <button
                                    // onClick={onViewContacts}
                                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <Users className="w-4 h-4" />
                                    <span className="hidden sm:inline">Contacts</span>
                                </button>
                                <button
                                    // onClick={onViewDocuments}
                                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span className="hidden sm:inline">Documents</span>
                                </button>
                                <button
                                    // onClick={onViewTasks}
                                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <CheckSquare className="w-4 h-4" />
                                    <span className="hidden sm:inline">Tasks</span>
                                </button>
                            </>
                        )}
                        {wizardMode && saveAndExit && (
                            <button
                                onClick={saveAndExit}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm"
                            >
                                <Save className="w-4 h-4" />
                                <span>Save & Exit</span>
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
