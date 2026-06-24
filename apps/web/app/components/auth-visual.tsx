import { BadgeCheck, Quote, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';

export function AuthVisual({ compact = false }: { compact?: boolean }) {
  return <aside className={`auth-visual ${compact?'compact':''}`}><Image src="/destinations/palawan.svg" fill alt="Palawan island illustration" sizes="50vw"/><div className="auth-visual-overlay"/><div className="auth-visual-top"><span><Sparkles size={17}/></span>Travel commerce, simplified.</div><div className="auth-quote"><Quote size={24}/><p>We finally have one place that looks as professional as the trips we sell.</p><div><span className="quote-avatar">MC</span><p><strong>Maria Cruz</strong><small><Star size={12} fill="currentColor"/> Verified travel operator</small></p><BadgeCheck size={20}/></div></div></aside>;
}
