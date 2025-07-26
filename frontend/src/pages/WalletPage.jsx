import React from 'react';
import WalletBalance from '../components/WalletBalance';
import SendTransaction from '../components/SendTransaction';

const WalletPage = ({ user }) => {
    return (
        <div>
            <WalletBalance user={user} />
            <div className="mt-8">
                <SendTransaction user={user} />
            </div>
        </div>
    );
};

export default WalletPage;