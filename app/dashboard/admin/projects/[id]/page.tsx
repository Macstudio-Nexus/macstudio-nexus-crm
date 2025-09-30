import prisma from '@/lib/db';

  export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await prisma.projects.findUnique({
      where: { id },
      include: { Contacts: true }
    });
    return <div className='text-white'>{project?.title}</div>;
  }