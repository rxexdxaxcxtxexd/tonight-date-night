import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { invitations } from './data'
import { privateRoundCards } from './intimacy'
import type { Energy, Invitation, Keepsake, LocationMode, OccasionDraft, SelectionMode, SurpriseLevel } from './types'
import './styles.css'

type Screen = 'home' | 'play' | 'together-match' | 'detail' | 'active' | 'keepsakes' | 'backstage' | 'after-hours'
type AuthIdentity={email:string,role:'luke'|'ava',csrf_token:string}
type AuthLoad={status:'loading'|'guest'|'ready'|'error',user?:AuthIdentity}

const STORAGE_KEY='for-us-v15-demo-state'
const caps=[0,1000,3000,4000,6000,8000,15000,20000,25000,30000,60000]
const capLabels=new Map([[0,'Free'],[1000,'$10'],[3000,'$30'],[4000,'$40'],[6000,'$60'],[8000,'$80'],[15000,'$150'],[20000,'$200'],[25000,'$250'],[30000,'$300'],[60000,'$600']])

const initialOccasion: OccasionDraft={budgetMaxCents:8000,availableMinutes:240,locationMode:'either',energy:'medium',mode:'for-you',surpriseLevel:'maximum'}

function money(cents:number){return cents===0?'Free':`≤ $${Math.round(cents/100)}`}
function minutes(min:number){const h=Math.floor(min/60),m=min%60;return h?`${h}h${m?` ${m}m`:''}`:`${m}m`}
function today(){return new Date().toISOString().slice(0,10)}

function loadPersisted(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return {}}}
function storePersisted(value:unknown){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value));return true}catch{return false}}

async function compressPhoto(file:File):Promise<string>{
  const source=await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=reject;r.readAsDataURL(file)})
  const img=await new Promise<HTMLImageElement>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=source})
  const max=1200,scale=Math.min(1,max/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d')?.drawImage(img,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/jpeg',.76)
}

function slotsFor(eligible:Invitation[]){
  const pools={
    'familiar-twist':eligible.filter(x=>x.slot==='familiar-twist'),
    'adjacent-discovery':eligible.filter(x=>x.slot==='adjacent-discovery'),
    wildcard:eligible.filter(x=>x.slot==='wildcard')
  }
  const used=new Set<string>(),result:Invitation[]=[]
  ;(['familiar-twist','adjacent-discovery','wildcard'] as const).forEach(slot=>{const pick=pools[slot].find(x=>!used.has(x.id))||eligible.find(x=>!used.has(x.id));if(pick){used.add(pick.id);result.push(pick)}})
  return result
}

