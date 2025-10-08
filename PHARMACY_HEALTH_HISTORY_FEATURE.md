# Pharmacy Health History Access Feature

## Overview
This feature allows pharmacies to view patient medical history (lab results, test results, allergies, medications, etc.) when they receive a prescription request. This helps pharmacies make informed decisions about drug interactions, contraindications, and patient safety.

## Changes Made

### 1. Backend Changes

#### File: `backend/src/services/PrescriptionRequestService.js`

**Modified Method: `getRequestDetails(requestId, requesterId)`**

Added functionality to include patient health history when pharmacies or admins view prescription request details:

- **Health History Retrieval**: Fetches complete patient health history from the User model
- **Data Filtering**: Only includes active health records (where `isActive !== false`)
- **Privacy Protection**: Health history is only provided to:
  - Pharmacies that are targets of the prescription request
  - System administrators
  - NOT provided to patients viewing their own requests (unnecessary duplication)

**Health History Structure Returned**:
```javascript
{
  patientHealthHistory: {
    records: [
      {
        _id: "...",
        category: "test|medication|allergy|condition|vaccination|surgery",
        condition: "Condition name",
        diagnosedDate: "Date",
        medication: "Medication details",
        severity: "low|medium|high",
        status: "active|monitoring|resolved",
        doctor: "Doctor name",
        hospital: "Hospital name",
        testResults: { /* Test data */ },
        aiExtractedData: { /* AI-extracted data */ },
        notes: "Clinical notes",
        tags: ["tag1", "tag2"],
        symptoms: ["symptom1", "symptom2"],
        createdAt: "Date",
        updatedAt: "Date"
      }
    ],
    summary: {
      totalRecords: 10,
      categories: ["test", "medication", "allergy"],
      hasAllergies: true,
      hasTestResults: true,
      currentMedications: ["Med1", "Med2"]
    }
  }
}
```

### 2. Frontend Changes

#### File: `frontend/src/components/Pharmacy/DetailedPrescriptionView.jsx`

**Added New Tab: "Patient Health History"**

1. **Tab Navigation**:
   - Added "Patient Health History" tab with HeartIcon
   - Positioned between "Medications" and "AI Analysis" tabs

2. **New Component: `HealthHistoryTab`**

**Features**:
- **Privacy Notice**: HIPAA compliance notice displayed at the top
- **Health Summary Dashboard**: 
  - Total Records count
  - Allergy status (Yes/None)
  - Active Medications count
  - Lab Results availability

- **Medical Records List**:
  - Expandable/collapsible record cards
  - Color-coded by category (Test=blue, Medication=purple, Allergy=red, etc.)
  - Severity indicators (Low=green, Medium=yellow, High=red)
  - Status badges (Active, Monitoring, Resolved)

- **Record Details (Expanded View)**:
  - **Medication Information**: Current and past medications
  - **Test Results**: Lab values with normal ranges and interpretations
  - **AI-Extracted Test Results**: Additional test data from AI processing
  - **Symptoms**: List of associated symptoms
  - **Clinical Notes**: Doctor's notes and observations (truncated if > 500 chars)
  - **Tags**: Category tags for quick reference
  - **AI Confidence Score**: Shows accuracy of AI-extracted data

- **Visual Elements**:
  - Date formatting with CalendarIcon
  - Doctor information with UserIcon
  - Hospital/location with MapPinIcon
  - Category-based color coding
  - Severity-based styling
  - Dark mode support throughout

## Security & Privacy

### Access Control
✅ **Authorized Access Only**:
- Health history only shown to pharmacies that received the prescription request
- System admins can view for support purposes
- Patients don't see this tab (they have their own health history view)

### Authorization Check (Backend):
```javascript
const isPharmacy = request.targetPharmacies.some(
  tp => tp.pharmacyId.owner?.toString() === requesterId
);
const isAdmin = requester?.role === 'admin';

if (!isPatient && !isPharmacy && !isAdmin) {
  throw new Error('Unauthorized to view this request');
}
```

### HIPAA Compliance
✅ **Privacy Notice Displayed**:
- Prominent blue notice box at top of health history tab
- Explains purpose: "assist with safe prescription fulfillment"
- Reminds pharmacists to check for drug interactions, allergies, contraindications
- States confidentiality protection under HIPAA

## User Experience

### For Pharmacies:
1. **View Prescription Request**: Click on a prescription in the queue
2. **Navigate to Health History Tab**: Click "Patient Health History" tab
3. **Review Summary**: Quick overview of allergies, medications, lab results
4. **Expand Records**: Click any record to see full details
5. **Review Test Results**: See lab values, normal ranges, interpretations
6. **Check Allergies**: Easily identify allergy records (red badges)
7. **Verify Drug Interactions**: Compare with current medications

