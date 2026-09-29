export enum MembershipTier {
  ANNUAL = 'Annual',
  LIFE = 'Life Member',
  PATRON = 'Patron',
  STUDENT = 'Student Alumnus'
}

export enum MembershipStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  PENDING_RENEWAL = 'Pending Renewal',
  NOT_MEMBER = 'Non-Member'
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  batchYear: number;
  phone?: string;
  occupation?: string;
  location?: string;
  membershipStatus: MembershipStatus;
  membershipTier: MembershipTier;
  membershipExpiry?: string;
  rollNumber?: string;
  avatarUrl?: string;
  role?: 'admin' | 'user';
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderBatch: number;
  text: string;
  timestamp: string;
  avatarUrl?: string;
}

export interface RenewalSubmission {
  id: string;
  email: string;
  tier: MembershipTier;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  utrNumber?: string;
  receiptNumber?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  billingAddress: string;
  rejectionReason?: string;
}

export interface AlumniDirectoryEntry {
  id: string;
  name: string;
  batchYear: number;
  occupation: string;
  location: string;
  membershipTier: MembershipTier;
  avatarUrl?: string;
}

export interface AlumniEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'Reunion' | 'Meeting' | 'Seminar' | 'Social Work';
  rsvps: string[];
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
  tag: 'Cultural Events' | 'Sports & Athletics' | 'School Heritage' | 'Alumni Gathering';
  mediaType?: 'image' | 'video';
  uploadedBy: {
    name: string;
    email: string;
    batchYear: number;
  };
  uploadedAt: string;
}

export interface AlumniNotice {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Event' | 'Urgent' | 'Academic' | 'Donation';
  postedBy: {
    name: string;
    email: string;
    batchYear: number;
    avatarUrl?: string;
  };
  postedAt: string;
  isPinned?: boolean;
  isPublished?: boolean;
}

export interface Announcement {
  id: string;
  tag: string;
  title: string;
  desc: string;
  date: string;
  isHighlight?: boolean;
  isLive?: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  tier: MembershipTier;
  fee: number;
  durationYears: number; // 0 for Lifetime
  description: string;
  benefits: string[];
  isPopular?: boolean;
}

export interface CommitteeMember {
  id: string;
  committeeType: 'executive' | 'advisory';
  category: 'officer_leadership' | 'officer_portfolio' | 'executive_member' | 'co_opt_member' | 'advisory_member';
  roleTitle: string;
  name: string;
  batchYear?: string;
  description?: string;
  displayOrder?: number;
  specialTag?: string;
}
