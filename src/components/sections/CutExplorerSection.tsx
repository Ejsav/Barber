import { SectionHead } from '@/components/ui/SectionHead';
import { CutExplorer } from '@/components/explorer/CutExplorer';

/* ----------------------------------------------------------------------------
 * The explorer, sitting on the homepage between the menu and the work.
 *
 * It is placed here deliberately: someone has just seen three services and a
 * price, and the very next thought is "which one is mine?". Answering it in
 * place — rather than on a page they would have to go and find — is the whole
 * reason the section earns its scroll.
 * -------------------------------------------------------------------------- */

export function CutExplorerSection() {
  return (
    <section
      className="on-bone relative bg-bone py-20 text-ink lg:py-32"
      aria-labelledby="explorer-heading"
    >
      <div className="shell">
        <SectionHead
          headingId="explorer-heading"
          index="02"
          label="Cut explorer"
          lines={['What are', 'you getting?']}
          standfirst="Say it however you say it. We will tell you what it is called, what it costs, how long it holds and whose hands are best at it."
          link={{ href: '/find-your-cut', label: 'Open the explorer' }}
          tone="bone"
        />

        <div className="mt-14 lg:mt-20">
          <CutExplorer tone="bone" />
        </div>
      </div>
    </section>
  );
}