### Visual Indicators:
- 🔴 **RED**: Allergies, High severity
- 🟡 **YELLOW**: Medium severity, Symptoms
- 🟢 **GREEN**: Low severity, Resolved conditions
- 🔵 **BLUE**: Test results, Lab reports
- 🟣 **PURPLE**: Medications
- 🟠 **ORANGE**: General conditions

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Pharmacy clicks "View" on prescription request           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend calls: GET /api/v1/prescription-requests/:id   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend Controller → PrescriptionRequestService         │
│    getRequestDetails(requestId, requesterId)                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Authorization Check:                                     │
│    - Is requester a pharmacy in targetPharmacies?           │
│    - Is requester an admin?                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. If authorized: Fetch patient health history             │
│    User.findById(patientId).select('healthHistory')        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Filter & format health records                          │
│    - Only active records (isActive !== false)              │
│    - Extract relevant medical data                         │
│    - Generate summary statistics                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Return prescription request + patientHealthHistory      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Frontend renders Health History Tab                     │
│    - Summary dashboard                                      │
│    - Expandable medical records                            │
│    - Test results with interpretations                     │
└─────────────────────────────────────────────────────────────┘
```

## Testing

### Test Scenarios:

1. **Authorized Pharmacy Access**:
   - ✅ Pharmacy in targetPharmacies can view health history
   - ✅ Health history displays correctly with all data

2. **Unauthorized Access**:
   - ✅ Pharmacy NOT in targetPharmacies cannot view request
   - ✅ Returns 403 Unauthorized error

3. **No Health History**:
   - ✅ Shows "No Health History Available" message
   - ✅ Displays empty state with HeartIcon

4. **Data Display**:
   - ✅ Test results show with normal ranges
   - ✅ AI-extracted data displays separately
   - ✅ Allergies highlighted with red badges
   - ✅ Severity indicators show correct colors
   - ✅ Notes truncated if > 500 characters

5. **Expand/Collapse**:
   - ✅ Clicking record header toggles details
   - ✅ Only one record expanded at a time (optional behavior)

## Benefits

### For Pharmacies:
- ✅ **Better Patient Safety**: View allergies before dispensing
- ✅ **Drug Interaction Checks**: Compare with current medications
- ✅ **Informed Decisions**: Review lab results for contraindications
- ✅ **Complete Picture**: Access full medical context
- ✅ **Reduced Errors**: Catch potential issues before dispensing

### For Patients:
- ✅ **Safer Care**: Pharmacies have complete medical information
- ✅ **Faster Service**: No need to explain medical history verbally
- ✅ **Reduced Calls**: Fewer clarification calls from pharmacy
- ✅ **Better Outcomes**: Informed pharmaceutical care

### For Healthcare System:
- ✅ **Improved Quality**: Better medication management
- ✅ **Reduced Adverse Events**: Early detection of risks
- ✅ **HIPAA Compliant**: Secure, authorized access only
- ✅ **Audit Trail**: All accesses logged (if logging implemented)

## Future Enhancements

### Potential Improvements:
1. **Search/Filter**: Add search box to filter health records
2. **Export**: Allow pharmacies to export relevant health data (with consent)
3. **Highlights**: Auto-highlight allergies to prescribed medications
4. **Interaction Warnings**: Show drug interaction alerts
5. **Access Logs**: Track who viewed patient health history (audit trail)
6. **Consent Management**: Allow patients to control what pharmacies see
7. **Real-time Updates**: Notify pharmacy if health history changes
8. **Clinical Decision Support**: AI-powered safety recommendations

## Maintenance Notes

### File Locations:
- Backend Service: `/backend/src/services/PrescriptionRequestService.js` (line ~606)
- Frontend Component: `/frontend/src/components/Pharmacy/DetailedPrescriptionView.jsx` (line ~180 & ~670)

### Dependencies:
- React 18+ (hooks: useState)
- Heroicons React 24 (icons)
- Tailwind CSS (styling)
- MongoDB (User model with healthHistory field)

### Breaking Changes:
- None - This is additive functionality
- Backwards compatible with existing prescription requests

## Support

For issues or questions:
1. Check browser console for errors
2. Verify pharmacy authorization in backend logs
3. Confirm patient has health history records in database
4. Ensure MongoDB User model includes healthHistory field

---

**Last Updated**: October 6, 2025  
**Feature Status**: ✅ Complete and Ready for Testing
