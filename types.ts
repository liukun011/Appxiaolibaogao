
export enum Screen {
  QUICK_LOGIN = 'QUICK_LOGIN',
  SMS_LOGIN = 'SMS_LOGIN',
  RESET_PASSWORD = 'RESET_PASSWORD',
  MAIN = 'MAIN'
}

export enum Tab {
  HOME = 'HOME',
  REPORTS = 'REPORTS',
  NEW_INTERVIEW = 'NEW_INTERVIEW',
  MANAGEMENT = 'MANAGEMENT',
  PROFILE = 'PROFILE'
}

export interface OrgMember {
  id: string;
  name: string;
  phone: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  avatar?: string;
  departmentId?: string;
}

export interface Department {
  id: string;
  name: string;
  parentId?: string;
}

export interface OrgSettings {
  allowMemberInvite: boolean;
  allowMemberViewReports: boolean;
  allowMemberDeleteReports: boolean;
}

export interface Organization {
  id: string;
  name: string;
  role: 'ADMIN' | 'MEMBER';
  logo?: string;
  members?: OrgMember[];
  departments?: Department[];
  settings?: OrgSettings;
}

export interface InvitedUser {
  id: string;
  name: string;
  avatar?: string;
  joinDate: string;
}

export interface User {
  phone: string;
  isLoggedIn: boolean;
  organizations: Organization[];
  activeOrgId: string;
  invitedUsers?: InvitedUser[];
}

export interface InterviewRecord {
  id: string;
  interviewName?: string;
  clientName: string;
  company: string;
  companyCode?: string;
  creatorName?: string;
  createdAt?: string;
  status: 'FOLLOWING' | 'SIGNED' | 'PENDING';
  time: string;
  summary: string;
  reportStatus?: 'GENERATED' | 'GENERATING' | 'NONE';
  archived?: boolean;
  orgId: string;
  templateId?: string;
  templateTitle?: string;
  uploadedAssets?: UploadedAsset[];
  companyInsightStatus?: 'IDLE' | 'FETCHING' | 'READY';
  questionChecklistStatus?: 'IDLE' | 'GENERATING' | 'READY';
  companyInsightItems?: InterviewInsightItem[];
  questionChecklistSections?: InterviewChecklistSection[];
}

export interface QuestionTemplate {
  id: string;
  title: string;
  count: number;
}

export type UploadedAssetKind = 'excel' | 'word' | 'audio' | 'image';

export interface UploadedAsset {
  id: string;
  name: string;
  kind: UploadedAssetKind;
}

export interface InterviewChecklistSection {
  id: string;
  title: string;
  source: string;
  summary: string;
  questions: InterviewChecklistQuestion[];
}

export interface InterviewChecklistQuestion {
  id: string;
  text: string;
  selected?: boolean;
}

export interface InterviewInsightItem {
  id: string;
  label: string;
  value: string;
  tone?: 'neutral' | 'attention' | 'positive';
}
