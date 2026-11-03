// listing archetype: media-player video tabs (live: Tabs component, vertical tablist, panels cross-fade)
document.querySelectorAll('.mp[data-tabs]').forEach((mp) => {
  const tabs = [...mp.querySelectorAll('[role=tab]')];
  const panels = [...mp.querySelectorAll('[role=tabpanel]')];
  const select = (i, focus) => {
    tabs.forEach((t, k) => { const on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; t.dataset.active = String(on); });
    panels.forEach((p, k) => { const on = k === i; p.dataset.active = String(on); p.toggleAttribute('inert', !on); if (on) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true'); });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); select((i + d + tabs.length) % tabs.length, true); }
    });
  });
});
