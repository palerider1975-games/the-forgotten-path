export const EVENTS = [
    { level:1, type: 'dungeon', title:"La Crypte Abandonnée", description:"Une porte en pierre fissurée, à moitié recouverte de lierre, mène vers le bas dans l'obscurité. L'air qui s'en échappe est froid et sent la terre ancienne.", requiredItems: ["Torch", "Rope"]},
    { 
        level:1, 
        title:"Voyageur Perdu", 
        description:"Un voyageur fatigué vous demande son chemin vers la ville la plus proche. Il a l'air inoffensif et simplement désorienté.", 
        choices:[
            {label:"Aider", best: true},
            {label:"Mentir"},
            {label:"Exiger un paiement"},
            {label:"Ignorer"}
        ] 
    },
    { level:1, title:"Ruine Paisible", description:"Vous découvrez les ruines silencieuses d'une ancienne tour de guet. Il n'y a aucun signe de monstre, juste le vent qui siffle à travers les pierres.", choices:[{label:"Fouiller", best:true},{label:"Se reposer"},{label:"Gratter votre nom"},{label:"Partir"}] },
    { level:2, title:"Musicien Itinérant", description:"Le son joyeux d'un luth vous parvient. Vous trouvez un barde assis sur un rocher, composant une nouvelle chanson. Il vous fait un clin d'œil en vous voyant approcher.", choices:["Donner une pièce","Demander une chanson","Chanter avec lui","Partir en silence"] },
    { level:2, title:"Animal Étrange", description:"Un écureuil avec une fourrure d'un violet éclatant jacasse sur une branche au-dessus de vous. Il laisse tomber une noix brillante à vos pieds.", choices:["Prendre la noix","Lui parler","Lancer une pierre","Ignorer"] },
    { level:2, title:"Rivière Obstinée", description:"Une rivière rapide et large bloque votre chemin. Il n'y a pas de pont en vue, mais un grand arbre abattu pourrait faire l'affaire un peu plus loin.", choices:["Traverser à la nage","Utiliser une Corde","Chercher un gué","Faire demi-tour"] },

    { 
        level:1, 
        title:"Abandoned Camp", 
        description:"You stumble upon an abandoned camp...", 
        choices:[
            {
                label: "Search tents", best: true,
                followUp: {
                    description: "Inside the largest tent, you find a weathered map lying on a bedroll next to a small, locked wooden chest.",
                    choices: [
                        {label: "Take the map", best: true}, 
                        {label: "Try to open the chest"}
                    ]
                }
            },
            {label: "Take food"},
            {label: "Rest"},
            {label: "Leave"}
        ] 
    },
    { 
        level:1, 
        title:"Fairy Ring", 
        description:"In a quiet clearing, a perfect circle of mushrooms emits a soft, ethereal glow...", 
        choices:[
            {
                label: "Dance", best: true,
                followUp: {
                    description: "As you dance, the lights intensify... A shimmering, ethereal figure coalesces in the center...",
                    choices: [
                        {label: "Ask for a blessing", best: true}, 
                        {label: "Ask for riches"}
                    ]
                }
            },
            {label: "Pluck a mushroom"},
            {label: "Ask for boon"},
            {label: "Wait"}
        ] 
    },
    { 
        level:1, 
        title:"Rusty Shrine", 
        description:"Hidden by moss and time, you find a tiny, forgotten shrine...", 
        choices:[
            {
                label: "Pray", best: true,
                followUp: {
                    description: "You kneel and offer a silent prayer... You feel as though an offering would be appreciated.",
                    choices: [
                        {label: "Offer 10 Gold", best: true}, 
                        {label: "Offer a simple blessing", best: true}
                    ]
                }
            },
            {label: "Search offering bowl"},
            {label: "Clean altar"},
            {label: "Kick it over"}
        ] 
    },

    { level:1, title:"Goblin Ambush", description:"Rustling leaves turn into a sudden threat...", choices:[{label:"Fight", best:true},{label:"Run", best:true},{label:"Hide"},{label:"Offer food"}], monster: { name: "Goblins", emoji: "👺" }},
    { level:1, title:"Merchant Caravan", description:"A colorful merchant caravan trundles along the path...", choices:[{label:"Trade (20 Gold)", best: true},{label:"Discuter"},{label:"Gamble"},{label:"Ignore"}] },
    { level:2, title:"Cursed Ruins", description:"Ancient stone arches, choked with thorny vines, loom before you...", choices:[{label:"Read runes"},{label:"Leave offering"},{label:"Break a seal"},{label:"Explore tunnels", best: true}] },
    { level:2, title:"Haunted Bridge", description:"A rickety wooden bridge spans a deep, foggy chasm...", choices:[{label:"Cross slowly"},{label:"Sprint"},{label:"Repair planks", best:true},{label:"Shout a name"}] },
    { level:2, title:"Witch’s Hut", description:"Deep in the woods, a crooked hut with a smoking chimney stands alone...", choices:[{label:"Knock", best:true},{label:"Peek inside"},{label:"Drink potion"},{label:"Set a snare"}] },
    { level:3, title:"Bandit King’s Bargain", description:"You are brought before the Bandit King...", choices:[{label:"Fight"},{label:"Pay"},{label:"Join", best:true},{label:"Sneak away"}], monster: { name: "Bandit King", emoji: "👑" } },
  ];
  export const OUTCOME_TEXTS = {
    SUCCESS: ["Your quick thinking pays off.", "A fortunate outcome! Your skills prove sufficient.", "Success! The situation is resolved in your favor.", "Well done. You handle the challenge with ease."],
    FIGHT_SUCCESS: ["Your martial prowess wins the day. The enemy is defeated.", "A fierce battle, but you emerge victorious.", "With steel and courage, you overcome the threat."],
    DEATH: ["Your wounds are too severe. Your journey ends here.", "You were overwhelmed. Darkness takes you.", "You have succumbed to your injuries.", "Your adventure concludes as your life force fades."]
  };
