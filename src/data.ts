import { ImageAnalysisResult, NarrativeAnalysisResult, LandingAnalysisResult } from './types';

export const SAMPLE_IMAGES = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Drone Street (AI Render)',
    mimeType: 'image/jpeg',
    imageUrl: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=600&q=80',
    description: 'A typical AI-generated landscape with neon glare, ultra-clean reflections, and standard centered camera composition.'
  },
  {
    id: 'headshot',
    name: 'Corporate Executive Portrait (AI)',
    mimeType: 'image/jpeg',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    description: 'An executive headshot with uniform lighting, plastic-like flawless skin, and perfectly clean synthetic shoulders.'
  },
  {
    id: 'landscape',
    name: 'Dreamy Lake Cabin (AI Render)',
    mimeType: 'image/jpeg',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    description: 'An over-saturated mountain lake cabin with repeating foliage, uniform soft shadows, and unnatural clarity.'
  }
];

export const SAMPLE_SCRIPTS = [
  {
    id: 'tech_hook',
    title: 'This New AI Tool Changes Everything...',
    targetFormat: 'YouTube (10-min Dev/Tech video)',
    scriptText: `So, there is this brand new AI tool that just launched yesterday, and honestly, it is going to change how you write code forever.

In this video, I is going to do a completely honest review of it. First, we will sign up for an account. Then we will look at the pricing plans. Then I am going to show you how to install the npm package, and then we will write some code.

I think you will really find this package helpful because it saves at least 10 minutes a day. Let's get started!`
  },
  {
    id: 'finance_hook',
    title: 'How I Built a $10k/mo Passive Stream',
    targetFormat: 'TikTok/Shorts (60-sec video)',
    scriptText: `Hey guys, today I am showing you exactly how I built a passive income stream bringing in over $10,000 every single month.

It is actually super easy, anyone can do it. All you need is some free time, a laptop, and the willpower to succeed. First, you go to this website. Then you download this file, and then you resell it on this web market. It takes about 2 hours, and you will make easy money. No skills required!`
  }
];

export const SAMPLE_LANDING_PAGES = [
  {
    id: 'generic_saas',
    targetAudience: 'Early stage startup founders looking for productivity hacks',
    copyText: `## SynergyFlow - The Ultimate AI-Powered Ecosystem

Accelerate your cross-functional team productivity with our enterprise-ready, cutting-edge, next-generation task orchestration platform.

We leverage advanced machine learning synergies to streamline your deliverables, unlock mission-critical bandwidth, and scale your hyper-growth.

### Features:
- Intelligent Cloud native workflows
- AI task prioritizing smart engine
- Real-time deep insights analytics dashboard
- Robust military-grade security encryption

Get started today. Try it free for 14 days. No credit card required.`
  },
  {
    id: 'solopreneur_landing',
    targetAudience: 'Freelanners and developers wishing to build newsletters',
    copyText: `## Write-Daily: Send newsletters to subscribers inside 2 minutes.

Stop wasting 5 hours in Mailchimp editing HTML spacing problems.

Write-Daily uses clean simple text templates. It gives you a minimal clean typewriter writing mode, collects emails on a fast landing page, and delivers plain-text posts directly to subscriber inboxes. 

That's it. No templates, no drag-and-drop builders, no friction. Just writing.

Join 4,200 creators writing minimal newsletters.`
  }
];


