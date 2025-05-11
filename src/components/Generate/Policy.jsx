import { useTranslation } from "react-i18next";

const Policy = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="w-3/4 px-4 py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-blue-800">
          {t("student.privacyPolicy.title", "Privacy Policy")}
        </h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-blue-700">
              {t("student.privacyPolicy.introduction.title", "Introduction")}
            </h2>
            <p className="mb-4">
              {t(
                "student.privacyPolicy.introduction.content",
                "Welcome to UTECareerBridge. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you."
              )}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-blue-700">
              {t(
                "student.privacyPolicy.dataCollection.title",
                "Information We Collect"
              )}
            </h2>
            <p className="mb-2">
              {t(
                "student.privacyPolicy.dataCollection.intro",
                "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:"
              )}
            </p>
            <ul className="pl-6 space-y-2 list-disc">
              <li>
                {t(
                  "student.privacyPolicy.dataCollection.identity",
                  "Identity Data includes first name, last name, username or similar identifier, date of birth and gender."
                )}
              </li>
              <li>
                {t(
                  "student.privacyPolicy.dataCollection.contact",
                  "Contact Data includes email address, telephone numbers, and physical address."
                )}
              </li>
              <li>
                {t(
                  "student.privacyPolicy.dataCollection.education",
                  "Education Data includes your educational background, qualifications, and certifications."
                )}
              </li>
              <li>
                {t(
                  "student.privacyPolicy.dataCollection.professional",
                  "Professional Data includes your work experience, skills, and career preferences."
                )}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-blue-700">
              {t(
                "student.privacyPolicy.howWeUse.title",
                "How We Use Your Information"
              )}
            </h2>
            <p className="mb-2">
              {t(
                "student.privacyPolicy.howWeUse.intro",
                "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:"
              )}
            </p>
            <ul className="pl-6 space-y-2 list-disc">
              <li>
                {t(
                  "student.privacyPolicy.howWeUse.provision",
                  "To provide and maintain our services, including to monitor the usage of our service."
                )}
              </li>
              <li>
                {t(
                  "student.privacyPolicy.howWeUse.communication",
                  "To communicate with you about opportunities, updates, and other information related to our services."
                )}
              </li>
              <li>
                {t(
                  "student.privacyPolicy.howWeUse.improvement",
                  "To improve our services, products, marketing, and user experience."
                )}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-blue-700">
              {t("student.privacyPolicy.dataSecurity.title", "Data Security")}
            </h2>
            <p className="mb-4">
              {t(
                "student.privacyPolicy.dataSecurity.content",
                "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know."
              )}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-blue-700">
              {t("student.privacyPolicy.yourRights.title", "Your Rights")}
            </h2>
            <p className="mb-2">
              {t(
                "student.privacyPolicy.yourRights.intro",
                "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:"
              )}
            </p>
            <ul className="pl-6 space-y-2 list-disc">
              <li>
                {t(
                  "student.privacyPolicy.yourRights.access",
                  "Request access to your personal data."
                )}
              </li>
              <li>
                {t(
                  "student.privacyPolicy.yourRights.correction",
                  "Request correction of your personal data."
                )}
              </li>
              <li>
                {t(
                  "student.privacyPolicy.yourRights.erasure",
                  "Request erasure of your personal data."
                )}
              </li>
              <li>
                {t(
                  "student.privacyPolicy.yourRights.restriction",
                  "Request restriction of processing your personal data."
                )}
              </li>
              <li>
                {t(
                  "student.privacyPolicy.yourRights.portability",
                  "Request transfer of your personal data."
                )}
              </li>
              <li>
                {t(
                  "student.privacyPolicy.yourRights.withdraw",
                  "Withdraw consent at any time where we are relying on consent to process your personal data."
                )}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-blue-700">
              {t("student.privacyPolicy.contact.title", "Contact Us")}
            </h2>
            <p className="mb-4">
              {t(
                "student.privacyPolicy.contact.content",
                "If you have any questions about this privacy policy or our privacy practices, please contact us at: support@utecareerbridge.com"
              )}
            </p>
          </section>

          <div className="pt-4 mt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t(
                "student.privacyPolicy.lastUpdated",
                "Last updated: January 2024"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;
