import { getIDCardTemplate } from "@/app/actions/id-card";
import { getSchoolProfile } from "@/app/actions/school";
import IDCardTemplateSettings from "@/components/dashboard/id-card-template-settings";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "ID Card Template Settings | EduCore ERP",
};

export default async function IDCardTemplatePage() {
  const [template, school] = await Promise.all([
    getIDCardTemplate(),
    getSchoolProfile(),
  ]);

  const schoolData = {
    schoolName: school?.schoolName || "EduCore",
    address: school?.address || "",
    phone: school?.phone || "",
    city: school?.city || "",
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-slate-50/50">
      <Link
        href="/dashboard/students/id-cards"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-fg hover:text-fg transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to ID Card Management
      </Link>
      <IDCardTemplateSettings initialTemplate={template as any} school={schoolData} />
    </div>
  );
}
