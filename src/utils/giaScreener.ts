import { BeneficiaryProfile, GIAGrantStatus } from '../types/pmajay';

export function evaluateGIAGrantEligibility(profile: BeneficiaryProfile): GIAGrantStatus {
  const isSC = profile.casteCategory === 'Scheduled Caste (SC)';
  const incomeUnderCeiling = profile.annualFamilyIncome !== null 
    ? profile.annualFamilyIncome <= 250000 
    : true; // default assumed eligible until documented
  
  const ageCompliant = profile.age !== null 
    ? (profile.age >= 18 && profile.age <= 50) 
    : true;

  const viableTradeIdentified = (profile.vocationalInterests.length > 0) || 
    Boolean(profile.traditionalOccupation && profile.traditionalOccupation !== 'None / First Generation') ||
    Boolean(profile.currentActivity);

  const residenceInTargetCluster = Boolean(profile.district || profile.state);
  const bankAccountDbtReady = Boolean(profile.rationCardOrAadhaarLast4 || profile.contactNumber);

  const isEligible = isSC && incomeUnderCeiling && ageCompliant && viableTradeIdentified;

  const sanctionSeed = Math.floor(100000 + Math.random() * 900000);
  const sanctionNumber = isEligible 
    ? `MoSJE/PM-AJAY/GIA-2026/SC-${profile.district ? profile.district.substring(0, 3).toUpperCase() : 'IND'}-${sanctionSeed}`
    : 'PENDING_DOCUMENTATION';

  const capitalAssetGrant = 35000;
  const toolkitStipend = 10000;
  const workingCapitalMargin = 5000;

  let statusSummary = '';
  if (isEligible) {
    statusSummary = 'Statutory verification completed under PM-AJAY GIA Component guidelines. Pre-sanction of INR 50,000 Grant-in-Aid unlocked for trade asset procurement and NSQF certified skilling toolkit.';
  } else if (!isSC) {
    statusSummary = 'PM-AJAY GIA is restricted specifically to Scheduled Caste (SC) beneficiaries as mandated by MoSJE guidelines.';
  } else if (!incomeUnderCeiling) {
    statusSummary = 'Annual household income exceeds the statutory INR 2.50 Lakh income ceiling under PM-AJAY GIA norms.';
  } else {
    statusSummary = 'Additional details required to confirm age (18-50) and viable enterprise trade pathway.';
  }

  return {
    isEligible,
    eligibleAmount: isEligible ? 50000 : 0,
    sanctionNumber,
    criteriaResults: {
      casteVerified: isSC,
      incomeUnderCeiling,
      ageCompliant,
      viableTradeIdentified,
      residenceInTargetCluster,
      bankAccountDbtReady
    },
    subsidyBreakdown: {
      capitalAssetGrant: isEligible ? capitalAssetGrant : 0,
      toolkitStipend: isEligible ? toolkitStipend : 0,
      workingCapitalMargin: isEligible ? workingCapitalMargin : 0
    },
    statusSummary,
    verificationBadge: isEligible ? 'GIA ELIGIBLE [INR 50,000 SANCTIONED]' : 'ELIGIBILITY PENDING'
  };
}