function ExperienceApp({user}:{user:AuthIdentity}){
  const reduceMotion=useReducedMotion()
  const persisted=useMemo(()=>loadPersisted(),[])
  const restoredSelected=invitations.find(x=>x.id===persisted.selectedId)||null
  const restoredScreen:Screen=persisted.screen==='active'&&restoredSelected?'active':'home'
  const [screen,setScreen]=useState<Screen>(restoredScreen)
  const [occasion,setOccasion]=useState<OccasionDraft>(persisted.occasion||initialOccasion)
  const [selected,setSelected]=useState<Invitation|null>(restoredSelected)
  const [stageIndex,setStageIndex]=useState<number>(restoredSelected?Math.min(Number(persisted.stageIndex)||0,Math.max(0,restoredSelected.stages.length-1)):0)
  const [keepsakes,setKeepsakes]=useState<Keepsake[]>(persisted.keepsakes||[])
  const [showWhy,setShowWhy]=useState(false)
  const [photoBusy,setPhotoBusy]=useState(false)
  const [toast,setToast]=useState('')
  const [afterglowOpen,setAfterglowOpen]=useState(false)
  const toastTimer=useRef<number|undefined>(undefined)

  useEffect(()=>{storePersisted({occasion,keepsakes,selectedId:selected?.id||null,stageIndex,screen:screen==='active'?'active':'home'})},[occasion,keepsakes,selected,stageIndex,screen])
  const eligible=useMemo(()=>invitations.filter(x=>x.costMaxCents<=occasion.budgetMaxCents&&x.minutes<=occasion.availableMinutes&&(occasion.locationMode==='either'||x.location===occasion.locationMode)&&x.energy.includes(occasion.energy)),[occasion])
  const choices=useMemo(()=>slotsFor(eligible),[eligible])

  function notify(message:string){setToast(message);window.clearTimeout(toastTimer.current);toastTimer.current=window.setTimeout(()=>setToast(''),2200)}
  function go(next:Screen){setScreen(next);window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'})}
  function choose(invite:Invitation){setSelected(invite);setStageIndex(0);setShowWhy(false);go('detail')}
  function begin(){if(!selected)return;setStageIndex(0);go('active')}
  function saveKeepsake(replay:Keepsake['replay'],moment:string,photoDataUrl?:string){if(!selected)return;const existing=keepsakes.find(k=>k.invitationId===selected.id&&k.date===today());const item:Keepsake={id:existing?.id||crypto.randomUUID(),invitationId:selected.id,title:selected.title,date:today(),moment:moment.trim()||undefined,photoDataUrl:photoDataUrl||existing?.photoDataUrl,replay};const next=existing?keepsakes.map(k=>k.id===existing.id?item:k):[item,...keepsakes];setKeepsakes(next);notify('Kept. That is enough.');go('keepsakes')}

  const transition=reduceMotion?{duration:0}:{type:'spring' as const,stiffness:280,damping:28,mass:.75}

  return <div className="appShell">
    <header className="topBar"><button className="wordmark" onClick={()=>go('home')} aria-label="For Us home"><span className="signal"/>For Us</button><div className="topTools"><button className="quietButton" onClick={()=>{setAfterglowOpen(false);go('keepsakes')}}>Keepsakes <span>{keepsakes.length}</span></button>{user.role==='luke'?<button className="avatar" onClick={()=>go('backstage')} aria-label="Open Luke backstage">L</button>:<div className="avatar avatarStatic" aria-label="Ava signed in">A</div>}</div></header>
    <AnimatePresence mode="wait">
      <motion.main key={screen} initial={{opacity:0,y:reduceMotion?0:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduceMotion?0:-8}} transition={transition}>
        {screen==='home'&&<Home occasion={occasion} setOccasion={setOccasion} onPlay={()=>go('play')} choices={choices}/>} 
        {screen==='play'&&<Play occasion={occasion} setOccasion={setOccasion} choices={choices} onChoose={choose} onTogether={()=>go('together-match')}/>} 
        {screen==='together-match'&&<TogetherMatch choices={choices} onCancel={()=>go('play')} onChoose={choose}/>} 
        {screen==='detail'&&selected&&<Detail invitation={selected} occasion={occasion} setOccasion={setOccasion} showWhy={showWhy} setShowWhy={setShowWhy} onBack={()=>go('play')} onBegin={begin}/>} 
        {screen==='active'&&selected&&<Active invitation={selected} index={stageIndex} setIndex={setStageIndex} onDone={()=>{setAfterglowOpen(true);go('keepsakes')}} onAfterHours={()=>go('after-hours')} onChange={()=>go('play')}/>} 
        {screen==='keepsakes'&&<Keepsakes keepsakes={keepsakes} selected={afterglowOpen?selected:null} onBack={()=>{setAfterglowOpen(false);go('home')}} onSave={(r,m,p)=>{setAfterglowOpen(false);saveKeepsake(r,m,p)}} onPhotoBusy={setPhotoBusy} photoBusy={photoBusy}/>} 
        {screen==='backstage'&&user.role==='luke'&&<Backstage selected={selected} occasion={occasion} onBack={()=>go('home')} onReady={()=>{notify('Ready for her');go(selected?'detail':'play')}}/>}
        {screen==='after-hours'&&<AfterHours onExit={()=>go('active')}/>} 
      </motion.main>
    </AnimatePresence>
    <nav className="bottomNav" aria-label="Primary"><button className={screen==='home'?'active':''} onClick={()=>go('home')}>For Us</button><button className={['play','together-match','detail','active'].includes(screen)?'active':''} onClick={()=>go('play')}>Play</button><button className={screen==='keepsakes'?'active':''} onClick={()=>{setAfterglowOpen(false);go('keepsakes')}}>Keepsakes</button></nav>
    <AnimatePresence>{toast&&<motion.div className="toast" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}}>{toast}</motion.div>}</AnimatePresence>
  </div>
}

