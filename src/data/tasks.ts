export const taskData = {
    id: 'TASK-001',
    title: 'Annotate Medical Images',
    description: 'Identify and label key anatomical structures in a set of MRI scans.',
    version: '1.2',
    experts: [
      {
        id: 1,
        name: 'Dr. John Doe',
        avatar: '/avatars/jane-smith.png',
        progress: 75,
        version: '1.2',
        status: 'in-progress' as const,
        latestEdit: '2024-11-09T14:30:00Z'
      },
      {
        id: 2,
        name: 'Dr. Jane Smith',
        avatar: '/avatars/john-doe.png',
        progress: 100,
        version: '1.2',
        status: 'completed' as const,
        latestEdit: '2024-11-08T16:45:00Z'
      },
      {
        id: 3,
        name: 'Dr. Emily Brown',
        avatar: '/avatars/emily-brown.png',
        progress: 30,
        version: '1.1',
        status: 'in-progress' as const,
        latestEdit: '2024-11-09T10:15:00Z'
      },
      {
        id: 4,
        name: 'Dr. Michael Lee',
        avatar: '/avatars/michael-lee.png',
        progress: 0,
        version: '1.2',
        status: 'not-started' as const,
        latestEdit: null
      }
    ]
  }