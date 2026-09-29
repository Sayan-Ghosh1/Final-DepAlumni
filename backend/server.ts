import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { MembershipStatus, MembershipTier, UserProfile, ChatMessage, RenewalSubmission, AlumniEvent, GalleryPhoto, AlumniNotice, Announcement, MembershipPlan, CommitteeMember } from "./types.js";

dotenv.config();

// Initialize Supabase Client for Taki Alumni Project
const SUPABASE_URL = process.env.SUPABASE_URL || "https://mxuiikbyhwuzaljajbjo.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_LiNqM88RwLOUeHhdFYqGdg_9LM2sone";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  // Enable CORS for Vercel deployment and local frontend
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests from any origin (e.g. Vercel, localhost)
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-role", "Accept", "Origin", "X-Requested-With"]
  }));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Default seed users (Default administrator account)
  const DEFAULT_SEED_USERS: UserProfile[] = [
    {
      id: "admin-seed-1",
      email: "admin@taki.alumni",
      name: "Portal Administrator",
      batchYear: 1988,
      phone: "+91 98300 00000",
      occupation: "Association Administrator",
      location: "TBAAK Headquarters, Kolkata",
      membershipStatus: MembershipStatus.ACTIVE,
      membershipTier: MembershipTier.PATRON,
      membershipExpiry: "Lifetime",
      rollNumber: "ADM-101",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      role: "admin"
    }
  ];

  const DEFAULT_PASSWORDS: Record<string, string> = {
    "admin@taki.alumni": "admin123"
  };

  // Active in-memory users & passwords
  const users: UserProfile[] = [...DEFAULT_SEED_USERS];
  const passwords: Record<string, string> = { ...DEFAULT_PASSWORDS };

  // Live Announcements & Updates Manager Store
  const announcements: Announcement[] = [];

  // Alumni Membership Plans Configurator Store
  const membershipPlans: MembershipPlan[] = [
    {
      id: "p1",
      name: "Annual Member",
      tier: MembershipTier.ANNUAL,
      fee: 500,
      durationYears: 1,
      description: "Standard annual alumni subscription for 1 calendar year.",
      benefits: ["Voting rights in AGM", "Access to digital alumni library", "Event discounts", "Official Membership Badge"],
      isPopular: false
    },
    {
      id: "p2",
      name: "Life Member",
      tier: MembershipTier.LIFE,
      fee: 5000,
      durationYears: 0,
      description: "Permanent lifetime membership with lifetime privileges and plaque.",
      benefits: ["Lifetime Voting Rights", "VIP Seating at Annual Reunions", "Exclusive Directory Listing", "Framed Life Alumnus Certificate"],
      isPopular: true
    },
    {
      id: "p3",
      name: "Patron Member",
      tier: MembershipTier.PATRON,
      fee: 15000,
      durationYears: 0,
      description: "Honored benefactor tier supporting school development projects.",
      benefits: ["All Life Benefits", "School Development Committee seat", "Permanent Name Roll at School Hall", "Honorary Centenary Memento"],
      isPopular: false
    }
  ];

  // Executive Committee & Advisory Committee Ledger Store
  const DEFAULT_COMMITTEE_MEMBERS: CommitteeMember[] = [];

  const committeeMembers: CommitteeMember[] = [...DEFAULT_COMMITTEE_MEMBERS];
  const deletedCommitteeIds = new Set<string>();
  const deletedCommitteeNames = new Set<string>();
  const deletedPlanIds = new Set<string>();
  const deletedRenewalIds = new Set<string>();
  const deletedAnnouncementIds = new Set<string>([
    "a1", "a2", "a3",
    "94th Annual Winter Reunion & General Body Meeting",
    "Sundarban Relief & School Book Distribution Drive",
    "Inauguration of New Physics Lab Wing"
  ]);
  const deletedNoticeIds = new Set<string>([
    "n1", "n2", "n3", "n4",
    "Centenary Year (100 Years) Celebration: Organizing Committee Formed",
    "URGENT: O-Negative Blood Required at Sealdah Medical College Hospital",
    "TBAAK Annual Merit-cum-Means Scholarships 2026: Applications Open",
    "Early-Bird Registration counters opening for 94th Winter Reunion"
  ]);

  const chatMessages: ChatMessage[] = [
    {
      id: "m1",
      senderName: "Pradip Kumar Banerjee",
      senderEmail: "pradip.banerjee@taki.alumni",
      senderBatch: 1976,
      text: "Wonderful to see this portal come alive! It brings back memories of our school building near Sealdah and the excellent teachers we had in the 70s.",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      id: "m2",
      senderName: "Amit Sen",
      senderEmail: "amit.sen@taki.alumni",
      senderBatch: 1988,
      text: "Indeed, Pradip da! Remember the winter reunions and the school playground matches? I hope we can arrange a small get-together next month.",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      id: "m3",
      senderName: "Sourav Das",
      senderEmail: "sourav.das@taki.alumni",
      senderBatch: 2005,
      text: "Count me in! Pranab da's tea and singara outside the school gate are things I still miss today. Let's make the community grow!",
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    }
  ];

  const renewals: RenewalSubmission[] = [];

  const notices: AlumniNotice[] = [];

  const events: AlumniEvent[] = [
    {
      id: "e1",
      title: "94th Annual Winter Reunion & Gala Dinner",
      description: "Our signature annual winter reunion. Includes school heritage walk, classical music performance, felicitation of retired teachers, and buffet dinner.",
      date: "2026-12-20",
      time: "4:00 PM - 9:00 PM",
      location: "School Main Playground, Sealdah, Kolkata",
      type: "Reunion",
      rsvps: ["sourav.das@taki.alumni"]
    },
    {
      id: "e2",
      title: "Executive Committee Planning Session",
      description: "Planning meeting for the Centenary celebration and upcoming charity book distribution drives. All active members are welcome.",
      date: "2026-08-15",
      time: "11:30 AM - 1:30 PM",
      location: "Alumni Room, Taki House School Building",
      type: "Meeting",
      rsvps: ["amit.sen@taki.alumni", "pradip.banerjee@taki.alumni"]
    },
    {
      id: "e3",
      title: "Career Guidance & Mentorship Seminar",
      description: "Interactive session where prominent ex-students from medicine, tech, and administration fields guide the current Batch of Class 10 & 12 boys.",
      date: "2026-09-05",
      time: "2:00 PM - 5:00 PM",
      location: "School Main Assembly Hall",
      type: "Seminar",
      rsvps: []
    }
  ];

  const galleryPhotos: GalleryPhoto[] = [
    {
      id: "g1",
      url: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=800",
      title: "Annual Sports Meet - Ex-Students 100m Dash",
      description: "Alumni members competing in the athletic sprint event during the winter annual sports meet. Exceptional fitness shown by the Class of 2012!",
      tag: "Sports & Athletics",
      uploadedBy: {
        name: "Amit Sen",
        email: "amit.sen@taki.alumni",
        batchYear: 1988
      },
      uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
    },
    {
      id: "g2",
      url: "https://images.unsplash.com/photo-1561089489-f1b9590d4a28?w=800",
      title: "Saraswati Puja - Traditional School lobby",
      description: "Saraswati Puja (Basant Panchami) being celebrated in our school lobby with beautiful flower decorations, alpana drawings, and prayers with students and alumni.",
      tag: "Cultural Events",
      uploadedBy: {
        name: "Sourav Das",
        email: "sourav.das@taki.alumni",
        batchYear: 2005
      },
      uploadedAt: new Date(Date.now() - 3600000 * 120).toISOString()
    },
    {
      id: "g3",
      url: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800",
      title: "Annual Social Stage Play - 'Alaler Gharer Dulal'",
      description: "The Taki Boys Alumni Drama Club performing the timeless classic Bengali social satire on the main school auditorium stage for the winter reunion festival.",
      tag: "Cultural Events",
      uploadedBy: {
        name: "Pradip Kumar Banerjee",
        email: "pradip.banerjee@taki.alumni",
        batchYear: 1976
      },
      uploadedAt: new Date(Date.now() - 3600000 * 72).toISOString()
    },
    {
      id: "g4",
      url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
      title: "Inter-School Football Championship Finals",
      description: "Our school senior team winning the Sealdah Division Inter-School Football championship shield after a nail-biting penalty shootout.",
      tag: "Sports & Athletics",
      uploadedBy: {
        name: "Amit Sen",
        email: "amit.sen@taki.alumni",
        batchYear: 1988
      },
      uploadedAt: new Date(Date.now() - 3600000 * 15).toISOString()
    },
    {
      id: "g5",
      url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800",
      title: "Rabindra Jayanti Music Recital - Alumni Hall",
      description: "Vocalists and acoustic musicians from various batches collaborating on Rabindrasangeet chorus recitals during Rabindra Jayanti Celebrations.",
      tag: "Cultural Events",
      uploadedBy: {
        name: "Sourav Das",
        email: "sourav.das@taki.alumni",
        batchYear: 2005
      },
      uploadedAt: new Date(Date.now() - 3600000 * 180).toISOString()
    },
    {
      id: "g6",
      url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
      title: "Sports Tug-Of-War: Batch of 1988 vs 2005",
      description: "A highly intense and cheerful Tug of War game between the senior alumni and junior ex-students. Legends of 1988 took the glory!",
      tag: "Sports & Athletics",
      uploadedBy: {
        name: "Pradip Kumar Banerjee",
        email: "pradip.banerjee@taki.alumni",
        batchYear: 1976
      },
      uploadedAt: new Date(Date.now() - 3600000 * 300).toISOString()
    },
    {
      id: "g7",
      url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
      title: "Historic School Main Building (1950s Archive)",
      description: "A vintage picture from our ex-student archives showcasing the old gothic-brick building structure of Taki House high school, looking pristine as ever.",
      tag: "School Heritage",
      uploadedBy: {
        name: "Pradip Kumar Banerjee",
        email: "pradip.banerjee@taki.alumni",
        batchYear: 1976
      },
      uploadedAt: new Date(Date.now() - 3600000 * 500).toISOString()
    }
  ];

  // Supabase sync and status tracking
  let isSupabaseConnected = false;

  async function safeSupabaseOperation(op: () => PromiseLike<any>, name: string) {
    try {
      const res = await Promise.resolve(op());
      if (res?.error) {
        console.warn(`[Supabase ${name}] warning:`, res.error.message);
      }
    } catch (err: any) {
      console.warn(`[Supabase ${name}] error:`, err?.message || err);
    }
  }

  async function syncWithSupabase() {
    try {
      // 1. Fetch Users from Supabase
      const { data: dbUsers, error: userErr } = await supabase.from("users").select("*");
      if (!userErr && dbUsers) {
        isSupabaseConnected = true;
        const fetchedUsers: UserProfile[] = dbUsers.map((row: any) => ({
          id: String(row.id),
          email: row.email,
          name: row.name,
          batchYear: Number(row.batch_year || row.batchYear || 2015),
          phone: row.phone || "",
          occupation: row.occupation || "Alumnus",
          location: row.location || "Kolkata",
          membershipStatus: (row.membership_status || row.membershipStatus || MembershipStatus.NOT_MEMBER) as MembershipStatus,
          membershipTier: (row.membership_tier || row.membershipTier || MembershipTier.ANNUAL) as MembershipTier,
          membershipExpiry: row.membership_expiry || row.membershipExpiry || "",
          rollNumber: row.roll_number || row.rollNumber || "",
          avatarUrl: row.avatar_url || row.avatarUrl || "",
          role: row.role || (row.email && row.email.toLowerCase().includes('admin') ? 'admin' : undefined)
        }));

        // Replace in-memory users with fetched Supabase users + default seeds
        users.length = 0;
        users.push(...DEFAULT_SEED_USERS);
        
        fetchedUsers.forEach(fu => {
          if (!users.some(u => u.email.toLowerCase() === fu.email.toLowerCase())) {
            users.push(fu);
          }
        });

        // Sync passwords map
        dbUsers.forEach((row: any) => {
          if (row.email && row.password) {
            passwords[row.email.toLowerCase()] = row.password;
          }
        });

        // Sync distinct Supabase `admins` table
        try {
          const { data: dbAdmins, error: adminErr } = await supabase.from("admins").select("*");
          if (!adminErr && dbAdmins && dbAdmins.length > 0) {
            dbAdmins.forEach((row: any) => {
              const adminEmail = (row.email || "").toLowerCase().trim();
              if (adminEmail) {
                const existingUser = users.find(u => u.email.toLowerCase() === adminEmail);
                if (existingUser) {
                  existingUser.role = "admin";
                  if (row.name) existingUser.name = row.name;
                } else {
                  users.push({
                    id: String(row.id),
                    email: adminEmail,
                    name: row.name || "Portal Administrator",
                    batchYear: 1988,
                    phone: "+91 98300 00000",
                    occupation: "Association Administrator",
                    location: "TBAAK Headquarters, Kolkata",
                    membershipStatus: MembershipStatus.ACTIVE,
                    membershipTier: MembershipTier.PATRON,
                    membershipExpiry: "Lifetime",
                    rollNumber: "ADM-" + Math.floor(100 + Math.random() * 900),
                    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                    role: "admin"
                  });
                }
                if (row.password) {
                  passwords[adminEmail] = row.password;
                }
              }
            });
          }
        } catch (adminSyncErr) {
          console.warn("[Supabase Sync] Admin table sync note:", adminSyncErr);
        }
      } else {
        // Reset to default seeds if Supabase error or table not set up yet
        users.length = 0;
        users.push(...DEFAULT_SEED_USERS);
        for (const k in passwords) {
          delete passwords[k];
        }
        Object.assign(passwords, DEFAULT_PASSWORDS);
      }

      // 2. Fetch Chat Messages
      const { data: dbChats, error: chatErr } = await supabase.from("chat_messages").select("*").order("timestamp", { ascending: true });
      if (!chatErr && dbChats) {
        const fetchedChats: ChatMessage[] = dbChats.map((row: any) => ({
          id: String(row.id),
          senderName: row.sender_name || row.senderName,
          senderEmail: row.sender_email || row.senderEmail,
          senderBatch: Number(row.sender_batch || row.senderBatch || 2015),
          text: row.text,
          timestamp: row.timestamp,
          avatarUrl: row.avatar_url || row.avatarUrl
        }));
        chatMessages.length = 0;
        chatMessages.push(...fetchedChats);
      }

      // 3. Fetch Notices
      const { data: dbNotices, error: noticeErr } = await supabase.from("notices").select("*");
      if (!noticeErr && dbNotices) {
        const fetchedNotices: AlumniNotice[] = dbNotices
          .map((row: any) => ({
            id: String(row.id),
            title: row.title || "",
            content: row.content || "",
            category: row.category || "General",
            postedBy: typeof row.posted_by === "object" && row.posted_by ? row.posted_by : {
              name: row.posted_by_name || "Alumnus",
              email: row.posted_by_email || "",
              batchYear: Number(row.posted_by_batch || 2015),
              avatarUrl: row.posted_by_avatar || ""
            },
            postedAt: row.posted_at || row.postedAt || new Date().toISOString(),
            isPinned: Boolean(row.is_pinned || row.isPinned)
          }))
          .filter(n => !deletedNoticeIds.has(String(n.id)) && !deletedNoticeIds.has(String(n.title)));
        fetchedNotices.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        // keep memory items not deleted
        const remainingMemoryNotices = notices.filter(n => !deletedNoticeIds.has(String(n.id)) && !deletedNoticeIds.has(String(n.title)));
        const combinedNoticesMap = new Map<string, AlumniNotice>();
        fetchedNotices.forEach(n => combinedNoticesMap.set(n.id, n));
        remainingMemoryNotices.forEach(n => { if (!combinedNoticesMap.has(n.id)) combinedNoticesMap.set(n.id, n); });
        notices.length = 0;
        notices.push(...Array.from(combinedNoticesMap.values()));
      } else if (noticeErr) {
        console.warn("[Supabase Sync] Notices sync note:", noticeErr.message);
        const remainingMemoryNotices = notices.filter(n => !deletedNoticeIds.has(String(n.id)) && !deletedNoticeIds.has(String(n.title)));
        notices.length = 0;
        notices.push(...remainingMemoryNotices);
      }

      // 4. Fetch Announcements
      const { data: dbAnnouncements, error: annErr } = await supabase.from("announcements").select("*");
      if (!annErr && dbAnnouncements) {
        const fetchedAnnouncements: Announcement[] = dbAnnouncements
          .map((row: any) => ({
            id: String(row.id),
            title: row.title || "",
            tag: row.tag || "Announcement",
            desc: row.desc || row.description || "",
            date: row.date || "",
            isHighlight: Boolean(row.is_highlight || row.isHighlight),
            isLive: Boolean(row.is_live !== undefined ? row.is_live : row.isLive !== undefined ? row.isLive : true)
          }))
          .filter(a => !deletedAnnouncementIds.has(String(a.id)) && !deletedAnnouncementIds.has(String(a.title)));
        
        const remainingMemoryAnnouncements = announcements.filter(a => !deletedAnnouncementIds.has(String(a.id)) && !deletedAnnouncementIds.has(String(a.title)));
        const combinedAnnMap = new Map<string, Announcement>();
        fetchedAnnouncements.forEach(a => combinedAnnMap.set(a.id, a));
        remainingMemoryAnnouncements.forEach(a => { if (!combinedAnnMap.has(a.id)) combinedAnnMap.set(a.id, a); });
        announcements.length = 0;
        announcements.push(...Array.from(combinedAnnMap.values()));
      } else if (annErr) {
        console.warn("[Supabase Sync] Announcements sync note:", annErr.message);
      }

      // 5. Fetch Gallery Photos
      const { data: dbGallery, error: galleryErr } = await supabase.from("gallery_photos").select("*");
      if (!galleryErr && dbGallery) {
        const fetchedPhotos: GalleryPhoto[] = dbGallery.map((row: any) => ({
          id: String(row.id),
          title: row.title || "Untitled",
          url: row.url || "",
          description: row.description || "",
          tag: row.tag || "School Heritage",
          mediaType: row.media_type || row.mediaType || "image",
          uploadedBy: typeof row.uploaded_by === "object" && row.uploaded_by ? row.uploaded_by : {
            name: row.uploaded_by_name || "Alumni Member",
            email: row.uploaded_by_email || "",
            batchYear: Number(row.uploaded_by_batch || 2010)
          },
          uploadedAt: row.uploaded_at || row.uploadedAt || new Date().toISOString()
        }));
        fetchedPhotos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        galleryPhotos.length = 0;
        galleryPhotos.push(...fetchedPhotos);
      } else if (galleryErr) {
        console.warn("[Supabase Sync] Gallery sync note:", galleryErr.message);
      }

      // 7. Fetch Committee Members
      const { data: dbCommittee, error: committeeErr } = await supabase.from("committee_members").select("*").order("display_order", { ascending: true });
      if (!committeeErr && dbCommittee) {
        const fetchedCommittee: CommitteeMember[] = dbCommittee
          .map((row: any) => ({
            id: String(row.id),
            committeeType: row.committee_type || row.committeeType || 'executive',
            category: row.category || 'officer_leadership',
            roleTitle: row.role_title || row.roleTitle || '',
            name: row.name || '',
            batchYear: row.batch_year || row.batchYear || '',
            description: row.description || '',
            displayOrder: Number(row.display_order || row.displayOrder || 0),
            specialTag: row.special_tag || row.specialTag || ''
          }))
          .filter(m => !deletedCommitteeIds.has(String(m.id)) && !deletedCommitteeNames.has(m.name));
        committeeMembers.length = 0;
        committeeMembers.push(...fetchedCommittee);
      } else if (committeeErr) {
        console.warn("[Supabase Sync] Committee members sync note:", committeeErr.message);
      }

      // 8. Fetch Membership Plans
      const { data: dbPlans, error: planErr } = await supabase.from("membership_plans").select("*");
      if (!planErr && dbPlans) {
        const fetchedPlans: MembershipPlan[] = dbPlans
          .map((row: any) => ({
            id: String(row.id),
            name: row.name || "",
            tier: (row.tier || MembershipTier.ANNUAL) as MembershipTier,
            fee: Number(row.fee || 0),
            durationYears: Number(row.duration_years || row.durationYears || 1),
            description: row.description || "",
            benefits: Array.isArray(row.benefits) 
              ? row.benefits 
              : (typeof row.benefits === 'string' ? JSON.parse(row.benefits) : ["Voting Rights", "Official Badge"]),
            isPopular: Boolean(row.is_popular !== undefined ? row.is_popular : row.isPopular)
          }))
          .filter(p => !deletedPlanIds.has(String(p.id)));
        
        membershipPlans.length = 0;
        membershipPlans.push(...fetchedPlans);
      } else if (planErr) {
        console.warn("[Supabase Sync] Membership plans sync note:", planErr.message);
      }

      // 9. Fetch Renewals
      const { data: dbRenewals, error: renewalErr } = await supabase.from("renewals").select("*").order("submitted_at", { ascending: false });
      if (!renewalErr && dbRenewals) {
        const fetchedRenewals: RenewalSubmission[] = dbRenewals
          .map((row: any) => ({
            id: String(row.id),
            email: (row.email || "").toLowerCase(),
            tier: (row.tier || MembershipTier.ANNUAL) as MembershipTier,
            amount: Number(row.amount || 0),
            paymentMethod: row.payment_method || row.paymentMethod || "Bank/UPI",
            transactionId: row.transaction_id || row.transactionId || "",
            utrNumber: row.utr_number || row.utrNumber || "",
            receiptNumber: row.receipt_number || row.receiptNumber || "",
            status: row.status || "pending",
            submittedAt: row.submitted_at || row.submittedAt || new Date().toISOString(),
            billingAddress: row.billing_address || row.billingAddress || "Kolkata, WB"
          }))
          .filter(r => 
            r.status !== 'deleted' &&
            !deletedRenewalIds.has(String(r.id)) && 
            !deletedRenewalIds.has(String(r.receiptNumber)) &&
            !deletedRenewalIds.has(String(r.transactionId)) &&
            !deletedRenewalIds.has(String(r.utrNumber))
          );
        renewals.length = 0;
        renewals.push(...fetchedRenewals);
      } else if (renewalErr) {
        console.warn("[Supabase Sync] Renewals sync note:", renewalErr.message);
      }
    } catch (err) {
      console.warn("[Supabase Sync] Background sync note:", err);
    }
  }

  // Trigger initial sync on startup and run background interval every 5 seconds
  syncWithSupabase().catch(console.error);
  setInterval(() => {
    syncWithSupabase().catch(console.error);
  }, 5000);

  // API Endpoints
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Supabase connection status check
  app.get("/api/supabase/status", async (req, res) => {
    let connected = true; // Credentials configured
    let detail = "Connected to Supabase (Project: taki alumni)";
    try {
      const { error } = await supabase.from("users").select("count", { count: "exact", head: true });
      if (error) {
        detail = error.message;
      }
    } catch (e: any) {
      detail = e.message;
    }

    res.json({
      connected: true,
      projectUrl: SUPABASE_URL,
      projectId: "mxuiikbyhwuzaljajbjo",
      projectName: "Taki alumni",
      statusDetail: detail
    });
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    await syncWithSupabase();
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const lowerEmail = email.toLowerCase().trim();
    let user = users.find(u => u.email.toLowerCase() === lowerEmail);
    let storedPassword = passwords[lowerEmail];

    // Fallback: check Supabase if user or password is missing in memory
    if (!user || !storedPassword) {
      try {
        // First check admins table in Supabase
        const { data: dbAdmin, error: adminErr } = await supabase.from("admins").select("*").eq("email", lowerEmail).maybeSingle();
        if (!adminErr && dbAdmin) {
          user = {
            id: String(dbAdmin.id),
            email: dbAdmin.email,
            name: dbAdmin.name || "Portal Administrator",
            batchYear: 1988,
            phone: "+91 98300 00000",
            occupation: "Association Administrator",
            location: "TBAAK Headquarters, Kolkata",
            membershipStatus: MembershipStatus.ACTIVE,
            membershipTier: MembershipTier.PATRON,
            membershipExpiry: "Lifetime",
            rollNumber: "ADM-" + Math.floor(100 + Math.random() * 900),
            avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            role: "admin"
          };
          storedPassword = dbAdmin.password || "admin123";

          if (!users.some(u => u.email.toLowerCase() === lowerEmail)) {
            users.push(user);
          }
          passwords[lowerEmail] = storedPassword;
        } else {
          // Check users table in Supabase
          const { data: dbUser, error } = await supabase.from("users").select("*").eq("email", lowerEmail).maybeSingle();
          if (!error && dbUser) {
            user = {
              id: String(dbUser.id),
              email: dbUser.email,
              name: dbUser.name,
              batchYear: Number(dbUser.batch_year || dbUser.batchYear || 2015),
              phone: dbUser.phone || "",
              occupation: dbUser.occupation || "Alumnus",
              location: dbUser.location || "Kolkata",
              membershipStatus: (dbUser.membership_status || dbUser.membershipStatus || MembershipStatus.NOT_MEMBER) as MembershipStatus,
              membershipTier: (dbUser.membership_tier || dbUser.membershipTier || MembershipTier.ANNUAL) as MembershipTier,
              membershipExpiry: dbUser.membership_expiry || dbUser.membershipExpiry || "",
              rollNumber: dbUser.roll_number || dbUser.rollNumber || "",
              avatarUrl: dbUser.avatar_url || dbUser.avatarUrl || "",
              role: dbUser.role || (dbUser.email && dbUser.email.toLowerCase().includes('admin') ? 'admin' : undefined)
            };
            storedPassword = dbUser.password || "password123";

            if (!users.some(u => u.email.toLowerCase() === lowerEmail)) {
              users.push(user);
            }
            passwords[lowerEmail] = storedPassword;
          }
        }
      } catch (err) {
        console.warn("[Supabase Login Query] error:", err);
      }
    }

    if (!user) {
      res.status(401).json({ error: `The account with email "${lowerEmail}" is not registered. Please register first.` });
      return;
    }

    if (storedPassword && password !== storedPassword) {
      res.status(401).json({ error: "Incorrect password. Please check your credentials and try again." });
      return;
    }

    res.json({ user });
  });

  // Google Single Sign-On
  app.post("/api/auth/google", async (req, res) => {
    await syncWithSupabase();
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ error: "Google Email is required" });
      return;
    }

    const lowerEmail = email.toLowerCase().trim();
    let user = users.find(u => u.email.toLowerCase() === lowerEmail);

    if (!user) {
      try {
        // Check admins table in Supabase
        const { data: dbAdmin } = await supabase.from("admins").select("*").eq("email", lowerEmail).maybeSingle();
        if (dbAdmin) {
          user = {
            id: String(dbAdmin.id),
            email: dbAdmin.email,
            name: dbAdmin.name || "Portal Administrator",
            batchYear: 1988,
            phone: "+91 98300 00000",
            occupation: "Association Administrator",
            location: "TBAAK Headquarters, Kolkata",
            membershipStatus: MembershipStatus.ACTIVE,
            membershipTier: MembershipTier.PATRON,
            membershipExpiry: "Lifetime",
            rollNumber: "ADM-101",
            avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            role: "admin"
          };
          if (!users.some(u => u.email.toLowerCase() === lowerEmail)) {
            users.push(user);
          }
        } else {
          // Check users table in Supabase
          const { data: dbUser } = await supabase.from("users").select("*").eq("email", lowerEmail).maybeSingle();
          if (dbUser) {
            user = {
              id: String(dbUser.id),
              email: dbUser.email,
              name: dbUser.name,
              batchYear: Number(dbUser.batch_year || dbUser.batchYear || 2015),
              phone: dbUser.phone || "",
              occupation: dbUser.occupation || "Alumnus",
              location: dbUser.location || "Kolkata",
              membershipStatus: (dbUser.membership_status || dbUser.membershipStatus || MembershipStatus.NOT_MEMBER) as MembershipStatus,
              membershipTier: (dbUser.membership_tier || dbUser.membershipTier || MembershipTier.ANNUAL) as MembershipTier,
              membershipExpiry: dbUser.membership_expiry || dbUser.membershipExpiry || "",
              rollNumber: dbUser.roll_number || dbUser.rollNumber || "",
              avatarUrl: dbUser.avatar_url || dbUser.avatarUrl || "",
              role: dbUser.role || (dbUser.email && dbUser.email.toLowerCase().includes('admin') ? 'admin' : undefined)
            };
            if (!users.some(u => u.email.toLowerCase() === lowerEmail)) {
              users.push(user);
            }
          }
        }
      } catch (err) {
        console.warn("[Google Auth Supabase Check Error]:", err);
      }
    }

    if (!user) {
      res.status(401).json({ error: `The Google account "${lowerEmail}" is not registered in our database. Please register an account first.` });
      return;
    }

    res.json({ user });
  });

  // Admin Register endpoint - disabled as per security requirements
  app.post("/api/auth/admin/register", async (_req, res) => {
    res.status(403).json({ error: "Admin registration is disabled. Administrator accounts are managed exclusively via Supabase Authentication." });
  });

  // Register
  app.post("/api/auth/register", async (req, res) => {
    await syncWithSupabase();
    const { email, password, name, batchYear, phone, occupation, location, rollNumber } = req.body;

    if (!email || !password || !name || !batchYear) {
      res.status(400).json({ error: "Email, password, name, and batch year are required." });
      return;
    }

    if (typeof password !== "string" || password.trim().length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters long." });
      return;
    }

    const phoneDigits = (phone || "").replace(/\D/g, "");
    if (!phone || typeof phone !== "string" || phoneDigits.length < 10) {
      res.status(400).json({ error: "Phone number must be a valid 10-digit mobile number." });
      return;
    }

    const trimmedRoll = (rollNumber || "").trim();
    if (!trimmedRoll) {
      res.status(400).json({ error: "Roll number is required and must be unique." });
      return;
    }

    const lowerEmail = email.toLowerCase().trim();

    // Check email in memory
    const existingUser = users.find(u => u.email.toLowerCase() === lowerEmail);
    if (existingUser) {
      res.status(400).json({ error: "An alumnus with this email is already registered." });
      return;
    }

    // Check email directly in Supabase if connected
    try {
      const { data: dbEmailUsers } = await supabase
        .from("users")
        .select("id, name, email")
        .ilike("email", lowerEmail);

      if (dbEmailUsers && dbEmailUsers.length > 0) {
        res.status(400).json({ error: "An alumnus with this email is already registered." });
        return;
      }
    } catch (err) {
      console.warn("[Supabase Email Check] error:", err);
    }

    // Check phone number uniqueness in memory
    const existingPhoneUser = users.find(u => {
      if (!u.phone) return false;
      const uDigits = u.phone.replace(/\D/g, "");
      return uDigits === phoneDigits || (uDigits.length >= 10 && uDigits.slice(-10) === phoneDigits.slice(-10));
    });
    if (existingPhoneUser) {
      res.status(400).json({ error: `Phone number "${phone.trim()}" is already registered by another alumnus (${existingPhoneUser.name}). Phone numbers must be unique.` });
      return;
    }

    // Check phone number uniqueness in Supabase if connected
    try {
      const { data: dbPhoneUsers } = await supabase
        .from("users")
        .select("id, name, phone");

      if (dbPhoneUsers && dbPhoneUsers.length > 0) {
        const matchingPhoneUser = dbPhoneUsers.find((row: any) => {
          if (!row.phone) return false;
          const rowDigits = String(row.phone).replace(/\D/g, "");
          return rowDigits === phoneDigits || (rowDigits.length >= 10 && rowDigits.slice(-10) === phoneDigits.slice(-10));
        });
        if (matchingPhoneUser) {
          res.status(400).json({ error: `Phone number "${phone.trim()}" is already registered by another alumnus (${matchingPhoneUser.name || "Registered User"}). Phone numbers must be unique.` });
          return;
        }
      }
    } catch (err) {
      console.warn("[Supabase Phone Check] error:", err);
    }

    // Check roll number uniqueness in memory
    const existingRollUser = users.find(u => (u.rollNumber || "").trim().toLowerCase() === trimmedRoll.toLowerCase());
    if (existingRollUser) {
      res.status(400).json({ error: `Roll number "${trimmedRoll}" is already registered by another alumnus (${existingRollUser.name}). Roll numbers must be unique.` });
      return;
    }

    // Check roll number uniqueness in Supabase if connected
    try {
      const { data: dbRollUsers } = await supabase
        .from("users")
        .select("id, name, roll_number")
        .ilike("roll_number", trimmedRoll);

      if (dbRollUsers && dbRollUsers.length > 0) {
        res.status(400).json({ error: `Roll number "${trimmedRoll}" is already registered by another alumnus (${dbRollUsers[0].name || "Registered User"}). Roll numbers must be unique.` });
        return;
      }
    } catch (err) {
      console.warn("[Supabase Roll Number Check] error:", err);
    }

    // Generate unique ID for user
    const id = "u_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    const newUser: UserProfile = {
      id,
      email: lowerEmail,
      name,
      batchYear: parseInt(batchYear),
      phone: phone || "",
      occupation: occupation || "Alumnus",
      location: location || "Kolkata",
      membershipStatus: MembershipStatus.NOT_MEMBER,
      membershipTier: MembershipTier.ANNUAL,
      rollNumber: trimmedRoll,
      avatarUrl: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1535713875002-d1d0cf377fde' : '1570295999919-56ceb5ecca61'}?w=150`
    };

    // Await insertion into Supabase users table
    const { data: insertedData, error: dbError } = await supabase.from("users").upsert({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      batch_year: newUser.batchYear,
      phone: newUser.phone,
      occupation: newUser.occupation,
      location: newUser.location,
      membership_status: newUser.membershipStatus,
      membership_tier: newUser.membershipTier,
      roll_number: newUser.rollNumber,
      avatar_url: newUser.avatarUrl,
      password: password
    }).select();

    if (dbError) {
      console.error("[Supabase Register Error]:", dbError);
      if (dbError.code === "23505") {
        res.status(400).json({ error: "An alumnus with this email, phone, or roll number is already registered in the database." });
        return;
      }
      if (dbError.message && dbError.message.includes("row-level security")) {
        res.status(400).json({ error: "Database permission error: Row Level Security is blocking inserts. Please execute the SQL in supabase_schema.sql in your Supabase SQL Editor." });
        return;
      }
      res.status(400).json({ error: `Database error: ${dbError.message}` });
      return;
    }

    users.push(newUser);
    passwords[lowerEmail] = password;

    res.status(201).json({ user: newUser });
  });

  // Change Password
  app.post("/api/auth/change-password", async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      res.status(400).json({ error: "Email, current password, and new password are required." });
      return;
    }

    if (typeof newPassword !== "string" || newPassword.trim().length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters long." });
      return;
    }

    const lowerEmail = email.toLowerCase().trim();
    let storedPassword = passwords[lowerEmail];

    // Check Supabase if missing in memory
    if (!storedPassword) {
      try {
        const { data: dbAdmin } = await supabase.from("admins").select("password").eq("email", lowerEmail).maybeSingle();
        if (dbAdmin && dbAdmin.password) {
          storedPassword = dbAdmin.password;
        } else {
          const { data: dbUser } = await supabase.from("users").select("password").eq("email", lowerEmail).maybeSingle();
          if (dbUser && dbUser.password) {
            storedPassword = dbUser.password;
          }
        }
      } catch (err) {
        console.warn("[Change Password Sync Error]:", err);
      }
    }

    // Default fallback if still missing
    if (!storedPassword) {
      storedPassword = lowerEmail.includes("admin") ? "admin123" : "password123";
    }

    if (storedPassword !== oldPassword) {
      res.status(400).json({ error: "Incorrect old password. Please verify your current password and try again." });
      return;
    }

    // Update in-memory
    passwords[lowerEmail] = newPassword;

    // Async update in Supabase
    safeSupabaseOperation(async () => {
      const { data: adminData } = await supabase.from("admins").select("id").eq("email", lowerEmail).maybeSingle();
      if (adminData) {
        await supabase.from("admins").update({ password: newPassword }).eq("email", lowerEmail);
      } else {
        await supabase.from("users").update({ password: newPassword }).eq("email", lowerEmail);
      }
    }, "changePassword");

    res.json({ message: "Password updated successfully!" });
  });

  // Get Chat Messages
  app.get("/api/chat/messages", (req, res) => {
    res.json({ messages: chatMessages });
  });

  // Post Chat Message
  app.post("/api/chat/messages", (req, res) => {
    const { senderEmail, text } = req.body;

    if (!senderEmail || !text) {
      res.status(400).json({ error: "senderEmail and text are required" });
      return;
    }

    const user = users.find(u => u.email.toLowerCase() === senderEmail.toLowerCase());
    if (!user) {
      res.status(404).json({ error: "Sender alumnus profile not found" });
      return;
    }

    const newMessage: ChatMessage = {
      id: "m" + (chatMessages.length + 1),
      senderName: user.name,
      senderEmail: user.email,
      senderBatch: user.batchYear,
      text,
      timestamp: new Date().toISOString(),
      avatarUrl: user.avatarUrl
    };

    chatMessages.push(newMessage);

    // Async write to Supabase
    safeSupabaseOperation(() => supabase.from("chat_messages").insert({
      id: newMessage.id,
      sender_name: newMessage.senderName,
      sender_email: newMessage.senderEmail,
      sender_batch: newMessage.senderBatch,
      text: newMessage.text,
      timestamp: newMessage.timestamp,
      avatar_url: newMessage.avatarUrl
    }), "Chat Message");

    res.status(201).json({ message: newMessage });
  });

  // Helper function to check if request is authorized as Admin (RBAC Guard)
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const adminHeader = req.headers['x-admin-role'];
    const userEmail = (req.headers['x-user-email'] || req.body?.postedByEmail || req.body?.uploaderEmail || '').toString().toLowerCase().trim();
    
    // Check header or user role in memory
    const user = users.find(u => u.email.toLowerCase() === userEmail);
    const isAdmin = adminHeader === 'admin' || (user && user.role === 'admin') || userEmail.includes('admin');

    if (!isAdmin) {
      res.status(403).json({ error: "Access Denied: Only users with role='admin' can access the admin dashboard and APIs." });
      return;
    }
    next();
  };

  // Membership Renewal Submission
  app.post("/api/membership/renew", (req, res) => {
    const { email, tier, paymentMethod, billingAddress, amount, utrNumber, transactionId, phone, planName } = req.body;

    if (!email || !tier) {
      res.status(400).json({ error: "Email and membership tier are required" });
      return;
    }

    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      res.status(404).json({ error: "Alumnus profile not found" });
      return;
    }

    const userObj = users[userIndex];
    if (phone) {
      userObj.phone = phone;
    }

    const txId = transactionId || ("TXN" + Math.floor(1000000000 + Math.random() * 9000000000));
    const receiptNo = "PAY-" + new Date().getFullYear() + "-" + String(renewals.length + 1).padStart(6, '0');
    const dateStr = new Date().toISOString();

    const submission: RenewalSubmission = {
      id: "r" + (renewals.length + 1),
      email: email.toLowerCase(),
      tier: tier as MembershipTier,
      amount: parseFloat(amount) || 500,
      paymentMethod: paymentMethod || "Bank/UPI",
      transactionId: txId,
      utrNumber: utrNumber || "",
      receiptNumber: receiptNo,
      status: "pending", // Pending administrator approval
      submittedAt: dateStr,
      billingAddress: billingAddress || "Kolkata, WB"
    };

    renewals.push(submission);

    // Save user phone if updated
    safeSupabaseOperation(() => supabase.from("users").update({
      phone: userObj.phone
    }).eq("email", userObj.email), "Update User Phone");

    // Async sync all billing details (except payment method) to Supabase 'renewals' table
    safeSupabaseOperation(() => supabase.from("renewals").upsert({
      id: submission.id,
      receipt_number: submission.receiptNumber,
      user_name: userObj.name,
      email: submission.email,
      roll_number: userObj.rollNumber || "",
      phone: userObj.phone || "",
      tier: submission.tier,
      plan_name: planName || submission.tier,
      amount: submission.amount,
      transaction_id: submission.transactionId,
      utr_number: submission.utrNumber,
      status: submission.status,
      submitted_at: submission.submittedAt,
      billing_address: submission.billingAddress
    }), "Renewal Submission to Supabase");

    res.status(200).json({ 
      success: true, 
      submission, 
      user: userObj,
      message: "Renewal payment submitted! Pending administrator approval."
    });
  });

  // Get logged-in user's renewal submissions & payment status
  app.get("/api/membership/my-renewals", async (req, res) => {
    const email = (req.query.email as string || "").toLowerCase();
    if (!email) {
      res.status(400).json({ error: "Email parameter is required" });
      return;
    }
    await syncWithSupabase();
    const userRenewals = renewals.filter(r => r.email.toLowerCase() === email);
    userRenewals.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    res.json({ renewals: userRenewals });
  });

  // Directory listing
  app.get("/api/alumni/directory", async (req, res) => {
    await syncWithSupabase();
    const directory = users.map(u => ({
      id: u.id,
      name: u.name,
      batchYear: u.batchYear,
      occupation: u.occupation || "Alumnus",
      location: u.location || "Kolkata",
      membershipTier: u.membershipTier,
      avatarUrl: u.avatarUrl
    }));
    res.json({ directory });
  });

  // ==========================================
  // ADMIN PANEL ENDPOINTS & RBAC CONTROLLERS
  // ==========================================

  // 1. Notice Board Admin Endpoints
  app.get("/api/admin/notices", requireAdmin, async (req, res) => {
    await syncWithSupabase();
    res.json({ notices });
  });

  app.post("/api/admin/notices", requireAdmin, (req, res) => {
    const { title, content, category, isPinned, isPublished, postedByEmail } = req.body;
    if (!title || !content || !category) {
      res.status(400).json({ error: "Title, content, and category are required." });
      return;
    }

    const emailToUse = postedByEmail || "admin@taki.alumni";
    const user = users.find(u => u.email.toLowerCase() === emailToUse.toLowerCase()) || users.find(u => u.role === 'admin');

    const newNotice: AlumniNotice = {
      id: "notice_" + Date.now(),
      title: title.trim(),
      content: content.trim(),
      category: category as any,
      postedBy: {
        name: user ? user.name : "Alumni Admin",
        email: user ? user.email : "admin@taki.alumni",
        batchYear: user ? user.batchYear : 1988,
        avatarUrl: user ? user.avatarUrl : ""
      },
      postedAt: new Date().toISOString(),
      isPinned: Boolean(isPinned),
      isPublished: isPublished !== false
    };

    notices.unshift(newNotice);

    safeSupabaseOperation(() => supabase.from("notices").upsert({
      id: newNotice.id,
      title: newNotice.title,
      content: newNotice.content,
      category: newNotice.category,
      posted_by: newNotice.postedBy,
      posted_at: newNotice.postedAt,
      is_pinned: newNotice.isPinned,
      is_published: newNotice.isPublished
    }), "Admin Notice Create");

    res.status(201).json({ success: true, notice: newNotice });
  });

  app.put("/api/admin/notices/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const noticeIndex = notices.findIndex(n => String(n.id) === String(id));
    if (noticeIndex === -1) {
      res.status(404).json({ error: "Notice not found." });
      return;
    }

    const { title, content, category, isPinned, isPublished } = req.body;
    const notice = notices[noticeIndex];
    if (title !== undefined) notice.title = title.trim();
    if (content !== undefined) notice.content = content.trim();
    if (category !== undefined) notice.category = category;
    if (isPinned !== undefined) notice.isPinned = Boolean(isPinned);
    if (isPublished !== undefined) notice.isPublished = Boolean(isPublished);

    safeSupabaseOperation(() => supabase.from("notices").update({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      is_pinned: notice.isPinned,
      is_published: notice.isPublished
    }).eq("id", id), "Admin Notice Update");

    res.json({ success: true, notice });
  });

  const handleDeleteNoticeHandler = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const targetIdStr = String(id);
    const userEmail = (req.headers['x-user-email'] || req.body?.userEmail || '').toString().toLowerCase().trim();
    const adminHeader = (req.headers['x-admin-role'] || '').toString().toLowerCase().trim();

    const user = users.find(u => u.email.toLowerCase() === userEmail);
    const isAdmin = adminHeader === 'admin' || (user && user.role === 'admin') || userEmail.includes('admin');
    if (!isAdmin) {
      res.status(403).json({ error: "Only administrators are authorized to delete notices." });
      return;
    }

    // Collect matching notices in memory
    const matchedNotices = notices.filter(n => 
      String(n.id) === targetIdStr || 
      String(n.title).toLowerCase() === targetIdStr.toLowerCase()
    );

    // Register in deletedNoticeIds Set
    deletedNoticeIds.add(targetIdStr);
    matchedNotices.forEach(n => {
      if (n.id) deletedNoticeIds.add(String(n.id));
      if (n.title) deletedNoticeIds.add(String(n.title));
    });

    // Remove from in-memory array
    for (let i = notices.length - 1; i >= 0; i--) {
      if (String(notices[i].id) === targetIdStr || String(notices[i].title).toLowerCase() === targetIdStr.toLowerCase()) {
        notices.splice(i, 1);
      }
    }

    // Direct deletion in Supabase database
    try {
      await supabase.from("notices").delete().eq("id", targetIdStr);
      await supabase.from("notices").delete().eq("title", targetIdStr);
      if (!isNaN(Number(targetIdStr))) {
        await supabase.from("notices").delete().eq("id", Number(targetIdStr));
      }

      const { data: dbRows } = await supabase.from("notices").select("*");
      if (dbRows && Array.isArray(dbRows)) {
        const matchedDbRows = dbRows.filter((row: any) =>
          String(row.id || '') === targetIdStr ||
          String(row.title || '').toLowerCase() === targetIdStr.toLowerCase()
        );
        for (const row of matchedDbRows) {
          if (row.id) deletedNoticeIds.add(String(row.id));
          if (row.title) deletedNoticeIds.add(String(row.title));
          if (row.id) await supabase.from("notices").delete().eq("id", row.id);
          if (row.title) await supabase.from("notices").delete().eq("title", row.title);
          await supabase.from("notices").update({ is_published: false }).eq("id", row.id);
        }
      }

      for (const mn of matchedNotices) {
        if (mn.id) await supabase.from("notices").delete().eq("id", String(mn.id));
        if (mn.title) await supabase.from("notices").delete().eq("title", String(mn.title));
        if (mn.id) await supabase.from("notices").update({ is_published: false }).eq("id", String(mn.id));
      }
    } catch (dbErr: any) {
      console.warn("[Supabase Delete Notice Exception]:", dbErr?.message || dbErr);
    }

    res.json({ success: true, message: "Notice permanently deleted from board and database." });
  };

  app.delete("/api/admin/notices/:id", requireAdmin, handleDeleteNoticeHandler);
  app.delete("/api/notices/:id", handleDeleteNoticeHandler);

  // 2. Announcements & Updates Admin Endpoints
  app.get("/api/announcements", async (req, res) => {
    await syncWithSupabase();
    const liveList = announcements.filter(a => a.isLive !== false);
    res.json({ announcements: liveList });
  });

  app.get("/api/admin/announcements", requireAdmin, async (req, res) => {
    await syncWithSupabase();
    res.json({ announcements });
  });

  app.post("/api/admin/announcements", requireAdmin, (req, res) => {
    const { title, tag, desc, date, isHighlight, isLive } = req.body;
    if (!title || !desc) {
      res.status(400).json({ error: "Title and description are required." });
      return;
    }

    const newAnn: Announcement = {
      id: "a" + Date.now(),
      title: title.trim(),
      tag: tag || "Announcement",
      desc: desc.trim(),
      date: date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      isHighlight: Boolean(isHighlight),
      isLive: isLive !== false
    };

    announcements.unshift(newAnn);

    safeSupabaseOperation(() => supabase.from("announcements").upsert({
      id: newAnn.id,
      title: newAnn.title,
      tag: newAnn.tag,
      desc: newAnn.desc,
      date: newAnn.date,
      is_highlight: newAnn.isHighlight,
      is_live: newAnn.isLive
    }), "Admin Announcement Create");

    res.status(201).json({ success: true, announcement: newAnn });
  });

  app.put("/api/admin/announcements/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const ann = announcements.find(a => String(a.id) === String(id));
    if (!ann) {
      res.status(404).json({ error: "Announcement not found." });
      return;
    }

    const { title, tag, desc, date, isHighlight, isLive } = req.body;
    if (title !== undefined) ann.title = title.trim();
    if (tag !== undefined) ann.tag = tag;
    if (desc !== undefined) ann.desc = desc.trim();
    if (date !== undefined) ann.date = date;
    if (isHighlight !== undefined) ann.isHighlight = Boolean(isHighlight);
    if (isLive !== undefined) ann.isLive = Boolean(isLive);

    safeSupabaseOperation(() => supabase.from("announcements").update({
      title: ann.title,
      tag: ann.tag,
      desc: ann.desc,
      date: ann.date,
      is_highlight: ann.isHighlight,
      is_live: ann.isLive
    }).eq("id", id), "Admin Announcement Update");

    res.json({ success: true, announcement: ann });
  });

  const handleDeleteAnnouncementHandler = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const targetIdStr = String(id);

    // Filter memory array and add to deleted tracking set
    for (let i = announcements.length - 1; i >= 0; i--) {
      const item = announcements[i];
      if (String(item.id) === targetIdStr || String(item.title) === targetIdStr) {
        deletedAnnouncementIds.add(String(item.id));
        if (item.title) deletedAnnouncementIds.add(String(item.title));
        announcements.splice(i, 1);
      }
    }
    deletedAnnouncementIds.add(targetIdStr);

    try {
      await supabase.from("announcements").delete().eq("id", targetIdStr);
      await supabase.from("announcements").delete().eq("title", targetIdStr);
      if (!isNaN(Number(targetIdStr))) {
        await supabase.from("announcements").delete().eq("id", Number(targetIdStr));
      }
    } catch (dbErr) {
      console.warn("[Supabase Delete Announcement Error]:", dbErr);
    }

    res.json({ success: true, message: "Announcement deleted successfully." });
  };

  app.delete("/api/admin/announcements/:id", requireAdmin, handleDeleteAnnouncementHandler);
  app.delete("/api/announcements/:id", handleDeleteAnnouncementHandler);

  // 3. Media Gallery Admin Endpoints
  app.get("/api/admin/gallery", requireAdmin, async (req, res) => {
    await syncWithSupabase();
    res.json({ photos: galleryPhotos });
  });

  app.post("/api/admin/gallery", requireAdmin, (req, res) => {
    const { title, url, description, tag, mediaType, uploaderEmail } = req.body;
    if (!title || !url) {
      res.status(400).json({ error: "Title and URL are required." });
      return;
    }

    const user = users.find(u => u.email.toLowerCase() === (uploaderEmail || "").toLowerCase()) || users.find(u => u.role === 'admin');

    const newPhoto: GalleryPhoto = {
      id: "g" + Date.now(),
      title: title.trim(),
      url: url.trim(),
      description: (description || "").trim(),
      tag: tag || "School Events",
      mediaType: mediaType === "video" ? "video" : "image",
      uploadedBy: {
        name: user ? user.name : "Alumni Admin",
        email: user ? user.email : "admin@taki.alumni",
        batchYear: user ? user.batchYear : 1988
      },
      uploadedAt: new Date().toISOString()
    };

    galleryPhotos.unshift(newPhoto);

    safeSupabaseOperation(() => supabase.from("gallery_photos").upsert({
      id: newPhoto.id,
      title: newPhoto.title,
      url: newPhoto.url,
      description: newPhoto.description,
      tag: newPhoto.tag,
      media_type: newPhoto.mediaType,
      uploaded_by: newPhoto.uploadedBy,
      uploaded_at: newPhoto.uploadedAt
    }), "Admin Gallery Create");

    res.status(201).json({ success: true, photo: newPhoto });
  });

  app.put("/api/admin/gallery/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const photo = galleryPhotos.find(g => String(g.id) === String(id));
    if (!photo) {
      res.status(404).json({ error: "Media item not found." });
      return;
    }

    const { title, url, description, tag, mediaType } = req.body;
    if (title !== undefined) photo.title = title.trim();
    if (url !== undefined) photo.url = url.trim();
    if (description !== undefined) photo.description = description.trim();
    if (tag !== undefined) photo.tag = tag;
    if (mediaType !== undefined) photo.mediaType = mediaType;

    safeSupabaseOperation(() => supabase.from("gallery_photos").upsert({
      id: photo.id,
      title: photo.title,
      url: photo.url,
      description: photo.description,
      tag: photo.tag,
      media_type: photo.mediaType,
      uploaded_by: photo.uploadedBy,
      uploaded_at: photo.uploadedAt
    }), "Admin Gallery Update");

    res.json({ success: true, photo });
  });

  const handleDeleteGalleryHandler = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    const photoIndex = galleryPhotos.findIndex(p => String(p.id) === String(id));
    if (photoIndex !== -1) {
      galleryPhotos.splice(photoIndex, 1);
    }

    await safeSupabaseOperation(() => supabase.from("gallery_photos").delete().eq("id", id), "Gallery Delete String");
    if (!isNaN(Number(id))) {
      await safeSupabaseOperation(() => supabase.from("gallery_photos").delete().eq("id", Number(id)), "Gallery Delete Number");
    }

    res.json({ success: true, message: "Media post deleted successfully." });
  };

  app.delete("/api/admin/gallery/:id", requireAdmin, handleDeleteGalleryHandler);
  app.delete("/api/gallery/:id", handleDeleteGalleryHandler);

  // 4. Alumni Membership Plans Admin Endpoints
  app.get("/api/membership/plans", async (req, res) => {
    await syncWithSupabase();
    res.json({ plans: membershipPlans });
  });

  app.get("/api/admin/membership/plans", requireAdmin, async (req, res) => {
    await syncWithSupabase();
    res.json({ plans: membershipPlans });
  });

  app.post("/api/admin/membership/plans", requireAdmin, async (req, res) => {
    const { name, tier, fee, durationYears, description, benefits, isPopular } = req.body;
    if (!name || fee === undefined) {
      res.status(400).json({ error: "Plan name and fee are required." });
      return;
    }

    const newPlan: MembershipPlan = {
      id: "p" + Date.now(),
      name: name.trim(),
      tier: (tier || MembershipTier.ANNUAL) as MembershipTier,
      fee: Number(fee) || 0,
      durationYears: Number(durationYears) || 1,
      description: (description || "").trim(),
      benefits: Array.isArray(benefits) ? benefits : ["Voting rights in AGM", "Official Badge"],
      isPopular: Boolean(isPopular)
    };

    deletedPlanIds.delete(newPlan.id);
    membershipPlans.push(newPlan);

    await safeSupabaseOperation(() => supabase.from("membership_plans").upsert({
      id: newPlan.id,
      name: newPlan.name,
      tier: newPlan.tier,
      fee: newPlan.fee,
      duration_years: newPlan.durationYears,
      description: newPlan.description,
      benefits: newPlan.benefits,
      is_popular: newPlan.isPopular
    }), "Admin Plan Create");

    res.status(201).json({ success: true, plan: newPlan });
  });

  app.put("/api/admin/membership/plans/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const plan = membershipPlans.find(p => String(p.id) === String(id));
    if (!plan) {
      res.status(404).json({ error: "Membership plan not found." });
      return;
    }

    const { name, tier, fee, durationYears, description, benefits, isPopular } = req.body;
    if (name !== undefined) plan.name = name.trim();
    if (tier !== undefined) plan.tier = tier;
    if (fee !== undefined) plan.fee = Number(fee);
    if (durationYears !== undefined) plan.durationYears = Number(durationYears);
    if (description !== undefined) plan.description = description.trim();
    if (benefits !== undefined) plan.benefits = Array.isArray(benefits) ? benefits : plan.benefits;
    if (isPopular !== undefined) plan.isPopular = Boolean(isPopular);

    deletedPlanIds.delete(String(plan.id));

    await safeSupabaseOperation(() => supabase.from("membership_plans").upsert({
      id: plan.id,
      name: plan.name,
      tier: plan.tier,
      fee: plan.fee,
      duration_years: plan.durationYears,
      description: plan.description,
      benefits: plan.benefits,
      is_popular: plan.isPopular
    }), "Admin Plan Update");

    res.json({ success: true, plan });
  });

  app.delete("/api/admin/membership/plans/clear/all", requireAdmin, async (req, res) => {
    membershipPlans.forEach(p => deletedPlanIds.add(String(p.id)));
    membershipPlans.length = 0;

    await safeSupabaseOperation(async () => {
      await supabase.from("membership_plans").delete().neq("id", "___not_matching___");
    }, "Admin Clear All Plans");

    res.json({ success: true, message: "All membership plans cleared." });
  });

  app.delete("/api/admin/membership/plans/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const targetIdStr = String(id);
    const index = membershipPlans.findIndex(p => String(p.id) === targetIdStr);
    if (index !== -1) {
      membershipPlans.splice(index, 1);
    }
    deletedPlanIds.add(targetIdStr);

    await safeSupabaseOperation(async () => {
      await supabase.from("membership_plans").delete().eq("id", targetIdStr);
    }, "Admin Plan Delete");

    res.json({ success: true, message: "Membership plan deleted" });
  });

  // 5. Alumni Directory Admin Endpoints
  app.get("/api/admin/alumni/directory", requireAdmin, async (req, res) => {
    await syncWithSupabase();
    res.json({ directory: users });
  });

  app.post("/api/admin/alumni/directory", requireAdmin, (req, res) => {
    const { name, email, batchYear, phone, occupation, location, membershipTier, membershipStatus, membershipExpiry } = req.body;
    if (!name || !email || !batchYear) {
      res.status(400).json({ error: "Name, email, and batch year are required." });
      return;
    }

    const lowerEmail = email.toLowerCase().trim();
    if (users.some(u => u.email.toLowerCase() === lowerEmail)) {
      res.status(400).json({ error: "An alumnus profile with this email already exists." });
      return;
    }

    const newUser: UserProfile = {
      id: "u" + Date.now(),
      email: lowerEmail,
      name: name.trim(),
      batchYear: Number(batchYear),
      phone: phone || "",
      occupation: occupation || "Alumnus",
      location: location || "Kolkata, West Bengal",
      membershipStatus: (membershipStatus || MembershipStatus.ACTIVE) as MembershipStatus,
      membershipTier: (membershipTier || MembershipTier.ANNUAL) as MembershipTier,
      membershipExpiry: membershipExpiry || "2027-12-31",
      rollNumber: `Batch${batchYear.toString().slice(-2)}-${Math.floor(100 + Math.random() * 900)}`,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      role: lowerEmail.includes("admin") ? "admin" : "user"
    };

    users.push(newUser);
    passwords[lowerEmail] = "password123";

    safeSupabaseOperation(() => supabase.from("users").insert({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      batch_year: newUser.batchYear,
      phone: newUser.phone,
      occupation: newUser.occupation,
      location: newUser.location,
      membership_status: newUser.membershipStatus,
      membership_tier: newUser.membershipTier,
      membership_expiry: newUser.membershipExpiry,
      roll_number: newUser.rollNumber,
      avatar_url: newUser.avatarUrl,
      role: newUser.role,
      password: "password123"
    }), "Admin Add Directory Alumnus");

    res.status(201).json({ success: true, alumnus: newUser });
  });

  app.put("/api/admin/alumni/directory/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);
    if (!user) {
      res.status(404).json({ error: "Alumnus profile not found." });
      return;
    }

    const { name, batchYear, phone, occupation, location, membershipTier, membershipStatus, membershipExpiry, role } = req.body;
    if (name !== undefined) user.name = name.trim();
    if (batchYear !== undefined) user.batchYear = Number(batchYear);
    if (phone !== undefined) user.phone = phone.trim();
    if (occupation !== undefined) user.occupation = occupation.trim();
    if (location !== undefined) user.location = location.trim();
    if (membershipTier !== undefined) user.membershipTier = membershipTier;
    if (membershipStatus !== undefined) user.membershipStatus = membershipStatus;
    if (membershipExpiry !== undefined) user.membershipExpiry = membershipExpiry;
    if (role !== undefined) user.role = role;

    safeSupabaseOperation(() => supabase.from("users").update({
      name: user.name,
      batch_year: user.batchYear,
      phone: user.phone,
      occupation: user.occupation,
      location: user.location,
      membership_status: user.membershipStatus,
      membership_tier: user.membershipTier,
      membership_expiry: user.membershipExpiry,
      role: user.role
    }).eq("id", id), "Admin Update Directory Alumnus");

    res.json({ success: true, alumnus: user });
  });

  app.delete("/api/admin/alumni/directory/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      const deletedUser = users[index];
      users.splice(index, 1);
      delete passwords[deletedUser.email.toLowerCase()];

      safeSupabaseOperation(() => supabase.from("users").delete().eq("id", id), "Admin Delete Directory Alumnus");
    }

    res.json({ success: true, message: "Alumnus profile deleted" });
  });

  // 6. Membership Payment Renewal Approvals Admin Endpoints
  app.get("/api/admin/renewals", requireAdmin, async (req, res) => {
    await syncWithSupabase();
    res.json({ renewals });
  });

  app.post("/api/admin/renewals/:id/approve", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const targetIdStr = String(id);
    const renewal = renewals.find(r => String(r.id) === targetIdStr || String(r.receiptNumber) === targetIdStr);
    if (!renewal) {
      res.status(404).json({ error: "Renewal submission not found." });
      return;
    }

    renewal.status = "approved";

    // Update user profile in memory
    const user = users.find(u => u.email.toLowerCase() === renewal.email.toLowerCase());
    if (user) {
      user.membershipStatus = MembershipStatus.ACTIVE;
      user.membershipTier = renewal.tier;
      if (renewal.tier === MembershipTier.LIFE || renewal.tier === MembershipTier.PATRON) {
        user.membershipExpiry = "Lifetime";
      } else {
        const expDate = new Date();
        expDate.setFullYear(expDate.getFullYear() + 1);
        user.membershipExpiry = expDate.toISOString().split('T')[0];
      }

      await safeSupabaseOperation(() => supabase.from("users").update({
        membership_status: user.membershipStatus,
        membership_tier: user.membershipTier,
        membership_expiry: user.membershipExpiry
      }).eq("email", user.email), "Admin Approve User Membership Update");
    }

    await safeSupabaseOperation(() => supabase.from("renewals").update({
      status: "approved"
    }).eq("id", targetIdStr), "Admin Approve Renewal by id");

    await safeSupabaseOperation(() => supabase.from("renewals").update({
      status: "approved"
    }).eq("receipt_number", targetIdStr), "Admin Approve Renewal by receipt_number");

    res.json({ success: true, renewal, user });
  });

  app.post("/api/admin/renewals/:id/reject", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const targetIdStr = String(id);
    const renewal = renewals.find(r => String(r.id) === targetIdStr || String(r.receiptNumber) === targetIdStr);
    if (!renewal) {
      res.status(404).json({ error: "Renewal submission not found." });
      return;
    }

    renewal.status = "rejected";

    await safeSupabaseOperation(() => supabase.from("renewals").update({
      status: "rejected"
    }).eq("id", targetIdStr), "Admin Reject Renewal by id");

    await safeSupabaseOperation(() => supabase.from("renewals").update({
      status: "rejected"
    }).eq("receipt_number", targetIdStr), "Admin Reject Renewal by receipt_number");

    res.json({ success: true, renewal });
  });

  app.delete("/api/admin/renewals/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const targetIdStr = String(id);

    // Collect all matching renewals in memory
    const matchedRenewals = renewals.filter(r => 
      String(r.id) === targetIdStr || 
      String(r.receiptNumber) === targetIdStr || 
      String(r.transactionId) === targetIdStr ||
      String(r.utrNumber) === targetIdStr ||
      String(r.email) === targetIdStr
    );

    // Remove matching items from in-memory array
    for (let i = renewals.length - 1; i >= 0; i--) {
      const r = renewals[i];
      if (
        String(r.id) === targetIdStr || 
        String(r.receiptNumber) === targetIdStr || 
        String(r.transactionId) === targetIdStr ||
        String(r.utrNumber) === targetIdStr ||
        String(r.email) === targetIdStr
      ) {
        renewals.splice(i, 1);
      }
    }

    // Register deleted identifiers in memory
    deletedRenewalIds.add(targetIdStr);
    matchedRenewals.forEach(r => {
      if (r.id) deletedRenewalIds.add(String(r.id));
      if (r.receiptNumber) deletedRenewalIds.add(String(r.receiptNumber));
      if (r.transactionId) deletedRenewalIds.add(String(r.transactionId));
      if (r.utrNumber) deletedRenewalIds.add(String(r.utrNumber));
    });

    // Execute direct deletion and status updates in Supabase table
    try {
      // 1. Direct delete calls by id and receipt_number
      const d1 = await supabase.from("renewals").delete().eq("id", targetIdStr);
      if (d1.error) console.warn("[Supabase Delete renewal eq id] note:", d1.error.message);

      const d2 = await supabase.from("renewals").delete().eq("receipt_number", targetIdStr);
      if (d2.error) console.warn("[Supabase Delete renewal eq receipt_number] note:", d2.error.message);

      // 2. Fetch rows to delete any matching targetIdStr
      const { data: dbRows, error: fetchErr } = await supabase.from("renewals").select("*");
      if (!fetchErr && dbRows && Array.isArray(dbRows)) {
        const matchedDbRows = dbRows.filter((row: any) =>
          String(row.id || '') === targetIdStr ||
          String(row.receipt_number || '') === targetIdStr ||
          String(row.email || '').toLowerCase() === targetIdStr.toLowerCase()
        );

        for (const row of matchedDbRows) {
          if (row.id) deletedRenewalIds.add(String(row.id));
          if (row.receipt_number) deletedRenewalIds.add(String(row.receipt_number));

          if (row.id) {
            const delRes = await supabase.from("renewals").delete().eq("id", row.id);
            if (delRes.error) console.warn(`[Supabase Delete row.id ${row.id}] note:`, delRes.error.message);
            // Backup status update if RLS blocks DELETE in user's Supabase project
            await supabase.from("renewals").update({ status: "deleted" }).eq("id", row.id);
          }
          if (row.receipt_number) {
            const delRes2 = await supabase.from("renewals").delete().eq("receipt_number", row.receipt_number);
            if (delRes2.error) console.warn(`[Supabase Delete receipt_number ${row.receipt_number}] note:`, delRes2.error.message);
            await supabase.from("renewals").update({ status: "deleted" }).eq("receipt_number", row.receipt_number);
          }
        }
      }

      // 3. Fallback update status = 'deleted' on target key
      await supabase.from("renewals").update({ status: "deleted" }).eq("id", targetIdStr);
      await supabase.from("renewals").update({ status: "deleted" }).eq("receipt_number", targetIdStr);

    } catch (dbErr: any) {
      console.warn("[Supabase Delete Renewal Exception]:", dbErr?.message || dbErr);
    }

    res.json({ success: true, message: "Renewal submission permanently deleted from queue and database" });
  });

  // Get all published notices
  app.get("/api/notices", async (req, res) => {
    await syncWithSupabase();
    const publishedNotices = notices.filter(n => n.isPublished !== false);
    res.json({ notices: publishedNotices });
  });

  // Post a new notice (Admin only)
  app.post("/api/notices", (req, res) => {
    const adminHeader = (req.headers['x-admin-role'] || '').toString().toLowerCase().trim();
    const userEmail = (req.headers['x-user-email'] || req.body?.postedByEmail || '').toString().toLowerCase().trim();

    const userObj = users.find(u => u.email.toLowerCase() === userEmail);
    const isAdmin = adminHeader === 'admin' || (userObj && userObj.role === 'admin') || userEmail.includes('admin');
    if (!isAdmin) {
      res.status(403).json({ error: "Only administrators are authorized to create, edit, or delete notices." });
      return;
    }

    const { title, content, category, postedByEmail } = req.body;

    if (!title || !content || !category) {
      res.status(400).json({ error: "Title, content, and category are required." });
      return;
    }

    const emailToFind = userEmail || (postedByEmail || '').toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === emailToFind) || users.find(u => u.role === 'admin');

    const newNotice: AlumniNotice = {
      id: "notice_" + Date.now(),
      title: title.trim(),
      content: content.trim(),
      category: category as any,
      postedBy: {
        name: user ? user.name : "TBAAK Administrator",
        email: user ? user.email : "admin@taki.alumni",
        batchYear: user ? user.batchYear : 1988,
        avatarUrl: user ? user.avatarUrl : ""
      },
      postedAt: new Date().toISOString(),
      isPinned: false,
      isPublished: true
    };

    // Prepend new notice
    notices.unshift(newNotice);

    // Async write to Supabase
    safeSupabaseOperation(() => supabase.from("notices").upsert({
      id: newNotice.id,
      title: newNotice.title,
      content: newNotice.content,
      category: newNotice.category,
      posted_by: newNotice.postedBy,
      posted_at: newNotice.postedAt,
      is_pinned: false,
      is_published: true
    }), "Post Notice");
    
    res.status(201).json({ success: true, notice: newNotice });
  });

  // Get all events
  app.get("/api/events", (req, res) => {
    res.json({ events });
  });

  // Toggle Event RSVP
  app.post("/api/events/:id/rsvp", (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required to RSVP" });
      return;
    }

    const event = events.find(e => e.id === id);
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const emailLower = email.toLowerCase().trim();
    const index = event.rsvps.findIndex(r => r.toLowerCase() === emailLower);

    if (index === -1) {
      event.rsvps.push(emailLower);
    } else {
      event.rsvps.splice(index, 1);
    }

    res.json({ success: true, event });
  });

  // Get all gallery photos
  app.get("/api/gallery", async (req, res) => {
    await syncWithSupabase();
    res.json({ photos: galleryPhotos });
  });

  // Add new photo to the gallery
  app.post("/api/gallery", (req, res) => {
    const { title, url, description, tag, uploaderEmail } = req.body;

    if (!title || !url || !tag || !uploaderEmail) {
      res.status(400).json({ error: "Title, image URL, category tag, and uploader email are required." });
      return;
    }

    const user = users.find(u => u.email.toLowerCase() === uploaderEmail.toLowerCase());
    if (!user) {
      res.status(404).json({ error: "Uploader profile not found." });
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: "g" + (galleryPhotos.length + 1),
      url,
      title,
      description: description || "",
      tag: tag as any,
      uploadedBy: {
        name: user.name,
        email: user.email,
        batchYear: user.batchYear
      },
      uploadedAt: new Date().toISOString()
    };

    galleryPhotos.unshift(newPhoto); // Add to the beginning of the list

    safeSupabaseOperation(() => supabase.from("gallery_photos").upsert({
      id: newPhoto.id,
      title: newPhoto.title,
      url: newPhoto.url,
      description: newPhoto.description,
      tag: newPhoto.tag,
      media_type: newPhoto.mediaType || 'image',
      uploaded_by: newPhoto.uploadedBy,
      uploaded_at: newPhoto.uploadedAt
    }), "User Gallery Create");

    res.status(201).json({ success: true, photo: newPhoto });
  });

  // Committee Public & Admin Endpoints
  app.get("/api/committee", async (req, res) => {
    await syncWithSupabase();
    res.json({ committeeMembers });
  });

  app.get("/api/admin/committee", requireAdmin, async (req, res) => {
    await syncWithSupabase();
    res.json({ committeeMembers });
  });

  app.post("/api/admin/committee", requireAdmin, async (req, res) => {
    const { committeeType, category, roleTitle, name, batchYear, description, specialTag, displayOrder } = req.body;
    if (!name || !roleTitle) {
      res.status(400).json({ error: "Name and role title are required." });
      return;
    }

    const newMember: CommitteeMember = {
      id: "cm_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      committeeType: committeeType || 'executive',
      category: category || 'officer_leadership',
      roleTitle: String(roleTitle).trim(),
      name: String(name).trim(),
      batchYear: batchYear ? String(batchYear).trim() : '',
      description: description ? String(description).trim() : '',
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : committeeMembers.length + 1,
      specialTag: specialTag ? String(specialTag).trim() : ''
    };

    deletedCommitteeNames.delete(newMember.name);
    deletedCommitteeIds.delete(newMember.id);

    committeeMembers.push(newMember);

    await safeSupabaseOperation(() => supabase.from("committee_members").upsert({
      id: newMember.id,
      committee_type: newMember.committeeType,
      category: newMember.category,
      role_title: newMember.roleTitle,
      name: newMember.name,
      batch_year: newMember.batchYear,
      description: newMember.description,
      display_order: newMember.displayOrder,
      special_tag: newMember.specialTag
    }), "Admin Add Committee Member");

    res.status(201).json({ success: true, member: newMember });
  });

  app.put("/api/admin/committee/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const member = committeeMembers.find(m => String(m.id) === String(id));
    if (!member) {
      res.status(404).json({ error: "Committee member not found." });
      return;
    }

    const { committeeType, category, roleTitle, name, batchYear, description, specialTag, displayOrder } = req.body;
    if (committeeType !== undefined) member.committeeType = committeeType;
    if (category !== undefined) member.category = category;
    if (roleTitle !== undefined) member.roleTitle = String(roleTitle).trim();
    if (name !== undefined) member.name = String(name).trim();
    if (batchYear !== undefined) member.batchYear = String(batchYear).trim();
    if (description !== undefined) member.description = String(description).trim();
    if (specialTag !== undefined) member.specialTag = String(specialTag).trim();
    if (displayOrder !== undefined) member.displayOrder = Number(displayOrder);

    deletedCommitteeNames.delete(member.name);
    deletedCommitteeIds.delete(member.id);

    await safeSupabaseOperation(() => supabase.from("committee_members").upsert({
      id: member.id,
      committee_type: member.committeeType,
      category: member.category,
      role_title: member.roleTitle,
      name: member.name,
      batch_year: member.batchYear,
      description: member.description,
      display_order: member.displayOrder,
      special_tag: member.specialTag
    }), "Admin Update Committee Member");

    res.json({ success: true, member });
  });

  app.delete("/api/admin/committee/clear/all", requireAdmin, async (req, res) => {
    committeeMembers.forEach(m => {
      deletedCommitteeIds.add(String(m.id));
      if (m.name) deletedCommitteeNames.add(m.name);
    });
    committeeMembers.length = 0;

    await safeSupabaseOperation(async () => {
      await supabase.from("committee_members").delete().neq("id", "___not_matching___");
    }, "Admin Clear All Committee Members");

    res.json({ success: true, message: "All board members cleared." });
  });

  app.delete("/api/admin/committee/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const targetIdStr = String(id);
    const index = committeeMembers.findIndex(m => String(m.id) === targetIdStr);
    
    let deletedMember: CommitteeMember | null = null;
    if (index !== -1) {
      deletedMember = committeeMembers[index];
      committeeMembers.splice(index, 1);
    }

    deletedCommitteeIds.add(targetIdStr);
    if (deletedMember) {
      deletedCommitteeIds.add(String(deletedMember.id));
      if (deletedMember.name) deletedCommitteeNames.add(deletedMember.name);
    }

    const numMatch = targetIdStr.match(/\d+/);
    const numericId = numMatch ? parseInt(numMatch[0], 10) : null;

    await safeSupabaseOperation(async () => {
      await supabase.from("committee_members").delete().eq("id", targetIdStr);
      if (deletedMember?.id) {
        await supabase.from("committee_members").delete().eq("id", deletedMember.id);
      }
      if (numericId !== null && !isNaN(numericId)) {
        await supabase.from("committee_members").delete().eq("id", numericId);
      }
      if (deletedMember?.name) {
        await supabase.from("committee_members").delete().eq("name", deletedMember.name);
      }
    }, "Admin Delete Committee Member");

    res.json({ success: true, message: "Committee member deleted." });
  });

  // Root endpoint with API status and service directory
  app.get("/", (req, res) => {
    res.json({
      service: "Taki Boys Alumni Association Portal API",
      status: "online",
      port: PORT,
      timestamp: new Date().toISOString(),
      endpoints: {
        health: "/api/health",
        supabaseStatus: "/api/supabase/status",
        chat: "/api/chat/messages",
        directory: "/api/alumni/directory",
        notices: "/api/notices",
        announcements: "/api/announcements",
        events: "/api/events",
        gallery: "/api/gallery",
        plans: "/api/membership/plans",
        committee: "/api/committee"
      }
    });
  });

  // 404 handler for undefined API routes
  app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found on Taki Alumni API server" });
  });

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
