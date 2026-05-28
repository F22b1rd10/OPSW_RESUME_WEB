import React, { useEffect, useState } from 'react';
import { Member, ResumeDetail } from '../types/resume';
import { getMemberSummaries, getResumeDetail } from '../api/resumeApi';
import MemberCard from './MemberCard';
import ResumeModal from './ResumeModal';
import CreateResumeModal from './CreateResumeModal';

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await getMemberSummaries();
      if (response.success) {
        setMembers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (id: number) => {
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const response = await getResumeDetail(id);
      if (response.success) {
        setSelectedResume(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch resume detail:', error);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg font-medium">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <header className="relative overflow-hidden py-20 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800/30 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30 mb-4">
            TALENT DIRECTORY
          </span>
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
            인재 이력서
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> 조회 서비스</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">최고의 인재를 한곳에서 확인하세요.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-lg shadow-purple-900/50 hover:shadow-purple-700/50 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            나의 이력서 만들기
          </button>
        </div>
      </header>

      {/* 카드 목록 */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        {members.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-400 text-xl font-medium">등록된 인재가 없습니다.</p>
            <p className="text-slate-600 mt-2">첫 번째 이력서를 등록해보세요!</p>
          </div>
        ) : (
          <>
            <p className="text-slate-400 text-sm mb-6">총 <span className="text-purple-400 font-bold">{members.length}명</span>의 인재가 등록되어 있습니다.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <ResumeModal
        resume={selectedResume}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loading={modalLoading}
      />
      <CreateResumeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={fetchMembers}
      />
    </div>
  );
};

export default MemberList;
