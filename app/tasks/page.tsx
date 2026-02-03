'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import { tasks, jobs } from '@/lib/mockData';
import { Clipboard, Users, Plus, Filter, ChevronDown, CheckCircle2, Briefcase, Clock, User } from 'lucide-react';

export default function TasksPage() {
  const [filter, setFilter] = useState<string>('All');
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const statusOptions = ['All', 'In Progress', 'Planning', 'Completed'];

  const filteredTasks = filter === 'All'
    ? tasks
    : tasks.filter(t => t.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800';
      case 'In Progress':
        return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800';
      case 'Planning':
        return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800';
      default:
        return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800';
      case 'Medium':
        return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800';
      case 'Low':
        return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800';
      default:
        return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 border-green-200';
      case 'In Progress':
        return 'bg-blue-50 border-blue-200';
      case 'Planning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getJobStatusBadgeColor = (status: string) => {
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

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const getTaskJobs = (taskId: number) => {
    return jobs.filter(job => job.taskId === taskId);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Tasks"
        description="Manage and track all project tasks and assignments"
      >
        <button className="px-4 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} />
          New Task
        </button>
      </PageHeader>

      {/* Filter Buttons */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter size={18} />
          <span className="text-sm font-medium text-foreground">Filter by Status:</span>
        </div>
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === status
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-secondary text-foreground hover:bg-muted border border-border'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tasks Table */}
      <div className="bg-card rounded-lg border-2 border-border shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border bg-gradient-to-r from-primary/5 to-accent/5">
                <th className="w-10"></th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Task</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Project</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Jobs</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task: any) => {
                const taskJobs = getTaskJobs(task.id);
                const isExpanded = expandedTaskId === task.id;

                return (
                  <React.Fragment key={task.id}>
                    <tr className="border-b border-border hover:bg-primary/5 transition-colors duration-200">
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleTaskExpansion(task.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/15 transition-all duration-200"
                          aria-label="Expand task jobs"
                        >
                          <ChevronDown
                            size={18}
                            className={`text-primary font-bold transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-primary/10 rounded-md">
                            <Clipboard size={16} className="text-primary" />
                          </div>
                          <span className="font-semibold text-foreground text-sm">{task.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase size={14} className="text-primary/60 flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">{task.project}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-white bg-gradient-to-r from-accent to-orange-500 px-3 py-1.5 rounded-full inline-block shadow-md">
                          {taskJobs.length}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-primary/60 flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">{new Date(task.dueDate).toISOString().split('T')[0]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusColor(task.status)}>{task.status}</span>
                      </td>
                    </tr>

                    {/* Expandable Jobs Section */}
                    {isExpanded && (
                      <tr className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
                        <td colSpan={7} className="px-6 py-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-border">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Clipboard size={18} className="text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-base font-bold text-foreground">
                                  Jobs for {task.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {taskJobs.length} job{taskJobs.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <span className="px-3 py-1 bg-accent/20 text-accent font-semibold text-xs rounded-full">
                                  {taskJobs.filter(j => j.status === 'In Progress').length} Active
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 font-semibold text-xs rounded-full">
                                  {taskJobs.filter(j => j.status === 'Completed').length} Done
                                </span>
                              </div>
                            </div>

                            {taskJobs.length > 0 ? (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {taskJobs.map((job: any) => (
                                  <div
                                    key={job.id}
                                    className={`flex flex-col gap-3 p-4 rounded-lg border-2 transition-all hover:shadow-md ${getJobStatusColor(job.status)}`}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-3 flex-1">
                                        <div className="mt-1">
                                          <CheckCircle2
                                            size={18}
                                            className={`flex-shrink-0 ${
                                              job.status === 'Completed'
                                                ? 'text-green-600'
                                                : job.status === 'In Progress'
                                                ? 'text-accent'
                                                : 'text-yellow-600'
                                            }`}
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-semibold text-foreground leading-snug">{job.name}</p>
                                        </div>
                                      </div>
                                      <span className={`px-2.5 py-0.5 rounded-full font-semibold text-xs whitespace-nowrap flex-shrink-0 ${getJobStatusBadgeColor(job.status)}`}>
                                        {job.status}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1.5">
                                        <User size={14} className="flex-shrink-0 text-primary/70" />
                                        <span className="font-medium">{job.assignedTo}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <Clipboard size={32} className="mx-auto mb-2 text-muted-foreground/40" />
                                <p className="text-sm font-medium">No jobs assigned to this task yet</p>
                                <p className="text-xs mt-1">Add jobs to track individual work items</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <Clipboard size={40} className="mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground text-lg font-medium">No tasks found</p>
            <p className="text-muted-foreground text-sm mt-1">Adjust your filters or create a new task</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
