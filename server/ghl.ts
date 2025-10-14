/**
 * GoHighLevel (GHL) Integration Service
 * 
 * One-way sync: Updates existing GHL contacts with user assessment data
 * - Immediate sync: Triggered on assessment updates
 * - Daily batch: Syncs new assessment data for all users
 */

const GHL_API_BASE_URL = "https://rest.gohighlevel.com/v1";
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.warn("GHL_API_KEY or GHL_LOCATION_ID not configured - GHL sync disabled");
}

interface GHLContact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  customFields?: Record<string, any>;
}

interface AssessmentSummary {
  intakeCompleted: boolean;
  beliefMapCompleted: boolean;
  triangleShiftCompleted: boolean;
  sixFearsCompleted: boolean;
  feelsDialCompleted: boolean;
  hillOverlayCompleted: boolean;
  daily10Count: number;
  lastAssessmentDate: string;
  totalAssessments: number;
}

/**
 * Search for contact by email in GHL
 */
export async function findContactByEmail(email: string): Promise<GHLContact | null> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    return null;
  }

  try {
    const response = await fetch(
      `${GHL_API_BASE_URL}/contacts/?locationId=${GHL_LOCATION_ID}&email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${GHL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`GHL API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    if (data.contacts && data.contacts.length > 0) {
      return data.contacts[0];
    }

    return null;
  } catch (error) {
    console.error("Error finding GHL contact:", error);
    return null;
  }
}

/**
 * Update GHL contact with assessment data
 */
export async function updateContactAssessmentData(
  contactId: string,
  assessmentSummary: AssessmentSummary
): Promise<boolean> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    return false;
  }

  try {
    const customFields = {
      assessment_intake_completed: assessmentSummary.intakeCompleted ? "Yes" : "No",
      assessment_belief_map_completed: assessmentSummary.beliefMapCompleted ? "Yes" : "No",
      assessment_triangle_shift_completed: assessmentSummary.triangleShiftCompleted ? "Yes" : "No",
      assessment_six_fears_completed: assessmentSummary.sixFearsCompleted ? "Yes" : "No",
      assessment_feelings_dial_completed: assessmentSummary.feelsDialCompleted ? "Yes" : "No",
      assessment_hill_overlay_completed: assessmentSummary.hillOverlayCompleted ? "Yes" : "No",
      assessment_daily_10_count: assessmentSummary.daily10Count.toString(),
      assessment_last_date: assessmentSummary.lastAssessmentDate,
      assessment_total_count: assessmentSummary.totalAssessments.toString(),
    };

    const response = await fetch(
      `${GHL_API_BASE_URL}/contacts/${contactId}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${GHL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customFields }),
      }
    );

    if (!response.ok) {
      console.error(`GHL update error: ${response.status} ${response.statusText}`);
      return false;
    }

    console.log(`Successfully synced assessment data to GHL contact ${contactId}`);
    return true;
  } catch (error) {
    console.error("Error updating GHL contact:", error);
    return false;
  }
}

/**
 * Generate assessment summary from user assessment data
 */
export function generateAssessmentSummary(assessment: any): AssessmentSummary {
  const daily10Entries = Array.isArray(assessment.daily_10) ? assessment.daily_10 : [];
  
  return {
    intakeCompleted: !!assessment.intake,
    beliefMapCompleted: !!assessment.belief_map,
    triangleShiftCompleted: !!assessment.triangle_shift,
    sixFearsCompleted: !!assessment.six_fears,
    feelsDialCompleted: !!assessment.feelings_dial,
    hillOverlayCompleted: !!assessment.hill_overlay,
    daily10Count: daily10Entries.length,
    lastAssessmentDate: assessment.updatedAt || new Date().toISOString(),
    totalAssessments: 1, // Each user has one main assessment record
  };
}

/**
 * Sync user assessment data to GHL
 * Main function to sync a single user's assessment data
 */
export async function syncUserAssessmentToGHL(
  userEmail: string,
  assessmentData: any
): Promise<boolean> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.log("GHL sync skipped - API credentials not configured");
    return false;
  }

  try {
    // Find contact by email
    const contact = await findContactByEmail(userEmail);
    
    if (!contact) {
      console.log(`No GHL contact found for email: ${userEmail}`);
      return false;
    }

    // Generate assessment summary
    const summary = generateAssessmentSummary(assessmentData);

    // Update contact with assessment data
    const success = await updateContactAssessmentData(contact.id, summary);
    
    return success;
  } catch (error) {
    console.error("Error syncing to GHL:", error);
    return false;
  }
}

/**
 * Batch sync all users with recent assessment updates
 * Used for daily batch sync
 */
export async function batchSyncRecentAssessments(
  users: Array<{ email: string; assessment: any }>
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const user of users) {
    const synced = await syncUserAssessmentToGHL(user.email, user.assessment);
    if (synced) {
      success++;
    } else {
      failed++;
    }
    
    // Rate limiting: wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`GHL batch sync completed: ${success} successful, ${failed} failed`);
  
  return { success, failed };
}
