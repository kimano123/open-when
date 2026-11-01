import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const starter = [
  { id: "a1", title: "Open when you need a reminder", category: "Comfort", recipient: "Someone special", message: "You are allowed to have difficult days. Take a breath, give yourself a little kindness, and remember that one hard moment does not define your whole story. You matter, exactly as you are. ♡", created: Date.now() - 100000 },
  { id: "a2", title: "Open when you feel lonely", category: "Comfort", recipient: "Someone special", message: "Even when the world feels quiet, you are not forgotten. I hope this little letter feels like a warm light in your day. You deserve care, patience, and people who make you feel safe.", created: Date.now() - 90000 },
  { id: "a3", title: "Open when something wonderful happens", category: "Happiness", recipient: "Someone special", message: "Pause for a moment and enjoy this. You worked, hoped, waited, or simply got lucky — whatever brought you here, let yourself celebrate it. May there be many more beautiful moments ahead. ✨", created: Date.now() - 80000 }
];
const categories = ["All letters", "Comfort", "Happiness", "Courage", "Missing someone", " 특별 moments", "Just because"];
const icons = { "Comfort":"♡", "Happiness":"✦", "Courage":"☼", "Missing someone":"☾", " 특별 moments":"✧", "Just because":"❀" };

function App() {
  const [letters, setLetters] = useState(() => {
    try { const saved = localStorage.getItem("openwhen-letters"); return saved ? JSON.parse(saved) : starter; }
    catch { return starter; }
  });
  const [activeCategory, setActiveCategory] = useState("All letters");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("home");
  const [opened, setOpened] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ title:"", category:"Comfort", recipient:"", message:"" });

  useEffect(() => { localStorage.setItem("openwhen-letters", JSON.stringify(letters)); }, [letters]);
  const filtered = useMemo(() => letters.filter(l =>
    (activeCategory === "All letters" || l.category === activeCategory) &&
    (l.title + " " + l.message + " " + l.recipient).toLowerCase().includes(query.toLowerCase())
  ), [letters, activeCategory, query]);

  function notify(message) { setToast(message); window.setTimeout(() => setToast(""), 2300); }
  function newLetter() {
    setEditing(null); setForm({ title:"", category:"Comfort", recipient:"", message:"" }); setShowForm(true);
  }
  function editLetter(letter) {
    setEditing(letter.id); setForm({ title:letter.title, category:letter.category, recipient:letter.recipient || "", message:letter.message }); setOpened(null); setShowForm(true);
  }
  function saveLetter(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    if (editing) {
      setLetters(prev => prev.map(l => l.id === editing ? { ...l, ...form } : l));
      notify("Your letter has been updated ♡");
    } else {
      setLetters(prev => [{ ...form, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), created: Date.now() }, ...prev]);
      notify("A new letter has been tucked away ♡");
    }
    setShowForm(false);
  }
  function deleteLetter(id) {
    if (!window.confirm("Delete this letter? This cannot be undone.")) return;
    setLetters(prev => prev.filter(l => l.id !== id)); setOpened(null); notify("Letter deleted.");
  }
  function exportLetters() {
    const blob = new Blob([JSON.stringify(letters, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "open-when-letters.json"; a.click(); URL.revokeObjectURL(url);
    notify("Your backup is ready.");
  }
  function importLetters(e) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data) || !data.every(x => x.title && x.message)) throw new Error();
        setLetters(data); notify("Letters imported successfully ♡");
      } catch { notify("That file doesn't look like an OPEN WHEN backup."); }
    };
    reader.readAsText(file); e.target.value = "";
  }

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => {setView("home"); setOpened(null);}}>
        <span className="brand-mark">K</span><span><b>KIMVERSE</b><small> presents</small></span>
      </button>
      <div className="top-actions"><button className="text-btn" onClick={exportLetters}>Backup</button><label className="text-btn import-btn">Restore<input type="file" accept="application/json" onChange={importLetters}/></label><button className="avatar" title="Your space">♡</button></div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-orbit">✦</div>
        <p className="eyebrow">A LITTLE PLACE FOR THE MOMENTS THAT MATTER</p>
        <h1>OPEN <em>WHEN</em><span className="hero-heart">♡</span></h1>
        <p className="hero-copy">Letters for the days you need them most.<br/>Write a little love into someone’s tomorrow.</p>
        <button className="primary-btn" onClick={newLetter}>＋ Write a letter</button>
        <div className="hero-foot">MADE WITH CARE BY KIMVERSE <span>✧</span></div>
      </section>

      <section className="workspace">
        <div className="section-heading">
          <div><p className="eyebrow">YOUR PRIVATE COLLECTION</p><h2>Your letters <span>({letters.length})</span></h2></div>
          <div className="search-wrap"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a letter..." aria-label="Search letters"/></div>
        </div>
        <div className="category-row">
          {categories.map(c => <button key={c} className={"chip "+(activeCategory===c?"selected":"")} onClick={()=>setActiveCategory(c)}>{c==="All letters"?"All letters":(icons[c]||"✧")+" "+c}</button>)}
        </div>
        {filtered.length ? <div className="letter-grid">
          {filtered.map((letter, i) => <article className="letter-card" key={letter.id} style={{"--delay":`${i*55}ms`}}>
            <div className="card-top"><span className="category-icon">{icons[letter.category] || "✧"}</span><span className="category-label">{letter.category}</span><button className="more" title="Edit letter" onClick={()=>editLetter(letter)}>···</button></div>
            <div className="envelope-art"><div className="envelope"><span>♡</span></div></div>
            <h3>{letter.title}</h3>
            <p className="recipient">{letter.recipient ? "FOR "+letter.recipient.toUpperCase() : "A LETTER JUST FOR YOU"}</p>
            <button className="open-link" onClick={()=>setOpened(letter)}>Open this letter <span>↗</span></button>
          </article>)}
          <button className="add-card" onClick={newLetter}><span>＋</span><b>Write another letter</b><small>There is always something worth saying.</small></button>
        </div> : <div className="empty"><span>✧</span><h3>No letters found</h3><p>Try another search or write a new letter.</p><button className="primary-btn small" onClick={newLetter}>Write a letter</button></div>}
      </section>
    </main>
    <footer><span>♡</span> OPEN WHEN <i>by KIMVERSE</i><span>♡</span><p>Your words. Your moments. Your little universe.</p></footer>

    {showForm && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}}><section className="modal form-modal">
      <button className="close" onClick={()=>setShowForm(false)}>×</button><p className="eyebrow">PUT YOUR FEELINGS INTO WORDS</p><h2>{editing?"Edit your letter":"Write a little letter"}</h2>
      <form onSubmit={saveLetter}>
        <label>Letter title<input autoFocus maxLength="70" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Open when you need a smile..." required/></label>
        <div className="form-row"><label>Moment<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></label><label>For someone (optional)<input value={form.recipient} onChange={e=>setForm({...form,recipient:e.target.value})} placeholder="A name or nickname"/></label></div>
        <label>Your letter<textarea rows="7" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Write what you want them to remember..." required/></label>
        <div className="form-note">♡ Your letters are saved in this browser on this device.</div>
        <button className="primary-btn submit-btn" type="submit">{editing?"Save changes":"Seal this letter"} <span>✧</span></button>
      </form>
    </section></div>}

    {opened && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setOpened(null)}}><section className="modal opened-modal">
      <button className="close" onClick={()=>setOpened(null)}>×</button><div className="wax-seal">K</div><p className="eyebrow">A LETTER FOR THIS MOMENT</p><h2>{opened.title}</h2><div className="letter-meta">{opened.category}{opened.recipient?" · for "+opened.recipient:""}</div><div className="letter-message">{opened.message}</div><div className="letter-signoff">With care, always <span>♡</span></div>
      <div className="opened-actions"><button className="secondary-btn" onClick={()=>editLetter(opened)}>Edit letter</button><button className="danger-btn" onClick={()=>deleteLetter(opened.id)}>Delete</button><button className="primary-btn small" onClick={()=>window.print()}>Print letter</button></div>
    </section></div>}
    {toast && <div className="toast">{toast}</div>}
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);
