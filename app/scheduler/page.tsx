'use client';

import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import { tasks, jobs } from '@/lib/mockData';
import { Calendar, Wrench, Hard Hat, Clock, Briefcase, AlertCircle } from 'lucide-react';

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
        return 'from-green-400 to-green-500';
      case 'In Progress':
        return 'from-accent to-orange-500';
      case 'Planning':
        return 'from-yellow-400 to-yellow-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-orange-100 text-orange-800';
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                Selected Date
              </label>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Wrench size={16} className="text-primary" />
                Filter by Resource
              </label>
              <select
                value={selectedResource || 'all'}
                onChange={(e) => setSelectedResource(e.target.value === 'all' ? null : e.target.value)}
                className="px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground font-medium"
              >
                <option value="all">All Resources</option>
                {resources.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Scheduled Jobs</p>
              <p className="text-2xl font-bold text-primary">
                {filteredResources.reduce((sum, r) => sum + (scheduleData[r]?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Time Grid Scheduler */}
        <div className="bg-card rounded-lg border-2 border-border shadow-md overflow-hidden">
          {/* Time Header */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-border p-6">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-2"></div>
              {timeSlots.map(time => (
                <div key={time} className="text-center text-sm font-bold text-foreground">
                  {time}
                </div>
              ))}
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
                  {/* Resource Name */}
                  <div className="flex items-center gap-3 p-6 bg-secondary/50 border-b border-border">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Hard Hat size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-foreground">{resource}</h3>
                      <p className="text-xs text-muted-foreground">
                        {scheduleData[resource]?.length || 0} job{scheduleData[resource]?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="relative p-6 bg-background min-h-32">
                    <div className="grid grid-cols-12 gap-2 relative">
                      {/* Empty column for resource name */}
                      <div className="col-span-2"></div>

                      {/* Time slot columns */}
                      {timeSlots.map(time => (
                        <div key={time} className="col-span-1 border-r border-border/20 min-h-24"></div>
                      ))}
                    </div>

                    {/* Jobs Overlay */}
                    <div className="absolute inset-0 p-6 pointer-events-none">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-2"></div>
                        {(scheduleData[resource] || []).map(job => {
                          const startPercent = getTimePosition(job.startTime);
                          const endPercent = getTimePosition(job.endTime);
                          const width = Math.max(endPercent - startPercent, 5);

                          return (
                            <div
                              key={job.jobId}
                              className="absolute pointer-events-auto"
                              style={{
                                left: `calc(16.67% + ${startPercent * 0.8333}%)`,
                                width: `${width * 0.8333}%`,
                                top: `${Math.random() * 20 + 24}px`,
                              }}
                            >
                              <div className={`bg-gradient-to-r ${getStatusColor(job.status)} rounded-lg p-2 shadow-lg hover:shadow-xl transition-all border-2 border-white`}>
                                <p className="text-xs font-bold text-white leading-tight truncate">
                                  {job.jobName}
                                </p>
                                <p className="text-xs text-white/90 leading-tight truncate">
                                  {job.taskName}
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-white/80">
                                  <Briefcase size={10} />
                                  <span className="truncate text-white/80 text-xs">{job.project}</span>
                                </div>
                                <div className="mt-1 flex items-center justify-between">
                                  <span className="text-xs font-semibold text-white">{job.startTime}–{job.endTime}</span>
                                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${getStatusBadge(job.status)}`}>
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
                </div>
              ))
            )}
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
