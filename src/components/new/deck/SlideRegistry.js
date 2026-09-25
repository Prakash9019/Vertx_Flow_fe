import { TitleLayout, defaultTitleContent } from "./layouts/TitleLayout";
import { ProblemLayout, defaultProblemContent } from "./layouts/ProblemLayout";
import { MediaDescriptionLayout, defaultMediaDescriptionContent } from "./layouts/MediaDescriptionLayout";
import { Media3PointsLayout, defaultMedia3PointsContent } from "./layouts/Media3PointsLayout";
import { MetricsGridLayout, defaultMetricsGridContent } from "./layouts/MetricsGridLayout";
import { TeamGridLayout, defaultTeamGridContent } from "./layouts/TeamGridLayout";
import { CtaLayout, defaultCtaContent } from "./layouts/CtaLayout";

export const SlideRegistry = {
  title: { component: TitleLayout, defaultContent: defaultTitleContent },
  problem: { component: ProblemLayout, defaultContent: defaultProblemContent },
  "media-description": { component: MediaDescriptionLayout, defaultContent: defaultMediaDescriptionContent },
  "media-3points": { component: Media3PointsLayout, defaultContent: defaultMedia3PointsContent },
  "metrics-grid": { component: MetricsGridLayout, defaultContent: defaultMetricsGridContent },
  "team-grid": { component: TeamGridLayout, defaultContent: defaultTeamGridContent },
  cta: { component: CtaLayout, defaultContent: defaultCtaContent },
};

export function getRegistryEntry(layoutId) {
  return SlideRegistry[layoutId];
}
