import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaTrashAlt, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const WHATSAPP_NUMBER = '254114963959'; // no +, no spaces

const REASONS = [
  'I no longer use the service',
  'Too expensive',
  'Missing features I need',
  'Privacy concerns',
  'Switching to another provider',
  'Created a duplicate account',
  'Other',
];

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  schoolName: '',
  role: '',
  reason: '',
  details: '',
  confirm: false,
};

const DeleteAccount = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Please enter your full name.';
    if (!form.email.trim()) errs.email = 'Please enter the email on your account.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.phone.trim()) errs.phone = 'Please enter your phone number.';
    if (!form.reason) errs.reason = 'Please select a reason.';
    if (!form.confirm) errs.confirm = 'You must acknowledge this action is permanent.';
    return errs;
  };

  const buildMessage = () => {
    return [
      '*ACCOUNT DELETION REQUEST*',
      '',
      `*Full Name:* ${form.fullName}`,
      `*Account Email:* ${form.email}`,
      `*Phone:* ${form.phone}`,
      form.schoolName ? `*School:* ${form.schoolName}` : null,
      form.role ? `*Role:* ${form.role}` : null,
      `*Reason:* ${form.reason}`,
      form.details ? `*Additional Details:* ${form.details}` : null,
      '',
      'I confirm I want my EduPriva account and all associated data permanently deleted.',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // focus the first error field
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    const message = buildMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Delete My Account — EduPriva</title>
        <meta
          name="description"
          content="Request permanent deletion of your EduPriva account. Submit your deletion request securely via WhatsApp."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Navbar />

      <main className="bg-navy-gradient min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center text-sky-300 hover:text-sky-200 text-sm mb-6"
          >
            <FaArrowLeft className="mr-2" size={12} /> Back to home
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-400/30 flex items-center justify-center">
                <FaTrashAlt className="text-red-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                Account Deletion Request
              </h1>
            </div>
            <p className="text-sky-100/70 text-sm md:text-base max-w-2xl">
              We're sorry to see you go. Fill in the form below and submit your request via
              WhatsApp. Our team will verify your identity and permanently delete your account
              and associated data within <strong className="text-sky-100">7 working days</strong>.
            </p>
          </div>

          {/* Warning */}
          <div className="mb-6 flex gap-3 p-4 rounded-xl bg-red-500/10 border border-red-400/30 text-sm text-red-100">
            <FaExclamationTriangle className="text-red-400 mt-0.5 shrink-0" />
            <p>
              <strong>This action is irreversible.</strong> All school data, student records,
              invoices, and files tied to your account will be permanently removed and cannot be
              recovered.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl bg-navy-900/60 border border-sky-500/20 p-8 text-center">
              <FaCheckCircle className="mx-auto text-4xl text-emerald-400 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">WhatsApp opened</h2>
              <p className="text-sky-100/70 text-sm mb-6">
                Please send the pre-filled message to complete your request. If WhatsApp didn't
                open,{' '}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-300 underline hover:text-sky-200"
                >
                  tap here
                </a>
                .
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm(initialForm);
                }}
                className="px-4 py-2 rounded-lg bg-sky-500 text-white text-sm font-semibold hover:bg-sky-400 transition"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl bg-navy-900/60 border border-sky-500/20 p-6 md:p-8 space-y-5"
            >
              <Field label="Full Name" htmlFor="fullName" error={errors.fullName} required>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={update('fullName')}
                  className={inputCls(errors.fullName)}
                  placeholder="e.g. Jane Doe"
                />
              </Field>

              <Field
                label="Account Email"
                htmlFor="email"
                error={errors.email}
                required
                hint="The email you use to sign in to EduPriva."
              >
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  className={inputCls(errors.email)}
                  placeholder="you@school.ac.ke"
                />
              </Field>

              <Field
                label="Phone Number"
                htmlFor="phone"
                error={errors.phone}
                required
                hint="Used to verify your identity via WhatsApp."
              >
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  className={inputCls(errors.phone)}
                  placeholder="+254 7XX XXX XXX"
                />
              </Field>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="School Name" htmlFor="schoolName" hint="Optional">
                  <input
                    id="schoolName"
                    type="text"
                    value={form.schoolName}
                    onChange={update('schoolName')}
                    className={inputCls()}
                    placeholder="e.g. Kilimani Primary"
                  />
                </Field>
                <Field label="Your Role" htmlFor="role" hint="Optional">
                  <select
                    id="role"
                    value={form.role}
                    onChange={update('role')}
                    className={inputCls()}
                  >
                    <option value="">Select…</option>
                    <option>Administrator</option>
                    <option>Teacher</option>
                    <option>Accountant</option>
                    <option>Parent / Guardian</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>

              <Field label="Reason for deletion" htmlFor="reason" error={errors.reason} required>
                <select
                  id="reason"
                  value={form.reason}
                  onChange={update('reason')}
                  className={inputCls(errors.reason)}
                >
                  <option value="">Select a reason…</option>
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Additional details"
                htmlFor="details"
                hint="Optional — anything else we should know?"
              >
                <textarea
                  id="details"
                  rows={3}
                  value={form.details}
                  onChange={update('details')}
                  className={inputCls()}
                  placeholder="Tell us more…"
                />
              </Field>

              <label className="flex items-start gap-3 text-sm text-sky-100/80 cursor-pointer">
                <input
                  id="confirm"
                  type="checkbox"
                  checked={form.confirm}
                  onChange={update('confirm')}
                  className="mt-1 h-4 w-4 rounded border-sky-500/40 bg-navy-950 text-sky-500 focus:ring-sky-500"
                />
                <span>
                  I understand this action is <strong className="text-white">permanent</strong>{' '}
                  and that all my school's data will be deleted and cannot be recovered.
                </span>
              </label>
              {errors.confirm && (
                <p className="text-xs text-red-400 -mt-2">{errors.confirm}</p>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold rounded-xl transition shadow-lg"
              >
                <FaWhatsapp size={20} /> Submit request via WhatsApp
              </button>

              <p className="text-[11px] text-sky-100/40 text-center">
                We will only process requests coming from the registered account holder.
              </p>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

const inputCls = (error) =>
  `w-full rounded-lg bg-navy-950/60 border px-3 py-2.5 text-sm text-white placeholder:text-sky-100/30 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
    error ? 'border-red-400/60' : 'border-sky-500/20'
  }`;

const Field = ({ label, htmlFor, error, hint, required, children }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-medium text-sky-100 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-sky-100/40 mt-1">{hint}</p>}
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

export default DeleteAccount;