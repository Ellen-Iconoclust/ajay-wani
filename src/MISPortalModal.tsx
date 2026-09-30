import React from 'react';
import { BeneficiaryProfile, GIAGrantStatus, NSQFCourse, MISSyncRecord } from '../types/pmajay';

interface MISPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BeneficiaryProfile;
  giaStatus: GIAGrantStatus;
  selectedCourse?: NSQFCourse;
  misRecord?: MISSyncRecord | null;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const MISPortalModal: React.FC<MISPortalModalProps> = ({
  isOpen,
  onClose,
  profile,
  giaStatus,
  selectedCourse,
  misRecord,
  onTriggerSync,
  isSyncing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-gray-900">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              PM-AJAY MIS Portal Synchronization (MoSJE)
            </h3>
            <p className="text-[11px] text-gray-500">
              Department of Social Justice and Empowerment • Grant-in-Aid Verification
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-black px-2 py-1 border border-gray-200 rounded-sm cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Sync Trigger Banner */}
          <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-gray-900 block">
                Central MIS Portal Status
              </span>
              <span className="text-gray-600 text-xs">
                {misRecord ? 'Synced with MoSJE Central Database' : 'Dossier ready for submission'}
              </span>
            </div>

            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm cursor-pointer border ${
                isSyncing
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-black text-white border-black'
              }`}
            >
              {isSyncing ? 'Transmitting...' : 'Sync Now to PM-AJAY'}
            </button>
          </div>

          {/* Dossier Card */}
          <div className="border border-gray-200 p-4 rounded-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-semibold text-gray-900 text-xs">
                Beneficiary Verification Record
              </span>
              <span className="text-[11px] font-mono text-gray-500">
                ID: {misRecord?.beneficiaryId || 'PMAJAY-SC-PENDING'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-gray-400 block">Beneficiary Name:</span>
                <span className="font-semibold text-gray-900">{profile.name || 'Pravin'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Caste Category:</span>
                <span className="font-medium text-gray-800">{profile.casteCategory}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">District / State:</span>
                <span className="font-medium text-gray-800">{profile.district || 'Azamgarh'}, {profile.state || 'Uttar Pradesh'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Traditional Trade:</span>
                <span className="font-medium text-gray-800">{profile.traditionalOccupation || 'None specified'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Education:</span>
                <span className="font-medium text-gray-800">{profile.educationLevel || '8th Pass'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Mobility:</span>
                <span className="font-medium text-gray-800">{profile.mobilityRadius}</span>
              </div>
            </div>

            {/* Grant details */}
            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-sm mt-2">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-1 mb-2">
                <span className="font-semibold text-emerald-950 text-xs">
                  GIA Grant Pre-Sanction: ₹50,000
                </span>
                <span className="text-[10px] font-mono text-gray-500">
                  Ref: {giaStatus.sanctionNumber}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="bg-white p-2 border border-emerald-100 rounded-xs">
                  <span className="text-gray-500 block">Capital Assets:</span>
                  <span className="font-bold text-gray-900">₹35,000</span>
                </div>
                <div className="bg-white p-2 border border-emerald-100 rounded-xs">
                  <span className="text-gray-500 block">Toolkit Grant:</span>
                  <span className="font-bold text-gray-900">₹10,000</span>
                </div>
                <div className="bg-white p-2 border border-emerald-100 rounded-xs">
                  <span className="text-gray-500 block">Working Capital:</span>
                  <span className="font-bold text-gray-900">₹5,000</span>
                </div>
              </div>
            </div>

            {/* Allocated course */}
            {selectedCourse && (
              <div className="border border-gray-100 p-3 rounded-sm bg-gray-50/50">
                <span className="text-[10px] text-gray-400 block mb-0.5">Enrolled Course:</span>
                <div className="font-semibold text-gray-900 text-xs">{selectedCourse.title}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Sector: {selectedCourse.sector} • QP: {selectedCourse.qpCode} • {selectedCourse.durationHours} Hours
                </div>
              </div>
            )}
          </div>

          {/* SMS Notification */}
          <div className="border border-gray-200 p-3.5 rounded-sm">
            <span className="text-[10px] font-semibold text-gray-500 block mb-1">
              Dispatched SMS Confirmation Preview:
            </span>
            <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-xs text-xs text-gray-700 leading-relaxed">
              {misRecord?.smsNotificationPayload.messageText || 
                `MoSJE PM-AJAY: प्रिय लाभार्थी ${profile.name || 'Pravin'}, आपका पंजीकरण संख्या PMAJAY-SC-2026-839201 पोर्टल पर सत्यापित हो चुका है। ₹50,000 की अनुदान (GIA) सहायता आपके कौशल केंद्र आवंटन के साथ अग्रसारित की गई है।`}
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400">
              <span>Recipient: {profile.contactNumber}</span>
              <span className="text-emerald-700 font-medium">Delivery Verified</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50/50">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-sm text-xs cursor-pointer"
          >
            Print Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
