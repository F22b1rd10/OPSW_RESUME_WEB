import React, { useState } from 'react';
import { createResume } from '../api/resumeApi';

interface CreateResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
      {label} {required && <span className="text-pink-400">*</span>}
    </label>
    {children}
  </div>
);

const inputClass = "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all";

const CreateResumeModal: React.FC<CreateResumeModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: '', profile_image_url: '', short_introduction: '',
    tech_stacks: '', education: '', experience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('이름은 필수입니다.'); return; }
    setLoading(true);
    setError('');
    try {
      await createResume(form);
      onCreated();
      onClose();
      setForm({ name: '', profile_image_url: '', short_introduction: '', tech_stacks: '', education: '', experience: '' });
    } catch {
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
        {/* 헤더 */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm px-6 py-4 border-b border-slate-700/50 flex justify-between items-center rounded-t-3xl z-10">
          <div>
            <h2 className="text-lg font-bold text-white">나의 이력서 만들기</h2>
            <p className="text-slate-500 text-xs mt-0.5">정보를 입력하고 등록하세요</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="이름" required>
              <input name="name" value={form.name} onChange={handleChange}
                className={inputClass} placeholder="홍길동" />
            </Field>
            <Field label="프로필 이미지 URL">
              <input name="profile_image_url" value={form.profile_image_url} onChange={handleChange}
                className={inputClass} placeholder="https://..." />
            </Field>
          </div>

          <Field label="한 줄 소개">
            <input name="short_introduction" value={form.short_introduction} onChange={handleChange}
              className={inputClass} placeholder="저는 ..." />
          </Field>

          <Field label="보유 기술">
            <textarea name="tech_stacks" value={form.tech_stacks} onChange={handleChange} rows={3}
              className={`${inputClass} resize-none`} placeholder="Python, React, PostgreSQL ..." />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="학력 사항">
              <textarea name="education" value={form.education} onChange={handleChange} rows={3}
                className={`${inputClass} resize-none`} placeholder="OO대학교 컴퓨터공학과 졸업" />
            </Field>
            <Field label="주요 경력">
              <textarea name="experience" value={form.experience} onChange={handleChange} rows={3}
                className={`${inputClass} resize-none`} placeholder="OO회사 백엔드 개발자 (2021~)" />
            </Field>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 text-red-400 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium">
              취소
            </button>
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/40">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  저장 중...
                </span>
              ) : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResumeModal;