// High-quality mock responses for users to see instant previews
export const DEMO_IMAGE_RESULTS: Record<string, ImageAnalysisResult> = {
  'cyberpunk': {
    aiScore: 82,
    verdict: 'This cyberpunk street visual triggers heavy synthetic premonitions. The primary culprit is the mathematical cleanliness of the atmospheric elements: light glows expand in perfect isotropic curves, and there is a total lack of organic camera lens imperfection or moisture scatter in the air.',
    problems: [
      { category: 'Lighting Uniformity', detail: 'No dynamic shadow occlusion. The dark corners of the alleys are filled with artificial environmental ambient light, leaving zero true black pixels.', intensity: 5 },
      { category: 'Hyper-Clean Edges', detail: 'Debris, concrete pillars, and neon signs meet with perfect mathematical sharp boundaries, lacking the physical dust accumulation, microscopic chamfers, or contact shadows of real cities.', intensity: 4 },
      { category: 'Composition & Focus', detail: 'A perfectly centered vanishing point aligned with a flat wide-angle lens. Standard cinematic setups rarely align elements so mechanically.', intensity: 3 },
      { category: 'Atmospheric Depth', detail: 'The synthetic fog is modeled uniformly across the camera coordinates, failing to show wind turbulence, thickness variance, or realistic multi-scatter light rays.', intensity: 4 }
    ],
    fixes: [
      { title: 'Inject Asymmetric Light Shadows', action: 'Add a dark vignette layer and manually brush in deep black occlusions behind foreground objects to isolate your neon emitters.', impact: 'Restores contrast depth, tricking the subconscious into believing lights are fighting physical limits.' },
      { title: 'Soften Focal Transitions', action: 'Apply a very shallow Gaussian Blur or optical lens blur to the background alleyways, keeping only a specific focus plane sharp.', impact: 'Mimics real analog camera optics and guides the viewer\'s eye naturally.' },
      { title: 'Add Selective Photographic Grain', action: 'Incorporate realistic high-frequency monochromatic film grain (2-3% opacity) focused primarily on soft shadow gradients.', impact: 'Breaks down the smooth digital color banding that screams "AI render".' }
    ],
    retentionPotential: 45
  },
  'headshot': {
    aiScore: 92,
    verdict: 'An classic synthetic headshot. The skin geometry is so mathematically simplified that it lacks pore asymmetry, subcutaneous blood warmth variance, or facial micro-imperfections. The hair strands render like perfect procedural splines.',
    problems: [
      { category: 'Skin Texture Smoothness', detail: 'Zero micro-wrinkles or capillary redness. The skin reflects light in a perfect Lambertian scattering pattern, resembling rendered wax rather than real epidermis.', intensity: 5 },
      { category: 'Specular Eye Reflections', detail: 'The catchlights in both eyes are perfectly symmetrical and uniform, suggesting an impossible, infinite studio light source with no camera or room reflection visible.', intensity: 4 },
      { category: 'Hair Proceduralism', detail: 'Hair meets the forehead in an unnaturally clean hairline, and strands do not overlap or break in organic chaotic patterns.', intensity: 4 }
    ],
    fixes: [
      { title: 'Introduce Skin Asymmetry', action: 'Add minor color temperature variance (cooler under eyes, warmer on cheeks) and manually retain or add microscopic skin grit/pores.', impact: 'Human brains are hardwired to notice perfect symmetry as either diseased or simulated. Imperfection is trust.' },
      { title: 'Distort Specular Catchlights', action: 'Erase identical reflection points in eyes. Add a subtle, asymmetrical smudge or secondary window reflection to one pupil.', impact: 'Simulates a real room and breaks artificial mirror optics.' },
      { title: 'Introduce Stray Hair Noise', action: 'Brush in stray flyaway strands that cut across the face and shoulders at irregular angles.', impact: 'Breaks the procedural spline appearance of AI rendering pipelines.' }
    ],
    retentionPotential: 28
  },
  'landscape': {
    aiScore: 74,
    verdict: 'An over-idealized fantasy landscape that breaks physical realism. Saturation levels across all color bands (especially forest greens and water blues) exceed natural atmospheric absorption limits, making the landscape look like a high-density game render.',
    problems: [
      { category: 'Texture Repetition', detail: 'Coniferous trees in the background share near-identical structural geometry, revealing that they were generated using clone stamp formulas or similar procedural seeds.', intensity: 4 },
      { category: 'Unnatural Chromatic Harmony', detail: 'The turquoise water maintains full vivid brilliance even inside shadowed rock basins where light shouldn\'t bounce effectively.', intensity: 5 },
      { category: 'Lack of Atmospheric Falloff', detail: 'Distant mountains are rendered with high local contrast, ignoring how dust, humidity, and Nitrogen molecules absorb light over miles.', intensity: 3 }
    ],
    fixes: [
      { title: 'Introduce Haze Falloff', action: 'Add a soft, low-contrast cyan brush layer over the farthest mountain range to push it backward.', impact: 'Implements classical aerial perspective, restoring immense physical scale.' },
      { title: 'Desaturate Hidden Shadows', action: 'Target desaturated blues and greens inside shadow areas to match natural ambient occlusion physics.', impact: 'Aligns the image light physics with what the human eye expects in real outdoor spaces.' }
    ],
    retentionPotential: 52
  }
};

