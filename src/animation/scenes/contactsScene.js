/**
 * CONTACTS SCENE ANIMATIONS
 *
 * Final contact sequence, including door animations and text transitions.
 *
 * TIME: 13400ms - 15200ms
 */

const createContactsAnimations = (
  SCENE_TIMING,
  _isPortrait,
  appearAt,
  _disappearAt,
  drawStrokes
) => {
  const {
    contacts: [contactsStart],
  } = SCENE_TIMING;

  return [
    ["contacts", appearAt(contactsStart, 200)],
    ["door *", drawStrokes(contactsStart + 1000, 800, 10)],
    ["doorlight", appearAt(contactsStart + 1700, 100)],
    ["doorlightwall", appearAt(contactsStart + 1700, 100)],
    ["doorhand *", drawStrokes(contactsStart + 2600, 100, 5)],
    [
      "contactMe",
      {
        [contactsStart]: { opacity: 0, display: "block" },
        [contactsStart + 200]: { opacity: 1, display: "block" },
        [contactsStart + 900]: { opacity: 1, display: "block" },
        [contactsStart + 1000]: { opacity: 0, display: "block" },
      },
    ],
  ];
};

export default createContactsAnimations;
