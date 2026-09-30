import { BeneficiaryProfile, NSQFCourse } from '../types/pmajay';
import { NSQF_COURSES } from '../data/nsqfCourses';

export function matchNSQFCoursesWithRAG(
  profile: BeneficiaryProfile,
  allCourses: NSQFCourse[] = NSQF_COURSES
): NSQFCourse[] {
  const scored = allCourses.map(course => {
    let score = 50; // base prior probability
    const reasons: string[] = [];

    const interests = (profile.vocationalInterests || []).map(i => i.toLowerCase());
    const trad = (profile.traditionalOccupation || '').toLowerCase();
    const curr = (profile.currentActivity || '').toLowerCase();
    const mobility = profile.mobilityRadius;
    const pref = profile.employmentPreference;
    const edu = (profile.educationLevel || '').toLowerCase();

    // 1. Traditional occupation semantic alignment
    if (trad.includes('leather') || trad.includes('shoe') || trad.includes('चमड़ा') || trad.includes('पादत्राणे')) {
      if (course.sector.includes('Leather')) {
        score += 35;
        reasons.push('Direct ancestral domain alignment: Upgrades hereditary leathercraft with modern mechanized design and zero middleman margins.');
      }
    } else if (trad.includes('weaver') || trad.includes('handloom') || trad.includes('बुनकर') || trad.includes('विणकाम') || trad.includes('நெசவு')) {
      if (course.sector.includes('Handicrafts') || course.sector.includes('Apparel')) {
        score += 32;
        reasons.push('Generational craft alignment: High synergy with handloom weaving heritage and cluster export subsidies.');
      }
    } else if (trad.includes('carpentry') || trad.includes('wood') || trad.includes('बढ़ई') || trad.includes('सुतार')) {
      if (course.sector.includes('Furniture') || course.id.includes('carpentry')) {
        score += 32;
        reasons.push('Hereditary woodcraft synergy: Upgrades traditional carving to precision modular interior fittings.');
      }
    } else if (trad.includes('farm') || trad.includes('labor') || trad.includes('agriculture') || trad.includes('कृषि') || trad.includes('शेती')) {
      if (course.sector.includes('Agriculture') || course.sector.includes('Green Jobs')) {
        score += 26;
        reasons.push('Rural agrarian synergy: Transforms manual land labor into high-value organic bio-inputs and solar pump operations.');
      }
    }

    // 2. Current vocational activity and interests
    interests.forEach(interest => {
      if (
        course.title.toLowerCase().includes(interest) ||
        course.sector.toLowerCase().includes(interest) ||
        course.careerPathway.toLowerCase().includes(interest)
      ) {
        score += 24;
        reasons.push(`Direct interest match: Candidate specifically stated ambition in ${interest}.`);
      }
    });

    if (curr.includes('electric') || curr.includes('बिजली') || curr.includes('वायरिंग')) {
      if (course.sector.includes('Electronics') || course.sector.includes('Green Jobs')) {
        score += 28;
        reasons.push('Prior on-ground familiarity: Experience with wiring and electrical tools shortens training learning curve.');
      }
    }

    if (curr.includes('motor') || curr.includes('bike') || curr.includes('गाड़ी') || curr.includes('मैकेनिक')) {
      if (course.sector.includes('Automotive')) {
        score += 28;
        reasons.push('Field mechanical aptitude: Prior 2-wheeler servicing exposure qualifies candidate for EV upgrade modules.');
      }
    }

    // 3. Mobility constraints screening
    if (mobility === 'Within Village') {
      if (course.id.includes('apparel') || course.id.includes('agri') || course.id.includes('electric')) {
        score += 15;
        reasons.push('100% Village-level viability: Can be operated as doorstep service or home-based workshop without inter-district commute.');
      } else if (course.id.includes('drone') || course.id.includes('auto')) {
        score -= 10;
      }
    } else if (mobility === 'Within Block (< 15km)') {
      if (course.id.includes('auto') || course.id.includes('electric') || course.id.includes('solar') || course.id.includes('mobile')) {
        score += 12;
        reasons.push('Optimal block-level coverage: High service catchment across village weekly haats and block headquarters.');
      }
    }

    // 4. Employment mode preference
    if (pref === 'Self-Employment / Micro-Enterprise') {
      if (course.suitabilityType === 'Self-Employment Ideal' || course.suitabilityType === 'Traditional Skill Modernization') {
        score += 18;
        reasons.push('Enterprise incubation ready: Directly eligible for ₹50,000 GIA capital equipment subsidy.');
      }
    }

    // 5. Education matching
    if (edu.includes('10th') || edu.includes('12th') || edu.includes('intermediate') || edu.includes('matric')) {
      if (course.nsqfLevel >= 4) {
        score += 10;
        reasons.push('Education eligibility verified for NSQF Level 4 technical certification.');
      }
    } else if (edu.includes('5th') || edu.includes('primary') || edu.includes('literate')) {
      if (course.minEducation.includes('5th') || course.minEducation.includes('Primary') || course.minEducation.includes('Literate')) {
        score += 12;
        reasons.push('Low-literacy friendly curriculum: Heavy practical hands-on pedagogy with no complex text examinations.');
      }
    }

    // Cap score at 98%
    const finalScore = Math.min(98, Math.max(45, score));

    if (reasons.length === 0) {
      reasons.push('General alignment with PM-AJAY GIA priority sector livelihood promotion pathways.');
    }

    return {
      ...course,
      matchScore: finalScore,
      matchReasons: reasons
    };
  });

  // Sort descending by matchScore
  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
