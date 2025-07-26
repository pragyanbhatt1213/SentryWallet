import React from 'react';
import NomineeManager from '../components/NomineeManager';

const NomineeSettingsPage = ({ user }) => {
    return (
        <div>
            <NomineeManager user={user} />
        </div>
    );
};

export default NomineeSettingsPage;