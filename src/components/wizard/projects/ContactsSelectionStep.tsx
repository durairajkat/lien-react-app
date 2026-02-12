import { useState } from 'react';
import { ArrowRight, ArrowLeft, Plus, User, Check, Building2 } from 'lucide-react';
import { ProjectWizardData } from '../../../types/project';
import { Customer } from '../../../types/customer';
import AddCustomerModal from '../../modals/AddCustomerModal';
import AddProjectContactsModal from '../../modals/AddProjectContactsModal';

interface ContactsSelectionStepProps {
    readonly data: ProjectWizardData;
    readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
    readonly onNext: () => void;
    readonly onBack: () => void;
    readonly onSaveAndExit?: () => void;
    readonly isProjectContactDataFetching: boolean
}

export default function ContactsSelectionStep({ data, onUpdate, onNext, onBack, onSaveAndExit, isProjectContactDataFetching }: ContactsSelectionStepProps) {
    const [contacts, setContacts] = useState<Customer[]>(data.projectContacts ?? []);
    const [customers, setCustomers] = useState<Customer[]>(data.customerContacts);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    const fetchContacts = async () => {

        setLoading(true);
        setLoading(false);
    };

    const fetchCustomers = async () => {

    };


    const handleSaveCustomer = async (customer: Customer) => {
        const currentCustomers = Array.isArray(data.customerContacts)
            ? data.customerContacts
            : [];
        let updatedCustomers: Customer[];
        updatedCustomers = [...currentCustomers, customer];

        onUpdate({
            customerContacts: updatedCustomers,
            selectedCustomerContacts:
                updatedCustomers.length === 1
                    ? updatedCustomers[0]
                    : data.selectedCustomerContacts,
        });

        setCustomers(updatedCustomers);
    };

    const handleSelectCustomer = (selectedId: number) => {
        const selectedCustomer = data.customerContacts.find(x => x.id == selectedId);
        onUpdate({
            selectedCustomerContacts: selectedCustomer
        });
    }


    const handleSaveProjectContacts = async (customer: Customer) => {
        const currentCustomers = Array.isArray(data.projectContacts)
            ? data.projectContacts
            : [];
        let updatedCustomers: Customer[];
        updatedCustomers = [...currentCustomers, {...customer, is_new: true}];

        onUpdate({
            projectContacts: updatedCustomers,
        });

        setContacts(updatedCustomers);
        setShowAddForm(false);
    };

    const toggleContact = (contactId: number) => {
        const projectContacts = data.projectContacts ?? [];
        const selectedContacts = data.selectedProjectContacts ?? [];

        const selectedContact = projectContacts.find(
            (contact) => contact.id === contactId
        );

        if (!selectedContact) return;

        const isAlreadySelected = selectedContacts.some(
            (contact) => contact.id === contactId
        );

        const updatedContacts = isAlreadySelected
            ? selectedContacts.filter((contact) => contact.id !== contactId)
            : [...selectedContacts, selectedContact];

        onUpdate({ selectedProjectContacts: updatedContacts });
    };

    const isContactSelected = (contactId: number): boolean => {
        return data.selectedProjectContacts?.some(
            (contact) => contact.id === contactId
        ) ?? false;
    };

    console.log(' contacts ', contacts);

    return (
        <div className="max-w-4xl mx-auto p-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Edit Contacts</h1>
                <p className="text-lg text-slate-600">
                    Choose customer and contacts involved in this project.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-blue-600 mb-4">Customer Information</h3>
                    {customers.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 mb-4">
                            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-600 font-medium mb-1">No customers found</p>
                            <p className="text-sm text-slate-500">Click "Add New Customer" to get started</p>
                        </div>
                    ) : (
                        <select
                            value={data.selectedCustomerContacts.id}
                            onChange={(e) => handleSelectCustomer(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                        >
                            <option value="">Select a customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.company} ({customer.city})
                                </option>
                            ))}
                        </select>
                    )}
                    <button
                        onClick={() => setShowCustomerModal(true)}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Add New Customer
                    </button>
                </div>

                <div className="border-t border-slate-200 pt-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Project Contacts</h3>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Contact
                        </button>
                    </div>

                    {isProjectContactDataFetching ? (
                        <div className="text-center py-8">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-600">Loading contacts...</p>
                        </div>
                    ) : (
                        <>
                            {contacts.length === 0 ? (
                                <div className="text-center py-12 bg-slate-50 rounded-lg">
                                    <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-600 mb-2">No contacts found</p>
                                    <p className="text-sm text-slate-500">Click "Add New Contact" to get started</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {contacts.map((contact) => (
                                        <button
                                            key={contact.id}
                                            onClick={() => toggleContact(Number(contact.id))}
                                            className={`
                  w-full p-4 border-2 rounded-lg cursor-pointer transition-all text-left
                  ${isContactSelected(Number(contact.id))
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }
                `}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                            ${isContactSelected(Number(contact.id))
                                                                ? 'border-blue-600 bg-blue-600'
                                                                : 'border-slate-300'
                                                            }
                        `}>
                                                            {isContactSelected(Number(contact.id)) && <Check className="w-4 h-4 text-white" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">{contact.company}</h4>
                                                            <p className="text-sm text-slate-600">
                                                                {contact.address} {contact.city} {contact.zip}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="ml-9 mt-2 text-sm text-slate-600">
                                                        {contact?.contacts?.map((con) => (
                                                            <>
                                                                <div>{con.firstName} {con.lastName}</div>
                                                                {con.directPhone && <div>{con.directPhone}</div>}
                                                                {con.email && <div>{con.email}</div>}
                                                            </>
                                                        )

                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {data.selectedProjectContacts && data.selectedProjectContacts.length > 0 && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-semibold text-green-900">
                                {data.selectedProjectContacts.length} contact(s) selected for this project
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="flex gap-3">
                    {onSaveAndExit && (
                        <button
                            onClick={onSaveAndExit}
                            className="px-6 py-3 text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            Save & Exit to Dashboard
                        </button>
                    )}
                    <button
                        onClick={onNext}
                        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        Continue
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <AddCustomerModal
                isOpen={showCustomerModal}
                data={data}
                onClose={() => setShowCustomerModal(false)}
                onSave={handleSaveCustomer}
            />

            <AddProjectContactsModal
                isOpen={showAddForm}
                data={data}
                onClose={() => setShowAddForm(false)}
                onSave={handleSaveProjectContacts}
            />
        </div>
    );
}
