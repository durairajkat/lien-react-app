import { Users } from "lucide-react"

type TotalContactCardProps = {
    totalCount: number;
    customerContactCount: number;
    projectContactCount: number;
}

const TotalContactCard = (props: TotalContactCardProps) => {

    return (
        <div className="flex gap-3 justify-between">
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-sm text-slate-600">Total Contacts</p>
                            <p className="text-2xl font-bold text-slate-900">{props.totalCount}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-sm text-slate-600">Customer Contacts</p>
                            <p className="text-2xl font-bold text-slate-900">{props.customerContactCount}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-sm text-slate-600">Industry Contacts</p>
                            <p className="text-2xl font-bold text-slate-900">{props.projectContactCount}</p>
    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TotalContactCard