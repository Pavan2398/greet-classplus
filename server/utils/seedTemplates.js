import Template from '../models/Template.js';

const defaultTemplates = [
  {
    title: 'Morning Sunshine',
    category: 'Greetings',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    isPremium: false,
    overlayConfig: {
      namePosition: { x: 50, y: 7, fontSize: 32, color: '#ffffff', align: 'center' },
      imagePosition: { x: 10, y: 10, width: 140, height: 140, shape: 'circle', borderColor: '#4ade80' }
    }
  },
  {
    title: 'Midnight Fireworks',
    category: 'New Year',
    imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800',
    isPremium: false,
    overlayConfig: {
      namePosition: { x: 50, y: 7, fontSize: 32, color: '#ffffff', align: 'center' },
      imagePosition: { x: 10, y: 10, width: 140, height: 140, shape: 'circle', borderColor: '#4ade80' }
    }
  },
  {
    title: 'Congratulations Premium',
    category: 'Greetings',
    imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800',
    isPremium: true,
    overlayConfig: {
      namePosition: { x: 50, y: 7, fontSize: 32, color: '#ffffff', align: 'center' },
      imagePosition: { x: 10, y: 10, width: 140, height: 140, shape: 'circle', borderColor: '#4ade80' }
    }
  },
  {
    title: 'Festival Lights',
    category: 'Festival',
    imageUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=800',
    isPremium: false,
    overlayConfig: {
      namePosition: { x: 50, y: 7, fontSize: 32, color: '#ffffff', align: 'center' },
      imagePosition: { x: 10, y: 10, width: 140, height: 140, shape: 'circle', borderColor: '#4ade80' }
    }
  },
  {
    title: 'Wedding Elegant',
    category: 'Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    isPremium: true,
    overlayConfig: {
      namePosition: { x: 50, y: 7, fontSize: 32, color: '#ffffff', align: 'center' },
      imagePosition: { x: 10, y: 10, width: 140, height: 140, shape: 'circle', borderColor: '#4ade80' }
    }
  },
  {
    title: 'Happy Birthday Classic',
    category: 'Birthday',
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
    isPremium: false,
    overlayConfig: {
      namePosition: { x: 50, y: 7, fontSize: 32, color: '#ffffff', align: 'center' },
      imagePosition: { x: 10, y: 10, width: 140, height: 140, shape: 'circle', borderColor: '#4ade80' }
    }
  }
];

export const seedTemplates = async () => {
  try {
    console.log('PURGING OLD TEMPLATES FOR FRESH START...');
    await Template.deleteMany({}); // Complete purge to ensure no broken paths remain
    
    await Template.insertMany(defaultTemplates);
    console.log('SUCCESS: All templates seeded with verified cloud images.');
  } catch (error) {
    console.error(`CRITICAL SEEDING ERROR: ${error.message}`);
  }
};

