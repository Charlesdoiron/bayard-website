import { TONE_CLASSES } from "@/lib/boutique/labels";

export default function StatusPill({
  label,
  tone,
  className = "",
}: {
  label: string;
  tone: keyof typeof TONE_CLASSES;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASSES[tone]} ${className}`}>
      {label}
    </span>
  );
}
