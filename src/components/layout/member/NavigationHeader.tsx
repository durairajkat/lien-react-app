import { Plus, Home, ArrowLeft, LogOut, FileText, Users, CheckSquare, Save, Menu } from 'lucide-react';
import { useAppDispatch } from '../../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../features/auth/authSlice';
import { handleAddProject, handleViewTasks } from '../../../utils/navigation';

interface NavigationHeaderProps {
    readonly onBack?: () => void;
    readonly onHome?: () => void;
    readonly title?: string;
    readonly showBackButton?: boolean;
    readonly showHomeButton?: boolean;
    readonly showLogo?: boolean;
    readonly saveAndExit?: () => void;
    readonly wizardMode?: boolean;
    readonly saveAndExitDisabled?: boolean;
    readonly onMenuClick?: () => void;
}

export default function NavigationHeader({
    onBack,
    onHome,
    title,
    showBackButton = true,
    showHomeButton = false,
    showLogo = false,
    saveAndExit,
    wizardMode = false,
    saveAndExitDisabled = false,
    onMenuClick
}: NavigationHeaderProps) {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                    {/* LEFT SECTION */}
                    <div className="flex items-center justify-between lg:justify-start gap-3">
                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                        >
                            <Menu className="w-6 h-6 text-slate-700" />
                        </button>
                        {/* Logo */}
                        {showLogo && (
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>

                                <span className="text-base sm:text-xl font-bold text-slate-900 whitespace-nowrap">
                                    Lien Manager
                                </span>
                            </div>
                        )}

                        {/* Back + Home + Title */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">

                            {!wizardMode && showBackButton && onBack && (
                                <button
                                    onClick={onBack}
                                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Back</span>
                                </button>
                            )}

                            {!wizardMode && showHomeButton && onHome && (
                                <button
                                    onClick={onHome}
                                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                                >
                                    <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </button>
                            )}

                            {!wizardMode && title && !showLogo && (
                                <h1 className="text-sm sm:text-lg font-semibold text-slate-900 truncate">
                                    {title}
                                </h1>
                            )}

                        </div>

                    </div>


                    {/* RIGHT SECTION */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-between lg:justify-end">

                        {!wizardMode && (
                            <>
                                {/* New Project */}
                                <button
                                    onClick={() => handleAddProject(navigate)}
                                    className="
                flex items-center justify-center gap-1 sm:gap-2
                px-3 sm:px-4 py-2
                bg-blue-500 text-white font-medium
                rounded-lg hover:bg-blue-600 transition-colors
                text-sm whitespace-nowrap
              "
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline">New Project</span>
                                </button>


                                {/* Contacts */}
                                <button
                                    className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                                >
                                    <Users className="w-4 h-4" />
                                    <span className="hidden md:inline">Contacts</span>
                                </button>


                                {/* Documents */}
                                <button
                                    onClick={() => navigate("/documents")}
                                    className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span className="hidden md:inline">Documents</span>
                                </button>


                                {/* Tasks */}
                                <button
                                    onClick={() => handleViewTasks(navigate)}
                                    className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                                >
                                    <CheckSquare className="w-4 h-4" />
                                    <span className="hidden md:inline">Tasks</span>
                                </button>
                            </>
                        )}


                        {/* Wizard Mode */}
                        {wizardMode && saveAndExit && (
                            <button
                                onClick={saveAndExit}
                                disabled={saveAndExitDisabled}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm text-sm"
                            >
                                <Save className="w-4 h-4" />
                                <span className="hidden sm:inline">Save & Exit</span>
                            </button>
                        )}


                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm"
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
