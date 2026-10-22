import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Upload, FileText, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

interface VerificationModalProps {
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ onClose }) => {
  const { user, role, language, verificationDocs, submitVerificationDoc } = useApp();

  const [docType, setDocType] = useState<any>(
    role === 'owner' ? 'proof_of_ownership' : 'university_enrollment'
  );
  const [docNumber, setDocNumber] = useState('');
  const [fileName, setFileName] = useState('scanned_document.pdf');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber) return;

    submitVerificationDoc({
      userId: user?.id || 'user-tenant-1',
      userName: user?.name || 'Karim Hassan',
      userRole: role,
      documentType: docType,
      documentNumber: docNumber,
      fileName,
    });

    setSubmitted(true);
  };

  const userDocs = verificationDocs.filter((d) => d.userId === user?.id || d.userId === 'user-tenant-1');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#F8F4EC] rounded-3xl max-w-lg w-full border border-[#E9DDCC] shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E9DDCC]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#697A58]/15 text-[#697A58] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#34332F] font-serif">
                {language === 'ar' ? 'مركز التوثيق والأمان السكني' : 'Sakniya Trust & Verification Center'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {language === 'ar' ? 'بياناتك مشفرة ولا تظهر لأي مستخدم آخر' : 'Encrypted private document submission'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100">
            <X className="w-5 h-5 text-[#765541]" />
          </button>
        </div>

        {/* Existing Submitted Docs */}
        <div>
          <h4 className="text-xs font-bold uppercase text-[#765541] mb-2">
            {language === 'ar' ? 'حالة مستنداتك المرفوعة' : 'Your Submitted Documents'}
          </h4>
          <div className="space-y-2">
            {userDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-white rounded-2xl border border-[#E9DDCC] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#765541]" />
                  <div>
                    <span className="font-bold text-[#34332F] block capitalize">
                      {doc.documentType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{doc.documentNumber}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    doc.status === 'approved'
                      ? 'bg-[#697A58]/15 text-[#697A58]'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {doc.status === 'approved' ? (language === 'ar' ? 'معتمد' : 'Approved') : (language === 'ar' ? 'قيد المراجعة' : 'Pending')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* New Document Upload Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-2 border-t border-[#E9DDCC]">
            <h4 className="font-bold text-[#765541] uppercase text-xs">
              {language === 'ar' ? 'تقديم وثيقة جديدة للاعتماد' : 'Submit New Verification Document'}
            </h4>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">
                {language === 'ar' ? 'نوع المستند' : 'Document Type'}
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-medium"
              >
                {role === 'owner' ? (
                  <>
                    <option value="proof_of_ownership">{language === 'ar' ? 'عقد ملكية أو حجة الشهر العقاري' : 'Proof of Ownership (Deed)'}</option>
                    <option value="national_id">{language === 'ar' ? 'بطاقة الرقم القومي (سارية)' : 'Egyptian National ID'}</option>
                  </>
                ) : (
                  <>
                    <option value="university_enrollment">{language === 'ar' ? 'كارنيه الجامعة أو إثبات القيد' : 'University Student ID / Enrollment Card'}</option>
                    <option value="employment_letter">{language === 'ar' ? 'خطاب جهة العمل للموظفين' : 'Employment Letter for Professionals'}</option>
                    <option value="national_id">{language === 'ar' ? 'بطاقة الرقم القومي' : 'National ID'}</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">
                {language === 'ar' ? 'رقم المستند / الرقم القومي' : 'Document Identifier / National ID Number'}
              </label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="e.g. 29801011234567"
                className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-mono"
              />
            </div>

            <div className="p-4 border-2 border-dashed border-[#C47D60]/40 rounded-2xl bg-white text-center space-y-1">
              <Upload className="w-6 h-6 text-[#C47D60] mx-auto" />
              <p className="font-semibold text-stone-700">
                {language === 'ar' ? 'تم تجهيز ملف المستند الآمن' : 'File ready: document_scan.pdf'}
              </p>
              <p className="text-[10px] text-stone-400">PDF, JPG, PNG up to 10MB</p>
            </div>

            <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-600 flex items-start gap-2">
              <Lock className="w-4 h-4 text-[#697A58] shrink-0 mt-0.5" />
              <p>
                {language === 'ar'
                  ? 'يتم فحص الوثائق من قبل فريق الإدارة حصراً ولا يتم مشاركتها إطلاقاً مع المستأجرين أو الملاك الآخرين.'
                  : 'Documents are reviewed exclusively by administrators and never published publicly.'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#765541] hover:bg-[#604230] text-white font-bold rounded-xl shadow-md transition-colors"
            >
              {language === 'ar' ? 'إرسال المستند للمراجعة' : 'Submit for Verification'}
            </button>
          </form>
        ) : (
          <div className="p-4 bg-[#697A58]/10 rounded-2xl border border-[#697A58]/20 text-center space-y-2 text-xs">
            <CheckCircle2 className="w-8 h-8 text-[#697A58] mx-auto" />
            <p className="font-bold text-[#697A58]">
              {language === 'ar' ? 'تم استلام المستند بنجاح وهو قيد المراجعة الفورية' : 'Document received and pending admin review'}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[11px] text-[#765541] underline font-semibold"
            >
              {language === 'ar' ? 'رفع مستند إضافي' : 'Upload another document'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
