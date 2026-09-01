export default function MedicalDisclaimer() {
  return (
    <div
      className="rounded-lg border border-surface2 p-4 bg-surface/40"
      role="note"
    >
      <p className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">
        Health &amp; safety note
      </p>
      <p className="text-ink-muted text-sm leading-relaxed">
        Sibling Stack is written by a parent, not a medical professional. The
        information here is general guidance, not medical advice, and doesn&apos;t
        replace a conversation with your doctor, midwife, or pediatrician — who
        know your family&apos;s specific situation.
      </p>
    </div>
  );
}