import React from "react";

const VISUAL_TEST_RULES = [
  { key: "rule189_3i", label: "Registration Plate (Rule 189 (3)(i))" },
  { key: "rule189_7_Visual", label: "Reflectors (Rule 189 (7))" },
  { key: "rule189_8a", label: "Headlamp Beam Height (Rule 189 (8)(a))" },
  { key: "rule189_8b", label: "Headlamp Alignment (Rule 189 (8)(b))" },
  { key: "rule189_9a", label: "Brake Lights Working (Rule 189 (9)(a))" },
  { key: "rule189_9b", label: "Indicator Lights Working (Rule 189 (9)(b))" },
  { key: "rule189_10", label: "Horn (Rule 189 (10))" },
  { key: "rule189_11a", label: "Rear View Mirror (Rule 189 (11)(a))" },
  { key: "rule189_11b", label: "Windshield (Rule 189 (11)(b))" },
  { key: "rule189_11c", label: "Wipers (Rule 189 (11)(c))" },
  { key: "rule189_11d", label: "Driver Seat Belt (Rule 189 (11)(d))" },
  { key: "rule189_11e", label: "Passenger Seat Belt (Rule 189 (11)(e))" },
  { key: "rule189_12a", label: "Tyres Tread Depth (Rule 189 (12)(a))" },
  { key: "rule189_12b", label: "Tyres Condition (Rule 189 (12)(b))" },
  { key: "rule189_12a_Visual", label: "Tyres Tread Visual Check (Rule 189 (12)(a))" },
  { key: "rule189_12b_Visual", label: "Tyres Sidewall Visual Check (Rule 189 (12)(b))" },
  { key: "rule189_13", label: "Vehicle Paint & Body (Rule 189 (13))" },
  { key: "rule189_14", label: "Exhaust Leakage (Rule 189 (14))" },
  { key: "rule189_15", label: "Chassis Visual Check (Rule 189 (15))" },
  { key: "rule189_16_Visual", label: "Cabin Structural Condition (Rule 189 (16))" },
  { key: "rule189_17a", label: "Underbody Rust/Crack (Rule 189 (17)(a))" },
  { key: "rule189_17b", label: "Leakage Signs (Rule 189 (17)(b))" },
  { key: "rule189_19", label: "Steering Play (Rule 189 (19))" },
  { key: "rule189_20", label: "Suspension Play (Rule 189 (20))" },
  { key: "rule189_22", label: "Speedometer Fitment (Rule 189 (22))" },
  { key: "rule189_23", label: "Odometer Condition (Rule 189 (23))" },
  { key: "rule189_24", label: "Fuel System Leakage (Rule 189 (24))" },
  { key: "rule189_25", label: "Battery Mounting (Rule 189 (25))" },
  { key: "rule189_26", label: "Fan Belt Condition (Rule 189 (26))" },
  { key: "rule189_27", label: "Cooling System (Rule 189 (27))" },
  { key: "rule189_27_Visual", label: "Cooling Visual Check (Rule 189 (27))" },
  { key: "rule189_28", label: "Brake Fluid Level (Rule 189 (28))" },
  { key: "rule189_29", label: "Clutch Operation (Rule 189 (29))" },
  { key: "rule189_30", label: "Accelerator Operation (Rule 189 (30))" },
  { key: "rule189_31_Visual", label: "Drive Shaft/Chain Condition (Rule 189 (31))" },
  { key: "rule189_32", label: "Dashboard Indicators (Rule 189 (32))" },
  { key: "rule189_33", label: "Driver View (Rule 189 (33))" },
  { key: "rule189_34", label: "Vehicle Height/Width (Rule 189 (34))" },
  { key: "rule189_34_Visual", label: "Height/Width Marking (Rule 189 (34))" },
  { key: "rule189_35a", label: "Windshield Washer Working (Rule 189 (35)(a))" },
  { key: "rule189_35b", label: "Windshield Cleaning Jet (Rule 189 (35)(b))" },
  { key: "rule189_35c", label: "Washer Reservoir Full (Rule 189 (35)(c))" },
  { key: "rule189_35d", label: "Washer Switch Working (Rule 189 (35)(d))" },
  { key: "rule189_36", label: "Driver Door Working (Rule 189 (36))" },
  { key: "rule189_37_Visual", label: "Side Steps/Handles (Rule 189 (37))" },
  { key: "rule189_38", label: "Mud Flaps (Rule 189 (38))" },
  { key: "rule189_39", label: "Rear Under-run Protection (Rule 189 (39))" },
];

const VisualTestForm = ({ 
  visualRules, 
  onRuleChange, 
  onSubmit, 
  onCancel, 
  onClearForm,
  submitting 
}) => {
  const hasRules = Object.keys(visualRules).length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Visual Test Results</h3>
        <button
          onClick={onClearForm}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear Form
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VISUAL_TEST_RULES.map((rule) => (
          <div key={rule.key} className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              {rule.label}
            </label>
            <select
              value={visualRules[rule.key] || ""}
              onChange={(e) => onRuleChange(rule.key, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Result</option>
              <option value="P">✅ Pass</option>
              <option value="F">❌ Fail</option>
              <option value="NA">➖ Not Applicable</option>
            </select>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={onSubmit}
          disabled={submitting || !hasRules}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
              Submitting...
            </>
          ) : (
            "Submit Visual Test"
          )}
        </button>
        
        <button
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VisualTestForm;
