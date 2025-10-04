import React, { useState } from 'react';
import Sidebar from './Sidebar';
import WalletPage from '../pages/WalletPage';
import NomineeSettingsPage from '../pages/NomineeSettingsPage';

const DashboardLayout = ({ user }) => {
    const [activePage, setActivePage] = useState('wallet');

    return (
        <div
            className="flex min-h-screen"
            style={{
                background: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 50%, #80CBC4 100%)', // Light teal to a slightly deeper teal
                color: '#111',
            }}
        >
            <Sidebar setActivePage={setActivePage} />
            <main className="flex-1 p-8" style={{ background: '#FDEEDC', color: '#111' }}>
                {activePage === 'wallet' && <WalletPage user={user} />}
                {activePage === 'nominees' && <NomineeSettingsPage user={user} />}
            </main>
        </div>
    );
};

export default DashboardLayout;