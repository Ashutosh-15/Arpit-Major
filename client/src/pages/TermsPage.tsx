

export function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Terms and Conditions</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">1. Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-gray-300">
              By accessing and using ServiceHub, you agree to be bound by these Terms and Conditions
              and all applicable laws and regulations. If you do not agree with any of these terms,
              you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">2. User Accounts</h2>
            <p className="text-gray-600 dark:text-gray-300">
              When you create an account with us, you must provide accurate, complete, and current
              information. You are responsible for safeguarding the password and for all activities
              that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">3. Service Provider Terms</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Service providers must:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600 dark:text-gray-300">
              <li>Maintain accurate and up-to-date profile information</li>
              <li>Provide services as described and agreed upon</li>
              <li>Maintain professional conduct and communication</li>
              <li>Comply with local laws and regulations</li>
              <li>Carry appropriate insurance and licenses where required</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">4. Service Seeker Terms</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Service seekers must:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600 dark:text-gray-300">
              <li>Provide accurate booking information</li>
              <li>Pay for services as agreed</li>
              <li>Maintain respectful communication</li>
              <li>Provide safe working conditions where applicable</li>
              <li>Cancel bookings within the specified timeframe</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">5. Payments and Fees</h2>
            <p className="text-gray-600 dark:text-gray-300">
              All payments are processed securely through our platform. Service providers will receive
              payment after service completion and confirmation. Platform fees and payment terms are
              clearly displayed before booking.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">6. Cancellation Policy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Cancellations must be made at least 24 hours before the scheduled service. Late
              cancellations may incur fees. Specific cancellation terms are provided during booking.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">7. Privacy and Data</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We collect and process personal data in accordance with our Privacy Policy. By using
              our services, you consent to our data practices as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">8. Dispute Resolution</h2>
            <p className="text-gray-600 dark:text-gray-300">
              In case of disputes between users, our platform provides a mediation process. Users
              agree to attempt resolution through our dispute resolution system before pursuing
              other remedies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}