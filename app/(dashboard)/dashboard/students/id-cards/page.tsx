import { getStudents } from "@/app/actions/student";
import { getClasses } from "@/app/actions/academic";
import { getSchoolProfile } from "@/app/actions/school";
import StudentIDGenerator from "@/components/dashboard/student-id-generator";

export default async function StudentIDPage() {
  const [students, classes, school] = await Promise.all([
    getStudents(),
    getClasses(),
    getSchoolProfile(),
  ]);

  // Simple school default if null
  const schoolData = {
    schoolName: school?.schoolName || "EduCore",
    address: school?.address || "School Office Address",
    phone: school?.phone || "Phone Number",
    city: school?.city || "City"
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50 dark:bg-slate-950/20">
      <StudentIDGenerator 
        students={students as any} 
        classes={classes} 
        school={schoolData} 
      />
    </div>
  );
}
