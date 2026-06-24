'use client';

import { Bell, CalendarPlus, ChevronDown, Filter, ImagePlus, MoreHorizontal, Plus, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { DashboardShell } from '../../components/dashboard-shell';
import { apiRequest } from '../../lib/api';

type Membership = { organization: { id: string; name: string } };
type Tour = { id: string; name: string; destination: string; durationDays: number; status: string; departures: unknown[] };

export default function ToursPage() {
  const [organization, setOrganization] = useState<Membership['organization'] | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function loadTours(organizationId: string) { setTours(await apiRequest<Tour[]>(`/operator/organizations/${organizationId}/products`)); }
  useEffect(() => { apiRequest<Membership[]>('/operator/organizations').then(async items => { const current=items[0]?.organization; if(!current)return; setOrganization(current); await loadTours(current.id); }).catch(reason=>setError(reason instanceof Error?reason.message:'Unable to load tours')); }, []);

  async function createTour(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(!organization)return; const form=event.currentTarget; const data=new FormData(form); setError('');
    try { await apiRequest(`/operator/organizations/${organization.id}/products`, { method:'POST', body:JSON.stringify({name:data.get('name'),slug:data.get('slug'),destination:data.get('destination'),durationDays:Number(data.get('durationDays')),summary:data.get('summary'),description:data.get('description')}) }); form.reset(); setShowForm(false); await loadTours(organization.id); }
    catch(reason){ setError(reason instanceof Error?reason.message:'Unable to create tour'); }
  }

  return <DashboardShell active="Tours" businessName={organization?.name}>
    <header className="dash-topbar"><div className="dash-search"><Search size={18}/><input placeholder="Search tours…"/><kbd>⌘ K</kbd></div><div className="dash-top-actions"><button className="icon-button notification-button"><Bell size={19}/><i/></button><span className="top-avatar">AR</span></div></header>
    <div className="dash-page tours-page">
      <div className="dash-page-heading"><div><span className="welcome-label">PRODUCTS</span><h1>Tours & packages</h1><p>Create, publish, and manage the experiences your customers can book.</p></div><button className="button button-dark" onClick={()=>setShowForm(!showForm)}><Plus size={18}/>{showForm?'Close form':'Create new tour'}</button></div>
      <div className="tour-summary-row"><div><strong>{tours.length}</strong><span>Total tours</span></div><div><strong>{tours.filter(t=>t.status==='PUBLISHED').length}</strong><span>Published</span></div><div><strong>{tours.reduce((sum,t)=>sum+t.departures.length,0)}</strong><span>Upcoming departures</span></div><div className="tour-tip"><Sparkles size={19}/><p><strong>Quick tip</strong><span>Tours with 5+ photos get more inquiries.</span></p></div></div>

      {showForm && <form className="panel create-tour-panel" onSubmit={createTour}><div className="form-panel-head"><div><span className="form-number">01</span><div><h3>Tour basics</h3><p>Add the details customers see first.</p></div></div><button type="button" className="button button-ghost" onClick={()=>setShowForm(false)}>Cancel</button></div><div className="create-tour-grid"><label className="image-drop"><ImagePlus size={28}/><strong>Add cover photo</strong><span>SVG, PNG or JPG · max 5MB</span></label><div className="form-fields"><label>Tour name<input name="name" placeholder="e.g. El Nido Island Escape" required/></label><div className="form-row"><label>URL slug<input name="slug" placeholder="el-nido-escape" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required/></label><label>Destination<input name="destination" placeholder="El Nido, Palawan" required/></label></div><div className="form-row"><label>Duration<input name="durationDays" type="number" min="1" max="365" placeholder="4" required/></label><label>Category<select defaultValue="island"><option value="island">Island escape</option><option value="adventure">Adventure</option><option value="culture">Culture</option></select></label></div><label>Short summary<textarea name="summary" minLength={10} maxLength={300} placeholder="A clear one-line reason to book this tour." required/></label><label>Full description<textarea name="description" minLength={30} placeholder="Describe the itinerary, inclusions, and experience." required/></label></div></div>{error&&<p className="form-error">{error}</p>}<div className="form-actions"><button type="button" className="button button-ghost">Save as draft</button><button className="button button-dark">Create tour <CalendarPlus size={17}/></button></div></form>}

      <section className="panel tour-management-panel"><div className="tour-toolbar"><div className="segmented"><button className="active">All tours <span>{tours.length}</span></button><button>Published <span>{tours.filter(t=>t.status==='PUBLISHED').length}</span></button><button>Drafts <span>{tours.filter(t=>t.status==='DRAFT').length}</span></button></div><div><button className="toolbar-button"><Filter size={16}/> Filter</button><button className="toolbar-button"><SlidersHorizontal size={16}/> Sort <ChevronDown size={14}/></button></div></div>
        {tours.length===0?<div className="empty-tours"><span><ImagePlus size={32}/></span><h3>Your tour catalog starts here</h3><p>Create your first package, add departure dates, then publish it to your branded storefront.</p><button className="button button-dark" onClick={()=>setShowForm(true)}><Plus size={17}/> Create first tour</button></div>:<div className="tour-admin-list">{tours.map((tour,index)=><article key={tour.id}><div className={`tour-thumb thumb-${index%3}`}><span>{tour.name.slice(0,2).toUpperCase()}</span></div><div className="tour-admin-info"><span className={`status-pill ${tour.status.toLowerCase()}`}>{tour.status}</span><h3>{tour.name}</h3><p>{tour.destination} · {tour.durationDays} days</p></div><div><small>DEPARTURES</small><strong>{tour.departures.length}</strong></div><div><small>STARTING FROM</small><strong>Not set</strong></div><button className="icon-button"><MoreHorizontal size={18}/></button></article>)}</div>}
      </section>
    </div>
  </DashboardShell>;
}
