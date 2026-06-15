import React from 'react';
import { JobApplication } from '../../types';

interface ApplicationsTabProps {
  applications: JobApplication[];
  expandedAppId: string | null;
  setExpandedAppId: React.Dispatch<React.SetStateAction<string | null>>;
  handleStatusChange: (id: string, newStatus: JobApplication['status']) => Promise<void>;
  formatDate: (dateInput: string | Date) => string;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  applications,
  expandedAppId,
  setExpandedAppId,
  handleStatusChange,
  formatDate
}) => {
  return (
    <div>
      <h2 className="font-serif text-3xl mb-8">Job Applications</h2>
      <div className="bg-white border border-gray-200 overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No applications received yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.map(app => (
              <div key={app.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedAppId(expandedAppId === app.id ? null : app.id)}>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-serif text-xl">{app.applicantName}</h3>
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${app.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                        }`}>{app.status}</span>
                    </div>
                    <p className="text-sm text-gray-600">Applied for <span className="font-bold">{app.jobTitle}</span> • {formatDate(app.submittedAt)}</p>
                  </div>
                  <div className="text-sm text-gray-400">{expandedAppId === app.id ? 'Collapse' : 'Expand'}</div>
                </div>

                {expandedAppId === app.id && (
                  <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">Email</p>
                        <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">LinkedIn</p>
                        <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Profile</a>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">Portfolio</p>
                        <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Portfolio</a>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">Resume</p>
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Download Resume</a>
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase text-gray-400 mb-2">The Pitch</p>
                      <p className="bg-gray-50 p-4 rounded text-sm leading-relaxed">{app.pitch}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleStatusChange(app.id, 'shortlisted')} className="px-4 py-2 bg-black text-white text-xs font-bold uppercase hover:bg-green-600">Shortlist</button>
                      <button onClick={() => handleStatusChange(app.id, 'reviewed')} className="px-4 py-2 bg-gray-200 text-black text-xs font-bold uppercase hover:bg-gray-300">Mark Reviewed</button>
                      <button onClick={() => handleStatusChange(app.id, 'rejected')} className="px-4 py-2 bg-white border border-gray-300 text-gray-500 text-xs font-bold uppercase hover:bg-red-50 hover:text-red-600">Reject</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsTab;
