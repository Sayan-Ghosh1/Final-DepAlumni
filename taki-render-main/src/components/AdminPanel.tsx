import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FormattedText from './FormattedText';
import { 
  ShieldCheck, 
  Users, 
  Megaphone, 
  BellRing, 
  Image, 
  CreditCard, 
  FolderCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Clock, 
  Pin, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle, 
  Film, 
  DollarSign, 
  Check, 
  X, 
  RefreshCw,
  UserPlus,
  ShieldAlert,
  ArrowRight,
  Shield,
  Award,
  Code,
  Copy
} from 'lucide-react';
import { 
  UserProfile, 
  MembershipStatus, 
  MembershipTier, 
  AlumniNotice, 
  Announcement, 
  GalleryPhoto, 
  MembershipPlan, 
  RenewalSubmission, 
  AlumniDirectoryEntry,
  CommitteeMember
} from '../types';
import { parseMediaUrl } from '../utils/media';

interface AdminPanelProps {
  currentUser: UserProfile | null;
  onRefreshGlobalStats?: () => void;
  onNavigate?: (tab: string) => void;
}

export default function AdminPanel({ currentUser, onRefreshGlobalStats, onNavigate }: AdminPanelProps) {
  // Check RBAC
  const isAdmin = currentUser?.role === 'admin' || (currentUser?.email ? currentUser.email.toLowerCase().includes('admin') : false);

  const [activeSubTab, setActiveSubTab] = useState<'notices' | 'announcements' | 'gallery' | 'plans' | 'directory' | 'approvals' | 'executive'>('notices');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Admin Data Stores
  const [notices, setNotices] = useState<AlumniNotice[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [directory, setDirectory] = useState<UserProfile[]>([]);
  const [renewals, setRenewals] = useState<RenewalSubmission[]>([]);
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);

  // 6. Executive Board & Advisory Form State
  const [committeeModalOpen, setCommitteeModalOpen] = useState(false);
  const [sqlSchemaModalOpen, setSqlSchemaModalOpen] = useState(false);
  const [editingCommitteeId, setEditingCommitteeId] = useState<string | null>(null);
  const [commType, setCommType] = useState<'executive' | 'advisory'>('executive');
  const [commCategory, setCommCategory] = useState<'officer_leadership' | 'officer_portfolio' | 'executive_member' | 'co_opt_member' | 'advisory_member'>('officer_leadership');
  const [commRoleTitle, setCommRoleTitle] = useState('');
  const [commName, setCommName] = useState('');
  const [commBatchYear, setCommBatchYear] = useState('');
  const [commDescription, setCommDescription] = useState('');
  const [commSpecialTag, setCommSpecialTag] = useState('');
  const [commDisplayOrder, setCommDisplayOrder] = useState<number>(0);
  const [commSearchQuery, setCommSearchQuery] = useState('');
  const [commFilterType, setCommFilterType] = useState<'all' | 'executive' | 'advisory'>('all');


  // 1. Notice Board Form State
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'General' | 'Event' | 'Urgent' | 'Academic' | 'Donation'>('General');
  const [noticePinned, setNoticePinned] = useState(false);
  const [noticePublished, setNoticePublished] = useState(true);

  // 2. Announcements Form State
  const [announceModalOpen, setAnnounceModalOpen] = useState(false);
  const [editingAnnounceId, setEditingAnnounceId] = useState<string | null>(null);
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceTag, setAnnounceTag] = useState('');
  const [announceDesc, setAnnounceDesc] = useState('');
  const [announceDate, setAnnounceDate] = useState('');
  const [announceHighlight, setAnnounceHighlight] = useState(false);
  const [announceLive, setAnnounceLive] = useState(true);

  // 3. Media Gallery Form State
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaMediaType, setMediaMediaType] = useState<'image' | 'video'>('image');
  const [mediaTag, setMediaTag] = useState<'Cultural Events' | 'Sports & Athletics' | 'School Heritage' | 'Alumni Gathering'>('School Heritage');
  const [mediaDescription, setMediaDescription] = useState('');

  // 4. Membership Plans Form State
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState('');
  const [planTier, setPlanTier] = useState<MembershipTier>(MembershipTier.ANNUAL);
  const [planFee, setPlanFee] = useState<number>(500);
  const [planDurationYears, setPlanDurationYears] = useState<number>(1);
  const [planDescription, setPlanDescription] = useState('');
  const [planBenefits, setPlanBenefits] = useState<string>('Voting Rights, Event Discounts, ID Card');
  const [planPopular, setPlanPopular] = useState(false);

  // 5. Alumni Directory Form State
  const [alumniModalOpen, setAlumniModalOpen] = useState(false);
  const [editingAlumniId, setEditingAlumniId] = useState<string | null>(null);
  const [alumniName, setAlumniName] = useState('');
  const [alumniEmail, setAlumniEmail] = useState('');
  const [alumniBatchYear, setAlumniBatchYear] = useState<number>(2015);
  const [alumniPhone, setAlumniPhone] = useState('');
  const [alumniOccupation, setAlumniOccupation] = useState('');
  const [alumniLocation, setAlumniLocation] = useState('');
  const [alumniTier, setAlumniTier] = useState<MembershipTier>(MembershipTier.ANNUAL);
  const [alumniStatus, setAlumniStatus] = useState<MembershipStatus>(MembershipStatus.ACTIVE);
  const [alumniRole, setAlumniRole] = useState<'user' | 'admin'>('user');
  const [alumniRollNumber, setAlumniRollNumber] = useState('');
  const [alumniAvatar, setAlumniAvatar] = useState('');
  const [directorySearch, setDirectorySearch] = useState('');

  // Load all Data
  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [noticesRes, announceRes, galleryRes, plansRes, directoryRes, renewalsRes, committeeRes] = await Promise.all([
        fetch('/api/admin/notices', { headers: { 'x-admin-role': 'admin' } }),
        fetch('/api/admin/announcements', { headers: { 'x-admin-role': 'admin' } }),
        fetch('/api/admin/gallery', { headers: { 'x-admin-role': 'admin' } }),
        fetch('/api/admin/membership/plans', { headers: { 'x-admin-role': 'admin' } }),
        fetch('/api/admin/alumni/directory', { headers: { 'x-admin-role': 'admin' } }),
        fetch('/api/admin/renewals', { headers: { 'x-admin-role': 'admin' } }),
        fetch('/api/admin/committee', { headers: { 'x-admin-role': 'admin' } })
      ]);

      if (noticesRes.ok) setNotices((await noticesRes.json()).notices || []);
      if (announceRes.ok) setAnnouncements((await announceRes.json()).announcements || []);
      if (galleryRes.ok) setPhotos((await galleryRes.json()).photos || []);
      if (plansRes.ok) setPlans((await plansRes.json()).plans || []);
      if (directoryRes.ok) setDirectory((await directoryRes.json()).directory || []);
      if (renewalsRes.ok) setRenewals((await renewalsRes.json()).renewals || []);
      if (committeeRes.ok) setCommitteeMembers((await committeeRes.json()).committeeMembers || []);
    } catch (err) {
      console.error('Failed to load admin panel data:', err);
      setError('Connection error while loading admin records.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for Committee Member CRUD
  const resetCommitteeForm = () => {
    setEditingCommitteeId(null);
    setCommType('executive');
    setCommCategory('officer_leadership');
    setCommRoleTitle('');
    setCommName('');
    setCommBatchYear('');
    setCommDescription('');
    setCommSpecialTag('');
    setCommDisplayOrder(committeeMembers.length + 1);
  };

  const openEditCommitteeModal = (member: CommitteeMember) => {
    setEditingCommitteeId(member.id);
    setCommType(member.committeeType);
    setCommCategory(member.category);
    setCommRoleTitle(member.roleTitle);
    setCommName(member.name);
    setCommBatchYear(member.batchYear || '');
    setCommDescription(member.description || '');
    setCommSpecialTag(member.specialTag || '');
    setCommDisplayOrder(member.displayOrder || 0);
    setCommitteeModalOpen(true);
  };

  const handleSaveCommittee = async (e: FormEvent) => {
    e.preventDefault();
    if (!commName || !commRoleTitle) {
      setError('Name and Role Title are required.');
      return;
    }

    try {
      const payload = {
        committeeType: commType,
        category: commCategory,
        roleTitle: commRoleTitle,
        name: commName,
        batchYear: commBatchYear,
        description: commDescription,
        specialTag: commSpecialTag,
        displayOrder: commDisplayOrder
      };

      let res;
      if (editingCommitteeId) {
        res = await fetch(`/api/admin/committee/${editingCommitteeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/committee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showSuccess(editingCommitteeId ? 'Committee member updated!' : 'Committee member added!');
        setCommitteeModalOpen(false);
        resetCommitteeForm();
        fetchAllAdminData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save committee member.');
      }
    } catch (err) {
      console.error('Error saving committee member:', err);
      setError('Server error while saving committee member.');
    }
  };

  const handleDeleteCommittee = async (id: string) => {
    if (!id) {
      setError('Cannot delete member: Invalid ID.');
      return;
    }

    // Optimistic UI removal
    setCommitteeMembers(prev => prev.filter(m => String(m.id) !== String(id)));

    try {
      const res = await fetch(`/api/admin/committee/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'x-admin-role': 'admin' }
      });
      if (res.ok) {
        showSuccess('Committee member deleted.');
        fetchAllAdminData();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to delete committee member.');
        fetchAllAdminData();
      }
    } catch (err) {
      console.error('Error deleting committee member:', err);
      setError('Server error deleting committee member.');
      fetchAllAdminData();
    }
  };

  const handleClearAllCommittee = async () => {
    setCommitteeMembers([]);
    try {
      const res = await fetch('/api/admin/committee/clear/all', {
        method: 'DELETE',
        headers: { 'x-admin-role': 'admin' }
      });
      if (res.ok) {
        showSuccess('All board members cleared.');
        fetchAllAdminData();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to clear committee members.');
        fetchAllAdminData();
      }
    } catch (err) {
      console.error('Error clearing committee members:', err);
      setError('Server error clearing committee members.');
      fetchAllAdminData();
    }
  };


  useEffect(() => {
    if (isAdmin) {
      fetchAllAdminData();
    }
  }, [isAdmin]);

  // Show alert message helper
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // RBAC Access Guard
  if (!isAdmin) {
    return (
      <div className="bg-red-50 border-2 border-red-600 p-8 text-center space-y-4 max-w-2xl mx-auto my-12 rounded-lg shadow-lg">
        <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-red-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black text-red-800 uppercase tracking-tight font-serif">Access Denied: Admin Privilege Required</h2>
        <p className="text-sm text-red-700 font-sans">
          Your account ({currentUser?.email || 'Guest'}) does not possess administrator authorizations. Only users registered as Portal Administrators can access this board.
        </p>
      </div>
    );
  }

  // --- 1. NOTICE BOARD HANDLERS ---
  const handleSaveNotice = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: noticeTitle,
        content: noticeContent,
        category: noticeCategory,
        isPinned: noticePinned,
        isPublished: noticePublished,
        postedByEmail: currentUser?.email || ''
      };

      let res;
      if (editingNoticeId) {
        res = await fetch(`/api/admin/notices/${editingNoticeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/notices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showSuccess(editingNoticeId ? 'Notice updated successfully!' : 'New notice created & published!');
        setNoticeModalOpen(false);
        resetNoticeForm();
        fetchAllAdminData();
      }
    } catch (err) {
      setError('Failed to save notice.');
    }
  };

  const resetNoticeForm = () => {
    setEditingNoticeId(null);
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeCategory('General');
    setNoticePinned(false);
    setNoticePublished(true);
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE',
        headers: { 
          'x-admin-role': 'admin',
          'x-user-email': currentUser?.email || ''
        }
      });
      if (res.ok) {
        setNotices(prev => prev.filter(n => String(n.id) !== String(id)));
        showSuccess('Notice deleted.');
        fetchAllAdminData();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to delete notice.');
      }
    } catch (err) {
      setError('Error deleting notice.');
    }
  };

  const handleToggleNoticePublish = async (notice: AlumniNotice) => {
    try {
      const res = await fetch(`/api/admin/notices/${notice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
        body: JSON.stringify({ isPublished: !notice.isPublished })
      });
      if (res.ok) {
        showSuccess(`Notice status changed to ${!notice.isPublished ? 'Published Live' : 'Draft'}`);
        fetchAllAdminData();
      }
    } catch (err) {
      setError('Error toggling notice publish state.');
    }
  };

  // --- 2. ANNOUNCEMENTS HANDLERS ---
  const handleSaveAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: announceTitle,
        tag: announceTag || 'General Update',
        desc: announceDesc,
        date: announceDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isHighlight: announceHighlight,
        isLive: announceLive
      };

      let res;
      if (editingAnnounceId) {
        res = await fetch(`/api/admin/announcements/${editingAnnounceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showSuccess(editingAnnounceId ? 'Announcement updated!' : 'Announcement created!');
        setAnnounceModalOpen(false);
        resetAnnounceForm();
        fetchAllAdminData();
      }
    } catch (err) {
      setError('Failed to save announcement.');
    }
  };

  const resetAnnounceForm = () => {
    setEditingAnnounceId(null);
    setAnnounceTitle('');
    setAnnounceTag('');
    setAnnounceDesc('');
    setAnnounceDate('');
    setAnnounceHighlight(false);
    setAnnounceLive(true);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { 
          'x-admin-role': 'admin',
          'x-user-email': currentUser?.email || ''
        }
      });
      if (res.ok) {
        setAnnouncements(prev => prev.filter(a => String(a.id) !== String(id)));
        showSuccess('Announcement removed.');
        fetchAllAdminData();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to delete announcement.');
      }
    } catch (err) {
      setError('Failed to delete announcement.');
    }
  };

  // --- 3. MEDIA GALLERY HANDLERS ---
  const handleSaveMedia = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const parsed = parseMediaUrl(mediaUrl.trim(), mediaMediaType);
      const payload = {
        title: mediaTitle.trim(),
        url: parsed.displayUrl,
        mediaType: parsed.mediaType,
        tag: mediaTag,
        description: mediaDescription.trim(),
        uploaderEmail: currentUser?.email || ''
      };

      let res;
      if (editingMediaId) {
        res = await fetch(`/api/admin/gallery/${editingMediaId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showSuccess('Media post saved to database and gallery!');
        setMediaModalOpen(false);
        resetMediaForm();
        fetchAllAdminData();
      }
    } catch (err) {
      setError('Failed to save media.');
    }
  };

  const resetMediaForm = () => {
    setEditingMediaId(null);
    setMediaTitle('');
    setMediaUrl('');
    setMediaMediaType('image');
    setMediaTag('School Heritage');
    setMediaDescription('');
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { 
          'x-admin-role': 'admin',
          'x-user-email': currentUser?.email || ''
        }
      });
      if (res.ok) {
        setPhotos(prev => prev.filter(p => String(p.id) !== String(id)));
        showSuccess('Media item deleted.');
        fetchAllAdminData();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to delete media item.');
      }
    } catch (err) {
      setError('Error deleting gallery item.');
    }
  };

  // --- 4. MEMBERSHIP PLANS HANDLERS ---
  const handleSavePlan = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: planName,
        tier: planTier,
        fee: planFee,
        durationYears: planDurationYears,
        description: planDescription,
        benefits: planBenefits.split(',').map(b => b.trim()).filter(Boolean),
        isPopular: planPopular
      };

      let res;
      if (editingPlanId) {
        res = await fetch(`/api/admin/membership/plans/${editingPlanId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/membership/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showSuccess('Membership plan updated.');
        setPlanModalOpen(false);
        resetPlanForm();
        fetchAllAdminData();
      }
    } catch (err) {
      setError('Failed to save membership plan.');
    }
  };

  const resetPlanForm = () => {
    setEditingPlanId(null);
    setPlanName('');
    setPlanTier(MembershipTier.ANNUAL);
    setPlanFee(500);
    setPlanDurationYears(1);
    setPlanDescription('');
    setPlanBenefits('Voting Rights, Event Discounts, ID Card');
    setPlanPopular(false);
  };

  const handleDeletePlan = async (id: string) => {
    setPlans(prev => prev.filter(p => String(p.id) !== String(id)));
    try {
      const res = await fetch(`/api/admin/membership/plans/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-role': 'admin' }
      });
      if (res.ok) {
        showSuccess('Plan deleted.');
        fetchAllAdminData();
      } else {
        fetchAllAdminData();
      }
    } catch (err) {
      setError('Failed to delete plan.');
      fetchAllAdminData();
    }
  };

  const handleClearAllPlans = async () => {
    setPlans([]);
    try {
      const res = await fetch('/api/admin/membership/plans/clear/all', {
        method: 'DELETE',
        headers: { 'x-admin-role': 'admin' }
      });
      if (res.ok) {
        showSuccess('All membership plans cleared.');
        fetchAllAdminData();
      } else {
        fetchAllAdminData();
      }
    } catch (err) {
      console.error('Error clearing membership plans:', err);
      fetchAllAdminData();
    }
  };

  // --- 5. ALUMNI DIRECTORY HANDLERS ---
  const handleSaveAlumni = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: alumniName,
        email: alumniEmail,
        batchYear: alumniBatchYear,
        phone: alumniPhone,
        occupation: alumniOccupation,
        location: alumniLocation,
        membershipTier: alumniTier,
        membershipStatus: alumniStatus,
        role: alumniRole,
        rollNumber: alumniRollNumber,
        avatarUrl: alumniAvatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`
      };

      let res;
      if (editingAlumniId) {
        res = await fetch(`/api/admin/alumni/directory/${editingAlumniId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/alumni/directory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showSuccess('Alumni profile card updated.');
        setAlumniModalOpen(false);
        resetAlumniForm();
        fetchAllAdminData();
        if (onRefreshGlobalStats) onRefreshGlobalStats();
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to save alumni.');
      }
    } catch (err) {
      setError('Error saving alumni card.');
    }
  };

  const resetAlumniForm = () => {
    setEditingAlumniId(null);
    setAlumniName('');
    setAlumniEmail('');
    setAlumniBatchYear(2015);
    setAlumniPhone('');
    setAlumniOccupation('');
    setAlumniLocation('');
    setAlumniTier(MembershipTier.ANNUAL);
    setAlumniStatus(MembershipStatus.ACTIVE);
    setAlumniRole('user');
    setAlumniRollNumber('');
    setAlumniAvatar('');
  };

  const handleDeleteAlumni = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/alumni/directory/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-role': 'admin' }
      });
      if (res.ok) {
        showSuccess('Alumni removed from directory.');
        fetchAllAdminData();
        if (onRefreshGlobalStats) onRefreshGlobalStats();
      }
    } catch (err) {
      setError('Error deleting alumni.');
    }
  };

  // --- 6. MEMBERSHIP APPROVAL HANDLERS ---
  const handleApproveRenewal = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/renewals/${id}/approve`, {
        method: 'POST',
        headers: { 'x-admin-role': 'admin' }
      });
      if (res.ok) {
        showSuccess('Membership payment ACCEPTED! User profile status updated to Active.');
        fetchAllAdminData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to approve renewal.');
      }
    } catch (err) {
      setError('Error processing approval.');
    }
  };

  const handleRejectRenewal = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/renewals/${id}/reject`, {
        method: 'POST',
        headers: { 'x-admin-role': 'admin' }
      });
      if (res.ok) {
        showSuccess('Membership request REJECTED.');
        fetchAllAdminData();
      }
    } catch (err) {
      setError('Error processing rejection.');
    }
  };

  const handleDeleteRenewal = async (id: string, receiptNumber?: string) => {
    try {
      // Execute delete request by primary id
      const res = await fetch(`/api/admin/renewals/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'x-admin-role': 'admin' }
      });

      // Also trigger delete request by receiptNumber if available
      if (receiptNumber && String(receiptNumber) !== String(id)) {
        await fetch(`/api/admin/renewals/${encodeURIComponent(receiptNumber)}`, {
          method: 'DELETE',
          headers: { 'x-admin-role': 'admin' }
        }).catch(() => {});
      }

      if (res.ok) {
        setRenewals(prev => prev.filter(r => 
          String(r.id) !== String(id) && 
          (!receiptNumber || String(r.receiptNumber) !== String(receiptNumber))
        ));
        showSuccess('Payment request permanently deleted from queue and Supabase database.');
        fetchAllAdminData();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to delete payment request.');
      }
    } catch (err) {
      setError('Error deleting payment request.');
    }
  };

  const pendingRenewalsCount = renewals.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-8 font-sans text-left" id="admin-panel-container">
      {/* Alert Notifications */}
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 flex items-center justify-between rounded shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-700 hover:text-red-900 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-100 border-l-4 border-emerald-600 text-emerald-900 flex items-center justify-between rounded shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-bold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-800 hover:text-emerald-950 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Admin Welcome Header */}
      <div className="bg-gradient-to-r from-[#062E19] via-[#0D5230] to-[#0A4025] text-white p-6 sm:p-8 border-2 border-[#0D5230] shadow-[6px_6px_0px_0px_rgba(13,82,48,0.25)] rounded-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[10px] font-mono tracking-widest uppercase mb-3 rounded">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span>SUPERADMIN RBAC CONTROL CENTER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-serif italic tracking-tight">
              Hi, {currentUser?.name || 'Admin'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-serif mt-1 max-w-xl">
              Welcome to the official Taki Boys Alumni Association Kolkata portal management dashboard. Monitor members, approve applications, publish circulars, and customize portal resources.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={fetchAllAdminData}
              disabled={loading}
              className="px-4 py-2 bg-emerald-700/60 hover:bg-emerald-600 text-white border border-emerald-400/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer rounded"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Dashboard Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border-2 border-[#0D5230] p-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)] rounded">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Total Alumni</span>
          <span className="text-2xl font-black font-serif text-[#0D5230] block mt-0.5">{directory.length}</span>
          <span className="text-[9px] text-slate-500 mt-1 block">Registered in Database</span>
        </div>

        <div className="bg-white border-2 border-[#0D5230] p-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)] rounded">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Active Members</span>
          <span className="text-2xl font-black font-serif text-emerald-700 block mt-0.5">
            {directory.filter(u => u.membershipStatus === MembershipStatus.ACTIVE).length}
          </span>
          <span className="text-[9px] text-slate-500 mt-1 block">Paid Active Tiers</span>
        </div>

        <div className="bg-amber-50 border-2 border-amber-600 p-4 shadow-[3px_3px_0px_0px_rgba(217,119,6,0.15)] rounded relative">
          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-900 block">Pending Approvals</span>
          <span className="text-2xl font-black font-serif text-amber-700 block mt-0.5">{pendingRenewalsCount}</span>
          <span className="text-[9px] text-amber-800 mt-1 block font-bold">Requires Admin Decision</span>
        </div>

        <div className="bg-white border-2 border-[#0D5230] p-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)] rounded">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Live Notices</span>
          <span className="text-2xl font-black font-serif text-[#0D5230] block mt-0.5">
            {notices.filter(n => n.isPublished !== false).length}
          </span>
          <span className="text-[9px] text-slate-500 mt-1 block">On User Dashboard</span>
        </div>

        <div className="bg-white border-2 border-[#0D5230] p-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)] rounded">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Announcements</span>
          <span className="text-2xl font-black font-serif text-[#0D5230] block mt-0.5">
            {announcements.filter(a => a.isLive !== false).length}
          </span>
          <span className="text-[9px] text-slate-500 mt-1 block">Active Updates</span>
        </div>

        <div className="bg-white border-2 border-[#0D5230] p-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)] rounded">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Gallery Media</span>
          <span className="text-2xl font-black font-serif text-[#0D5230] block mt-0.5">{photos.length}</span>
          <span className="text-[9px] text-slate-500 mt-1 block">Photos & Videos</span>
        </div>

        <div className="bg-white border-2 border-[#0D5230] p-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)] rounded">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Executive Board</span>
          <span className="text-2xl font-black font-serif text-[#0D5230] block mt-0.5">{committeeMembers.length}</span>
          <span className="text-[9px] text-slate-500 mt-1 block">Committee Members</span>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="border-b-2 border-[#0D5230] flex flex-wrap gap-2 pt-2 bg-[#F4F9F6] p-2 rounded-t-lg">
        {[
          { id: 'notices', label: '1. Notice Board', icon: Megaphone, count: notices.length },
          { id: 'announcements', label: '2. Announcements', icon: BellRing, count: announcements.length },
          { id: 'gallery', label: '3. Media Gallery', icon: Image, count: photos.length },
          { id: 'plans', label: '4. Membership Plans', icon: CreditCard, count: plans.length },
          { id: 'directory', label: '5. Alumni Directory', icon: Users, count: directory.length },
          { id: 'approvals', label: '6. Payment Approvals', icon: FolderCheck, count: pendingRenewalsCount, alert: pendingRenewalsCount > 0 },
          { id: 'executive', label: '7. Executive Board', icon: Shield, count: committeeMembers.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-t-2 border-x-2 transition-all cursor-pointer rounded-t ${
                isActive
                  ? 'bg-white text-[#0D5230] border-[#0D5230] shadow-[0px_-2px_0px_0px_#0D5230]'
                  : 'bg-emerald-800/10 text-slate-600 border-transparent hover:bg-white/60 hover:text-[#0D5230]'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#0D5230]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 text-[9px] font-mono rounded font-black ${
                  tab.alert 
                    ? 'bg-amber-600 text-white animate-pulse' 
                    : isActive ? 'bg-[#0D5230] text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: NOTICE BOARD MANAGER */}
      {/* ========================================================================= */}
      {activeSubTab === 'notices' && (
        <div className="bg-white border-2 border-[#0D5230] p-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)] rounded-b-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-xl font-black font-serif italic text-[#0D5230]">Notice Board Management</h2>
              <p className="text-xs text-slate-600 font-serif">Create, edit, delete, and publish circulars to all alumni user dashboards.</p>
            </div>
            <button
              onClick={() => {
                resetNoticeForm();
                setNoticeModalOpen(true);
              }}
              className="px-4 py-2 bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 rounded cursor-pointer transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            {notices.map(notice => (
              <div 
                key={notice.id} 
                className={`p-4 border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 rounded ${
                  notice.isPublished === false 
                    ? 'bg-slate-50 border-slate-300 opacity-75' 
                    : notice.isPinned ? 'bg-amber-50/60 border-amber-500' : 'bg-white border-[#0D5230]/30'
                }`}
              >
                <div className="space-y-1 text-left max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#0D5230] text-white text-[9px] font-bold uppercase tracking-wider rounded">
                      {notice.category}
                    </span>
                    {notice.isPinned && (
                      <span className="px-2 py-0.5 bg-amber-600 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 rounded">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}
                    {notice.isPublished === false ? (
                      <span className="px-2 py-0.5 bg-slate-600 text-white text-[9px] font-bold uppercase tracking-wider rounded">
                        Draft (Hidden)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider rounded">
                        Published Live
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">{notice.title}</h3>
                  <p className="text-xs text-slate-600 font-serif line-clamp-2"><FormattedText text={notice.content} /></p>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3 pt-1">
                    <span>By: {notice.postedBy?.name || "System Admin"}</span>
                    <span>Posted: {new Date(notice.postedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleNoticePublish(notice)}
                    className={`p-2 border text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer rounded transition-all ${
                      notice.isPublished !== false 
                        ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' 
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    }`}
                    title={notice.isPublished !== false ? 'Unpublish to Draft' : 'Publish Live'}
                  >
                    {notice.isPublished !== false ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>

                  <button
                    onClick={() => {
                      setEditingNoticeId(notice.id);
                      setNoticeTitle(notice.title);
                      setNoticeContent(notice.content);
                      setNoticeCategory(notice.category as any);
                      setNoticePinned(notice.isPinned || false);
                      setNoticePublished(notice.isPublished !== false);
                      setNoticeModalOpen(true);
                    }}
                    className="p-2 border border-[#0D5230]/30 bg-emerald-50 text-[#0D5230] hover:bg-emerald-100 cursor-pointer rounded transition-all"
                    title="Edit Notice"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteNotice(notice.id)}
                    className="p-2 border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer rounded transition-all"
                    title="Delete Notice"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: ANNOUNCEMENTS & UPDATES MANAGER */}
      {/* ========================================================================= */}
      {activeSubTab === 'announcements' && (
        <div className="bg-white border-2 border-[#0D5230] p-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)] rounded-b-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-xl font-black font-serif italic text-[#0D5230]">Announcements & Updates Manager</h2>
              <p className="text-xs text-slate-600 font-serif">Post important school news and alumni updates displayed on the user dashboard.</p>
            </div>
            <button
              onClick={() => {
                resetAnnounceForm();
                setAnnounceModalOpen(true);
              }}
              className="px-4 py-2 bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 rounded cursor-pointer transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>New Announcement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map(item => (
              <div key={item.id} className="relative p-4 border-2 border-[#0D5230]/30 bg-[#F4F9F6] rounded flex flex-col justify-between space-y-3">
                <div className="space-y-2 pr-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#0D5230] text-white text-[9px] font-bold uppercase tracking-wider rounded">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">{item.title}</h3>
                  <p className="text-xs text-slate-600 font-serif"><FormattedText text={item.desc} /></p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#0D5230]/15">
                  <span className={`text-[10px] font-bold uppercase ${item.isLive !== false ? 'text-emerald-700' : 'text-slate-500'}`}>
                    ● {item.isLive !== false ? 'Live on Dashboard' : 'Hidden'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingAnnounceId(item.id);
                        setAnnounceTitle(item.title);
                        setAnnounceTag(item.tag);
                        setAnnounceDesc(item.desc);
                        setAnnounceDate(item.date);
                        setAnnounceHighlight(item.isHighlight || false);
                        setAnnounceLive(item.isLive !== false);
                        setAnnounceModalOpen(true);
                      }}
                      className="p-1.5 border border-[#0D5230]/30 bg-white text-[#0D5230] hover:bg-emerald-50 rounded cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(item.id)}
                      className="px-2 py-1.5 border border-red-300 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center gap-1 rounded cursor-pointer transition-all active:scale-95"
                      title="Delete Announcement"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: MEDIA GALLERY MANAGER */}
      {/* ========================================================================= */}
      {activeSubTab === 'gallery' && (
        <div className="bg-white border-2 border-[#0D5230] p-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)] rounded-b-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-xl font-black font-serif italic text-[#0D5230]">Media Gallery Control Center</h2>
              <p className="text-xs text-slate-600 font-serif">Upload images or video URLs. Users have read-only access to view and comment.</p>
            </div>
            <button
              onClick={() => {
                resetMediaForm();
                setMediaModalOpen(true);
              }}
              className="px-4 py-2 bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 rounded cursor-pointer transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Photo / Video</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="border-2 border-[#0D5230]/30 bg-white rounded overflow-hidden flex flex-col justify-between">
                <div className="relative h-44 bg-slate-900 group">
                  {photo.mediaType === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-white">
                      <Film className="h-10 w-10 text-emerald-400" />
                    </div>
                  ) : (
                    <img 
                      src={photo.url} 
                      alt={photo.title}
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#0D5230] text-white text-[9px] font-bold uppercase rounded">
                    {photo.tag}
                  </span>
                </div>

                <div className="p-3 space-y-1.5 text-left">
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A] truncate">{photo.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{photo.description || 'No description provided.'}</p>
                </div>

                <div className="p-3 bg-[#F4F9F6] border-t border-[#0D5230]/20 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">By: {photo.uploadedBy.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingMediaId(photo.id);
                        setMediaTitle(photo.title);
                        setMediaUrl(photo.url);
                        setMediaMediaType(photo.mediaType || 'image');
                        setMediaTag(photo.tag);
                        setMediaDescription(photo.description || '');
                        setMediaModalOpen(true);
                      }}
                      className="p-1 bg-white border border-[#0D5230]/30 text-[#0D5230] hover:bg-emerald-50 rounded cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(photo.id)}
                      className="p-1 bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: ALUMNI MEMBERSHIP PLANS MANAGER */}
      {/* ========================================================================= */}
      {activeSubTab === 'plans' && (
        <div className="bg-white border-2 border-[#0D5230] p-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)] rounded-b-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-xl font-black font-serif italic text-[#0D5230] flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-[#0D5230]" />
                <span>Membership Plans & Renewal Fee Configurator</span>
              </h2>
              <p className="text-xs text-slate-600 font-serif">Manage tiers, pricing, and benefits displayed to alumni on the renewal screen. Stored in Supabase <code>membership_plans</code> table.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {plans.length > 0 && (
                <button
                  onClick={handleClearAllPlans}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 flex items-center gap-1.5 rounded border border-red-300 cursor-pointer transition-all active:scale-95 shrink-0"
                  title="Clear all membership plans"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                  <span>Clear All ({plans.length})</span>
                </button>
              )}



              <button
                onClick={() => {
                  resetPlanForm();
                  setPlanModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 rounded cursor-pointer transition-all shadow-sm shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Create Plan Tier</span>
              </button>
            </div>
          </div>

          {plans.length === 0 ? (
            <div className="bg-[#F4F9F6] border-2 border-dashed border-[#0D5230]/30 p-12 text-center rounded space-y-3">
              <CreditCard className="h-10 w-10 text-[#0D5230]/40 mx-auto" />
              <h3 className="font-serif font-black text-lg text-[#0D5230]">No Active Membership Plans Configured</h3>
              <p className="text-xs text-slate-600 font-serif max-w-md mx-auto">
                Create custom membership tiers for your alumni association. Once created, plans will automatically reflect on the user-facing Membership Renewal screen.
              </p>
              <button
                onClick={() => {
                  resetPlanForm();
                  setPlanModalOpen(true);
                }}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Plan</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map(p => (
                <div key={p.id} className="border-2 border-[#0D5230] bg-[#F4F9F6] p-5 rounded flex flex-col justify-between space-y-4 shadow-sm relative">
                  {p.isPopular && (
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-[#0D5230] uppercase tracking-wider block">{p.tier}</span>
                    <h3 className="font-serif font-black text-xl text-[#1A1A1A] mt-1">{p.name}</h3>
                    <div className="my-2">
                      <span className="text-2xl font-black font-serif text-[#0D5230]">₹{p.fee}</span>
                      <span className="text-xs text-slate-500 ml-1">/ {p.durationYears === 0 ? 'Lifetime' : `${p.durationYears} Year`}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-serif mb-3">{p.description}</p>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {(Array.isArray(p.benefits) ? p.benefits : []).map((b, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#0D5230]/20 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingPlanId(p.id);
                        setPlanName(p.name);
                        setPlanTier(p.tier);
                        setPlanFee(p.fee);
                        setPlanDurationYears(p.durationYears);
                        setPlanDescription(p.description);
                        setPlanBenefits(Array.isArray(p.benefits) ? p.benefits.join(', ') : p.benefits || '');
                        setPlanPopular(p.isPopular || false);
                        setPlanModalOpen(true);
                      }}
                      className="p-1.5 bg-white border border-[#0D5230]/30 text-[#0D5230] hover:bg-emerald-100 rounded cursor-pointer"
                      title="Edit Plan"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(p.id)}
                      className="p-1.5 bg-white border border-red-300 text-red-700 hover:bg-red-100 rounded cursor-pointer"
                      title="Delete Plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: ALUMNI DIRECTORY MANAGER */}
      {/* ========================================================================= */}
      {activeSubTab === 'directory' && (
        <div className="bg-white border-2 border-[#0D5230] p-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)] rounded-b-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-xl font-black font-serif italic text-[#0D5230]">Registered Users & Admin Management</h2>
              <p className="text-xs text-slate-600 font-serif">View, edit role/membership, and manage registered users directly fetched from Supabase.</p>
            </div>
          </div>

          {/* Directory Search Filter */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              value={directorySearch}
              onChange={(e) => setDirectorySearch(e.target.value)}
              placeholder="Search alumni by name, email, batch..."
              className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 pl-9 pr-4 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0D5230] rounded"
            />
          </div>

          {directory.length === 0 ? (
            <div className="p-8 text-center bg-[#F4F9F6] border border-[#0D5230]/20 rounded font-serif text-slate-600">
              <Users className="h-8 w-8 text-[#0D5230] mx-auto mb-2 opacity-60" />
              <p className="text-sm font-bold">No registered users in Supabase database.</p>
              <p className="text-xs text-slate-500 mt-1">Users who register or are created by the admin will be displayed here dynamically.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {directory
                .filter(u => 
                  !directorySearch || 
                  u.name.toLowerCase().includes(directorySearch.toLowerCase()) || 
                  u.email.toLowerCase().includes(directorySearch.toLowerCase()) ||
                  String(u.batchYear).includes(directorySearch)
                )
                .map(alumnus => (
                  <div key={alumnus.id} className="p-4 border-2 border-[#0D5230]/30 bg-white rounded flex items-start justify-between gap-3 shadow-xs">
                    <div className="flex items-start gap-3">
                      <img 
                        src={alumnus.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                        alt={alumnus.name}
                        className="w-12 h-12 rounded-full border-2 border-[#0D5230] object-cover shrink-0" 
                      />
                      <div className="space-y-0.5 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold text-sm text-[#1A1A1A]">{alumnus.name}</span>
                          {alumnus.role === 'admin' && (
                            <span className="px-1.5 py-0.2 bg-emerald-800 text-white text-[8px] font-black uppercase rounded">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-[#0D5230] block">
                          Batch of {alumnus.batchYear} • {alumnus.rollNumber || 'Roll N/A'}
                        </span>
                        <p className="text-xs text-slate-600 font-serif">{alumnus.occupation}</p>
                        <span className="text-[10px] text-slate-500 font-mono block">{alumnus.email}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingAlumniId(alumnus.id);
                          setAlumniName(alumnus.name);
                          setAlumniEmail(alumnus.email);
                          setAlumniBatchYear(alumnus.batchYear);
                          setAlumniPhone(alumnus.phone || '');
                          setAlumniOccupation(alumnus.occupation || '');
                          setAlumniLocation(alumnus.location || '');
                          setAlumniTier(alumnus.membershipTier);
                          setAlumniStatus(alumnus.membershipStatus);
                          setAlumniRole((alumnus.role as any) || 'user');
                          setAlumniRollNumber(alumnus.rollNumber || '');
                          setAlumniAvatar(alumnus.avatarUrl || '');
                          setAlumniModalOpen(true);
                        }}
                        className="p-1.5 bg-[#F4F9F6] border border-[#0D5230]/30 text-[#0D5230] hover:bg-emerald-100 rounded cursor-pointer"
                        title="Edit Profile Card"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlumni(alumnus.id)}
                        className="p-1.5 bg-red-50 border border-red-300 text-red-700 hover:bg-red-100 rounded cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 6: MEMBERSHIP PAYMENT APPROVAL QUEUE */}
      {/* ========================================================================= */}
      {activeSubTab === 'approvals' && (
        <div className="bg-white border-2 border-[#0D5230] p-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)] rounded-b-lg space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-black font-serif italic text-[#0D5230]">Membership Payment Approvals Queue</h2>
            <p className="text-xs text-slate-600 font-serif">Review submitted renewal payment transactions. Accept or reject applications to automatically update user membership status.</p>
          </div>

          {renewals.length === 0 ? (
            <div className="p-8 text-center bg-[#F4F9F6] border border-dashed border-[#0D5230]/30 rounded">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-serif text-slate-700">No payment requests submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {renewals.map(req => (
                <div 
                  key={req.id} 
                  className={`relative p-5 border-2 transition-all rounded flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    req.status === 'pending' 
                      ? 'bg-amber-50/70 border-amber-500 shadow-sm' 
                      : req.status === 'approved' 
                        ? 'bg-emerald-50/40 border-emerald-500' 
                        : 'bg-red-50/40 border-red-400'
                  }`}
                >
                  <div className="space-y-1.5 text-left pr-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#0D5230] text-white text-[9px] font-bold uppercase rounded">
                        {req.tier}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                        req.status === 'pending' 
                          ? 'bg-amber-600 text-white animate-pulse' 
                          : req.status === 'approved' 
                            ? 'bg-emerald-700 text-white' 
                            : 'bg-red-700 text-white'
                      }`}>
                        Status: {req.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                      <span className="font-serif font-bold text-sm text-[#1A1A1A]">{req.email}</span>
                      <span className="text-sm font-black text-[#0D5230]">Amount Paid: ₹{req.amount}</span>
                    </div>

                    <div className="text-xs text-slate-600 font-serif grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 pt-1">
                      <span><strong>Method:</strong> {req.paymentMethod}</span>
                      <span><strong>Txn ID:</strong> {req.transactionId || 'N/A'}</span>
                      <span><strong>UTR / UPI Ref:</strong> <span className="font-mono font-semibold text-[#0D5230]">{req.utrNumber || 'N/A'}</span></span>
                      <span><strong>Submitted:</strong> {new Date(req.submittedAt).toLocaleString()}</span>
                      <span><strong>Address:</strong> {req.billingAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveRenewal(req.id)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 rounded cursor-pointer shadow-xs transition-all active:scale-95"
                        >
                          <Check className="h-4 w-4" />
                          <span>Accept Request</span>
                        </button>
                        <button
                          onClick={() => handleRejectRenewal(req.id)}
                          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 rounded cursor-pointer shadow-xs transition-all active:scale-95"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold font-serif text-slate-500 italic">
                        Decision Finalized ({req.status})
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteRenewal(req.id, req.receiptNumber)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 rounded cursor-pointer shadow-xs transition-all active:scale-95 ml-2"
                      title="Delete from Queue & Renewal Table"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 7: EXECUTIVE BOARD & ADVISORY COMMITTEE MANAGER */}
      {/* ========================================================================= */}
      {activeSubTab === 'executive' && (
        <div className="bg-white border-2 border-[#0D5230] p-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)] rounded-b-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-xl font-black font-serif italic text-[#0D5230] flex items-center gap-2">
                <Shield className="h-6 w-6" />
                <span>Executive Board & Advisory Committee Management</span>
              </h2>
              <p className="text-xs text-slate-600 font-serif">
                Create, edit, and delete executive committee officers, portfolio leads, members, and advisory trustees.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {committeeMembers.length > 0 && (
                <button
                  onClick={handleClearAllCommittee}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 flex items-center gap-1.5 rounded border border-red-300 cursor-pointer transition-all active:scale-95 shrink-0"
                  title="Clear all board members"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                  <span>Clear All ({committeeMembers.length})</span>
                </button>
              )}

              <button
                onClick={() => {
                  resetCommitteeForm();
                  setCommitteeModalOpen(true);
                }}
                className="bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 flex items-center gap-2 rounded shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add Board Member</span>
              </button>
            </div>
          </div>

          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#F4F9F6] p-3 border border-[#0D5230]/20 rounded">
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search member or role..."
                value={commSearchQuery}
                onChange={e => setCommSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 pl-9 pr-3 py-1.5 text-xs rounded font-serif"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-[#0D5230]" />
              <span className="text-xs font-bold text-slate-700 font-sans">Type:</span>
              <select
                value={commFilterType}
                onChange={e => setCommFilterType(e.target.value as any)}
                className="bg-white border border-slate-300 text-xs py-1.5 px-3 rounded font-sans font-bold"
              >
                <option value="all">All Committees ({committeeMembers.length})</option>
                <option value="executive">Executive Committee ({committeeMembers.filter(m => m.committeeType === 'executive').length})</option>
                <option value="advisory">Advisory Committee ({committeeMembers.filter(m => m.committeeType === 'advisory').length})</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          {committeeMembers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-serif text-sm border-2 border-dashed border-slate-200 rounded">
              No committee members found. Click "Add Board Member" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#0D5230] text-white uppercase text-[10px] tracking-wider font-extrabold">
                  <tr>
                    <th className="p-3">Order</th>
                    <th className="p-3">Committee</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Position / Role Title</th>
                    <th className="p-3">Member Name</th>
                    <th className="p-3">Batch / Class</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {committeeMembers
                    .filter(m => {
                      if (commFilterType !== 'all' && m.committeeType !== commFilterType) return false;
                      if (commSearchQuery) {
                        const q = commSearchQuery.toLowerCase();
                        return m.name.toLowerCase().includes(q) || m.roleTitle.toLowerCase().includes(q);
                      }
                      return true;
                    })
                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((m, idx) => (
                      <tr key={m.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-500">{m.displayOrder || idx + 1}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                            m.committeeType === 'executive' 
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {m.committeeType}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">
                          {m.category === 'officer_leadership' && 'Core Leadership'}
                          {m.category === 'officer_portfolio' && 'Portfolio Lead'}
                          {m.category === 'executive_member' && 'Exec Member'}
                          {m.category === 'co_opt_member' && 'Co-Opted Member'}
                          {m.category === 'advisory_member' && 'Advisory Trustee'}
                        </td>
                        <td className="p-3 font-serif font-black text-[#0D5230]">{m.roleTitle}</td>
                        <td className="p-3 font-serif font-bold text-slate-900">{m.name}</td>
                        <td className="p-3 font-mono font-bold text-slate-600">
                          {m.batchYear ? `Class ${m.batchYear}` : '-'}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditCommitteeModal(m)}
                              className="p-1.5 text-blue-700 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCommittee(m.id)}
                              className="p-1.5 text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL FORM OVERLAYS FOR ADMIN CRUD */}
      {/* ========================================================================= */}

      {/* 1. Notice Board Modal */}
      <AnimatePresence>
        {noticeModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-[#0D5230] shadow-xl max-w-lg w-full p-6 text-left rounded space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-black text-lg text-[#0D5230]">
                  {editingNoticeId ? 'Edit Circular Notice' : 'Publish New Notice'}
                </h3>
                <button onClick={() => setNoticeModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNotice} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Notice Title</label>
                  <input 
                    type="text" 
                    required 
                    value={noticeTitle} 
                    onChange={e => setNoticeTitle(e.target.value)} 
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs text-[#1A1A1A] font-serif rounded"
                    placeholder="Notice title..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Category</label>
                    <select 
                      value={noticeCategory} 
                      onChange={e => setNoticeCategory(e.target.value as any)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                    >
                      <option value="General">General</option>
                      <option value="Event">Event</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Academic">Academic</option>
                      <option value="Donation">Donation</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 pt-5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#0D5230] cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={noticePinned} 
                        onChange={e => setNoticePinned(e.target.checked)} 
                        className="accent-[#0D5230]"
                      />
                      <span>Pin to Top</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#0D5230] cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={noticePublished} 
                        onChange={e => setNoticePublished(e.target.checked)} 
                        className="accent-[#0D5230]"
                      />
                      <span>Publish Live</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Notice Content</label>
                  <textarea 
                    rows={5} 
                    required 
                    value={noticeContent} 
                    onChange={e => setNoticeContent(e.target.value)} 
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                    placeholder="Write notice details..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#0D5230] text-white py-3 font-bold text-xs uppercase tracking-wider rounded cursor-pointer hover:bg-[#0A4025]"
                >
                  Save Notice
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Announcement Modal */}
      <AnimatePresence>
        {announceModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div className="bg-white border-2 border-[#0D5230] shadow-xl max-w-lg w-full p-6 text-left rounded space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-black text-lg text-[#0D5230]">
                  {editingAnnounceId ? 'Edit Announcement' : 'Post Announcement'}
                </h3>
                <button onClick={() => setAnnounceModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Title</label>
                  <input 
                    type="text" 
                    required 
                    value={announceTitle} 
                    onChange={e => setAnnounceTitle(e.target.value)} 
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Tag / Badge</label>
                    <input 
                      type="text" 
                      value={announceTag} 
                      onChange={e => setAnnounceTag(e.target.value)} 
                      placeholder="e.g., Reunion 2026"
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Display Date</label>
                    <input 
                      type="text" 
                      value={announceDate} 
                      onChange={e => setAnnounceDate(e.target.value)} 
                      placeholder="Dec 20, 2026"
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Description</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={announceDesc} 
                    onChange={e => setAnnounceDesc(e.target.value)} 
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-[#0D5230] text-white py-3 font-bold text-xs uppercase tracking-wider rounded cursor-pointer">
                  Save Announcement
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Media Gallery Modal */}
      <AnimatePresence>
        {mediaModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div className="bg-white border-2 border-[#0D5230] shadow-xl max-w-lg w-full p-6 text-left rounded space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-black text-lg text-[#0D5230]">Add / Edit Media Post</h3>
                <button onClick={() => setMediaModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMedia} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Media Title</label>
                  <input 
                    type="text" 
                    required 
                    value={mediaTitle} 
                    onChange={e => setMediaTitle(e.target.value)} 
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Media Type</label>
                    <select 
                      value={mediaMediaType} 
                      onChange={e => setMediaMediaType(e.target.value as any)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                    >
                      <option value="image">Photo Image</option>
                      <option value="video">Video URL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Category Tag</label>
                    <select 
                      value={mediaTag} 
                      onChange={e => setMediaTag(e.target.value as any)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                    >
                      <option value="School Heritage">School Heritage</option>
                      <option value="Cultural Events">Cultural Events</option>
                      <option value="Sports & Athletics">Sports & Athletics</option>
                      <option value="Alumni Gathering">Alumni Gathering</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Image / Video URL</label>
                  <input 
                    type="text" 
                    required 
                    value={mediaUrl} 
                    onChange={e => setMediaUrl(e.target.value)} 
                    placeholder="https://..."
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-mono rounded"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Description</label>
                  <textarea 
                    rows={3} 
                    value={mediaDescription} 
                    onChange={e => setMediaDescription(e.target.value)} 
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-[#0D5230] text-white py-3 font-bold text-xs uppercase tracking-wider rounded cursor-pointer">
                  Save Gallery Media
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Membership Plan Modal */}
      <AnimatePresence>
        {planModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div className="bg-white border-2 border-[#0D5230] shadow-xl max-w-lg w-full p-6 text-left rounded space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-black text-lg text-[#0D5230]">Configure Membership Plan</h3>
                <button onClick={() => setPlanModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSavePlan} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Plan Name</label>
                  <input 
                    type="text" 
                    required 
                    value={planName} 
                    onChange={e => setPlanName(e.target.value)} 
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Tier</label>
                    <select 
                      value={planTier} 
                      onChange={e => setPlanTier(e.target.value as any)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    >
                      <option value={MembershipTier.ANNUAL}>Annual</option>
                      <option value={MembershipTier.LIFE}>Life Member</option>
                      <option value={MembershipTier.PATRON}>Patron</option>
                      <option value={MembershipTier.STUDENT}>Student Alumnus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Fee (₹)</label>
                    <input 
                      type="number" 
                      required 
                      value={planFee} 
                      onChange={e => setPlanFee(Number(e.target.value))} 
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Duration (Yrs)</label>
                    <input 
                      type="number" 
                      value={planDurationYears} 
                      onChange={e => setPlanDurationYears(Number(e.target.value))} 
                      placeholder="0 = Lifetime"
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Benefits (Comma separated)</label>
                  <input 
                    type="text" 
                    value={planBenefits} 
                    onChange={e => setPlanBenefits(e.target.value)} 
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Description</label>
                  <textarea 
                    rows={2} 
                    value={planDescription} 
                    onChange={e => setPlanDescription(e.target.value)} 
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2.5 text-xs font-serif rounded"
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-[#0D5230] text-white py-3 font-bold text-xs uppercase tracking-wider rounded cursor-pointer">
                  Save Plan
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* 5. Alumni Directory Card Modal */}
      <AnimatePresence>
        {alumniModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div className="bg-white border-2 border-[#0D5230] shadow-xl max-w-lg w-full p-6 text-left rounded space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-black text-lg text-[#0D5230]">
                  {editingAlumniId ? 'Edit Alumni Profile' : 'Add Alumni Profile'}
                </h3>
                <button onClick={() => setAlumniModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAlumni} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={alumniName} 
                      onChange={e => setAlumniName(e.target.value)} 
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Email</label>
                    <input 
                      type="email" 
                      required 
                      value={alumniEmail} 
                      onChange={e => setAlumniEmail(e.target.value)} 
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-mono rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Batch Year</label>
                    <input 
                      type="number" 
                      required 
                      value={alumniBatchYear} 
                      onChange={e => setAlumniBatchYear(Number(e.target.value))} 
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Phone</label>
                    <input 
                      type="text" 
                      value={alumniPhone} 
                      onChange={e => setAlumniPhone(e.target.value)} 
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Roll No.</label>
                    <input 
                      type="text" 
                      value={alumniRollNumber} 
                      onChange={e => setAlumniRollNumber(e.target.value)} 
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Occupation</label>
                    <input 
                      type="text" 
                      value={alumniOccupation} 
                      onChange={e => setAlumniOccupation(e.target.value)} 
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Location</label>
                    <input 
                      type="text" 
                      value={alumniLocation} 
                      onChange={e => setAlumniLocation(e.target.value)} 
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Membership Tier</label>
                    <select 
                      value={alumniTier} 
                      onChange={e => setAlumniTier(e.target.value as any)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    >
                      <option value={MembershipTier.ANNUAL}>Annual Member</option>
                      <option value={MembershipTier.LIFE}>Life Member</option>
                      <option value={MembershipTier.PATRON}>Patron</option>
                      <option value={MembershipTier.STUDENT}>Student Alumnus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Membership Status</label>
                    <select 
                      value={alumniStatus} 
                      onChange={e => setAlumniStatus(e.target.value as any)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    >
                      <option value={MembershipStatus.ACTIVE}>Active</option>
                      <option value={MembershipStatus.EXPIRED}>Expired</option>
                      <option value={MembershipStatus.PENDING_RENEWAL}>Pending Renewal</option>
                      <option value={MembershipStatus.NOT_MEMBER}>Non-Member</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Portal Role</label>
                    <select 
                      value={alumniRole} 
                      onChange={e => setAlumniRole(e.target.value as any)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#0D5230] text-white py-3 font-bold text-xs uppercase tracking-wider rounded cursor-pointer mt-2">
                  Save Alumni Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Executive / Advisory Board Modal */}
      <AnimatePresence>
        {committeeModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-[#0D5230] shadow-xl max-w-lg w-full p-6 text-left rounded space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-black text-lg text-[#0D5230] flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>{editingCommitteeId ? 'Edit Board Member' : 'Add Board Member'}</span>
                </h3>
                <button onClick={() => setCommitteeModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCommittee} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Committee Type</label>
                    <select
                      value={commType}
                      onChange={e => {
                        const val = e.target.value as 'executive' | 'advisory';
                        setCommType(val);
                        if (val === 'advisory') setCommCategory('advisory_member');
                        else setCommCategory('officer_leadership');
                      }}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded font-bold text-slate-800"
                    >
                      <option value="executive">Executive Committee</option>
                      <option value="advisory">Advisory Committee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Category</label>
                    <select
                      value={commCategory}
                      onChange={e => setCommCategory(e.target.value as any)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded font-bold text-slate-800"
                    >
                      {commType === 'executive' ? (
                        <>
                          <option value="officer_leadership">Core Leadership (President, Mentor, Convenor, Gen Sec)</option>
                          <option value="officer_portfolio">Office Bearers & Portfolio Leads (VP, AGS, Treasurer)</option>
                          <option value="executive_member">Executive Committee Member</option>
                          <option value="co_opt_member">Co-Opted Board Member</option>
                        </>
                      ) : (
                        <option value="advisory_member">Advisory Trustee / Member</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Position / Role Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. President, General Secretary, Senior Vice President"
                      value={commRoleTitle}
                      onChange={e => setCommRoleTitle(e.target.value)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Swagata Basak"
                      value={commName}
                      onChange={e => setCommName(e.target.value)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Batch / Class</label>
                    <input
                      type="text"
                      placeholder="e.g. '85 or Headmistress"
                      value={commBatchYear}
                      onChange={e => setCommBatchYear(e.target.value)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Display Order</label>
                    <input
                      type="number"
                      value={commDisplayOrder}
                      onChange={e => setCommDisplayOrder(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Tag (Optional)</label>
                    <select
                      value={commSpecialTag}
                      onChange={e => setCommSpecialTag(e.target.value)}
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                    >
                      <option value="">None</option>
                      <option value="sports">Sports</option>
                      <option value="cultural">Cultural</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#0D5230] mb-1">Description / Subtitle (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Headmistress, Ex-student 1986..."
                    value={commDescription}
                    onChange={e => setCommDescription(e.target.value)}
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 p-2 text-xs font-serif rounded"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0D5230] text-white py-3 font-bold text-xs uppercase tracking-wider rounded cursor-pointer hover:bg-[#0A4025] transition-all"
                >
                  Save Board Member
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
