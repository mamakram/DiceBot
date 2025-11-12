export const fr = {
  // Success messages
  success: {
    itemAdded: "Item ajouté !",
    perkAdded: "Perk ajoutée !",
    characterCreated: "Personnage créé !",
    equipmentAdded: "Equipement ajouté !",
    imageAdded: "Image ajoutée",
    playerDeleted: (name: string) => `${name} a été supprimé !`,
    playerHP: (name: string, hp: number) => `${name} a ${hp} PV`,
    commandExecuted: "Commande exécutée",
    disconnected: "Déconnecté du vocal",
  },

  // Error messages
  error: {
    generic: "Erreur",
    missingValues: "Il manque des valeurs.",
    nameAlreadyUsed: "Nom déjà utilisé",
    playerDoesNotExist: "Ce joueur n'existe pas",
    badSyntax: "Erreur : mauvaise syntaxe",
    badChoice: "Mauvais choix",
    useSlashCommand: "Utilisez cette commande en /",
    notInVoiceChannel: "Faut etre dans un channel vocal pour ça !",
  },

  // Modal titles
  modal: {
    enterPerkName: "Nom de la perk",
    enterItemName: "Nom de l'item",
    enterEquipmentName: "Nom de l'équipement",
    enterCondition: "Condition de la perk",
    enterDescription: "Description de l'équipement",
    enterPlayerName: "Nom du joueur",
  },

  // Command descriptions
  commandDescriptions: {
    addEquipment: "Ajouter un équipement à un joueur",
    addHP: "Ajouter des PV à un joueur",
    addItem: "Ajouter un item à un joueur",
    addPerk: "Ajouter une qualité/défaut à un joueur",
    addProfilePicture: "Ajouter une photo de profil à un joueur",
    createPlayer: "Créer un nouveau personnage",
    delete: "Supprime le personnage associé au joueur",
    roll: "Lancer de dés",
    help: "Message d'aide",
    info: "Fiche d'un personnage",
    inventory: "Inventaire d'un personnage",
    leave: "Quitte le channel vocal",
    play: "Jouer un son",
    removeHP: "Enlever des PV a un joueur",
    status: "Montre le statut de tous les joueurs",
  },

  // Command option descriptions
  optionDescriptions: {
    user: "L'utilisateur",
    amount: "Quantité de PV à ajouter",
    amountToRemove: "Quantité de PV à enlever",
    image: "Lien vers l'image",
    dice: "Dé a lancer (e.g., 2d6)",
    track: "Piste a lancer",
  },

  // Command usage help
  usage: {
    addPerk: "?ajouterPerk @joueur",
    addHP: "?ajouterPV @joueur quantité",
    removeHP: "?enleverPV @joueur quantité",
    addItem: "?ajouterItem @joueur",
    addProfilePicture: "/ajouterphoto @joueur lien",
    addEquipment: "?ajouterEquipement @joueur",
    delete: "?supprimer @joueur",
    info: "?info @joueur",
    inventory: "?inventaire @joueur",
  },

  // Help embed
  help: {
    title: "Dicebot",
    description:
      "Bot de lancer de dés et fonctionnalités JDR, commandes en ? ou en /",
    sections: {
      diceRoll: {
        title: "Lancer de dés",
        commands: {
          roll: "jette un dé. Exemple: ?r 2d6",
        },
      },
      sounds: {
        title: "Sons",
        play: "fight/brook/smash/ultra/filler",
        quit: "déconnecte le bot du channel vocal",
      },
      sheets: {
        title: "Fiches",
        description:
          "Les commandes ouvrent un menu de sélection si un joueur a plusieurs personnages",
        commands: {
          new: "Créer un nouveau personnage",
          delete: "Supprime le personnage",
          addPerk: "Ajouter une nouvelle perk au joueur",
          addEquipment: "Ajouter un équipement au joueur",
          addItem: "Ajouter un item au joueur",
          addProfilePicture: "Ajouter une photo à un personnage",
          info: "Donne les infos du personnage",
          status: "Statut des joueurs",
          addHP: "?ajouterPV @joueur quantité",
          removeHP: "?enleverPV @joueur quantité",
        },
      },
    },
  },

  // Dice roll
  diceRoll: {
    result: "Result : ",
    sum: "\nSum: ",
    format: (amount: number, cap: number) => ` (${amount}d${cap})`,
  },

  // Status
  status: {
    title: "Statut",
    skull: ":skull: ",
    hp: (current: number, max: number) => `${current}/${max} PV`,
  },

  // Play choices
  playChoices: {
    sad: "Sad",
    fight: "Fight",
    brook: "Brook",
    smash: "Smash",
    ultra: "Ultra Instinct",
    elevator: "Ascenseur",
  },

  // Menus and UI
  menus: {
    selection: {
      perk: {
        chooseExisting: "Choisir une perk préexistante",
        placeholder: "perks",
        noExisting: "Pas de perks préexistantes",
        createNew: "ou créer une nouvelle perk",
      },
      equipment: {
        chooseExisting: "Choisir un équipement préexistant",
        placeholder: "équipements",
        noExisting: "Pas d'équipements préexistants",
        createNew: "ou créer un nouvel équipement",
      },
      item: {
        chooseExisting: "Choisir un item préexistant",
        placeholder: "items",
        noExisting: "Pas d'items préexistants",
        createNew: "ou créer un nouvel item",
      },
    },
    buttons: {
      create: "Créer",
      validate: "Valider",
      chooseName: "Choisir nom",
      chooseCondition: "Choisir Condition",
      chooseDescription: "Choisir description",
      addModifier: "Ajouter modification",
    },
    labels: {
      perkName: "Nom de la perk: ",
      equipmentName: "Nom de l'équipment: ",
      itemName: "Nom de l'item: ",
      playerName: "Nom du personnage: ",
      condition: "Condition (optionnel) :",
      description: "Description (optionnel) :",
      bodyPart: "Partie du corps",
      amount: "quantité",
      player: "Joueur",
      hp: "PV",
      stat: "Stat",
      value: "valeur",
      chooseStats: "Choisissez les **stats** de base du joueur:",
      enter: (name: string) => `Entrez ${name} :`,
    },
  },

  // Command mapping
  textCommands: {
    roll: "?r",
    info: "?info",
    inventory: "?inventaire",
    new: "?nouveau",
    addHP: "?ajouterPV",
    removeHP: "?enleverPV",
    delete: "?supprimer",
    status: "?statut",
    addPerk: "?ajouterPerk",
    addProfilePicture: "?ajouterphoto",
    addEquipment: "?ajouterEquipement",
    addItem: "?ajouterItem",
    help: "?help",
    quit: "?quitter",
    play: "?play",
  },

  slashCommands: {
    roll: "roll",
    info: "info",
    inventory: "inventaire",
    new: "nouveau",
    addHP: "ajouterpv",
    removeHP: "removehp",
    delete: "supprimer",
    status: "statut",
    addPerk: "ajouterperk",
    addEquipment: "ajouterequipement",
    addItem: "ajouteritem",
    addProfilePicture: "ajouterphoto",
    help: "help",
    quit: "quitter",
    play: "play",
  },
};
