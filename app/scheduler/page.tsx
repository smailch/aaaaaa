'use client';

import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import { tasks, jobs } from '@/lib/mockData';
import { Calendar, Wrench, HardHat, Clock, Briefcase, AlertCircle, Plus } from 'lucide-react';

export default function SchedulerPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 0, 22)); // Jan 22, 2024
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  // Generate mock schedule data with time slots for jobs
  const scheduleData = useMemo(() => {
    const data: { [key: string]: { taskId: number; taskName: string; project: string; jobId: number; jobName: string; status: string; assignedTo: string; startTime: string; endTime: string }[] } = {};

    jobs.forEach(job => {
      const task = tasks.find(t => t.id === job.taskId);
      if (!task) return;

      const assignedTo = job.assignedTo;
      if (!data[assignedTo]) {
        data[assignedTo] = [];
      }

      // Generate random time slots for visualization
      const startHour = Math.floor(Math.random() * 8) + 7; // 7 AM to 3 PM
      const duration = Math.floor(Math.random() * 4) + 2; // 2-5 hours

      data[assignedTo].push({
        taskId: task.id,
        taskName: task.title,
        project: task.project,
        jobId: job.id,
        jobName: job.name,
        status: job.status,
        assignedTo: job.assignedTo,
        startTime: `${String(startHour).padStart(2, '0')}:00`,
        endTime: `${String(startHour + duration).padStart(2, '0')}:00`,
      });
    });

    return data;
  }, []);

  const resources = Object.keys(scheduleData).sort();
  const filteredResources = selectedResource 
    ? resources.filter(r => r === selectedResource)
    : resources;

  // Time slots for the day (7 AM to 6 PM)
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = 7 + i;
    return `${String(hour).padStart(2, '0')}:00`;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'from-green-500 to-green-600 border-green-600';
      case 'In Progress':
        return 'from-accent to-orange-500 border-accent';
      case 'Planning':
        return 'from-yellow-500 to-yellow-600 border-yellow-600';
      default:
        return 'from-gray-500 to-gray-600 border-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-accent/20 text-accent font-bold';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimePosition = (time: string) => {
    const [hour] = time.split(':').map(Number);
    return ((hour - 7) / 12) * 100;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Jobs Scheduler"
          description="Schedule and track job assignments across resources"
          icon={<Calendar className="text-primary" size={28} />}
        />

        {/* Date & Filter Section */}
        <div className="bg-card rounded-lg border-2 border-border p-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                Selected Date
              </label>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground font-medium"
              />
            </div>

            <div className="space-y-2 flex-1">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Wrench size={16} className="text-primary" />
                Filter by Resource
              </label>
              <select
                value={selectedResource || 'all'}
                onChange={(e) => setSelectedResource(e.target.value === 'all' ? null : e.target.value)}
                className="w-full px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground font-medium"
              >
                <option value="all">All Resources</option>
                {resources.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="text-left">
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold text-primary">
                {filteredResources.reduce((sum, r) => sum + (scheduleData[r]?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Scheduler Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Resource List & CTA */}
              <div className="lg:col-span-1 space-y-4">
            {/* Add Job CTA Button */}
            <button className="w-full bg-gradient-to-r from-accent to-orange-500 text-white font-bold rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 border-2 border-accent/80">
              <Plus size={18} />
              <span>Add New Job</span>
            </button>

            {/* Resources List */}
            <div className="bg-card rounded-lg border-2 border-border p-4 shadow-md">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <HardHat size={16} className="text-primary" />
                Resources
              </h3>
              <div className="space-y-2">
                {resources.map(resource => (
                  <button
                    key={resource}
                    onClick={() => setSelectedResource(selectedResource === resource ? null : resource)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                      selectedResource === resource
                        ? 'bg-primary text-white'
                        : 'bg-secondary/50 text-foreground hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{resource}</span>
                      <span className="text-xs px-2 py-1 bg-white/20 rounded-full">
                        {scheduleData[resource]?.length || 0}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Header */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-border p-6 sticky top-0 z-10">
            <div className="text-sm font-bold text-foreground">
              <div className="grid grid-cols-12 gap-3">
                {timeSlots.map(time => (
                  <div key={time} className="col-span-1 text-center text-sm font-bold text-primary">
                    {time}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resource Rows */}
          <div className="divide-y-2 divide-border">
            {filteredResources.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <AlertCircle size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-lg font-medium">No resources selected</p>
              </div>
            ) : (
              filteredResources.map(resource => (
                <div key={resource} className="hover:bg-primary/2 transition-colors">
                  {/* Resource Header */}
                  <div className="flex items-start gap-6 p-6 bg-secondary/50 border-b border-border/30">
                    {/* Time Slots Grid with Jobs */}
                    <div className="w-full relative min-h-28">
                      <div className="grid grid-cols-12 gap-3 h-full">
                        {timeSlots.map(time => (
                          <div key={time} className="col-span-1 border-l border-border/20 relative"></div>
                        ))}
                      </div>

                      {/* Resource Name Label */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-48 w-44 px-3 py-2 bg-secondary/80 rounded-lg border border-border text-xs font-bold text-foreground text-center">
                        {resource}
                      </div>

                      {/* Jobs Cards */}
                      {(scheduleData[resource] || []).map((job, index) => {
                        const startPercent = getTimePosition(job.startTime);
                        const endPercent = getTimePosition(job.endTime);
                        const width = Math.max(endPercent - startPercent, 8);

                        return (
                          <div
                            key={job.jobId}
                            className="absolute"
                            style={{
                              left: `${startPercent * 0.833}%`,
                              width: `${width * 0.833}%`,
                              top: `${(index % 2) * 52 + 12}px`,
                              zIndex: 5,
                            }}
                          >
                            <div className={`bg-gradient-to-br ${getStatusColor(job.status)} rounded-lg p-2.5 shadow-md hover:shadow-lg transition-all border-2 text-white cursor-pointer`}>
                              <div className="text-xs font-bold leading-tight truncate">
                                {job.jobName}
                              </div>
                              <div className="text-xs text-white/95 leading-tight truncate mt-0.5">
                                {job.taskName}
                              </div>
                              <div className="flex items-center gap-1 mt-1.5 text-white/90">
                                <Briefcase size={11} className="flex-shrink-0" />
                                <span className="text-xs truncate">{job.project}</span>
                              </div>
                              <div className="mt-1.5 flex items-center justify-between gap-1">
                                <span className="text-xs font-bold">{job.startTime}–{job.endTime}</span>
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${getStatusBadge(job.status)}`}>
                                  {job.status === 'In Progress' ? 'Active' : job.status === 'Completed' ? 'Done' : 'Plan'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        </div>

        {/* Job Details Summary */}
        <div className="bg-card rounded-lg border-2 border-border p-6 shadow-md">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-primary" />
            Job Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries({
              'In Progress': jobs.filter(j => j.status === 'In Progress').length,
              'Planning': jobs.filter(j => j.status === 'Planning').length,
              'Completed': jobs.filter(j => j.status === 'Completed').length,
            }).map(([status, count]) => (
              <div key={status} className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{status}</p>
                    <p className="text-2xl font-bold text-primary">{count}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    status === 'In Progress' ? 'bg-orange-100' :
                    status === 'Planning' ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      status === 'In Progress' ? 'bg-orange-200' :
                      status === 'Planning' ? 'bg-yellow-200' :
                      'bg-green-200'
                    }`}>
                      <Wrench size={16} className={
                        status === 'In Progress' ? 'text-orange-700' :
                        status === 'Planning' ? 'text-yellow-700' :
                        'text-green-700'
                      } />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
