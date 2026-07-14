import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Sibling Stack",
  description: "How Sibling Stack collects, uses, and protects your personal information and your children's data.",
  alternates: { canonical: "https://www.siblingstack.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-ink-muted text-sm underline">
          ← Sibling Stack
        </Link>

        <h1 className="font-display text-3xl text-ink mt-6 mb-2">
          Privacy Policy
        </h1>
        <p className="text-ink-muted text-xs font-mono mb-10">
          Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose-sibling">
          <h2>Who we are</h2>
          <p>
            Sibling Stack is a baby and toddler schedule tracking tool and
            content site built for parents whose children are close in age.
            References to "we," "us," or "our" in this policy refer to Sibling
            Stack.
          </p>

          <h2>What information we collect</h2>
          <p>
            <strong>Account information.</strong> When you create an account, we
            collect your email address and a password (stored as a secure hash —
            we never see your actual password). Auth is managed by Supabase.
          </p>
          <p>
            <strong>Tracking data you enter.</strong> Sleep sessions, feed logs,
            diaper changes, milestones, and notes you add for each child are
            stored in Supabase (PostgreSQL), associated with your household account.
          </p>
          <p>
            <strong>Children's information.</strong> You may enter a first name
            and date of birth for each child in order to use the scheduling
            features. We do not collect any additional identifying information
            about your children.
          </p>
          <p>
            <strong>Waitlist email.</strong> If you submit your email via the
            waitlist form without creating a full account, we store only your
            email address and the page you submitted from.
          </p>
          <p>
            <strong>Analytics.</strong> We use Google Analytics (GA4) to collect
            aggregated, anonymized page-view and interaction data (e.g. which
            pages are visited, how long users stay, approximate geographic
            region). GA4 does not log individual IP addresses or share data with
            Google for advertising purposes. We also use in-house anonymous
            analytics (event data stored in Supabase) to collect usage patterns
            (e.g. which features are used, how often the dashboard is opened).
            These events do not contain personally identifiable information.
          </p>

          <h2>How we use your information</h2>
          <p>
            We use the information we collect to operate the tracking features,
            send you updates you have opted into via the waitlist, and improve
            the product based on aggregated, anonymous usage patterns. We do not
            sell your personal information or share it with third parties for
            advertising purposes.
          </p>

          <h2>Affiliate links</h2>
          <p>
            Some articles on this site contain affiliate links. As an Amazon
            Associate, we earn from qualifying purchases. Clicking an affiliate
            link does not cost you anything extra. We only link to products we
            would genuinely recommend regardless of any commission.
          </p>

          <h2>Cookies and local storage</h2>
          <p>
            Supabase Auth uses browser cookies and local storage to
            keep you signed in across sessions. Google Analytics uses cookies
            to distinguish unique visitors. You can opt out of GA tracking via
            the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google Analytics opt-out browser add-on
            </a>. We do not use third-party advertising cookies.
          </p>

          <h2>Data retention</h2>
          <p>
            Your account data is retained for as long as your account is active.
            You may request deletion of your account and associated data by
            emailing us at the address below. Waitlist entries are retained
            until you unsubscribe or request removal.
          </p>

          <h2>Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data at any time. To exercise these rights, contact us at
            the email address below.
          </p>

          <h2>Children's privacy</h2>
          <p>
            Sibling Stack is a service used by parents and caregivers — not
            directly by children. We do not knowingly collect information from
            children under 13 as account holders. The children's names and
            dates of birth entered into the tracker are provided by adult account
            holders and are treated with the same protections as all user data.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. When we do, we will
            update the "last updated" date at the top of this page. Continued
            use of Sibling Stack after a policy change constitutes acceptance of
            the updated policy.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy:{" "}
            <a href="mailto:contactus@siblingstack.com">contactus@siblingstack.com</a>.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-surface2">
          <Link href="/" className="text-ink-muted text-xs underline font-mono">
            ← Back to Sibling Stack
          </Link>
        </div>
      </div>
    </main>
  );
}
