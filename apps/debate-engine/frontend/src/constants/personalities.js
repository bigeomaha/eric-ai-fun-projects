/**
 * Frontend personality constants — UI labels and IDs only.
 * Full style definitions live on the backend (personalities.js).
 */

export const PERSONALITIES = [
  { id: "professor",  label: "The Professor"      },
  { id: "preacher",   label: "The Preacher"        },
  { id: "sergeant",   label: "The Drill Sergeant"  },
  { id: "philosopher",label: "The Philosopher"     },
  { id: "lawyer",     label: "The Defense Lawyer"  },
  { id: "politician", label: "The Politician"      },
  { id: "scientist",  label: "The Data Scientist"  },
  { id: "comic",      label: "The Standup Comic"   },
  { id: "therapist",  label: "The Therapist"       },
  { id: "journalist", label: "The Journalist"      },
  { id: "founder",    label: "The Startup Founder" },
  { id: "grandparent",label: "The Grandparent"     },
];

export const GROUPS = [
  { id: "family", label: "The Family Table",       forRole: "Parent",     againstRole: "Teenager"          },
  { id: "office", label: "The Corner Office",      forRole: "CEO",        againstRole: "Whistleblower"     },
  { id: "money",  label: "Old Money / New Money",  forRole: "Aristocrat", againstRole: "Self-Made Hustler" },
  { id: "faith",  label: "Faith & The Frontlines", forRole: "Chaplain",   againstRole: "Combat Veteran"    },
];

export const DEFAULT_FOR_ID     = "professor";
export const DEFAULT_AGAINST_ID = "sergeant";
