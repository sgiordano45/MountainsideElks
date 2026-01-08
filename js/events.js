// Events Management Module
// Handles fetching and displaying events from Firebase

const EventsManager = {
  
  // Fetch upcoming events (not past, sorted by date)
  async getUpcomingEvents(limit = 10) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const snapshot = await db.collection('events')
        .where('date', '>=', today)
        .orderBy('date', 'asc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  // Fetch recurring events (events marked as recurring)
  async getRecurringEvents() {
    try {
      const snapshot = await db.collection('recurring-events')
        .orderBy('sortOrder', 'asc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching recurring events:', error);
      return [];
    }
  },

  // Fetch all events (for admin)
  async getAllEvents() {
    try {
      const snapshot = await db.collection('events')
        .orderBy('date', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching all events:', error);
      return [];
    }
  },

  // Add new event
  async addEvent(eventData) {
    try {
      const docRef = await db.collection('events').add({
        ...eventData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding event:', error);
      return { success: false, error: error.message };
    }
  },

  // Update event
  async updateEvent(eventId, eventData) {
    try {
      await db.collection('events').doc(eventId).update({
        ...eventData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete event
  async deleteEvent(eventId) {
    try {
      await db.collection('events').doc(eventId).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }
  },

  // Render event card HTML (for homepage)
  renderEventCard(event) {
    const imageUrl = event.image ? `images/${event.image}` : '';
    const fallbackStyle = "this.parentElement.style.background='linear-gradient(135deg, #1a365d 0%, #2c5282 100%)'";
    
    return `
      <article class="card">
        <div class="card__image">
          ${imageUrl 
            ? `<img src="${imageUrl}" alt="${event.title}" onerror="${fallbackStyle}">`
            : `<div style="width:100%;height:100%;background:linear-gradient(135deg, #1a365d 0%, #2c5282 100%);display:flex;align-items:center;justify-content:center;">
                <span style="font-size:3rem;">${event.emoji || '📅'}</span>
               </div>`
          }
        </div>
        <div class="card__body">
          <span class="card__tag">${event.tag || 'Event'}</span>
          <h3 class="card__title">${event.title}</h3>
          <p class="card__text">${event.description}</p>
          <p class="card__meta">${formatDateShort(event.date)}${event.time ? ' • ' + event.time : ''}</p>
        </div>
      </article>
    `;
  },

  // Render recurring event HTML (for events page)
  renderRecurringEvent(event) {
    // Determine access level and styling
    let tagClass, tagText;
    
    if (event.accessLevel === 'open') {
      tagClass = 'recurring-event__tag--open';
      tagText = 'Open to All';
    } else if (event.accessLevel === 'members') {
      tagClass = 'recurring-event__tag--members-only';
      tagText = 'Members Only';
    } else if (event.accessLevel === 'guests') {
      tagClass = 'recurring-event__tag--members';
      tagText = 'Members & Guests';
    } else {
      // Fallback for old data using openToAll boolean
      tagClass = event.openToAll ? 'recurring-event__tag--open' : 'recurring-event__tag--members';
      tagText = event.openToAll ? 'Open to All' : 'Members & Guests';
    }
    
    return `
      <div class="recurring-event">
        <div class="recurring-event__icon">${event.emoji || '📅'}</div>
        <div class="recurring-event__content">
          <h3 class="recurring-event__title">${event.title}</h3>
          <p class="recurring-event__schedule">${event.schedule}</p>
          <p class="recurring-event__desc">${event.description}</p>
          <span class="recurring-event__tag ${tagClass}">${tagText}</span>
        </div>
      </div>
    `;
  },

  // Render special event card (for events page)
  renderSpecialEventCard(event) {
    return `
      <article class="card">
        <div class="card__image" style="background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%); display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 4rem;">${event.emoji || '📅'}</span>
        </div>
        <div class="card__body">
          <span class="card__tag">${event.tag || 'Event'}</span>
          <h3 class="card__title">${event.title}</h3>
          <p class="card__text">${event.description}</p>
          <p class="card__meta">${formatDateShort(event.date)}${event.time ? ' • ' + event.time : ''}</p>
        </div>
      </article>
    `;
  },

  // Load and display events on homepage
  async loadHomepageEvents(containerId, limit = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<p class="text-center">Loading events...</p>';

    const events = await this.getUpcomingEvents(limit);
    
    if (events.length === 0) {
      container.innerHTML = '<p class="text-center" style="color: var(--gray-500);">No upcoming events. Check back soon!</p>';
      return;
    }

    container.innerHTML = events.map(event => this.renderEventCard(event)).join('');
  },

  // Load and display events on events page
  async loadEventsPage(recurringContainerId, upcomingContainerId) {
    // Load recurring events
    const recurringContainer = document.getElementById(recurringContainerId);
    if (recurringContainer) {
      const recurringEvents = await this.getRecurringEvents();
      if (recurringEvents.length > 0) {
        recurringContainer.innerHTML = recurringEvents.map(event => this.renderRecurringEvent(event)).join('');
      }
    }

    // Load upcoming special events
    const upcomingContainer = document.getElementById(upcomingContainerId);
    if (upcomingContainer) {
      upcomingContainer.innerHTML = '<p class="text-center">Loading events...</p>';
      
      const events = await this.getUpcomingEvents(6);
      
      if (events.length === 0) {
        upcomingContainer.innerHTML = '<p class="text-center" style="color: var(--gray-500);">No upcoming special events scheduled. Check back soon!</p>';
        return;
      }

      upcomingContainer.innerHTML = events.map(event => this.renderSpecialEventCard(event)).join('');
    }
  }
};
