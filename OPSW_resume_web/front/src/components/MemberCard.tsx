import React from 'react';
import { Member } from '../types/resume';

interface MemberCardProps {
  member: Member;
  onClick: (id: number) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
  return (
    <div
      className="group relative bg-slate-800/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/40"
      onClick={() => onClick(member.id)}
    >
      {/* 이미지 */}
      <div className="relative h-52 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={member.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=7c3aed&color=fff&size=200`}
          alt={member.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
      </div>

      {/* 정보 */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
          {member.short_introduction || '소개가 없습니다.'}
        </p>
      </div>

      {/* 호버 시 보기 버튼 */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="inline-flex items-center gap-1 text-xs text-purple-400 font-semibold">
          상세보기
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default MemberCard;
