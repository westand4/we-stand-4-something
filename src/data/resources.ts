/**
 * Partner resources listed on the Resources page, grouped by topic.
 * Descriptions are based on each organisation's own website (checked October 2026).
 */
export interface Resource {
  name: string;
  /** One plain-language sentence: what it is and who it helps. */
  description: string;
  url: string;
  /** True when the link opens a PDF document. */
  pdf?: boolean;
  /** More links shown under the main one, e.g. an application form. */
  extraLinks?: { label: string; url: string; pdf?: boolean }[];
  /**
   * The organisation's logo: either a file in this repository under public/ (starting with "images/"),
   * or a path on the old Wix image CDN.
   */
  logo: string;
}

export interface ResourceGroup {
  id: string;
  title: string;
  resources: Resource[];
}

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: 'finding-services',
    title: 'Finding services',
    resources: [
      {
        name: 'Delaware Disability Hub',
        description:
          'Information and connections on education, employment, health, housing, legal issues and transportation, for young people moving into adult life, their families and the professionals who support them.',
        url: 'https://deldhub.gacec.delaware.gov/',
        logo: 'f45d39_92794a9a269a4f4b9a09152d51dafb81~mv2.png/v1/fill/w_562,h_450,al_c,lg_1,q_85/DDH_edited.png',
      },
      {
        name: 'Guide to Services for Older Delawareans and Persons with Disabilities',
        description:
          'A directory of state services from the Division of Services for Aging and Adults with Physical Disabilities.',
        url: 'https://dhss.delaware.gov/dhss/dsaapd/files/aging_and_disabilities_guide.pdf',
        pdf: true,
        logo: 'f45d39_ea356b7e1af94a81817b2c9fc5f79e69~mv2.png/v1/fill/w_324,h_422,al_c,lg_1,q_85/DHSS_edited.png',
      },
    ],
  },
  {
    id: 'housing',
    title: 'Housing',
    resources: [
      {
        name: 'Handbook for Renters',
        description:
          'A guide to renting a home, from Delaware’s Division of Developmental Disabilities Services.',
        url: 'https://docs.wixstatic.com/ugd/1829a9_888cd069874748a98f5e40334c013705.pdf',
        pdf: true,
        logo: 'f45d39_c14795d3ad5b49e6a1c885f660148fe7~mv2.png/v1/fill/w_510,h_380,al_c,lg_1,q_85/House-removebg-preview.png',
      },
    ],
  },
  {
    id: 'transportation',
    title: 'Transportation',
    resources: [
      {
        name: 'DART Paratransit',
        description:
          'Delaware’s paratransit bus service for people with disabilities and older adults. To sign up, fill in DART’s application form.',
        url: 'https://dartfirststate.com/services/para_services.shtml',
        extraLinks: [
          {
            label: 'Get the application form',
            url: 'https://www.dartfirststate.com/RiderInfo/Paratransit/pdfs/ADAForm.pdf',
            pdf: true,
          },
        ],
        logo: 'f45d39_3c9f6a123f204a3c8ac51008f288276d~mv2.jpg/v1/fill/w_450,h_450,al_c,lg_1,q_80/DART.jpg',
      },
    ],
  },
  {
    id: 'rights',
    title: 'Your rights and the ADA',
    resources: [
      {
        name: 'Mid-Atlantic ADA Center',
        description:
          'Answers questions and offers training about the Americans with Disabilities Act (ADA) for people, businesses and public agencies in Delaware and nearby states.',
        url: 'https://www.adainfo.org/',
        logo: 'f45d39_f53e48d8dab143ca8cc233664f037c2d~mv2.png/v1/fill/w_320,h_320,al_c,q_85,usm_0.66_1.00_0.01/ADA.png',
      },
      {
        name: 'Disability Rights Delaware',
        description:
          'Free legal help and advocacy for children and adults with disabilities, including special education, Medicaid and Medicare, housing and workplace accommodations, assistive technology and voting access. Delaware’s official Protection and Advocacy agency, run by Community Legal Aid Society, Inc. (CLASI).',
        url: 'https://www.declasi.org/programs-and-units/disability-rights-services/',
        logo: 'images/resources/clasi-logo.webp',
      },
    ],
  },
  {
    id: 'brain-injury',
    title: 'Brain injury',
    resources: [
      {
        name: 'Traumatic Brain Injury Fund',
        description:
          'Helps Delaware residents with a traumatic brain injury pay for things like home changes, assistive technology and medical equipment that other agencies don’t cover. Run by the State Council for Persons with Disabilities.',
        url: 'https://scpd.delaware.gov/brainToolkit/biFinAssist/index.shtml?dc=fundApp',
        logo: 'f45d39_e219687224c343498d0e3be8ca6d015d~mv2.jpg/v1/fill/w_346,h_346,al_c,lg_1,q_80/SCPD-Logo.jpg',
      },
    ],
  },
  {
    id: 'autism',
    title: 'Autism',
    resources: [
      {
        name: 'Autism Delaware',
        description: 'A nonprofit supporting people with autism and their families across Delaware.',
        url: 'https://www.autismdelaware.org/',
        logo: 'f45d39_953c5bcfa6284d16a500b58d8295ff76~mv2.png/v1/fill/w_302,h_302,al_c,q_85,usm_0.66_1.00_0.01/Autism-Delaware_edited.png',
      },
    ],
  },
  {
    id: 'fitness-social',
    title: 'Fitness and social life',
    resources: [
      {
        name: 'EPIC (Endless Possibilities in the Community)',
        description:
          'Inclusive fitness and social programs in Newark for adults with intellectual, developmental or physical disabilities.',
        url: 'https://www.epicdelaware.org/',
        logo: '520a71_e47fedb92a274afa8e8060ffce801225~mv2.png',
      },
    ],
  },
];

/** The website's address without "https://www." — shown so people know where a link goes. */
export const displayHost = (url: string): string => new URL(url).hostname.replace(/^www\./, '');
