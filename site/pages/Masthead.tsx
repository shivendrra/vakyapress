import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StaffProfile } from '../types';
import { getAllStaff } from '../services/firebase';

const Masthead: React.FC = () => {
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      const data = await getAllStaff();
      setStaff(data);
      setLoading(false);
    };
    fetchStaff();
  }, []);

  // Helper to filter by department
  const getByDept = (dept: StaffProfile['department']) => staff.filter(s => s.department === dept);

  const DepartmentSection = ({ title, members }: { title: string, members: StaffProfile[] }) => {
    if (members.length === 0) return null;
    return (
      <div className="mb-16">
        <h2 className="font-serif text-4xl mb-8 border-b border-black pb-2">{title}</h2>
        <ul className="space-y-6">
          {members.map(member => (
            <li key={member.id} className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 text-lg">
              <span className="font-serif italic text-gray-500 min-w-[200px] text-right md:text-left">{member.title}</span>
              <Link
                to={`/staff/${member.id}`}
                className="font-sans font-bold uppercase tracking-widest text-vakya-black hover:text-vakya-salmon hover:underline decoration-2 underline-offset-4 transition-colors"
              >
                {member.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-vakya-paper flex items-center justify-center font-serif text-2xl">Loading Masthead...</div>;

  return (
    <div className="min-h-screen bg-vakya-paper py-24 px-4">
      <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 shadow-sm border border-gray-100">
        <div className="text-center mb-24">
          <h1 className="font-serif text-7xl md:text-8xl mb-6">Masthead</h1>
          <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Vakya Press • Est. 2022</p>
        </div>

        <div className="space-y-12">
          {/* Management / Leadership */}
          <DepartmentSection title="Leadership" members={getByDept('Management')} />

          {/* Editorial */}
          <DepartmentSection title="Editorial" members={getByDept('Editorial')} />

          {/* Creative */}
          <DepartmentSection title="Creative & Visuals" members={getByDept('Creative')} />

          {/* Production */}
          <DepartmentSection title="Production" members={getByDept('Production')} />

          {/* Tech */}
          <DepartmentSection title="Product & Engineering" members={getByDept('Tech')} />
        </div>

        {staff.length === 0 && (
          <div className="text-center text-gray-400 font-serif text-xl italic">
            The newsroom is currently being updated.
          </div>
        )}

        <div className="mt-24 pt-12 border-t border-gray-100 text-center">
          <p className="font-sans text-gray-500 mb-4">Interested in joining our team?</p>
          <Link to="/careers" className="inline-block bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase tracking-widest text-xs hover:bg-vakya-salmon hover:text-black transition-colors">
            View Open Positions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Masthead;