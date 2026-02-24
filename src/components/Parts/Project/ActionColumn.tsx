import { useNavigate } from "react-router-dom"
import { IconButton } from "@mui/material"
import { Edit, FolderOpen, Trash2 } from "lucide-react"
import { handleViewProject } from "../../../utils/navigation"
import { DBProject } from "../../../types/project"

interface ActionColumnProps {
    data: DBProject;
}
const ActionColumn = ({data}: ActionColumnProps) => {
    const navigate = useNavigate();
    return (
        <div className="text-center">
            <IconButton
                size="small"
                className="text-blue-600 hover:bg-blue-50"
                title="View"
                onClick={() => handleViewProject(navigate, data.id)}
            >
                <FolderOpen className="w-4 h-4" />
            </IconButton>
            <IconButton
                size="small"
                className="text-slate-600 hover:bg-slate-100"
                title="Edit"
            >
                <Edit className="w-4 h-4" />
            </IconButton>
            <IconButton
                size="small"
                className="text-red-600 hover:bg-red-50"
                title="Delete"
            >
                <Trash2 className="w-4 h-4" />
            </IconButton>
        </div>
    )
}

export default ActionColumn