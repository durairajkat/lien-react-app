import { useState } from 'react';
import NavigationHeader from './NavigationHeader'
import SideNavigation from './SideNavigation'

interface TemplateProps {
    content: React.ReactNode;
    wizardMode?: boolean;
    saveAndExit?: () => void;
    saveAndExitDisabled?: boolean;
}

export const Template = (props: TemplateProps) => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen">
            <SideNavigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <div className="flex-1 overflow-auto">
                <div className="min-h-screen bg-slate-50">
                    <NavigationHeader
                        showLogo={true}
                        showHomeButton={false}
                        showBackButton={false}
                        wizardMode={props.wizardMode ?? false}
                        saveAndExit={props.saveAndExit}
                        saveAndExitDisabled={props.saveAndExitDisabled ?? false}
                        onMenuClick={() => setIsMobileMenuOpen(true)}
                    />
                    {/* Main content goes here */}
                    {props.content}
                </div>
            </div>
        </div>
    )
}
