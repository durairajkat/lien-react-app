import { useState } from 'react';
import { Users, Mail, Phone, MapPin, Building, Eye } from 'lucide-react';
import TotalContactCard from '../Parts/Contact/TotalContactCard';
import { ProjectContact, useGetProjectContactsQuery } from '../../features/project/ProjectContactApi';
import ContactView from '../Parts/Contact/ContactView';

export default function RecentContactsScreen() {

    const { data: projectContactData, isLoading } = useGetProjectContactsQuery();

    const totalCount = (projectContactData?.customerContact?.length || 0) + (projectContactData?.projectContact?.length || 0);
    const customerContactCount = projectContactData?.customerContact?.length || 0;
    const projectContactCount = projectContactData?.projectContact?.length || 0;

    const [selectedContact, setSelectedContact] = useState<ProjectContact | null>(null);
    const [activeTab, setActiveTab] = useState<"customer" | "industry">("customer");

    console.log("Project Contact Data:", projectContactData);
    return (
        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Recent Contacts</h1>
                    <p className="text-lg text-slate-600">
                        View your most recently added contacts
                    </p>
                </div>
                <TotalContactCard
                    totalCount={totalCount}
                    customerContactCount={customerContactCount}
                    projectContactCount={projectContactCount}
                />

                {/* Tabs */}
                <div className="mb-6 border-b border-slate-200">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab("customer")}
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === "customer"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            Customer Contacts ({customerContactCount})
                        </button>

                        <button
                            onClick={() => setActiveTab("industry")}
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === "industry"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            Industry Contacts ({projectContactCount})
                        </button>
                    </div>
                </div>


                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <div className="max-h-[600px] overflow-y-auto pr-2 slim-scrollbar">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading ? (
                                <div className="col-span-full text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-slate-600">Loading contacts...</p>
                                </div>
                            ) : null}
                            {(activeTab === "customer"
                                ? projectContactData?.customerContact
                                : projectContactData?.projectContact
                            )?.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">

                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>

                                            {contact?.contacts?.map((c: { firstName: string; lastName: string }, index: number) => (
                                                <h3 className="text-xl font-bold text-slate-900" key={index}>
                                                    {c.firstName} {c.lastName}
                                                </h3>
                                            ))}
                                            <span className="text-xs text-slate-500">
                                                {new Date(contact.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {contact.title && (
                                        <p className="text-sm text-slate-600 mb-3">{contact.title}</p>
                                    )}

                                    <div className="space-y-2 text-sm mb-4">
                                        {contact.company && (
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="truncate">{contact.company}</span>
                                            </div>
                                        )}

                                        {contact.email && (
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="truncate">{contact.email}</span>
                                            </div>
                                        )}

                                        {(contact?.contacts.directPhone || contact?.contacts.cell) && (
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span>{contact.contacts.directPhone || contact.contacts.cell}</span>
                                            </div>
                                        )}

                                        {contact.city && contact.state && (
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="truncate">
                                                    {contact.city}, {contact.state}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setSelectedContact(contact)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>


                {selectedContact && (
                    <ContactView contact={selectedContact} setSelectedContact={setSelectedContact} />
                )}
            </div>
        </div>
    );
}
