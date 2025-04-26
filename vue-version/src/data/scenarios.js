// src/data/scenarios.js
export const scenarios = [
  {
    id: 1,
    situation: "Your toddler refuses to put on their shoes when you're running late for an appointment.",
    childAge: "2-3 years",
    developmentStage: "toddler",
    developmentContext: "Testing independence and boundaries",
    options: [
      {
        id: 1,
        text: "Get down to their level and calmly explain why we need to wear shoes",
        outcome: "Your child feels heard and understood. While it takes a few minutes, they cooperate with putting on their shoes.",
        socialEmotionalLearning: "Builds trust, communication, and cooperation. Teaches problem-solving and emotional validation.",
        strategy: "activeListening",
        impact: "positive"
      },
      {
        id: 2,
        text: "Try to make it into a fun game",
        outcome: "Your child gets excited about the 'shoe game' and willingly participates.",
        socialEmotionalLearning: "Creates positive associations with routines and models creative problem-solving.",
        strategy: "positiveReinforcement",
        impact: "positive"
      },
      {
        id: 3,
        text: "Put the shoes on for them while they resist",
        outcome: "Your child becomes more upset and the struggle intensifies, making you even later.",
        socialEmotionalLearning: "May increase resistance and stress, missing a chance to build independence and self-regulation.",
        strategy: "naturalConsequences",
        impact: "negative"
      }
    ],
    tip: "Toddlers often seek independence and control. Giving them choices within acceptable boundaries helps reduce power struggles."
  },
  {
    id: 4,
    situation: "Your toddler refuses to eat vegetables at dinner.",
    childAge: "2-3 years",
    developmentStage: "toddler",
    developmentContext: "Developing food preferences and autonomy",
    options: [
      {
        id: 1,
        text: "Offer a choice between two vegetables",
        outcome: "Your child feels in control and tries a few bites.",
        socialEmotionalLearning: "Supports autonomy and decision-making, reduces power struggles.",
        strategy: "activeListening",
        impact: "positive"
      },
      {
        id: 2,
        text: "Insist they finish everything on their plate",
        outcome: "Your child resists more and mealtime becomes stressful.",
        socialEmotionalLearning: "Can increase picky eating and negative associations with food.",
        strategy: "naturalConsequences",
        impact: "negative"
      },
      {
        id: 3,
        text: "Ignore the refusal and focus on pleasant conversation",
        outcome: "Your child eventually tries a bite without pressure.",
        socialEmotionalLearning: "Reduces mealtime stress and models positive eating habits.",
        strategy: "positiveReinforcement",
        impact: "positive"
      }
    ],
    tip: "Offering choices and keeping mealtimes positive encourages healthy eating habits."
  },
  {
    id: 5,
    situation: "Your preschooler is afraid to sleep alone at night.",
    childAge: "3-5 years",
    developmentStage: "preschool",
    developmentContext: "Developing independence and managing fears",
    options: [
      {
        id: 1,
        text: "Acknowledge their fear and offer a comfort object",
        outcome: "Your child feels understood and gradually becomes more comfortable sleeping alone.",
        socialEmotionalLearning: "Builds emotional security and coping skills.",
        strategy: "emotionalCoaching",
        impact: "positive"
      },
      {
        id: 2,
        text: "Let them sleep in your bed every night",
        outcome: "Your child feels safe but may become dependent on your presence.",
        socialEmotionalLearning: "Provides comfort but may delay independence.",
        strategy: "naturalConsequences",
        impact: "neutral"
      },
      {
        id: 3,
        text: "Dismiss their fear and insist they sleep alone",
        outcome: "Your child feels unsupported and becomes more anxious.",
        socialEmotionalLearning: "Can increase anxiety and reduce trust.",
        strategy: "emotionalCoaching",
        impact: "negative"
      }
    ],
    tip: "Gradually helping children face fears with support builds confidence and independence."
  },
  {
    id: 6,
    situation: "Your child is frustrated by a puzzle and wants to give up.",
    childAge: "3-5 years",
    developmentStage: "preschool",
    developmentContext: "Building persistence and problem-solving",
    options: [
      {
        id: 1,
        text: "Encourage them to try a different piece and praise their effort",
        outcome: "Your child feels motivated and keeps trying.",
        socialEmotionalLearning: "Fosters resilience, growth mindset, and self-confidence.",
        strategy: "positiveReinforcement",
        impact: "positive"
      },
      {
        id: 2,
        text: "Solve the puzzle for them",
        outcome: "The puzzle is finished, but your child loses interest.",
        socialEmotionalLearning: "Misses opportunity to build persistence and problem-solving.",
        strategy: "naturalConsequences",
        impact: "neutral"
      },
      {
        id: 3,
        text: "Tell them to stop whining and put the puzzle away",
        outcome: "Your child feels discouraged and avoids puzzles in the future.",
        socialEmotionalLearning: "Reduces motivation and willingness to try new challenges.",
        strategy: "emotionalCoaching",
        impact: "negative"
      }
    ],
    tip: "Praising effort and encouraging persistence helps children develop a growth mindset."
  }
];