function Home({occasion,setOccasion,onPlay,choices}:{occasion:OccasionDraft,setOccasion:(x:OccasionDraft)=>void,onPlay:()=>void,choices:Invitation[]}){
  return <section className="page homePage">
    <div className="eyebrow">Tonight · private console</div><h1>What kind of night?</h1><p className="lede">Set the edges. We’ll take it from there.</p>
    <div className="constraintObject">
      <div className="constraintTop"><span>Tonight's ceiling</span><strong>{money(occasion.budgetMaxCents)}</strong></div>
      <div className="budgetRail" role="group" aria-label="Maximum budget for two">{caps.map(c=><button key={c} className={occasion.budgetMaxCents===c?'active':''} onClick={()=>setOccasion({...occasion,budgetMaxCents:c})}>{capLabels.get(c)}</button>)}</div>
      <div className="quickGrid"><Control label="Time"><select value={occasion.availableMinutes} onChange={(e:ChangeEvent<HTMLSelectElement>)=>setOccasion({...occasion,availableMinutes:Number(e.target.value)})}><option value={90}>90 min</option><option value={120}>2 hours</option><option value={180}>3 hours</option><option value={240}>4 hours</option><option value={360}>6 hours</option><option value={720}>Most of the day</option></select></Control><Control label="Where"><select value={occasion.locationMode} onChange={(e:ChangeEvent<HTMLSelectElement>)=>setOccasion({...occasion,locationMode:e.target.value as LocationMode})}><option value="either">Either</option><option value="out">Go out</option><option value="home">Stay home</option></select></Control><Control label="Energy"><select value={occasion.energy} onChange={(e:ChangeEvent<HTMLSelectElement>)=>setOccasion({...occasion,energy:e.target.value as Energy})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></Control><Control label="Choosing"><select value={occasion.mode} onChange={(e:ChangeEvent<HTMLSelectElement>)=>setOccasion({...occasion,mode:e.target.value as SelectionMode})}><option value="for-you">For You</option><option value="together">Together</option><option value="surprise-us">Surprise Us</option></select></Control></div>
      <button className="heroButton" onClick={onPlay}>Build tonight <span>↗</span></button>
    </div>
    <section className="softCard"><span className="miniLabel">Fit checked</span><h2>The bad options never make it upstairs.</h2><p>Money, time, distance, energy, and repetition are checked before anything reaches you.</p></section>
  </section>
}

function Play({occasion,setOccasion,choices,onChoose,onTogether}:{occasion:OccasionDraft,setOccasion:(x:OccasionDraft)=>void,choices:Invitation[],onChoose:(x:Invitation)=>void,onTogether:()=>void}){
  const displayChoices=occasion.mode==='surprise-us'&&choices.length?[choices[(occasion.budgetMaxCents+occasion.availableMinutes)%choices.length]]:choices
  return <section className="page"><div className="pageHead"><div><div className="eyebrow">Tonight’s edit</div><h1 className="smallTitle">{occasion.mode==='together'?'Find the overlap.':'Three ways this could go.'}</h1><p>{occasion.mode==='together'?'Choose privately on one phone. Only shared yeses appear.':'Different enough to matter. Small enough to choose.'}</p></div><button className="filterPill" onClick={()=>setOccasion({...occasion,surpriseLevel:occasion.surpriseLevel==='maximum'?'full-plan':'maximum'})}>{occasion.surpriseLevel==='maximum'?'Maximum surprise':'Show details'}</button></div>
    {displayChoices.length===0?<div className="emptyState"><div className="emptyMark">0</div><h2>Keep the ceiling.</h2><p>Nothing in the current demo shelf fits every constraint. The product should offer a truly cheaper or shorter format—not quietly move your budget or deadline.</p></div>:occasion.mode==='together'?<section className="togetherLaunch"><div className="overlapMarks"><span>A</span><i/><span>L</span></div><h2>Same shortlist. Private reactions.</h2><p>Ava goes first, passes the phone, then Luke answers the same three invitations. The app reveals only mutual yeses. Maybe stays private.</p><button className="heroButton" onClick={onTogether}>Start together <span>→</span></button></section>:<div className="invitationStack">{displayChoices.map((x,i)=><InvitationCard key={x.id} invitation={x} mode={occasion.mode} surprise={occasion.surpriseLevel} index={i} onOpen={()=>onChoose(x)}/>)}</div>}
    <div className="modeStrip"><span>Mode</span>{(['for-you','together','surprise-us'] as SelectionMode[]).map(m=><button key={m} className={occasion.mode===m?'active':''} onClick={()=>setOccasion({...occasion,mode:m})}>{m==='for-you'?'For You':m==='together'?'Together':'Surprise Us'}</button>)}</div>
  </section>
}

function TogetherMatch({choices,onCancel,onChoose}:{choices:Invitation[],onCancel:()=>void,onChoose:(x:Invitation)=>void}){
  type Vote='no'|'maybe'|'yes'
  const [phase,setPhase]=useState<'ava'|'handoff'|'luke'|'result'>('ava')
  const [index,setIndex]=useState(0)
  const [ava,setAva]=useState<Record<string,Vote>>({})
  const [luke,setLuke]=useState<Record<string,Vote>>({})
  const current=choices[index]
  const mutual=choices.filter(x=>ava[x.id]==='yes'&&luke[x.id]==='yes')
  function answer(v:Vote){const setter=phase==='ava'?setAva:setLuke;const source=phase==='ava'?ava:luke;setter({...source,[current.id]:v});if(index<choices.length-1){setIndex(index+1);return}if(phase==='ava'){setIndex(0);setPhase('handoff')}else setPhase('result')}
  if(!choices.length)return <section className="page"><button className="backLink" onClick={onCancel}>← Back</button><div className="emptyState"><h2>No shortlist to match yet.</h2><p>Change a constraint and try again.</p></div></section>
  if(phase==='handoff')return <section className="matchPage handoffMatch"><div className="handoffDisc">↻</div><div className="eyebrow">Private handoff</div><h1>Pass the phone to Luke.</h1><p>Ava's reactions are hidden. Luke sees the same shortlist from the beginning.</p><button className="heroButton dark" onClick={()=>setPhase('luke')}>Luke has the phone <span>→</span></button><button className="secondary full" onClick={onCancel}>Cancel</button></section>
  if(phase==='result')return <section className="matchPage"><div className="eyebrow">Together · overlap only</div><h1>{mutual.length?`${mutual.length} ${mutual.length===1?'match':'matches'}`:'No overlap. No loser.'}</h1><p>{mutual.length?'Only invitations you both independently marked yes are shown. Pick one, or stop here.':'Maybe and no stay private. Change one constraint, switch modes, or simply try another time.'}</p>{mutual.length?<div className="mutualList">{mutual.map((x,i)=><InvitationCard key={x.id} invitation={x} mode="together" surprise="vibe-only" index={i} onOpen={()=>onChoose(x)}/>)}</div>:<div className="noMatchObject"><span>Nothing to solve.</span><strong>A no-match is a clean result.</strong></div>}<button className="secondary full" onClick={onCancel}>{mutual.length?'Back to choices':'Adjust the night'}</button></section>
  const person=phase==='ava'?'Ava':'Luke'
  return <section className="matchPage"><button className="privateVoteExit" onClick={onCancel}>×</button><div className="eyebrow">{person} · private · {index+1} of {choices.length}</div><div className="voteObject"><span className="miniLabel">Would you genuinely want this tonight?</span><h1>{current.mysteryTitle}</h1><p>{current.secretPromise}</p><div className="inviteMeta"><span>{money(current.costMaxCents)}</span><span>{minutes(current.minutes)}</span><span>{current.location==='home'?'At home':'Out'}</span></div></div><div className="privateVoteGrid"><button onClick={()=>answer('no')}>Not tonight</button><button onClick={()=>answer('maybe')}>Maybe</button><button className="yes" onClick={()=>answer('yes')}>Yes</button></div><p className="privacyFoot">Your reaction is used only for this pass-the-phone round and is not saved.</p></section>
}

function InvitationCard({invitation,mode,surprise,index,onOpen}:{invitation:Invitation,mode:SelectionMode,surprise:SurpriseLevel,index:number,onOpen:()=>void}){
  const hidden=surprise==='maximum'||mode==='surprise-us';const title=hidden?invitation.mysteryTitle:invitation.title;const promise=hidden?invitation.secretPromise:invitation.promise
  return <motion.article className={`invitation slot${index+1}`} whileTap={{scale:.985}}><div className="inviteHeader"><div className="slotLabel">{index===0?'Familiar, twisted':index===1?'Adjacent discovery':'Wildcard'}</div><div className="number">0{index+1}</div></div><h2>{title}</h2><p>{promise}</p><div className="inviteMeta"><span>{money(invitation.costMaxCents)}</span><span>{minutes(invitation.minutes)}</span><span>{invitation.location==='home'?'At home':'Out'}</span></div><button onClick={onOpen}>See the plan <span>→</span></button></motion.article>
}

function Detail({invitation,occasion,setOccasion,showWhy,setShowWhy,onBack,onBegin}:{invitation:Invitation,occasion:OccasionDraft,setOccasion:(x:OccasionDraft)=>void,showWhy:boolean,setShowWhy:(x:boolean)=>void,onBack:()=>void,onBegin:()=>void}){
  const hidden=occasion.surpriseLevel==='maximum';return <section className="page"><button className="backLink" onClick={onBack}>← Back to choices</button><article className="revealObject"><div className="revealGlow"/><div className="eyebrow">Curated for tonight</div><h1>{hidden?invitation.mysteryTitle:invitation.title}</h1><p className="revealPromise">{hidden?invitation.secretPromise:invitation.promise}</p><div className="essentials"><span>{money(invitation.costMaxCents)}</span><span>{minutes(invitation.minutes)}</span><span>{invitation.attire}</span></div><div className="disclosureRow"><button onClick={()=>setShowWhy(!showWhy)}>{showWhy?'Hide why':'Why this made the cut'}</button><button onClick={()=>setOccasion({...occasion,surpriseLevel:'full-plan'})} className="textButton">Reveal everything</button></div>{showWhy&&<div className="whyPanel">{invitation.why.map(x=><div key={x}><i/> {x}</div>)}</div>}<button className="heroButton dark" onClick={onBegin}>Keep this one <span>→</span></button></article><div className="practicalCard"><div><span className="miniLabel">Practical, never secret</span><strong>{invitation.booking}</strong></div><div><span className="miniLabel">If the plan changes</span><strong>{invitation.fallback}</strong></div></div></section>
}

function Active({invitation,index,setIndex,onDone,onAfterHours,onChange}:{invitation:Invitation,index:number,setIndex:(n:number)=>void,onDone:()=>void,onAfterHours:()=>void,onChange:()=>void}){
  const stage=invitation.stages[index],last=index===invitation.stages.length-1;return <section className="activePage"><div className="activeTop"><span>{stage.label}</span><button onClick={onChange}>Change plan</button></div><div className="progressLine"><i style={{width:`${((index+1)/invitation.stages.length)*100}%`}}/></div><motion.div key={stage.id} className="stageObject" initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}}><span className="miniLabel">Now</span><h1>{stage.title}</h1><p>{stage.body}</p>{stage.practical&&<div className="practicalInline">{stage.practical}</div>}{stage.prompt&&<blockquote>{stage.prompt}</blockquote>}</motion.div><div className="activeActions">{index>0&&<button className="secondary" onClick={()=>setIndex(index-1)}>Previous</button>}{!last?<button className="heroButton" onClick={()=>setIndex(index+1)}>Reveal next <span>→</span></button>:<><button className="secondary" onClick={onAfterHours}>Open private lane</button><button className="heroButton" onClick={onDone}>Finish the night <span>✓</span></button></>}</div><div className="presenceNote">One stage at a time. The goal is to forget the phone again.</div></section>
}

