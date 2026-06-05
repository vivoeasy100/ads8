import { Badge } from "@/components/ui/badge";

interface ScoreBadgeProps {
  level: "critico" | "insuficiente" | "regular" | "bom" | "excelente";
  className?: string;
  score?: number;
}

export function ScoreBadge({ level, className, score }: ScoreBadgeProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "critico":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/80";
      case "insuficiente":
        return "bg-[#f97316] text-white hover:bg-[#f97316]/80"; // Orange
      case "regular":
        return "bg-[#eab308] text-white hover:bg-[#eab308]/80"; // Yellow
      case "bom":
        return "bg-[#14b8a6] text-white hover:bg-[#14b8a6]/80"; // Teal
      case "excelente":
        return "bg-[#22c55e] text-white hover:bg-[#22c55e]/80"; // Green
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "critico": return "Crítico";
      case "insuficiente": return "Insuficiente";
      case "regular": return "Regular";
      case "bom": return "Bom";
      case "excelente": return "Excelente";
      default: return level;
    }
  };

  return (
    <Badge className={`${getLevelColor(level)} ${className || ""}`}>
      {score !== undefined && <span className="font-bold mr-1">{score}</span>}
      {getLevelLabel(level)}
    </Badge>
  );
}
