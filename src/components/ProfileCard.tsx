import React from 'react';
import { BeneficiaryProfile, GIAGrantStatus } from '../types/pmajay';
import { TranslationStrings } from '../data/translations';

interface ProfileCardProps {
  profile: BeneficiaryProfile;
  giaStatus: GIAGrantStatus;
  isProcessing: boolean;
  t: TranslationStrings;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  giaStatus,
  isProcessing,
  t,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      {/* Header bar */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-gray-900">
            {t.dossierTitle}
          </h3>
          <p className="text-[11px] text-gray-500">
            {t.dossierSubtitle}
          </p>
        </div>

        <div>
          {isProcessing ? (
            <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-sm">
              {t.updatingFromVoice}
            </span>
          ) : (
            <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm font-medium">
              {t.scVerified}
            </span>
          )}
        </div>
      </div>

      {/* Grant-in-Aid (GIA) Highlight Banner */}
      <div className={`p-4 border-b text-xs ${
        giaStatus.isEligible 
          ? 'bg-emerald-50/60 border-emerald-100 text-emerald-950' 
          : 'bg-amber-50/60 border-amber-100 text-amber-950'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
          <span className="font-semibold text-xs text-emerald-900">
            {giaStatus.verificationBadge}
          </span>
          <span className="text-[10px] text-gray-500 font-mono">
            Ref: {giaStatus.sanctionNumber}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-gray-600">
          {giaStatus.statusSummary}
        </p>

        {giaStatus.isEligible && (
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-100 text-xs">
            <div className="bg-white p-2 rounded-sm border border-emerald-200/80">
              <span className="text-[10px] text-gray-500 block">Capital Assets:</span>
              <span className="font-bold text-gray-900">₹{giaStatus.subsidyBreakdown.capitalAssetGrant.toLocaleString()}</span>
            </div>
            <div className="bg-white p-2 rounded-sm border border-emerald-200/80">
              <span className="text-[10px] text-gray-500 block">Toolkit Grant:</span>
              <span className="font-bold text-gray-900">₹{giaStatus.subsidyBreakdown.toolkitStipend.toLocaleString()}</span>
            </div>
            <div className="bg-white p-2 rounded-sm border border-emerald-200/80">
              <span className="text-[10px] text-gray-500 block">Working Seed:</span>
              <span className="font-bold text-gray-900">₹{giaStatus.subsidyBreakdown.workingCapitalMargin.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Structured Variables Extracted from Voice */}
      <div className="p-4 text-xs space-y-3">
        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 block">{t.nameLabel}</span>
            <span className="font-medium text-gray-900 text-sm">
              {profile.name || 'Pravin'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 block">{t.ageGenderLabel}</span>
            <span className="font-medium text-gray-800">
              {profile.age ? `${profile.age} Yrs` : t.notSpecified} • {profile.gender || t.notSpecified}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 block">{t.casteLabel}</span>
            <span className="font-medium text-gray-900">
              {profile.casteCategory}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 block">{t.educationLabel}</span>
            <span className="font-medium text-gray-800">
              {profile.educationLevel || t.notSpecified}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 block">{t.traditionalTradeLabel}</span>
            <span className="font-medium text-gray-800">
              {profile.traditionalOccupation || t.notSpecified}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 block">{t.currentWorkLabel}</span>
            <span className="font-medium text-gray-800">
              {profile.currentActivity || t.notSpecified}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 block">{t.mobilityLabel}</span>
            <span className="font-medium text-gray-800">
              {profile.mobilityRadius}
            </span>
            {profile.physicalConstraints && (
              <span className="text-[10px] text-gray-500 block mt-0.5">
                {profile.physicalConstraints}
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] text-gray-400 block">{t.employmentPrefLabel}</span>
            <span className="font-medium text-gray-900">
              {profile.employmentPreference}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-gray-400 block">{t.locationLabel}</span>
            <span className="font-medium text-gray-800">
              {profile.district || 'Azamgarh'}, {profile.state || 'Uttar Pradesh'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 block">{t.incomeLabel}</span>
            <span className="font-medium text-gray-800">
              {profile.annualFamilyIncome 
                ? `₹${profile.annualFamilyIncome.toLocaleString()}`
                : '< ₹2,50,000'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
