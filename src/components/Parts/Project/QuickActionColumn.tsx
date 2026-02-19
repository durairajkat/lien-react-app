import { IconButton } from "@mui/material"
import { Calendar, ClipboardList, FileText } from "lucide-react"
import { DBProject } from "../../../types/project"

interface QuickActionColumnProps {
    data: DBProject
}

const QuickActionColumn = ({ data }: QuickActionColumnProps) => {
    return (
        <div className="text-center">
            {data.project_date.length > 0 &&
                <IconButton
                    size="small"
                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                    title="Deadlines"
                >
                    <Calendar className="w-4 h-4" />
                </IconButton>
            }
            {data.tasks.length > 0 &&
                <IconButton
                    size="small"
                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                    title="Tasks"
                >
                    <ClipboardList className="w-4 h-4" />
                </IconButton>
            }
            {data.documents.length > 0 &&
                <IconButton
                    size="small"
                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                    title="Documents"
                >
                    <FileText className="w-4 h-4" />
                </IconButton>
            }
        </div>
    )
}

export default QuickActionColumn