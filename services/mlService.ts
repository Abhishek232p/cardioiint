
import { RiskLevel } from "../types";

/**
 * MLPredictor: Mimics the logic of a trained Random Forest model in JavaScript.
 * This is based on standard thresholds for heart disease risk.
 */
export class MLPredictor {
  predict(data: { age: number; hr: number; sbp: number; dbp: number }): RiskLevel {
    const { age, hr, sbp, dbp } = data;
    let riskScore = 0;

    // Blood Pressure Weighting
    if (sbp >= 160 || dbp >= 100) riskScore += 3;
    else if (sbp >= 140 || dbp >= 90) riskScore += 2;
    else if (sbp >= 130 || dbp >= 85) riskScore += 1;

    // Heart Rate Weighting (Tachycardia / Bradycardia)
    if (hr > 120 || hr < 50) riskScore += 2;
    else if (hr > 100 || hr < 60) riskScore += 1;

    // Age Factor
    if (age > 65) riskScore += 1;
    if (age > 50 && (sbp > 130)) riskScore += 1;

    // Categorization (Matches backend 0, 1, 2)
    if (riskScore >= 4) return RiskLevel.HIGH;
    if (riskScore >= 2) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }
}

export const mlPredictor = new MLPredictor();
