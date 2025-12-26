export enum AcademicLevel {
  Class10 = "Class 10",
  Class12 = "Class 12",
  Diploma = "Diploma",
  Undergraduate = "Undergraduate (Early)"
}

export enum LearningStyle {
  Theoretical = "Theoretical / Academic",
  Practical = "Practical / Hands-on",
  Mixed = "Mixed"
}

export interface StudentProfile {
  name: string;
  level: AcademicLevel;
  stream?: string; // e.g., Science, Commerce, Arts (only relevant for Class 12+)
  interests: string;
  strengths: string;
  limitations: string;
  academicResults: string; // Free text
  academicResultImage?: string; // Base64 string for image upload
  
  // New Fields
  budgetRange: string;
  location: string;
  collegeType: string;
  
  learningStyle: LearningStyle;
}

export interface GeminiError {
  message: string;
}
