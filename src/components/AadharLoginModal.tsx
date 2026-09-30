import React, { useState } from 'react';

interface AadhaarLoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (name: string, aadhaarNum: string) => void;
  onClose?: () => void;
}

export const AadhaarLoginModal: React.FC<AadhaarLoginModalProps> = ({
  isOpen,
  onLoginSuccess,
}) => {
  const [aadhaarNumber, setAadhaarNumber] = useState('2489-1039-4821');
  const [beneficiaryName, setBeneficiaryName] = useState('Pravin');
  const [otp, setOtp] = useState('482103');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('otp');
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess(beneficiaryName.trim() || 'Pravin', aadhaarNumber);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-sm shadow-lg max-w-md w-full p-6 text-gray-900">
        <div className="border-b border-gray-100 pb-3 mb-4">
          <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
            UIDAI & MoSJE Authentication
          </div>
          <h2 className="text-base font-bold text-gray-900 mt-0.5">
            Aadhaar Caste & Identity Verification
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to access your PM-AJAY GIA Grants and personalized voice profiling.
          </p>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Beneficiary Name (Registered under PM-AJAY)
              </label>
              <input
                type="text"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:outline-hidden focus:border-blue-600"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                12-Digit Aadhaar Credential Number
              </label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-sm font-mono tracking-wider focus:bg-white focus:outline-hidden focus:border-blue-600"
                placeholder="XXXX-XXXX-XXXX"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Default test account configured for user: Pravin
              </span>
            </div>

            <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-sm text-[11px] text-blue-900">
              <span className="font-semibold block mb-0.5">Aadhaar SC Caste Verification Note:</span>
              UIDAI e-KYC will authenticate Scheduled Caste (SC) category verification to pre-qualify for the PM-AJAY Grant-in-Aid (GIA).
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2 px-4 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer"
            >
              {isVerifying ? 'Generating OTP...' : 'Send Aadhaar e-KYC OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5">
            <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-sm text-xs text-emerald-900">
              OTP has been simulated and sent to linked mobile (+91-98XXXXX120).
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-sm font-mono text-center tracking-widest text-sm focus:bg-white focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-1/3 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-sm cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="w-2/3 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer"
              >
                {isVerifying ? 'Verifying...' : 'Verify & Continue as Pravin'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
