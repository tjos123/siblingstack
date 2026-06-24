import Link from "next/link";

export const metadata = {
  title: "Terms of Use — Sibling Stack",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-ink-muted text-sm underline">
          ← Sibling Stack
        </Link>

        <h1 className="font-display text-3xl text-ink mt-6 mb-2">
          Terms of Use
        </h1>
        <p className="text-ink-muted text-xs font-mono mb-10">
          Last updated:{" "}
          {new Date().toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="prose-sibling">
          <h2>1. Agreement to these terms</h2>
          <p>
            By accessing or using Sibling Stack (the "Service"), you agree to be
            bound by these Terms of Use. If you do not agree, please do not use
            the Service. These terms apply to all visitors, registered users, and
            anyone else who accesses the Service.
          </p>

          <h2>2. Description of the Service</h2>
          <p>
            Sibling Stack is a baby and toddler schedule tracking tool and
            content site designed for parents and caregivers of children who are
            close in age. Core tracking features are provided free of charge.
            Premium features may be introduced at a later date, governed by
            additional terms at that time.
          </p>

          <h2>3. Eligibility</h2>
          <p>
            You must be at least 18 years old to create an account and use the
            Service. By creating an account, you represent that you meet this age
            requirement and that any information you provide is accurate and
            complete.
          </p>

          <h2>4. Your account</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity that occurs under your
            account. You agree to notify us immediately if you suspect
            unauthorised use of your account. We are not liable for any loss or
            damage arising from your failure to keep your credentials secure.
          </p>

          <h2>5. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose or in violation of any applicable law or regulation.</li>
            <li>Upload or transmit any content that is harmful, offensive, defamatory, or infringes any third-party rights.</li>
            <li>Attempt to gain unauthorised access to any part of the Service, other users' accounts, or any system or network connected to the Service.</li>
            <li>Interfere with or disrupt the integrity or performance of the Service.</li>
            <li>Use automated means to scrape, harvest, or collect content or data from the Service without prior written consent.</li>
          </ul>

          <h2>6. Children's data</h2>
          <p>
            Sibling Stack is used by parents and caregivers — not directly by
            children. When you enter a child's name or date of birth into the
            Service, you represent that you are that child's parent or legal
            guardian, or that you have the authority to enter such information on
            behalf of the child's parent or legal guardian. You are responsible
            for the accuracy of all information you enter.
          </p>

          <h2>7. Affiliate links and third-party content</h2>
          <p>
            Some articles on this site contain affiliate links. As an Amazon
            Associate and participant in other affiliate programmes, we may earn
            a commission from qualifying purchases made through those links at no
            additional cost to you. Affiliate relationships do not influence our
            editorial recommendations. Third-party websites linked from the
            Service are governed by their own terms and privacy policies; we are
            not responsible for their content or practices.
          </p>

          <h2>8. Intellectual property</h2>
          <p>
            All content on the Service — including text, graphics, code, and
            design — is owned by or licensed to Sibling Stack and is protected
            by applicable intellectual property laws. You may not reproduce,
            distribute, or create derivative works from any content on the
            Service without our prior written consent, except for personal,
            non-commercial use.
          </p>

          <h2>9. User content</h2>
          <p>
            You retain ownership of any data you enter into the Service (your
            tracking logs, notes, and household information). By using the
            Service, you grant us a limited licence to store and process that
            data solely for the purpose of providing the Service to you. We do
            not claim ownership of your data and will not use it for any purpose
            beyond operating and improving the Service, as described in our{" "}
            <Link href="/privacy" className="text-childB underline">
              Privacy Policy
            </Link>
            .
          </p>

          <h2>10. Disclaimers</h2>
          <p>
            The Service is provided "as is" and "as available" without warranties
            of any kind, express or implied. We do not warrant that the Service
            will be uninterrupted, error-free, or free of harmful components.
          </p>
          <p>
            <strong>
              Nothing on Sibling Stack constitutes medical, clinical, or
              professional advice.
            </strong>{" "}
            Content about infant and toddler care, feeding, sleep, and
            development is for general informational purposes only. Always consult
            a qualified healthcare provider for advice specific to your child's
            health and development.
          </p>

          <h2>11. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Sibling Stack and
            its operators shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of data,
            revenue, or profits, arising out of or in connection with your use of
            the Service, even if we have been advised of the possibility of such
            damages.
          </p>

          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Sibling Stack and its
            operators from any claims, losses, damages, or expenses (including
            reasonable legal fees) arising from your use of the Service, your
            violation of these Terms, or your violation of any third-party rights.
          </p>

          <h2>13. Changes to these terms</h2>
          <p>
            We may update these Terms of Use from time to time. When we do, we
            will update the "last updated" date at the top of this page. Continued
            use of the Service after changes are posted constitutes your
            acceptance of the revised Terms. For material changes, we will make
            reasonable efforts to notify registered users by email.
          </p>

          <h2>14. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at our
            discretion, with or without notice, for any violation of these Terms
            or for any other reason we consider appropriate. You may close your
            account at any time by contacting us at the address below.
          </p>

          <h2>15. Governing law</h2>
          <p>
            These Terms are governed by applicable law. Any disputes will be
            resolved through good-faith negotiation in the first instance. If
            unresolved, disputes will be subject to the jurisdiction of the courts
            applicable to the operator's place of business.
          </p>

          <h2>16. Contact</h2>
          <p>
            Questions about these Terms:{" "}
            <a href="mailto:contactus@siblingstack.com">contactus@siblingstack.com</a>
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-surface2 flex gap-6 text-xs font-mono text-ink-muted">
          <Link href="/privacy" className="underline hover:text-ink">
            Privacy Policy
          </Link>
          <Link href="/" className="underline hover:text-ink">
            ← Sibling Stack
          </Link>
        </div>
      </div>
    </main>
  );
}
