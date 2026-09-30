import React from 'react';
import { NSQFCourse, SupportedLanguage } from '../types/pmajay';
import { TranslationStrings } from '../data/translations';

interface NSQFRecommendationsProps {
  courses: NSQFCourse[];
  selectedLanguage: SupportedLanguage;
  onSelectCourse: (course: NSQFCourse) => void;
  selectedCourseId?: string;
  t: TranslationStrings;
}

export const NSQFRecommendations: React.FC<NSQFRecommendationsProps> = ({
  courses,
  selectedLanguage,
  onSelectCourse,
  selectedCourseId,
  t,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      {/* Top Banner */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-gray-900">
            {t.nsqfTitle}
          </h3>
          <p className="text-[11px] text-gray-500">
            {t.nsqfSubtitle}
          </p>
        </div>
        <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-sm">
          {courses.length}
        </span>
      </div>

      {/* Courses List */}
      <div className="p-4 space-y-3">
        {courses.map((course) => {
          const isSelected = selectedCourseId === course.id;
          const regionalTitle = course.titleRegional[selectedLanguage] || course.title;

          return (
            <div
              key={course.id}
              className={`border p-3.5 rounded-sm transition-all ${
                isSelected
                  ? 'border-gray-900 bg-gray-50/50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-sm font-medium">
                      NSQF Level {course.nsqfLevel}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      QP: {course.qpCode}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      • {course.suitabilityType}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-gray-900 mt-1">
                    {course.title}
                  </h4>
                  {regionalTitle !== course.title && (
                    <div className="text-xs text-gray-600">
                      {regionalTitle}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-gray-400">Match Fit:</div>
                  <div className="text-base font-bold text-gray-900">
                    {course.matchScore}%
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 text-xs border-b border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 block">Sector Council:</span>
                  <span className="text-gray-700 truncate block">{course.sector}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Duration & Prerequisite:</span>
                  <span className="text-gray-700">{course.durationHours} hrs • {course.minEducation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Est. Monthly Earnings:</span>
                  <span className="font-semibold text-emerald-700">{course.avgMonthlyEarnings}</span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="text-[10px] text-gray-500">
                  {course.trainingCenters[0]?.name} ({course.trainingCenters[0]?.distanceKm} km away)
                </div>

                <button
                  onClick={() => onSelectCourse(course)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm cursor-pointer border transition-colors ${
                    isSelected
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300'
                  }`}
                >
                  {isSelected ? t.selectedCourse : t.selectCourse}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
