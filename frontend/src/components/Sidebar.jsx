import React from 'react';

const Sidebar = ({ setActivePage }) => {
    return (
        <div className="w-64 bg-white p-4">
            <h2 className="text-2xl font-bold mb-8">SentryWallet</h2>
            <nav>
                <ul>
                    <li className="mb-4">
                        <button onClick={() => setActivePage('wallet')} className="w-full text-left p-2 rounded-md hover:bg-gray-200">
                            My Wallet
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setActivePage('nominees')} className="w-full text-left p-2 rounded-md hover:bg-gray-200">
                            Nominee Settings
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;