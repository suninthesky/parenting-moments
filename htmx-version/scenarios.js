const scenarios = [
    {
        id: 1,
        situation: "Your toddler refuses to put on their shoes when you're running late for an appointment.",
        childAge: "2-3 years",
        developmentStage: "Toddler",
        developmentInfo: "At this age, children are developing independence and may test boundaries frequently.",
        options: [
            {
                id: 1,
                text: "Get down to their level and calmly explain why we need to wear shoes",
                outcome: "Your child feels heard and understood. While it takes a few minutes, they cooperate with putting on their shoes.",
                educationalNote: "Taking time to communicate respect for your child's feelings while maintaining boundaries helps build trust."
            },
            {
                id: 2,
                text: "Try to make it into a fun game",
                outcome: "Your child gets excited about the 'shoe game' and willingly participates.",
                educationalNote: "Play is a powerful tool for getting cooperation from toddlers."
            },
            {
                id: 3,
                text: "Put the shoes on for them while they resist",
                outcome: "Your child becomes more upset and the struggle intensifies, making you even later.",
                educationalNote: "Forcing physical compliance can damage trust and lead to more resistance in the future."
            }
        ],
        tip: "Toddlers often seek independence and control. Giving them choices within acceptable boundaries can help reduce power struggles."
    },
    {
        id: 2,
        situation: "Your child is having difficulty sharing toys during a playdate.",
        childAge: "2-3 years",
        developmentStage: "Toddler",
        developmentInfo: "Sharing is a complex skill that develops gradually. Toddlers are still learning about ownership and taking turns.",
        options: [
            {
                id: 1,
                text: "Use a timer and explain taking turns",
                outcome: "The children learn to wait for their turn and the concept becomes clearer with practice.",
                educationalNote: "Using concrete tools like timers helps make abstract concepts more understandable for toddlers."
            },
            {
                id: 2,
                text: "Immediately make them share",
                outcome: "Your child becomes upset and grabs the toy back as soon as possible.",
                educationalNote: "Forced sharing can create anxiety about possessions and doesn't teach the underlying skill."
            },
            {
                id: 3,
                text: "Offer alternative toys to both children",
                outcome: "The children become interested in different toys, reducing the conflict naturally.",
                educationalNote: "Sometimes the best solution is to avoid the power struggle while maintaining a positive environment."
            }
        ],
        tip: "Learning to share takes time and practice. Focus on teaching turn-taking as a stepping stone to sharing."
    }
];

module.exports = scenarios; 