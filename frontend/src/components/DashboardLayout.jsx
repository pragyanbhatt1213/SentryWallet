import React, { useState } from 'react';
import Sidebar from './Sidebar';
import WalletPage from '../pages/WalletPage';
import NomineeSettingsPage from '../pages/NomineeSettingsPage';

const DashboardLayout = ({ user }) => {
    const [activePage, setActivePage] = useState('wallet');

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar setActivePage={setActivePage} />
            <main className="flex-1 p-8">
                {activePage === 'wallet' && <WalletPage user={user} />}
                {activePage === 'nominees' && <NomineeSettingsPage user={user} />}
            </main>
        </div>
    );
};

export default DashboardLayout;