export const DEMO_NARRATIVE_RESULTS: Record<string, NarrativeAnalysisResult> = {
  'tech_hook': {
    curiosityScore: 35,
    retentionGraph: [
      { timestampPercent: 0, tension: 40, energy: 30, label: 'Standard Intro Hook (Vague AI Tool claim)' },
      { timestampPercent: 20, tension: 25, energy: 40, label: 'Predictable Agenda Walkthrough (Viewer disengages)' },
      { timestampPercent: 50, tension: 15, energy: 20, label: 'NPM Install Setup (Dry details, click away)' },
      { timestampPercent: 80, tension: 35, energy: 60, label: 'Actual Coding demo starts (Slight recovery)' },
      { timestampPercent: 100, tension: 10, energy: 10, label: 'Flat Conclusion' }
    ],
    dangerZones: [
      {
        section: 'First, we will sign up for an account. Then we will look at the pricing plans. Then I am going to show you how to install...',
        issue: 'Pacing Predictability. You are announcing the structure like a dry school lecture. There is no tension or mystery, so the viewer has already predicted the next 5 minutes and skips/leaves.',
        solution: 'Skip the agenda entirely. Go straight into the painful problem. Show the tool in action doing something impossible *in the first 10 seconds*, then backtrack to installation later.'
      },
      {
        section: 'So, there is this brand new AI tool that just launched yesterday, and honestly, it is going to change how you write code forever.',
        issue: 'Vague, low-tension claim. "Changes code forever" is a generic buzz-phrase used by 1,000 other videos. It triggers skepticism rather than genuine curiosity.',
        solution: 'Give a concrete, high-contrast claim. E.g., "Yesterday, an AI built a full production app in 42 seconds. No imports. No boilerplate. Let\'s see if it can handle a database crash."'
      }
    ],
    psychologyBreakdown: {
      curiosityGap: 'The current curiosity gap is extremely weak. You tell the viewer exactly what the video is (a review) and what you will do. A powerful curiosity gap requires asking a specific question that the viewer *must know* the answer to, but cannot guess.',
      emotionalResonance: 'The emotional setup is flat. Saying "I think you will find this package helpful" is too clinical. Good attention engineering targets the viewer\'s time-frustration, fear of being code-obsolete, or curiosity about extreme speed.'
    }
  },
  'finance_hook': {
    curiosityScore: 48,
    retentionGraph: [
      { timestampPercent: 0, tension: 65, energy: 75, label: 'High-energy financial promise' },
      { timestampPercent: 25, tension: 40, energy: 50, label: 'Generic motivation claims' },
      { timestampPercent: 50, tension: 20, energy: 40, label: 'Vague resale tutorial steps' },
      { timestampPercent: 75, tension: 15, energy: 30, label: 'Overloaded hand-waving info' },
      { timestampPercent: 100, tension: 5, energy: 10, label: 'Skepticism/Drop-off' }
    ],
    dangerZones: [
      {
        section: 'It is actually super easy, anyone can do it. All you need is some free time...',
        issue: 'Zero friction alarm. When you say something is "super easy, anyone can do it", human psychology triggers defense alarms. Skepticism skyrockets, causing viewers to leave because it sounds like a scam.',
        solution: 'Introduce an authentic friction indicator. E.g., "The catch is, 90% of people mess up the second step because they get greedy. Here is why."'
      }
    ],
    psychologyBreakdown: {
      curiosityGap: 'The gap is broad but shallow ("How to make money"). It is saturated on modern platforms. Deepen it by making the path feel secret, high-contrast, or counter-intuitive.',
      emotionalResonance: 'Aspiration-centric but lacks realistic struggle. Audiences bond with struggle and authenticity, not effortless luxury. Introduce the struggle early to ground the payoff.'
    }
  }
};

export const DEMO_LANDING_RESULTS: Record<string, LandingAnalysisResult> = {
  'generic_saas': {
    contrastScore: 32,
    premiumPerception: 'Extremely broken premium perception. The copy reads like a dictionary of corporate buzzwords ("SynergyFlow", "Synergy", "Next-generation", "Hyper-growth"). This sounds like standard, low-integrity generated text and instant credibility drop.',
    frictionPoints: [
      {
        element: 'SynergyFlow - The Ultimate AI-Powered Ecosystem',
        frictionType: 'Empty Buzzwords',
        whyItFails: 'Vague marketing jargon. "Ultimate AI-Powered Ecosystem" says literally nothing about what the app does. Founders close the tab because they feel their intelligence is being insulted.',
        improvement: 'Use literal, benefit-driven clarity. E.g., "Sync dev tasks, design specs, and copy feedback into a single, auto-sorted feed."'
      },
      {
        element: 'Intelligent Cloud native workflows / Robust military-grade security encryption',
        frictionType: 'Unsubstantiated Trust Cues',
        whyItFails: '"Military-grade security" is widely recognized as a cheap copy-paste line. It actually reduces trust because high-security systems explain *how* they are secure (e.g., SOC-2 certified, end-to-end encrypted).',
        improvement: 'Replace with precise details. E.g., "SOC-2 Type II Certified, running on end-to-end AES-256 encrypted datastores."'
      }
    ],
    valuePropEvaluation: {
      clarity: 'Very low clarity. After 10 seconds of reading, the user has absolutely no practical understanding of what buttons they will click or how this saves them time.',
      psychologicalAngle: 'Attempts to target "leverage" and "scaling", but does so via abstract metaphors. High-converting SaaS targets specific hours saved or concrete pain removed.'
    }
  },
  'solopreneur_landing': {
    contrastScore: 88,
    premiumPerception: 'Extraordinarily high premium perception through absolute authenticity and literal contrast. By rejecting standard corporate templates and explaining exact friction ("Stop wasting 5 hours in Mailchimp editing HTML"), you set a premium, high-trust tone.',
    frictionPoints: [
      {
        element: 'No templates, no drag-and-drop builders, no friction. Just writing.',
        frictionType: 'Slightly Vague Core Engine',
        whyItFails: 'While the philosophy is clean, users might wonder if the emails delivered look ugly or broken in outlook.',
        improvement: 'Add a fast subtext: "Emails look identical to handwritten Apple Mail letters, bypassing the Promotions folder completely."'
      }
    ],
    valuePropEvaluation: {
      clarity: 'Instant clarity. Within 3 seconds, the target solopreneur knows exactly what they get (newsletters sent in 2 minutes) and what they get rid of (HTML alignment struggles).',
      psychologicalAngle: 'Targets the "relief of frustration" and "speed/efficiency". It triggers a high-status feeling of using a bespoke tools for craftsmen.'
    }
  }
};
