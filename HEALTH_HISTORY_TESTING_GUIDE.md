# Testing Guide: Pharmacy Health History Access

## Quick Test Checklist

### Prerequisites
- ✅ Backend server running (`npm run dev` in backend folder)
- ✅ Frontend server running (`npm run dev` in frontend folder)
- ✅ MongoDB database connected
- ✅ At least one user with health history records
- ✅ At least one pharmacy account
- ✅ At least one prescription request sent to pharmacy

## Step-by-Step Testing

### 1. Setup Test Data

#### Create/Login as Pharmacy User:
```
1. Navigate to: http://localhost:3000/login
2. Use pharmacy credentials or register new pharmacy
3. Complete pharmacy verification if needed
```

#### Verify Patient Has Health History:
Check your MongoDB database for a user with `healthHistory` array:
```javascript
// MongoDB Query
db.users.findOne({ 
  role: "patient",
  "healthHistory.0": { $exists: true } 
})
```

#### Create Test Prescription Request:
```
1. Login as patient with health history
2. Navigate to: Upload Prescription
3. Upload a prescription image
4. Select test pharmacy as target
5. Submit prescription request
```

### 2. Test Pharmacy Access

#### Login as Pharmacy:
```
1. Navigate to: http://localhost:3000/pharmacy/prescription-queue
2. You should see the prescription request in the queue
```

#### View Prescription Details:
```
1. Click "View Details" on any prescription request
2. Prescription detail page should load
```

#### Access Health History Tab:
```
1. Look for tabs at top: Overview | Medications | Patient Health History | AI Analysis | Risk Assessment | Quality Metrics
2. Click "Patient Health History" tab
3. Tab should activate (blue underline appears)
```

### 3. Verify Display

#### Check Privacy Notice:
- ✅ Blue notice box appears at top
- ✅ Contains text about HIPAA compliance
- ✅ Explains purpose of health information

#### Check Summary Dashboard:
- ✅ "Total Records" card shows count
- ✅ "Allergies" card shows Yes/None
- ✅ "Active Medications" card shows count
- ✅ "Lab Results" card shows Available/None

#### Check Health Records List:
- ✅ Medical records display as cards
- ✅ Each record shows:
  - Category badge (blue for test, red for allergy, etc.)
  - Severity badge (if applicable)
  - Status badge
  - Condition name
  - Date, doctor, hospital info
  - Expand/collapse button (chevron icon)

### 4. Test Expand/Collapse

#### Expand a Record:
```
1. Click anywhere on a health record card
2. Card should expand showing full details
3. Chevron icon should change from right to down
```

#### Check Expanded Content:
For a TEST record, verify:
- ✅ Medication section (if present)
- ✅ Test Results section with:
  - Test name
  - Actual value + unit
  - Normal range
  - Interpretation text
- ✅ AI Extracted Test Results section (if present)
- ✅ Symptoms (if present)
- ✅ Clinical Notes (truncated if > 500 chars)
- ✅ Tags
- ✅ AI Confidence score

#### Collapse Record:
```
1. Click same record again
2. Details should hide
3. Chevron should change back to right
```

### 5. Test Category Colors

Verify color coding:
- 🔵 **Test Records**: Blue badge
- 🟣 **Medication Records**: Purple badge
- 🔴 **Allergy Records**: Red badge (IMPORTANT!)
- 🟠 **Condition Records**: Orange badge
- 🟢 **Vaccination Records**: Green badge
- 🔷 **Surgery Records**: Indigo badge

### 6. Test Severity Colors

Verify severity indicators:
- 🟢 **Low Severity**: Green background
- 🟡 **Medium Severity**: Yellow background
- 🔴 **High Severity**: Red background

### 7. Test Empty State

#### If No Health History:
```
1. Test with a patient who has no health history records
2. Create prescription request from that patient
3. View as pharmacy
4. Navigate to Health History tab
5. Verify empty state displays:
   - Heart icon
   - "No Health History Available" message
   - Gray text explanation
```

### 8. Test Dark Mode

#### Toggle Dark Mode:
```
1. Find dark mode toggle (usually top right)
2. Click to enable dark mode
3. Verify Health History tab:
   - Background changes to dark gray
   - Text changes to white/light gray
   - Cards have dark borders
   - Color badges adjust for dark mode
   - Privacy notice has dark blue background
```

### 9. Test Test Results Display

#### For records with test results:
```
1. Expand a TEST category record
2. Check Test Results section displays:
   - Test name formatted (underscores replaced with spaces)
   - Actual value with unit (right side, blue, bold)
   - Normal range line (gray text)
   - Interpretation paragraph
```

#### Example Expected Display:
```
WBC
6.2 10^9/L
Normal Range: 4-11 10^9/L
Within normal range. Indicates healthy immune function.

HDL Cholesterol
45 mg/dl
Normal Range: >50 mg/dl
Slightly low. HDL is 'good' cholesterol; levels below 50 mg/dl can increase the risk of heart disease.
```

### 10. Browser Console Tests

