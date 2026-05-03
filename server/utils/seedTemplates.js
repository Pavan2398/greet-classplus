import Template from '../models/Template.js';

const defaultTemplates = [
  {
    title: 'Morning Sunshine',
    category: 'Greetings',
    imageUrl: 'https://images.unsplash.com/photo-1470252649358-96f3e8053119?w=800',
    isPremium: false,
    overlayConfig: {
      namePosition: { x: 50, y: 7, fontSize: 32, color: '#ffffff', align: 'center' },
      imagePosition: { x: 10, y: 10, width: 140, height: 140, shape: 'circle', borderColor: '#4ade80' }
    }
  },
  {
    title: 'Midnight Fireworks',
    category: 'New Year',
    imageUrl: 'https://images.unsplash.com/photo-1533230398624-46c65bb52cb4?w=800',
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
    imageUrl: 'https://images.unsplash.com/photo-1514222139-b57c44ce4169?w=800',
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
    title: 'Anniversary Gold',
    category: 'Anniversary',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-fa8c9d34bb34?w=800',
    isPremium: false,
    overlayConfig: {
      namePosition: { x: 50, y: 7, fontSize: 32, color: '#ffffff', align: 'center' },
      imagePosition: { x: 10, y: 10, width: 140, height: 140, shape: 'circle', borderColor: '#4ade80' }
    }
  },
  {
    title: 'Happy Birthday Classic',
    category: 'Birthday',
    imageUrl: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=800',
    isPremium: false,
    overlayConfig: {
      namePosition: { x: 50, y: 7, fontSize: 32, color: '#ffffff', align: 'center' },
      imagePosition: { x: 10, y: 10, width: 140, height: 140, shape: 'circle', borderColor: '#4ade80' }
    }
  }
];

export const seedTemplates = async () => {
  try {
    for (const t of defaultTemplates) {
      console.log(`Syncing template: ${t.title}...`);
      await Template.findOneAndUpdate(
        { title: t.title },
        { 
          $set: { 
            imageUrl: t.imageUrl,
            category: t.category,
            isPremium: t.isPremium,
            overlayConfig: t.overlayConfig
          } 
        },
        { upsert: true, new: true }
      );
    }
    console.log('Template synchronization complete');
  } catch (error) {
    console.error(`Error seeding templates: ${error.message}`);
  }


}