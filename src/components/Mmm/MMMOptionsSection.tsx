'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMMMStore } from '@/store/useMMMStore';
import { ChevronDown } from 'lucide-react';
import { renderCheckboxDropdown } from '@/utils/checkboxProvider';
import { controlStatic } from '@/utils/const';
import { updateStoreField } from '@/utils/updateStoreField';
import { runMMMModal } from '@/utils/runModal';
import EdaGraph from './EdaGraph';
import useUserSession from '../hooks/useUserSession';
import { generateUniqueId } from '@/utils/helper';

interface MMMOptionsSectionProps {
  handleBack: () => void;
}

const MMMOptionsSection: React.FC<MMMOptionsSectionProps> = ({ handleBack }) => {
  const { selectedCampaigns, roiMean, roiSigma, setRoiMean, setRoiSigma, selectedCountry, ga4Linked,
    selectedTime, setSelectedTime,
    selectedKpi, setSelectedKpi,
    selectedMediaSpend, setSelectedMediaSpend,
    selectedMedia, setSelectedMedia,
    selectedControl, setSelectedControl,
    uniqueId, hasSubmitted, setHasSubmitted,
    isSubmittingModal, setIsSubmittingModal, selectedCustomer, kpi, ga4uniqueId, mmmJobId, platform
  } = useMMMStore();

  type SelectableFields = 'mediaSpend' | 'media' | 'control';
  type SelectedOptions = Record<SelectableFields, string[]>;

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    mediaSpend: selectedMediaSpend ?? [],
    media: selectedMedia ?? [],
    control: selectedControl ?? [],
  });

  const [openDropdown, setOpenDropdown] = useState<null | string>(null);
  const [html, setHtml] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [showBanner, setShowBanner] = useState(false);

  const { user, setUser } = useUserSession();

  const toggleDropdown = (field: string) => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

  const handleMultiSelect = (field: SelectableFields, option: string) => {
    setSelectedOptions((prev) => {
      const current = prev[field];
      const isSelected = current.includes(option);
      const updated = isSelected
        ? current.filter((item) => item !== option)
        : [...current, option];

      updateStoreField(field, updated, setSelectedMediaSpend, setSelectedMedia, setSelectedControl);
      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  const handleSelectAll = (field: SelectableFields, options: string[]) => {
    const updated = selectedOptions[field].length === options.length ? [] : options;

    updateStoreField(field, updated, setSelectedMediaSpend, setSelectedMedia, setSelectedControl);

    setSelectedOptions((prev) => ({
      ...prev,
      [field]: updated,
    }));
  };

  const metricOptions = selectedCampaigns?.flatMap((camp) => [
    `${camp}_Spend`,
    `${camp}_Impressions`,
    `${camp}_Clicks`,
    `${camp}_Engagement_Rate`,
  ]);

  const controlDynamic = metricOptions?.filter((m) =>
    m?.endsWith('_Engagement_Rate')
  );
  const controlOptions = [...controlStatic, ...controlDynamic];

  const mediaSpendOptions = metricOptions?.filter((m) => m?.endsWith('_Spend'));

  const mediaSpendBases = selectedOptions?.mediaSpend?.map((m) =>
    m?.replace(/_Spend$/, '')
  );

  const mediaOptions = metricOptions?.filter((metric) => {
    const isMediaMetric = metric?.endsWith('_Clicks') || metric?.endsWith('_Impressions');
    const baseName = metric?.replace(/_(Clicks|Impressions)$/, '');
    return isMediaMetric && mediaSpendBases?.includes(baseName);
  });

  const handleSubmit = async () => {
    if (isSubmittingModal) return;

    if (selectedMediaSpend.length < 2) {
      alert('Please select at least 2 Media Spend options.');
      return;
    }
    if (selectedMedia.length < 2) {
      alert('Please select at least 2 Media options.');
      return;
    }
    if (selectedControl.length < 1) {
      alert("Please select at least 1 Control option.");
      return;
    }

    const MmmModalData = {
      country: selectedCountry,
      ga4_linked: ga4Linked,
      date: selectedTime,
      kpi: kpi,
      kpi_type: kpi == "Clicks" ? 'non_revenue' : 'revenue',
      media_spend: selectedMediaSpend,
      media: selectedMedia,
      controls: selectedControl,
      mean: roiMean,
      sigma: roiSigma,
      unique_ada_id: uniqueId,
      // unique_ada_id: '123rtyihgfg',
      email: user?.email,
      jobId: mmmJobId,
      // jobId: '123',
      connector_type: platform === 'google-ads' ? 'googleAds' : 'dv360',
      unique_ga4_id: ga4uniqueId ? ga4uniqueId : 'None',
      selected_campaigns: selectedCampaigns
    };

    setShowBanner(true);
    setProgress(0);
    setIsSubmittingModal(true);
    setHasSubmitted(true);
    document.getElementById('eda-graph-section')?.scrollIntoView({ behavior: 'smooth' });

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 10 + 5);
      });
    }, 1000);

    try {
      const result = await runMMMModal(MmmModalData);
      setHtml(result);
      setProgress(100);
    } catch (err) {
      alert('Failed to run modal');
    } finally {
      clearInterval(progressInterval);
      setIsSubmittingModal(false);
      setShowBanner(false);
    }
  };

  // dropdown renderer
  const renderEnhancedDropdown = (
    label: string,
    field: SelectableFields,
    options: string[],
    disabled = false,
    requirementText?: string
  ) => (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-gray-700 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
          {field === 'mediaSpend' ? '💰' : field === 'media' ? '📊' : '🎛️'}
        </span>
        {label}
        {selectedOptions[field].length > 0 && (
          <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
            {selectedOptions[field].length} selected
          </span>
        )}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && toggleDropdown(field)}
          disabled={disabled}
          className={`w-full border-2 rounded-xl px-4 py-3 text-left text-lg flex justify-between items-center transition-all duration-200 ${disabled
            ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
            : "border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
            }`}
        >
          <span className={selectedOptions[field].length > 0 ? "text-gray-900 font-medium" : "text-gray-500"}>
            {selectedOptions[field].length > 0
              ? `${selectedOptions[field].length} option${selectedOptions[field].length !== 1 ? 's' : ''} selected`
              : "Select options..."}
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${openDropdown === field ? 'transform rotate-180' : ''
            } ${disabled ? 'text-gray-300' : 'text-gray-500'}`} />
        </button>

        {openDropdown === field && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto w-full"
          >
            <div className="p-4 border-b border-gray-100">
              <button
                type="button"
                onClick={() => handleSelectAll(field, options)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {selectedOptions[field].length === options.length ? "Clear All" : "Select All"}
              </button>
            </div>
            <div className="p-2 space-y-1">
              {options?.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions[field].includes(opt)}
                    onChange={() => handleMultiSelect(field, opt)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {requirementText && (
        <p className="text-sm text-amber-600 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {requirementText}
        </p>
      )}
    </div>
  );

  // Get validation status
  const getValidationStatus = () => {
    const errors = [];
    if (selectedMediaSpend.length < 2) errors.push("Select at least 2 Media Spend options");
    if (selectedMedia.length < 2) errors.push("Select at least 2 Media options");
    if (selectedControl.length < 1) errors.push("Select at least 1 Control option");
    return { isValid: errors.length === 0, errors };
  };

  const validation = getValidationStatus();

  return (
    <div className="">
      {/* Progress Banner */}
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 shadow-xl rounded-xl border border-blue-500 max-w-lg w-full mx-4"
        >
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            <div className="flex-1">
              <p className="font-semibold text-lg">MMM Model Running</p>
              <p className="text-blue-100 text-sm">This may take 5–7 minutes. Please don't close the page.</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[600px] lg:max-w-[105%] mx-auto shadow-2xl rounded-2xl p-8 bg-gradient-to-br from-white to-blue-50 border border-gray-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              🎯 MMM Configuration
            </h2>
            <p className="text-gray-600">
              Configure your Marketing Mix Modeling parameters
            </p>
          </div>
          <button
            onClick={handleBack}
            disabled={isSubmittingModal}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium border ${isSubmittingModal
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50"
              }`}
          >
            ← Back to Campaigns
          </button>
        </div>

        <div className="space-y-8">
          {/* Configuration Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="text-sm font-medium opacity-90">Selected Campaigns</div>
              <div className="text-2xl font-bold">{selectedCampaigns?.length || 0}</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="text-sm font-medium opacity-90">Target Country</div>
              <div className="text-2xl font-bold">{selectedCountry}</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="text-sm font-medium opacity-90">GA4 Linked</div>
              <div className="text-2xl font-bold">{ga4Linked ? '✅ Yes' : '❌ No'}</div>
            </div>
          </div>

          {/* Fixed Configuration Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                🔒
              </span>
              Fixed Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Time Dimension
                </label>
                <div className="relative">
                  <select
                    disabled
                    value="Date"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  >
                    <option value="Date">📅 Date (Daily Analysis)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Key Performance Indicator
                </label>
                <div className="relative">
                  <select
                    disabled
                    value={kpi}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  >
                    <option value={kpi}>📊 {kpi}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Variable Configuration Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                ⚙️
              </span>
              Variable Configuration
            </h3>

            {/* Media Spend Dropdown */}
            {renderEnhancedDropdown(
              "Media Spend Variables",
              "mediaSpend",
              mediaSpendOptions
            )}

            {/* Media Dropdown */}
            {renderEnhancedDropdown(
              "Media Variables",
              "media",
              mediaOptions,
              selectedOptions?.mediaSpend.length < 2,
              selectedOptions?.mediaSpend.length < 2 ? "Please select at least 2 Media Spend options to enable Media selection." : undefined
            )}

            {/* Control Dropdown */}
            {renderEnhancedDropdown(
              "Control Variables",
              "control",
              controlOptions
            )}
          </div>

          {/* ROI Configuration Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                📈
              </span>
              ROI Parameters
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ROI Mean */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-semibold text-gray-700">
                    ROI Mean
                  </label>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-lg font-bold">
                    {roiMean.toFixed(2)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={roiMean}
                    onChange={(e) => setRoiMean(parseFloat(e.target.value))}
                    className="w-full h-3 bg-purple-200 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${roiMean * 100}%, #e5d3ff ${roiMean * 100}%, #e5d3ff 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
                      <span key={val} className="text-center">
                        {val.toFixed(1)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ROI Sigma */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-semibold text-gray-700">
                    ROI Sigma
                  </label>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-lg font-bold">
                    {roiSigma.toFixed(2)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={roiSigma}
                    onChange={(e) => setRoiSigma(parseFloat(e.target.value))}
                    className="w-full h-3 bg-blue-200 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${roiSigma * 100}%, #dbeafe ${roiSigma * 100}%, #dbeafe 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
                      <span key={val} className="text-center">
                        {val.toFixed(1)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Validation Summary */}
          {!validation.isValid && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Configuration Incomplete</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    {validation.errors.map((error, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          {isSubmittingModal ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>MMM Model Progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                >
                  {progress < 100 ? `${progress}%` : "Finalizing..."}
                </motion.div>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: validation.isValid ? 1.02 : 1 }}
              whileTap={{ scale: validation.isValid ? 0.98 : 1 }}
              onClick={handleSubmit}
              disabled={!validation.isValid}
              className={`w-full py-4 text-xl font-bold rounded-xl transition-all duration-300 ${validation.isValid
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {validation.isValid ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  🚀 Run MMM Model
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Complete Configuration Required
                </div>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Results Section */}
      {html && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-lg:max-w-[600px] lg:w-[105%] mx-auto mt-8 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              MMM Model Results
            </h3>
            <p className="text-green-100 mt-1">Your Marketing Mix Modeling analysis is complete</p>
          </div>
          <iframe
            srcDoc={html}
            title="MMM Report"
            className="w-full h-[1000px] border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </motion.div>
      )}

      {!html && hasSubmitted && <EdaGraph />}
    </div>
  );
};

export default MMMOptionsSection;