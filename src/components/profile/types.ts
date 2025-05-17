
// Define the database table names as a type
export type TableName = 'work_experience' | 'education' | 'projects' | 'certificates';

export interface ProfileData {
  name: string;
  job_title: string | null;
  company: string | null;
  bio: string | null;
  linkedin_url: string | null;
  profile_image: string | null;
  experience: string | null;
  industry: string | null;
  skills: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  location: string | null;
  description: string | null;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
}

export interface Certificate {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
}
