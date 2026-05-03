import Template from '../models/Template.js';

const templates = [
  {
    title: 'Happy Birthday Classic',
    category: 'Birthday',
    imageUrl: '/uploads/templates/birthday-1.png',
    isPremium: false,
    overlayConfig: {
      namePosition: { align: 'center', x: 50, y: 7, fontSize: 32, color: '#ffffff' },
      imagePosition: { shape: 'circle', x: 10, y: 10, width: 140, height: 140, borderColor: '#4ade80' }
    }
  },
  {
    title: 'Anniversary Gold',
    category: 'Anniversary',
    imageUrl: '/uploads/templates/anniversary-1.png',
    isPremium: false,
    overlayConfig: {
      namePosition: { align: 'center', x: 50, y: 7, fontSize: 32, color: '#ffffff' },
      imagePosition: { shape: 'circle', x: 10, y: 10, width: 140, height: 140, borderColor: '#4ade80' }
    }
  },
  {
    title: 'Wedding Elegant',
    category: 'Wedding',
    imageUrl: '/uploads/templates/wedding-1.png',
    isPremium: true,
    overlayConfig: {
      namePosition: { align: 'center', x: 50, y: 7, fontSize: 32, color: '#ffffff' },
      imagePosition: { shape: 'circle', x: 10, y: 10, width: 140, height: 140, borderColor: '#4ade80' }
    }
  },
  {
    title: 'Festival Lights',
    category: 'Festival',
    imageUrl: '/uploads/templates/festival-1.png',
    isPremium: false,
    overlayConfig: {
      namePosition: { align: 'center', x: 50, y: 7, fontSize: 32, color: '#ffffff' },
      imagePosition: { shape: 'circle', x: 10, y: 10, width: 140, height: 140, borderColor: '#4ade80' }
    }
  },
  {
    title: 'Congratulations Premium',
    category: 'Greetings',
    imageUrl: '/uploads/templates/congrats-1.png',
    isPremium: true,
    overlayConfig: {
      namePosition: { align: 'center', x: 50, y: 7, fontSize: 32, color: '#ffffff' },
      imagePosition: { shape: 'circle', x: 10, y: 10, width: 140, height: 140, borderColor: '#4ade80' }
    }
  },
  {
    title: 'Midnight Fireworks',
    category: 'New Year',
    imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80',
    isPremium: false,
    overlayConfig: {
      namePosition: { x: 50, y: 7, fontSize: 32, color: '#ffffff', align: 'center' },
      imagePosition: { x: 10, y: 10, width: 140, height: 140, shape: 'circle', borderColor: '#4ade80' }
    }
  },
  {
    title: 'Morning Sunshine',
    category: 'Greetings',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    isPremium: false,
    overlayConfig: {
      namePosition: { x: 50, y: 7, fontSize: 32, color: '#ffffff', align: 'center' },
      imagePosition: { x: 10, y: 10, width: 140, height: 140, shape: 'circle', borderColor: '#4ade80' }
    }
  }
];






export const seedTemplates = async () => {
  try {
    for (const t of templates) {
      // Cleanup duplicates by title
      const matches = await Template.find({ title: t.title }).sort({ createdAt: 1 });
      if (matches.length > 1) {
        const duplicateIds = matches.slice(1).map(m => m._id);
        await Template.deleteMany({ _id: { $in: duplicateIds } });
        console.log(`Cleaned up ${duplicateIds.length} duplicates for: ${t.title}`);
      }

      const exists = await Template.findOne({ title: t.title });
      if (!exists) {
        await Template.create(t);
        console.log(`Added template: ${t.title}`);
      } else {
        await Template.findOneAndUpdate({ title: t.title }, t);
      }
    }
    console.log('Template synchronization complete');
  } catch (error) {
    console.error(`Error seeding templates: ${error.message}`);
  }
};


