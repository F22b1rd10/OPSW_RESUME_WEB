import React from 'react';
import { ResumeDetail } from '../types/resume';

interface ResumeModalProps {
  resume: ResumeDetail | null;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

const Section: React.FC<{ icon: string; title: string; content?: string | null }> = ({ icon, title, content }) => (
  <section>
    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
      <span>{icon}</span> {title}
    </h4>
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
      {content || <span className="text-slate-500 italic">정보 없음</span>}
    </div>
  </section>
);

const ResumeModal: React.FC<ResumeModalProps> = ({ resume, isOpen, onClose, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
        {/* 헤더 */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm px-6 py-4 border-b border-slate-700/50 flex justify-between items-center rounded-t-3xl z-10">
          <h2 className="text-lg font-bold text-white">이력서 상세</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400">불러오는 중...</p>
            </div>
          ) : resume ? (
            <div className="space-y-6">
              {/* 프로필 */}
              <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-purple-900/40 to-pink-900/20 rounded-2xl border border-purple-700/30">
                <img
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/40 flex-shrink-0"
                  src={resume.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(resume.name)}&background=7c3aed&color=fff&size=200`}
                  alt={resume.name}
                />
                <div>
                  <h3 className="text-2xl font-extrabold text-white">{resume.name}</h3>
                  <p className="text-purple-300 mt-1 text-sm">{resume.short_introduction}</p>
                </div>
              </div>

              {/* 섹션들 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Section icon="💻" title="보유 기술" content={resume.tech_stacks} />
                <Section icon="🎓" title="학력 사항" content={resume.education} />
              </div>
              <Section icon="💼" title="주요 경력" content={resume.experience} />
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">데이터를 불러올 수 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
