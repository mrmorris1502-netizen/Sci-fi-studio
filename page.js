'use client';
import {useEffect, useMemo, useState} from 'react';
import './styles.css';

const effects=['Energy Beam','Portal','Lightning','Smoke','Explosion','Hologram','Space Dust','Neon Glow'];
const initialScenes=[{name:'Scene 01',desc:'Opening — Future City',duration:12,media:0,effect:'Neon Glow'}];

export default function Home(){
 const [tab,setTab]=useState('Studio');
 const [media,setMedia]=useState([]);
 const [scenes,setScenes]=useState(initialScenes);
 const [chars,setChars]=useState([]);
 const [effect,setEffect]=useState('Neon Glow');
 const [selectedScene,setSelectedScene]=useState(0);
 const [title,setTitle]=useState('PROJECT NEBULA');
 const [playing,setPlaying]=useState(false);
 const [volume,setVolume]=useState(70);
 const [audio,setAudio]=useState(null);
 const [toast,setToast]=useState('');

 useEffect(()=>()=>media.forEach(m=>URL.revokeObjectURL(m.url)),[media]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2200);return()=>clearTimeout(t)},[toast]);

 const totalDuration=useMemo(()=>scenes.reduce((n,s)=>n+s.duration,0),[scenes]);
 const addMedia=e=>{const files=[...e.target.files].map(f=>({name:f.name,url:URL.createObjectURL(f),type:f.type,size:f.size}));setMedia(m=>[...m,...files]);if(files.length)setToast(`${files.length} media file${files.length>1?'s':''} added`)};
 const addAudio=e=>{const f=e.target.files?.[0];if(!f)return;setAudio({name:f.name,url:URL.createObjectURL(f)});setToast('Soundtrack added')};
 const addScene=()=>{setScenes(s=>[...s,{name:`Scene ${String(s.length+1).padStart(2,'0')}`,desc:'New scene — tap to edit',duration:8,media:0,effect:'Hologram'}]);setSelectedScene(scenes.length);setTab('Scenes')};
 const addChar=()=>setChars(c=>[...c,{name:`Character ${c.length+1}`,role:'Actor / Hero',image:null}]);
 const updateScene=(key,value)=>setScenes(s=>s.map((x,i)=>i===selectedScene?{...x,[key]:value}:x));
 const chooseEffect=e=>{setEffect(e);updateScene('effect',e);setToast(`${e} selected`)};
 const uploadCharacter=(e,index)=>{const f=e.target.files?.[0];if(!f)return;const url=URL.createObjectURL(f);setChars(c=>c.map((x,i)=>i===index?{...x,image:url}:x))};
 const save=()=>setToast('Project saved on this device');

 return <main>
  {toast&&<div className="toast">✓ {toast}</div>}
  <header><div><span className="orb">✦</span><div><h1>ASWIN <b>SCI-FI</b> STUDIO</h1><p>YOUR MOBILE MOVIE LAB</p></div></div><button className="save" onClick={save}>SAVE PROJECT</button></header>
  <nav>{['Studio','Media','Editor','VFX','Scenes','Characters'].map(x=><button key={x} className={tab===x?'active':''} onClick={()=>setTab(x)}>{x}</button>)}</nav>

  {tab==='Studio'&&<section className="grid">
   <div className="hero card"><div className="scan"></div><span className="tag">PROJECT 01 • {title}</span><h2>YOUR SCI-FI<br/><span>MOVIE STARTS HERE.</span></h2><p>Build scenes, edit clips, layer VFX, add characters and shape your cinematic world — right from your phone.</p><div className="actions"><label className="primary">＋ UPLOAD PHOTO / VIDEO<input type="file" accept="image/*,video/*" multiple onChange={addMedia}/></label><button onClick={addScene}>＋ NEW SCENE</button></div></div>
   <div className="card stats"><h3>PROJECT CORE</h3><div className="stat"><strong>{scenes.length}</strong><span>SCENES</span></div><div className="stat"><strong>{media.length}</strong><span>MEDIA</span></div><div className="stat"><strong>{chars.length}</strong><span>CHARACTERS</span></div><div className="stat"><strong>{totalDuration}s</strong><span>TIMELINE</span></div></div>
   <div className="card quick"><h3>QUICK VFX</h3><div className="effectgrid">{effects.slice(0,6).map(e=><button onClick={()=>{chooseEffect(e);setTab('VFX')}} key={e}>✦ {e}</button>)}</div></div>
   <div className="card project-title"><h3>MOVIE TITLE</h3><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter your movie title"/><label className="audio-mini">♫ {audio?audio.name:'Add soundtrack'}<input type="file" accept="audio/*" onChange={addAudio}/></label></div>
  </section>}

  {tab==='Media'&&<section className="card page"><div className="row"><div><h2>MEDIA VAULT</h2><p className="muted">Your photos and raw video clips.</p></div><label className="primary small">＋ ADD MEDIA<input type="file" accept="image/*,video/*" multiple onChange={addMedia}/></label></div><label className="uploadbox">＋ Tap here to upload photos & videos<input type="file" accept="image/*,video/*" multiple onChange={addMedia}/></label><div className="media">{media.length?media.map((m,i)=><div className="thumb" key={i}>{m.type.startsWith('image')?<img src={m.url} alt=""/>:<video src={m.url} controls/>}<small>{m.name}</small><button onClick={()=>setMedia(x=>x.filter((_,j)=>j!==i))}>Remove</button></div>):<p className="muted">No media yet. Upload your movie assets.</p>}</div></section>}

  {tab==='Editor'&&<section className="card page editor"><div className="row"><div><h2>EDIT TIMELINE</h2><p className="muted">Arrange scenes, preview clips and prepare your final cut.</p></div><button className="primary small" onClick={()=>setPlaying(!playing)}>{playing?'Ⅱ PAUSE':'▶ PREVIEW'}</button></div><div className={`viewer ${playing?'is-playing':''}`}><div className="hud">REC • {playing?'PLAYING':'STANDBY'}</div><div className="crosshair">＋</div><strong>{title}</strong><span>{scenes[selectedScene]?.name || 'Scene 01'}</span></div><div className="timeline-head"><span>00:00</span><span>{totalDuration}s</span></div><div className="timeline">{scenes.map((s,i)=><button key={i} onClick={()=>setSelectedScene(i)} className={selectedScene===i?'selected':''}><b>{String(i+1).padStart(2,'0')}</b><span>{s.name}</span><em>{s.duration}s</em></button>)}</div><div className="transport"><button onClick={()=>setPlaying(!playing)}>{playing?'Ⅱ':'▶'}</button><input type="range" min="0" max="100" value={volume} onChange={e=>setVolume(e.target.value)}/><span>♫ {volume}%</span><label className="audio-add">＋ SOUNDTRACK<input type="file" accept="audio/*" onChange={addAudio}/></label></div></section>}

  {tab==='VFX'&&<section className="card page"><div className="row"><div><h2>VFX LAB</h2><p className="muted">Select an effect for {scenes[selectedScene]?.name||'your scene'}.</p></div><span className="chip">8 EFFECTS</span></div><div className="effectgrid big">{effects.map(e=><button className={effect===e?'chosen':''} onClick={()=>chooseEffect(e)} key={e}>✦ {e}<small>{e==='Explosion'?'Impact':e==='Portal'?'Transition':'Cinematic'}</small></button>)}</div><div className={`preview vfx-${effect?.toLowerCase().replace(/ /g,'-')}`}><span>VFX PREVIEW</span><strong>{effect}</strong><p>Preview layer ready for your selected scene.</p><div className="energy-ring"></div></div></section>}

  {tab==='Scenes'&&<section className="card page"><div className="row"><h2>SCENE BOARD</h2><button className="primary small" onClick={addScene}>＋ NEW SCENE</button></div>{scenes.map((s,i)=><button className={`scene ${selectedScene===i?'scene-selected':''}`} key={i} onClick={()=>setSelectedScene(i)}><div className="num">{String(i+1).padStart(2,'0')}</div><div><strong>{s.name}</strong><p>{s.desc}</p></div><span>{s.duration}s</span></button>)}<div className="scene-editor"><h3>SCENE SETTINGS</h3><input value={scenes[selectedScene]?.name||''} onChange={e=>updateScene('name',e.target.value)} placeholder="Scene name"/><input value={scenes[selectedScene]?.desc||''} onChange={e=>updateScene('desc',e.target.value)} placeholder="Scene description"/><label>Duration <input type="number" min="1" max="999" value={scenes[selectedScene]?.duration||8} onChange={e=>updateScene('duration',Number(e.target.value)||1)}/> sec</label></div></section>}

  {tab==='Characters'&&<section className="card page"><div className="row"><div><h2>CHARACTERS</h2><p className="muted">Create your cast and attach reference photos.</p></div><button className="primary small" onClick={addChar}>＋ ADD CHARACTER</button></div>{chars.length?chars.map((c,i)=><div className="character" key={i}>{c.image?<img src={c.image} alt=""/>:<div className="avatar">◉</div>}<div className="char-fields"><input value={c.name} onChange={e=>setChars(x=>x.map((z,j)=>j===i?{...z,name:e.target.value}:z))}/><input value={c.role} onChange={e=>setChars(x=>x.map((z,j)=>j===i?{...z,role:e.target.value}:z))}/><label className="mini-upload">PHOTO<input type="file" accept="image/*" onChange={e=>uploadCharacter(e,i)}/></label></div></div>):<div className="empty"><div>◉</div><p>No characters yet.</p><button className="primary" onClick={addChar}>CREATE CHARACTER</button></div>}</section>}
  <footer>ASWIN SCI-FI STUDIO <span>• MOBILE MOVIE CREATOR</span></footer>
 </main>
}
