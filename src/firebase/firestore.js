import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  getDocs, getDoc, onSnapshot, query, where, orderBy, limit,
  serverTimestamp, Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Export primitives for custom queries
export { query, where, orderBy, limit } from 'firebase/firestore';

// ── Generic helpers ──────────────────────────────────────────────────────────

export const addDocument = async (collectionName, data) => {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
};

export const createDocumentWithId = async (collectionName, id, data) => {
  await setDoc(doc(db, collectionName, id), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const setDocument = async (collectionName, id, data) => {
  await setDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const updateDocument = async (collectionName, id, data) => {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteDocument = async (collectionName, id) => {
  await deleteDoc(doc(db, collectionName, id));
};

export const getDocument = async (collectionName, id) => {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getDocuments = async (collectionName, constraints = []) => {
  const q = query(collection(db, collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const subscribeToCollection = (collectionName, callback, constraints = []) => {
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (snap) => {
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(docs);
  });
};

export const subscribeToDocument = (collectionName, id, callback) => {
  return onSnapshot(doc(db, collectionName, id), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
};

// ── Specific helpers ─────────────────────────────────────────────────────────

export const addActivityLog = async (type, message, actor = 'System') => {
  await addDocument('activity_log', { type, message, actor });
};

export const addAuditLog = async (action, performedBy, details = '') => {
  await addDocument('audit_logs', { action, performedBy, details });
};

export const seedInitialData = async () => {
  // Seed users
  const users = [
    { name: 'Sarah Johnson', email: 'sarah.j@resiliencenet.org', role: 'field_worker', status: 'active', avatar: 'SJ' },
    { name: 'Mark Chen', email: 'm.chen@resiliencenet.org', role: 'coordinator', status: 'active', avatar: 'MC' },
    { name: 'Elena Kovic', email: 'kovic.e@resiliencenet.org', role: 'administrator', status: 'inactive', avatar: 'EK' },
    { name: 'James Okoye', email: 'j.okoye@resiliencenet.org', role: 'field_worker', status: 'active', avatar: 'JO' },
    { name: 'Priya Nair', email: 'p.nair@resiliencenet.org', role: 'coordinator', status: 'active', avatar: 'PN' },
  ];

  for (const u of users) {
    await addDocument('users', u);
  }

  // Seed needs
  const needs = [
    { category: 'Medical', subCategory: 'Emergency Kits', location: 'District 7, Metro Area', severity: 5, status: 'critical', description: '25 units of emergency medical kits needed urgently', priorityScore: 9.2 },
    { category: 'Food', subCategory: 'Non-Perishable', location: 'Riverdale Community', severity: 4, status: 'high', description: 'Food parcels for 500 families', priorityScore: 7.8 },
    { category: 'Shelter', subCategory: 'Emergency Tents', location: 'North Highlands', severity: 3, status: 'medium', description: '40 emergency tent kits required', priorityScore: 5.5 },
    { category: 'Water', subCategory: 'Clean Water', location: 'Sector B', severity: 5, status: 'critical', description: 'Water supply shortage affecting 2000 residents', priorityScore: 9.5 },
    { category: 'Medical', subCategory: 'Vaccination', location: 'Eastern Corridor', severity: 3, status: 'medium', description: 'Vaccination drive for children under 5', priorityScore: 6.1 },
  ];

  for (const n of needs) {
    await addDocument('needs', n);
  }

  // Seed tasks
  const tasks = [
    { title: 'Supply Route Assessment', description: 'Review drone footage of highway 4 access point after rainfall', urgency: 'urgent', status: 'todo', assignedVolunteers: ['SJ', 'MC'], comments: 12 },
    { title: 'Volunteer Briefing', description: 'Prepare safety protocol documents for new intake of 50 volunteers', urgency: 'planning', status: 'todo', assignedVolunteers: [], comments: 3 },
    { title: 'Medical Depot Setup', description: 'Set up medical distribution point in District 7', urgency: 'active', status: 'inprogress', assignedVolunteers: ['SM'], comments: 5 },
    { title: 'Water Distribution Report', description: 'Compile water access data for Q4 report', urgency: 'planning', status: 'done', assignedVolunteers: ['JO'], comments: 8 },
    { title: 'Emergency Tent Delivery', description: 'Coordinate delivery of 40 tent kits to North Highlands', urgency: 'urgent', status: 'done', assignedVolunteers: ['PN'], comments: 2 },
  ];

  for (const t of tasks) {
    await addDocument('tasks', t);
  }

  // Seed volunteers
  const volunteers = [
    { name: 'Alex Rivera', skills: ['Medical', 'First Aid', 'Logistics'], location: 'Metro District', availability: 'Available', matchScore: 94, certifications: ['EMT', 'Disaster Response'], avatar: 'AR' },
    { name: 'Sarah Mitchell', skills: ['Counseling', 'Community Outreach', 'Languages'], location: 'Riverdale', availability: 'Available', matchScore: 87, certifications: ['Mental Health First Aid'], avatar: 'SM' },
    { name: 'David Park', skills: ['Engineering', 'Shelter Construction', 'Water Systems'], location: 'North Highlands', availability: 'Busy', matchScore: 82, certifications: ['Civil Engineering'], avatar: 'DP' },
    { name: 'Fatima Al-Hassan', skills: ['Food Security', 'Nutrition', 'Logistics'], location: 'Riverdale Community', availability: 'Available', matchScore: 91, certifications: ['Nutrition Specialist'], avatar: 'FA' },
    { name: 'Carlos Mendez', skills: ['Transportation', 'Logistics', 'Coordination'], location: 'Eastern Corridor', availability: 'Available', matchScore: 78, certifications: ['CDL', 'Hazmat'], avatar: 'CM' },
    { name: 'Yuki Tanaka', skills: ['Medical', 'Pharmacy', 'Supply Chain'], location: 'Metro District', availability: 'Available', matchScore: 89, certifications: ['Pharmacist', 'Supply Chain'], avatar: 'YT' },
  ];

  for (const v of volunteers) {
    await addDocument('volunteers', v);
  }

  // Seed activity log
  const activities = [
    { type: 'delivery', message: 'Medical Shipment Delivered to District 4 Hub by Alex Rivera', actor: 'Alex Rivera' },
    { type: 'volunteer', message: '12 New Volunteers Joined assigned to Meal Prep project', actor: 'System' },
    { type: 'alert', message: 'New Critical Alert: Water supply shortage in Sector B', actor: 'System' },
    { type: 'report', message: 'Monthly Report Generated — ready for regional review', actor: 'Mark Chen' },
  ];

  for (const a of activities) {
    await addDocument('activity_log', a);
  }

  // Seed audit logs
  const auditLogs = [
    { action: 'Permission Change', performedBy: 'Alex Rivera', details: 'Alex Rivera updated Field Worker scopes' },
    { action: 'New Account Provisioned', performedBy: 'Elena Kovic', details: 'Elena Kovic created a new Regional lead' },
    { action: 'Global Config Update', performedBy: 'System', details: 'System wide API key rotation completed' },
    { action: 'Failed Login Attempt', performedBy: 'Unknown', details: 'Unauthorized access blocked from IP 192.168.1.1' },
  ];

  for (const al of auditLogs) {
    await addDocument('audit_logs', al);
  }

  console.log('✅ Initial data seeded successfully');
};
