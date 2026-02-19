import { Plus, Trash2, Mail } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProjectWizardData, Task } from '../../../types/project';
import BackBtn from '../../Button/BackBtn';
import ContinueBtn from '../../Button/ContinueBtn';
import SaveAndExitBtn from '../../Button/SaveAndExitBtn';
import { useGetTaskActionsQuery } from '../../../features/task/taskDataApi';
import { useGetSubUsersQuery } from '../../../features/master/subUserDataApi';
import AddSubUserModal from '../../modals/AddSubUserModal';

interface TasksStepProps {
    readonly data: ProjectWizardData;
    readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
    readonly onNext: () => void;
    readonly onBack: () => void;
    readonly onSaveAndExit?: () => void;
}

export default function TasksStep({ data, onUpdate, onNext, onBack, onSaveAndExit }: TasksStepProps) {

    const [isOpen, setIsOpen] = useState(false);
    const { data: actionRes } = useGetTaskActionsQuery();
    const { data: subUserRes, isFetching: isSubuserFetching } = useGetSubUsersQuery();

    const [newTask, setNewTask] = useState<Partial<Task>>({
        actionId: 0,
        action: '',
        assignedId: 0,
        assignedTo: '',
        otherName: '',
        dueDate: '',
        emailAlert: false,
        comment: '',
    });

    const isAddDisabled = useMemo(() => {
        if (!newTask.dueDate) return true;

        if (!newTask.assignedId || newTask.assignedId === 0) return true;

        if (newTask.actionId === 0) {
            if (!newTask.otherName?.trim()) return true;
        } else {
            if (!newTask.actionId) return true;
        }

        return false;
    }, [newTask]);


    const addTask = () => {

        const task: Task = {
            id: Date.now().toString(),
            action: newTask.action || '',
            actionId: newTask.actionId,
            dueDate: newTask.dueDate || '',
            emailAlert: newTask.emailAlert || false,
            comment: newTask.comment || '',
            otherName: newTask.otherName || '',
            assignedId: newTask.assignedId,
            assignedTo: newTask.assignedTo,
            isNew: true,
        };

        onUpdate({ tasks: [...data.tasks, task] });

        setNewTask({
            actionId: 0,
            action: '',
            dueDate: '',
            emailAlert: false,
            comment: '',
            otherName: '',
            assignedId: 0,
            assignedTo: ''
        });
    };

    const removeTask = (taskId: string) => {
        onUpdate({ tasks: data.tasks.filter(t => t.id !== taskId), removedTasks: [...data.removedTasks, taskId] });
    };

    return (
        <div className="max-w-6xl mx-auto p-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Project Tasks</h1>
                <p className="text-lg text-slate-600">
                    Add tasks and track important actions for this project.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-slate-900 mb-4">Add New Task</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <div className='flex items-center justify-between mb-2'>

                                <label className="block text-sm font-semibold text-slate-700 mb-2 py-1">
                                    Task Action <span className="text-red-600">*</span>
                                </label>
                            </div>
                            <div className="relative">

                                <select
                                    value={newTask.actionId}
                                    onChange={(e) => {
                                        const selectedId = Number(e.target.value);

                                        const selectedAction = actionRes?.data?.find(
                                            (a) => a.id === selectedId
                                        );

                                        setNewTask({
                                            ...newTask,
                                            actionId: selectedId,
                                            action:
                                                selectedId === -1
                                                    ? 'Other'
                                                    : selectedAction?.name || '',
                                        });
                                    }}
                                    className="w-full px-4 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="0">Select Action</option>
                                    {actionRes?.data?.map((action) => (
                                        <option key={action.id} value={action.id}>{action.name}</option>
                                    ))}
                                    <option value={-1}>Other</option>
                                </select>
                            </div>

                        </div>
                        {newTask.actionId === -1 && (

                            <div className="">
                                <label className="block text-sm font-semibold text-slate-700 mb-3 py-1">
                                    Action <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Send preliminary notice"
                                    value={newTask.otherName}
                                    onChange={(e) => setNewTask({ ...newTask, otherName: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        <div>
                            <div className='flex items-center justify-between mb-3'>
                                <label className="block text-sm font-semibold text-slate-700 ">
                                    Assigned To <span className="text-red-600">*</span>
                                </label>
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className='px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'>Add New Sub User</button>
                            </div>
                            <select
                                value={newTask.assignedId}
                                onChange={(e) => {
                                        const assignedId = Number(e.target.value);

                                        const selectedAction = subUserRes?.data?.find(
                                            (a) => a.id === assignedId
                                        );

                                        setNewTask({
                                            ...newTask,
                                            assignedId: assignedId,
                                            assignedTo: selectedAction?.name || ''
                                        });
                                    }}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={!data.countryId}
                            >
                                {isSubuserFetching ? (
                                    <option value="">Loading Sub user...</option>
                                ) : (
                                    <>
                                        <option value="">Select Sub user</option>
                                        {subUserRes?.data?.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>

                        </div>

                        <div className='flex justify-between items-center'>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3 py-1">
                                    Due Date <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newTask.emailAlert}
                                        onChange={(e) => setNewTask({ ...newTask, emailAlert: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-semibold text-slate-700">Email Alert</span>
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Comment
                            </label>
                            <textarea
                                placeholder="Add notes or additional details..."
                                value={newTask.comment}
                                onChange={(e) => setNewTask({ ...newTask, comment: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={addTask}
                        disabled={isAddDisabled}
                        className={`px-4 py-2 ${isAddDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                            } text-white rounded-lg  transition-colors flex items-center gap-2`
                        }                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </button>
                </div>

                {data.tasks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Action</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Due Date</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Assigned To</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Comment</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.tasks.map((task, index) => (
                                    <tr key={task.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                                        <td className="px-4 py-3 font-medium">{task.otherName || task.action}</td>
                                        <td className="px-4 py-3">{new Date(task.dueDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 max-w-xs truncate">{task.assignedTo}</td>
                                        <td className="px-4 py-3 max-w-xs truncate">{task.comment || '-'}</td>
                                        <td className="px-4 py-3">
                                            {task.emailAlert ? (
                                                <Mail className="w-4 h-4 text-blue-600" />
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => removeTask(task.id)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-lg">
                        <p className="text-slate-600">No tasks added yet. Create your first task above.</p>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mt-8">
                <BackBtn onBack={onBack} />
                <div className="flex gap-3">
                    {onSaveAndExit && (
                        <SaveAndExitBtn onSaveAndExit={onSaveAndExit} />
                    )}
                    <ContinueBtn onNext={onNext} />
                </div>
            </div>
            <AddSubUserModal isOpen={isOpen} data={data} onClose={() => setIsOpen(false)} />
        </div>
    );
}
