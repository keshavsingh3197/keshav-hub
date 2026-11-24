import {
  EngineeringGuide,
  GUIDE_CARDS,
  GuideCardMeta,
  GuideCodeBlock,
  GuideFaq,
  GuideSection,
} from './guides-cards.catalog';
import { GUIDE_BODIES_PART1 } from './guides-part1.data';
import { GUIDE_BODIES_PART2 } from './guides-part2.data';
import { GUIDE_BODIES_PART3 } from './guides-part3.data';
import { GUIDE_BODIES_PART4 } from './guides-part4.data';

export type { EngineeringGuide, GuideCardMeta, GuideCodeBlock, GuideFaq, GuideSection };

const ALL_BODIES: Record<string, { sections: GuideSection[]; faqs: GuideFaq[] }> = {
  ...GUIDE_BODIES_PART1,
  ...GUIDE_BODIES_PART2,
  ...GUIDE_BODIES_PART3,
  ...GUIDE_BODIES_PART4,
};

export const ENGINEERING_GUIDES: EngineeringGuide[] = GUIDE_CARDS.map((card) => {
  const body = ALL_BODIES[card.slug];
  if (!body) {
    throw new Error(`Missing guide body for slug: ${card.slug}`);
  }
  return {
    ...card,
    sections: body.sections,
    faqs: body.faqs,
  };
});
