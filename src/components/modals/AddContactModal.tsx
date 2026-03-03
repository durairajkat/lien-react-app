import { useCallback, useEffect, useRef, useState } from "react";
import { Customer, CustomerContact, initialCustomer } from "../../types/customer";
import { useGetContactRolesQuery, useGetStatesQuery, useLazyGetAllContactCompaniesQuery } from "../../features/master/masterDataApi";
import { useSubmitCustomerContactMutation } from "../../features/project/ProjectContactApi";
import { isValidEmail, isValidPhone } from "../../utils/validation";
import Swal from "sweetalert2";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Plus } from "lucide-react";
import CustomerContactListForm from "../Parts/CustomerContactListForm";
import CompanyAutocomplete from "../../utils/CompanyAutocomplete";

const AddContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const hasFetchedRef = useRef(false);
    const [customer, setCustomer] = useState<Customer>(initialCustomer);
    const [contactErrors, setContactErrors] = useState<
        Record<number, { email?: string; directPhone?: string; cell?: string }>
    >({});

    const { data: states, isLoading: isStatesLoading, isFetching: isStatesFetching } = useGetStatesQuery(
        { country_id: 1 },
    );

    const { data: customerContactRoles } = useGetContactRolesQuery({
        type: "customer",
    });

    const [fetchCompanies, { data: companies }] =
        useLazyGetAllContactCompaniesQuery();

    const [
        submitCustomerContact,
        { isLoading: saveLoading },
    ] = useSubmitCustomerContactMutation();

    const updateCustomer = useCallback(
        (field: keyof Customer, value: any) => {
            setCustomer((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        []
    );

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        customer.contacts.forEach((contact, index) => {
            if (contact.email && !isValidEmail(contact.email)) {
                errors[`contacts.${index}.email`] =
                    "Customer contact email must be valid.";
            }
        });

        return Object.keys(errors).length === 0;
    };

    const hasContactErrors = Object.keys(contactErrors).length > 0;

    const isValid = customer.company && customer.address && customer.city && isValidPhone(customer.phone) && customer.state_id && customer.zip && validateForm() && customer.contacts.length && !hasContactErrors;

    const addContact = () => {
        const newContact: CustomerContact = {
            role_id: 1,
            firstName: '',
            lastName: '',
            email: '',
            directPhone: '',
            cell: '',
        };
        setCustomer({
            ...customer,
            id: Date.now(),
            contacts: [...customer.contacts, newContact],
        });
    };

    const updateContact = (index: number, field: keyof CustomerContact, value: string | number) => {
        const updatedContacts = [...customer.contacts];
        updatedContacts[index] = { ...updatedContacts[index], [field]: value };
        setCustomer({ ...customer, contacts: updatedContacts });
    };

    const removeContact = (index: number) => {
        const updatedContacts = customer.contacts.filter((_, i) => i !== index);
        setCustomer({ ...customer, contacts: updatedContacts });
    }

    const handleSave = async () => {
        try {
            const response = await submitCustomerContact(customer).unwrap();
            if (response.status) {

                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: "Project saved successfully",
                });
                setCustomer(initialCustomer);
                onClose();
            }

        } catch (err: any) {
            const errorResponse = err?.data;
            let errorMessage = "Something went wrong";
            if (errorResponse?.errors) {
                const firstErrorKey = Object.keys(errorResponse.errors)[0];
                errorMessage = errorResponse.errors[firstErrorKey][0];
            } else if (errorResponse?.message) {
                errorMessage = errorResponse.message;
            }

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        }
    };

    const validateContactField = useCallback((
        index: number,
        field: "email" | "directPhone" | "cell",
        value: string
    ) => {
        setContactErrors((prev) => {
            const updated = { ...prev };

            if (!updated[index]) {
                updated[index] = {};
            }

            if (field === "email") {
                if (!value) {
                    updated[index].email = "Email is required.";
                } else if (!isValidEmail(value)) {
                    updated[index].email = "Invalid email format.";
                } else {
                    delete updated[index].email;
                }
            }

            if (field === "directPhone" || field === "cell") {
                if (value && !isValidPhone(value)) {
                    updated[index][field] = "Phone must be 10 digits.";
                } else {
                    delete updated[index][field];
                }
            }

            if (Object.keys(updated[index]).length === 0) {
                delete updated[index];
            }

            return updated;
        });
    }, []);

    useEffect(() => {
        if (isOpen && !hasFetchedRef.current) {
            fetchCompanies({ type: 'customer' });
            hasFetchedRef.current = true;
        }
    }, [isOpen]);


    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Add Customer Contact
                <IconButton onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8
                    }}
                >
                    X
                </IconButton>

            </DialogTitle>


            {/* Content */}
            <DialogContent>
                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">

                        <CompanyAutocomplete
                            companies={companies?.data || []}
                            customer={customer}
                            updateCustomer={updateCustomer}
                        />

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Website:
                            </label>
                            <input
                                type="text"
                                value={customer.website}
                                onChange={(e) => updateCustomer('website', e.target.value)}
                                placeholder="Enter Website"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Address <span className="text-red-600">*</span>:
                        </label>
                        <textarea
                            value={customer.address}
                            onChange={(e) => updateCustomer('address', e.target.value)}
                            placeholder="Enter Address"
                            rows={3}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                City<span className="text-red-600">*</span>:
                            </label>
                            <input
                                type="text"
                                value={customer.city}
                                onChange={(e) => updateCustomer('city', e.target.value)}
                                placeholder="Enter City"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                State<span className="text-red-600">*</span>:
                            </label>
                            <select
                                value={customer.state_id}
                                onChange={(e) => updateCustomer('state_id', Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {isStatesLoading || isStatesFetching ? (
                                    <option value="">Loading states...</option>
                                ) : (
                                    <>
                                        <option value="">Select State</option>
                                        {states?.data?.map((state) => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Zip<span className="text-red-600">*</span>:
                            </label>
                            <input
                                type="text"
                                value={customer.zip}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    updateCustomer('zip', value);
                                }}
                                placeholder="Enter Zip Code"
                                maxLength={6}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone <span className="text-red-600">*</span>:
                            </label>
                            <input
                                type="text"
                                value={customer.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                    updateCustomer('phone', value)
                                }}
                                placeholder="Enter Phone Number"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Fax:
                            </label>
                            <input
                                type="text"
                                value={customer.fax}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    updateCustomer('fax', value)
                                }}
                                placeholder="Enter Fax Number"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-semibold text-slate-700">Contacts:</label>
                            <button
                                onClick={addContact}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Contact
                            </button>
                        </div>

                        <CustomerContactListForm
                            customerContactRoles={customerContactRoles?.data ?? []}
                            contacts={customer?.contacts}
                            updateContact={updateContact}
                            contactErrors={contactErrors}
                            removeContact={removeContact}
                            validateContactField={validateContactField}
                        />
                    </div>
                </div>
            </DialogContent>

            {/* Actions */}
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained" disabled={!isValid || saveLoading}>
                    {saveLoading ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddContactModal