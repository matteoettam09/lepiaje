import { AnimateOnScroll } from "../animate_view_on_scroll/animate_view_on_scroll";
import Link from "next/link";

//TODO add real data
const milestones = [
  { year: 2010, event: "A start", link: "https://www.wikipedia.org/" }, //TODO use link to navigate to another page
  { year: 2013, event: "A milestone reached here", link: "" },
  { year: 2016, event: "Another accomplishment here", link: "" },
  { year: 2019, event: "Accomplishment here", link: "" },
  { year: 2022, event: "Nowadays", link: "" },
];

export function OurHistory() {
  return (
    <AnimateOnScroll index={4} className="py-16 bg-brand-linen">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-brand-ink">
          Our History
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-brand-sand"></div>
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={`flex items-center mb-8 ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`w-5/12 ${
                  index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                }`}
              >
                <h3 className="font-bold text-xl text-brand-ink">
                  {milestone.year}
                </h3>
                <p className="text-brand-muted">{milestone.event}</p>

                <Link href={milestone.link} target="_blank">
                  <button className="mt-4 px-6 py-3 bg-brand-terracotta text-brand-linen font-semibold hover:bg-brand-terracotta-dark transition-colors duration-300">
                    Learn More
                  </button>
                </Link>
              </div>
              <div className="w-2/12 flex justify-center">
                <div className="w-3 h-3 bg-brand-terracotta rounded-full"></div>
              </div>
              <div className=" bg-slate-20 w-5/12"></div>
            </div>
          ))}
        </div>
      </div>
    </AnimateOnScroll>
  );
}
