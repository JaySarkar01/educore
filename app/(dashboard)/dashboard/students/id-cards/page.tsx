import { getIDCardManagementData } from "@/app/actions/id-card";
import { getClasses } from "@/app/actions/academic";
import { getSchoolProfile } from "@/app/actions/school";
import { getAuthContext } from "@/lib/auth";
import IDCardManagement from "@/components/dashboard/id-card-management";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Student ID Cards | EduCore ERP",
  description: "Generate and manage student ID cards",
};

export default async function StudentIDCardsPage() {
  const auth = await getAuthContext();

  // Students should use the portal tab on their own profile
  if (auth?.roleName === "STUDENT") {
    const studentId = auth.linkedStudentId;
    if (studentId) redirect(`/dashboard/students/${studentId}?tab=id-card`);
    redirect("/dashboard");
  }

  const [{ students, template }, classes, school] = await Promise.all([
    getIDCardManagementData(),
    getClasses(),
    getSchoolProfile(),
  ]);

  const schoolData = {
    schoolName: school?.schoolName || "EduCore",
    address: school?.address || "",
    phone: school?.phone || "",
    city: school?.city || "",
    schoolLogo: (template as any)?.schoolLogo || "",
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-slate-50/50">
      <IDCardManagement
        students={students as any}
        classes={classes}
        school={schoolData}
        template={template as any}
      />
    </div>
  );
}