#### Open Developer Tools:
```
Press F12 or Right-click → Inspect
```

#### Check for Errors:
- ✅ No red errors in console
- ✅ API calls succeed (Network tab)
- ✅ No 403 Unauthorized errors
- ✅ No 404 Not Found errors

#### Expected Console Logs (Backend):
```
✅ Prescription request details received
✅ Patient health history attached
✅ Authorization check passed
```

## Common Issues & Solutions

### Issue 1: "No Health History Available" when data exists
**Cause**: Pharmacy not authorized to view request  
**Solution**: 
- Verify pharmacy is in `targetPharmacies` array
- Check `prescription.targetPharmacies` in browser console
- Ensure pharmacy user owns the pharmacy in targetPharmacies

### Issue 2: Tab not showing
**Cause**: Missing tab in tabs array  
**Solution**: 
- Check `DetailedPrescriptionView.jsx` line ~180
- Verify `health-history` tab is in tabs array
- Check imports include `HeartIcon`

### Issue 3: Test results not displaying
**Cause**: Incorrect data structure  
**Solution**: 
- Check `testResults` is object with test names as keys
- Verify each test has `actualValue`, `normalRange`, `unit`, `interpretation`
- Check `aiExtractedData.rawData.testResults` path exists

### Issue 4: 403 Forbidden error
**Cause**: Authorization failure  
**Solution**: 
- Ensure logged in as pharmacy user
- Verify pharmacy owns one of target pharmacies
- Check backend authorization logic

### Issue 5: Dark mode styling issues
**Cause**: Missing dark: classes  
**Solution**: 
- All elements should have `dark:` variants
- Check Tailwind CSS classes include dark mode
- Verify parent containers have dark mode classes

## API Testing (Postman/Insomnia)

### Get Prescription Request with Health History:
```http
GET /api/v1/prescription-requests/:requestId
Authorization: Bearer <pharmacy_jwt_token>
```

### Expected Response Structure:
```json
{
  "success": true,
  "data": {
    "prescriptionRequest": {
      "_id": "...",
      "requestNumber": "PRX-2024-001",
      "patient": { ... },
      "medications": [ ... ],
      "targetPharmacies": [ ... ],
      "patientHealthHistory": {
        "records": [
          {
            "_id": "...",
            "category": "test",
            "condition": "Dyslipidemia",
            "testResults": {
              "WBC": {
                "actualValue": "6.2",
                "normalRange": "4-11",
                "unit": "10^9/L",
                "interpretation": "..."
              }
            },
            "aiExtractedData": { ... }
          }
        ],
        "summary": {
          "totalRecords": 5,
          "hasAllergies": true,
          "hasTestResults": true,
          "currentMedications": ["Med1", "Med2"]
        }
      }
    }
  }
}
```

## Performance Testing

### Check Load Time:
```
1. Open Network tab in DevTools
2. Click Health History tab
3. Verify data loads within 1-2 seconds
4. Large health histories (10+ records) should still load fast
```

### Memory Check:
```
1. Open Performance Monitor (Chrome: More tools → Performance Monitor)
2. Navigate through health history records
3. Expand/collapse multiple records
4. Verify no memory leaks
5. Monitor JavaScript heap size (should stay stable)
```

## Acceptance Criteria

### ✅ Feature Complete When:
- [x] Pharmacy can view patient health history
- [x] Only authorized pharmacies can access
- [x] Privacy notice displays prominently
- [x] Summary dashboard shows key metrics
- [x] Records expand/collapse correctly
- [x] Test results display with formatting
- [x] AI-extracted data shows separately
- [x] Category and severity color coding works
- [x] Dark mode fully supported
- [x] Empty state handles no data gracefully
- [x] No console errors
- [x] Mobile responsive (bonus)

### ✅ Security Complete When:
- [x] Authorization checks prevent unauthorized access
- [x] Only active health records shown
- [x] HIPAA notice displayed
- [x] Sensitive data not logged to console
- [x] 403 error for unauthorized users

### ✅ UX Complete When:
- [x] Intuitive navigation to health history
- [x] Visual hierarchy clear
- [x] Important info (allergies) highlighted
- [x] Readable fonts and spacing
- [x] Responsive to different screen sizes
- [x] Loading states handled

## Sign-Off

### Tested By: _______________  
### Date: _______________  
### Status: [ ] Pass  [ ] Fail  
### Notes:
```
________________________________________________
________________________________________________
________________________________________________
```

---

## Next Steps After Testing

1. **If All Tests Pass**:
   - ✅ Mark feature as production-ready
   - ✅ Update release notes
   - ✅ Train pharmacy staff on new feature
   - ✅ Monitor usage analytics

2. **If Tests Fail**:
   - ❌ Document failed test cases
   - ❌ Create bug tickets
   - ❌ Fix issues
   - ❌ Re-test

3. **Future Enhancements** (after stable):
   - Add search/filter functionality
   - Implement drug interaction warnings
   - Add export functionality
   - Create access audit logs
