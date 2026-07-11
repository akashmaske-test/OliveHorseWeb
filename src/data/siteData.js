import business from "../../content/business.json";
import faq from "../../content/faq.json";
import homepage from "../../content/homepage.json";
import programmes from "../../content/programmes.json";
import testimonials from "../../content/testimonials.json";

export const siteData = {
  business,
  faq,
  homepage,
  programmes,
  testimonials,
};

export const formspreeEndpoint = "https://formspree.io/f/mwvdgqng";

export const imageMap = {
  logo: "/images/01-logo.png",
  founder: "/images/02-founder-pravin-nawale.png",
  hero: "/images/03-group-training-session.png",
  programmes: {
    "kids-beginner-karate": "/images/04-kids-karate-class.png",
    "teen-karate-fitness": "/images/05-teen-karate-class.png",
    "adult-karate-self-defence": "/images/06-adult-karate-class.png",
    "womens-self-defence": "/images/07-womens-self-defence.png",
    "private-karate-coaching": "/images/08-private-coaching.png",
    "competition-karate-training": "/images/09-competition-training.png",
  },
  ageGroups: {
    Children: "/images/04-kids-karate-class.png",
    Teenagers: "/images/05-teen-karate-class.png",
    Adults: "/images/06-adult-karate-class.png",
    Women: "/images/07-womens-self-defence.png",
  },
  gallery: [
    "/images/09-competition-training.png",
    "/images/10-belt-examination.png",
    "/images/11-group-achievement.png",
    "/images/12-academy-interior.png",
    "/images/03-group-training-session.png",
  ],
};

export const programmeOrder = [
  "kids-beginner-karate",
  "teen-karate-fitness",
  "adult-karate-self-defence",
  "womens-self-defence",
  "private-karate-coaching",
  "competition-karate-training",
];
