import { PrismaClient, SupportFocus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
  { name: 'Bienestar Universitario', email: 'admin@vsj.edu.co', password: 'Admin2026*', role: 'ADMIN' },
  { name: 'Estudiante de Prueba', email: 'estudiante@vsj.edu.co', password: 'Estudiante2026*', role: 'USER' },
] as const;

const categories: { name: string; description: string; focus: SupportFocus }[] = [
  {
    name: 'Salud mental',
    description: 'Atención psicológica, manejo del estrés y acompañamiento emocional.',
    focus: 'EMOTIONAL',
  },
  {
    name: 'Acompañamiento académico',
    description: 'Tutorías, monitorías y asesoría para mejorar el rendimiento académico.',
    focus: 'ACADEMIC',
  },
  {
    name: 'Apoyo económico',
    description: 'Becas, auxilios de alimentación y transporte para estudiantes.',
    focus: 'FINANCIAL',
  },
];

const services = [
  {
    name: 'Atención psicológica individual',
    description: 'Sesiones confidenciales con un psicólogo de Bienestar para hablar de lo que te preocupa.',
    location: 'Bloque 7, oficina 201',
    schedule: 'Lunes a viernes, 8:00 a. m. – 5:00 p. m.',
    contact: 'bienestar@vsj.edu.co',
    category: 'Salud mental',
  },
  {
    name: 'Taller de manejo del estrés',
    description: 'Taller grupal con técnicas de respiración, organización del tiempo y autocuidado.',
    location: 'Auditorio de Bienestar',
    schedule: 'Miércoles, 2:00 p. m.',
    contact: null,
    category: 'Salud mental',
  },
  {
    name: 'Tutorías de matemáticas',
    description: 'Monitores de semestres avanzados resuelven dudas de cálculo, álgebra y estadística.',
    location: 'Biblioteca, sala 3',
    schedule: 'Martes y jueves, 10:00 a. m. – 12:00 m.',
    contact: null,
    category: 'Acompañamiento académico',
  },
  {
    name: 'Asesoría de métodos de estudio',
    description: 'Acompañamiento personalizado para planear el semestre y preparar parciales.',
    location: 'Bloque 7, oficina 105',
    schedule: 'Lunes a viernes, 9:00 a. m. – 4:00 p. m.',
    contact: 'academico@vsj.edu.co',
    category: 'Acompañamiento académico',
  },
  {
    name: 'Auxilio de alimentación',
    description: 'Almuerzo subsidiado para estudiantes que cumplan los requisitos socioeconómicos.',
    location: 'Cafetería central',
    schedule: 'Lunes a viernes, 12:00 m. – 2:00 p. m.',
    contact: null,
    category: 'Apoyo económico',
  },
];

async function seedUsers(): Promise<void> {
  for (const user of users) {
    const password = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password },
    });
  }
}

async function seedCatalog(): Promise<void> {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  const existing = await prisma.service.count();
  if (existing > 0) {
    return;
  }
  for (const { category, ...service } of services) {
    const { id } = await prisma.category.findUniqueOrThrow({ where: { name: category } });
    await prisma.service.create({ data: { ...service, categoryId: id } });
  }
}

async function main(): Promise<void> {
  await seedUsers();
  await seedCatalog();
  console.info('Seed completado: admin, estudiante, categorías y servicios.');
}

main()
  .catch((error: unknown) => {
    console.error('Error en el seed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
