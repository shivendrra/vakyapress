import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StaffProfile } from '../types';
import { getAllStaff } from '../services/firebase';

const Masthead: React.FC = () => {
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Masthead | Vakya";
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
      <div className="mb-12">
        <h2 className="font-serif text-4xl mb-6 border-b border-black pb-2">{title}</h2>
        <ul className="space-y-3">
          {members.map(member => (
            <li key={member.id} className="flex items-baseline gap-3">
              <span className="text-black font-bold text-sm">•</span>
              <span className="font-serif italic text-xl text-gray-600">
                {member.title}
              </span>
              <Link
                to={`/staff/${member.id}`}
                className="font-sans font-bold text-sm uppercase tracking-widest text-black hover:text-vakya-salmon transition-colors"
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
    <div className="min-h-screen bg-white pb-24">

      {/* Header Image - Full Screen Width */}
      <div className="w-full mb-12">
        <img
          src="https://raw.githubusercontent.com/shivendrra/vakyapress/dev/assets/header.png"
          alt="Vakya Press Header"
          className="w-full h-auto max-h-[500px] object-cover"
        />
      </div>

      <div className="max-w-3xl mx-auto px-6">
        {/* Title */}
        <div className="text-left mb-16 mt-8">
          <h1 className="font-serif text-5xl text-vakya-black mb-2">Masthead</h1>
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400">
            Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-white">
          {/* Management / Leadership */}
          <DepartmentSection title="Leadership" members={getByDept('Management')} />

          {/* Editorial */}
          <DepartmentSection title="Editorial Directors" members={getByDept('Editorial')} />

          {/* Creative */}
          <DepartmentSection title="Creative & Visuals" members={getByDept('Creative')} />

          {/* Production */}
          <DepartmentSection title="Production" members={getByDept('Production')} />

          {/* Tech */}
          <DepartmentSection title="Product & Engineering" members={getByDept('Tech')} />

          {staff.length === 0 && (
            <div className="text-center text-gray-400 font-serif text-xl italic py-12">
              The newsroom roster is currently being updated.
            </div>
          )}
        </div>

        <div className="mt-24 pt-12 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <h3 className="font-serif text-2xl mb-2">Join our newsroom</h3>
              <p className="font-sans text-sm text-gray-600 max-w-sm leading-relaxed">
                We are looking for individuals who believe journalism is a public service.
              </p>
            </div>
            <Link to="/careers" className="inline-block bg-vakya-black text-white px-8 py-3 font-sans font-bold uppercase tracking-widest text-xs hover:bg-vakya-salmon hover:text-black transition-colors">
              View Open Positions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Masthead;