import useClimberStore from '../../stores/useClimberStore';
import { getRank } from '../../data/ranks';
import XPBar from '../ui/XPBar';
import { MAX_DISCIPLINE_LEVEL } from '../../data/xpConfig';

const DISCIPLINE_ICONS = {
  normal:   '\uD83E\uDDF5',
  overhang: '\uD83D\uDC32',
  slab:     '\uD83E\uDDD8',
  board:    '\u2692\uFE0F',
};

export default function DisciplineCard({ discipline }) {
  const { id, label, metaphor } = discipline;
  const getDisciplineLevel = useClimberStore((s) => s.getDisciplineLevel);
  const highestGradeSent = useClimberStore((s) => s.highestGradeSent);
  const disciplineXP = useClimberStore((s) => s.disciplineXP[id]);

  const levelInfo = getDisciplineLevel(id);
  const rank = getRank(highestGradeSent);
  const icon = DISCIPLINE_ICONS[id] ?? '\u2694\uFE0F';

  return (
    <div
      className="plank-border wood-grain relative p-4 candle-glow"
      style={{ backgroundColor: '#3D2317' }}
    >
      {/* Corner nails */}
      <div
        className="absolute top-[5px] left-[5px] w-[6px] h-[6px] border border-pixel-border"
        style={{ background: '#5A3420', boxShadow: 'inset 1px 1px 0 #8B5E3C' }}
      />
      <div
        className="absolute top-[5px] right-[5px] w-[6px] h-[6px] border border-pixel-border"
        style={{ background: '#5A3420', boxShadow: 'inset 1px 1px 0 #8B5E3C' }}
      />
      <div
        className="absolute bottom-[5px] left-[5px] w-[6px] h-[6px] border border-pixel-border"
        style={{ background: '#5A3420', boxShadow: 'inset 1px 1px 0 #8B5E3C' }}
      />
      <div
        className="absolute bottom-[5px] right-[5px] w-[6px] h-[6px] border border-pixel-border"
        style={{ background: '#5A3420', boxShadow: 'inset 1px 1px 0 #8B5E3C' }}
      />

      {/* Header row: icon next to label, metaphor below */}
      <div className="mb-1">
        <h3 className="font-pixel text-[10px] text-tavern-light leading-tight truncate text-carved flex items-center gap-2">
          <span className="text-lg leading-none">{icon}</span>
          {label}
        </h3>
        <p className="font-body text-base text-tavern-parchment/50 italic leading-tight mt-1 ml-[26px]">
          {metaphor}
        </p>
      </div>

      {/* Thin inner divider */}
      <div
        className="my-3 h-[2px]"
        style={{
          background:
            'repeating-linear-gradient(90deg, #5A3420 0px, #5A3420 3px, transparent 3px, transparent 6px)',
        }}
      />

      {/* XP Bar */}
      <XPBar
        currentXP={levelInfo.currentXP}
        requiredXP={levelInfo.requiredXP}
        level={levelInfo.level}
        maxLevel={MAX_DISCIPLINE_LEVEL}
      />

      {/* Rank + XP footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{rank.icon}</span>
          <span className="font-pixel text-[8px] text-tavern-parchment/80">
            {rank.title}
          </span>
        </div>
        <p className="font-body text-sm text-tavern-parchment/30">
          {disciplineXP} XP
        </p>
      </div>
    </div>
  );
}