function Keepsakes({keepsakes,selected,onBack,onSave,onPhotoBusy,photoBusy}:{keepsakes:Keepsake[],selected:Invitation|null,onBack:()=>void,onSave:(r:Keepsake['replay'],m:string,p?:string)=>void,onPhotoBusy:(x:boolean)=>void,photoBusy:boolean}){
  const [moment,setMoment]=useState('');const [photo,setPhoto]=useState<string|undefined>(undefined);async function handlePhoto(file?:File){if(!file)return;onPhotoBusy(true);try{setPhoto(await compressPhoto(file))}finally{onPhotoBusy(false)}}
  return <section className="page"><div className="pageHead"><div><div className="eyebrow">Keepsakes</div><h1 className="smallTitle">The good stuff, kept.</h1></div><button className="filterPill" onClick={onBack}>Done</button></div>{selected&&<section className="afterglow"><span className="miniLabel">Afterglow · optional</span><h2>Anything worth keeping?</h2><textarea value={moment} onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>setMoment(e.target.value)} maxLength={240} placeholder="One line is plenty."/><label className="photoButton">{photoBusy?'Preparing photo…':photo?'Photo ready ✓':'Add one photo'}<input type="file" accept="image/*" onChange={(e:ChangeEvent<HTMLInputElement>)=>handlePhoto(e.target.files?.[0])}/></label>{photo&&<img className="photoPreview" src={photo} alt="Keepsake preview"/>}<div className="replayGrid"><button onClick={()=>onSave('again',moment,photo)}>On repeat</button><button onClick={()=>onSave('different',moment,photo)}>Different version</button><button onClick={()=>onSave('not-again',moment,photo)}>Not our track</button></div></section>}<div className="keepsakeGrid"><article className="firstAlbum"><span className="miniLabel">Archive · First Album</span><div className="albumMark">T</div><h3>Tonight</h3><p>The vinyl version stays exactly as it was.</p></article>{keepsakes.map(k=><article className="memoryCard" key={k.id}>{k.photoDataUrl&&<img src={k.photoDataUrl} alt="Saved date"/>}<div><span className="miniLabel">{new Date(k.date+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</span><h3>{k.title}</h3>{k.moment&&<p>“{k.moment}”</p>}<span className="replayTag">{k.replay==='again'?'On repeat':k.replay==='different'?'Different version':'Not our track'}</span></div></article>)}</div></section>
}

function Backstage({selected,occasion,onBack,onReady}:{selected:Invitation|null,occasion:OccasionDraft,onBack:()=>void,onReady:()=>void}){return <section className="page"><button className="backLink" onClick={onBack}>← Back</button><div className="backstageHead"><div className="eyebrow">Backstage · Luke only</div><h1 className="smallTitle">Make it easy for her.</h1><p>No analytics. Just what you need to execute the night.</p></div>{selected?<div className="checklist"><Check label="Budget ceiling" value={money(occasion.budgetMaxCents)}/><Check label="Expected date cost" value={money(selected.costMaxCents)}/><Check label="Booking" value={selected.booking}/><Check label="Attire / supplies" value={selected.attire}/><Check label="Fallback" value={selected.fallback}/><Check label="Hermes recheck" value="Pending integration · tomorrow"/><button className="heroButton dark" onClick={onReady}>Ready for her <span>✓</span></button></div>:<div className="emptyState"><h2>No selected plan yet.</h2><p>Backstage appears after one invitation is selected.</p></div>}</section>}

function AfterHours({onExit}:{onExit:()=>void}){
  const [step,setStep]=useState<'intro'|'ceiling-a'|'handoff'|'ceiling-b'|'cards-a'|'cards-b'|'matches'>('intro')
  const [aCeil,setACeil]=useState(1),[bCeil,setBCeil]=useState(1),[card,setCard]=useState(0)
  const [a,setA]=useState<Record<string,'yes'|'maybe'|'no'>>({}),[b,setB]=useState<Record<string,'yes'|'maybe'|'no'>>({})
  const [privacyLocked,setPrivacyLocked]=useState(false),[expired,setExpired]=useState(false)
  const ceiling=Math.min(aCeil,bCeil),cards=useMemo(()=>privateRoundCards(ceiling,8),[ceiling])
  const matches=cards.filter(c=>a[c.id]==='yes'&&b[c.id]==='yes')
  useEffect(()=>{
    const hide=()=>{if(document.visibilityState==='hidden'&&step!=='intro'){setPrivacyLocked(true)}}
    document.addEventListener('visibilitychange',hide)
    const timer=window.setTimeout(()=>{setA({});setB({});setExpired(true);setPrivacyLocked(true)},45*60*1000)
    return()=>{document.removeEventListener('visibilitychange',hide);window.clearTimeout(timer)}
  },[step])
  function finishRound(){if(step==='cards-a'){setCard(0);setStep('cards-b')}else setStep('matches')}
  function clearAndExit(){setA({});setB({});setCard(0);setPrivacyLocked(false);onExit()}
  if(expired)return <section className="privatePage handoff"><div className="privacySeal">Session cleared</div><h2>Private answers expired.</h2><p>The private round automatically clears after 45 minutes. Nothing was saved.</p><button className="privatePrimary" onClick={clearAndExit}>Return to the date</button></section>
  if(privacyLocked)return <section className="privatePage privacyCurtain"><div className="privacySeal">Private view covered</div><div className="privacyLockMark">●</div><h2>Tap to reopen.</h2><p>The app covered this screen when it left the foreground. Private answers are still only in this tab.</p><button className="privatePrimary" onClick={()=>setPrivacyLocked(false)}>Reopen private view</button><button className="privateGhost" onClick={clearAndExit}>Clear and leave</button></section>
  if(step==='intro')return <section className="privatePage"><button className="privateExit" onClick={clearAndExit}>×</button><div className="privacySeal">Private · this session only</div><h1>After Hours</h1><p>Separate on purpose. Nothing here is sent to Hermes or saved to your relationship history.</p><ul><li>A match means “we are both open to talking about this.”</li><li>Maybe never becomes a match.</li><li>Either person can leave at any time.</li><li>A match is never consent to anything beyond the conversation.</li></ul><button className="privatePrimary" onClick={()=>setStep('ceiling-a')}>Enter together</button></section>
  if(step==='ceiling-a'||step==='ceiling-b'){const mine=step==='ceiling-a'?aCeil:bCeil;return <section className="privatePage"><button className="privateExit" onClick={clearAndExit}>×</button><div className="privacySeal">{step==='ceiling-a'?'Person one':'Person two'} · choose privately</div><h2>How far should this go tonight?</h2><div className="ceilingList">{['Flirty','Closer','Spicy','Late Night'].map((x,i)=><button key={x} className={mine===i?'active':''} onClick={()=>step==='ceiling-a'?setACeil(i):setBCeil(i)}><strong>{x}</strong><span>{['Playful attraction and affection.','Desire, closeness, and boundaries.','Direct conversations about sexual interest.','Overtly sexual conversation, still discussion-first.'][i]}</span></button>)}</div><button className="privatePrimary" onClick={()=>step==='ceiling-a'?setStep('handoff'):(setCard(0),setStep('cards-a'))}>Lock this in</button></section>}
  if(step==='handoff')return <section className="privatePage handoff"><div className="phoneGlyph">↻</div><h2>Pass the phone.</h2><p>Person one’s ceiling is hidden now.</p><button className="privatePrimary" onClick={()=>setStep('ceiling-b')}>I have the phone</button><button className="privateGhost" onClick={clearAndExit}>Clear and leave</button></section>
  if(step==='cards-a'||step==='cards-b'){const who=step==='cards-a'?'Person one':'Person two',answers=step==='cards-a'?a:b,setAnswers=step==='cards-a'?setA:setB;const prompt=cards[card];return <section className="privatePage"><button className="privateExit" onClick={clearAndExit}>×</button><div className="privacySeal">{who} · {card+1} of {cards.length} · ceiling {['Flirty','Closer','Spicy','Late Night'][ceiling]}</div><div className="privateCard"><span>{prompt.topic} · open to talking about this?</span><h2>{prompt.question}</h2><div className="answerGrid">{(['no','maybe','yes'] as const).map(v=><button key={v} className={answers[prompt.id]===v?'active':''} onClick={()=>setAnswers({...answers,[prompt.id]:v})}>{v==='no'?'Not tonight':v==='maybe'?'Maybe / discuss':'Yes'}</button>)}</div></div><button className="privatePrimary" disabled={!answers[prompt.id]} onClick={()=>card<cards.length-1?setCard(card+1):finishRound()}>{card<cards.length-1?'Next':'Finish privately'}</button></section>}
  return <section className="privatePage"><button className="privateExit" onClick={clearAndExit}>×</button><div className="privacySeal">Mutual yeses only</div><h1>{matches.length?`${matches.length} shared ${matches.length===1?'opening':'openings'}`:'No matches tonight'}</h1><p>{matches.length?'These are conversation openings, not promises. Ask again in the moment.':'Nothing went wrong. Private answers stay private and this round can simply end.'}</p><div className="matchList">{matches.map(x=><div key={x.id}><strong>{x.topic}</strong><span>{x.question}</span></div>)}</div><button className="privatePrimary" onClick={clearAndExit}>Clear and return</button></section>
}

function Control({label,children}:{label:string,children:ReactNode}){return <label className="control"><span>{label}</span>{children}</label>}
function Check({label,value}:{label:string,value:string}){return <div className="check"><i>✓</i><div><span>{label}</span><strong>{value}</strong></div></div>}

function App(){
  const [auth,setAuth]=useState<AuthLoad>({status:'loading'})
  useEffect(()=>{
    let live=true
    fetch('/api/auth/me',{credentials:'include',headers:{Accept:'application/json'}})
      .then(async response=>{
        if(!live)return
        if(response.status===401){setAuth({status:'guest'});return}
        if(!response.ok)throw new Error(`auth ${response.status}`)
        const user=await response.json() as AuthIdentity
        if(live)setAuth({status:'ready',user})
      })
      .catch(()=>{if(live)setAuth({status:'error'})})
    return()=>{live=false}
  },[])

  if(auth.status==='loading')return <AuthShell eyebrow="Private by design" title="Opening For Us…" body="Checking this device."/>
  if(auth.status==='error')return <AuthShell eyebrow="Couldn’t check in" title="Try that again." body="The private service is not reachable right now." action="Retry" onAction={()=>window.location.reload()}/>
  if(auth.status==='guest')return <AuthShell eyebrow="For Luke + Ava" title="A little world for two." body="Sign in with one of the two invited Google accounts." action="Continue with Google" onAction={()=>{window.location.href='/auth/google/start?next=/'}}/>
  return <ExperienceApp user={auth.user!}/>
}

function AuthShell({eyebrow,title,body,action,onAction}:{eyebrow:string,title:string,body:string,action?:string,onAction?:()=>void}){
  return <main className="authShell"><section className="authObject"><div className="authMark"><span className="signal"/>For Us</div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{body}</p>{action&&<button className="heroButton dark" onClick={onAction}>{action}<span>→</span></button>}<small>No feed. No public profile. Just us.</small></section></main>
}

export default App
