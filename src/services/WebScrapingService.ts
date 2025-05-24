
import { ScrapedContent } from '@/types/discovery';

export class WebScrapingService {
  private static mockActivities = [
    // Mental Activities
    {
      url: 'https://akc.org/expert-advice/training/brain-games-dogs',
      title: 'Brain Games for Dogs: Mental Stimulation Activities',
      content: 'Interactive puzzle feeders challenge your dog\'s problem-solving skills while providing mental enrichment. Hide treats in different compartments and let your dog figure out how to access them. This activity builds confidence and reduces destructive behaviors caused by boredom.',
      author: 'American Kennel Club',
      publishDate: '2024-01-15',
      credibilityScore: 0.95
    },
    {
      url: 'https://aspca.org/pet-care/dog-care/enrichment-activities',
      title: 'DIY Snuffle Mat for Natural Foraging',
      content: 'Create a snuffle mat using a rubber sink mat and fleece strips. Dogs use their natural foraging instincts to find treats hidden in the fabric. This activity satisfies hunting behaviors and provides excellent mental stimulation for dogs of all ages.',
      author: 'ASPCA',
      publishDate: '2024-02-01',
      credibilityScore: 0.92
    },
    {
      url: 'https://veterinarypartner.com/dog-enrichment',
      title: 'Nose Work Training for Beginners',
      content: 'Start scent training by hiding high-value treats in easy locations. Use the command "find it" and gradually increase difficulty. This taps into your dog\'s incredible scenting abilities and provides mental exercise that can tire them as much as physical activity.',
      author: 'Veterinary Partner',
      publishDate: '2024-01-20',
      credibilityScore: 0.89
    },
    {
      url: 'https://dogtime.com/mental-stimulation',
      title: 'Rotating Toy System for Mental Health',
      content: 'Keep only 3-4 toys available at a time and rotate them weekly. This prevents boredom and makes old toys feel new again. Include puzzle toys, chew toys, and interactive feeders in your rotation to provide varied mental challenges.',
      author: 'DogTime',
      publishDate: '2024-02-10',
      credibilityScore: 0.87
    },

    // Physical Activities
    {
      url: 'https://akc.org/expert-advice/health/exercise-needs',
      title: 'Interval Training for Active Dogs',
      content: 'Alternate between high-intensity activities like sprinting and low-intensity recovery periods. This builds cardiovascular fitness and prevents overexertion. Start with 30-second sprints followed by 2-minute walks, gradually increasing intensity.',
      author: 'American Kennel Club',
      publishDate: '2024-01-25',
      credibilityScore: 0.94
    },
    {
      url: 'https://petmd.com/dog/wellness/exercise-activities',
      title: 'Swimming as Low-Impact Exercise',
      content: 'Swimming provides excellent cardiovascular exercise with minimal joint stress. Start in shallow water and gradually increase depth. Always supervise closely and use a dog life jacket for safety. Great for senior dogs or those with arthritis.',
      author: 'PetMD',
      publishDate: '2024-02-05',
      credibilityScore: 0.91
    },
    {
      url: 'https://whole-dog-journal.com/training/hiking-with-dogs',
      title: 'Urban Hiking Adventures',
      content: 'Explore city trails, parks, and stairs for varied terrain exercise. Bring water, take breaks, and let your dog sniff and explore. Urban hiking provides physical exercise while exposing dogs to new environments and socialization opportunities.',
      author: 'Whole Dog Journal',
      publishDate: '2024-01-30',
      credibilityScore: 0.88
    },
    {
      url: 'https://dogster.com/lifestyle/backyard-agility',
      title: 'Backyard Agility with Household Items',
      content: 'Create jumps with broomsticks and boxes, tunnels with blankets and chairs, and weave poles with cones. Start low and slow, using treats and encouragement. This builds confidence, coordination, and provides great exercise in your own yard.',
      author: 'Dogster',
      publishDate: '2024-02-15',
      credibilityScore: 0.85
    },

    // Social Activities
    {
      url: 'https://akc.org/expert-advice/training/puppy-socialization',
      title: 'Structured Dog Meet-and-Greets',
      content: 'Arrange controlled meetings with known friendly dogs in neutral locations. Keep initial meetings short and positive. Watch for stress signals and always end on a good note. This helps dogs develop appropriate social skills.',
      author: 'American Kennel Club',
      publishDate: '2024-01-18',
      credibilityScore: 0.96
    },
    {
      url: 'https://ccpdt.org/dog-training-resources/socialization',
      title: 'Dog Training Class Benefits',
      content: 'Group training classes provide socialization while learning important skills. Dogs learn to focus around distractions and interact appropriately with other dogs and people. Choose positive reinforcement-based classes for best results.',
      author: 'CCPDT',
      publishDate: '2024-02-08',
      credibilityScore: 0.93
    },
    {
      url: 'https://fearfreepets.com/dog-socialization',
      title: 'Parallel Walking for Shy Dogs',
      content: 'Walk alongside another dog at a distance where your dog is comfortable. Gradually decrease distance over multiple sessions. This helps nervous dogs build confidence around other dogs without the pressure of direct interaction.',
      author: 'Fear Free Pets',
      publishDate: '2024-01-28',
      credibilityScore: 0.90
    },

    // Environmental Activities
    {
      url: 'https://akc.org/expert-advice/lifestyle/exploring-new-places',
      title: 'Sensory Garden Exploration',
      content: 'Visit botanical gardens, nature centers, or create sensory experiences in your yard. Let dogs smell different plants, walk on various textures, and experience new sights and sounds. This provides rich environmental enrichment.',
      author: 'American Kennel Club',
      publishDate: '2024-02-03',
      credibilityScore: 0.92
    },
    {
      url: 'https://petfinder.com/dogs/dog-care/outdoor-adventures',
      title: 'Weather-Appropriate Adventures',
      content: 'Adapt activities to weather conditions - snow play in winter, water activities in summer, leaf exploration in fall. Each season offers unique sensory experiences and helps dogs adapt to environmental changes.',
      author: 'Petfinder',
      publishDate: '2024-01-22',
      credibilityScore: 0.87
    },
    {
      url: 'https://rover.com/blog/urban-dog-activities',
      title: 'City Exploration for Urban Dogs',
      content: 'Explore different neighborhoods, visit pet-friendly stores, and experience urban environments safely. Use positive reinforcement for calm behavior around city sounds, crowds, and new sights. Great for building confidence.',
      author: 'Rover',
      publishDate: '2024-02-12',
      credibilityScore: 0.84
    },

    // Instinctual Activities
    {
      url: 'https://akc.org/expert-advice/training/canine-instincts',
      title: 'Lure Coursing for Sight Hounds',
      content: 'Set up a simple lure course using a rope toy on a fishing line or pulley system. This satisfies the chase instinct safely and provides excellent exercise. Always ensure the area is secure and free of hazards.',
      author: 'American Kennel Club',
      publishDate: '2024-01-12',
      credibilityScore: 0.94
    },
    {
      url: 'https://whole-dog-journal.com/training/herding-games',
      title: 'Herding Games for Working Breeds',
      content: 'Use balls or toys to simulate herding activities. Teach "gather" and "drive" commands using positive reinforcement. This satisfies herding instincts in a controlled way and provides mental and physical exercise.',
      author: 'Whole Dog Journal',
      publishDate: '2024-02-07',
      credibilityScore: 0.89
    },
    {
      url: 'https://dogtime.com/natural-behaviors',
      title: 'Supervised Digging Activities',
      content: 'Create designated digging areas with sand or soft soil. Bury toys and treats to encourage natural digging behaviors. This prevents destructive digging while satisfying natural instincts. Refresh regularly with new buried treasures.',
      author: 'DogTime',
      publishDate: '2024-01-26',
      credibilityScore: 0.86
    },
    {
      url: 'https://petmd.com/dog/behavior/natural-dog-behaviors',
      title: 'Prey Drive Satisfaction Games',
      content: 'Use flirt poles, toy launchers, and moving toys to satisfy chase instincts safely. Always let the dog "catch" the prey occasionally to prevent frustration. End games while the dog is still interested to maintain engagement.',
      author: 'PetMD',
      publishDate: '2024-02-14',
      credibilityScore: 0.88
    },

    // Additional diverse activities
    {
      url: 'https://cesar.com/dog-care/enrichment',
      title: 'Food Puzzle Escalation Training',
      content: 'Start with simple food puzzles and gradually increase complexity. This builds problem-solving skills and confidence. Use different puzzle types to prevent dogs from getting too comfortable with one style.',
      author: 'Cesar Millan',
      publishDate: '2024-01-08',
      credibilityScore: 0.83
    },
    {
      url: 'https://akc.org/expert-advice/training/trick-training',
      title: 'Advanced Trick Training Sessions',
      content: 'Teach complex tricks like "play dead," "spin," and "speak on command." Break tricks into small steps and use high-value rewards. Trick training strengthens the human-dog bond while providing mental stimulation.',
      author: 'American Kennel Club',
      publishDate: '2024-02-18',
      credibilityScore: 0.95
    },
    {
      url: 'https://preventivevet.com/dogs/dog-massage-benefits',
      title: 'Therapeutic Massage for Dogs',
      content: 'Learn basic massage techniques to help your dog relax and bond with you. Focus on gentle circular motions on shoulders, back, and legs. This activity promotes relaxation and can help anxious or high-energy dogs decompress.',
      author: 'Preventive Vet',
      publishDate: '2024-01-16',
      credibilityScore: 0.91
    }
  ];

  static async discoverContent(maxArticles: number = 10): Promise<ScrapedContent[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(`Discovering ${maxArticles} new activities...`);
    
    // Get a random selection of activities, ensuring variety
    const shuffled = this.shuffleArray([...this.mockActivities]);
    const selected = shuffled.slice(0, Math.min(maxArticles, this.mockActivities.length));
    
    console.log(`Selected ${selected.length} activities from content sources`);
    
    return selected.map(activity => ({
      url: activity.url,
      title: activity.title,
      content: activity.content,
      author: activity.author,
      publishDate: activity.publishDate,
      credibilityScore: activity.credibilityScore
    }));
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static async getAvailableSourceCount(): Promise<number> {
    return this.mockActivities.length;
  }
}
