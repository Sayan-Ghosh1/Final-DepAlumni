import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  Download, 
  Phone, 
  User, 
  MapPin, 
  TrendingUp, 
  Check, 
  Building,
  Loader2,
  ShieldAlert,
  XCircle,
  CheckCircle2,
  Clock,
  Receipt,
  RotateCcw,
  FileText,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UserProfile, MembershipTier, MembershipStatus, MembershipPlan, RenewalSubmission } from '../types';
import MembershipCard from './MembershipCard';
import PaymentReceipt from './PaymentReceipt';

interface AlumniRenewalProps {
  user: UserProfile | null;
  onRenewalSuccess: (updatedUser: UserProfile) => void;
}

export default function AlumniRenewal({ user, onRenewalSuccess }: AlumniRenewalProps) {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(MembershipTier.ANNUAL);

  const [myRenewals, setMyRenewals] = useState<RenewalSubmission[]>([]);
  const [loadingRenewals, setLoadingRenewals] = useState(true);

  const [phone, setPhone] = useState(user?.phone || '');
  const [billingAddress, setBillingAddress] = useState(user?.location || 'Kolkata, West Bengal, India');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  
  // Payment gateway simulation states
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [utrNumber, setUtrNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [txDetails, setTxDetails] = useState<any>(null);
  const [simulatedLog, setSimulatedLog] = useState('');
  const [isCardOpen, setIsCardOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
    if (user?.email) {
      fetchMyRenewals();
    } else {
      setLoadingRenewals(false);
    }
  }, [user?.email]);

  const fetchMyRenewals = async () => {
    if (!user?.email) {
      setLoadingRenewals(false);
      return;
    }
    try {
      setLoadingRenewals(true);
      const res = await fetch(`/api/membership/my-renewals?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setMyRenewals(data.renewals || []);
      }
    } catch (err) {
      console.error('Error fetching user renewals:', err);
    } finally {
      setLoadingRenewals(false);
    }
  };

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);
      const res = await fetch('/api/membership/plans');
      if (res.ok) {
        const data = await res.json();
        const fetchedPlans: MembershipPlan[] = data.plans || [];
        setPlans(fetchedPlans);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoadingPlans(false);
    }
  };

  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const activeAmount = selectedPlan ? selectedPlan.fee : 0;

  const handleStartPayment = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !selectedPlan) {
      alert('Please select a membership plan before proceeding with payment.');
      return;
    }
    setPaymentStep('processing');
    setSimulatedLog('Contacting Association Gateway...');

    // Simulate payment processing logs for visual craft
    setTimeout(() => {
      setSimulatedLog('Authenticating with Sealdah SBI Ingress Router...');
    }, 800);

    setTimeout(() => {
      setSimulatedLog('Securing digital certificate & validating token...');
    }, 1600);

    setTimeout(() => {
      setSimulatedLog('Finalizing alumni ledger entry...');
    }, 2400);

    setTimeout(async () => {
      try {
        const response = await fetch('/api/membership/renew', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email || 'guest@tbaak.org',
            tier: selectedPlan?.tier || selectedTier,
            planId: selectedPlanId,
            planName: selectedPlan?.name,
            paymentMethod,
            billingAddress,
            amount: activeAmount,
            utrNumber,
            transactionId,
            phone
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTxDetails(data.submission);
          if (data.user) {
            onRenewalSuccess(data.user);
          }
          fetchMyRenewals();
          setPaymentStep('success');
        } else {
          setPaymentStep('form');
          alert('Simulated transaction failed. Please try again.');
        }
      } catch (err) {
        console.error(err);
        setPaymentStep('form');
      }
    }, 3200);
  };

  return (
    <div className="space-y-8" id="alumni-renewal-page">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0D5230] flex items-center gap-2 font-serif uppercase tracking-tight">
          <TrendingUp className="h-6 w-6 text-[#0D5230]" />
          <span>Membership Renewal Portal</span>
        </h2>
        <p className="text-slate-700 text-sm mt-1">
          Support your alma mater, obtain voting rights, and maintain your active alumnus standing in our digital registry in our school colors.
        </p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Step 1: Membership Tier Form */}
        {paymentStep === 'form' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            key="step-form"
          >
            {/* USER RENEWAL APPLICATION STATUS SECTION */}
            {!loadingRenewals && myRenewals.length > 0 && (
              <div className="col-span-1 lg:col-span-3 space-y-4 mb-2">
                {myRenewals[0].status === 'rejected' && (
                  <div className="bg-red-50 border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,0.2)] p-6 font-sans text-left space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-200 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 bg-red-700 text-white flex items-center justify-center font-bold shrink-0">
                          <XCircle className="h-7 w-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif font-black text-red-900 text-lg uppercase tracking-tight">
                              Membership Renewal Rejected
                            </h3>
                            <span className="px-2.5 py-0.5 bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                              REJECTED BY ADMIN
                            </span>
                          </div>
                          <p className="text-xs text-red-700 font-medium">
                            Submitted on {new Date(myRenewals[0].submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-l-4 border-red-600 p-4 space-y-2 text-xs font-serif text-slate-800 shadow-2xs">
                      <p className="font-bold text-red-800 flex items-center gap-1.5 text-sm">
                        <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                        <span>Administrator Verification Note:</span>
                      </p>
                      <p className="text-slate-700 leading-relaxed font-sans pl-1">
                        {myRenewals[0].rejectionReason || 'Your payment details or UTR/UPI reference number could not be verified in the Association bank ledger. Please double check your payment receipt and resubmit your renewal application below with valid details.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-red-100/60 p-3 text-xs font-sans border border-red-300/60">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Tier Applied</span>
                        <span className="font-bold text-slate-900">{myRenewals[0].tier}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Amount</span>
                        <span className="font-bold text-[#0D5230]">₹{myRenewals[0].amount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">UTR / Ref #</span>
                        <span className="font-mono font-semibold text-slate-900">{myRenewals[0].utrNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Receipt ID</span>
                        <span className="font-mono font-semibold text-slate-900">{myRenewals[0].receiptNumber}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('renewal-form-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        <RotateCcw className="h-4 w-4 text-amber-300" />
                        <span>Resubmit Payment Details Below</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTxDetails(myRenewals[0]);
                          setPaymentStep('success');
                        }}
                        className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-800 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Receipt className="h-4 w-4 text-slate-600" />
                        <span>View Submitted Receipt</span>
                      </button>
                    </div>
                  </div>
                )}

                {myRenewals[0].status === 'pending' && (
                  <div className="bg-amber-50 border-2 border-amber-600 shadow-[4px_4px_0px_0px_rgba(217,119,6,0.2)] p-6 font-sans text-left space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
                          <Clock className="h-7 w-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif font-black text-amber-900 text-lg uppercase tracking-tight">
                              Application Pending Approval
                            </h3>
                            <span className="px-2.5 py-0.5 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                              PENDING VERIFICATION
                            </span>
                          </div>
                          <p className="text-xs text-amber-800 font-medium">
                            Submitted on {new Date(myRenewals[0].submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 font-serif leading-relaxed">
                      Your payment details have been logged in the Sealdah Alumni Association Registry. Executive officers are reviewing bank transactions and will update your standing shortly.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-100/60 p-3 text-xs font-sans border border-amber-300/60">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Tier Applied</span>
                        <span className="font-bold text-slate-900">{myRenewals[0].tier}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Amount Paid</span>
                        <span className="font-bold text-[#0D5230]">₹{myRenewals[0].amount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">UTR / Ref #</span>
                        <span className="font-mono font-semibold text-slate-900">{myRenewals[0].utrNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Receipt ID</span>
                        <span className="font-mono font-semibold text-slate-900">{myRenewals[0].receiptNumber}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setTxDetails(myRenewals[0]);
                          setPaymentStep('success');
                        }}
                        className="px-5 py-2.5 bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        <Receipt className="h-4 w-4 text-amber-300" />
                        <span>View / Download Submitted Receipt</span>
                      </button>
                    </div>
                  </div>
                )}

                {myRenewals[0].status === 'approved' && (
                  <div className="bg-[#F0F7F4] border-2 border-[#0D5230] shadow-[4px_4px_0px_0px_rgba(13,82,48,0.2)] p-6 font-sans text-left space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0D5230]/20 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 bg-[#0D5230] text-white flex items-center justify-center font-bold shrink-0">
                          <CheckCircle2 className="h-7 w-7 text-emerald-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif font-black text-[#0D5230] text-lg uppercase tracking-tight">
                              Active Member Standing
                            </h3>
                            <span className="px-2.5 py-0.5 bg-[#0D5230] text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                              VERIFIED & APPROVED
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium">
                            Approved on {new Date(myRenewals[0].submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 text-xs font-sans border border-[#0D5230]/20">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Tier</span>
                        <span className="font-bold text-[#0D5230]">{myRenewals[0].tier}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Amount</span>
                        <span className="font-bold text-slate-900">₹{myRenewals[0].amount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Receipt ID</span>
                        <span className="font-mono font-semibold text-slate-900">{myRenewals[0].receiptNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Expiry</span>
                        <span className="font-semibold text-slate-900">{user?.membershipExpiry || 'Active'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setTxDetails(myRenewals[0]);
                          setPaymentStep('success');
                        }}
                        className="px-4 py-2.5 bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        <Receipt className="h-4 w-4 text-amber-300" />
                        <span>View Official Payment Receipt</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* All Submissions History Table */}
                {myRenewals.length > 1 && (
                  <div className="bg-white border-2 border-[#0D5230]/30 p-5 font-sans text-left space-y-3 rounded-none shadow-xs">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-serif font-black text-sm uppercase tracking-wide text-[#0D5230] flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>All Renewal Submissions & Receipts History</span>
                      </h4>
                      <span className="text-xs text-slate-500 font-sans font-normal">({myRenewals.length} transactions)</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-[#F0F7F4] border-b border-[#0D5230]/20 text-[#0D5230] uppercase tracking-wider font-bold text-[10px]">
                            <th className="p-2.5">Date</th>
                            <th className="p-2.5">Receipt #</th>
                            <th className="p-2.5">Tier</th>
                            <th className="p-2.5">Amount</th>
                            <th className="p-2.5">UTR / Txn ID</th>
                            <th className="p-2.5">Status</th>
                            <th className="p-2.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-sans">
                          {myRenewals.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50">
                              <td className="p-2.5 text-slate-600 font-mono">
                                {new Date(r.submittedAt).toLocaleDateString()}
                              </td>
                              <td className="p-2.5 font-mono font-semibold text-slate-900">{r.receiptNumber}</td>
                              <td className="p-2.5 font-bold text-[#0D5230]">{r.tier}</td>
                              <td className="p-2.5 font-bold text-slate-900">₹{r.amount}</td>
                              <td className="p-2.5 font-mono text-slate-600">{r.utrNumber || r.transactionId || 'N/A'}</td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                                  r.status === 'approved'
                                    ? 'bg-emerald-700 text-white'
                                    : r.status === 'rejected'
                                      ? 'bg-red-700 text-white'
                                      : 'bg-amber-600 text-white'
                                }`}>
                                  {r.status}
                                </span>
                              </td>
                              <td className="p-2.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTxDetails(r);
                                    setPaymentStep('success');
                                  }}
                                  className="px-2.5 py-1 bg-[#0D5230] text-white hover:bg-[#0A4025] text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                                >
                                  Receipt
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Left: Tiers Selection */}
            <div className="lg:col-span-2 space-y-6" id="renewal-form-section">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D5230] flex items-center justify-between">
                <span>1. Select Membership Plan</span>
                {plans.length > 0 && <span className="text-[10px] text-slate-500 font-normal font-sans">({plans.length} available)</span>}
              </h3>

              {loadingPlans ? (
                <div className="bg-white border-2 border-[#0D5230]/20 p-8 text-center space-y-2 rounded">
                  <Loader2 className="h-6 w-6 text-[#0D5230] animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 font-serif">Loading latest membership plans from association registry...</p>
                </div>
              ) : plans.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-[#0D5230]/30 p-8 text-center rounded space-y-2">
                  <ShieldAlert className="h-10 w-10 text-[#0D5230]/40 mx-auto" />
                  <h4 className="font-serif font-black text-[#0D5230] text-sm">No Active Membership Plans</h4>
                  <p className="text-xs text-slate-500 font-sans max-w-md mx-auto">
                    No active membership tiers have been published yet by the administration. Plans created in the Admin Panel will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const benefitsList = Array.isArray(plan.benefits) 
                      ? plan.benefits 
                      : (typeof plan.benefits === 'string' ? JSON.parse(plan.benefits) : []);

                    return (
                      <div 
                        key={plan.id}
                        onClick={() => {
                          if (selectedPlanId === plan.id) {
                            setSelectedPlanId('');
                          } else {
                            setSelectedPlanId(plan.id);
                            setSelectedTier(plan.tier);
                          }
                        }}
                        className={`p-5 border-2 text-left cursor-pointer transition-all relative flex flex-col justify-between rounded-none ${
                          isSelected 
                            ? 'bg-white border-[#0D5230] shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)]' 
                            : 'bg-white border-slate-200 hover:border-[#0D5230] hover:bg-green-50/10'
                        }`}
                      >
                        {plan.isPopular && (
                          <span className="absolute top-3 right-3 bg-[#0D5230] text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded-none uppercase tracking-wider">
                            Recommended
                          </span>
                        )}

                        <div className="space-y-2">
                          <span className={`text-xs font-sans font-bold tracking-wider uppercase ${isSelected ? 'text-[#0D5230]' : 'text-slate-500'}`}>
                            {plan.name}
                          </span>
                          
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-serif font-black text-[#0D5230]">₹{plan.fee}</span>
                            <span className="text-xs text-slate-500 font-mono">
                              / {plan.durationYears === 0 ? 'one-time lifetime' : plan.durationYears === 1 ? 'per year' : `${plan.durationYears} years`}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-normal font-sans">{plan.description}</p>
                        </div>

                        {benefitsList.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-[#0D5230]/10 space-y-2 text-xs font-sans">
                            {benefitsList.map((feat: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-slate-700">
                                <Check className="h-3.5 w-3.5 text-[#0D5230] shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Checkout Details */}
            <div className="bg-white border-2 border-[#0D5230] p-6 h-fit space-y-6 rounded-none shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
              <h3 className="text-md font-bold text-[#0D5230] border-b border-[#0D5230]/20 pb-3 flex items-center gap-2 font-serif uppercase tracking-tight">
                <CreditCard className="h-4 w-4 text-[#0D5230]" />
                <span>2. Billing & Settlement</span>
              </h3>

              <form onSubmit={handleStartPayment} className="space-y-4">
                
                {/* Current Profile Summary */}
                <div className="p-3 bg-[#F0F7F4] border border-[#0D5230]/20 text-xs space-y-1.5 font-sans">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ex-Student:</span>
                    <span className="font-bold text-[#1A1A1A]">{user?.name || 'Guest Alumnus'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch Year:</span>
                    <span className="text-[#1A1A1A] font-mono font-bold">{user?.batchYear || '---'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Primary Email:</span>
                    <span className="text-[#1A1A1A] font-mono font-bold">{user?.email || 'Not logged in'}</span>
                  </div>
                </div>

                {/* Input fields */}
                <div className="font-sans">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#0D5230]/50" />
                    <input 
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98300 12345"
                      className="w-full bg-white border border-[#0D5230]/30 py-2 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#0D5230] focus:border-[#0D5230] transition-colors rounded-none font-mono"
                    />
                  </div>
                </div>

                <div className="font-sans">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Billing Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[#0D5230]/50" />
                    <input 
                      type="text"
                      required
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      placeholder="e.g. Salt Lake, Kolkata"
                      className="w-full bg-white border border-[#0D5230]/30 py-2 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#0D5230] focus:border-[#0D5230] transition-colors rounded-none"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="font-sans">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded-none border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'UPI' 
                          ? 'bg-[#0D5230] text-white border-[#0D5230]' 
                          : 'bg-[#F0F7F4] text-[#0D5230] border-[#0D5230]/30 hover:border-[#0D5230]'
                      }`}
                    >
                      UPI / GPay / BHIM
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('Bank')}
                      className={`p-2.5 rounded-none border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'Bank' 
                          ? 'bg-[#0D5230] text-white border-[#0D5230]' 
                          : 'bg-[#F0F7F4] text-[#0D5230] border-[#0D5230]/30 hover:border-[#0D5230]'
                      }`}
                    >
                      Bank Details
                    </button>
                  </div>
                </div>

                {/* Payment detail view */}
                {paymentMethod === 'UPI' ? (
                  <div className="font-sans space-y-2 text-center bg-[#F0F7F4] p-3 border border-[#0D5230]/20 rounded-none">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">
                      Scan Official UPI QR Code
                    </label>
                    <div className="flex justify-center my-2">
                      <img 
                        src="https://mxuiikbyhwuzaljajbjo.supabase.co/storage/v1/object/public/upi%20qr/upi_1786442969691.png" 
                        alt="TBAAK Official Payment UPI QR Code" 
                        referrerPolicy="no-referrer"
                        className="w-48 h-48 object-contain bg-white p-2 border-2 border-[#0D5230] shadow-sm mx-auto"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Scan using Google Pay, PhonePe, Paytm, or any UPI app to make payment.
                    </p>
                  </div>
                ) : (
                  <div className="font-sans bg-[#F0F7F4] p-4 border border-[#0D5230]/30 space-y-3 rounded-none">
                    <div className="flex items-center gap-2 border-b border-[#0D5230]/20 pb-2">
                      <Building className="h-4 w-4 text-[#0D5230]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0D5230]">
                        Official Association Bank Account
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 font-semibold block">Account Name</span>
                        <span className="font-bold text-[#1A1A1A] font-serif tracking-tight">
                          TAKI BOYS ALUMNI ASSOCIATION KOLKATA
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/80">
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 font-semibold block">Bank Name</span>
                          <span className="font-semibold text-slate-800">State Bank of India</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 font-semibold block">Account Type</span>
                          <span className="font-semibold text-slate-800">Current Account</span>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-slate-200/80">
                        <span className="text-[10px] uppercase text-slate-500 font-semibold block">Current A/c No.</span>
                        <span className="font-mono font-bold text-[#0D5230] text-sm tracking-wider select-all">
                          38344801883
                        </span>
                      </div>

                      <div className="pt-1 border-t border-slate-200/80">
                        <span className="text-[10px] uppercase text-slate-500 font-semibold block">IFSC Code</span>
                        <span className="font-mono font-bold text-[#0D5230] text-sm tracking-wider select-all">
                          SBIN0003084
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-600 font-medium italic pt-1 border-t border-[#0D5230]/15">
                      Please initiate NEFT/RTGS/IMPS transfer to the account above and complete your submission.
                    </p>
                  </div>
                )}

                {/* Transaction Reference Verification Inputs */}
                <div className="font-sans space-y-3 bg-[#F0F7F4] p-3.5 border border-[#0D5230]/30 rounded-none">
                  <div className="border-b border-[#0D5230]/20 pb-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230]">
                      Payment Verification Details
                    </label>
                    <p className="text-[10px] text-slate-600 font-medium leading-tight">
                      Please provide your payment reference details so the executive admin team can verify and approve your status.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">
                      UPI / UTR Number <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 423456789012 or 12-digit UTR No."
                      className="w-full bg-white border border-[#0D5230]/30 py-2 px-3 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#0D5230] focus:border-[#0D5230] transition-colors rounded-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">
                      Transaction ID <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. TXN9876543210 or Bank Reference ID"
                      className="w-full bg-white border border-[#0D5230]/30 py-2 px-3 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#0D5230] focus:border-[#0D5230] transition-colors rounded-none font-mono"
                    />
                  </div>
                </div>

                {/* Total Cost Display */}
                <div className="pt-3 border-t border-[#0D5230]/15 flex items-center justify-between font-sans">
                  <span className="text-sm font-semibold text-slate-700">Total Contribution:</span>
                  <span className="text-xl font-serif font-black text-[#0D5230]">₹{activeAmount}</span>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold py-3 px-4 rounded-none text-xs flex items-center justify-center gap-2 uppercase tracking-widest transition-all cursor-pointer border border-[#0D5230] mt-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Process Renewal Payment</span>
                </button>
              </form>

              <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5 font-sans">
                <Building className="h-3 w-3 text-green-800" />
                <span>Verified by Taki Boys Executive Committee</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment Gateway Loader (Visual Craft) */}
        {paymentStep === 'processing' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto bg-white border-2 border-[#0D5230] p-8 text-center space-y-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)] rounded-none relative overflow-hidden"
            key="step-processing"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-[#0D5230] animate-pulse" />
            
            <div className="inline-block relative">
              <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-[#0D5230] animate-spin"></div>
              <CreditCard className="h-6 w-6 text-slate-800 absolute inset-0 m-auto animate-bounce" />
            </div>

            <div className="space-y-2 font-sans">
              <h3 className="text-lg font-black uppercase text-[#0D5230]">Authorizing Settlement</h3>
              <p className="text-xs text-slate-600">Handshaking with SBI Ingress digital gateway. Please wait... do not exit.</p>
            </div>

            {/* Dynamic Console Log Log */}
            <div className="p-3 bg-[#F0F7F4] border border-[#0D5230]/30 text-left font-mono text-[10px] text-[#0D5230] min-h-[50px] flex items-center">
              <span>{`> ${simulatedLog}`}</span>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success & Printable Receipt Generator */}
        {paymentStep === 'success' && txDetails && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
            key="step-success"
          >
            <PaymentReceipt
              receiptNumber={txDetails.receiptNumber || `PAY-2026-${Math.floor(100000 + Math.random() * 900000)}`}
              user={user}
              planName={selectedPlan?.name || txDetails.tier || selectedTier}
              paymentMethod={txDetails.paymentMethod || paymentMethod}
              amount={txDetails.amount || activeAmount}
              transactionId={txDetails.transactionId || transactionId}
              utrNumber={txDetails.utrNumber || utrNumber}
              paymentDate={new Date(txDetails.submittedAt || Date.now()).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
              billingAddress={txDetails.billingAddress || billingAddress}
              status={txDetails.status}
              rejectionReason={txDetails.rejectionReason}
              onGenerateNew={() => {
                setPaymentStep('form');
                setUtrNumber('');
                setTransactionId('');
                fetchMyRenewals();
              }}
            />
          </motion.div>
        )}

      </AnimatePresence>

      {user && <MembershipCard user={user} isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} />}
    </div>
  );
}
