<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/wallet';

const NomineeManager = ({ user }) => {
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [nomineeAddress, setNomineeAddress] = useState('');
  const [sharePercentage, setSharePercentage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [nomineeData, setNomineeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch nominee data on mount and after save
  useEffect(() => {
    const fetchNominee = async () => {
      setIsLoading(true);
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('nominee_data')
        .eq('id', user.id)
        .single();
      if (!error && data && Array.isArray(data.nominee_data)) {
        setNomineeData(data.nominee_data);
      } else if (!error && data && data.nominee_data) {
        // If it's a single object (legacy), convert to array
        setNomineeData([data.nominee_data]);
      } else {
        setNomineeData([]);
      }
      setIsLoading(false);
    };
    fetchNominee();
  }, [user, showModal]);
=======

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { supabase } from '../utils/wallet';
import { Loader2, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import SentryInheritanceABI from '../contracts/SentryInheritance.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_INHERITANCE_CONTRACT_ADDRESS;

const NomineeManager = ({ user, wallet }) => {
  const [nomineeEmail, setNomineeEmail] = useState(''); // Off-chain email
  const [nomineeAddress, setNomineeAddress] = useState(''); // On-chain address
  const [sharePercentage, setSharePercentage] = useState(''); // On-chain share
  const [currentNomineeOnChain, setCurrentNomineeOnChain] = useState(null); // { address, share }
  const [currentNomineeOffChain, setCurrentNomineeOffChain] = useState(''); // Off-chain email

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inheritanceContract = new ethers.Contract(CONTRACT_ADDRESS, SentryInheritanceABI, wallet);

  useEffect(() => {
    const fetchNomineeData = async () => {
      if (!user || !wallet || !CONTRACT_ADDRESS) return;

      setIsLoading(true);
      setError('');

      try {
        // Fetch off-chain nominee email
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('nominee_email')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        if (profileData && profileData.nominee_email) {
          setCurrentNomineeOffChain(profileData.nominee_email);
          setNomineeEmail(profileData.nominee_email);
        }

        // Fetch on-chain nominee data
        const onChainShare = await inheritanceContract.nominees(wallet.address);
        if (onChainShare > 0) {
          setCurrentNomineeOnChain({ address: wallet.address, share: onChainShare.toString() });
          setNomineeAddress(wallet.address);
          setSharePercentage(onChainShare.toString());
        }

      } catch (err) {
        setError('Could not fetch nominee information.');
        console.error("Error fetching nominee:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNomineeData();
  }, [user, wallet]);
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
<<<<<<< HEAD

    // Basic validation
    if (!nomineeEmail || !nomineeAddress || !sharePercentage) {
      setError('All fields are required.');
=======
    setSuccess('');

    if (!ethers.utils.isAddress(nomineeAddress)) {
      setError('Invalid nominee BlockDAG address.');
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
      setIsSaving(false);
      return;
    }
    const share = parseInt(sharePercentage);
    if (isNaN(share) || share <= 0 || share > 100) {
      setError('Share percentage must be a number between 1 and 100.');
      setIsSaving(false);
      return;
    }

<<<<<<< HEAD
    // Validate total share
    const currentTotalShare = nomineeData.reduce((total, nominee) => {
      return total + (nominee.share || nominee.shareAmount || 0);
    }, 0);

    if (currentTotalShare + share > 100) {
      setError('Total share cannot exceed 100%.');
      setIsSaving(false);
      return;
    }

    try {
      // Get current nominees
      let currentNominees = Array.isArray(nomineeData) ? [...nomineeData] : [];
      // Add new nominee
      currentNominees.push({
        email: nomineeEmail,
        address: nomineeAddress,
        share: share,
      });
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({ nominee_data: currentNominees })
        .eq('id', user.id);
      if (supabaseError) {
        throw supabaseError;
      }
      setShowModal(true);
      setNomineeEmail('');
      setNomineeAddress('');
      setSharePercentage('');
    } catch (err) {
      setError('Failed to save nominee. Please try again.');
=======
    try {
      // Save off-chain email
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({ nominee_email: nomineeEmail })
        .eq('id', user.id);

      if (supabaseError) {
        throw supabaseError;
      }
      setCurrentNomineeOffChain(nomineeEmail);

      // Save on-chain nominee
      const tx = await inheritanceContract.setNominee(nomineeAddress, share);
      await tx.wait();

      setCurrentNomineeOnChain({ address: nomineeAddress, share: sharePercentage });
      setSuccess('Nominee saved successfully on-chain and off-chain!');
    } catch (err) {
      setError(err.reason || 'Failed to save nominee. Please try again.');
      console.error("Error saving nominee:", err);
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
    } finally {
      setIsSaving(false);
    }
  };

<<<<<<< HEAD
  return (
    <div className="neumorphic-inset rounded-2xl p-6">
      {/* Display all nominees if present */}
      {isLoading ? (
        <div className="mb-4 text-gray-500">Loading nominee details...</div>
      ) : nomineeData && nomineeData.length > 0 ? (
        <div className="mb-4 p-4 bg-gray-100 rounded-xl">
          <div className="font-semibold mb-2">Your Nominees:</div>
          <table className="w-full text-left mb-2">
            <thead>
              <tr>
                <th className="pr-4">Email</th>
                <th className="pr-4">Wallet Address</th>
                <th className="pr-4">Share (%)</th>
              </tr>
            </thead>
            <tbody>
              {nomineeData.map((nom, idx) => (
                <tr key={idx} className="border-t">
                  <td className="pr-4 py-1">{nom.email}</td>
                  <td className="pr-4 py-1">{nom.address}</td>
                  <td className="pr-4 py-1">{nom.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mb-4 text-gray-500">No nominees added yet.</div>
=======
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="ml-2">Loading Nominee Info...</span>
      </div>
    );
  }

  return (
    <div className="neumorphic-inset rounded-2xl p-6">
      {currentNomineeOffChain && !error && (
        <div className="mb-4 text-sm text-gray-600">
          Current Off-chain Nominee Email: <span className="font-semibold text-accent">{currentNomineeOffChain}</span>
        </div>
      )}
      {currentNomineeOnChain && !error && (
        <div className="mb-4 text-sm text-gray-600">
          Current On-chain Nominee: <span className="font-semibold text-accent">{currentNomineeOnChain.address}</span> (Share: <span className="font-semibold text-accent">{currentNomineeOnChain.share}%</span>)
        </div>
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
      )}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="nomineeEmail" className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
            Nominee's Email Address
=======
            Nominee's Email Address (Off-chain)
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
          </label>
          <input
            id="nomineeEmail"
            type="email"
            value={nomineeEmail}
<<<<<<< HEAD
            onChange={(e) => {
              setNomineeEmail(e.target.value);
              setError('');
            }}
=======
            onChange={(e) => setNomineeEmail(e.target.value)}
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="nominee@example.com"
            required
            disabled={isSaving}
          />
        </div>
<<<<<<< HEAD
        <div>
          <label htmlFor="nomineeAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Nominee's Wallet Address
=======

        <div>
          <label htmlFor="nomineeAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Nominee's BlockDAG Address (On-chain)
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
          </label>
          <input
            id="nomineeAddress"
            type="text"
            value={nomineeAddress}
<<<<<<< HEAD
            onChange={(e) => {
              setNomineeAddress(e.target.value);
              setError('');
            }}
=======
            onChange={(e) => setNomineeAddress(e.target.value)}
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="0x..."
            required
            disabled={isSaving}
          />
        </div>
<<<<<<< HEAD
=======

>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
        <div>
          <label htmlFor="sharePercentage" className="block text-sm font-medium text-gray-700 mb-2">
            Share Percentage (1-100)
          </label>
          <input
            id="sharePercentage"
            type="number"
            value={sharePercentage}
<<<<<<< HEAD
            onChange={(e) => {
              setSharePercentage(e.target.value);
              setError('');
            }}
=======
            onChange={(e) => setSharePercentage(e.target.value)}
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="e.g., 50 for 50%"
            required
            min="1"
            max="100"
            disabled={isSaving}
          />
        </div>
<<<<<<< HEAD
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <button
          type="submit"
          className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            isSaving || error ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:bg-accent/90 text-white'
          }`}
          disabled={isSaving || !!error}
        >
          {isSaving ? 'Saving...' : 'Save Nominee'}
        </button>
      </form>
      {/* Modal Confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Nominee Added!</h2>
            <p className="mb-6">Nominee details have been saved successfully.</p>
            <button
              className="px-6 py-2 bg-accent text-white rounded-xl font-semibold"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
=======

        {error && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-accent hover:bg-accent/90 text-white'
          }`}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              Save Nominee On-Chain
            </>
          )}
        </button>
      </form>
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
    </div>
  );
};

export default NomineeManager;
