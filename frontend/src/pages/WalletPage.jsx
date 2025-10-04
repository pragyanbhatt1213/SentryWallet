import React from 'react';
import WalletBalance from '../components/WalletBalance';
import SendTransaction from '../components/SendTransaction';

const WalletPage = ({ user }) => {
    return (
        <div style={{ background: 'linear-gradient(180deg, #E8FFF5 0%, #C2F3E0 100%)', color: '#0A1A16', minHeight: '100vh' }}>
            <WalletBalance user={user} />
            <div className="mt-8">
                <SendTransaction user={user} />
            </div>
        </div>
    );
};

export default WalletPage;