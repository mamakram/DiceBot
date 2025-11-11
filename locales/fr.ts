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
  },

  // Error messages
  error: {
    generic: "Erreur",
    missingValues: "Il manque des valeurs.",
    nameAlreadyUsed: "Nom déjà utilisé",
  },

  // Modal titles
  modal: {
    enterPerkName: "Nom de la perk",
    enterItemName: "Nom de l'item",
    enterEquipmentName: "Nom de l'équipement",
    enterCondition: "Condition de la perk",
    enterPlayerName: "Nom du joueur",
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
    addHP: "ajouterPV",
    removeHP: "enleverPV",
    delete: "supprimer",
    status: "statut",
    addPerk: "ajouterPerk",
    addEquipment: "ajouterEquipement",
    addItem: "ajouterItem",
    help: "help",
    quit: "quitter",
    play: "play",
  },
};
