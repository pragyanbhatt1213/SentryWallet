import React from 'react';

const Sidebar = ({ setActivePage }) => {
    return (
        <div className="w-64 p-4" style={{ background: 'linear-gradient(180deg, #E8FFF5 0%, #C2F3E0 100%)', color: '#0A1A16' }}>
            <h2 className="text-2xl font-bold mb-8" style={{ color: '#00B49F' }}>SentryWallet</h2>
            <nav>
                <ul>
                    <li className="mb-4">
                        <button
                            onClick={() => setActivePage('wallet')}
                            className="w-full text-left p-2 rounded-md"
                            style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#0A1A16', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.4)' }}
                        >
                            My Wallet
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActivePage('nominees')}
                            className="w-full text-left p-2 rounded-md"
                            style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#0A1A16', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.4)' }}
                        >
                            Nominee Settings
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;